import React, { PureComponent } from 'react';
import key from 'weak-key';
import { IMCProps, IMCState } from './IMC';
import './MC.scss';

const shuffleArray = (arr: any) => arr
  .map((a: any) => [Math.random(), a])
  .sort((a: number[], b: number[]) => a[0] - b[0])
  .map((a: any[]) => a[1]);

export default class MC extends PureComponent<IMCProps, IMCState> {
  constructor(props: IMCProps) {
    super(props);

    this.state = {
      // checked: '',
    };
  }


  render() {
    const { data } = this.props;
    const { subtype } = data;

    if (data.randomOrder) {
      data.choices = shuffleArray(data.choices);
    }

    return (
      <div className="widget">
        {data.choices.map((value: any) => {
          if (subtype === 'checkbox') {
            return (
              <div key={key(value)}>
                <input type="checkbox" id={`${value.value}${value.name}`} />
                <label htmlFor={`${value.value}${value.name}`}>{value.display}</label>
              </div>
            );
          }
          return (
            <div key={key(value)}>
              <input type="radio" id={value.value} name={value.display} />
              <label htmlFor={value.value}>{value.display}</label>
            </div>
          );
        })}
      </div>
    );
  }
}
