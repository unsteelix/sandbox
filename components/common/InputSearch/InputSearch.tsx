import React, { PureComponent } from 'react';
import { IInputSearchProps, IInputSearchState } from './IInputSearch';
import searchIcon from '../../assets/search.svg';
import './InputSearch.scss';

export default class InputSearch extends PureComponent<IInputSearchProps, IInputSearchState> {
  constructor(props: IInputSearchProps) {
    super(props);

    const { inputText } = props;

    this.state = {
      inputText: inputText === undefined ? '' : inputText,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e: any) {
    const { inputText } = this.state;
    const { data } = e.nativeEvent;

    this.setState({
      inputText: inputText + data,
    });
  }


  render() {
    const { inputText } = this.state;
    const { placeholder } = this.props;

    return (
      <div className="search-input">
        <input placeholder={placeholder} onChange={this.onChange} type="text" value={inputText} />
        <div className="search-icon" style={{ backgroundImage: `url(${searchIcon})` }} />
      </div>
    );
  }
}
