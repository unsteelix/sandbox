export interface IAsmtSceneProps {
  callPopup?: any,
  closePopup?: any,
  itemName: string;
}

export interface IAsmtSceneState {
  assessment: {
    assessmentId: string,
    title: string,
    items: []
  };
  html: string
}
