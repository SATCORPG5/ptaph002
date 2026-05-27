import { SiteSettings, ApplyFormQuestion } from "@/lib/creators-db";
import { Plus, Trash2, GripVertical, Settings2 } from "lucide-react";
import { useRef } from "react";

export function ApplySettings({ settings, setSettings }: { settings: SiteSettings, setSettings: (s: SiteSettings) => void }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const applyPage = settings.applyPage || {
    title: "",
    description: "",
    certificationText: "",
    questions: []
  };

  const updateApplyPage = (updates: Partial<typeof applyPage>) => {
    setSettings({ ...settings, applyPage: { ...applyPage, ...updates } });
  };

  const addQuestion = () => {
    updateApplyPage({
      questions: [
        ...applyPage.questions,
        {
          id: `q_${Date.now()}`,
          type: "text",
          question: "New Question",
          required: false
        }
      ]
    });
    
    // Smooth scroll to the new question at the bottom
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const updateQuestion = (index: number, updates: Partial<ApplyFormQuestion>) => {
    const newQuestions = [...applyPage.questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    updateApplyPage({ questions: newQuestions });
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = applyPage.questions.filter((_, i) => i !== index);
    updateApplyPage({ questions: newQuestions });
  };

  const addOption = (index: number) => {
    const q = applyPage.questions[index];
    const newOptions = [...(q.options || []), "New Option"];
    updateQuestion(index, { options: newOptions });
  };

  const updateOption = (qIndex: number, optIndex: number, val: string) => {
    const q = applyPage.questions[qIndex];
    if (!q.options) return;
    const newOptions = [...q.options];
    newOptions[optIndex] = val;
    updateQuestion(qIndex, { options: newOptions });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const q = applyPage.questions[qIndex];
    if (!q.options) return;
    const newOptions = [...q.options];
    newOptions.splice(optIndex, 1);
    updateQuestion(qIndex, { options: newOptions });
  };

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <div className="w-2 h-6 bg-primary rounded-full shadow-neon-primary" />
          Apply Form Configuration
        </h2>
        <p className="text-xs text-foreground-muted font-bold tracking-widest uppercase">
          Configure the questions and fields for the intake form.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Portal Title</label>
          <input
            value={applyPage.title}
            onChange={(e) => updateApplyPage({ title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
            placeholder="Creator Intake Form"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Portal Description</label>
          <textarea
            value={applyPage.description}
            onChange={(e) => updateApplyPage({ description: e.target.value })}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/80 focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1">Legal Certification Text</label>
          <input
            value={applyPage.certificationText}
            onChange={(e) => updateApplyPage({ certificationText: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
           <h3 className="text-sm font-black text-white uppercase tracking-widest">Form Questions</h3>
           <button
             type="button"
             onClick={addQuestion}
             className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
           >
              <Plus className="w-3 h-3" />
              Add Question
           </button>
        </div>

        <div className="space-y-4">
          {applyPage.questions.map((q, idx) => (
            <div key={q.id || idx} className="p-6 rounded-2xl bg-white/[0.015] border border-white/5 relative group hover:border-white/10 transition-colors">
              <button 
                type="button"
                onClick={() => {
                  console.log('Deleting question at index:', idx);
                  deleteQuestion(idx);
                }}
                className="absolute top-4 right-4 p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors z-30"
                title="Delete Question"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex gap-4">
                <div className="flex-1 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground-subtle">Question ID (Unique)</label>
                        <input
                          value={q.id}
                          onChange={(e) => updateQuestion(idx, { id: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-secondary font-mono focus:outline-none focus:border-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground-subtle">Display Type</label>
                        <select
                          value={q.type}
                          onChange={(e) => updateQuestion(idx, { type: e.target.value as any })}
                          className="w-full bg-[#121826] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 uppercase tracking-widest"
                        >
                          <option value="text">Short Answer</option>
                          <option value="textarea">Long Answer</option>
                          <option value="radio">Single Choice</option>
                          <option value="checkbox">Multiple Choice</option>
                          <option value="select">Dropdown</option>
                        </select>
                      </div>
                    </div>

                   <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground-subtle">Question Text</label>
                     <input
                       value={q.question}
                       onChange={(e) => updateQuestion(idx, { question: e.target.value })}
                       className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground-subtle">Sub-text / Hint (Optional)</label>
                       <input
                         value={q.helpText || ""}
                         onChange={(e) => updateQuestion(idx, { helpText: e.target.value })}
                         className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/50 focus:outline-none focus:border-primary/50"
                       />
                     </div>
                     <div className="space-y-2 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer group/req">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => updateQuestion(idx, { required: e.target.checked })}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
                          />
                          <span className="text-[10px] uppercase font-black tracking-widest text-white/60 group-hover/req:text-white transition-colors">Required Field</span>
                        </label>
                     </div>
                   </div>

                   {/* Options Manager */}
                   {(q.type === 'radio' || q.type === 'checkbox' || q.type === 'select') && (
                     <div className="mt-4 p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
                       <div className="flex items-center justify-between">
                         <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground-muted flex items-center gap-2">
                           <Settings2 className="w-3 h-3" /> Selection Options
                         </h4>
                         <button
                           type="button"
                           onClick={() => addOption(idx)}
                           className="text-[9px] uppercase font-black text-secondary hover:text-white transition-colors flex items-center gap-1"
                         >
                           <Plus className="w-3 h-3" /> Add Option
                         </button>
                       </div>
                       <div className="space-y-2">
                         {(q.options || []).map((opt, optIdx) => (
                           <div key={optIdx} className="flex items-center gap-2">
                             <div className="p-1.5 bg-white/5 rounded cursor-grab text-white/20 hover:text-white hover:bg-white/10 transition-colors">
                               <GripVertical className="w-3 h-3" />
                             </div>
                             <input
                                value={opt}
                                onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                                className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-secondary/50"
                             />
                             <button
                               type="button"
                               onClick={() => removeOption(idx, optIdx)}
                               className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                             >
                               <Trash2 className="w-3 h-3" />
                             </button>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Visibility Logic */}
                   <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="space-y-3">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground-muted flex items-center gap-2">
                           Visibility Logic (Show If...)
                        </h4>
                        <div className="flex items-center gap-3">
                           {q.showIf ? (
                             <>
                               <input 
                                  placeholder="Target ID (e.g. isUSCA)"
                                  value={q.showIf.questionId}
                                  onChange={(e) => updateQuestion(idx, { showIf: { ...q.showIf!, questionId: e.target.value } })}
                                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
                               />
                               <span className="text-[9px] uppercase font-bold text-white/30">EQUALS</span>
                               <input 
                                  placeholder="Target Value (e.g. No)"
                                  value={q.showIf.equals}
                                  onChange={(e) => updateQuestion(idx, { showIf: { ...q.showIf!, equals: e.target.value } })}
                                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white bg-green-500/5 focus:outline-none"
                               />
                               <button
                                  type="button"
                                  onClick={() => updateQuestion(idx, { showIf: undefined })}
                                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"
                               >
                                  <Trash2 className="w-3 h-3" />
                               </button>
                             </>
                           ) : (
                             <button
                               type="button"
                               onClick={() => updateQuestion(idx, { showIf: { questionId: "", equals: "" } })}
                               className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-foreground-muted hover:text-white transition-colors"
                             >
                               Add Visibility Rule
                             </button>
                           )}
                        </div>
                      </div>
                   </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 flex justify-center border-t border-white/5">
           <button
             type="button"
             onClick={addQuestion}
             className="px-8 py-4 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3"
           >
              <Plus className="w-4 h-4" />
              Add New Question
           </button>
        </div>

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
