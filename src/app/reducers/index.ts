import { ActionReducerMap, createSelector } from '@ngrx/store';
import { ProjectListModel } from '../models';
import * as fromProjects from './projects.reducer';
import * as fromTodos from './todos.reducer';

export interface AppState {
  projects: fromProjects.ProjectState;
  todos: fromTodos.TodoState;
}

export const reducers: ActionReducerMap<AppState> = {
  projects: fromProjects.reducer,
  todos: fromTodos.reducer
};

// Selectors are functions that know how to efficiently get the
//    data needed for a component.

// Selector per "branch" of the state.

const selectProjectBranch = (state: AppState) => state.projects;

// Any "helper" selectors

const { selectAll: selectAllProjectEntities } = fromProjects.adapter.getSelectors(selectProjectBranch);

// Any selectors your components need.

// TODO: We need a selector for the TodoEntry component that
//    gives use a ProjectListModel[]

export const selectProjectListModel = createSelector(
  selectAllProjectEntities,
  items => items as ProjectListModel[]
);
