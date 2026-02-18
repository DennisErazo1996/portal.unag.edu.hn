
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, User, Bot, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { sileo, Toaster } from 'sileo';


interface Message {
  role: 'user' | 'model';
  text: string;
  animate?: boolean;
}

const Typewriter = ({ text, onComplete, onUpdate }: { text: string, onComplete?: () => void, onUpdate?: () => void }) => {
  const [displayedChars, setDisplayedChars] = useState(0);
  
  useEffect(() => {
    setDisplayedChars(0);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        i++;
        setDisplayedChars(i);
        onUpdate?.();
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, 10);
    return () => clearInterval(timer);
  }, [text]);

  const displayText = text.substring(0, displayedChars);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
      <ReactMarkdown>{displayText}</ReactMarkdown>
    </div>
  );
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy el asistente virtual de la UNAG. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Disable animation for loaded messages
        setMessages(parsed.map((m: Message) => ({ ...m, animate: false })));
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, []);

  // Save messages to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const clearChat = () => {
    sileo.action({
      fill: 'black',
      duration: 3000,
      styles: {
        title: 'text-white!',
        button: 'bg-unag-green! text-white!',
        badge: 'bg-unag-green! text-white!',
      },
      title: '¿Deseas eliminar el historial del chat?',
      button: {
        title: 'Eliminar',
        onClick: () => {
          const initialMessage: Message = { role: 'model', text: '¡Hola! Soy el asistente virtual de la UNAG. ¿En qué puedo ayudarte hoy?' };
          setMessages([initialMessage]);
          localStorage.removeItem('chat_history');
          sileo.success({ title: 'Historial eliminado', fill: 'black' });
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newUserMessage: Message = { role: 'user', text: userMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Convert internal messages to OpenAI format
      const apiMessages = updatedMessages.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, provider: 'openai' }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'model', text: data.reply, animate: true }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 lg:right-6 z-50 flex flex-col items-end font-sans">
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 hidden md:block",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Chat Window */}
      <div
        className={cn(
          "bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 ease-in-out mb-4",
          "w-[350px] max-w-[calc(100vw-2rem)]", // Mobile width
          "md:w-[600px] md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:mb-0 md:z-50", // Desktop positioning and width
          isOpen 
            ? "opacity-100 scale-100 translate-y-0 md:scale-100" 
            : "opacity-0 scale-95 translate-y-4 pointer-events-none h-0 mb-0 md:h-auto",
           // Animation origin
           "origin-bottom-right md:origin-center"
        )}
      >
        {/* Header */}
        <div className="bg-unag-dark-green p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asistente UNAG</h3>
              <p className="text-xs text-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                En línea
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={clearChat}
              className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
              title="Vaciar chat"
            >
              <Trash2 size={16} />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
              title="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-950/50 flex flex-col gap-3 scroll-smooth">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-2 max-w-[85%] animate-fadeInUp",
                msg.role === 'user' ? "self-end flex-row-reverse" : "self-start"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-unag-green text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              )}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div
                className={cn(
                  "p-3 rounded-2xl text-sm shadow-sm",
                  msg.role === 'user' 
                    ? "bg-unag-green prose-p:text-white rounded-tr-none" 
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 dark:border-zinc-700 rounded-tl-none"
                )}
              >
                {msg.role === 'model' && msg.animate ? (
                  <Typewriter text={msg.text} onUpdate={scrollToBottom} />
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 self-start max-w-[85%]">
               <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-unag-green border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-unag-green hover:bg-unag-dark-green disabled:opacity-50 disabled:hover:bg-unag-green text-white p-2 rounded-full transition-colors shadow-md flex items-center justify-center w-10 h-10"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>

      {/* Toggle Button Container */}
      <div className="flex items-center gap-4">
        {/* Tooltip */}
        <div 
          className={cn(
            "bg-white dark:bg-zinc-800 text-[10px] lg:text-[12px] text-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 whitespace-nowrap transition-all duration-300 origin-right",
            isOpen ? "opacity-0 scale-95 pointer-events-none hidden" : "opacity-100 scale-100"
          )}
        >
          <div className="absolute text-sm right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-zinc-800 border-t border-r border-zinc-200 dark:border-zinc-700 rotate-45"></div>
          Hola, ¿en qué puedo ayudarte?
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "bg-unag-green hover:bg-unag-dark-green text-white p-3 lg:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center",
            isOpen ? "rotate-90 opacity-0 pointer-events-none absolute right-0" : "rotate-0 opacity-100 animate-pulse-scale hover:animate-none"
          )}
          aria-label="Abrir chat"
        >
          <MessageCircle size={28} />
        </button>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
