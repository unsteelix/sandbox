import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAssessmentItems, fetchCustomItems } from '../../../../../_fetches/fetchAssessments';
import { onCallPopup, onClosePopup, updateAssessmentItemsManually } from '../../../../../_actions/actions';
import { checkAreaIntersection, checkItemsIntersection } from '../../../../../_logic/lib';
import { getAssessments } from '../../../../../_reducers/AssessmentsReducer';
import { IItemProps, IItemState } from './IItem';
import deleteIcon from '../../../../assets/delete.svg';
import editIcon from '../../../../assets/edit.svg';
import dragIcon from '../../../../assets/drag.svg';
import CONSTANTS from '../../../../../_constants/constants';
import './Item.scss';

class Item extends PureComponent<IItemProps, IItemState> {
  private offsetX: number;

  private offsetY: number;

  private prevIntersectionId: string | null;

  constructor(props: IItemProps) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.offsetX = 0;
    this.offsetY = 0;
    this.prevIntersectionId = null;

    this.state = {
      isDragActive: false,
      curX: 0,
      curY: 0,
      itemWidth: 'auto',
    };
  }

  private onDragMove(e: any) {
    const { area, isIntersect } = checkAreaIntersection(e.clientX, e.clientY);
    const { updateItemsManually } = this.props;

    if (isIntersect) {
      const assessmentId = area && (area as HTMLElement).getAttribute('id');
      const activeItem = e.target.closest('.item');
      const intersectionOrder = checkItemsIntersection(activeItem, assessmentId);
      this.prevIntersectionId = assessmentId;

      // Updating target not needed if we intersect with target itself
      if (intersectionOrder !== false) {
        updateItemsManually({
          assessmentId,
          targetPlace: intersectionOrder,
        });
      }
    } else if (this.prevIntersectionId !== null) {
      // removing target if there is no intersection with DnD zone
      updateItemsManually({
        assessmentId: this.prevIntersectionId,
        targetPlace: -1,
      });

      this.prevIntersectionId = null;
    }

    this.setState({
      curX: e.clientX - this.offsetX,
      curY: e.clientY - this.offsetY,
    });
  }

  private onDragStart(e: any) {
    const item = e.target.closest('.item');

    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.onDragEnd);

    this.offsetX = e.nativeEvent.offsetX;
    this.offsetY = e.nativeEvent.offsetY;

    this.setState({
      isDragActive: true,
      curX: e.clientX - this.offsetX,
      curY: e.clientY - this.offsetY,
      itemWidth: `${item.offsetWidth}px`,
    });
  }

  private onDragEnd(e: any) {
    const { area, isIntersect } = checkAreaIntersection(e.clientX, e.clientY);
    const { updateItemsManually } = this.props;
    const assessmentId = area && (area as HTMLElement).getAttribute('id');
    const activeItem = e.target.closest('.item');
    const itemId = activeItem && activeItem.getAttribute('id');
    // const intersectionOrder = checkItemsIntersection(activeItem, assessmentId);

    if (isIntersect) {
      this.addItemToAssessment(assessmentId, itemId);

      if (this.prevIntersectionId !== null) {
        // removing target if there is no intersection with DnD zone
        updateItemsManually({
          assessmentId: this.prevIntersectionId,
          targetPlace: -1,
        });

        this.prevIntersectionId = null;
      }
    }
    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.onDragEnd);

    this.setState({
      isDragActive: false,
      curX: 0,
      curY: 0,
      itemWidth: 'auto',
    });
  }

  addItemToAssessment(assessmentId: string | null, itemId?: string) {
    if (assessmentId === null) return;
    const { callPopup } = this.props;
    const addUrl = CONSTANTS.updateAssessmentSet;
    const { fetchItems, assessments } = this.props;
    const currentAssessmentItems = assessments[assessmentId].items;
    const setItemsId = currentAssessmentItems.length === 0
      ? [itemId]
      : currentAssessmentItems.map((item: any) => (item.itemId === undefined ? itemId : item.itemId));

    if (!setItemsId.includes(itemId)) {
      setItemsId.push(itemId);
    }
    axios.post(addUrl, {
      assessmentId,
      setItemId: setItemsId,
    }).then((res) => {
      const response = res.data;
      const { status } = response;
      const { data } = response;

      if (status === 'success') {
        fetchItems(assessmentId);
      } else {
        const popup = {
          text: data[1].data,
        };
        callPopup(popup);
      }
    });
  }

  private deleteItemFromStorage() {
    const url = CONSTANTS.deleteItemUrl;
    const { id, fetchAllItems, callPopup } = this.props;

    // delete item from [SS]
    axios.post(url, {
      id,
    })
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          fetchAllItems();
        } else {
          const popup = {
            text: data[1].data,
          };
          callPopup(popup);
        }
      });
  }

  private createDraggableClone(title: string, id: string) {
    const {
      curX, curY, isDragActive, itemWidth,
    } = this.state;
    const itemPosition = {
      position: isDragActive ? ('fixed' as 'fixed') : ('relative' as 'relative'),
      top: `${curY}px`,
      left: `${curX}px`,
      width: `${itemWidth}`,
      zIndex: isDragActive ? 1 : 0,
    };

    return (
      <div className="item" style={itemPosition} id={id}>
        <div className="drag-icon" style={{ backgroundImage: `url(${dragIcon})` }} />
        <div className="item-title">{`${title}`}</div>
        <div className="delete-icon">
          <img src={deleteIcon} alt="delete" />
        </div>
        <div className="edit-icon">
          <img src={editIcon} alt="edit" />
        </div>
      </div>
    );
  }


  render() {
    const {
      title, id, edit, drag, del, callPopup, closePopup, sample,
    } = this.props;
    const { isDragActive } = this.state;
    const popup = {
      text: 'Do you want to delete this item?',
      btnOKListener: () => {
        closePopup();
        this.deleteItemFromStorage();
      },
    };

    return (
      <>
        {isDragActive ? this.createDraggableClone(title, id) : ''}
        <div className={`item ${del ? '' : 'sample'}`} id={id}>
          {drag ? (
            <div
              className="drag-icon"
              aria-label="drag-icon"
              role="button"
              tabIndex={0}
              onMouseDown={this.onDragStart}
              style={{ backgroundImage: `url(${dragIcon})` }}
            />
          ) : ''}
          <div className="item-title">{title}</div>
          {del ? (
            <div
              role="button"
              tabIndex={0}
              className="delete-icon"
              onKeyDown={() => { callPopup(popup); }}
              onClick={() => { callPopup(popup); }}
            >
              <img src={deleteIcon} alt="delete" />
            </div>
          ) : ''}
          {edit ? (
            <Link to={`${window.location.pathname}/item/${id}${sample ? '?sample' : ''}`}>
              <div className="edit-icon">
                <img src={editIcon} alt="edit" />
              </div>
            </Link>
          ) : ''}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  fetchItems: fetchAssessmentItems,
  updateItemsManually: updateAssessmentItemsManually,
  fetchAllItems: fetchCustomItems,
  callPopup: onCallPopup,
  closePopup: onClosePopup,
}, dispatch);

const mapStateToProps = (state: any) => ({
  assessments: getAssessments(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);
