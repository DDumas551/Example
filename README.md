# Catchfire Banner Ad Scaffold

> Scaffolding for multiple, similarly structured banner ads.

## Setup

1. `npm install` - install node_modules
2. `npm run scaffold` - create `./src/` directory and populate with starter files

`scaffold` task copies files from `./boilerplate/` into individual directories - one for
each variant/size combination. See gulp task for more info. Running this command
multiple times will not overwrite files that already exist.

## Build

`npm run build` - compile/minify/compress all files in `./src/` into `./dist/`

## Development

`npm run watch` - build files and spin up a browsersync instance. Window will
reload when files are updated.

## Zipping

`npm run zip` - compresses files from `./dist/` into `./zip/`
