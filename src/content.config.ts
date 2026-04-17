import { defineCollection, z } from 'astro:content';

const jarvis = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    dispatchNumber: z.number().optional(),
    shiftDuration: z.string().optional(),
    diff: z.string().optional(),
    nextRun: z.string().optional(),
  }),
});

export const collections = { jarvis };
