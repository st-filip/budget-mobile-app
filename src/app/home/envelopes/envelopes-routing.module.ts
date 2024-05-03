import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnvelopesPage } from './envelopes.page';

const routes: Routes = [
  {
    path: '',
    component: EnvelopesPage,
  },
  {
    path: ':envelopeId',
    loadChildren: () =>
      import('./envelope-details/envelope-details.module').then(
        (m) => m.EnvelopeDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnvelopesPageRoutingModule {}
