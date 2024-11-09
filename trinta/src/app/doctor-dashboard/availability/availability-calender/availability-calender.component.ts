import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent } from '@fullcalendar/angular'; // Import FullCalendarComponent
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AddAvailabilityComponent } from '../add-availability/add-availability.component';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions } from '@fullcalendar/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenu, MatMenuModule, MatMenuTrigger  } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityTableComponent} from '../availability-table/availability-table.component';
import  {LoadingSpinnerComponent } from "../../../loading-spinner/loading-spinner.component";
import { PatientService } from '../../../patient-dashboard/services/patient.service';
import { AvailabilityService } from '../services/add-availability.service';

@Component({
  selector: 'app-availability-calender',
  templateUrl: './availability-calender.component.html',
  standalone: true,
  imports: [LoadingSpinnerComponent,AvailabilityTableComponent,MatButtonModule,MatMenuModule ,MatMenuModule,CommonModule, FullCalendarModule, MatCardModule, MatButtonModule, MatMenuModule],
  styleUrls: ['./availability-calender.component.scss']
})
export class AvailabilityCalenderComponent implements OnInit {
   @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;
  @ViewChild('contextMenu') contextMenu!: TemplateRef<any>;
  @ViewChild('menu') menu!: MatMenu;
  @ViewChild(MatMenuTrigger) contextMenuTrigger!: MatMenuTrigger;

  doctorID: any;
  selectedEvent: any;
  isLoading: boolean = true;
  isCalendarVisible: boolean = true; // Initial state to show calendar
  showContextMenu: boolean = false;
  contextMenuPosition = { x: '0px', y: '0px' };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth timeGridWeek'
    },
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
    eventContent: this.renderEventContent,
    eventClassNames: ['fc-event'],
    eventClick: this.handleEventClick.bind(this) // Ajoutez cette ligne
  };

  constructor(private dialog: MatDialog, private patientService: PatientService , 
    public availabilityservice : AvailabilityService) {
  }

  ngOnInit() {
    if (localStorage.hasOwnProperty('userID')) {
      this.doctorID = localStorage.getItem('userID');
      console.log('doctor id', this.doctorID);
  }
      this.loadAvailabilities(this.doctorID);

    this.availabilityservice.availabilityAdded$.subscribe(newAvailability => {
      const newEvent = this.formatEvents([newAvailability]);
      this.calendarComponent.getApi().addEvent(newEvent[0]);
      console.log('Disponibilité ajoutée au calendrier:', newEvent[0]);
    });
  }

  getColorByMode(mode: string): string {
    switch (mode) {
      case 'ONLINE':
        return '#007bff'; // Bleu
      case 'IN_PERSON':
        return '#008000'; // Vert
      default:
        return '#686868'; // Couleur par défaut
    }
  }
  toggleView(): void {
    this.isCalendarVisible = !this.isCalendarVisible;
  }
  
  handleDateClick(arg: any) {
    console.log('Date clicked:', arg.dateStr);
    this.dialog.open(AddAvailabilityComponent, {
      width: '400px',
      data: { date: arg.dateStr }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loadAvailabilities(this.doctorID);
        this.availabilityservice.announceAvailability(result.availability);
        console.log('Nouvelle disponibilité annoncée:', result.availability);
      }
    });
}

  formatEvents(availabilities: any[]): any[] {
    return availabilities.flatMap(avail =>
      avail.timeSlots.map(slot => {
        const startTime = slot.startTime;
        const endTime = slot.endTime;
        const mode = slot.mode;
        const formattedTitle = `${mode} (${startTime} - ${endTime})`;

        return {
          title: formattedTitle,
          start: new Date(avail.date).toISOString().split('T')[0] + 'T' + startTime + ':00',
          end: new Date(avail.date).toISOString().split('T')[0] + 'T' + endTime + ':00',
          classNames: [`fc-event-${mode}`],
          backgroundColor: this.getColorByMode(mode),
          borderColor: this.getColorByMode(mode),
          textColor: '#ffffff',
        };
      })
    );
  }

  renderEventContent(eventInfo: any): any {
    return {
      html: `
        <div style="
          background-color: ${eventInfo.event.backgroundColor};
          border-radius: 6px;
          color: ${eventInfo.event.textColor};
          padding: 5px;
          font-size: 12px;
          text-align: center;
          overflow: hidden;
          white-space: normal;
          " 
          (click)="openContextMenu($event, eventInfo.event)">
          ${eventInfo.event.title}
        </div>
      `
    };
  }
  
  openContextMenu(event: MouseEvent, calendarEvent: any) {
    event.preventDefault();
    this.selectedEvent = calendarEvent;
    this.contextMenuTrigger.openMenu();
  }

  loadAvailabilities(doctorID: any) {
    this.patientService.getdoctorDetailsWithAvailibities(doctorID).subscribe({
      next: (res: any) => {
        const events = this.formatEvents(res.availabilities);
        console.log('Loaded events:', events); // Ajouter ceci
        this.calendarOptions.events = events;
        this.isLoading=false;
      // Effacer les anciens événements
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();

      // Ajouter les nouveaux événements
      calendarApi.addEventSource(events);
      },
    });
  }

  
  

  handleEventClick(arg: any) {
    console.log('Event clicked:', arg);
    if (arg && arg.jsEvent) {
      const x = arg.jsEvent.clientX;
      const y = arg.jsEvent.clientY;
      console.log(`Click position: x=${x}, y=${y}`);
    } else {
      console.error('Event or jsEvent is undefined');
    }
  }

  editAvailability() {
    console.log('Edit:', this.selectedEvent);
    this.showContextMenu = false;
  }

  deleteAvailability() {
    console.log('Delete:', this.selectedEvent);
    this.showContextMenu = false;
  }

  closeContextMenu() {
    this.showContextMenu = false;
  }
  

}
