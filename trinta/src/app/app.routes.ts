import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { AppsComponent } from './apps/apps.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './Auth/login/login.component';
import {NotificationComponent} from './common/notification/notification.component';
import { RegisterComponent } from './Auth/register/register.component';
import { authGuard } from './Auth/auth.guard';
import { UsersComponent } from './Users/users/users.component';
import { AddDemandComponent } from './DemandDoctor/add-demand/add-demand.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { DemandListComponent } from './DemandDoctor/demand-list/demand-list.component';
import { ListSpecialitesComponent } from './list-specialites/list-specialites.component';
import { ListEvaluationComponent } from './patient-dashboard/list-evaluation/list-evaluation.component';
import { DoctorComponent } from './doctor-dashboard/doctor/doctor.component';
import { AppointmentsComponent } from './doctor-dashboard/appointments/appointments.component';
import { CalendrierComponent } from './doctor-dashboard/calendrier/calendrier.component';
import { AvailabilityComponent } from './doctor-dashboard/availability/availability.component';
import { AvailabilityCalenderComponent } from './doctor-dashboard/availability/availability-calender/availability-calender.component';
import { AvailabilityTableComponent } from './doctor-dashboard/availability/availability-table/availability-table.component';
import { PatientAppointmentsComponent } from './patient-dashboard/patient-appointments/patient-appointments.component';
import { TablesComponent } from './tables/tables.component';
import {DoctorCardsComponent} from './doctor-dashboard/doctor-cards/doctor-cards.component';


export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'dashboard',
    component: EcommerceComponent,
    canActivate: [authGuard],
    data: { role: ['ADMIN'] },
  },
  { path: 'demand-list', component: DemandListComponent ,    canActivate: [authGuard],
    data: { role: ['ADMIN'] },
},
{path:'doctors/:specialtyId', component:DoctorCardsComponent},

{path: 'evaluation', component: ListEvaluationComponent  ,  canActivate: [authGuard],
  data: { role: ['PATIENT'] },
},


{ path: 'speciality-list', component: ListSpecialitesComponent ,    canActivate: [authGuard],
  data: { role: ['ADMIN'] },
},

  


  {path:'doctor' , component:DoctorDashboardComponent, canActivate: [authGuard],data: { role: ['DOCTOR']} ,
  children:[
       {path:'dashboard',component: DoctorComponent},
       {path:'appointments',component:AppointmentsComponent},
      {path:'calender',component:CalendrierComponent},
      {path:'availability', component:AvailabilityComponent , 
          children:[
              {path:'calender',component:AvailabilityCalenderComponent},
             {path:'availabilitytTable',component:AvailabilityTableComponent},
          ],
      },
      
  ]
 },
  
  {
    path: 'dashboard-patient',
    component: PatientDashboardComponent,
    canActivate: [authGuard],
    data: { role: ['PATIENT'] },
    children:[
      {path:'appointments',component:PatientAppointmentsComponent},
  ]
 
  },

  {path: 'tables', component: TablesComponent},


  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset/:id/:token', component: ResetPasswordComponent },

  {
    path: 'add-demand',
    component: AddDemandComponent,
    canActivate: [authGuard],
    data: { role: ['PATIENT'] },
  },
  {
    path: 'apps',
    component: AppsComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [authGuard],
        data: { role: ['ADMIN'] },
      },
    ],
  },

   //notifs path
   {path:'notifications', component:NotificationComponent},
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', component: AccountSettingsComponent },
      { path: 'change-password', component: ChangePasswordComponent },
    ],
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'confirm-email', component: ConfirmEmailComponent },
    ],
  },

  { path: '**', component: NotFoundComponent },
];
