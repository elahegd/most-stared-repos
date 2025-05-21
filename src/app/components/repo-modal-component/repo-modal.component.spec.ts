import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SimplifiedRepo } from '../../services/github.service';
import { RepoModalComponent } from './repo-modal.component';

describe('RepoModalComponent', () => {
  let component: RepoModalComponent;
  let fixture: ComponentFixture<RepoModalComponent>;

  const mockRepo: SimplifiedRepo = {
    name: 'test-repo',
    description: 'Test description',
    stars: '10k',
    issues: 42,
    ownerLogin: 'test-user',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    pushedAt: new Date().toISOString()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepoModalComponent);
    component = fixture.componentInstance;
    component.repo = mockRepo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display repo details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(mockRepo.name);
    expect(compiled.textContent).toContain(mockRepo.description);
    expect(compiled.textContent).toContain(mockRepo.ownerLogin);
  });

  it('should emit close when close button is clicked', () => {
    spyOn(component.close, 'emit');
    const button = fixture.debugElement.query(By.css('.close-btn'));
    button.nativeElement.click();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit close when overlay is clicked', () => {
    spyOn(component.close, 'emit');
    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    overlay.triggerEventHandler('click', new Event('click'));
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit rated and close when a star is clicked', () => {
    spyOn(component.rated, 'emit');
    spyOn(component.close, 'emit');

    const stars = fixture.debugElement.queryAll(By.css('.star'));
    stars[2].nativeElement.click(); // Click the 3rd star

    expect(component.selectedRating).toBe(3);
    expect(component.rated.emit).toHaveBeenCalledWith(3);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should highlight selected stars', () => {
    component.setRating(4);
    fixture.detectChanges();

    const stars = fixture.debugElement.queryAll(By.css('.star'));
    const filledStars = stars.filter(star =>
      star.nativeElement.classList.contains('filled')
    );

    expect(filledStars.length).toBe(4);
  });
});
