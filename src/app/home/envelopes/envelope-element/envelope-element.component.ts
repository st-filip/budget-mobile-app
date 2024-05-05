import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Envelope } from '../envelope.model';
import { EnvelopesService } from '../envelopes.service';
import { AlertController } from '@ionic/angular';

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
    private alertCtrl: AlertController
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
}
