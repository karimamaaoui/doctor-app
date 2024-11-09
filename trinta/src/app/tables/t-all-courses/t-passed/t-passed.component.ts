import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { LoadingSpinnerComponent } from '../../../loading-spinner/loading-spinner.component';
import { DoctorServesService } from '../../../doctor-dashboard/services/doctor.service';
import { DialogComponent } from '../../../doctor-dashboard/dialog/dialog.component';
import { AddAppointmentDoctorComponent } from '../../../doctor-dashboard/calendrier/add-appointment-doctor/add-appointment-doctor.component';

@Component({
    selector: 'app-t-passed',
    standalone: true,
    imports: [MatDatepickerModule,
      MatFormFieldModule,
      MatInputModule,
      MatNativeDateModule,LoadingSpinnerComponent,NgIf,CommonModule, DatePipe,MatCardModule, MatMenuModule, MatButtonModule, RouterLink, MatTableModule, MatPaginatorModule, MatProgressBarModule],
    templateUrl: './t-passed.component.html',
    styleUrl: './t-passed.component.scss'
})
export class TPassedComponent {
  isLoading: boolean = true;
  filteredData : any[] = [] ;

    ELEMENT_DATA : any[] =[] ;
    status="PLANIFIED";
    doctorID :any;
    displayedColumns: string[] = ['patient','appointmentDate','time', 'duration', 'status', 'type' , 'action'];
    dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
 
    constructor(public toster : ToastrService,private DoctorServes: DoctorServesService, private cdr: ChangeDetectorRef,public dialog: MatDialog , private snackBar: MatSnackBar) {}
    ngOnInit() {
        if (localStorage.hasOwnProperty('userID')) {
            this.doctorID = localStorage.getItem('userID');
            console.log('doctor id', this.doctorID);
        }
        this.LoadAppointment(this.doctorID, this.status);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    LoadAppointment(doctorID: string , status :string) {
        this.DoctorServes.getAllAppointmentswithstatus(doctorID,status).subscribe({
            next: (res: any) => {
                this.filteredData = res;
                this.ELEMENT_DATA = res;
                this.dataSource.data = this.ELEMENT_DATA;
                this.isLoading=false;
                this.cdr.detectChanges();
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

    //delet pointment
    deleteAppointmentwithID(appointmentID:any){
        this.DoctorServes.deleteAppointmentWithID(appointmentID).subscribe({
            next: (res: any) => {
                this.LoadAppointment(this.doctorID , this.status);
                this.isLoading=false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.toster.error('Something went wrong');
                this.isLoading=false;
                console.error('Erreur:', err);
            }
        });
    }

    deleteAppointment(appointmentID: any): void {
        const dialogRef = this.dialog.open(DialogComponent);
    
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.deleteAppointmentwithID(appointmentID);
          }
        });
      }

      openUpdateDialog(appointment:any): void {
        
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
