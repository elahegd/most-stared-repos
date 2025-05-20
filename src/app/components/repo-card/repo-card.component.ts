import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimplifiedRepo } from '../../services/github.service';
import { DaysAgoPipe } from '../../pipes/days-ago.pipe';

@Component({
  selector: 'app-repo-card',
  standalone: true,
  imports: [CommonModule, DaysAgoPipe],
  templateUrl: './repo-card.component.html',
  styleUrls: ['./repo-card.component.scss']
})
export class RepoCardComponent {
  @Input() repo!: SimplifiedRepo;
}
