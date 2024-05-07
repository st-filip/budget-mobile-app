import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';
import { Transaction } from './transaction.model';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface TransactionData {
  user: string;
  type: string;
  payee: string;
  amount: number;
  envelopeAllocation: string;
  note: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private _transactions = new BehaviorSubject<Transaction[]>([]);

  get transactions() {
    return this._transactions.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  addTransaction(
    type: string,
    party: string,
    amount: number,
    envelopeAllocation: { [envelope: string]: number },
    date: Date,
    note: string
  ) {
    let generatedId: string;
    let user: string = this.authService.getUserId();
    return this.http
      .post<{ name: string }>(
        `${
          environment.firebaseDatabaseUrl
        }transactions.json?auth=${this.authService.getToken()}`,
        {
          user,
          type,
          party,
          amount,
          envelopeAllocation,
          date,
          note,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.transactions;
        }),
        take(1),
        tap((transactions) => {
          this._transactions.next(
            transactions.concat({
              id: generatedId,
              user,
              type,
              party,
              amount,
              envelopeAllocation,
              date,
              note,
            })
          );
        })
      );
  }

  getTransactions() {
    return this.http
      .get<{ [key: string]: TransactionData }>(
        `${
          environment.firebaseDatabaseUrl
        }transactions.json?auth=${this.authService.getToken()}&orderBy="user"&equalTo="${this.authService.getUserId()}"`
      )
      .pipe(
        map((transactionsData: any) => {
          console.log(transactionsData);
          const transactions: Transaction[] = [];
          for (const key in transactionsData) {
            transactions.push({
              id: key,
              type: transactionsData[key].type,
              amount: transactionsData[key].amount,
              user: transactionsData[key].user,
              note: transactionsData[key].note,
              date: transactionsData[key].date,
              party: transactionsData[key].party,
              envelopeAllocation: transactionsData[key].envelopeAllocation,
            });
          }
          return transactions;
        }),
        tap((transactions) => {
          this._transactions.next(transactions);
        })
      );
  }

  getTransactionsByEnvelopeId(envelopeId: string) {
    return this.http
      .get<{ [key: string]: TransactionData }>(
        `${
          environment.firebaseDatabaseUrl
        }transactions.json?auth=${this.authService.getToken()}&orderBy="user"&equalTo="${this.authService.getUserId()}"`
      )
      .pipe(
        map((transactionsData: any) => {
          const transactions: Transaction[] = [];
          for (const key in transactionsData) {
            const transaction = transactionsData[key];
            if (
              transaction.envelopeAllocation &&
              transaction.envelopeAllocation.hasOwnProperty(envelopeId)
            ) {
              transactions.push({
                id: key,
                type: transactionsData[key].type,
                amount: transactionsData[key].amount,
                user: transactionsData[key].user,
                note: transactionsData[key].note,
                date: transactionsData[key].date,
                party: transactionsData[key].party,
                envelopeAllocation: transactionsData[key].envelopeAllocation,
              });
            }
          }
          return transactions;
        }),
        tap((transactions) => {
          console.log(transactions);
        })
      );
  }
}
