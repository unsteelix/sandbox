import React, { PureComponent } from 'react';
import key from 'weak-key';
import { IWidgetProps, IWidgetState } from './IWidget';
import Text from '../Text/Text';
import Divider from '../Divider/Divider';
import './Widget.scss';
import MC from './MC/MC';
import Button from '../Button/Button';

export default class Widget extends PureComponent<IWidgetProps, IWidgetState> {
  static checkType(data: any) {
    const { type, value } = data;
    let component;

    switch (type) {
      case 'text':
        component = <Text key={key(data)} data={value} />;
        break;
      case 'divider':
        component = <Divider key={key(data)} />;
        break;
      case 'widget': {
        const { type: widgetType } = value;
        switch (widgetType) {
          case 'mc':
            component = <MC key={key(value)} data={value} />;
            break;
          case 'text':
            console.log('text');
            break;
          default:
            break;
        }
        break;
      }
      default:
        break;
    }

    return component;
  }

  constructor(props: IWidgetProps) {
    super(props);

    this.state = {
      // checked: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    console.log(this.state);
  }

  render() {
    const { data } = this.props;

    return (
      <>
        {
          data.units.map((value: object) => Widget.checkType(value))
        }
        <Button addClass="submitBtn" color="green" listener={this.onSubmit} btnText="SUBMIT" />
      </>
    );
  }
}
