import { z } from 'zod'

const email = z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.')
const password = z.string().min(8, 'Use at least 8 characters.').max(72, 'Use 72 characters or fewer.')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.'),
})

export const registerSchema = z.object({
  displayName: z.string().trim().min(1, 'Enter a display name.').max(80, 'Use 80 characters or fewer.'),
  email,
  password,
})

export const forgotSchema = z.object({ email })

export const resetSchema = z
  .object({ password, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords don’t match.' })
