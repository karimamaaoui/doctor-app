import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:5000/users/';


  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.url}/get-user/${id}`);
  } 
  
  updateUser(id: string, updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.url}/update-user/${id}`, updatedUser);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete-user/${id}`);
  }

  addUser(newUser){
    return this.http.post(`${this.url}/addnewuser`, newUser);
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.url}${userId}/change-password`, { oldPassword, newPassword });
  }
}
