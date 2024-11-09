import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  userid:any;

  constructor( public toster : ToastrService) {
    this.socket = io('http://localhost:5000'); 
    if (localStorage.hasOwnProperty('userID')) {
      this.userid = localStorage.getItem('userID');
      console.log('doctor id', this.userid);
  }
  }

  
  // Méthode pour rejoindre une salle spécifique
  joinRoom(userId: string): void {
    this.socket.emit('join', userId);
  }

  // Écouter les événements
  on(eventName: string, callback: (data: any) => void): void {
    this.socket.on(eventName, (data) => {
      // Vérifiez si le destinataire est l'utilisateur actuel
      if (data.recipientId === this.userid) {
        this.toster.success(data.message); // Affiche le toast seulement si c'est le bon destinataire
        callback(data);
      }
    });
  }

  // Émettre un événement
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  // Déconnexion du socket
  disconnect(): void {
    this.socket.disconnect();
  }

}
