import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { Speciality } from '../../models/speciality';
import { SpecialitiesService } from '../../DemandDoctor/services/specialities.service';
@Component({
  selector: 'app-add-speciality-dialog',
  standalone: true,
  imports:  [
    MatFormField,
  MatLabel,
  MatDialogTitle,
  MatError,
  MatDialogActions,
  MatInputModule,
  MatButtonModule,
  ReactiveFormsModule,
  FormsModule,
  NgIf,
  MatDialogContent,
  MatSnackBarModule, ],
  templateUrl: './add-speciality-dialog.component.html',
  styleUrl: './add-speciality-dialog.component.scss'
})
export class AddSpecialityDialogComponent {
  specialityForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddSpecialityDialogComponent>,
    private specServices: SpecialitiesService,
    private snackBar: MatSnackBar  
  ) {
    this.specialityForm = new FormGroup({
      SpecialtyType: new FormControl('', Validators.required),
      TotalPractitioners: new FormControl('', [Validators.required, Validators.min(1)]),  // Added min validator for TotalPractitioners
    });
  }

  onCancel(): void {
    console.log("cancel");
    this.dialogRef.close();
  }

  onSubmit(): void {
    const newSpeciality: Speciality = this.specialityForm.value;
    this.specServices.addSpecialty(newSpeciality).subscribe(() => {
      console.log("Speciality added");
      this.snackBar.open('✔ Speciality added successfully!', '', {
        duration: 1000,  
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-bar-success']  
      });
      this.dialogRef.close(newSpeciality);
    });
  }
}

