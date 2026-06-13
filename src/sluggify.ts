#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { SlugGenerator } from 'three-slug';

function printHelp() {
	console.log(`
Usage: sluggify <input-font-path> [output-sluggish-path] [options]

Options:
  --full-range           Include all unicode codepoints (default: false, basic printable ASCII 32-126 only)
  --whitelist <cps>      Comma-separated list of unicode codepoints to include (e.g. 48,49,50 for '0','1','2')
  -h, --help             Show this help message
`);
}

async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
		printHelp();
		process.exit(0);
	}

	// Parse options
	let fullRange = false;
	let whitelist: number[] | null = null;
	const positionalArgs: string[] = [];

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === '--full-range') {
			fullRange = true;
		} else if (arg === '--whitelist') {
			const nextArg = args[i + 1];
			if (!nextArg || nextArg.startsWith('-')) {
				console.error('Error: --whitelist requires a comma-separated list of numbers');
				process.exit(1);
			}
			whitelist = nextArg.split(',').map(s => {
				const val = parseInt(s.trim(), 10);
				if (isNaN(val)) {
					console.error(`Error: Invalid codepoint in whitelist: "${s}"`);
					process.exit(1);
				}
				return val;
			});
			i++;
		} else if (arg.startsWith('-')) {
			console.error(`Error: Unknown option "${arg}"`);
			printHelp();
			process.exit(1);
		} else {
			positionalArgs.push(arg);
		}
	}

	if (positionalArgs.length === 0) {
		console.error('Error: Missing input font path');
		printHelp();
		process.exit(1);
	}

	const inputPath = positionalArgs[0];
	const outputPath = positionalArgs[1] || inputPath.replace(path.extname(inputPath), '.sluggish');

	if (!fs.existsSync(inputPath)) {
		console.error(`Error: Input file does not exist at "${inputPath}"`);
		process.exit(1);
	}

	console.log(`Reading font from: ${inputPath}...`);
	const fileBuffer = fs.readFileSync(inputPath);

	// Convert Node Buffer to standard ArrayBuffer
	const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);

	console.log('Generating Slug layout textures and metrics...');
	const generator = new SlugGenerator({ fullRange, whitelist });

	try {
		const generatedData = await generator.generateFromBuffer(arrayBuffer);
		console.log(`Successfully generated data for ${generatedData.codePoints.size} glyphs.`);

		console.log('Packing data into .sluggish binary format...');
		const packedBuffer = generator.exportSluggish(generatedData);

		console.log(`Writing packed binary to: ${outputPath}...`);
		fs.writeFileSync(outputPath, Buffer.from(packedBuffer));
		console.log(`Done! Exported ${packedBuffer.byteLength} bytes to ${outputPath}.`);
	} catch (error) {
		console.error('Generation failed:', error);
		process.exit(1);
	}
}

main().catch(err => {
	console.error('Unexpected error:', err);
	process.exit(1);
});
