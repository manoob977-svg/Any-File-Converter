"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Is Engineering Hub free to use?",
    answer: "Yes! Our core tools like PDF to Excel, Merge PDF, and Unit Converters are currently free for all users. We also offer a Pro tier for unlimited batch processing and priority cloud compute."
  },
  {
    question: "How secure are my uploaded files?",
    answer: "Security is our top priority. All files are transmitted via HTTPS encryption and are automatically deleted from our servers immediately after conversion or within 1 hour of inactivity."
  },
  {
    question: "Do I need to install any software?",
    answer: "No. Engineering Hub is a 100% web-based terminal. You can access all tools directly from your browser on Windows, Mac, Linux, or mobile devices."
  },
  {
    question: "What is the 2030 Precision Suite?",
    answer: "The 2030 Precision Suite is the elite tier of document intelligence and engineering tools within the Engineering Hub ecosystem, designed for high-stakes professional workflows."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-6 justify-center">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Knowledge Base</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-center mb-16 underline decoration-indigo-500/50 underline-offset-8">
          Frequent <span className="text-gradient">Queries.</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="glass-card !p-0 overflow-hidden border-white/5 hover:border-white/10 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold tracking-tight group-hover:text-indigo-400 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-500 ${openIndex === i ? "rotate-180 text-indigo-400" : ""}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-gray-400 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
