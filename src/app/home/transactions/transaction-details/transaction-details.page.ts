import { Component, OnDestroy, OnInit } from '@angular/core';
import { Transaction } from '../transaction.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TransactionsService } from '../transactions.service';
import { EnvelopesService } from '../../envelopes/envelopes.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.page.html',
  styleUrls: ['./transaction-details.page.scss'],
})
export class TransactionDetailsPage implements OnInit, OnDestroy {
  transaction: Transaction = {
    id: '',
    user: '',
    amount: 0,
    type: '',
    party: '',
    date: new Date(),
    envelopeAllocation: {},
  };
  envelopes?: any[];

  isLoading: boolean = false;

  private transactionSubscription!: Subscription;
  private envelopesSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private transactionsService: TransactionsService,
    private envelopesService: EnvelopesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('transactionId')) {
        this.navCtrl.navigateBack('/home/tabs/transactions');
        return;
      }
      this.isLoading = true;
      const transactionId = paramMap.get('transactionId');
      if (transactionId) {
        this.transactionSubscription = this.transactionsService
          .getTransaction(transactionId)
          .subscribe({
            next: (transaction) => {
              if (transaction) {
                this.transaction = transaction;
              } else {
                console.error('Transaction not found');
              }
              this.isLoading = false;
              this.fetchEnvelopesByEnvelopeIds(transaction.envelopeAllocation);
            },
            error: (error) => {
              console.error('Error fetching transacion:', error);
              this.isLoading = false;
            },
          });
      }
    });
  }

  fetchEnvelopesByEnvelopeIds(envelopeAllocation: {
    [envelope: string]: number;
  }) {
    const envelopeIds = Object.keys(envelopeAllocation);
    this.envelopesSubscription = this.envelopesService
      .getEnvelopesByEnvelopeIds(envelopeIds)
      .subscribe({
        next: (envelopes) => {
          if (envelopes) {
            const envelopePairs = envelopeIds.map((id) => {
              const envelope = envelopes.find((env) => env.id === id);
              if (envelope && envelopeAllocation[id] != 0) {
                return { envelope, amount: envelopeAllocation[id] };
              } else {
                return null;
              }
            });
            this.envelopes = envelopePairs.filter((pair) => pair !== null);
            console.log(this.envelopes);
          } else {
            console.error('Envelopes not found');
          }
        },
        error: (error) => {
          console.error('Error fetching envelopes:', error);
        },
      });
  }

  getAmountColor(transaction: Transaction): string {
    if (transaction.type === 'Expense') {
      return 'danger';
    } else {
      return 'success';
    }
  }

  ngOnDestroy() {
    if (this.transactionSubscription) {
      this.transactionSubscription.unsubscribe();
    }
    if (this.envelopesSubscription) {
      this.envelopesSubscription.unsubscribe();
    }
  }
}
