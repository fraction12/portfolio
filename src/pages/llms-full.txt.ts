import type { APIRoute } from 'astro';
import biography from '../data/llms.txt?raw';
import { buildDiscoveryText } from '../lib/discovery';

export const prerender = true;

export const GET: APIRoute = () => new Response(buildDiscoveryText(biography, 'full'), {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
