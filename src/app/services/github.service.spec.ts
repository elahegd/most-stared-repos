import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { GithubService, SimplifiedRepo } from './github.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubService]
    });

    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call correct API URL and return simplified repos', () => {
    const mockResponse = {
      items: [
        {
          name: 'example-repo',
          description: 'A sample GitHub repo',
          stargazers_count: 1500,
          open_issues_count: 12,
          owner: {
            login: 'octocat',
            avatar_url: 'https://example.com/avatar.png'
          },
          pushed_at: '2025-05-01T12:00:00Z'
        }
      ]
    };

    const today = new Date();
    today.setDate(today.getDate() - 30);
    const expectedDate = today.toISOString().split('T')[0];

    service.getTrendingRepos(1).subscribe((repos: SimplifiedRepo[]) => {
      expect(repos.length).toBe(1);
      expect(repos[0]).toEqual({
        name: 'example-repo',
        description: 'A sample GitHub repo',
        stars: '1.5k',
        issues: 12,
        ownerLogin: 'octocat',
        avatarUrl: 'https://example.com/avatar.png',
        pushedAt: '2025-05-01T12:00:00Z'
      });
    });

    const req = httpMock.expectOne(
      `https://api.github.com/search/repositories?q=created:>${expectedDate}&sortt=stars&order=desc&per_page=10&page=1`
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should format stars correctly for values below and above 1000', () => {
    expect((service as any).formatStars(999)).toBe('999');
    expect((service as any).formatStars(1000)).toBe('1k');
    expect((service as any).formatStars(1234)).toBe('1.2k');
    expect((service as any).formatStars(15000)).toBe('15k');
  });

  it('should handle error and return custom message', () => {
    service.getTrendingRepos(1).subscribe({
      next: () => fail('Expected error'),
      error: (err) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
      }
    });

    const req = httpMock.expectOne(() => true);
    req.error(new ProgressEvent('Network error'), { status: 500 });
  });

  it('should generate correct date string for 30 days ago', () => {
    const dateStr = (service as any).getDate30DaysAgo();
    const expected = new Date();
    expected.setDate(expected.getDate() - 30);
    const expectedStr = expected.toISOString().split('T')[0];
    expect(dateStr).toBe(expectedStr);
  });
});
