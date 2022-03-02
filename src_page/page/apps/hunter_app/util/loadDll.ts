import { path } from 'src_page/page/utils/common'

var ffi = require('ffi-napi')
var libm = ffi.Library(path.join(process.cwd(), './public/v8_load.dll'), {
	'init': ['int', ['int']]
});
console.log('libm', libm.init(1))