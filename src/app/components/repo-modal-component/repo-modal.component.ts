import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimplifiedRepo } from '../../services/github.service';

@Component({
  selector: 'app-repo-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repo-modal.component.html',
  styleUrl: './repo-modal.component.scss'
})
export class RepoModalComponent {
  @Input() repo!: SimplifiedRepo;
  @Output() close = new EventEmitter<void>();
  @Output() rated = new EventEmitter<number>();

  public selectedRating = 0;

  onClose() {
    this.close.emit();
  }

  setRating(stars: number) {
    this.selectedRating = stars;
    this.rated.emit(stars);
    this.onClose();
  }
}
