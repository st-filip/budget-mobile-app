import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionsPageRoutingModule } from './transactions-routing.module';

import { TransactionsPage } from './transactions.page';
import { TransactionModalComponent } from './transaction-modal/transaction-modal.component';
import { TransactionElementComponent } from './transaction-element/transaction-element.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionsPageRoutingModule,
  ],
  declarations: [
    TransactionsPage,
    TransactionModalComponent,
    TransactionElementComponent,
  ],
})
export class TransactionsPageModule {}
