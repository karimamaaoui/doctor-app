import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Speciality } from '../models/speciality';
import { PeriodicElement } from '../tables/t-recent-orders/t-recent-orders.component';
import { SpecialitiesService } from '../DemandDoctor/services/specialities.service';
import { AddSpecialityDialogComponent } from './add-speciality-dialog/add-speciality-dialog.component';
import { DeleteSpecialityDialogComponent } from './delete-speciality-dialog/delete-speciality-dialog.component';
import { EditSpecialityDialogComponent } from './edit-speciality-dialog/edit-speciality-dialog.component';

@Component({
  selector: 'app-list-specialites',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule, NgIf,MatDialogModule,MatIcon],
  templateUrl: './list-specialites.component.html',
  styleUrl: './list-specialites.component.scss'
})
export class ListSpecialitesComponent {
  Specialities : Speciality[]= [];
  displayedColumns: string[] = ['#','Speciality Name', 'Total Practitioners', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
  }

  action: {
    edit: 'ri-edit-line',
    delete : 'ri-delete-bin-line'
}


  constructor(private SpecialityServices : SpecialitiesService ,public dialog: MatDialog ){}

  ngOnInit(): void {
    this.SpecialityServices.getSpecialities().subscribe((data)=>{
      this.Specialities = data;
      console.log(this.Specialities)
      console.log(data)
    })
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(EditSpecialityDialogComponent, {
      width: '500px',
      height: '400px',
      data: { specialtyId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The edit dialog was closed');
    });
  }

  openDeleteDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteSpecialityDialogComponent, {
      width: '500px',
      height: '200px',      
      data: { specialtyId: id }
    });
  }
    openAddDialog(){
      const dialogRef = this.dialog.open(AddSpecialityDialogComponent, {
        width: '500px',
        height: '400px',
        
      });
  }
 
}
