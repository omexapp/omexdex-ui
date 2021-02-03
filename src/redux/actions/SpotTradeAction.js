import moment from 'moment';
import { calc, depth } from '_component/omit';
import ont from '../../utils/dataProxy';
import util from '../../utils/util';
import URL from '../../constants/URL';
import SpotTradeActionType from '../actionTypes/SpotTradeActionType';
import Enum from '../../utils/Enum';
import SpotActionType from '../actionTypes/SpotActionType';
import FormatAsset from '../../utils/FormatAsset';

/**
 * 获取所有币种资产或者某一个
 * 新增获取币币交易资产数据格式化 wanghongguang 2018-05-23
 */
export function fetchAccountAssets(callback) {
  return (dispatch, getState) => {
    const senderAddr = util.getMyAddr();
    if (!senderAddr) return;
    ont.get(`${URL.GET_ACCOUNTS}/${senderAddr}`).then((res) => {
      const { currencies } = res.data;
      const account = {};
      currencies.forEach((item) => {
        // 将数据的key变换成currency货币，记录到redux里
        account[item.symbol.toLowerCase()] = item;
      });
      const { product } = getState().SpotTrade;
      const { productConfig } = window.OM_GLOBAL;
      const spotAsset = FormatAsset.getSpotData(product, account, productConfig);
      dispatch({
        type: SpotTradeActionType.FETCH_UPDATE_ASSETS,
        data: { account, spotAsset }
      });
      return callback && callback();
    }).catch((res) => {
      return dispatch({
        type: SpotTradeActionType.FETCH_ERROR_ASSETS,
        data: res.msg
      });
    });
  };
}

// 将接口返回的数据转为DepthMerge工具类希望的二维数组格式
const transferDepth = (data) => {
  const result = {
    bids: [],
    asks: []
  };
  if (data.bids) {
    result.bids = data.bids.map((item) => {
      return [+item.price, +item.quantity, calc.mul(+item.price, +item.quantity)];
    });
  }
  if (data.asks) {
    result.asks = data.asks.map((item) => {
      return [+item.price, +item.quantity, calc.mul(+item.price, +item.quantity)];
    });
  }
  return result;
};

/*
 * ws清空深度  -  数组
 * */
export function clearSortPushDepthData() {
  return (dispatch) => {
    depth.clear();
    dispatch({
      type: SpotTradeActionType.FETCH_CLEAR_UPDATE_DEPTH
    });
  };
}

/**
 * 获取深度(非集合竞价)
 */
export function fetchDepth(product) {
  return (dispatch, getState) => {
    ont.get(URL.GET_DEPTH_BOOK, { params: { product } }).then((res) => {
      // 如果websocket已经链接 则不将ajax数据设置到store
      if (window.OM_GLOBAL.ws_v3.isConnected()) {
        console.log('trace,websocket,error,ajax回调发生在websocket推送之后');
        return;
      }
      // 格式化数据
      const formattedData = transferDepth(res.data); // 将asks和bids分别转为二维数组
      const { productConfig, tradeType } = window.OM_GLOBAL;
      dispatch(clearSortPushDepthData()); // depth.clear();

      const depth200 = depth.addData(formattedData);
      const depthSize = tradeType === Enum.tradeType.normalTrade ? 20 : 30;
      const defaultMergeType = util.generateMergeType(Number(productConfig.max_price_digit));
      const depthData = depth.getDepth(defaultMergeType, depthSize); // productConfig.mergeType
      dispatch({
        type: SpotTradeActionType.UPDATE_DEPTH,
        data: {
          depth: depthData,
          depth200
        }
      });
    });
  };
}

/*
 * ws更新深度
 * */
export function wsUpdateDepth(data) {
  return (dispatch, getState) => {
    const tradeState = getState().SpotTrade;
    // yao ws初次订阅会返回全量 清空一下store里的数据
    if (data.action === 'partial') {
      // yao 监听一下ajax回调发生在原本清空逻辑之后的情况
      const traceDepth = tradeState.depth || { asks: [] };
      if (traceDepth.asks.length) {
        console.log('trace,websocket,error,ajax回调发生在websocket原清空逻辑之后');
      }
      dispatch(clearSortPushDepthData());
    }

    const { product } = tradeState;
    if (product === '') { // 有可能组件卸载了，但是上一个推送过来了
      return false;
    }
    if ((`${data.base}_${data.quote}`) !== product) { // 只接受当前币对的推送数据，重要！
      return false;
    }
    // 格式化数据
    const formattedData = transferDepth(data.data); // 将asks和bids分别转为二维数组
    const { productConfig, tradeType } = window.OM_GLOBAL;
    const depth200 = depth.addData(formattedData);
    const depthSize = tradeType === Enum.tradeType.fullTrade ? 30 : 20;
    const defaultMergeType = util.generateMergeType(Number(productConfig.max_price_digit)); // productConfig.mergeType
    const depthData = depth.getDepth(defaultMergeType, depthSize);
    return dispatch({
      type: SpotTradeActionType.UPDATE_DEPTH,
      data: {
        depth: depthData,
        depth200
      }
    });
  };
}

