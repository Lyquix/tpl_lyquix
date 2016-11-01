<?php
/*
 * Uses client IP address to obtain client location
 * Responds with a JSON object
 */
header('Content-Type: application/json');
$db = 'GeoLite2-City.mmdb'; // download updated database from http://dev.maxmind.com/geoip/geoip2/geolite2/
require_once 'Reader.php';
require_once 'Decoder.php';
require_once 'InvalidDatabaseException.php';
require_once 'Metadata.php';
require_once 'Util.php';

use MaxMind\Db\Reader;

// Get IP address from HTTP request
$ip = $_SERVER['REMOTE_ADDR'];

// Sanitize IP address
$ip = filter_var($ip, FILTER_VALIDATE_IP);

if($ip) {
	$reader = new Reader($db);
	$geo = $reader->get($ip);
	$reader->close();
	$geo = Array(
		'city' => $geo['city']['names']['en'],
		'subdivision' => $geo['subdivisions'][0]['names']['en'],
		'country' => $geo['country']['iso_code'], 
		'continent' => $geo['continent']['code'],
		'time_zone' => $geo['location']['time_zone'],
		'lat' => $geo['location']['latitude'],
		'lon' => $geo['location']['longitude'],
		'radius' => $geo['location']['accuracy_radius'] // in km
	);
	echo json_encode($geo);
}
else {
	echo '{}';
}
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

