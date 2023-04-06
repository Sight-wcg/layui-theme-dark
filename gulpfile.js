import gulp from 'gulp';
import concat from 'gulp-concat';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import replace  from 'gulp-replace';
import * as cssgrace from 'cssgrace';
import cssnested from 'postcss-nested';
import cssvar from 'postcss-css-variables';


const {parallel, series, src, dest} = gulp;

export function build(){
  const fileName = 'layui-theme-dark';
  return src('src/*.css')
    .pipe(concat('full.css', { newLine: '' }))
    .pipe(rename({ basename: fileName }))
    .pipe(dest('./dist'))
    .pipe(postcss([cssvar({ preserve: false, preserveInjectedVariables: false }), cssgrace]))
    .pipe(rename({ basename: `${fileName}-legacy` }))
    .pipe(dest('./dist'));
}
