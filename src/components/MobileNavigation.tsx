'use client';

import { useState } from 'react';
import { Upload, Settings, FileText, Menu, X } from 'lucide-react';

interface MobileNavigationProps {
  currentStep: 'upload' | 'configure' | 'preview';
  onStepChange: (step: 'upload' | 'configure' | 'preview') => void;
}

export default function MobileNavigation({ currentStep, onStepChange }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const steps = [
    { id: 'upload', label: 'Add Time Data', icon: Upload, description: 'Add your time tracking data' },
    { id: 'configure', label: 'Configure', icon: Settings, description: 'Set up invoice details' },
    { id: 'preview', label: 'Preview', icon: FileText, description: 'Review and download' },
  ] as const;

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors touch-target"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-foreground">TimeFlow</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              Free
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full bg-primary transition-all duration-500 ${
                currentStep === 'upload' ? 'w-0' : 
                currentStep === 'configure' ? 'w-1/2' : 'w-full'
              }`}
            />
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    getStepStatus(step.id) === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : getStepStatus(step.id) === 'current'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {getStepStatus(step.id) === 'completed' ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1 hidden sm:block">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute top-0 left-0 w-80 h-full bg-card shadow-xl border border-border">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const status = getStepStatus(step.id);
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        onStepChange(step.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors touch-target ${
                        status === 'current' 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : status === 'current'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {status === 'completed' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-foreground">{step.label}</div>
                        <div className="text-sm text-muted-foreground">{step.description}</div>
                      </div>
                      {status === 'current' && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-500 font-bold text-sm">⚡</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-foreground">Upgrade to Pro</div>
                      <div className="text-sm text-muted-foreground">Remove watermark & more features</div>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-muted-foreground font-bold text-sm">?</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-foreground">Help & Support</div>
                      <div className="text-sm text-muted-foreground">Get help with TimeFlow</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 