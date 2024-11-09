import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AppointmentCardComponent } from './appointment-card/appointment-card.component';

@Component({
  selector: 'app-today-appointment',
  standalone: true,
  imports: [RouterLink, MatCardModule, AppointmentCardComponent],
  templateUrl: './today-appointment.component.html',
  styleUrl: './today-appointment.component.scss'
})
export class TodayAppointmentComponent {

}
