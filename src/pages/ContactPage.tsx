import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/ui/Toast.js';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please complete all contact fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry received. A client relations specialist will respond within 24 hours.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full transition-colors">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-12">
        <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold block mb-1">
          Client Relations
        </span>
        <h1 className="font-bebas text-4xl sm:text-5xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
          Atelier Inquiries & Press
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Information (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h3 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-3">
              Direct Contact
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-body">
              For order modifications, VIP fitting requests, or wholesale press previews, reach our concierge desk.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-start gap-3 p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60">
              <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Client Inquiries</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">concierge@ayaannx.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60">
              <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">WhatsApp Concierge Desk</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">+91 98200 12345</span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Mon–Sat: 10am–9pm IST</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Flagship Design Atelier</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Ayaan NX Atelier, 42 Linking Road
                </span>
                <span className="text-neutral-500 block">Bandra West, Mumbai 400050, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="p-10 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="font-bebas text-3xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                Message Dispatched
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto font-body">
                Thank you, {name}. A member of our client concierge team will respond to {email} promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase font-mono tracking-wider"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <h3 className="font-bebas text-2xl uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-2">
                Send a Dispatch
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Sterling"
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus@example.com"
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Order inquiry / Sizing consultation"
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry or order reference number..."
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 font-mono shadow-md"
              >
                <Send className="w-4 h-4" />
                Submit Dispatch
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
