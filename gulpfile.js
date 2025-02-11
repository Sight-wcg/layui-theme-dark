import gulp from 'gulp';
import concat from 'gulp-concat';
import less from 'gulp-less';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import yargs from 'yargs';
import { Transform } from 'node:stream';

const { src, dest } = gulp;

// 命令行参数
const argv = yargs.default({
  selector: '.dark' // 自定义选择器
}).help().argv;

// 文件名
const fileName = 'layui-theme-dark';
const commentRE = /\/\*[^*]*\*+([^/][^*]*\*+)*\//g;

/**
 * 生成带自定义选择器的主题库
 */
export function buildSelector() {
  return src('src/*.css')
    .pipe(sourcemaps.init())
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
          contents = contents.replace(commentRE, '').trim();

          chunk.contents = Buffer.from(contents);
          callback(null, chunk);
        }
      })
    )
    .pipe(less())
    .pipe(concat('full.css', { newLine: '' }))
    .pipe(rename({ basename: `${fileName}-selector` }))
    .pipe(sourcemaps.write('.'))
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
    .pipe(sourcemaps.init())
    .pipe(concat('full.css', { newLine: '' }))
    .pipe(rename({ basename: fileName }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist'))
});

export function watch() {
  gulp.watch('src/*.css', gulp.series(['build']));
}
