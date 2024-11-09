
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import  moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter } from '@angular/material/core';

import { RouterLink } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';

import  {LoadingSpinnerComponent } from "../../../loading-spinner/loading-spinner.component";
import { DoctorServesService } from '../../services/doctor.service';
import { NotificationService } from '../../../common/services/notification.service';
import { PatientService } from '../../../patient-dashboard/services/patient.service';




@Component({
  selector: 'app-add-appointment-doctor',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [LoadingSpinnerComponent,FileUploadModule,NgxEditorModule,MatSelectModule,MatButtonToggleModule,ReactiveFormsModule,FormsModule,MatMenuModule,MatCardModule,CommonModule,MatNativeDateModule,MatDatepickerModule,MatButtonModule,MatStepperModule,MatDialogModule,MatFormFieldModule,MatInputModule,MatRadioModule],
  templateUrl: './add-appointment-doctor.component.html',
  styleUrl: './add-appointment-doctor.component.scss'
})
export class AddAppointmentDoctorComponent {

  isLoading: boolean = true;

  appointmentForm: FormGroup;
  times: string[]; 
  selectedTime: string;
  availableTimes: string[] = [];
  appointments :any[];
  doctorID  : any;
  isUpdateMode: boolean = false;
  appointmentId: string;
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAppointmentDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public PatientServces : PatientService,
    private cdr: ChangeDetectorRef,
    public DoctorServes : DoctorServesService,
    public toster : ToastrService,
    public notificationService : NotificationService
  ) {
    this.minDate = new Date();
  }

  onDateChange(event: any): void {
    const selectedDate = new Date(event.value);
    console.log("Selected Date:", selectedDate); // Pour vérifier la valeur de selectedDate
    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
        this.getAppointmentsInthSameDate(this.doctorID, selectedDate.toISOString().split('T')[0]);

        setTimeout(() => {
            this.filterAvailableTimes();
        }, 100);
    } else {
        console.error("Invalid date:", selectedDate);
    }
}


  

  loadExistingAppointment(data: any): void { 
    this.appointmentForm.patchValue({
      date: new Date(data.date), // Assurez-vous d'utiliser `data.dateAppointment`
      mode: data.mode,
      time: this.formatTime(data.time),
      email: data.email
    });
    this.cdr.detectChanges();
    console.log('Loaded Appointment:', this.appointmentForm.value);
  }

  formatTime(dateAppointment: string): string {
    const appointmentTime = new Date(dateAppointment);
    const hours = appointmentTime.getUTCHours().toString().padStart(2, '0');
    const minutes = appointmentTime.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

  ngOnInit(): void {

    if (localStorage.hasOwnProperty('userID')) {
      this.doctorID = localStorage.getItem('userID');
      console.log('doctor id', this.doctorID);
  }

   this.isUpdateMode = !!this.data.appointmentId;
  
   this.appointmentForm = this.fb.group({
    date: [{ value: this.isUpdateMode ? new Date(this.data.date) : this.data.date, disabled: !this.isUpdateMode }, Validators.required],
    mode: [this.data.mode || '', Validators.required],
    time: [this.data.time || '', Validators.required],
    email: [this.data.email || '', [Validators.required, Validators.email]]
  });
  
  this.appointmentForm.get('date').valueChanges.subscribe(selectedDate => {
    if (selectedDate) {
      this.getAppointmentsInthSameDate(this.doctorID, selectedDate);
    }
  });

  if (this.isUpdateMode) {
    this.loadExistingAppointment(this.data);
    this.appointmentForm.get('date').enable();
  } else {
    this.appointmentForm.patchValue({ date: this.data.date });
    this.appointmentForm.get('date').disable();
  }
  this.isLoading=false;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  generateTimeSlots(start: string, end: string, interval: number, existingAppointments: any[]): string[] {
    const times = [];
    const startTime = new Date(`1970-01-01T${start}:00Z`); // Heure de début
    const endTime = new Date(`1970-01-01T${end}:00Z`); // Heure de fin
  
    for (let currentTime = startTime; currentTime <= endTime; currentTime.setMinutes(currentTime.getMinutes() + interval)) {
      const hours = currentTime.getUTCHours().toString().padStart(2, '0');
      const minutes = currentTime.getUTCMinutes().toString().padStart(2, '0');
      const timeSlot = `${hours}:${minutes}`;
  
      const isOccupied = existingAppointments.some(appointment => {
        const appointmentTime = new Date(appointment.dateAppointment);
        const appointmentHours = appointmentTime.getUTCHours().toString().padStart(2, '0');
        const appointmentMinutes = appointmentTime.getUTCMinutes().toString().padStart(2, '0');
        return `${appointmentHours}:${appointmentMinutes}` === timeSlot;
      });
  
      if (!isOccupied) {
        times.push(timeSlot);
      }
    }
  
    return times;
  }
  
getAppointmentsInthSameDate(doctorID: string, date: any): void {
  const dateIsoString = new Date(date).toISOString().split('T')[0];

  this.PatientServces.getAppointmentAvailibilitiesDoctor(doctorID, dateIsoString).subscribe({
    next: (res: any) => {
      this.appointments = res;
      this.times = this.generateTimeSlots('08:00', '18:00', 60, this.appointments);
      this.filterAvailableTimes();
      this.cdr.detectChanges(); // Force change detection
    },
    complete: () => {
      console.log('Filtered Available Times:', this.times);
    }
  });
}

filterAvailableTimes(): void {
  const selectedDate = new Date(this.appointmentForm.get('date').value).toISOString().split('T')[0];

  this.availableTimes = this.times.filter(time => {
    return !this.appointments.some(appointment => {
      const appointmentDate = new Date(appointment.dateAppointment).toISOString().split('T')[0];
      const appointmentTime = new Date(appointment.dateAppointment).toTimeString().slice(0, 5);
      return appointmentDate === selectedDate && appointmentTime === time;
    });
  });

  console.log('Times:', this.times); // Assurez-vous que `this.times` est correctement généré
  console.log('Available Times:', this.availableTimes); // Vérifiez le contenu de `availableTimes`
  console.log('Appointments:', this.appointments);
}

// Function to add an appointment
addAppointment(): void {
  this.isLoading = true;
  if (this.appointmentForm.valid) {
    const formValue = this.appointmentForm.value;
    const selectedDate = this.appointmentForm.get('date').value;

    // Conversion de selectedDate en objet Date si nécessaire
    let dateObject;
    if (typeof selectedDate === 'string') {
      // Ajout de l'heure pour éviter les erreurs de conversion
      dateObject = new Date(`${selectedDate}T00:00:00`);
    } else {
      dateObject = selectedDate;
    }

    // Vérifiez si la date est valide
    if (isNaN(dateObject.getTime())) {
      console.error("Date invalide:", selectedDate);
      this.isLoading = false;
      this.toster.error('Invalid date selected.');
      return;
    }

    if (this.isUpdateMode) {
      console.log("////////////////", dateObject);

      // Formater la date au format YYYY-MM-DD sans décalage UTC
      const year = dateObject.getFullYear();
      const month = ('0' + (dateObject.getMonth() + 1)).slice(-2); // Les mois commencent à 0
      const day = ('0' + dateObject.getDate()).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log("////////////////", formattedDate);
      console.log(this.data.appointmentId, "***");
      console.log(formattedDate, "***");
      console.log(formValue.time, "***");
      console.log(formValue.mode, "***");

      // Logique pour mettre à jour le rendez-vous existant
      this.PatientServces.rescheduleAppointment(
        this.data.appointmentId,
        formattedDate,
        formValue.time,
        formValue.mode
      ).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.toster.success('Appointment updated successfully');
          const notification = {
            senderId: this.doctorID,
            recipientId: res.patient,
            appointmentId: res._id,
            message: "Your appointment has been updated by your doctor, please check your appointment scheduler",
            type: "UPDATED"
          };
          this.notificationService.sendNotification(notification).subscribe();
          this.dialogRef.close(res);
        },
       /* error: (err) => {
          this.toster.error("Error updating appointment");
          this.isLoading = false;
          console.error(err);
        }*/
      });
    } else {
      console.log("//////////////// add", dateObject);

      // Logique pour créer un nouveau rendez-vous
      this.DoctorServes.scheduleAppointment(
        this.doctorID,
        selectedDate,
        formValue.time,
        formValue.mode,
        formValue.email
      ).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.toster.success('Appointment added successfully');
          const notification = {
            senderId: this.doctorID,
            recipientId: res.patient,
            appointmentId: res._id,
            message: "You have a new appointment scheduled by your doctor, please be on time!",
            type: "ADDED"
          };
          this.notificationService.sendNotification(notification).subscribe();
          this.dialogRef.close(res);
        },
       /* error: (err) => {
          this.toster.error("Error scheduling appointment");
          this.isLoading = false;
          console.error(err);
        }*/
      });
    }
  } else {
    console.log('Form is invalid.');
    this.isLoading = false;
  }
}

}

