# 🚀 Deployment Guide for Render

This guide will help you deploy the Studio project to Render with automatic setup.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: We'll create this on Render

## 🗄️ Step 1: Create PostgreSQL Database

1. Go to your Render dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `studio-database`
   - **Database**: `studio_db`
   - **User**: `studio_user`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15 (recommended)
   - **Plan**: Free tier is fine for testing

4. Click **"Create Database"**
5. **Save the connection details** - you'll need them next

## 🌐 Step 2: Create Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

### Basic Settings
- **Name**: `studio-app`
- **Region**: Same as your database
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty
- **Runtime**: `Node`

### Build & Deploy Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Environment Variables
Click **"Advanced"** and add these environment variables:

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=[Your PostgreSQL connection string from Step 1]
SESSION_SECRET=[Generate a random string - use a password generator]
HTTPS=true
```

**Important**: Replace `[Your PostgreSQL connection string]` with the **External Database URL** from your PostgreSQL service.

Example DATABASE_URL format:
```
postgresql://username:password@hostname:port/database
```

## 🔧 Step 3: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies (`npm install`)
   - Run the build process (`npm run build`)
   - Set up the database (automatic migrations)
   - Start the server (`npm start`)

## ✅ Step 4: Verify Deployment

Once deployed, your app will be available at: `https://your-app-name.onrender.com`

### Test these endpoints:
- **Health Check**: `https://your-app-name.onrender.com/health`
- **Admin Login**: `https://your-app-name.onrender.com/admin`
  - Email: `admin@studio.com`
  - Password: `admin123`

## 🔄 Automatic Features

The deployment includes:

### ✅ Database Setup
- All tables created automatically
- Admin user created (`admin@studio.com` / `admin123`)
- Sample quick codes added
- All migrations run automatically

### ✅ File Uploads
- Upload directory created automatically
- Supports images, documents, videos
- 10MB file size limit

### ✅ Production Optimizations
- Frontend built and served statically
- Gzip compression enabled
- Security headers configured
- Session management optimized

## 🛠️ Troubleshooting

### Database Connection Issues
If you see database errors:
1. Check the `DATABASE_URL` environment variable
2. Ensure the PostgreSQL service is running
3. Verify the connection string format

### Build Failures
If the build fails:
1. Check the build logs in Render dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### File Upload Issues
If file uploads don't work:
1. Check that the uploads directory exists
2. Verify file size limits (10MB max)
3. Check file type restrictions

## 🔄 Updates & Redeployment

To update your app:
1. Push changes to your GitHub repository
2. Render will automatically redeploy
3. Database migrations run automatically if needed

## 📊 Monitoring

Monitor your app in the Render dashboard:
- **Logs**: View real-time application logs
- **Metrics**: CPU, memory, and request metrics
- **Events**: Deployment and service events

## 🔐 Security Notes

### Change Default Credentials
**Important**: After first deployment, change the admin password:
1. Login to admin panel
2. Go to "Mi Cuenta" (Account Settings)
3. Update admin name and add profile photo
4. Consider changing the admin email in the database

### Environment Variables
Keep these secure:
- `SESSION_SECRET`: Use a strong, random string
- `DATABASE_URL`: Never expose publicly
- Consider adding additional security headers

## 📞 Support

If you encounter issues:
1. Check the Render logs first
2. Verify all environment variables
3. Test the health endpoint
4. Check database connectivity

The app is designed to be fully self-contained and should work out of the box with these instructions.

---

## 🎉 Success!

Your Studio application is now live and ready to use with:
- ✅ Complete database setup
- ✅ Admin panel access
- ✅ File upload functionality
- ✅ User registration and login
- ✅ Project management
- ✅ Chat system
- ✅ Automatic backups (via Render PostgreSQL)

Visit your app and start using it immediately!