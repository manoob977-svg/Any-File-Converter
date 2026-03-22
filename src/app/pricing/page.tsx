"use client";

import Navbar from "@/components/Navbar";
import { Check, Zap, Shield, Sparkles } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for occasional conversions.",
      features: ["Up to 5MB per file", "2 files per day", "Standard processing", "Community support"],
      btn: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$12",
      desc: "Best for professionals and freelancers.",
      features: ["Up to 100MB per file", "Unlimited files", "Priority AI processing", "Email support", "Batch processing"],
      btn: "Upgrade Now",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For large teams and corporations.",
      features: ["Unlimited file size", "API access", "SSO Authentication", "Dedicated account manager", "Custom SLA"],
      btn: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-400">Choose the plan that fits your needs. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`glass-card p-8 flex flex-col relative ${plan.popular ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-white/10'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" /> MOST POPULAR
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-500">/mo</span>}
                </div>
                <p className="text-sm text-gray-400">{plan.desc}</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'btn-primary' : 'bg-white/10 hover:bg-white/20'}`}>
                {plan.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
