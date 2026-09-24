"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
          Privacy <span className="text-[#F38020]">Policy.</span>
        </h1>
        
        <p className="text-muted-foreground mb-12">Last Updated: June 24, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to the portfolio and professional services website of Anber Aziz ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at <a href="mailto:io@anber.me" className="text-[#F38020] hover:underline">io@anber.me</a>.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              When you visit our website (https://anber.me) and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">2. Information We Collect</h2>
            <h3 className="text-xl font-bold mb-2 text-foreground/90">Personal information you disclose to us</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website, or otherwise when you contact us.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Name and Contact Data:</strong> We collect your first and last name, email address, and other similar contact data through our contact forms.</li>
              <li><strong>Message Content:</strong> We collect the subject and body of the messages you send us regarding freelance inquiries or collaborations.</li>
            </ul>
            <h3 className="text-xl font-bold mb-2 text-foreground/90">Information automatically collected</h3>
            <p className="text-muted-foreground leading-relaxed">
              We automatically collect certain information when you visit, use, or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website, and other technical information. This information is primarily needed to maintain the security and operation of our Website, and for our internal analytics and reporting purposes.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use personal information collected via our Website for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li><strong>To respond to user inquiries/offer support to users:</strong> We may use your information to respond to your inquiries and solve any potential issues you might have with the use of our Services.</li>
              <li><strong>To send administrative information to you:</strong> We may use your personal information to send you product, service, and new feature information and/or information about changes to our terms, conditions, and policies.</li>
              <li><strong>To protect our Services:</strong> We may use your information as part of our efforts to keep our Website safe and secure (for example, for fraud monitoring and prevention).</li>
            </ul>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">4. Will Your Information Be Shared With Anyone?</h2>
            <p className="text-muted-foreground leading-relaxed">
              We only share and disclose your information in the following situations:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li><strong>Compliance with Laws:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
              <li><strong>Vital Interests and Legal Rights:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
              <li><strong>Vendors, Consultants, and Other Third-Party Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., email service providers like Resend).</li>
            </ul>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">5. How Long Do We Keep Your Information?</h2>
            <p className="text-muted-foreground leading-relaxed">
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information.
            </p>
          </section>

          <section className="p-6 md:p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">6. Do California Residents Have Specific Privacy Rights?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information under the California Consumer Privacy Act (CCPA). You have the right to request access to your personal information, request that your personal information be deleted, and request that your personal information not be sold. We do not sell your personal information. To exercise your rights, please contact us at <a href="mailto:io@anber.me" className="text-[#F38020] hover:underline">io@anber.me</a>.
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
