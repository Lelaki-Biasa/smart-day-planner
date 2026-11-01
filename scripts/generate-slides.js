const pptxgen = require('pptxgenjs');
const path = require('path');

// ---------------------------------------------------------------------------
// Palette (matches the TaskFlow UI)
// ---------------------------------------------------------------------------
const C = {
  indigo: '4F46E5',
  indigoDark: '3730A3',
  violet: '7C3AED',
  slate: '1E293B',
  slateMid: '64748B',
  slateLight: '94A3B8',
  bg: 'F8FAFC',
  white: 'FFFFFF',
  amber: 'F59E0B',
  emerald: '10B981',
  rose: 'F43F5E',
  line: 'E2E8F0',
};

const FONT = 'Segoe UI';
const W = 13.333; // 16:9
const H = 7.5;

const pptx = new pptxgen();
pptx.defineLayout({ name: 'WIDE', width: W, height: H });
pptx.layout = 'WIDE';
pptx.author = 'AIAA Midterm Project';
pptx.title = 'TaskFlow: Smart Day Planner';

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------
function bg(slide, color) {
  slide.background = { color: color || C.bg };
}

function accentBar(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.16, h: H,
    fill: { color: C.indigo },
  });
}

function kicker(slide, text, x, y) {
  slide.addText(text.toUpperCase(), {
    x, y, w: 8, h: 0.32,
    fontFace: FONT, fontSize: 12, bold: true,
    color: C.indigo, charSpacing: 2,
  });
}

function title(slide, text, x, y, w, size) {
  slide.addText(text, {
    x, y, w: w || 11, h: 1.0,
    fontFace: FONT, fontSize: size || 34, bold: true,
    color: C.slate, fit: 'shrink',
  });
}

function pageNum(slide, n) {
  slide.addText(String(n), {
    x: W - 0.85, y: H - 0.5, w: 0.5, h: 0.3,
    fontFace: FONT, fontSize: 11, color: C.slateLight,
    align: 'right',
  });
}

// Rounded card with a heading + body
function card(slide, opts) {
  const { x, y, w, h, heading, body, accent, icon } = opts;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: C.white },
    line: { color: C.line, width: 1 },
    shadow: { type: 'outer', color: '94A3B8', opacity: 0.18, blur: 8, offset: 2, angle: 90 },
  });
  if (accent) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 0.09, h,
      rectRadius: 0.04,
      fill: { color: accent },
    });
  }
  let ty = y + 0.24;
  if (icon) {
    slide.addText(icon, {
      x: x + 0.28, y: ty, w: 0.5, h: 0.45,
      fontFace: FONT, fontSize: 22, color: accent || C.indigo,
    });
    ty += 0.5;
  }
  slide.addText(heading, {
    x: x + 0.28, y: ty, w: w - 0.55, h: 0.4,
    fontFace: FONT, fontSize: 16, bold: true, color: C.slate,
    fit: 'shrink',
  });
  slide.addText(body, {
    x: x + 0.28, y: ty + 0.44, w: w - 0.55, h: h - (ty - y) - 0.6,
    fontFace: FONT, fontSize: 12.5, color: C.slateMid,
    lineSpacingMultiple: 1.15, valign: 'top', fit: 'shrink',
  });
}

