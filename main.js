import { MODULES, SLIDES, QUESTIONS, MOMENTS, QUIZ } from "./data.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const TOTAL = SLIDES.length - 1;
const pad = (n) => String(n).padStart(2, "0");
const src = (n, w) => `slides/${pad(n)}-${w}.webp`;
const srcset = (n) => `${src(n, 1400)} 1400w, ${src(n, 2560)} 2560w`;
const SIZES = "(max-width: 900px) and (orientation: portrait) 100vw, 85vw";
const moduleOf = (n) => MODULES.find((m) => m.slides.includes(n));
const modLabel = (m) => (m.id >= 1 && m.id <= 6 ? `Módulo ${m.short}` : m.title);
const plain = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const isPhonePortrait = () => matchMedia("(max-width: 900px) and (orientation: portrait)").matches;

function transition(update, type) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    return;
  }
  let t;
  try {
    t = document.startViewTransition({ update, types: type ? [type] : [] });
  } catch {
    t = document.startViewTransition(update); // navegadores sem suporte a "types"
  }
  // transição pulada ao navegar rápido: não é erro
  t.ready.catch(() => {});
  t.finished.catch(() => {});
  t.updateCallbackDone.catch(() => {});
}

/* ================= TELAS / ROTAS ================= */
const screens = ["home", "guia", "viewer", "quiz"];
let currentScreen = null;

function show(id) {
  if (currentScreen === id) return;
  const apply = () => {
    screens.forEach((s) => ($("#" + s).hidden = s !== id));
    currentScreen = id;
  };
  currentScreen ? transition(apply) : apply();
}

function route() {
  const h = location.hash.slice(1) || "inicio";
  const m = h.match(/^slide-(\d+)$/);
  if (m) {
    const n = Math.min(Math.max(+m[1], 1), TOTAL);
    show("viewer");
    if (n !== state.n || !state.rendered) goTo(n, "jump", { fromRoute: true });
  } else if (h === "guia") { show("guia"); if (!guia.step) guiaStep(1); }
  else if (h === "quiz") { show("quiz"); if (!quiz.started) startQuiz(); }
  else show("home");
}

function nav(target) {
  $$("dialog[open]").forEach((d) => d.close());
  if (target === "home") target = "inicio";
  if (target.startsWith("slide-")) {
    const n = +target.slice(6);
    if (context && !context.slides.includes(n)) setContext(null);
    if (currentScreen === "viewer") { goTo(n, "jump"); return; }
    state.n = state.target = n;
    state.rendered = false;
  }
  if (location.hash.slice(1) === target) route();
  else location.hash = target;
}

document.addEventListener("click", (e) => {
  const go = e.target.closest("[data-go]");
  if (go) { e.preventDefault(); const g = go.dataset.go;
    if (g === "slide-1") setContext(null);
    if (g === "guia") guiaStep(1);
    if (g === "quiz") quiz.started = false;
    nav(go.dataset.go); return; }
  const open = e.target.closest("[data-open]");
  if (open) { openSumario(); return; }
  const close = e.target.closest("[data-close]");
  if (close) close.closest("dialog").close();
});
addEventListener("hashchange", route);

/* ================= CONTEXTO (trilha / revisão do quiz) ================= */
let context = null; // { label, slides, action, actionLabel }

function setContext(c) {
  context = c;
  const b = $("#trail-banner");
  b.hidden = !c;
  if (c) {
    $("#exit-trail").textContent = c.actionLabel;
    $("#exit-trail").onclick = c.action;
  }
  if (state.rendered) renderChrome(state.n);
}

function startTrail(slides, label, startAt) {
  const sorted = [...new Set(slides)].sort((a, b) => a - b);
  setContext({
    label, slides: sorted,
    actionLabel: "Ver apresentação completa",
    action: () => setContext(null),
  });
  nav("slide-" + (startAt ?? sorted[0]));
}

