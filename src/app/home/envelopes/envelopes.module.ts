import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvelopesPageRoutingModule } from './envelopes-routing.module';

import { EnvelopesPage } from './envelopes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnvelopesPageRoutingModule
  ],
  declarations: [EnvelopesPage]
})
export class EnvelopesPageModule {}
