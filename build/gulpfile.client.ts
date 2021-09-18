'use strict';

import * as path from 'path';
import * as fs from 'fs'
const bytenode = require('bytenode')
const gulp = require('gulp');
const task = require('./lib/task');
const util = require('./lib/util');
const exec = require('child_process').exec;
// const uglify = require('gulp-uglify');

const outSrcDir = 'out_client'

function execFn(execStr: string): () => Promise<void> {
    const result = () => new Promise<void>((c, e) => {
        exec(execStr, function (err: any) {
            if (!err) {
                return c();
            }
            return e(err);
        });
    })
    result.taskName = `exec-${execStr}`;
    return result
}

function copyJs(): () => Promise<void> {
    return () => new Promise<void>(resolve => {
        gulp.src(['./src/**/*.js'])
            // .pipe(uglify())
            .pipe(gulp.dest('./' + outSrcDir))
        resolve()
    })
}

function copyHtml(): () => Promise<void> {
    return () => new Promise<void>(resolve => {
        gulp.src(['./src/**/*.html'])
            .pipe(gulp.dest('./' + outSrcDir))
        resolve()
    })
}


const bytenodeFiles = [
    `${outSrcDir}/client/entry/electron_main/main.js`,
    `${outSrcDir}/client/entry/electron_main/app.js`,
]

function handleBytenodeFiles() {
    const result = () => new Promise<void>(async (c, e) => {
        try {
            for (let filePath of bytenodeFiles) {
                await bytenode.compileFile({
                    filename: filePath,
                    electron: true
                })
                await fs.unlinkSync(path.join(__dirname, '../' + filePath))
            }
            c()
        } catch (err) {
            e(err)
        }
    })
    result.taskName = `bytenode`;
    return result
}

const buildClientTask = task.define('build-client', task.series(
    util.rimraf(path.join(__dirname, '../' + outSrcDir)),
    execFn(`cd ${path.join(process.cwd(), 'src')} && ttsc -p tsconfig.json`),
    execFn(`cd ..`),
    copyJs(),
    copyHtml()
))

gulp.task(buildClientTask);

const devClientTask = task.define('dev-client', task.series(
    util.rimraf(path.join(__dirname, '../' + outSrcDir)),
    execFn(`cd ${path.join(process.cwd(), 'src')} && ttsc -p tsconfig.json`),
    execFn(`cd ..`),
    copyJs(),
    // execFn(`bytenode out_client/client/*.js`),
    copyHtml(),
    handleBytenodeFiles()
))

gulp.task(devClientTask);