/* ================= APRESENTAÇÃO ================= */
const state = { n: 1, rendered: false, token: 0 };
const img = $("#slide-img");
img.sizes = SIZES;

async function goTo(n, type = "jump", { fromRoute = false } = {}) {
  n = Math.min(Math.max(n, 1), TOTAL);
  const token = ++state.token;
  state.target = n;
  // decodifica antes para a transição não piscar
  const pre = new Image();
  pre.sizes = SIZES;
  pre.srcset = srcset(n);
  pre.src = src(n, 1400);
  try { await Promise.race([pre.decode(), new Promise((r) => setTimeout(r, 900))]); } catch {}
  if (token !== state.token) return;
  const update = () => render(n);
  state.rendered && currentScreen === "viewer" ? transition(update, type) : update();
  if (!fromRoute) history.replaceState(null, "", "#slide-" + n);
  preload(n + 1); preload(n - 1);
}

const preloaded = new Set();
function preload(n) {
  if (n < 1 || n > TOTAL || preloaded.has(n)) return;
  preloaded.add(n);
  const i = new Image();
  i.sizes = SIZES;
  i.srcset = srcset(n);
}

function render(n) {
  state.n = n;
  state.rendered = true;
  const s = SLIDES[n];
  img.srcset = srcset(n);
  img.src = src(n, 1400);
  img.alt = `Lâmina ${n}: ${s.alt}`;
  renderHotspots(n);
  renderRead(n);
  renderChrome(n);
}

function neighbors(n) {
  if (context) {
    const i = context.slides.indexOf(n);
    return { prev: context.slides[i - 1] ?? null, next: context.slides[i + 1] ?? null, i, len: context.slides.length };
  }
  return { prev: n > 1 ? n - 1 : null, next: n < TOTAL ? n + 1 : null };
}

function renderChrome(n) {
  const s = SLIDES[n], m = moduleOf(n), nb = neighbors(n);
  $("#v-mod").textContent = modLabel(m);
  $("#v-name").textContent = s.title.replace(/^Módulo \d+ · /, "");
  $("#counter").textContent = `${n} / ${TOTAL}`;
  $("#prev").disabled = $("#prev-b").disabled = nb.prev === null;
  const atEnd = nb.next === null;
  $("#next").disabled = false;
  $("#next").setAttribute("aria-label", atEnd ? "Ir para o quiz" : "Próximo slide");
  $("#next-b span").textContent = atEnd ? (context?.review ? "Voltar ao quiz" : "Quiz") : "Próximo";
  if (context) $("#trail-pos").textContent = nb.len > 1 && nb.i >= 0 ? `${context.label} · ${nb.i + 1} de ${nb.len}` : context.label;
  // barra de progresso por módulo
  $$(".seg", $("#progress")).forEach((seg) => {
    const mod = MODULES[+seg.dataset.m];
    const idx = mod.slides.indexOf(n);
    const pct = n > mod.slides.at(-1) ? 100 : idx >= 0 ? ((idx + 1) / mod.slides.length) * 100 : 0;
    seg.firstElementChild.style.width = pct + "%";
    seg.classList.toggle("current", idx >= 0);
  });
}

function buildProgress() {
  const p = $("#progress");
  p.innerHTML = MODULES.map((m) => `
    <button class="seg" data-m="${m.id}" style="flex:${m.slides.length}" aria-label="${modLabel(m)}: ${m.title}">
      <i></i><span class="seg-label">${m.id >= 1 && m.id <= 6 ? m.short + " · " : ""}${m.title}</span>
    </button>`).join("");
  p.addEventListener("click", (e) => {
    const seg = e.target.closest(".seg");
    if (!seg) return;
    setContext(null);
    goTo(MODULES[+seg.dataset.m].slides[0], "jump");
  });
}