/**
 * 刷新资产
 */
export function refreshAsset() {
  return (dispatch, getState) => {
    const { product, account } = getState().SpotTrade;
    const { productConfig } = window.OM_GLOBAL;
    const spotAsset = FormatAsset.getSpotData(product, account, productConfig);
    return dispatch({
      type: SpotTradeActionType.REFRESH_ASSETS,
      data: { spotAsset }
    });
  };
}

/**
 * 更新资产
 * 新增获取币币交易资产数据格式化 wanghongguang 2018-05-23
 */
export function wsUpdateAsset(data) {
  return (dispatch, getState) => {
    const { product, currencyObjByName } = getState().SpotTrade;
    const state = getState().SpotTrade;
    const account = { ...state.account };
    if (data instanceof Array && data.length) {
      for (let i = 0; i < data.length; i++) {
        const symbol = data[i].symbol;
        if (currencyObjByName[symbol]) {
          account[currencyObjByName[symbol].symbol.toLowerCase()] = data[i];
        }
      }
    } else if (Object.prototype.toString.call(data) === '[object Object]' &&
      Object.keys(data).length > 0) {
      account[currencyObjByName[data.symbol].symbol.toLowerCase()] = data;
    }
    const { productConfig } = window.OM_GLOBAL;
    const spotAsset = FormatAsset.getSpotData(product, account, productConfig);
    dispatch({
      type: SpotTradeActionType.FETCH_UPDATE_ASSETS,
      data: { account, spotAsset }
    });
  };
}

/**
 * 更新ticker
 */
export function wsUpdateTicker(data) {
  return (dispatch, getState) => {
    const { currencyTicker, product } = getState().SpotTrade;
    if (product.toLowerCase() !== data.product.toLowerCase()) {
      return false;
    }
    let newCurrencyTicker = currencyTicker ? util.cloneDeep(currencyTicker) : {};
    if (data instanceof Array) {
      newCurrencyTicker = { ...newCurrencyTicker, ...data[0] };
    } else {
      newCurrencyTicker = { ...newCurrencyTicker, ...data };
    }
    const { tickers } = getState().Spot;
    const newTickers = tickers ? util.cloneDeep(tickers) : {};
    newTickers[product] = newCurrencyTicker;
    dispatch({
      type: SpotTradeActionType.UPDATE_TICKER,
      data: newCurrencyTicker
    });
    // 更新所有币对行情，确保左侧菜单实时刷新
    dispatch({
      type: SpotActionType.UPDATE_TICKERS,
      data: newTickers
    });
    return false;
  };
}


/*
 * 清空分时K线数据
 * */
export function clearKlineData() {
  return (dispatch) => {
    dispatch({
      type: SpotTradeActionType.FETCH_SUCCESS_KLINE_DATA,
      data: []
    });
  };
}
/*
 * 获取分时K线数据
 * */
export function getKlineDataByAjax(product, callback) {
  return (dispatch, getState) => {
    // 不清空数据，防止ws断线后，K线总闪
    // dispatch({
    //   type: SpotTradeActionType.FETCH_SUCCESS_KLINE_DATA,
    //   data: []
    // });
    ont.get(URL.GET_KLINE_DATA, {
      params: {
        product,
        type: '1min'
      }
    }).then((res) => {
      if (getState().SpotTrade.product.toLowerCase() !== product) {
        return false;
      }
      let klineData = res.data;
      if (klineData.length > 300) {
        klineData = klineData.slice(klineData.length - 300);
      }
      dispatch({
        type: SpotTradeActionType.FETCH_SUCCESS_KLINE_DATA,
        data: klineData
      });
      return callback && callback();
    });
  };
}

/*
 * ws更新K线数据
 * */
