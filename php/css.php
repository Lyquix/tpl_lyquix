<?php 
/**
 * css.inc.php - Includes CSS files
 *
 * @version     2.0.0
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

// Array to store all stylesheets to be loaded
$stylesheets = array();

// Parse enqueued scripts
foreach($doc->_styleSheets as $stylesheet_url => $stylesheet_meta) {
	// Check if stylesheet is local or remote
	if(parse_url($stylesheet_url, PHP_URL_SCHEME)) {
		// Absolute URL
		$stylesheets[] = array('url' => $stylesheet_url);
	}
	elseif (parse_url($stylesheet_url, PHP_URL_PATH)) {
		// Relative URL
		// Add leading / if missing
		if(substr($stylesheet_url,0,1) != '/') $stylesheet_url = '/' . $stylesheet_url;
		// Check if file exist
		if(file_exists(JPATH_BASE . $stylesheet_url)) {
			$stylesheets[] = array(
				'url' => $stylesheet_url,
				'version' => date("YmdHis", filemtime(JPATH_BASE . $stylesheet_url))
			);
		}
	}
}

// Parse enqueued style declarations
foreach($doc->_style as $stylesheet_type => $stylesheet_data) {
	$stylesheets[] = array('data' => $stylesheet_data);
}

// Empty stylesheets and stylesheet declarations
$doc->_styleSheets = array();
$doc->_style = array();

// Additional CSS Libraries
$add_css_libraries = explode("\n", trim($this->params->get('add_css_libraries', '')));
foreach($add_css_libraries as $cssurl) {
	$cssurl = trim($cssurl);
	if($cssurl) {
		// Check if stylesheet is local or remote
		if(parse_url($cssurl, PHP_URL_SCHEME)) {
			// Absolute URL
			$stylesheets[] = array('url' => $cssurl);
		}
		elseif (parse_url($cssurl, PHP_URL_PATH)) {
			// Relative URL
			// Add leading / if missing
			if(substr($cssurl,0,1) != '/') $cssurl = '/' . $cssurl;
			// Check if file exist
			if(file_exists(JPATH_BASE . $cssurl)) {
				$stylesheets[] = array('url' => $cssurl, 'version' => date("YmdHis", filemtime(JPATH_BASE . $cssurl)));
			}
		}
	}
}

// Custom Project Styles
if(file_exists($tmpl_path . '/css/styles.css')) {
	$stylesheets[] = array(
		'url' => $tmpl_url . '/css/styles.css', 
		'version' => date("YmdHis", filemtime($tmpl_path . '/css/styles.css'))
	);
}

// Unique filename based on stylesheets, last update, and order
$stylesheet_filename = md5(json_encode($stylesheets)) . '.css';

// Function to convert relative URLs into absolute provided a base URL
function rel2absURL($rel, $base) {
	// Parse base URL  and convert to local variables: $scheme, $host,  $path
	$base_parts = parse_url($base);

	// Return protocol-neutral URLs
	if(strpos($rel, "//") === 0) {
		return $base_parts['scheme'] . ':' . $rel;
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

// Check if file has already been created
if(!file_exists($tmpl_path . '/css/' . $stylesheet_filename)) {
	// Regular expression to find url in files
	$regex = '/url\(\s*[\"\\\']?([^\"\\\'\)]+)[\"\\\']?\s*\)/';

	// Prepare file
	$stylesheet_data = "/* " . $stylesheet_filename . " */\n";
	foreach($stylesheets as $idx => $stylesheet) {
		if(array_key_exists('data', $stylesheet)) {
			$stylesheet_data .= "/* Custom stylesheet declaration */\n";
			$stylesheet_data .= $stylesheet['data'] . "\n";
		}
		elseif (array_key_exists('version', $stylesheet)) {
			$stylesheet_data .= "/* Local stylesheet: " . $stylesheet['url'] . ", Version: " . $stylesheet['version'] . " */\n";
			$tmp = file_get_contents(JPATH_BASE . $stylesheet['url']) . "\n";
			preg_match_all($regex, $tmp, $matches);
			foreach($matches[1] as $rel) {
				$abs = rel2absURL($rel, $stylesheet['url']);
				$tmp = str_replace($rel, $abs, $tmp);
			}
			$stylesheet_data .= $tmp;
		}
		else {
			$stylesheet_data .= "/* Remote stylesheet: " . $stylesheet['url'] . " */\n";
			$tmp = file_get_contents($stylesheet['url']) . "\n";
			preg_match_all($regex, $tmp, $matches);
			foreach($matches[1] as $rel) {
				$abs = rel2absURL($rel, $stylesheet['url']);
				$tmp = str_replace($rel, $abs, $tmp);
			}
			$stylesheet_data .= $tmp;
		} 
	}
	// Save file
	file_put_contents($tmpl_path . '/css/' . $stylesheet_filename, $stylesheet_data);
	unset($stylesheet_data);
}
?>
<link href="<?php echo $tmpl_url . '/css/' . $stylesheet_filename; ?>" rel="stylesheet" />
