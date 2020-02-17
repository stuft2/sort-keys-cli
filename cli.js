#!/usr/bin/env node
'use strict';
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const meow = require('meow');
const sort = require('sort-keys');

const cli = meow({
  flags: {
    deep: {
      type: 'boolean',
      alias: 'd',
      default: false
    }
  }
}, `
	Usage
	  $ sort-keys <source …>[ <destination>]
	Options
	  -d, --deep    Deep sort all objects
	<source>        Source JSON file
	<destination>   (Optional) Destination file location. Will overwrite source if not provided.
	Examples
	  Sort all keys in a JSON file all .png files in src folder into dist except src/goat.png
	  $ sort-keys example.json --deep
`);

(async () => {
  try {
    let [ source, destination ] = cli.input

    if (!source.endsWith('.json')) source = `${source}.json`
    source = resolve(process.cwd(), source)

    if (!destination) destination = source
    else {
      if (!destination.endsWith('.json')) destination = `${destination}.json`
      destination = resolve(process.cwd(), destination)
    }

    console.info('Source     :', source)
    console.info('Destination:', destination)

    const obj = JSON.parse(readFileSync(source, 'utf8'));
    const sorted = sort(obj, {
      deep: !!cli.flags.deep,
    });

    writeFileSync(destination, JSON.stringify(sorted))
  } catch (error) {
    if (error.name === 'SortKeysError') {
      console.error(error.message);
      process.exit(1);
    } else {
      throw error;
    }
  }
})();
