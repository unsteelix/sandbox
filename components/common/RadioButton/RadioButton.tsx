import React, { PureComponent } from 'react';
import { IRadioBoxProps, IRadioBoxState } from './IRadioButton';
import './RadioButton.scss';

export default class RadioButton extends PureComponent<IRadioBoxProps, IRadioBoxState> {
  constructor(props: IRadioBoxProps) {
    super(props);

    this.state = {
      // checked: '',
    };
  }


  render() {
    const { values } = this.props;

    return (
      values.map((value) => (
        <input type="radio" value={value} />
      ))
    );
  }
}
