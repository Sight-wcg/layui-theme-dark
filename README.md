# layui-theme-dark

[Github](https://github.com/Sight-wcg/layui-theme-dark/) | [Demo](https://sight-wcg.github.io/layui-theme-dark/)

layui 暗色主题

# 使用

 将 `dist` 文件夹中的 `layui-theme-dark.css` 添加到你的页面，控制 `href` 属性切换主题
 ```
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/layui@2.8.0-rc.13/dist/css/layui.min.css">
 <link rel="stylesheet" href="./layui-theme-dark.css">
 ```

# IE9+ 

- 使用 `dist/layui-theme-dark-legacy.css` 文件，该文件将 CSS 变量转换为实际颜色，并针对 IE 做了一些兼容性优化。 二次定制后如果需要支持 IE，可以通过 PostCSS 插件将 CSS 变量转换为实际颜色，这里有一个 [Playground](https://madlittlemods.github.io/postcss-css-variables/playground/) 支持在线转换。
测试 IE9+ 无问题，IE8 下前景色有一些问题，需要单独处理。如果需要支持 IE8，修改前景色相关 CSS 变量，去除透明度，用不同色阶的灰色代替即可。

- 使用 [`css-vars-ponyfill`](https://github.com/jhildenbiddle/css-vars-ponyfill)，测试支持 IE10+，但是限制太多，制作主题切换很痛苦。
