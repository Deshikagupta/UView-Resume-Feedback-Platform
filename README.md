# UView – Resume Feedback Platform

UView is a full-stack web application that allows users to upload resumes (after removing personal details), receive community feedback, and rate the helpfulness of comments. It promotes constructive peer review among students and professionals.

---

## Features

* Upload resumes with title, description, tags, and anonymous option
* View resumes uploaded by others in a social-media style feed
* Like/unlike resumes
* Mark comments as helpful
* Search bar to filter resumes by title, description, or tags
* Profile page showing user stats (uploads, likes, comments)
* Warning shown while uploading to avoid personal data leaks

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Multer (file handling)
* Cloudinary (resume file hosting)

---

## Folder Structure

```
UView/
├── UView_Frontend/        # React + Tailwind frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── UView_Backend/         # Express + MongoDB backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md              # Root-level README
```

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Deshikagupta/UView-Resume-Feedback-Platform.git
cd UView-Resume-Feedback-Platform
```

### 2. Setup Backend

```bash
cd UView_Backend
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
npm start
```

### 3. Setup Frontend

```bash
cd ../UView_Frontend
npm install
npm run dev
```

---

## Demo

Watch the working demo here:
**[Google Drive Demo Video](https://drive.google.com/file/d/1cH_jEIbldS42fO9nq5xBOB7uWWpPHLpR/view?usp=sharing)**

---

## Future Scope

* User Profile Picture: Allow users to upload a profile photo for better identification
* Direct Messaging (DM): Let users privately message others for feedback or networking
* Dark Mode: Add a toggle to switch between light and dark themes
* Update Resume: Feature to allow users to update or replace their uploaded resume
* Notifications: Real-time alerts for likes, comments, or helpful marks
* Leaderboard/Analytics: Track top contributors based on activity

---

## License

This project is for educational purposes and is distributed under the MIT License.
