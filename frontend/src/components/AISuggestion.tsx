import { useState, useEffect } from 'react';

interface QuestionSuggestion {
  id: string;  
  question: string;
  category: string;
}

interface AISuggestionProps {
  onQuestionSelect?: (question: string) => void;
}

export const AISuggestion = ({ onQuestionSelect }: AISuggestionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [suggestions, setSuggestions] = useState<QuestionSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = [
    { id: 'icebreakers', name: '🧊 Ice Breakers', emoji: '🧊', description: 'Easy conversation starters' },
    { id: 'hobbies', name: '🎮 Hobbies & Interests', emoji: '🎮', description: 'Talk about passions' },
    { id: 'travel', name: '✈️ Travel & Culture', emoji: '✈️', description: 'Explore places & traditions' },
    { id: 'food', name: '🍕 Food & Cooking', emoji: '🍕', description: 'Share culinary experiences' },
    { id: 'entertainment', name: '🎬 Entertainment', emoji: '🎬', description: 'Movies, music & shows' },
    { id: 'goals', name: '🎯 Goals & Dreams', emoji: '🎯', description: 'Future aspirations' },
    { id: 'fun', name: '🎲 Fun & Random', emoji: '🎲', description: 'Light-hearted questions' },
    { id: 'deep', name: '🤔 Deep Thoughts', emoji: '🤔', description: 'Meaningful conversations' }
  ];

  const generateSuggestions = async (category: string) => {
    setLoading(true);
    setShowSuggestions(true);
    
    // Simulate AI API call - in real implementation, this would call your AI service
    setTimeout(() => {
      const questionBank: Record<string, string[]> = {
        icebreakers: [
          "What's the most interesting thing that happened to you this week?",
          "If you could have any superpower, what would it be and why?",
          "What's something you're passionate about that most people don't know?",
          "What's the best advice you've ever received?",
          "If you could travel anywhere right now, where would you go?"
        ],
        hobbies: [
          "What hobbies do you enjoy in your free time?",
          "Is there a skill you've always wanted to learn?",
          "What's your favorite way to relax after a long day?",
          "Do you prefer indoor or outdoor activities?",
          "What creative outlets do you enjoy?"
        ],
        travel: [
          "What's the most beautiful place you've ever visited?",
          "If you could live in any country for a year, where would it be?",
          "What's on your travel bucket list?",
          "Do you prefer beaches, mountains, or cities?",
          "What's the most interesting food you've tried while traveling?"
        ],
        food: [
          "What's your comfort food that always makes you feel better?",
          "Can you cook? What's your specialty dish?",
          "What's the weirdest food combination you actually enjoy?",
          "Sweet or savory - what's your go-to?",
          "What's a food you could never give up?"
        ],
        entertainment: [
          "What's the last movie that really impressed you?",
          "What type of music do you listen to when you're happy?",
          "Do you prefer books or movies? Why?",
          "What's your favorite way to spend a weekend evening?",
          "Any TV shows you're currently hooked on?"
        ],
        goals: [
          "What's something you want to achieve this year?",
          "Where do you see yourself in 5 years?",
          "What's a dream you're actively working towards?",
          "What personal growth are you most proud of?",
          "What would you do if you knew you couldn't fail?"
        ],
        fun: [
          "What's your most useless talent?",
          "If animals could talk, which species would be the rudest?",
          "What's a silly fear you have?",
          "If you were a potato, what way would you want to be cooked?",
          "What's the weirdest dream you've ever had?"
        ],
        deep: [
          "What does happiness mean to you?",
          "What's a lesson that took you too long to learn?",
          "What do you value most in friendships?",
          "What's something you wish more people understood?",
          "How do you define success in life?"
        ]
      };

      const categoryQuestions = questionBank[category] || [];
      const formattedSuggestions = categoryQuestions.map((q, index) => ({
        question: q,
        category: category,
        id: `${category}-${index}`
      }));

      setSuggestions(formattedSuggestions);
      setLoading(false);
    }, 800); // Simulate network delay
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    generateSuggestions(categoryId);
  };

  const handleQuestionClick = (question: string) => {
    if (onQuestionSelect) {
      onQuestionSelect(question);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        {/* Toggle Button */}
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="w-full p-4 text-white hover:bg-white/20 transition-all rounded-t-2xl flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <span className="font-medium">AI Questions</span>
          </div>
          <svg 
            className={`w-4 h-4 text-white transition-transform ${showSuggestions ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Content Panel */}
        {showSuggestions && (
          <div className="p-4 max-w-sm">
            {!selectedCategory ? (
              /* Categories Grid */
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    disabled={loading}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{category.emoji}</span>
                      <span className="text-white text-sm font-medium">{category.name}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{category.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              /* Questions List */
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium flex items-center space-x-2">
                    <span>{categories.find(c => c.id === selectedCategory)?.emoji}</span>
                    <span>{categories.find(c => c.id === selectedCategory)?.name}</span>
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSuggestions([]);
                    }}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    ← Back
                  </button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="ml-2 text-gray-300 text-sm">Generating questions...</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleQuestionClick(suggestion.question)}
                        className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-left group"
                      >
                        <p className="text-white text-sm group-hover:text-purple-300 transition-colors">
                          {suggestion.question}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
