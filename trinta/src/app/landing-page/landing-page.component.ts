import { Component, inject, Input } from '@angular/core';
import {  RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SpecialitiesService } from '../DemandDoctor/services/specialities.service';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/services/auth.service';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  @Input() title: string = '';
  @Input() description: string = 'Lorem ipsum dolor sit amet, consecte tur adipiscing elit aliquet iTristique id nibh lobortis nunc';
  specialties: any[] = [];

  constructor(public Authserv : AuthService ,public specialiteSerivce : SpecialitiesService , private router: Router) {}

  isUserLoggedIn(): boolean {
    return this.Authserv.checkAuthStatus();
  }
  getImageForSpecialty(specialtyName: string): string {
    switch (specialtyName) {
      case 'Cardiology ':
        return 'assets/card-img-1.png';
      case 'Dermatology ':
        return 'assets/card-img-2.png';
      case 'Neurology ':
        return 'assets/card-img-3.png';
      case 'Pediatrics ':
        return 'assets/card-img-4.png';
      case 'Oncology ':
        return 'assets/card-img-5.png';
      case 'Psychiatry ':
        return 'assets/card-img-6.png';
        case 'Orthopedic Surgery':
        return 'assets/card-img-5.png';
      default:
        return 'assets/card-img-4.png';
    }
  }

  getAllSpecialties(): void {
    this.specialiteSerivce.getSpecialities().subscribe(
      (data: any) => {
        this.specialties = data;
      },
      (error) => {
        console.error('Error fetching specialties', error);
      }
    );
  }
  ngOnInit(): void {
    this.getAllSpecialties();
  }
  bookAppointment(specialtyId: string): void {
    this.router.navigate(['/doctors', specialtyId]);
  }
}
