import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatState } from './types'; // adjust import if needed
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Bot, Sun, Moon } from 'lucide-react';

/** 
 * Hugging Face Credentials
 * WARNING: Exposing your token in frontend code is not secure.
 * This is acceptable for quick demos, but not for production use.
 */
const HF_API_TOKEN = "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";
const HF_MODEL_ID = "mleekw/deepseek-adkar-qlora";

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  // Toggle for dark mode
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  // Sync dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  /** 
   * Main function to send user message to Hugging Face Inference API 
   * and receive the model's response.
   */
  const handleSendMessage = async (content: string) => {
    // Create a user message object
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };

    // Add user message to state
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      // Call the Hugging Face Inference API
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${HF_MODEL_ID}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: content }),
        }
      );

      const data = await response.json();

      // Extract the text from the model response
      let botReply = '';
      if (Array.isArray(data) && data[0]?.generated_text) {
        // For text-generation models returning an array
        botReply = data[0].generated_text;
      } else if (data.generated_text) {
        // For text2text-generation models returning an object
        botReply = data.generated_text;
      } else {
        // Fallback: raw JSON or error
        botReply = JSON.stringify(data);
      }

      // Create an assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botReply,
      };

      // Update chat with the bot's response
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error:', error);
      // If an error occurs, stop loading but don't add a bot message
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
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
