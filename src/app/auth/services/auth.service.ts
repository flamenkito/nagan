import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TokenModel } from '../models';
import { HttpClient } from '@angular/common/http';
import { POUCHDB } from '@app/shared';

@Injectable()
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}

  logIn(name: string, password: string): Observable<TokenModel> {
    return this.httpClient.post<TokenModel>(POUCHDB('_jwt'), {
      name,
      password
    });
  }

  logOut(): Observable<void> {
    return this.httpClient.delete<void>(POUCHDB('_jwt'));
  }
}
