#!/usr/bin/env python3
"""แปลงเอกสาร Markdown ใน docs/ เป็นหน้าเว็บที่เข้ากับโครงไซต์
และสร้างดัชนีค้นหาใหม่ รันจากรากโปรเจกต์: python3 tools/render_docs.py
ต้องมีแพ็กเกจ markdown (pip install markdown)
"""
from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

CATALOG = [
    {
        "stem": "01-draft-strategy-2571-2575",
        "kicker": "ร่างยุทธศาสตร์",
        "blurb": "ร่างกรณีตัวอย่าง พ.ศ. 2571–2575 ฉบับที่ 0.6 มีตัวเลขสมมติ ห้ามใช้อ้างอิง",
        "caution": True,
    },
    {
        "stem": "02-lecture-handbook",
        "kicker": "คู่มือปฏิบัติงาน",
        "blurb": "เอกสารประกอบการบรรยาย 12 บท พร้อมใบงาน ตัวอย่างลูกโซ่ และคำศัพท์สำคัญ",
    },
    {
        "stem": "03-lecture-narration",
        "kicker": "บทบรรยาย",
        "blurb": "บทบรรยายประกอบสไลด์ 27 แผ่น เขียนเป็นภาษาพูด อ่านออกเสียงได้ทันที",
        "extra": [("02-lecture-slides.pptx", "ดาวน์โหลดสไลด์ PowerPoint")],
    },
    {
        "stem": "04-private-education-analysis",
        "kicker": "รายงานวิเคราะห์",
        "blurb": "เหตุใดการศึกษาเอกชนจึงควรอยู่ในยุทธศาสตร์ และควรอยู่ในรูปแบบใด",
    },
    {
        "stem": "05-factbase-private-education",
        "kicker": "ฐานข้อมูล",
        "blurb": "ตัวเลขการศึกษาเอกชนจากเอกสารแผนของหน่วยงาน พร้อมการคำนวณและข้อจำกัด",
    },
    {
        "stem": "06-self-assessment-form",
        "kicker": "แบบประเมิน",
        "blurb": "แบบวัดความมั่นใจ 12 ข้อ แบบทดสอบความรู้ 5 ข้อพร้อมเฉลย และคู่มือประมวลผล",
    },
    {
        "stem": "07-factbase-district-level",
        "kicker": "ฐานข้อมูล",
        "blurb": "การศึกษารายอำเภอครบ 16 อำเภอ อนุกรมเวลา และการคาดการณ์จากรุ่นที่เกิดแล้ว",
    },
    {
        "stem": "08-factbase-labour-demand",
        "kicker": "ฐานข้อมูล",
        "blurb": "อุปสงค์กำลังคนของจังหวัด และข้อค้นพบว่าเยาวชนอายุ 15–17 ปีไม่ปรากฏในระบบใด",
    },
    {
        "stem": "09-factbase-achievement",
        "kicker": "ฐานข้อมูล",
        "blurb": "ดัชนีความก้าวหน้าของคนมิติการศึกษา และผลการทดสอบ O-NET 5 ปี",
    },
    {
        "stem": "10-recommendations-current-plan",
        "kicker": "ข้อเสนอ",
        "blurb": "ข้อเสนอ 12 ข้อต่อการทบทวนแผนพัฒนาการศึกษา พ.ศ. 2566–2570",
    },
    {
        "stem": "11-expert-lecture-script-2570",
        "kicker": "บทบรรยาย",
        "blurb": "สคริปต์บรรยาย 30 นาที สำหรับผู้ทรงคุณวุฒิในการทบทวนแผน ปีงบประมาณ 2570",
    },
    {
        "stem": "12-workshop-opening-lecture-2570",
        "kicker": "บทบรรยาย",
        "blurb": "คำกล่าวเปิด 5 นาที และบรรยายพิเศษ 48 นาที สำหรับการประชุมเชิงปฏิบัติการ",
    },
    {
        "stem": "13-example-projects-2570",
        "kicker": "ตัวอย่างโครงการ",
        "blurb": "แปดโครงการที่ข้อมูลชี้ว่าจำเป็นสำหรับแผนปฏิบัติการ ปีงบประมาณ 2570",
        "caution": True,
    },
]

SITE_PAGES = [
    "about.html",
    "authority.html",
    "data.html",
    "index.html",
    "method.html",
    "private.html",
    "projects.html",
    "recommendations.html",
    "resources.html",
    "traceability.html",
]

