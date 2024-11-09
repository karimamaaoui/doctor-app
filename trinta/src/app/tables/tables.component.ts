import { Component } from '@angular/core';
import { TRecentOrdersComponent } from './t-recent-orders/t-recent-orders.component';
import { TPaymentHistoryComponent } from './t-payment-history/t-payment-history.component';
import { TAllCoursesComponent } from './t-all-courses/t-all-courses.component';

@Component({
    selector: 'app-tables',
    standalone: true,
    imports: [TRecentOrdersComponent, TPaymentHistoryComponent, TAllCoursesComponent],
    templateUrl: './tables.component.html',
    styleUrl: './tables.component.scss'
})
export class TablesComponent {}