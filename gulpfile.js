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
    target:'es2015',
    module:'commonjs',
    declarationFiles : false,
    experimentalDecorators:true,
})
gulp.task('build-source', () => {
    return gulp.src('./source/**/**.ts')
    .pipe(tsProject())
    .js.pipe(gulp.dest('./build/source'))
})

gulp.task('build', (cb) => {
    runSequence('lint', 'build-source', cb)
})

// NOTE BUNDLE 
// SECTION bundle

gulp.task('bundle-source', () => {
    var b = browserify({
        standalone : 'TsStock',
        entries: __dirname + "/build/source/app/main.js",
        debug: true
      });
    
      return b.bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(gulp.dest(__dirname + "/bundled/source/"));
})

// NOTE TEST

gulp.task('run-unit-test', (cb) => {
    karma.start({
        configFile: __dirname + '\\karma.conf.js',
        singleRun: true,
    }, cb)
})

// 与karma不同的是能更好的模拟用户的行为
gulp.task('run-e2e-test', () => {
    return gulp.src('')
    .pipe(nightwatch({
        configFile: 'nightwatch.json',
    }))
})

// NOTE BAKE

// 压缩代码
gulp.task('compress', () => {
    return gulp.src('bundled/source/bundle.js')
    .pipe(uglify({preserveComments: false}))
    .pipe(gulp.dest('dist/'))
})

// 增加头部的版权信息等
gulp.task('header', () => {
    var banner = ["/**",
    " * <%= pkg.name %> v.<%= pkg.version %> - <%= pkg.description %>",
    " * Copyright (c) 2015 <%= pkg.author %>",
    " * <%= pkg.license %> inversify.io/LICENSE",
    " * <%= pkg.homepage %>",
    " */",
    ""].join("\n");

  return gulp.src(__dirname + "/dist/inversify.js")
             .pipe(header(banner, { pkg : pkg } ))
             .pipe(gulp.dest(__dirname + "/dist/"));
})

// NOTE SERVE for E2E test

gulp.task('serve', (cb) => {
    browserSync({
        port: 8080,
        server: {
            baseDir: __dirname + './'
        }
    });
    gulp.watch([
        __dirname + "/source/**/*.ts",
        __dirname + "/test/**/*.ts",
        __dirname + "/css/**/*.css",
        __dirname + "/img/**/*.css",
        __dirname + "/index.html"
    ], reload,cb)
})

// NOTE DEFAULT

gulp.task("default", function () {
    runSequence(
      "lint",
      "build-source",
      "build-test",
      "bundle-source",
      "bundle-test",
      "karma",
      "cover",
      "compress",
      "header"
      );
  });