/**
 * @typedef {object} IncludeFile
 *
 * @prop {boolean} ok
 * @prop {number} status
 * @prop {string} html
 */

/** @type {Map<string,IncludeFile | Promise<IncludeFile>>} */
const includeFiles = new Map();

/**
 *
 * @param {string} src
 * @param {'cors' | 'no-cors' | 'same-origin'} [mode='cors']
 *
 * @returns {Promise<IncludeFile>}
 */
export function requestInclude(src, mode = 'cors'){
  const prev = includeFiles.get(src);
  if (prev !== undefined) {
    return Promise.resolve(prev);
  }
  const fileDataPromise = fetch(src, { mode: mode }).then(async response => {
    const res = {
      ok: response.ok,
      status: response.status,
      html: await response.text()
    };
    includeFiles.set(src, res);
    return res;
  });
  includeFiles.set(src, fileDataPromise);
  return fileDataPromise;
}

class HtmlImport extends HTMLElement {
  constructor () {
    super();
  }

  static get observedAttributes () {
    return ['src', 'mode', 'allow-scripts'];
  }

  get src() {
    return this.getAttribute('src') || '';
  }

  set src(value) {
    this.setAttribute('src', value);
  }

  get mode() {
    return this.getAttribute('mode') || 'cors';
  }

  set mode(value) {
    this.setAttribute('mode', value);
  }

  get allowScripts() {
    return this.hasAttribute('allow-scripts');
  }

  set allowScripts(value) {
    this.toggleAttribute('allow-scripts', value);
  }

  /**
   * 执行 innerHTML 中的 <script></script>
   * @param {HTMLScriptElement} scripts
   */
  async executeScript(scripts) {
    const execQueue = function (script) {
      const newScript = document.createElement('script');
      [...script.attributes].forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.textContent = script.textContent;
      script.parentNode && script.parentNode.replaceChild(newScript, script);
      return script.src ? new Promise((resolve) => {
        newScript.async = false;
        newScript.addEventListener('load', e => resolve(e));
        newScript.addEventListener('error', e => resolve(e));
      }) : Promise.resolve();
    };
    // 按 <script> 顺序执行，确保上下文关联
    for (const script of scripts) {
      await execQueue(script);
      // console.log(`${script.src||script} loaded`, Date.now());
    }
  }

  async handleSrcChange() {
    try {
      const src = this.src;
      const file = await requestInclude(src, this.mode);

      if (src !== this.src) {
        return;
      }

      if (!file.ok) {
        this.emit('error', { detail: { status: file.status } });
        return;
      }

      this.innerHTML = file.html;

      if (this.allowScripts) {
        await this.executeScript(this.querySelectorAll('script'));
      }

      this.emit('load');
    } catch {
      this.emit('error', { detail: { status: -1 } });
    }
  }

  attributeChangedCallback (name) {
    if (name == 'src') {
      this.handleSrcChange();
    }
  }

  emit(name, options) {
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {},
      ...options
    });

    this.dispatchEvent(event);

    return event;
  }
}

if (!customElements.get('wc-include')) {
  customElements.define('wc-include', HtmlImport);
}
