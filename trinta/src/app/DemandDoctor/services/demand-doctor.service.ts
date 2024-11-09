import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DemandDoctor } from '../../models/demand';

@Injectable({
  providedIn: 'root'
})
export class DemandDoctorService {

  url = 'http://localhost:5000/demand/';


  constructor(private http: HttpClient) {}

  getAllDemand(): Observable<DemandDoctor[]> {
    return this.http.get<DemandDoctor[]>(`${this.url}/suivi`);
  }

  changeStateDemand(id: string, updatedState: string): Observable<DemandDoctor> {
    return this.http.put<DemandDoctor>(`${this.url}/changestate/${id}`, { state: updatedState });
  }
  
  sendDemand(demand): Observable<DemandDoctor> {
    console.log('Sending demand:', demand);  

    return this.http.post<DemandDoctor>(`${this.url}add/`, demand);
  }
  

}
