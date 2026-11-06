import { z } from 'zod'

export const promptSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title.').max(200, 'Use 200 characters or fewer.'),
  description: z.string().trim().max(500, 'Use 500 characters or fewer.'),
  content: z
    .string()
    .max(100000, 'Prompts can be up to 100,000 characters.')
    .refine((v) => v.trim().length > 0, 'Enter the prompt content.'),
})
