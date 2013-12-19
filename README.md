# Symfony2 web app generator

Yeoman generator that scaffolds out a Symfony2 web app.

## Features

* Integrate [RiorGruntDistBundle](http://github.com/diegomarangoni/GruntDistBundle)
* Integrate [KunstmaanLiveReloadBundle](https://github.com/Kunstmaan/KunstmaanLiveReloadBundle)
* CSS Autoprefixing
* Built-in preview server with LiveReload
* Automagically lint your scripts
* Automagically wire up your Bower components with [bower-install](https://github.com/stephenplusplus/grunt-bower-install).
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Mocha Unit Testing with PhantomJS
* Optional - Leaner Modernizr builds (new)

For more information on what `generator-sf2` can do for you, take a look at the [Grunt tasks](https://github.com/yeoman/generator-sf2/blob/master/app/templates/_package.json) used in our `package.json`.

## Getting Started

- Install: `npm install -g generator-sf2`
- Run: `yo sf2`
- Run `grunt` for building and `grunt serve` for preview

Note: `grunt server` was previously used for previewing in earlier versions of the project and is being deprecated in favor of `grunt serve`.

## Options

* `--skip-install`

  Skips the automatic execution of `bower`, `npm` and `composer` after scaffolding has finished.
  

## Contribute

Note: We are regularly asked whether we can add or take away features. If a change is good enough to have a positive impact on all users, we are happy to consider it.

If not, `generator-sf2` is fork-friendly and you can always maintain a custom version which you `npm install && npm link` to continue using via `yo sf2` or a name of your choosing.


## License

[MIT license](http://opensource.org/licenses/MIT)
