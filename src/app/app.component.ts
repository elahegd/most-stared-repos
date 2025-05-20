import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RepoListComponent } from './pages/repo-list/repo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RepoListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GitHub Repo Explorer';
}
