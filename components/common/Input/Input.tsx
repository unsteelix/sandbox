import React, { PureComponent } from 'react';
import { InputProps, InputState } from './IInput';
import './Input.scss';

export default class Input extends PureComponent<InputProps, InputState> {
    private timer: number;

    constructor(props: InputProps) {
      super(props);

      const { inputText } = props;

      this.state = {
        inputText,
      };

      this.onChange = this.onChange.bind(this);
      this.timer = 0;
    }

    onChange(e: any) {
      this.setState({
        inputText: e.nativeEvent.target.value,
      });
    }


    render() {
      const { inputText } = this.state;

      return (
        <input onChange={this.onChange} value={inputText} />
      );
    }
}
