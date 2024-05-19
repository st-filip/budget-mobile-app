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

  async openModal(transaction?: Transaction) {
    const modal = await this.modalCtrl.create({
      component: TransactionModalComponent,
      componentProps: { transaction: transaction, editMode: !!transaction },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmAdd') {
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
    if (role === 'confirmEdit') {
      console.log(data);

      this.transactionsService
        .updateTransaction(data.transactionData)
        .subscribe((res) => {
          console.log(res);
          console.log(data.envelopeAllocationStart);
          console.log(data.transactionData.envelopeAllocation);
          if (
            data.transactionData.envelopeAllocation &&
            data.envelopeAllocationStart
          ) {
            const resultAllocation: any = {};

            for (const key in data.envelopeAllocationStart) {
              if (data.envelopeAllocationStart.hasOwnProperty(key)) {
                const startValue = data.envelopeAllocationStart[key];
                const endValue =
                  data.transactionData.envelopeAllocation[key] ?? 0;
                resultAllocation[key] = -(startValue - endValue);
              }
            }

            for (const key in data.transactionData.envelopeAllocation) {
              if (data.transactionData.envelopeAllocation.hasOwnProperty(key)) {
                if (!data.envelopeAllocationStart.hasOwnProperty(key)) {
                  resultAllocation[key] =
                    data.transactionData.envelopeAllocation[key];
                }
              }
            }

            for (const key in data.envelopeAllocationStart) {
              if (data.envelopeAllocationStart.hasOwnProperty(key)) {
                if (
                  !data.transactionData.envelopeAllocation.hasOwnProperty(key)
                ) {
                  resultAllocation[key] = data.envelopeAllocationStart[key];
                }
              }
            }

            console.log(
              'Resulting envelope allocation after subtraction:',
              resultAllocation
            );
            this.envelopesService.updateEnvelopeAmounts(
              resultAllocation,
              data.transactionData.type
            );
          } else {
            console.error(
              'envelopeAllocation or envelopeAllocationStart is not defined'
            );
          }
        });
    }
  }
}
