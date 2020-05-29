import {
  FETCH_ASSESSMENT_ITEMS_ERROR,
  FETCH_ASSESSMENT_ITEMS_PENDING,
  FETCH_ASSESSMENT_ITEMS_SUCCESS,
  UPDATE_ASSESSMENTS_ITEMS_MANUALLY,
} from '../_actions/actions';

interface IInitState {
  pending: boolean;
  assessments: {[key: string] : {
      title: string;
      items: any;
    }};
  error: string | null;
  activeItemId: string | null;
}

const initState: IInitState = {
  pending: false,
  assessments: {},
  error: null,
  activeItemId: null,
};

export default function AssessmentItemsReducer(state = initState, action: any) {
  switch (action.type) {
    case FETCH_ASSESSMENT_ITEMS_PENDING: {
      return {
        ...state,
        pending: true,
      };
    }
    case FETCH_ASSESSMENT_ITEMS_SUCCESS: {
      return {
        ...state,
        pending: false,
        assessments: {
          ...state.assessments,
          [action.assessmentId]: {
            title: action.title,
            items: action.items,
          },
        },
      };
    }
    case UPDATE_ASSESSMENTS_ITEMS_MANUALLY: {
      const newItems: {itemId?: string}[] = Array.from(state.assessments[action.assessmentId].items);
      // @ts-ignore
      const targetIndex = newItems.indexOf('target');
      const { activeItemId, targetPlace } = action;
      let droppedItem = {};
      let droppedIndex = -1;

      if (targetIndex !== -1) {
        if (activeItemId !== null) {
          for (let i = 0; i < newItems.length; i += 1) {
            if (newItems[i].itemId === activeItemId) {
              droppedItem = newItems[i];
              droppedIndex = i;
              break;
            }
          }
          newItems[targetIndex] = droppedItem;
          // reorder item and place it to a new place
          newItems.splice(droppedIndex, 1);
        } else {
          // remove target from previous place
          newItems.splice(targetIndex, 1);
        }
      }
      if (+targetPlace !== -1) {
        // add target to a new place
        // @ts-ignore
        newItems.splice(+targetPlace, 0, 'target');
      }

      return {
        ...state,
        assessments: {
          ...state.assessments,
          [action.assessmentId]: {
            ...state.assessments[action.assessmentId],
            items: newItems,
          },
        },
      };
    }
    case FETCH_ASSESSMENT_ITEMS_ERROR: {
      return {
        ...state,
        pending: false,
        error: action.error,
      };
    }
    default: {
      return state;
    }
  }
}

export const getAssessments = (state: {AssessmentItemsReducer: IInitState}) => state.AssessmentItemsReducer.assessments;

export const getAssessmentItems = (state: {AssessmentItemsReducer: IInitState}, id: string) => {
  if (state.AssessmentItemsReducer.assessments[id] === undefined) {
    return [];
  }
  return state.AssessmentItemsReducer.assessments[id].items;
};
export const getAssessmentTitle = (state: {AssessmentItemsReducer: IInitState}, id: string) => {
  if (state.AssessmentItemsReducer.assessments[id] === undefined) {
    return 'Untitled';
  }
  return state.AssessmentItemsReducer.assessments[id].title;
};
export const getAssessmentItemsPending = (state: {AssessmentItemsReducer: IInitState}) => state.AssessmentItemsReducer.pending;
export const getAssessmentItemsError = (state: {AssessmentItemsReducer: IInitState}) => state.AssessmentItemsReducer.error;
