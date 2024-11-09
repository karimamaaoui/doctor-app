import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DoctorServesService {

  API_RL="http://localhost:5000/";

  
  constructor(private http:HttpClient) { }

  httpOptions = { headers: new HttpHeaders({
    'Content-Type': 'application/json'})}
    

  getAllAppointments(doctorID:any){
   return  this.http.get(`${this.API_RL}appointment/appointments/${doctorID}`,this.httpOptions);
  }
  getAllAppointmentswithstatus(doctorID:any , status:any){
    let params = new HttpParams().set('status', status);
   return  this.http.get(`${this.API_RL}appointment/appointments/${doctorID}/status?status=${status}`,this.httpOptions);
  }
  deleteAppointmentWithID(appointmentID:any ){
   return  this.http.delete(`${this.API_RL}appointment/deleteAppointment/${appointmentID}`,this.httpOptions);
  }
  updateAppointmentStatus(appointmentID:any , appointmentStatus:any){
    return this.http.put(`${this.API_RL}appointment/changeAppointmentStatus/${appointmentID}`,{appointmentStatus : appointmentStatus});
  }
  scheduleAppointment(doctor:any , date:any , time:any , type:any , patientEmail:any){
    return this.http.post(`${this.API_RL}appointment/scheduleAppointment/${doctor}`,{
      date:date,
      time:time,
      type:type,
      patientEmail:patientEmail
    });
  }
  changeAppointmentDate(appointmentID:any , appointmentDate:any){
    return this.http.put(`${this.API_RL}appointment/changeDate/${appointmentID}`,{appointmentDate : appointmentDate});
  }
  getAllDoctors(specialtyId:any){
     return this.http.get(`${this.API_RL}appointment/all/doctors/${specialtyId}`);
  }

 
  getAppointmentDetails(id){
    return this.http.get(`${this.API_RL}appointment/appointmentDetails/${id}`);
  }
getbarcharappointment(period:any, doctor:any){
  return this.http.get<any[]>(`${this.API_RL}appointment/bar-Chart/${doctor}?period=${period}`);
}
getTodayAppointments(doctorID:any){
  return this.http.get(`${this.API_RL}appointment/todayAppointmentDoctor/${doctorID}`,this.httpOptions);
}
getTopPatients(doctorId: string){
  return this.http.get<any[]>(`${this.API_RL}appointment/top-patients/${doctorId}`);
}

}
