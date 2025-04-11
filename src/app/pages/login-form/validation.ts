import { z } from 'zod';

export const emailSchema = z.string().email()
export const passwordSchema = z.string()
  .min(8, {
    message: 'Password must be at least 8 characters'
  })
  .max(255, {
    message: 'Password cannot exceed 255 characters'
  })

export type Email = z.infer<typeof emailSchema>

export type Password = z.infer<typeof passwordSchema>
