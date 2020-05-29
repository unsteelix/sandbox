import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IAsmtProps, IAsmtState } from './IAssessment';
import CONSTANTS from '../../../../../_constants/constants';
import Button from '../../../../common/Button/Button';
import chevron from '../../../../assets/chevron.svg';
import deleteIcon from '../../../../assets/delete.svg';
import './Assessment.scss';
import AssessmentItem from './AssessmentItems/AssessmentItem';
import { fetchAssessmentItems } from '../../../../../_fetches/fetchAssessments';
import { getPlaceId } from '../../../../../_reducers/MainPageReducer';
import {
  getAssessmentItems,
  getAssessmentItemsError,
  getAssessmentItemsPending,
  getAssessmentTitle,
} from '../../../../../_reducers/AssessmentsReducer';
import { onCallPopup, onClosePopup } from '../../../../../_actions/actions';

class Assessment extends PureComponent <IAsmtProps, IAsmtState> {
  private timer:number;

  constructor(props: IAsmtProps) {
    super(props);
    const {
      fetchItems, id,
    } = this.props;

    fetchItems(id);

    this.state = {
      collapsed: true,
      assessmentTitle: '',
    };

    this.onExpand = this.onExpand.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSaveAsNew = this.onSaveAsNew.bind(this);
    this.onRender = this.onRender.bind(this);

    this.timer = 0;
  }

  componentDidMount() {

  }

  onExpand() {
    const { collapsed } = this.state;
    const { fetchItems, id, title } = this.props;

    if (collapsed) {
      fetchItems(id);
    }

    this.setState({
      collapsed: !collapsed,
      assessmentTitle: title,
    });
  }

  onSave() {
    const url = CONSTANTS.updateTitleAssessment;
    const { fetchItems, id, callPopup } = this.props;
    const { assessmentTitle } = this.state;

    axios.post(url, {
      assessmentId: id,
      title: assessmentTitle,
    }).then((res) => {
      const response = res.data;
      const { status } = response;
      const { data } = response;

      if (status === 'success') {
        fetchItems(id);
      } else {
        const popup = {
          text: data[1].data,
        };
        callPopup(popup);
      }
    });
  }

  onSaveAsNew() {
    console.log(this.state);
  }

  onRender() {
    console.log(this.state);
  }

  onChange(e: any) {
    this.setState({
      assessmentTitle: e.nativeEvent.target.value,
    });
  }

  collapsedAssessment() {
    const { title } = this.props;

    return (
      <div className="asmt-item collapsed">
        <div
          className="asmt-item-header"
          role="button"
          tabIndex={0}
          onKeyPress={this.onExpand}
          onClick={this.onExpand}
        >
          <div className="title">{title}</div>
          <div className="expand-btn">
            <img alt="expand" src={chevron} />
          </div>
        </div>
      </div>
    );
  }

  deleteAssessmentButton(id: string) {
    // const {
    //   fetchItems,
    // } = this.props;
    const url = CONSTANTS.deleteAssessmentUrl;
    const { callPopup } = this.props;

    // delete assessment from [SS]
    axios.post(url, {
      id,
    })
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          // Todo change it to redux storage
          // fetchItems(id);
          window.location.reload();
        } else {
          const popup = {
            text: data[1].data,
          };
          callPopup(popup);
        }
      });
  }

  expandedAssessment() {
    const {
      id, items, title, closePopup, callPopup,
    } = this.props;
    const { assessmentTitle } = this.state;
    const popup = {
      text: 'Do you want to delete this assessment?',
      btnOKListener: () => {
        closePopup();
        this.deleteAssessmentButton(id);
      },
    };

    return (
      <div className="asmt-item expanded">
        <div className="asmt-item-header" role="button" tabIndex={0} onKeyPress={this.onExpand} onClick={this.onExpand}>
          <div className="title">{ title }</div>
          <div className="collapsed-btn">
            <img alt="collapse" src={chevron} />
          </div>
        </div>
        <div className="asmt-content-container">
          <input onChange={this.onChange} value={assessmentTitle} />
          <div className="drag-and-drop" id={id}>
            {items !== undefined
              ? items.map((item: any, i) => {
                if (item === 'target') {
                  return (
                    <div
                      key={`target${id}`}
                      style={{
                        height: '40px',
                        border: '1px dotted black',
                        marginBottom: '10px',
                      }}
                    />
                  );
                }
                return (
                  <AssessmentItem
                    id={item.itemId}
                    assessmentId={id}
                    title={item.title || item.itemId}
                    key={`${item.itemId}`}
                    order={i}
                  />
                );
              }) : 'Drag and drop items from the right to fill in assessment'}
          </div>
          <div className="buttons-row">
            {/* <Button listener={this.onSaveAsNew} btnText="SAVE AS NEW" /> */}
            <Link to={`${window.location.pathname}/assessment/${id}`}>
              <Button color="green" listener={this.onRender} btnText="RENDER" />
            </Link>
            <Button listener={this.onSave} color={title !== assessmentTitle ? '' : 'gray'} btnText="SAVE" />
            <div
              role="button"
              tabIndex={0}
              className="delete-icon"
              onKeyDown={() => { callPopup(popup); }}
              onClick={() => {
                callPopup(popup);
              }}
            >
              <img alt="delete" src={deleteIcon} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { collapsed } = this.state;
    // const { title } = this.props;

    return (
      <>
        {collapsed ? this.collapsedAssessment() : this.expandedAssessment()}
      </>
    );
  }
}

const mapStateToProps = (state: any, props: any) => {
  const { id } = props;

  return {
    error: getAssessmentItemsError(state),
    items: getAssessmentItems(state, id),
    title: getAssessmentTitle(state, id),
    pending: getAssessmentItemsPending(state),
    placeId: getPlaceId(state),
  };
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  fetchItems: fetchAssessmentItems,
  callPopup: onCallPopup,
  closePopup: onClosePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Assessment);
