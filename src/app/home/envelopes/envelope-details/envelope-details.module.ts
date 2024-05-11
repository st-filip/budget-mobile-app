import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvelopeDetailsPageRoutingModule } from './envelope-details-routing.module';

import { EnvelopeDetailsPage } from './envelope-details.page';
import { EnvelopeTransactionElementComponent } from './envelope-transaction-element/envelope-transaction-element.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnvelopeDetailsPageRoutingModule,
  ],
  declarations: [EnvelopeDetailsPage, EnvelopeTransactionElementComponent],
})
export class EnvelopeDetailsPageModule {}
