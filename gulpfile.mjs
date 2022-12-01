// Gulp.js configuration
import gulp from 'gulp';
var { task, src: _src, dest, watch, parallel, series } = gulp;
import newer from 'gulp-newer';
import htmlclean from 'gulp-htmlclean';
import stripdebug from 'gulp-strip-debug';
import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { postcssPlugin as uncss } from 'uncss';
import esbuildPlugin from './GulpPlugins/esbuild.mjs';

// development mode?
var devBuild = false; //(process.env.NODE_ENV !== 'production'),

// folders
var folder = {
    src: 'dev/',
    build: 'public/'
};
// HTML processing
task('html', function () {
    var
        out = folder.build,
        page = _src(folder.src + 'html/**/*.html').pipe(newer(out));

    // minify production code
    if (!devBuild) {
        page = page.pipe(htmlclean());
    }

    return page.pipe(dest(out));
});

// JavaScript processing
task('js', function () {

    var jsbuild = _src(folder.src + 'js/main.js').pipe(esbuildPlugin({
        outfile: 'main.js',
        target: 'es6',
        bundle: true,
        minify: !devBuild,
    }));

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug());
    }

    return jsbuild.pipe(dest(folder.build + 'js/'));

});

task('fonts', function () {
    //just pipe through fonts, only needs to be run at start
    var
        out = folder.build + 'fonts/',
        fontbuild = _src(folder.src + 'fonts/**/*').pipe(newer(out));

    return fontbuild.pipe(dest(out));
});

// CSS processing
task('css', function () {

    var postCssOpts = [
        autoprefixer(),
        uncss({
            html: ['public/*.html'],
            ignore: [/\.cal.*/, '.invisible', '.visible', '.r', '.col', '.fade-in', '.fade-out'],
            jsdom: {
                runScripts: "outside-only",
            },
            timeout: 100,
        })
    ];

    return _src(folder.src + 'scss/style.scss')
        .pipe(
            esbuildPlugin({
                outfile: 'style.css',
                target: 'es6',
                bundle: true,
                minify: !devBuild,
                plugins: [sassPlugin({
                    outputStyle: 'compressed',
                    async transform(source, resolveDir, filepath) {
                        const {css} = await postcss(postCssOpts).process(source, {from: filepath});
                        return css;
                    }
                })]
            }))
        .pipe(dest(folder.build + 'css/'));

});

task('json', function () {
    var
        out = folder.build,
        jsonbuild = _src(folder.src + 'json/**/*').pipe(newer(out));

    return jsonbuild.pipe(dest(out));
});

task('img', function () {
    var
        out = folder.build + 'images/',
        imgbuild = _src(folder.src + 'images/**/*').pipe(newer(out));

    return imgbuild.pipe(dest(out));
});


// ServiceWorker processing
task('sw', function () {

    //Note this is grabing single file, sw.js, as it should
    var jsbuild = _src(folder.src + 'serviceWorker/**/sw.js').pipe(esbuildPlugin({
        outfile: 'sw.js',
        target: 'es6',
        minify: !devBuild,
    }));

    if (!devBuild) {
        jsbuild = jsbuild
            .pipe(stripdebug());
    }

    return jsbuild.pipe(dest(folder.build));

});


// watch for changes
task('watcher', function () {

    // image changes
    //gulp.watch(folder.src + 'images/**/*', ['images']);

    // html changes
    watch(folder.src + 'html/**/*', task('html'));

    // javascript changes
    watch(folder.src + 'js/**/*.js', task('js'));

    // css changes
    watch(folder.src + 'scss/**/*', task('css'));

    // json changes
    watch(folder.src + 'json/**/*', task('json'));

    //image changes
    watch(folder.src + 'images/**/*', task('img'));

    // service worker changes
    watch(folder.src + 'serviceWorker/**/*.js', task('sw'));

    //gulp.watch(folder.src + 'components/**/*', ['vue']); //vue component changes
});


//gulp.task('run', ['html', 'js', 'css', 'fonts', 'json', 'img', 'sw']);
task('run', parallel(series('html', 'js', 'css'), 'fonts', 'json', 'img', 'sw'));
task('watch', series('run', 'watcher'));

task('default', series('run'));
