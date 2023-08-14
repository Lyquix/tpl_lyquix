<?php
/**
 * body-bottom.php - Code loaded at the end of the <body> tag
 *
 * @version     2.4.1
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

 // Load GTM body code
if($this -> params -> get('gtm_account', '')) : ?>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo $this -> params -> get('gtm_account'); ?>" height="0" width="0" style="display:none; visibility:hidden"></iframe></noscript>
<?php endif;

// Load code to remove srcset
if($this -> params -> get('remove_srcset', 0)): ?>
<script>jQuery('[srcset]').attr('srcset', '')</script>
<?php endif;