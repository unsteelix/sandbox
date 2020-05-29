import React, { PureComponent } from 'react';
import axios from 'axios';
import { IAsmtTabProps, IAsmtTabState } from './IAssessmentTab';
import Assessment from './Assessment/Assessment';
import CONSTANTS from '../../../../_constants/constants';
import { getSandboxIdFromCurrentUrl } from '../../../../_logic/utils';
import './AssessmentTab.scss';

export default class AssessmentTab extends PureComponent <IAsmtTabProps, IAsmtTabState> {
  constructor(props: IAsmtTabProps) {
    super(props);

    this.addAssessmentButton = this.addAssessmentButton.bind(this);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // get data from [SS]

    // search sandboxId in pathname
    const sandboxId = getSandboxIdFromCurrentUrl();
    if (sandboxId) {
      const url = CONSTANTS.getAssessmentsBySandboxIdUrl(sandboxId);

      axios.get(url)
        .then((res) => {
          const response = res.data;
          const { status } = response;
          const { data } = response;

          if (status === 'success') {
            this.setState({
              data,
            });
          } else {
            console.log(data);
          }
        });
    } else {
      console.error('Error: sandboxId in pathname not found');
    }
  }

  addAssessmentButton() {
    const url = CONSTANTS.addAssessmentUrl;
    const sandboxId = getSandboxIdFromCurrentUrl();
    const title = 'new assessment';

    axios.post(url, {
      sandboxId,
      title,
    })
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          const assessment = data;

          this.setState((state) => ({ data: [...state.data, assessment] }));
        } else {
          console.log(data);
        }
      });
  }

  render() {
    const { data } = this.state;

    return (
      <>
        <div className="header">
          <div className="tab-title">Assessments</div>
          <div
            role="button"
            tabIndex={0}
            className="add-asmt-button"
            onKeyDown={this.addAssessmentButton}
            onClick={this.addAssessmentButton}
          >
            + Add Assessment
          </div>
        </div>
        <div className="asmt-container">
          {data.map((assessment: any) => (
            <Assessment id={assessment.id} key={assessment.id} />
          ))}
        </div>
      </>
    );
  }
}
