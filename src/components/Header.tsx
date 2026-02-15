"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm"
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 4L14.5 9.5L20 12L14.5 14.5L12 20L9.5 14.5L4 12L9.5 9.5L12 4Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="font-medium text-[15px]">prodFeedback</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-muted hover:text-foreground transition-colors text-[13px]"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-muted hover:text-foreground transition-colors text-[13px]"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="text-muted hover:text-foreground transition-colors text-[13px]"
          >
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[13px] text-muted hover:text-foreground transition-colors hidden sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-[13px] bg-foreground text-background px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
