import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnvelopesPage } from './envelopes.page';

const routes: Routes = [
  {
    path: '',
    component: EnvelopesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnvelopesPageRoutingModule {}
