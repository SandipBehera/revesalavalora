import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from './icon.component';
import { HttpserviceService } from './httpservice.service';
import { User } from '../users';
const PHONE = '+919030145871';

@Component({
  selector: 'app-home',
  imports: [FormsModule, IconComponent, NgTemplateOutlet],
  templateUrl: './home.component.html',
})

export class HomeComponent implements AfterViewInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);
  private leads = inject(HttpserviceService);
  private router = inject(Router);
  private observer?: IntersectionObserver;
  private rafId = 0;
  private cleanup: (() => void)[] = [];

  readonly phone = PHONE;
  readonly phoneDisplay = '+91 90301 45871';
  readonly whatsapp = `https://wa.me/${PHONE.replace('+', '')}?text=${encodeURIComponent("Hi, I'm interested in La Valora. Please share more details.")}`;
  readonly year = new Date().getFullYear();

  loading = signal(true);
  scrolled = signal(false);
  showBar = signal(false);
  menuOpen = signal(false);

  readonly nav = [
    { label: 'Overview', href: '#overview' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Residences', href: '#residences' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Location', href: '#location' },
    { label: 'Contact', href: '#contact' },
  ];

  readonly heroTitle = ['L', 'a', ' ', 'V', 'a', 'l', 'o', 'r', 'a'];

  readonly stats = [
    { icon: 'acres', value: 72.25, decimals: 2, suffix: '', unit: 'Acres', label: 'Sprawling Estate' },
    { icon: 'building', value: 558, decimals: 0, suffix: '', unit: 'Villas', label: 'Luxury Residences' },
    { icon: 'trees', value: 84000, decimals: 0, suffix: '+', unit: 'Sq.Ft', label: 'Clubhouse Area' },
    { icon: 'sparkles', value: 70, decimals: 0, suffix: '+', unit: 'Amenities', label: 'World-Class' },
  ];

  readonly marquee = ['72.25 Acres', '558 Villas', '84,000+ Sq.Ft Clubhouse', '70+ Amenities', '4 & 5 BHK Residences', 'Private Lift Access', 'Near Financial District'];

  readonly amenities = [
    { id: 'clubhouse', label: 'Clubhouse', icon: 'sparkles', items: ['Temperature Controlled Swimming Pool with Jacuzzi', 'Shallow Pool Lounges', 'Aqua Gym', 'Kids Pool', 'Multipurpose Hall', 'Dining Hall', 'Indoor Sports', 'Business Lounge', 'Terrace Party Area', 'Snack Bar', 'Library', 'Aerobics Studio', 'Yoga Studio', 'Indoor Badminton Courts', 'Squash Courts', 'Preview Theatre', 'Provision for Spa', 'Gymnasium', 'Executive Guest Room', 'Suite Rooms', 'Party Lawn'] },
    { id: 'sports', label: 'Sports Park', icon: 'trophy', items: ['Futsal Court', 'Pickle Ball Courts', 'Basketball Court', 'Tennis Court', 'Box Cricket', 'Open Playground', 'Volleyball Court', 'Skating Rink', 'Tree House', 'Cricket Nets', 'Elderly Fitness Court', 'Pet Park', 'Flea Market Space'] },
    { id: 'outdoors', label: 'Outdoors & Wellness', icon: 'trees', items: ['The Arc (Elevated Walkway)', 'Miyawaki Forest Walk', 'Synthetic Track', 'Central Park', 'Reflexology', 'Yoga Lawn', 'Meditation Deck', 'Sacred Lawn', 'Prayer Avenue', 'Mandapa'] },
    { id: 'social', label: 'Social & Events', icon: 'users', items: ['Celebration Lawn', 'Festival Lawn', 'Event Lawn', 'Interactive Lawn', 'Amphitheatre', 'Social Pit', 'Social Pods', 'Elderly Plaza', 'Water Island with Sculpture'] },
    { id: 'kids', label: 'Kids & Family', icon: 'family', items: ['Kids Play Area', 'Toddlers Play Area', 'Sandpit', 'Chess Court', 'Senior Citizen Court', 'School Bus Bay'] },
  ];
  amenityTab = signal('clubhouse');
  activeAmenity = computed(() => this.amenities.find(a => a.id === this.amenityTab())!);

  readonly plans = [
    { id: '4bhk', label: '4 BHK', tagline: 'Grand Spaces', beds: 4, baths: 4, area: '3,928 – 4,839', parking: 2, highlights: ['Ground + 2 upper floors with private lift access', "Ground and first floor height : 11'10\"", "Second floor height : 11'4\""] },
    { id: '5bhk', label: '5 BHK', tagline: 'Palatial Residence', beds: 5, baths: 5, area: '5,335 – 6,368', parking: 3, highlights: ['Ground + 2 upper floors with private lift access', "Ground and first floor height : 12'4\"", "Second floor height : 12'4\""] },
  ];
  planTab = signal('4bhk');
  activePlan = computed(() => this.plans.find(p => p.id === this.planTab())!);

  readonly specs = [
    { icon: 'shield', title: 'Structure', desc: 'Reinforced shear walls for external walls & combination of brick masonry and shear walls for internal walls' },
    { icon: 'brush', title: 'Painting', desc: 'Premium acrylic emulsion paint with smooth putty finish internally; weather-proof exterior emulsion' },
    { icon: 'door', title: 'Main Door', desc: '10-feet height premium designer door with biometric mortise lock (Yale make), 48mm engineered flush shutter with PU polish' },
    { icon: 'layers', title: 'Flooring', desc: 'Engineered wooden flooring in master bedroom & multipurpose room; 18mm granite / full body tiles for staircase' },
    { icon: 'drops', title: 'Bathrooms', desc: '450×600mm dado tiles, anti-skid flooring, Parryware CP & sanitary fittings or equivalent' },
    { icon: 'door', title: 'Internal Doors', desc: '8-feet height with premium designer hardware, oak veneer flush shutter without polish' },
  ];

  readonly gallery = [
    { src: 'images/build1.jpg', alt: 'Exterior view of La Valora villas', label: 'Architectural Excellence' },
    { src: 'images/build2.jpg', alt: 'Villa facade', label: 'Premium Facade' },
    { src: 'images/build3.jpg', alt: 'Swimming pool', label: 'Infinity Pool' },
    { src: 'images/build4.jpg', alt: 'Lifestyle amenity', label: 'Active Living' },
  ];
  lightbox = signal<number | null>(null);

  readonly places = [
    { icon: 'school', name: 'Candiidus International School', time: 6 },
    { icon: 'school', name: 'The Gaudium School', time: 9 },
    { icon: 'building', name: 'Value Zone Hyper Mart', time: 10 },
    { icon: 'hospital', name: 'Dhruva Hospital', time: 13 },
    { icon: 'metro', name: 'Proposed Metro Station', time: 15 },
    { icon: 'hospital', name: 'Pranam Hospital', time: 17 },
    { icon: 'hospital', name: "Shraddha Children's Hospital", time: 18 },
    { icon: 'building', name: 'ICRISAT', time: 20 },
    { icon: 'school', name: 'Samashti International School', time: 20 },
    { icon: 'building', name: 'Neopolis', time: 20 },
    { icon: 'building', name: 'Financial District', time: 25 },
    { icon: 'plane', name: 'Rajiv Gandhi International Airport', time: 40 },
  ];

  form = { name: '', email: '', phone: '', config: '4 BHK' };
  errors = signal<Record<string, string>>({});
  sending = signal(false);

  ngAfterViewInit(): void {
    const root = this.host.nativeElement;
    const done = () => setTimeout(() => this.loading.set(false), 1600);
    document.readyState === 'complete' ? done() : window.addEventListener('load', done, { once: true });

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add('in');
          if (el.dataset['count'] !== undefined) this.countUp(el);
          this.observer!.unobserve(el);
        }
      }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
      root.querySelectorAll('[data-reveal], [data-count]').forEach(el => this.observer!.observe(el));

      this.initParallax(root);
      this.initCursor(root);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.rafId);
    this.cleanup.forEach(fn => fn());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY;
    if (this.scrolled() !== y > 60) this.scrolled.set(y > 60);
    if (this.showBar() !== y > 500) this.showBar.set(y > 500);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (this.lightbox() === null) return;
    if (e.key === 'Escape') this.lightbox.set(null);
    if (e.key === 'ArrowRight') this.step(1);
    if (e.key === 'ArrowLeft') this.step(-1);
  }

  step(dir: number): void {
    const n = this.gallery.length;
    this.lightbox.update(i => ((i ?? 0) + dir + n) % n);
  }

  scrollGallery(track: HTMLElement, dir: number): void {
    track.scrollBy({ left: dir * track.clientWidth * 0.7, behavior: 'smooth' });
  }

  submit(): void {
    const f = this.form;
    const errs: Record<string, string> = {};
    if (!f.name.trim()) errs['name'] = 'Please share your name';
    if (!f.email.trim()) errs['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs['email'] = 'Enter a valid email';
    if (!/^[6-9]\d{9}$/.test(f.phone.replace(/[\s-]/g, '').replace(/^\+?91/, ''))) errs['phone'] = 'Enter a valid 10-digit mobile number';
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    const lead: User = {
      name: f.name.trim(),
      email: f.email.trim(),
      phone: f.phone.replace(/[\s-]/g, ''),
      projectName: 'revesa la velora',
    };
    this.sending.set(true);
    this.leads.formSubmit(lead).subscribe({
      next: () => {
        this.sending.set(false);
        this.router.navigate(['/thankyou'], { state: { name: lead.name, config: f.config } });
      },
      error: (err: unknown) => {
        console.error('Form submission failed:', err);
        this.sending.set(false);
        this.errors.set({ form: 'Something went wrong. Please try again or call us.' });
      },
    });
  }

  private countUp(el: HTMLElement): void {
    const target = parseFloat(el.dataset['count']!);
    const decimals = Number(el.dataset['decimals'] ?? 0);
    const suffix = el.dataset['suffix'] ?? '';
    const fmt = (v: number) => v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(target); return; }
    const start = performance.now(), dur = 2200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private initParallax(root: HTMLElement): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
    const progress = root.querySelector<HTMLElement>('.progress');
    const loop = () => {
      const vh = window.innerHeight;
      for (const el of items) {
        const r = el.parentElement!.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const speed = parseFloat(el.dataset['parallax']!);
        const offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
      if (progress) {
        const max = document.documentElement.scrollHeight - vh;
        progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private initCursor(root: HTMLElement): void {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const dot = root.querySelector<HTMLElement>('.cursor-dot');
    const ring = root.querySelector<HTMLElement>('.cursor-ring');
    if (!dot || !ring) return;
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const target = e.target as HTMLElement;
      ring.classList.toggle('hot', !!target.closest('a, button, input, select, .g-item'));
      // Feed the cursor position to the glass sheen on cards
      const card = target.closest<HTMLElement>('.stat, .spec, .plan-card, .form-card');
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${x - r.left}px`);
        card.style.setProperty('--my', `${y - r.top}px`);
      }
      document.body.classList.add('has-cursor');
    };
    let followId = 0;
    const follow = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      followId = requestAnimationFrame(follow);
    };
    window.addEventListener('mousemove', move, { passive: true });
    followId = requestAnimationFrame(follow);
    this.cleanup.push(() => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(followId);
      document.body.classList.remove('has-cursor');
    });

    // Magnetic buttons
    root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(btn => {
      const mm = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      };
      const ml = () => (btn.style.transform = '');
      btn.addEventListener('mousemove', mm);
      btn.addEventListener('mouseleave', ml);
    });
  }
}
