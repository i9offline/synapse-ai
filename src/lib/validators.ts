import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(10000),
  conversationId: z.string().optional(),
  model: z.enum(["gpt-4o", "claude-sonnet-4-5-20250929"]).default("gpt-4o"),
});

export const createConversationSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  model: z.enum(["gpt-4o", "claude-sonnet-4-5-20250929"]).default("gpt-4o"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
