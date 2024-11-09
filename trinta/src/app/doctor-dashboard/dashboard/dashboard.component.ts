import { Component } from '@angular/core';
import { RecentNotificationsComponent } from './recent-notifications/recent-notifications.component';
import { TopPatientsComponent } from './top-patients/top-patients.component';
import { WorkHoursChartComponent } from './work-hours-chart/work-hours-chart.component';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { ToDoAppointmentComponent } from './to-do-appointment/to-do-appointment.component';
import { AppointmentBarChartComponent } from './appointment-bar-chart/appointment-bar-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RecentNotificationsComponent,TopPatientsComponent,WorkHoursChartComponent,ToDoAppointmentComponent
    ,MatCardModule,RouterLink,AppointmentBarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
