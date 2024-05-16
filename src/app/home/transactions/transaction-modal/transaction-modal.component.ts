import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, ViewWillEnter } from '@ionic/angular';
import { EnvelopesService } from '../../envelopes/envelopes.service';
import { Envelope } from '../../envelopes/envelope.model';
import { Transaction } from '../transaction.model';

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss'],
})
export class TransactionModalComponent implements OnInit, ViewWillEnter {
  @ViewChild('transactionForm', { static: true }) form!: NgForm;
  @Input() editMode: boolean = false;
  @Input() transaction: Transaction | undefined;
  transactionEdit: Transaction | undefined;
  title = 'Add a transaction';
  mydate: any;
  maxdate: string;
  envelopes: Envelope[] = [];
  selectedType: string = 'Expense';
  availableEnvelope?: Envelope;
  availableAmountFill?: number = 0;
  availableAmount?: number = 0;
  totalExpense?: number = 0;
  income?: number = 0;
  fillAdd: number = 0;
  envelopeAllocationStart: { [envelope: string]: number } = {};

  onTypeChange(event: any) {
    this.selectedType = event.detail.value;
    this.cdr.detectChanges();
  }

  constructor(
    private modalCtrl: ModalController,
    private envelopesService: EnvelopesService,
    private cdr: ChangeDetectorRef
  ) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    this.maxdate = `${year}-${month}-${day}`;
  }

  ionViewWillEnter() {
    this.envelopesService.getEnvelopes().subscribe();
  }

  ngOnInit() {
    this.envelopesService.envelopes.subscribe((envelopes) => {
      this.availableEnvelope = envelopes.find(
        (envelope) => envelope.category === 'Available'
      );
      this.envelopes = envelopes.filter(
        (envelope) => envelope.category !== 'Available'
      );
    });
    this.availableAmountFill = this.availableEnvelope!.available;

    if (this.editMode && this.transaction) {
      this.title = 'Edit the transaction';
      this.transactionEdit = { ...this.transaction };
      this.selectedType = this.transactionEdit.type;
      if (this.selectedType === 'Expense') {
        this.totalExpense = this.transaction.amount;
      }
      if (this.selectedType === 'Income') {
        this.income = this.transaction.amount;
      }
      this.envelopeAllocationStart = this.transaction.envelopeAllocation;
    }
  }

  calculate() {
    if (!isNaN(this.form.value['amount']) && this.selectedType === 'Income') {
      this.income = this.form.value['amount'];
    }
    let sum = 0;
    this.envelopes.forEach((envelope) => {
      if (envelope.category !== 'Available') {
        sum += this.form.value['envelopeAllocation'][envelope.id] || 0;
      }
    });
    this.totalExpense = sum;
    if (this.income) this.availableAmount = this.income - sum;
    this.availableAmountFill = this.availableEnvelope!.available - sum;
    if (this.transactionEdit && this.selectedType === 'Fill from available') {
      const values = Object.values(this.transactionEdit.envelopeAllocation);
      if (values.length > 0) {
        this.fillAdd = values[0];
      }
      this.availableAmountFill = this.availableAmountFill + this.fillAdd;
    }
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  isModalOpen = false;

  onModalOpen() {
    this.isModalOpen = true;
  }

  onModalClose() {
    this.isModalOpen = false;
  }

  onSubmit() {
    const envelopeAllocation: any = {};
    Object.keys(this.form.value.envelopeAllocation).forEach((key) => {
      if (
        this.form.value.envelopeAllocation[key] !== '' &&
        this.form.value.envelopeAllocation[key] !== undefined
        // &&
        // this.form.value.envelopeAllocation[key] !== 0
      ) {
        envelopeAllocation[key] = this.form.value.envelopeAllocation[key];
      }
    });

    if (this.selectedType === 'Fill from available') {
      let sum: number = 0;
      Object.keys(envelopeAllocation).forEach((key) => {
        sum = sum + envelopeAllocation[key];
      });
      envelopeAllocation[this.availableEnvelope!.id] = sum;
      console.log('FILL');
    }

    if (this.editMode) {
      this.transactionEdit!.date = this.form.value['date'];
      if (this.form.value['amount']) {
        this.transactionEdit!.amount = this.form.value['amount'];
      }
      this.transactionEdit!.envelopeAllocation = envelopeAllocation;
      console.log(this.transactionEdit);
      this.modalCtrl.dismiss(
        {
          transactionData: this.transactionEdit,
          envelopeAllocationStart: this.envelopeAllocationStart,
        },
        'confirmEdit'
      );
    } else {
      console.log(this.form.value);
      console.log(envelopeAllocation);

      this.modalCtrl.dismiss(
        {
          transactionData: {
            type: this.form.value['type'],
            party: this.form.value['party'],
            amount: this.form.value['amount'],
            envelopeAllocation: envelopeAllocation,
            date: this.form.value['date'],
            note: this.form.value['note'],
          },
        },
        'confirmAdd'
      );
    }
  }
}
