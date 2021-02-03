import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toLocale } from '_src/locale/react-locale';
import { Button } from '_component/Button';
import Icon from '_src/component/IconLite';
import { Dialog } from '_component/Dialog';
import WalletLeft from '_component/WalletLeft';
import WalletRight from '_component/WalletRight';
import PageURL from '_constants/PageURL';
import * as commonActions from '_src/redux/actions/CommonAction';
import questionGenerator from './questionGenerator';
import walletUtil from './walletUtil';
import './Step.less';
import './Step4.less';

function mapStateToProps(state) {
  const { mnemonic, keyStore, privateKey } = state.WalletStore;
  return { mnemonic, keyStore, privateKey };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(commonActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class Step4 extends Component {
  constructor(props) {
    super(props);
    this.questions = questionGenerator.getQuestions(props.mnemonic);
  }
  componentDidMount() {
    const { keyStore, privateKey } = this.props;
    walletUtil.setUserInSessionStroage(privateKey, keyStore);
    this.props.commonAction.setPrivateKey(privateKey);
  }
  selectOption = (questionNo, selectedIndex) => {
    return () => {
      const { selectArr } = this.state;
      const selectArrTemp = [...selectArr];
      selectArrTemp[questionNo] = selectedIndex;
      this.setState({
        selectArr: selectArrTemp
      });
    };
  }
  showPrivate = () => {
    this.privateDialog = Dialog.show({
      windowStyle: { backgroundColor: '#112F62' },
      children: this.renderPrivateDialog(),
    });
  }
  hidePrivate = () => {
    this.privateDialog.destroy();
  }
  handleCopy = () => {
    this.privateDialog.update({
      children: this.renderPrivateDialog(true),
    });
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => {
      this.privateDialog.update({
        children: this.renderPrivateDialog(false),
      });
    }, 1000);
  }
  onRedirctToTradePage = () => {
    const { privateKey } = this.props;
    return () => {
      // console.log('step4 click next');
      this.props.commonAction.setPrivateKey(privateKey);
      this.props.history.push(PageURL.spotFullPage);
    };
  }
  renderPrivateDialog = (copySuccess = false) => {
    const { privateKey } = this.props;
    return (
      <div className="private-container">
        <div className="private-title">
          {toLocale('wallet_privateKey')}
        </div>
        <Icon className="icon-icon_successfuzhi" isColor style={{ width: 60, height: 60, marginBottom: 30 }} />
        <div className="private-content">
          <span id="omdex-wallet-private-key">{privateKey}</span>
          <span data-clipboard-target="#omdex-wallet-private-key">
            <CopyToClipboard text={privateKey} onCopy={this.handleCopy}>
              <Icon
                className={copySuccess ? 'icon-icon_success' : 'icon-icon_copy'}
                isColor
                style={{ width: 14, height: 14, cursor: 'pointer' }}
              />
            </CopyToClipboard>
          </span>
        </div>
        {/* <div className="private-success-tip">{successTip}</div> */}
        <Button type="primary" onClick={this.hidePrivate}>
          {toLocale('wallet_ensure')}
        </Button>
      </div>
    );
  };
  render() {
    return (
      <div>
        <div className="create-wallet-step3 wallet-step-dialog">
          <WalletLeft
            stepNo={3}
            stepName={toLocale('wallet_create_step4')}
            imgUrl="https://static.bafang.com/cdn/assets/imgs/MjAxOTQ/355F3AD5BD296D7EEA40263B0F98E4F3.png"
          />
          <WalletRight>
            <div className="validate-success-container">
              <Icon className="icon-icon_success" isColor style={{ width: 60, height: 60 }} />
              <div className="validate-success-text">
                {toLocale('wallet_mnemonicSuccess')}
              </div>
              <div className="next-row">
                <Button type="primary" onClick={this.onRedirctToTradePage()}>{toLocale('wallet_toTrade')}</Button>
                <div className="see-private" onClick={this.showPrivate}>{toLocale('wallet_seePrivate')}</div>
              </div>
            </div>
          </WalletRight>
        </div>
      </div>
    );
  }
}

export default Step4;
