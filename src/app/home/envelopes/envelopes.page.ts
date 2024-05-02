import { Component, OnInit } from '@angular/core';
import { Envelope } from './envelope.model';
import { EnvelopesService } from 'src/app/home/envelopes/envelopes.service';
import { ModalController, ViewWillEnter } from '@ionic/angular';
import { EnvelopeModalComponent } from './envelope-modal/envelope-modal.component';

@Component({
  selector: 'app-envelopes',
  templateUrl: './envelopes.page.html',
  styleUrls: ['./envelopes.page.scss'],
})
export class EnvelopesPage implements OnInit, ViewWillEnter {
  envelopes: Envelope[] = [];

  constructor(
    private envelopesService: EnvelopesService,
    private modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this.envelopesService.getEnvelopes().subscribe();
  }

  ngOnInit() {
    this.envelopesService.envelopes.subscribe((envelopes) => {
      this.envelopes = envelopes;
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: EnvelopeModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
      this.envelopesService
        .addEnvelope(
          data.envelopeData.category,
          data.envelopeData.budget,
          data.envelopeData.type
        )
        .subscribe((res) => {
          console.log(res);
        });
    }
  }
}
