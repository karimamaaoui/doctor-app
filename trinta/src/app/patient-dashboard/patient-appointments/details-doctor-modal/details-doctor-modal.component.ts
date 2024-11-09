import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-details-doctor-modal',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './details-doctor-modal.component.html',
  styleUrl: './details-doctor-modal.component.scss'
})
export class DetailsDoctorModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any ,
  public dialogRef: MatDialogRef<DetailsDoctorModalComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  
}
