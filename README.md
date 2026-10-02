# 🏥 Medicare — Hospital Management System

A full-stack **Hospital Management System** built with **React, Node.js, Express.js, and MongoDB** that provides a complete platform for patients, doctors, and administrators.

Medicare allows users to book doctor appointments and hospital services, make payments through **Stripe**, manage their profiles and bookings, and communicate with the hospital through **WhatsApp**.

The system also includes dedicated **Admin** and **Doctor** panels for managing doctors, services, appointments, service bookings, and patient interactions.

---

## 🚀 Features

### 👤 User / Patient

* 🔐 User registration and login
* 🚪 User logout
* 👤 View and update profile
* 🏠 Responsive home page
* 👨‍⚕️ Browse available doctors
* 📅 Book doctor appointments
* 🧪 Book hospital services
* 💳 Pay online using **Stripe**
* 💵 Choose cash payment
* 📋 View booked doctor appointments
* 🧾 View booked services
* 📊 Track appointment and service booking status
* 💬 Contact the hospital directly through **WhatsApp**

> 🔒 Users must be logged in to book doctors or hospital services.

---

### 👨‍💼 Admin Panel

Only authorized administrators can access the Admin Panel.

* 🔐 Admin login
* 🚪 Admin logout
* 📊 Admin dashboard
* 👨‍⚕️ Add new doctors
* 📝 Manage doctor information
* 👨‍⚕️ View list of doctors
* 🧪 Add hospital services
* 📋 View list of services
* 📅 View doctor appointments
* 🧪 View service appointments
* ❌ Cancel doctor appointments
* ❌ Cancel service bookings
* 📊 Manage service-related information
* 🔄 Monitor appointment and booking statuses

---

### 👨‍⚕️ Doctor Panel

Only authorized doctors can access the Doctor Panel.

* 🔐 Doctor login
* 🚪 Doctor logout
* 📊 Doctor dashboard
* 📅 View assigned appointments
* 🔄 Update appointment status
* 👤 View doctor profile
* ✏️ Update doctor profile
* 📋 Manage appointment information

Doctors can update appointment statuses such as:

* Pending
* Confirmed
* Completed
* Cancelled

---

## 🧪 Hospital Services

Users can book different hospital services through the platform.

Currently supported services include:

* 🧪 Laboratory Tests
* 🩺 Health Checkups

The service system allows users to:

1. Browse available services.
2. Select a service.
3. Book the service.
4. Choose a payment method.
5. View the booked service.
6. Track its status.

Administrators can add and manage these services from the Admin Panel.

---

## 💳 Payment System

Medicare supports both **cash and online payments**.

### 💵 Cash Payment

Users can select cash payment when booking an appointment or service.

### 💳 Online Payment

Online payments are handled using **Stripe**.

The Stripe integration allows users to securely make online payments for:

* 👨‍⚕️ Doctor appointments
* 🧪 Hospital services

---

## 🔐 Authentication & Authorization

Medicare uses **Clerk** for authentication.

Different access levels are provided for different types of users:

```text
User
 ├── Login
 ├── Profile
 ├── Doctor Booking
 └── Service Booking

Admin
 ├── Login
 ├── Dashboard
 ├── Manage Doctors
 ├── Manage Services
 └── Manage Appointments

Doctor
 ├── Login
 ├── Dashboard
 ├── Manage Appointments
 └── Manage Profile
```

Role-based access ensures that:

* 👤 Users can access user features.
* 👨‍💼 Admins can access administrative features.
* 👨‍⚕️ Doctors can access doctor-specific features.

---

## 🛠️ Built With

### Frontend

* ⚛️ React.js
* 📜 JavaScript
* 🎨 HTML5
* 🎨 CSS3
* 🎨 Tailwind CSS
* 🔀 React Router

### Backend

* 🟢 Node.js
* 🚂 Express.js
* 📡 REST API

### Database

* 🍃 MongoDB
* ☁️ MongoDB Atlas

### Authentication

* 🔐 Clerk

### Payment

* 💳 Stripe

### Deployment

* ▲ Vercel

### Other Tools & Technologies

* Git
* GitHub
* Postman
* Cloudinary
* Multer
* Environment Variables

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       Medicare      │
                    │    Hospital System  │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
        👤 User            👨‍💼 Admin         👨‍⚕️ Doctor
             │                 │                 │
             │                 │                 │
             ▼                 ▼                 ▼
       Book Doctor       Manage Doctors      View Appointments
       Book Services     Manage Services     Update Status
       Make Payment      Manage Bookings     Manage Profile
       View Bookings     Cancel Bookings
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │    Backend API  │
                      │ Node + Express  │
                      └────────┬────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
             MongoDB Atlas              Stripe
              Database                  Payments
```

---

## 📂 Project Structure

```text
Medicare/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── admin/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ⚙️ How It Works

### 👤 User Flow

1. User opens the Medicare website.
2. User can choose the **User Login** option.
3. User logs in using Clerk authentication.
4. User can browse doctors and available services.
5. User selects a doctor and books an appointment.
6. User selects a payment method:

   * Cash
   * Online payment through Stripe
