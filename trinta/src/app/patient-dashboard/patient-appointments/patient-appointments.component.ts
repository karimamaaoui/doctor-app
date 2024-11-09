import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgIf } from '@angular/common';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {AddAppointmentComponent} from '../add-appointment/add-appointment.component';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import  {LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { DoctorServesService } from '../../doctor-dashboard/services/doctor.service';
import { NotificationService } from '../../common/services/notification.service';
import { PatientService } from '../services/patient.service';
import { DetailsDoctorModalComponent } from './details-doctor-modal/details-doctor-modal.component';
@Component({
  selector: 'app-patient-appointments',
  standalone: true,
    imports: [MatDatepickerModule,
      MatFormFieldModule,
      MatInputModule,
      MatNativeDateModule,LoadingSpinnerComponent,MatTooltipModule,DatePipe,MatCardModule, MatMenuModule, MatButtonModule, RouterLink, MatTableModule, MatPaginatorModule, NgIf],
  templateUrl: './patient-appointments.component.html',
  styleUrl: './patient-appointments.component.scss'
})
export class PatientAppointmentsComponent {
    filteredData : any[] = [] ;
    ELEMENT_DATA : any[] =[] ;
  patientID :any;
  displayedColumns: string[] = [ 'doctor', 'appointmentDate', 'time', 'type', 'status','action'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  isLoading: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public toster : ToastrService,public DoctorServes : DoctorServesService, 
    public notificationService :  NotificationService,
     public dialog: MatDialog ,private PatientServes: PatientService, private cdr: ChangeDetectorRef ) {}

  ngOnInit() {
    if (localStorage.hasOwnProperty('userID')) {
      this.patientID = localStorage.getItem('userID');
      console.log('patient id', this.patientID);
  }
    this.LoadAppointment(this.patientID);
}
  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
  }


  LoadAppointment(patientID: string) {
    this.PatientServes.getAllAppointments(patientID).subscribe({
        next: (res: any) => {
                this.filteredData = res;
                this.ELEMENT_DATA = res;
            this.dataSource.data = this.ELEMENT_DATA;
            console.log(res);
            this.cdr.detectChanges();
            this.isLoading=false;
        },
        error: (err) => {
            console.error('Erreur:', err);
            this.isLoading=false;

        }
    });
}

convertToUTCTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().substring(11, 16); // Extract time in HH:mm format
}

openDoctorDetails(element: any): void {
  this.dialog.open(DetailsDoctorModalComponent, {
    width: '400px',
    data: {
      doctor: {
        ...element.doctor,
        profileImageUrl: 'assets/images/courses/course22.jpg' // ou l'URL de l'image du profil
      }
    }
  });
}

updateAppointmentStatus(appointmentID:any){
  this.isLoading=true;

  this.PatientServes.cancelAppointment(appointmentID).subscribe({
      next: (res: any) => {
          this.LoadAppointment(this.patientID);
          const notification = {
            senderId: res.patient,
            recipientId:res.doctor,
            appointmentId:appointmentID,
            message: "Your appointment is canceled , you can contact your patient ",
            type:"CANCELED"
        }
        this.notificationService.sendNotification(notification).subscribe({
          next:(res:any)=>{
            console.log("success");
            
          }
        });
        this.cdr.detectChanges();
        this.isLoading=false;

      },
      complete: () => {
          this.toster.success('Changed with success');
        
      },
      error: (err) => {
          this.toster.error('Erreur when updating');
          console.error('Erreur:', err);
          this.isLoading=false;

      }
  });
}


openAppointmentDialog(appointment: any = null): void {
  let appointmentTime: string | null = null;
let appointmentDate: string | null = null;

if (appointment) {
const dateTime = new Date(appointment.dateAppointment);
// Formater la date et l'heure
appointmentDate = dateTime.toISOString().split('T')[0]; // 'YYYY-MM-DD'
appointmentTime = dateTime.toTimeString().split(' ')[0].substring(0, 5); // 'HH:MM'
}

const dialogRef = this.dialog.open(AddAppointmentComponent, {
width: '500px',
data: appointment ? {
  isUpdateMode: true,
  appointmentId: appointment._id,
  appointmentDate: appointmentDate,
  appointmentMode: appointment.type,
  appointmentTime: appointmentTime,
  doctorID : appointment.doctor._id
} : {
  isUpdateMode: false
}
});
dialogRef.afterClosed().subscribe(result => {
  if (result) {
    console.log('Appointment processed:', result);
   this.LoadAppointment(this.patientID);
   this.cdr.detectChanges();
  }
});

}
filterByDate(selectedDate: Date) {
  if (!selectedDate) {
      // Si aucune date n'est sélectionnée, afficher toutes les données
      this.dataSource.data = this.ELEMENT_DATA;
  } else {
      // Récupération des parties de la date locale sans conversion à UTC
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0, donc ajouter +1
      const day = String(selectedDate.getDate()).padStart(2, '0');

      // Construire la chaîne de caractères au format 'YYYY-MM-DD'
      const selectedDateString = `${year}-${month}-${day}`;

      // Filtrer les données
      this.dataSource.data = this.ELEMENT_DATA.filter((appointment: any) =>
          appointment.dateAppointment.startsWith(selectedDateString)
      );
  }
  this.cdr.detectChanges();
}
}

