import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { RepoCardComponent } from '../../components/repo-card/repo-card.component';
import { RepoModalComponent } from '../../components/repo-modal-component/repo-modal.component';
import { SimplifiedRepo, GithubService } from '../../services/github.service';

@Component({
  selector: 'app-repo-list',
  standalone: true,
  imports: [CommonModule, RepoCardComponent, RepoModalComponent, InfiniteScrollModule],
  templateUrl: './repo-list.component.html',
  styleUrl: './repo-list.component.scss'
})
export class RepoListComponent {
  public repos: SimplifiedRepo[] = [];
  private page = 1;
  public isLoading = false;
  public error: string | null = null;
  public selectedRepo: SimplifiedRepo | null = null;
  public ratings: Record<string, number> = {};

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.loadRepos();
  }

  public loadRepos() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.githubService.getTrendingRepos(this.page).subscribe(data => {
      this.repos = [...this.repos, ...data];
      this.page++;
      this.isLoading = false;
      this.error = null;
    },
    error => {
      if (error instanceof Error) {
        this.error = error.message;
      } else {
        this.error = 'Something went wrong. Please try again.';
      }
      this.isLoading = false;
    });
  }

  public retry() {
    this.loadRepos();
  }

  public get pageNumber(): number {
    return this.page;
  }

  public openModal(repo: SimplifiedRepo) {
    this.selectedRepo = repo;
  }
  
  public closeModal() {
    this.selectedRepo = null;
  }

  public handleRated(repoName: string, stars: number) {
    this.ratings[repoName] = stars;
  }
}