// ===========================================================================
// Slide 1 — Title
// ===========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.slate };

  // decorative gradient blocks
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.22, fill: { color: C.indigo },
  });
  s.addShape(pptx.ShapeType.roundRect, {
    x: 9.6, y: 4.6, w: 4.4, h: 3.4, rectRadius: 0.1,
    fill: { color: C.indigoDark }, line: { color: C.indigoDark },
  });
  s.addShape(pptx.ShapeType.roundRect, {
    x: 10.4, y: 5.3, w: 4.4, h: 3.4, rectRadius: 0.1,
    fill: { color: C.indigo }, line: { color: C.indigo },
  });

  s.addText('AIAA MIDTERM PROJECT', {
    x: 0.85, y: 1.75, w: 9, h: 0.4,
    fontFace: FONT, fontSize: 14, bold: true,
    color: '818CF8', charSpacing: 3,
  });

  s.addText('TaskFlow', {
    x: 0.8, y: 2.2, w: 10, h: 1.3,
    fontFace: FONT, fontSize: 66, bold: true, color: C.white,
  });
  s.addText('Smart Day Planner', {
    x: 0.85, y: 3.45, w: 10, h: 0.7,
    fontFace: FONT, fontSize: 30, color: C.slateLight,
  });

  s.addShape(pptx.ShapeType.rect, {
    x: 0.87, y: 4.4, w: 1.6, h: 0.05, fill: { color: C.indigo },
  });

  s.addText('Turn a messy to-do brain dump into a realistic,\ntime-blocked schedule for the day.', {
    x: 0.85, y: 4.65, w: 8.4, h: 0.9,
    fontFace: FONT, fontSize: 17, color: 'CBD5E1', lineSpacingMultiple: 1.25,
  });

  s.addText('MARVEL HUBERT RAHARDJO   ·   AIAA   ·   November 2, 2026', {
    x: 0.85, y: 6.4, w: 9, h: 0.4,
    fontFace: FONT, fontSize: 13, color: C.slateLight,
  });
}

// ===========================================================================
// Slide 2 — The problem
// ===========================================================================
{
  const s = pptx.addSlide();
  bg(s);
  accentBar(s);
  kicker(s, 'The problem', 0.7, 0.55);
  title(s, 'A list of 15 bullet points is not a schedule', 0.7, 0.9, 11.8, 32);
  pageNum(s, 2);

  card(s, {
    x: 0.7, y: 2.15, w: 3.85, h: 3.5,
    heading: 'Decision paralysis',
    body: 'Opening a huge unordered list makes starting harder. You stare at it and do nothing.',
    accent: C.rose, icon: '😖',
  });
  card(s, {
    x: 4.75, y: 2.15, w: 3.85, h: 3.5,
    heading: 'Easy stuff first',
    body: 'Emails and tidying get done. The hard project work waits until you are exhausted at 11 PM.',
    accent: C.amber, icon: '⏳',
  });
  card(s, {
    x: 8.8, y: 2.15, w: 3.85, h: 3.5,
    heading: 'Tools add friction',
    body: 'Calendars demand date pickers, tags and forms before you have even started planning.',
    accent: C.slateMid, icon: '🧩',
  });

  s.addText('So the real task is not "list my work" — it is "decide the order, the length, and the clock times." TaskFlow does that for you.', {
    x: 0.7, y: 6.1, w: 12, h: 0.7,
    fontFace: FONT, fontSize: 15, italic: true, color: C.indigoDark,
    lineSpacingMultiple: 1.2,
  });
}

// ===========================================================================
// Slide 3 — What it does
// ===========================================================================
{
  const s = pptx.addSlide();
  bg(s);
  accentBar(s);
  kicker(s, 'What I made', 0.7, 0.55);
  title(s, 'Messy text in, time-blocked day out', 0.7, 0.9, 11.8, 32);
  pageNum(s, 3);

  const items = [
    ['📝', 'Messy text ingestion', 'Bullets, shorthand, half-sentences. No forms, no fields.'],
    ['⏱', 'Automatic time estimates', '"1.5h" → 90 min. No duration? Guesses from task keywords.'],
    ['🐸', '"Eat that frog" first', 'The hardest task is placed first thing in the morning.'],
    ['🎯', 'Eisenhower matrix', 'Every task sorted into Q1 do now → Q4 minimize.'],
    ['☕', 'Breaks on your terms', 'Only when you ask — locked at that exact time, tasks route around it.'],
    ['📅', 'Calendar + weather', 'Export .ics to Google/Apple, plus live Open-Meteo forecast.'],
  ];

  const cw = 3.85, ch = 1.95, gx = 0.7, gy = 2.15, gapX = 4.05, gapY = 2.15;
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    card(s, {
      x: gx + col * gapX, y: gy + row * gapY, w: cw, h: ch,
      icon: it[0], heading: it[1], body: it[2],
      accent: C.indigo,
    });
  });

  s.addText('Runs fully offline in the browser — double-click index.html. No install, no API key, no server.', {
    x: 0.7, y: 6.65, w: 12, h: 0.45,
    fontFace: FONT, fontSize: 13.5, bold: true, color: C.emerald,
  });
}

