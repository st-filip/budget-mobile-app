import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../../../transactions/transaction.model';
import { Envelope } from '../../envelope.model';

@Component({
  selector: 'app-envelope-transaction-element',
  templateUrl: './envelope-transaction-element.component.html',
  styleUrls: ['./envelope-transaction-element.component.scss'],
})
export class EnvelopeTransactionElementComponent implements OnInit {
  @Input() transaction: Transaction = {
    id: '',
    user: '',
    amount: 0,
    type: '',
    party: '',
    date: new Date(),
    envelopeAllocation: {},
  };
  @Input() envelope: Envelope = {
    id: '',
    user: '',
    budget: 0,
    category: '',
    type: '',
    available: 0,
  };

  constructor() {}

  ngOnInit() {}

  getAmountColor(transaction: Transaction): string {
    if (transaction.type === 'Expense') {
      return 'danger';
    } else {
      return 'success';
    }
  }
}
