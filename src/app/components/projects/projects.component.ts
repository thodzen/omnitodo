import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProjectListItemModel } from 'src/app/models';
import { AppState, selectProjectListWithCount } from 'src/app/reducers';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  item$: Observable<ProjectListItemModel[]>;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.item$ = this.store.pipe(
      select(selectProjectListWithCount),
      tap(d => console.log(d))
    );
  }

}
