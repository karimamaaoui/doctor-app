import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

 
  API_RL="http://localhost:5000/";

  constructor(private http: HttpClient , private socketService: SocketService) {}

  sendNotification( notifBody: any) {
    // Envoyer la notification via HTTP
    const result = this.http.post<any>(`${this.API_RL}notification/newNotification`, notifBody);

    // Émettre un événement via Socket.io après avoir envoyé la notification
    this.socketService.emit('newNotification', notifBody);

    return result;
  }
  markAsSeen(id:any){
    return this.http.put<any>(`${this.API_RL}notification/seenNotification/${id}`, {});
  }
  getAllUserNotif(userId:any){
    return this.http.get<any>(`${this.API_RL}notification/allNotifications/${userId}`);
  }
  getAllUserNotifs(userId:any){
    return this.http.get<any>(`${this.API_RL}notification/notifications/${userId}`);
  }
  deleteAll(userId:any){
    return this.http.delete(`${this.API_RL}notification/deleteAllNotification/${userId}`);
  }
  getRecentNotifications(userId:any){
    return this.http.get(`${this.API_RL}notification/recent/${userId}`);
  }
}
