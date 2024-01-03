const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const media_query = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');
const jsMinify = require('gulp-minify');
const sass = require('gulp-sass')(require('sass'));

function html() {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true
  };
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .on('data', function (file) {
      const bufferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
      return file.contents = bufferFile
    })
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function scss() {
  const plugins = [
    autoprefixer(),
    media_query(),
    cssnano()
  ];
  return gulp.src('src/styles/**/*.scss')
    .pipe(sass())
    .pipe(concat('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }))
}

/*
function css() {
  const plugins = [
    autoprefixer(),
    media_query(),
    cssnano()
  ];
  return gulp.src('src/styles/**//*.css')
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}
*/

function images() {
  return gulp.src('src/images/**/*.{jpg,png,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({ stream: true }));
}

function svg() {
  return gulp.src('src/svg/**/*.svg')
    .pipe(gulp.dest('dist/svg'))
    .pipe(browserSync.reload({stream: true}));
}

function scripts() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jsMinify({
      ext: {
        min: '.js'
      },
      noSource: true
    }))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.reload({stream: true}))
}

function fonts() {
  return gulp.src('src/fonts/**/*.{ttf,woff,woff2}')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({ stream: true }));
}

function videos() {
  return gulp.src('src/videos/**/*.{avi,mp4,webm}')
    .pipe(gulp.dest('dist/videos'))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/styles/**/*.scss'], scss);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/svg/**/*.svg'], svg);
  gulp.watch(['src/fonts/**/*.{ttf,woff,woff2}'], fonts);
  gulp.watch(['src/videos/**/*.{avi,mp4,webm}'], videos);
  gulp.watch(['src/scripts/**/*.{js}'], scripts);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

// add css if needed
const build = gulp.series(clean, gulp.parallel(html, scss, images, svg, fonts, videos, scripts));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
// exports.css = css;
exports.scss = scss;
exports.images = images;
exports.svg = svg;
exports.fonts = fonts;
exports.videos = videos;
exports.scripts = scripts;
exports.clean = clean;
exports.build = build;
exports.watchFiles = watchFiles;
exports.default = watchapp;