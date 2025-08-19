# 🌍 Social Media App

A full-stack social media platform with real-time features, photo/video sharing, messaging, and more.

## 🚀 Features

- **User Authentication** - Register, login, profile management
- **Photo & Video Posts** - Upload, edit, and share media
- **Real-time Chat** - Direct messaging with WebSocket
- **Voice & Video Calls** - Built-in calling features
- **Photo Editor** - Advanced editing tools
- **Creator Marketplace** - Buy and sell content
- **Token System** - Tip creators with tokens
- **Live Streaming** - Broadcast live content
- **Stories** - Share temporary content
- **Age Verification** - Content moderation

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd social-media-app
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**

   **Server (.env):**
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   **Client (.env):**
   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_WS_URL=ws://localhost:3001
   ```

4. **Start development servers**
   ```bash
   # Start backend server
   cd server
   npm run dev
   
   # Start frontend (in new terminal)
   cd client
   npm start
   ```

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard**

## 📱 Usage

1. **Register/Login** - Create an account or login
2. **Create Profile** - Upload avatar and customize profile
3. **Post Content** - Share photos, videos, and stories
4. **Connect** - Follow users and start conversations
5. **Chat** - Use real-time messaging
6. **Call** - Make voice and video calls
7. **Marketplace** - Buy/sell content with tokens

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Posts
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Messages
- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get conversation messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🌟 Features Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] AI-powered content recommendations
- [ ] Multi-language support
- [ ] Advanced privacy controls
- [ ] Group video calls
- [ ] AR filters and effects

---

**Built with ❤️ for global social connection** 