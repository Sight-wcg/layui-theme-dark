const VERSION = '2.10.1';
const layuicss = `https://unpkg.com/layui@${VERSION}/dist/css/layui.css`;
const layuijs = `https://unpkg.com/layui@${VERSION}/dist/layui.js`;
// const layuicss=`https://cdn.jsdelivr.net/gh/layui/layui@${VERSION}/dist/css/layui.css`;
// const layuijs=`https://cdn.jsdelivr.net/gh/layui/layui@${VERSION}/dist/layui.js`;
const rootPath = (function (src) {
  src = (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT') ? document.currentScript.src : document.scripts[document.scripts.length - 1].src;
  return src.substring(0, src.lastIndexOf('/') + 1);
})();

const app = document.querySelector('#app')

addLink({ href: layuicss }).then(() => {
  app.style.display = 'block';
});

addLink({ id: 'layui_theme_css', href: `${rootPath}dist/layui-theme-dark-selector.css` });

// TODO 弃用，下个版本只支持选择器模式
//addLink({ id: 'layui_theme_css', href: `${rootPath}dist/layui-theme-dark.css` });

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

    const theme = colorMode.init({
      selector: 'html',
      attribute: 'class',
      initialValue: 'dark',
      modes: {
        light: '',
        dark: 'dark',
      },
      storageKey: APPERANCE_KEY,
      onChanged(mode, defaultHandler) {
        const isAppearanceTransition = document.startViewTransition && !window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
        const isDark = mode === 'dark';

        $('#change-theme').attr('class', `layui-icon layui-icon-${isDark ? 'moon' : 'light'}`);

        if (!isAppearanceTransition) {
          defaultHandler();
        } else {
          rippleViewTransition(isDark, function () {
            defaultHandler();
          });
        }
      },
    });

    routerTo({path: location.hash.slice(1) || 'view/button'});

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
      if (path) {
        routerTo({path});
        if ($(window).width() <= 768) {
          $('body').toggleClass('collapse', false);
        }
      }
    });

    $('#layuiv').text(layui.v);

    function routerTo({
      elem = '#router-view',
      path = 'view/button',
      prefix = './docs/',
      suffix = '.html',
    } = {}) {
      var routerView = $(elem);
      var url = prefix + path + suffix;

      var loadTimer = setTimeout(() => {
        layer.load(2);
      }, 100);

      history.replaceState({}, '', `#${path}`); // 因为并没有处理路由
      routerView.attr('src', url)
      routerView.off('load').on('load',function(){
        element.render();
        form.render();
        clearTimeout(loadTimer);
        layer.closeLast('loading');
      })

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

  // 兼容 jQuery 3 下隐式 event 全局对象不可用的问题
  if (!window.event) {
    window.event = new MouseEvent('click', {
      clientX: document.documentElement.clientWidth,
      clientY: 60,
    });
  }

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
  return new Promise((resolve) => {
    const link = Object.assign(document.createElement('link'), {
      rel: 'stylesheet',
      onload: () => resolve({ ...opt, status: 'success' }),
      onerror: () => resolve({ ...opt, status: 'error' }), // 为了在 Promise.all 的使用场景
      ...opt,
    });
    document.head.appendChild(link);
  });
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
