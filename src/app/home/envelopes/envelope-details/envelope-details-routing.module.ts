import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnvelopeDetailsPage } from './envelope-details.page';

const routes: Routes = [
  {
    path: '',
    component: EnvelopeDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnvelopeDetailsPageRoutingModule {}
