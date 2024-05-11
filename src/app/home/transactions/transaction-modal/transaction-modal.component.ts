import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, ViewWillEnter } from '@ionic/angular';
import { EnvelopesService } from '../../envelopes/envelopes.service';
import { Envelope } from '../../envelopes/envelope.model';

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss'],
})
export class TransactionModalComponent implements OnInit, ViewWillEnter {
  @ViewChild('transactionForm', { static: true }) form!: NgForm;
  title = 'Add a transaction';
  mydate: any;
  maxdate: string;
  envelopes: Envelope[] = [];
  selectedType: string = 'Expense';
  availableEnvelope?: Envelope;
  availableAmountStart: number = 0;
  availableAmount: number = 0;
  totalExpense: number = 0;
  income: number = 0;

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
    this.availableAmountStart = this.availableEnvelope!.available;
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
    this.availableAmount = this.income - sum;
    this.availableAmountStart = this.availableEnvelope!.available - sum;
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

  onAddTransaction() {
    console.log(this.form.value);
    const envelopeAllocation: any = {};
    Object.keys(this.form.value.envelopeAllocation).forEach((key) => {
      if (
        this.form.value.envelopeAllocation[key] !== '' &&
        this.form.value.envelopeAllocation[key] !== 0
      ) {
        envelopeAllocation[key] = this.form.value.envelopeAllocation[key];
      }
    });

    if (
      this.form.value['type'] !== 'Expense' &&
      this.form.value['type'] !== 'Income'
    ) {
      let sum: number = 0;
      Object.keys(envelopeAllocation).forEach((key) => {
        sum = sum + envelopeAllocation[key];
      });
      envelopeAllocation[this.availableEnvelope!.id] = sum;
      console.log('FILL');
    }
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
      'confirm'
    );
  }
}
