import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorServesService } from '../../services/doctor.service';

@Component({
  selector: 'app-top-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-patients.component.html',
  styleUrl: './top-patients.component.scss'
})
export class TopPatientsComponent {
  topPatients: any[] = [];
  doctorID:any;
  constructor(private doctorService: DoctorServesService) {}
  ngOnInit(): void {
    if (localStorage.hasOwnProperty('userID')) {
       this.doctorID = localStorage.getItem('userID');
       this.loadTopPatients();
  }
  }


  loadTopPatients(): void {
    this.doctorService.getTopPatients(this.doctorID).subscribe(
      data => {
        this.topPatients = data;
      },
      error => {
        console.error('Error loading top patients', error);
      }
    );
  }

  getStars(count: number): number[] {
    // Return an array of numbers representing stars, limited to 5 stars.
    return Array(Math.min(count, 5)).fill(0);
  }
}
