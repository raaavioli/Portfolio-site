"use strict";

const gulp = require('gulp'),
	jade = require('gulp-jade'),
	prefix = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync');

const multipage = false;

const paths = {
	root: '',
	sass: 'build/sass',
	jade: 'build/jade',
	assets: 'build/assets',
	json: 'build/data',
	js: 'build/js',
	output: 'output'
};

gulp.task('browser-sync', ['sass', 'jade', 'js', 'assets', 'json'], () => {
	browserSync({
		server: { baseDir: './output'},
		notify: false,
		browser: false
	});
});

gulp.task('jade', () => {
	return gulp.src(paths.jade + '/index.jade')
		.pipe(jade())
		.pipe(gulp.dest(paths.output));
});

gulp.task('js', () => {
	return gulp.src(paths.js + '/main.js')
		.pipe(gulp.dest(paths.output+'/js'));
});

gulp.task('assets', () => {
	return gulp.src(paths.assets + '/**/*')
		.pipe(gulp.dest(paths.output+'/assets'));
});

gulp.task('json', () => {
	return gulp.src(paths.json + '/*')
		.pipe(gulp.dest(paths.output+'/data'));
});

gulp.task('sass', () => {
	return gulp.src(paths.sass + '/style.sass')
		.pipe(sass({
			includePaths: [paths.sass],
			outputStyle: 'compressed'
		}))
		.on('error', sass.logError)
		.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
		.pipe(gulp.dest(paths.output+'/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('jade-rebuild', ['jade'], ()=> {
	browserSync.reload();
});

gulp.task('browser-reload', ()=> {
	browserSync.reload();
});

gulp.task('watch', () => {
	gulp.watch(paths.sass + '/**/*.sass', ['sass']);
	gulp.watch(paths.jade + '/**/*.jade', ['jade-rebuild']);
	gulp.watch(paths.js + '/*.js', ['js', 'browser-reload']);
	gulp.watch(paths.json + '/*.json', ['json', 'browser-reload']);
	gulp.watch(paths.assets + '/**/*', ['assets', 'browser-reload']);
});

gulp.task('default', ['browser-sync', 'watch']);
