import { Component, Input, OnInit } from '@angular/core';
import { Envelope } from '../envelope.model';
import { EnvelopesService } from '../envelopes.service';

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

  constructor(private envelopesService: EnvelopesService) {}

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

  onDelete(envelopeId: string) {
    this.envelopesService.deleteEnvelope(envelopeId).subscribe(() => {
      console.log('Deleted successfully');
    });
  }
}
