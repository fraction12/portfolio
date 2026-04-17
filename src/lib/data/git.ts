import { execFileSync } from 'node:child_process';
import type { CommitRecord } from './shifts';
import { isAgentAuthor, AGENT_DISPLAY_NAME, AGENT_DISPLAY_EMAIL } from '../../config/agents';

const LOG_FORMAT = '---COMMIT---%nsha:%H%nts:%ct%nauthor:%an%nemail:%ae%nsubject:%s%n---BODY---%n%b%n---ENDBODY---';

export function parseGitLogOutput(raw: string): CommitRecord[] {
  const blocks = raw.split('---COMMIT---').map(b => b.trim()).filter(Boolean);
  const commits: CommitRecord[] = [];

  for (const block of blocks) {
    // Split body out first so line-based header parsing doesn't collide with body content
    const bodyStart = block.indexOf('---BODY---');
    const bodyEnd = block.indexOf('---ENDBODY---');
    let body = '';
    let beforeBody = block;
    let afterBody = '';
    if (bodyStart !== -1 && bodyEnd !== -1 && bodyEnd > bodyStart) {
      beforeBody = block.slice(0, bodyStart).trim();
      body = block.slice(bodyStart + '---BODY---'.length, bodyEnd).trim();
      afterBody = block.slice(bodyEnd + '---ENDBODY---'.length).trim();
    }

    const lines = beforeBody.split('\n');
    const map: Record<string, string> = {};
    for (const line of lines) {
      const colon = line.indexOf(':');
      if (colon > 0) {
        map[line.slice(0, colon)] = line.slice(colon + 1);
      }
    }

    // Stat line is in the "afterBody" region OR may be in any line that matches the files-changed regex
    // (back-compat for tests that include `stat:` prefix in the block)
    const statCandidates = [afterBody, beforeBody].flatMap(s => s.split('\n'));
    let stat: string | null = null;
    for (const line of statCandidates) {
      const stripped = line.replace(/^stat:\s*/, '').trim();
      if (/(\d+)\s+files?\s+changed/.test(stripped)) {
        stat = stripped;
        break;
      }
    }

    if (!map.sha || !map.ts) continue;

    // Parse Co-Authored-By trailers from body (case-insensitive header, name+email payload)
    const coAuthors: string[] = [];
    if (body) {
      const trailerRe = /^\s*Co-?Authored-?By\s*:\s*(.+?)\s*$/gim;
      let m: RegExpExecArray | null;
      while ((m = trailerRe.exec(body)) !== null) {
        coAuthors.push(m[1].trim());
      }
    }

    const author = map.author ?? '';
    const authorEmail = map.email ?? '';
    const primaryKey = `${author} <${authorEmail}>`;
    const agentInCo = coAuthors.some(c => isAgentAuthor(c));
    const agentInPrimary = isAgentAuthor(primaryKey);
    const isAgentAuthored = agentInCo || agentInPrimary;

    const { additions, deletions, filesChanged } = parseStat(stat);
    commits.push({
      sha: map.sha,
      timestamp: new Date(parseInt(map.ts, 10) * 1000),
      author,
      authorEmail,
      subject: map.subject ?? '',
      body,
      coAuthors,
      isAgentAuthored,
      filesChanged,
      additions,
      deletions
    });
  }
  return commits;
}

function parseStat(stat: string | null): { additions: number; deletions: number; filesChanged: number } {
  if (!stat) return { additions: 0, deletions: 0, filesChanged: 0 };
  const files = /(\d+)\s+files?\s+changed/.exec(stat);
  const ins = /(\d+)\s+insertions?\(\+\)/.exec(stat);
  const del = /(\d+)\s+deletions?\(-\)/.exec(stat);
  return {
    additions: ins ? parseInt(ins[1], 10) : 0,
    deletions: del ? parseInt(del[1], 10) : 0,
    filesChanged: files ? parseInt(files[1], 10) : 0
  };
}

function runGitArgs(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
}

export function getCommitHistory(sinceDays = 180): CommitRecord[] {
  const raw = runGitArgs([
    'log',
    `--since=${sinceDays} days ago`,
    '--shortstat',
    `--pretty=format:${LOG_FORMAT}`
  ]);
  return parseGitLogOutput(raw);
}

export function getLastCommit(): CommitRecord {
  const raw = runGitArgs([
    'log',
    '-1',
    '--shortstat',
    `--pretty=format:${LOG_FORMAT}`
  ]);
  const commits = parseGitLogOutput(raw);
  if (commits.length === 0) throw new Error('no commits found in this repo');
  return commits[0];
}

export function formatRelativeTime(from: Date, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - from.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Show the display name for a commit's author in the UI. */
export function displayAuthor(commit: CommitRecord): string {
  // If an agent co-authored or primary-authored the commit, show the Jarvis persona.
  if (commit.isAgentAuthored) {
    return `${AGENT_DISPLAY_NAME} <${AGENT_DISPLAY_EMAIL}>`;
  }
  const email = commit.authorEmail ? ` <${commit.authorEmail}>` : '';
  return `${commit.author}${email}`;
}
