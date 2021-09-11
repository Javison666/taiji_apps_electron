/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// import './sharedProcessMain.js';

window.PageLoaded = true

const { main } = require('./sharedProcessMain.js')
main()
//@ts-check
// (function () {
// 	'use strict';

// 	const bootstrapWindow = bootstrapWindowLib();

// 	// Avoid Monkey Patches from Application Insights
// 	// bootstrap.avoidMonkeyPatchFromAppInsights();

// 	// Load shared process into window
// 	bootstrapWindow.load(['client/entry/electron_browser/sharedProcess/sharedProcessMain'], function (sharedProcess, configuration) {
// 		return sharedProcess.main(configuration);
// 	},
// 		{
// 			configureDeveloperSettings: function () {
// 				return {
// 					disallowReloadKeybinding: true
// 				};
// 			}
// 		}
// 	);

// 	// /**
// 	//  * @typedef {import('../../../base/parts/sandbox/common/sandboxTypes').ISandboxConfiguration} ISandboxConfiguration
// 	//  *
// 	//  * @returns {{
// 	//  *   load: (
// 	//  *     modules: string[],
// 	//  *     resultCallback: (result, configuration: ISandboxConfiguration) => unknown,
// 	//  *     options?: {
// 	//  *       configureDeveloperSettings?: (config: ISandboxConfiguration) => {
// 	//  * 			forceEnableDeveloperKeybindings?: boolean,
// 	//  * 			disallowReloadKeybinding?: boolean,
// 	//  * 			removeDeveloperKeybindingsAfterLoad?: boolean
// 	//  * 		 }
// 	//  *     }
// 	//  *   ) => Promise<unknown>
// 	//  * }}
// 	//  */
// 	function bootstrapWindowLib() {
// 		// @ts-ignore (defined in bootstrap-window.js)
// 		return window.ClientBootstrapWindow;
// 	}
// }());
