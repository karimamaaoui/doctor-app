import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TodayAppointmentComponent } from './today-appointment/today-appointment.component';
import { PatientAppointmentsComponent } from './patient-appointments/patient-appointments.component';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule,RouterOutlet, MatCardModule, RouterLink, TodayAppointmentComponent,PatientAppointmentsComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss'
})
export class PatientDashboardComponent {

  appointments = [
    {
      doctorName: 'Dr. Cara Stevens',
      specialty: 'Radiologist',
      date: '12 June \'20',
      time: '09:00-10:00',
      treatment: 'CT scans',
      contact: '+123 676545655',
      status: 'Completed' // You can replace this with actual status like 'ch', 'hi', etc.
    },
    {
      doctorName: 'Dr. John Doe',
      specialty: 'Cardiologist',
      date: '13 June \'20',
      time: '11:00-11:30',
      treatment: 'Heart Checkup',
      contact: '+123 434656764',
      status: 'Completed'
    },
    // Add more appointments here...
  ];

  documents = [
    {
      name: 'Blood Report',
      iconClass: 'fa fa-file-pdf-o'
    },
    {
      name: 'Mediclaim Documents',
      iconClass: 'fa fa-file-word-o'
    },
    {
      name: 'Doctor Prescription',
      iconClass: 'fa fa-file-text-o'
    },
    {
      name: 'X-Ray Files',
      iconClass: 'fa fa-file-image-o'
    },
    {
      name: 'Urine Report',
      iconClass: 'fa fa-file-pdf-o'
    },
    {
      name: 'Scanned Documents',
      iconClass: 'fa fa-file-archive-o'
    }
  ];

  constructor() {}


}