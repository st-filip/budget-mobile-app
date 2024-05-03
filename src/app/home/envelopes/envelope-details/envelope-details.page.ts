import { Component, OnDestroy, OnInit } from '@angular/core';
import { Envelope } from '../envelope.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EnvelopesService } from '../envelopes.service';

@Component({
  selector: 'app-envelope-details',
  templateUrl: './envelope-details.page.html',
  styleUrls: ['./envelope-details.page.scss'],
})
export class EnvelopeDetailsPage implements OnInit, OnDestroy {
  envelope: Envelope = {
    id: '',
    user: '',
    budget: 0,
    category: '',
    type: '',
    available: 0,
  };

  isLoading: boolean = false;

  private envelopeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private envelopesService: EnvelopesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('envelopeId')) {
        this.navCtrl.navigateBack('/home/tabs/envelopes');
        return;
      }
      this.isLoading = true;
      const envelopeId = paramMap.get('envelopeId');
      if (envelopeId) {
        this.envelopeSubscription = this.envelopesService
          .getEnvelope(envelopeId)
          .subscribe({
            next: (envelope) => {
              if (envelope) {
                this.envelope = envelope;
              } else {
                console.error('Envelope not found');
              }
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error fetching envelope:', error);
              this.isLoading = false;
            },
          });
      }
    });
  }

  ngOnDestroy() {
    if (this.envelopeSubscription) {
      this.envelopeSubscription.unsubscribe();
    }
  }
}
