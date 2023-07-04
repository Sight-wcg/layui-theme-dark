# layui-theme-dark

[Github](https://github.com/Sight-wcg/layui-theme-dark/) | [Demo](https://sight-wcg.github.io/layui-theme-dark/)

layui 深色主题

# 使用

#### 方式一

通过[演示](https://sight-wcg.github.io/layui-theme-dark/)中的主题面板，自定义主题类选择器，例如 `.dark`，通过改变 HTML 标签的类名切换主题

```css
/** CSS 生成 */
:root{                      :root.dark{
  --color-bg: #000;           --color-bg: #000;
}                     ==>   }
.lay-card{                  .dark .lay-card{
  color: #FFF;                color: #FFF;
}                           }
```

```js
/** JavaScript */
// 设置为深色主题
document.documentElement.classList.add('dark')
// 恢复亮色主题
document.documentElement.classList.remove('dark')
// 切换亮/暗主题
document.documentElement.classList.toggle('dark')
```

```html
<!-- HTML -->
<!--light-->
<html> ... </html>

<!--dark-->
<html class="dark"> ... </html>
```

#### 方式二

通过[演示](https://sight-wcg.github.io/layui-theme-dark/)中的主题面板，自定义主题属性选择器，例如`[theme-mode='dark']`，通过改变 HTML 标签上 `theme-mode` 属性的值切换主题

```css
/** CSS 生成 */
:root{                      :root[theme-mode='dark']{
  --color-bg: #000;           --color-bg: #000;
}                     ==>   }
.lay-card{                  [theme-mode='dark'] .lay-card{
  color: #FFF;                color: #FFF;
}                           }
```

```js
/** JavaScript */
// 设置为深色主题
document.documentElement.setAttribute('theme-mode', 'dark')
// 恢复亮色主题
document.documentElement.removeAttribute('theme-mode')
```

```html
<!-- HTML -->
<!--light-->
<html> ... </html>

<!--dark-->
<html theme-mode="dark"> ... </html>
```

#### 方式三

将 `dist` 文件夹中的 `layui-theme-dark.css` 添加到 layui 样式之后，通过切换 href 属性改变主题

```html
<!-- HTML -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/layui@2.8.0-rc.13/dist/css/layui.min.css">
<!--light-->
<link id="layui_theme_css" rel="stylesheet">
<!--dark-->
<link id="layui_theme_css" rel="stylesheet" href="./layui-theme-dark.css">
```

```js
/** JavaScript */
// 设置为深色主题
document.getElementById('#layui_theme_css').setAttribute('href','./layui-theme-dark.css')
// 恢复亮色主题
document.getElementById('#layui_theme_css').removeAttribute('href')
```

跟随系统主题自动切换

```js
var darkThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

darkThemeMediaQuery.addEventListener(function(e){
  if(e.matches) {
    document.documentElement.classList.add('dark')
  }else{
    document.documentElement.classList.remove('dark')
  }
});

```

持久化

```js
var APPERANCE_KEY = "layui-theme-mode-prefer-dark"

var savedPreferDark = localStorage.getItem(APPERANCE_KEY)

if(
  savedPreferDark === "true" ||
  (!savedPreferDark && window.matchMedia("(prefers-color-scheme: dark)").matches)
){
  document.documentElement.classList.add("dark")
  $('[lay-filter="toggle-theme"]').prop("checked", true)
}

form.on("switch(toggle-theme)", function(data) {
  var cls=document.documentElement.classList;
  cls.toggle("dark");
  localStorage.setItem(APPERANCE_KEY, String(cls.contains("dark")))
});
```

# 第三方模块

对一些高质量且使用广泛的第三方模块行了支持，存放在 ext 目录，默认未集成

- [layui-soul-table](https://github.com/yelog/layui-soul-table)

- [xm-select](https://gitee.com/maplemei/xm-select)

# ColorMode 模块（WIP）

开箱即用的主题切换（深色/浅色/自定义）模块，具有自动数据持久性。

**基本使用**

```js
layui.use(['colorMode'], function () {
  var colorMode = layui.colorMode
      
  var theme = colorMode.init()

  }
);
```

**配置**

模块仅处理 DOM 属性更改，以便在 CSS 中应用正确的选择器，不会处理实际的样式，主题或 CSS。
默认情况下，使用 auto 模式（与用户的浏览器首选项匹配），将类 dark 应用于 html 标签时启用深色模式，返回一个对象，用来获取和改变主题。

```js
var theme = colorMode.init()

theme.mode() // 'dark' | 'light'

theme.setMode('dark') // 设置为深色模式并持久化到 localstorage

theme.setMode('auto') // 设置为 auto 模式
```

也可以自定义以使其适用于大多数场景

```js
var theme = colorMode.init({
  selector: 'body',
  attribute: 'theme-mode',
  initialValue: 'light',
  modes: {
    auto: '',
    light: 'light',
    dark: 'dark',
    contrast: 'dark contrast',
  },
  storage: localStorage,
  storageKey: 'xxx-theme-mode',
  disableTransition: true,
})
```

如果上述配置仍不能满足您的需求，可以使用 onChanged 选项完全控制处理更新的方式

```js
var theme = colorMode.init({
  onChanged: function(mode, defaultHandler){
    // 自定义更新方式
  }
})
```

**API**

```ts
/**
 * @typedef {object} initOptions
 * @prop {string} [selector='html'] - 应用于目标元素的 CSS 选择器
 * @prop {string} [attribute='class'] - 应用于目标元素的 HTML 属性
 * @prop {string} [initialValue='auto'] - 初始颜色模式
 * @prop {Object.<string, string>} [modes]- 颜色模式。value 为添加到 HTML 属性上的值
 * @prop {(mode: string, defaultHandler: () => void) => void} [onChanged] - 用于处理更新的自定义处理程序，指定时，默认行为将被覆盖。mode 为颜色模式，defaultHandler 为默认处理程序
 * @prop {Storage} [storage=localStorage] - 将数据持久化到 localStorage/sessionStorage 的键。传递 `null` 以禁用持久性
 * @prop {string | null} [storageKey='color-scheme'] - 持久化使用的 key
 * @prop {boolean} [disableTransition=true] - 禁用切换时的过渡 {@link https://paco.me/writing/disable-theme-transitions}
 *
 */

/**
 *
 * @param {initOptions} options
 * @returns {{ mode: () => string; setMode: (mode: string) => void;}}
 */
colorMode.init(options)
```

# 构建指南

- 拉取代码

```bash
git clone https://github.com/Sight-wcg/layui-theme-dark.git
```

- 安装依赖

```bash
cd layui-theme-dark

npm install
```

- 运行

```bash
npm run watch

npm run dev
```

- 构建

```bash
npm run build
```

# [浏览器支持](https://caniuse.com/?search=css%20vars)

<img src="https://api.iconify.design/devicon:chrome.svg" style="margin-right: 0.4em; vertical-align: text-bottom;"> Chrome 43+
<br>
<img src="https://api.iconify.design/logos:microsoft-edge.svg" style="margin-right: 0.4em; vertical-align: text-bottom;"> Edge 16+
<br>
<img src="https://api.iconify.design/logos:firefox.svg" style="margin-right: 0.4em; vertical-align: text-bottom;"> Firefox 31+
<br>
<img src="https://api.iconify.design/devicon:safari.svg" style="margin-right: 0.4em; vertical-align: text-bottom;"> Safari 10+
<br>
<img src="https://api.iconify.design/logos:internetexplorer.svg" style="margin-right: 0.4em; vertical-align: text-bottom;"> *IE 9+

# 常见问题
- IE 下如何使用？

  方案一：使用 `dist/layui-theme-dark-legacy.css` 文件

    该文件将 CSS 变量转换为实际颜色，并针对 IE 做了一些兼容性转换，测试支持 IE9+。 二次定制后如果需要支持 IE，可以通过 PostCSS 插件将 CSS 变量转换为实际颜色，这里有一个 [PostCSS-CSS-Variables Playground](https://madlittlemods.github.io/postcss-css-variables/playground/) 支持在线转换

  方案二：使用 [css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill)

    使用方法请参考该项目的[官方文档](https://jhildenbiddle.github.io/css-vars-ponyfill)，测试支持 IE10+

- iframe 版 Admin，打开新页面会有闪烁？

  和您的主题应用/实现方式有关系，这里不做讨论，有变通的解决方法。创建 iframe 时，使用 `display:none` 隐藏 iframe 元素, 然后在 iframe 的 onload 事件回调中更改 display 属性为 `display:block`

  ```html
  <iframe onload="this.style.display='block';" style="display:none;" >
  ```

- 如何处理图片？

  方案一：增加透明度，适用于简单图片和纯色背景

  ```css  
  .dark body img {
    opacity: 0.8;
  }
  ```

  方案二：叠加一个灰色半透明的层，适用于背景图，非纯色背景等

  ```css
  .dark body .dark-mode-image-overlay {
    position: relative;
  }

  .daek body .dark-mode-image-overlay::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(50, 50, 50, 0.5);
   }
  ```

- 为什么包含所有的颜色规则，而不是仅包含深色必须的颜色规则？

  - 暗色色板降低饱和度，提高亮度，暗色下看起来更舒适一些，可以在主题面板自定义是否使用暗色色板

  - 避免意外破坏样式优先级，降低维护成本

  - 将来的版本可能会用到，可以自行删除不需要的样式

- 更细粒度（组件级）的颜色变量支持？

  考虑维护成本，暂时不会有，欢迎 PR

- 我的项目已经对 layui 的样式二次定制过了，可以使用吗？

  根据使用后的效果、适配成本和难度酌情使用

- 一些可能有用的链接
  - [使用 CSS 自定义属性（变量）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
  - [使用编程方法测试媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries/Testing_media_queries)
  - [prefers-color-scheme](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme)


# 许可证

[MIT © 2023-present, morning-star](./LICENSE)
