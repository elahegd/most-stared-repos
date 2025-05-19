import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, catchError, throwError } from 'rxjs';

export interface SimplifiedRepo {
  name: string;
  description: string;
  stars: string;
  issues: number;
  ownerLogin: string;
  avatarUrl: string;
  pushedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private BASE_URL = 'https://api.github.com/search/repositories';

  constructor(private http: HttpClient) {}

  public getTrendingRepos(page: number, perPage: number = 10): Observable<SimplifiedRepo[]> {
    const date = this.getDate30DaysAgo();
    const url = `${this.BASE_URL}?q=created:>${date}&sortt=stars&order=desc&per_page=${perPage}&page=${page}`;

    return this.http.get<any>(url).pipe(
      map(res =>
        res.items.map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          stars: this.formatStars(repo.stargazers_count),
          issues: repo.open_issues_count,
          ownerLogin: repo.owner.login,
          avatarUrl: repo.owner.avatar_url,
          pushedAt: repo.pushed_at
        }),
        catchError((error) => {
          console.error('GitHub API error:', error);
          return throwError(() => new Error('Failed to load. Please try again later.'));
        })
      ))
    );
  }

  private getDate30DaysAgo(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }

  private formatStars(count: number): string {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace('.0', '')}k`;
    }
    return count.toString();
  }
}
