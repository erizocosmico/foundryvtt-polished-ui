const settings = {
	displayLogo: 'display-logo',
	displayControls: 'display-controls',
	displayNavigation: 'display-navigation',
	displayHotbar: 'display-hotbar',
	displayCardsTab: 'display-cards-tab',
	accentColor: 'accent-color',
	customCss: 'custom-css',
	customLogo: 'custom-logo',
	customLogoWidth: 'custom-logo-width',
	customLogoHeight: 'custom-logo-height',
	smallerSidebar: 'smaller-sidebar',
};

Hooks.once('init', () => {
	register(settings.displayLogo, {
		name: lang('display_logo'),
		hint: lang('display_logo_hint'),
		scope: "world",
		restricted: true,
		config: true,
		type: Boolean,
		default: true
	});

	register(settings.customLogo, {
		name: lang('custom_logo'),
		hint: lang('custom_logo_hint'),
		scope: "world",
		restricted: true,
		config: true,
		type: String,
		default: '',
		filePicker: 'image',
	});

	register(settings.customLogoHeight, {
		name: lang('custom_logo_height'),
		scope: "world",
		restricted: true,
		config: true,
		type: Number,
		default: 50,
	});

	register(settings.customLogoWidth, {
		name: lang('custom_logo_width'),
		scope: "world",
		restricted: true,
		config: true,
		type: Number,
		default: 100,
	});

	register(settings.displayControls, {
		name: lang('display_controls'),
		hint: lang('display_controls_hint'),
		restricted: true,
		scope: "world",
		config: true,
		type: String,
		choices: {
			"yes": lang('display_controls_yes'),
			"hovered": lang('display_controls_hovered'),
			"no": lang('display_controls_no'),
		},
		default: "yes",
	});

	register(settings.displayNavigation, {
		name: lang('display_navigation'),
		hint: lang('display_navigation_hint'),
		restricted: true,
		scope: "world",
		config: true,
		type: Boolean,
		default: true
	});

	register(settings.displayHotbar, {
		name: lang('display_hotbar'),
		hint: lang('display_hotbar_hint'),
		restricted: true,
		scope: "world",
		config: true,
		type: Boolean,
		default: true
	});

	register(settings.displayCardsTab, {
		name: lang('display_cards'),
		hint: lang('display_cards_hint'),
		restricted: true,
		scope: "world",
		config: true,
		type: Boolean,
		default: true
	});

	registerColor(settings.accentColor, {
		name: lang('accent_color'),
		hint: lang('accent_color_hint'),
		restricted: true,
		label: lang('pick_color'),
		scope: "world",
		config: true,
		defaultColor: ""
	});

	register(settings.customCss, {
		name: lang('custom_css'),
		hint: lang('custom_css_hint'),
		restricted: true,
		scope: "world",
		config: true,
		type: String,
		default: '',
		filePicker: 'folder',
	});

	register(settings.smallerSidebar, {
		name: lang('smaller_sidebar'),
		hint: lang('smaller_sidebar_hint'),
		scope: "world",
		restricted: true,
		config: true,
		type: Boolean,
		default: false
	});

	applySettings();
});

Hooks.on('renderApplication', applySettings);
Hooks.on('updateSetting', applySettings);

function applySettings() {
	setupDisplay(settings.displayLogo, '#logo');
	setupDisplay(settings.displayHotbar, '#hotbar');
	setupDisplay(settings.displayNavigation, '#navigation');
	setupDisplay(settings.displayCardsTab, '#sidebar-tabs .item[data-tab="cards"]');

	const $controls = $('#controls');
	const $sidebar = $('#sidebar');
	const displayControls = get(settings.displayControls);
	if (displayControls === 'no') {
		$controls.addClass('hidden');
	} else {
		$controls.removeClass('hidden');
	}

	if (displayControls === 'hovered') {
		$controls.addClass('controls-hovered');
	} else {
		$controls.removeClass('controls-hovered');
	}

	const accent = get(settings.accentColor);
	if (accent) {
		document.documentElement.style.setProperty('--polished-ui-accent', accent);
	}

	const customCssFile = get(settings.customCss);
	if (customCssFile?.endsWith('.css')) {
		loadCssFile(customCssFile);
	}

	const logo = document.getElementById('logo');
	const customLogo = get(settings.customLogo);
	if (customLogo) {
		logo.src = customLogo;
	}

	const logoHeight = get(settings.customLogoHeight);
	if (logoHeight) {
		logo.height = logoHeight;
		logo.style.height = `${logoHeight}px`;
	}

	const logoWidth = get(settings.customLogoWidth);
	if (logoWidth) {
		logo.width = logoWidth;
		logo.style.width = `${logoWidth}px`;
	}

	if (get(settings.smallerSidebar)) {
		$sidebar.addClass('smaller-sidebar');
	} else {
		$sidebar.removeClass('smaller-sidebar');
	}
}

function loadCssFile(file) {
	let elem = document.getElementById('polished-ui-custom-css-file');
	if (!elem) {
		elem = document.createElement('link');
		elem.id = 'polished-ui-custom-css-file';
		document.head.appendChild(elem);
	}

	if (file) {
		elem.rel = 'stylesheet';
		elem.href = file;
	} else {
		document.head.removeChild(elem);
	}
}

function setupDisplay(setting, selector) {
	const $elem = $(selector);
	if (get(setting)) {
		$elem.removeClass('hidden');
	} else {
		$elem.addClass('hidden');
	}
}

function register(name, opts) {
	game.settings.register(modName, name, opts);
}

function registerColor(name, opts) {
	if (window.Ardittristan?.ColorSetting) {
		new window.Ardittristan.ColorSetting(modName, name, opts);
	}
}

function get(name) {
	try {
		return game.settings.get(modName, name);
	} catch {
		return null;
	}
}

const modName = 'polished-ui';

function lang(key) {
	return game.i18n.localize(`POLISHEDUI.${key}`);
}