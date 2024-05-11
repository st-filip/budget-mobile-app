import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../transaction.model';
import { Envelope } from '../../envelopes/envelope.model';
import { EnvelopesService } from '../../envelopes/envelopes.service';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { TransactionsService } from '../transactions.service';

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

  envelopes: Envelope[] = [];
  envelopeCategories: String[] = [];

  constructor(
    private envelopesService: EnvelopesService,
    private transactionsService: TransactionsService,
    private alertCtrl: AlertController
  ) {}

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
        if (
          envelope &&
          this.transaction.envelopeAllocation[envelope.id] !== 0
        ) {
          this.envelopeCategories.push(envelope.category);
        }
      }
    }
  }

  async onDelete(transactionId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message:
        'Are you sure you want to delete this transaction? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete canceled');
          },
        },
        {
          text: 'Delete',
          cssClass: 'delete-alert-button',
          handler: () => {
            this.transactionsService
              .deleteTransaction(transactionId)
              .subscribe({
                next: (res) => {
                  const envelopeAllocation: any = {};
                  Object.keys(this.transaction.envelopeAllocation).forEach(
                    (key) => {
                      envelopeAllocation[key] =
                        0 - this.transaction.envelopeAllocation[key];
                    }
                  );
                  console.log(envelopeAllocation);

                  this.envelopesService.updateEnvelopeAmounts(
                    envelopeAllocation,
                    this.transaction.type
                  );

                  console.log('Deleted successfully');
                },
                error: (error) => {
                  console.log(error);
                },
              });
          },
        },
      ],
    });

    await alert.present();
  }
}
