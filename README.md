# sort-keys-cli
CLI tool for sindresorhus/sort-keys

## Why
- Alphabetize any JSON file quickly for easier organization
- Can be used as a way to sort a Swagger/OpenAPI document

## Usage
```bash
$ sort-keys <source>[ <destination>]
```

## Options
```bash
-d, --deep      Deep sort all objects
-s, --std      Use STDIN and STDOUT instead of files
<source>        Source JSON file (if not using STDIN)
<destination>   (Optional) Destination file location (if not using STDOUT). Will overwrite source if not provided.
```

## Examples
```bash
Sort all keys in a JSON file
$ sort-keys example.json --deep
```
