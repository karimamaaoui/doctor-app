import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { Evaluation } from '../../../models/Evaluation';
import { EvaluationService } from '../../services/evaluation.service';

@Component({
  selector: 'app-edit-evaluation-dialog',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    NgIf ,
    MatDialogActions
  ],
  templateUrl: './edit-evaluation-dialog.component.html',
  styleUrl: './edit-evaluation-dialog.component.scss'
})
export class EditEvaluationDialogComponent {
  EvToEdit: Evaluation;
  EVEdited: Evaluation;

  constructor(
    public dialogRef: MatDialogRef<EditEvaluationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { specialtyId: string },
    private EVServices: EvaluationService,
    private snackBar: MatSnackBar // Inject MatSnackBar here
  ) {}

  ngOnInit() {
    this.EVServices.getEvaluationById(this.data.specialtyId).subscribe((data) => {
      this.EvToEdit = data;
      this.EVEdited = { ...this.EvToEdit };
      console.log("This is the specialty to edit:", this.EvToEdit);
      console.log("This is the id to edit:", this.data.specialtyId);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    console.log("This is the id:", this.EvToEdit.EvaluationId);
    this.EVServices.updateEvaluation(this.data.specialtyId, this.EVEdited).subscribe(response => {
      console.log('Update response:', response);
      // Show snackbar on successful update
      this.snackBar.open('✔ Specialty updated successfully!', '', {
        duration: 1000,  // 1 second duration
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-bar-success'] // Optional: custom CSS class for styling
      });
      this.dialogRef.close(this.EVEdited);
    });
  }
}
