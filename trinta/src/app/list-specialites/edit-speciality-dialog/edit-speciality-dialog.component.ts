import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { Speciality } from '../../models/speciality';
import { SpecialitiesService } from '../../DemandDoctor/services/specialities.service';


@Component({
  selector: 'app-edit-speciality-dialog',
  standalone: true,
  imports: [    MatLabel,
    MatFormField,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    NgIf ,
    MatDialogActions,
    MatLabel,
    MatFormField,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './edit-speciality-dialog.component.html',
  styleUrl: './edit-speciality-dialog.component.scss'
})
export class EditSpecialityDialogComponent {
  SpecialtyToEdit: Speciality;
  SpecialtyEdited: Speciality;
  

  constructor(
    public dialogRef: MatDialogRef<EditSpecialityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { specialtyId: string },
    private specialtyService: SpecialitiesService,
    private snackBar: MatSnackBar // Inject MatSnackBar here
  ) {}

  ngOnInit() {
    this.specialtyService.getSpecialtyById(this.data.specialtyId).subscribe((data) => {
      this.SpecialtyToEdit = data;
      this.SpecialtyEdited = { ...this.SpecialtyToEdit };
      console.log("This is the specialty to edit:", this.SpecialtyToEdit);
      console.log("This is the id to edit:", this.data.specialtyId);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    console.log("This is the id:", this.SpecialtyToEdit._id);
    this.specialtyService.updateSpecialty(this.data.specialtyId, this.SpecialtyEdited).subscribe(response => {
      console.log('Update response:', response);
      // Show snackbar on successful update
      this.snackBar.open('✔ Specialty updated successfully!', '', {
        duration: 1000,  // 1 second duration
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-bar-success'] // Optional: custom CSS class for styling
      });
      this.dialogRef.close(this.SpecialtyEdited);
    });
  }
}

