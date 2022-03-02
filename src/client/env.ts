export const OutClientDir = 'out_client'

export const AppPackageName = 'client-tool'

export enum EnvType {
	dev = 'dev',
	prod = 'prod',
	pre = 'pre',
	qa = 'qa'
}

let curEnv = EnvType.prod
if (process.argv.find(i => i.includes('env-pre'))) {
	curEnv = EnvType.pre
}
if (process.argv.find(i => i.includes('env-qa'))) {
	curEnv = EnvType.qa
}
if (process.argv.find(i => i.includes('env-dev'))) {
	curEnv = EnvType.dev
}

console.log('cur env is', curEnv)

process.env['_client_cur_env'] = curEnv

export const env = curEnv
