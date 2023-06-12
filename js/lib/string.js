/**
 * string.js - Added functionality to the String prototype
 *
 * @version     2.4.0
 * @package     wp_theme_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/wp_theme_lyquix
 */

if(lqx && !('string' in lqx)) {
	lqx.string = (function(){
		/**
		 * Adds new functionality to the String prototype.
		 * Inspired by https://github.com/panzerdp/voca
		 */
		var opts = {
			funcs: [
				'capitalize',
				'isCreditCard',
				'isEmail',
				'isSSN',
				'isURL',
				'isUsPhone',
				'isZipCode',
				'latinize',
				'slugify',
				'toCamelCase',
				'toKebabCase',
				'toSnakeCase',
				'toTitleCase',
				'words'
			],
		};

		var vars = {};

		var init = function() {
			// Copy default opts and vars
			jQuery.extend(true, lqx.opts.string, opts);
			opts = lqx.opts.string;
			jQuery.extend(true, lqx.vars.string, vars);
			vars = lqx.vars.string;

			// Initialize on lqxready
			lqx.vars.window.on('lqxready', function() {
				// Initialize only if enabled
				if(opts.enabled) {
					lqx.log('Initializing `string`');

					// Add functions to prototype
					var added = [];
					opts.funcs.forEach(function(func){
						if(!(func in String.prototype)) {
							String.prototype[func] = f[func];
							added.push(func);
						}
					});
					lqx.log('Added new functions to String prototype', added);
				}
			});

			// Run only once
			lqx.string.init = function(){
				lqx.warn('lqx.string.init already executed');
			};

			return true;
		};

		// A regular expression string matching whitespace
		var REGEXP_WHITESPACE = '\\s\\uFEFF\\xA0';
		// A regular expression to match the General Punctuation Unicode block
		var REGEXP_GENERAL_PUNCTUATION_BLOCK = '\\u2000-\\u206F';
		// A regular expression string matching diacritical mark
		var REGEXP_DIACRITICAL_MARK = '\\u0300-\\u036F\\u1AB0-\\u1AFF\\u1DC0-\\u1DFF\\u20D0-\\u20FF\\uFE20-\\uFE2F';
		// A regular expression string matching high surrogate
		var REGEXP_HIGH_SURROGATE = '\\uD800-\\uDBFF';
		// A regular expression string matching low surrogate
		var REGEXP_LOW_SURROGATE = '\\uDC00-\\uDFFF';
		// A regular expression to match the base character for a combining mark
		var REGEXP_COMBINING_BASE = '\\0-\\u02FF\\u0370-\\u1AAF\\u1B00-\\u1DBF\\u1E00-\\u20CF\\u2100-\\uD7FF\\uE000-\\uFE1F\\uFE30-\\uFFFF';
		// Regular expression to match combining marks
		var REGEXP_COMBINING_MARKS = new RegExp('([' + REGEXP_COMBINING_BASE + ']|[' + REGEXP_HIGH_SURROGATE + '][' + REGEXP_LOW_SURROGATE + ']|[' + REGEXP_HIGH_SURROGATE + '](?![' + REGEXP_LOW_SURROGATE + '])|(?:[^' + REGEXP_HIGH_SURROGATE + ']|^)[' + REGEXP_LOW_SURROGATE + '])([' + REGEXP_DIACRITICAL_MARK + ']+)', 'g');
		// A regular expression to match non characters from from Basic Latin and Latin-1 Supplement Unicode blocks
		var REGEXP_NON_CHARACTER = '\\x00-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7b-\\xBF\\xD7\\xF7';
		// A regular expression to match the dingbat Unicode block
		var REGEXP_DINGABAT_BLOCK = '\\u2700-\\u27BF';
		// A regular expression string that matches lower case letters: LATIN
		var REGEXP_LOWERCASE_LETTER = 'a-z\\xB5\\xDF-\\xF6\\xF8-\\xFF\\u0101\\u0103\\u0105\\u0107\\u0109\\u010B\\u010D\\u010F\\u0111\\u0113\\u0115\\u0117\\u0119\\u011B\\u011D\\u011F\\u0121\\u0123\\u0125\\u0127\\u0129\\u012B\\u012D\\u012F\\u0131\\u0133\\u0135\\u0137\\u0138\\u013A\\u013C\\u013E\\u0140\\u0142\\u0144\\u0146\\u0148\\u0149\\u014B\\u014D\\u014F\\u0151\\u0153\\u0155\\u0157\\u0159\\u015B\\u015D\\u015F\\u0161\\u0163\\u0165\\u0167\\u0169\\u016B\\u016D\\u016F\\u0171\\u0173\\u0175\\u0177\\u017A\\u017C\\u017E-\\u0180\\u0183\\u0185\\u0188\\u018C\\u018D\\u0192\\u0195\\u0199-\\u019B\\u019E\\u01A1\\u01A3\\u01A5\\u01A8\\u01AA\\u01AB\\u01AD\\u01B0\\u01B4\\u01B6\\u01B9\\u01BA\\u01BD-\\u01BF\\u01C6\\u01C9\\u01CC\\u01CE\\u01D0\\u01D2\\u01D4\\u01D6\\u01D8\\u01DA\\u01DC\\u01DD\\u01DF\\u01E1\\u01E3\\u01E5\\u01E7\\u01E9\\u01EB\\u01ED\\u01EF\\u01F0\\u01F3\\u01F5\\u01F9\\u01FB\\u01FD\\u01FF\\u0201\\u0203\\u0205\\u0207\\u0209\\u020B\\u020D\\u020F\\u0211\\u0213\\u0215\\u0217\\u0219\\u021B\\u021D\\u021F\\u0221\\u0223\\u0225\\u0227\\u0229\\u022B\\u022D\\u022F\\u0231\\u0233-\\u0239\\u023C\\u023F\\u0240\\u0242\\u0247\\u0249\\u024B\\u024D\\u024F';
		// A regular expression string that matches upper case letters: LATIN
		var REGEXP_UPPERCASE_LETTER = '\\x41-\\x5a\\xc0-\\xd6\\xd8-\\xde\\u0100\\u0102\\u0104\\u0106\\u0108\\u010a\\u010c\\u010e\\u0110\\u0112\\u0114\\u0116\\u0118\\u011a\\u011c\\u011e\\u0120\\u0122\\u0124\\u0126\\u0128\\u012a\\u012c\\u012e\\u0130\\u0132\\u0134\\u0136\\u0139\\u013b\\u013d\\u013f\\u0141\\u0143\\u0145\\u0147\\u014a\\u014c\\u014e\\u0150\\u0152\\u0154\\u0156\\u0158\\u015a\\u015c\\u015e\\u0160\\u0162\\u0164\\u0166\\u0168\\u016a\\u016c\\u016e\\u0170\\u0172\\u0174\\u0176\\u0178\\u0179\\u017b\\u017d\\u0181\\u0182\\u0184\\u0186\\u0187\\u0189-\\u018b\\u018e-\\u0191\\u0193\\u0194\\u0196-\\u0198\\u019c\\u019d\\u019f\\u01a0\\u01a2\\u01a4\\u01a6\\u01a7\\u01a9\\u01ac\\u01ae\\u01af\\u01b1-\\u01b3\\u01b5\\u01b7\\u01b8\\u01bc\\u01c4\\u01c5\\u01c7\\u01c8\\u01ca\\u01cb\\u01cd\\u01cf\\u01d1\\u01d3\\u01d5\\u01d7\\u01d9\\u01db\\u01de\\u01e0\\u01e2\\u01e4\\u01e6\\u01e8\\u01ea\\u01ec\\u01ee\\u01f1\\u01f2\\u01f4\\u01f6-\\u01f8\\u01fa\\u01fc\\u01fe\\u0200\\u0202\\u0204\\u0206\\u0208\\u020a\\u020c\\u020e\\u0210\\u0212\\u0214\\u0216\\u0218\\u021a\\u021c\\u021e\\u0220\\u0222\\u0224\\u0226\\u0228\\u022a\\u022c\\u022e\\u0230\\u0232\\u023a\\u023b\\u023d\\u023e\\u0241\\u0243-\\u0246\\u0248\\u024a\\u024c\\u024e';
		// Regular expression to match Extended ASCII characters, i.e. the first 255
		var REGEXP_EXTENDED_ASCII = /^[\x01-\xFF]*$/;
		// Regular expression to match words from Basic Latin and Latin-1 Supplement blocks
		var REGEXP_LATIN_WORD = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
		// Regular expression to match not latin characters
		var REGEXP_NON_LATIN = /[^A-Za-z0-9]/g;
		// Regular expression to match Unicode words
		var REGEXP_WORD = new RegExp('(?:[' + REGEXP_UPPERCASE_LETTER + '][' + REGEXP_DIACRITICAL_MARK + ']*)?(?:[' + REGEXP_LOWERCASE_LETTER + '][' + REGEXP_DIACRITICAL_MARK + ']*)+|(?:[' + REGEXP_UPPERCASE_LETTER + '][' + REGEXP_DIACRITICAL_MARK + ']*)+(?![' + REGEXP_LOWERCASE_LETTER + '])|[\\d]+|[' + REGEXP_DINGABAT_BLOCK + ']|[^' + REGEXP_NON_CHARACTER + REGEXP_GENERAL_PUNCTUATION_BLOCK + REGEXP_WHITESPACE + ']+', 'g');
		// List of lating characters to diacritics
		var DIACRITICS = {
			"3": "\u039e\u03be",
			"8": "\u0398\u03b8",
			"A": "\x41\xc0\xc1\xc2\xc3\xc4\xc5\u0100\u0102\u0104\u01cd\u01de\u01e0\u01fa\u0200\u0202\u0226\u023a\u1e00\u1ea0\u1ea2\u1ea4\u1ea6\u1ea8\u1eaa\u1eac\u1eae\u1eb0\u1eb2\u1eb4\u1eb6\u24b6\u2c6f\uff21\u0386\u0391\u0410",
			"B": "\x42\u0181\u0182\u0243\u1e02\u1e04\u1e06\u24b7\uff22\u0392\u0411",
			"C": "\x43\xc7\u0106\u0108\u010a\u010c\u0187\u023b\u1e08\u24b8\ua73e\uff23\u0426",
			"D": "\x44\u010e\u0110\u0189\u018a\u018b\u1e0a\u1e0c\u1e0e\u1e10\u1e12\u24b9\ua779\uff24\xd0\u0394\u0414",
			"E": "\x45\xc8\xc9\xca\xcb\u0112\u0114\u0116\u0118\u011a\u018e\u0190\u0204\u0206\u0228\u1e14\u1e16\u1e18\u1e1a\u1e1c\u1eb8\u1eba\u1ebc\u1ebe\u1ec0\u1ec2\u1ec4\u1ec6\u24ba\uff25\u0388\u0395\u0415\u042d",
			"F": "\x46\u0191\u1e1e\u24bb\ua77b\uff26\u03a6\u0424",
			"G": "\x47\u011c\u011e\u0120\u0122\u0193\u01e4\u01e6\u01f4\u1e20\u24bc\ua77d\ua77e\ua7a0\uff27\u0393\u0413\u0490",
			"H": "\x48\u0124\u0126\u021e\u1e22\u1e24\u1e26\u1e28\u1e2a\u24bd\u2c67\u2c75\ua78d\uff28\u0389\u0397\u0425",
			"I": "\x49\xcc\xcd\xce\xcf\u0128\u012a\u012c\u012e\u0130\u0197\u01cf\u0208\u020a\u1e2c\u1e2e\u1ec8\u1eca\u24be\uff29\u038a\u0399\u03aa\u0406\u0418",
			"J": "\x4a\u0134\u0248\u24bf\uff2a\u0419",
			"K": "\x4b\u0136\u0198\u01e8\u1e30\u1e32\u1e34\u24c0\u2c69\ua740\ua742\ua744\ua7a2\uff2b\u039a\u041a",
			"L": "\x4c\u0139\u013b\u013d\u013f\u0141\u023d\u1e36\u1e38\u1e3a\u1e3c\u24c1\u2c60\u2c62\ua746\ua748\ua780\uff2c\u039b\u041b",
			"M": "\x4d\u019c\u1e3e\u1e40\u1e42\u24c2\u2c6e\uff2d\u039c\u041c",
			"N": "\x4e\xd1\u0143\u0145\u0147\u019d\u01f8\u0220\u1e44\u1e46\u1e48\u1e4a\u24c3\ua790\ua7a4\uff2e\u039d\u041d",
			"O": "\x4f\xd2\xd3\xd4\xd5\xd6\xd8\u014c\u014e\u0150\u0186\u019f\u01a0\u01d1\u01ea\u01ec\u01fe\u020c\u020e\u022a\u022c\u022e\u0230\u1e4c\u1e4e\u1e50\u1e52\u1ecc\u1ece\u1ed0\u1ed2\u1ed4\u1ed6\u1ed8\u1eda\u1edc\u1ede\u1ee0\u1ee2\u24c4\ua74a\ua74c\uff2f\u038c\u039f\u041e",
			"P": "\x50\u01a4\u1e54\u1e56\u24c5\u2c63\ua750\ua752\ua754\uff30\u03a0\u041f",
			"Q": "\x51\u024a\u24c6\ua756\ua758\uff31",
			"R": "\x52\u0154\u0156\u0158\u0210\u0212\u024c\u1e58\u1e5a\u1e5c\u1e5e\u24c7\u2c64\ua75a\ua782\ua7a6\uff32\u03a1\u0420",
			"S": "\x53\u015a\u015c\u015e\u0160\u0218\u1e60\u1e62\u1e64\u1e66\u1e68\u1e9e\u24c8\u2c7e\ua784\ua7a8\uff33\u03a3\u0421",
			"T": "\x54\u0162\u0164\u0166\u01ac\u01ae\u021a\u023e\u1e6a\u1e6c\u1e6e\u1e70\u24c9\ua786\uff34\u03a4\u0422",
			"U": "\x55\xd9\xda\xdb\xdc\u0168\u016a\u016c\u016e\u0170\u0172\u01af\u01d3\u01d5\u01d7\u01d9\u01db\u0214\u0216\u0244\u1e72\u1e74\u1e76\u1e78\u1e7a\u1ee4\u1ee6\u1ee8\u1eea\u1eec\u1eee\u1ef0\u24ca\uff35\u0423\u042a",
			"V": "\x56\u01b2\u0245\u1e7c\u1e7e\u24cb\ua75e\uff36\u0412",
			"W": "\x57\u0174\u1e80\u1e82\u1e84\u1e86\u1e88\u24cc\u2c72\uff37\u038f\u03a9",
			"X": "\x58\u1e8a\u1e8c\u24cd\uff38\u03a7",
			"Y": "\x59\xdd\u0176\u0178\u01b3\u0232\u024e\u1e8e\u1ef2\u1ef4\u1ef6\u1ef8\u1efe\u24ce\uff39\u038e\u03a5\u03ab\u042b",
			"Z": "\x5a\u0179\u017b\u017d\u01b5\u0224\u1e90\u1e92\u1e94\u24cf\u2c6b\u2c7f\ua762\uff3a\u0396\u0417",
			"a": "\x61\xe0\xe1\xe2\xe3\xe4\xe5\u0101\u0103\u0105\u01ce\u01df\u01e1\u01fb\u0201\u0203\u0227\u0250\u1e01\u1e9a\u1ea1\u1ea3\u1ea5\u1ea7\u1ea9\u1eab\u1ead\u1eaf\u1eb1\u1eb3\u1eb5\u1eb7\u24d0\u2c65\uff41\u03ac\u03b1\u0430",
			"b": "\x62\u0180\u0183\u0253\u1e03\u1e05\u1e07\u24d1\uff42\u03b2\u0431",
			"c": "\x63\xe7\u0107\u0109\u010b\u010d\u0188\u023c\u1e09\u2184\u24d2\ua73f\uff43\u0446",
			"d": "\x64\u010f\u0111\u018c\u0256\u0257\u1e0b\u1e0d\u1e0f\u1e11\u1e13\u24d3\ua77a\uff44\xf0\u03b4\u0434",
			"e": "\x65\xe8\xe9\xea\xeb\u0113\u0115\u0117\u0119\u011b\u01dd\u0205\u0207\u0229\u0247\u025b\u1e15\u1e17\u1e19\u1e1b\u1e1d\u1eb9\u1ebb\u1ebd\u1ebf\u1ec1\u1ec3\u1ec5\u1ec7\u24d4\uff45\u03ad\u03b5\u0435\u044d",
			"f": "\x66\u0192\u1e1f\u24d5\ua77c\uff46\u03c6\u0444",
			"g": "\x67\u011d\u011f\u0121\u0123\u01e5\u01e7\u01f5\u0260\u1d79\u1e21\u24d6\ua77f\ua7a1\uff47\u03b3\u0433\u0491",
			"h": "\x68\u0125\u0127\u021f\u0265\u1e23\u1e25\u1e27\u1e29\u1e2b\u1e96\u24d7\u2c68\u2c76\uff48\u03ae\u03b7\u0445",
			"i": "\x69\xec\xed\xee\xef\u0129\u012b\u012d\u012f\u0131\u01d0\u0209\u020b\u0268\u1e2d\u1e2f\u1ec9\u1ecb\u24d8\uff49\u0390\u03af\u03b9\u03ca\u0438\u0456",
			"j": "\x6a\u0135\u01f0\u0249\u24d9\uff4a\u0439",
			"k": "\x6b\u0137\u0199\u01e9\u1e31\u1e33\u1e35\u24da\u2c6a\ua741\ua743\ua745\ua7a3\uff4b\u03ba\u043a",
			"l": "\x6c\u013a\u013c\u013e\u0140\u0142\u017f\u019a\u026b\u1e37\u1e39\u1e3b\u1e3d\u24db\u2c61\ua747\ua749\ua781\uff4c\u03bb\u043b",
			"m": "\x6d\u026f\u0271\u1e3f\u1e41\u1e43\u24dc\uff4d\u03bc\u043c",
			"n": "\x6e\xf1\u0144\u0146\u0148\u0149\u019e\u01f9\u0272\u1e45\u1e47\u1e49\u1e4b\u24dd\ua791\ua7a5\uff4e\u03bd\u043d",
			"o": "\x6f\xf2\xf3\xf4\xf5\xf6\xf8\u014d\u014f\u0151\u01a1\u01d2\u01eb\u01ed\u01ff\u020d\u020f\u022b\u022d\u022f\u0231\u0254\u0275\u1e4d\u1e4f\u1e51\u1e53\u1ecd\u1ecf\u1ed1\u1ed3\u1ed5\u1ed7\u1ed9\u1edb\u1edd\u1edf\u1ee1\u1ee3\u24de\ua74b\ua74d\uff4f\u03bf\u03cc\u043e",
			"p": "\x70\u01a5\u1d7d\u1e55\u1e57\u24df\ua751\ua753\ua755\uff50\u03c0\u043f",
			"q": "\x71\u024b\u24e0\ua757\ua759\uff51",
			"r": "\x72\u0155\u0157\u0159\u0211\u0213\u024d\u027d\u1e59\u1e5b\u1e5d\u1e5f\u24e1\ua75b\ua783\ua7a7\uff52\u03c1\u0440",
			"s": "\x73\xdf\u015b\u015d\u015f\u0161\u0219\u023f\u1e61\u1e63\u1e65\u1e67\u1e69\u1e9b\u24e2\ua785\ua7a9\uff53\u03c2\u03c3\u0441",
			"t": "\x74\u0163\u0165\u0167\u01ad\u021b\u0288\u1e6b\u1e6d\u1e6f\u1e71\u1e97\u24e3\u2c66\ua787\uff54\u03c4\u0442",
			"u": "\x75\xf9\xfa\xfb\xfc\u0169\u016b\u016d\u016f\u0171\u0173\u01b0\u01d4\u01d6\u01d8\u01da\u01dc\u0215\u0217\u0289\u1e73\u1e75\u1e77\u1e79\u1e7b\u1ee5\u1ee7\u1ee9\u1eeb\u1eed\u1eef\u1ef1\u24e4\uff55\u0443\u044a",
			"v": "\x76\u028b\u028c\u1e7d\u1e7f\u24e5\ua75f\uff56\u0432",
			"w": "\x77\u0175\u1e81\u1e83\u1e85\u1e87\u1e89\u1e98\u24e6\u2c73\uff57\u03c9\u03ce",
			"x": "\x78\u1e8b\u1e8d\u24e7\uff58\u03c7",
			"y": "\x79\xfd\xff\u0177\u01b4\u0233\u024f\u1e8f\u1e99\u1ef3\u1ef5\u1ef7\u1ef9\u1eff\u24e8\uff59\u03b0\u03c5\u03cb\u03cd\u044b",
			"z": "\x7a\u017a\u017c\u017e\u01b6\u0225\u0240\u1e91\u1e93\u1e95\u24e9\u2c6c\ua763\uff5a\u03b6\u0437",
			"OE": "\x8c\u0152",
			"oe": "\x9c\u0153",
			"AE": "\xc6\u01e2\u01fc",
			"ae": "\xe6\u01e3\u01fd",
			"hv": "\u0195",
			"OI": "\u01a2",
			"oi": "\u01a3",
			"DZ": "\u01c4\u01f1",
			"Dz": "\u01c5\u01f2",
			"dz": "\u01c6\u01f3",
			"LJ": "\u01c7",
			"Lj": "\u01c8",
			"lj": "\u01c9",
			"NJ": "\u01ca",
			"Nj": "\u01cb",
			"nj": "\u01cc",
			"OU": "\u0222",
			"ou": "\u0223",
			"TZ": "\ua728",
			"tz": "\ua729",
			"AA": "\ua732",
			"aa": "\ua733",
			"AO": "\ua734",
			"ao": "\ua735",
			"AU": "\ua736",
			"au": "\ua737",
			"AV": "\ua738\ua73a",
			"av": "\ua739\ua73b",
			"AY": "\ua73c",
			"ay": "\ua73d",
			"OO": "\ua74e",
			"oo": "\ua74f",
			"VY": "\ua760",
			"vy": "\ua761",
			"TH": "\xde",
			"th": "\xfe",
			"PS": "\u03a8",
			"ps": "\u03c8",
			"Yo": "\u0401",
			"Ye": "\u0404",
			"Yi": "\u0407",
			"Zh": "\u0416",
			"Ch": "\u0427",
			"Sh": "\u0428\u0429",
			"": "\u042c\u044c",
			"Yu": "\u042e",
			"Ya": "\u042f",
			"zh": "\u0436",
			"ch": "\u0447",
			"sh": "\u0448\u0449",
			"yu": "\u044e",
			"ya": "\u044f",
			"yo": "\u0451",
			"ye": "\u0454",
			"yi": "\u0457"
		};
		// Create a map of diacritics to latin characters
		var DIACRITICS_MAP = (function(){
			var map = {};
			Object.keys(DIACRITICS).forEach(function(key) {
				var chars = DIACRITICS[key];
				for (var i = 0; i < chars.length; i++) {
					var char = chars[i];
					map[char] = key;
				}
			});
			return map;
		})();

		// The functions
		var f = {
			capitalize: function() {
				var str = this;

				if(str == '') {
					return '';
				}

				return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
			},

			latinize: function() {
				var str = this;

				if(str == '') {
					return '';
				}

				function removeCombiningMarks(char, cleanChar) {
					return cleanChar;
				}

				function getLatinCharacter(char) {
					var latinChar = DIACRITICS_MAP[char];
					return latinChar ? latinChar : char;
				}

				return str.replace(REGEXP_NON_LATIN, getLatinCharacter).replace(REGEXP_COMBINING_MARKS, removeCombiningMarks);
			},

			slugify: function() {
				var str = this;

				if(str == '') {
					return '';
				}

				str = str.latinize().replace(REGEXP_NON_LATIN, '-');

				return str.toKebabCase();
			},

			toCamelCase: function() {
				var str = this;

				if(str == '') {
					return '';
				}

				str = str.words();

				str.forEach(function(word, idx){
					str[idx] = idx == 0 ? word.toLowerCase() : word.capitalize();
				});

				return str.join('');
			},

			toKebabCase: function() {
				var str = this;

				if(str == '') {
					return '';
				}

				return str.words().join('-').toLowerCase();
			},

			toSnakeCase: function() {
				var str = this;

				if(str == '') {
					return '';
				}

				return str.words().join('_').toLowerCase();
			},

			toTitleCase: function() {
				var str = this;

				// Determine what regular expression to use
				var regex = REGEXP_EXTENDED_ASCII.test(str) ? REGEXP_LATIN_WORD : REGEXP_WORD;

				return str.replace(regex, function(word) {
					return word.capitalize();
				});
			},

			words: function() {
				var str = this;

				if(str == '') {
					return [];
				}

				// Determine what regular expression to use
				var regex = REGEXP_EXTENDED_ASCII.test(str) ? REGEXP_LATIN_WORD : REGEXP_WORD;

				return str.match(regex);
			}
		};

		var r = {
			isCreditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
			isEmail: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
			isUsPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
			isSSN: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
			isURL: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
			isZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
		};

		Object.keys(r).forEach(function(key){
			f[key] = function() {
				var str = this;

				return r[key].test(str);
			};
		});

		return {
			init: init
		};
	})();
	lqx.string.init();
}
