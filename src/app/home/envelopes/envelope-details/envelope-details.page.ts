import { Component, OnDestroy, OnInit } from '@angular/core';
import { Envelope } from '../envelope.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EnvelopesService } from '../envelopes.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { Transaction } from '../../transactions/transaction.model';

@Component({
  selector: 'app-envelope-details',
  templateUrl: './envelope-details.page.html',
  styleUrls: ['./envelope-details.page.scss'],
})
export class EnvelopeDetailsPage implements OnInit, OnDestroy {
  envelope: Envelope = {
    id: '',
    user: '',
    budget: 0,
    category: '',
    type: '',
    available: 0,
  };
  transactions?: Transaction[];
  groupedTransactions: { date: string; transactions: Transaction[] }[] = [];

  isLoading: boolean = false;

  private envelopeSubscription!: Subscription;
  private transactionsSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private envelopesService: EnvelopesService,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('envelopeId')) {
        this.navCtrl.navigateBack('/home/tabs/envelopes');
        return;
      }
      this.isLoading = true;
      const envelopeId = paramMap.get('envelopeId');
      if (envelopeId) {
        this.envelopeSubscription = this.envelopesService
          .getEnvelope(envelopeId)
          .subscribe({
            next: (envelope) => {
              if (envelope) {
                this.envelope = envelope;
              } else {
                console.error('Envelope not found');
              }
              this.isLoading = false;
              this.fetchTransactionsByEnvelopeId(envelopeId);
            },
            error: (error) => {
              console.error('Error fetching envelope:', error);
              this.isLoading = false;
            },
          });
      }
    });
  }

  fetchTransactionsByEnvelopeId(envelopeId: string) {
    this.transactionsSubscription = this.transactionsService
      .getTransactionsByEnvelopeId(envelopeId)
      .subscribe({
        next: (transactions) => {
          if (transactions) {
            this.transactions = transactions;
            console.log('!!!');
            console.log(this.transactions);
            this.groupTransactionsByDate();
            console.log(this.groupedTransactions);
          } else {
            console.error('Transactions not found');
          }
        },
        error: (error) => {
          console.error('Error fetching transactions:', error);
        },
      });
  }

  groupTransactionsByDate() {
    const groupedTransactions: { [date: string]: Transaction[] } = {};
    this.transactions?.forEach((transaction) => {
      const date = transaction.date + '';
      if (!groupedTransactions[date]) {
        groupedTransactions[date] = [];
      }
      groupedTransactions[date].push(transaction);
    });

    // Sort the keys (dates) in descending order
    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });

    // Map the sorted dates and transactions to the groupedTransactions array
    this.groupedTransactions = sortedDates.map((date) => ({
      date,
      transactions: groupedTransactions[date],
    }));
  }

  getDaysInCurrentMonth(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  getCurrentDay(): number {
    return new Date().getDate();
  }

  calculateRemainingBudget(): number {
    const daysInMonth = this.getDaysInCurrentMonth();
    const currentDay = this.getCurrentDay();
    const dailyBudget = this.envelope.budget / daysInMonth;
    const remainingDays = daysInMonth - currentDay;

    return dailyBudget * remainingDays;
  }

  getStatus(): string {
    const result = this.envelope.available - this.calculateRemainingBudget();
    const roundedResult = parseFloat(result.toFixed(2));
    const status = roundedResult > 0 ? 'ahead' : 'behind';
    return `${roundedResult} ${status}`;
  }

  ngOnDestroy() {
    if (this.envelopeSubscription) {
      this.envelopeSubscription.unsubscribe();
    }
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }
  }
}
