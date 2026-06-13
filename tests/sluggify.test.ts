import {expect, test} from '@jest/globals';

test("fails when no args", () => {

    // TODO: Run sluggify with no args, check for exit code 1

});

test("fails when input file not found", () => {
    
    // TODO: Run sluggify via the CLI with a nonsense input file, check for exit code 1

});

test("sluggifies ttf font", () => {

    // TODO: Run sluggify via the CLI providing node_modules/three-slug/demo/fonts/DejaVuSansMono.ttf as the input file, output to a temporary file, verify the files hash is 0670ED564C66AB4AF4F9EB7D91449F9F

});
