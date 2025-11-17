# 🐆 RipplePay - Emotional Finance Tracker

A hackathon-ready React application that visualizes the "ripple effect" of financial transactions on personal goals and stress levels.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Expense Tracking**: Add expenses with mood tracking
- **Ripple Impact Visualization**: See how each expense affects your financial goals
- **4 Key Metrics**: Budget Impact, Goal Delay, Stress Score, and Better Choice suggestions
- **Firebase Integration**: Persistent data storage with real-time updates

### 📱 Pages
1. **Dashboard**: Budget overview, ripple score, weekly trends
2. **Add Expense**: Intuitive form with mood selector
3. **Ripple Result**: Visual impact breakdown with animations
4. **Insights**: Analytics, spending patterns, behavioral insights

### 🎨 Design Features
- **Premium UI**: Gradient backgrounds, smooth animations, micro-interactions
- **Responsive Design**: Mobile-first, works seamlessly on all devices
- **Dark Mode**: Emphasis on ripple animations with high contrast
- **Interactive Elements**: Hover effects, transitions, scale transforms

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Firebase account (free tier is sufficient)

### Installation

1. **Clone and Setup**
```bash
git clone <your-repo>
cd ripplepay
npm install
```

2. **Firebase Configuration**
- Follow the detailed setup guide in `FIREBASE_SETUP.md`
- Get your Firebase config from the Firebase Console
- Update the `firebaseConfig` object in `src/App.jsx`

3. **Run the App**
```bash
npm run dev
```

4. **Open Browser**
Navigate to `http://localhost:5173` (or the URL shown in terminal)

## 📊 Core Logic Calculations

Every expense calculates four key metrics:

| Metric | Formula | Description |
|--------|---------|-------------|
| **Budget Impact** | `(amount / 30000) * 100` | % of monthly budget consumed |
| **Goal Delay** | `amount / 1000` | Days savings goal is pushed back |
| **Stress Impact** | `amount > 500 ? 2 : 1` | High/Low stress based on threshold |
| **Better Choice** | `amount * 5` | Potential savings from 5 skipped purchases |

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase Firestore (real-time database)
- **Authentication**: Firebase Auth (anonymous sign-in)
- **Build Tool**: Vite (fast development and optimized builds)

## 📁 Project Structure

```
ripplepay/
├── src/
│   ├── App.jsx          # Single-file React application
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind CSS + custom styles
├── public/
│   └── index.html       # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
├── FIREBASE_SETUP.md    # Detailed Firebase setup guide
└── README.md           # This file
```

## 🎯 Key Components

### Mood Selector
Interactive emoji-based mood tracking:
- 🙂 Happy
- 😐 Neutral  
- 😫 Stressed
- 🤯 Overwhelmed

### Ripple Animation
CSS-based ripple effect that scales based on expense amount:
- Larger expenses create bigger, more intense ripples
- Smooth 2-second animation with gradient effects
- Dark background for maximum visual impact

### Real-time Dashboard
- Live budget tracking with progress bars
- Weekly trend visualization
- Total ripple impact score
- Responsive grid layout

## 🔧 Configuration

### Global Constants (in `src/App.jsx`)
```javascript
const MONTHLY_BUDGET = 30000;      // Default monthly budget
const DAILY_SAVING_GOAL = 1000;    // Daily savings target
const USER_AVG_THRESHOLD = 500;    // Stress impact threshold
```

### Firebase Setup
1. Create Firebase project
2. Enable Anonymous Authentication
3. Set up Firestore Database
4. Configure security rules
5. Update config in `src/App.jsx`

## 🎨 Custom Design System

### Colors
- **Primary**: Indigo gradient (`indigo-600` to `indigo-700`)
- **Secondary**: Purple accents (`purple-600`)
- **Success**: Green (`green-500`)
- **Warning**: Yellow (`yellow-500`)
- **Danger**: Red (`red-500`)

### Components
- `.btn-primary`: Gradient button with hover effects
- `.btn-secondary`: White button with subtle borders
- `.card`: White rounded card with shadow
- `.card-dark`: Dark themed card for contrast

### Animations
- Custom ripple keyframes for expense impact
- Hover transforms on interactive elements
- Smooth transitions on all state changes

## 📱 Responsive Design

- **Mobile**: Single column layout, optimized touch targets
- **Tablet**: Two-column grids for metrics
- **Desktop**: Full multi-column layout with enhanced spacing

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🧪 Testing

### Manual Testing Checklist
1. **Authentication**: Anonymous sign-in works automatically
2. **Add Expense**: Form validation and submission
3. **Ripple Result**: Correct calculations and animations
4. **Dashboard**: Real-time updates and data persistence
5. **Insights**: Accurate analytics and visualizations
6. **Responsive**: Works on mobile, tablet, desktop

### Data Persistence Test
1. Add an expense
2. Navigate to different pages
3. Refresh the browser
4. Verify data is still present

## 🎯 Hackathon Tips

### Demo Strategy
1. **Start with Dashboard**: Show the impressive UI
2. **Add Expense**: Demonstrate mood tracking
3. **Ripple Result**: Highlight the visual impact
4. **Insights**: Show data analytics

### Key Talking Points
- **Emotional Finance**: Connects spending to feelings
- **Visual Impact**: Ripple effect makes consequences tangible
- **Real-time**: Live updates demonstrate modern tech
- **Behavioral Insights**: Helps users understand patterns

## 🤝 Contributing

This is a hackathon project designed for maximum impact. Feel free to:
- Extend the analytics features
- Add more mood categories
- Implement additional visualizations
- Enhance the mobile experience

## 📄 License

MIT License - feel free to use this project for learning or inspiration.

## 🎉 Acknowledgments

Built with ❤️ for hackathon season 2024-2025
- Firebase for real-time backend
- Tailwind CSS for beautiful UI
- Vite for lightning-fast development
- React for component-based architecture

---

**Ready to make some financial ripples?** 🌊 Start tracking your emotional spending today!
