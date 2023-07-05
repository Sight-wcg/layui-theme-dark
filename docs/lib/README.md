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
