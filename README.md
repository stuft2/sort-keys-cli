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
<source>        Source JSON file
<destination>   (Optional) Destination file location. Will overwrite source if not provided.
```

## Examples
```bash
Sort all keys in a JSON file
$ sort-keys example.json --deep
```
