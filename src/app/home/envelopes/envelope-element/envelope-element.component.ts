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
    currentMoney: 0,
  };

  constructor() {}

  ngOnInit() {}
}
