import { defineCollection, z } from 'astro:content';

const jarvis = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { jarvis };
