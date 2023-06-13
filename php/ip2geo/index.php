<?php
/**
 * index.php - Uses client IP address to obtain client location, responds with a JSON object
 *
 * @version     1.1.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2017 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

header('Content-Type: application/json');

if(!file_exists('config.php')) {
	echo json_encode(['error' => 'Config file not found']);
	exit;
}
require('config.php');
$db = 'GeoLite2-City.mmdb'; // download updated database from http://dev.maxmind.com/geoip/geoip2/geolite2/
$db_file_exists = file_exists($db);
// If database doesn't exist, attempt to download and extract it
if(!$db_file_exists || ($db_file_exists && (time() - filemtime($db) > $config['max_db_age'] * 86400))) {
	file_put_contents('GeoLite2-City.tar.gz', fopen('https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=' . $config['maxmind_license_key'] . '&suffix=tar.gz', 'r'));
	// Decompress gz
	$p = new PharData('GeoLite2-City.tar.gz');
	$p -> decompress();
	unlink('GeoLite2-City.tar.gz');

	// Unarchive tar
	$p = new PharData('GeoLite2-City.tar');
	$p -> extractTo(__DIR__);
	unlink('GeoLite2-City.tar');

	// Move file, and delete directory
	$dir = glob('GeoLite2-City_*', GLOB_ONLYDIR)[0];
	rename($dir . '/' . $db, $db);
	foreach(glob($dir . '/*') as $file) {
		unlink($file);
	}
	rmdir($dir);
}

if(!file_exists($db)) {
	echo json_encode(['error' => 'Database file not found']);
	exit;
}

// Get IP address from HTTP request
$ip = $_SERVER['REMOTE_ADDR'];
if(array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)) $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
if(array_key_exists('HTTP_CLIENT_IP', $_SERVER)) $ip = $_SERVER['HTTP_CLIENT_IP'];
// Sanitize IP address
$ip = filter_var($ip, FILTER_VALIDATE_IP);

if(!$ip) {
	echo json_encode(['error' => 'Invalid IP address']);
	exit;
}

require_once 'Reader.php';
require_once 'Decoder.php';
require_once 'InvalidDatabaseException.php';
require_once 'Metadata.php';
require_once 'Util.php';

$reader = new Reader($db);
$geo = $reader -> get($ip);
$reader -> close();
$geo = [
	'city' => $geo['city']['names']['en'],
	'subdivision' => $geo['subdivisions'][0]['names']['en'],
	'country' => $geo['country']['iso_code'],
	'continent' => $geo['continent']['code'],
	'time_zone' => $geo['location']['time_zone'],
	'lat' => $geo['location']['latitude'],
	'lon' => $geo['location']['longitude'],
	'radius' => $geo['location']['accuracy_radius'], // in km
	'ip' => $ip
];
echo json_encode($geo);

exit;
/*

References

> Country Codes: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
> Continent Codes:
	AF - Africa
	AS - Asia
	EU - Europe
	NA - North America
	SA - South America
	OC - Oceania
	AN - Antarctica
> Time Zones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

*/
