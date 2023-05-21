import gulp from 'gulp';
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import replace  from 'gulp-replace';
import * as cssgrace from 'cssgrace';
import cssnested from 'postcss-nested';
import cssvar from 'postcss-css-variables';
import { exec, spawn, execSync } from 'child_process';


const {src, dest} = gulp;

export function build(){
  const fileName = 'layui-theme-dark';
  return src('src/*.css')
    .pipe(concat('full.css', { newLine: '' }))
    .pipe(rename({ basename: fileName }))
    .pipe(dest('./dist'))
    .pipe(postcss([/*ie8RgbaHack(),*/ cssvar({ preserve: false, preserveInjectedVariables: false }), cssgrace]))
    .pipe(rename({ basename: `${fileName}-legacy` }))
    .pipe(dest('./dist'));
}

export function watch(){
  gulp.watch('src/*.css', gulp.series(['build']));
}

// IE8
function ie8RgbaHack() {
  const reBLANK_LINE = /(\r\n|\n|\r)(\s*?\1)+/gi;
  const reText = /var\s*\(\s*(--lay-color-text-[1-4])\s*\)/;
  const reFill = /var\s*\(\s*(--lay-color-fill-[1-4])\s*\)/; 
  const textColorMap = {
    '--lay-color-text-1': '#FAFAFA',
    '--lay-color-text-2': '#F6F6F6',
    '--lay-color-text-3': '#E8E8E9',
    '--lay-color-text-4': '#BABABB',
  };
  const fillColorMap = {
    '--lay-color-fill-1': '#1D1D1D',
    '--lay-color-fill-2': '#262727',
    '--lay-color-fill-3': '#303030',
    '--lay-color-fill-4': '#39393A',
  };

  function insertDecl(decl, i, newDecl) {
    const prev = decl.prev();
    let declBefore;
    if (prev && prev.type == 'comment' && prev.raws.before.indexOf('\n') == -1) {
      declBefore = prev;
    } else {
      declBefore = decl;
    }
    decl.parent.insertBefore(declBefore, newDecl);
  }

  return {
    postcssPlugin: 'postcss-handle-text-color',
    Once(root) {
      root.walkDecls((decl,i) => {
        if (['color', 'border'].includes(decl.prop) && reText.test(decl.value)) {
          const newValue = textColorMap[decl.value.match(reText)[1].trim()];
          const reBefore = decl.raws.before.replace(reBLANK_LINE, '$1');
          insertDecl(decl, i, {
            before: reBefore,
            prop: 'color',
            value: newValue,
          });
        }
        if (['background', 'background-color'].includes(decl.prop) && reFill.test(decl.value)) {
          const newValue = fillColorMap[decl.value.match(reFill)[1].trim()];
          const reBefore = decl.raws.before.replace(reBLANK_LINE, '$1');
          insertDecl(decl, i, {
            before: reBefore,
            prop: 'background-color',
            value: newValue,
          });
        }
      });
    },
  };
}
