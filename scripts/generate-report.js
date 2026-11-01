const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  PageNumber,
  Footer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} = require('docx');

// ---------------------------------------------------------------------------
// Content — edit these strings and re-run `node scripts/generate-report.js`
// ---------------------------------------------------------------------------
const AUTHOR = 'Marvel Hubert Rahardjo';
const STUDENT_ID = 'W11521407';
const COURSE = 'AIAA';
const REPORT_DATE = 'November 2, 2026';
const REPO_URL = 'https://github.com/Lelaki-Biasa/smart-day-planner';
const DEMO_URL = 'https://lelaki-biasa.github.io/smart-day-planner/';

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const BODY_FONT = 'Calibri';

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 340, after: 150 },
    children: [new TextRun({ text, bold: true, color: '1F3864', size: 32, font: BODY_FONT })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 250, after: 110 },
    children: [new TextRun({ text, bold: true, color: '2E5496', size: 26, font: BODY_FONT })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 190, after: 90 },
    children: [new TextRun({ text, bold: true, color: '404040', size: 23, font: BODY_FONT })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 150, line: 300 },
    alignment: opts.align,
    children: [new TextRun({ text, size: 22, font: BODY_FONT, bold: !!opts.bold })],
  });
}

function pRich(lead, rest) {
  return new Paragraph({
    spacing: { after: 150, line: 300 },
    children: [
      new TextRun({ text: lead, size: 22, font: BODY_FONT, bold: true }),
      new TextRun({ text: rest, size: 22, font: BODY_FONT }),
    ],
  });
}

function bullet(text, lead) {
  const children = [];
  if (lead) children.push(new TextRun({ text: lead, size: 22, font: BODY_FONT, bold: true }));
  children.push(new TextRun({ text, size: 22, font: BODY_FONT }));
  return new Paragraph({ bullet: { level: 0 }, spacing: { after: 90, line: 300 }, children });
}

function numbered(text, lead) {
  const children = [];
  if (lead) children.push(new TextRun({ text: lead, size: 22, font: BODY_FONT, bold: true }));
  children.push(new TextRun({ text, size: 22, font: BODY_FONT }));
  return new Paragraph({
    numbering: { reference: 'steps', level: 0 },
    spacing: { after: 90, line: 300 },
    children,
  });
}

function spacer(after = 120) {
  return new Paragraph({ spacing: { after }, children: [] });
}

// ---------------------------------------------------------------------------
// Table helper
// ---------------------------------------------------------------------------
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };

function cell(text, { header = false, width } = {}) {
  return new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    shading: header ? { fill: '1F3864' } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    borders: { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER },
    children: [
      new Paragraph({
        spacing: { after: 0, line: 280 },
        children: [
          new TextRun({
            text,
            size: 20,
            font: BODY_FONT,
            bold: header,
            color: header ? 'FFFFFF' : '333333',
          }),
        ],
      }),
    ],
  });
}

function makeTable(headers, rows, widths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((text, i) => cell(text, { header: true, width: widths[i] })),
      }),
      ...rows.map(
        (row) => new TableRow({ children: row.map((text, i) => cell(text, { width: widths[i] })) })
      ),
    ],
  });
}

