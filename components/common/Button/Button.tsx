import React, { PureComponent } from 'react';
import { BtnProps, BtnState } from './IButton';
import prevIcon from '../../assets/iconPrev.svg';
import nextIcon from '../../assets/iconNext.svg';
import './Button.scss';

export default class Button extends PureComponent<BtnProps, BtnState> {
  constructor(props: BtnProps) {
    super(props);

    this.state = {

    };
  }


  render() {
    const {
      btnText, listener, color, addClass, iconPrev, iconNext,
    } = this.props;

    return (
      <div role="button" tabIndex={0} className={`btn-comp ${color || ''} ${addClass || ''}`} onKeyPress={listener} onClick={listener}>
        <div className="btn-content">
          {iconPrev ? <img alt="Prev" className="prevIcon" src={prevIcon} /> : ''}
          <div className="btn-text">{btnText}</div>
          {iconNext ? <img alt="Next" className="nextIcon" src={nextIcon} /> : ''}
        </div>
      </div>
    );
  }
}
