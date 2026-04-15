# Quantity Measurement App — Frontend

Built with **React + Vite + Modern CSS**, this interface connects to the Spring Boot backend for high-precision unit conversion and measurement operations.

**Supported Quantities:** Length · Temperature · Volume · Weight  
**Authentication:** JWT (Register/Login) · Google OAuth2

## Repository Branch Structure
| Branch | Description |
| :--- | :--- |
| **main** | React + Vite frontend (deployed to Vercel) |

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Connecting to the Backend](#connecting-to-the-backend)
- [Using the App](#using-the-app)
- [Google OAuth2 Setup](#google-oauth2-setup)
- [Production Build](#production-build)
- [Troubleshooting](#troubleshooting)

## Prerequisites
| Tool | Version |
| :--- | :--- |
| **Node.js** | 18 or above |
| **npm** | 9+ |

> [!NOTE]
> This is a frontend-only repository. The Spring Boot backend must be running separately for API calls and authentication to work.

## Getting Started

### Step 1 — Clone the Repository
```bash
git clone <your-repo-url>
cd QMA-Frontend
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Start the Development Server
```bash
npm run dev
```
Open your browser at → **http://localhost:3000**

## Connecting to the Backend
This frontend is designed to work with the **Quantity Measurement App Spring Boot backend**.

### Local Configuration
Ensure the backend is running at **http://localhost:8080** before using the app. The API connection is managed via `.env.development`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Production Configuration
The production app connects to the Railway deployment:
```env
VITE_API_BASE_URL=https://quantitymeasurementapp-production-f900.up.railway.app
```

## Using the App

### Register / Login
1. Open **http://localhost:3000** (or your Vercel URL).
2. Click **"Sign Up"** → enter your email and password → register.
3. Or sign in with your Google account using the **"Continue with Google"** button.
4. You will be redirected to the dashboard automatically.

### Measurement Operations
- **Select Category**: Length, Weight, Temperature, or Volume.
- **Enter Value**: Input the numerical value in the quantity field.
- **Select Units**: Choose "From" and "To" units from the dropdowns.
- **Choose Operation**: Switch between Convert, Compare, or Arithmetic (Add/Subtract/Divide).
- **Click Calculate**: The result appears instantly with a detailed breakdown.
- **History**: View your previous calculations in the History tab.

## Google OAuth2 Setup
To enable the Google login button:
1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Create a project → **APIs & Services** → **Credentials**.
3. Create an **OAuth 2.0 Client ID**.
4. Set Application type to **Web application**.
5. Add the following **Authorized Redirect URIs**:
   - `http://localhost:8080/login/oauth2/code/google` (Dev)
   - `https://quantitymeasurementapp-production-f900.up.railway.app/login/oauth2/code/google` (Prod)
6. Add your Vercel URL to the **Authorized JavaScript Origins**.

## Production Build
```bash
npm run build
```
Output is generated in the `dist/` folder. This project is configured for deployment on **Vercel** via `vercel.json`.

## Troubleshooting
| Problem | Fix |
| :--- | :--- |
| **Blank page on load** | Run `npm install` and restart with `npm run dev`. |
| **CORS error** | Ensure the backend URL is added to `ALLOWED_ORIGINS` in Railway. |
| **401 Unauthorized** | Token has expired — log out and log in again. |
| **Google login fails** | Verify Redirect URIs match perfectly in Google Console. |
| **Backend not found** | Verify `VITE_API_BASE_URL` is correct in your Vercel Environment Variables. |

**Technology Stack:** React · Vite · Modern CSS · Framer Motion · JWT · Google OAuth2
