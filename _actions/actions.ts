export const FETCH_ASSESSMENT_ITEMS_PENDING = 'FETCH ASSESSMENTS ITEMS PENDING';
export const FETCH_ASSESSMENT_ITEMS_SUCCESS = 'FETCH ASSESSMENTS ITEMS SUCCESS';
export const FETCH_ASSESSMENT_ITEMS_ERROR = 'FETCH ASSESSMENTS ITEMS ERROR';

export const FETCH_CUSTOM_ITEMS_PENDING = 'FETCH CUSTOM ITEMS PENDING';
export const FETCH_CUSTOM_ITEMS_SUCCESS = 'FETCH CUSTOM ITEMS SUCCESS';
export const FETCH_CUSTOM_ITEMS_ERROR = 'FETCH CUSTOM ITEMS ERROR';

export const UPDATE_ASSESSMENTS_ITEMS_MANUALLY = 'UPDATE ASSESSMENTS ITEMS MANUALLY';

export const ON_CREATE_TARGET = 'ON CREATE TARGET';
export const ON_REPLACE_TARGET = 'ON REPLACE TARGET';
export const ON_DESTROY_TARGET = 'ON DESTROY TARGET';

export const ON_CALL_POPUP = 'ON CALL POPUP';
export const ON_OK_POPUP = 'ON OK POPUP';
export const ON_CANCEL_POPUP = 'ON CANCEL POPUP';


export const fetchAssessmentItemsPending = () => ({
  type: FETCH_ASSESSMENT_ITEMS_PENDING,
});

export const fetchAssessmentItemsSuccess = ({ assessmentId = '', title = '', items = [] }) => ({
  type: FETCH_ASSESSMENT_ITEMS_SUCCESS,
  assessmentId,
  title,
  items,
});

export const fetchAssessmentItemsError = (error: {}) => ({
  type: FETCH_ASSESSMENT_ITEMS_ERROR,
  error,
});

export const fetchCustomItemsPending = () => ({
  type: FETCH_CUSTOM_ITEMS_PENDING,
});

export const fetchCustomItemsSuccess = (items = {}) => ({
  type: FETCH_CUSTOM_ITEMS_SUCCESS,
  items,
});

export const fetchCustomItemsError = (error: {}) => ({
  type: FETCH_CUSTOM_ITEMS_ERROR,
  error,
});

export const updateAssessmentItemsManually = ({ assessmentId = '', targetPlace = '', activeItemId = null }) => ({
  type: UPDATE_ASSESSMENTS_ITEMS_MANUALLY,
  assessmentId,
  targetPlace,
  activeItemId,
});

export const onCreateTarget = (placeId = '') => ({
  type: ON_CREATE_TARGET,
  placeId,
});

export const onReplaceTarget = (newPlaceId = '') => ({
  type: ON_REPLACE_TARGET,
  newPlaceId,
});

export const onDestroyTarget = () => ({
  type: ON_DESTROY_TARGET,
});

export const onClosePopup = () => ({
  type: ON_CANCEL_POPUP,
});

export const onCallPopup = (popup: {
  text: string,
  btnOK: string,
  btnCancel: string,
  btnOKListener: () => {},
  btnCancelListener: () => {}
}) => ({
  type: ON_CALL_POPUP,
  popup,
});

export default {
  fetchAssessmentItemsPending,
  fetchAssessmentItemsSuccess,
  fetchAssessmentItemsError,
  updateAssessmentItemsManually,
  onCreateTarget,
  onReplaceTarget,
  onDestroyTarget,
  onCallPopup,
};