TAGS = [
    ("【สมมติ】", '<span class="tag assumed">สมมติ</span>'),
    ("【จริง】", '<span class="tag real">จริง</span>'),
    ("【รอข้อมูล】", '<span class="tag pending">รอข้อมูล</span>'),
    ("【ต้องวินิจฉัย】", '<span class="tag pending">ต้องวินิจฉัย</span>'),
    ("【ประมาณการ】", '<span class="tag assumed">ประมาณการ</span>'),
    ("【จริง — คาดการณ์จากรุ่นที่เกิดและนับได้แล้ว】", '<span class="tag real">จริง — คาดการณ์จากรุ่นที่เกิดแล้ว</span>'),
    ("【จริง — ข้อมูลปี 2565】", '<span class="tag real">จริง — ข้อมูลปี 2565</span>'),
]


def split_title(source: str) -> tuple[str, str]:
    lines = source.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if not line.strip() or line.lstrip().startswith(">"):
            i += 1
            continue
        break
    start = i
    titles: list[str] = []
    while i < len(lines):
        line = lines[i].rstrip()
        if not line.strip():
            if titles:
                i += 1
                continue
            break
        if line.startswith("# ") and not line.startswith("## "):
            titles.append(line[2:].strip())
            i += 1
            continue
        break
    title = " ".join(titles).strip() or "เอกสาร"
    body = "\n".join(lines[:start] + lines[i:]).lstrip("\n")
    return title, body


def mark_tags(html: str) -> str:
    for src, dst in TAGS:
        html = html.replace(src, dst)
    return html


def wrap_tables(html: str) -> str:
    return re.sub(r"<table>", '<div class="tablewrap"><table>', html).replace(
        "</table>", "</table></div>"
    )


def mark_caution_quotes(html: str) -> str:
    def repl(m: re.Match[str]) -> str:
        inner = m.group(1)
        cls = ""
        if re.search(r"⚠|⚠️|ห้ามนำ|คำเตือนสำคัญ|ข้อควรระวังสำคัญ", inner):
            cls = ' class="caution"'
        return f"<blockquote{cls}>{inner}</blockquote>"

    return re.sub(r"<blockquote>(.*?)</blockquote>", repl, html, flags=re.S)


