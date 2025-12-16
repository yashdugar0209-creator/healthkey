import React, { useState } from 'react';
import * as aiAssistantService from '../../services/aiAssistantService';

export default function PatientAIHealthAssistantPanel() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I am your AI health assistant. You can ask about your vitals, appointments, medications, or healthy habits. I do not replace a doctor.',
      id: 'intro',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSend = async (e) => {
    e && e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setErr('');
    const newMessages = [
      ...messages,
      { role: 'user', content: text, id: `u-${Date.now()}` },
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await aiAssistantService.sendMessages(
        newMessages.map(({ role, content }) => ({ role, content }))
      );
      const reply = res.reply || 'Sorry, I could not generate a response.';
      setMessages([
        ...newMessages,
        { role: 'assistant', content: reply, id: `a-${Date.now()}` },
      ]);
    } catch (e) {
      console.error(e);
      setErr(e.message || 'Failed to contact AI assistant.');
      setMessages(newMessages); // keep user message, no assistant message
    } finally {
      setLoading(false);
    }
  };

  const quickAsk = (question) => {
    setInput(question);
  };

  return (
    <div className="panel ai-panel">
      <div className="panel-header">
        <h3>AI Health Assistant</h3>
        <div className="panel-actions">
          <span className="ai-status-dot" /> Online
        </div>
      </div>

      <div className="ai-chat-window">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              'ai-message ' +
              (m.role === 'user' ? 'ai-message-user' : 'ai-message-assistant')
            }
          >
            <div className="ai-avatar">
              {m.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="ai-bubble">
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-message ai-message-assistant">
            <div className="ai-avatar">🤖</div>
            <div className="ai-bubble">
              <span className="ai-typing-dot" />
              <span className="ai-typing-dot" />
              <span className="ai-typing-dot" />
            </div>
          </div>
        )}
      </div>

      {err && <div className="error" style={{ marginTop: 6 }}>{err}</div>}

      <div className="ai-quick-questions">
        <span>Quick questions:</span>
        <button
          type="button"
          className="ai-chip"
          onClick={() => quickAsk('Give me tips to improve my blood pressure.')}
        >
          BP tips
        </button>
        <button
          type="button"
          className="ai-chip"
          onClick={() =>
            quickAsk('Explain my last lab report in simple language.')
          }
        >
          Lab report help
        </button>
        <button
          type="button"
          className="ai-chip"
          onClick={() =>
            quickAsk('Remind me how to take my current medicines properly.')
          }
        >
          Medicine guidance
        </button>
      </div>

      <form className="ai-input-row" onSubmit={handleSend}>
        <textarea
          rows={2}
          className="ai-input"
          placeholder="Ask something about your health, vitals, or prescriptions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn" type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>

      <div className="ai-disclaimer">
        This assistant provides general information only and does not replace
        a consultation with a doctor or emergency services.
      </div>
    </div>
  );
}
