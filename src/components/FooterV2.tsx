import Link from "next/link";
import { FileText, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function FooterV2() {
  const sections = [
    {
      title: "PDF Suite",
      links: [
        { name: "PDF to Excel", href: "/tool/pdf-to-excel" },
        { name: "PDF to Word", href: "/tool/pdf-to-word" },
        { name: "Merge PDF", href: "/tool/merge-pdf" },
        { name: "Compress PDF", href: "/tool/compress-pdf" }
      ]
    },
    {
      title: "Engineering",
      links: [
        { name: "Unit Converter", href: "/tool/unit-converter" },
        { name: "Material Calculator", href: "/tool/material-calculator" },
        { name: "CAD to PDF", href: "/tool/cad-to-pdf" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Settings", href: "/cookies" }
      ]
    }
  ];

  const socialLinks = [
    { Icon: Twitter, href: "https://twitter.com" },
    { Icon: Linkedin, href: "https://linkedin.com" },
    { Icon: Github, href: "https://github.com" },
    { Icon: Mail, href: "mailto:support@engineeringhub.com" }
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="flex items-center gap-2 group mb-8">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900">Engineering Hub</span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed font-medium">
              High-precision document intelligence and engineering calculation terminal. Built for the elite engineering workflow.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-white rounded-xl border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="col-span-2 md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            {sections.map((section, i) => (
              <div key={i}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
           <p>© {new Date().getFullYear()} Engineering Hub Global. All rights reserved.</p>
           <div className="flex items-center gap-8">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                Connectivity Stable
              </span>
              <span>Made with Precision</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
