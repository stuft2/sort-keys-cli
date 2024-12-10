#!/usr/bin/env node

'use strict';

const { createReadStream, createWriteStream } = require('fs')
const { resolve } = require('path')
const meow = require('meow');
const sort = require('sort-keys');

const cli = meow({
  flags: {
    deep: {
      type: 'boolean',
      alias: 'd',
      default: false
    },
    std: {
      type: 'boolean',
      alias: 's',
      default: false
    }
  }
}, `
	Usage
	  $ sort-keys <source>[ <destination>]
	Options
	  -d, --deep    Deep sort all objects
    -s, --std.    Use STDIN and STDOUT instead of files
	<source>        Source JSON file (if not using STDIN)
	<destination>   (Optional) Destination file location (if not using STDOUT). Will overwrite source if not provided.
	Examples
	  Sort all keys in a JSON file all .png files in src folder into dist except src/goat.png
	  $ sort-keys example.json --deep

    Sort all keys in a JSON file using STDIN and STDOUT
    $ cat example.json | sort-keys -s --deep | sponge example.json
`);

const checkSuffix = (filename) => 
  !filename.endsWith('.json') ? `${filename}.json` : filename

const getSource = (cli) => {
  if (!!cli.flags.std) {
    return process.stdin
  }

  let [ source ] = cli.input

  source = resolve(process.cwd(), checkSuffix(source))

  return createReadStream(source, { encoding: "utf-8" })
}

const getDestination = (cli) => {
  if (!!cli.flags.std) {
    return process.stdout
  }

  let [ _, destination ] = cli.input

  destination = resolve(process.cwd(), checkSuffix(destination))

  return createWriteStream(destination, { encoding: "utf-8" })
}

const readJSON = (stream) => {
  let data = []

  stream.setEncoding("utf-8")

  return new Promise((resolve, reject) => {
    stream.on("error", reject)

    stream.on("data", (chunk) => data.push(chunk))

    stream.on("end", () => {
      try {
        resolve(JSON.parse(data.join("")))
      }
      catch(e) {
        reject(e)
      }
    })
  })
}
  
(async () => {
  try {
    const source = getSource(cli)
    const obj = await readJSON(source)
    const sorted = sort(obj, {
      deep: !!cli.flags.deep,
    });

    const destination = getDestination(cli)
    destination.write(JSON.stringify(sorted, null, 2))
  } catch (error) {
    if (error.name === 'SortKeysError') {
      console.error(error.message);
      process.exit(1);
    } else {
      throw error;
    }
  }
})();
