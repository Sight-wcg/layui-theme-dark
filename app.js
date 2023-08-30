const VERSION = '2.8.16';
const layuicss = `https://unpkg.com/layui@${VERSION}/dist/css/layui.css`;
const layuijs = `https://unpkg.com/layui@${VERSION}/dist/layui.js`;
// const layuicss=`https://cdn.jsdelivr.net/gh/layui/layui@${VERSION}/dist/css/layui.css`;
// const layuijs=`https://cdn.jsdelivr.net/gh/layui/layui@${VERSION}/dist/layui.js`;
const rootPath = (function (src) {
  src = document.currentScript ? document.currentScript.src : document.scripts[document.scripts.length - 1].src;
  return src.substring(0, src.lastIndexOf('/') + 1);
})();
addLink({ href: layuicss });
addLink({ id: 'layui_theme_css', href: '' });
loadScript(layuijs, function () {
  layui
    .config({
      base: './docs/lib/',
    })
    .extend({
      drawer: 'drawer/drawer',
    });
  layui.use(['drawer', 'colorMode'], function () {
    const { $, element, form, layer, util, dropdown, drawer, colorMode } = layui;

    const APPERANCE_KEY = 'layui-theme-demo-prefer-dark';
    // 为方便定制主题，这里用改变 href 属性的方式切换主题
    const theme = colorMode.init({
      selector: '#layui_theme_css',
      attribute: 'href',
      initialValue: 'dark',
      modes: {
        light: '',
        dark: `${rootPath}dist/layui-theme-dark.css`,
      },
      storageKey: APPERANCE_KEY,
      onChanged(mode, defaultHandler) {
        const isAppearanceTransition =
          document.startViewTransition && !window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
        const isDark = mode === 'dark';

        $('#change-theme').attr('class', `layui-icon layui-icon-${isDark ? 'moon' : 'light'}`);

        const changeIframe = function () {
          const frames = window.frames;
          for (var i = 0; i < frames.length; i++) {
            defaultHandler(frames[i]);
          }
        };

        if (!isAppearanceTransition) {
          defaultHandler();
          changeIframe();
        } else {
          rippleViewTransition(isDark, function () {
            // 动画需要
            document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
            defaultHandler();
            changeIframe();
          });
        }
      },
    });

    dropdown.render({
      elem: '#change-theme',
      align: 'center',
      data: [
        {
          title: '深色模式',
          id: 'dark',
          icon: 'layui-icon-moon',
        },
        {
          title: '浅色模式',
          id: 'light',
          icon: 'layui-icon-light',
        },
        {
          title: '跟随系统',
          id: 'auto',
          icon: 'layui-icon-console',
        },
      ],
      templet(d) {
        return `
                <span style="display: flex;">
                  <i class="layui-icon ${d.icon}" style="margin-right: 8px"></i>
                  ${d.title}
                </span>`.trim();
      },
      click(obj) {
        const { id: mode } = obj;
        theme.setMode(mode);
      },
    });

    const path = location.hash.slice(1) || 'view/button';
    const type = $(`[data-path='${path}']`).data('type');
    loadView({
      path,
      type,
      done() {
        if (type === 'iframe') {
          theme.setMode(theme.mode());
        }
      },
    });

    util.event('lay-header-event', {
      menuLeft() {
        $('body').toggleClass('collapse');
      },
      menuRight() {
        drawer.open({
          area: '600px',
          url: './docs/tpl/theme.html',
          hideOnClose: true,
          id: 'drawer-theme-tpl',
          shade: 0.01,
        });
      },
    });

    element.on('nav(nav-side)', function (elem) {
      var path = elem.data('path');
      var type = elem.data('type');
      if (path) {
        loadView({
          path,
          type,
          done() {
            if (type === 'iframe') {
              theme.setMode(theme.mode());
            }
          },
        });
        if ($(window).width() <= 768) {
          $('body').toggleClass('collapse', false);
        }
      }
    });

    $('#layuiv').text(layui.v);

    function loadView({
      elem = '#body-container',
      path = 'view/button',
      type,
      prefix = './docs/',
      suffix = '.html',
      done,
    } = {}) {
      var containerDom = $(elem);
      var url = prefix + path + suffix;

      var loadTimer = setTimeout(() => {
        layer.load(2);
      }, 100);

      history.replaceState({}, '', '#' + path); // 因为并没有处理路由
      if (type === 'iframe') {
        var iframeEl = $('<iframe>')
          .attr('src', url)
          .css({ width: '100%', height: '90vh', border: 'none' })
          .hide()
          .on('load', function () {
            //clearTimeout(loadTimer);
            done && done();
            setTimeout(() => {
              layer.closeLast('loading');
              iframeEl.show();
            }, 100);
          });
        containerDom.html(iframeEl);
      } else {
        $.ajax({
          url: url,
          dataType: 'html',
        }).done(function (res) {
          containerDom.html(res);
          done && done();
          element.render();
          form.render();
          clearTimeout(loadTimer);
          layer.closeLast('loading');
        });
      }
      // 选中, 展开菜单
      $('#ws-nav-side')
        .find("[data-path='" + path + "']")
        .parent('dd')
        .addClass('layui-this')
        .closest('.layui-nav-item')
        .addClass('layui-nav-itemed');
    }
  });
});

function rippleViewTransition(isDark, callback) {
  // 移植自 https://github.com/vuejs/vitepress/pull/2347
  // 支持 Chrome 111+
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(function () {
    callback && callback();
  });
  transition.ready.then(function () {
    var clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: isDark ? clipPath : [...clipPath].reverse(),
      },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: isDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
      }
    );
  });
}

function addStyle(id, cssStr) {
  const el = document.getElementById(id) || document.createElement('style');
  if (!el.isConnected) {
    el.type = 'text/css';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = cssStr;
}

function addLink(opt) {
  const link = document.createElement('link');
  link.id = opt.id;
  link.rel = 'stylesheet';
  link.href = opt.href;
  document.head.appendChild(link);
}

function loadScript(url, callback) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = 'async';
  script.src = url;
  document.body.appendChild(script);
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'complete' || script.readyState == 'loaded') {
        script.onreadystatechange = null;
        callback && callback();
      }
    };
  } else {
    script.onload = function () {
      callback && callback();
    };
  }
}
