import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { DemandDoctorService } from '../../../DemandDoctor/services/demand-doctor.service';
import { DemandDoctor } from '../../../models/demand';
import { MatIcon } from '@angular/material/icon';
import { DetailsDemandComponent } from '../../../DemandDoctor/details-demand/details-demand.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    DatePipe,
    MatIcon,
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent {
  displayedColumns: string[] = [
    'client',
    'diplomaName',
    'address',
    'phoneNumber',
    'hospitalName',
    'state',
    'action',
  ];

  demandSer = inject(DemandDoctorService);
  demands: DemandDoctor[] = [];
  dataSource = new MatTableDataSource<DemandDoctor>([]);
  dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.loadDemand();
  }

  loadDemand() {
    this.demandSer.getAllDemand().subscribe({
      next: (data: DemandDoctor[]) => {
        this.demands = data;
        this.dataSource.data = this.demands;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        console.error('Error loading DemandDoctor :', err);
      },
    });
  }

  openDialog(demand: DemandDoctor) {
    const dialogRef = this.dialog.open(DetailsDemandComponent, {
      width: '600px',
      data: demand, 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.loadDemand(); 
      }
      console.log('Dialog closed', result);
    });
  }
}
