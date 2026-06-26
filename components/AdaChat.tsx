'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import jsPDF from 'jspdf';

type Message = { role: 'user' | 'ada'; text: string; timestamp?: Date };

export default function AdaChat() {
    const [open, setOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hidden = localStorage.getItem('ada-hidden');
            if (hidden === 'true') setIsHidden(true);
        }
    }, []);

    function handleHideAda() {
        setIsHidden(true);
        setOpen(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ada-hidden', 'true');
        }
    }

    function handleRestoreAda() {
        setIsHidden(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ada-hidden');
        }
    }

    // User Info State
    const [userInfo, setUserInfo] = useState<{ name: string, email: string } | null>(null);
    const [nameInput, setNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    // Chat State
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const hasSentTranscript = useRef(false);

    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Security State
    const adversarialCount = useRef(0);
    const [isBlocked, setIsBlocked] = useState(false);

    // Booking State
    const [bookingMode, setBookingMode] = useState(false);
    const [bookingStep, setBookingStep] = useState<number>(0);
    const [bookingData, setBookingData] = useState({ name: '', email: '', agenda: '' });

    useEffect(() => {
        if (open && userInfo) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open, userInfo]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowDownloadMenu(false);
            }
        }
        if (showDownloadMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showDownloadMenu]);

    function handleStartChat() {
        let valid = true;
        setNameError('');
        setEmailError('');

        const n = nameInput.trim();
        const e = emailInput.trim();

        if (n.length < 2 || n.length > 60) {
            setNameError('Name must be between 2 and 60 characters.');
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(e)) {
            setEmailError('Please enter a valid email address.');
            valid = false;
        }

        if (!valid) return;

        setFormLoading(true);
        setTimeout(() => {
            setUserInfo({ name: n, email: e });
            setMessages([
                { role: 'ada', text: `Hi ${n}! I'm Ada, Anber's AI assistant. How can I help you today?`, timestamp: new Date() }
            ]);
            setFormLoading(false);
        }, 300); // Slight delay for realistic loading feedback
    }

    async function closeWidget() {
        setOpen(false);
        if (messages.length >= 2 && !hasSentTranscript.current && userInfo) {
            hasSentTranscript.current = true;
            try {
                await fetch('/api/send-transcript', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        visitorName: userInfo.name,
                        visitorEmail: userInfo.email,
                        messages: messages.map(m => ({
                            role: m.role,
                            content: m.text,
                            timestamp: m.timestamp?.toISOString() || new Date().toISOString(),
                        })),
                        chatDate: new Date().toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        }),
                    }),
                });
            } catch (err) {
                console.error('Transcript send failed:', err);
            }
        }
    }

    async function startBookingFlow() {
        setBookingMode(true);
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        setLoading(false);
        
        let initialStep = 0;
        const currentData = { name: '', email: '', agenda: '' };
        
        if (userInfo?.name) {
            currentData.name = userInfo.name;
            if (userInfo?.email) {
                currentData.email = userInfo.email;
                initialStep = 2;
            } else {
                initialStep = 1;
            }
        }
        
        setBookingData(currentData);
        setBookingStep(initialStep);
        
        if (initialStep === 2) {
            setMessages(prev => [...prev, { role: 'ada', text: "Sure! Let me set up your meeting. I see we already have your contact details. Briefly, what's the agenda or topic you'd like to discuss with Anber?", timestamp: new Date() }]);
        } else if (initialStep === 1) {
            setMessages(prev => [...prev, { role: 'ada', text: "Great! And your email address?", timestamp: new Date() }]);
        } else {
            setMessages(prev => [...prev, { role: 'ada', text: "Sure! Let me get a few details to set up your meeting with Anber. What's your full name?", timestamp: new Date() }]);
        }
    }

    async function handleBookingStep(userMsg: string) {
        setLoading(true);
        await new Promise(r => setTimeout(r, 500));
        setLoading(false);

        if (bookingStep === 0) {
            setBookingData(prev => ({ ...prev, name: userMsg }));
            setBookingStep(1);
            setMessages(prev => [...prev, { role: 'ada', text: "Great! And your email address?", timestamp: new Date() }]);
        } else if (bookingStep === 1) {
            setBookingData(prev => ({ ...prev, email: userMsg }));
            setBookingStep(2);
            setMessages(prev => [...prev, { role: 'ada', text: "Perfect. Briefly, what's the agenda or topic you'd like to discuss with Anber?", timestamp: new Date() }]);
        } else if (bookingStep === 2) {
            const finalData = { ...bookingData, agenda: userMsg };
            setBookingData(finalData);
            
            const confirmationText = `Perfect, ${finalData.name}! Here's your meeting request summary:\n\n👤 Name: ${finalData.name}\n📧 Email: ${finalData.email}  \n📋 Agenda: ${finalData.agenda}\n\nI've sent this to Anber and she'll reach out to you at ${finalData.email} within 24 hours to confirm a time. Is there anything else I can help you with?`;
            
            setMessages(prev => [...prev, { role: 'ada', text: confirmationText, timestamp: new Date() }]);
            setBookingMode(false);
            
            try {
                await fetch('/api/send-appointment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: finalData.name,
                        email: finalData.email,
                        agenda: finalData.agenda,
                        submittedAt: new Date().toLocaleString()
                    })
                });
            } catch (e) {
                console.error("Booking API error:", e);
            }
        }
    }

    function downloadMarkdown() {
        try {
            const dateStr = new Date().toISOString().split('T')[0];
            const timeStr = new Date().toLocaleString();
            let md = `# Chat with Ada — ${timeStr}\n\n`;

            messages.forEach(m => {
                const roleName = m.role === 'user' ? 'You' : 'Ada';
                md += `**${roleName}:** ${m.text}\n\n`;
            });

            md += `---\n*Exported from anber.me*`;

            const blob = new Blob([md], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ada-chat-${dateStr}.md`;
            a.click();
            URL.revokeObjectURL(url);
            setShowDownloadMenu(false);
        } catch (err) {
            setErrorMsg('Failed to download Markdown.');
            setTimeout(() => setErrorMsg(null), 3000);
        }
    }

    function downloadPDF() {
        try {
            const doc = new jsPDF();
            const dateStr = new Date().toISOString().split('T')[0];
            const timeStr = new Date().toLocaleString();

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const maxWidth = pageWidth - (margin * 2);
            let y = margin;

            const addFooter = () => {
                doc.setFontSize(8);
                doc.setTextColor('#999999');
                doc.text("Exported from anber.me", pageWidth / 2, pageHeight - 10, { align: 'center' });
            };

            // Header
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.setTextColor('#F6821F');
            doc.text("Chat with Ada", margin, y);
            y += 8;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor('#888888');
            doc.text("anber.me", margin, y);
            y += 5;

            doc.setFontSize(9);
            doc.text(timeStr, margin, y);
            y += 8;

            doc.setDrawColor(200, 200, 200);
            doc.line(margin, y, pageWidth - margin, y);
            y += 10;

            // Messages
            messages.forEach(m => {
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");
                if (m.role === 'user') {
                    doc.setTextColor('#333333');
                    doc.text("You:", margin, y);
                } else {
                    doc.setTextColor('#F6821F');
                    doc.text("Ada:", margin, y);
                }
                y += 5;

                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(m.role === 'user' ? '#333333' : '#444444');
                const lines = doc.splitTextToSize(m.text, maxWidth);

                if (y + (lines.length * 5) > pageHeight - 20) {
                    addFooter();
                    doc.addPage();
                    y = margin + 5;
                }

                doc.text(lines, margin, y);
                y += lines.length * 5;

                if (m.timestamp) {
                    doc.setFontSize(8);
                    doc.setTextColor('#999999');
                    const tsText = m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    doc.text(tsText, margin, y);
                    y += 4;
                }

                y += 6;

                if (y > pageHeight - 20) {
                    addFooter();
                    doc.addPage();
                    y = margin + 5;
                }
            });

            addFooter();
            doc.save(`ada-chat-${dateStr}.pdf`);
            setShowDownloadMenu(false);
        } catch (err) {
            setErrorMsg('PDF export failed. Please try Markdown instead.');
            setTimeout(() => setErrorMsg(null), 3000);
        }
    }

    async function sendMessage() {
        if (!input.trim() || loading || isBlocked) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date() }]);

        if (bookingMode) {
            handleBookingStep(userMsg);
            return;
        }

        const bookingKeywords = [
          // book variants
          'book', 'booking',
          // arrange variants
          'arrange', 'arranging',
          // schedule variants
          'schedule', 'scheduling',
          // meeting variants
          'meeting', 'meet with', 'meet her', 'meet anber',
          // appointment variants
          'appointment',
          // call variants
          'set up a call', 'hop on a call', 'get on a call',
          // consultation variants
          'consultation', 'consult',
          // yes responses to Ada's booking offer
          'yes please', 'yes book', 'yes arrange', 'yes schedule',
          'yes, book', 'yes, arrange', 'yes, schedule',
          'yes, please',
          'sure', 'go ahead', 'sounds good', 'let\'s do it',
          'do it', 'okay', 'ok',
          // direct intent
          'i want to meet', 'i want to talk', 'i want to connect',
          'want to discuss', 'want to chat with',
          'can you book', 'can you arrange', 'can you schedule',
          'help me book', 'help me arrange', 'help me schedule',
          'directly here',
        ];

        const userLower = userMsg.toLowerCase().trim();
        const lastAdaMessage = messages.filter(m => m.role === 'ada').slice(-1)[0]?.text ?? '';
        const adaOfferedBooking = [
          'book a meeting', 'arrange a meeting', 'book directly here',
          'would you like me to help you book', 'shall i help you book',
          'book a consultation', 'schedule a meeting'
        ].some(phrase => lastAdaMessage.toLowerCase().includes(phrase));

        const isShortAffirmative = ['ok', 'okay', 'sure', 'yes', 'yeah', 'yep', 'sounds good', 'go ahead', 'do it'].includes(userLower);

        const triggersBooking = bookingKeywords.some(k => userLower.includes(k)) &&
          (!isShortAffirmative || adaOfferedBooking);

        if (triggersBooking) {
            startBookingFlow();
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
            });
            const data = await res.json();
            const reply = data.reply;

            const adaTriggerPhrase = 'would you like me to help you book a meeting with anber directly here';
            if (reply.toLowerCase().includes(adaTriggerPhrase) && !bookingMode) {
              // Do NOT auto-start booking — just make sure next user affirmative triggers it
              // The adaOfferedBooking check in Fix 1 will handle this correctly
            }

            const refusalPhrases = [
              "I can only answer questions about Anber",
              "I'm not able to share internal details",
              "I must politely decline",
              "I must politely refuse",
            ];

            const isRefusal = refusalPhrases.some(phrase => reply.includes(phrase));
            if (isRefusal) {
              adversarialCount.current += 1;
            }

            if (adversarialCount.current >= 5) {
              setIsBlocked(true);
              setMessages(prev => [...prev, { role: 'ada', text: "This session has been flagged for unusual activity. Please reach out to Anber directly at io@anber.me if you have a genuine inquiry.", timestamp: new Date() }]);
            } else {
              setMessages(prev => [...prev, { role: 'ada', text: reply, timestamp: new Date() }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: 'ada', text: 'Something went wrong. Please try again.', timestamp: new Date() }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <style>{`
                @keyframes fadeInChat { 
                    from { opacity: 0; } 
                    to { opacity: 1; } 
                }
                .animate-fade-in-chat { 
                    animation: fadeInChat 150ms ease-in-out forwards; 
                }
            `}</style>

            {/* Mascot Launcher and Hide Pill */}
            {!isHidden && (
                <div className="fixed bottom-[24px] right-[20px] z-[50] flex flex-col items-center gap-[6px]">
                    <button
                        onClick={handleHideAda}
                        className="w-[64px] h-[22px] bg-[#111111] text-white text-[10px] font-medium rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.25)] hover:opacity-80 transition-opacity"
                        aria-label="Hide Ada"
                    >
                        Hide Ada
                    </button>
                    <button
                        onClick={() => setOpen(!open)}
                        className="bg-transparent border-none p-0 outline-none transition-opacity cursor-pointer flex items-center justify-center"
                        aria-label="Toggle Chat"
                    >
                        <Image src="/ada-mascot.svg" alt="Ada Mascot" width={160} height={160} className="w-[100px] sm:w-[160px] h-auto block" loading="lazy" />
                    </button>
                </div>
            )}

            {/* Restore Button */}
            {isHidden && (
                <button
                    onClick={handleRestoreAda}
                    title="Chat with Ada"
                    className="fixed bottom-[16px] right-[16px] z-[40] w-[36px] h-[36px] bg-[#F6821F] rounded-lg flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                    aria-label="Restore Ada"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            )}

            {/* Chat window */}
            <div 
                className={`fixed z-[60] flex flex-col bg-background shadow-xl border border-border transition-all duration-200 ease-out overflow-hidden
                    ${open && !isHidden ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
                    bottom-0 right-0 w-full h-[100dvh] rounded-none sm:bottom-auto sm:top-[max(16px,calc(100vh-560px))] sm:right-[20px] sm:w-[380px] sm:h-[min(520px,calc(100vh-100px))] sm:rounded-xl
                `}
            >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-card shrink-0">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
                        <Image src="/ada-icon.svg" alt="Ada" width={24} height={24} className="object-contain" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-[15px] flex items-center gap-2 text-foreground">
                            Ada
                            <span className="flex items-center gap-1.5 text-[11px] font-normal text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
                                Online
                            </span>
                        </div>
                        <div className="text-[12px] text-muted-foreground">Anber's AI Assistant</div>
                    </div>
                    <div className="ml-auto flex items-center">
                        {messages.length > 0 && userInfo && (
                            <div className="relative mr-1" ref={menuRef}>
                                <button
                                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                                    className="text-muted-foreground hover:text-foreground text-lg leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                                    aria-label="Download chat"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                    </svg>
                                </button>
                                {showDownloadMenu && (
                                    <div className="absolute right-0 top-10 mt-1 w-52 bg-card border border-border rounded-md shadow-lg overflow-hidden z-[110]">
                                        <button onClick={downloadMarkdown} className="w-full text-left px-4 py-2 text-[13px] text-foreground hover:bg-muted transition-colors">
                                            Download as Markdown (.md)
                                        </button>
                                        <button onClick={downloadPDF} className="w-full text-left px-4 py-2 text-[13px] text-foreground hover:bg-muted transition-colors border-t border-border/50">
                                            Download as PDF (.pdf)
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <button
                            onClick={closeWidget}
                            className="text-muted-foreground hover:text-foreground text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                            aria-label="Close chat"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                {!userInfo ? (
                    <div className="flex-1 flex flex-col p-6 bg-background overflow-y-auto animate-fade-in-chat">
                        <div className="mb-6">
                            <h2 className="text-[16px] font-bold text-foreground">Before we begin</h2>
                            <p className="text-[13px] text-muted-foreground mt-1">So Anber can follow up with you if needed.</p>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={nameInput}
                                    onChange={e => setNameInput(e.target.value)}
                                    className="w-full text-[14px] bg-background text-foreground border border-border rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground shadow-sm"
                                />
                                {nameError && <p className="text-red-500 text-[12px] mt-1.5">{nameError}</p>}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={emailInput}
                                    onChange={e => setEmailInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleStartChat()}
                                    className="w-full text-[14px] bg-background text-foreground border border-border rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground shadow-sm"
                                />
                                {emailError && <p className="text-red-500 text-[12px] mt-1.5">{emailError}</p>}
                            </div>
                        </div>

                        <div className="pt-6 mt-auto shrink-0">
                            <button
                                onClick={handleStartChat}
                                disabled={formLoading}
                                className="w-full bg-primary text-primary-foreground rounded-lg py-3 text-[14px] font-medium flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {formLoading ? 'Starting...' : 'Start Chat →'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background animate-fade-in-chat">
                            {errorMsg && (
                                <div className="flex justify-center mb-2">
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-md px-3 py-1.5 text-[12px]">
                                        {errorMsg}
                                    </div>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`whitespace-pre-wrap rounded-xl px-4 py-2.5 text-[14px] max-w-[85%] leading-relaxed ${m.role === 'user'
                                        ? 'bg-muted text-foreground rounded-br-sm'
                                        : 'bg-primary text-primary-foreground rounded-bl-sm'
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                    {m.timestamp && (
                                        <div className="text-[11px] text-muted-foreground mt-1.5 mx-1">
                                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-primary text-primary-foreground rounded-xl rounded-bl-sm px-4 py-2.5 text-[14px] animate-pulse opacity-80">
                                        Ada is typing...
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} className="h-1" />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-border bg-card shrink-0">
                            <div className="flex gap-2 relative">
                                <input
                                    className="flex-1 text-[14px] bg-background text-foreground border border-border rounded-lg pl-4 pr-12 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground shadow-sm disabled:opacity-50"
                                    placeholder={isBlocked ? "Session blocked" : "Ask Ada a question..."}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                    maxLength={500}
                                    disabled={isBlocked}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim() || isBlocked}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-primary text-primary-foreground rounded-md flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity"
                                    aria-label="Send message"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="ml-0.5">
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm.851-1.364L1.576 6.13l11.83-3.66z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}