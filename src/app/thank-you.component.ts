import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';

const PHONE = '+919030145871';

@Component({
  selector: 'app-thank-you',
  imports: [RouterLink, IconComponent],
  templateUrl: './thank-you.component.html',
})
export class ThankYouComponent {
  readonly phone = PHONE;
  readonly phoneDisplay = '+91 90301 45871';
  readonly whatsapp = `https://wa.me/${PHONE.replace('+', '')}?text=${encodeURIComponent("Hi, I just enquired about La Valora. I'd like to schedule a site visit.")}`;
  readonly year = new Date().getFullYear();

  /** Name and configuration passed from the enquiry form; history.state keeps them across a refresh. */
  readonly name: string;
  readonly config: string;

  readonly steps = [
    { title: 'A call from our team', desc: 'A relationship manager will reach out shortly to understand your requirements.' },
    { title: 'Your private site visit', desc: 'Walk the 72.25-acre estate, the 84,000+ sq.ft clubhouse and the show villas.' },
    { title: 'A personal walkthrough', desc: 'Explore floor plans, specifications and availability tailored to you.' },
  ];

  readonly particles = Array.from({ length: 18 }, (_, i) => ({
    left: (i * 37) % 100,
    delay: (i * 0.9) % 9,
    duration: 9 + (i % 5) * 2,
    size: 2 + (i % 3),
  }));

  constructor() {
    const state = (inject(Router).getCurrentNavigation()?.extras.state ?? history.state ?? {}) as Record<string, unknown>;
    this.name = typeof state['name'] === 'string' ? state['name'].split(' ')[0] : '';
    this.config = typeof state['config'] === 'string' ? state['config'] : '';
  }
}
