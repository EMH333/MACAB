// Gulp.js configuration
var
    // modules
    gulp = require('gulp'),
    newer = require('gulp-newer'),
    htmlclean = require('gulp-htmlclean'),
    concat = require('gulp-concat'),
    deporder = require('gulp-deporder'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    assets = require('postcss-assets'),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('cssnano'),
    ignore = require('gulp-ignore'),
    babel = require('gulp-babel'),

    // development mode?
    devBuild = false; //(process.env.NODE_ENV !== 'production'),

// folders
folder = {
    src: 'dev/',
    build: 'public/'
};
// HTML processing
gulp.task('html', function () {
    var
        out = folder.build,
        page = gulp.src(folder.src + 'html/**/*.html').pipe(newer(out));

    // minify production code
    if (!devBuild) {
        page = page.pipe(htmlclean());
    }

    return page.pipe(gulp.dest(out));
});

// JavaScript processing
gulp.task('js', function () {

    var jsbuild = gulp.src(folder.src + 'js/**/*.js')
        .pipe(deporder())
        .pipe(concat('main.js'));

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug())
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(uglify().on('error', console.log));
    }

    return jsbuild.pipe(gulp.dest(folder.build + 'js/'));

});

gulp.task('fonts', function () {
    //just pipe through fonts, only needs to be run at start
    var
        out = folder.build + 'fonts/',
        fontbuild = gulp.src(folder.src + 'fonts/**/*').pipe(newer(out));

    return fontbuild.pipe(gulp.dest(out));
});

// CSS processing
gulp.task('css', function () {

    var postCssOpts = [
        autoprefixer(),
        mqpacker
    ];

    if (!devBuild) {
        postCssOpts.push(cssnano);
    }

    return gulp.src(folder.src + 'scss/style.scss')
        .pipe(sass({
            outputStyle: 'nested',
            imagePath: 'images/',
            precision: 3,
            errLogToConsole: true
        }))
        .pipe(postcss(postCssOpts))
        .pipe(gulp.dest(folder.build + 'css/'));

});

gulp.task('json', function () {
    var
        out = folder.build,
        jsonbuild = gulp.src(folder.src + 'json/**/*').pipe(newer(out));

    return jsonbuild.pipe(gulp.dest(out));
});

gulp.task('img', function () {
    var
        out = folder.build + 'images/',
        imgbuild = gulp.src(folder.src + 'images/**/*').pipe(newer(out));

    return imgbuild.pipe(gulp.dest(out));
});


// ServiceWorker processing
gulp.task('sw', function () {

    var jsbuild = gulp.src(folder.src + 'serviceWorker/**/*.js')
        .pipe(deporder())
        .pipe(concat('sw.js'));

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug())
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(uglify().on('error', console.log));
    }

    return jsbuild.pipe(gulp.dest(folder.build));

});


// watch for changes
gulp.task('watcher', function () {

    // image changes
    //gulp.watch(folder.src + 'images/**/*', ['images']);

    // html changes
    gulp.watch(folder.src + 'html/**/*', gulp.task('html'));

    // javascript changes
    gulp.watch(folder.src + 'js/**/*.js', gulp.task('js'));

    // css changes
    gulp.watch(folder.src + 'scss/**/*', gulp.task('css'));

    // json changes
    gulp.watch(folder.src + 'json/**/*', gulp.task('json'));

    //image changes
    gulp.watch(folder.src + 'images/**/*', gulp.task('img'));

    // service worker changes
    gulp.watch(folder.src + 'serviceWorker/**/*.js', gulp.task('sw'));

    //gulp.watch(folder.src + 'components/**/*', ['vue']); //vue component changes
});


//gulp.task('run', ['html', 'js', 'css', 'fonts', 'json', 'img', 'sw']);
gulp.task('run', gulp.parallel('html', 'js', 'css', 'fonts', 'json', 'img', 'sw'));
gulp.task('watch', gulp.series('run', 'watcher'));

gulp.task('default', gulp.series('run'));