// ===========================================================================
// Slide 4 — Live example
// ===========================================================================
{
  const s = pptx.addSlide();
  bg(s);
  accentBar(s);
  kicker(s, 'How it works', 0.7, 0.55);
  title(s, 'One example, start to finish', 0.7, 0.9, 11.8, 32);
  pageNum(s, 4);

  // INPUT box
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7, y: 2.1, w: 5.6, h: 4.2, rectRadius: 0.08,
    fill: { color: C.white }, line: { color: C.line, width: 1 },
  });
  s.addText('YOU TYPE', {
    x: 0.95, y: 2.32, w: 5, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true, color: C.slateLight, charSpacing: 2,
  });
  s.addText(
    'Finish AIAA midterm project report\n' +
    'Review ML lecture slides (45 mins)\n' +
    'Break at 12:00 PM for lunch\n' +
    'Email professor about paper topic\n' +
    'Quick 30 min gym workout\n' +
    'Break at 3:30 PM for 15 mins',
    {
      x: 0.95, y: 2.75, w: 5.1, h: 3.3,
      fontFace: 'Consolas', fontSize: 12.5, color: C.slate,
      lineSpacingMultiple: 1.5, valign: 'top',
    }
  );

  // arrow
  s.addText('→', {
    x: 6.3, y: 3.7, w: 0.7, h: 0.8,
    fontFace: FONT, fontSize: 40, bold: true, color: C.indigo, align: 'center',
  });

  // OUTPUT box
  s.addShape(pptx.ShapeType.roundRect, {
    x: 7.0, y: 2.1, w: 5.6, h: 4.2, rectRadius: 0.08,
    fill: { color: C.slate }, line: { color: C.slate, width: 1 },
  });
  s.addText('YOU GET', {
    x: 7.25, y: 2.32, w: 5, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true, color: '818CF8', charSpacing: 2,
  });

  // Verified against the real scheduler (scripts/verify-slide-claims.js):
  // "paper" is a heavy keyword, so Email classifies Q2/High and sorts before
  // Review ML (Q4). Lunch has no stated duration -> keyword default 45 min.
  const rows = [
    ['09:00', '🐸 Report (frog) — 60m', C.amber],
    ['10:00', 'Email prof re: paper topic — 60m', 'E2E8F0'],
    ['11:00', 'Review ML slides — 45m', 'E2E8F0'],
    ['12:00', '☕ Lunch — locked 45m', C.emerald],
    ['12:45', 'Gym workout — 30m', 'E2E8F0'],
    ['15:30', '☕ Break — locked 15m', C.emerald],
  ];
  rows.forEach((r, i) => {
    const y = 2.78 + i * 0.56;
    s.addText(r[0], {
      x: 7.25, y, w: 0.95, h: 0.45,
      fontFace: FONT, fontSize: 12, bold: true, color: '818CF8',
    });
    s.addText(r[1], {
      x: 8.25, y, w: 4.15, h: 0.45,
      fontFace: FONT, fontSize: 12.5, color: r[2],
      bold: i === 0 || i === 3 || i === 5,
    });
  });

  s.addText('Hardest task first · breaks never overlap work · every duration accounted for', {
    x: 0.7, y: 6.6, w: 12, h: 0.45,
    fontFace: FONT, fontSize: 14, bold: true, color: C.indigoDark, align: 'center',
  });
}

