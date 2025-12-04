"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Target,
  LayoutList,
  ArrowUpDown,
  Search,
  GitBranch,
  Network,
  Hash,
  Link2,
  Sparkles,
  Leaf,
  Flame,
  Trophy,
  ThumbsUp,
  BookOpen,
  CheckCircle,
  XCircle,
  Lightbulb,
  RotateCcw,
  Beaker,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type Difficulty = "easy" | "medium" | "hard";
type Category = "arrays" | "sorting" | "searching" | "trees" | "graphs" | "hashing" | "linked-lists" | "all";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

interface QuizState {
  questions: Question[];
  currentIndex: number;
  selectedAnswer: number | null;
  showResult: boolean;
  score: number;
  answers: (number | null)[];
  isComplete: boolean;
}

const CATEGORIES: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All Topics", icon: <Target className="w-6 h-6" /> },
  { value: "arrays", label: "Arrays", icon: <LayoutList className="w-6 h-6" /> },
  { value: "sorting", label: "Sorting", icon: <ArrowUpDown className="w-6 h-6" /> },
  { value: "searching", label: "Searching", icon: <Search className="w-6 h-6" /> },
  { value: "trees", label: "Trees", icon: <GitBranch className="w-6 h-6" /> },
  { value: "graphs", label: "Graphs", icon: <Network className="w-6 h-6" /> },
  { value: "hashing", label: "Hashing", icon: <Hash className="w-6 h-6" /> },
  { value: "linked-lists", label: "Linked Lists", icon: <Link2 className="w-6 h-6" /> },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

