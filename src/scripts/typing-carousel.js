/* ============================================================
   TYPING EFFECT
   ============================================================ */
let typingRunId = 0;

function initTypingCarousel() {
  const phrases = [
    "i ship things then write about it",
    "my AI has a name and a british accent",
    "npm publish at 3am is self care",
    "444 tests and counting",
    "if it's not open source did it even happen",
    "vibe coding is a legitimate engineering practice"
  ];
  const el = document.getElementById('typing-text');
  if (!el) return;
  const runId = ++typingRunId;

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTicks = 0;

  const TYPING_SPEED  = 52;
  const DELETE_SPEED  = 28;
  const PAUSE_AFTER   = 48;  // ticks before deleting
  const PAUSE_EMPTY   = 12;  // ticks after delete before next phrase

  function tick() {
    if (runId !== typingRunId) return;
    const current = phrases[phraseIdx];

    if (deleting) {
      if (charIdx > 0) {
        charIdx--;
        el.textContent = current.slice(0, charIdx);
        setTimeout(tick, DELETE_SPEED);
      } else {
        deleting = false;
        pauseTicks = PAUSE_EMPTY;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_EMPTY * DELETE_SPEED);
      }
    } else {
      if (pauseTicks > 0) {
        pauseTicks--;
        setTimeout(tick, DELETE_SPEED);
        return;
      }
      if (charIdx < current.length) {
        charIdx++;
        el.textContent = current.slice(0, charIdx);
        setTimeout(tick, TYPING_SPEED + (Math.random() * 20 - 10));
      } else {
        // Done typing — pause before delete
        setTimeout(() => { deleting = true; tick(); }, PAUSE_AFTER * TYPING_SPEED);
      }
    }
  }

  // Start after hero animation delay
  setTimeout(tick, 1100);
}

document.addEventListener('astro:page-load', initTypingCarousel);
