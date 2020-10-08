import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import * as authActions from '../actions/auth.actions';
import * as todoActions from '../actions/todo-actions';
import { environment } from '../../environments/environment';
import { createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
@Injectable()
export class AuthEffects {

  private authUrl = environment.authUrl;

  // LoginSucceeded -> LoadTodos
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      // all the actions that left the reducer
      ofType(authActions.loginSucceeded), // filter
      // only keep going if it's a loginSucceeded
      map(() => todoActions.loadTodos())
      // turn the input into the output
    ) // [todoActions.LoadTodos]
  );

  // if they log in successfully, take them to the dashboard.
  loginRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginSucceeded),
      tap(() => this.router.navigate(['dashboard']))

    ), { dispatch: false }
  );

  // LoginRequested => (LoginSucceeded | LoginFailed)
  loginRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginRequested),
      switchMap((auth) => this.client.post<{ access_token: string }>(this.authUrl, auth.payload)
        .pipe(
          map(response => authActions.loginSucceeded({ payload: { username: auth.payload.username, token: response.access_token } })),
          catchError(err => of(authActions.loginFailed({ message: 'Could not Log You in' }))) // 'of' creates an observable
        )
      )
    ), { dispatch: true }
  );

  // if they log out successfully, take them to the login screen.
  logoutRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logoutSuccess),
      tap(() => this.router.navigate(['login']))

    ), { dispatch: false }
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private client: HttpClient
  ) { }
}
