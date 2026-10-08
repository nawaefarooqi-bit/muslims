/* =====================================================================
   نوائے فاروقی (Nawa-e-Farooqi) — سائٹ اسکرپٹ
   خالص Vanilla JavaScript، کوئی jQuery یا بیرونی لائبریری نہیں۔

   فہرست:
     0. CONFIG        — قاری، تراجم، ہیش ٹیگ، ویڈیوز (صرف یہی حصہ بدلیں)
     1. UTILS         — چھوٹے مددگار فنکشن
     2. NAVIGATION    — سیریز / حصے / ابواب اور ڈیپ لنکس
     3. SHARE         — ہر پوسٹ، باب اور آیت کے شیئر بٹن
     4. QURAN PLAYER  — ملٹی قاری تلاوت، ملٹی ترجمہ، لفظ بہ لفظ ہائی لائٹ
     5. AYAH EMBEDS   — کسی بھی باب میں آیت + تصویری کارڈ
     6. VIDEO GALLERY — فلٹر ہونے والی ویڈیو گیلری
     7. INIT
   ===================================================================== */

/* =====================================================================
   0. CONFIG
   ===================================================================== */
var NF_CFG = {
  site: "نوائے فاروقی",
  channel: "https://www.youtube.com/@nawaefarooqi",

  /* ہر سیریز کے ہیش ٹیگ (کیپشن میں خود بخود لگتے ہیں) */
  tags: {
    base: "#نوائے_فاروقی",
    tadabbur: "#تدبر_قرآن #قرآن #Quran",
    qalarasul: "#قال_الرسول #حدیث #Hadith",
    farooqi: "#قرآنی_کہانی #قصص_القرآن",
    zad: "#زاد_مسنونہ #سنت",
    seerat: "#سیرت_النبی #Seerah",
    karwan: "#کاروان_اسلام #تاریخ_اسلام",
    banat: "#بنات_خدیجہ",
    taaruf: "",
    videos: "#اسلامی_ویڈیوز #IslamicVideos"
  },

  /* Instagram / TikTok / YouTube: ان کا کوئی ویب شیئر لنک نہیں ہوتا،
     اس لیے بٹن کیپشن کاپی کر کے یہ صفحہ کھولتا ہے */
  social: {
    ig: ["Instagram", "https://www.instagram.com/"],
    tt: ["TikTok", "https://www.tiktok.com/upload"],
    yt: ["YouTube", "https://www.youtube.com/"]
  },

  /* ---------- قراء ----------
     qc  : quran.com کی recitation id (لفظ بہ لفظ اصل ٹائمنگ کے لیے، اختیاری)
     ea  : everyayah.com کے فولڈر (ترتیب وار آزمائے جاتے ہیں)
     cdn : [edition, bitrate] — cdn.islamic.network (آخری بیک اپ، اختیاری) */
  reciters: [
    { id: "alafasy",  name: "مشاری راشد العفاسی",          qc: 7,  ea: ["Alafasy_128kbps"],                                         cdn: ["ar.alafasy", 128] },
    { id: "basit",    name: "عبدالباسط عبدالصمد (مرتل)",    qc: 2,  ea: ["Abdul_Basit_Murattal_192kbps", "Abdul_Basit_Murattal_64kbps"], cdn: ["ar.abdulbasitmurattal", 192] },
    { id: "basitmuj", name: "عبدالباسط عبدالصمد (مجوّد)",   qc: 1,  ea: ["Abdul_Basit_Mujawwad_128kbps"] },
    { id: "ghamdi",   name: "سعد الغامدی",                          ea: ["Ghamadi_40kbps"] },
    { id: "maher",    name: "ماہر المعیقلی",                        ea: ["MaherAlMuaiqly128kbps", "Maher_AlMuaiqly_64kbps"],          cdn: ["ar.mahermuaiqly", 128] },
    { id: "minshawi", name: "محمد صدیق المنشاوی (مرتل)",    qc: 9,  ea: ["Minshawy_Murattal_128kbps"],                                cdn: ["ar.minshawi", 128] },
    { id: "sudais",   name: "عبدالرحمٰن السدیس",            qc: 3,  ea: ["Abdurrahmaan_As-Sudais_192kbps"],                           cdn: ["ar.abdurrahmaansudais", 192] },
    { id: "shuraim",  name: "سعود الشریم",                  qc: 10, ea: ["Saood_ash-Shuraym_128kbps"] },
    { id: "husary",   name: "محمود خلیل الحصری",            qc: 6,  ea: ["Husary_128kbps", "Husary_64kbps"],                          cdn: ["ar.husary", 128] }
  ],

  /* ---------- اردو تراجم (api.alquran.cloud کے edition) ----------
     audio:true صرف اس ترجمے پر جس کی اردو آواز دستیاب ہے (جالندھری)۔
     نیا ترجمہ شامل کرنے کے لیے بس ایک سطر بڑھا دیں۔ */
  translations: [
    { id: "ur.jalandhry",  name: "مولانا فتح محمد جالندھریؒ", audio: true },
    { id: "ur.maududi",    name: "سید ابوالاعلیٰ مودودیؒ (تفہیم القرآن)" },
    { id: "ur.qadri",      name: "ڈاکٹر محمد طاہر القادری (عرفان القرآن)" },
    { id: "ur.junagarhi",  name: "مولانا محمد جوناگڑھیؒ" },
    { id: "ur.kanzuliman", name: "امام احمد رضا خانؒ (کنز الایمان)" },
    { id: "ur.ahmedali",   name: "مولانا احمد علی لاہوریؒ" }
  ],

  /* ---------- ویڈیو گیلری ----------
     videoTabs : ٹیب (id وہی جو ویڈیو کی series میں لکھیں گے)
     playlists : کسی ٹیب کے اوپر پوری پلے لسٹ دکھانے کے لیے { tadabbur: "PLxxxxxxxx" }
     videos    : ہر ویڈیو کی ایک سطر۔ id میں یوٹیوب کا لنک یا 11 حرفی آئی ڈی دونوں چلتے ہیں۔
                 شارٹس کے لیے shorts والا لنک دیں یا type:"short" لکھیں۔
       مثال:
       { id: "https://youtu.be/XXXXXXXXXXX", series: "tadabbur", title: "عنوان", summary: "مختصر تعارف", duration: "12:30" },
       { id: "https://www.youtube.com/shorts/XXXXXXXXXXX", series: "kahani", title: "عنوان", summary: "", duration: "0:58" } */
  videoTabs: [
    { id: "all",      label: "تمام ویڈیوز" },
    { id: "tadabbur", label: "تدبر قرآن" },
    { id: "hadith",   label: "احادیثِ نبوی" },
    { id: "khutbat",  label: "خطبات" },
    { id: "kahani",   label: "کہانیاں" },
    { id: "shorts",   label: "شارٹس" }
  ],
  playlists: {},
  videos: [
  ]
};

/* =====================================================================
   1. UTILS
   ===================================================================== */
function esc(t) {
  return String(t === undefined || t === null ? "" : t)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function plain(t) { return (t || "").replace(/\s+/g, " ").trim(); }
function cut(t, n) {
  t = plain(t);
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t;
}
function pad3(n) { return String(n).padStart(3, "0"); }
function byId(id) { return document.getElementById(id); }
function each(sel, fn, root) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }
function baseUrl() { return location.href.split("#")[0].replace(/([?&])m=1(&|$)/, "$1").replace(/[?&]$/, ""); }
function savePref(k, v) { try { localStorage.setItem("nf_" + k, v); } catch (e) {} }
function loadPref(k) { try { return localStorage.getItem("nf_" + k); } catch (e) { return null; } }
function findBy(arr, id) {
  for (var i = 0; i < arr.length; i++) { if (arr[i].id === id) { return arr[i]; } }
  return null;
}

function toast(msg) {
  var t = byId("toastBox");
  if (!t) {
    t = document.createElement("div");
    t.id = "toastBox"; t.className = "toast";
    t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite");
    document.body.appendChild(t);
  }
  t.innerText = msg;
  t.classList.add("on");
  clearTimeout(toast._t);
  toast._t = setTimeout(function() { t.classList.remove("on"); }, 3200);
}

function copyText(text, okMsg) {
  var done = function() { toast(okMsg || "کاپی ہو گیا"); };
  var fallback = function() {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    if (ok) { done(); } else { window.prompt("کاپی کریں:", text); }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fallback);
  } else { fallback(); }
}

/* =====================================================================
   2. NAVIGATION — سیریز، حصے، ابواب، ڈیپ لنکس
   لنک کی شکل:  #panel:page:index       مثلاً  #qalarasul:q-p2:0
                #tadabbur:t-recite:2:255   (سورت 2، آیت 255)
                #videos:tadabbur
   ===================================================================== */
var curPanel = "";

/* ---------- مواد GitHub (یا کسی اور جگہ) سے لانا ----------
   تھیم میں یہ لکھا ہو تو سیریز کا مواد ضرورت پڑنے پر وہاں سے آتا ہے:
     var NF_REMOTE = { tadabbur: "nf-tadabbur.html", ... };
     var NF_BASE_URL = "https://xxxx.github.io/repo/";   (اختیاری؛ ورنہ اسکرپٹ کا اپنا پتہ)
   نہ لکھا ہو تو سب کچھ پہلے کی طرح صفحے کے اندر سے چلتا ہے۔ */
NF_CFG.remote = window.NF_REMOTE || {};
var NF_BASE = window.NF_BASE_URL || (function() {
  var sc = document.currentScript, u = sc && sc.src ? sc.src : "";
  return /^https?:/.test(u) ? u.replace(/[^\/]*$/, "") : "";
})();
var panelReq = {};
var wantPanel = "";
function fetchPanel(n) {
  if (!panelReq[n]) {
    panelReq[n] = fetch(NF_BASE + NF_CFG.remote[n]).then(function(r) {
      if (!r.ok) { throw new Error("http " + r.status); }
      return r.text();
    });
    panelReq[n].catch(function() { delete panelReq[n]; });
  }
  return panelReq[n];
}
function loadBox() {
  var b = byId("nfLoad");
  if (!b) {
    b = document.createElement("div");
    b.id = "nfLoad"; b.className = "nf-loadbox";
    b.setAttribute("role", "status"); b.setAttribute("aria-live", "polite");
    var host = byId("nf-modules") || byId("bS");
    if (host && host.parentNode) { host.parentNode.insertBefore(b, host); } else { document.body.appendChild(b); }
  }
  return b;
}
function hideLoadBox() { var b = byId("nfLoad"); if (b) { b.hidden = true; } }
function afterPanelLoad(p) {
  if (!p) { return; }
  each(".chap-h", function(h) {
    h.setAttribute("role", "button"); h.setAttribute("tabindex", "0");
    h.setAttribute("aria-expanded", h.nextElementSibling && h.nextElementSibling.classList.contains("open") ? "true" : "false");
  }, p);
  if (p.querySelector("#surahSelector")) { initPlayerUI(); }
  if (p.querySelector(".nf-video") || p.id === "p-videos") { vidList = null; }
}
function loadPanel(n, then) {
  wantPanel = n;
  each(".sub", function(x) { x.classList.remove("active"); });
  homeParts(false);
  var box = loadBox();
  box.innerHTML = "⏳ مواد لوڈ ہو رہا ہے...";
  box.hidden = false;
  fetchPanel(n).then(function(html) {
    if (!byId("p-" + n)) {
      var host = byId("nf-modules") || document.querySelector(".main-wrap") || document.body;
      var d = document.createElement("div");
      d.innerHTML = html;
      while (d.firstChild) { host.appendChild(d.firstChild); }
      afterPanelLoad(byId("p-" + n));
    }
    if (wantPanel !== n) { return; }
    wantPanel = "";
    hideLoadBox();
    if (byId("p-" + n)) { openS(n, then); } else { showM(); toast("یہ سیریز جلد شامل کی جائے گی، ان شاء اللہ"); }
  }).catch(function(e) {
    console.warn("Series load failed:", e);
    if (wantPanel !== n) { return; }
    box.innerHTML = "<p>⚠ مواد لوڈ نہیں ہو سکا۔ انٹرنیٹ کنکشن چیک کر کے دوبارہ کوشش کریں۔</p>" +
      "<button type='button' class='player-btn' id='nfRetry'>دوبارہ کوشش کریں</button> " +
      "<button type='button' class='player-btn nf-close' onclick='showM()'>ہوم</button>";
    byId("nfRetry").onclick = function() { loadPanel(n, then); };
  });
}
function prefetchPanels() {
  var c = navigator.connection;
  if (c && c.saveData) { return; }
  for (var n in NF_CFG.remote) { if (!byId("p-" + n)) { fetchPanel(n).catch(function() {}); } }
}
var PAGE_SEL = ".t-page,.k-page,.q-page,.x-page";

