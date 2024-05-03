import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvelopeDetailsPageRoutingModule } from './envelope-details-routing.module';

import { EnvelopeDetailsPage } from './envelope-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnvelopeDetailsPageRoutingModule
  ],
  declarations: [EnvelopeDetailsPage]
})
export class EnvelopeDetailsPageModule {}
