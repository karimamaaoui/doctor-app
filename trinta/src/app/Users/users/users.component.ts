import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../../models/user';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import Swal from 'sweetalert2';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  dialog = inject(MatDialog);

  userSer = inject(UserService);
  users: User[] = [];
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = [
    'email',
    'firstname',
    'lastname',
    'role',
    'isActive',
    'action',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers() {
    this.userSer.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.dataSource.data = this.users; // Update the dataSource with the new data
        if (this.paginator) {
          this.dataSource.paginator = this.paginator; // Ensure paginator is applied
        }
        //   console.log("Users data loaded:", this.users); // Debugging line
      },
      error: (err) => {
        console.error('Error loading users:', err); // Debugging line
      },
    });
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '600px',
      data: {
        firstname: element.firstname,
        id: element._id,
        lastname: element.lastname,
        email: element.email,
        role: element.role,
        isActive: element.isActive,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  alertConfirmation() {
    return Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this user ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#00A2E9',
      cancelButtonColor: '#C4C4C4',
    });
  }

  deleteUser(element) {
    this.alertConfirmation().then((result) => {
      if (result.isConfirmed) {
        this.userSer.deleteUser(element._id).subscribe({
          next: (data) => {
            console.log('data', data);
            this.loadUsers();
          },
          error: (err) => {
            console.log('err delete', err);
          },
        });
      }
    });
  }
}
