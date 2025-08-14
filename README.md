**Teacher Portal Web**

A React-based web application designed for managing teachers and students. This portal provides secure authentication, role-based access, and a clean UI for adding students, managing teacher details, and viewing overviews.

Live Demo

(If deployed, add link here)

**Screenshots**

**Login Page**
<img width="1388" height="747" alt="image" src="https://github.com/user-attachments/assets/ac154854-0d4a-456c-b38d-2f9cbfe5db7c" />

**Dashboard**
<img width="1489" height="711" alt="image" src="https://github.com/user-attachments/assets/8cde92de-385a-42d3-8edb-b331bac9ca91" />

**Teacher Overview**
<img width="1917" height="748" alt="image" src="https://github.com/user-attachments/assets/c85672dc-bac6-42da-a46c-e17f823d3eca" />

**Features**

Secure authentication with login and protected routes using React Router

Teacher overview with associated student lists

Student management with add, search, and list functionality

Responsive, mobile-friendly design with reusable components

Route protection using an AuthLayout wrapper

Modular reusable component structure for scalability

**Project Structure**
```text
src/
├── Components/
│   ├── AuthLayout.js
│   ├── Layout.js
│   ├── Layout.css
│   └── PrivateRoute.js
├── Pages/
│   ├── Dashboard/
│   │   ├── Dashboard.js
│   │   └── Dashboard.css
│   ├── Login/
│   │   ├── Login.js
│   │   └── Login.css
│   ├── Signup/
│   │   ├── SignupForm.js
│   │   └── Signup.css
│   └── TeacherOverview/
│       ├── TeacherOverview.js
│       └── TeacherOverview.css
├── Services/
│   ├── api.js
│   └── AuthService.js
├── Validation/
│   └── validation.js
└── App.js
```
**Tech Stack**

Frontend: React.js, React Router DOM

State Management: React Hooks (useState, useEffect)

Styling: CSS3 (component-level styles)

HTTP Requests: Axios

Authentication: JWT (JSON Web Token) decoding for user session handling

**Installation & Setup**

Clone the repository

git clone https://github.com/sujapoo/TeachPortalWeb.git
cd TeachPortalWeb


Install dependencies

npm install


Install required packages

npm install axios react-router-dom jwt-decode


Start the development server

npm start


By default, the app runs on:
http://localhost:3000/

**Future Enhancements**

Data persistence with backend API

Role-based user access levels

Sorting, filtering, and pagination improvements

Integration with a database (e.g., MongoDB, PostgreSQL)
