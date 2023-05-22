import fs from 'fs';
import { parse, resolve } from 'path';
import { generate } from '@arco-design/color';

function cssToJson(css) {
  const commentRE = /\/\*[^*]*\*+([^/][^*]*\*+)*\//g;
  const match = css.replace(commentRE, '').match(/:root\s*{([\s\S\n]*?)}/m);
  const object = Object.fromEntries(match[1].split('\n').map((i) => i.trim().slice(0, -1).split(': ')));
  return object;
}

const themes = {};
const colorList = {
  red: '#FF5722',
  blue: '#1E9FFF',
  lightblue: '#31BDEC',
  green: '#16baaa',
  lightgreen: '#16b777',
  orange: '#FFB800',
  cyan: '#2F4056',
  purple: '#a233c6',
};
themes.Default = cssToJson(fs.readFileSync(resolve(process.cwd(), 'src/css-variables.css'), 'utf-8'));
themes.ColorPaletteDark = {}
themes.ColorPaletteLight = {};
for (let [colorKey, colorVal] of Object.entries(colorList)) {
  generate(colorVal, { dark: true, list: true }).forEach((v, index) => {
    themes.ColorPaletteDark[`--lay-color-${colorKey}-${index + 1}`] = v
  });

  generate(colorVal, { dark: false, list: true }).forEach((v, index) => {
    themes.ColorPaletteLight[`--lay-color-${colorKey}-${index + 1}`] = v;
  });
}
themes.editable={}
for (let [key, val] of Object.entries(themes.Default)){
  if (/--lay-color-(bg|text|border|fill|hover|active)(-[1-5]|-white)?/.test(key)) {
    themes.editable[key] = val;
  }
}
 
fs.writeFileSync(resolve(process.cwd(), 'docs/themes.json'), `${JSON.stringify(themes, null, 2)}\n`, 'utf-8');
