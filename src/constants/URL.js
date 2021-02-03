import Config from './Config';

// function getContextPath() {
//     const pathName = document.location.pathname;
//     const index = pathName.substr(1).indexOf('/');
//     const result = pathName.substr(0, index + 1);
//     return result;
// }

// var OMEX_BASE_URL = location.protocol + '//' + location.host + getContextPath() + PROJECT_PRXFIX_URL;
const OMDEX_BASE_URL = '{domain}/omchain/v1';

/*
 * URL统一管理
 */
const URL = {
  GET_ORDER_OPEN: `${OMDEX_BASE_URL}/order/list/open`,
  GET_ORDER_CLOSED: `${OMDEX_BASE_URL}/order/list/closed`,
  GET_PRODUCT_DEALS: `${OMDEX_BASE_URL}/deals`,
  GET_LATEST_MATCHES: `${OMDEX_BASE_URL}/matches`,
  GET_PRODUCT_TICKERS: `${OMDEX_BASE_URL}/tickers`,
  GET_PRODUCTS: `${OMDEX_BASE_URL}/products`, // `${OMDEX_BASE_URL}/products` 原:`${OMDEX_SUPPORT_ROOT}/omchain/product/list`
  GET_TOKENS: `${OMDEX_BASE_URL}/tokens`,
  GET_DEPTH_BOOK: `${OMDEX_BASE_URL}/order/depthbook`,
  GET_CANDLES: `${OMDEX_BASE_URL}/candles`,
  GET_ACCOUNTS: `${OMDEX_BASE_URL}/accounts`, // 所有账户
  GET_TRANSACTIONS: `${OMDEX_BASE_URL}/transactions`, // 交易记录
  GET_LATEST_HEIGHT: `${OMDEX_BASE_URL}/latestheight`, // 查询最新高度
  GET_ACCOUNT_DEPOSIT: `${OMDEX_BASE_URL}/dex/deposits`, // 查询对应地址的币对
};
export default URL;
