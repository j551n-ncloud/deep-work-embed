# Deep Work Focus Timer

A minimalist solo focus timer application built with React, TypeScript, and Vite. Designed to help you maintain deep focus sessions with customizable timers, Pomodoro technique support, and ambient background music.

## Features

### 🎯 Focus Sessions
- **Custom Duration**: Set focus sessions from 15 minutes to 3 hours
- **Pomodoro Timer**: Built-in 25/5 minute work/break cycles with customizable settings
- **Deep Work Mode**: 90-minute uninterrupted focus sessions
- **Task Tracking**: Define what you'll work on before starting

### 🎵 Background Audio
- **YouTube Integration**: Play focus music, white noise, or ambient sounds
- **URL Validation**: Ensures only valid YouTube links are accepted
- **Seamless Playback**: Audio continues throughout your focus session

### 📊 Session Management
- **Session Persistence**: Your active session survives page refreshes
- **Progress Tracking**: Visual progress bar and time remaining
- **Contribution Calendar**: Track your focus sessions over time
- **Streak Counter**: Build and maintain focus streaks

### 🎨 User Experience
- **Dark Theme**: Easy on the eyes for long focus sessions
- **Minimalist Design**: Clean interface that doesn't distract
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Glassmorphism UI**: Beautiful, modern interface design

## Docker Setup

### Production

Build and run the production version:

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

Or use docker-compose:

```bash
# Run production version
npm run docker:prod
```

The app will be available at http://localhost:3000

### Development

Run the development version with hot reload:

```bash
# Run development version
npm run docker:dev
```

The development server will be available at http://localhost:5173

### Manual Docker Commands

```bash
# Production build
docker build -t calendar-app .
docker run -p 3000:80 calendar-app

# Development build
docker build -f Dockerfile.dev -t calendar-app-dev .
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules calendar-app-dev
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```



## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**


Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

