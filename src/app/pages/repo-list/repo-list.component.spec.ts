import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { By } from '@angular/platform-browser';

import { RepoListComponent } from './repo-list.component';
import { GithubService, SimplifiedRepo } from '../../services/github.service';
import { of, throwError } from 'rxjs';
import { RepoCardComponent } from '../../components/repo-card/repo-card.component';

describe('RepoListComponent', () => {
  let component: RepoListComponent;
  let fixture: ComponentFixture<RepoListComponent>;
  let githubServiceSpy: jasmine.SpyObj<GithubService>;

  const mockRepos: SimplifiedRepo[] = [
    {
      name: 'repo1',
      description: 'desc1',
      stars: '1.2k',
      issues: 5,
      ownerLogin: 'user1',
      avatarUrl: 'https://avatar1.com',
      pushedAt: new Date().toISOString(),
    },
    {
      name: 'repo2',
      description: 'desc2',
      stars: '3.4k',
      issues: 10,
      ownerLogin: 'user2',
      avatarUrl: 'https://avatar2.com',
      pushedAt: new Date().toISOString(),
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GithubService', ['getTrendingRepos']);

    await TestBed.configureTestingModule({
      imports: [RepoListComponent, CommonModule, RepoCardComponent, InfiniteScrollModule],
      providers: [{ provide: GithubService, useValue: spy }]
    }).compileComponents();

    githubServiceSpy = TestBed.inject(GithubService) as jasmine.SpyObj<GithubService>;
    fixture = TestBed.createComponent(RepoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load repos on init', () => {
    githubServiceSpy.getTrendingRepos.and.returnValue(of(mockRepos));
    fixture.detectChanges();
    expect(component.repos.length).toBe(2);
    expect(component.pageNumber).toBe(2);
  });

  it('should render the correct number of repo cards', () => {
    githubServiceSpy.getTrendingRepos.and.returnValue(of(mockRepos));
    fixture.detectChanges();
    const repoCards = fixture.debugElement.queryAll(By.css('app-repo-card'));
    expect(repoCards.length).toBe(2);
  });

  it('should show loading indicator while fetching data', fakeAsync(() => {
    githubServiceSpy.getTrendingRepos.and.returnValue(of(mockRepos));
    component.isLoading = true;
    fixture.detectChanges();
    tick();
    const loadingEl = fixture.debugElement.query(By.css('.loading'));
    expect(loadingEl).toBeTruthy();
  }));

  it('should handle error and display retry button', () => {
    githubServiceSpy.getTrendingRepos.and.returnValue(throwError(() => new Error('Network error')));
    fixture.detectChanges();
    expect(component.error).toBe('Network error');

    const errorBox = fixture.debugElement.query(By.css('.error-box'));
    expect(errorBox).toBeTruthy();

    const retryBtn = errorBox.query(By.css('button'));
    expect(retryBtn.nativeElement.textContent).toContain('Retry');
  });

  it('should retry loading data on retry button click', () => {
    githubServiceSpy.getTrendingRepos.and.returnValues(
      throwError(() => new Error('Error')),
      of(mockRepos)
    );

    fixture.detectChanges(); // first call fails
    const retryButton = fixture.debugElement.query(By.css('.error-box button'));
    retryButton.nativeElement.click();

    fixture.detectChanges(); // re-render after retry
    expect(component.repos.length).toBe(2);
    expect(component.error).toBeNull();
  });

  it('should not call API if already loading', () => {
    component.isLoading = true;
    component.loadRepos();
    expect(githubServiceSpy.getTrendingRepos).not.toHaveBeenCalled();
  });

  it('should load more data on scroll', () => {
    githubServiceSpy.getTrendingRepos.and.returnValue(of(mockRepos));
    fixture.detectChanges();

    component.loadRepos();
    fixture.detectChanges();

    expect(component.repos.length).toBe(4); 
    expect(component.pageNumber).toBe(3);
  });

  it('should open the modal with selected repo', () => {
    const repo = mockRepos[0];
    component.openModal(repo);
    expect(component.selectedRepo).toEqual(repo);
  });

  it('should close the modal', () => {
    component.selectedRepo = mockRepos[0];
    component.closeModal();
    expect(component.selectedRepo).toBeNull();
  });

  it('should store rating when handleRated is called', () => {
    const repo = mockRepos[0];
    component.handleRated(repo.name, 4);
    expect(component.ratings[repo.name]).toBe(4);
  });
  
});
