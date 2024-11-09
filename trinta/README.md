# Doctor Appointment Management System

This project is an Angular application for managing doctor appointments. It allows users (patients) to book appointments with doctors, view available doctors, and manage their appointments. Doctors can view their schedules and patient details, while the admin can manage doctors and patient information.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
## Features

- Patient Registration and Login
- Browse and Search Doctors
- Book Appointments
- View Appointment History
- Doctors can view upcoming appointments
- Admin can manage doctors and patients

## Tech Stack

- **Angular**: 17.2.2
- **Node.js**: 18.x.x (or higher)
- **TypeScript**: 5.x.x
- **Angular CLI**: 17.2.2
- **CSS/SCSS**: For styling
- **Backend API**: Express
- **Database**: MongoDB

## Installation

To run this application locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ikramdhib/doctorAppointmentSystemFullApp
2.**Install** :
      ```bash
      
      npm install
       npm install -g @angular/cli@17.2.2
3.**Configure environment**: 
       ```bash
       
            export const environment = {
              production: false,
              apiUrl: 'http://localhost:5000/**'
            };

## running-the-application
Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.
  ```bash
    ng serve -o