// ===========================================================================
// Slide 5 — How I made it with AI
// ===========================================================================
{
  const s = pptx.addSlide();
  bg(s);
  accentBar(s);
  kicker(s, 'How I made it with AI', 0.7, 0.55);
  title(s, 'AI wrote the code. I decided what was right.', 0.7, 0.9, 11.8, 32);
  pageNum(s, 5);

  // Left: the loop
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7, y: 2.1, w: 5.9, h: 4.3, rectRadius: 0.08,
    fill: { color: C.white }, line: { color: C.line, width: 1 },
  });
  s.addText('THE WORKING LOOP', {
    x: 0.95, y: 2.32, w: 5, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true, color: C.slateLight, charSpacing: 2,
  });

  const loop = [
    ['1', 'Ask', 'Describe the behaviour with a concrete example.'],
    ['2', 'Generate', 'Google Antigravity writes or edits the file.'],
    ['3', 'Test', 'Run it, paste real input, look at the result.'],
    ['4', 'Verify', 'Check the diff — accept only what I intended.'],
  ];
  loop.forEach((l, i) => {
    const y = 2.78 + i * 0.87;
    s.addShape(pptx.ShapeType.ellipse, {
      x: 0.98, y, w: 0.5, h: 0.5, fill: { color: C.indigo },
    });
    s.addText(l[0], {
      x: 0.98, y, w: 0.5, h: 0.5,
      fontFace: FONT, fontSize: 15, bold: true, color: C.white, align: 'center', valign: 'middle',
    });
    s.addText(l[1], {
      x: 1.62, y: y - 0.02, w: 4.7, h: 0.3,
      fontFace: FONT, fontSize: 14, bold: true, color: C.slate,
    });
    s.addText(l[2], {
      x: 1.62, y: y + 0.26, w: 4.7, h: 0.3,
      fontFace: FONT, fontSize: 12, color: C.slateMid,
    });
  });

  // Right: two engines
  s.addText('DUAL-ENGINE ARCHITECTURE', {
    x: 7.0, y: 2.2, w: 5.6, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true, color: C.slateLight, charSpacing: 2,
  });

  card(s, {
    x: 7.0, y: 2.6, w: 5.6, h: 1.8,
    heading: 'Engine 1 · Local heuristics (default)',
    body: 'Regex + keyword parsing, right in the browser. Zero API keys, zero setup — 0.04 ms for a 17-line list. Always works during a live demo.',
    accent: C.emerald, icon: '⚡',
  });
  card(s, {
    x: 7.0, y: 4.6, w: 5.6, h: 1.8,
    heading: 'Engine 2 · Live LLM (optional)',
    body: 'OpenAI / Gemini / Groq via JSON-schema prompting. Response is validated field-by-field before anything renders.',
    accent: C.violet, icon: '🌐',
  });

  s.addText('Rules grounded in real productivity research: Eat That Frog · Eisenhower Matrix · morning energy curve', {
    x: 0.7, y: 6.7, w: 12, h: 0.4,
    fontFace: FONT, fontSize: 13, italic: true, color: C.slateMid, align: 'center',
  });
}

// ===========================================================================
// Slide 6 — What I checked
// ===========================================================================
{
  const s = pptx.addSlide();
  bg(s);
  accentBar(s);
  kicker(s, 'What I checked', 0.7, 0.55);
  title(s, 'Tested, not assumed', 0.7, 0.9, 11.8, 32);
  pageNum(s, 6);

  s.addText('VERIFIED BY UNIT TESTS + MANUAL BROWSER CHECKS', {
    x: 0.7, y: 2.0, w: 12, h: 0.3,
    fontFace: FONT, fontSize: 11, bold: true, color: C.slateLight, charSpacing: 2,
  });

  const left = [
    'Explicit durations exact: 1.5h → 90 min, 45 mins → 45 min',
    'AM/PM rollover across noon: 11:30 AM → 12:00 PM → 1:00 PM',
    'No breaks written → no breaks injected',
    'Start time honoured exactly: 8:30 → first block at 8:30 AM',
  ];
  const right = [
    '.ics exports land on the right date, not today',
    'Bad API key or malformed reply → clear error, page still usable',
    'Weather API down → shows "Unavailable", never invents a reading',
    'Fresh user: double-click index.html and it just runs',
  ];

  function checkList(items, x) {
    items.forEach((t, i) => {
      const y = 2.55 + i * 0.82;
      s.addText('✓', {
        x, y, w: 0.35, h: 0.4,
        fontFace: FONT, fontSize: 16, bold: true, color: C.emerald,
      });
      s.addText(t, {
        x: x + 0.38, y, w: 5.4, h: 0.68,
        fontFace: FONT, fontSize: 13, color: C.slate, lineSpacingMultiple: 1.15,
        fit: 'shrink',
      });
    });
  }
  checkList(left, 0.7);
  checkList(right, 6.9);

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.7, y: 6.15, w: 12, h: 0.72, rectRadius: 0.06,
    fill: { color: 'ECFDF5' }, line: { color: 'A7F3D0', width: 1 },
  });
  s.addText('npm test → 5 of 5 passed   ·   node --check → passed   ·   git diff --check → clean', {
    x: 0.7, y: 6.15, w: 12, h: 0.72,
    fontFace: FONT, fontSize: 14, bold: true, color: '047857',
    align: 'center', valign: 'middle',
  });
}

