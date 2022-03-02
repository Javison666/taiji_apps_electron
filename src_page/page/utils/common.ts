// import * as path from 'path'

export const got = client.app.require('got')
export const md5 = client.app.require('md5')
export const cheerio = client.app.require('cheerio')
export const lowdb = client.app.require('lowdb')
export const path = client.app.require('path')
export const fs = client.app.require('fs')
export const fsExtra = client.app.require('fs-extra')
// export const puppeteer = client.app.require('puppeteer')

export const child_process = client.app.require('child_process')

export const getFileNameFromPath = (filePath: string) => {
	var pos1 = filePath.lastIndexOf('/');
	var pos2 = filePath.lastIndexOf('\\');
	var pos = Math.max(pos1, pos2);
	if (pos < 0) {
		return filePath;
	}
	else {
		return filePath.substring(pos + 1);
	}
}


export const sleep = (tsp: number) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(null)
		}, tsp)
	})
}