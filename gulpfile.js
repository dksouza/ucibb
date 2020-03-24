const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('bundle', () => {
  execSync('node ./node_modules/mov-cli/bin/mov.js bundle', {
    stdio: [0, 1, 2],
  });
});

gulp.task('lint', () =>
  gulp
    .src(['app/**/*.js', 'index.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint({ fix: true }))
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format()));
// To have the process exit with an error code (1) on
// lint error, return the stream and pipe to failAfterError last.
// .pipe(eslint.failAfterError()));

gulp.task('pre-commit', ['lint']);
gulp.task('default', ['lint']);
gulp.task('dist', ['default', 'bundle']);
