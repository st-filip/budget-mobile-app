import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../transaction.model';
import { Envelope } from '../../envelopes/envelope.model';
import { EnvelopesService } from '../../envelopes/envelopes.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-transaction-element',
  templateUrl: './transaction-element.component.html',
  styleUrls: ['./transaction-element.component.scss'],
})
export class TransactionElementComponent implements OnInit, ViewWillEnter {
  @Input() transaction: Transaction = {
    id: '',
    user: '',
    amount: 0,
    type: '',
    party: '',
    date: new Date(),
    envelopeAllocation: {},
  };
  @Input() edit: boolean = true;

  envelopes: Envelope[] = [];
  envelopeCategories: String[] = [];

  constructor(private envelopesService: EnvelopesService) {}

  getAmountColor(transaction: Transaction): string {
    if (transaction.type === 'Expense') {
      return 'danger';
    } else {
      return 'success';
    }
  }

  ionViewWillEnter() {
    this.envelopesService.getEnvelopes().subscribe();
  }

  ngOnInit() {
    this.envelopesService.envelopes.subscribe((envelopes) => {
      this.envelopes = envelopes;
    });
    this.envelopeCategories = [];
    for (const key in this.transaction.envelopeAllocation) {
      if (this.transaction.envelopeAllocation.hasOwnProperty(key)) {
        const envelopeId = key;
        const envelope = this.envelopes.find((env) => env.id === envelopeId);
        if (envelope) {
          this.envelopeCategories.push(envelope.category);
        }
      }
    }
  }
}