function step(dir) {
  const nb = neighbors(state.target ?? state.n);
  const target = dir > 0 ? nb.next : nb.prev;
  if (target === null) {
    if (dir > 0) {
      if (context?.review) { context.action(); return; }
      setContext(null);
      quiz.started = false;
      nav("quiz");
    }
    return;
  }
  goTo(target, dir > 0 ? "forward" : "backward");
}
$("#next").onclick = $("#next-b").onclick = () => step(1);
$("#prev").onclick = $("#prev-b").onclick = () => step(-1);

/* hotspots: cartões da jornada e checklist */
const checks = store.get("jw-checks", [false, false, false]);
let hintShown = false;

function renderHotspots(n) {
  const s = SLIDES[n], box = $("#hotspots");
  box.innerHTML = "";
  $("#tap-hint").hidden = true;
  for (const h of s.hotspots || []) {
    const b = document.createElement("button");
    b.className = `hs ${h.type}${h.active ? " active" : ""}`;
    Object.assign(b.style, { left: h.x + "%", top: h.y + "%", width: h.w + "%", height: h.h + "%" });
    if (h.type === "go") {
      b.setAttribute("aria-label", h.label);
      b.onclick = () => { setContext(null); goTo(h.go, "jump"); };
    } else {
      b.setAttribute("role", "checkbox");
      b.setAttribute("aria-checked", checks[h.i]);
      b.setAttribute("aria-label", s.checklist[h.i]);
      b.innerHTML = `<span class="box">✓</span>`;
      b.onclick = () => toggleCheck(h.i);
    }
    box.append(b);
  }
  if (s.kind === "jornada" && !hintShown) {
    hintShown = true;
    const hint = $("#tap-hint");
    hint.textContent = matchMedia("(hover: none)").matches ? "Toque em uma etapa para ir direto a ela" : "Clique em uma etapa para ir direto a ela";
    hint.hidden = false;
  }
}

function toggleCheck(i) {
  checks[i] = !checks[i];
  store.set("jw-checks", checks);
  $$(`.hs.check`)[i]?.setAttribute("aria-checked", checks[i]);
  $$(`.checklist button`)[i]?.setAttribute("aria-checked", checks[i]);
  if (checks.every(Boolean)) hearts(14);
}

/* painel de leitura (texto do slide) */
function renderRead(n) {
  const s = SLIDES[n], m = moduleOf(n);
  $("#rp-mod").textContent = `${modLabel(m)} · Lâmina ${n} de ${TOTAL}`;
  $("#rp-title").textContent = s.title;
  let html = s.text;
  if (s.checklist) {
    html += `<ul class="checklist">${s.checklist.map((c, i) => `
      <li><button role="checkbox" aria-checked="${checks[i]}" data-check="${i}"><span class="box">✓</span><span>${c}</span></button></li>`).join("")}</ul>`;
  }
  $("#rp-text").innerHTML = html;
  $$("[data-check]", $("#rp-text")).forEach((b) => (b.onclick = () => toggleCheck(+b.dataset.check)));

  const rel = $("#rp-related");
  if (s.kind === "jornada") {
    rel.innerHTML = `<p>Ir para uma etapa</p><div class="jump-list">${MODULES.slice(1, 7).map((mm) => `
      <button data-jump="${s.hotspots[mm.id - 1].go}" class="${mm.id === s.step ? "current" : ""}"><b>${mm.id}</b>${mm.title}</button>`).join("")}</div>`;
  } else {
    const answers = QUESTIONS.filter((q) => q.slides.includes(n));
    const next = QUESTIONS.filter((q) => q.slides[0] > n && !answers.includes(q)).slice(0, 3);
    rel.innerHTML =
      (answers.length ? `<p>Esta lâmina responde</p><div class="chips" style="margin-bottom:18px">${answers.map((q) => `<span class="chip" style="cursor:default">✓ ${q.q}</span>`).join("")}</div>` : "") +
      (next.length ? `<p>Talvez você queira saber</p><div class="chips">${next.map((q) => `<button class="chip" data-q="${q.id}">${q.q}</button>`).join("")}</div>` : "");
  }
  $$("[data-jump]", rel).forEach((b) => (b.onclick = () => { setContext(null); goTo(+b.dataset.jump, "jump"); }));
  $$("[data-q]", rel).forEach((b) => (b.onclick = () => openQuestion(b.dataset.q)));
  if (isPhonePortrait()) $(".v-main").scrollTo({ top: 0 });
}

