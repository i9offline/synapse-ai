"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { signInSchema } from "@/lib/validators";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.email({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid credentials");
      } else {
        router.push("/chat");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#fafbfc]">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <Logo size={44} className="mb-3" />
            <span className="text-xl font-bold text-gray-900 font-[family-name:var(--font-sora)] tracking-tight">SynapseAI</span>
          </div>

          {/* Card */}
          <div className="liquid-glass rounded-2xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-gray-500">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 rounded-xl h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-medium text-gray-500">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400/20 rounded-xl h-11"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-200"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full h-11 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-gray-900 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
