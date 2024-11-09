import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import  {LoadingSpinnerComponent } from "../../../loading-spinner/loading-spinner.component";
import { AvailabilityService } from '../services/add-availability.service';
@Component({
  selector: 'app-add-availability',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatCardModule,
    CommonModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './add-availability.component.html',
  styleUrls: ['./add-availability.component.scss']
})
export class AddAvailabilityComponent {
  
  isLoading: boolean = true;
  availabilityForm: FormGroup;
  doctorID: any;
  isEditMode = false;  // Flag to check if it's edit mode

  times: string[] = [
    '08:00', '09:00', '10:00',
    '11:00', '12:00',
    '13:00', '14:00', '15:00',
    '16:00', '17:00',
    '18:00'
  ];

  constructor(
    public dialogRef: MatDialogRef<AddAvailabilityComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {id:any, date: string, timeSlots?: any[] },
    public AvvailabilityService: AvailabilityService,
    public toaster: ToastrService
  ) {
    this.availabilityForm = this.fb.group({
      onlineChecked: [false],
      onlineStartTime: [''],
      onlineEndTime: [''],
      inPersonChecked: [false],
      inPersonStartTime: [''],
      inPersonEndTime: ['']
    });

    if (data.timeSlots) {
      this.isEditMode = true;
      this.setFormValues(data.timeSlots);
    }
    
  }

  ngOnInit() {
    if (localStorage.hasOwnProperty('userID')) {
      this.doctorID = localStorage.getItem('userID');
      console.log('doctor id', this.doctorID);
  }
  this.isLoading=false;
  }

  setFormValues(timeSlots: any[]): void {
    const onlineSlot = timeSlots.find(slot => slot.mode === 'ONLINE');
    const inPersonSlot = timeSlots.find(slot => slot.mode === 'IN_PERSON');

    if (onlineSlot) {
      this.availabilityForm.patchValue({
        onlineChecked: true,
        onlineStartTime: onlineSlot.startTime,
        onlineEndTime: onlineSlot.endTime
      });
    }

    if (inPersonSlot) {
      this.availabilityForm.patchValue({
        inPersonChecked: true,
        inPersonStartTime: inPersonSlot.startTime,
        inPersonEndTime: inPersonSlot.endTime
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.availabilityForm.invalid) {
      return; // Ignore invalid form
    }
    this.isLoading=true;
    const formValue = this.availabilityForm.value;
    const availabilityData = {
      date: this.data.date,
      timeSlots: []
    };

    if (formValue.onlineChecked) {
      availabilityData.timeSlots.push({
        startTime: formValue.onlineStartTime,
        endTime: formValue.onlineEndTime,
        isAvailable: true,
        mode: 'ONLINE'
      });
    }

    if (formValue.inPersonChecked) {
      availabilityData.timeSlots.push({
        startTime: formValue.inPersonStartTime,
        endTime: formValue.inPersonEndTime,
        isAvailable: true,
        mode: 'IN_PERSON'
      });
    }

    if (this.isEditMode) {
      // Update existing availability
      this.AvvailabilityService.editAvailability(this.data.id, availabilityData)
        .subscribe(response => {
          this.toaster.success('Availability updated');
          this.dialogRef.close(response);
          this.isLoading=false;
        }, error => {
          this.toaster.error('Error updating availability');
          this.isLoading=false;
        });
    } else {
      // Create new availability
      this.AvvailabilityService.createAvailability(this.doctorID, availabilityData)
        .subscribe(response => {
          this.toaster.success('Availability created');
          this.dialogRef.close(response);
          this.isLoading=false;
        }, error => {
          this.toaster.error('Error creating availability');
          this.isLoading=false;
        });
    }
  }
}
