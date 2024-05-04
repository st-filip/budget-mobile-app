import { Component, OnInit } from '@angular/core';
import { Envelope } from './envelope.model';
import { EnvelopesService } from 'src/app/home/envelopes/envelopes.service';
import {
  AlertController,
  ModalController,
  ViewWillEnter,
} from '@ionic/angular';
import { EnvelopeModalComponent } from './envelope-modal/envelope-modal.component';

@Component({
  selector: 'app-envelopes',
  templateUrl: './envelopes.page.html',
  styleUrls: ['./envelopes.page.scss'],
})
export class EnvelopesPage implements OnInit, ViewWillEnter {
  envelopes: Envelope[] = [];
  monthlyEnvelopes: Envelope[] = [];
  annualEnvelopes: Envelope[] = [];
  goalsEnvelopes: Envelope[] = [];
  availableEnvelopes: Envelope[] = [];

  constructor(
    private envelopesService: EnvelopesService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.envelopesService.getEnvelopes().subscribe();
  }

  ngOnInit() {
    this.envelopesService.envelopes.subscribe((envelopes) => {
      this.envelopes = envelopes;
      this.monthlyEnvelopes = envelopes.filter(
        (envelope) => envelope.type === 'Monthly'
      );
      this.annualEnvelopes = envelopes.filter(
        (envelope) => envelope.type === 'Annual'
      );
      this.goalsEnvelopes = envelopes.filter(
        (envelope) => envelope.type === 'Goal'
      );
      this.availableEnvelopes = envelopes.filter(
        (envelope) => envelope.type === 'Available'
      );
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: EnvelopeModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const categoryExists = this.envelopes.some(
        (envelope) => envelope.category === data.envelopeData.category
      );

      if (!categoryExists) {
        this.envelopesService
          .addEnvelope(
            data.envelopeData.category,
            data.envelopeData.budget,
            data.envelopeData.type
          )
          .subscribe((res) => {
            console.log(res);
          });
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Category already exists.',
          buttons: ['OK'],
        });

        await alert.present();
      }
    }
  }
}
