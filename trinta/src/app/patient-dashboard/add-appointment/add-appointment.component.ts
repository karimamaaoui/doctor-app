import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { FeathericonsModule } from '../../apps/icons/feathericons/feathericons.module';
import { ToastrService } from 'ngx-toastr';
import  {LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";
import { PatientService } from '../services/patient.service';
import { NotificationService } from '../../common/services/notification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [LoadingSpinnerComponent,FeathericonsModule,FileUploadModule,MatSelectModule,NgxEditorModule,FormsModule,RouterLink,MatMenuModule,MatCardModule,ReactiveFormsModule,CommonModule,MatDialogModule,MatStepperModule,MatButtonModule,MatDatepickerModule,MatFormFieldModule,MatInputModule, MatRadioModule,MatNativeDateModule],
  templateUrl: './add-appointment.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './add-appointment.component.scss'
})
export class AddAppointmentComponent {

  minDate: Date;
  doctorId:any;

  isLoading: boolean = true;

  dateAvailibilty:any[];
  availableDates: Set<number> = new Set<number>();

  onlineTimes: { [date: string]: number[] } = {};
  inPersonTimes: { [date: string]: number[] } = {};

  selectedDate: string | null = null;
  selectedMode: 'ONLINE' | 'IN_PERSON' | null = null;
  availableTimes: number[] = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  dateSelected: boolean = false;
  modeSelected: boolean = false;

  timeSelected: boolean = false;
  selectedTime: number | null = null;
  patientId:any;

  isUpdateMode: boolean = false;
  appointmentId: string | null = null;


  constructor(private router : Router ,private cdr: ChangeDetectorRef,@Inject(MAT_DIALOG_DATA) public data: any ,
  private _formBuilder: FormBuilder,public dialogRef: MatDialogRef<AddAppointmentComponent> , 
  public PatientServes : PatientService , public toster : ToastrService,
  public notificationService : NotificationService) {
    this.isUpdateMode = data.isUpdateMode;
    this.appointmentId = data.appointmentId || null;
    this.selectedDate = data.appointmentDate || null;
    this.selectedMode = data.appointmentMode || null;
    this.selectedTime = data.appointmentTime || null;
    this.doctorId=data.doctorID;


    console.log( this.appointmentId,"00")
    console.log( this.selectedDate,"00")
    console.log( this.selectedMode,"00")
    console.log( this.selectedTime,"00")
    console.log( this.doctorId,"08")

    
    this.minDate = new Date(); // La date minimum est aujourd'hui
    this.getAvailibilityOfDoctor(this.doctorId);
    
  }

  ngOnInit(): void {
    if (localStorage.hasOwnProperty('userID')) {
      this.patientId = localStorage.getItem('userID');
      console.log('patient id', this.patientId);
  }
    this.firstFormGroup = this._formBuilder.group({
      date: [null]
    });
    this.secondFormGroup = this._formBuilder.group({
      mode: [null]
    });

    this.firstFormGroup.get('date')?.valueChanges.subscribe(date => {
      this.selectedDate = date ? new Date(date).toISOString().split('T')[0] : null;
      this.dateSelected = !!this.selectedDate;
      if (this.dateSelected) {
        this.updateAvailableTimes();
      }
    });

    this.secondFormGroup.get('mode')?.valueChanges.subscribe(mode => {
      this.selectedMode = mode;
      this.modeSelected = !!this.selectedMode;
      this.updateAvailableTimes();
    });
    console.log(this.isUpdateMode,"eeeeeeeggggeeeeeeeeeeee")

    if (this.isUpdateMode) {
      const date = this.selectedDate ? new Date(this.selectedDate) : null;
      this.firstFormGroup.patchValue({ date });
      this.secondFormGroup.patchValue({ mode: this.selectedMode });
  
      // Assurez-vous que les heures disponibles sont mises à jour
      this.updateAvailableTimes();
  
      // Sélectionner le temps si disponible
      if (this.selectedTime !== null) {
        this.availableTimes = this.availableTimes || [];
      }
    }
    this.isLoading=false;
    
}

  closeDialog(): void {
    this.dialogRef.close();
  }

//filtrer les date pour l'afficher dans les datepicker
  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return this.availableDates.has(formattedDate);
  }

