import React from 'react';
import moment from 'moment';
import { toLocale } from '_src/locale/react-locale';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { crypto } from '@omchain/javascript-sdk';
import { Dialog } from '_component/Dialog';
import Menu from '_src/component/Menu';
import util from '_src/utils/util';
import Icon from '_src/component/IconLite';
import { withRouter, NavLink } from 'react-router-dom';
import PageURL from '_constants/PageURL';
import Config from '_constants/Config';
import PassWordDialog from '_component/PasswordDialog';
import * as CommonAction from '../../redux/actions/CommonAction';
import WalletMenuTool from './WalletMenuTool';

// import LinesEllipsis from 'react-lines-ellipsis';

import './index.less';

const SubMenu = Menu.SubMenu;
const IconFountUnfold = () => { return <Icon className="icon-Unfold" style={{ fontSize: '14px', marginLeft: '6px' }} />; };


function mapStateToProps(state) { // 绑定redux中相关state
  const { privateKey } = state.Common;
  return {
    privateKey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch)
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class DexLoggedMenu extends React.Component {
  state = {
    isShowPassword: false,
    passwordError: '',
  };
  // 下载keyStore 显示输入密码窗口
  handleDownKeyStore = () => {
    this.setState({
      isShowPassword: true, passwordError: ''
    });
  };
  // Dailog Down KeyStore Core function
  downKeyStoreCore = (passValue) => {
    // 2019-08-13 增加用户清空全部缓存的判断
    if (!util.isLogined()) {
      window.location.reload();
    }

    const keyStoreName = `keystore_${moment().format('YYYY-MM-DD HH:mm:ss')}`;
    const User = window.localStorage.getItem('dex_user');
    if (User) {
      try {
        const UserObj = JSON.parse(User);
        const { info: keyStore } = UserObj;
        const privateKey = crypto.getPrivateKeyFromKeyStore(keyStore, passValue);
        if (privateKey) {
          util.downloadObjectAsJson(keyStore || '', keyStoreName);
          this.setState({ isShowPassword: false, passwordError: '' });
        }
      } catch (e) {
        this.setState({ isShowPassword: true, passwordError: toLocale('pwd_error') });
      }
    }
  };
  // 下载KeyStore时，取消输入密码
  handleClosePassWordDialog = () => {
    this.setState({
      isShowPassword: false
    });
  };

  // 退出登录
  handleLogOut = () => {
    const dialog = Dialog.confirm({
      title: toLocale('header_menu_logout1'),
      confirmText: toLocale('ensure'),
      cancelText: toLocale('cancel'),
      theme: 'dark',
      dialogId: 'omdex-logout',
      windowStyle: {
        background: '#112F62'
      },
      onConfirm: () => {
        util.doLogout();
        dialog.destroy();
        window.location.reload();
      },
    });
  };
  render() {
    const { isShowPassword, passwordError } = this.state;
    let addr = '';
    try {
      const user = JSON.parse(window.localStorage.getItem('dex_user'));
      addr = user ? user.addr : '';
    } catch (e) {
      console.warn(e);
    }
    return (
      <React.Fragment>
        <PassWordDialog
          isShow={isShowPassword}
          onEnter={this.downKeyStoreCore}
          warning={passwordError}
          updateWarning={(err) => { this.setState({ passwordError: err }); }}
          onClose={this.handleClosePassWordDialog}
        />
        <Menu
          mode="horizontal"
          selectable={false}
          className="omdex-menu"
        >
          {/*
          <Menu.Item key="trade" >
            <NavLink to={PageURL.spotFullPage} activeClassName="active-menu-item" >{toLocale('header_menu_trade')}</NavLink>
          </Menu.Item>
          */}
          <SubMenu
            key="wallet"
            title={
              <React.Fragment>{toLocale('header_menu_wallet')}<IconFountUnfold /></React.Fragment>
            }
          >
            <Menu.Item key="wallet-1" style={{ height: 'auto', cursor: 'default' }}>
              <WalletMenuTool address={addr} />
            </Menu.Item>
            <Menu.Item key="wallet-2">
              <NavLink to={PageURL.walletAssets} activeClassName="active-menu-item" >{toLocale('header_menu_assets')}</NavLink>
            </Menu.Item>
            <Menu.Item key="wallet-3" onClick={this.handleDownKeyStore}>
              {toLocale('header_menu_down_keystore')}
            </Menu.Item>
            <Menu.Item key="wallet-4" onClick={this.handleLogOut} >{toLocale('header_menu_logout')}</Menu.Item>
          </SubMenu>
          <SubMenu
            key="order"
            title={
              <React.Fragment>{toLocale('header_menu_order')}<IconFountUnfold /></React.Fragment>
            }
          >
            <Menu.Item key="order-1">
              <NavLink to={PageURL.spotOpenPage} activeClassName="active-menu-item" >{toLocale('header_menu_current_entrust')}</NavLink>
            </Menu.Item>
            <Menu.Item key="order-2">
              <NavLink to={PageURL.spotHistoryPage} activeClassName="active-menu-item" >{toLocale('header_menu_history_entrust')}</NavLink>
            </Menu.Item>
            <Menu.Item key="order-3">
              <NavLink to={PageURL.spotDealsPage} activeClassName="active-menu-item" >{toLocale('header_menu_deal_entrust')}</NavLink>
            </Menu.Item>
          </SubMenu>
          {/*
          <Menu.Item key="omChain" >
            <a target="_blank" rel="noopener noreferrer" href={Config.omchain.browserUrl}>{toLocale('header_menu_explorer_omchain')}</a>
          </Menu.Item>
          */}
        </Menu>
      </React.Fragment>
    );
  }
}

export default DexLoggedMenu;
