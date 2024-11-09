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
import { MatTooltipModule } from '@angular/material/tooltip'; // Import MatTooltipModule
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { T } from '@angular/cdk/keycodes';
import { LoadingSpinnerComponent } from '../../../loading-spinner/loading-spinner.component';
import { DoctorServesService } from '../../../doctor-dashboard/services/doctor.service';
import { NotificationService } from '../../../common/services/notification.service';
@Component({
    selector: 'app-t-in-progress',
    standalone: true,
    imports: [MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,LoadingSpinnerComponent,MatTooltipModule,NgIf,CommonModule, DatePipe,MatCardModule, MatMenuModule, MatButtonModule, RouterLink, MatTableModule, MatPaginatorModule, MatProgressBarModule],
    templateUrl: './t-in-progress.component.html',
    styleUrl: './t-in-progress.component.scss'
})
export class TInProgressComponent {
    isLoading: boolean = true;
    filteredData : any[] = [] ;

    ELEMENT_DATA : any[] =[] ;
    status="UNPLANNED";
    doctorID :any;
    displayedColumns: string[] = ['patient','appointmentDate','time', 'duration', 'status', 'type' , 'action'];
    dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator: MatPaginator;
 
    constructor(public toster : ToastrService,private DoctorServes: DoctorServesService,
        public notificationService : NotificationService,
        private cdr: ChangeDetectorRef ,public dialog: MatDialog , private snackBar: MatSnackBar) {}
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
                console.log(res);
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
   

      //confirm appointment 
      updateAppointmentStatus(appointmentID:any , appointmentStatus:any){
        this.isLoading=true;
        this.DoctorServes.updateAppointmentStatus(appointmentID,appointmentStatus).subscribe({
            next: (res: any) => {
                this.LoadAppointment(this.doctorID , this.status);
                console.log(res.patient,"eeeeeeeeeeeeeeeeeeee/");
                
                if(appointmentStatus=='CANCLED'){
                    const notification = {
                        senderId: this.doctorID,
                        recipientId:res.patient._id,
                        appointmentId:appointmentID,
                        message: "Your appointment is cancel by your doctor , please take another appointment or contact your doctor",
                        type:"CANCELED"
                    }
                    this.notificationService.sendNotification(notification).subscribe({
                        next:(res:any)=>{
                            console.log(res);
                        }
                    });
                    this.toster.success('the appointment is cancled');
                    this.cdr.detectChanges();
                    this.isLoading=false;
                }else if(appointmentStatus=='PLANIFIED'){
                    const notification = {
                        senderId: this.doctorID,
                        recipientId:res.patient._id,
                        appointmentId:appointmentID,
                        message: "Your appointment is confirmed by your doctor , please be on time !!",
                        type:"CONFIRMED"
                    }
                    this.notificationService.sendNotification(notification).subscribe({
                        next:(res:any)=>{
                            console.log(res);
                            
                        }
                    });
                    this.toster.success('the appointment is confirmed');
                    this.cdr.detectChanges();
                    this.isLoading=false;
                    
                }
            },
            error: (err) => {
                this.toster.error('Erreur when updating');
                console.error('Erreur:', err);
                this.isLoading=false;
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
