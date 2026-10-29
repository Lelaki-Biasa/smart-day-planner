# TaskFlow: Smart Day Planner

> Live demo: [https://lelaki-biasa.github.io/smart-day-planner/](https://lelaki-biasa.github.io/smart-day-planner/)

A lightweight web app that turns messy to-do lists into a realistic, time-blocked schedule for the day. Built as a midterm project for our AIAA course.

---

## Why I Built This

Like many students, whenever I feel overwhelmed by deadlines, I open my Notes app or grab a piece of paper and write down everything I need to do. 

The problem is that a list of 10 random bullet points isn't a schedule. Looking at a huge list actually makes me procrastinate more because I don't know where to start. I usually end up doing the easy, unimportant stuff first (like checking emails or tidying my desk) and leave the hard project work until late at night when I'm already exhausted.

I wanted to make a simple tool where I could just brain-dump whatever is in my head—without worrying about formatting—and have AI turn it into a sensible plan for the day with actual time slots and breaks.

---

## What It Does

- **Accepts messy notes**: You can paste whatever you have—bullet points, shorthand, or even half-sentences.
- **Estimates time automatically**: If you mention a duration like "gym 45 mins" or "study 1.5h", it uses that. If not, it makes a reasonable guess based on what the task is (e.g., shorter for emails, longer for coursework).
- **Highlights the "Frog"**: Finds your most demanding task and puts it first in the morning so you tackle the hardest thing while you have energy.
- **Sorts by priority (Eisenhower Matrix)**: Categorizes tasks into four groups: what to do first, what to schedule, what can be batched together, and what can wait.
- **Break times on your terms**: Only adds breaks when you ask for them (e.g. "Break at 12 PM" or "Lunch at 12:30"). It locks them into the right time slot and schedules your tasks around them.
- **Plan for any date**: Pick today, tomorrow, or any custom date (like Oct 30, Oct 31). When you export the `.ics` file, it lands accurately on that exact day in Google Calendar or Apple Calendar.
- **Live weather forecast**: Checks the weather forecast for your chosen date and location so you know if it's a good day for indoor deep work or outdoor breaks.
- **Works offline or with live AI**: Runs completely client-side in your browser right out of the box (zero setup, no API key needed), but also has an optional toggle if you want to plug in an OpenAI/Gemini API key.
- **Exports to your calendar**: Once you like the schedule, you can export a `.ics` file with one click and import it into Google Calendar, Apple Calendar, or Outlook.

---

## How to Try It

You don't need to install Node, Python, or any packages.

1. **Online**: Open the [live demo](https://lelaki-biasa.github.io/smart-day-planner/) directly in your browser.
2. **Locally**: Clone or download this repo and just double-click `index.html`. It runs right in Chrome, Edge, or Safari.

If you don't feel like typing out a list to test it, there are sample buttons right above the text box (like "Midterm Prep" or "Weekend Reset") that fill in realistic examples with one click.

---

## Tech Used

- HTML5, Vanilla JavaScript, and Tailwind CSS (loaded via CDN)
- Local parsing heuristics for offline scheduling
- iCalendar (.ics) RFC 5545 generator for calendar export
- Hosted using GitHub Pages
