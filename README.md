
Howudoin - Messaging Application

Frontend Overview

The Howudoin frontend is a mobile interface built with React Native, designed to support both iOS and Android platforms. It serves as the client-side of the messaging application, connecting to the backend services for seamless functionality.

---

Features

User Registration and Login
- Registration Form: Users can sign up using email and password.
- Login Screen: Secure login with email and password.
- JWT Authentication: Receives a JWT token upon successful login, which is used for authenticating all subsequent API requests.

Friend Management
- Friend Request Screen: Users can search and send friend requests, view pending requests, and manage their friend list.
- Friends List: Displays all added friends and their statuses.

Messaging System
- Friend Messaging: Real-time one-on-one chat with message history retrieval.
- Group Messaging: Messaging interface for groups, with history retrieval and real-time updates.

Group Management
- Group Creation: Create groups with a unique name and add friends as members.
- Group List: View a list of all groups a user is part of.
- Group Details: Displays group information such as name, creation time, and member list.

---

Technical Stack

- Frontend Framework: React Native
- Platforms Supported: iOS and Android
- API Integration: Utilizes backend APIs for registration, login, messaging, and group management.
- JWT Authentication: Ensures secure communication between the frontend and backend.
