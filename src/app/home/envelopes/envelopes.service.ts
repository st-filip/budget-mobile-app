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
  currentMoney?: number;
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
    return this.http
      .post<{ name: string }>(
        `${
          environment.firebaseDatabaseUrl
        }envelopes.json?auth=${this.authService.getToken()}`,
        {
          user,
          category,
          budget,
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
          const envelopes: Envelope[] = [];
          for (const key in envelopesData) {
            if (envelopesData.hasOwnProperty(key)) {
              envelopes.push({
                id: key,
                user: envelopesData[key].user,
                category: envelopesData[key].category,
                budget: envelopesData[key].budget,
                type: envelopesData[key].type,
              });
            }
          }
          return envelopes;
        }),
        tap((envelopes) => {
          this._envelopes.next(envelopes);
        })
      );
  }
}
