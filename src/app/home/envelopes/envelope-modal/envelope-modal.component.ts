import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-envelope-modal',
  templateUrl: './envelope-modal.component.html',
  styleUrls: ['./envelope-modal.component.scss'],
})
export class EnvelopeModalComponent implements OnInit {
  @ViewChild('envelopeForm', { static: true }) form!: NgForm;
  title = 'Add an envelope';
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onAddEnvelope() {
    this.modalCtrl.dismiss(
      {
        envelopeData: {
          category: this.form.value['category'],
          budget: this.form.value['budget'],
          type: this.form.value['type'],
        },
      },
      'confirm'
    );
  }
}
