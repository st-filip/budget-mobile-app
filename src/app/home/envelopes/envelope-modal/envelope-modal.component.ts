import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Envelope } from '../envelope.model';

@Component({
  selector: 'app-envelope-modal',
  templateUrl: './envelope-modal.component.html',
  styleUrls: ['./envelope-modal.component.scss'],
})
export class EnvelopeModalComponent implements OnInit {
  @ViewChild('envelopeForm', { static: true }) form!: NgForm;
  @Input() editMode: boolean = false;
  @Input() envelope: Envelope | undefined;
  envelopeEdit: Envelope | undefined;
  title = 'Add an envelope';
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.editMode && this.envelope) {
      this.title = 'Edit the envelope';
      this.envelopeEdit = { ...this.envelope };
    }
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    if (this.editMode) {
      this.modalCtrl.dismiss(
        { envelopeData: this.envelopeEdit },
        'confirmEdit'
      );
    } else {
      this.modalCtrl.dismiss(
        {
          envelopeData: {
            category: this.form.value['category'],
            budget: this.form.value['budget'],
            type: this.form.value['type'],
          },
        },
        'confirmAdd'
      );
    }
  }
}