function openQuestion(id) {
  const q = QUESTIONS.find((x) => x.id === id);
  if (q.slides.length > 1) startTrail(q.slides, q.q);
  else { setContext(null); nav("slide-" + q.slides[0]); }
}

/* painel de texto no desktop */
const viewer = $("#viewer");
function toggleRead(force) {
  const on = force ?? !viewer.classList.contains("reading");
  viewer.classList.toggle("reading", on);
  $("#btn-text").setAttribute("aria-pressed", on);
  store.set("jw-reading", on);
}
$("#btn-text").onclick = () => toggleRead();
if (store.get("jw-reading", false)) toggleRead(true);

/* gestos: arrastar para os lados troca de lâmina; toque duplo amplia */
{
  const stage = $("#stage");
  let sx = 0, sy = 0, st = 0, swiped = false, lastTap = 0;
  stage.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; st = Date.now(); swiped = false; });
  stage.addEventListener("pointerup", (e) => {
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - st < 800) {
      swiped = true;
      step(dx < 0 ? 1 : -1);
      return;
    }
    if (e.pointerType !== "mouse" && e.target === img && Math.abs(dx) < 10) {
      if (Date.now() - lastTap < 320) openZoom();
      lastTap = Date.now();
    }
  });
  stage.addEventListener("click", (e) => { if (swiped) { e.stopPropagation(); e.preventDefault(); } }, true);
  img.addEventListener("dblclick", openZoom);
}

/* teclado */
addEventListener("keydown", (e) => {
  if (currentScreen !== "viewer" || $("dialog[open]") || e.target.matches("input, textarea")) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if ((k === " " || k === "Enter") && e.target.closest("button")) return; // ativação nativa do botão
  if (["ArrowRight", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); step(1); }
  else if (["ArrowLeft", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); step(-1); }
  else if (k === "Home") goTo(context ? context.slides[0] : 1, "backward");
  else if (k === "End") goTo(context ? context.slides.at(-1) : TOTAL, "forward");
  else if (k === "s" || k === "g") openSumario();
  else if (k === "t") toggleRead();
  else if (k === "f") toggleFs();
  else if (k === "z") openZoom();
});

/* tela cheia + modo apresentação */
function toggleFs() {
  if (!document.fullscreenEnabled) return;
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
}
$("#btn-fs").onclick = toggleFs;
if (!document.fullscreenEnabled) $("#btn-fs").hidden = true;
let idleT;
document.addEventListener("fullscreenchange", () => {
  const fs = !!document.fullscreenElement;
  viewer.classList.toggle("fs", fs);
  if (fs) toggleRead(false);
  wake();
});
function wake() {
  viewer.classList.remove("idle");
  clearTimeout(idleT);
  if (viewer.classList.contains("fs")) idleT = setTimeout(() => viewer.classList.add("idle"), 2500);
}
viewer.addEventListener("pointermove", wake);

/* dica para girar o celular */
function maybeRotateTip() {
  const tip = $("#rotate-tip");
  if (!isPhonePortrait() || store.get("jw-rotate-tip", false)) { tip.hidden = true; return; }
  tip.hidden = false;
  setTimeout(() => (tip.hidden = true), 7000);
}
$("#rotate-close").onclick = () => { $("#rotate-tip").hidden = true; store.set("jw-rotate-tip", true); };
matchMedia("(orientation: landscape)").addEventListener("change", (e) => { if (e.matches) { $("#rotate-tip").hidden = true; store.set("jw-rotate-tip", true); } });

/* ================= ZOOM (pinça / roda / arrastar) ================= */
const zoomDlg = $("#zoom"), zArea = $("#zoom-area"), zImg = $("#zoom-img");
const z = { s: 1, x: 0, y: 0, pts: new Map(), lastDist: 0, lastMid: null };

