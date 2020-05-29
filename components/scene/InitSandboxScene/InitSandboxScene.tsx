import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IInitSandboxSceneProps, IInitSandboxSceneState } from './IInitSandboxScene';
import CONSTANTS from '../../../_constants/constants';
import './InitSandboxScene.scss';
import { history } from '../../../_store/coreStore';

// eslint-disable-next-line max-len
export default class InitSandboxScene extends PureComponent<IInitSandboxSceneProps, IInitSandboxSceneState> {
  constructor(props: IInitSandboxSceneProps) {
    super(props);

    this.initSandboxHandler = this.initSandboxHandler.bind(this);

    this.state = {
      sandboxId: '',
    };
  }

  componentDidMount() {

    // this.initSandboxHandler()  // TODO: maybe generate sandbox automatic (without button)
  }


  initSandboxHandler() {
    const url = CONSTANTS.initNewSandboxUrl;
    const { callPopup } = this.props;

    axios.get(url)
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          const sandboxId = data.id;
          const location = {
            pathname: `/sandbox/${sandboxId}`,
            state: { fromDashboard: true },
          };
          history.push(location);
          this.setState({
            sandboxId,
          });
          window.location.reload();
        } else {
          const popup = {
            text: data[1].data,
          };
          callPopup(popup);
        }
      });
  }


  render() {
    const { sandboxId } = this.state;

    return (
      <div className="init-sandbox-scene">
        <div className="title">
              Assessment service sandbox
        </div>
        <div
          role="button"
          tabIndex={0}
          className="init-sandbox-scene-button"
          onClick={() => this.initSandboxHandler()}
          onKeyDown={() => this.initSandboxHandler()}
        >
            START
        </div>
        {sandboxId ? (
          <div className="">
            <Link to={`/sandbox/${sandboxId}`}>
                link
            </Link>
          </div>
        )
          : ''}
      </div>
    );
  }
}
