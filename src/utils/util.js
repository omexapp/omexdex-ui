import React from 'react';
import { calc } from '_component/omit';
import ont from '../utils/dataProxy';
import URL from '../constants/URL';
import Enum from '../utils/Enum';

const util = {
  getSupportLocale(lang) {
    if (lang.toLowerCase().indexOf('cn') === -1) {
      return 'en_US';
    }
    return 'zh_CN';
  },
  getChangePercentage(ticker) {
    if (!ticker) {
      return '+0.00%';
    }
    if (!ticker.open) {
      return '+0.00%';
    }
    if (+ticker.price === -1) {
      return '+0.00%';
    }
    const changePercent = calc.floorDiv(calc.sub(ticker.price, ticker.open) * 100, ticker.open, 2);
    const changeSignStr = changePercent >= 0 ? '+' : '';
    return `${changeSignStr}${changePercent}%`;
  },
  getShortName(paramProduct) {
    let product = paramProduct;
    if (!product) {
      return '';
    }
    if (product.split('_').length === 2) {
      product = product.toUpperCase().replace('_', '/');
    }
    if (product.split('/').length === 2) {
      const [baseSymbol, quoteSymbol] = product.split('/');
      return `${baseSymbol.split('-')[0]}/${quoteSymbol.split('-')[0]}`;
    }
    return product;
  },
  getSymbolShortName(symbol) {
    if (!symbol) {
      return '';
    }
    if (symbol.split('-').length > 1) {
      return symbol.split('-')[0];
    }
    return symbol;
  },
  getMyToken() {
    const tok = window.localStorage.getItem('dex_token');
    if (tok) {
      return tok;
    }
    return '';
  },
  generateMergeType(num) {
    let s = '0.';
    if (num > 0) {
      for (let i = 0; i < num - 1; i++) {
        s += '0';
      }
      s += '1';
    } else {
      s = '0.0001';
    }
    return s;
  },
  getMyAddr() {
    let addr = '';
    try {
      const user = JSON.parse(window.localStorage.getItem('dex_user') || '{}');
      addr = (user && user.addr) ? user.addr : '';
    } catch (e) {
      console.warn(e.message);
      // throw e;
    }
    return addr;
  },
  doLogout() {
    window.localStorage.removeItem('dex_user');
    window.localStorage.removeItem('dex_token');
    window.localStorage.removeItem('dex_legalCurrencyId');
  },
  isWsLogin() {
    const tok = window.localStorage.getItem('dex_token');
    if (tok && util.isLogined()) {
      return true;
    }
    return false;
  },
  isLogined() {
    const user = window.localStorage.getItem('dex_user');
    if (user) {
      try {
        const userObj = JSON.parse(user) || {};
        if (userObj.addr || userObj.address) {
          window.OM_GLOBAL.isLogin = true;
        }
      } catch (e) {
        window.OM_GLOBAL.isLogin = false;
      }
    } else {
      window.OM_GLOBAL.isLogin = false;
    }
    return window.OM_GLOBAL.isLogin;
  },
  // js生成文件，下载
  downloadObjectAsJson(exportObj, exportName) {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `${exportName}.txt`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  },
  // IE11判断
  lessThanIE11() {
    const UA = navigator.userAgent;
    const isIE = UA.indexOf('MSIE') > -1;
    const v = isIE ? /\d+/.exec(UA.split(';')[1]) : 11;
    return v < 11;
  },
  objToQueryString(obj) {
    if (!obj) {
      return '';
    }
    const str = [];
    Object.keys(obj).forEach((key) => {
      str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    });
    return str.join('&');
  },
  getQueryHashString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = window.location.hash.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return '';
  },
  timeStampToTime(timestamp) {
    const date = timestamp.toString().length === 10 ? new Date(timestamp * 1000) : new Date(timestamp);
    const Y = `${date.getFullYear()}-`;
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const D = `${date.getDate() < 10 ? (`0${date.getDate()}`) : date.getDate()} `;
    const h = `${date.getHours() < 10 ? (`0${date.getHours()}`) : date.getHours()}:`;
    const m = `${date.getMinutes() < 10 ? (`0${date.getMinutes()}`) : date.getMinutes()}:`;
    const s = (date.getSeconds() < 10 ? (`0${date.getSeconds()}`) : date.getSeconds());
    return Y + M + D + h + m + s;
  },
  // 数组转对象
  arrayToObj(arr, keyName) {
    const result = {};
    arr.forEach((item) => {
      result[item[keyName]] = item;
    });
    return result;
  },
  getCountByTime(timestamp) {
    let sec = timestamp / 1000;
    if (sec >= 3600) {
      const hours = Math.floor(sec / 3600);
      if (sec % 3600 === 0) {
        return `${hours > 10 ? hours : `0${hours}`}:00:00`;
      }

      sec %= 3600;
      if (sec >= 60) {
        const min = Math.floor(sec / 60);
        if (sec % 60 === 0) {
          return `${hours > 10 ? hours : `0${hours}`}:${min > 10 ? min : `0${min}`}:00`;
        }

        sec = (timestamp / 1000) - (hours * 3600) - (min * 60);
        return `${hours > 10 ? hours : `0${hours}`}:${min > 10 ? min : `0${min}`}:${sec >= 10 ? sec : `0${sec}`}`;
      }


      return `${hours > 10 ? hours : `0${hours}`}:00:${sec >= 10 ? sec : `0${sec}`}`;
    } else if (sec >= 60) {
      if (sec % 60 === 0) {
        const min = Math.floor(sec / 60);
        return `${min > 10 ? min : `0${min}`}:00`;
      }

      const i = Math.floor(sec / 60);
      const j = sec % 60;
      return `${i >= 10 ? i : `0${i}`}:${j >= 10 ? j : `0${j}`}`;
    }

    return `00:${sec >= 10 ? sec : `0${sec}`}`;
  },
  // ctrl or tab
  ctrlAorTab(e) {
    // control-17;tab-9;
    if (e != null && (e.keyCode === 17 || e.keyCode === 9)) {
      return true;
    }
    // ctrl + A   A-65
    return (e != null && e.ctrlKey && e.keyCode === 65);
  },
  cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  },
  // 函数防抖
  debounce(fn, delay = 200) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  },
  // 函数节流
  throttle(fn, delay = 200) {
    let timer = null;
    return (...args) => {
      if (!timer) {
        timer = setTimeout(() => {
          fn(...args);
          clearTimeout(timer);
        }, delay);
      }
    };
  },
  addColor(text) {
    let colorClass = '';
    let textShown = text;
    const num = Number(text);
    // text为0则不添加颜色
    if (num > 0) {
      colorClass = 'primary-green';
      textShown = `+${calc.thousandFormat(text)}`;
    }
    if (num < 0) {
      colorClass = 'primary-red';
      textShown = calc.thousandFormat(text);
    }
    return <label className={colorClass}>{textShown}</label>;
  },
  logRecord() { // 当前页面打log
    if (window.location.hostname.indexOf('local') === -1) { // 本地就不发log了
      ont.post(URL.LOG_RECORD, { c_url: window.location.href }).catch(() => {});
    }
  },
  getTheme() {
    return localStorage.getItem('theme') === Enum.themes.theme2 ? 'dark' : '';
  },
  precisionInput(num) {
    return Number(num).toFixed(8);
  }
};

export default util;
