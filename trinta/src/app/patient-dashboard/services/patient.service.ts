import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  API_RL="http://localhost:5000/";

  
  constructor(private http:HttpClient) { }

  httpOptions = { headers: new HttpHeaders({
    'Content-Type': 'application/json'})}

  getdoctorDetailsWithAvailibities(id:any){
   return  this.http.get(`${this.API_RL}appointment/getuserDetails/${id}`,this.httpOptions);
  }
  createAppointment(dateTime:any,hourAppointment:any,type:any,doctor:any,patient:any){
    return  this.http.post(`${this.API_RL}appointment/createAppointment`,{
      dateTime: dateTime,
      hourAppointment:hourAppointment,
      type: type,
      doctor:doctor , 
      patient: patient
    });
  }
  getAllAppointments(patientID:any){
    return this.http.get(`${this.API_RL}appointment/patientAppointments/${patientID}`,this.httpOptions);
  }
  getTodayAppointments(patientID:any){
    return this.http.get(`${this.API_RL}appointment/todayAppointment/${patientID}`,this.httpOptions);
  }
  rescheduleAppointment(patientID:any, date:any, time:any , type:any){
    return this.http.put(`${this.API_RL}appointment/rescheduleAppoinment/${patientID}`,{date : date ,
      time : time ,
      type : type
    });
  }
  getAppointmentAvailibilitiesDoctor(doctorID:any,date:any){
    return this.http.get(`${this.API_RL}appointment/doctorAvailibilties/${doctorID}/date?date=${date}`,this.httpOptions)
  }
  cancelAppointment(appointmentID:any){
    return this.http.put(`${this.API_RL}appointment/cancelAppointment/${appointmentID}`,this.httpOptions);
  }
}
