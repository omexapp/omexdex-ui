import React from 'react';
import Icon from '_src/component/IconLite';
// import { toLocale } from '_src/locale/react-locale';
import './index.less';

const DexFooter = () => {
  return (
    <footer className="omdex-footer">
      <div className="row-center">
        ©2014-2019 OMEX.app. All Rights Reserved
      </div>
      <div className="row-right">
        <div className="omex-footer-links">
          <a href=""><Icon className="icon-twitter" /></a>
          <div className="line-divider" />
          <a href=""><Icon className="icon-Telegram" /></a>
          <div className="line-divider" />
          <a href="">Q&A</a>
          {/* <div className="line-divider" /> */}
          {/* <a href="">{toLocale('footer_standard_rates')}</a> */}
        </div>
      </div>
    </footer>
  );
};

export default DexFooter;
