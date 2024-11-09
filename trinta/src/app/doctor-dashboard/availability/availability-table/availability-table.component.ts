import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { AddAvailabilityComponent } from '../add-availability/add-availability.component';
import  {LoadingSpinnerComponent } from "../../../loading-spinner/loading-spinner.component";
import { AvailabilityService } from '../services/add-availability.service';
import { PatientService } from '../../../patient-dashboard/services/patient.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-availability-table',
  standalone: true,
  imports: [LoadingSpinnerComponent,MatCardModule,MatTableModule,MatButtonModule,MatSortModule,MatTableModule,CommonModule,MatPaginatorModule],
  templateUrl: './availability-table.component.html',
  styleUrl: './availability-table.component.scss'
})
export class AvailabilityTableComponent {
  ELEMENT_DATA : any[] =[] ;
  isLoading: boolean = true;
  doctorID :any;
  displayedColumns: string[] = ['date', 'details','actions'];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( public AvailabilityService : AvailabilityService,public toster : ToastrService,public patientServices : PatientService, private cdr: ChangeDetectorRef ,  public dialog: MatDialog , private snackBar: MatSnackBar) {}
  ngOnInit() {
    if (localStorage.hasOwnProperty('userID')) {
      this.doctorID = localStorage.getItem('userID');
      console.log('doctor id', this.doctorID);
  }
    this.LoadAppointment(this.doctorID);
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}

  LoadAppointment(doctorID: string) {
    this.patientServices.getdoctorDetailsWithAvailibities(doctorID).subscribe({
        next: (res: any) => {
            this.ELEMENT_DATA = res.availabilities;
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

//delet pointment
deleteAvailabilitywithID(id:any){
  this.isLoading=true;
  console.log(id,"zzzzzzzzzzzzzzz")
  this.AvailabilityService.deleteAvailability(id).subscribe({
      next: (res: any) => {
          this.LoadAppointment(this.doctorID);
          this.isLoading=false;
          this.cdr.detectChanges();
      },
      error: (err) => {
          this.toster.error("Something went wrong");
          console.error('Erreur:', err);
          this.isLoading=false;
      }
  });
}

deleteAvailability(appointmentID: any): void {
  const dialogRef = this.dialog.open(DialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
    this.deleteAvailabilitywithID(appointmentID);
    }
  });
}

  // Open dialog to edit existing availability
  openEditDialog(availability: any): void {
    const dialogRef = this.dialog.open(AddAvailabilityComponent, {
      width: '400px',
      data: {id:availability._id, date: availability.date, timeSlots: availability.timeSlots }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.LoadAppointment(this.doctorID);
      }
    });
  }

}