export default function QuizPage() {
  const { isDark, toggleTheme } = useTheme();
  
  // Quiz setup state
  const [category, setCategory] = useState<Category>("all");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    showResult: false,
    score: 0,
    answers: [],
    isComplete: false,
  });

  // Generate quiz questions
  const generateQuiz = useCallback(async () => {
    setIsGenerating(true);
    
    const categoryPrompt = category === "all" 
      ? "various data structures and algorithms topics including arrays, sorting, searching, trees, graphs, hashing, and linked lists"
      : `${category.replace("-", " ")}`;
    
    const difficultyPrompts = {
      easy: "beginner-friendly, focusing on basic concepts and simple implementations",
      medium: "intermediate level, including time/space complexity and common variations",
      hard: "advanced, including edge cases, optimizations, and tricky implementation details",
    };

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate exactly ${questionCount} multiple choice quiz questions about ${categoryPrompt} in data structures and algorithms.

Difficulty level: ${difficultyPrompts[difficulty]}

IMPORTANT: Return ONLY a valid JSON array with no markdown formatting, no code blocks, no extra text. Just the raw JSON.

Each question object must have this exact structure:
{
  "question": "The question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Brief explanation of why this answer is correct",
  "category": "topic name"
}

Rules:
- Each question must have exactly 4 options
- correctIndex must be 0, 1, 2, or 3 (the index of the correct answer)
- Questions should test understanding, not just memorization
- Include a mix of conceptual and practical questions
- Make wrong answers plausible but clearly incorrect
- Keep explanations concise (1-2 sentences)

Return ONLY the JSON array, starting with [ and ending with ]`,
        }),
      });

      const data = await response.json();
      let questions: Question[] = [];
      
      try {
        // Try to parse the explanation as JSON
        let jsonStr = data.explanation || "";
        
        // Remove markdown code blocks if present
        jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        
        // Find the JSON array in the response
        const startIndex = jsonStr.indexOf("[");
        const endIndex = jsonStr.lastIndexOf("]");
        
        if (startIndex !== -1 && endIndex !== -1) {
          jsonStr = jsonStr.substring(startIndex, endIndex + 1);
        }
        
        const parsed = JSON.parse(jsonStr);
        
        if (Array.isArray(parsed)) {
          questions = parsed.map((q: Partial<Question>, idx: number) => ({
            id: idx + 1,
            question: q.question || `Question ${idx + 1}`,
            options: Array.isArray(q.options) && q.options.length === 4 
              ? q.options 
              : ["Option A", "Option B", "Option C", "Option D"],
            correctIndex: typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex <= 3 
              ? q.correctIndex 
              : 0,
            explanation: q.explanation || "No explanation provided.",
            category: q.category || category,
          }));
        }
      } catch (parseError) {
        console.error("Failed to parse quiz questions:", parseError);
        // Generate fallback questions
        questions = generateFallbackQuestions(questionCount, category);
      }

      if (questions.length === 0) {
        questions = generateFallbackQuestions(questionCount, category);
      }

      setQuizState({
        questions,
        currentIndex: 0,
        selectedAnswer: null,
        showResult: false,
        score: 0,
        answers: new Array(questions.length).fill(null),
        isComplete: false,
      });
      setQuizStarted(true);
    } catch (error) {
      console.error("Quiz generation error:", error);
      // Use fallback questions on error
      const fallbackQuestions = generateFallbackQuestions(questionCount, category);
      setQuizState({
        questions: fallbackQuestions,
        currentIndex: 0,
        selectedAnswer: null,
        showResult: false,
        score: 0,
        answers: new Array(fallbackQuestions.length).fill(null),
        isComplete: false,
      });
      setQuizStarted(true);
    } finally {
      setIsGenerating(false);
    }
  }, [category, difficulty, questionCount]);

  // Fallback questions if AI fails
  const generateFallbackQuestions = (count: number, cat: Category): Question[] => {
    const allQuestions: Question[] = [
      {
        id: 1,
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctIndex: 0,
        explanation: "Array access by index is O(1) because arrays store elements in contiguous memory locations.",
        category: "arrays",
      },
      {
        id: 2,
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: ["Bubble Sort - O(n²)", "Quick Sort - O(n log n)", "Selection Sort - O(n²)", "Insertion Sort - O(n²)"],
        correctIndex: 1,
        explanation: "Quick Sort has an average time complexity of O(n log n), making it one of the fastest comparison-based sorting algorithms.",
        category: "sorting",
      },
      {
        id: 3,
        question: "What data structure does Dijkstra's algorithm typically use?",
        options: ["Stack", "Queue", "Priority Queue (Min-Heap)", "Linked List"],
        correctIndex: 2,
        explanation: "Dijkstra's algorithm uses a priority queue to always process the vertex with the smallest known distance.",
        category: "graphs",
      },
      {
        id: 4,
        question: "What is the worst-case time complexity of binary search?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctIndex: 2,
        explanation: "Binary search divides the search space in half each time, resulting in O(log n) time complexity.",
        category: "searching",
      },
      {
        id: 5,
        question: "In a balanced binary search tree, what is the height?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctIndex: 1,
        explanation: "A balanced BST maintains a height of O(log n) to ensure efficient operations.",
        category: "trees",
      },
      {
        id: 6,
        question: "What is the average time complexity for hash table lookup?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctIndex: 2,
        explanation: "Hash tables provide O(1) average-case lookup by using a hash function to directly compute the index.",
        category: "hashing",
      },
      {
        id: 7,
        question: "What is the time complexity of inserting at the beginning of a singly linked list?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctIndex: 0,
        explanation: "Inserting at the head of a linked list is O(1) because we only need to update the head pointer.",
        category: "linked-lists",
      },
      {
        id: 8,
        question: "Which traversal visits nodes in the order: left, root, right?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        correctIndex: 1,
        explanation: "Inorder traversal visits the left subtree, then the root, then the right subtree.",
        category: "trees",
      },
      {
        id: 9,
        question: "What causes hash collisions?",
        options: ["Empty hash table", "Two keys hashing to the same index", "Using a prime table size", "Linear probing"],
        correctIndex: 1,
        explanation: "Collisions occur when different keys produce the same hash value and map to the same index.",
        category: "hashing",
      },
      {
        id: 10,
        question: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 2,
        explanation: "Merge sort requires O(n) extra space for the temporary arrays used during merging.",
        category: "sorting",
      },
    ];

    const filtered = cat === "all" 
      ? allQuestions 
      : allQuestions.filter(q => q.category === cat);
    
    // If not enough questions in category, add from all
    let result = [...filtered];
    if (result.length < count) {
      const additional = allQuestions.filter(q => !result.includes(q));
      result = [...result, ...additional];
    }

    return result.slice(0, count).map((q, idx) => ({ ...q, id: idx + 1 }));
  };

  // Select an answer
  const selectAnswer = (index: number) => {
    if (quizState.showResult) return;
    setQuizState(prev => ({ ...prev, selectedAnswer: index }));
  };

  // Submit answer and show result
  const submitAnswer = () => {
    if (quizState.selectedAnswer === null) return;
    
    const isCorrect = quizState.selectedAnswer === quizState.questions[quizState.currentIndex].correctIndex;
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIndex] = quizState.selectedAnswer;
    
    setQuizState(prev => ({
      ...prev,
      showResult: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: newAnswers,
    }));
  };

  // Go to next question
  const nextQuestion = () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedAnswer: prev.answers[prev.currentIndex + 1],
        showResult: prev.answers[prev.currentIndex + 1] !== null,
      }));
    } else {
      setQuizState(prev => ({ ...prev, isComplete: true }));
    }
  };

  // Go to previous question
  const prevQuestion = () => {
    if (quizState.currentIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        selectedAnswer: prev.answers[prev.currentIndex - 1],
        showResult: prev.answers[prev.currentIndex - 1] !== null,
      }));
    }
  };

  // Restart quiz
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizState({
      questions: [],
      currentIndex: 0,
      selectedAnswer: null,
      showResult: false,
      score: 0,
      answers: [],
      isComplete: false,
    });
  };

  // Get score color
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const currentQuestion = quizState.questions[quizState.currentIndex];
  const scorePercentage = quizState.questions.length > 0 
    ? Math.round((quizState.score / quizState.questions.length) * 100) 
    : 0;

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 text-slate-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 p-4 border-b backdrop-blur-sm ${isDark ? 'border-cyan-500/20 bg-slate-900/90' : 'border-slate-300 bg-white/90'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className={`transition-colors flex items-center gap-2 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
              <FileText className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              DSA Quiz
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {quizStarted && !quizState.isComplete && (
              <>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Question {quizState.currentIndex + 1} / {quizState.questions.length}
                </span>
                <span className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  Score: {quizState.score}
                </span>
              </>
            )}
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {!quizStarted ? (
          /* Quiz Setup */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Test Your Knowledge</h2>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Challenge yourself with AI-generated questions on data structures and algorithms
              </p>
            </div>

            {/* Category Selection */}
            <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-white border-slate-300 shadow-sm'}`}>
              <h3 className={`font-semibold mb-4 text-lg flex items-center gap-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                <BookOpen className="w-5 h-5" />
                Select Topic
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      category === cat.value
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                        : isDark 
                          ? "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="block mb-1 flex justify-center">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-white border-slate-300 shadow-sm'}`}>
              <h3 className={`font-semibold mb-4 text-lg flex items-center gap-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                <Target className="w-5 h-5" />
                Difficulty
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      difficulty === diff
                        ? diff === "easy" 
                          ? "border-green-500 bg-green-500/20 text-green-400"
                          : diff === "medium"
                          ? "border-yellow-500 bg-yellow-500/20 text-yellow-400"
                          : "border-red-500 bg-red-500/20 text-red-400"
                        : isDark 
                          ? "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="block mb-1 flex justify-center">
                      {diff === "easy" ? <Leaf className="w-6 h-6" /> : diff === "medium" ? <Sparkles className="w-6 h-6" /> : <Flame className="w-6 h-6" />}
                    </span>
                    <span className="text-sm font-medium capitalize">{diff}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-white border-slate-300 shadow-sm'}`}>
              <h3 className={`font-semibold mb-4 text-lg flex items-center gap-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                <Hash className="w-5 h-5" />
                Number of Questions
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      questionCount === count
                        ? "border-purple-500 bg-purple-500/20 text-purple-400"
                        : isDark 
                          ? "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl font-bold block">{count}</span>
                    <span className="text-xs">questions</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={generateQuiz}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Quiz...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Start Quiz
                </>
              )}
            </button>
          </div>
        ) : quizState.isComplete ? (
          /* Quiz Complete */
          <div className="space-y-6">
            <div className={`text-center rounded-xl border p-8 ${isDark ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-white border-slate-300 shadow-sm'}`}>
              <div className="mb-4 flex justify-center">
                {scorePercentage >= 80 ? (
                  <Trophy className="w-16 h-16 text-yellow-400" />
                ) : scorePercentage >= 60 ? (
                  <ThumbsUp className="w-16 h-16 text-cyan-400" />
                ) : (
                  <BookOpen className="w-16 h-16 text-purple-400" />
                )}
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quiz Complete!</h2>
              <p className={`text-5xl font-bold ${getScoreColor(scorePercentage)} mb-2`}>
                {quizState.score} / {quizState.questions.length}
              </p>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {scorePercentage}% Correct
              </p>
              <p className={`mt-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {scorePercentage >= 80 
                  ? "Excellent work! You really know your stuff!"
                  : scorePercentage >= 60 
                  ? "Good job! Keep practicing to improve!"
                  : "Keep studying! Practice makes perfect!"}
              </p>
            </div>

            {/* Review Answers */}
            <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-white border-slate-300 shadow-sm'}`}>
              <h3 className={`font-semibold mb-4 text-lg flex items-center gap-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                <FileText className="w-5 h-5" />
                Review Answers
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {quizState.questions.map((q, idx) => {
                  const userAnswer = quizState.answers[idx];
                  const isCorrect = userAnswer === q.correctIndex;
                  
                  return (
                    <div 
                      key={q.id}
                      className={`p-4 rounded-lg border ${
                        isCorrect 
                          ? "border-green-500/50 bg-green-500/10" 
                          : "border-red-500/50 bg-red-500/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium mb-2">
                            {idx + 1}. {q.question}
                          </p>
                          <p className="text-sm text-slate-400 mb-1">
                            Your answer: <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                              {userAnswer !== null ? q.options[userAnswer] : "Not answered"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-400">
                              Correct: {q.options[q.correctIndex]}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 mt-2 italic">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={restartQuiz}
                className="py-3 bg-slate-800 border border-cyan-500/50 rounded-xl text-cyan-400 font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Quiz
              </button>
              <Link
                href="/sandbox"
                className="py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-semibold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Beaker className="w-4 h-4" />
                Practice in Sandbox
              </Link>
            </div>
          </div>
        ) : (
          /* Quiz Question */
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((quizState.currentIndex + 1) / quizState.questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 overflow-hidden">
                {/* Question Header */}
                <div className="px-6 py-4 bg-slate-800/50 border-b border-cyan-500/20 flex items-center justify-between">
                  <span className="text-cyan-400 text-sm font-medium">
                    Question {quizState.currentIndex + 1} of {quizState.questions.length}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                    {currentQuestion.category}
                  </span>
                </div>

                {/* Question Text */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    {currentQuestion.question}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = quizState.selectedAnswer === idx;
                      const isCorrect = idx === currentQuestion.correctIndex;
                      const showCorrect = quizState.showResult && isCorrect;
                      const showWrong = quizState.showResult && isSelected && !isCorrect;

                      return (
                        <button
                          key={idx}
                          onClick={() => selectAnswer(idx)}
                          disabled={quizState.showResult}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                            showCorrect
                              ? "border-green-500 bg-green-500/20 text-green-400"
                              : showWrong
                              ? "border-red-500 bg-red-500/20 text-red-400"
                              : isSelected
                              ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                              : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                          }`}
                        >
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            showCorrect
                              ? "bg-green-500 text-white"
                              : showWrong
                              ? "bg-red-500 text-white"
                              : isSelected
                              ? "bg-cyan-500 text-white"
                              : "bg-slate-700 text-slate-400"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                          {showWrong && <XCircle className="w-5 h-5 text-red-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {quizState.showResult && (
                    <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Explanation
                      </h4>
                      <p className="text-slate-300 text-sm">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-slate-800/30 border-t border-cyan-500/20 flex items-center justify-between">
                  <button
                    onClick={prevQuestion}
                    disabled={quizState.currentIndex === 0}
                    className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {!quizState.showResult ? (
                    <button
                      onClick={submitAnswer}
                      disabled={quizState.selectedAnswer === null}
                      className="px-6 py-2 rounded-lg bg-cyan-500 text-white font-semibold hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      {quizState.currentIndex === quizState.questions.length - 1 
                        ? "See Results" 
                        : "Next Question"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Question Navigator */}
            <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 p-4">
              <h4 className="text-slate-400 text-sm mb-3">Question Navigator</h4>
              <div className="flex flex-wrap gap-2">
                {quizState.questions.map((_, idx) => {
                  const isAnswered = quizState.answers[idx] !== null;
                  const isCurrent = idx === quizState.currentIndex;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuizState(prev => ({
                          ...prev,
                          currentIndex: idx,
                          selectedAnswer: prev.answers[idx],
                          showResult: prev.answers[idx] !== null,
                        }));
                      }}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        isCurrent
                          ? "bg-cyan-500 text-white"
                          : isAnswered
                          ? "bg-purple-500/30 text-purple-400 border border-purple-500/50"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
