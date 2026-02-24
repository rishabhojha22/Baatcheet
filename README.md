# बातचीत (Baatcheet) - AI-Powered Video Chat Platform

A modern video chat application that connects strangers worldwide through face-to-face conversations, enhanced with AI-powered conversation suggestions and voice analysis.

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

## 📱 Usage Guide

### For Users

1. **Registration/Login**
   - Visit the application URL
   - Create an account or sign in
   - Access your personalized dashboard

2. **Starting a Video Chat**
   - Click "Enter Video Chat" on the dashboard
   - Allow camera and microphone permissions
   - Wait for automatic connection with another user

3. **Using AI Assistant**
   - Click the "AI Questions" button during video chat
   - Select a category that interests you
   - Choose from suggested questions to keep the conversation flowing

4. **Voice Recording & Analysis**
   - Click the microphone button to start recording your conversation
   - Your speech will be transcribed in real-time
   - After the conversation, click "Get Feedback" to receive AI analysis
   - Review your communication score and personalized improvement suggestions

5. **Ending Conversations**
   - Click "Next Chat" to end the current conversation and return to the dashboard
   - Click "Logout" to sign out completely

### For Developers

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user and get token

#### Conversation Analysis
- `POST /api/analyze-conversation` - Analyze conversation transcript with Gemini AI

#### Protected Routes
- `GET /api/protected/profile` - Get user profile (requires auth)

#### Health Check
- `GET /health` - Server health status

### Socket.io Events
- `connection` - User connects to server
- `disconnect` - User disconnects
- `lobby` - User enters waiting queue
- `send-offer` - Initiate WebRTC connection
- `send-answer` - Respond to WebRTC offer
- `ice-candidate` - Exchange ICE candidates

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

## 🎯 Future Enhancements

### Planned Features
- **📱 Mobile App** - Native iOS and Android applications
- **🌍 Language Support** - Multi-language interface
- **👥 Group Chat** - Multi-user video conversations
- **💬 Text Chat** - Integrated messaging system
- **🎭 Filters & Effects** - Video filters and AR effects
- **📊 Analytics** - User engagement and conversation analytics
- **🤖 Enhanced AI** - More sophisticated conversation AI
- **🔔 Notifications** - Push notifications for new connections

### AI Improvements
- **Context-Aware Suggestions** - AI that learns from conversation context
- **Personality Matching** - Match users based on conversation preferences
- **Translation Support** - Real-time translation for international users
- **Sentiment Analysis** - Monitor conversation quality and engagement

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write clean, commented code
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WebRTC** - For enabling peer-to-peer video communication
- **Socket.io** - For real-time WebSocket connections
- **MongoDB Atlas** - For providing cloud database services
- **Tailwind CSS** - For the beautiful UI framework
- **React Community** - For the amazing ecosystem and tools

## 📞 Support

If you encounter any issues or have questions:

1. **Check the FAQ** section below
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Contact the development team** at [support@baatcheet.com](mailto:support@baatcheet.com)

## ❓ FAQ

**Q: Is Baatcheet free to use?**
A: Yes, Baatcheet is completely free for all users.

**Q: How does the AI suggestion feature work?**
A: The AI analyzes conversation categories and provides relevant questions to help keep conversations engaging and meaningful.

**Q: Are my conversations private?**
A: Yes, all video chats are peer-to-peer and not stored on our servers. We only store user authentication data.

**Q: Can I use Baatcheet on mobile devices?**
A: Yes, Baatcheet is responsive and works on all modern mobile browsers.

**Q: What are the system requirements?**
A: A modern web browser, camera, microphone, and stable internet connection are required.

**Q: Do I need a Gemini API key to run the app?**
A: Yes, the voice analysis feature requires a Google Gemini API key. However, the basic video chat functionality works without it.

---

**Made with ❤️ by the Baatcheet Team**

*Connecting people, one conversation at a time.*
