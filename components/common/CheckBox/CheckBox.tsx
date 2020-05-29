import React, { PureComponent } from 'react';
import { ICheckBoxProps, ICheckBoxState } from './ICheckBox';
import './CheckBox.scss';

export default class CheckBox extends PureComponent<ICheckBoxProps, ICheckBoxState> {
  constructor(props: ICheckBoxProps) {
    super(props);

    this.state = {
      // checked: '',
    };
  }


  render() {
    const { values } = this.props;

    return (
      values.map((value) => (
        <input type="checkbox" value={value} />
      ))
    );
  }
}
