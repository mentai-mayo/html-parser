import * as fs from 'fs';

import * as HTML from './tsbuild/html.mjs';

const t01: string = fs.readFileSync('testcase/t01.html', { encoding: 'utf-8' });
const t02: string = fs.readFileSync('testcase/t02.html', { encoding: 'utf-8' });
const t03: string = fs.readFileSync('testcase/t03.html', { encoding: 'utf-8' });

console.log('----- test-01 -----');
console.log(t01);
console.log(HTML.parse(t01));

console.log('----- test-02 -----');
console.log(t02);
console.log(HTML.parse(t02));

console.log('----- test-03 -----');
console.log(t03);
console.log(HTML.parse(t03));
