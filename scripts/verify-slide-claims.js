// Verifies the claims printed on TaskFlow-Slides.pptx against the real
// scheduling code extracted from index.html. Reads the deck, so it cannot
// drift out of sync with what is actually on the slide.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ---------------------------------------------------------------------------
// Extract the real scheduler out of index.html
// ---------------------------------------------------------------------------
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// formatMinutes: brace-count from its declaration
const fmtStart = html.indexOf('function formatMinutes');
let fmt = '', depth = 0, started = false;
for (let i = fmtStart; i < html.length; i++) {
  if (html[i] === '{') { depth++; started = true; }
  else if (html[i] === '}') {
    depth--;
    if (started && depth === 0) { fmt = html.slice(fmtStart, i + 1); break; }
  }
}

const kwStart = html.indexOf('// Keyword dictionaries');
const schedStart = html.indexOf('// Scheduling starting at startTimeStr');
const block = html.slice(kwStart, schedStart);
// the slice ends with the enclosing function's closing brace - drop it
const sched = html.slice(schedStart, fmtStart).replace(/\}\s*$/, '');

const runSchedule = new Function(
  'lines', 'pace', 'startTimeStr',
  fmt +
    '\nfunction generateCoachAdvice(){return "";}' +
    '\nfunction __run(lines, pace, startTimeStr) {\n' + block + sched + '\n}' +
    '\nconst r = __run(lines, pace, startTimeStr);' +
    '\nreturn Array.isArray(r) ? r : r.schedule;'
);

// ---------------------------------------------------------------------------
// Read the "YOU GET" column out of slide 4 of the real .pptx
// ---------------------------------------------------------------------------
function slideRuns(n) {
  const tmpXml = path.join(require('os').tmpdir(), `slide${n}.xml`);
  const pptx = path.join(__dirname, '..', 'TaskFlow-Slides.pptx');
  execSync(
    'powershell -NoProfile -ExecutionPolicy Bypass -Command ' +
    JSON.stringify(
      `Add-Type -AssemblyName System.IO.Compression.FileSystem;` +
      `$z=[System.IO.Compression.ZipFile]::OpenRead(${JSON.stringify(pptx)});` +
      `$e=$z.Entries | Where-Object {$_.FullName -eq 'ppt/slides/slide${n}.xml'};` +
      `$sr=New-Object System.IO.StreamReader($e.Open(),[System.Text.Encoding]::UTF8);` +
      `[System.IO.File]::WriteAllText(${JSON.stringify(tmpXml)}, $sr.ReadToEnd(), [System.Text.UTF8Encoding]::new($false));` +
      `$sr.Close(); $z.Dispose()`
    ),
    { encoding: 'utf8', stdio: 'pipe' }
  );
  const xml = fs.readFileSync(tmpXml, 'utf8');
  fs.unlinkSync(tmpXml);
  return xml;
}

function runsFromXml(xml) {
  const out = [];
  const re = /<a:t>([\s\S]*?)<\/a:t>/g;
  let m;
  while ((m = re.exec(xml)) !== null) out.push(decode(m[1]));
  return out;
}

function decode(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, '&');
}

const runs = runsFromXml(slideRuns(4));

// Everything after "YOU GET" is the output column, until the footer line.
const youGet = runs.findIndex(t => t.trim() === 'YOU GET');
if (youGet < 0) { console.error('FAIL: could not find "YOU GET" on slide 4'); process.exit(1); }

const tail = runs.slice(youGet + 1);
const footerIdx = tail.findIndex(t => t.startsWith('Hardest task first'));
const col = footerIdx >= 0 ? tail.slice(0, footerIdx) : tail;

const slideRows = [];
for (let i = 0; i + 1 < col.length; i += 2) {
  const time = col[i].trim();
  const label = col[i + 1].trim();
  if (!/^\d{1,2}:\d{2}$/.test(time)) {
    console.error(`FAIL: expected a time at position ${i}, got "${time}"`);
    process.exit(1);
  }
  const dur = label.match(/(\d+)m\b/);
  slideRows.push({ time, label, minutes: dur ? +dur[1] : null });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function to24(t) {
  t = t.trim();
  // 12-hour form: "9:00 AM", "3:30 PM"
  const ampm = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let h = +ampm[1] % 12;
    if (ampm[3].toUpperCase() === 'PM') h += 12;
    return h * 60 + +ampm[2];
  }
  // 24-hour form: "09:00", "15:30"
  const h24 = t.match(/^(\d{1,2}):(\d{2})$/);
  if (h24) return +h24[1] * 60 + +h24[2];
  return null;
}
function toClock(min) {
  const h = Math.floor(min / 60), mm = min % 60;
  return String(h).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

// ---------------------------------------------------------------------------
// Claim A: the chosen start time is honoured exactly
// ---------------------------------------------------------------------------
console.log('--- Claim A: start time honoured exactly (slide 6) ---');
let aFail = 0;
[['8:30', '8:30 AM'], ['9:00', '9:00 AM'], ['14:15', '2:15 PM'], ['7:05', '7:05 AM']].forEach(([inp, exp]) => {
  const sch = runSchedule(['Finish AIAA midterm project report', 'Email professor about paper topic'], 'balanced', inp);
  const ok = sch[0].startTime === exp;
  if (!ok) aFail++;
  console.log(`  start=${inp.padEnd(6)} -> ${sch[0].startTime.padEnd(9)} expected ${exp.padEnd(9)} ${ok ? 'OK' : 'MISMATCH'}`);
});

// ---------------------------------------------------------------------------
// Claim B: slide 4 timeline matches what the app really produces
// ---------------------------------------------------------------------------
console.log('\n--- Claim B: slide 4 timeline vs. real scheduler ---');

const input = [
  'Finish AIAA midterm project report',
  'Review ML lecture slides (45 mins)',
  'Break at 12:00 PM for lunch',
  'Email professor about paper topic',
  'Quick 30 min gym workout',
  'Break at 3:30 PM for 15 mins',
];
const actual = runSchedule(input, 'balanced', '9:00');

console.log('  slide 4 says:');
slideRows.forEach(r => console.log(`    ${r.time.padEnd(6)} ${r.label}`));
console.log('  app actually produces:');
actual.forEach(t => console.log(`    ${t.startTime.padEnd(9)} - ${t.endTime.padEnd(9)} ${t.title.slice(0, 34)} (${t.duration}m)`));

let bFail = 0;
if (slideRows.length !== actual.length) {
  console.log(`  MISMATCH: slide has ${slideRows.length} rows, app produces ${actual.length} blocks`);
  bFail++;
}
const n = Math.min(slideRows.length, actual.length);
for (let i = 0; i < n; i++) {
  const sTime = to24(slideRows[i].time);
  const aTime = to24(actual[i].startTime);
  const problems = [];
  if (sTime !== aTime) problems.push(`start ${slideRows[i].time} vs ${actual[i].startTime}`);
  if (slideRows[i].minutes !== actual[i].duration) problems.push(`duration ${slideRows[i].minutes}m vs ${actual[i].duration}m`);
  if (problems.length) { bFail++; console.log(`  ROW ${i + 1} MISMATCH: ${problems.join('; ')}`); }
}
if (!bFail) console.log('  all rows match the real scheduler');

// ---------------------------------------------------------------------------
console.log('\n' + (aFail + bFail === 0 ? 'ALL CLAIMS VERIFIED' : `FAILURES: ${aFail + bFail}`));
process.exit(aFail + bFail === 0 ? 0 : 1);
