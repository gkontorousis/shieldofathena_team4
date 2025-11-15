# Shield of Athena

Charity donation platform for Shield of Athena Family Services.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure Firebase:
- Update `frontend/src/firebase/config.js` with your Firebase credentials
- Make sure Authentication and Firestore are enabled

3. Run locally:
```bash
npm start
```

## Tech Stack

- React
- Firebase (Auth + Firestore)
- React Router
- React Player

## Project Structure

```
frontend/
  src/
    components/     # Reusable components
    pages/          # Page components
    context/        # Auth context
    services/       # Firestore functions
    firebase/       # Firebase config
```

## Features

- Landing page with video testimonial
- Donation system
- User authentication (email, Google, Facebook)
- User dashboard with donation history
- Pixelated mystery image that reveals with donations
- Achievements section
