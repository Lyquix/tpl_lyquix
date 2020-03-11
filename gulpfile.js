/**
 * gulpfile.js - Watch and automatically process CSS and JS
 *
 * @version     1.0.10
 * @package     tpl_lyquix
 * @author      Lyquix
 * @copyright   Copyright (C) 2015 - 2018 Lyquix
 * @license     GNU General Public License version 2 or later
 * @link        https://github.com/Lyquix/tpl_lyquix
 */

var gulp = require('gulp'),
    shell = require('gulp-shell'),
    cwd = process.cwd();

function errorLog(error) {
    console.error.bind(error);
    this.emit('end');
}

gulp.task('process-css', function() {
    return gulp.src(['css/styles.less'])
        .on('error', errorLog)
        .pipe(shell(['bash ' + cwd + '/css/css.sh']));
});

gulp.task('process-js', function() {
    return gulp.src(['js/scripts.js'])
        .on('error', errorLog)
        .pipe(shell(['bash ' + cwd + '/js/js.sh']));
});

gulp.task('default', function() {
    gulp.watch(['./css/less/*.less', './css/less/custom/*.less'], gulp.series('process-css'));
    gulp.watch(['./js/scripts.js'],
    gulp.series('process-js'));
});