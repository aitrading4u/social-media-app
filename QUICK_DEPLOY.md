# ⚡ Quick Deploy Checklist

## 🚀 **5-Minute Deployment**

### **Step 1: GitHub Setup (2 minutes)**
1. Go to [github.com](https://github.com) → "New repository"
2. Name: `social-media-app` → Create
3. Run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/social-media-app.git
git branch -M main
git push -u origin main
```

### **Step 2: Vercel Deploy (2 minutes)**
1. Go to [vercel.com](https://vercel.com) → "New Project"
2. Import your `social-media-app` repository
3. Click "Deploy"

### **Step 3: Database Setup (1 minute)**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Add to Vercel environment variables

### **Step 4: Environment Variables**
In Vercel project settings → Environment Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialmedia
JWT_SECRET=your_super_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Step 5: Redeploy**
1. Go to Vercel dashboard
2. Click "Redeploy"
3. Your app is live! 🎉

## 🌐 **Your App URL:**
`https://your-app-name.vercel.app`

## 📱 **Share with Friends:**
- Send them the URL
- They can register and use all features
- Real-time chat, calls, photo sharing, etc.

## ✅ **Done!**
Your social media app is now live globally! 🌍✨ 