/* cls: صفحات کی کلاس · menu: پہلا صفحہ · head: عنوان والا عنصر · up: ذیلی صفحے کا والد */
var NF_PANELS = {
  tadabbur:  { cls: "t-page", menu: "t-menu", head: "tHeadTitle", title: "تدبر قرآن سیریز",
               up: { "t-lugat": "t-words", "t-ishtiqaq": "t-words" },
               titles: { "t-menu": "تدبر قرآن سیریز", "t-intro": "تعارف قرآن", "t-recite": "تلاوت اور ترجمہ", "t-tafseer": "تفسیر قرآن",
                         "t-mazameen": "مضامین قرآن", "t-words": "قرآن کے منتخب الفاظ", "t-lugat": "منتخب الفاظ — عربی لغت میں", "t-ishtiqaq": "منتخب الفاظ — علم اشتقاق میں" } },
  karwan:    { cls: "k-page", menu: "k-menu", head: "kHeadTitle", title: "کاروانِ اسلام" },
  qalarasul: { cls: "q-page", menu: "q-menu", head: "qHeadTitle", title: "قال الرسول ﷺ سیریز",
               up: { "q-p3a": "q-p3", "q-p3b": "q-p3" } }
};

/* جو پینل اوپر درج نہیں (نئی سیریز، گیجٹ سے آنے والی سیریز) وہ خود رجسٹر ہو جاتے ہیں */
function panelCfg(panel) {
  var c = NF_PANELS[panel];
  if (c) { if (!c.cur) { c.cur = c.menu; } return c; }
  var p = byId("p-" + panel);
  if (!p) { return null; }
  var first = p.querySelector(".x-page");
  c = { cls: "x-page", menu: first ? first.id : "", head: "", title: p.getAttribute("data-title") || "", up: {} };
  c.cur = c.menu;
  NF_PANELS[panel] = c;
  return c;
}
function panelOf(el) {
  var sub = el && el.closest ? el.closest(".sub") : null;
  return sub ? sub.id.replace(/^p-/, "") : "";
}

function setHash(panel, page, idx, sub) {
  if (curPanel !== panel) { return; }
  var h = "#" + panel + (page ? ":" + page : "") +
          (idx !== undefined && idx !== null ? ":" + idx : "") +
          (sub ? ":" + sub : "");
  try { history.replaceState(null, "", h); } catch (e) {}
}
function clearHash() {
  try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
}

function pgShow(panel, id, quiet) {
  var cfg = panelCfg(panel);
  var el = byId(id);
  if (!cfg || !el) { return; }
  exitSolo();
  if (!(panel === "tadabbur" && id === "t-recite")) { stopAudio(); }
  stopMini();
  each("#p-" + panel + " ." + cfg.cls, function(x) { x.classList.remove("on"); });
  el.classList.add("on");
  cfg.cur = id;
  setHash(panel, id);
  var h = cfg.head ? byId(cfg.head) : document.querySelector("#p-" + panel + " .nf-head");
  if (h) { h.innerText = el.getAttribute("data-title") || (cfg.titles && cfg.titles[id]) || cfg.title; }
  if (id === "t-recite") { ensureSurahLoaded(); }
  renderAyahEmbeds(el);
  if (!quiet) { window.scrollTo({ top: 0, behavior: "smooth" }); }
}
function pgBack(panel) {
  var cfg = panelCfg(panel);
  if (!cfg) { showM(); return; }
  if (leaveSolo()) { return; }
  if (cfg.up && cfg.up[cfg.cur]) { pgShow(panel, cfg.up[cfg.cur]); }
  else if (cfg.cur && cfg.cur !== cfg.menu) { pgShow(panel, cfg.menu); }
  else { showM(); }
}
/* پرانے نام برقرار ہیں تاکہ مواد میں لکھے onclick ویسے ہی چلتے رہیں */
function tShow(id) { pgShow("tadabbur", id); }
function tBack() { pgBack("tadabbur"); }
function kShow(id) { pgShow("karwan", id); }
function kBack() { pgBack("karwan"); }
function qShow(id) { pgShow("qalarasul", id); }
function qBack() { pgBack("qalarasul"); }
function nfShow(panel, id) { pgShow(panel, id); }
function nfBack(panel) { pgBack(panel); }

/* باب کا مستقل نام (data-key) — ترتیب بدلنے سے لنک نہیں بدلتا؛ نہ ہو تو ترتیب کا نمبر */
function chapKey(c) {
  var k = c.getAttribute("data-key");
  return k && /^[A-Za-z][\w-]*$/.test(k) ? k : chapIndex(c);
}
function findChap(pg, tok) {
  if (!pg || tok === undefined || tok === "") { return null; }
  if (/^\d+$/.test(tok)) { return pg.querySelectorAll(".chap")[parseInt(tok, 10)] || null; }
  if (!/^[A-Za-z][\w-]*$/.test(tok)) { return null; }
  return pg.querySelector(".chap[data-key='" + tok + "']");
}
function chapIndex(c) {
  var pg = c.closest(PAGE_SEL);
  return pg ? Array.prototype.indexOf.call(pg.querySelectorAll(".chap"), c) : -1;
}
function chapUrl(c) {
  var pg = c.closest(PAGE_SEL);
  return baseUrl() + "#" + panelOf(c) + ":" + (pg ? pg.id : "") + ":" + chapKey(c) + ":s";
}
/* ---------- صرف ایک باب / حدیث کا منظر ----------
   شیئر کیے گئے لنک (آخر میں :s) سے آنے والے کو صرف وہی حصہ دکھائی دیتا ہے؛
   باقی فہرست "مکمل فہرست دیکھیں" یا "واپس" سے کھلتی ہے۔ */