function openZoom() {
  zImg.src = src(state.n, 2560);
  zImg.alt = img.alt;
  Object.assign(z, { s: 1, x: 0, y: 0 });
  applyZ();
  zoomDlg.showModal();
}
$("#btn-zoom").onclick = openZoom;

function applyZ() {
  const w = zImg.offsetWidth, h = zImg.offsetHeight;
  if (z.s <= 1) { z.s = 1; z.x = 0; z.y = 0; }
  z.x = Math.min(0, Math.max(w - w * z.s, z.x));
  z.y = Math.min(0, Math.max(h - h * z.s, z.y));
  zImg.style.transform = `translate(${z.x}px, ${z.y}px) scale(${z.s})`;
}
function zoomAt(factor, cx, cy) {
  const r = zImg.getBoundingClientRect();
  const ox = r.left - z.x, oy = r.top - z.y; // origem sem transformação
  const px = cx - ox, py = cy - oy;
  const ns = Math.min(5, Math.max(1, z.s * factor));
  z.x = px - (px - z.x) * (ns / z.s);
  z.y = py - (py - z.y) * (ns / z.s);
  z.s = ns;
  applyZ();
}
const center = () => ({ x: innerWidth / 2, y: innerHeight / 2 });
$("#zoom-in").onclick = () => zoomAt(1.5, center().x, center().y);
$("#zoom-out").onclick = () => zoomAt(1 / 1.5, center().x, center().y);
zArea.addEventListener("wheel", (e) => { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
zArea.addEventListener("dblclick", (e) => zoomAt(z.s > 1.2 ? 0.01 : 2.5, e.clientX, e.clientY));
zArea.addEventListener("pointerdown", (e) => { zArea.setPointerCapture(e.pointerId); z.pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); z.lastDist = 0; z.lastMid = null; });
zArea.addEventListener("pointermove", (e) => {
  if (!z.pts.has(e.pointerId)) return;
  const prev = z.pts.get(e.pointerId);
  z.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (z.pts.size === 1) {
    z.x += e.clientX - prev.x; z.y += e.clientY - prev.y; applyZ();
  } else if (z.pts.size === 2) {
    const [a, b] = [...z.pts.values()];
    const dist = Math.hypot(a.x - b.x, a.y - b.y), mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    if (z.lastDist) {
      z.x += mid.x - z.lastMid.x; z.y += mid.y - z.lastMid.y;
      zoomAt(dist / z.lastDist, mid.x, mid.y);
    }
    z.lastDist = dist; z.lastMid = mid;
  }
});
const endPt = (e) => { z.pts.delete(e.pointerId); z.lastDist = 0; };
zArea.addEventListener("pointerup", endPt);
zArea.addEventListener("pointercancel", endPt);

/* ================= SUMÁRIO ================= */
const sum = $("#sumario");
function buildSumario() {
  $("#sum-modules").innerHTML = MODULES.map((m) => `
    <section class="sum-mod" data-m="${m.id}">
      <button class="sum-mod-head" data-slide="${m.slides[0]}">
        <span class="sum-mod-num">${m.id >= 1 && m.id <= 6 ? m.short : m.id === 0 ? "✦" : "♥"}</span>
        <span><b>${m.title}</b><small>${m.slides.length} lâmina${m.slides.length > 1 ? "s" : ""}</small></span>
      </button>
      <div class="thumbs">${m.slides.map((n) => `
        <button class="thumb" data-slide="${n}" data-n="${n}">
          <img src="${src(n, 480)}" alt="" loading="lazy" width="480" height="339">
          <small><b>${n}</b> · ${SLIDES[n].title.replace(/^Módulo \d+ · /, "")}</small>
        </button>`).join("")}
      </div>
    </section>`).join("");
}
function openSumario() {
  $$(".thumb", sum).forEach((t) => t.classList.toggle("current", +t.dataset.n === state.n && currentScreen === "viewer"));
  $$(".sum-mod", sum).forEach((s) => s.classList.toggle("current", MODULES[+s.dataset.m].slides.includes(state.n)));
  sum.showModal();
  const cur = $(".thumb.current", sum);
  if (cur) {
    const row = cur.parentElement;
    cur.closest(".sum-mod").scrollIntoView({ block: "start" });
    row.scrollLeft = cur.offsetLeft - row.offsetLeft - (row.clientWidth - cur.offsetWidth) / 2;
    cur.focus({ preventScroll: true });
  }
}
sum.addEventListener("click", (e) => {
  const b = e.target.closest("[data-slide]");
  if (!b) return;
  sum.close();
  const n = +b.dataset.slide;
  if (context && !context.slides.includes(n)) setContext(null);
  nav("slide-" + n);
});
const INDEX = SLIDES.map((s, n) => (s ? { n, title: s.title, body: plain(s.text + " " + (s.checklist || []).join(" ")) } : null)).filter(Boolean);
$("#sum-search").addEventListener("input", (e) => {
  const q = norm(e.target.value.trim());
  const res = $("#sum-results"), mods = $("#sum-modules");
  if (q.length < 2) { res.hidden = true; mods.hidden = false; return; }
  const words = q.split(/\s+/);
  const qs = QUESTIONS.filter((x) => words.every((w) => norm(x.q).includes(w)));
  const hits = INDEX.filter((it) => words.every((w) => norm(it.title + " " + it.body).includes(w)));
  // lâminas repetidas da jornada: mostra só a primeira
  const seen = new Set();
  const uniq = hits.filter((h) => { const k = h.title + h.body; if (seen.has(k)) return false; seen.add(k); return true; });
  const mark = (text) => {
    const nt = norm(text);
    const i = nt.indexOf(words[0]);
    if (i < 0) return text.slice(0, 120);
    const start = Math.max(0, i - 40);
    return (start ? "…" : "") + text.slice(start, i) + "<mark>" + text.slice(i, i + words[0].length) + "</mark>" + text.slice(i + words[0].length, i + 90);
  };
  res.innerHTML =
    qs.map((x) => `<button class="sum-result" data-slide="${x.slides[0]}"><img src="${src(x.slides[0], 480)}" alt=""><span><b>${x.q}</b><small>Pergunta frequente · lâmina ${x.slides.join(", ")}</small></span></button>`).join("") +
    uniq.map((h) => `<button class="sum-result" data-slide="${h.n}"><img src="${src(h.n, 480)}" alt=""><span><b>${h.n} · ${h.title}</b><small>${mark(h.body)}</small></span></button>`).join("") ||
    `<p class="sum-empty">Nada encontrado para “${e.target.value}”. Tente “embrião”, “óvulo” ou “genética”.</p>`;
  res.hidden = false; mods.hidden = true;
});

// fallback de "clique fora fecha" para navegadores sem closedby
if (!("closedBy" in HTMLDialogElement.prototype)) {
  $$("dialog[closedby]").forEach((d) => d.addEventListener("click", (e) => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) return;
    d.close();
  }));
}

