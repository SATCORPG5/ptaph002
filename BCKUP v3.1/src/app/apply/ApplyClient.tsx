"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/layout/Section";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteSettings, ApplyPageSettings, ApplyFormQuestion } from "@/lib/creators-db";

function ApplicationForm({ initialCreators, settings }: { initialCreators: any[], settings: SiteSettings }) {
  const searchParams = useSearchParams();
  const recruiterId = searchParams.get('recruiter');
  const recruiter = recruiterId ? initialCreators.find(c => c.id === recruiterId && c.tier === 'recruiter') : null;

  const applyPage = settings.applyPage || {
    title: "Creator Intake Form",
    description: "Join Peace Time Agency and level up your TikTok LIVE experience!",
    certificationText: "I certify that all information provided is accurate and belongs to me.",
    questions: []
  };

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCertified, setIsCertified] = useState(false);

  const evaluateCondition = (q: ApplyFormQuestion) => {
    if (!q.showIf) return true;
    const dependencyVal = answers[q.showIf.questionId];
    if (Array.isArray(dependencyVal)) {
      return dependencyVal.includes(q.showIf.equals);
    }
    return dependencyVal === q.showIf.equals;
  };

  const activeQuestions = applyPage.questions.filter(evaluateCondition);

  const handleInputChange = (id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleCheckboxToggle = (id: string, option: string) => {
    setAnswers(prev => {
      const current = prev[id] || [];
      const isSelected = current.includes(option);
      let newSelection = [...current];

      if (isSelected) {
        newSelection = newSelection.filter((o: string) => o !== option);
      } else {
        newSelection.push(option);
      }

      if (newSelection.length > 0 && errors[id]) {
        setErrors(e => { const newE = { ...e }; delete newE[id]; return newE; });
      }
      return { ...prev, [id]: newSelection };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    activeQuestions.forEach(q => {
      if (q.required) {
        const val = answers[q.id];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          newErrors[q.id] = "This field is required.";
        }
      }
    });

    if (!isCertified) {
      newErrors.isCertified = "Please certify that your information is accurate.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Map answers from ID back to question text for the discord embed
    const mappedAnswers: Record<string, any> = {};
    activeQuestions.forEach(q => {
      mappedAnswers[q.question] = answers[q.id];
    });

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/apply/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: mappedAnswers,
          recruiterId: recruiterId || undefined,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6 border-t border-border mt-[68px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-lg w-full p-12 text-center rounded-[40px] border-primary/20"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Application Received</h1>
          <p className="text-foreground-muted mb-12">
            Our team will review your submission and get back to you soon. Stay consistent on LIVE and let&apos;s build something great together.
          </p>
          <Link href="/" className="block w-full py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl transition-all duration-300 uppercase tracking-widest shadow-lg shadow-primary/20">
            Back to Home
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-24 overflow-hidden relative border-t border-border mt-[68px]">
      <div className="fixed inset-0 bg-dot-grid opacity-20 pointer-events-none mix-blend-screen" />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/90 to-background pointer-events-none" />

      <Section className="relative z-10">
        <div className="max-w-3xl mx-auto auto-rows-max glass-card p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl">

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4 uppercase">
              {applyPage.title.split(' ').map((word, i, arr) => (
                i === arr.length - 1 ? <span key={i} className="text-gradient-primary">{word}</span> : <span key={i}>{word} </span>
              ))}
            </h1>
            <p className="text-foreground-muted leading-relaxed">
              {applyPage.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">

            {activeQuestions.map((q) => (
              <div key={q.id} className="space-y-3">
                <label className="block text-sm font-bold text-white tracking-wide">
                  {q.question} {q.required && <span className="text-primary">*</span>}
                </label>
                
                {q.type === 'text' && (
                  <input
                    type="text"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                  />
                )}

                {q.type === 'textarea' && (
                  <textarea
                    className="w-full min-h-[100px] bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                  />
                )}

                {q.type === 'radio' && q.options && (
                  <div className="flex flex-wrap gap-4">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className="w-4 h-4 text-primary bg-white/5 border-white/20 focus:ring-primary focus:ring-2"
                        />
                        <span className="text-sm text-white/80">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'checkbox' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map(opt => (
                      <label key={opt} className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-colors">
                        <input
                          type="checkbox"
                          checked={(answers[q.id] || []).includes(opt)}
                          onChange={() => handleCheckboxToggle(q.id, opt)}
                          className="mt-1 w-4 h-4 rounded text-primary bg-white/5 border-white/20 focus:ring-primary focus:ring-2"
                        />
                        <span className="text-sm text-white/80 leading-snug">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'select' && q.options && (
                  <select
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full bg-[#121826] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                  >
                     <option value="" disabled>Select an option...</option>
                     {q.options.map(opt => (
                       <option key={opt} value={opt}>{opt}</option>
                     ))}
                  </select>
                )}

                {q.helpText && <p className="text-xs text-white/40 italic">{q.helpText}</p>}
                {errors[q.id] && <p className="text-xs text-primary font-bold mt-1">{errors[q.id]}</p>}
              </div>
            ))}

            {/* Certification (Always present) */}
            <div className="pt-6">
              <label className="flex items-start gap-4 cursor-pointer p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={isCertified}
                    onChange={(e) => { setIsCertified(e.target.checked); setErrors(p => { const o = {...p}; delete o.isCertified; return o; }) }}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer peer appearance-none border-2 checked:bg-primary checked:border-primary"
                  />
                  <svg 
                    className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={4}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Certification <span className="text-primary">*</span></span>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {applyPage.certificationText}
                  </p>
                </div>
              </label>
              {errors.isCertified && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-primary font-bold mt-2 ml-2"
                >
                  {errors.isCertified}
                </motion.p>
              )}
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl transition-all uppercase tracking-widest text-sm shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="relative z-10">{isSubmitting ? "Submitting..." : "Submit Application"}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
              <p className="text-center text-xs text-white/30 mt-4">
                Thank you for applying to Peace Time Agency! ☮️
              </p>
            </div>

          </form>

        </div>
      </Section>
    </main>
  );
}

export default function ApplyClient({ initialCreators = [], settings }: { initialCreators: any[], settings: SiteSettings }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center text-primary font-black uppercase tracking-widest text-sm mt-[68px]">Loading Form...</div>}>
      <ApplicationForm initialCreators={initialCreators} settings={settings} />
    </Suspense>
  );
}
