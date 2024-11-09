import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { FeathericonsModule } from '../../apps/icons/feathericons/feathericons.module';
import { DemandDoctor } from '../../models/demand';
import { DemandDoctorService } from '../services/demand-doctor.service';
import { AuthService } from '../../Auth/services/auth.service';
import { SpecialitiesService } from '../services/specialities.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-demand',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FeathericonsModule,
    NgxEditorModule,
    MatDatepickerModule,
    FileUploadModule,
    MatSelectModule,
    MatRadioModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-demand.component.html',
  styleUrl: './add-demand.component.scss',
})
export class AddDemandComponent {
  demandService = inject(DemandDoctorService);
  specialityService=inject(SpecialitiesService)
  authSer = inject(AuthService);
  demandDoctor: DemandDoctor = {
    _id: '',
    diploma: {
      diplomaName: '',
      year: '',
    },
    client: {
      email: '',
      _id: '',
    },
    experienceYears: 0,
    address: '',
    location: {
      city: '',
      country: '',
      zipCode: '',
    },
    phoneNumber: '',
    hospital: {
      hospitalName: '',
      hospitalNumber: '',
      department: '',
      hiringDate: '',
    },
    socialLinks: {
      linkedin: '',
      facebook: '',
    },
    specialities: '',

  };
  specialities: any[] = [];

  // Text Editor
  editor: Editor;
  html = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  ngOnInit(): void {
    this.editor = new Editor();
    this.loadSpecialities();

  }

  loadSpecialities(): void {
    this.specialityService.getSpecialities().subscribe({
      next: (data) => {
        this.specialities = data;
        console.log("specialities",this.specialities)
      },
      error: (err) => {
        console.error('Error loading specialities:', err);
      },
    });
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onSubmit(demandDoctorForm): void {
  

    // Get the current client information
    const currentClient = this.authSer.getCurrentClient();
    console.log("current user",currentClient)
    // Check if currentClient is valid
    if (!currentClient || !currentClient.id || !currentClient.email) {
      console.error('Client information is not available.');
      return;
    }

    // Extract form values
    const formValues = demandDoctorForm.value;


    this.demandDoctor = {
      diploma: {
        diplomaName: formValues.diplomaName,
        year: formValues.year,
      },
      experienceYears: formValues.experienceYears,
      address: formValues.address,
      location: {
        city: formValues.city,
        country: formValues.country,
        zipCode: formValues.zipCode,
      },
      phoneNumber: formValues.phoneNumber,
      hospital: {
        hospitalName: formValues.hospitalName,
        hospitalNumber: formValues.hospitalNumber,
        department: formValues.department,
        hiringDate: new Date(formValues.hiringDate).toISOString(),
      },
      socialLinks: {
        linkedin: formValues.linkedin,
        facebook: formValues.facebook,
      },
      client: {
        email: currentClient.email,
        _id: currentClient.id,
      },
      specialities: formValues.specialities
      
    };

    // Log the demandDoctor object to check its values before sending
    console.log('Submitting demandDoctor:', this.demandDoctor);

    // Send the demandDoctor object to the server
    this.demandService.sendDemand(this.demandDoctor).subscribe({
      next: (response) => {
        console.log('Demand sent successfully:', response);
        Swal.fire({
          title: 'Success!',
          text: 'The demand was sent to the admin.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
   
        // Reset the form after success
        demandDoctorForm.resetForm(); 
      },
      error: (error) => {
        console.error('Error sending demand:', error);
        // Handle error, e.g., display an error message
      },
    });
  }
}
