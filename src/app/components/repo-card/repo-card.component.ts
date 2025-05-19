import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimplifiedRepo } from '../../services/github.service';

@Component({
  selector: 'app-repo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repo-card.component.html',
  styleUrls: ['./repo-card.component.scss']
})
export class RepoCardComponent {
  @Input() repo!: SimplifiedRepo;
}
