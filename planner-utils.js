(function (root) {
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  function escapeIcsText(value) {
    return String(value ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/\r\n|\r|\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function normalizeScheduleData(data) {
    const allowedPriorities = new Set(['High', 'Medium', 'Low']);
    const allowedCategories = new Set(['task', 'break']);
    const allowedQuadrants = new Set(['Q1', 'Q2', 'Q3', 'Q4']);
    const timePattern = /^(?:1[0-2]|[1-9]):[0-5]\d (?:AM|PM)$/;

    if (!data || !Array.isArray(data.schedule) || data.schedule.length === 0) {
      throw new Error('The planner returned no schedule. Please try again.');
    }

    const ids = new Set();
    const schedule = data.schedule.map((item, index) => {
      if (!item || typeof item !== 'object') throw new Error(`Invalid task at position ${index + 1}.`);
      const id = String(item.id ?? '');
      const title = String(item.title ?? '').trim();
      const duration = Number(item.duration);
      if (!/^[A-Za-z0-9_-]{1,64}$/.test(id) || ids.has(id)) throw new Error(`Invalid or duplicate task ID at position ${index + 1}.`);
      if (!title || title.length > 500) throw new Error(`Invalid task title at position ${index + 1}.`);
      if (!Number.isInteger(duration) || duration < 1 || duration > 1440) throw new Error(`Invalid task duration at position ${index + 1}.`);
      if (!allowedPriorities.has(item.priority) || !allowedCategories.has(item.category) || !allowedQuadrants.has(item.quadrant)) {
        throw new Error(`Invalid task category or priority at position ${index + 1}.`);
      }
      if (!timePattern.test(item.startTime) || !timePattern.test(item.endTime)) throw new Error(`Invalid time at position ${index + 1}.`);
      ids.add(id);
      return { ...item, id, title, duration };
    });

    const tasks = schedule.filter(item => item.category !== 'break');
    const frogCandidate = tasks.find(item => item.priority === 'High') || tasks[0] || schedule[0];
    const requestedFrog = data.frog && typeof data.frog === 'object' ? data.frog : {};
    const frog = tasks.find(item => item.title === requestedFrog.title) || frogCandidate;
    const totalWorkMinutes = tasks.reduce((sum, item) => sum + item.duration, 0);
    const totalBreakMinutes = schedule.filter(item => item.category === 'break').reduce((sum, item) => sum + item.duration, 0);

    return {
      ...data,
      schedule,
      totalTasks: tasks.length,
      totalWorkMinutes,
      totalBreakMinutes,
      finishTime: schedule[schedule.length - 1].endTime,
      frog: frog ? { ...frog, reason: String(requestedFrog.reason || data.frogReason || '') } : null,
      advice: String(data.advice || data.coachAdvice || '')
    };
  }

  const api = { escapeHtml, escapeIcsText, normalizeScheduleData };
  root.TaskFlowUtils = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);

