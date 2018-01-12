// Load plugins
var gulp = require('gulp');
var mainBowerFiles = require('gulp-main-bower-files');
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var stripdebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var base64 = require('gulp-base64');
var imagemin = require('gulp-imagemin');
var browsersync = require('browser-sync');
var download = require("gulp-download");
var unzip = require("gulp-unzip");
var del = require('del');
var gulpSequence = require('gulp-sequence');
var util = require('util');
var shell = require('gulp-shell');
var prompt = require('gulp-prompt');
var open = require('gulp-open');
var dist = 'assets/dist/';

// error function for plumber
var onError = function (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};

// Browser definitions for autoprefixer
var AUTOPREFIXER_BROWSERS = [
  'last 3 versions',
  'ie >= 8',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

//build datestamp for cache busting
var getStamp = function() {
  var myDate = new Date();
  var myYear = myDate.getFullYear().toString();
  var myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
  var myDay = ('0' + myDate.getDate()).slice(-2);
  var mySeconds = myDate.getSeconds().toString();
  var myFullDate = myYear + myMonth + myDay + mySeconds;
  return myFullDate;
};

// Setup Craft CMS task
gulp.task('setup-craft', function() {
  return gulp.src('').pipe(
    // Set site details
    prompt.prompt([{
      type: 'input',
      name: 'sitename',
      message: 'Please enter a name for your site'
    },{
      type: 'input',
      name: 'username',
      message: 'Please enter your mysql username'
    },{
      type: 'password',
      name: 'password',
      message: 'Please enter your mysql password'
    },{
      type: 'input',
      name: 'gitrepo',
      message: 'Please enter a name for your git repository e.g. XXX--Job-Name--Extension'
    },{
      type: 'input',
      name: 'gitUser',
      message: 'Please enter your github username'
    },{
      type: 'password',
      name: 'gitPass',
      message: 'Please enter your github password'
    }], function(response) {
      var shellCommand;
      siteName = response.sitename;
      gitRepo = response.gitrepo;

      gitCommand = util.format("curl -u "+response.gitUser+":"+response.gitPass+" https://api.github.com/orgs/AyupDigital/repos -d '{\"name\": "+'"'+gitRepo+'"'+", \"private\": true }'");

      if (response.password === '') {
        shellCommand = util.format('mysql -u %s -e "CREATE DATABASE %s"', response.username, siteName);
      } else {
        shellCommand = util.format('mysql -u %s -p %s -e "CREATE DATABASE %s"', response.username, response.password, siteName);
      }

      gulp.src('').pipe(shell([gitCommand]));
      gulp.src('').pipe(shell([shellCommand]));
      console.log('Git Respository created!');
      console.log('\n\x1b[32m%s\x1b[0m', 'Database created!');

      // Replace whitespace with dashes and update Git remote
      gitRepo = gitRepo.replace(' ', '-');
      gulp.src('').pipe(shell(["git remote set-url origin https://github.com/AyupDigital/"+gitRepo]));

      // Update Dev DB Details in db.php
      gulp.src(['./db.php'])
        .pipe(replace('dev_user', response.username))
        .pipe(replace('dev_password', response.password))
        .pipe(gulp.dest('./'));

      // Update Gulpfile with siteName
      return gulp.src(['./gulpfile.js'])
        .pipe(replace('"reconfigure.dev"', '"'+siteName+'.dev"'))
        .pipe(gulp.dest('./'));
    })
  );
});

// Setup Static site task
gulp.task('setup-static', function() {
  return gulp.src('').pipe(
    // Set site details
    prompt.prompt([{
      type: 'input',
      name: 'sitename',
      message: 'Please enter a name for your site'
    },{
      type: 'input',
      name: 'gitrepo',
      message: 'Please enter a name for your git repository e.g. XXX--Job-Name--Extension'
    },{
      type: 'input',
      name: 'gitUser',
      message: 'Please enter your github username'
    },{
      type: 'password',
      name: 'gitPass',
      message: 'Please enter your github password'
    }], function(response) {
      var shellCommand;
      siteName = response.sitename;
      gitRepo = response.gitrepo;

      gitCommand = util.format("curl -u "+response.gitUser+":"+response.gitPass+" https://api.github.com/orgs/AyupDigital/repos -d '{\"name\": "+'"'+gitRepo+'"'+", \"private\": true }'");

      gulp.src('').pipe(shell([gitCommand]));
      console.log('Git Respository created!');

      // Replace whitespace with dashes and update Git remote
      gitRepo = gitRepo.replace(' ', '-');
      gulp.src('').pipe(shell(["git remote set-url origin https://github.com/AyupDigital/"+gitRepo]));

      // Update Gulpfile with siteName
      return gulp.src(['./gulpfile.js'])
        .pipe(replace('"reconfigure.dev"', '"'+siteName+'.dev"'))
        .pipe(gulp.dest('./'));
    })
  );
});

// Download Craft CMS task
gulp.task('download', function() {
  // Download Craft and unzip
  return download('http://craftcms.com/latest.zip?accept_license=yes')
    .pipe(rename('craft.zip'))
    .pipe(gulp.dest("./"))
    .pipe(unzip())
    .pipe(gulp.dest('./'));
});

// Replace siteName
gulp.task('site-creds', function() {
  // Replace devUrl and DB Name in files
  return gulp.src(['./general.php', './db.php', './index.php'])
    .pipe(replace('boilerplate', siteName))
    .pipe(gulp.dest('./'));
});

// Tidy Craft CMS folders & files
gulp.task('tidy-craft', function() {
  return del(['index.html', 'README.md', 'readme.txt', 'craft.zip', 'public', 'craft/templates', './craft/config/general.php', './craft/config/db.php', 'install.sh']).then(function() {
    // Copy general.php and db.php into craft folder
    gulp.src(['general.php', 'db.php']).pipe(gulp.dest('./craft/config'));

    // Copy templates folder into craft folder
    gulp.src(['./templates/**/*'], { base: './' }).pipe(gulp.dest('./craft'));
  });
});

// Tidy Static site folders & files
gulp.task('tidy-static', function() {
  return del(['index.php', 'README.md', 'general.php', 'db.php', 'install.sh']).then(function() {

  });
});

gulp.task('git', function() {
  // Add staging and production branches, commit and push
  return gulp.src('')
    .pipe(shell(["touch README.md"]))
    .pipe(shell(["git add --all"]))
    .pipe(shell(["git branch staging"]))
    .pipe(shell(["git branch production"]))
    .pipe(shell(["git commit -m 'initial commit'"]))
    .pipe(shell(["git push origin master"]));
});

// Install Craft CMS task
gulp.task('install', function(){
  // Open Craft CMS Install URL
  gulp.src('').pipe(open({uri: 'http://'+siteName+'.dev/admin/install'}));

  return;
});

// BrowserSync proxy
gulp.task('browser-sync', function() {
  browsersync({
    proxy: "https://reconfigure.dev",
    port: 4200
  });
});

// BrowserSync reload all Browsers
gulp.task('browsersync-reload', function () {
    browsersync.reload();
});

// Optimize Images task
gulp.task('img', function() {
  return gulp.src('./assets/src/img/**/*')
    .pipe(imagemin({
        progressive: true,
        interlaced: true,
        svgoPlugins: [ {removeViewBox:false}, {removeUselessStrokeAndFill:false} ]
    }))
    .pipe(gulp.dest(dist+'img'));
});

// Build fonts
gulp.task('fonts', function() {
  return gulp.src('./assets/src/fonts/*').pipe(gulp.dest(dist+'fonts'));
});

// CSS task
gulp.task('css', function() {
  return gulp.src('./assets/src/sass/*.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(compass({
      config_file: './config.rb',
      css: dist,
      sass: 'assets/src/sass'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest(dist))
    .pipe(browsersync.reload({ stream:true }))
    .pipe(notify({ message: 'Styles task complete' }));
});

//Concatenate and Minify JS task
gulp.task('scripts', function() {
  return gulp.src('./assets/src/scripts/**/*.js')
    .pipe(concat('app.js'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist))
    .pipe(notify({ message: 'Scripts task complete' }));
});

//Bower CSS task
gulp.task('bower-css', function() {
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles('**/*.css'))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(dist));
});

