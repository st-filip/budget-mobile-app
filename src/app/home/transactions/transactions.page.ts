import { Component, OnInit } from '@angular/core';
import { ModalController, ViewWillEnter } from '@ionic/angular';
import { TransactionsService } from './transactions.service';
import { TransactionModalComponent } from './transaction-modal/transaction-modal.component';
import { Transaction } from './transaction.model';
import { EnvelopesService } from '../envelopes/envelopes.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit, ViewWillEnter {
  transactions: Transaction[] = [];
  groupedTransactions: { date: string; transactions: Transaction[] }[] = [];

  constructor(
    private transactionsService: TransactionsService,
    private modalCtrl: ModalController,
    private envelopesService: EnvelopesService
  ) {}

  ionViewWillEnter() {
    this.transactionsService.getTransactions().subscribe();
  }

  ngOnInit() {
    this.transactionsService.transactions.subscribe((transactions) => {
      this.transactions = transactions;
      this.groupTransactionsByDate();
    });
  }

  groupTransactionsByDate() {
    const groupedTransactions: { [date: string]: Transaction[] } = {};
    this.transactions.forEach((transaction) => {
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

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: TransactionModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.transactionsService
        .addTransaction(
          data.transactionData.type,
          data.transactionData.party,
          data.transactionData.amount,
          data.transactionData.envelopeAllocation,
          data.transactionData.date,
          data.transactionData.note
        )
        .subscribe((res) => {
          console.log(res);
          this.envelopesService.updateEnvelopeAmounts(
            data.transactionData.envelopeAllocation,
            data.transactionData.type
          );
        });
    }
  }
}
