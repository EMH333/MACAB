// Gulp.js configuration
var
    // modules
    gulp = require('gulp'),
    newer = require('gulp-newer'),
    htmlclean = require('gulp-htmlclean'),
    stripdebug = require('gulp-strip-debug'),
    sass = require('gulp-dart-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssCompressor = require('postcss-combine-media-query'),
    uncss = require('uncss').postcssPlugin,
    cssnano = require('cssnano'),
    esbuildPlugin = require('./GulpPlugins/esbuild');

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

    var jsbuild = gulp.src(folder.src + 'js/main.js').pipe(esbuildPlugin({
        outfile: 'main.js',
        target: 'es6',
        bundle: true,
        minify: !devBuild,
    }));

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug());
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
        cssCompressor,
        uncss({
            html: ['public/*.html'],
            ignore: [/\.cal.*/, '.invisible', '.visible', '.r', '.col', '.fade-in', '.fade-out'],
            jsdom: {
                runScripts: "outside-only",
            },
            timeout: 100,
        })
    ];

    if (!devBuild) {
        postCssOpts.push(cssnano);
    }

    return gulp.src(folder.src + 'scss/style.scss')
        .pipe(sass({
            outputStyle: 'compressed',
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

    //Note this is grabing single file, sw.js, as it should
    var jsbuild = gulp.src(folder.src + 'serviceWorker/**/sw.js').pipe(esbuildPlugin({
        outfile: 'sw.js',
        target: 'es6',
        minify: !devBuild,
    }));

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug());
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
gulp.task('run', gulp.parallel(gulp.series('html', 'js', 'css'), 'fonts', 'json', 'img', 'sw'));
gulp.task('watch', gulp.series('run', 'watcher'));

gulp.task('default', gulp.series('run'));
