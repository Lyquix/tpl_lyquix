/**
 * controller.dist.js - Sample Vue controller
 *
 * @version     2.3.1
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

document.addEventListener('DOMContentLoaded', function(){
	if(document.querySelector('#my-controller')) {
		var myapp = new Vue({
			el: '#my-controller',
			data: {
				message: 'Hello World!'
			}
		});
	}
});