//Bower scripts task
gulp.task('bower-scripts', function() {
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles('**/*.js'))
    .pipe(concat('vendor.js'))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist));
});

// Cache busting task
gulp.task('cachebust', function() {
  return gulp.src('./craft/templates/_layouts/*.html')
    .pipe(replace(/main.css\?([0-9]*)/g, 'main.css?' + getStamp()))
    .pipe(replace(/app.min.js\?([0-9]*)/g, 'app.min.js?' + getStamp()))
    .pipe(replace(/vendor.min.js\?([0-9]*)/g, 'vendor.min.js?' + getStamp()))
    .pipe(gulp.dest('./craft/templates/_layouts/'))
    .pipe(notify({ message: 'CSS/JS Cachebust task complete' }));
});

// Watch task
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch('./assets/src/sass/**/*', ['css']);
  gulp.watch('./assets/src/scripts/**/*', ['scripts', 'browsersync-reload']);
  gulp.watch('./craft/templates/**/*', ['browsersync-reload']);
});

// Tasks
gulp.task('init-craft', gulpSequence('setup-craft', 'download', 'site-creds', 'tidy-craft', 'build', 'git', 'install'));
gulp.task('init-static', gulpSequence('setup-static', 'tidy-static', 'build', 'git'));
gulp.task('build', ['css', 'scripts', 'bower-css', 'bower-scripts', 'img', 'fonts', 'cachebust']);