// ---------------------------------------------------------------------------
// Cover page
// ---------------------------------------------------------------------------
const cover = [
  new Paragraph({ spacing: { before: 1500, after: 0 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [
      new TextRun({ text: 'AIAA Midterm Project Report', size: 28, font: BODY_FONT, color: '7F7F7F' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [
      new TextRun({
        text: 'TaskFlow: Smart Day Planner',
        size: 56,
        bold: true,
        font: BODY_FONT,
        color: '1F3864',
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    children: [
      new TextRun({
        text: 'A lightweight single-page web app that turns messy brain dumps into a structured, time-blocked daily schedule.',
        size: 24,
        font: BODY_FONT,
        color: '595959',
      }),
    ],
  }),
  makeTable(
    ['Field', 'Value'],
    [
      ['Author', AUTHOR],
      ['Student ID', STUDENT_ID],
      ['Course', COURSE],
      ['Submission date', REPORT_DATE],
      ['Repository', REPO_URL],
      ['Live demo', DEMO_URL],
    ],
    [30, 70]
  ),
  new Paragraph({ children: [new PageBreak()] }),
];

// ---------------------------------------------------------------------------
// Section 1 — What You Made
// ---------------------------------------------------------------------------
const section1 = [
  h1('Section 1: What I Made'),

  p(
    'TaskFlow (Smart Day Planner) is a lightweight single-page web app whose single job is to convert a messy, unformatted brain dump into a structured, time-blocked daily schedule — complete with custom breaks, live weather context, and one-click calendar export. The user types whatever is in their head, chooses a date and a start time, and gets back a real timeline with clock times instead of a list of bullet points.'
  ),

  p(
    'The problem it addresses is specific: a list of fifteen unordered tasks is not a schedule. Looking at that list creates decision paralysis, so the easy low-value tasks get done first and the demanding work gets pushed to late at night. TaskFlow removes that decision by parsing the list, estimating durations, ranking urgency, and laying the day out for the user.'
  ),

  h2('Key Features'),

  h3('1. Messy Text Ingestion'),
  p(
    'There are no rigid forms. Users dump raw thoughts — bullet points, shorthand, half-sentences, mixed formats — into one text box. No date pickers, no category dropdowns, no field-per-task.'
  ),

  h3('2. Automatic Time Estimation'),
  p(
    'The parser first looks for an explicit duration ("study 1.5h", "gym 45 mins", "25 mins") and converts it directly to minutes. When none is given, it assigns a realistic default from keyword dictionaries: 60 minutes for heavy work (project, report, study, exam, research), 45 minutes for medium work (clean, laundry, workout, meeting, review), 20 minutes for light work (email, reply, groceries, tidy), and 30 minutes as the fallback. A "pace" selector lets the user scale every implicit estimate — focused (0.9×), balanced (1.0×), or relaxed (1.2×). Explicitly stated durations are never overridden by the pace setting.'
  ),

  h3('3. "Eat That Frog" Spotlight'),
  p(
    'The app identifies the most mentally demanding task of the day and schedules it first thing in the morning, when focus and willpower are highest. It is displayed in a dedicated "Eat The Frog #1 Priority" card with the task, the reasoning, and its time block, so the user knows exactly what to start with.'
  ),

  h3('4. Eisenhower Matrix Classification'),
  p('Every task is sorted into one of four quadrants:'),
  makeTable(
    ['Quadrant', 'Meaning', 'Action', 'How TaskFlow assigns it'],
    [
      ['Q1', 'Urgent & Important', 'Do first', 'Contains urgent / due / exam / midterm / today / ASAP'],
      ['Q2', 'Important, not urgent', 'Schedule deep focus', 'Heavy "deep work" keywords, or the default for unmatched tasks'],
      ['Q3', 'Urgent, low impact', 'Delegate / batch together', 'Email, reply, call, appointment — quick admin work'],
      ['Q4', 'Low value', 'Minimize / eliminate', 'Breaks and low-priority filler'],
    ],
    [13, 24, 22, 41]
  ),
  spacer(),
  p(
    'The matrix is rendered as its own tabbed view alongside the timeline, so the user can switch between "what time is it" and "what matters most".'
  ),

  h3('5. Custom Breaks on Demand'),
  p(
    'Breaks are only added when the user explicitly asks for one — "Break at 12 PM", "Lunch at 12:30", "Break at 3:30 PM for 15 mins". Each is converted into a fixed anchor at that exact minute. The scheduler then fills the gap before it with flexible tasks that fit, places the break precisely on its target, and resumes afternoon tasks immediately after. If the user writes no breaks, none are injected.'
  ),

  h3('6. Multi-Day Planning and Calendar Export'),
  p(
    'The user can select today, tomorrow, or any custom date (Oct 30, Oct 31, or any other). The plan is then exported as a standard .ics (iCalendar, RFC 5545) file that imports directly into Google Calendar, Apple Calendar, or Outlook — landing on the exact day chosen, not on today.'
  ),

  h3('7. Weather Context'),
  p(
    'The app connects to the free Open-Meteo API (no API key required) to show the forecast for the chosen date and city, so the user can decide between an indoor deep-work day and an outdoor break. If the forecast cannot be fetched, the widget states that plainly rather than displaying a fabricated reading.'
  ),

  h2('Supporting Features'),
  bullet('Interactive checklist with a progress bar, so tasks can be ticked off during the day.'),
  bullet('Summary metrics derived from validated task data: total tasks, work minutes, break minutes, and estimated finish time.'),
  bullet('Quick sample buttons ("Midterm Prep", "Weekend Reset") that fill the box with realistic examples for first-time users.'),
  bullet('Runs with zero setup — no build step, no framework, no server, no API key.'),
];

// ---------------------------------------------------------------------------
// Section 2 — Who It Is For
// ---------------------------------------------------------------------------
const section2 = [
  h1('Section 2: Who It Is For'),

  h2('1. University Students'),
  pRich('Problem: ', 'Juggling multiple assignments, exams, and classes leads to decision paralysis. Opening a fifteen-item to-do list triggers anxiety, and the natural response is to procrastinate on the easy tasks first while the real work slips to midnight.'),
  pRich('Solution: ', 'TaskFlow turns a chaotic homework backlog into an orderly step-by-step timeline with protected study blocks, the hardest task placed first, and breaks that do not eat into focus time. This was the primary audience I designed for, and the reason the example inputs in the app are all student tasks.'),

  h2('2. Freelancers and Remote Workers'),
  pRich('Problem: ', 'Working from home without a strict 9-to-5 schedule makes it easy for shallow work — checking email, replying to chats, tidying — to consume an entire day while the billable or deep work quietly goes undone.'),
  pRich('Solution: ', 'TaskFlow structures an open, unstructured day into clear deep-work blocks and batched administrative slots, using the Eisenhower Q3 bucket to group the shallow tasks so they take one block instead of scattered fragments all day.'),

  h2('3. People Facing Executive Dysfunction / ADHD'),
  pRich('Problem: ', 'Traditional calendar and productivity tools demand upfront structure — date pickers, category tags, duration fields, colour labels. That setup friction is exactly the barrier that stops someone with executive dysfunction from starting at all.'),
  pRich('Solution: ', 'TaskFlow is zero-friction by design. The user types whatever is in their head with no formatting at all, and the app performs the organizational heavy lifting — estimating, ranking, and scheduling. There is nothing to configure before the first plan appears.'),

  p(
    'What unites all three audiences is the same underlying need: they already have the tasks, they lack the schedule. TaskFlow does not manage projects, teams, or backlogs — it converts a single messy list into a single realistic day, and that narrow scope is what allows it to stay a single file with no backend.'
  ),
];

// ---------------------------------------------------------------------------
// Section 3 — How I Made It With AI
// ---------------------------------------------------------------------------
const section3 = [
  h1('Section 3: How I Made It With AI'),

  h2('AI Pair Programming'),
  p(
    'I built this project in collaboration with AI coding assistants — primarily Google Antigravity, alongside OpenAI Codex — working as command-line agents directly inside the project folder. This was not a case of pasting snippets into a chatbot after the fact: the agents wrote and edited the actual files in the repository while I directed the work. They scaffolded the front-end interface, the responsive Tailwind CSS components, the state reactivity and rendering logic, and the calendar generation scripts. In practical terms, AI wrote the majority of the lines of code; I chose what to build, judged what was correct, and decided when it was finished.'
  ),

  p(
    'Because two separate agent sessions were involved and neither shares live chat with the other, I set up two shared files in the repository. AGENTS.md holds the rules both must follow (read the handoff first, treat git as shared state, never commit secrets). HANDOFF.md carries the running status — what has been done, what was verified, what is next — and each session reads it on start and rewrites it before ending. Git itself acts as the third shared surface: I used git status and diffs to review exactly what an agent had changed before accepting it.'
  ),

  h2('The Working Loop'),
  numbered('I describe the behaviour in plain language, with a concrete example of what I expect.', 'Ask. '),
  numbered('The agent writes or edits the code in the repository.', 'Generate. '),
  numbered('I run the app, paste real input, and inspect the result. When it is wrong I say what is wrong using a specific failing input rather than an abstraction.', 'Test. '),
  numbered('The agent fixes it; I check the diff to confirm only the intended change landed.', 'Verify. '),

  h2('Dual-Engine Architecture'),
  p(
    'One architectural decision shaped the whole build: the app has two independent reasoning engines behind the same interface, so it is useful with or without a network.'
  ),

  h3('Engine 1 — Client-Side Smart Heuristics (default)'),
  p(
    'A built-in local parser using regex patterns and keyword evaluation. It extracts explicit durations and target times, classifies each line against heavy / medium / light / break keyword dictionaries, assigns the Eisenhower quadrant, and then balances the schedule around fixed anchors. It runs completely offline with zero API keys, which guarantees 100% reliable uptime for in-class presentations — no network dependency, no rate limits, no key to expire mid-demo. I benchmarked it directly: parsing a 17-line realistic brain dump takes roughly 0.04 ms, far inside the 400 ms budget I set for the feature.'
  ),

  h3('Engine 2 — Live LLM Mode (optional)'),
  p(
    'A connector for cloud LLMs — OpenAI, Gemini, and Groq-compatible endpoints — using structured JSON schema prompting. The raw text is sent with a strict schema request, and the response is validated field by field before a single line is rendered. It is entirely optional: users who want stronger natural-language reasoning can paste their own key, and everyone else keeps the free offline path.'
  ),

  h2('Behavioral Psychology Rules'),
  p(
    'The scheduling algorithm is not arbitrary — it is grounded in established productivity principles rather than invented from scratch:'),
  bullet('Brian Tracy\u2019s "Eat That Frog": do the hardest, most important task first, while willpower is highest.', 'Eat That Frog. '),
  bullet('The Eisenhower Matrix: separate urgent from important so the user stops confusing busywork with progress.', 'Eisenhower Matrix. '),
  bullet('Energy is front-loaded: demanding cognitive work is placed in the morning block, and shallow administrative tasks are pushed later or batched together — a simplified chronotype energy curve.', 'Morning energy curve. '),

  h2('What I Decided Versus What AI Wrote'),
  p(
    'AI made this fast, but it was not free of judgement. I chose the topic, the scope, and the cut list — one file, one day, no backend, no accounts. I chose the core concepts: the frog, the four quadrants, and breaks the user opts into rather than the app imposing. I also caught the failures that mattered. When an early version displayed a plausible-looking weather reading even though the API call had failed, I treated that as a bug to remove outright rather than smooth over — the app now shows "Unavailable" instead of inventing data. The value I added was not typing; it was deciding what the tool should do and verifying whether it actually did it.'
  ),
];

// ---------------------------------------------------------------------------
// Section 4 — What You Checked
// ---------------------------------------------------------------------------
const section4 = [
  h1('Section 4: What I Checked (Testing and Validation)'),

  p(
    'I tested the app in two ways: an automated suite that runs from the command line, and manual browser checks of the behaviours that cannot be asserted without a human looking at the screen. The automated checks are reproducible by anyone who clones the repository and runs npm test.'
  ),

  h2('Automated Checks'),
  makeTable(
    ['Check', 'Command', 'Result'],
    [
      ['Unit tests', 'npm test', '5 of 5 passed'],
      ['Shared module syntax', 'node --check planner-utils.js', 'Passed'],
      ['Inline app script syntax', 'node --check (extracted script)', 'Passed'],
      ['Whitespace / conflict markers', 'git diff --check', 'Passed'],
    ],
    [30, 42, 28]
  ),
  spacer(),
  p('The five tests cover the failure modes most likely to corrupt output:'),
  bullet('HTML special characters are escaped before interpolation, so a task titled <script> cannot execute in the page.'),
  bullet('Calendar text delimiters and line breaks are escaped per RFC 5545 — commas, semicolons, backslashes, and newlines.'),
  bullet('A valid schedule normalises correctly: task count, work minutes, break minutes, finish time, and frog start time are all derived from validated tasks.'),
  bullet('Unsafe or malformed task IDs are rejected with a clear error instead of being rendered.'),
  bullet('Duplicate task IDs are rejected.'),

  h2('Explicit vs. Implicit Durations'),
  p(
    'Verified that inputs with exact times are converted to minutes precisely: "study 1.5h" produced 90 minutes, "gym 30 min" produced 30, "team sync 20 mins" produced 20, and "lecture notes 25 mins" produced 25. Untimed items received contextual estimates — 60 minutes for coursework-heavy lines such as "write research paper outline", and 20 minutes for light items such as "reply to all emails". I also confirmed that the pace multiplier scales only implicit estimates and never overwrites a duration the user stated explicitly.'
  ),

  h2('Time Rollover and Transitions'),
  p(
    'Tested schedules that cross noon, since a 12-hour clock is where overflow bugs usually appear. Running the formatter across the boundary produced 11:30 AM, then 12:00 PM, then 12:45 PM, then 1:00 PM — correct through the AM/PM transition with no 13:00-style leakage and no 0:00 reset. Late-evening values also held (11:59 PM), confirming the modulo-24 and hour-12 edge cases behave.'
  ),

  h2('Custom Break Timing'),
  p(
    'Tested "Break at 12:00 PM" and "Break at 3:30 PM for 15 mins". Both converted to fixed anchors at exactly minute 720 and minute 930 respectively, and the scheduler locked them to those slots: morning tasks fill the time before 12:00 PM, the break occupies its own block, and afternoon tasks resume immediately after. I also confirmed that when no break text is written, zero unwanted breaks are injected into the schedule.'
  ),

  h2('Calendar Standard (RFC 5545) Compliance'),
  p(
    'Exported .ics files for different dates — including Oct 30 and Oct 31 — and confirmed the events land on the chosen day rather than defaulting to today, including correct year handling. The text escaping rules required by RFC 5545 (commas, semicolons, backslashes, newlines) are covered by dedicated unit tests, and the resulting files import cleanly into Google Calendar and Apple Calendar.'
  ),

  h2('Data Validation and Failure Handling'),
  bullet('An empty input, a bad API key, and a malformed API response each produce a readable error message and leave the page in a usable state — no blank screen, no partial render.'),
  bullet('Schedule data is validated field by field (ID format, title length, duration bounds, allowed priorities and quadrants, time format) before rendering, so a bad response cannot corrupt the page.'),
  bullet('Frog selection and summary totals are computed from validated task data only, never from a separate unvalidated path.'),
  bullet('When the weather API is unreachable the widget shows "Unavailable" instead of fabricating a reading.'),

  h2('Zero-Setup Usability'),
  p(
    'Verified that a fresh user can double-click index.html, or open the GitHub Pages link, and immediately use the app — no terminal commands, no package installation, no API key, no build step. The offline engine is the default, so the core flow works even with the network disabled.'
  ),

  h2('Known Limitations'),
  bullet('The live-LLM path requires the user to supply their own key; the offline parser is intentionally simpler and will misread unusual phrasing.'),
  bullet('No automated browser tests — the UI and visual checks above were done manually.'),
  bullet('The weather city is stored in localStorage and defaults to Taipei; there is no GPS lookup unless the user types a city.'),
];

// ---------------------------------------------------------------------------
// Section 5 — What Is Next
// ---------------------------------------------------------------------------
const section5 = [
  h1('Section 5: What Is Next (Future Roadmap)'),

  h2('1. Voice Brain Dump'),
  p(
    'Integrating speech-to-text (for example Whisper AI) so a user can record a 30-second voice memo while walking to class and have their day organized hands-free. This removes the last piece of friction — opening the app and typing — and fits the brain-dump philosophy exactly: capture first, organize second.'
  ),

  h2('2. Two-Way LMS and Calendar Sync'),
  p(
    'A direct API connection to university systems such as Canvas or Blackboard, plus Google Calendar, to automatically ingest assignment due dates and existing class schedules. Tasks would then arrive pre-populated with their real deadlines instead of relying on the user to remember to type "due today" — which is precisely the input the Eisenhower classifier depends on.'
  ),

  h2('3. Adaptive Personal Velocity'),
  p(
    'Learning each user\u2019s actual completion speeds over time. If a student consistently takes 20% longer on coding assignments than the estimate, the AI dynamically expands future estimates for that task type. Today the app ships a fixed pace multiplier (focused / balanced / relaxed) as a manual stand-in for this; the next step is replacing that manual guess with data the app has learned from real check-offs.'
  ),

  h2('4. Drag to Reschedule'),
  p(
    'The biggest gap in the current version is that a generated plan is fixed. Allowing the user to drag a task into a new slot would turn it from a generated list into a plan they own — the single highest-value interaction change available.'
  ),
];

// ---------------------------------------------------------------------------
// Appendix
// ---------------------------------------------------------------------------
const appendix = [
  h1('Appendix A: Example Input and Output'),

  p('Input pasted into the box:'),
  new Paragraph({
    spacing: { after: 170, line: 280 },
    shading: { fill: 'F2F2F2' },
    indent: { left: 360, right: 360 },
    children: [
      'Finish AIAA midterm project report',
      'Review machine learning lecture slides (45 mins)',
      'Break at 12:00 PM for lunch',
      'Email professor about final paper topic',
      'Fold clean laundry and tidy desk',
      'Quick 30 min gym workout',
      'Break at 3:30 PM for 15 mins',
      'Team sync on Discord for 20 mins',
    ].map((line, idx) =>
      new TextRun({
        text: line,
        font: 'Consolas',
        size: 18,
        // `break` emits a real <w:br/> so each line starts on its own row
        break: idx === 0 ? 0 : 1,
      })
    ),
  }),
  p(
    'TaskFlow returns a timeline starting at the chosen time: the report is scheduled first as the frog, the two typed breaks are locked at 12:00 PM and 3:30 PM with tasks routed around them, stated durations are honoured (45, 30, and 20 minutes), and the remaining tasks are estimated and sorted by Eisenhower quadrant. The day can then be exported to a calendar file.'
  ),

  h1('Appendix B: Repository Layout'),
  makeTable(
    ['File', 'Purpose'],
    [
      ['index.html', 'The entire application: markup, styles, and scheduling logic.'],
      ['planner-utils.js', 'Shared helpers — HTML escaping, .ics escaping, schedule validation.'],
      ['tests/planner-utils.test.js', 'Node built-in test suite (5 tests).'],
      ['README.md', 'Feature overview, example input, and usage instructions.'],
      ['AGENTS.md', 'Shared rules for the AI agent sessions working on the repo.'],
      ['HANDOFF.md', 'Running status log: progress, verification, and next steps.'],
      ['scripts/', 'Report generator and claim-verification scripts.'],
      ['package.json', 'Runs the test suite with npm test.'],
    ],
    [38, 62]
  ),

  spacer(),
  p('Repository: ' + REPO_URL, { bold: true }),
  p('Live demo: ' + DEMO_URL, { bold: true }),
];

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------
const doc = new Document({
  creator: AUTHOR,
  title: 'AIAA Midterm Project Report — TaskFlow: Smart Day Planner',
  description: 'Midterm project report for the AIAA course.',
  styles: {
    default: {
      document: { run: { font: BODY_FONT, size: 22, color: '333333' } },
    },
  },
  numbering: {
    config: [
      {
        reference: 'steps',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 620, hanging: 320 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: { margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Page ', size: 18, font: BODY_FONT, color: '808080' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, font: BODY_FONT, color: '808080' }),
                new TextRun({ text: ' of ', size: 18, font: BODY_FONT, color: '808080' }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: BODY_FONT, color: '808080' }),
              ],
            }),
          ],
        }),
      },
      children: [...cover, ...section1, ...section2, ...section3, ...section4, ...section5, ...appendix],
    },
  ],
});

const outPath = path.join(__dirname, '..', 'AIAA-Midterm-Report-TaskFlow.docx');
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log('Wrote ' + outPath);
});
