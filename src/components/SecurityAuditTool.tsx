import React, { useState } from 'react';
import { AUDIT_QUESTIONS } from '../data';
import { ShieldAlert, ShieldCheck, RefreshCw, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

interface SecurityAuditToolProps {
  onOpenConsultationWithScore: (score: number) => void;
}

export const SecurityAuditTool: React.FC<SecurityAuditToolProps> = ({
  onOpenConsultationWithScore
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const totalQuestions = AUDIT_QUESTIONS.length;
  const currentQ = AUDIT_QUESTIONS[currentStep];

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const calculateTotalScore = () => {
    let total = 0;
    AUDIT_QUESTIONS.forEach((q) => {
      const selectedIndex = answers[q.id];
      if (selectedIndex !== undefined) {
        total += q.options[selectedIndex].score;
      }
    });
    return total; // max 100
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const score = calculateTotalScore();

  const getScoreGrade = (s: number) => {
    if (s >= 85) return { label: 'Institutional Sovereign', color: 'text-emerald-500', desc: 'Your self-custody setup is battle-tested against physical and digital vectors.' };
    if (s >= 60) return { label: 'Solid Baseline', color: 'text-amber-500', desc: 'Good hardware baseline, but key single points of failure remain.' };
    return { label: 'High Exposure Risk', color: 'text-rose-500', desc: 'Immediate vulnerability to counterparty bankruptcy, fire damage, or theft.' };
  };

  const grade = getScoreGrade(score);

  return (
    <section id="audit" className="py-20 bg-theme-main relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-theme bg-theme-surface text-xs font-mono font-medium text-theme-brass uppercase tracking-widest">
            Interactive Diagnostic
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-theme-main tracking-tight">
            Self-Custody Security Audit
          </h2>
          <p className="text-sm text-theme-muted max-w-xl mx-auto">
            Evaluate your cold storage, seed phrase hygiene, and estate continuity in 60 seconds.
          </p>
        </div>

        {/* Audit Tool Container */}
        <div className="p-6 sm:p-10 rounded-2xl bg-theme-surface border border-theme brass-border-glow space-y-8">
          
          {!isCompleted ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-theme-muted font-mono">
                  <span>STEP {currentStep + 1} OF {totalQuestions}</span>
                  <span>{Math.round(((currentStep + 1) / totalQuestions) * 100)}% COMPLETED</span>
                </div>
                <div className="h-1.5 w-full bg-theme-main rounded-full overflow-hidden border border-theme-subtle">
                  <div
                    className="h-full brass-gradient transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="space-y-2 pt-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-theme-main">
                  {currentQ.question}
                </h3>
                <p className="text-xs text-theme-muted">{currentQ.description}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'border-theme-brass bg-theme-main shadow-sm'
                          : 'border-theme bg-theme-surface hover:bg-theme-surface-hover'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-theme-main flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold ${
                            isSelected ? 'border-theme-brass bg-theme-brass text-[#0D0C0A]' : 'border-theme text-theme-muted'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt.label}</span>
                        </div>
                        {isSelected && (
                          <div className="text-xs text-theme-brass pl-7 pt-1 animate-in fade-in duration-200 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{opt.tip}</span>
                          </div>
                        )}
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5 ${
                        isSelected ? 'border-theme-brass bg-theme-brass text-[#0D0C0A]' : 'border-theme'
                      }`}>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-theme-subtle">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-xs font-medium text-theme-muted hover:text-theme-main disabled:opacity-30 disabled:pointer-events-none"
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={answers[currentQ.id] === undefined}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-lg disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                >
                  <span>{currentStep === totalQuestions - 1 ? 'View Audit Results' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-8 animate-in fade-in duration-300 text-center sm:text-left">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-theme-subtle">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme bg-theme-main text-xs font-mono text-theme-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-theme-brass" />
                    <span>Audit Breakdown Complete</span>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-theme-main">
                    Security Rating: <span className={grade.color}>{grade.label}</span>
                  </h3>
                  <p className="text-xs text-theme-muted max-w-md">{grade.desc}</p>
                </div>

                {/* Score Gauge Circle */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-theme-main border border-theme min-w-[140px]">
                  <span className="font-serif text-5xl font-bold text-theme-main">{score}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-muted">OUT OF 100</span>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-theme-brass">
                  Tailored Hardening Roadmap
                </h4>

                <div className="grid grid-cols-1 gap-3 text-left">
                  {AUDIT_QUESTIONS.map((q) => {
                    const selIdx = answers[q.id];
                    const selectedOpt = q.options[selIdx];
                    return (
                      <div key={q.id} className="p-4 rounded-xl bg-theme-main border border-theme space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium text-theme-main">
                          <span>{q.question}</span>
                          <span className="font-mono text-theme-brass">{selectedOpt.score} / 25 pts</span>
                        </div>
                        <p className="text-xs text-theme-muted">{selectedOpt.tip}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Controls */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-theme-subtle">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-theme-muted hover:text-theme-main transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Security Audit</span>
                </button>

                <button
                  onClick={() => onOpenConsultationWithScore(score)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#0D0C0A] brass-gradient rounded-xl shadow-md hover:brightness-105"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Discuss Score With A Confidant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
