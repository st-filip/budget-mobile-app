import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Envelope } from '../envelope.model';
import { EnvelopesService } from '../envelopes.service';
import { AlertController } from '@ionic/angular';
import { TransactionsService } from '../../transactions/transactions.service';
import { Transaction } from '../../transactions/transaction.model';

@Component({
  selector: 'app-envelope-element',
  templateUrl: './envelope-element.component.html',
  styleUrls: ['./envelope-element.component.scss'],
})
export class EnvelopeElementComponent implements OnInit {
  @Input() envelope: Envelope = {
    id: '',
    user: '',
    budget: 0,
    category: '',
    type: '',
    available: 0,
  };

  @Output() editEnvelope: EventEmitter<Envelope> = new EventEmitter<Envelope>();

  constructor(
    private envelopesService: EnvelopesService,
    private alertCtrl: AlertController,
    private transactionsService: TransactionsService
  ) {}

  ngOnInit() {}

  getAvailableColor(envelope: Envelope): string {
    if (envelope.type === 'Available') {
      return 'dark';
    }
    if (envelope.available > 0) {
      return 'success';
    } else if (envelope.available < 0) {
      return 'danger';
    } else {
      return 'dark';
    }
  }

  async onDelete(envelopeId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message:
        'Are you sure you want to delete this envelope? This action cannot be undone.',
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
            this.envelopesService.deleteEnvelope(envelopeId).subscribe(() => {
              this.updateTransactionAmounts(envelopeId);
              console.log('Deleted successfully');
            });
          },
        },
      ],
    });

    await alert.present();
  }

  onEdit(envelope: Envelope) {
    this.editEnvelope.emit(envelope);
  }

  updateTransactionAmounts(envelopeId: string) {
    this.transactionsService
      .getTransactionsByEnvelopeId(envelopeId)
      .subscribe((transactions) => {
        const expenses: Transaction[] = [];
        const incomes: Transaction[] = [];
        const fills: Transaction[] = [];

        transactions.forEach((transaction) => {
          switch (transaction.type) {
            case 'Expense':
              expenses.push(transaction);
              break;
            case 'Income':
              incomes.push(transaction);
              break;
            case 'Fill from available':
              fills.push(transaction);
              break;
            default:
              break;
          }
        });

        console.log('Expenses:', expenses);
        console.log('Incomes:', incomes);
        console.log('Fills:', fills);

        expenses.forEach((expense) => {
          if (Object.keys(expense.envelopeAllocation).length === 1) {
            this.updateWhenDeleting(expense);
          } else {
            this.updateWhenNotDeleting(expense, envelopeId);
          }
        });

        incomes.forEach((income) => {
          this.updateWhenNotDeleting(income, envelopeId);
        });

        fills.forEach((fill) => {
          if (Object.keys(fill.envelopeAllocation).length === 2) {
            this.updateWhenDeleting(fill);
          } else {
            this.updateWhenNotDeleting(fill, envelopeId);
          }
        });
      });
  }

  updateWhenDeleting(transaction: Transaction) {
    this.transactionsService.deleteTransaction(transaction.id).subscribe({
      next: (res) => {
        const envelopeAllocation: any = {};
        Object.keys(transaction.envelopeAllocation).forEach((key) => {
          envelopeAllocation[key] = 0 - transaction.envelopeAllocation[key];
        });
        console.log(envelopeAllocation);

        this.envelopesService.updateEnvelopeAmounts(
          envelopeAllocation,
          transaction.type
        );

        console.log('Deleted successfully');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  updateWhenNotDeleting(transaction: Transaction, envelopeId: string) {
    const env = JSON.parse(JSON.stringify(transaction));
    const envelopeAllocationStart = env.envelopeAllocation;
    if (transaction.type === 'Fill from available') {
      const firstKey = Object.keys(transaction.envelopeAllocation)[0];
      console.log(firstKey);
      transaction.envelopeAllocation[firstKey] -=
        transaction.envelopeAllocation[envelopeId];
    }
    if (transaction.type === 'Income') {
      const firstKey = Object.keys(transaction.envelopeAllocation)[0];
      console.log(firstKey);
      transaction.envelopeAllocation[firstKey] +=
        transaction.envelopeAllocation[envelopeId];
    }
    if (transaction.amount && transaction.type === 'Expense') {
      transaction.amount =
        transaction.amount - transaction.envelopeAllocation[envelopeId];
    }
    transaction.envelopeAllocation[envelopeId] = 0;

    console.log(envelopeAllocationStart);
    console.log(transaction.envelopeAllocation);
    console.log(transaction);

    this.transactionsService.updateTransaction(transaction).subscribe((res) => {
      const resultAllocation: any = {};

      for (const key in envelopeAllocationStart) {
        if (envelopeAllocationStart.hasOwnProperty(key)) {
          const startValue = envelopeAllocationStart[key];
          const endValue = transaction.envelopeAllocation[key] ?? 0;
          resultAllocation[key] = -(startValue - endValue);
        }
      }

      for (const key in transaction.envelopeAllocation) {
        if (transaction.envelopeAllocation.hasOwnProperty(key)) {
          if (!envelopeAllocationStart.hasOwnProperty(key)) {
            resultAllocation[key] = transaction.envelopeAllocation[key];
          }
        }
      }

      for (const key in envelopeAllocationStart) {
        if (envelopeAllocationStart.hasOwnProperty(key)) {
          if (!transaction.envelopeAllocation.hasOwnProperty(key)) {
            resultAllocation[key] = envelopeAllocationStart[key];
          }
        }
      }

      console.log(
        'Resulting envelope allocation after subtraction:',
        resultAllocation
      );
      this.envelopesService.updateEnvelopeAmounts(
        resultAllocation,
        transaction.type
      );
    });
  }
}
