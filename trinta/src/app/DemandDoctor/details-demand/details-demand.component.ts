import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DemandDoctor } from '../../models/demand';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { DemandDoctorService } from '../services/demand-doctor.service';

@Component({
  selector: 'app-details-demand',
  standalone: true,
  imports: [MatDialogContent, CommonModule, MatDialogActions, MatIcon, MatRadioButton, MatRadioGroup, FormsModule, MatFormField, MatLabel, MatOption],
  templateUrl: './details-demand.component.html',
  styleUrl: './details-demand.component.scss',
})
export class DetailsDemandComponent {
  dialog = inject(MatDialog);
  demandService=inject(DemandDoctorService)
  dialogRef = inject(MatDialogRef<DetailsDemandComponent>);


  constructor(@Inject(MAT_DIALOG_DATA) public data: DemandDoctor,) {
    console.log("data",this.data)

  }

   saveChanges() {
    this.demandService.changeStateDemand(this.data._id, this.data.state).subscribe({
      next: (updatedDemand) => {
        console.log('Demand state updated successfully:', updatedDemand);
        this.dialogRef.close(true); // Close the dialog and return true as the result
      },
      error: (err) => {
        console.error('Error updating demand state:', err);
        this.dialogRef.close(false); // Close the dialog and return false as the result
      }
    });
  }
  closeDialog() {
    this.dialogRef.close(false); // Close the dialog without saving
  }

}
