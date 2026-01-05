"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For side projects",
    features: [
      "Up to 100 monthly users",
      "Unlimited feature requests",
      "Basic voting",
      "Email notifications",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For growing apps",
    features: [
      "Up to 10,000 monthly users",
      "Everything in Free",
      "Custom branding",
      "Priority support",
      "Analytics dashboard",
      "Roadmap page",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    description: "For teams",
    features: [
      "Unlimited monthly users",
      "Everything in Pro",
      "Multiple team members",
      "API access",
      "Webhooks",
      "Dedicated support",
    ],
    cta: "Contact us",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-[13px] font-medium mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
            Simple pricing
          </h2>
          <p className="text-muted">Start free. Upgrade when you need to.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-xl p-6 ${
                plan.highlighted
                  ? "bg-foreground text-background"
                  : "bg-background border border-border"
              }`}
            >
              <div className="mb-6">
                <h3 className="text-[14px] font-medium mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-medium">{plan.price}</span>
                  {plan.period && (
                    <span className={plan.highlighted ? "text-background/60" : "text-muted"}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-[13px] mt-1 ${plan.highlighted ? "text-background/60" : "text-muted"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[13px]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={plan.highlighted ? "text-background/60" : "text-muted"}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className={plan.highlighted ? "text-background/90" : ""}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2.5 px-4 rounded-md text-[13px] font-medium transition-all ${
                  plan.highlighted
                    ? "bg-background text-foreground hover:opacity-90"
                    : "bg-foreground text-background hover:opacity-80"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
