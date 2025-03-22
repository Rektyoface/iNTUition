import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatState } from './types'; // adjust import if needed
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Bot, Sun, Moon } from 'lucide-react';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const responses: { keywords: string[], reply: string }[] = [
    {
      keywords: ["change management"],
      reply: `Change management is the discipline that guides how we prepare, equip, and support individuals to successfully adopt change. It includes individual change management, organizational change management, and enterprise change capability. It ensures people-side success of strategic, process, system, or cultural changes.`
    },
    {
      keywords: ["kotter"],
      reply: `Kotter's 8-Step Model for Leading Change includes: 1) Create urgency, 2) Form a powerful coalition, 3) Create a vision for change, 4) Communicate the vision, 5) Remove obstacles, 6) Create short-term wins, 7) Build on the change, and 8) Anchor changes in corporate culture.`
    },
    {
      keywords: ["lewin"],
      reply: `Lewin's model includes: 1) Unfreeze – preparing people for change, 2) Change – implementing the new way, 3) Refreeze – solidifying the change into culture. It's useful for understanding emotional stages of transformation.`
    },
    {
      keywords: ["adkar"],
      reply: `The ADKAR model stands for Awareness, Desire, Knowledge, Ability, and Reinforcement. It focuses on individual transitions to drive organizational change, ensuring people adopt and sustain new behaviors or systems.`
    },
    {
      keywords: ["types of change", "kinds of change"],
      reply: `Types of change include strategic, operational, people-centric, transformational, and incremental. Each type requires different management approaches depending on its complexity, urgency, and impact.`
    },
    {
      keywords: ["resistance"],
      reply: `Resistance to change is natural and stems from fear, confusion, or loss of control. Address it with empathy, communication, involvement, support, and early wins to build confidence.`
    },
    {
      keywords: ["fatigue"],
      reply: `Change fatigue occurs when too many initiatives happen too quickly. It leads to burnout and disengagement. To reduce it, prioritize changes, space them out, and maintain clear communication.`
    },
    {
      keywords: ["digital transformation"],
      reply: `Digital transformation is not just about adopting tools—it's about rethinking how your business delivers value through tech. Success requires leadership alignment, cultural readiness, employee upskilling, and continuous adaptation.`
    },
    {
      keywords: ["leadership"],
      reply: `Leaders must model the change, communicate the vision, empower others, and stay visible throughout the journey. Leadership alignment is one of the strongest predictors of success in change initiatives.`
    },
    {
      keywords: ["middle managers"],
      reply: `Middle managers bridge strategic vision and daily operations. They must be equipped with communication skills, coaching tools, and support to lead their teams through ambiguity.`
    },
    {
      keywords: ["communication"],
      reply: `Communication during change should be transparent, two-way, empathetic, and consistent. Use multiple channels, answer the “why,” and keep people informed throughout the journey.`
    },
    {
      keywords: ["readiness"],
      reply: `Change readiness refers to how prepared an organization and its people are to implement and sustain change. It includes leadership alignment, cultural factors, communication plans, and available resources.`
    },
    {
      keywords: ["change agent"],
      reply: `Change agents champion change from within. They build trust, connect teams to leadership, listen empathetically, and remove roadblocks. They are crucial influencers, even without formal authority.`
    },
    {
      keywords: ["measuring success"],
      reply: `To measure change success, look at adoption rates, proficiency, engagement, and business outcomes. Surveys, KPIs, and feedback loops help reinforce progress and show impact.`
    },
    {
      keywords: ["sustain change"],
      reply: `To sustain change, integrate it into culture, align rewards and policies, continue leadership advocacy, and offer ongoing reinforcement. Sustainability turns a project into a new norm.`
    },
    {
      keywords: ["culture"],
      reply: `Culture is a key driver of successful change. Align values, behaviors, and systems. Reinforce desired mindsets through leadership modeling, hiring, and everyday habits.`
    },
    {
      keywords: ["team name"],
      reply: `Big O(n) Chungus 🐰 — the only team name with constant drip and logarithmic hype!`
    }
  ];

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(600);

    const lowerContent = content.toLowerCase();
    const matched = responses.find(({ keywords }) =>
      keywords.some((keyword) => lowerContent.includes(keyword))
    );

    const botReply = matched
      ? matched.reply
      : `I'm here to help with change management questions. Try asking about ADKAR, resistance, Kotter's model, or digital transformation.`;

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: botReply,
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
      isLoading: false,
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-3xl mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-green-500" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h1>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {chatState.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-lg">How can I help you today?</p>
            </div>
          </div>
        ) : (
          chatState.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {chatState.isLoading && (
          <div className="py-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 flex gap-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSendMessage} disabled={chatState.isLoading} />
    </div>
  );
}

export default App;
