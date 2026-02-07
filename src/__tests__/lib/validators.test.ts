import { describe, it, expect } from "vitest";
import {
  signUpSchema,
  signInSchema,
  chatMessageSchema,
  createConversationSchema,
} from "@/lib/validators";

describe("signUpSchema", () => {
  it("validates a correct sign up input", () => {
    const result = signUpSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short name", () => {
    const result = signUpSchema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signUpSchema.safeParse({
      name: "John Doe",
      email: "not-an-email",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password without uppercase", () => {
    const result = signUpSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password without a number", () => {
    const result = signUpSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signUpSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Pass1",
    });
    expect(result.success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("validates a correct sign in input", () => {
    const result = signInSchema.safeParse({
      email: "john@example.com",
      password: "any-password",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty password", () => {
    const result = signInSchema.safeParse({
      email: "john@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("chatMessageSchema", () => {
  it("validates a correct chat message", () => {
    const result = chatMessageSchema.safeParse({
      message: "Hello, how are you?",
      model: "gpt-4o",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty message", () => {
    const result = chatMessageSchema.safeParse({
      message: "",
      model: "gpt-4o",
    });
    expect(result.success).toBe(false);
  });

  it("defaults to gpt-4o model", () => {
    const result = chatMessageSchema.safeParse({
      message: "Hello",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.model).toBe("gpt-4o");
    }
  });

  it("accepts optional conversationId", () => {
    const result = chatMessageSchema.safeParse({
      message: "Hello",
      conversationId: "some-id",
      model: "gpt-4o",
    });
    expect(result.success).toBe(true);
  });
});

describe("createConversationSchema", () => {
  it("validates with defaults", () => {
    const result = createConversationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.model).toBe("gpt-4o");
    }
  });

  it("accepts custom title and model", () => {
    const result = createConversationSchema.safeParse({
      title: "My Chat",
      model: "claude-sonnet-4-5-20250929",
    });
    expect(result.success).toBe(true);
  });
});
