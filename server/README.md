# Freedom Social Backend

A complete backend server for the Freedom Social platform with user authentication, post management, media uploads, and real-time features.

## 🚀 Features

- **User Authentication**: Registration, login, JWT tokens
- **Post Management**: Create, read, like, comment on posts
- **Media Uploads**: Image and video uploads to Cloudinary
- **User Profiles**: Follow/unfollow, profile management
- **Real-time Features**: Socket.IO for live chat and streaming
- **Content Moderation**: Age verification and content warnings
- **Token System**: Virtual currency for tipping and purchases
- **Security**: Rate limiting, input validation, CORS protection

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for media uploads)

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/freedom_social

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

   # Cloudinary (for image/video uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Set up MongoDB:**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud service)

4. **Set up Cloudinary:**
   - Create account at [cloudinary.com](https://cloudinary.com)
   - Get your cloud name, API key, and API secret
   - Add them to your `.env` file

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Posts
- `POST /api/posts` - Create new post
- `GET /api/posts` - Get feed posts
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment
- `DELETE /api/posts/:id` - Delete post

### Users
- `GET /api/users/profile/:username` - Get user profile
- `PUT /api/users/follow/:userId` - Follow/unfollow user
- `GET /api/users/:userId/posts` - Get user's posts

### Uploads
- `POST /api/upload/image` - Upload image
- `POST /api/upload/video` - Upload video
- `POST /api/upload/avatar` - Upload avatar
- `DELETE /api/upload/:publicId` - Delete file

### Other Features
- `GET /api/live/start` - Start live stream
- `GET /api/marketplace` - Get marketplace items
- `GET /api/tokens/balance` - Get token balance
- `GET /api/notifications` - Get notifications
- `GET /api/messages` - Get messages

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | localhost:27017/freedom_social |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Required |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Required |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Required |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Required |
| `MAX_FILE_SIZE` | Max file upload size | 100MB |
| `MAX_IMAGE_SIZE` | Max image upload size | 10MB |
| `MAX_VIDEO_SIZE` | Max video upload size | 100MB |

### File Upload Limits

- **Images**: Up to 10MB, auto-resized to 1920x1080
- **Videos**: Up to 100MB, optimized for web
- **Avatars**: Up to 5MB, cropped to 400x400

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs validated and sanitized
- **CORS Protection**: Configured for specific origins
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt rounds
- **Helmet**: Security headers

## 📱 Real-time Features

The server uses Socket.IO for real-time features:

- **Live Chat**: Real-time messaging
- **Live Streaming**: Real-time video streaming
- **Notifications**: Push notifications
- **Online Status**: Real-time user presence

## 🗄️ Database Models

### User Model
- Authentication info (username, email, password)
- Profile data (name, bio, avatar)
- Social features (followers, following)
- Token system (balance, earnings)
- Creator features (verification, categories)
- Privacy settings

### Post Model
- Content and media
- Engagement metrics (likes, comments, shares)
- Privacy settings
- Content moderation flags
- Monetization features

## 🚀 Deployment

### Local Development
1. Install MongoDB locally
2. Set up Cloudinary account
3. Configure environment variables
4. Run `npm run dev`

### Production Deployment
1. Use MongoDB Atlas for database
2. Set up production environment variables
3. Use PM2 or similar process manager
4. Set up reverse proxy (nginx)
5. Configure SSL certificates

### Docker Deployment
```bash
# Build image
docker build -t freedom-social-backend .

# Run container
docker run -p 5000:5000 --env-file .env freedom-social-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the environment configuration

## 🔄 Updates

To update the server:
1. Pull latest changes
2. Install new dependencies: `npm install`
3. Update environment variables if needed
4. Restart the server

---

**Freedom Social Backend** - Powering the next generation of social media! 🚀 