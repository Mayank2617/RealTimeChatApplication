# Real-Time Private Chat Application

**Live Deployment:** [https://real-time-chat-application-ochre-delta.vercel.app](https://real-time-chat-application-ochre-delta.vercel.app)

A full-stack, real-time messaging application built using the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. This project is specifically designed to handle secure, 1-on-1 private conversations rather than global group broadcasts.

## Overview
The goal of this application is to provide a seamless, instant messaging experience between two individual users. It features an active user directory, preserved chat histories, and a clean, responsive UI. 

## Key Features & Implementation Details

### Real-Time 1-on-1 Messaging
Unlike basic chat apps that broadcast messages to every connected user, this application ensures strict privacy between the sender and receiver. 

**How it works:** When a user logs in, the Node.js backend saves their specific identity in a temporary memory map, linking their chosen username to their unique `socket.id`. When Alice sends a message to Bob, the server looks up Bob's exact socket ID and uses a targeted `io.to(bobSocketId).emit()` execution. This guarantees that the message is sent exclusively to Bob's browser, preventing anyone else on the server from receiving the data.

### Persistent Chat History
Users shouldn't lose their conversations when they refresh the browser. All messages are securely stored in a MongoDB database with timestamps.

**How it works:** The MongoDB database schema is designed with a `sender`, `receiver`, and `content` field. Whenever you click on a user's name in the sidebar, the React frontend makes a REST API call to the backend. The backend then queries MongoDB for any messages where the sender and receiver match the two individuals involved. These historical messages are loaded onto the screen instantly before the real-time Socket.io connection takes over for new incoming messages.

### Active User Tracking
To chat with someone, you need to know who is online. 

**How it works:** The backend maintains an active registry of all connected users. Whenever a new person joins or someone closes their tab, the server automatically broadcasts an updated list of online usernames to all connected clients. The React frontend listens for this specific list, filters out the current user's own name, and displays the rest in a responsive sidebar. Furthermore, if the person you are actively chatting with goes offline, the frontend intelligently detects their absence and automatically closes the active chat window to prevent you from sending messages into the void.

### Security and CORS Protection
When dealing with web configurations, security is a top priority—especially ensuring that only authorized applications can access the backend server. We handle this through CORS (Cross-Origin Resource Sharing).

**How it works:** When a browser tries to connect the frontend to the backend, it strictly checks the origin of the request. Initially, during local development, browsers often block requests between different ports. In our production environment, we explicitly configured both the Express API routing and the Socket.io server to only accept traffic coming strictly from our live Vercel frontend URL (`https://real-time-chat-application-ochre-delta.vercel.app`). Because of this targeted CORS configuration, if a malicious third-party website tries to ping our backend to extract messages or connect to the socket, the server will actively reject the connection.

## Tech Stack
- **Frontend:** React (scaffolded with Vite for lightning-fast bundling), Vanilla CSS for a custom light-theme design system.
- **Backend:** Node.js with Express.js for REST endpoints.
- **Real-Time Layer:** Socket.io for instantaneous, low-latency data transfer between the client and server.
- **Database:** MongoDB Atlas (NoSQL) with Mongoose for schema enforcement.
- **Deployment:** The backend is hosted on Render, the frontend on Vercel, and the database on MongoDB Atlas.

## Local Setup

If you wish to run this project locally, clone the repository and follow these steps:

1. **Database Setup:** Ensure you have MongoDB running locally or have an Atlas connection string.
2. **Backend:**
   - Navigate to the `server/` directory.
   - Run `npm install`.
   - Create a `.env` file with your `MONGO_URI`.
   - Run `npm run start` (or `node server.js`).
3. **Frontend:**
   - Navigate to the `client/` directory.
   - Run `npm install` to install dependencies (including `axios` and `socket.io-client`).
   - Create a `.env` file with `VITE_API_BASE=http://localhost:5000` and `VITE_SOCKET_URL=http://localhost:5000`.
   - Run `npm run dev` to start the Vite development server.

---

*Professionally engineered and developed by Mayank Sahu.*
