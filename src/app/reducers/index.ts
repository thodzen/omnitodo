import { ActionReducerMap, createSelector } from '@ngrx/store';
import { PerspectiveModel, ProjectListItemModel, ProjectListModel, TodoListModel } from '../models';
import * as fromProjects from './projects.reducer';
import * as fromTodos from './todos.reducer';
import * as fromAuth from './auth.reducer';

export interface AppState {
  projects: fromProjects.ProjectState;
  todos: fromTodos.TodoState;
  auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  projects: fromProjects.reducer,
  todos: fromTodos.reducer,
  auth: fromAuth.reducer
};

// Selectors are functions that know how to efficiently get the
//    data needed for a component.

// Selector per "branch" of the state.

const selectProjectBranch = (state: AppState) => state.projects;
const selectTodosBranch = (state: AppState) => state.todos;
const selectAuthBranch = (state: AppState) => state.auth;

// Any "helper" selectors

const { selectAll: selectAllProjectEntities, selectEntities: selectProjectItems } = fromProjects.adapter.getSelectors(selectProjectBranch);
const { selectAll: selectAllTodoEntities } = fromTodos.adapter.getSelectors(selectTodosBranch);

const selectAllIncompleteTodoEntities = createSelector(
  selectAllTodoEntities,
  todos => todos.filter(t => t.completed === false)
);

const selectTodoListItemsUnfiltered = createSelector(
  selectAllIncompleteTodoEntities,
  selectProjectItems,
  (todos, projects) => {
    console.log({ todos, projects });
    return todos.map(todo => {
      return {
        ...todo,
        project: !todo.project ? null : projects[todo.project].name,
      } as TodoListModel;
    });
  }
);
// Any selectors your components need.

export const selectProjectTodoList = createSelector(
  selectTodoListItemsUnfiltered,
  selectProjectItems,
  (todos, projects, props) => {
    const pName = projects[props.id].name;
    return {
      perspectiveName: pName + ' Project',
      items: todos.filter(todo => todo.project === pName)
    } as PerspectiveModel;
  }
);

export const selectInboxTodoList = createSelector(
  selectTodoListItemsUnfiltered,
  (todos) => {
    return {
      perspectiveName: 'Inbox',
      items: todos.filter(isInboxItem)
    } as PerspectiveModel;
  }
);

// TODO: We need a selector for the TodoEntry component that
//    gives use a ProjectListModel[]


export const selectProjectListModel = createSelector(
  selectAllProjectEntities,
  items => items as ProjectListModel[]
);

export const selectInboxCount = createSelector(
  selectAllIncompleteTodoEntities,
  (todos) => todos.filter(isInboxItem).length
);

function isInboxItem(todo: TodoListModel): boolean {
  return !todo.dueDate && !todo.project;
}

export const selectProjectListWithCount = createSelector(
  selectAllIncompleteTodoEntities,
  selectAllProjectEntities,
  (todos, projects) => {
    return projects.map(project => {
      const numberOfItemsWithThatProject = todos.filter(todo => todo.project === project.id).length;
      console.log(numberOfItemsWithThatProject);
      return {
        ...project,
        numberOfProjects: numberOfItemsWithThatProject
      } as ProjectListItemModel;
    });
  }
);

export const selectAuthIsLoggedIn = createSelector(
  selectAuthBranch,
  b => b.isLoggedIn
);

export const selectAuthUserName = createSelector(
  selectAuthBranch,
  b => b.username
);

export const selectAuthToken = createSelector(
  selectAuthBranch,
  b => b.token
);
