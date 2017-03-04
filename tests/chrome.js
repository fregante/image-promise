// Configuration to run tests locally against chrome
define(function(require) {
	'use strict';

	var config = require('./intern');

	// https://theintern.github.io/intern/#option-tunnel
	config.tunnel = 'SeleniumTunnel';
	config.tunnelOptions = {
		drivers: ['chrome'],
	};

	// https://theintern.github.io/intern/#option-environments
	config.environments = [
		{ browserName: 'chrome' },
	];

	config.reporters = [
		{
			id: 'Pretty'
		},
		{
			id: 'LcovHtml',
			directory: './coverage'
		}
	];

	return config;
});
