import React, { PureComponent } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAssessmentItems } from '../../../../../../_fetches/fetchAssessments';
import {
  onCreateTarget, onReplaceTarget, onDestroyTarget, updateAssessmentItemsManually, onCallPopup, onClosePopup,
} from '../../../../../../_actions/actions';
import { getAssessmentItems } from '../../../../../../_reducers/AssessmentsReducer';
import { IItemProps, IItemState } from './AssessmentIItem';
import deleteIcon from '../../../../../assets/delete.svg';
import reorderIcon from '../../../../../assets/reorder.svg';
import CONSTANTS from '../../../../../../_constants/constants';
import './AssessmentItem.scss';
import { checkItemsIntersection } from '../../../../../../_logic/lib';

class AssessmentItem extends PureComponent<IItemProps, IItemState> {
  private offsetX: number;

  private offsetY: number;

  constructor(props: IItemProps) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.offsetX = 0;
    this.offsetY = 0;

    this.state = {
      activeItem: null,
      isDragActive: false,
      curX: 0,
      curY: 0,
      itemWidth: 'auto',
    };
  }

  private onDragMove(e: any) {
    const { updateItemsManually, assessmentId, id } = this.props;
    const { activeItem } = this.state;
    const intersectionOrder = checkItemsIntersection(activeItem, id);

    if (intersectionOrder) {
      updateItemsManually({
        assessmentId,
        targetPlace: intersectionOrder,
      });
    }

    this.setState({
      curX: e.clientX - this.offsetX,
      curY: e.clientY - this.offsetY,
    });
  }

  private onDragStart(e: any) {
    const { updateItemsManually, order, assessmentId } = this.props;
    const item = e.target.closest('.assessment-item');

    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.onDragEnd);

    updateItemsManually({
      assessmentId,
      targetPlace: order,
    });

    this.offsetX = e.nativeEvent.offsetX;
    this.offsetY = e.nativeEvent.offsetY;

    this.setState({
      isDragActive: true,
      activeItem: item,
      curX: e.clientX - this.offsetX,
      curY: e.clientY - this.offsetY,
      itemWidth: `${item.offsetWidth}px`,
    });
  }

  private onDragEnd() {
    const { updateItemsManually, assessmentId, id } = this.props;
    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.onDragEnd);

    updateItemsManually({
      assessmentId,
      targetPlace: '-1',
      activeItemId: id,
    });

    this.addItemsToAssessment();

    this.setState({
      isDragActive: false,
      curX: 0,
      curY: 0,
      itemWidth: 'auto',
    });
  }

  addItemsToAssessment() {
    const { items, assessmentId } = this.props;
    const addUrl = CONSTANTS.updateAssessmentSet;
    const { fetchItems } = this.props;
    axios.post(addUrl, {
      assessmentId,
      setItemId: items.map((item: any) => item.itemId),
    }).then((res) => {
      const response = res.data;
      const { status } = response;
      const { data } = response;

      if (status === 'success') {
        fetchItems(assessmentId);
      } else {
        console.log(data);
      }
    });
  }

  private deleteItemFromAssessment(assessmentId: string) {
    const url = CONSTANTS.deleteItemFromAssessmentSet;
    const { id, fetchItems } = this.props;

    axios.post(url, {
      assessmentId,
      setItemId: [id],
    })
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          fetchItems(assessmentId);
        } else {
          console.log(data);
        }
      });
  }

  render() {
    const {
      title, id, order, closePopup, callPopup, assessmentId,
    } = this.props;
    const {
      curX, curY, isDragActive, itemWidth,
    } = this.state;
    const popup = {
      text: 'Do you want to delete this item?',
      btnOKListener: () => {
        closePopup();
        this.deleteItemFromAssessment(assessmentId);
      },
    };

    const itemPosition = {
      position: isDragActive ? ('fixed' as 'fixed') : ('relative' as 'relative'),
      top: `${curY}px`,
      left: `${curX}px`,
      width: `${itemWidth}`,
      zIndex: isDragActive ? 1 : 0,
    };

    return (
      <>
        <div
          className="assessment-item"
          style={itemPosition}
          id={id}
          attr-order={order}
        >
          <div
            className="drag-icon"
            aria-label="drag-icon"
            role="button"
            tabIndex={0}
            onMouseDown={this.onDragStart}
            style={{ backgroundImage: `url(${reorderIcon})` }}
          />
          <div className="item-title">{title}</div>
          <div
            role="button"
            tabIndex={0}
            className="delete-icon"
            onKeyDown={() => {
              callPopup(popup);
            }}
            onClick={() => {
              callPopup(popup);
            }}
          >
            <img src={deleteIcon} alt="delete" />
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  fetchItems: fetchAssessmentItems,
  updateItemsManually: updateAssessmentItemsManually,
  mountTarget: onCreateTarget,
  replaceTarget: onReplaceTarget,
  unmountTarget: onDestroyTarget,
  callPopup: onCallPopup,
  closePopup: onClosePopup,
}, dispatch);

const mapStateToProps = (state: any, props: {assessmentId: string}) => ({
  items: getAssessmentItems(state, props.assessmentId),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentItem);
