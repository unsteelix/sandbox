export interface IItemProps {
    title: string,
    id: string,
    order: number,
    assessmentId: string,
    callPopup?: any,
    closePopup?: any,
    updateItemsManually: any,
    items: any,
    fetchItems: any,
}

export interface IItemState {
    isDragActive: boolean,
    activeItem: Element | null,
    curX: number,
    curY: number,
    itemWidth: string
}
