import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ThankYouComponent } from './thank-you.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Revasa La Valora — Luxury Villas near Financial District, Hyderabad' },
  { path: 'thankyou', component: ThankYouComponent, title: 'Thank You — Revasa La Valora' },
  { path: '**', redirectTo: '' },
];
