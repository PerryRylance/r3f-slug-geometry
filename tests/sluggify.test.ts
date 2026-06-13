import {expect, test} from '@jest/globals';
import {spawnSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

test("fails when no args", () => {
	const result = spawnSync('node', ['dist/sluggify.js']);
	expect(result.status).toBe(1);
});

test("fails when input file not found", () => {
	const result = spawnSync('node', ['dist/sluggify.js', 'nonsense-file-that-does-not-exist.ttf']);
	expect(result.status).toBe(1);
});

test("sluggifies ttf font", () => {
	const inputFont = 'node_modules/three-slug/demo/fonts/DejaVuSansMono.ttf';
	const tempOutputFile = path.join(os.tmpdir(), `test-output-${Date.now()}.sluggish`);

	try {
		const result = spawnSync('node', ['dist/sluggify.js', inputFont, tempOutputFile]);
		expect(result.status).toBe(0);

		expect(fs.existsSync(tempOutputFile)).toBe(true);

		const fileBuffer = fs.readFileSync(tempOutputFile);
		const hash = crypto.createHash('md5').update(fileBuffer).digest('hex').toUpperCase();
		expect(hash).toBe('0670ED564C66AB4AF4F9EB7D91449F9F');
	} finally {
		if (fs.existsSync(tempOutputFile)) {
			fs.unlinkSync(tempOutputFile);
		}
	}
});