// ===========================================================================
// Slide 7 — What's next + links
// ===========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.slate };
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: H - 0.22, w: W, h: 0.22, fill: { color: C.indigo },
  });

  s.addText('WHAT IS NEXT', {
    x: 0.85, y: 0.7, w: 9, h: 0.4,
    fontFace: FONT, fontSize: 13, bold: true, color: '818CF8', charSpacing: 3,
  });
  s.addText('Where TaskFlow goes from here', {
    x: 0.8, y: 1.1, w: 11.5, h: 0.8,
    fontFace: FONT, fontSize: 34, bold: true, color: C.white,
  });

  const next = [
    ['🎙', 'Voice brain dump', 'Whisper speech-to-text — talk for 30 sec while walking to class, get a plan.'],
    ['🔗', 'LMS + calendar sync', 'Pull real due dates from Canvas / Blackboard automatically.'],
    ['📈', 'Adaptive velocity', 'Learn your real pace — if you run 20% long on coding, future estimates grow.'],
    ['✋', 'Drag to reschedule', 'Let users move a task by hand, so the plan feels like theirs.'],
  ];

  next.forEach((n, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.85 + col * 6.1, y = 2.3 + row * 1.55;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 5.75, h: 1.35, rectRadius: 0.08,
      fill: { color: '273449' }, line: { color: '334155', width: 1 },
    });
    s.addText(n[0], {
      x: x + 0.25, y: y + 0.3, w: 0.6, h: 0.6,
      fontFace: FONT, fontSize: 24, align: 'center',
    });
    s.addText(n[1], {
      x: x + 0.95, y: y + 0.2, w: 4.6, h: 0.35,
      fontFace: FONT, fontSize: 15, bold: true, color: C.white,
    });
    s.addText(n[2], {
      x: x + 0.95, y: y + 0.58, w: 4.6, h: 0.65,
      fontFace: FONT, fontSize: 11.5, color: C.slateLight, lineSpacingMultiple: 1.1,
      fit: 'shrink',
    });
  });

  s.addShape(pptx.ShapeType.rect, {
    x: 0.87, y: 5.75, w: 1.6, h: 0.04, fill: { color: C.indigo },
  });

  s.addText('Try it now', {
    x: 0.85, y: 5.95, w: 11, h: 0.4,
    fontFace: FONT, fontSize: 15, bold: true, color: '818CF8',
  });
  s.addText('github.com/Lelaki-Biasa/smart-day-planner', {
    x: 0.85, y: 6.35, w: 11, h: 0.4,
    fontFace: FONT, fontSize: 17, bold: true, color: C.white,
  });
  s.addText('lelaki-biasa.github.io/smart-day-planner', {
    x: 0.85, y: 6.75, w: 11, h: 0.4,
    fontFace: FONT, fontSize: 14, color: C.slateLight,
  });

  s.addText('Thank you — questions?', {
    x: 8.6, y: 6.35, w: 4.1, h: 0.6,
    fontFace: FONT, fontSize: 20, bold: true, color: C.white, align: 'right',
  });
}

const outPath = path.join(__dirname, '..', 'TaskFlow-Slides.pptx');
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log('Wrote ' + outPath);
});
