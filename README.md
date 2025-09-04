# Video Calling App

A fully working video calling app with user registration, text chat, and file sharing capabilities.

## Table of Contents
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [User Guide](#user-guide)
- [Hosting](#hosting)
- [Features](#features)

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- A modern web browser with WebRTC support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SidL340/video-calling-app.git
   cd video-calling-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

### Backend Server

1. **Start the backend server**
   ```bash
   npm start
   ```
   or for development with auto-restart:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`

### Frontend Client

1. **Navigate to the client directory**
   ```bash
   cd client
   ```

2. **Install client dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```
   The client will start on `http://localhost:3001`

### Running Both Together

For convenience, you can run both frontend and backend simultaneously:
```bash
npm run dev:all
```

## User Guide

### Registration

1. **Access the Application**
   - Open your browser and navigate to `http://localhost:3001`
   - You'll see the main landing page

2. **Create an Account**
   - Click on "Sign Up" or "Register"
   - Fill in your details:
     - Username (must be unique)
     - Email address
     - Password (minimum 6 characters)
   - Click "Register" to create your account
   - You'll be automatically logged in after successful registration

### Making Video Calls

1. **Starting a Call**
   - After logging in, you'll see the main dashboard
   - Click "Start New Call" to create a room
   - Copy the generated room ID or share the room link
   - Your camera and microphone will be activated

2. **Joining a Call**
   - Enter a room ID in the "Join Room" field, or
   - Click on a shared room link
   - Allow camera and microphone permissions when prompted
   - You'll be connected to the video call

3. **Call Controls**
   - **Mute/Unmute**: Toggle your microphone
   - **Camera On/Off**: Toggle your video feed
   - **Screen Share**: Share your screen with other participants
   - **End Call**: Leave the current call

### Text Chat

1. **During a Call**
   - Look for the chat panel (usually on the right side)
   - Type your message in the text input field
   - Press Enter or click "Send" to send messages
   - Chat history is maintained during the call session

2. **Chat Features**
   - Real-time messaging with all call participants
   - Timestamp for each message
   - User identification for each message

### File Sharing

1. **Sharing Files**
   - Look for the "Share File" button or attachment icon
   - Click to open file browser
   - Select files to share (supports images, documents, etc.)
   - Files are shared with all call participants

2. **Receiving Files**
   - Shared files appear in the chat or file sharing panel
   - Click on file names to download
   - Preview available for supported file types

3. **File Limitations**
   - Maximum file size: 10MB per file
   - Supported formats: Images (jpg, png, gif), Documents (pdf, doc, txt), etc.

## Hosting

### Vercel Deployment

1. **Prepare for Deployment**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel --prod`
   - Follow the prompts to configure your deployment

3. **Vercel Configuration**
   Create a `vercel.json` file:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       },
       {
         "src": "client/build/**",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/client/build/$1"
       }
     ]
   }
   ```

### Heroku Deployment

1. **Install Heroku CLI**
   - Download from [heroku.com](https://heroku.com)
   - Login: `heroku login`

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Configure Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=process.env.PORT
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

5. **Heroku Configuration**
   Add a `Procfile` in the root directory:
   ```
   web: node server.js
   ```

### Railway Deployment

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select this repository

2. **Configure Environment**
   - Set environment variables in Railway dashboard
   - Deploy automatically triggers on push to main branch

### Environment Variables for Production

```env
NODE_ENV=production
PORT=process.env.PORT || 3000
CORS_ORIGIN=https://your-domain.com
```

## Features

- **Real-time Video Calling**: WebRTC-based peer-to-peer video communication
- **User Authentication**: Secure user registration and login system
- **Text Chat**: Real-time messaging during video calls
- **File Sharing**: Upload and share files with call participants
- **Screen Sharing**: Share your screen with other participants
- **Responsive Design**: Works on desktop and mobile devices
- **Room-based Calls**: Create or join specific call rooms
- **Mute/Unmute Controls**: Audio and video toggle controls

## Troubleshooting

### Common Issues

1. **Camera/Microphone Not Working**
   - Check browser permissions
   - Ensure HTTPS in production (required for WebRTC)
   - Try refreshing the page

2. **Cannot Connect to Calls**
   - Check network connectivity
   - Verify server is running
   - Check firewall settings

3. **File Upload Issues**
   - Check file size (max 10MB)
   - Verify file format is supported
   - Ensure stable internet connection

### Support

For issues or questions:
- Create an issue on GitHub
- Check the troubleshooting guide
- Review browser console for error messages

## License

This project is licensed under the MIT License.
