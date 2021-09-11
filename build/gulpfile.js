'use strict';

// Increase max listeners for event emitters
require('events').EventEmitter.defaultMaxListeners = 100;

// const gulp = require('gulp');
// const task = require('./lib/task');
require('./gulpfile.client')


// const test = require('./lib/test');
// const testTask = task.define('test', task.series(test.print));

// gulp.task(testTask)
