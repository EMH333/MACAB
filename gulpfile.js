// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  gulpUtil = require('gulp-util'),
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
  devBuild = true; //(process.env.NODE_ENV !== 'production'),

// folders
folder = {
  src: 'dev/',
  build: 'public/'
}
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
        presets: ['es2015']
      }))
      .pipe(uglify().on('error', gulpUtil.log));
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
    autoprefixer({
      browsers: ['last 2 versions', '> 2%']
    }),
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
        presets: ['es2015']
      }))
      .pipe(uglify().on('error', gulpUtil.log));
  }

  return jsbuild.pipe(gulp.dest(folder.build));

});


// watch for changes
gulp.task('watcher', function () {

  // image changes
  //gulp.watch(folder.src + 'images/**/*', ['images']);

  // html changes
  gulp.watch(folder.src + 'html/**/*', ['html']);

  // javascript changes
  gulp.watch(folder.src + 'js/**/*.js', ['js']);

  // css changes
  gulp.watch(folder.src + 'scss/**/*', ['css']);

  // json changes
  gulp.watch(folder.src + 'json/**/*', ['json']);

  //image changes
  gulp.watch(folder.src + 'images/**/*', ['img']);

  // service worker changes
  gulp.watch(folder.src + 'serviceWorker/**/*.js', ['sw']);

  //gulp.watch(folder.src + 'components/**/*', ['vue']); //vue component changes
});


gulp.task('run', ['html', 'js', 'css', 'fonts', 'json', 'img', 'sw']);
gulp.task('watch', ['watcher', 'run']);

gulp.task('default', ['run']);