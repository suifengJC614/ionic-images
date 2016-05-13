const gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var inject = require('gulp-inject');
var del = require('del');
var runSequence = require('run-sequence');
var args    = require('yargs').argv;
var watch = require('gulp-watch');
var ngConstant = require('gulp-ng-constant');
var extend = require('gulp-extend');
var filter = require('gulp-filter');
var plumber = require('gulp-plumber');
var ngHtml2Js = require("gulp-ng-html2js")
var minifyHtml = require('gulp-minify-html');
var uglify = require("gulp-uglify");

var paths = {
    src: ['./src/*','./src/**/*'],
    templates: ['./src/**/*.html'],
    src_with_copy: ['./src/*','./src/**/*', '!./src/**/*.json', '!./src/**/*.scss', '!./src/**/scss/**/*'],
    src_css: ['./src/css/**/*.css'],
    src_test:['./test/**/*.js', './test/**/*.css'],
    dist: './dist',
    index: ['./index.html'],
    sass: ['./src/scss/*.scss'],
    script: ['./src/js/**/*.module.js', './src/js/**/*.js'],
    config: ['./src/js/config/config.default.json'],
    libs: [
        './src/lib/jquery/dist/jquery.js',
        './src/lib/ionic/js/ionic.bundle.js',
        './src/lib/ionic/css/ionic.css'
    ]
};


//gulp.task('default', developmentTask);


gulp.task('clean', function (cb) {
    return del([paths.dist + '/**/*'], cb);
});

gulp.task('build-template', function(){
    return gulp.src(paths.templates)
        .pipe(minifyHtml({empty: true}))
        .pipe(ngHtml2Js({
            moduleName: "ion-images",
            prefix: "src/"
        }))
        .pipe(concat("image-template.min.js"))
        .pipe(gulp.dest(paths.dist + "/js"));
})

gulp.task('build-script', function(){
    return gulp.src(paths.script.concat([paths.dist + '/js/image-template.min.js']))
        .pipe(gulp.dest(paths.dist + '/js'))
        .pipe(uglify())
        .pipe(concat('ionic-images.all.min.js'))
        .pipe(gulp.dest(paths.dist));
})

gulp.task('build-sass', function(){
    runSequence('sass', function(){
        gulp.src(paths.src_css)
            .pipe(gulp.dest(paths.dist + "/css"))
            .pipe(minifyCss({
                keepSpecialComments: 0
            }))
            .pipe(concat('ionic-images.min.css'))
            .pipe(gulp.dest(paths.dist))
    });
})

gulp.task('build', function(){
    runSequence('clean', 'build-template', 'build-script', 'build-sass');
})

gulp.task('config', function () {
    //var model = args.model || "development";

    gulp.src(paths.config)
        .pipe(extend('config.json', true))
        .pipe(ngConstant({
            name: 'app.configs',
            deps: [],
        }))
        .pipe(rename(function (path) {
            path.basename = 'config';
            path.extname = '.js';
        }))
        .pipe(gulp.dest('src/js/config'));
})

gulp.task('watch-config', function(){
    watch(paths.config, function(){
        gulp.start('config');
    })
});

gulp.task('watch-sass', function(){
    watch(paths.sass, function(){
       gulp.start('sass');
    });
});

gulp.task('watch-inject', function(){
    var injectPath = paths.script.concat(paths.src_css).concat(paths.src_test);
    gulp.src(injectPath, {base: './src'})
        .pipe(watch(injectPath, {base: './src'}, function(file){
            if(file.event === 'add' || file.event == 'unlink'){
                gulp.start('inject')
            }
        }))
});

gulp.task('watch', ['watch-config', 'watch-sass', 'watch-inject']);

gulp.task('copy', function() {
    gulp.src(paths.src_with_copy)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('inject', function() {
    gulp.src(paths.index)
        .pipe(inject(gulp.src(paths.libs,{read: false}),{relative: true, name:"inject:libs"}))
        .pipe(inject(gulp.src(paths.script.concat(paths.src_css),{read: false}),{relative: true, name:"inject:app"}))
        .pipe(inject(gulp.src(paths.src_test,{read: false}),{relative: true, name:"inject:test"}))
        .pipe(gulp.dest('./'));
})

gulp.task('sass', function (done) {
    gulp.src(paths.sass)
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(concat('ionic-images.css'))
        .pipe(gulp.dest('./src/css/'))
        .on('end', done);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
