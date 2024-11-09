import { Component } from '@angular/core';
import { WebsiteOverviewComponent } from '../dashboard/ecommerce/website-overview/website-overview.component';
import { RevenueOverviewComponent } from '../dashboard/ecommerce/revenue-overview/revenue-overview.component';
import { TopSellingProductsComponent } from '../dashboard/ecommerce/top-selling-products/top-selling-products.component';
import { ChartComponent } from 'ng-apexcharts';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss'
})
export class DoctorDashboardComponent {

}
