// export { };
const path = require('path');
// const bootstrap = require('./bootstrap');
const product = require('../product.json');
const { app } = require('electron');
const { getUserDataPath } = require('./client/platform/environment/node/userDataPath');

// set to use node in render proccess
// app.allowRendererProcessReuse = false;

// Enable ASAR support
// bootstrap.enableASARSupport(undefined, false);

// Set userData path before app 'ready' event
const args = parseCLIArgs();
const userDataPath = getUserDataPath(args);

// Resolve code cache path
const codeCachePath = getCodeCachePath();

// if (portable && portable.isPortable) {
// 	app.setAppLogsPath(path.join(userDataPath, 'logs'));
// }

// Global app listeners
registerListeners();

// Todo: locale 语言配置

// gpu关闭
app.disableHardwareAcceleration()

// Load our code once ready
app.once('ready', function () {
	onReady();
});

/**
 * Main startup routine
 *
 * @param {string | undefined} codeCachePath
 * @param {NLSConfiguration} nlsConfig
 */
function startup(codeCachePath) {
	process.env['CLIENT_ROOT_PATH'] = __dirname;
	process.env['CLIENT_CODE_CACHE_PATH'] = codeCachePath || '';

	// Load main in AMD
	require('./client/entry/electron_main/main')
	// require('./bootstrap_amd').load('./client/entry/electron_main/main', () => {
	// 	perf.mark('code/didLoadMainBundle');
	// });
}

async function onReady() {
	try {
		startup(codeCachePath);
	} catch (error) {
		console.error(error);
	}
}

/**
 * @returns {NativeParsedArgs}
 */
function parseCLIArgs() {
	const minimist = require('minimist');

	return minimist(process.argv, {
		string: [
			'user-data-dir',
			'locale',
			'js-flags',
			'max-memory',
			'crash-reporter-directory'
		]
	});
}

function registerListeners() {
	/**
	 * macOS: when someone drops a file to the not-yet running VSCode, the open-file event fires even before
	 * the app-ready event. We listen very early for open-file and remember this upon startup as path to open.
	 *
	 * @type {string[]}
	 */
	const macOpenFiles = [];
	global['macOpenFiles'] = macOpenFiles;
	app.on('open-file', function (event, path) {
		macOpenFiles.push(path);
	});

	/**
	 * macOS: react to open-url requests.
	 *
	 * @type {string[]}
	 */
	const openUrls = [];
	const onOpenUrl =
		/**
		 * @param {{ preventDefault: () => void; }} event
		 * @param {string} url
		 */
		function (event, url) {
			event.preventDefault();

			openUrls.push(url);
		};

	app.on('will-finish-launching', function () {
		app.on('open-url', onOpenUrl);
	});

	global['getOpenUrls'] = function () {
		app.removeListener('open-url', onOpenUrl);

		return openUrls;
	};
}

/**
 * @param {string} dir
 * @returns {Promise<string>}
 */
function mkdirp(dir) {
	const fs = require('fs');

	return new Promise((resolve, reject) => {
		fs.mkdir(dir, { recursive: true }, err => (err && err.code !== 'EEXIST') ? reject(err) : resolve(dir));
	});
}

/**
 * @param {string | undefined} dir
 * @returns {Promise<string | undefined>}
 */
async function mkdirpIgnoreError(dir) {
	if (typeof dir === 'string') {
		try {
			await mkdirp(dir);

			return dir;
		} catch (error) {
			// ignore
		}
	}

	return undefined;
}

/**
 * @returns {string | undefined} the location to use for the code cache
 * or `undefined` if disabled.
 */
function getCodeCachePath() {

	// explicitly disabled via CLI args
	if (process.argv.indexOf('--no-cached-data') > 0) {
		return undefined;
	}

	// running out of sources
	if (process.env['CLIENT_DEV']) {
		return undefined;
	}

	// require commit id
	const commit = product.commit;
	if (!commit) {
		return undefined;
	}

	return path.join(userDataPath, 'CachedData', commit);
}
