# layui-theme-dark

通过 [postcss](https://github.com/postcss/postcss) 和 `@arco-design/color` 生成的 layui 暗色主题。

# 使用

 将 `layui-theme-dark.css` 添加到你的页面
 ```
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/layui@2.8.0-rc.13/dist/css/layui.min.css">
 <link rel="stylesheet" href="./layui-theme-dark.css">
 ```
 通过控制 `class="theme-dark"` 切换主题
 ```
 // html
 <body class="theme-dark">
 </body>
 
 // js
 $('body').toggleClass('theme-dark')
 ```
 
