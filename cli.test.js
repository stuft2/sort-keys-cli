const test = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { writeFileSync, readFileSync, unlinkSync } = require('node:fs')
const path = require('node:path')

const CLI_PATH = path.resolve(__dirname, 'cli.js')

/**
 * Creates a temporary file with specified content.
 * Returns the file path and a cleanup function.
 *
 * @param {string} prefix - File name prefix.
 * @param {string} content - Content to write in the file.
 * @returns {{filePath: string, cleanup: () => void}}
 */
function createTempFile(prefix, content) {
	const filePath = path.resolve(__dirname, `${prefix}-${Date.now()}.tmp`)
	writeFileSync(filePath, content, 'utf-8')

	return {
		filePath,
		cleanup: () => unlinkSync(filePath),
	}
}

/** Helper to run the CLI command */
function runCli(args, input = null) {
	return spawnSync('node', [CLI_PATH, ...args], {
		input,
		encoding: 'utf-8',
	})
}

test('should sort json files', () => {
	const input = JSON.stringify({ z: 1, a: 2 })
	const expectedOutput = JSON.stringify({ a: 2, z: 1 }, null, 2)

	const inputFile = createTempFile('input', input)
	const outputFile = createTempFile('output', '') // Empty output file

	runCli([inputFile.filePath, outputFile.filePath])

	const outputData = readFileSync(outputFile.filePath, 'utf-8')
	assert.equal(outputData, expectedOutput)

	inputFile.cleanup()
	outputFile.cleanup()
})

test('should not sort non-json files', () => {
	const inputFile = createTempFile('input', 'Not a JSON file')
	const outputFile = createTempFile('output', '')

	const result = runCli([inputFile.filePath, outputFile.filePath])

	assert.equal(result.status, 1)
	assert.match(result.stderr, /Unexpected token/)

	inputFile.cleanup()
	outputFile.cleanup()
})

test('should sort json stdin', () => {
	const inputData = JSON.stringify({ z: 1, a: 2 })
	const expectedOutput = JSON.stringify({ a: 2, z: 1 }, null, 2)

	const result = runCli(['--std'], inputData)

	assert.equal(result.status, 0)
	assert.equal(result.stdout.trim(), expectedOutput)
})

test('should not sort non-json stdin', () => {
	const inputData = 'Not a JSON string'

	const result = runCli(['--std'], inputData)

	assert.equal(result.status, 1)
	assert.match(result.stderr, /Unexpected token/)
})
