# Social Media App

A full-stack social media application with real-time features, photo/video editing, and a creator marketplace.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Real-time Communication**: Live messaging and notifications
- **Photo/Video Editor**: Built-in media editing capabilities
- **Creator Marketplace**: Platform for content creators with age verification
- **Token System**: Digital currency for platform transactions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Node.js, Express, MongoDB
- **Real-time**: Socket.io
- **Authentication**: JWT
- **Media Storage**: Cloudinary
- **Deployment**: Vercel

## Environment Variables

Make sure to set these in your Vercel environment:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

## Deployment Status

**Latest Update**: Environment variables configured for production deployment. 