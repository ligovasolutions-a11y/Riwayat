'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, MessageCircle } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; text: string }

const suggestions = [
  'Find wedding jewellery under ₹5 lakh',
  'Recommend a luxury watch as a gift',
  'Book a private appointment',
  'Tell me about diamond certification',
]

const getResponse = (query: string): string => {
  const q = query.toLowerCase()
  if (q.includes('wedding') || q.includes('bridal')) {
    return 'Our bridal collection ranges from ₹80,000 to ₹25 lakhs. I\'d recommend our "Maharani" set — 22K gold with polki diamonds, priced at ₹3.8 lakhs. Would you like me to schedule a private bridal consultation with our jewellery expert?'
  }
  if (q.includes('watch') || q.includes('rolex') || q.includes('omega')) {
    return 'We are authorised dealers for Rolex, Omega, TAG Heuer, Longines, and IWC. For a gift, the Omega Constellation at ₹2.8 lakhs is extremely popular. The Rolex Oyster Perpetual starting at ₹7.5 lakhs is a timeless choice. Shall I arrange a private watch viewing?'
  }
  if (q.includes('appointment') || q.includes('book') || q.includes('visit')) {
    return 'I\'d be happy to arrange a private consultation for you. We offer Boutique Visits, Bridal Consultations, Watch Viewings, and exclusive VIP Appointments. Please visit our Appointments page or call +91 99999 88888. What date works best for you?'
  }
  if (q.includes('diamond') || q.includes('certif')) {
    return 'All our diamonds are GIA or IGI certified. We carry stones from D-J color grades in VS1-VS2 clarity. Our Diamond Atelier team can help you choose the perfect stone for any occasion. Every purchase comes with full certification documentation.'
  }
  if (q.includes('price') || q.includes('budget') || q.includes('₹') || q.includes('lakh')) {
    return 'We have beautiful pieces across all budgets — from ₹25,000 for everyday jewellery to bespoke pieces above ₹50 lakhs. Our experts can help you find exactly what you\'re looking for within your budget. Shall I connect you with our team?'
  }
  return 'Thank you for reaching out to Riwaayat Jewels. Our luxury concierge team is happy to assist you with jewellery, watches, or appointment bookings. You can also reach us at +91 99999 88888 or appointments@riwaayatjewels.com. How can I help you today?'
}

export default function AIConsierge() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Welcome to Riwaayat Jewels. I\'m your personal luxury concierge. How may I assist you today — jewellery, watches, or a private appointment?' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { role: 'assistant', text: getResponse(msg) }])
    }, 1200)
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-rw-black text-white w-14 h-14 flex items-center justify-center shadow-2xl hover:bg-rw-gold transition-all duration-300 group"
          title="Open AI Concierge"
        >
          <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white shadow-2xl border border-rw-border flex flex-col" style={{ height: '540px' }}>
          {/* Header */}
          <div className="bg-rw-black p-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rw-gold flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-serif font-light">Riwaayat Concierge</p>
                <p className="text-white/40 text-[10px] tracking-wider uppercase font-sans">AI Luxury Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm font-sans font-light leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-rw-black text-white'
                      : 'bg-rw-light text-rw-black border border-rw-border'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-rw-light border border-rw-border px-4 py-3 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-rw-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-rw-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-rw-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[10px] tracking-wide uppercase font-sans text-rw-gray border border-rw-border px-3 py-1.5 hover:border-rw-gold hover:text-rw-gold transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-rw-border p-4 flex gap-3 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about jewellery, watches…"
              className="flex-1 text-sm font-sans text-rw-black placeholder-rw-border border-0 outline-none bg-transparent"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              className="bg-rw-gold text-white p-2 disabled:opacity-30 hover:bg-rw-gold-dark transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
