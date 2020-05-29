import React, { PureComponent } from 'react';
import { IMainSceneProps, IMainSceneState } from './IMainScene';
import './MainScene.scss';
import AssessmentTab from './AssessmentTab/AssessmentTab';
import ItemsTab from './ItemsTab/ItemsTab';

export default class MainScene extends PureComponent<IMainSceneProps, IMainSceneState> {
  render() {
    return (
      <div className="main-scene">
        <div className="left">
          <AssessmentTab />
        </div>
        <div className="right">
          <ItemsTab />
        </div>
      </div>
    );
  }
}
