var autoPrefixBrowserList = [
    'last 2 version', 
    'safari 5', 
    'ie 8', 
    'ie 9', 
    'opera 12.1', 
    'ios 6', 
    'android 4'
];

var gulp         = require('gulp'),
    autoPrefixer = require('gulp-autoprefixer'),
    cleanCSS     = require('gulp-clean-css'),
    concat       = require('gulp-concat'),
    plumber      = require('gulp-plumber'),
    sequence     = require('gulp-sequence').use(gulp),
    shell        = require('gulp-shell'),
    sourceMaps   = require('gulp-sourcemaps'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync');

//
gulp.task('browserSync', function(){
    browserSync({
        server: {
            baseDir: "app/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

//
gulp.task('vendors', function(){
    
    // Bootstrap - MIXINS
    gulp.src('./node_modules/bootstrap/scss/mixins/*.scss')
        .pipe(gulp.dest('./app/styles/bootstrap/mixins'));

    // Bootstrap - UTILITIES
    gulp.src('./node_modules/bootstrap/scss/utilities/*.scss')
        .pipe(gulp.dest('./app/styles/bootstrap/utilities'));
    
    // Bootstrap - SCSS
    gulp.src('./node_modules/bootstrap/scss/*.scss')
        .pipe(gulp.dest('./app/styles/bootstrap'));

    // Bootstrap - JS
    gulp.src('./node_modules/bootstrap/js/src/*.js')
        .pipe(gulp.dest('./app/scripts/bootstrap'));
    
    // Font Awesome - SCSS
    gulp.src('./node_modules/font-awesome/scss/*.scss')
        .pipe(gulp.dest('./app/styles/font-awesome'));
    
    // Font Awesome - Fonts
    gulp.src('./node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('./app/fonts'));

    // jQuery
    gulp.src([
      './node_modules/jquery/dist/*.min.js',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./app/scripts/jquery'));

});

/* compressing images */
gulp.task('images',function(){
    gulp.src([
        'app/images/*.jpg', 
        'app/images/*.png'
    ])
    // prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    .pipe(imagemin({
        optimizationLevel: 5, 
        progressive: true, 
        interlaced: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('app/images'));
});

//
gulp.task('bootstrap-scripts', function(){
    gulp.src('app/scripts/bootstrap/**/*.js')
    .pipe(plumber())
    .pipe(concat('_bootstrap.js'))
    .pipe(gulp.dest('app/scripts/bootstrap'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//
gulp.task('scripts', function(){
    gulp.src('app/scripts/src/**/*.js')
    .pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('app/scripts'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//
gulp.task('bootstrap-styles',function(){
    gulp.src('app/styles/bootstrap/bootstrap.scss')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sourceMaps.init())
    .pipe(sass({
        errLogToConsole: true,
        includePaths: [
            'app/style/scss/'
        ]
    }))
    .pipe(autoPrefixer({
        browsers: autoPrefixBrowserList,
        cascade: true
    }))
    .on('error', sass.logError)
    .pipe(concat('bootstrap.css'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//
gulp.task('font-awesome-styles',function(){
    gulp.src('app/styles/font-awesome/font-awesome.scss')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sourceMaps.init())
    .pipe(sass({
        errLogToConsole: true,
        includePaths: [
            'app/style/scss/'
        ]
    }))
    .pipe(autoPrefixer({
        browsers: autoPrefixBrowserList,
        cascade: true
    }))
    .on('error', sass.logError)
    .pipe(concat('font-awesome.css'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

//
gulp.task('personal-styles', function(){
    gulp.src('app/styles/scss/init.scss')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sourceMaps.init())
    .pipe(sass({
        errLogToConsole: true,
        includePaths: [
            'app/style/scss/'
        ]
    }))
    .pipe(autoPrefixer({
        browsers: autoPrefixBrowserList,
        cascade: true
    }))
    .on('error', sass.logError)
    .pipe(concat('styles.css'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('default', gulp.series( gulp.parallel(

    'browserSync',
    'scripts',
    'bootstrap-styles',
    'font-awesome-styles',
    'personal-styles'), 
    
    function(){
        gulp.watch('app/scripts/src/**', ['scripts']);
        gulp.watch('app/styles/scss/**', ['bootstrap-styles','font-awesome-style','personal-syles']);
        gulp.watch('app/images/**', ['images']);
    }

));
