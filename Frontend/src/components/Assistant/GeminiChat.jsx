import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Minimize2, MessageCircle, Loader2 } from "lucide-react";

const MODEL_NAME = "gemini-1.5-flash"; // Standard stable flash model

export default function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your PharmaCare assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const apiKey = localStorage.getItem("gemini_api_key");
    if (!apiKey) {
      setMessages(prev => [...prev, { role: "user", content: input.trim() }]);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I need a Gemini API key to function. Please ask the administrator to configure it in the Admin Settings." 
      }]);
      setInput("");
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: userMessage }] 
            }]
          })
        }
      );

      const data = await response.json();
      
      if (data.error) {
        console.error("Gemini API Error:", data.error);
        throw new Error(data.error.message || "API Error");
      }

      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!botReply) {
        throw new Error("Empty response from AI");
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: botReply }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Error: ${error.message}. Please check if the API key is valid or try again.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl transition hover:scale-110 hover:bg-emerald-700 active:scale-95"
        >
          <Bot size={28} />
        </button>
      ) : (
        <div className="flex h-[500px] w-[350px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between bg-emerald-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold">PharmaCare AI</h3>
                <p className="text-[10px] text-emerald-100">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-lg p-1 hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-emerald-600" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-slate-100 p-4 bg-white">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500 transition">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="text-emerald-600 disabled:opacity-30 hover:scale-110 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
