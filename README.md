# layui-theme-dark

[Github](https://github.com/Sight-wcg/layui-theme-dark/) | [Demo](https://sight-wcg.github.io/layui-theme-dark/)


layui 暗色主题

# 使用

 #### 方式一
 
 通过[示例](https://sight-wcg.github.io/layui-theme-dark/)中的主题面板，自定义主题类名，例如 `.dark`，通过改变 HTML 标签的类名切换主题
 
 ```css
 /** CSS 生成 */
 :root{                      :root.dark{
   --color-bg: #000;           --color-bg: #000;
 }                     ==>   }
 .lay-card{                  .dark .lay-card{
   coloe: #FFF;                coloe: #FFF;
 }                           }
 ```
 ```js
/** JavasSript */
// 设置为暗色主题
document.documentElement.classList.add('dark')
// 恢复亮色主题
document.documentElement.classList.remove('dark')
// 切换亮/暗主题
document.documentElement.classList.toggle('dark')
```
#### 方式二

通过[示例](https://sight-wcg.github.io/layui-theme-dark/)中的主题面板，自定义主题属性名，例如`[theme-mode='dark']`，通过改变 HTML 标签上 `theme-mode` 属性的值切换主题

```css
/** CSS 生成 */
:root{                      :root[theme-mode='dark']{
  --color-bg: #000;           --color-bg: #000;
}                     ==>   }
.lay-card{                  [theme-mode='dark'] .lay-card{
  coloe: #FFF;                coloe: #FFF;
}                           }
```
```js
/** JavasSript */
// 设置为暗色主题
document.documentElement.setAttribute('theme-mode', 'dark')
// 恢复亮色主题
document.documentElement.removeAttribute('theme-mode')
```

 #### 方式三
 
 将 `dist` 文件夹中的 `layui-theme-dark.css` 添加到 layui 样式之后，通过切换 href 属性改变主题
 
 ```html
 <!-- HTML -->
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/layui@2.8.0-rc.13/dist/css/layui.min.css">
 <link id="layui_theme_css" rel="stylesheet" href="./layui-theme-dark.css">
 ```
 ```js
 /** JavasSript */
 // 设置为暗色主题
 document.getElementById('#layui_theme_css').setAttribute('href','./layui-theme-dark.css')
 // 恢复亮色主题
 document.getElementById('#layui_theme_css').removeAttribute('href')
 ```

# IE9+ 

- 使用 `dist/layui-theme-dark-legacy.css` 文件，该文件将 CSS 变量转换为实际颜色，并针对 IE 做了一些兼容性优化。 二次定制后如果需要支持 IE，可以通过 PostCSS 插件将 CSS 变量转换为实际颜色，这里有一个 [Playground](https://madlittlemods.github.io/postcss-css-variables/playground/) 支持在线转换。
测试 IE9+ 无问题，IE8 下前景色有一些问题，需要单独处理。如果需要支持 IE8，修改前景色相关 CSS 变量，去除透明度，用不同色阶的灰色代替即可。

- 使用 [`css-vars-ponyfill`](https://github.com/jhildenbiddle/css-vars-ponyfill)，测试支持 IE10+，但是限制太多，制作主题切换比较麻烦。
