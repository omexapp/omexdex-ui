/**
 * 加载状态
 * Created by yuxin.zhang on 2018/1/1.
 *
 * 充满父级 自动居中 父级需要定位
 */

import React from 'react';
import './Loading.less'

export default class Loading extends React.Component {
    render() {

        const {when, small, isOMEX, theme} = this.props;

        const isOMEXSite = isOMEX ? isOMEX : location.host.toLowerCase().indexOf('omex') !== -1;

        const loadingClass = isOMEXSite ? (small ? 'omex-loading-box-small' : 'omex-loading-box') : 'omcoin-loading-box';

        return (
            <div className={`${loadingClass} ${theme} ${when ? '' : 'hide'}`}>
                <div>
                    <div className="c1"></div>
                    <div className="c2"></div>
                    <div className="c3"></div>
                    <div className="c4"></div>
                </div>
            </div>
        );
    }
}

Loading.defaultProps = {
    when: false,
    isOMEX: null,
    small: false,
    theme: ''
};