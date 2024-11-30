import gulp from 'gulp';
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
import less from 'gulp-less';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import * as cssgrace from 'cssgrace';
import cssnested from 'postcss-nested';
import cssvar from 'postcss-css-variables';
import yargs from 'yargs';
import { Transform } from 'node:stream';

const { src, dest } = gulp;

// 命令行参数
const argv = yargs.default({
  selector: '.dark' // 自定义选择器
}).help().argv;

// 文件名
const fileName = 'layui-theme-dark';

/**
 * 生成带自定义选择器的主题库
 */
export function buildSelector() {
  return src('src/*.css')
    .pipe(
      new Transform({
        objectMode: true,
        transform(chunk, enc, callback) {
          if (chunk.isNull()) {
            return callback(null, chunk);
          }

          const selector = argv.selector;
          const basename = chunk.basename;
          let contents = chunk.contents.toString();

          contents = basename === 'css-variables.css'
            ? contents.replace(/:root/g, `:root${selector}`)
            : `${selector}{${contents}}`;

          chunk.contents = Buffer.from(contents);
          callback(null, chunk);
        }
      })
    )
    .pipe(less())
    .pipe(concat('full.css', { newLine: '' }))
    .pipe(rename({ basename: `${fileName}-selector` }))
    .pipe(dest('./dist'));
}

/**
 * Build
 * @example
 * # 生成选择器为 .dark 的主题库
 * gulp build --selector .dark
 */
export const build = gulp.parallel(buildSelector, () => {
  return src('src/*.css')
    .pipe(concat('full.css', { newLine: '' }))
    .pipe(rename({ basename: fileName }))
    .pipe(dest('./dist'))
    .pipe(postcss([/*ie8RgbaReplace(),*/ cssvar({ preserve: false, preserveInjectedVariables: false }), cssgrace]))
    .pipe(rename({ basename: `${fileName}-legacy` }))
    .pipe(dest('./dist'));
})

// WIP
export function buildTiny() {
  const commentRE = /\/\*[^*]*\*+([^/][^*]*\*+)*\//g;
  const rootRE = /:root\s*{([\s\S\n]*?)}/m;
  const fileName = 'layui-theme-dark-tiny';
  return src('src/*.css')
    .pipe(concat('full.css', { newLine: '' }))
    .pipe(postcss([baseColorRulesExtractor(), cssvar({ preserve: false, preserveInjectedVariables: false })]))
    .pipe(replace(commentRE, ''))
    .pipe(replace(rootRE, ''))
    .pipe(rename({ basename: fileName }))
    .pipe(dest('./dist'));
}

export function watch() {
  gulp.watch('src/*.css', gulp.series(['build']));
}

// WIP
function baseColorRulesExtractor() {
  // 保留阴影和部分深色背景优化
  const ignoreDeclProp = ['box-shadow', 'opacity', 'filter', 'color-scheme'];
  const ignoreDeclVal = ['transparent', 'initial', 'none', '0', '0 0'];
  // 保留以避免破坏样式优先级
  const ignoreRules = [
    '.layui-input:focus,.layui-textarea:focus',
    '.layui-form-danger+.layui-form-select .layui-input,.layui-form-danger:focus',
    '.layui-input-wrap .layui-input:focus+.layui-input-split',
    '.layui-form-onswitch',
    '.layui-form-checked,.layui-form-checked:hover',
    '.layui-form-checked>div,.layui-form-checked:hover>div',
    '.layui-form-checked>i,.layui-form-checked:hover>i',
    '.layui-form-checkbox[lay-skin=primary]:hover>i',
    '.layui-form-checked[lay-skin=primary]>i',
    '.layui-laypage a:hover',
    /** 边框宽度处理 */
    '.layui-code-view',
  ];
  // 移除以避免破坏样式优先级
  const shouldRemovedRules = [
    '.layui-bg-black',
    '.layui-bg-gray',
    '.layui-font-black',
    '.layui-font-gray',
    '.layui-layer-dialog .layui-layer-content .layui-layer-face',
    '.layui-layer-loading-2:after',
    '.layui-layer-loading-2:after,.layui-layer-loading-2:before',
  ];
  const propRE = /--lay-color-(bg|text|border|fill|hover|active|black|gray)(-[1-13])?/;
  return {
    postcssPlugin: 'postcss-layui-theme-remove',
    Once(root) {
      root.walkDecls((decl) => {
        if (
          ignoreDeclProp.includes(decl.prop) ||
          ignoreDeclVal.includes(decl.value) ||
          ignoreRules.includes(decl.parent.selector)
        ) {
          return;
        }

        if (decl.parent.selector !== ':root' && !propRE.test(decl.value)) {
          decl.remove();
        }
      });

      root.walkRules((rule) => {
        if ((rule && !rule.nodes?.length) || shouldRemovedRules.includes(rule.selector)) {
          rule.remove();
        }
      });
    },
  };
}

// WIP IE8
function ie8RgbaReplace() {
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
    postcssPlugin: 'postcss-layui-color-replace',
    Once(root) {
      root.walkDecls((decl, i) => {
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
