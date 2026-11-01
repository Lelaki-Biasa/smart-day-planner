const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const start = html.indexOf('// Keyword dictionaries for time estimation');
const end = html.indexOf('// Scheduling starting at startTimeStr');
if (start < 0 || end < 0) { console.log('extraction failed'); process.exit(1); }
const block = html.slice(start, end);

const fmtStart = html.indexOf('function formatMinutes');
const fmtEndMarker = "return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;";
const fmtEnd = html.indexOf(fmtEndMarker, fmtStart) + fmtEndMarker.length;
const fmt = html.slice(fmtStart, fmtEnd) + '\n}';

const sample = [
  'Finish AIAA midterm project report',
  'Review machine learning lecture slides (45 mins)',
  'Break at 12:00 PM for lunch',
  'Email professor about final paper topic',
  'Fold clean laundry and tidy desk',
  'Quick 30 min gym workout',
  'Break at 3:30 PM for 15 mins',
  'Team sync on Discord for 20 mins',
  'Study for chemistry exam (1.5h)',
  'Buy groceries',
  'Reply to all emails',
  'Deep clean kitchen and do laundry',
  'Work on side project feature',
  'Read lecture notes for 25 mins',
  'Call dentist to book appointment',
  'Urgent: fix bug in payment module due today',
  'Write research paper outline',
].join('\n');

const lines = sample.split('\n');
const pace = 'balanced';

const runner = new Function('lines', 'pace', fmt + '\n' + block + '\nreturn parsedTasks;');

// warm-up
let out = runner(lines, pace);

const N = 500;
const t0 = process.hrtime.bigint();
for (let i = 0; i < N; i++) out = runner(lines, pace);
const t1 = process.hrtime.bigint();
const perRun = Number(t1 - t0) / 1e6 / N;

console.log('lines parsed:', lines.length);
console.log('avg parse time over ' + N + ' runs:', perRun.toFixed(4), 'ms');
console.log('');
console.log('--- classification results ---');
out.forEach(t => {
  console.log(
    (t.title.length > 34 ? t.title.slice(0, 34) + '...' : t.title).padEnd(36),
    String(t.duration).padStart(3) + 'm',
    t.quadrant,
    t.priority.padEnd(6),
    t.category,
    t.targetMinutes !== null ? 'fixed@' + t.targetMinutes : ''
  );
});

// AM/PM rollover check via formatMinutes
console.log('');
console.log('--- formatMinutes rollover ---');
[11 * 60 + 30, 12 * 60 + 0, 12 * 60 + 45, 13 * 60 + 0, 15 * 60 + 30, 23 * 60 + 59].forEach(m => {
  console.log(m + ' min ->', new Function('return (' + fmt + ')(' + m + ')')());
});
