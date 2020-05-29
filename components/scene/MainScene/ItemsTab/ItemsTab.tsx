import React, { PureComponent } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IItemsTabProps, IItemsTabState } from './IItemsTab';
import Button from '../../../common/Button/Button';
import Item from './Item/Item';
import InputSearch from '../../../common/InputSearch/InputSearch';
import CONSTANTS from '../../../../_constants/constants';
import { getSandboxIdFromCurrentUrl } from '../../../../_logic/utils';
import './ItemsTab.scss';
import { fetchCustomItems } from '../../../../_fetches/fetchAssessments';
import { getItems } from '../../../../_reducers/MainPageReducer';

class ItemsTab extends PureComponent <IItemsTabProps, IItemsTabState> {
  constructor(props: IItemsTabProps) {
    super(props);

    this.createItem = this.createItem.bind(this);
  }

  componentDidMount() {
    const { fetchItems } = this.props;

    fetchItems();
  }

  createItem() {
    const sandboxId = getSandboxIdFromCurrentUrl();
    const url = CONSTANTS.addItemUrl;
    const { fetchItems, callPopup } = this.props;

    // add item to [SS]
    axios.post(url, {
      sandboxId,
      item: {
        units: [],
        correct: [],
      },
    })
      .then((res) => {
        const response = res.data;
        const { status } = response;
        const { data } = response;

        if (status === 'success') {
          fetchItems();
        } else {
          const popup = {
            text: data[1].data,
          };
          callPopup(popup);
        }
      });
  }

  render() {
    const { data } = this.props;

    return (
      <>
        <div className="header">
          <div className="tab-title">Items</div>
          <div className="create-item-div">
            <Button color="blue" addClass="create-item-button" listener={this.createItem} btnText="Create Item" />
          </div>
        </div>
        <div className="items-content-container">
          <div className="search-samples">
            <InputSearch placeholder="Search items..." />
          </div>
          <div className="sample-items">
            <div style={{ margin: '15px 0' }}>Sample items</div>
            <div className="items-container">
              {data.sampleItems.map((item) => (
                <Item
                  id={item.itemId}
                  title={item.title || item.itemId}
                  key={`Sample${item.itemId}`}
                  drag
                  del={false}
                  edit
                  sample
                />
              ))}

            </div>
          </div>
          <div className="custom-items">
            <div style={{ margin: '19px 0' }}>Custom items</div>
            <div className="items-container">
              {data.customItems.map((item) => (
                <Item
                  id={item.itemId}
                  title={item.title || item.itemId}
                  key={`Custom${item.itemId}`}
                  drag
                  del
                  edit
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
  fetchItems: fetchCustomItems,
}, dispatch);

const mapStateToProps = (state: any) => ({
  data: getItems(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemsTab);
