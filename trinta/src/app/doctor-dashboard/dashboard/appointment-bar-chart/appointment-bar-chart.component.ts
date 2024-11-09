import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { DoctorServesService } from '../../services/doctor.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-appointment-bar-chart',
  standalone: true,
  imports: [CommonModule,NgApexchartsModule],
  templateUrl: './appointment-bar-chart.component.html',
  styleUrl: './appointment-bar-chart.component.scss'
})
export class AppointmentBarChartComponent {
  doctorID:any;
  appointments:any;
  chartOptions: any;
  constructor(public DoctorServesService :DoctorServesService) {}

    ngOnInit(): void {
      if (localStorage.hasOwnProperty('userID')) {
        this.doctorID = localStorage.getItem('userID');
        console.log('doctor id', this.doctorID);
    
      this.DoctorServesService.getAllAppointments(this.doctorID).subscribe(appointments => {
        this.appointments = appointments;
        if (this.appointments && this.appointments.length > 0) {
          this.updateChart();
        }
      });
    }
    }
  
    updateChart(): void {
      const groupedData = this.groupAppointmentsByDate(this.appointments);
  
      this.chartOptions = {
        series: [
          {
            name: 'Total Appointments',
            data: groupedData.map(data => data.total)
          },
          {
            name: 'Online Appointments',
            data: groupedData.map(data => data.online)
          },
          {
            name: 'In-Person Appointments',
            data: groupedData.map(data => data.inPerson)
          }
        ],
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: groupedData.map(data => data.date)
        }
      };
    }
  
    groupAppointmentsByDate(appointments: any[]): any[] {
      const result: any = {};
  
      appointments.forEach(appointment => {
        const date = new Date(appointment.dateAppointment).toDateString();
        if (!result[date]) {
          result[date] = { date, total: 0, online: 0, inPerson: 0 };
        }
        result[date].total += 1;
        if (appointment.type === 'ONLINE') {
          result[date].online += 1;
        } else if (appointment.type === 'IN_PERSON') {
          result[date].inPerson += 1;
        }
      });
  
      return Object.values(result);
    }


}
