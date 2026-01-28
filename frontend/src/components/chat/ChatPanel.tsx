import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Loader2, Sparkles, Wifi, WifiOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '../../types';
import { mockChatMessages, suggestedPrompts } from '../../data/mockData';
import { streamChat, api } from '../../api/client';

const MOCK_RESPONSES: Record<string, string> = {
  'What is the optimal vessel assignment?':
    '**Optimal Portfolio Assignment:**\n\n| Vessel | Cargo | TCE | Profit |\n|--------|-------|-----|--------|\n| Ann Bell | BHP Iron Ore | $19,920/day | $249K |\n| Ocean Horizon | CSN Iron Ore | $33,290/day | $1.47M |\n| Pacific Glory | EGA Bauxite | $38,920/day | $2.38M |\n\n**Total Portfolio Profit: $2.35M** | Avg TCE: $24,213/day\n\nGolden Ascent is held in reserve — available for market cargo opportunities.',
  'What if bunker prices rise 20%':
    '**Bunker Sensitivity Analysis (+20%):**\n\nAt **120% of current bunker prices**, the assignment changes:\n- Ocean Horizon is **replaced by Golden Ascent** for CSN Iron Ore\n- Golden Ascent has lower fuel consumption on the eco route\n\n| Metric | Current | +20% Bunker |\n|--------|---------|-------------|\n| Total Profit | $2.35M | $1.71M |\n| Avg TCE | $24,213 | $19,800 |\n| Profit Impact | — | **-$640K (-27%)** |\n\nThe tipping point is at **118%** — beyond this, the cheaper vessel becomes optimal.',
  'Compare vessels for EGA Bauxite':
    '**EGA Bauxite — Vessel Comparison:**\n\n| Metric | Pacific Glory ★ | Ann Bell | Ocean Horizon | Golden Ascent |\n|--------|----------------|----------|---------------|---------------|\n| TCE | **$38,920** | $38,120 | $34,780 | $35,910 |\n| Profit | **$2.38M** | $2.46M | $2.24M | $2.33M |\n| Days | 53.1 | 56.2 | 55.8 | 58.6 |\n| Margin | +3d | +6d | +4d | +2d |\n| Bunker Port | Fujairah | Fujairah | Fujairah | Fujairah |\n\nPacific Glory offers the **highest TCE** due to efficient fuel profile and favorable positioning from Gwangyang.',
};

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, val] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key.toLowerCase().slice(0, 20))) return val;
  }
  return "I can help analyze vessel assignments, run scenarios, compare voyages, and check port congestion. Try asking about the optimal assignment or a specific what-if scenario!";
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useApi, setUseApi] = useState(false);
  const [apiChecked, setApiChecked] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Check if API is available
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.ok && setUseApi(true))
      .catch(() => setUseApi(false))
      .finally(() => setApiChecked(true));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToApi = useCallback(async (text: string, history: { role: string; content: string }[]) => {
    const msgId = (Date.now() + 1).toString();
    let content = '';

    try {
      // Try streaming first
      for await (const chunk of streamChat(text, history)) {
        content += chunk;
        setMessages((m) => {
          const existing = m.find((msg) => msg.id === msgId);
          if (existing) {
            return m.map((msg) => msg.id === msgId ? { ...msg, content } : msg);
          }
          return [...m, { id: msgId, role: 'assistant', content, timestamp: new Date() }];
        });
      }
    } catch {
      // Fallback to sync
      try {
        const res = await api.chatSync(text, history);
        content = res.response;
        setMessages((m) => [...m, { id: msgId, role: 'assistant', content, timestamp: new Date() }]);
      } catch {
        content = getMockResponse(text);
        setMessages((m) => [...m, { id: msgId, role: 'assistant', content, timestamp: new Date() }]);
      }
    }
    setIsTyping(false);
  }, []);

  const send = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);

    if (useApi) {
      const history = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      sendToApi(text, history);
    } else {
      setTimeout(() => {
        const resp: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getMockResponse(text),
          timestamp: new Date(),
        };
        setMessages((m) => [...m, resp]);
        setIsTyping(false);
      }, 1200);
    }
  }, [useApi, messages, sendToApi]);

  return (
    <aside className="w-[380px] border-l border-border bg-white flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="gradient-chat text-white px-4 py-3 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight">Maritime Assistant</p>
          <p className="text-[10px] text-sky-200">Powered by Claude</p>
        </div>
        {apiChecked && (
          <div className="flex items-center gap-1 text-[10px]" title={useApi ? 'Connected to API' : 'Using mock data'}>
            {useApi ? <Wifi className="w-3 h-3 text-teal-300" /> : <WifiOff className="w-3 h-3 text-sky-300/50" />}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-ocean-500 text-white rounded-br-sm'
                    : 'bg-cloud text-navy-900 border border-border rounded-bl-sm'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-navy-900">{children}</strong>,
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-2">
                          <table className="text-[11px] w-full border-collapse">{children}</table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="text-left px-2 py-1 border-b border-border font-semibold text-text-secondary text-[10px] uppercase">{children}</th>
                      ),
                      td: ({ children }) => (
                        <td className="px-2 py-1 border-b border-border/50">{children}</td>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-text-secondary text-xs"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing...</span>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestedPrompts.slice(0, 4).map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-[11px] px-2.5 py-1.5 rounded-full bg-sky-100/60 text-ocean-600 hover:bg-sky-100 transition-colors border border-sky-400/20"
            >
              <Sparkles className="w-3 h-3 inline mr-1 opacity-60" />
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about voyages, scenarios..."
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-cloud focus:outline-none focus:ring-2 focus:ring-ocean-500/30 focus:border-ocean-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 rounded-lg bg-ocean-500 text-white flex items-center justify-center hover:bg-ocean-600 disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
