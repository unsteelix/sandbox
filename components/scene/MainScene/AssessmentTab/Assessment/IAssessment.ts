export interface IAsmtProps {
    id: string,
    title?: string,
    fetchAssessmentItems?: any,
    callPopup?: any,
    closePopup?: any,
    items?: [],
    fetchItems?: any,
    placeId?: string | null
}

export interface IAsmtState {
    collapsed: boolean,
    assessmentTitle: string | undefined
}
