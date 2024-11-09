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
import { DialogComponent } from '../../../doctor-dashboard/dialog/dialog.component';
import { DoctorServesService } from '../../../doctor-dashboard/services/doctor.service';
@Component({
    selector: 'app-t-failed',
    standalone: true,
    imports: [MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,LoadingSpinnerComponent,MatSnackBarModule,NgIf,DatePipe,CommonModule,MatCardModule, MatMenuModule, MatButtonModule, RouterLink, MatTableModule, MatPaginatorModule, MatProgressBarModule],
    templateUrl: './t-failed.component.html',
    styleUrl: './t-failed.component.scss'
})
export class TFailedComponent {
    isLoading: boolean = true;
    ELEMENT_DATA : any[] =[] ;
    filteredData : any[] = [] ;

    status="CANCLED";
    doctorID :any;
    displayedColumns: string[] = ['patient','appointmentDate','time', 'duration', 'status', 'type' , 'action'];
    dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
 
    constructor(public toster : ToastrService,private DoctorServes: DoctorServesService, private cdr: ChangeDetectorRef ,public dialog: MatDialog , private snackBar: MatSnackBar) {}
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
                this.ELEMENT_DATA = res;
                this.filteredData = res;
                this.dataSource.data = this.ELEMENT_DATA;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erreur:', err);
                this.isLoading = false;
            }
        });
    }


    convertToUTCTime(dateString: string): string {
        const date = new Date(dateString);
        return date.toISOString().substring(11, 16); // Extract time in HH:mm format
    }

     //delet pointment
     deleteAppointmentwithID(appointmentID:any){
        console.log(appointmentID,"zzzzzzzzzzzzzzz")
        this.DoctorServes.deleteAppointmentWithID(appointmentID).subscribe({
            next: (res: any) => {
                this.LoadAppointment(this.doctorID , this.status);
                this.cdr.detectChanges();
                this.isLoading = false;
            },
            error: (err) => {
                this.toster.error('Something went wroong')
                console.error('Erreur:', err);
                this.isLoading = false;
            }
        });
    }

    deleteAppointment(appointmentID: any): void {
        this.isLoading = true;
        const dialogRef = this.dialog.open(DialogComponent);
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.deleteAppointmentwithID(appointmentID);
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
