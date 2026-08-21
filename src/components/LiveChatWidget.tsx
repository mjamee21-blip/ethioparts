'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, ShieldCheck } from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { sender: 'bot', text: 'Selam! Welcome to EthioParts Support. Looking for a specific spare part or compatibility check for Toyota, Isuzu, or Bajaj?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { sender: 'user' as const, text: userMsg, time: timeNow }];
    setMessages(newMessages);
    setInput('');

    // Simulate expert auto parts bot response
    setTimeout(() => {
      let botReply = 'We have certified merchants across Merkato, Bole, and Kality ready to supply genuine parts with Telebirr and CBE Birr payment verification.';
      const lower = userMsg.toLowerCase();
      if (lower.includes('hilux') || lower.includes('toyota')) {
        botReply = 'Toyota Hilux parts (Revo, Vigo, Land Cruiser) are fully stocked by verified merchants in Merkato with 3-day delivery options.';
      } else if (lower.includes('isuzu') || lower.includes('npr')) {
        botReply = 'Isuzu NPR and FSR heavy duty replacement parts are available with direct merchant payment accounts and instant receipt verification.';
      } else if (lower.includes('bajaj') || lower.includes('tvs')) {
        botReply = 'Bajaj 3-wheeler engine components, cables, and brake shoes are available from authorized local distributors.';
      } else if (lower.includes('payment') || lower.includes('telebirr') || lower.includes('cbe')) {
        botReply = 'EthioParts supports Telebirr, CBE Birr, Awash Bank, Dashen, and 8 other offline/online gateways with 10% transparent commission escrow.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold p-4 rounded-full shadow-2xl flex items-center gap-2 transition transform hover:scale-105"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="hidden sm:inline text-xs font-mono font-bold uppercase tracking-wider">Mechanic Live Chat</span>
        </button>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-80 sm:w-96 shadow-2xl flex flex-col h-[480px] animate-fadeIn overflow-hidden">
          {/* Chat Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">EthioParts Expert Assistant</h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online • Merkato & Bole Hubs
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs space-y-1 ${
                  m.sender === 'user' ? 'bg-amber-500 text-slate-950 font-medium' : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}>
                  <p>{m.text}</p>
                  <span className={`block text-[9px] text-right ${m.sender === 'user' ? 'text-slate-900/70' : 'text-slate-500'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about Toyota, Isuzu parts..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
