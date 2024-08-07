import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import { Envelope } from './envelope.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

export interface IEnvelopesService {
  envelopes: Observable<Envelope[]>;
  addEnvelope(category: string, budget: number, type: string): Observable<any>;
  getEnvelopes(): Observable<Envelope[]>;
  getEnvelope(id: string): Observable<Envelope>;
  deleteEnvelope(id: string): Observable<Envelope[]>;
  updateEnvelope(envelopeEdit: Envelope): Observable<Envelope[]>;
  updateEnvelopeAmounts(
    envelopeAllocation: { [envelopeId: string]: number },
    transactionType: string
  ): void;
  getEnvelopesByEnvelopeIds(envelopeIds: string[]): Observable<Envelope[]>;
}

interface EnvelopeData {
  user: string;
  category: string;
  budget: number;
  available: number;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnvelopesService implements IEnvelopesService {
  private _envelopes = new BehaviorSubject<Envelope[]>([]);

  get envelopes() {
    return this._envelopes.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  addEnvelope(category: string, budget: number, type: string) {
    let generatedId: string;
    let user: string = this.authService.getUserId();
    let available = 0;
    return this.http
      .post<{ name: string }>(
        `${
          environment.firebaseDatabaseUrl
        }envelopes.json?auth=${this.authService.getToken()}`,
        {
          user,
          category,
          budget,
          available,
          type,
        }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.envelopes;
        }),
        take(1),
        tap((envelopes) => {
          this._envelopes.next(
            envelopes.concat({
              id: generatedId,
              user,
              category,
              budget,
              available,
              type,
            })
          );
        })
      );
  }

  getEnvelopes() {
    return this.http
      .get<{ [key: string]: EnvelopeData }>(
        `${
          environment.firebaseDatabaseUrl
        }envelopes.json?auth=${this.authService.getToken()}&orderBy="user"&equalTo="${this.authService.getUserId()}"`
      )
      .pipe(
        map((envelopesData: any) => {
          if (envelopesData && Object.keys(envelopesData).length === 0) {
            // If envelopesData is empty, add a default envelope
            this.addEnvelope('Available', 0, 'Available').subscribe({
              next: (res) => {
                console.log('Default envelope added');
              },
              error: (error) => {
                console.error('Error adding default envelope:', error);
              },
            });
            return [];
          } else {
            const envelopes: Envelope[] = [];
            for (const key in envelopesData) {
              if (envelopesData.hasOwnProperty(key)) {
                envelopes.push({
                  id: key,
                  user: envelopesData[key].user,
                  category: envelopesData[key].category,
                  budget: envelopesData[key].budget,
                  available: envelopesData[key].available,
                  type: envelopesData[key].type,
                });
              }
            }
            return envelopes;
          }
        }),
        tap((envelopes) => {
          this._envelopes.next(envelopes);
        })
      );
  }

  getEnvelope(id: string) {
    return this.http
      .get<EnvelopeData>(
        `${
          environment.firebaseDatabaseUrl
        }envelopes/${id}.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        map((resData) => {
          console.log(resData);
          return {
            id,
            user: resData.user,
            category: resData.category,
            budget: resData.budget,
            available: resData.available,
            type: resData.type,
          };
        })
      );
  }

  deleteEnvelope(id: string) {
    return this.http
      .delete<void>(
        `${
          environment.firebaseDatabaseUrl
        }envelopes/${id}.json?auth=${this.authService.getToken()}`
      )
      .pipe(
        switchMap(() => {
          return this.envelopes;
        }),
        take(1),
        tap((envelopes) => {
          this._envelopes.next(envelopes.filter((env) => env.id !== id));
        })
      );
  }

  updateEnvelope(envelopeEdit: Envelope) {
    console.log(envelopeEdit);

    const envelopeData: EnvelopeData = {
      user: envelopeEdit.user,
      category: envelopeEdit.category,
      budget: envelopeEdit.budget,
      available: envelopeEdit.available,
      type: envelopeEdit.type,
    };

    console.log(envelopeData);
    return this.http
      .put<void>(
        `${environment.firebaseDatabaseUrl}envelopes/${
          envelopeEdit.id
        }.json?auth=${this.authService.getToken()}`,
        envelopeData
      )
      .pipe(
        switchMap(() => this.envelopes),
        take(1),
        tap((envelopes) => {
          const updatedEnvelopeIndex = envelopes.findIndex(
            (env) => env.id === envelopeEdit.id
          );
          const updatedEnvelopes = [...envelopes];
          updatedEnvelopes[updatedEnvelopeIndex] = envelopeEdit;
          this._envelopes.next(updatedEnvelopes);
        })
      );
  }

  updateEnvelopeAmounts(
    envelopeAllocation: { [envelopeId: string]: number },
    transactionType: string
  ) {
    console.log('Updating envelopes...');
    for (const envelopeId in envelopeAllocation) {
      const amount = envelopeAllocation[envelopeId];
      const envelopeEdit = this._envelopes.value.find(
        (envelope) => envelope.id === envelopeId
      );
      if (envelopeEdit) {
        if (transactionType === 'Income') {
          envelopeEdit.available = envelopeEdit.available + amount;
        } else if (transactionType === 'Expense') {
          envelopeEdit.available = envelopeEdit.available - amount;
        } else {
          if (envelopeEdit.category !== 'Available') {
            envelopeEdit.available = envelopeEdit.available + amount;
          } else {
            envelopeEdit.available = envelopeEdit.available - amount;
          }
        }
        this.updateEnvelope(envelopeEdit).subscribe({
          next: (res) => {
            console.log('Envelope updated successfully.');
          },
          error: (error) => {
            console.error('Error updating envelope:', error);
          },
        });
      }
    }
  }

  getEnvelopesByEnvelopeIds(envelopeIds: string[]) {
    return this.http
      .get<{ [key: string]: EnvelopeData }>(
        `${
          environment.firebaseDatabaseUrl
        }envelopes.json?auth=${this.authService.getToken()}&orderBy="user"&equalTo="${this.authService.getUserId()}"`
      )
      .pipe(
        map((envelopesData: any) => {
          const envelopes: Envelope[] = [];
          for (const key in envelopesData) {
            if (envelopesData.hasOwnProperty(key)) {
              const envelope = envelopesData[key];
              if (envelopeIds.includes(key)) {
                envelopes.push({
                  id: key,
                  user: envelope.user,
                  category: envelope.category,
                  budget: envelope.budget,
                  available: envelope.available,
                  type: envelope.type,
                });
              }
            }
          }
          return envelopes;
        }),
        tap((envelopes) => {
          console.log(envelopes);
        })
      );
  }
}
