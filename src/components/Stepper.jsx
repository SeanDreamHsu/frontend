import React from 'react';
import { CheckCircle } from 'lucide-react';

const Stepper = ({ currentStep, steps }) => (
  <nav aria-label="Progress" className="pt-4">
    <ol role="list" className="space-y-4">
      <div className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            <div className={`text-center text-sm font-medium ${stepIdx <= currentStep ? 'text-sky-800' : 'text-slate-600'}`}>
              {step.name}
            </div>
          </li>
        ))}
      </div>
      <div className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={`${step.name}_icon`} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            {stepIdx < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-sky-400" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center bg-sky-500 rounded-full text-white mx-auto">
                  <CheckCircle className="h-5 w-5" />
                </span>
              </>
            ) : stepIdx === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-sky-400 rounded-full mx-auto">
                  <span className="h-2.5 w-2.5 bg-sky-400 rounded-full" />
                </span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200" />
                </div>
                <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-slate-200 rounded-full mx-auto" />
              </>
            )}
          </li>
        ))}
      </div>
    </ol>
  </nav>
);

export default Stepper;
