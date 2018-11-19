"use strict";
// TODO  change it to webpack

/* -------------dependencies----------------- */
var gulp        = require("gulp"),
    browserify  = require("browserify"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    karma       = require("karma").server,
    coveralls   = require('gulp-coveralls'),
    uglify      = require("gulp-uglify"),
    runSequence = require("run-sequence"),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload,
    pkg         = require(__dirname + "/package.json");

// NOTE BUILD

// SECTION lint

gulp.task('lint', () => {
    return gulp.src([
        './source/**/**.ts'
    ])
    .pipe(tslint())
    .pipe(tslint.report('verbose'))
});

// SECTION ts to js
const tsProject = tsc.createProject({
    target:'es5',
    module:'commonjs',
    experimentalDecorators:true,
    typescript:typescript
})
gulp.task('build-source', () => {
    return gulp.src('./source/**/**.ts')
    .pipe(tsc(tsProject))
    .js.pipe(gulp.dest('./build/source'))
})

gulp.task('build', (cb) => {
    runSequence('lint', 'build-source', cb)
})

// NOTE BUNDLE 
// SECTION bundle

gulp.task('bundle-source', () => {

})

// NOTE TEST

// NOTE BAKE

// NOTE SERVE

// NOTE DEFAULT