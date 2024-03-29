<?php
/**
 * css.php - Includes CSS files
 *
 * @version     2.4.1
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

$merge_css = $this -> params -> get('merge_css');
if(!is_array($this -> params -> get('merge_css'))) {
	$merge_css = [];
}

// Array to store all stylesheets to be loaded
$stylesheets = [];

// Parse enqueued styles
foreach($doc -> _styleSheets as $stylesheet_url => $stylesheet_meta) {
	// Check if stylesheet is local or remote
	if(parse_url($stylesheet_url, PHP_URL_SCHEME)) {
		// Absolute URL
		if(in_array('remote', $merge_css)) {
			$stylesheets[] = ['url' => $stylesheet_url];
			unset($doc -> _styleSheets[$stylesheet_url]);
		}
	}
	elseif (parse_url($stylesheet_url, PHP_URL_PATH)) {
		// Relative URL
		if(in_array('local', $merge_css)) {
			$url = $stylesheet_url;
			// Add leading / if missing
			if(substr($url,0,1) != '/') $url = '/' . $url;
			// Check if file exist
			if(file_exists(JPATH_BASE . $url)) {
				$stylesheets[] = [
					'url' => $url,
					'version' => date("YmdHis", filemtime(JPATH_BASE . $url))
				];
				unset($doc -> _styleSheets[$stylesheet_url]);
			}
		}
	}
}

// Parse enqueued style declarations
if(in_array('inline', $merge_css)) {
	foreach($doc -> _style as $stylesheet_type => $stylesheet_data) {
		$stylesheets[] = ['data' => $stylesheet_data];
	}
	$doc -> _style = [];
}

// Use non minified version?
$non_min_css = $this -> params -> get('non_min_css', 0);

// Animte.css
if($this -> params -> get('animatecss', 0)) {
	$stylesheets[] = ['url' => $cdnjs_url . 'animate.css/3.7.0/animate' . ($non_min_css ? '' : '.min') . '.css'];
}

// Additional CSS Libraries
$add_css_libraries = explode("\n", trim($this -> params -> get('add_css_libraries', '')));
foreach($add_css_libraries as $cssurl) {
	$cssurl = trim($cssurl);
	if($cssurl) {
		// Check if stylesheet is local or remote
		if(parse_url($cssurl, PHP_URL_SCHEME)) {
			// Absolute URL
			$stylesheets[] = ['url' => $cssurl];
		}
		elseif (parse_url($cssurl, PHP_URL_PATH)) {
			// Relative URL
			// Add leading / if missing
			if(substr($cssurl,0,1) != '/') $cssurl = '/' . $cssurl;
			// Check if file exist
			if(file_exists(JPATH_BASE . $cssurl)) {
				$stylesheets[] = ['url' => $cssurl, 'version' => date("YmdHis", filemtime(JPATH_BASE . $cssurl))];
			}
		}
	}
}

// Custom Project Styles
if(file_exists($tmpl_path . '/css/styles' . ($non_min_css ? '' : '.min') . '.css')) {
	$stylesheets[] = [
		'url' => $tmpl_url . '/css/styles' . ($non_min_css ? '' : '.min') . '.css',
		'version' => date("YmdHis", filemtime($tmpl_path . '/css/styles' . ($non_min_css ? '' : '.min') . '.css'))
	];
}

// Unique filename based on stylesheets, last update, and order
$stylesheet_filename = base_convert(md5(json_encode($stylesheets)), 16, 36) . '.css';

// Function to convert relative URLs into absolute provided a base URL
function rel2absURL($rel, $base) {
	// Parse base URL  and convert to local variables: $scheme, $host,  $path
	$base_parts = parse_url($base);

	// Return protocol-neutral URLs
	if(strpos($rel, "//") === 0) {
		return (array_key_exists('scheme', $base_parts) ? $base_parts['scheme'] . ':' . $rel : $rel);
	}

	// Return if already absolute URL
	if(parse_url($rel, PHP_URL_SCHEME) != '') {
		return $rel;
	}

	// queries and anchors
	if($rel[0] == '#' || $rel[0] == '?') {
		return $base . $rel;
	}

	// remove non-directory element from path
	$base_parts['path'] = preg_replace( '#/[^/]*$#', '', $base_parts['path'] );

	// destroy path if relative url points to root
	if($rel[0] ==  '/') {
		$base_parts['path'] = '';
	}

	// dirty absolute URL
	$abs = $base_parts['host'] . $base_parts['path'] . "/" . $rel;

	// replace '//' or  '/./' or '/foo/../' with '/'
	$count = true;
	while($count) $abs = preg_replace("/(\/\.?\/)/", "/", $abs, $limit = -1, $count);
	$count = true;
	while($count) $abs = preg_replace("/\/(?!\.\.)[^\/]+\/\.\.\//", "/", $abs, $limit = -1, $count);

	// absolute URL is ready!
	return ($base_parts['scheme'] ? $base_parts['scheme'] . '://' : '') . $abs;
}

// Check if dist directory exists
if (!is_dir($tmpl_path . '/dist/')) {
	mkdir($tmpl_path . '/dist/');
}

// Check if file has already been created
if(!file_exists($tmpl_path . '/dist/' . $stylesheet_filename)) {
	// Regular expression to find url in files
	$urlRegex = '/url\(\s*[\"\\\']?([^\"\\\'\)]+)[\"\\\']?\s*\)/';
	// Regular expression to find @import rules in files
	$importRegex = '/(@import.*?["\'][^"\']+["\'].*?;)/';
	// Prepare file
	$stylesheet_data = "/* " . $stylesheet_filename . " */\n";
	$stylesheet_imports = "/* @import rules moved to the top of the document */\n";
	foreach($stylesheets as $idx => $stylesheet) {
		if(array_key_exists('data', $stylesheet)) {
			$stylesheet_data .= "/* Custom stylesheet declaration */\n";
			$tmp = $stylesheet['data'];
			// Move @import rules
			preg_match_all($importRegex, $tmp, $matches);
			foreach($matches[1] as $imp) {
				$stylesheet_imports .= $imp . "\n";
				$tmp = str_replace($imp, "\n/*@import rule moved to the top of the file*/\n", $tmp);
			}
			$stylesheet_data .= $tmp . "\n";
		}
		elseif (array_key_exists('version', $stylesheet)) {
			$stylesheet_data .= "/* Local stylesheet: " . $stylesheet['url'] . ", Version: " . $stylesheet['version'] . " */\n";
			$tmp = file_get_contents(JPATH_BASE . $stylesheet['url']) . "\n";
			// Update URLs
			preg_match_all($urlRegex, $tmp, $matches);
			foreach($matches[1] as $rel) {
				$abs = rel2absURL($rel, $stylesheet['url']);
				$tmp = str_replace($rel, $abs, $tmp);
			}
			// Move @import rules
			preg_match_all($importRegex, $tmp, $matches);
			foreach($matches[1] as $imp) {
				$stylesheet_imports .= $imp . "\n";
				$tmp = str_replace($imp, "\n/*@import rule moved to the top of the file*/\n", $tmp);
			}
			$stylesheet_data .= $tmp . "\n";
		}
		else {
			$stylesheet_data .= "/* Remote stylesheet: " . $stylesheet['url'] . " */\n";
			$curl = curl_init();
			curl_setopt($curl, CURLOPT_URL, $stylesheet['url']);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
			$tmp .= curl_exec($curl) . "\n";
			curl_close($curl);
			// Update URLs
			preg_match_all($urlRegex, $tmp, $matches);
			foreach($matches[1] as $rel) {
				$abs = rel2absURL($rel, $stylesheet['url']);
				$tmp = str_replace($rel, $abs, $tmp);
			}
			// Move @import rules
			preg_match_all($importRegex, $tmp, $matches);
			foreach($matches[1] as $imp) {
				$stylesheet_imports .= $imp . "\n";
				$tmp = str_replace($imp, "\n/*@import rule moved to the top of the file*/\n", $tmp);
			}
			$stylesheet_data .= $tmp . "\n";
		}
	}
	// Save file
	file_put_contents($tmpl_path . '/dist/' . $stylesheet_filename, $stylesheet_imports . "\n" . $stylesheet_data);
	unset($stylesheet_imports, $stylesheet_data);
}
?>
<link href="<?php echo $tmpl_url . '/dist/' . $stylesheet_filename; ?>" rel="stylesheet" />
