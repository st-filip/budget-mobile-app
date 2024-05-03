import { Component, Input, OnInit } from '@angular/core';
import { Envelope } from '../envelope.model';

@Component({
  selector: 'app-envelope-element',
  templateUrl: './envelope-element.component.html',
  styleUrls: ['./envelope-element.component.scss'],
})
export class EnvelopeElementComponent implements OnInit {
  @Input() envelope: Envelope = {
    id: '',
    budget: 0,
    category: '',
    type: '',
    totalExpense: 0,
    available: 0,
  };

  constructor() {}

  ngOnInit() {}

  getAvailableColor(available: number): string {
    if (available > 0) {
      return 'success';
    } else if (available < 0) {
      return 'danger';
    } else {
      return 'dark';
    }
  }
}
