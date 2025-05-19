import { Component } from '@angular/core';
import { RepoCardComponent } from '../../components/repo-card/repo-card.component';

@Component({
  selector: 'app-repo-list',
  standalone: true,
  imports: [RepoCardComponent],
  templateUrl: './repo-list.component.html',
  styleUrl: './repo-list.component.scss'
})
export class RepoListComponent {

}
