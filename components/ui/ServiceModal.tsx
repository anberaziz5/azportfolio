"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
}

export function ServiceModal({ isOpen, onClose, serviceTitle }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requirements: "",
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          service: serviceTitle, 
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          requirements: formData.requirements,
          availability: `${formData.date} at ${formData.time}`,
        }),
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({ name: "", email: "", phone: "", requirements: "", date: "", time: "" });
        }, 3000);
      } else {
        console.error("Failed to submit request.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-card border border-border/50 p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors font-mono text-sm"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-10">
              <span className="text-[#F38020] font-mono text-xs uppercase tracking-[0.2em] mb-2 block">
                Architecture Request
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {serviceTitle}
              </h2>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#F38020] flex items-center justify-center mb-6">
                  <span className="text-[#F38020] text-2xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold text-[#F38020] mb-2">Request Transmitted</h3>
                <p className="text-muted-foreground font-mono text-sm">
                  An architect will contact you shortly to lock in your availability slot.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="FULL NAME"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-3 text-foreground placeholder:text-muted-foreground/50 font-mono text-sm focus:border-[#F38020] focus:ring-0 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="EMAIL ADDRESS"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-3 text-foreground placeholder:text-muted-foreground/50 font-mono text-sm focus:border-[#F38020] focus:ring-0 focus:outline-none transition-colors"
                    />
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="PHONE NUMBER"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-3 text-foreground placeholder:text-muted-foreground/50 font-mono text-sm focus:border-[#F38020] focus:ring-0 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      name="requirements"
                      placeholder="PROJECT REQUIREMENTS & SCOPE"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-3 text-foreground placeholder:text-muted-foreground/50 font-mono text-sm focus:border-[#F38020] focus:ring-0 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      required
                      type="date"
                      name="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={handleChange}
                      onKeyDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        try {
                          if ("showPicker" in HTMLInputElement.prototype) {
                            e.currentTarget.showPicker();
                          }
                        } catch (err) {}
                      }}
                      className="w-full bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-3 text-foreground placeholder:text-muted-foreground/50 font-mono text-sm focus:border-[#F38020] focus:ring-0 focus:outline-none transition-colors cursor-pointer"
                      style={{ colorScheme: "dark" }}
                    />
                    <input
                      required
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      onKeyDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        try {
                          if ("showPicker" in HTMLInputElement.prototype) {
                            e.currentTarget.showPicker();
                          }
                        } catch (err) {}
                      }}
                      className="w-full bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-3 text-foreground placeholder:text-muted-foreground/50 font-mono text-sm focus:border-[#F38020] focus:ring-0 focus:outline-none transition-colors cursor-pointer"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative h-14 bg-foreground text-background font-bold uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-[#F38020] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        INITIALIZING SEQUENCE...
                      </>
                    ) : (
                      "TRANSMIT REQUEST"
                    )}
                  </span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
