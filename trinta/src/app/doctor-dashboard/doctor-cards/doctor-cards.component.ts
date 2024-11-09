import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import  {LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";
import { DoctorServesService } from '../services/doctor.service';
import { AddAppointmentComponent } from '../../patient-dashboard/add-appointment/add-appointment.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Auth/services/auth.service';
import { DialogueAuthComponent } from '../../Auth/dialogue-auth/dialogue-auth.component';

@Component({
  selector: 'app-doctor-cards',
  standalone: true,
  imports: [LoadingSpinnerComponent,CommonModule],
  templateUrl: './doctor-cards.component.html',
  styleUrl: './doctor-cards.component.scss'
})
export class DoctorCardsComponent {

  @Input() title: string = '';
  @Input() description: string = 'Lorem ipsum dolor sit amet, consecte tur adipiscing elit aliquet iTristique id nibh lobortis nunc';

  constructor(public Authserv : AuthService ,private route: ActivatedRoute,private cdr: ChangeDetectorRef, private doctorService: DoctorServesService, public dialog: MatDialog) { }
  isLoading: boolean = true;
  specialtyId:any;
  doctors: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.specialtyId = params.get('specialtyId');
      if (this.specialtyId) {
        this.getDoctors(this.specialtyId);
      }
    });
    this.isLoading= false;
  }

  getDoctors(specialtyId:any): void {
    this.doctorService.getAllDoctors(specialtyId).subscribe(
      (data:any) => {
        this.doctors = data;
        
      },
      (error) => {
        console.error('Erreur lors de la récupération des docteurs:', error);
      }
    );
  }

  isUserLoggedIn(): boolean {
    return this.Authserv.checkAuthStatus();
  }

  openAppointmentDialog(appointment: any = null, doctorID: any = null): void {
    console.log(doctorID, "***************************************");
  
    if (this.isUserLoggedIn()) {
      // Utilisateur connecté, ouvrir directement le dialogue de rendez-vous
      this.openAddAppointmentDialog(appointment, doctorID);
    } else {
      // Utilisateur non connecté, ouvrir le dialogue d'authentification
      const dialogRef = this.dialog.open(DialogueAuthComponent, {
        width: '400px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        // Si l'utilisateur s'est connecté avec succès (result = true)
        if (result) {
          // Ouvrir le dialogue de rendez-vous après authentification réussie
          this.openAddAppointmentDialog(appointment, doctorID);
        }
      });
    }
  }
  
  // Fonction pour ouvrir le dialogue de rendez-vous
  openAddAppointmentDialog(appointment: any, doctorID: any): void {
    this.dialog.open(AddAppointmentComponent, {
      width: '600px',
      data: appointment ? {
        isUpdateMode: true,
        appointmentId: appointment._id,
        appointmentDate: appointment.dateAppointment,
        appointmentMode: appointment.type,
        appointmentTime: appointment.time
      } : {
        isUpdateMode: false,
        appointmentDate: null,
        appointmentMode: null,
        appointmentTime: null,
        doctorID: doctorID
      }
    });
  }
  

}
