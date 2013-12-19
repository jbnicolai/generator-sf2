'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';
  this.coffee = options.coffee;

  // for hooks to resolve on mocha by default
  options['test-framework'] = this.testFramework;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', {
    as: 'web',
    options: {
      options: {
        'skip-install': options['skip-install-message'],
        'skip-message': options['skip-install']
      }
    }
  });

  this.options = options;

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log('Out of the box I include HTML5 Boilerplate and jQuery.');
  }

  var prompts = [{
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [{
      name: 'Bootstrap for Sass',
      value: 'compassBootstrap',
      checked: true
    }, {
      name: 'Modernizr',
      value: 'includeModernizr',
      checked: true
    }]
  }];

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    function hasFeature(feat) { return features.indexOf(feat) !== -1; }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.compassBootstrap = hasFeature('compassBootstrap');
    this.includeModernizr = hasFeature('includeModernizr');

    cb();
  }.bind(this));
};

AppGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

AppGenerator.prototype.composer = function composer() {
  this.copy('_composer.json', 'composer.json');
};

AppGenerator.prototype.symfony2 = function symfony2() {
  this.copy('_composer.json', 'composer.json');

  this.copy('AppCache.php', 'app/AppCache.php');
  this.copy('AppKernel.php', 'app/AppKernel.php');
  this.copy('autoload.php', 'app/autoload.php');
  this.copy('check.php', 'app/check.php');
  this.copy('console', 'app/console');
  this.copy('phpunit.xml.dist', 'app/phpunit.xml.dist');
  this.copy('SymfonyRequirements.php', 'app/SymfonyRequirements.php');

  this.copy('gitkeep', 'app/cache/.gitkeep');
  this.copy('gitkeep', 'app/logs/.gitkeep');

  this.copy('gitkeep', 'bin/.gitkeep');

  this.copy('app_dev.php', 'web/app_dev.php');
  this.copy('app.php', 'web/app.php');

  this.copy('config/config.yml', 'app/config/config.yml');
  this.copy('config/config_dev.yml', 'app/config/config_dev.yml');
  this.copy('config/config_prod.yml', 'app/config/config_prod.yml');
  this.copy('config/config_test.yml', 'app/config/config_test.yml');
  this.copy('config/parameters.yml.dist', 'app/config/parameters.yml.dist');
  this.copy('config/routing.yml', 'app/config/routing.yml');
  this.copy('config/routing_dev.yml', 'app/config/routing_dev.yml');
  this.copy('config/security.yml', 'app/config/security.yml');

  this.copy('error404.html.twig', 'app/Resources/TwigBundle/views/Exception/error404.html.twig');

  this.mkdir('src');
};

AppGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.h5bp = function h5bp() {
  this.copy('favicon.ico', 'web/favicon.ico');
  this.copy('robots.txt', 'web/robots.txt');
};

AppGenerator.prototype.mainStylesheet = function mainStylesheet() {
  var css = 'main.' + (this.compassBootstrap ? 's' : '') + 'css';
  this.copy(css, 'web/styles/' + css);
};

AppGenerator.prototype.writeIndex = function writeIndex() {
  var bs;

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'base.html.twig'));
  this.indexFile = this.engine(this.indexFile, this);
  this.indexFile = this.appendFiles(this.indexFile, 'js', 'scripts/main.js', [
    'scripts/main.js'
  ], null, '.tmp');

  if (this.compassBootstrap) {
    // wire Twitter Bootstrap plugins
    bs = 'bower_components/sass-bootstrap/js/';

    this.indexFile = this.appendFiles(this.indexFile, 'js', 'scripts/plugins.js', [
      bs + 'affix.js',
      bs + 'alert.js',
      bs + 'dropdown.js',
      bs + 'tooltip.js',
      bs + 'modal.js',
      bs + 'transition.js',
      bs + 'button.js',
      bs + 'popover.js',
      bs + 'carousel.js',
      bs + 'scrollspy.js',
      bs + 'collapse.js',
      bs + 'tab.js'
    ], null, '.tmp');
  }
};

AppGenerator.prototype.app = function app() {
  this.mkdir('web');
  this.mkdir('web/scripts');
  this.mkdir('web/styles');
  this.mkdir('web/images');
  this.write('app/Resources/views/base.html.twig', this.indexFile);

  if (this.coffee) {
    this.write(
      'web/scripts/main.coffee',
      'console.log "\'Allo from CoffeeScript!"'
    );
  }
  else {
    this.write('web/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
  }
};

AppGenerator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: function() {

      console.log('\n\nI\'m all done. Running ' +
        chalk.yellow.bold('composer update') +
        ' for you to install the required dependencies.' +
        ' If this fails, try running the command yourself.\n\n')
      ;

      var process = this.spawnCommand('composer', ['update']);

      process.on('exit', function () {
        done();
      }.bind(this));
    }.bind(this)
  });
}
