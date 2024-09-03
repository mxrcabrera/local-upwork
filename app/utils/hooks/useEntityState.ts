import { useReducer } from 'react';

type State<T> = {
  entities: T[];
  loading: boolean;
  showCreateForm: boolean;
  showEditForm: boolean;
  currentEntity: T | null;
  entityToDelete: string | null;
};

type Action<T> =
  | { type: 'SET_ENTITIES'; payload: T[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SHOW_CREATE_FORM'; payload: boolean }
  | { type: 'SHOW_EDIT_FORM'; payload: boolean }
  | { type: 'SET_CURRENT_ENTITY'; payload: T | null }
  | { type: 'SET_ENTITY_TO_DELETE'; payload: string | null };

const initialState = <T>(): State<T> => ({
  entities: [],
  loading: true,
  showCreateForm: false,
  showEditForm: false,
  currentEntity: null,
  entityToDelete: null,
});

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case 'SET_ENTITIES':
      return { ...state, entities: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SHOW_CREATE_FORM':
      return { ...state, showCreateForm: action.payload };
    case 'SHOW_EDIT_FORM':
      return { ...state, showEditForm: action.payload };
    case 'SET_CURRENT_ENTITY':
      return { ...state, currentEntity: action.payload };
    case 'SET_ENTITY_TO_DELETE':
      return { ...state, entityToDelete: action.payload };
    default:
      return state;
  }
};

export const useEntityState = <T>(): [State<T>, React.Dispatch<Action<T>>] => {
  return useReducer(reducer<T>, initialState<T>());
};