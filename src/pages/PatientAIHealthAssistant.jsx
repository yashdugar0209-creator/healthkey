import React from 'react';
import Header from '../components/Common/Header';
import PatientAIHealthAssistantPanel from '../components/Patients/PatientAIHealthAssistantPanel';

export default function PatientAIHealthAssistant() {
  return (
    <div className="page">
      <Header title="AI Health Assistant" />
      <main className="hk-container">
        {/* Reuse the same panel, full width here */}
        <PatientAIHealthAssistantPanel />
      </main>
    </div>
  );
}
