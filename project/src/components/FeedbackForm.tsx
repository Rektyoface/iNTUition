import React, { useState } from 'react';
import { Star } from 'lucide-react';
import type { Feedback, FeedbackCategory } from '../types';

interface FeedbackFormProps {
  messageId: string;
  onSubmit: (feedback: Feedback) => void;
}

const IMPROVEMENT_CATEGORIES: FeedbackCategory[] = [
  { id: 'accuracy', label: 'Response Accuracy' },
  { id: 'clarity', label: 'Clarity of Explanation' },
  { id: 'relevance', label: 'Relevance to Question' },
  { id: 'completeness', label: 'Completeness of Answer' },
];

export function FeedbackForm({ messageId, onSubmit }: FeedbackFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      messageId,
      rating,
      categories: selectedCategories,
      comment,
    });
    setIsExpanded(false);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        Rate this response
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          How helpful was this response?
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  value <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          What could be improved?
        </label>
        <div className="flex flex-wrap gap-2">
          {IMPROVEMENT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategories.includes(category.id)
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Additional comments
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 focus:border-green-500 focus:ring focus:ring-green-200 dark:focus:ring-green-900 focus:ring-opacity-50 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Share your thoughts..."
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Submit Feedback
        </button>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}