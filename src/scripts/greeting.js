// ── TIME OF DAY GREETING ────────────────────────────────────────────────
function initGreeting() {
  const h = new Date().getHours();
  const greetingEl = document.getElementById('time-greeting');

  let greeting = '';
  if      (h >= 5  && h < 12) greeting = 'morning. coffee first. ☕';
  else if (h >= 12 && h < 17) greeting = 'afternoon grind. 💻';
  else if (h >= 17 && h < 21) greeting = 'evening mode. 🌆';
  else if (h >= 21 && h < 24) greeting = 'still going. 🌙';
  else                         greeting = "you're up late too huh. 🦉";

  if (greetingEl) greetingEl.textContent = greeting;

}

document.addEventListener('astro:page-load', initGreeting);