/* ================= GUIA (questionário de interesse) ================= */
const guia = { step: 0, moment: null, picked: new Set() };

function guiaStep(n) {
  guia.step = n;
  $$(".guia-step").forEach((s) => (s.hidden = +s.dataset.step !== n));
  $$(".steps i").forEach((i) => i.classList.toggle("on", +i.dataset.step <= n));
  $(".guia-body").scrollTo({ top: 0 });
}
$("#moments").innerHTML = MOMENTS.map((m) => `
  <button class="moment" data-moment="${m.id}"><span class="m-icon" aria-hidden="true">${m.icon}</span><b>${m.label}</b><small>${m.hint}</small></button>`).join("");
$("#moments").addEventListener("click", (e) => {
  const b = e.target.closest("[data-moment]");
  if (!b) return;
  guia.moment = MOMENTS.find((m) => m.id === b.dataset.moment);
  guia.picked = new Set(guia.moment.pre);
  renderTopics();
  guiaStep(2);
});
function renderTopics() {
  $("#topic-chips").innerHTML = QUESTIONS.map((q) => `<button class="chip" aria-pressed="${guia.picked.has(q.id)}" data-topic="${q.id}">${q.q}</button>`).join("");
  $("#build-trail").disabled = !guia.picked.size;
}
$("#topic-chips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-topic]");
  if (!b) return;
  guia.picked.has(b.dataset.topic) ? guia.picked.delete(b.dataset.topic) : guia.picked.add(b.dataset.topic);
  b.setAttribute("aria-pressed", guia.picked.has(b.dataset.topic));
  $("#build-trail").disabled = !guia.picked.size;
});
$$("[data-guia-back]").forEach((b) => (b.onclick = () => guiaStep(guia.step - 1)));
let trailSlides = [];
$("#build-trail").onclick = () => {
  trailSlides = [...new Set(QUESTIONS.filter((q) => guia.picked.has(q.id)).flatMap((q) => q.slides))].sort((a, b) => a - b);
  const mins = Math.max(1, Math.round((trailSlides.length * 30) / 60));
  $("#trail-meta").textContent = `${trailSlides.length} lâminas selecionadas · cerca de ${mins} min · você pode sair da trilha quando quiser.`;
  $("#trail-list").innerHTML = trailSlides.map((n) => {
    const m = moduleOf(n), qs = QUESTIONS.filter((q) => guia.picked.has(q.id) && q.slides.includes(n));
    return `<li><button data-trail-slide="${n}"><span class="t-num" aria-hidden="true"></span><img src="${src(n, 480)}" alt="" loading="lazy">
      <span><b>${SLIDES[n].title.replace(/^Módulo \d+ · /, "")}</b><small>${modLabel(m)}${qs.length ? " · " + qs.map((q) => q.q).join(" · ") : ""}</small></span></button></li>`;
  }).join("");
  guiaStep(3);
};
$("#trail-list").addEventListener("click", (e) => {
  const b = e.target.closest("[data-trail-slide]");
  if (!b) return;
  startTrail(trailSlides, "Sua trilha", +b.dataset.trailSlide);
});
$("#start-trail").onclick = () => startTrail(trailSlides, "Sua trilha");

