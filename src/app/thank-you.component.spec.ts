import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThankYouComponent } from './thank-you.component';

describe('ThankYouComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThankYouComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render a generic thank-you without a name', () => {
    history.replaceState({}, '');
    const fixture = TestBed.createComponent(ThankYouComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent?.trim()).toBe('Thank you.');
  });

  it('should greet the visitor by first name', () => {
    history.replaceState({ name: 'Asha Rao', config: '4 BHK' }, '');
    const fixture = TestBed.createComponent(ThankYouComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Asha.');
    expect(el.querySelector('.ty-lead')?.textContent).toContain('4 BHK villa');
    history.replaceState({}, '');
  });
});