export function wsUpdateKlineData(klinedata) {
  // 先ajax全量，然后合成ws增量数据
  return (dispatch, getState) => {
    const state = getState().SpotTrade;
    const { product } = state;
    if (product === '') { // 有可能组件卸载了，但是上一个推送过来了
      return false;
    }
    if (product.toLowerCase() !== (`${klinedata.base}_${klinedata.quote}`).toLowerCase()) {
      return false;
    }
    const data = klinedata.data;
    let klineData = [...state.klineData];
    if (klineData.length) {
      const lastItem = klineData[klineData.length - 1];
      // 需要追加的数组
      const appendData = [];
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (Number(e.createdDate) === Number(lastItem.createdDate)) {
          const isEqual = Number(lastItem.close) === Number(e.close);
          // 收盘价不等时 需要更新
          if (!isEqual) {
            klineData[klineData.length - 1] = e;
          }
        } else if (Number(e.createdDate) > Number(lastItem.createdDate)) {
          appendData.push(e);
        }
      }
      if (appendData.length) {
        let newData = klineData.concat(appendData);
        if (newData.length > 300) {
          newData = newData.slice(newData.length - 300);
        }
        klineData = newData;
      }
    } else {
      // klineData = data;
      return false;
    }

    return dispatch({
      type: SpotTradeActionType.FETCH_SUCCESS_KLINE_DATA,
      data: klineData
    });
  };
}


/*
 * 币币-修改资金划转对话框
 * */
export function updateTransfer(value) {
  return (dispatch) => {
    dispatch({
      type: SpotTradeActionType.UPDATE_TRANSFER,
      data: value
    });
  };
}

export function addColorToDeals(arr) {
  const data = [...arr];
  const l = data.length;
  if (!data[l - 1].color) {
    data[l - 1].color = 'deals-green';
  }
  if (data.length === 1) {
    return data;
  }
  for (let i = l - 1; i > 0; i--) {
    if (data[i - 1].price > data[i].price) {
      data[i - 1].color = 'deals-green';
    } else if (data[i - 1].price < data[i].price) {
      data[i - 1].color = 'deals-red';
    } else if (data[i].color === 'deals-green') {
      data[i - 1].color = 'deals-green';
    } else {
      data[i - 1].color = 'deals-red';
    }
  }
  return data;
}

/*
 * 全屏交易-获取所有成交
 * */
export function getDeals(product, callback) {
  return (dispatch) => {
    ont.get(URL.GET_LATEST_MATCHES, { params: { product, page: 0, per_page: 60 } }).then((res) => {
      const data = res.data.data || [];
      data.sort((d1, d2) => {
        return d2.timestamp - d1.timestamp;
      });
      // 增加方向
      const Finalist = data.length > 0 ? addColorToDeals(data) : [];
      dispatch({
        type: SpotTradeActionType.FETCH_SUCCESS_DEALS,
        data: Finalist
      });
      callback && callback();
    });
  };
}

export function clearDeals() {
  return (dispatch) => {
    dispatch({
      type: SpotTradeActionType.CLEAR_DEALS,
      data: []
    });
  };
}

/*
 * 全屏交易-已成交
 * */
export function wsUpdateDeals(data = []) {
  return (dispatch, getState) => {
    const state = getState().SpotTrade;
    const { product } = state;
    if (product === '') {
      return false;
    }
    const dataFilted = data.filter((item) => {
      const itemProduct = item.product;
      if (itemProduct) {
        return itemProduct.toLowerCase() === product;
      }
      return false;
    });
    // 推送不包含全量推送，所以直接合并去重
    if (dataFilted.length > 0) {
      // 后面不修改deals
      let deals = [...state.deals];
      // 合并
      deals = dataFilted.concat(deals);
      let newArr = [];
      const newObj = {};
      // 去重
      for (let i = 0, len = deals.length; i < len; i++) {
        deals[i].id = deals[i].product + deals[i].timestamp + deals[i].block_height + deals[i].price + deals[i].volume;
        if (deals[i].id && !newObj[deals[i].id]) {
          newObj[deals[i].id] = true;
          newArr.push(deals[i]);
        }
      }
      // 切割
      if (newArr.length > 60) {
        newArr = newArr.slice(0, 60);
      }
      // 排序
      newArr.sort((d1, d2) => {
        return d2.timestamp - d1.timestamp;
      });
      // 增加方向
      const Finalist = data.length > 0 ? addColorToDeals(newArr) : [];
      dispatch({
        type: SpotTradeActionType.WS_UPDATE_DEALS,
        data: Finalist
      });
    }
    return true;
  };
}
