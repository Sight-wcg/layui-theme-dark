/**
 * WIP 
 * 移植自 https://github.com/vueuse/vueuse/tree/main/packages/core/useColorMode
 */
// @ts-ignore
layui.define(['jquery'], function (exports) {
  'use strict';

  /** @type {jQuery}*/
  var $ = layui.jquery;

  var MOD_NAME = 'colorMode';
  var document = window.document;

  var colorMode = {
    /**
     * @typedef {object} initOptions
     * @prop {string} [selector="html"] - 应用于目标元素的 CSS 选择器
     * @prop {string} [attribute="class"] - 应用于目标元素的 HTML 属性
     * @prop {string} [initialValue='auto'] - 初始颜色模式
     * @prop {Object.<string, string>} [modes]- 颜色模式。value 为添加到 HTML 属性上的值
     * @prop {(mode: string, defaultHandler: () => void) => void} [onChanged] - 用于处理更新的自定义处理程序，指定时，默认行为将被覆盖。
     * @prop {Storage} [storage=localStorage] - 将数据持久化到 localStorage/sessionStorage 的键。传递 `null` 以禁用持久性
     * @prop {string | null} [storageKey='color-scheme'] - 持久化使用的 key
     * @prop {boolean} [disableTransition=true] - 禁用切换时的过渡 {@link https://paco.me/writing/disable-theme-transitions}
     *
     */

    /**
     *
     * @param {initOptions} options
     */
    init: function (options) {
      var defaults = {
        selector: 'html',
        attribute: 'class',
        initialValue: 'auto',
        modes: {
          auto: '',
          light: 'light',
          dark: 'dark',
        },
        storage: localStorage,
        storageKey: 'color-scheme',
        disableTransition: true,
      };

      var opts = $.extend(true, {}, defaults, options);

      // 当前颜色模式
      var state;
      // 系统颜色模式
      var system;
      // 初始化 storage
      var store =
        opts.storageKey == null
          ? opts.initialValue
          : (function () {
              var v = opts.storage.getItem(opts.storageKey);
              if (!v) {
                opts.storage.setItem(opts.storageKey, opts.initialValue);
                return opts.initialValue;
              }
              return opts.storage.getItem(opts.storageKey);
            })();

      /**
       * 更新 HTML 属性值
       * @param {String} selector
       * @param {String} attribute
       * @param {String} value
       */
      var updateHTMLAttrs = function (selector, attribute, value) {
        var el = typeof selector === 'string' ? document.querySelector(selector) : undefined;
        if (!el) return;

        /**@type HTMLStyleElement */
        var style;

        if (opts.disableTransition) {
          style = document.createElement('style');
          style.appendChild(
            document.createTextNode(
              '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
            )
          );
          document.head.appendChild(style);
        }

        if (attribute === 'class') {
          var current = value.split(/\s/g);
          $.each(opts.modes, function (_, modeval) {
            $.each((modeval || '').split(/\s/g), function (_, v) {
              if (!v) return;
              if (current.indexOf(v) !== -1) {
                el.classList.add(v);
              } else {
                el.classList.remove(v);
              }
            });
          });
        } else {
          el.setAttribute(attribute, value);
        }

        if (opts.disableTransition) {
          // 调用 getComputedStyle 强制浏览器重绘
          // @ts-expect-error unused variable
          var _ = window.getComputedStyle(style).opacity;
          document.head.removeChild(style);
        }
      };

      /**
       * 更新状态
       * @param {String} mode - 颜色模式
       */
      var updateState = function (mode) {
        store = opts.storageKey == null ? mode : opts.storage.getItem(opts.storageKey);

        state = store === 'auto' ? system : store;
      };

      var prefersColorScheme = (function () {
        var isSupported = window && 'matchMedia' in window && typeof window.matchMedia === 'function';
        if (!isSupported) {
          system = 'light';
          onChanged(system);
          return;
        }

        var darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        var update = function () {
          var preferredDark = darkThemeMediaQuery.matches;
          system = preferredDark ? 'dark' : 'light';
          onChanged(system);
        };
        update();
        if ('addEventListener' in darkThemeMediaQuery) {
          darkThemeMediaQuery.addEventListener('change', update);
        } else {
          // @ts-ignore 已弃用
          darkThemeMediaQuery.addListener(update);
        }
      })();

      function defaultOnChanged() {
        updateHTMLAttrs(opts.selector, opts.attribute, opts.modes[state]);
      }

      function onChanged(mode) {
        updateState(mode);
        if (opts.onChanged) {
          opts.onChanged(state, defaultOnChanged);
        } else {
          defaultOnChanged();
        }
      }

      return {
        setMode: function (mode) {
          if (opts.storageKey) {
            opts.storage.setItem(opts.storageKey, mode);
          }
          onChanged(mode);
        },
        mode: function () {
          return state;
        },
      };
    },
    addStyle: function (id, cssStr) {
      var el = /** @type {HTMLStyleElement} */ (document.getElementById(id) || document.createElement('style'));
      if (!el.isConnected) {
        el.type = 'text/css';
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = cssStr;
    },
  };

  exports(MOD_NAME, colorMode);
});
