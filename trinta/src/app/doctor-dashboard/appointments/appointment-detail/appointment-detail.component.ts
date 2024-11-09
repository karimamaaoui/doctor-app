import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../../loading-spinner/loading-spinner.component';
import { DoctorServesService } from '../../services/doctor.service';
import { NotificationService } from '../../../common/services/notification.service';
import { AddAppointmentDoctorComponent } from '../../calendrier/add-appointment-doctor/add-appointment-doctor.component';

@Component({
  selector: 'app-appointmnet-detail',
  standalone: true,
  imports: [LoadingSpinnerComponent,MatIconModule,MatChipsModule,MatMenuModule,MatCardModule,CommonModule,
    MatNativeDateModule,MatButtonModule,
    MatDialogModule],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.scss'
})
export class AppointmnetDetailComponent {

  appointment: any;
  doctorID:any;
  
  isLoading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<AppointmnetDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private doctorService: DoctorServesService,
    public notificationService : NotificationService,
    public toster : ToastrService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {this.appointment = data.appointment;}

  

    ngOnInit() {
      if (localStorage.hasOwnProperty('userID')) {
        this.doctorID = localStorage.getItem('userID');
        console.log('doctor id', this.doctorID);
      }
      this.isLoading = false;
      
    }

    getStatusColor(status: string): string {
      switch (status) {
        case 'PLANIFIED':
          return 'primary'; // Classe CSS pour PLANIFIED
        case 'FINISHED':
          return 'accent'; // Classe CSS pour FINISHED
        case 'CANCLED':
          return 'warn'; // Classe CSS pour CANCLED
        case 'UNPLANNED':
          return 'default'; // Classe CSS pour UNPLANNED
        default:
          return 'default'; // Couleur par défaut si inconnu
      }
    }
  // Méthode pour fermer le dialogue
  closeDialog(): void {
    this.dialogRef.close();
  }
  updateAppointmentStatus(appointmentID:any , appointmentStatus:any){
 
    this.closeDialog()
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this appointment?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doctorService.updateAppointmentStatus(appointmentID,appointmentStatus).subscribe({
          next: (res: any) => {
              if(appointmentStatus=='CANCLED'){
                  const notification = {
                      senderId: this.doctorID,
                      recipientId:res.patient._id,
                      appointmentId:appointmentID,
                      message: "Your appointment is cancel by your doctor , please take another appointment or contact your doctor",
                      type:"CANCELED"
                  }
                  console.log(notification,'"""""');
                  
                  this.notificationService.sendNotification(notification).subscribe({
                      next:(res:any)=>{
                          console.log("success");
                      }
                  });
              }
          },
          complete: () => {
              this.toster.success('Changed with success');
              this.cdr.detectChanges();
              this.closeDialog();
          },
          error: (err) => {
              this.toster.error('Erreur when updating');
              console.error('Erreur:', err);
          }
      });
      } else {
        console.log('Appointment not canceled');
      }
    });


    
  }

  
  openUpdateDialog(appointment:any): void {

    this.closeDialog();
        
    let appointmentTime: string | null = null;
    let appointmentDate: string | null = null;

if (appointment) {
  const dateTime = new Date(appointment.dateAppointment);
  // Formater la date et l'heure
  appointmentDate = dateTime.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  appointmentTime = dateTime.toTimeString().split(' ')[0].substring(0, 5); // 'HH:MM'
  
}
        const dialogRef = this.dialog.open(AddAppointmentDoctorComponent, {
            
          data: {
            appointmentId: appointment._id,
            date:appointmentDate,
            time: appointmentTime,
            mode: appointment.type,
            email: appointment.patient.email
          }
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Updated Appointment:', result);
            // Actualisez la vue ou les données si nécessaire
          }
        });
      }

}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatIconModule,MatChipsModule,MatMenuModule,MatCardModule,CommonModule,
    MatNativeDateModule,MatButtonModule,
    MatDialogModule],
  template: `
    <h1 mat-dialog-title>Confirmation</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="onCancelClick()">Cancel</button>
      <button mat-button color="warn" (click)="onConfirmClick()">OK</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }
}
