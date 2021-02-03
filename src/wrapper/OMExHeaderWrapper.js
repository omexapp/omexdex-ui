import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from 'js-cookie';
import * as CommonAction from '../redux/actions/CommonAction';
import util from '../utils/util';

function mapStateToProps(state) { // 绑定redux中相关state
  const {
    privateKey
  } = state.Common;
  return {
    privateKey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch)
  };
}
const OMExHeaderWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class CommonHeader extends React.Component {
    componentWillMount() {
    }
    componentDidMount() {
      console.log('OMExHeaderWrapper 1');
      // 初始化omchain客户端
      this.props.commonAction.initOMChainClient();
    }

    //
    componentWillReceiveProps(nextProps) {
    }

    render() {
      const lang = util.getSupportLocale(Cookies.get('locale') || 'en_US');
      return (<Component {...this.props} />);
    }
  }
  return CommonHeader;
};

export default OMExHeaderWrapper;
