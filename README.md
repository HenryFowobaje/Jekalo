# Jekalo - Goal Tracking App 🎯

A modern, cross-platform goal tracking application built with React Native and Expo. Jekalo helps users set, track, and achieve their goals with features like streak tracking, milestones, and notifications.

## Features

- 🎯 Create and manage goals with custom milestones
- 🔥 Track daily streaks and progress
- 🔔 Set reminders and notifications
- 📱 Cross-platform support (iOS & Android)
- 🔒 Secure authentication with Firebase
- 📊 Progress tracking and analytics
- 🎨 Modern, intuitive UI

## Tech Stack

- React Native with Expo
- TypeScript
- Firebase (Authentication, Firestore)
- React Context for state management
- Expo Notifications
- React Native Paper for UI components

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account and project
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/jekalo.git
   cd jekalo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values
   ```bash
   cp .env.example .env
   ```

4. Start the development server
   ```bash
   npx expo start
   ```

5. Run on your preferred platform
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
jekalo/
├── app/                    # Main application code
│   ├── (modals)/          # Modal screens
│   ├── (tabs)/            # Tab-based screens
│   └── auth/              # Authentication screens
├── components/            # Reusable UI components
├── services/             # Backend services
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── config/               # Configuration files
```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Set up Firestore Database
4. Configure your app in Firebase Console
5. Download and add configuration files:
   - `GoogleService-Info.plist` for iOS
   - `google-services.json` for Android

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev) for the amazing development platform
- [Firebase](https://firebase.google.com) for backend services
- [React Native Paper](https://callstack.github.io/react-native-paper/) for UI components
