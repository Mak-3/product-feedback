"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-surface">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
            Start listening to your users
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Set up in 5 minutes. Free to start. See what your users actually want.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              className="bg-foreground text-background px-6 py-3 rounded-md text-[14px] font-medium hover:opacity-80 transition-opacity"
            >
              Get started free
            </a>
            <a
              href="#"
              className="text-foreground px-6 py-3 rounded-md text-[14px] font-medium border border-border hover:bg-background transition-colors"
            >
              Read the docs
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
