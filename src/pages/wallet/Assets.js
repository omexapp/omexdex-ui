import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CommonActions from '_src/redux/actions/CommonAction';
import PageURL from '_src/constants/PageURL';
import DexTab from '_component/DexTab';
import WalletAddress from '_component/WalletAddress';
import AssetsAccounts from './AssetsAccounts';
import AssetsTransactions from './AssetsTransactions';
import assetsUtil from './assetsUtil';
import './Assets.less';


function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    commonActions: bindActionCreators(CommonActions, dispatch),
  };
}

/* eslint-disable react/sort-comp, no-nested-ternary */
@connect(mapStateToProps, mapDispatchToProps)
class Assets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      copySuccess: false,
    };
    this.isAssets = this.props.location.pathname === PageURL.walletAssets;
    if (!window.OM_GLOBAL.senderAddr) {
      this.props.history.replace(PageURL.walletImport);
    }
  }
  componentDidMount() {}
  onChangeTab = (current) => {
    return () => {
      if (this.state.loading) return;
      this.props.history.replace(current === 1 ? PageURL.walletAssets : PageURL.walletTransactions);
      if ((current === 1 && this.isAssets) || (current === 2 && !this.isAssets)) {
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false });
        }, 100);
      }
    };
  };
  onCopy = () => {
    if (this.state.copySuccess) return;
    this.setState({ copySuccess: true });
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => {
      this.setState({ copySuccess: false });
    }, 1000);
  };
  render() {
    const { loading } = this.state;
    return (
      <div className="wallet-main">
        <WalletAddress />
        <DexTab tabs={assetsUtil.tabs} current={this.isAssets ? 1 : 2} onChangeTab={this.onChangeTab} />
        {
          loading ? null : (this.isAssets ? <AssetsAccounts /> : <AssetsTransactions />)
        }
      </div>
    );
  }
}

export default Assets;
