import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Evaluation } from '../../models/Evaluation';
import { PeriodicElement } from '../../tables/t-recent-orders/t-recent-orders.component';
import { EditEvaluationDialogComponent } from './edit-evaluation-dialog/edit-evaluation-dialog.component';
import { AddEvaluationDialogComponent } from './add-evaluation-dialog/add-evaluation-dialog.component';
import { DeleteEvaluationDialogComponent } from './delete-evaluation-dialog/delete-evaluation-dialog.component';
import { EvaluationService } from '../services/evaluation.service';

@Component({
  selector: 'app-list-evaluation',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule, NgIf,MatDialogModule,MatIcon],
  templateUrl: './list-evaluation.component.html',
  styleUrl: './list-evaluation.component.scss'
})
export class ListEvaluationComponent {
  Evaluations : Evaluation[]=[]  
  displayedColumns: string[] = ['#','EvaluationDate', 'PersonnelMedicale','Patient', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(private EVServices :EvaluationService,public dialog: MatDialog) {}

  ngOnInit(){
    this.EVServices.getAllEvaluations().subscribe((data)=>{
      this.Evaluations=data
      console.log(this.Evaluations)
    })
  }



  
  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(EditEvaluationDialogComponent, {
      width: '500px',
      height: '400px',
      data: { specialtyId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The edit dialog was closed');
    });
  }

  openDeleteDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteEvaluationDialogComponent, {
      width: '500px',
      height: '200px',      
      data: { specialtyId: id }
    });
  }
    openAddDialog(){
      const dialogRef = this.dialog.open(AddEvaluationDialogComponent, {
        width: '500px',
        height: '400px',
        
      });
  }




}
