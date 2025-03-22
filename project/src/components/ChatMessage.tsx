import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { Message, Feedback } from '../types';
import { FeedbackForm } from './FeedbackForm';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  const handleFeedbackSubmit = async (feedback: Feedback) => {
    try {
      // Send feedback to backend
      const response = await fetch('YOUR_API_ENDPOINT/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className={`py-8 ${isUser ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
      <div className="max-w-3xl mx-auto flex gap-6 px-4">
        <div className="w-8 h-8 flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          {!isUser && (
            <div className="mt-4">
              <FeedbackForm messageId={message.id} onSubmit={handleFeedbackSubmit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}