export interface IItemProps {
    title: string,
    id: string,
    assessments?: any,
    assessmentId?: 'string',
    fetchAllItems?: any,
    callPopup?: any,
    closePopup?: any,
    updateItemsManually: any,
    edit: boolean,
    del: boolean,
    drag: boolean,
    fetchItems: any,
    sample?: boolean
}

export interface IItemState {
    isDragActive: boolean,
    curX: number,
    curY: number,
    itemWidth: string
}
