let project_folder = 'dist';
let source_folder = 'src';

let fs = require('fs');

let path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
  },
  src: {
    html: source_folder + '/html/pages/**/*.html',
    css: source_folder + '/scss/style.scss',
    js: [source_folder + '/js/**/*.js', source_folder + '/html/**/*.js'],
    img: source_folder + '/img/**/*.',
    fonts: source_folder + '/fonts/',
  },
  watch: {
    html: source_folder + '/html/**/*.html',
    css: [source_folder + '/scss/**/*.scss', source_folder + '/html/**/*.scss'],
    // js: source_folder + '/js/**/*.js',
    js: [source_folder + '/js/**/*.js', source_folder + '/html/**/*.js'],
    img: source_folder + '/img/**/*.{jpg,JPG, jpeg,JPEG,png,svg,gif,ico,webp}',
  },
  clean: './' + project_folder + '/',
};

let { src, dest, series } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  plumber = require('gulp-plumber'),
  webphtml = require('gulp-webp-html'),
  htmlValidator = require('gulp-w3c-html-validator'),
  scss = require('gulp-sass'),
  sassGlob = require('gulp-sass-glob'),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  sourcemaps = require('gulp-sourcemaps'),
  clean_css = require('gulp-clean-css'),
  smartgrid = require('smart-grid'),
  imagemin = require('gulp-imagemin'),
  // imageminWebp = require('imagemin-webp'),
  imageminMozJpeg = require('imagemin-mozjpeg'),
  imageminZopfli = require('imagemin-zopfli'),
  imageminGifLossy = require('imagemin-giflossy'),
  webp = require('gulp-webp'),
  uglify = require('gulp-uglify-es').default,
  concat = require('gulp-concat'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/',
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: 'HTML include',
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(htmlValidator())
    .pipe(htmlValidator.reporter())
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: 'Styles',
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(
      scss({
        outputStyle: 'expanded',
      })
    )
    .pipe(group_media())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 version'],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(clean_css({ level: 2 })) //жесткое сжатие
    .pipe(
      rename({
        extname: '.min.css',
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js',
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  src(path.src.img + '{jpg,jpeg,JPG,JPEG}')
    .pipe(webp({ method: 4, quality: 75 }))
    .pipe(dest(path.build.img));

  src(path.src.img + '{png,gif,tiff}')
    .pipe(
      webp({
        method: 6,
        quality: 100,
      })
    )
    .pipe(dest(path.build.img));

  return src(path.src.img + '{jpg,jpeg,JPG,JPEG,png,gif,tiff,svg}')
    .pipe(
      imagemin([
        imageminGifLossy({
          optimizationLevel: 3,
          optimize: 3,
          lossy: 5,
        }),
        imageminZopfli({
          more: true,
        }),
        imageminMozJpeg({
          quality: 85,
          progressive: true,
        }),
        imagemin.optipng(),
        imagemin.svgo({
          plugins: [
            { removeViewBox: false },
            { removeUnusedNS: false },
            { removeUselessStrokeAndFill: false },
            { cleanupIDs: false },
            { removeComments: true },
            { removeEmptyAttrs: true },
            { removeEmptyText: true },
            { collapseGroups: true },
          ],
        }),
      ])
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts() {
  src(path.src.fonts + '*.{woff,woff2}').pipe(dest(path.build.fonts));
  return src(path.src.fonts + '*.{woff,woff2}').pipe(dest(path.build.fonts));
}

function fonts2woff() {
  src(path.src.fonts + '*.ttf')
    .pipe(ttf2woff())
    .pipe(dest(path.src.fonts));
  return src(path.src.fonts + '*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest(path.src.fonts));
}

function otf2ttf() {
  return src([source_folder + '/fonts/*.otf'])
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(dest(source_folder + '/fonts/'));
}

function fontsStyle(params) {
  let file_content = fs.readFileSync(source_folder + '/scss/_fonts.scss');
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/_fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + '/scss/_fonts.scss',
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
}

function cb() {}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css[0], path.watch.css[1]], css);
  gulp.watch([path.watch.js[0], path.watch.js[1]], js);
  gulp.watch([path.watch.img], images);
}

function clean(params) {
  return del(path.clean);
}

gulp.task('smartgrid', function () {
  return smartgrid(source_folder + '/scss', settings);
});
var settings = {
  outputStyle: 'scss' /* less || scss || sass || styl */,
  columns: 12 /* number of grid columns */,
  offset: '30px' /* gutter width px || % || rem */,
  mobileFirst: false /* mobileFirst ? 'min-width' : 'max-width' */,
  container: {
    maxWidth: '1320px' /* max-width оn very large screen */,
    fields: '15px' /* side fields */,
  },
  breakPoints: {
    lg: {
      width: '1100px' /* -> @media (max-width: 1100px) */,
    },
    md: {
      width: '960px',
    },
    sm: {
      width: '780px',
    },
    xs: {
      width: '560px',
    },
    /* 
      We can create any quantity of break points.

      some_name: {
          width: 'Npx',
          fields: 'N(px|%|rem)',
          offset: 'N(px|%|rem)'
      }
      */
  },
};

let build = gulp.series(
  clean,
  gulp.parallel(watchFiles, browserSync, js, css, html, images, fonts),
  fontsStyle
);

let start = gulp.series(otf2ttf, fonts2woff);

let prod = gulp.series(
  clean,
  start,
  gulp.parallel(js, css, html, images, fonts)
);

exports.otf2ttf = otf2ttf;
exports.fonts2woff = fonts2woff;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.watch = watchFiles;
exports.build = build;
exports.start = start;
exports.prod = prod;
exports.default = build;
