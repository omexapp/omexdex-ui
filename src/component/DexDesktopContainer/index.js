import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DexHelp from '_component/DexHelp';
import WalletAddress from '_component/WalletAddress';
import PageURL from '_constants/PageURL';
import Loading from '_component/Loading';
import './index.less';

@withRouter
class DexDesktopContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { needLogin } = this.props;
    const { senderAddr } = window.OM_GLOBAL || {};
    if (needLogin && !senderAddr) {
      this.props.history.replace(PageURL.walletImport);
    }
  }

  render() {
    const { isShowHelp, isShowAddress, loading = false } = this.props;
    const { senderAddr } = window.OM_GLOBAL || {};

    return (
      <div className="dex-desktop-container">
        <Loading when={loading} />
        {
          (isShowAddress && senderAddr) && (
            <div className="dex-chain-address">
              <div className="address-main">
                <WalletAddress />
              </div>
            </div>
          )
        }
        <div className="dex-desktop-main">
          {
            isShowHelp && <DexHelp />
          }
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default DexDesktopContainer;
