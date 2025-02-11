# layui-theme-dark

[Github](https://github.com/Sight-wcg/layui-theme-dark/) | [Demo](https://sight-wcg.github.io/layui-theme-dark/)

layui 深色主题

# 使用

将 [dist](./dist) 文件夹中的 `layui-theme-dark-selector.css` 添加到 layui 样式之后，通过改变 HTML 标签的类名切换主题

```js
/** JavaScript */
// 设置为深色主题
document.documentElement.classList.add('dark')
// 恢复浅色主题
document.documentElement.classList.remove('dark')
// 切换深/浅色主题
document.documentElement.classList.toggle('dark')
```

```html
<!-- HTML -->
<!--light-->
<html> ... </html>

<!--dark-->
<html class="dark"> ... </html>
```

**CDN**

```html
<link rel="stylesheet" href="https://unpkg.com/layui-theme-dark/dist/layui-theme-dark-selector.css">
```

<details><summary>跟随系统主题自动切换</summary>

```js
var darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkThemeMediaQuery.addEventListener(function(e){
  if(e.matches) {
    document.documentElement.classList.add('dark')
  }else{
    document.documentElement.classList.remove('dark')
  }
});

```

</details>

<details>
<summary>持久化</summary>

```js
var APPERANCE_KEY = 'layui-theme-mode-prefer-dark'

var savedPreferDark = localStorage.getItem(APPERANCE_KEY)

if(
  savedPreferDark === 'true' ||
  (!savedPreferDark && window.matchMedia('(prefers-color-scheme: dark)').matches)
){
  document.documentElement.classList.add('dark')
}

document.querySelector('#toggle-dark').addEventListener('click', function(){
  var cls = document.documentElement.classList;
  cls.toggle('dark');
  localStorage.setItem(APPERANCE_KEY, String(cls.contains('dark')))
})
```

</details>


# 第三方模块

对一些使用广泛的第三方模块行了支持，存放在 [ext](./ext) 目录，默认未集成

- [layui-soul-table](https://github.com/yelog/layui-soul-table)

- [xm-select](https://gitee.com/maplemei/xm-select)

# 构建

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

# 常见问题

<details><summary>iframe 版 Admin，打开新页面会有闪烁?</summary>

  - 方案一：将切换主题的代码放在 `<head>` 标签中(推荐)

    ```js
    <script>
    (function(){
      window.APPERANCE_KEY = 'theme-mode'
      var headTagEl = document.getElementsByTagName('head')
      var linkTagEl = document.createElement('link')
      var savedPreferTheme= localStorage.getItem(APPERANCE_KEY)

      if(savedPreferTheme === 'dark'){
        linkTagEl.href = '' // 这里写文件链接
        linkTagEl.rel='stylesheet'
        linkTagEl.id='layui_theme_css'
        headTagEl[0].appendChild(linkTagEl)
        document.documentElement.className += ' dark'
      }
    })();
    </script>
    ```
 
  - 方案二：创建 iframe 时，使用 `display:none` 隐藏 iframe 元素, 然后在 iframe 的 onload 事件回调中更改 display 属性为 `display:block`
  > iframe 类型的 Admin 模板中的子页面，通过切换 href 属性动态引入样式文件会更方便，参考以下代码：[layui-theme-dark/commit/8b36a8](https://github.com/Sight-wcg/layui-theme-dark/commit/8b36a878673beb105b1ae633d121b5c2c7005358#diff-e07d531ac040ce3f40e0ce632ac2a059d7cd60f20e61f78268ac3be015b3b28fL41)
    ```html
    <iframe onload="this.style.display='block';" style="display:none;" >
    ```

</details>

<details><summary>如何处理图片？</summary>
  
  - 方案一：增加透明度，适用于简单图片和纯色背景
    
    ```css  
    .dark body img {
       opacity: 0.8;
    }
    ```

  - 方案二：叠加一个灰色半透明的层，适用于背景图，非纯色背景等

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

</details>

<details><summary>我的项目对 layui 的样式二次定制过，可以使用吗？</summary><br>
  
  根据使用后的效果、适配成本和难度酌情使用

</details>

**一些可能有用的链接**
  - [使用 CSS 自定义属性（变量）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
  - [使用编程方法测试媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries/Testing_media_queries)
  - [prefers-color-scheme](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme)


# 许可证

[MIT © 2023-present morning-star](./LICENSE)
