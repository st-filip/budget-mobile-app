import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionElementComponent } from '../home/transactions/transaction-element/transaction-element.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [TransactionElementComponent],
  imports: [CommonModule, IonicModule],
  exports: [TransactionElementComponent],
})
export class SharedModule {}
