"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { NormalizedApiError } from "@/types/api";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

  // Double-submit protection flag ref
  const inFlightRef = useRef(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const redirectUrl = searchParams.get("redirect") || "/products";
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard against rapid double clicks using ref & state
    if (inFlightRef.current || isSubmitting) return;

    if (!validate()) return;

    inFlightRef.current = true;
    setIsSubmitting(true);
    setErrors({});

    try {
      await login({ username: username.trim(), password: password.trim() });
      const redirectUrl = searchParams.get("redirect") || "/products";
      router.push(redirectUrl);
    } catch (err) {
      const apiErr = err as NormalizedApiError;
      setErrors({
        general: apiErr.message || "Invalid username or password. Please try again.",
      });
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setErrors({});
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Atmospheric Luxury Brand Panel */}
      <div className="relative md:w-1/2 min-h-[300px] md:min-h-screen bg-gradient-to-br from-[#16161A] via-[#0E0E10] to-[#1C1C21] p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-luxury-border/60">
        {/* Subtle Background Pattern & Gold Light Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,169,97,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 border border-luxury-gold/40 flex items-center justify-center shadow-gold">
            <Sparkles className="w-5 h-5 text-luxury-gold" />
          </div>
          <div>
            <h1 className="font-serif text-2xl tracking-wider text-luxury-text uppercase">AUREUS</h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-medium">
              HAUTE HORLOGERIE & ATELIER
            </p>
          </div>
        </div>

        {/* Tagline Content */}
        <div className="relative z-10 my-12 md:my-auto max-w-md">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-semibold block mb-3">
            PORTAL ACCESS
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-luxury-text leading-tight mb-4">
            Curated Executive Back-Office
          </h2>
          <p className="text-luxury-subtext text-sm md:text-base leading-relaxed font-light">
            Welcome to the Aureus inventory management dashboard. Engineered for precision cataloging, real-time inventory control, and quiet luxury excellence.
          </p>
        </div>

        {/* Brand Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-luxury-muted">
          <span>&copy; {new Date().getFullYear()} AUREUS ATELIER</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" /> ENCRYPTED SESSION
          </span>
        </div>
      </div>

      {/* Right Side: Minimal Centered Form Card */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-luxury-bg">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-luxury-text font-normal">Sign In</h3>
            <p className="text-luxury-subtext text-xs md:text-sm mt-1">
              Enter your credentials to access the product catalog dashboard.
            </p>
          </div>

          {/* Demo Credentials Hint Banner */}
          <div className="p-4 rounded-xl bg-luxury-surface border border-luxury-gold/30 flex items-center justify-between gap-3 shadow-sm">
            <div className="text-xs space-y-0.5">
              <span className="text-luxury-gold font-semibold uppercase tracking-wider block text-[10px]">
                DEMO CREDENTIALS
              </span>
              <p className="text-luxury-text font-mono text-xs">
                User: <span className="text-luxury-gold font-bold">emilys</span> | Pass:{" "}
                <span className="text-luxury-gold font-bold">emilyspass</span>
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-luxury-gold underline hover:text-luxury-goldHover font-medium shrink-0 transition-colors"
            >
              Auto-fill
            </button>
          </div>

          {/* General API Error Alert */}
          {errors.general && (
            <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              type="text"
              placeholder="e.g. emilys"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              autoComplete="username"
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-luxury-subtext hover:text-luxury-text transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
