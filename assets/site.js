// ส่วนหัวและส่วนท้ายชุดเดียว ใช้ทุกหน้า
(function () {
  function siteRoot() {
    var s = document.querySelector('script[src*="site.js"]');
    var src = (s && s.getAttribute('src')) || 'assets/site.js';
    return src.replace(/assets\/site\.js(?:\?.*)?$/, '');
  }
  function prefixLinks(el, root) {
    if (!el || !root) return;
    el.querySelectorAll('a[href], form[action], img[src]').forEach(function (node) {
      var tag = node.tagName.toLowerCase();
      var attr = tag === 'form' ? 'action' : tag === 'img' ? 'src' : 'href';
      var v = node.getAttribute(attr);
      if (!v || /^(https?:|mailto:|#)/i.test(v)) return;
      node.setAttribute(attr, root + v);
    });
  }
  var ROOT = siteRoot();
  var head = document.getElementById('site-head');
  if (head && !head.getAttribute('data-ready')) {
    head.setAttribute('data-ready', '1');
    head.innerHTML =
      '<div class="spectrum" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>' +
      '<header class="masthead">' +
      '<div class="wrap">' +
      '<a class="brand" href="index.html"><img class="brand-mark" src="assets/logo.png" width="48" height="48" alt=""><span class="brand-text"><b>ยุทธศาสตร์การศึกษาอยุธยา</b><span>พื้นที่แลกเปลี่ยนเรียนรู้</span></span></a>' +
      '<button class="navtoggle" aria-expanded="false" aria-controls="sitenav">เมนู</button>' +
      '<nav class="nav" id="sitenav" aria-label="เมนูหลัก">' +
      '<a href="index.html">หน้าแรก</a>' +
      '<div class="navgroup" role="group" aria-labelledby="nav-method">' +
      '<span class="navlabel" id="nav-method">วิธีทำงาน</span>' +
      '<div class="navgroup-links">' +
      '<a href="method.html">วิธีจัดทำ</a>' +
      '<a href="traceability.html">ตัวอย่างลูกโซ่</a>' +
      '</div></div>' +
      '<div class="navgroup" role="group" aria-labelledby="nav-plan">' +
      '<span class="navlabel" id="nav-plan">ข้อเสนอ 2570</span>' +
      '<div class="navgroup-links">' +
      '<a href="recommendations.html">ทบทวนแผน</a>' +
      '<a href="projects.html">ตัวอย่างโครงการ</a>' +
      '</div></div>' +
      '<div class="navgroup" role="group" aria-labelledby="nav-evidence">' +
      '<span class="navlabel" id="nav-evidence">หลักฐาน</span>' +
      '<div class="navgroup-links">' +
      '<a href="authority.html">อำนาจหน้าที่</a>' +
      '<a href="data.html">ข้อมูลจังหวัด</a>' +
      '<a href="private.html">การศึกษาเอกชน</a>' +
      '</div></div>' +
      '<a href="resources.html">เอกสาร</a>' +
      '<a href="about.html">เกี่ยวกับ</a>' +
      '</nav>' +
      '<form class="sitesearch" action="search.html" method="get" role="search">' +
      '<label class="vh" for="nav-q">ค้นหาในเว็บไซต์</label>' +
      '<input id="nav-q" type="search" name="q" placeholder="ค้นหา เช่น ออกกลางคัน" maxlength="80" autocomplete="off">' +
      '<button type="submit">ค้นหา</button>' +
      '</form>' +
      '</div></header>';
    prefixLinks(head, ROOT);
  }

  function paintFoot() {
    var foot = document.getElementById('site-foot');
    if (!foot || foot.getAttribute('data-ready')) return;
    foot.setAttribute('data-ready', '1');
    foot.innerHTML =
      '<footer class="foot">' +
      '<div class="wrap grid">' +
      '<div>' +
      '<div class="foot-about">' +
      '<img class="foot-mark" src="assets/logo.png" width="48" height="48" alt="">' +
      '<div>' +
      '<h3>เกี่ยวกับเว็บไซต์นี้</h3>' +
      '<p>พื้นที่เผยแพร่และแลกเปลี่ยนเรียนรู้เรื่องวิธีจัดทำยุทธศาสตร์การพัฒนาการศึกษาระดับจังหวัด เพื่อประโยชน์สาธารณะ</p>' +
      '<p><strong>จัดทำโดย บูรพาทิศ พลอยสุวรรณ์</strong><br>ผู้วิจัยอิสระ<br><a href="mailto:burapatis@gmail.com">burapatis@gmail.com</a></p>' +
      '</div></div>' +
      '<div class="foot-more">' +
      '<h3>แหล่งเรียนรู้เพิ่มเติม</h3>' +
      '<ul>' +
      '<li><a href="https://ayeduplan1.thamdee.com/" target="_blank" rel="noopener noreferrer">แหล่งเรียนรู้ยุทธศาสตร์การศึกษาอยุธยา</a></li>' +
      '<li><a href="https://sdg.thamdee.com/" target="_blank" rel="noopener noreferrer">อยุธยาเรียนรู้ · SDG 4</a></li>' +
      '</ul></div>' +
      '</div>' +
      '<div>' +
      '<h3>วิธีทำงานและข้อเสนอ</h3>' +
      '<ul>' +
      '<li><a href="method.html">วิธีจัดทำ</a></li>' +
      '<li><a href="traceability.html">ตัวอย่างลูกโซ่</a></li>' +
      '<li><a href="recommendations.html">ทบทวนแผน</a></li>' +
      '<li><a href="projects.html">ตัวอย่างโครงการ</a></li>' +
      '</ul></div>' +
      '<div>' +
      '<h3>หลักฐานและเอกสาร</h3>' +
      '<ul>' +
      '<li><a href="authority.html">อำนาจหน้าที่</a></li>' +
      '<li><a href="data.html">ข้อมูลจังหวัด</a></li>' +
      '<li><a href="private.html">การศึกษาเอกชน</a></li>' +
      '<li><a href="resources.html">เอกสารดาวน์โหลด</a></li>' +
      '<li><a href="about.html">เกี่ยวกับ</a></li>' +
      '<li><a href="search.html">ค้นหาในเว็บไซต์</a></li>' +
      '</ul></div></div>' +
      '<div class="wrap">' +
      '<p class="fine">เว็บไซต์นี้ไม่ใช่เอกสารทางการของสำนักงานศึกษาธิการจังหวัดพระนครศรีอยุธยาหรือหน่วยงานใด เนื้อหาเป็นผลงานทางวิชาการของผู้จัดทำเพื่อการแลกเปลี่ยนเรียนรู้ ปรับปรุงล่าสุด 31 สิงหาคม 2569 · <a href="LICENSE.txt">สัญญาอนุญาต CC BY-SA 4.0</a></p>' +
      '<p class="print-source">พิมพ์จากเว็บไซต์ยุทธศาสตร์การศึกษาอยุธยา — กรณีศึกษาการจัดทำยุทธศาสตร์การศึกษาระดับจังหวัด</p>' +
      '</div></footer>';
    prefixLinks(foot, ROOT);
  }
  paintFoot();
  document.addEventListener('DOMContentLoaded', paintFoot);
})();

// เมนูสำหรับจอขนาดเล็ก
(function () {
  function bind() {
    var btn = document.querySelector('.navtoggle');
    var nav = document.getElementById('sitenav');
    if (!btn || !nav || btn.getAttribute('data-bound')) return;
    btn.setAttribute('data-bound', '1');
    function setOpen(open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'ปิดเมนู' : 'เมนู';
    }
    btn.addEventListener('click', function () {
      setOpen(!nav.classList.contains('open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  }
  bind();
  document.addEventListener('DOMContentLoaded', bind);
})();

// ทำเครื่องหมายหน้าปัจจุบันในแถบนำทาง
(function () {
  function mark() {
    var here = location.pathname.split('/').pop() || 'index.html';
    if (here === '404.html') return;
    var inDocs = /(?:^|\/)docs\/[^/]+$/.test(location.pathname);
    document.querySelectorAll('#sitenav a').forEach(function (a) {
      var file = (a.getAttribute('href') || '').split('/').pop();
      if (inDocs && file === 'resources.html') {
        a.setAttribute('aria-current', 'page');
      } else if (!inDocs && file === here) {
        a.setAttribute('aria-current', 'page');
        var group = a.closest('.navgroup');
        if (group) group.classList.add('current');
      }
    });
  }
  mark();
  document.addEventListener('DOMContentLoaded', mark);
})();

function initAfterMain() {
  // สารบัญในหน้ายาว สร้างจากหัวข้อ h2
  (function () {
    if (!document.querySelector('.pagehead')) return;
    var main = document.getElementById('main');
    if (!main || main.querySelector('.toc')) return;
    var isDoc = document.body.classList.contains('docpage');
    var scope = isDoc ? (main.querySelector('.doc') || main) : main;
    var headings = isDoc ? scope.querySelectorAll('h1') : main.querySelectorAll('h2');
    if (headings.length < 4) headings = scope.querySelectorAll('h2');
    if (headings.length < 4) return;
    var holder = document.createElement('div');
    holder.className = 'wrap';
    var nav = document.createElement('nav');
    nav.className = 'toc';
    nav.setAttribute('aria-label', 'สารบัญหน้านี้');
    var title = document.createElement('h2');
    title.textContent = 'ในหน้านี้';
    nav.appendChild(title);
    var list = document.createElement('ol');
    headings.forEach(function (h, i) {
      if (!h.id) h.id = 'sec-' + (i + 1);
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });
    nav.appendChild(list);
    holder.appendChild(nav);
    var rule = main.querySelector('.streamrule');
    if (rule && rule.parentNode) rule.parentNode.insertBefore(holder, rule.nextSibling);
    else main.insertBefore(holder, main.firstChild);
  })();

  // ปุ่มกลับขึ้นบน
  (function () {
    if (document.querySelector('.totop')) return;
    var a = document.createElement('a');
    a.className = 'totop';
    a.href = '#main';
    a.textContent = 'ขึ้นบน';
    document.body.appendChild(a);
    function update() {
      var show = window.scrollY > 480;
      a.classList.toggle('show', show);
      a.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) a.removeAttribute('tabindex');
      else a.setAttribute('tabindex', '-1');
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  // ที่อยู่สาธารณะสำหรับ canonical ภาพแชร์ และลิงก์โซเชียล
  (function () {
    var ORIGIN = 'https://ayeduplan2.thamdee.com';
    var path = location.pathname || '/';
    if (path === '/') path = '/index.html';
    var publicPage = ORIGIN + path;
    var canon = document.querySelector('link[rel="canonical"]');
    if (canon && !canon.getAttribute('href')) canon.setAttribute('href', publicPage);
    var ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) {
      var src = ogImg.getAttribute('content') || '';
      if (src && !/^https?:/i.test(src)) ogImg.setAttribute('content', ORIGIN + '/assets/og-image.png');
    }
    if (!document.querySelector('meta[property="og:url"]')) {
      var m = document.createElement('meta');
      m.setAttribute('property', 'og:url');
      m.setAttribute('content', (canon && canon.getAttribute('href')) || publicPage);
      document.head.appendChild(m);
    }
  })();

  // ค้นหาในเว็บไซต์
  (function () {
    var box = document.getElementById('search-results');
    if (!box) return;
    var form = document.getElementById('search-form');
    var input = document.getElementById('q');
    var index = window.SEARCH_INDEX || [];

    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
      });
    }
    function norm(s) { return String(s || '').toLowerCase(); }
    function hay(item) {
      return norm([item.title, item.blurb, item.kicker, (item.heads || []).join(' '), item.text].join('\n'));
    }
    function score(item, terms) {
      var h = hay(item);
      var total = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i];
        if (!t) continue;
        var s = 0;
        if (norm(item.title).indexOf(t) !== -1) s += 14;
        if (norm(item.kicker).indexOf(t) !== -1) s += 8;
        if (norm(item.blurb).indexOf(t) !== -1) s += 6;
        if (norm((item.heads || []).join(' ')).indexOf(t) !== -1) s += 7;
        if (norm(item.text).indexOf(t) !== -1) s += 2;
        if (!s) return 0;
        total += s;
      }
      return total;
    }
    function snippet(item, terms) {
      var source = item.blurb || item.text || '';
      var low = norm(source);
      var at = -1;
      for (var i = 0; i < terms.length; i++) {
        at = low.indexOf(terms[i]);
        if (at !== -1) break;
      }
      if (at < 0) at = 0;
      var start = Math.max(0, at - 40);
      var bit = source.slice(start, start + 180);
      if (start > 0) bit = '…' + bit;
      if (start + 180 < source.length) bit += '…';
      var out = esc(bit);
      terms.forEach(function (t) {
        if (!t) return;
        out = out.replace(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '<mark>$&</mark>');
      });
      return out;
    }
    function render(q) {
      q = String(q || '').trim();
      if (input && input.value !== q) input.value = q;
      var navq = document.getElementById('nav-q');
      if (navq) navq.value = q;
      if (!q) {
        box.innerHTML = '<p class="narrow">พิมพ์คำค้นแล้วกดค้นหา ตัวอย่างที่พบได้บ่อย ได้แก่ <a href="search.html?q=ออกกลางคัน">ออกกลางคัน</a> · <a href="search.html?q=เอกชน">เอกชน</a> · <a href="search.html?q=อำนาจ">อำนาจ</a> · <a href="search.html?q=47.7">47.7</a> · <a href="search.html?q=ลูกโซ่">ลูกโซ่</a></p>';
        return;
      }
      if (!index.length) {
        box.innerHTML = '<p class="narrow">ดัชนีค้นหายังโหลดไม่ครบ ลองโหลดหน้านี้ใหม่</p>';
        return;
      }
      var terms = norm(q).split(/\s+/).filter(Boolean);
      var hits = index.map(function (item) {
        return { item: item, s: score(item, terms) };
      }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; });
      if (!hits.length) {
        box.innerHTML = '<p class="narrow">ไม่พบหน้าที่ตรงกับ «' + esc(q) + '» ลองคำที่สั้นกว่า หรือเปิดจาก<a href="index.html">หน้าแรก</a></p>';
        return;
      }
      var html = '<p class="narrow">พบ ' + hits.length + ' หน้า สำหรับ «' + esc(q) + '»</p><ol class="search-hits">';
      hits.forEach(function (x) {
        var it = x.item;
        html += '<li><a href="' + esc(it.href) + '">' + esc(it.title) + '</a>';
        if (it.kicker) html += '<small>' + esc(it.kicker) + '</small>';
        html += '<p>' + snippet(it, terms) + '</p></li>';
      });
      html += '</ol>';
      box.innerHTML = html;
    }
    var start = new URLSearchParams(location.search).get('q') || '';
    render(start);
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var next = (input && input.value || '').trim();
        history.replaceState(null, '', next ? 'search.html?q=' + encodeURIComponent(next) : 'search.html');
        render(next);
      });
    }
  })();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAfterMain);
} else {
  initAfterMain();
}

// กด / เพื่อโฟกัสช่องค้นหา
document.addEventListener('keydown', function (e) {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
  var tag = (e.target && e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;
  var q = document.getElementById('q') || document.getElementById('nav-q');
  if (!q) return;
  e.preventDefault();
  q.focus();
});
