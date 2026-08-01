# 🚀 Taskmaster Redux — Comprehensive Revision & Technical Walkthrough

A full-stack, secured Task Management application built with **React**, **Redux Toolkit (RTK Query)**, **Tailwind CSS**, **Node.js/Express**, **MongoDB**, and **Firebase Authentication**.

---

## 📌 1. Project Overview & Core Features

* **Strict Token-Based API Security**: All MongoDB REST endpoints (`/tasks` `GET`, `POST`, `PATCH`, `DELETE`) are protected with a custom Express `verifyToken` middleware that validates Firebase ID tokens via the `firebase-admin` SDK.
* **Authentication Options**:
  * Email & Password signup/login.
  * 1-Click Google Popup Authentication.
  * Instant 1-Click **Demo Login** (`muntasir@gmail.com`) for quick testing.
* **Kanban Task Board**:
  * **Up Next** (Pending Tasks)
  * **In Progress** (Running Tasks)
  * **Completed** (Done Tasks)
  * **Archive Board** (Historical completed tasks)
  * **My Tasks** (User-assigned task view)
* **Performance-Optimized Rendering**: `React.memo` and `useMemo` hooks eliminate redundant filtering and unnecessary card re-renders.
* **Light / Dark Mode Theme System**: Persists user appearance preferences across sessions via Redux state and HTML root class toggling.
* **Custom Profile Management**: Live image preview and direct URL support for avatar hosting (Google Drive, Unsplash, ImgBB, GitHub).

---

## 🛠️ 2. Technology Stack & Architecture

### **Frontend Stack**
| Technology | Role |
| :--- | :--- |
| **React 18** | UI Library & Functional Component Architecture |
| **Redux Toolkit** | Global State Management (`userSlice`, `themeSlice`) |
| **RTK Query (`baseApi`)** | Data Fetching, Caching, Tag Invalidation (`Tasks`), & Auth Interceptor |
| **Firebase Client SDK** | User Authentication (`signInWithPopup`, `signInWithEmailAndPassword`) |
| **React Router v6** | Client-side routing with `PrivateRoute` and `PublicRoute` guards |
| **Tailwind CSS & Headless UI** | Modern responsive design & accessible menu dropdowns |
| **React Hot Toast** | Centralized notification feedback |

### **Backend Stack**
| Technology | Role |
| :--- | :--- |
| **Node.js & Express** | RESTful API Web Server |
| **Firebase Admin SDK** | Token verification (`getAuth().verifyIdToken()`) |
| **MongoDB Atlas** | NoSQL cloud database for task collection storage |
| **Nodemon** | Development server live reloader |

---

## 🔑 3. Key Technical Implementations & Data Flow

### A. Automatic Firebase Token Injection & Retry Interceptor (`baseApi.js`)
* Every API request passes through `prepareHeaders`:
  1. Checks if `auth.currentUser` is initialized (waits for `onAuthStateChanged` if unhydrated).
  2. Fetches the current Firebase ID Token via `await user.getIdToken()`.
  3. Attaches `Authorization: Bearer <token>` to the HTTP header.
* **Automatic Retry**: If an API request returns `401` or `403` due to token expiration, `baseQueryWithAuthErrorHandling` triggers `user.getIdToken(true)` (force refresh) and automatically retries the request once before throwing an error.

### B. Backend API Protection (`taskmaster-server/index.js`)
```javascript
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
};
```

### C. Performance Optimizations
1. **Array Filtering (`Tasks.jsx`, `MyTasks.jsx`, `Archive.jsx`)**:
   Wrapped in `useMemo` so filtering operations run **only** when `tasks`, `searchQuery`, or `name` change, avoiding re-computation during theme switches or input field renders.
2. **`TaskCard.jsx` Component**:
   Wrapped in `React.memo` to prevent re-rendering untouched task cards when surrounding state updates.
3. **Single Root `<Toaster />` (`main.jsx`)**:
   Moved `<Toaster />` to the root `main.jsx` to prevent React DOM `removeChild` unmounting collisions during page transitions.

---

## 🗣️ 4. Quick 2-Minute Interview Pitch

> *"Taskmaster Redux is a modern task management application built to solve secure multi-user workflow needs. 
> On the frontend, I used **React** with **Redux Toolkit** and **RTK Query** for asynchronous data fetching and cache management.
> For authentication, I integrated **Firebase Auth**, and to secure the backend API, I built a custom **Node.js/Express** middleware that validates Firebase JWT ID Tokens via the **Firebase Admin SDK** on every MongoDB operation.
> 
> To optimize performance, I leveraged **RTK Query automatic header injection**, implemented an automatic token force-refresh retry interceptor, and applied **`React.memo`** and **`useMemo`** to eliminate redundant DOM re-renders across Kanban columns."*

---

## 🎯 5. Core Files & Their Responsibilities

| File Path | Description |
| :--- | :--- |
| `src/main.jsx` | App entry point, Firebase auth listener (`onAuthStateChanged`), Theme & Redux providers |
| `src/redux/api/baseApi.js` | RTK Query base configuration, header token injection, and global error interceptor |
| `src/redux/features/user/userSlice.js` | Redux user state, async thunks for Email & Google sign-in |
| `src/pages/Tasks.jsx` | Main Kanban board (Up Next, In Progress, Completed) with search query memoization |
| `src/components/tasks/TaskCard.jsx` | Memoized task item component with status advancement and deletion actions |
| `src/pages/Login.jsx` | Full-screen responsive login page with 1-click Demo Login |
| `../taskmaster-server/index.js` | Express server endpoints (`GET`, `POST`, `PATCH`, `DELETE`) with MongoDB & Firebase Admin auth |
