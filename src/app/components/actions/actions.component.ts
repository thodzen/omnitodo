import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { TodoEntryComponent } from '../todo-entry/todo-entry.component';

import { logoutSuccess } from 'src/app/actions/auth.actions';
import { AppState } from 'src/app/reducers';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  form: FormGroup;

  constructor(
    private bottomSheet: MatBottomSheet,
    private store: Store<AppState>,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  addItem(): void {
    const config: MatBottomSheetConfig = {
      disableClose: true,
      autoFocus: true
    };
    this.bottomSheet.open(TodoEntryComponent, config);
  }

  logout(): void {
    this.store.dispatch(logoutSuccess());
  }
}