7. User can view their appointment and payment information.
8. User can track appointment status.
9. User can also book laboratory tests or health checkups.
10. User can view their service bookings.
11. User can contact the hospital through WhatsApp.

---

### 👨‍💼 Admin Flow

1. Admin opens the Admin Login option.
2. Admin authenticates through the system.
3. Admin enters the Admin Dashboard.
4. Admin can add and manage doctors.
5. Admin can add and manage hospital services.
6. Admin can view doctor appointments.
7. Admin can view service bookings.
8. Admin can cancel appointments or service bookings.
9. Users can see the updated booking status.

---

### 👨‍⚕️ Doctor Flow

1. Doctor logs into the Doctor Panel.
2. Doctor accesses the Doctor Dashboard.
3. Doctor views assigned appointments.
4. Doctor checks appointment details.
5. Doctor updates the appointment status.
6. Doctor can view their profile.
7. Doctor can update their profile information.

---

## 🔄 Appointment Status Flow

```text
             ┌─────────┐
             │ Pending │
             └────┬────┘
                  │
                  ▼
            ┌───────────┐
            │ Confirmed │
            └─────┬─────┘
                  │
                  ▼
            ┌───────────┐
            │ Completed │
            └───────────┘

                  OR

             ┌─────────┐
             │ Pending │
             └────┬────┘
                  │
                  ▼
            ┌───────────┐
            │ Cancelled │
            └───────────┘
```

Appointment status can be managed according to the actions performed by the admin or doctor.

---

## 🔑 Environment Variables

Created `.env` files for the required credentials.


## 🧠 Challenges Faced

### 🔐 Role-Based Authentication

One of the major challenges was creating separate access levels for **users, admins, and doctors**.

### Solution

Clerk authentication was integrated to handle authentication while role-based authorization was used to control access to different parts of the system.

---

### 📅 Appointment Management

Managing appointments required handling different states such as pending, confirmed, completed, and cancelled.

### Solution

The appointment status is stored and updated through the backend API, allowing doctors and administrators to manage appointment progress.

---

### 💳 Payment Integration

Another challenge was integrating both cash and online payment options.

### Solution

Stripe was integrated to process online payments, while cash payments are handled separately within the booking system.

---

### 🔄 Frontend & Backend Communication

The frontend needs to communicate with the backend for doctors, services, appointments, users, and payments.

### Solution

RESTful APIs were created using **Node.js and Express.js**, with React consuming these APIs to dynamically display and update information.

---

### 🗄️ Database Management

Managing different types of information such as doctors, users, appointments, services, and bookings required a structured database design.

### Solution

MongoDB was used to store and manage the application's data, with MongoDB Atlas providing cloud-based database hosting.

---

## 📚 What I Learned

Through this project, I learned and practiced:

* ⚛️ Building complex React applications
* 🟢 Developing REST APIs with Node.js
* 🚂 Working with Express.js
* 🍃 Designing and managing MongoDB databases
* 🔐 Implementing authentication with Clerk
* 👥 Implementing role-based access control
* 💳 Integrating Stripe payments
* 📅 Building appointment booking systems
* 🧪 Creating service booking functionality
* 🔄 Managing application state
* 🌐 Connecting frontend and backend APIs
* ☁️ Deploying full-stack applications on Vercel
* 🖼️ Handling image uploads with Cloudinary
* 📦 Managing environment variables
* 🛠️ Debugging and troubleshooting full-stack applications

---

## 🔮 Future Improvements

Some possible improvements for future versions include:

* 📧 Email notifications for appointments
* 🔔 Real-time appointment notifications
* 📱 SMS notifications
* 📅 Advanced doctor availability and scheduling
* 💰 Payment history and invoices
* 🧾 Downloadable appointment receipts
* 📊 More advanced analytics for administrators
* ⭐ Patient reviews and doctor ratings
* 🔎 Advanced doctor and service search
* 🗓️ Calendar-based appointment management
* 💬 In-app patient-doctor communication
* 📱 Progressive Web App (PWA) support

---

## ☁️ Deployment

The Medicare system has been deployed using **Vercel**.

The project contains:

* Frontend application
* Backend API
* Admin Panel

All major application components are deployed and configured for production use.

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd Medicare
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 5. Install Admin Dependencies

```bash
cd ../admin
npm install
```

### 6. Configure Environment Variables

Create the required `.env` files and add:

* MongoDB credentials
* Clerk credentials
* Stripe credentials
* Cloudinary credentials
* Other required environment variables

### 7. Run the Applications

Start the backend:

```bash
npm start
```

Start the frontend:

```bash
npm run dev
```

Start the admin panel:

```bash
npm run dev
```

---

## 🔗 Project Links

**Live Website:** 

**GitHub Repository:** 

---

## 👨‍💻 Author

**Rahim**

Full Stack Web Developer

Built with **React, Node.js, Express.js, MongoDB, Clerk, and Stripe**.

If you found this project interesting, feel free to ⭐ the repository and share your feedback.

---
