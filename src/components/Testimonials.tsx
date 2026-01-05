"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "We used to build features based on gut feeling. Now we have real data on what users actually want.",
    name: "Alex Rivera",
    role: "Founder, Habitual",
  },
  {
    quote:
      "Our users love being heard. Retention improved significantly since we started using the feedback board.",
    name: "Priya Sharma",
    role: "Product Lead, Flowstate",
  },
  {
    quote:
      "The notification system is brilliant. Users get excited when they see their requested feature ship.",
    name: "Marcus Chen",
    role: "CTO, Routinely",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-accent text-[13px] font-medium mb-3">What people say</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
            Teams building better products
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-border rounded-xl p-6"
            >
              <p className="text-[15px] leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-[13px] font-medium">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-[14px] font-medium">{testimonial.name}</p>
                  <p className="text-[12px] text-muted">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
