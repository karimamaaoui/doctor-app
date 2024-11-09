import { Component } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexTitleSubtitle } from 'ng-apexcharts';
import { DoctorServesService } from '../../services/doctor.service';
@Component({
  selector: 'app-work-hours-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './work-hours-chart.component.html',
  styleUrl: './work-hours-chart.component.scss'
})
export class WorkHoursChartComponent {
  chartOptions: ApexOptions = {
    series: [],
    chart: {
      type: 'line',
      height: 350
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: 'Number of Hours'
      }
    },
    title: {
      text: 'Working Hours by Date',
      align: 'left'
    }
  };

  constructor(public DoctorServesService:DoctorServesService) {}

  ngOnInit(): void {
    if (localStorage.hasOwnProperty('userID')) {
      this.doctorID = localStorage.getItem('userID');
      console.log('doctor id', this.doctorID);
  
    this.loadChartData();
    }
  }
  doctorID:any;
  appointments:any;
  

  loadChartData(): void {
    this.DoctorServesService.getAllAppointments(this.doctorID).subscribe(data => {
      // Transform the data
      const transformedData = this.transformData(data);

      // Set chart options
      this.chartOptions = {
        series: [
          {
            name: 'Working Hours',
            data: transformedData.map(d => d.hours)
          }
        ],
        chart: {
          type: 'line',
          height: 350
        },
        xaxis: {
          categories: transformedData.map(d => d.date),
          title: {
            text: 'Dates'
          }
        },
        yaxis: {
          title: {
            text: 'Number of Hours'
          }
        },
        title: {
          text: 'Working Hours by Date',
          align: 'left'
        }
      };
    }, error => {
      console.error('Erreur de récupération des données', error);
    });
  }

  transformData(data:any): any[] {
    const result = [];

    // Group data by date
    const groupedData = data.reduce((acc, appointment) => {
      const date = new Date(appointment.dateAppointment).toISOString().slice(0, 10);
      if (!acc[date]) {
        acc[date] = { date, hours: 0 };
      }
      acc[date].hours += 1; // Increment hours for each appointment
      return acc;
    }, {});

    // Convert grouped data to array
    for (const key in groupedData) {
      if (groupedData.hasOwnProperty(key)) {
        result.push(groupedData[key]);
      }
    }

    return result;
  }
}