def convert(md_text: str) -> str:
    conv = markdown.Markdown(
        extensions=["tables", "fenced_code", "sane_lists", "toc"],
        extension_configs={"toc": {"permalink": False, "toc_depth": "1-3"}},
    )
    html = conv.convert(md_text)
    html = wrap_tables(html)
    html = mark_caution_quotes(html)
    html = mark_tags(html)
    return html


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def page_html(meta: dict, title: str, body_html: str) -> str:
    stem = meta["stem"]
    kicker = meta["kicker"]
    blurb = meta["blurb"]
    tools = [f'<a href="../resources.html">กลับไปหน้าเอกสาร</a>']
    md_name = f"{stem}.md"
    tools.append(f'<a href="{md_name}">ดาวน์โหลด Markdown</a>')
    docx = DOCS / f"{stem}.docx"
    if docx.exists():
        tools.append(f'<a href="{stem}.docx">ดาวน์โหลด Word</a>')
    for href, label in meta.get("extra") or []:
        if (DOCS / href).exists():
            tools.append(f'<a href="{href}">{label}</a>')
    caution = ""
    if meta.get("caution"):
        caution = (
            '<div class="note caution"><p><strong>อ่านคำกำกับในเอกสารก่อนใช้</strong> '
            "ฉบับนี้อาจมีตัวเลขสมมติหรืองบประมาณที่เป็นการประมาณการ "
            "ห้ามนำไปอ้างอิงแทนเอกสารทางการ</p></div>"
        )
    tool_html = "\n      ".join(tools)
    return f"""<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} — ยุทธศาสตร์การศึกษาอยุธยา</title>
<meta name="description" content="{esc(blurb)}">
<meta name="author" content="บูรพาทิศ พลอยสุวรรณ์">
<meta name="theme-color" content="#0E2B31">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="../assets/favicon.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(blurb)}">
<meta property="og:type" content="article">
<meta property="og:locale" content="th_TH">
<meta property="og:image" content="../assets/og-image.png">
<meta property="og:image:alt" content="ยุทธศาสตร์การศึกษาอยุธยา — แผนที่ไล่กลับไปหาเด็กได้ คือแผนที่ถูกใช้">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600&family=Trirong:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/style.css">
</head>
<body class="docpage">
<!-- สร้างจาก {md_name} ด้วย tools/render_docs.py อย่าแก้หน้านี้โดยตรง -->
<a class="skip" href="#main">ข้ามไปยังเนื้อหาหลัก</a>
<noscript>
<nav class="nav-fallback wrap" aria-label="เมนูสำรองเมื่อไม่ใช้สคริปต์">
  <a href="../index.html">หน้าแรก</a>
  <a href="../resources.html">เอกสาร</a>
  <a href="../search.html">ค้นหา</a>
  <a href="../about.html">เกี่ยวกับ</a>
</nav>
</noscript>
<div id="site-head"></div>
<script src="../assets/site.js"></script>
<main id="main">

<section class="pagehead">
  <div class="wrap">
    <p class="kicker">{esc(kicker)}</p>
    <h1>{esc(title)}</h1>
    <p class="lead">{esc(blurb)}</p>
    <p class="doc-tools">
      {tool_html}
    </p>
  </div>
</section>

<div class="streamrule"></div>

<section class="section">
  <div class="wrap">
    {caution}
    <article class="doc">
{body_html}
    </article>
  </div>
</section>

</main>
<div id="site-foot"></div>
</body>
</html>
"""


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_main = False
        self.skip = 0
        self.skip_tags = {"script", "style", "noscript"}
        self.parts: list[str] = []
        self.h1 = ""
        self.kicker = ""
        self.heads: list[str] = []
        self.catch: str | None = None
        self.desc = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta" and attrs.get("name") == "description":
            self.desc = attrs.get("content") or ""
        if tag == "main":
            self.in_main = True
        if tag in self.skip_tags:
            self.skip += 1
            return
        if not self.in_main or self.skip:
            return
        cls = attrs.get("class", "")
        if tag == "h1":
            self.catch = "h1"
        elif tag == "h2":
            self.catch = "h2"
        elif "kicker" in cls.split():
            self.catch = "kicker"

    def handle_endtag(self, tag):
        if tag in self.skip_tags and self.skip:
            self.skip -= 1
        if tag == "main":
            self.in_main = False
        if tag in ("h1", "h2", "p") and self.catch:
            self.catch = None

    def handle_data(self, data):
        if self.skip:
            return
        t = re.sub(r"\s+", " ", data).strip()
        if not t:
            return
        if self.catch == "h1" and not self.h1:
            self.h1 = t
        elif self.catch == "h2":
            self.heads.append(t)
        elif self.catch == "kicker":
            self.kicker += t
        if self.in_main:
            self.parts.append(t)


def index_file(path: Path, href: str) -> dict:
    parser = Page()
    parser.feed(path.read_text(encoding="utf-8"))
    text = re.sub(r"\s+", " ", " ".join(parser.parts)).strip()
    if len(text) > 2800:
        text = text[:2800]
    heads = parser.heads[:16]
    return {
        "href": href,
        "title": parser.h1 or path.stem,
        "blurb": re.sub(r"\s+", " ", parser.desc).strip(),
        "kicker": re.sub(r"\s+", " ", parser.kicker).strip(),
        "heads": heads,
        "text": text,
    }


def render_docs() -> None:
    for meta in CATALOG:
        src = DOCS / f"{meta['stem']}.md"
        if not src.exists():
            raise SystemExit(f"ไม่พบ {src}")
        raw = src.read_text(encoding="utf-8")
        title, body = split_title(raw)
        html = convert(body)
        out = DOCS / f"{meta['stem']}.html"
        out.write_text(page_html(meta, title, html), encoding="utf-8")
        print(f"wrote {out.relative_to(ROOT)}  ({out.stat().st_size // 1024} KB)  {title[:48]}")


def rebuild_search() -> None:
    entries = []
    for name in SITE_PAGES:
        entries.append(index_file(ROOT / name, name))
    for meta in CATALOG:
        href = f"docs/{meta['stem']}.html"
        entries.append(index_file(DOCS / f"{meta['stem']}.html", href))
    dest = ROOT / "assets" / "search-index.js"
    dest.write_text(
        "window.SEARCH_INDEX=" + json.dumps(entries, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"wrote {dest.relative_to(ROOT)}  pages={len(entries)}  bytes={dest.stat().st_size}")


if __name__ == "__main__":
    render_docs()
    rebuild_search()
