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
    { id: 'upload', label: 'Upload CSV', icon: Upload, description: 'Upload your time tracking CSV' },
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
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-gray-900">TimeFlow</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Free
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ${
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
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
                <span className="text-xs text-gray-500 mt-1 hidden sm:block">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute top-0 left-0 w-80 h-full bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : status === 'current'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-500'
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
                        <div className="font-medium text-gray-900">{step.label}</div>
                        <div className="text-sm text-gray-500">{step.description}</div>
                      </div>
                      {status === 'current' && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">⚡</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">Upgrade to Pro</div>
                      <div className="text-sm text-gray-500">Remove watermark & more features</div>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-bold text-sm">?</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">Help & Support</div>
                      <div className="text-sm text-gray-500">Get help with TimeFlow</div>
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