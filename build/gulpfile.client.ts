'use strict';

import * as path from 'path';

const gulp = require('gulp');
const task = require('./lib/task');
const util = require('./lib/util');
const exec = require('child_process').exec;
// const uglify = require('gulp-uglify');

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
            .pipe(gulp.dest('./out_client'))
        resolve()
    })
}

function copyHtml(): () => Promise<void> {
    return () => new Promise<void>(resolve => {
        gulp.src(['./src/**/*.html'])
            .pipe(gulp.dest('./out_client'))
        resolve()
    })
}

const buildClientTask = task.define('build-client', task.series(
    util.rimraf(path.join(__dirname, '../out_client')),
    execFn(`cd ${path.join(process.cwd(), 'src')} && ttsc -p tsconfig.json`),
    execFn(`cd ..`),
    copyJs(),
    copyHtml()
))

gulp.task(buildClientTask);

const devClientTask = task.define('dev-client', task.series(
    util.rimraf(path.join(__dirname, '../out_client')),
    execFn(`cd ${path.join(process.cwd(), 'src')} && ttsc -p tsconfig.json`),
    execFn(`cd ..`),
    copyJs(),
    copyHtml()
))

gulp.task(devClientTask);
