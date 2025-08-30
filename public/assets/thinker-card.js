// thinker-card.ts
class ThinkerCard extends HTMLElement {
  static get observedAttributes() { return ["data-src"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._abort = new AbortController();
    this._loaded = false;
    this._data = null;
  }

  connectedCallback() {
    if (this._loaded) return;
    const src = this.getAttribute("data-src");
    if (src) this._load(src);
    else {
      const script = this.querySelector('script[type="application/json"]');
      if (script) this._safeSet(JSON.parse(script.textContent || "{}"));
      else this._renderError("No data");
    }
  }

  disconnectedCallback() {
    this._abort.abort();
  }

  attributeChangedCallback(name, oldV, newV) {
    if (name === "data-src" && oldV !== newV && newV) this._load(newV);
  }

  async _load(url) {
    try {
      const data = await this._fetchWithRetry(url, 3);
      this._safeSet(data);
    } catch (e) {
      this._renderError(String(e));
    }
  }

  async _fetchWithRetry(url, max) {
    let n = 0;
    let last;
    while (n < max) {
      try {
        const res = await fetch(url, { signal: this._abort.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        if (this._abort.signal.aborted) throw e;
        last = e;
        n += 1;
        await new Promise(r => setTimeout(r, 200 * Math.pow(2, n - 1)));
      }
    }
    throw last || new Error("Failed");
  }

  _safeSet(raw) {
    const data = this._normalize(raw);
    this._data = data;
    this._loaded = true;
    this._render();
  }

  _normalize(input) {
    const d = typeof input === "object" && input ? input : {};
    return {
      name: String(d.name || "Unknown"),
      domain: String(d.domain || ""),
      focus: String(d.focus || ""),
      blurb: String(d.blurb || ""),
      buttons: Array.isArray(d.buttons) ? d.buttons : [],
      tabs: Array.isArray(d.tabs) ? d.tabs : [],
    };
  }

  _renderError(msg) {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="card"><p class="error">Failed to load. ${escapeHtml(msg)}</p></div>
    `;
  }

  _render() {
    const d = this._data;
    const tabsHtml = d.tabs.map((t, i) => `
      <button class="tab" data-i="${i}" aria-selected="${i===0}">${escapeHtml(t.title || "Tab")}</button>
    `).join("");

    const panelsHtml = d.tabs.map((t, i) => `
      <section class="panel" data-i="${i}" style="display:${i===0?"block":"none"}">
        ${sectionFrom(t.sections || [])}
      </section>
    `).join("");

    const buttonsHtml = d.buttons.map(b => `
      <a class="pill" href="${escapeAttr(b.href || "#")}" target="_blank" rel="noreferrer">${escapeHtml(b.label || "Open")}</a>
    `).join("");

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <article class="card">
        <header>
          <h3 class="title">${escapeHtml(d.name)}</h3>
          <div class="badges">
            ${d.domain ? `<span class="badge">${escapeHtml(d.domain)}</span>` : ""}
            ${d.focus ? `<span class="badge badge-soft">${escapeHtml(d.focus)}</span>` : ""}
          </div>
        </header>
        ${d.blurb ? `<p class="blurb">${escapeHtml(d.blurb)}</p>` : ""}
        ${buttonsHtml ? `<div class="actions">${buttonsHtml}</div>` : ""}
        ${d.tabs.length ? `
          <div class="tabs" role="tablist">${tabsHtml}</div>
          <div class="panels">${panelsHtml}</div>
        ` : ""}
      </article>
    `;

    const tabs = this.shadowRoot.querySelectorAll(".tab");
    tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-i"));
        tabs.forEach(b => b.setAttribute("aria-selected", String(b === btn)));
        this.shadowRoot.querySelectorAll(".panel").forEach(p => {
          p.style.display = p.getAttribute("data-i") === String(i) ? "block" : "none";
        });
      }, { once: false });
    });
  }
}

const styles = `
:host { display:block }
.card { border:1px solid #e5e7eb; border-radius:12px; padding:16px; background:#fff; box-shadow:0 2px 10px rgba(0,0,0,.03) }
.title { margin:0 0 8px 0; font-size:22px; color:#0f172a }
.badges { display:flex; gap:8px; margin:8px 0 12px 0 }
.badge { background:#eef2ff; color:#3730a3; padding:6px 10px; border-radius:999px; font-weight:500; font-size:13px }
.badge-soft { background:#ecfdf5; color:#047857 }
.blurb { color:#475569; margin:0 0 12px 0 }
.actions { display:flex; gap:10px; margin:8px 0 12px 0; flex-wrap:wrap }
.pill { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(90deg,#6366f1,#22d3ee); color:#fff; padding:8px 14px; border-radius:999px; text-decoration:none; font-weight:600; font-size:14px }
.pill + .pill { background:#059669 }
.tabs { display:flex; gap:8px; border-bottom:1px solid #e5e7eb; padding-bottom:8px; margin-top:8px }
.tab { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:6px 10px; font-size:14px; color:#0f172a; cursor:pointer }
.tab[aria-selected="true"] { background:#ffffff; border-color:#6366f1; color:#1f2937 }
.panels { padding-top:12px }
.section { margin:12px 0; border:1px solid #f1f5f9; border-radius:10px; padding:12px; background:#fbfdff }
.section h4 { margin:0 0 6px 0; font-size:15px; color:#0f172a }
.section p { margin:0; color:#475569 }
.error { color:#b91c1c }
`;

function sectionFrom(arr) {
  return arr.map(s => `
    <div class="section">
      ${s.heading ? `<h4>${escapeHtml(s.heading)}</h4>` : ""}
      ${s.body ? `<p>${escapeHtml(s.body)}</p>` : ""}
    </div>
  `).join("");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function escapeAttr(s) {
  return escapeHtml(s);
}

customElements.define("thinker-card", ThinkerCard);
export {};