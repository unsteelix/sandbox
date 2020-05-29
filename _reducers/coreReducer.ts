import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import AssessmentsReducer from './AssessmentsReducer';
import MainPageReducer from './MainPageReducer';

const rootReducer = (history: any) => combineReducers({
  router: connectRouter(history),
  AssessmentItemsReducer: AssessmentsReducer,
  MainPageReducer,
});

export default rootReducer;
