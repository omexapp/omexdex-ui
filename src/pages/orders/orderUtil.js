import React from 'react';
import moment from 'moment';
import { calc } from '_component/omit';
import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import { OrderStatus, OrderType } from '../../constants/OrderStatus';

const orderUtil = {
  // 买卖方向类型
  sideType: () => {
    return {
      1: toLocale('spot.buy'),
      2: toLocale('spot.sell')
    };
  },
  // 交易方向列表
  sideList: () => {
    return [{
      value: 0,
      label: toLocale('spot.buyAndSell')
    }, {
      value: 1,
      label: toLocale('spot.buy')
    }, {
      value: 2,
      label: toLocale('spot.sell')
    }];
  },
  // 获取table空数据时的样式
  getEmptyContent: () => {
    return (
      <div className="flex-column" style={{ alignItems: 'center', color: 'rgba(255, 255, 255, 0.45)' }}>
        <Icon
          className="icon-Nodeallist"
          isColor
          style={{ width: '48px', height: '48px' }}
        />
        <div className="mar-top10">
          {toLocale('spot.orders.noData')}
        </div>
      </div>
    );
  },
  // 获取列配置
  getColumns: (productObj, cancelHandler) => {
    return [{
      title: toLocale('spot.orders.date'),
      key: 'createTime',
      render: (text) => {
        return (
          <div className="date-str">
            {moment(text).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        );
      }
    }, {
      title: toLocale('spot.orders.symbol'),
      key: 'symbol',
      render: (text) => { return text.toString().replace('_', '/').toUpperCase(); }
    }, {
      title: toLocale('spot.orders.type'),
      key: 'systemType',
      render: (text) => {
        const intlId = Number(text) === 1 ? 'spot.orders.side.spot' : 'spot.orders.side.margin';
        return (
          <div style={{ minWidth: '45px' }}>
            { toLocale(intlId) }
          </div>
        );
      }
    }, {
      title: <div style={{ minWidth: '30px' }}>{ toLocale('spot.orders.side2') }</div>,
      key: 'side',
      render: (text) => {
        const colorClass = Number(text) === 1 ? 'primary-green' : 'primary-red';
        return (
          <label className={colorClass}>
            {orderUtil.sideType()[text]}
          </label>
        );
      }
    }, {
      title: toLocale('spot.orders.entrustMount'),
      key: 'size',
      render: (text) => {
        return (
          <div className="digits-str">
            {text}
          </div>
        );
      }
    }, {
      title: toLocale('spot.orders.orderType'),
      key: 'orderType',
      render: (text) => {
        return <div className="order-option-str one-line">{toLocale(OrderType[text] || '')}</div>;
      }
    },
    {
      title: toLocale('spot.orders.entrustPrice'),
      key: 'price',
      render: (text, record) => {
        if (Number(record.orderType) === 1) { // 市价
          return toLocale('spot.market');
        }
        return (
          <div className="digits-str">
            {text}
          </div>
        );
      }
    }, {
      title: toLocale('spot.orders.entrustMoney'),
      key: 'total',
      render: (text) => {
        return (
          <div className="digits-str">
            {text}
          </div>
        );
      }
    }, {// 已成交
      title: toLocale('spot.orders.dealt'),
      key: 'filledSize',
      render: (text) => {
        return (
          <div className="digits-str">
            {text}
          </div>
        );
      }
    }, {
      title: toLocale('spot.orders.dealAveragePrice'),
      key: 'avgPrice',
      render: (text) => {
        return (
          <div className="digits-str">
            {text}
          </div>
        );
      }
    }, {
      title: toLocale('spot.orders.status'),
      key: 'status',
      render: (text, record) => {
        const { CANCELING, CANCELLED, COMPLETE_FILLED } = OrderStatus;
        const { FAK, FOK } = OrderType;
        return (
          <div style={{ minWidth: '90px' }}>
            { toLocale(`spot.orders.${OrderStatus[text]}`) }
            &nbsp;&nbsp;
            {
              [CANCELING, CANCELLED, COMPLETE_FILLED].indexOf(record.status.toString()) > -1 ||
                (productObj[record.symbol] && Number(productObj[record.symbol].tradingMode) === 2) ||
                [FAK, FOK].includes(record.orderType.toString()) ? null :
                <a
                  className="order-cancel"
                  onClick={cancelHandler(record.id, record.symbol)}
                >
                  { toLocale('spot.orders.cancel') }
                </a>
            }
          </div>
        );
      }
    }];
  },
  // 数据格式化
  formatOrders: (orders, productList) => {
    return orders.map((oriOrder) => {
      const order = { ...oriOrder }; // 避免修改原始对象
      const { orderType, side, symbol } = order;
      // 获取当前币对配置
      const currProduct = productList.filter((product) => { return product.symbol === symbol; })[0] || {};

      const priceTruncate = currProduct.max_price_digit ? currProduct.max_price_digit : 2;
      const sizeTruncate = 'max_size_digit' in currProduct ? currProduct.max_size_digit : 2;


      // 价格、数量、金额、未成交
      let price = '';
      let size = '';
      let total = '';
      let notNealSize = 0;
      if (Number(orderType) === 1) { // 市价
        if (Number(side) === 1) { // 市价买入
          size = '--';
          total = calc.showFloorTruncation(order.quoteSize, priceTruncate);
        } else { // 市价卖出
          size = calc.showFloorTruncation(order.size, sizeTruncate);
          total = '--';
        }
        notNealSize = 0;
      } else { // 限价
        price = order.price.replace(/,/g, '');
        price = calc.showFloorTruncation(price, priceTruncate);
        size = calc.showFloorTruncation(order.size, sizeTruncate);
        total = calc.showFloorTruncation(calc.mul(order.size, order.price), priceTruncate);
        notNealSize = order.size - order.filledSize;
      }
      notNealSize = calc.showFloorTruncation(notNealSize, sizeTruncate);
      const baseCurr = order.symbol.split('_')[1].toUpperCase();
      const tradeCurr = order.symbol.split('_')[0].toUpperCase();
      order.size = size === '--' ? size : `${size} ${tradeCurr}`;
      order.price = `${price} ${baseCurr}`;
      order.total = total === '--' ? total : `${total} ${baseCurr}`;
      order.notNealSize = notNealSize;
      // 均价
      let avgPrice = 0;
      if (+order.filledSize !== 0) {
        avgPrice = calc.div(order.executedValue, order.filledSize);
      }
      if (Number(side) === 1) {
        order.avgPrice = `${calc.showFloorTruncation(avgPrice, priceTruncate)} ${baseCurr}`;
      } else {
        order.avgPrice = `${calc.showCeilTruncation(avgPrice, priceTruncate)} ${baseCurr}`;
      }
      // 成交数量
      order.filledSize = `${calc.showFloorTruncation(order.filledSize, sizeTruncate)} ${tradeCurr}`;
      return order;
    });
  }
};
export default orderUtil;
