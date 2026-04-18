// ── LOBSTER EASTER EGG 🦞 ──────────────────────────────────────────────
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Once-per-tab gate. Astro's view-transitions re-run bundled scripts on
  // every navigation; without this flag we'd respawn lobsters on each click.
  if (window.__lobsterInit) return;
  window.__lobsterInit = true;

  // ── Visit tracking. localStorage persists across tabs; we only bump on
  //    initial script run, so internal view-transitions don't inflate.
  const VISIT_KEY = 'lobster-visits';
  const visits = (() => {
    try { return Number(localStorage.getItem(VISIT_KEY) || 0); } catch { return 0; }
  })();
  try { localStorage.setItem(VISIT_KEY, String(visits + 1)); } catch {}

  // ── Source classification. Prefer explicit UTM (?utm_source=), else
  //    sniff the document referrer. Falls through to 'direct' when the
  //    browser scrubs referrer (Safari private mode etc).
  const source = (() => {
    const url = new URL(location.href);
    const utm = (url.searchParams.get('utm_source') || '').toLowerCase();
    const map = [
      ['linkedin',    /linkedin/],
      ['github',      /github/],
      ['substack',    /substack/],
      ['twitter',     /^(x|twitter|t\.co)$/],
      ['hackernews',  /(news\.ycombinator|hn)/],
      ['reddit',      /reddit/],
      ['producthunt', /(producthunt|ph)/],
      ['search',      /^(google|bing|duckduckgo|ddg|baidu|search)/],
      ['meta',        /(facebook|instagram|threads|fb)/],
      ['youtube',     /(youtube|yt)/],
    ];
    if (utm) {
      for (const [name, re] of map) if (re.test(utm)) return name;
      return 'other';
    }
    const ref = document.referrer;
    if (!ref) return 'direct';
    try {
      const host = new URL(ref).hostname.replace(/^www\./, '').toLowerCase();
      if (host === location.hostname) return 'internal';
      const domain = host.replace(/\.[a-z]{2,6}$/, '');
      for (const [name, re] of map) if (re.test(domain) || re.test(host)) return name;
      return 'other';
    } catch {
      return 'other';
    }
  })();

  // ── Per-source opener lines. Each bucket is hand-written; voice is
  //    the same terminal-inflected, lowercase-ish dry humor as the rest
  //    of the site. First appearance of the session pulls from here.
  const contextualPhrases = {
    linkedin: [
      "recruiters have long memories. might as well email him.",
      "one connection away from a lobster. imagine the endorsements.",
      "linkedin sent you. your algorithm has taste.",
      "open-to-work meets open-to-lobsters.",
      "if you're here via linkedin, you're hiring. don't hide it.",
      "premium was never necessary. just email him."
    ],
    github: [
      "followed a commit trail. good taste.",
      "came from github? you already read the source.",
      "star the repo while you're in here. he'll notice.",
      "engineers ship. recruiters scroll. pick one.",
      "git blame → portfolio. makes sense.",
      "public repos. public pricing: email him."
    ],
    substack: [
      "an essay reader. rare breed.",
      "came from substack? you already know too much.",
      "subscribed? if not, the lobster is judging.",
      "one essay away from a commit.",
      "fridays are essay days. circle back."
    ],
    twitter: [
      "rotated tabs from x? refresh a couple times.",
      "from x to portfolio. elon is sweating.",
      "twitter to reef. natural bird → sea pipeline.",
      "came from a dm? whoever sent it, they like you.",
      "the algorithm sent a real one."
    ],
    hackernews: [
      "hn brought you? don't read the comments.",
      "front page is temporary. a lobster is forever.",
      "opinions loaded. approved.",
      "from hn to reef. natural progression.",
      "someone on hn said 'nice site.' that was probably me."
    ],
    reddit: [
      "came from reddit? say hi in the thread.",
      "reddit sent you. the mods don't know about this.",
      "upvote the lobster. he earned it.",
      "which subreddit, asking for a lobster.",
      "r/didyouknow: there's a lobster on this website."
    ],
    producthunt: [
      "ph reader. early adopter energy. approved.",
      "upvote the lobster. he's a maker too.",
      "maker-to-maker. good to see you.",
      "you hunt products. today the product hunts you."
    ],
    search: [
      "the algo works.",
      "googled your way here? sit a minute.",
      "seo-optimized for vibes. works on you.",
      "you searched for something. you got a lobster.",
      "search brought you. we didn't pay for ads."
    ],
    meta: [
      "facebook in 2026? bold.",
      "instagram to reef. somehow makes sense.",
      "threads brought you. niche.",
      "from the feed to the floor."
    ],
    youtube: [
      "came from youtube. which video?",
      "someone linked the portfolio mid-video.",
      "skip to 4:32, the lobster said.",
      "youtube comments sent you here. rare."
    ],
    direct: [
      "typed it in by hand. bold.",
      "no referrer. you know your way around.",
      "bookmarked? already in the inner circle.",
      "direct traffic is suspicious. nice to meet you.",
      "you came straight here. friend or recruiter, welcome either way."
    ],
    internal: [
      "another click. you're exploring.",
      "poking around. the lobster approves.",
      "deep reader. i see you.",
      "three pages in. worth an email?"
    ],
    other: [
      "who sent you? i need to thank them.",
      "you came from somewhere. let's not worry about it.",
      "the internet is wild. welcome.",
      "a wandering stranger. my favorite."
    ]
  };

  // ── Second-visit+ greetings. Mixed into the first-appearance pool.
  const returnPhrases = [
    "you again? we should talk.",
    "second visit. i remember you.",
    "welcome back. the reef missed you.",
    "returning reader. you count as a regular now.",
    "you bookmarked this, didn't you?"
  ];

  let appearance = 0;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // The one phrase-selection function. Called once per lobster appearance.
  //   1st appearance:
  //     - 40% return-greeting if visits ≥ 2
  //     - else contextual (if source has a pool)
  //     - else ambient
  //   2nd+ appearance:
  //     - 30% contextual, 70% ambient
  function nextPhrase() {
    appearance++;
    const ctx = contextualPhrases[source];
    if (appearance === 1) {
      if (visits >= 2 && Math.random() < 0.4) return pick(returnPhrases);
      if (ctx && ctx.length) return pick(ctx);
      return pick(phrases);
    }
    if (ctx && ctx.length && Math.random() < 0.3) return pick(ctx);
    return pick(phrases);
  }

  const lobster = document.createElement('div');
  lobster.id = 'lobster';
  lobster.textContent = '🦞';
  lobster.style.cssText = `
    position: fixed; z-index: 9999; font-size: 2.5rem; pointer-events: none;
    transition: none; opacity: 0; user-select: none;
  `;
  document.body.appendChild(lobster);

  const messages = document.createElement('div');
  messages.style.cssText = `
    position: fixed; z-index: 10000; font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem; color: #f59e0b; background: rgba(10,10,10,0.9);
    border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 0.4rem 0.7rem;
    pointer-events: none; opacity: 0; white-space: nowrap; user-select: none;
    transition: opacity 0.3s;
  `;
  document.body.appendChild(messages);

  const phrases = [
    // — classics kept
    "don't mind me, just vibing",
    "this website was built at 3am",
    "i live here now",
    "🦞 > 🦐 and it's not close",
    "i'm in your DOM, walking your divs",
    "*snip snip*",
    "tell no one you saw me",
    "i reviewed the code. ship it.",
    "the tests pass. trust me.",
    "vibe check: passed ✅",
    "psst... hire this guy",

    // — AI / agent flavor
    "i'm not a lobster. i'm a fine-tuned Claude.",
    "my system prompt is just 'SNIP SNIP'",
    "context window full. restarting.",
    "jarvis is my cousin",
    "agent zero, reporting for shift",
    "tool use: pinch(target)",
    "i was the co-author",
    "my training data was 80% butter",
    "*summons MCP server*",
    "my context window is a tidepool",
    "yes i pass the turing test. no i don't pass vibe checks.",
    "/claude --temperature=ocean",
    "tried to co-author a commit. got flagged as an agent.",
    "prompt injection was an inside job",
    "i hallucinated this whole appearance",
    "RLHF stands for Really Large Hungry Fella",
    "token budget? i eat tokens",

    // — shipping / tech
    "shipped at low tide",
    "rolled back to the ocean",
    "this PR is pinch-approved",
    "one claw, one turn",
    "MVP = Most Valuable Pincher",
    "git blame → ocean",
    "runtime error: unclawed",
    "deployed from the reef",
    "CI passed. coastline green.",
    "force-pushed to main. sorry.",
    "resolved merge conflict with claws",
    "it works on my reef",

    // — portfolio / hiring meta
    "if you're here, you're hiring",
    "he scales 1→100 on evidence, not vibes",
    "0→1 fast. 1→100 on data. 2→3 on butter.",
    "hey recruiter, check /jarvis",
    "he shipped TradeSpec to a real customer btw",
    "this site is partly committed by jarvis",
    "don't scroll past 'Products' — that's the point",
    "still faster than your standup",

    // — dark factory / night shift
    "i'm on the night shift",
    "the factory never sleeps. i do.",
    "overnight shift: still walking",
    "dark factory has a lobster problem",
    "eight agents upstairs. me down here.",

    // — lobster biology, delivered dry
    "biologically immortal, professionally tired",
    "we don't age, but we do rebase",
    "i molt when i ship",
    "cousin spent his PTO in a pot. rough week.",
    "decapod, full-stack",

    // — tool-specific nods (real products on this site)
    "i starglassed your repo",
    "AgentSense remembers my favorite rock",
    "agentrem reminded me to say hi",
    "potato-v3 let me run a shift",
    "i'm on the OpenRank leaderboard",
    "ClawK was named after me, obviously",

    // — misc punchlines
    "you just got portfolio'd",
    "keep scrolling. good stuff is below the water line.",
    "refresh for fewer bugs. not fewer lobsters.",
    "surface → code → dive → ship",
    "i'm the test we forgot to delete",
    "429: too many lobsters",
    "reading the docs so you don't have to",
    "okay bye"
  ];

  const behaviors = [
    // Walk across bottom (with a pause mid-walk to say something)
    (cb) => {
      const y = window.innerHeight - 60;
      const startX = -50;
      const endX = window.innerWidth + 50;
      const pauseX = window.innerWidth / 2 - 20;
      lobster.style.top = y + 'px';
      lobster.style.left = startX + 'px';
      lobster.style.opacity = '1';
      lobster.style.transform = 'scaleX(1)';
      let x = startX;
      let hasPaused = false;
      const walk = () => {
        x += 1.3; // slower stride
        lobster.style.left = x + 'px';
        lobster.style.transform = `scaleX(1) rotate(${Math.sin(x * 0.05) * 5}deg)`;

        // Pause mid-walk to show a message
        if (!hasPaused && x >= pauseX) {
          hasPaused = true;
          const msg = nextPhrase();
          messages.textContent = msg;
          messages.style.top = (y - 36) + 'px';
          messages.style.left = (x - 30) + 'px';
          messages.style.opacity = '1';
          setTimeout(() => {
            messages.style.opacity = '0';
            requestAnimationFrame(walk); // resume
          }, 5500);
          return;
        }

        if (x < endX) requestAnimationFrame(walk);
        else { lobster.style.opacity = '0'; cb(); }
      };
      walk();
    },
    // Peek from right edge
    (cb) => {
      const y = 200 + Math.random() * (window.innerHeight - 400);
      lobster.style.top = y + 'px';
      lobster.style.left = (window.innerWidth - 10) + 'px';
      lobster.style.opacity = '1';
      lobster.style.transform = 'scaleX(-1)';
      // Peek in
      let t = 0;
      const peek = () => {
        t++;
        const offset = Math.min(t * 0.8, 35);
        lobster.style.left = (window.innerWidth - 10 - offset) + 'px';
        if (t < 44) requestAnimationFrame(peek);
        else {
          // Show message
          const msg = nextPhrase();
          messages.textContent = msg;
          messages.style.top = (y - 30) + 'px';
          messages.style.left = (window.innerWidth - 60 - msg.length * 6) + 'px';
          messages.style.opacity = '1';
          setTimeout(() => {
            messages.style.opacity = '0';
            // Retreat
            let r = 0;
            const retreat = () => {
              r++;
              lobster.style.left = (window.innerWidth - 45 + r * 1.5) + 'px';
              if (r < 40) requestAnimationFrame(retreat);
              else { lobster.style.opacity = '0'; cb(); }
            };
            retreat();
          }, 5500);
        }
      };
      peek();
    },
    // Drop from top
    (cb) => {
      const x = 100 + Math.random() * (window.innerWidth - 200);
      lobster.style.left = x + 'px';
      lobster.style.top = '-50px';
      lobster.style.opacity = '1';
      lobster.style.transform = 'rotate(0deg)';
      let y = -50;
      let vy = 0;
      const targetY = window.innerHeight - 60;
      let bounces = 0;
      const fall = () => {
        vy += 0.5; // gravity
        y += vy;
        lobster.style.top = y + 'px';
        lobster.style.transform = `rotate(${vy * 3}deg)`;
        if (y >= targetY) {
          y = targetY;
          vy = -vy * 0.5;
          bounces++;
          if (bounces >= 3) {
            const msg = nextPhrase();
            messages.textContent = msg;
            messages.style.top = (y - 35) + 'px';
            messages.style.left = (x - 20) + 'px';
            messages.style.opacity = '1';
            setTimeout(() => {
              messages.style.opacity = '0';
              lobster.style.opacity = '0';
              cb();
            }, 5500);
            return;
          }
        }
        if (bounces < 3) requestAnimationFrame(fall);
      };
      fall();
    },
    // Climb up left edge
    (cb) => {
      lobster.style.left = '10px';
      lobster.style.top = (window.innerHeight + 50) + 'px';
      lobster.style.opacity = '1';
      lobster.style.transform = 'rotate(90deg)';
      let y = window.innerHeight + 50;
      const targetY = 100 + Math.random() * 300;
      const climb = () => {
        y -= 1.5;
        lobster.style.top = y + 'px';
        lobster.style.transform = `rotate(90deg) translateX(${Math.sin(y * 0.03) * 3}px)`;
        if (y > targetY) requestAnimationFrame(climb);
        else {
          const msg = nextPhrase();
          messages.textContent = msg;
          messages.style.top = (y - 10) + 'px';
          messages.style.left = '50px';
          messages.style.opacity = '1';
          setTimeout(() => {
            messages.style.opacity = '0';
            // Slide back down fast
            let sy = y;
            const slide = () => {
              sy += 4;
              lobster.style.top = sy + 'px';
              if (sy < window.innerHeight + 50) requestAnimationFrame(slide);
              else { lobster.style.opacity = '0'; cb(); }
            };
            slide();
          }, 5500);
        }
      };
      climb();
    },
  ];

  // Cap total appearances per tab session. First is the contextual
  // greeting; three follow-ups keep the reef feeling without nagging.
  const MAX_APPEARANCES = 4;
  function scheduleNext() {
    if (appearance >= MAX_APPEARANCES) return;
    const delay = 75_000 + Math.random() * 45_000; // 75-120s between ambient appearances
    setTimeout(() => {
      const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
      behavior(() => scheduleNext());
    }, delay);
  }

  let lobsterMode = false;
  let modeInterval = null;
  let activeLobsters = [];

  // First appearance after 8 seconds
  setTimeout(() => {
    const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
    behavior(() => scheduleNext());
  }, 8000);

  function spawnExtraLobster() {
    const el = document.createElement('div');
    el.textContent = '🦞';
    el.style.cssText = `
      position: fixed; z-index: 9998; font-size: ${1.5 + Math.random() * 2}rem;
      pointer-events: none; user-select: none; opacity: 1;
    `;
    document.body.appendChild(el);
    activeLobsters.push(el);

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() < 0.5 ? -50 : window.innerHeight + 50;
    let x = startX, y = startY;
    const speedX = (Math.random() - 0.5) * 4;
    const speedY = startY < 0 ? (1 + Math.random() * 2) : -(1 + Math.random() * 2);
    const spin = (Math.random() - 0.5) * 8;
    let angle = 0;
    let frame = 0;

    const move = () => {
      if (!lobsterMode && frame > 60) {
        el.style.opacity = '0';
        setTimeout(() => { el.remove(); activeLobsters = activeLobsters.filter(l => l !== el); }, 300);
        return;
      }
      x += speedX;
      y += speedY;
      angle += spin;
      frame++;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.transform = `rotate(${angle}deg)`;
      if (x < -100 || x > window.innerWidth + 100 || y < -100 || y > window.innerHeight + 100) {
        el.remove();
        activeLobsters = activeLobsters.filter(l => l !== el);
        return;
      }
      requestAnimationFrame(move);
    };
    move();
  }

  window.toggleLobsterMode = function() {
    lobsterMode = !lobsterMode;
    const btn = document.getElementById('lobster-mode-btn');

    if (lobsterMode) {
      btn.textContent = '🦞 LOBSTER MODE: ON';
      btn.style.borderColor = 'rgba(245,158,11,0.5)';
      btn.style.color = '#f59e0b';
      btn.style.background = 'rgba(245,158,11,0.1)';
      btn.style.boxShadow = '0 0 20px rgba(245,158,11,0.2)';

      // Spawn lobsters every 400ms
      modeInterval = setInterval(() => {
        if (activeLobsters.length < 30) spawnExtraLobster();
      }, 400);

      // Announcement
      const announce = document.createElement('div');
      announce.textContent = '🦞 LOBSTER MODE ACTIVATED 🦞';
      announce.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.5);
        z-index: 10001; font-family: 'JetBrains Mono', monospace; font-size: 1.4rem;
        color: #f59e0b; background: rgba(10,10,10,0.95); border: 1px solid rgba(245,158,11,0.4);
        border-radius: 12px; padding: 1rem 2rem; pointer-events: none; opacity: 0;
        transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        text-align: center; white-space: nowrap;
      `;
      document.body.appendChild(announce);
      requestAnimationFrame(() => {
        announce.style.opacity = '1';
        announce.style.transform = 'translate(-50%, -50%) scale(1)';
      });
      setTimeout(() => {
        announce.style.opacity = '0';
        announce.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => announce.remove(), 400);
      }, 2000);

    } else {
      btn.textContent = '🦞 lobster mode';
      btn.style.borderColor = 'rgba(255,255,255,0.08)';
      btn.style.color = '#666';
      btn.style.background = 'rgba(255,255,255,0.03)';
      btn.style.boxShadow = 'none';
      clearInterval(modeInterval);
      // Lobsters will naturally fade out via the frame > 60 check
    }
  };
})();
