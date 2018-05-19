var gulp            = require('gulp'),
    shell           = require('gulp-shell'),
    ghPages         = require('gulp-gh-pages'),
    imagemin        = require('gulp-imagemin'),
    cp              = require('child_process'),
    runSequence     = require('run-sequence').use(gulp);

var messages = {
    jekyllBuild: 'building...'
};

gulp.task('image', function () {
  return gulp.src('images/**/*')
    .pipe(imagemin([imagemin.jpegtran()], { verbose: true }))
    .pipe(gulp.dest('_site/images'));
});


// Deploy Tasks
gulp.task('build:prod', shell.task(['bundle exec jekyll build']));

gulp.task('push-gh-master', shell.task(['git push origin master']));

gulp.task('push-gh-pages', function () {
  return gulp.src('_site/**/*')
    .pipe(ghPages({ force: true }));
});

gulp.task('deploy', function (callback) {
  runSequence(
    'build:prod',
    'image',
    'push-gh-master',
    'push-gh-pages',
    callback
  );
});

// Dev tasks
gulp.task('jekyll', shell.task(['bundle exec jekyll build --incremental --config _config.yml']));
gulp.task('jekyll-force', shell.task(['bundle exec jekyll build --config _config.yml']));

gulp.task('serve', shell.task(['bundle exec jekyll serve']));

gulp.task('watch', function () {
  gulp.watch('source/**/*.*', ['jekyll-rebuild']);
  gulp.watch('source/_data/*.*', ['jekyll-rebuild-force']);
});

gulp.task('default', function (callback) {
  runSequence(
    ['jekyll-rebuild-force', 'watch', 'browserSync'],
    callback
  );
});
