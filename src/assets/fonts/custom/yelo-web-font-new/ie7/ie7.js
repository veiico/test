/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'yelo-web-font-new\'">' + entity + '</span>' + html;
	}
	var icons = {
		'yfn-controls-1': '&#xe90d;',
		'yfn-clock': '&#xe90c;',
		'yfn-left-arrow': '&#xe90b;',
		'yfn-reward_icon': '&#xe90a;',
		'yfn-locationNew': '&#xe908;',
		'yfn-phoneNew': '&#xe909;',
		'yfn-group_4': '&#xe905;',
		'yfn-group_5': '&#xe906;',
		'yfn-group_copy': '&#xe907;',
		'yfn-addMoney': '&#xe900;',
		'yfn-addWallet': '&#xe901;',
		'yfn-failedTran': '&#xe902;',
		'yfn-receiveMoney': '&#xe903;',
		'yfn-sendWallet': '&#xe904;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/yfn-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
