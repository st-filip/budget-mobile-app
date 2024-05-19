import { Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { Transaction } from './transaction.model';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface TransactionData {
  user: string;
  type: string;
  party?: string;
  amount?: number;
  envelopeAllocation: { [envelope: string]: number };
  date: Date;
  note?: string;
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

  getTransaction(id: string) {
    return this.http
      .get<TransactionData>(
        `${
          environment.firebaseDatabaseUrl
        }transactions/${id}.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        map((resData) => {
          console.log(resData);
          return {
            id,
            user: resData.user,
            type: resData.type,
            party: resData.party,
            amount: resData.amount,
            envelopeAllocation: resData.envelopeAllocation,
            date: resData.date,
            note: resData.note,
          };
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

  deleteTransaction(id: string) {
    return this.http
      .delete<void>(
        `${
          environment.firebaseDatabaseUrl
        }transactions/${id}.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        switchMap(() => {
          return this.transactions;
        }),
        take(1),
        tap((transactions) => {
          this._transactions.next(transactions.filter((tr) => tr.id !== id));
        })
      );
  }

  updateTransaction(transactionEdit: Transaction) {
    console.log(transactionEdit);

    const transactionData: TransactionData = {
      user: transactionEdit.user,
      type: transactionEdit.type,
      party: transactionEdit.party,
      amount: transactionEdit.amount,
      envelopeAllocation: transactionEdit.envelopeAllocation,
      date: transactionEdit.date,
      note: transactionEdit.note,
    };

    console.log(transactionData);
    return this.http
      .put<void>(
        `${environment.firebaseDatabaseUrl}transactions/${
          transactionEdit.id
        }.json?auth=${this.authService.getToken()}`,
        transactionData
      )
      .pipe(
        switchMap(() => this.transactions),
        take(1),
        tap((transactions) => {
          const updatedTransactionIndex = transactions.findIndex(
            (tr) => tr.id === transactionEdit.id
          );
          const updatedTransactions = [...transactions];
          updatedTransactions[updatedTransactionIndex] = transactionEdit;
          this._transactions.next(updatedTransactions);
        })
      );
  }
}
