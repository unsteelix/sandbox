import React, { PureComponent } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IItemSceneProps, IItemSceneState } from './IItemScene';
import closeIcon from '../../assets/close.svg';
import DD from '../../assets/DD.svg';
import FITB from '../../assets/FITB.svg';
import ESSAY from '../../assets/ESSAY.svg';
import MC from '../../assets/MC.svg';
import SC from '../../assets/SC.svg';
import sampleMC from './Sample_MC';
import sampleSC from './Sample_SC';
import sampleDD from './Sample_DD';
import sampleFITB from './Sample_FITB';
import sampleESSAY from './Sample_ESSAY';
import Button from '../../common/Button/Button';
import itemsJSON from '../../../assets/test_data_items';
import './ItemScene.scss';
import { getItemIdFromCurrentUrl, getSandboxIdFromCurrentUrl } from '../../../_logic/utils';
import CONSTANTS from '../../../_constants/constants';
import { onCallPopup, onClosePopup } from '../../../_actions/actions';

class ItemScene extends PureComponent<IItemSceneProps, IItemSceneState> {
  constructor(props: IItemSceneProps) {
    super(props);

    this.onSave = this.onSave.bind(this);
    this.onSaveAsNew = this.onSaveAsNew.bind(this);
    this.onRender = this.onRender.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.insertSample = this.insertSample.bind(this);

    this.state = {
      currentJSON: itemsJSON,
      itemName: '',
      renderJSON: 'Please press the Render Button',
    };
  }

  componentDidMount() {
    // search itemId in pathname
    const itemId = getItemIdFromCurrentUrl();
    const { callPopup } = this.props;
    if (itemId) {
      const url = CONSTANTS.getItemByIdUrl(itemId);
      axios.get(url)
        .then((res) => {
          const response = res.data;
          const { status } = response;
          const { data } = response;

          if (status === 'success') {
            const item = data;

            this.setState({
              currentJSON: item,
              itemName: item.title,
            });
          } else {
            const popup = {
              text: data[1].data,
            };
            callPopup(popup);
          }
        });
    } else {
      const popup = {
        text: 'Error: itemId in pathname not found',
      };
      callPopup(popup);
    }
  }