/* ================= QUIZ ================= */
const quiz = { i: 0, answers: [], started: false };

function startQuiz() {
  Object.assign(quiz, { i: 0, answers: [], started: true });
  renderQuestion();
}
function renderQuestion() {
  const body = $("#quiz-body");
  $("#quiz-bar").style.width = (quiz.i / QUIZ.length) * 100 + "%";
  $("#quiz-count").textContent = quiz.i < QUIZ.length ? `${quiz.i + 1} / ${QUIZ.length}` : "";
  if (quiz.i >= QUIZ.length) return renderResult();
  const q = QUIZ[quiz.i], answered = quiz.answers[quiz.i];
  body.innerHTML = `
    <div class="q-card">
      <p class="eyebrow">Pergunta ${quiz.i + 1} de ${QUIZ.length}</p>
      <h2 class="display" id="quiz-title">${q.q}</h2>
      <div class="answers">${q.a.map((a, i) => `<button class="answer" data-a="${i}"><span class="letter">${"ABCD"[i]}</span><span>${a}</span></button>`).join("")}</div>
      <div id="q-feedback"></div>
    </div>`;
  $$(".answer", body).forEach((b) => (b.onclick = () => answer(+b.dataset.a)));
  if (answered !== undefined) answer(answered, true);
  body.scrollTo({ top: 0 });
}
function answer(i, restoring = false) {
  const q = QUIZ[quiz.i];
  quiz.answers[quiz.i] = i;
  $$(".answer").forEach((b) => {
    b.disabled = true;
    const a = +b.dataset.a;
    if (a === q.c) b.classList.add("right");
    else if (a === i) b.classList.add("wrong");
  });
  const ok = i === q.c;
  $("#q-feedback").innerHTML = `
    <div class="feedback" role="status">
      <b>${ok ? "Isso mesmo! ✓" : "Quase lá"}</b>${q.why}
      <div class="feedback-actions">
        <button class="btn primary" id="q-next">${quiz.i + 1 < QUIZ.length ? "Próxima pergunta →" : "Ver meu resultado"}</button>
        <button class="btn ghost" id="q-see">Ver na lâmina ${q.slide}</button>
      </div>
    </div>`;
  $("#q-next").onclick = () => { quiz.i++; renderQuestion(); };
  $("#q-see").onclick = () => reviewSlide(q.slide);
  if (!restoring) $("#q-next").focus({ preventScroll: true });
  if (!restoring && ok) hearts(5);
}
function reviewSlide(n) {
  setContext({
    label: "Revisando a resposta", slides: [n], review: true,
    actionLabel: "↩ Voltar ao quiz",
    action: () => { setContext(null); nav("quiz"); },
  });
  nav("slide-" + n);
}
function renderResult() {
  const right = quiz.answers.filter((a, i) => a === QUIZ[i].c).length;
  const pct = Math.round((right / QUIZ.length) * 100);
  const msg = pct === 100 ? "Perfeito! Você domina a jornada." : pct >= 70 ? "Excelente! Você entendeu muito bem o processo." : pct >= 40 ? "Bom começo! Vale rever algumas lâminas." : "Que tal rever a apresentação com calma?";
  $("#quiz-bar").style.width = "100%";
  $("#quiz-body").innerHTML = `
    <div class="q-card q-result">
      <p class="eyebrow">Resultado</p>
      <div class="score-ring" id="ring"><span>${right}/${QUIZ.length}</span></div>
      <h2 class="display">${msg}</h2>
      <div class="review">${QUIZ.map((q, i) => {
        const ok = quiz.answers[i] === q.c;
        return `<button data-review="${q.slide}"><span class="${ok ? "ok" : "no"}">${ok ? "✓" : "✕"}</span><span>${q.q}<small>Resposta: ${q.a[q.c]} · rever lâmina ${q.slide} →</small></span></button>`;
      }).join("")}</div>
      <div class="guia-nav">
        <button class="btn ghost" id="q-restart">Refazer quiz</button>
        <button class="btn primary" data-go="home">Voltar ao início</button>
      </div>
    </div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => $("#ring").style.setProperty("--p", pct)));
  $$("[data-review]").forEach((b) => (b.onclick = () => reviewSlide(+b.dataset.review)));
  $("#q-restart").onclick = startQuiz;
  if (pct >= 70) hearts(24);
}

function hearts(count) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.createElement("div");
  box.className = "hearts";
  for (let i = 0; i < count; i++) {
    const h = document.createElement("i");
    h.textContent = Math.random() > 0.3 ? "♥" : "✦";
    h.style.left = Math.random() * 100 + "%";
    h.style.fontSize = 14 + Math.random() * 22 + "px";
    h.style.animationDelay = Math.random() * 0.8 + "s";
    box.append(h);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 4500);
}

/* ================= INÍCIO ================= */
$("#home-chips").innerHTML = ["coleta", "icsi", "embriao", "pgt", "cong", "beta"].map((id) => {
  const q = QUESTIONS.find((x) => x.id === id);
  return `<button class="chip" data-q="${q.id}">${q.q}</button>`;
}).join("");
$("#home-chips").addEventListener("click", (e) => { const b = e.target.closest("[data-q]"); if (b) openQuestion(b.dataset.q); });

buildProgress();
buildSumario();
route();
new MutationObserver(() => { if (!viewer.hidden) maybeRotateTip(); }).observe(viewer, { attributes: true, attributeFilter: ["hidden"] });
if (!viewer.hidden) maybeRotateTip();
