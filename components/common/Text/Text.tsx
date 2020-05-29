import React from 'react';
import { ITextProps } from './IText';
import './Text.scss';

const Text = (props: ITextProps) => {
  const { data } = props;
  const { text, color } = data;
  return (
    <div style={{ color }}>{text}</div>
  );
};

export default Text;
