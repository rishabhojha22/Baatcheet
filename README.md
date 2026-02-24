# बातचीत (Baatcheet) - AI-Powered Video Chat Platform

A modern video chat application that connects strangers worldwide through face-to-face conversations, enhanced with AI-powered conversation suggestions and voice analysis.

<img width="1919" height="909" alt="Screenshot 2026-02-23 223726" src="https://github.com/user-attachments/assets/007be4df-9875-4492-80ec-7d2f66eb0c66" />
![Uploading Screenshot 2026-02-23 223909.png…]()
![Uploading Screenshot 2026-02-23 223937.png…]()
<img width="1919" height="912" alt="Screenshot 2026-02-23 224007" src="https://github.com/user-attachments/assets/0b538233-67db-4d26-ac81-573f14e90d24" />

## 🌟 Features

### Core Functionality
- **🎥 HD Video Chat** - Real-time peer-to-peer video connections using WebRTC
- **🔒 Secure & Private** - End-to-end encrypted connections with no data storage
- **⚡ Instant Matching** - Quick connection with random users worldwide
- **🤖 AI Conversation Assistant** - Smart question suggestions to keep conversations flowing
- **🎤 Voice Recording & Analysis** - Real-time transcription with AI-powered feedback on communication skills

### AI Question Categories
- **🧊 Ice Breakers** - Easy conversation starters
- **🎮 Hobbies & Interests** - Talk about passions and activities
- **✈️ Travel & Culture** - Explore places and traditions
- **🍕 Food & Cooking** - Share culinary experiences
- **🎬 Entertainment** - Movies, music, and shows
- **🎯 Goals & Dreams** - Future aspirations and ambitions
- **🎲 Fun & Random** - Light-hearted and playful questions
- **🤔 Deep Thoughts** - Meaningful and philosophical conversations

### Voice Analysis Features
- **🎙️ Real-time Transcription** - Live speech-to-text conversion during conversations
- **📊 Communication Scoring** - AI-powered 1-10 scale evaluation of communication skills
- **💡 Personalized Feedback** - Actionable insights on conversation strengths and areas for improvement
- **📈 Performance Metrics** - Speaking time, word count, and conversation quality analysis
- **🔒 Privacy-First** - Audio processed locally, only transcript sent for analysis

### User Experience
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🎨 Modern UI** - Beautiful gradient design with smooth animations
- **🔐 Authentication** - Secure user registration and login system
- **📊 Dashboard** - Personalized user dashboard after login
- **🚀 Fast Performance** - Optimized for quick loading and smooth interactions

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth.tsx          # Authentication (Login/Register)
│   │   ├── Landing.tsx       # Dashboard & Landing page
│   │   ├── Room.tsx          # Video chat interface
│   │   ├── AISuggestion.tsx  # AI question assistant
│   │   └── VoiceRecorder.tsx # Voice recording and analysis
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

### Backend (Node.js + Express + TypeScript)
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication
│   ├── models/
│   │   └── User.ts           # User schema
│   ├── routes/
│   │   ├── auth.ts           # Authentication endpoints
│   │   ├── protected.ts      # Protected routes
│   │   └── conversation.ts   # Conversation analysis
│   ├── managers/
│   │   ├── UserManager.ts    # User queue management
│   │   └── RoomManager.ts    # Room and WebRTC management
│   ├── utils/
│   │   └── jwt.ts            # JWT utilities
│   └── index.ts              # Server entry point
├── package.json
└── .env                      # Environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Google Gemini API key
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Baatcheet
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/baatcheet?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

4. **Start Backend Server**
```bash
npm run dev
```

5. **Frontend Setup**
```bash
cd ../frontend
npm install
```

6. **Configure Frontend Environment**
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000
```

7. **Start Frontend Development Server**
```bash
npm run dev
```

8. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🔧 Technology Stack

### Frontend Technologies
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **React Router** - Client-side routing

### Backend Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Socket.io** - Real-time WebSocket connections
- **MongoDB** - NoSQL database (MongoDB Atlas)
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Google Gemini AI** - Conversation analysis and feedback

### Real-time Communication
- **WebRTC** - Peer-to-peer video/audio streaming
- **Socket.io** - Signaling and real-time events
- **STUN/TURN Servers** - NAT traversal for WebRTC

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **CORS Protection** - Cross-origin resource sharing controls
- **Input Validation** - Server-side validation for all inputs
- **Private Connections** - WebRTC peer-to-peer connections

## 🎯 Key Components

### UserManager
Manages user queue and matching logic:
- Adds users to waiting queue
- Automatically pairs users when 2+ are available
- Handles user disconnections
- Manages room assignments

### RoomManager
Handles WebRTC room management:
- Creates and manages peer connections
- Handles offer/answer exchange
- Manages ICE candidate exchange
- Cleans up connections on disconnect

### AISuggestion Component
Provides AI-powered conversation starters:
- 8 different question categories
- Pre-defined question bank for each category
- Expandable interface with smooth animations
- Click-to-use question functionality

### VoiceRecorder Component
Handles voice recording and analysis:
- Real-time speech-to-text transcription
- Conversation quality scoring
- Personalized feedback generation
- Privacy-first audio processing

## 🌐 Environment Configuration

### Backend Environment Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/baatcheet
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Deployment

### Production Deployment
1. Build frontend: `npm run build` in frontend directory
2. Build backend: `npm run build` in backend directory
3. Set production environment variables
4. Start backend server: `npm start`
5. Serve frontend files with nginx or similar

### Docker Deployment (Optional)
Create Dockerfile and docker-compose.yml for containerized deployment.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WebRTC** - For enabling peer-to-peer video communication
- **Socket.io** - For real-time WebSocket connections
- **MongoDB Atlas** - For providing cloud database services
- **Tailwind CSS** - For the beautiful UI framework
- **React Community** - For the amazing ecosystem and tools

---

**Made by - Rishabh Ojha**

*Connecting people, one conversation at a time.*