//extrait les disponiblité
  getAvailibilityOfDoctor(id:any){
    this.isLoading=true;
     this.PatientServes.getdoctorDetailsWithAvailibities(id).subscribe({
    next: (res: any) => {
      console.log('Doctor Availability Data:', res);
      res.availabilities.forEach(avail => {
        const date = new Date(avail.date);
        this.availableDates.add(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime());

        // Initialiser les heures pour chaque date
        const dateString = date.toISOString().split('T')[0];
        this.onlineTimes[dateString] = [];
        this.inPersonTimes[dateString] = [];

        avail.timeSlots.forEach(slot => {
          if (slot.isAvailable) {
            const startHour = parseInt(slot.startTime.split(':')[0], 10);
            const endHour = parseInt(slot.endTime.split(':')[0], 10);
            const timesArray = [];

            for (let hour = startHour; hour < endHour; hour++) {
              timesArray.push(hour);
            }

            if (slot.mode === 'ONLINE') {
              this.onlineTimes[dateString] = timesArray;
            } else if (slot.mode === 'IN_PERSON') {
              this.inPersonTimes[dateString] = timesArray;
            }
          }
          
        });
        this.isLoading=false;
      });
      
      console.log('Online Times:', this.onlineTimes);
      console.log('In Person Times:', this.inPersonTimes);

      // Appeler updateAvailableTimes après avoir chargé les disponibilités
      this.updateAvailableTimes();
    },
    error: (err) => {
      console.error('Erreur:', err);
      this.isLoading=false;
    }
  });

  
  }

  onDateChange(event: any): void {
    const date = event.value;
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    this.selectedDate = utcDate.toISOString().split('T')[0];
    console.log(this.selectedDate,"eeeeeeeeyyy")
    this.updateAvailableTimes();
  }

  onModeChange(mode: 'ONLINE' | 'IN_PERSON'): void {
    this.selectedMode = mode;
    console.log(this.selectedMode,"eeeeeeeeyyy")
    this.updateAvailableTimes();
  }

   getOccupiedHours(appointments: any[]): Set<number> {
    const startHours = new Set<number>();

    appointments.forEach(appointment => {
      const appointmentStart = new Date(appointment.dateAppointment);
      let startHour = appointmentStart.getHours();
  
      // Corriger l'heure si elle est supérieure de 1
      startHour = startHour > 0 ? startHour - 1 : 23; // Gérer le cas où l'heure est minuit
  
      startHours.add(startHour);
    });
  
    return startHours;
  }


  updateAvailableTimes(): void {
    console.log('Selected Date:', this.selectedDate);
    console.log('Selected Mode:', this.selectedMode);
  
    if (this.selectedDate && this.selectedMode) {
      this.PatientServes.getAppointmentAvailibilitiesDoctor(this.doctorId, this.selectedDate).subscribe({
        next: (appointments: any[]) => {
          const occupiedHours = this.getOccupiedHours(appointments);
  
          console.log('Occupied Hours:', Array.from(occupiedHours));
  
          // Filtrer les heures disponibles
          if (this.selectedMode === 'ONLINE') {
            this.availableTimes = (this.onlineTimes[this.selectedDate] || [])
              .filter(time => !occupiedHours.has(time));
          } else if (this.selectedMode === 'IN_PERSON') {
            this.availableTimes = (this.inPersonTimes[this.selectedDate] || [])
              .filter(time => !occupiedHours.has(time));
          }
  
          console.log('Available Times:', this.availableTimes);
          this.timeSelected = this.availableTimes.length > 0;
        },
        error: (err) => {
          console.error('Error fetching appointments:', err);
        }
      });
    } else {
      this.availableTimes = [];
      this.timeSelected = false;
    }
    
  }
  selectTime(time: number): void {
    this.selectedTime = time;
    this.timeSelected = !!this.selectedTime;
    console.log('Selected Time:::::::::::::', this.selectedTime);
  }
  isSelected(time: number): boolean {
    return this.selectedTime === time;
  }

  isFormValid(): boolean {
    return !!this.selectedDate && !!this.selectedMode && !!this.selectedTime;
  }

  confirm(): void {
    this.isLoading=true;
    console.log(this.isFormValid)
    if (this.isFormValid()) {
      const dateTime = this.selectedDate;
      const hourAppointment = `${this.selectedTime}:00`;
      const type = this.selectedMode;
      const doctor = this.doctorId; // Remplacez par l'ID du médecin
      const patient = this.patientId; // Remplacez par l'ID du patient

      console.log(doctor,"55555555555555");
      console.log(patient,"88888888888888");

      if (this.isUpdateMode && this.appointmentId) {
        //achanger with update
        this.PatientServes.rescheduleAppointment(this.appointmentId, dateTime, hourAppointment, type).subscribe({
          next:(response:any) => {
            console.log('Appointment updated successfully', response);
            this.dialogRef.close();
            this.toster.success('successfully updated')
            this.cdr.detectChanges();
            const notification = {
              senderId: patient,
              recipientId:doctor,
              appointmentId:response._id,
              message: "Your aapointment is updated , check it ",
              type:"UPDATED"
            }
             this.notificationService.sendNotification(notification).subscribe({
              next:(res:any)=>{
                console.log("success");
              }
             });
             this.isLoading=false;
          },
          error:(error) => {
            console.error('Error updating appointment', error);
            this.toster.error('Error updating appointment')
            this.isLoading=false;
          }
        }
        );
      }else{

      this.PatientServes.createAppointment(dateTime, hourAppointment, type, doctor, patient).subscribe({
       next :( response:any) => {
          console.log('Appointment created successfully', response);
          this.dialogRef.close();
          this.toster.success('successfully Created')
          const notification = {
            senderId: patient,
            recipientId:doctor,
            appointmentId:response._id,
            message: "Your have a new Appointment scheduled by a new patient",
            type:"ADDED"
          }
            this.notificationService.sendNotification(notification).subscribe({
              next:(res:any)=>{
                console.log(res)
              }
            });
            this.isLoading=false;
        },
        error:(error) => {
          console.error('Error creating appointment', error);
          this.toster.error('Error creating appointment');
          this.isLoading=false;
        },
        complete:()=>{
        this.router.navigate(['/dashboard-patient/appointments'])
        }
      }
      );
    }
  }
  }


}