  onSave() {
    const url = CONSTANTS.updateItemUrl;
    const sandboxId = getSandboxIdFromCurrentUrl();
    const { currentJSON } = this.state;
    const { callPopup } = this.props;
    const item = currentJSON;

    axios.post(url, {
      sandboxId,
      item,
    })
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          console.log(data);
        } else {
          const popup = {
            text: data[1].data,
          };
          callPopup(popup);
        }
      });
  }

  onSaveAsNew() {
    const sandboxId = getSandboxIdFromCurrentUrl();
    const url = CONSTANTS.addItemUrl;
    const { currentJSON } = this.state;
    const { callPopup } = this.props;

    // add item to [SS]
    axios.post(url, {
      sandboxId,
      item: {
        title: currentJSON.title,
        units: currentJSON.units,
        correct: currentJSON.correct,
      },
    })
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          console.log(data.json);
        } else {
          const popup = {
            text: data[1].data,
          };
          callPopup(popup);
        }
      });
  }

  onRender() {
    const { currentJSON } = this.state;
    const { callPopup } = this.props;
    if (currentJSON === undefined) {
      alert('Please, use correct JSON');
      return;
    }

    // render item
    const url = CONSTANTS.getHtmlByItemUrl;
    axios.post(url, currentJSON)
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          const { html } = data;
          const { json } = data;

          this.setState({
            currentJSON: json, // TODO: maybe not update source json
            renderJSON: html,
          });
        } else {
          const popup = {
            text: data[1].data,
          };
          callPopup(popup);
        }
      });
  }

  onChange(editorObj: any) {
    const { itemName } = this.state;

    this.setState({
      currentJSON: editorObj.jsObject,
      itemName: editorObj.jsObject !== undefined ? editorObj.jsObject.title : itemName,
    });
  }

  onTitleChange(e: any) {
    const { currentJSON } = this.state;

    this.setState({
      currentJSON: {
        ...currentJSON,
        title: e.nativeEvent.target.value,
      },
      itemName: e.nativeEvent.target.value,
    });
  }

  itemPreview() {
    const { renderJSON } = this.state;
    return <div dangerouslySetInnerHTML={{ __html: renderJSON }} />;
  }

  insertSample(type: string = '') {
    const { currentJSON } = this.state;
    const currentJSONCopy = JSON.parse(JSON.stringify(currentJSON));
    let sampleItem;

    switch (type) {
      case 'MC': {
        sampleItem = sampleMC;
        break;
      }
      case 'SC': {
        sampleItem = sampleSC;
        break;
      }
      case 'DD': {
        sampleItem = sampleDD;
        break;
      }
      case 'ESSAY': {
        sampleItem = sampleESSAY;
        break;
      }
      case 'FITB': {
        sampleItem = sampleFITB;
        break;
      }
      default:
        sampleItem = {};
    }

    const sampleItemUnits = sampleItem.units;
    if (sampleItemUnits) {
      for (let i = 0; i < sampleItemUnits.length; i += 1) {
        currentJSONCopy.units.push(sampleItemUnits[i]);
      }
    }

    this.setState({
      currentJSON: currentJSONCopy,
    }, () => {
      // todo rewrite this for the scroll to bottom
      const JSONEditorField = document.querySelector('#a_unique_id');
      if (JSONEditorField) {
        JSONEditorField.scroll(0, JSONEditorField.scrollHeight);
      }
    });
  }

  render() {
    const { currentJSON, itemName } = this.state;
    // todo rewrite sample detection
    const isSample = window.location.search === '?sample';

    return (
      <div className="item-scene">
        <div className="left">
          <div className="header">
            ITEM SOURCE EDITOR
          </div>
          <input className="title" value={itemName} onChange={this.onTitleChange} />
          <div className="templates-row">
            Paste code from template
            <div
              className="template-icon"
              role="button"
              onClick={() => { this.insertSample('SC'); }}
              onKeyPress={() => { this.insertSample('SC'); }}
              tabIndex={0}
            >
              <img alt="" src={SC} />
            </div>
            <div
              className="template-icon"
              role="button"
              onClick={() => { this.insertSample('MC'); }}
              onKeyPress={() => { this.insertSample('MC'); }}
              tabIndex={0}
            >
              <img alt="" src={MC} />
            </div>
            <div
              className="template-icon"
              role="button"
              onClick={() => { this.insertSample('DD'); }}
              onKeyPress={() => { this.insertSample('DD'); }}
              tabIndex={0}
            >
              <img alt="" src={DD} />
            </div>
            <div
              className="template-icon"
              role="button"
              onClick={() => { this.insertSample('ESSAY'); }}
              onKeyPress={() => { this.insertSample('ESSAY'); }}
              tabIndex={0}
            >
              <img alt="" src={ESSAY} />
            </div>
            <div
              className="template-icon"
              role="button"
              onClick={() => { this.insertSample('FITB'); }}
              onKeyPress={() => { this.insertSample('FITB'); }}
              tabIndex={0}
            >
              <img
                style={{ paddingLeft: '1px' }}
                alt=""
                src={FITB}
              />
            </div>
          </div>
          <div className="item-editor-container">
            <JSONInput
              id="a_unique_id"
              placeholder={currentJSON}
              locale={locale}
              width="100%"
              waitAfterKeyPress={10000}
              onChange={this.onChange}
            />
          </div>
          <div className="buttons-row">
            <Button listener={this.onSaveAsNew} btnText="SAVE AS NEW" />
            {!isSample ? <Button listener={this.onSave} btnText="UPDATE" /> : ''}
            <Button color="green" listener={this.onRender} btnText="RENDER" />
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
            { this.itemPreview() }
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  callPopup: onCallPopup,
  closePopup: onClosePopup,
}, dispatch);

export default connect(null, mapDispatchToProps)(ItemScene);
