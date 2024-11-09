import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { Evaluation } from '../../../models/Evaluation';
import { EvaluationService } from '../../services/evaluation.service';

@Component({
  selector: 'app-add-evaluation-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatDialogTitle,
    MatError,
    MatDialogActions,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    MatDialogContent,
    MatSnackBarModule,
  ],
  templateUrl: './add-evaluation-dialog.component.html',
  styleUrl: './add-evaluation-dialog.component.scss'
})
export class AddEvaluationDialogComponent {
  evaluationForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddEvaluationDialogComponent>,
    private evalService: EvaluationService, // Service for handling evaluations
    private snackBar: MatSnackBar  
  ) {
    this.evaluationForm = new FormGroup({
      EvaluationDate: new FormControl(new Date(), Validators.required),  // Set to current date by default
      Pm: new FormControl('', Validators.required),
      Patient: new FormControl('', Validators.required),
    });
  }

  onCancel(): void {
    console.log("Cancel evaluation");
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.evaluationForm.valid) {
      const newEvaluation: Evaluation = this.evaluationForm.value;
      this.evalService.addEvaluation(newEvaluation).subscribe(() => {
        console.log("Evaluation added");
        this.snackBar.open('✔ Evaluation added successfully!', '', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-bar-success']
        });
        this.dialogRef.close(newEvaluation);
      });
    }
  }
}
