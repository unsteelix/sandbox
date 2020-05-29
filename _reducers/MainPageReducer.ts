import {
  FETCH_CUSTOM_ITEMS_ERROR,
  FETCH_CUSTOM_ITEMS_PENDING, FETCH_CUSTOM_ITEMS_SUCCESS, ON_CALL_POPUP, ON_CANCEL_POPUP,
  ON_CREATE_TARGET, ON_DESTROY_TARGET, ON_REPLACE_TARGET,
} from '../_actions/actions';

const initState = {
  pending: false,
  error: null,
  onCreateTarget: false,
  placeId: null,
  newPlaceId: null,
  data: {
    sampleItems: [],
    customItems: [],
  },
  isPopupActive: false,
  popup: {
    text: 'Are you sure that you want to delete this?',
    btnOK: 'OK',
    btnCancel: 'CANCEL',
    btnOKListener: null,
    btnCancelListener: null,
  },
};

export default function MainPageReducer(state = initState, action: any) {
  switch (action.type) {
    case ON_CREATE_TARGET: {
      return {
        ...state,
        onCreateTarget: true,
        placeId: action.placeId,
      };
    }
    case ON_REPLACE_TARGET: {
      return {
        ...state,
        newPlaceId: action.newPlaceId,
      };
    }
    case ON_DESTROY_TARGET: {
      return {
        ...state,
        onCreateTarget: false,
        placeId: null,
      };
    }
    case FETCH_CUSTOM_ITEMS_PENDING: {
      return {
        ...state,
        pending: true,
      };
    }
    case FETCH_CUSTOM_ITEMS_SUCCESS: {
      return {
        ...state,
        pending: false,
        data: action.items,
      };
    }
    case FETCH_CUSTOM_ITEMS_ERROR: {
      return {
        ...state,
        pending: false,
        error: action.error,
      };
    }
    case ON_CALL_POPUP: {
      return {
        ...state,
        isPopupActive: true,
        popup: {
          ...state.popup,
          ...action.popup,
        },
      };
    }
    case ON_CANCEL_POPUP: {
      return {
        ...state,
        isPopupActive: false,
        popup: {
          ...initState.popup,
        },
      };
    }

    default:
      return state;
  }
}

export const getPlaceId = (state: any) => state.MainPageReducer.placeId;

export const getItems = (state: any) => state.MainPageReducer.data;

export const getPopupState = (state: any) => state.MainPageReducer.isPopupActive;

export const getPopupItems = (state: any) => state.MainPageReducer.popup;
