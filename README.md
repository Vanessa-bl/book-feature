# Vue 3 + TypeScript + Vite > Reedsy

Writing Velocity

A small feature I built on top of a book editor prototype (Vue 3 + Tiptap). Most writing tools, Reedsy Studio included, track word count goals and streaks. I wanted to try calculating something a bit different: the hour of the day a writer tends to write fastest, rather than just how much they wrote in total.

What it shows

In the stats bar at the bottom of the editor there is one entry that looks like this:

16:00
320 w/h (12 min)

That is the hour of the day where the writer has historically produced the most words per hour, how fast they wrote during that hour on average, and how many total minutes of writing feed into that number.

Why words per hour and not words per day

Word count goals answer "did I write enough today." They do not answer "when should I sit down to write." A writer who does 200 words in a rushed 10 minute session before work and 200 words in a relaxed 40 minute evening session wrote the same amount, but one of those sessions was four times more productive. Words per hour captures that difference. It is the same idea as a pace metric in running: total distance tells you what happened, pace tells you how well it happened.

How a session is defined

The tricky part of a metric like this is deciding what counts as one continuous writing session versus two separate ones. If someone writes for a while, stops to think for two minutes, then keeps writing, that should still be one session. If they close the laptop and come back three hours later, that is a new session.

The implementation handles this with an idle timeout. Every time the editor content changes, the current session's word count and last activity timestamp update. If more than a minute passes with no changes, the session is considered finished, gets saved, and the next keystroke starts a new one. This keeps short thinking pauses from fragmenting a session while still separating genuinely different writing blocks.

Right now that one minute timeout is set short on purpose, to make the feature easy to test without having to sit and write for hours to see sessions form. In a real deployment this would be tuned to something longer, closer to ten or fifteen minutes, to better match how people actually pause while writing.

Where the data lives

Every finished session is stored as three numbers: when it started, when it ended, and how many words were added during it. Nothing about the manuscript content itself is stored, only these session records. They persist in the browser through localStorage so the data survives page reloads and accumulates over multiple writing days without needing a backend.

How the best hour is calculated

Every session gets grouped by the hour of the day it started in. For each hour, the total words written and total minutes spent are added up across every session that started in that hour. Words per hour for that bucket is total words divided by total minutes, multiplied by sixty. Whichever hour ends up with the highest words per hour is the one shown in the stats bar, along with how many minutes of data support that number, so a single lucky burst of typing does not get treated the same as a consistent pattern backed by real time.

Component structure

The feature is split into a composable that owns the session tracking and calculation logic, and two small display components. StatItem is a generic label plus value pair used for every entry in the stats bar, including word count, character count, and reading time, so the best hour indicator reuses the same visual piece as everything else rather than needing its own custom markup. WritingStats lays out all the stat items in a row and decides what to show before there is enough data yet, which for a brand new session is a plain dash rather than an empty or broken looking number.

What is intentionally left out

There is no gamification here, no streaks, no badges, no daily goal countdown. Those features already exist in Reedsy Studio and in most competing tools, and they optimize for keeping someone opening the app rather than helping them understand their own habits. This is meant to sit quietly in the stats bar and answer one honest question a writer might actually have about their own process.
