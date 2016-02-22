// ///////////////////////////////
// Required
// /////////////////////////////////

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	compass = require('gulp-compass'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	imageMin = require('gulp-imagemin'),
	del = require('del');


// ///////////////////////////////
// Scripts
// /////////////////////////////////
gulp.task('scripts', function(){
	//console.log('It worked Dude !');
	gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])

	.pipe(plumber())
	.pipe(rename({suffix:'.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(reload({stream:true}));
});

gulp.task('compImgs', function(){
	return gulp.src('app/image/*')
			.pipe(imageMin({ progressive:true}))
			.pipe(gulp.dest('app/Ximages'));
})

///////////////////////////////
// compass / sass Tasks
// /////////////////////////////////
gulp.task('compass', function(){
	gulp.src('app/scss/style.scss')
		.pipe(plumber())
		.pipe(compass({
			config_file: './config.rb',
			css: 'app/css',
			sass: 'app/scss',
			require: ['susy']
		}))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('app/css/'))
		.pipe(reload({stream:true}));
});
///////////////////////////////
// HTML Task
// /////////////////////////////////
gulp.task('html', function(){
	gulp.src('app/**/*.html')
	.pipe(reload({stream:true}));
});

///////////////////////////////
// Build Task
// /////////////////////////////////

// task to clear all files and folders from build folder
gulp.task('build:cleanfolder', function(cb){
	del([
		'build/**'
		], cb()); // Not just passing reference but value
});


// task to create build directory for all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
	return gulp.src('app/**/*/')
		.pipe(gulp.dest('build/'));
});

// task that remove unwanted build files
/* list all files and dirs that we dont want to include */

gulp.task('build:remove', ['build:copy'], function(cb){
	del([
		'build/scss/',
		'build/js/!(*.min.js)'
	], cb());
});


// Final Task that kicks off the build Sys
gulp.task('build', ['build:copy', 'build:remove']);

///////////////////////////////
// BrowserSync Task
// /////////////////////////////////

gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir: "./app/"
		}
	});
});

// Task to run build server for testing final app
gulp.task('build:serve', function(){
	browserSync({
		server:{
			baseDir: "./build/"
		}
	});
});
///////////////////////////////
// 2 .// watch Task
// /////////////////////////////////

gulp.task('watch', function(){
	gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/scss/**/*.scss', ['compass']);
	gulp.watch('app/**/*.html', ['html']);
})

// ///////////////////////////////
// 3 . Default Task
// /////////////////////////////////

gulp.task('default', ['scripts', 'compass', 'html', 
		'browser-sync', 'watch']);