"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-transparent text-foreground relative pt-24 md:pt-32 pb-24 overflow-hidden">
      <div 
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 transition-all duration-1000 ease-out"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#F38020] shadow-[0_0_10px_rgba(243,128,32,0.9)] animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-[#F38020] uppercase tracking-[0.18em]">
            Legal Document
          </span>
          <div className="flex-1 max-w-[200px] h-[1px] bg-gradient-to-r from-[#F38020]/50 to-transparent" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-6">
          Terms & <span className="text-[#F38020]">Conditions.</span>
        </h1>
        
        <p className="text-muted-foreground mb-12">Last Updated: June 24, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Anber Aziz ("Company", "we", "us", or "our"), concerning your access to and use of the https://anber.me website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Use. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">2. Intellectual Property Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United States, foreign jurisdictions, and international conventions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">3. User Representations</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use; (4) you are not a minor in the jurisdiction in which you reside; (5) you will not access the Site through automated or non-human means, whether through a bot, script, or otherwise, except for standard search engine indexing or AI agent indexing in compliance with our robots.txt and agents.txt files; (6) you will not use the Site for any illegal or unauthorized purpose; and (7) your use of the Site will not violate any applicable law or regulation.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">4. Professional Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you engage Anber Aziz for freelance or professional engineering services via the Contact form or Service booking module, additional specific service contracts, Statements of Work (SOW), and Non-Disclosure Agreements (NDA) will be provided and will supersede these general website Terms of Use regarding the delivery of those specific professional services.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">5. Modifications and Interruptions</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">6. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and defined following the laws of Pakistan. Anber Aziz and yourself irrevocably consent that the courts of Lahore, Pakistan shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms. For clients operating in the United States, we remain compliant with necessary cross-border service regulations, but any primary disputes regarding website usage fall under our home jurisdiction.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">7. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:io@anber.me" className="text-[#F38020] hover:underline">io@anber.me</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center justify-center h-12 px-6 rounded border border-border text-foreground hover:border-[#F38020] hover:text-[#F38020] transition-colors font-mono text-sm tracking-wider uppercase">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
