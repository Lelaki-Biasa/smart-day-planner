const test = require('node:test');
const assert = require('node:assert/strict');
const { escapeHtml, escapeIcsText, normalizeScheduleData } = require('../planner-utils.js');

function sampleData() {
  return {
    schedule: [
      { id: 't1', title: '<Report>', startTime: '9:00 AM', endTime: '10:00 AM', duration: 60, priority: 'High', category: 'task', quadrant: 'Q2' },
      { id: 'b1', title: 'Lunch', startTime: '12:00 PM', endTime: '12:30 PM', duration: 30, priority: 'Low', category: 'break', quadrant: 'Q4' }
    ],
    frog: { title: '<Report>', reason: 'Do this first.' },
    coachAdvice: 'Take a break.'
  };
}

test('escapes HTML special characters before interpolation', () => {
  assert.equal(escapeHtml(`<script a="b">&'`), '&lt;script a=&quot;b&quot;&gt;&amp;&#39;');
});

test('escapes calendar text delimiters and line breaks', () => {
  assert.equal(escapeIcsText('Task, one;\\two\r\nnext'), 'Task\\, one\\;\\\\two\\nnext');
});

test('normalizes valid schedule metrics and frog times', () => {
  const result = normalizeScheduleData(sampleData());
  assert.equal(result.totalTasks, 1);
  assert.equal(result.totalWorkMinutes, 60);
  assert.equal(result.totalBreakMinutes, 30);
  assert.equal(result.finishTime, '12:30 PM');
  assert.equal(result.frog.startTime, '9:00 AM');
});

test('rejects unsafe IDs and malformed schedule fields', () => {
  const data = sampleData();
  data.schedule[0].id = `x"><img src=x>`;
  assert.throws(() => normalizeScheduleData(data), /Invalid or duplicate task ID/);
});

test('rejects duplicate task IDs', () => {
  const data = sampleData();
  data.schedule[1].id = data.schedule[0].id;
  assert.throws(() => normalizeScheduleData(data), /Invalid or duplicate task ID/);
});

