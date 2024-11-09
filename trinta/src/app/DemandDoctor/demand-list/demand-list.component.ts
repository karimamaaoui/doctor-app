import { Component, inject, ViewChild } from '@angular/core';
import { DemandDoctor } from '../../models/demand';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { DemandDoctorService } from '../services/demand-doctor.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailsDemandComponent } from '../details-demand/details-demand.component';

@Component({
  selector: 'app-demand-list',
  standalone: true,
  imports: [  RouterLink,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    DatePipe,
    MatIcon,],
  templateUrl: './demand-list.component.html',
  styleUrl: './demand-list.component.scss'
})
export class DemandListComponent {

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
