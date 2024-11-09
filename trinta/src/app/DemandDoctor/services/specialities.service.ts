import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Speciality } from '../../models/speciality';

@Injectable({
  providedIn: 'root'
})
export class SpecialitiesService {



  url = 'http://localhost:5000/specialty/';


  constructor(private http: HttpClient) {}

  getSpecialities(): Observable<Speciality[]> {
    return this.http.get<Speciality[]>(`${this.url}GetAllspecialties`);
  }

   // Add a new specialty
   addSpecialty(speciality: Speciality): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.url}/Addspecialty`, speciality, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }


    // Get a specialty by ID
    getSpecialtyById(SpecialtyId: string): Observable<Speciality> {
      return this.http.get<Speciality>(`${this.url}/Getspecialty/${SpecialtyId}`);
    }
  
    updateSpecialty(id: string, specialtyData: Speciality): Observable<Speciality> {
      const url = `${this.url}/Updatespecialty/${id}`;
      return this.http.put<Speciality>(url, specialtyData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }
  
    // Delete a specialty by ID
    deleteSpecialty(SpecialtyId: string): Observable<{ message: string }> {
      return this.http.delete<{ message: string }>(`${this.url}/Deletespecialty/${SpecialtyId}`);
    }
  
}
