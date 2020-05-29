import React, { PureComponent } from 'react';
import './Popup.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IPopupProps, IPopupState } from './IPopup';
import { getPopupItems, getPopupState } from '../../../_reducers/MainPageReducer';
import { onClosePopup } from '../../../_actions/actions';
import Button from '../Button/Button';

class Popup extends PureComponent<IPopupProps, IPopupState> {
  constructor(props: IPopupProps) {
    super(props);

    this.state = {
      // checked: '',
    };
  }


  render() {
    const {
      text, btnOK, btnCancel, btnOKListener,
      btnCancelListener, isPopupActive,
      closePopup,
    } = this.props;
    const cancelListener = btnCancelListener === null ? closePopup : btnCancelListener;
    const okListener = btnOKListener === null ? closePopup : btnOKListener;

    return isPopupActive ? (
      <div className="popup">
        <div className="text">{text}</div>
        <div className="btn-line">
          <Button
            color="blue"
            btnText={btnCancel || 'Cancel'}
            listener={
              () => { cancelListener(); }
            }
          />
          <Button
            color="blue-border"
            btnText={btnOK || 'OK'}
            listener={
              () => { okListener(); }
            }
          />
        </div>
      </div>
    ) : (<></>);
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  closePopup: onClosePopup,
}, dispatch);

const mapStateToProps = (state: any) => {
  const {
    text,
    btnOK,
    btnCancel,
    btnOKListener,
    btnCancelListener,
  } = getPopupItems(state);
  return {
    isPopupActive: getPopupState(state),
    text,
    btnOK,
    btnCancel,
    btnOKListener,
    btnCancelListener,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
