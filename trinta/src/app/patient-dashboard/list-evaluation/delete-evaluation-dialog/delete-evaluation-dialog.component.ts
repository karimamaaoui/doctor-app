import { Component, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { EvaluationService } from '../../services/evaluation.service';

@Component({
  selector: 'app-delete-evaluation-dialog',
  standalone: true,
  imports: [ MatFormField,
    MatLabel,
    MatDialogTitle,
    MatError,
    MatDialogActions,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    MatIcon,
    MatDialogContent,
    MatSnackBarModule, ],
  templateUrl: './delete-evaluation-dialog.component.html',
  styleUrl: './delete-evaluation-dialog.component.scss'
})
export class DeleteEvaluationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteEvaluationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { specialtyId: string },
    private EvService: EvaluationService,
    private snackBar: MatSnackBar  

  ) {}

  onCancel(): void {
    this.dialogRef.close(); 
  }


  ngOnInit(){
    console.log(this.data.specialtyId);
  }

  onDelete(): void {
   this.EvService.deleteEvaluation(this.data.specialtyId).subscribe(() => {
      console.log('Speciality deleted');
      this.snackBar.open('✔ Evaluation deleted successfully!', '', {
        duration: 1000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-bar-success']
      });

      this.dialogRef.close();
   })
  }
}
