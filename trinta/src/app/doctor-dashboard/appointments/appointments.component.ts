import { Component } from '@angular/core';
import { TAllCoursesComponent } from '../../tables/t-all-courses/t-all-courses.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
    imports: [TAllCoursesComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {

}
