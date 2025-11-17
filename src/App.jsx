import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

// Firebase Configuration - Replace with your config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Global Constants
const MONTHLY_BUDGET = 30000;
const DAILY_SAVING_GOAL = 1000;
const USER_AVG_THRESHOLD = 500;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Core Logic Functions
const calculateRippleScore = (amount) => Math.round((amount / MONTHLY_BUDGET) * 100);
const calculateGoalDelay = (amount) => Math.round(amount / DAILY_SAVING_GOAL);
const calculateStressImpact = (amount) => amount > USER_AVG_THRESHOLD ? 2 : 1;
const calculateSavingSuggestion = (amount) => amount * 5;

// Mood Component
const MoodSelector = ({ selectedMood, onMoodChange }) => {
  const moods = [
    { emoji: '🙂', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😫', label: 'Stressed', value: 'stressed' },
    { emoji: '🤯', label: 'Overwhelmed', value: 'overwhelmed' }
  ];

  return (
    <div className="flex justify-between space-x-2 my-6">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onMoodChange(mood.value)}
          className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-200 ${
            selectedMood === mood.value
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg transform scale-110'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <span className="text-3xl mb-2">{mood.emoji}</span>
          <span className="text-xs font-medium">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ expenses, onNavigate, totalSpent, totalRippleScore }) => {
  const budgetLeft = MONTHLY_BUDGET - totalSpent;
  const budgetPercentage = (totalSpent / MONTHLY_BUDGET) * 100;

  // Calculate weekly data (mock for now)
  const weeklyData = [
    { week: 'Week 1', score: 15 },
    { week: 'Week 2', score: 25 },
    { week: 'Week 3', score: 18 },
    { week: 'Week 4', score: 32 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">RipplePay</h1>
          <button
            onClick={() => onNavigate('insights')}
            className="text-white hover:text-purple-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Metrics Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card-dark">
            <h3 className="text-lg font-semibold mb-4">Monthly Budget Left</h3>
            <div className="text-3xl font-bold mb-4">₹{budgetLeft.toLocaleString()}</div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-yellow-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-300">{budgetPercentage.toFixed(1)}% spent</div>
          </div>

          <div className="card-dark">
            <h3 className="text-lg font-semibold mb-4">Total Ripple Impact</h3>
            <div className="text-3xl font-bold text-purple-400">{totalRippleScore}</div>
            <div className="text-sm text-gray-300 mt-2">Score across all expenses</div>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="card-dark mb-8">
          <h3 className="text-lg font-semibold mb-6">Weekly Ripple Impact</h3>
          <div className="flex items-end justify-between h-32">
            {weeklyData.map((data, index) => (
              <div key={data.week} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t-lg w-16 transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(data.score / 35) * 100}%` }}
                />
                <div className="text-xs text-gray-300 mt-2">{data.week}</div>
                <div className="text-xs text-purple-400">{data.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('add-expense')}
            className="btn-primary text-xl px-8 py-4"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Expense Component
const AddExpense = ({ onNavigate, onAddExpense }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [reason, setReason] = useState('');
  const [mood, setMood] = useState('happy');

  const categories = ['Food', 'Travel', 'Snacking', 'Shopping', 'Utilities', 'Entertainment', 'Impulse', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    const expense = {
      amount: parseFloat(amount),
      category,
      reason,
      mood,
      timestamp: new Date().toISOString(),
      rippleScore: calculateRippleScore(parseFloat(amount)),
      goalDelay: calculateGoalDelay(parseFloat(amount)),
      stressImpact: calculateStressImpact(parseFloat(amount)),
      savingSuggestion: calculateSavingSuggestion(parseFloat(amount))
    };

    onAddExpense(expense);
    onNavigate('ripple-result', { expense });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add Expense</h2>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling?</label>
              <MoodSelector selectedMood={mood} onMoodChange={setMood} />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Explain Reason (Optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Why did you make this purchase?"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Ripple Result Component
const RippleResult = ({ expense, onNavigate }) => {
  const [showRipple, setShowRipple] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowRipple(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden ${showRipple ? 'ripple-container' : ''}`}>
      {/* Ripple Animation */}
      {showRipple && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, rgba(99, 102, 241, ${0.3 + (expense.amount / 1000)}) 0%, transparent 70%)`
          }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Your Ripple Effect</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Goal Delay */}
          <div className="card-dark border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Goal Delay</h3>
                <p className="text-sm text-gray-400">Days your goal is pushed back</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-400">{expense.goalDelay} days</div>
          </div>

          {/* Budget Impact */}
          <div className="card-dark border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Budget Impact</h3>
                <p className="text-sm text-gray-400">Percentage of monthly budget</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{expense.rippleScore}%</div>
          </div>

          {/* Stress Impact */}
          <div className="card-dark border-l-4 border-orange-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Stress Impact</h3>
                <p className="text-sm text-gray-400">Financial stress level</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-400">
              {expense.stressImpact === 2 ? 'High' : 'Low'}
            </div>
          </div>

          {/* Better Choice */}
          <div className="card-dark border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Better Choice</h3>
                <p className="text-sm text-gray-400">Skip 5 similar purchases</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400">₹{expense.savingSuggestion.toLocaleString()}</div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Insights Component
const Insights = ({ expenses, onNavigate }) => {
  // Calculate insights
  const totalStressScore = expenses.reduce((sum, exp) => sum + exp.stressImpact, 0);
  
  const categoryBreakdown = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const biggestCategory = Object.entries(categoryBreakdown).reduce((max, [cat, amount]) => 
    amount > max.amount ? { category: cat, amount } : max, 
    { category: 'None', amount: 0 }
  );

  const biggestCategoryPercentage = ((biggestCategory.amount / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(1);

  // Mock trend data
  const trendData = [
    { month: 'Jan', score: 45 },
    { month: 'Feb', score: 52 },
    { month: 'Mar', score: 38 },
    { month: 'Apr', score: 65 },
    { month: 'May', score: 48 },
    { month: 'Jun', score: 72 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Insights</h2>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Total Stress Score</h3>
            <div className="text-3xl font-bold text-orange-500">{totalStressScore}</div>
            <div className="text-sm text-gray-600 mt-2">Accumulated stress impact</div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Biggest Ripple Category</h3>
            <div className="text-3xl font-bold text-purple-600">{biggestCategory.category}</div>
            <div className="text-sm text-gray-600 mt-2">{biggestCategoryPercentage}% of spending</div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-6">Spending by Category</h3>
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([category, amount]) => {
              const percentage = (amount / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm text-gray-600">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Behavior Message */}
        <div className="card bg-gradient-to-r from-purple-100 to-indigo-100 mb-8">
          <h3 className="text-lg font-semibold mb-4">Your Spending Pattern</h3>
          <p className="text-gray-700">
            {biggestCategory.category === 'Food' && "Most of your ripple comes from food expenses. Consider meal planning to reduce impulse purchases."}
            {biggestCategory.category === 'Shopping' && "Your biggest ripple is from shopping. Try implementing a 24-hour waiting period for non-essential purchases."}
            {biggestCategory.category === 'Entertainment' && "Entertainment is your main expense category. Look for free or low-cost alternatives to reduce your ripple."}
            {biggestCategory.category === 'Impulse' && "Impulse buying is creating significant ripples. Try the envelope method or budget tracking apps."}
            {biggestCategory.category === 'Other' && "Your spending is well-distributed. Focus on reducing high-stress impact purchases."}
          </p>
        </div>

        {/* Trend Graph */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-6">Ripple Impact Trend</h3>
          <div className="flex items-end justify-between h-32">
            {trendData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-gradient-to-t from-purple-500 to-indigo-500 rounded-t-lg w-16 transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(data.score / 80) * 100}%` }}
                />
                <div className="text-xs text-gray-600 mt-2">{data.month}</div>
                <div className="text-xs text-purple-600">{data.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });

    return unsubscribe;
  }, []);

  // Load expenses from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'expenses'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseData = snapshot.docs.map(doc => doc.data());
      setExpenses(expenseData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Calculate totals
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalRippleScore = expenses.reduce((sum, exp) => sum + exp.rippleScore, 0);

  // Add expense to Firestore
  const handleAddExpense = async (expense) => {
    if (!user) return;

    try {
      await setDoc(doc(collection(db, 'users', user.uid, 'expenses')), expense);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  // Navigation handler
  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading RipplePay...</div>
      </div>
    );
  }

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            expenses={expenses}
            onNavigate={handleNavigate}
            totalSpent={totalSpent}
            totalRippleScore={totalRippleScore}
          />
        );
      case 'add-expense':
        return (
          <AddExpense
            onNavigate={handleNavigate}
            onAddExpense={handleAddExpense}
          />
        );
      case 'ripple-result':
        return (
          <RippleResult
            expense={expenses[0]} // Most recent expense
            onNavigate={handleNavigate}
          />
        );
      case 'insights':
        return (
          <Insights
            expenses={expenses}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <Dashboard
            expenses={expenses}
            onNavigate={handleNavigate}
            totalSpent={totalSpent}
            totalRippleScore={totalRippleScore}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}
