import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RepoCardComponent } from './repo-card.component';
import { SimplifiedRepo } from '../../services/github.service';
import { DaysAgoPipe } from '../../pipes/days-ago.pipe';

describe('RepoCardComponent', () => {
  let component: RepoCardComponent;
  let fixture: ComponentFixture<RepoCardComponent>;

  const mockRepo: SimplifiedRepo = {
    name: 'example-repo',
    description: 'This is a test repo',
    stars: '1.2k',
    issues: 12,
    ownerLogin: 'octocat',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    pushedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoCardComponent, DaysAgoPipe]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepoCardComponent);
    component = fixture.componentInstance;
    component.repo = mockRepo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render repository name', () => {
    const nameEl = fixture.nativeElement.querySelector('.repo-name');
    expect(nameEl?.textContent).toContain(mockRepo.name);
  });

  it('should render repository description', () => {
    const descEl = fixture.nativeElement.querySelector('.description');
    expect(descEl?.textContent).toContain(mockRepo.description);
  });

  it('should display stars and issues', () => {
    const starsEl = fixture.nativeElement.querySelector('.repo-stars');
    const issuesEl = fixture.nativeElement.querySelector('.repo-issues');
    expect(starsEl?.textContent).toContain(mockRepo.stars);
    expect(issuesEl?.textContent).toContain(mockRepo.issues.toString());
  });

  it('should show owner login and avatar', () => {
    const avatar = fixture.nativeElement.querySelector('img');
    const loginEl = fixture.nativeElement.querySelector('.repo-owner');
    expect(avatar?.src).toBe(mockRepo.avatarUrl);
    expect(loginEl?.textContent).toContain(mockRepo.ownerLogin);
  });

  it('should format pushedAt using DaysAgoPipe', () => {
    const timeEl = fixture.debugElement.query(By.css('.repo-pushed'));
    expect(timeEl.nativeElement.textContent).toContain('5 days ago');
  });

  it('should emit nameClicked when repo name is clicked', () => {
    spyOn(component.nameClicked, 'emit');

    const nameEl = fixture.debugElement.query(By.css('.repo-name'));
    nameEl.triggerEventHandler('click', null);
    
    expect(component.nameClicked.emit).toHaveBeenCalled();
  });

  it('should display user rating if provided', () => {
    component.userRating = 4;
    fixture.detectChanges();

    const ratingEl = fixture.debugElement.query(By.css('.user-rating'));
    expect(ratingEl.nativeElement.textContent).toContain('4');
  });

  it('should not render user rating if not provided', () => {
    component.userRating = undefined;
    fixture.detectChanges();

    const ratingEl = fixture.debugElement.query(By.css('.user-rating'));
    expect(ratingEl).toBeFalsy();
  });
});