function exitSolo() {
  var c = document.querySelector(".chap.solo");
  each(".nf-solo-bar", function(b) { b.parentNode.removeChild(b); });
  each(".nf-solo", function(x) { x.classList.remove("nf-solo"); });
  each(".chap.solo", function(x) { x.classList.remove("solo"); });
  return c;
}
function soloChap(c) {
  var pg = c.closest(PAGE_SEL);
  if (!pg) { return; }
  exitSolo();
  pg.classList.add("nf-solo");
  c.classList.add("solo");
  var bar = document.createElement("div");
  bar.className = "nf-solo-bar";
  bar.innerHTML = "<span>آپ صرف یہ حصہ دیکھ رہے ہیں</span><button type='button' class='player-btn' data-solo-exit='1'>مکمل فہرست دیکھیں</button>";
  c.parentNode.insertBefore(bar, c);
}
function leaveSolo() {
  var c = exitSolo();
  if (!c) { return false; }
  var pg = c.closest(PAGE_SEL);
  if (pg) { setHash(panelOf(c), pg.id, chapKey(c)); }
  setTimeout(function() { c.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
  return true;
}
function openChap(c) {
  var body = c.querySelector(".chap-body");
  if (!body) { return; }
  body.classList.add("open");
  var hd = c.querySelector(".chap-h");
  if (hd) { hd.setAttribute("aria-expanded", "true"); }
  ensureChapShare(c);
  renderAyahEmbeds(body);
}
function toggleChap(h) {
  var b = h.nextElementSibling;
  if (!b) { return; }
  var c = h.parentNode;
  if (b.classList.contains("open")) {
    b.classList.remove("open");
    h.setAttribute("aria-expanded", "false");
  } else {
    openChap(c);
  }
  var pg = c.closest(PAGE_SEL);
  if (!pg) { return; }
  if (b.classList.contains("open")) { setHash(panelOf(c), pg.id, chapKey(c)); }
  else { setHash(panelOf(c), pg.id); }
}

function openFromHash() {
  var h = (location.hash || "").replace("#", "");
  if (!h) { return; }
  var a = h.split(":");
  var panel = a[0];
  if (!byId("p-" + panel) && !NF_CFG.remote[panel]) { return; }
  openS(panel, function() { routeInside(a); });
}
function routeInside(a) {
  var panel = a[0];
  if (panel === "videos") { if (a[1]) { vidTab(a[1]); } return; }
  if (!a[1] || !byId(a[1])) { return; }
  if (panel === "tadabbur" && a[1] === "t-recite") {
    var s = parseInt(a[2], 10), ay = parseInt(a[3], 10) || 0;
    var sel = byId("surahSelector");
    if (s >= 1 && s <= 114 && sel) {
      sel.value = String(s);
      if (surahReqNum === s && versesData.length) {
        pgShow(panel, a[1], true);
        setHash(panel, a[1], s, ay || "");
        if (ay) { focusAyah(ay); }
      } else {
        pendingAyah = ay;
        pgShow(panel, a[1], true);
      }
      return;
    }
    pgShow(panel, a[1]);
    return;
  }
  pgShow(panel, a[1]);
  if (a[2] !== undefined && a[2] !== "") {
    var pg = byId(a[1]);
    var c = findChap(pg, a[2]);
    if (c) {
      openChap(c);
      var solo = a[3] === "s";
      if (solo) { soloChap(c); }
      setHash(panel, a[1], a[2], solo ? "s" : "");
      setTimeout(function() { (solo ? c.closest(".sub") : c).scrollIntoView({ behavior: "smooth", block: "start" }); }, 400);
    }
  }
}
window.addEventListener("hashchange", function() { openFromHash(); });

function homeParts(show) {
  var ids = { g: "block", h: "flex", bS: "block", extras: "block" };
  for (var k in ids) {
    var el = byId(k);
    if (el) { el.style.display = show ? ids[k] : "none"; }
  }
}
/* HOME */
function showM() {
  curPanel = "";
  wantPanel = ""; hideLoadBox();
  exitSolo();
  each(".sub", function(s) { s.classList.remove("active"); });
  homeParts(true);
  stopAudio(); stopMini(); stopVideos();
  for (var p in NF_PANELS) {
    var cfg = NF_PANELS[p];
    if (cfg.menu && cfg.cur !== cfg.menu) { pgShow(p, cfg.menu, true); }
  }
  clearHash();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
/* OPEN SERIES */
function openS(n, then) {
  var p = byId("p-" + n);
  if (!p) {
    if (NF_CFG.remote[n]) { loadPanel(n, then); return; }
    toast("یہ سیریز جلد شامل کی جائے گی، ان شاء اللہ"); return;
  }
  wantPanel = ""; hideLoadBox();
  if (curPanel && curPanel !== n) { stopAudio(); stopMini(); stopVideos(); }
  each(".sub", function(s) { s.classList.remove("active"); });
  homeParts(false);
  p.classList.add("active");
  curPanel = n;
  panelCfg(n);
  setHash(n);
  ensurePanelShare(p);
  if (n === "videos") { vidRender(); }
  else { each(PAGE_SEL, function(pg) { if (pg.classList.contains("on")) { renderAyahEmbeds(pg); } }, p); }
  window.scrollTo({ top: 0 });
  if (then) { then(); }
}

/* گیجٹ سے شامل کی گئی سیریز: <div class='sub' id='p-xyz' data-card='عنوان'> — ہوم پر کارڈ خود بن جاتا ہے */
function autoCards() {
  var grid = document.querySelector("#g .grid");
  if (!grid) { return; }
  each(".sub[data-card]", function(p) {
    var n = p.id.replace(/^p-/, "");
    if (grid.querySelector("[data-panel='" + n + "']")) { return; }
    var a = document.createElement("a");
    a.className = "card"; a.href = "#" + n; a.setAttribute("data-panel", n);
    a.innerHTML = "<div class='info'><span class='t'>" + esc(p.getAttribute("data-card")) + "</span><span class='b'>مطالعہ کے لیے کلک کریں</span></div>";
    a.addEventListener("click", function(e) { e.preventDefault(); openS(n); });
    grid.appendChild(a);
  });
}

/* =====================================================================
   3. SHARE — پوسٹ، باب، صفحہ، آیت اور ویڈیو
   ===================================================================== */
/* key: [css class, icon, لیبل] */
var SHARE_BTNS = {
  wa:     ["wa",   "fa-brands fa-whatsapp",    "WhatsApp پر شیئر کریں"],
  fb:     ["fb",   "fa-brands fa-facebook-f",  "Facebook پر شیئر کریں"],
  x:      ["xx",   "fa-brands fa-x-twitter",   "X (Twitter) پر شیئر کریں"],
  li:     ["li",   "fa-brands fa-linkedin-in", "LinkedIn پر شیئر کریں"],
  tg:     ["tg",   "fa-brands fa-telegram",    "Telegram پر شیئر کریں"],
  ig:     ["ig",   "fa-brands fa-instagram",   "Instagram کے لیے کیپشن کاپی کریں"],
  tt:     ["tt",   "fa-brands fa-tiktok",      "TikTok کے لیے کیپشن کاپی کریں"],
  yt:     ["yt",   "fa-brands fa-youtube",     "YouTube کے لیے کیپشن کاپی کریں"],
  img:    ["img",  "fa-solid fa-image",        "آیت کا تصویری کارڈ بنائیں"],
  copy:   ["cp",   "fa-solid fa-link",         "لنک کاپی کریں"],
  cap:    ["txt",  "fa-solid fa-copy",         "متن کاپی کریں"],
  native: ["nt",   "fa-solid fa-share-nodes",  "فون کی ایپس سے شیئر کریں"],
  more:   ["more", "fa-solid fa-ellipsis",     "مزید پلیٹ فارم"]
};
var SHARE_FULL = ["wa", "fb", "x", "li", "tg", "ig", "tt", "yt", "copy", "cap", "native"];
var SHARE_AYAH = ["wa", "fb", "x", "img", "cap", "more"];
var SHARE_AYAH_MORE = ["li", "tg", "ig", "tt", "yt", "copy", "native"];
var SHARE_VIDEO = ["wa", "fb", "x", "li", "copy", "more"];
var SHARE_VIDEO_MORE = ["tg", "ig", "tt", "cap", "native"];

function shareBtns(keys) {
  return keys.map(function(k) {
    var b = SHARE_BTNS[k];
    return "<button type='button' class='shr " + b[0] + "' data-k='" + k + "' aria-label='" + b[2] + "' title='" + b[2] + "'>" +
           "<i class='" + b[1] + "' aria-hidden='true'></i></button>";
  }).join("");
}
function shareRow(label, keys, moreKeys) {
  return "<span class='nf-share-lbl'>" + label + "</span>" + shareBtns(keys) +
         (moreKeys ? "<span class='nf-share-more' hidden='hidden' data-more='" + moreKeys.join(",") + "'></span>" : "");
}
function ensureChapShare(c) {
  var b = c.querySelector(".chap-body");
  if (!b || b.querySelector(".chap-share")) { return; }
  var d = document.createElement("div");
  d.className = "chap-share nf-share";
  d.innerHTML = shareRow("یہ حصہ شیئر کریں:", SHARE_FULL);
  b.appendChild(d);
}
function ensurePanelShare(sb) {
  if (sb.querySelector(".panel-share")) { return; }
  var d = document.createElement("div");
  d.className = "panel-share";
  d.innerHTML = "<div class='ex-title'>اس صفحے کو شیئر کریں</div><div class='share-bar nf-share'>" + shareBtns(SHARE_FULL) + "</div>";
  sb.appendChild(d);
}
function initShare() {
  if (!navigator.share) { document.body.classList.add("no-native"); }
  /* بلاگ پوسٹس اور سائٹ کا عمومی شیئر بار: <div class='nf-share' data-url='…' data-title='…'> */
  each(".nf-share[data-url],.nf-share[data-scope]", function(d) {
    if (d.querySelector(".shr")) { return; }
    d.insertAdjacentHTML("beforeend", shareBtns(SHARE_FULL));
  });
  each(".chap-h", function(h) {
    h.setAttribute("role", "button"); h.setAttribute("tabindex", "0");
    h.setAttribute("aria-expanded", h.nextElementSibling && h.nextElementSibling.classList.contains("open") ? "true" : "false");
  });
}

function tagsFor(panel) {
  var t = NF_CFG.tags;
  return plain(t.base + " " + (t[panel] || ""));
}
function ayahInfo(key) {
  var d = NF_AYAH[key];
  if (!d) { return null; }
  return {
    ayah: true, s: d.s, a: d.a, ar: d.ar, ur: d.ur, tr: d.tr,
    ref: "سورۃ " + surahNames[d.s - 1] + "، آیت " + d.a + " (" + d.s + ":" + d.a + ")",
    title: "سورۃ " + surahNames[d.s - 1] + "، آیت " + d.a + " — " + NF_CFG.site,
    text: d.ur,
    url: baseUrl() + "#tadabbur:t-recite:" + d.s + ":" + d.a,
    tags: tagsFor("tadabbur")
  };
}
function excerptOf(body) {
  if (!body) { return ""; }
  var h4s = body.querySelectorAll("h4");
  var txt = "";
  for (var i = 0; i < h4s.length; i++) {
    if (h4s[i].innerText.indexOf("اردو ترجمہ") > -1) {
      var n = h4s[i].nextElementSibling;
      if (n) { txt = n.innerText; }
      break;
    }
  }
  if (!txt) {
    var pp = body.querySelector(".ch-p");
    txt = pp ? pp.innerText : "";
  }
  return cut(txt, 220);
}
/* باب / حدیث کا مکمل متن (شیئر بٹنوں کے بغیر) — "متن کاپی" اور فون کے شیئر کے لیے */
function fullTextOf(body) {
  if (!body) { return ""; }
  var out = [];
  Array.prototype.forEach.call(body.children, function(ch) {
    if (ch.classList.contains("nf-share") || ch.classList.contains("chap-share")) { return; }
    var t = (ch.innerText || ch.textContent || "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    if (t) { out.push(/^H\d$/.test(ch.tagName) ? "\n【 " + t + " 】" : t); }
  });
  return out.join("\n").trim();
}
function captionFull(info) {
  if (info.ayah || !info.full) { return captionOf(info); }
  return info.title + "\n\n" + info.full + "\n\n" + info.url + "\n\n" + info.tags;
}
/* بٹن جس مواد کے اندر ہے اسی کی معلومات: لنک، عنوان، اقتباس، ہیش ٹیگ */
function infoFrom(el) {
  var holder = el.closest("[data-url]");
  if (holder) {
    var box = holder.closest(".post-item");
    var bd = box ? box.querySelector(".post-text") : null;
    return {
      url: holder.getAttribute("data-url"),
      title: holder.getAttribute("data-title") || document.title,
      text: holder.getAttribute("data-text") || cut(bd ? bd.innerText : "", 220),
      tags: holder.getAttribute("data-tags") || tagsFor("")
    };
  }
  var ac = el.closest("[data-akey]");
  if (ac) {
    var ai = ayahInfo(ac.getAttribute("data-akey"));
    if (ai) { return ai; }
  }
  var c = el.closest(".chap");
  if (c) {
    var lb = c.querySelector(".chap-h span");
    return { url: chapUrl(c), title: (lb ? lb.innerText : "") + " — " + NF_CFG.site, text: excerptOf(c.querySelector(".chap-body")), full: fullTextOf(c.querySelector(".chap-body")), tags: tagsFor(panelOf(c)) };
  }
  var sub = el.closest(".sub");
  if (sub) {
    var tt = sub.querySelector(".on .t-title") || sub.querySelector(".t-title") || sub.querySelector(".nf-head");
    return { url: location.href, title: (tt ? tt.innerText + " — " : "") + NF_CFG.site, text: "", tags: tagsFor(panelOf(sub)) };
  }
  return { url: location.href, title: document.title, text: "", tags: tagsFor("") };
}
/* مکمل کیپشن (WhatsApp، Instagram، TikTok، YouTube، کاپی) */
function captionOf(info) {
  if (info.ayah) {
    return "﴿ " + info.ar + " ﴾\n\n" + info.ur + "\n(ترجمہ: " + info.tr + ")\n\n— " + info.ref + "\n" + info.url + "\n\n" + info.tags;
  }
  return info.title + "\n\n" + (info.text ? info.text + "\n\n" : "") + info.url + "\n\n" + info.tags;
}
/* X کے لیے مختصر متن (حد 280 حروف، لنک الگ سے لگتا ہے) */
function shortText(info) {
  var tag = info.tags.split(" ").slice(0, 2).join(" ");
  var body = info.ayah ? cut(info.ur, 170) + " — " + info.ref : cut(info.title + (info.text ? " — " + info.text : ""), 200);
  return body + "\n" + tag;
}
function shareLink(k, info) {
  var u = encodeURIComponent(info.url);
  var map = {
    fb: "https://www.facebook.com/sharer/sharer.php?u=" + u,
    x:  "https://twitter.com/intent/tweet?url=" + u + "&text=" + encodeURIComponent(shortText(info)),
    wa: "https://wa.me/?text=" + encodeURIComponent(captionOf(info)),
    li: "https://www.linkedin.com/sharing/share-offsite/?url=" + u,
    tg: "https://t.me/share/url?url=" + u + "&text=" + encodeURIComponent(info.ayah ? info.ur + "\n— " + info.ref : info.title + (info.text ? "\n" + info.text : ""))
  };
  return map[k] || "";
}
function shareFrom(el, k) {
  if (k === "more") {
    var row = el.parentNode.querySelector(".nf-share-more");
    if (!row) { return; }
    if (!row.firstChild) { row.innerHTML = shareBtns(row.getAttribute("data-more").split(",")); }
    row.hidden = !row.hidden;
    el.setAttribute("aria-expanded", row.hidden ? "false" : "true");
    return;
  }
  var info = infoFrom(el);
  if (k === "copy") { copyText(info.url, "لنک کاپی ہو گیا"); return; }
  if (k === "cap") { copyText(captionFull(info), info.full ? "مکمل متن کاپی ہو گیا، اب جہاں چاہیں پیسٹ کریں" : "متن کاپی ہو گیا، اب جہاں چاہیں پیسٹ کریں"); return; }
  if (k === "img") { openAyahCard(info); return; }
  if (k === "native") {
    if (navigator.share) {
      navigator.share({ title: info.title, text: info.ayah ? captionOf(info) : info.title + "\n\n" + (info.full || info.text || ""), url: info.url }).catch(function() {});
    } else { copyText(captionOf(info), "متن کاپی ہو گیا"); }
    return;
  }
  if (NF_CFG.social[k]) {
    var nm = NF_CFG.social[k][0];
    if (info.ayah && k !== "yt") {
      /* آیت: کیپشن کاپی + تصویری کارڈ، جو Instagram / TikTok پر براہِ راست لگ سکتا ہے */
      copyText(captionOf(info), "کیپشن کاپی ہو گیا — کارڈ محفوظ کر کے " + nm + " پر لگائیں");
      openAyahCard(info);
      return;
    }
    copyText(captionOf(info), "کیپشن کاپی ہو گیا — " + nm + " میں پیسٹ کریں");
    window.open(NF_CFG.social[k][1], "_blank", "noopener");
    return;
  }
  var link = shareLink(k, info);
  if (link) { window.open(link, "_blank", "noopener"); }
}
function shareTo(k) { shareFrom(document.body, k); }

document.addEventListener("click", function(e) {
  var t = e.target;
  if (!t || !t.closest) { return; }
  var b = t.closest("[data-k]");
  if (b) { e.preventDefault(); shareFrom(b, b.getAttribute("data-k")); return; }
  var m = t.closest("[data-mini]");
  if (m) { e.preventDefault(); playMini(m); return; }
  if (t.closest("[data-solo-exit]")) { e.preventDefault(); leaveSolo(); return; }
  var pa = t.closest("[data-pact]");
  if (pa) { e.preventDefault(); floatAct(pa.getAttribute("data-pact")); return; }
  var v = t.closest("[data-vplay]");
  if (v) { e.preventDefault(); vidPlay(v); return; }
  var tb = t.closest("[data-vtab]");
  if (tb) { e.preventDefault(); vidTab(tb.getAttribute("data-vtab")); }
});
document.addEventListener("keydown", function(e) {
  var t = e.target;
  if ((e.key === "Enter" || e.key === " ") && t && t.classList && t.classList.contains("chap-h")) {
    e.preventDefault(); toggleChap(t);
  }
  if (e.key === "Escape") { closeAyahCard(); }
});

/* =====================================================================
   4. QURAN PLAYER — ملٹی قاری، ملٹی ترجمہ، لفظ بہ لفظ ہائی لائٹ
   متن و ترجمہ: api.alquran.cloud · اصل ٹائمنگ: api.quran.com
   آڈیو: quran.com → everyayah.com → cdn.islamic.network
   ===================================================================== */
var surahNames = ["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];

/* پوری تلاوت (عربی + اردو) ایک ہی آڈیو عنصر پر چلتی ہے۔ فون اسکرین بند ہونے پر
   صرف اسی عنصر کو اگلی فائل چلانے دیتے ہیں جو پہلے سے چل رہا ہو؛ دو الگ عنصر ہوں
   تو عربی کے بعد اردو (یا اگلی آیت) شروع نہیں ہوتی اور تلاوت رک جاتی ہے۔ */
var arAudio = new Audio();
var urAudio = arAudio;
arAudio.preload = "auto";
var urPre = new Audio();     /* اردو فائل پہلے سے لوڈ کرنے کے لیے (چلتی نہیں) */
urPre.preload = "auto";

var versesData = [];
var currentVerseIndex = -1;
var isAutoPlaying = false;
var isPlayingUrdu = false;
var wordInterval = null;
var audioPlayMode = "both";
var audioWasPaused = false;
var pendingAutoPlay = false;

var NF_AYAH = {};            /* "سورت:آیت" → { s, a, ar, ur, tr } (شیئر کے لیے) */
var curReciter = NF_CFG.reciters[0];
var curTrans = NF_CFG.translations[0];
var surahReqNum = 0;         /* جو سورت مانگی گئی */
var surahReqTok = 0;         /* پرانی درخواست کا جواب نظر انداز کرنے کے لیے */
var pendingAyah = 0;         /* لوڈ کے بعد جس آیت پر جانا ہے */

function normAr(t) {
  return t.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
          .replace(/\u0671/g, "\u0627")
          .replace(/\u06CC/g, "\u064A");
}
/* بسم اللہ کو پہلی آیت کے متن سے ہٹانا (سورۃ 1 اور 9 کے علاوہ) */
function ayahWords(text, s, a) {
  var words = String(text).split(/\s+/).filter(function(x) { return x; });
  if (s != 1 && s != 9 && a == 1 && words.length > 4) {
    if (words.slice(0, 4).map(normAr).join(" ") === "بسم الله الرحمن الرحيم") { words = words.slice(4); }
  }
  return words;
}
/* اردو آواز صرف اسی ترجمے کے ساتھ چلتی ہے جس کی ریکارڈنگ موجود ہے */
function effectiveMode() {
  return curTrans.audio ? audioPlayMode : "arabic_only";
}

function initPlayerUI() {
  var sSelect = byId("surahSelector");
  if (sSelect) {
    var o = "";
    for (var i = 0; i < 114; i++) { o += "<option value='" + (i + 1) + "'>" + (i + 1) + ". سورۃ " + surahNames[i] + "</option>"; }
    sSelect.innerHTML = o;
    sSelect.value = "1";
  }
  curReciter = findBy(NF_CFG.reciters, loadPref("reciter")) || NF_CFG.reciters[0];
  curTrans = findBy(NF_CFG.translations, loadPref("trans")) || NF_CFG.translations[0];
  var m = loadPref("mode");
  if (m === "both" || m === "arabic_only" || m === "urdu_only") { audioPlayMode = m; }
  var rs = byId("reciterSelect");
  if (rs) {
    rs.innerHTML = NF_CFG.reciters.map(function(r) { return "<option value='" + r.id + "'>" + esc(r.name) + "</option>"; }).join("");
    rs.value = curReciter.id;
  }
  var ts = byId("transSelect");
  if (ts) {
    ts.innerHTML = NF_CFG.translations.map(function(r) { return "<option value='" + r.id + "'>" + esc(r.name) + "</option>"; }).join("");
    ts.value = curTrans.id;
  }
  updateModeUI();
}
function updateModeUI() {
  var ms = byId("audioModeSelect"), note = byId("transNote");
  if (ms) {
    ms.value = effectiveMode();
    ms.disabled = !curTrans.audio;
  }
  if (note) { note.style.display = curTrans.audio ? "none" : "block"; }
  var sub = byId("surahSub");
  if (sub) { sub.innerText = "تلاوت: " + curReciter.name + " · ترجمہ: " + curTrans.name; }
}
function setAudioMode(mode) {
  audioPlayMode = mode;
  savePref("mode", mode);
  if (currentVerseIndex >= 0) { stopAudio(); }
}
function setReciter(id) {
  var r = findBy(NF_CFG.reciters, id);
  if (!r) { return; }
  var idx = currentVerseIndex, auto = isAutoPlaying;
  var wasPlaying = idx >= 0 && !audioWasPaused;
  curReciter = r;
  savePref("reciter", id);
  stopAudio(); stopMini();
  updateModeUI();
  if (versesData.length) {
    var s = versesData[0].surahNum;
    loadSegments(s, function() {
      if (wasPlaying && curReciter === r && arSegSurah === s && versesData.length && versesData[0].surahNum === s) {
        isAutoPlaying = auto;
        playVerse(idx);
      }
    });
  }
  toast("قاری: " + r.name);
}
function setTrans(id) {
  var t = findBy(NF_CFG.translations, id);
  if (!t) { return; }
  var keep = currentVerseIndex >= 0 && versesData[currentVerseIndex] ? versesData[currentVerseIndex].numberInSurah : 0;
  curTrans = t;
  savePref("trans", id);
  updateModeUI();
  if (surahReqNum) { loadSurah(surahReqNum, false, keep); }
  each(".nf-ayah[data-done]", function(el) { el.removeAttribute("data-done"); });
  each(PAGE_SEL, function(pg) { if (pg.classList.contains("on")) { renderAyahEmbeds(pg); } });
}
/* پلیئر پہلی بار کھلنے پر ہی سورت لوڈ ہوتی ہے (ہوم پیج ہلکا رہتا ہے) */
function ensureSurahLoaded() {
  var sel = byId("surahSelector");
  var v = sel ? parseInt(sel.value, 10) || 1 : 1;
  if (surahReqNum !== v || (!versesData.length && !byId("loadingMsg"))) { loadSurah(v); }
  else { setHash("tadabbur", "t-recite", v); }
}
function focusAyah(n) {
  var card = byId("ayah-card-" + (n - 1));
  if (!card) { return; }
  setTimeout(function() {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("ayah-flash");
    setTimeout(function() { card.classList.remove("ayah-flash"); }, 2600);
  }, 250);
}

/* LOAD SURAH */
function loadSurah(surahNum, autoPlay, focus) {
  surahNum = parseInt(surahNum, 10);
  if (!surahNum) { return; }
  stopAudio();
  pendingAutoPlay = !!autoPlay;
  if (focus) { pendingAyah = focus; }
  surahReqNum = surahNum;
  var tok = ++surahReqTok;
  var trans = curTrans;
  var content = byId("tadabburContent");
  if (!content) { return; }
  var cfg = NF_PANELS.tadabbur;
  if (cfg.cur === "t-recite") { setHash("tadabbur", "t-recite", surahNum, pendingAyah || ""); }
  versesData = [];
  content.innerHTML =
  "<div class='surah-box'>" +
    "<div class='surah-head'>" +
      "<h2>سورۃ " + surahNames[surahNum - 1] + "</h2>" +
      "<span id='surahSub'>تلاوت: " + esc(curReciter.name) + " · ترجمہ: " + esc(trans.name) + "</span>" +
    "</div>" +
    "<div id='loadingMsg' class='surah-loading'>⏳ سورۃ " + surahNames[surahNum - 1] + " کا متن اور ترجمہ لوڈ ہو رہا ہے...</div>" +
    "<div id='versesContainer' style='display:none;'></div>" +
  "</div>";
  var url = "https://api.alquran.cloud/v1/surah/" + surahNum + "/editions/quran-uthmani," + trans.id;
  fetch(url)
  .then(function(res) {
    if (!res.ok) { throw new Error("Quran API network error"); }
    return res.json();
  })
  .then(function(json) {
    if (tok !== surahReqTok) { return; }
    if (json.code !== 200 || !json.data || json.data.length < 2) { throw new Error("Quran data not found"); }
    var arAyahs = json.data[0].ayahs;
    var urAyahs = json.data[1].ayahs;
    versesData = [];
    var container = byId("versesContainer");
    var html = "";
    for (var i = 0; i < arAyahs.length; i++) {
      var arObj = arAyahs[i];
      var urObj = urAyahs[i] || { text: "" };
      var words = ayahWords(arObj.text, surahNum, arObj.numberInSurah);
      var key = surahNum + ":" + arObj.numberInSurah;
      var wordsHtml = "";
      var urHtml = urObj.text.split(/\s+/).filter(function(x) { return x; }).map(function(x, k) {
        return "<span class='u-word' id='u-" + i + "-" + k + "'>" + esc(x) + "</span>";
      }).join(" ");
      for (var w = 0; w < words.length; w++) {
        wordsHtml += "<span class='q-word' id='w-" + i + "-" + w + "'>" + esc(words[w]) + "</span> ";
      }
      wordsHtml += "<span class='ayah-end'> ﴿" + arObj.numberInSurah + "﴾ </span>";
      versesData.push({
        index: i,
        globalNumber: arObj.number,
        numberInSurah: arObj.numberInSurah,
        surahNum: surahNum,
        wordsCount: words.length,
        urduText: urObj.text
      });
      NF_AYAH[key] = { s: surahNum, a: arObj.numberInSurah, ar: words.join(" "), ur: urObj.text, tr: trans.name };
      html +=
      "<div class='ayah-card' id='ayah-card-" + i + "' data-akey='" + key + "'>" +
        "<div class='ayah-card-header'>" +
          "<span class='ayah-no'>آیت نمبر: " + arObj.numberInSurah + "</span>" +
          "<button type='button' class='player-btn player-btn-sm ayah-play' data-i='" + i + "' onclick='toggleVerse(" + i + ")'>▶ سنیں</button>" +
        "</div>" +
        "<div class='ayah-arabic' lang='ar'>" + wordsHtml + "</div>" +
        "<div class='ayah-urdu' id='urdu-block-" + i + "'>" +
          "<strong class='ayah-urdu-lbl'>اردو ترجمہ: </strong>" + urHtml +
        "</div>" +
        "<div class='nf-share nf-share-ayah'>" + shareRow("آیت شیئر کریں:", SHARE_AYAH, SHARE_AYAH_MORE) + "</div>" +
      "</div>";
    }
    container.innerHTML = html;
    byId("loadingMsg").style.display = "none";
    container.style.display = "block";
    byId("audioControlBar").style.display = "flex";
    byId("playerStatus").innerText = "تلاوت: تیار ہے — کل آیات: " + versesData.length;
    if (pendingAyah) { focusAyah(pendingAyah); pendingAyah = 0; }
    var wantAuto = pendingAutoPlay;
    loadSegments(surahNum, wantAuto ? function() {
      if (pendingAutoPlay && arSegSurah === surahNum) {
        pendingAutoPlay = false;
        playFullSurah();
      }
    } : undefined);
  })
  .catch(function(err) {
    if (tok !== surahReqTok) { return; }
    console.error(err);
    pendingAutoPlay = false;
    surahReqNum = 0;
    var lm = byId("loadingMsg");
    if (lm) {
      lm.innerHTML =
        "<div class='surah-error'>⚠ قرآن کا ڈیٹا حاصل کرنے میں مسئلہ پیش آیا۔<br/><br/>براہ کرم انٹرنیٹ کنکشن چیک کرکے دوبارہ کوشش کریں۔" +
        "<br/><br/><button type='button' class='player-btn' onclick='loadSurah(" + surahNum + ")'>دوبارہ کوشش کریں</button></div>";
    }
  });
}

/* ---------- اردو آڈیو (جالندھری ترجمہ): islamic.network → everyayah ---------- */
function getUrduAudioUrls(vData) {
  return [
    "https://cdn.islamic.network/quran/audio/64/ur.khan/" + vData.globalNumber + ".mp3",
    "https://everyayah.com/data/Urdu_Shamshad_Ali_Khan_46kbps/" + pad3(vData.surahNum) + pad3(vData.numberInSurah) + ".mp3"
  ];
}
/* ---------- منتخب قاری کی آیت وار آڈیو ---------- */
function ayahAudioUrls(rc, s, a, g) {
  var out = [];
  (rc.ea || []).forEach(function(f) { out.push("https://everyayah.com/data/" + f + "/" + pad3(s) + pad3(a) + ".mp3"); });
  if (rc.cdn && g) { out.push("https://cdn.islamic.network/quran/audio/" + rc.cdn[1] + "/" + rc.cdn[0] + "/" + g + ".mp3"); }
  return out;
}

/* ---------- SYNC ENGINE (عربی highlight + اردو پٹی) ----------
   اگر highlight آواز سے پہلے/بعد میں لگے تو یہ ویلیوز بدلیں (سیکنڈ): */
var ARABIC_LEAD_SEC = 0.10;   /* آیت کے شروع کی خاموشی */
var ARABIC_TAIL_SEC = 0.20;   /* آیت کے آخر کی خاموشی */
var URDU_LEAD_SEC = 0.15;
var URDU_TAIL_SEC = 0.25;
var syncRaf = null;
var urPreloadedUrl = "";
var nextArPre = new Audio();
nextArPre.preload = "auto";

function stopSync() {
  if (syncRaf) { cancelAnimationFrame(syncRaf); syncRaf = null; }
}

var arSegData = {};      /* آیت نمبر -> {urls:[...], segs:[[لفظ,شروع_ms,ختم_ms],...]} */
var arSegSurah = 0;
var arCurrentIsReal = false;

function makeSmoother(audio) {
  var lastCT = -1, lastPF = 0;
  return function() {
    var now = performance.now();
    if (audio.currentTime !== lastCT) { lastCT = audio.currentTime; lastPF = now; }
    var extra = audio.paused ? 0 : Math.min((now - lastPF) / 1000, 0.3);
    return lastCT + extra;
  };
}
function synthTimes(weights, total, dur, lead, tail) {
  var usable = Math.max(dur - lead - tail, 0.1);
  var out = [], acc = 0;
  for (var i = 0; i < weights.length; i++) {
    var s = lead + usable * acc / total;
    acc += weights[i];
    out.push({ s: s, e: lead + usable * acc / total });
  }
  return out;
}
function realTimes(segs, n) {
  var m = segs.length;
  if (m === n + 1) { m = n; }
  var out = [];
  for (var k = 0; k < n; k++) {
    var j = (m === n) ? k : Math.min(m - 1, Math.floor(k * m / n));
    var sg = segs[j];
    var s = sg[sg.length - 2] / 1000;
    var e = sg[sg.length - 1] / 1000;
    if (out.length && s < out[out.length - 1].s) { s = out[out.length - 1].s; }
    if (e <= s) { e = s + 0.05; }
    out.push({ s: s, e: e });
  }
  return out;
}
function getBand(container, kind) {
  var b = container._band;
  if (!b) {
    b = document.createElement("div");
    b.className = "line-band " + kind;
    container.insertBefore(b, container.firstChild);
    container._band = b;
  }
  return b;
}
/* پٹی کو موجودہ لفظ والی پوری سطر پر رکھیں؛ سطر بدلے تو نیچے سرک جائے */
function placeBand(container, el, kind) {
  var b = getBand(container, kind);
  var lh = parseFloat(getComputedStyle(container).lineHeight);
  if (!isFinite(lh)) { lh = el.offsetHeight; }
  var top = el.offsetTop + el.offsetHeight / 2 - lh / 2;
  var wasOn = b.classList.contains("on");
  if (!wasOn) { b.style.transition = "none"; }
  b.style.top = top + "px";
  b.style.height = lh + "px";
  if (!wasOn) {
    void b.offsetHeight;
    b.style.transition = "";
    b.classList.add("on");
  }
}
function hideBands() {
  each(".line-band", function(b) { b.classList.remove("on"); });
}
function startKaraoke(audio, els, curCls, getTimes, container, kind) {
  stopSync();
  if (!els.length) { return; }
  var smooth = makeSmoother(audio);
  var last = -1;
  function tick() {
    var times = getTimes();
    if (times) {
      var t = smooth();
      var idx = 0;
      for (var i = 0; i < times.length; i++) {
        if (times[i].s <= t) { idx = i; } else { break; }
      }
      if (idx !== last) {
        for (var k = 0; k < els.length; k++) { els[k].classList.remove(curCls); }
        els[idx].classList.add(curCls);
        if (container) { placeBand(container, els[idx], kind); }
        last = idx;
      }
    }
    if (!audio.paused && !audio.ended) {
      syncRaf = requestAnimationFrame(tick);
    }
  }
  tick();
}
function startArabicSync(vIdx) {
  var d = versesData[vIdx];
  if (!d) { return; }
  var els = [], weights = [], total = 0;
  for (var w = 0; w < d.wordsCount; w++) {
    var el = byId("w-" + vIdx + "-" + w);
    if (el) {
      var len = el.textContent.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "").length;
      els.push(el);
      weights.push(len + 1);
      total += len + 1;
    }
  }
  var cache = null;
  var sd = arSegData[d.numberInSurah];
  startKaraoke(arAudio, els, "active-word", function() {
    if (cache) { return cache; }
    /* اصل ٹائمنگ (quran.com) */
    if (arCurrentIsReal && sd && sd.segs) {
      cache = realTimes(sd.segs, els.length);
      return cache;
    }
    /* اندازے والی ٹائمنگ (بیک اپ) */
    var dur = arAudio.duration;
    if (!isFinite(dur) || dur <= 0) { return null; }
    cache = synthTimes(weights, total, dur, ARABIC_LEAD_SEC, ARABIC_TAIL_SEC);
    return cache;
  }, document.querySelector("#ayah-card-" + vIdx + " .ayah-arabic"), "gold");
}
function markArabicRead(vIdx) {
  each("#ayah-card-" + vIdx + " .q-word", function(el) { el.classList.remove("active-word"); });
  var c = document.querySelector("#ayah-card-" + vIdx + " .ayah-arabic");
  if (c && c._band) { c._band.classList.remove("on"); }
}
function markUrduAllRead(vIdx) {
  each("#urdu-block-" + vIdx + " .u-word", function(el) { el.classList.remove("u-current"); });
  var c = byId("urdu-block-" + vIdx);
  if (c && c._band) { c._band.classList.remove("on"); }
}
function startUrduProgress(vIdx) {
  var els = Array.prototype.slice.call(document.querySelectorAll("#urdu-block-" + vIdx + " .u-word"));
  var weights = [], total = 0;
  els.forEach(function(el) {
    var wt = el.textContent.length + 1;
    weights.push(wt);
    total += wt;
  });
  var cache = null;
  startKaraoke(urAudio, els, "u-current", function() {
    if (cache) { return cache; }
    var dur = urAudio.duration;
    if (!isFinite(dur) || dur <= 0) { return null; }
    cache = synthTimes(weights, total, dur, URDU_LEAD_SEC, URDU_TAIL_SEC);
    return cache;
  }, byId("urdu-block-" + vIdx), "emerald");
}

/* quran.com سے منتخب قاری کی لفظ بہ لفظ اصل ٹائمنگ (جن قراء کی qc درج ہے) */
function loadSegments(surahNum, firstDone) {
  arSegData = {};
  arSegSurah = surahNum;
  var rc = curReciter;
  var firstCalled = false;
  function fire() { if (!firstCalled) { firstCalled = true; if (firstDone) { firstDone(); } } }
  if (!rc.qc) { setTimeout(fire, 0); return; }
  var base = "https://api.quran.com/api/v4/recitations/" + rc.qc + "/by_chapter/" + surahNum + "?fields=segments&per_page=50&page=";
  function page(p) {
    fetch(base + p)
      .then(function(r) {
        if (!r.ok) { throw new Error("segments http " + r.status); }
        return r.json();
      })
      .then(function(j) {
        if (arSegSurah !== surahNum || curReciter !== rc) { return; }
        (j.audio_files || []).forEach(function(f) {
          var vn = parseInt(String(f.verse_key || "").split(":")[1]);
          if (!vn || !f.segments || !f.segments.length) { return; }
          var rel = f.url || "";
          var urls = /^https?:/.test(rel)
            ? [rel]
            : (/^\/\//.test(rel) ? ["https:" + rel] : ["https://verses.quran.foundation/" + rel, "https://verses.quran.com/" + rel]);
          arSegData[vn] = { urls: urls, segs: f.segments };
        });
        fire();
        var next = j.pagination && j.pagination.next_page;
        if (next) { page(next); }
      })
      .catch(function(e) {
        console.warn("Word timings unavailable, using estimated sync:", e);
        fire();
      });
  }
  page(1);
}
function arabicCandidates(vIdx) {
  var vd = versesData[vIdx];
  var c = [];
  var sd = arSegData[vd.numberInSurah];
  if (sd && sd.segs && sd.segs.length) {
    sd.urls.forEach(function(u) { c.push({ url: u, real: true }); });
  }
  ayahAudioUrls(curReciter, vd.surahNum, vd.numberInSurah, vd.globalNumber).forEach(function(u) { c.push({ url: u, real: false }); });
  return c;
}

/* PLAY SINGLE VERSE */
function playVerse(vIdx) {
  if (vIdx < 0 || vIdx >= versesData.length) { return; }
  stopMini();
  clearHighlights();
  currentVerseIndex = vIdx;
  audioWasPaused = false;
  syncPlayUI();
  var vData = versesData[vIdx];
  var mode = effectiveMode();
  /* صرف اردو */
  if (mode === "urdu_only") {
    playUrduAudio(vIdx, 0);
    return;
  }
  /* عربی */
  isPlayingUrdu = false;
  var card = byId("ayah-card-" + vIdx);
  if (card) {
    card.classList.add("ayah-active");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  arAudio.pause();
  urAudio.pause();
  /* اصل ٹائمنگ والی فائل پہلے، پھر بیک اپ ذرائع */
  var arCands = arabicCandidates(vIdx);
  var arTry = 0;
  function setArabicSource() {
    arCurrentIsReal = arCands[arTry].real;
    arAudio.src = arCands[arTry].url;
    arAudio.load();
  }
  if (!arCands.length) { goToNextVerse(); return; }
  setArabicSource();
  /* اردو آڈیو پہلے سے لوڈ کریں تاکہ عربی ختم ہوتے ہی فوراً چلے */
  urAudio.onerror = null;
  urAudio.onended = null;
  urAudio.onplaying = null;
  if (mode === "both") {
    urPreloadedUrl = getUrduAudioUrls(vData)[0];
    urPre.src = urPreloadedUrl;
  } else {
    urPreloadedUrl = "";
  }
  /* اگلی آیت کی عربی آڈیو بھی پہلے سے لوڈ */
  if (vIdx + 1 < versesData.length) {
    var nx = arabicCandidates(vIdx + 1);
    if (nx.length) { nextArPre.src = nx[0].url; }
  }
  byId("playerStatus").innerText = curReciter.name + " — آیت نمبر " + vData.numberInSurah;
  /* لفظ بہ لفظ highlight: آواز شروع ہوتے ہی (playing) اور currentTime کے مطابق */
  arAudio.onloadedmetadata = null;
  arAudio.onplaying = function() { startArabicSync(vIdx); };
  /* عربی ختم */
  arAudio.onended = function() {
    clearInterval(wordInterval);
    stopSync();
    markArabicRead(vIdx);
    if (mode === "both") { playUrduAudio(vIdx, 0); } else { goToNextVerse(); }
  };
  /* عربی آڈیو error: اگلا ذریعہ آزمائیں */
  arAudio.onerror = function() {
    if (arTry + 1 < arCands.length) {
      arTry++;
      setArabicSource();
      arAudio.play().catch(function() {});
      return;
    }
    console.warn("Arabic audio failed");
    byId("playerStatus").innerText = "اس قاری کی آڈیو دستیاب نہیں ہو سکی — آیت " + vData.numberInSurah;
    if (mode === "both") { playUrduAudio(vIdx, 0); }
    else if (isAutoPlaying) { setTimeout(function() { if (currentVerseIndex === vIdx) { goToNextVerse(); } }, 800); }
    else { stopAudio(); byId("playerStatus").innerText = "اس قاری کی آڈیو دستیاب نہیں ہو سکی — آیت " + vData.numberInSurah; }
  };
  arAudio.play().catch(function(error) {
    if (error && error.name === "AbortError") { return; }
    if (error && error.name === "NotAllowedError") { needTap(); return; }
    console.warn("Arabic playback error:", error);
  });
}

/* PLAY URDU AUDIO (کئی ذرائع آزما کر) */
function playUrduAudio(vIdx, srcIdx) {
  srcIdx = srcIdx || 0;
  isPlayingUrdu = true;
  var vData = versesData[vIdx];
  var card = byId("ayah-card-" + vIdx);
  if (card) {
    card.classList.add("ayah-active");
    card.classList.add("urdu-playing");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  byId("playerStatus").innerText = "اردو ترجمہ — آیت نمبر " + vData.numberInSurah;
  var urls = getUrduAudioUrls(vData);
  /* تمام ذرائع ناکام ہو گئے */
  if (srcIdx >= urls.length) {
    showAudioError(vIdx);
    return;
  }
  var currentUrl = urls[srcIdx];
  arAudio.pause();
  urAudio.pause();
  /* پرانے handlers صاف کریں تاکہ پچھلا error نئے audio پر نہ چلے */
  urAudio.onerror = null;
  urAudio.onended = null;
  urAudio.onplaying = null;
  urAudio.src = currentUrl;
  urAudio.load();
  urPreloadedUrl = "";
  /* اگر یہ ذریعہ نہ چلے تو اگلا آزمائیں */
  urAudio.onerror = function() {
    console.warn("Urdu audio failed, trying next source:", currentUrl);
    playUrduAudio(vIdx, srcIdx + 1);
  };
  urAudio.onplaying = function() { startUrduProgress(vIdx); };
  urAudio.onended = function() {
    markUrduAllRead(vIdx);
    if (card) { card.classList.remove("urdu-playing"); }
    goToNextVerse();
  };
  var promise = urAudio.play();
  if (promise !== undefined) {
    promise.catch(function(error) {
      /* وقفہ/نیا audio لوڈ ہونے سے آنے والی غلطی کو نظر انداز کریں */
      if (error && error.name === "AbortError") { return; }
      if (error && error.name === "NotAllowedError") { needTap(); return; }
      console.warn("Urdu audio play error:", error);
      playUrduAudio(vIdx, srcIdx + 1);
    });
  }
}

/* AUDIO ERROR MESSAGE */
function showAudioError(vIdx) {
  var card = byId("ayah-card-" + vIdx);
  if (card) { card.classList.remove("urdu-playing"); }
  var block = byId("urdu-block-" + vIdx);
  if (block) {
    var oldError = block.querySelector(".audio-error");
    if (oldError) { oldError.remove(); }
    var errorBox = document.createElement("div");
    errorBox.className = "audio-error";
    errorBox.innerHTML = "⚠ اس آیت کی اردو آڈیو اس وقت دستیاب نہیں ہو سکی۔ ترجمہ متن درست طور پر موجود ہے۔";
    block.appendChild(errorBox);
  }
  /* اگر مکمل سورت چل رہی ہو تو اگلی آیت پر جائیں */
  if (isAutoPlaying) {
    setTimeout(function() { if (currentVerseIndex === vIdx) { goToNextVerse(); } }, 1000);
  } else {
    stopAudio();
    byId("playerStatus").innerText = "اردو آڈیو دستیاب نہیں ہو سکی";
  }
}

/* NEXT VERSE */
function goToNextVerse() {
  if (isAutoPlaying && currentVerseIndex + 1 < versesData.length) {
    playVerse(currentVerseIndex + 1);
    return;
  }
  /* سورت ختم: اگلی سورت خود بخود شروع کریں */
  var cb = byId("autoNextSurah");
  var cur = versesData.length ? versesData[0].surahNum : 0;
  if (isAutoPlaying && cb && cb.checked && cur >= 1 && cur < 114) {
    var nxt = cur + 1;
    var sel = byId("surahSelector");
    if (sel) { sel.value = String(nxt); }
    loadSurah(nxt, true);
    var st = byId("playerStatus");
    if (st) { st.innerText = "اگلی سورت شروع ہو رہی ہے: " + surahNames[nxt - 1]; }
    return;
  }
  stopAudio();
  var status = byId("playerStatus");
  if (status) { status.innerText = "تلاوت مکمل ہو گئی"; }
}
/* پچھلی / اگلی آیت */
function stepVerse(d) {
  if (!versesData.length) { return; }
  var i = currentVerseIndex < 0 ? 0 : currentVerseIndex + d;
  if (i < 0 || i >= versesData.length) { return; }
  playVerse(i);
}

/* FULL SURAH */
function playFullSurah() {
  if (versesData.length === 0) { return; }
  isAutoPlaying = true;
  audioWasPaused = false;
  playVerse(0);
}
/* PAUSE */
function pauseAudio() {
  arAudio.pause();
  urAudio.pause();
  audioWasPaused = true;
  stopSync();
  clearInterval(wordInterval);
  var s = byId("playerStatus");
  if (s) { s.innerText = "تلاوت روک دی گئی — دوبارہ چلانے کے لیے ▶ دبائیں"; }
  syncPlayUI();
}
/* RESUME */
function resumeAudio() {
  if (currentVerseIndex < 0) { return; }
  audioWasPaused = false;
  var promise;
  if (isPlayingUrdu) { promise = urAudio.play(); } else { promise = arAudio.play(); }
  if (promise !== undefined) {
    promise.catch(function(error) { console.warn("Resume error:", error); });
  }
  syncPlayUI();
}
/* STOP */
function stopAudio() {
  pendingAutoPlay = false;
  arAudio.pause();
  urAudio.pause();
  /* stop کے وقت handlers ہٹائیں تاکہ جھوٹی error نہ آئے */
  urAudio.onerror = null;
  urAudio.onended = null;
  urAudio.onplaying = null;
  arAudio.onplaying = null;
  arAudio.onerror = null;
  arAudio.onended = null;
  stopSync();
  try { arAudio.currentTime = 0; } catch (e) {}
  try { urAudio.currentTime = 0; } catch (e) {}
  clearInterval(wordInterval);
  clearHighlights();
  currentVerseIndex = -1;
  isAutoPlaying = false;
  isPlayingUrdu = false;
  audioWasPaused = false;
  var s = byId("playerStatus");
  if (s) { s.innerText = "تلاوت: بند ہے"; }
  syncPlayUI();
}

/* ---------- چلتی آیت کے کنٹرول: آیت کا اپنا بٹن + نیچے تیرتی پٹی ----------
   تاکہ روکنے کے لیے اوپر اسکرول نہ کرنا پڑے */
/* ---------- تلاوت کو درمیان میں رکنے سے بچانا ----------
   (1) اسکرین کو جاگتا رکھنا  (2) اٹکی ہوئی آڈیو کو دوبارہ لوڈ کرنا / اگلا ذریعہ آزمانا
   (3) چھوٹا ہوا "ختم" کا اشارہ پکڑنا  (4) صفحے پر واپسی پر خود جاری ہونا */
var wakeLock = null;
var wd = { idx: -1, urdu: false, t: -1, still: 0, resumes: 0, reloaded: false };
function keepAwake(on) {
  if (!("wakeLock" in navigator)) { return; }
  if (on) {
    if (wakeLock || document.visibilityState !== "visible") { return; }
    navigator.wakeLock.request("screen").then(function(l) {
      wakeLock = l;
      l.addEventListener("release", function() { if (wakeLock === l) { wakeLock = null; } });
      if (currentVerseIndex < 0 || audioWasPaused) { keepAwake(false); }
    }).catch(function() {});
  } else if (wakeLock) {
    var l = wakeLock; wakeLock = null;
    l.release().catch(function() {});
  }
}
function needTap() {
  if (currentVerseIndex < 0) { return; }
  audioWasPaused = true;
  var s = byId("playerStatus");
  if (s) { s.innerText = "تلاوت رک گئی — جاری رکھنے کے لیے ▶ چلائیں دبائیں"; }
  syncPlayUI();
}
function recoverPlayback(fromVisible) {
  if (currentVerseIndex < 0 || audioWasPaused) { return; }
  var el = isPlayingUrdu ? urAudio : arAudio;
  if (wd.idx !== currentVerseIndex || wd.urdu !== isPlayingUrdu) {
    wd = { idx: currentVerseIndex, urdu: isPlayingUrdu, t: -1, still: 0, resumes: 0, reloaded: false };
  }
  if (fromVisible) { wd.resumes = 0; }
  /* آڈیو ختم ہو چکی مگر اگلی آیت شروع نہیں ہوئی */
  if (el.ended) { if (el.onended) { el.onended(); } return; }
  if (el.error) { return; }
  /* کسی بیرونی وجہ سے رک گئی (نوٹیفکیشن، دوسری ایپ، براؤزر) */
  if (el.paused) {
    if (wd.resumes < 2) { wd.resumes++; el.play().catch(function() {}); }
    else { needTap(); }
    return;
  }
  if (fromVisible) { return; }
  /* چل رہی ہے مگر آگے نہیں بڑھ رہی (نیٹ ورک اٹک گیا) */
  if (el.currentTime === wd.t) {
    wd.still++;
    if (wd.still >= 3) {
      wd.still = 0;
      if (!wd.reloaded) {
        wd.reloaded = true;
        var t = el.currentTime, src = el.src;
        try { el.src = src; el.load(); if (t > 0.3) { el.currentTime = t; } } catch (e) {}
        el.play().catch(function() {});
      } else if (el.onerror) { el.onerror(); }
    }
  } else { wd.t = el.currentTime; wd.still = 0; }
}
setInterval(function() { recoverPlayback(false); }, 2000);
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState !== "visible") { return; }
  recoverPlayback(true);
  keepAwake(currentVerseIndex >= 0 && !audioWasPaused);
});
/* لاک اسکرین / نوٹیفکیشن کے کنٹرول */
function mediaMeta() {
  if (!("mediaSession" in navigator) || !window.MediaMetadata || currentVerseIndex < 0 || !versesData[currentVerseIndex]) { return; }
  var v = versesData[currentVerseIndex];
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "سورۃ " + surahNames[v.surahNum - 1] + " — آیت " + v.numberInSurah,
      artist: curReciter.name, album: NF_CFG.site
    });
  } catch (e) {}
}
if ("mediaSession" in navigator) {
  [["play", function() { resumeAudio(); }], ["pause", function() { pauseAudio(); }], ["stop", function() { stopAudio(); }],
   ["nexttrack", function() { stepVerse(1); }], ["previoustrack", function() { stepVerse(-1); }]].forEach(function(h) {
    try { navigator.mediaSession.setActionHandler(h[0], h[1]); } catch (e) {}
  });
}

function toggleVerse(i) {
  if (currentVerseIndex === i) { stopAudio(); } else { playVerse(i); }
}
function syncPlayUI() {
  var on = currentVerseIndex >= 0 && !!versesData[currentVerseIndex];
  keepAwake(on && !audioWasPaused);
  if (on) { mediaMeta(); }
  each(".ayah-play", function(b) {
    var act = on && parseInt(b.getAttribute("data-i"), 10) === currentVerseIndex;
    b.innerText = act ? "⏹ بند کریں" : "▶ سنیں";
    b.classList.toggle("is-stop", act);
  });
  var f = byId("nfFloat");
  if (!on) {
    if (f) { f.hidden = true; }
    document.body.classList.remove("nf-playing");
    return;
  }
  if (!f) {
    f = document.createElement("div");
    f.id = "nfFloat"; f.className = "nf-float";
    f.setAttribute("role", "group"); f.setAttribute("aria-label", "تلاوت کے کنٹرول");
    f.innerHTML =
      "<span class='nf-float-txt' id='nfFloatTxt'></span>" +
      "<button type='button' class='player-btn' data-pact='prev' aria-label='پچھلی آیت' title='پچھلی آیت'>⏮</button>" +
      "<button type='button' class='player-btn' data-pact='toggle' id='nfFloatToggle'></button>" +
      "<button type='button' class='player-btn' data-pact='next' aria-label='اگلی آیت' title='اگلی آیت'>⏭</button>" +
      "<button type='button' class='player-btn is-stop' data-pact='stop'>⏹ بند</button>";
    document.body.appendChild(f);
  }
  byId("nfFloatTxt").innerText = "آیت " + versesData[currentVerseIndex].numberInSurah;
  var tg = byId("nfFloatToggle");
  tg.innerText = audioWasPaused ? "▶ چلائیں" : "⏸ وقفہ";
  f.hidden = false;
  document.body.classList.add("nf-playing");
}
function floatAct(a) {
  if (a === "stop") { stopAudio(); }
  else if (a === "prev") { stepVerse(-1); }
  else if (a === "next") { stepVerse(1); }
  else if (a === "toggle") { if (audioWasPaused) { resumeAudio(); } else { pauseAudio(); } }
}
/* CLEAR HIGHLIGHTS */
function clearHighlights() {
  clearInterval(wordInterval);
  stopSync();
  each(".u-word.u-current", function(el) { el.classList.remove("u-current"); });
  hideBands();
  each(".active-word", function(el) { el.classList.remove("active-word"); });
  each(".ayah-active", function(el) { el.classList.remove("ayah-active"); });
  each(".urdu-playing", function(el) { el.classList.remove("urdu-playing"); });
}

/* =====================================================================
   5. AYAH EMBEDS + تصویری کارڈ
   کسی بھی باب / حصے میں یہ ایک سطر لکھیں، آیت خود آ جائے گی
   (منتخب ترجمہ، منتخب قاری کی آواز اور شیئر بٹنوں کے ساتھ):
       <div class='nf-ayah' data-ref='2:255'>آیت الکرسی</div>
       <div class='nf-ayah' data-ref='103:1-3'>سورۃ العصر</div>
   ===================================================================== */
var miniAudio = new Audio();
var miniBtn = null;

function renderAyahEmbeds(root) {
  if (!root) { return; }
  each(".nf-ayah:not([data-done])", function(el) {
    var cb = el.closest(".chap-body");
    if (cb && !cb.classList.contains("open")) { return; }
    var m = /^\s*(\d{1,3})\s*:\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?\s*$/.exec(el.getAttribute("data-ref") || "");
    if (!m) { return; }
    var s = parseInt(m[1], 10), a = parseInt(m[2], 10), b = parseInt(m[3] || m[2], 10);
    if (s < 1 || s > 114 || a < 1 || b < a) { return; }
    if (b - a > 19) { b = a + 19; }
    el.setAttribute("data-done", "1");
    if (!el.getAttribute("data-label")) { el.setAttribute("data-label", plain(el.textContent)); }
    var trans = curTrans;
    el.innerHTML = "<div class='surah-loading'>⏳ آیت لوڈ ہو رہی ہے...</div>";
    fetch("https://api.alquran.cloud/v1/surah/" + s + "/editions/quran-uthmani," + trans.id + "?offset=" + (a - 1) + "&limit=" + (b - a + 1))
      .then(function(r) { if (!r.ok) { throw new Error("http " + r.status); } return r.json(); })
      .then(function(j) {
        if (!j.data || j.data.length < 2) { throw new Error("no data"); }
        var ar = j.data[0].ayahs || [], ur = j.data[1].ayahs || [], html = "";
        if (!ar.length) { throw new Error("ayah not found"); }
        for (var i = 0; i < ar.length; i++) {
          var n = ar[i].numberInSurah, key = s + ":" + n;
          var words = ayahWords(ar[i].text, s, n);
          var urText = ur[i] ? ur[i].text : "";
          NF_AYAH[key] = { s: s, a: n, ar: words.join(" "), ur: urText, tr: trans.name };
          html +=
          "<div class='ayah-card nf-mini' data-akey='" + key + "' data-g='" + ar[i].number + "'>" +
            "<div class='ayah-card-header'>" +
              "<span class='ayah-no'>سورۃ " + surahNames[s - 1] + " — آیت " + n + "</span>" +
              "<button type='button' class='player-btn player-btn-sm' data-mini='1'>▶ سنیں</button>" +
            "</div>" +
            "<div class='ayah-arabic' lang='ar'>" + esc(words.join(" ")) + "<span class='ayah-end'> ﴿" + n + "﴾ </span></div>" +
            "<div class='ayah-urdu'><strong class='ayah-urdu-lbl'>اردو ترجمہ: </strong>" + esc(urText) + "</div>" +
            "<div class='nf-share nf-share-ayah'>" + shareRow("آیت شیئر کریں:", SHARE_AYAH, SHARE_AYAH_MORE) + "</div>" +
          "</div>";
        }
        el.innerHTML = html;
      })
      .catch(function(e) {
        console.warn("Ayah embed failed:", e);
        el.removeAttribute("data-done");
        el.innerHTML = "<div class='surah-error'>⚠ آیت (" + esc(el.getAttribute("data-ref")) + ") لوڈ نہیں ہو سکی۔ " + esc(el.getAttribute("data-label")) + "</div>";
      });
  }, root);
}
function stopMini() {
  miniAudio.onerror = null; miniAudio.onended = null;
  miniAudio.pause();
  if (miniBtn) {
    miniBtn.innerText = "▶ سنیں";
    var c = miniBtn.closest(".ayah-card");
    if (c) { c.classList.remove("ayah-active"); }
  }
  miniBtn = null;
}
function playMini(btn) {
  if (miniBtn === btn) { stopMini(); return; }
  stopAudio(); stopMini();
  var card = btn.closest(".ayah-card");
  var d = card ? NF_AYAH[card.getAttribute("data-akey")] : null;
  if (!d) { return; }
  var urls = ayahAudioUrls(curReciter, d.s, d.a, parseInt(card.getAttribute("data-g"), 10));
  var i = 0;
  miniBtn = btn;
  btn.innerText = "⏹ بند کریں";
  card.classList.add("ayah-active");
  function go() {
    if (i >= urls.length) { stopMini(); toast("اس آیت کی آڈیو دستیاب نہیں ہو سکی"); return; }
    miniAudio.src = urls[i];
    miniAudio.play().catch(function() {});
  }
  miniAudio.onerror = function() { i++; go(); };
  miniAudio.onended = function() { stopMini(); };
  go();
}

/* ---------- آیت کا تصویری کارڈ (Canvas → PNG) ---------- */
function wrapLines(ctx, text, maxW) {
  var words = plain(text).split(" "), lines = [], cur = "";
  for (var i = 0; i < words.length; i++) {
    var t = cur ? cur + " " + words[i] : words[i];
    if (cur && ctx.measureText(t).width > maxW) { lines.push(cur); cur = words[i]; }
    else { cur = t; }
  }
  if (cur) { lines.push(cur); }
  return lines;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
var AR_FONT = "'Amiri','Noto Naskh Arabic',serif";
var UR_FONT = "'Noto Nastaliq Urdu',Tahoma,sans-serif";

function buildAyahCard(info, cb) {
  var ready = (document.fonts && document.fonts.load)
    ? Promise.all([document.fonts.load("700 48px Amiri", info.ar.slice(0, 24)), document.fonts.load("400 30px 'Noto Nastaliq Urdu'", info.ur.slice(0, 24) + NF_CFG.site)]).catch(function() {})
    : Promise.resolve();
  ready.then(function() {
    var W = 1080, PAD = 110, HEAD = 230, FOOT = 250, GAP = 70;
    /* مربع → پورٹریٹ → اسٹوری: جس میں آیت پوری آ جائے */
    var tries = [[1080, [66, 58, 50, 44]], [1350, [56, 50, 44, 38]], [1920, [54, 48, 42, 36, 32, 28]]];
    var cv = document.createElement("canvas");
    var ctx = cv.getContext("2d");
    var fit = null;
    for (var t = 0; t < tries.length && !fit; t++) {
      for (var k = 0; k < tries[t][1].length && !fit; k++) {
        var as = tries[t][1][k], us = Math.round(as * 0.58);
        ctx.font = "700 " + as + "px " + AR_FONT;
        var al = wrapLines(ctx, "﴿ " + info.ar + " ﴾", W - PAD * 2);
        ctx.font = "400 " + us + "px " + UR_FONT;
        var ul = wrapLines(ctx, info.ur, W - PAD * 2);
        var h = al.length * as * 1.95 + GAP + ul.length * us * 2.35;
        if (HEAD + h + FOOT <= tries[t][0]) { fit = { H: tries[t][0], as: as, us: us, al: al, ul: ul, h: h }; }
      }
    }
    if (!fit) { cb(null); return; }
    var H = fit.H;
    cv.width = W; cv.height = H;
    ctx.direction = "rtl"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    /* پس منظر */
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#04231A"); g.addColorStop(0.55, "#073528"); g.addColorStop(1, "#021711");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    /* سنہری حاشیہ */
    ctx.strokeStyle = "#BF953F"; ctx.lineWidth = 6; roundRect(ctx, 36, 36, W - 72, H - 72, 28); ctx.stroke();
    ctx.strokeStyle = "rgba(243,229,171,.45)"; ctx.lineWidth = 2; roundRect(ctx, 54, 54, W - 108, H - 108, 20); ctx.stroke();
    /* سرنامہ */
    ctx.fillStyle = "#F3E5AB"; ctx.font = "700 46px " + UR_FONT; ctx.fillText(NF_CFG.site, W / 2, 128);
    ctx.strokeStyle = "#8C6A2F"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 150, 196); ctx.lineTo(W / 2 + 150, 196); ctx.stroke();
    /* عربی متن */
    var y = HEAD + (H - HEAD - FOOT - fit.h) / 2;
    ctx.fillStyle = "#FFFDF8"; ctx.font = "700 " + fit.as + "px " + AR_FONT;
    var lh = fit.as * 1.95, i;
    for (i = 0; i < fit.al.length; i++) { ctx.fillText(fit.al[i], W / 2, y + lh * (i + 0.5)); }
    y += fit.al.length * lh + GAP / 2;
    ctx.strokeStyle = "rgba(191,149,63,.7)"; ctx.setLineDash([10, 10]);
    ctx.beginPath(); ctx.moveTo(PAD + 60, y); ctx.lineTo(W - PAD - 60, y); ctx.stroke(); ctx.setLineDash([]);
    y += GAP / 2;
    /* اردو ترجمہ */
    ctx.fillStyle = "#F5E2B3"; ctx.font = "400 " + fit.us + "px " + UR_FONT;
    lh = fit.us * 2.35;
    for (i = 0; i < fit.ul.length; i++) { ctx.fillText(fit.ul[i], W / 2, y + lh * (i + 0.5)); }
    /* حوالہ */
    var ref = "سورۃ " + surahNames[info.s - 1] + " · آیت " + info.a;
    ctx.font = "700 34px " + UR_FONT;
    var rw = ctx.measureText(ref).width + 90;
    ctx.fillStyle = "#BF953F"; roundRect(ctx, (W - rw) / 2, H - 222, rw, 84, 42); ctx.fill();
    ctx.fillStyle = "#04231A"; ctx.fillText(ref, W / 2, H - 186);
    ctx.fillStyle = "rgba(243,229,171,.85)"; ctx.font = "400 24px " + UR_FONT;
    ctx.fillText("ترجمہ: " + info.tr, W / 2, H - 100);
    cv.toBlob(function(blob) { cb(blob); }, "image/png");
  });
}

var cardState = { blob: null, info: null, url: "", back: null };
function closeAyahCard() {
  var m = byId("nfCardModal");
  if (!m || m.hidden) { return; }
  m.hidden = true;
  if (cardState.url) { URL.revokeObjectURL(cardState.url); cardState.url = ""; }
  if (cardState.back && cardState.back.focus) { cardState.back.focus(); }
}
function cardAct(act) {
  var blob = cardState.blob, info = cardState.info;
  if (act === "close" || !blob) { closeAyahCard(); return; }
  var name = "ayah-" + info.s + "-" + info.a + ".png";
  if (act === "dl") {
    var a = document.createElement("a");
    a.href = cardState.url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast("کارڈ محفوظ ہو رہا ہے");
  } else if (act === "share") {
    var file = new File([blob], name, { type: "image/png" });
    navigator.share({ files: [file], title: info.title, text: captionOf(info) }).catch(function() {});
  } else if (act === "copyimg") {
    navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      .then(function() { toast("تصویر کاپی ہو گئی"); })
      .catch(function() { toast("تصویر کاپی نہیں ہو سکی — ڈاؤن لوڈ کر لیں"); });
  } else if (act === "cap") {
    copyText(captionOf(info), "کیپشن کاپی ہو گیا");
  }
}
function openAyahCard(info) {
  if (!info || !info.ayah) { toast("تصویری کارڈ صرف آیات کے لیے دستیاب ہے"); return; }
  toast("کارڈ تیار ہو رہا ہے...");
  buildAyahCard(info, function(blob) {
    if (!blob) {
      copyText(captionOf(info), "یہ آیت تصویری کارڈ کے لیے بہت طویل ہے — متن کاپی کر دیا گیا");
      return;
    }
    var m = byId("nfCardModal");
    if (!m) {
      m = document.createElement("div");
      m.id = "nfCardModal"; m.className = "nf-modal";
      m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", "آیت کا تصویری کارڈ");
      m.innerHTML =
        "<div class='nf-modal-box'>" +
          "<img id='nfCardImg' alt=''/>" +
          "<div class='nf-modal-actions'>" +
            "<button type='button' class='player-btn' data-act='share'>شیئر کریں</button>" +
            "<button type='button' class='player-btn' data-act='dl'>ڈاؤن لوڈ</button>" +
            "<button type='button' class='player-btn' data-act='copyimg'>تصویر کاپی</button>" +
            "<button type='button' class='player-btn' data-act='cap'>کیپشن کاپی</button>" +
            "<button type='button' class='player-btn nf-close' data-act='close'>بند کریں</button>" +
          "</div>" +
        "</div>";
      m.addEventListener("click", function(e) {
        if (e.target === m) { closeAyahCard(); return; }
        var b = e.target.closest("[data-act]");
        if (b) { cardAct(b.getAttribute("data-act")); }
      });
      document.body.appendChild(m);
    }
    if (cardState.url) { URL.revokeObjectURL(cardState.url); }
    cardState.blob = blob; cardState.info = info;
    cardState.url = URL.createObjectURL(blob);
    cardState.back = document.activeElement;
    var img = byId("nfCardImg");
    img.src = cardState.url;
    img.alt = info.ref + " — " + cut(info.ur, 120);
    var canFiles = false;
    try { canFiles = !!(navigator.canShare && navigator.canShare({ files: [new File([blob], "a.png", { type: "image/png" })] })); } catch (e) {}
    m.querySelector("[data-act='share']").style.display = canFiles ? "" : "none";
    m.querySelector("[data-act='copyimg']").style.display = (navigator.clipboard && window.ClipboardItem) ? "" : "none";
    m.hidden = false;
    var first = m.querySelector(canFiles ? "[data-act='share']" : "[data-act='dl']");
    if (first) { first.focus(); }
  });
}

/* =====================================================================
   6. VIDEO GALLERY
   ویڈیوز دو جگہ سے آتی ہیں:
     (الف) اوپر NF_CFG.videos
     (ب)  کسی بھی HTML/JavaScript گیجٹ میں یہ سطریں:
          <div class='nf-video' data-id='https://youtu.be/XXXXXXXXXXX' data-series='tadabbur'
               data-title='عنوان' data-duration='12:30'>مختصر تعارف</div>
   ===================================================================== */
var vidList = null;
var vidCur = "all";

function ytId(v) {
  v = String(v || "").trim();
  var m = /(?:[?&]v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/.exec(v);
  var id = m ? m[1] : (/^[\w-]{11}$/.test(v) ? v : "");
  return /^X+$/.test(id) ? "" : id;   /* سانچے والی XXXXXXXXXXX سطریں نظر انداز */
}
function collectVideos() {
  var raw = (NF_CFG.videos || []).slice();
  each(".nf-video", function(el) {
    raw.push({
      id: el.getAttribute("data-id") || el.getAttribute("data-url"),
      series: el.getAttribute("data-series"), title: el.getAttribute("data-title"),
      duration: el.getAttribute("data-duration"), type: el.getAttribute("data-type"),
      summary: plain(el.textContent)
    });
  });
  var seen = {}, out = [];
  raw.forEach(function(v) {
    var id = ytId(v.id);
    if (!id || seen[id]) { return; }
    seen[id] = 1;
    var isShort = v.type === "short" || /\/shorts\//.test(String(v.id));
    out.push({
      id: id, series: v.series || "", title: v.title || "", summary: v.summary || "", duration: v.duration || "",
      short: isShort,
      url: isShort ? "https://www.youtube.com/shorts/" + id : "https://youtu.be/" + id
    });
  });
  return out;
}
function vidMatch(v, tab) {
  if (tab === "all") { return true; }
  if (tab === "shorts") { return v.short; }
  return v.series === tab;
}
function vidThumb(v) {
  return "<button type='button' class='vthumb' data-vplay='" + v.id + "' aria-label='ویڈیو چلائیں: " + esc(v.title) + "'>" +
           "<img loading='lazy' decoding='async' alt='' src='https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg'/>" +
           "<span class='vplay' aria-hidden='true'><i class='fa-solid fa-play'></i></span>" +
           (v.duration ? "<span class='vdur'>" + esc(v.duration) + "</span>" : "") +
         "</button>";
}
function vidCard(v) {
  var tab = findBy(NF_CFG.videoTabs, v.series);
  return "<article class='vcard" + (v.short ? " short" : "") + "' data-vid='" + v.id + "' data-url='" + v.url + "' data-title='" + esc(v.title + " — " + NF_CFG.site) + "'" +
           " data-text='" + esc(v.summary) + "' data-tags='" + esc(tagsFor("videos")) + "'>" +
           "<div class='vmedia'>" + vidThumb(v) + "</div>" +
           "<div class='vbody'>" +
             (tab ? "<span class='vtag'>" + esc(tab.label) + "</span>" : "") +
             "<h3 class='vtitle'>" + esc(v.title) + "</h3>" +
             (v.summary ? "<p class='vsum'>" + esc(v.summary) + "</p>" : "") +
             "<div class='nf-share nf-share-sm'>" + shareRow("شیئر:", SHARE_VIDEO, SHARE_VIDEO_MORE) + "</div>" +
           "</div>" +
         "</article>";
}
function vidRender() {
  var box = byId("vGallery");
  if (!box) { return; }
  if (!vidList) { vidList = collectVideos(); }
  if (!findBy(NF_CFG.videoTabs, vidCur)) { vidCur = "all"; }
  var tabs = NF_CFG.videoTabs.map(function(t) {
    var n = vidList.filter(function(v) { return vidMatch(v, t.id); }).length;
    var on = t.id === vidCur;
    return "<button type='button' role='tab' class='vtab" + (on ? " on" : "") + "' data-vtab='" + t.id + "' aria-selected='" + on + "'>" +
           esc(t.label) + " <span class='vcount'>" + n + "</span></button>";
  }).join("");
  var list = vidList.filter(function(v) { return vidMatch(v, vidCur); });
  var pl = NF_CFG.playlists && NF_CFG.playlists[vidCur];
  var html = "<div class='vtabs' role='tablist' aria-label='ویڈیو سیریز'>" + tabs + "</div>";
  if (pl) {
    html += "<div class='vfeatured'><div class='vframe'><iframe loading='lazy' title='پلے لسٹ' allowfullscreen='allowfullscreen' " +
            "allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' " +
            "src='https://www.youtube-nocookie.com/embed/videoseries?list=" + encodeURIComponent(pl) + "&rel=0'></iframe></div></div>";
  }
  if (list.length) {
    html += "<div class='vgrid'>" + list.map(vidCard).join("") + "</div>";
  } else if (!pl) {
    html += "<div class='vempty'><p>اس زمرے میں ابھی کوئی ویڈیو شامل نہیں کی گئی۔</p>" +
            "<a class='pill' href='" + NF_CFG.channel + "' target='_blank' rel='noopener'><i class='fa-brands fa-youtube' aria-hidden='true'></i> یوٹیوب چینل دیکھیں</a></div>";
  }
  box.innerHTML = html;
}
function vidTab(id) {
  if (!findBy(NF_CFG.videoTabs, id)) { return; }
  vidCur = id;
  vidRender();
  setHash("videos", id === "all" ? "" : id);
}
function stopVideos() {
  each(".vcard.playing", function(c) {
    var v = findBy(vidList || [], c.getAttribute("data-vid"));
    c.classList.remove("playing");
    if (v) { c.querySelector(".vmedia").innerHTML = vidThumb(v); }
  });
}
function vidPlay(btn) {
  var card = btn.closest(".vcard");
  if (!card) { return; }
  stopVideos(); stopAudio(); stopMini();
  var id = btn.getAttribute("data-vplay");
  card.classList.add("playing");
  card.querySelector(".vmedia").innerHTML =
    "<div class='vframe'><iframe title='" + esc(card.querySelector(".vtitle").innerText) + "' allowfullscreen='allowfullscreen' " +
    "allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' " +
    "src='https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1'></iframe></div>";
}

/* =====================================================================
   7. INIT
   ===================================================================== */
function nfInit() {
  if (nfInit.done) { return; }
  nfInit.done = true;
  initPlayerUI();
  autoCards();
  initShare();
  openFromHash();
  setTimeout(prefetchPanels, 3000);
  var pt = document.querySelector("meta[name=x-pagetype]");
  if (pt && pt.getAttribute("content") === "item" && !location.hash) {
    var bsx = byId("bS");
    if (bsx) { setTimeout(function() { bsx.scrollIntoView({ behavior: "smooth" }); }, 400); }
  }
}
if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", nfInit); }
else { nfInit(); }
