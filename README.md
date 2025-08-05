# 📚 Book Principles App

Transform any book into actionable daily lessons with AI-powered analysis and personalized content.

## 🚀 Features

### 📖 **Smart Book Analysis**
- Upload books via file, Google Drive, URL, or ISBN
- AI-powered content analysis using OpenAI GPT-3.5-turbo
- Automatic extraction of key principles and insights
- Intelligent fallback content when AI is unavailable

### 📅 **Daily Content Generation**
- Personalized daily lessons based on book content
- Practical exercises and actionable steps
- Daily affirmations and reflective thoughts
- Progressive learning journey with 5+ days of content

### 📊 **Progress Tracking**
- Visual progress indicators for each book
- Reading streak tracking with 🔥 motivation
- Completion rate calculations
- Achievement levels (Novice → Master)

### 📝 **Personal Notes**
- Add personal reflections for each day
- Save and retrieve notes across sessions
- Track your learning journey

### 📤 **Social Sharing**
- Share progress on Twitter, Facebook, LinkedIn
- Copy progress to clipboard
- Motivational sharing templates

### 📈 **Statistics Dashboard**
- Comprehensive reading analytics
- Achievement level tracking
- Reading insights and recommendations
- Overall progress visualization

## 🛠️ Technology Stack

- **Frontend**: React.js with modern hooks
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Styling**: CSS-in-JS with responsive design
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project
- OpenAI API key (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd book-principles-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `src/firebaseConfig.js` with your Firebase config

5. **Start development server**
   ```bash
   npm start
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Copy your config to `src/firebaseConfig.js`

### OpenAI API Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file
3. The app works without it but with limited AI features

## 📱 Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Upload a Book**: Choose from multiple upload methods
3. **Wait for Processing**: AI analyzes your book content
4. **Start Reading**: Access daily lessons and exercises
5. **Track Progress**: Monitor your reading journey
6. **Take Notes**: Add personal reflections
7. **Share Progress**: Share achievements on social media

## 🎯 Key Features Explained

### **Multiple Upload Methods**
- **File Upload**: Direct PDF, TXT, DOC, DOCX, EPUB upload
- **Google Drive**: Import from Google Drive links
- **URL Import**: Extract content from public URLs
- **ISBN Lookup**: Automatic book details from ISBN

### **AI-Powered Analysis**
- **Content Extraction**: Intelligent text processing
- **Principle Identification**: Key insights extraction
- **Daily Content Generation**: Personalized learning paths
- **Fallback Content**: Works without AI for basic functionality

### **Progress Tracking**
- **Visual Indicators**: Progress bars and completion rates
- **Streak Counter**: Consecutive days tracking
- **Achievement Levels**: Gamified learning experience
- **Statistics Dashboard**: Comprehensive analytics

## 🔒 Security

- Environment variables for sensitive data
- Firebase security rules for data protection
- Client-side API key validation
- Secure authentication flow

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
- **Netlify**: Similar to Vercel setup
- **Firebase Hosting**: Direct Firebase integration
- **AWS Amplify**: Full-stack deployment option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Firebase for backend services
- React community for excellent tooling
- All contributors and users

## 📞 Support

For support, email support@bookprinciples.com or create an issue in this repository.

---

**Made with ❤️ for book lovers and lifelong learners** 