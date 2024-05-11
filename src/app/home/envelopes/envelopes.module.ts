import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvelopesPageRoutingModule } from './envelopes-routing.module';

import { EnvelopesPage } from './envelopes.page';
import { EnvelopeElementComponent } from './envelope-element/envelope-element.component';
import { EnvelopeModalComponent } from './envelope-modal/envelope-modal.component';
import { EnvelopeTransactionElementComponent } from './envelope-details/envelope-transaction-element/envelope-transaction-element.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, EnvelopesPageRoutingModule],
  declarations: [
    EnvelopesPage,
    EnvelopeElementComponent,
    EnvelopeModalComponent,
  ],
})
export class EnvelopesPageModule {}
