import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import tokenReducer from './reducers/token';
import { labsReducer } from './reducers/labs';
import { labPlansReducer } from './reducers/lp';
import { ResourceGroupsState, resourceGroupsReducer } from './reducers/rg';

const rootReducer = combineReducers({
  token: tokenReducer,
  labs: labsReducer,
  labPlans: labPlansReducer,
  rgs: resourceGroupsReducer,

});

const store = createStore(rootReducer, applyMiddleware(thunk));

// Export RootState type
export type RootState = ReturnType<typeof rootReducer>;

export default store;
