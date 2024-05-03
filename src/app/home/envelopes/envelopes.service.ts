import { Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { Envelope } from './envelope.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

interface EnvelopeData {
  user?: string;
  category: string;
  budget: number;
  available?: number;
  totalExpense?: number;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnvelopesService {
  private _envelopes = new BehaviorSubject<Envelope[]>([]);

  get envelopes() {
    return this._envelopes.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  addEnvelope(category: string, budget: number, type: string) {
    let generatedId: string;
    let user: string | undefined = this.authService.getUserId();
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
}
