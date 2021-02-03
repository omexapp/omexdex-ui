import React from 'react';
import { connect } from 'react-redux';
import Enum from '../../utils/Enum';
import util from '../../utils/util';

// 全屏交易独立组件
import FullTradeHead from './FullTradeHead';
import FullTradeData from './FullTradeData';

import SpotAsset from '../trade/SpotAsset';
import SpotPlaceOrderNotLogin from '../placeOrders/NotLogin';
import SpotOrder from '../trade/SpotOrder';
// import FullTradeProduct from './FullTradeProduct';
// import FullTradeTicker from './FullTradeTicker';
import FullDepthDeal from './FullDepthDeal';
// import FullLeftMenu from './FullLeftMenu';
import FullTradeKLine from './FullTradeKLine';

// right
import FullDepth from './FullDepth';
import SpotPlaceOrder from '../trade/SpotPlaceOrder';
import FullTradeDeals from './FullTradeDeals';

import './FullTrade.less';
import {bindActionCreators} from "redux";
import * as CommonAction from "../../redux/actions/CommonAction";

function mapStateToProps(state) { // 绑定redux中相关state
  const { product, productObj } = state.SpotTrade;
  const { privateKey } = state.Common;
  return { product, productObj, privateKey };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FullTradeFrame extends React.Component {
  constructor(props) {
    super(props);
    window.OM_GLOBAL.tradeType = Enum.tradeType.fullTrade;
    window.OM_GLOBAL.isMarginType = false;
    window.addEventListener('resize', this.onResize);
  }

  componentWillMount() {
    if (document.querySelector("#headerContainer")) {
      document.querySelector("#headerContainer").style.display = 'none';
    }
    if (document.querySelector("#footerContainer")) {
      document.querySelector("#footerContainer").style.display = 'none';
    }
  }

  componentWillUnmount() {
    if (document.querySelector("#headerContainer")) {
      document.querySelector("#headerContainer").style.display = 'block';
    }
    if (document.querySelector("#footerContainer")) {
      document.querySelector("#footerContainer").style.display = 'block';
    }
    window.removeEventListener('resize', this.onResize);
  }

  onResize = util.debounce(() => {
    if (window.innerWidth >= 1280) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflowX = 'scroll';
    }
    if (window.innerHeight >= 600) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  });

  render() {
    // const { isLogin } = window.OM_GLOBAL;
    const isLogin = util.isLogined();
    return (
      <div className="full-wrap">
        {/*<div className="full-head">
          <FullTradeHead />
        </div>*/}
        <div className="trade-container">
          <div className="full-left">
            <div className="full-left-top">
              {/*<div className="full-left-top-left">
                <FullLeftMenu />
              </div>*/}
              <div className="full-left-top-right">
                <div className="full-ticker-kline">
                  {/*<div className="full-ticker">
                    <FullTradeProduct />
                    <FullTradeTicker />
                  </div>*/}
                  <FullTradeKLine />
                </div>
              </div>
            </div>
            <div className="full-left-bottom">
              <SpotAsset />
              <SpotOrder />
              {/*<div className="full-left-bottom-left"></div>
              <div className="full-left-bottom-right">
                <SpotPlaceOrder /> isLogin ? <SpotPlaceOrder /> : <SpotPlaceOrderNotLogin />
              </div>*/}
            </div>
          </div>
          <div className="full-right">
            <div className="full-right-left">
              <FullDepth />
              <SpotPlaceOrder />
            </div>
            <div className="full-right-right">
              <FullTradeDeals />
            </div>
          </div>
        </div>
        <FullTradeData />
      </div>
    );
  }
}
