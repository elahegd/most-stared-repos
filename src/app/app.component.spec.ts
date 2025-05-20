import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RepoListComponent } from './pages/repo-list/repo-list.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RepoListComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have title 'GitHub Repo Explorer'`, () => {
    expect(component.title).toBe('GitHub Repo Explorer');
  });

  it('should render RepoListComponent', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const repoList = compiled.querySelector('app-repo-list');
    expect(repoList).not.toBeNull();
  });
});
