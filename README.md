My Chat App — CometChat React UI Kit Integration (Vite + TypeScript)
Project Overview:
My Chat App is a real-time messaging application built using React, TypeScript, Vite, and the CometChat UI Kit.
This project was developed as part of the CometChat Internship Task, demonstrating the integration of the CometChat UI Kit, multi-user login, and real-time chat functionalities.

The application provides:
1:1 messaging
Group chats
Real-time updates
Presence indicators
Typing indicators
Media & file options (depending on UI Kit configuration)
User login & signup (custom implementation)
The UI Kit theme selected: Dark Theme

 Features Included
 UI Kit (Dark Theme)
 Chats list
 Groups list
 Message list
 Message input
 Call icons (voice/video)
 Presence indicator
 Typing indicator

Custom Additions

Login (UID-based authentication)

Signup (create user from client-side)

Vite + TypeScript setup

CometChat initialization

Multi-user support

🛠 Tech Stack

React (TypeScript)

Vite

CometChat UI Kit (React)

CometChat JS SDK

CSS (inline & default UI Kit styles)

📁 Project Structure
my-chat-app/
 ├── src/
 │   ├── App.tsx
 │   ├── Login.tsx
 │   ├── Signup.tsx
 │   ├── main.tsx
 │   ├── index.css
 │   └── CometChat/ (UI Kit components)
 ├── public/
 ├── .env
 ├── package.json
 └── vite.config.ts

🔧 Environment Variables

Create a .env file at the root:

REACT_APP_COMETCHAT_APP_ID=YOUR_APP_ID
REACT_APP_COMETCHAT_REGION=YOUR_REGION
REACT_APP_AUTH_KEY=YOUR_AUTH_KEY


⚠️ Important: Use the Auth Key (not API key).
Restart the server after editing .env.

▶️ How to Run the Project
1. Install Dependencies
npm install

2. Start Development Server
npm run dev

3. Open App
http://localhost:5173

🔑 User Authentication Flow

The app supports two flows:

1. Login (Existing User)

Users can log in using their UID.

2. Signup (New User)

Users can create a new account by providing:

UID

Name

After signup → user can proceed to login.

🖼 Screenshots

Add the required screenshots here:

Dashboard & Setup

Dashboard Home

UI Kit Builder Configuration

UI Kit Download

Implementation

App running

Group chat screen

Message screen

Login screen

Signup screen


📝 Issues Identified & Improvements Suggested

Below is a summary; full details are included in the PDF report.

Dashboard

Some labels lack explanation for first-time users.

Certain features are collapsible but not clearly indicated.

UI Kit Builder

Component descriptions could be more detailed.

Download confirmation could provide direct integration instructions.

Documentation

Some integration examples do not match Vite + TS setup.

Missing TypeScript-specific notes for beginners.

Implementation

Minor import path clarifications needed for UI Kit folder.

ENV variable usage differs in Vite (requires import.meta.env).

 Submission Requirements Completed

✔ UI Kit Integrated
✔ React + TypeScript project implemented
✔ Screenshots added
✔ Demo video included
✔ Issues + recommendations documented
✔ PDF report prepared
✔ GitHub repository ready

 Developer

Pranitha Saravanan
Developer – CometChat Internship Task
Email: pranisarananan2005@gmail.com

 Acknowledgements

This project uses CometChat React UI Kit and JavaScript SDK.
Special thanks to the CometChat team for providing tools and documentation.
