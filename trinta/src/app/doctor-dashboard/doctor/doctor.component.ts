import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { RecentNotificationsComponent } from '../dashboard/recent-notifications/recent-notifications.component';
import { TopPatientsComponent } from '../dashboard/top-patients/top-patients.component';
import { WorkHoursChartComponent } from '../dashboard/work-hours-chart/work-hours-chart.component';
import { ToDoAppointmentComponent } from '../dashboard/to-do-appointment/to-do-appointment.component';
import { AppointmentBarChartComponent } from '../dashboard/appointment-bar-chart/appointment-bar-chart.component';
@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    RecentNotificationsComponent,
    TopPatientsComponent,
    WorkHoursChartComponent,
    ToDoAppointmentComponent,
    MatCardModule,
    RouterLink,
    AppointmentBarChartComponent,
  ],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss',
})
export class DoctorComponent {}
