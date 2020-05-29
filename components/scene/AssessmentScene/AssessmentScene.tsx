import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../../common/Button/Button';
import closeIcon from '../../assets/close.svg';
import { IAsmtSceneProps, IAsmtSceneState } from './IAssessmentScene';
import CONSTANTS from '../../../_constants/constants';
import './AssessmentScene.scss';
import {
  getAssessmentIdFromCurrentUrl, getSessionIdFromCurrentUrl, getSandboxIdFromCurrentUrl,
} from '../../../_logic/utils';

import { history } from '../../../_store/coreStore';

export default class AssessmentScene extends PureComponent<IAsmtSceneProps, IAsmtSceneState> {
  constructor(props: IAsmtSceneProps) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);

    this.state = {
      assessment: {
        assessmentId: '',
        title: '',
        items: [],
      },
      html: '',
    };
  }

  componentDidMount() {
    // достаем из [SS] assessment для списка его item`ов
    const assessmentId = getAssessmentIdFromCurrentUrl();
    console.log(assessmentId);
    if (assessmentId) {
      const url = CONSTANTS.getAssessmentByIdUrl(assessmentId);
      axios.get(url)
        .then((res) => {
          const response = res.data;
          const { status } = response;
          const { data } = response;

          if (status === 'success') {
            this.setState({
              assessment: data,
            });
          } else {
            console.error(data);
          }
        });
    }


    // прверяем sessionId в URL`е
    const sessionId = getSessionIdFromCurrentUrl();

    if (sessionId) { // достаем из [SS] текущую сессию
      const url = CONSTANTS.getSessionHtmlByIdUrl(sessionId);
      axios.get(url)
        .then((res) => {
          const response = res.data;
          const { status } = response;
          const { data } = response;

          if (status === 'success') {
            this.setState({
              html: data,
            });
          } else {
            console.error(data);
          }
        });
    } else {
      // TODO: может быть автоматически сгенерировать новую сессию и сделать редирект
    }
  }


  // генерируем новую сессию и обновляем html
  onUpdate() {
    const { assessment } = this.state;

    // render item
    const url = CONSTANTS.addSessionUrl;
    const sandboxId = getSandboxIdFromCurrentUrl();

    axios.post(url, {
      assessmentId: assessment.assessmentId,
      userId: sandboxId,
    })
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          const sessionId = data.id;

          // redirect to page with sessionId
          const curPath = window.location.pathname;
          const location = {
            pathname: `${curPath}?sessionid=${sessionId}`,
            state: { fromDashboard: true },
          };
          history.push(location);
          window.location.reload();
        } else {
          console.error(data);
        }
      });
  }

  assessmentPreview() {
    const { html } = this.state;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  render() {
    const { assessment } = this.state;
    const title = assessment.title ? assessment.title : '';
    const items = 'items' in assessment && assessment.items ? assessment.items : [];

    const listItem = items.map((item: any) => (
      <div className="one-item" key={item.itemId}>
        <div className="blue-part" />
        <div className="title">{item.title}</div>
      </div>
    ));

    return (
      <div className="assessment-scene">
        <div className="left">
          <div className="header">
            ASSESSMENT RENDER
          </div>
          <div className="assessment-block">
            <div className="assessment-title">{title}</div>
            <div className="assessment-items">
              <div className="list-item">
                {listItem}
              </div>
            </div>
          </div>
          <div className="buttons-row">
            <div className="new-session-button">
              <Button color="green" listener={this.onUpdate} btnText="New session" />
            </div>
          </div>
        </div>
        <div className="right">
          <Link to={`/sandbox/${getSandboxIdFromCurrentUrl()}`} className="close-btn">
            <div>Close</div>
            <img alt="close" src={closeIcon} />
          </Link>
          <div className="header">
            PREVIEW
          </div>
          <div className="item-render-container">
            { this.assessmentPreview() }
          </div>
        </div>
      </div>
    );
  }
}
