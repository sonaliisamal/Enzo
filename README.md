# 🌟 ENZO | Event Management System

> A seamless, full-stack platform for discovering, managing, and joining campus events in real-time.

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

---

## 📖 About The Project

Managing and attending events often involves a highly fragmented workflow across Google Forms, physical posters, and scattered messages. **ENZO** solves this friction by providing a unified, real-time platform. 

By implementing role-based access control, ENZO separates the organizer (Admin) experience from the attendee (User) experience. Organizers get a powerful dashboard to control event data, monitor attendee lists, and manage capacities, while users get a highly visual interface to search for events and RSVP instantly.

---

## ✨ Key Features

### 👤 For Users (Attendees)
* **Dynamic Event Discovery:** A highly visual grid of upcoming events featuring custom promotional posters.
* **Live Zero-Latency Filtering:** Instantly search and filter events by name, date, and time without page reloads.
* **One-Click RSVP:** Seamlessly toggle between "Join" and "Cancel" to manage registrations.
* **Smart Capacity Limits:** The system actively prevents users from joining events that are fully booked.

### 🛡️ For Administrators (Organizers)
* **Secure Admin Dashboard:** A protected route exclusively accessible to verified organizer accounts.
* **Full CRUD Management:** Create, Read, Update, and Delete events directly from a sleek UI.
* **Media Uploads:** Integrated `multer` functionality to upload and attach physical image files to event listings.
* **Live Attendee Tracking:** Generate real-time lists of registered users (Name, Registration Number, Phone, Email) for any specific event.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** HTML5, CSS3 (CSS Grid, Flexbox, Glassmorphism UI), Vanilla JavaScript (ES6+), Fetch API.
* **Backend:** Node.js, Express.js.
* **Database:** MySQL (Relational data, composite primary keys to natively prevent duplicate RSVPs).
* **Storage:** Local File System (`multer` for image uploads).

---

## 🚀 Getting Started

Follow these steps to get a local copy of ENZO up and running on your machine.

### Prerequisites
* Node.js installed on your machine.
* MySQL Server running locally.

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/enzo-event-system.git](https://github.com/your-username/enzo-event-system.git)
