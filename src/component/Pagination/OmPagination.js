import React from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import Pager from './Pager';
import KEYCODE from './KeyCode';
import './index.less';

function noop() {
}

const zhCN = {
  // Options.jsx
  items_per_page: '条/页',
  jump_to: '跳至',
  jump_to_confirm: '确定',
  page: '页',

  // Pagination.jsx
  prev_page: '上一页',
  next_page: '下一页',
  prev_5: '向前 5 页',
  next_5: '向后 5 页',
  prev_3: '向前 3 页',
  next_3: '向后 3 页',
};
const enUS = {
  // Options.jsx
  items_per_page: '/ page',
  jump_to: 'Goto',
  jump_to_confirm: 'confirm',
  page: '',

  // Pagination.jsx
  prev_page: 'Previous Page',
  next_page: 'Next Page',
  prev_5: 'Previous 5 Pages',
  next_5: 'Next 5 Pages',
  prev_3: 'Previous 3 Pages',
  next_3: 'Next 3 Pages',
};
// 目前只支持中文和英文 若需要其他语言需要传进来
const lang = Cookies.get('locale') === 'zh_CN' ? zhCN : enUS;

function isInteger(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value;
}

function defaultItemRender(page, type, element) {
  return element;
}

export default class OmPagination extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    current: PropTypes.number,
    defaultCurrent: PropTypes.number,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    defaultPageSize: PropTypes.number,
    onChange: PropTypes.func,
    hideOnSinglePage: PropTypes.bool,
    // showSizeChanger: PropTypes.bool, // 暂不支持
    showLessItems: PropTypes.bool,
    onShowSizeChange: PropTypes.func,
    // selectComponentClass: PropTypes.func,
    showPrevNextJumpers: PropTypes.bool,
    showQuickJumper: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    showTitle: PropTypes.bool,
    // pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
    showTotal: PropTypes.func,
    locale: PropTypes.object,
    style: PropTypes.object,
    itemRender: PropTypes.func,
    dark: PropTypes.bool,
    size: PropTypes.string,
  };

  static defaultProps = {
    defaultCurrent: 1,
    total: 0,
    defaultPageSize: 10,
    onChange: noop,
    className: '',
    // selectPrefixCls: 'rc-select', // 暂不支持
    prefixCls: 'om-ui-pagination',
    // selectComponentClass: null, // 暂不支持
    hideOnSinglePage: false,
    showPrevNextJumpers: true,
    showQuickJumper: false,
    // showSizeChanger: false, // 暂不支持
    showLessItems: false,
    showTitle: false, // 热点提示 默认不展示
    // onShowSizeChange: noop, // 暂不支持
    locale: lang, // 默认值
    style: {},
    itemRender: defaultItemRender,
    dark: false,
    size: '',
  };

  constructor(props) {
    super(props);

    const hasOnChange = props.onChange !== noop;
    const hasCurrent = ('current' in props);
    if (hasCurrent && !hasOnChange) {
      console.warn('Warning: You provided a `current` prop to a Pagination component without an `onChange` handler. This will render a read-only component.'); // eslint-disable-line
    }

    let current = props.defaultCurrent;
    if ('current' in props) {
      current = props.current;
    }

    let pageSize = props.defaultPageSize;
    if ('pageSize' in props) {
      pageSize = props.pageSize;
    }

    this.state = {
      current,
      currentInputValue: current,
      pageSize,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('current' in nextProps) {
      this.setState({
        current: nextProps.current,
        currentInputValue: nextProps.current,
      });
    }

    if ('pageSize' in nextProps) {
      const newState = {};
      let current = this.state.current;
      const newCurrent = this.calculatePage(nextProps.pageSize);
      current = current > newCurrent ? newCurrent : current;
      if (!('current' in nextProps)) {
        newState.current = current;
        newState.currentInputValue = current;
      }
      newState.pageSize = nextProps.pageSize;
      this.setState(newState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { prefixCls } = this.props;
    if (prevState.current !== this.state.current && this.paginationNode) {
      const lastCurrentNode = this.paginationNode.querySelector(`.${prefixCls}-item-${prevState.current}`);
      if (lastCurrentNode && document.activeElement === lastCurrentNode) {
        lastCurrentNode.blur();
      }
    }
  }

  savePaginationNode = (node) => {
    this.paginationNode = node;
  };

  /**
   * 计算总页数
   * @param p 每页数目
   * @returns {number}
   */
  calculatePage = (p) => {
    let pageSize = p;
    if (typeof pageSize === 'undefined') {
      pageSize = this.state.pageSize;
    }
    // 兼容老版本
    if (this.props.totalPage) {
      return this.props.totalPage;
    }
    return Math.floor((this.props.total - 1) / pageSize) + 1;
  };

  isValid = (page) => {
    return isInteger(page) && page >= 1 && page !== this.state.current;
  };
  /**
   * 键盘事件
   * @param e
   */
  handleKeyDown = (e) => {
    if (e.keyCode === KEYCODE.ARROW_UP || e.keyCode === KEYCODE.ARROW_DOWN) {
      e.preventDefault();
    }
  };
  /**
   * 键盘事件
   * @param e
   */
  handleKeyUp = (e) => {
    const inputValue = e.target.value;
    const currentInputValue = this.state.currentInputValue; // 输入的页数
    let value;

    if (inputValue === '') {
      value = inputValue;
    } else if (isNaN(Number(inputValue))) {
      value = currentInputValue;
    } else {
      value = Number(inputValue);
    }

    if (value !== currentInputValue) {
      this.setState({
        currentInputValue: value,
      });
    }

    if (e.keyCode === KEYCODE.ENTER) { // enter键
      this.handleChange(value);
    } else if (e.keyCode === KEYCODE.ARROW_UP) { // 向上箭头 页数-1
      this.handleChange(value - 1);
    } else if (e.keyCode === KEYCODE.ARROW_DOWN) { // 向下箭头 页数+1
      this.handleChange(value + 1);
    }
  };
  /**
   * 改变 pageSize
   * @param size 新的每页条数
   * 暂不支持
   */
  changePageSize = (size) => {
    let current = this.state.current;
    const newCurrent = this.calculatePage(size); // 计算新的总页数
    current = current > newCurrent ? newCurrent : current;
    if (typeof size === 'number') {
      if (!('pageSize' in this.props)) {
        this.setState({
          pageSize: size,
        });
      }
      if (!('current' in this.props)) {
        this.setState({
          current,
          currentInputValue: current,
        });
      }
    }
    this.props.onShowSizeChange(current, size);
  };
  /**
   * 翻页事件
   * @param p
   */
  handleChange = (p) => {
    let page = p;
    if (this.isValid(page)) {
      if (page > this.calculatePage()) {
        page = this.calculatePage();
      }

      if (!('current' in this.props)) {
        this.setState({
          current: page,
          currentInputValue: page,
        });
      }

      const pageSize = this.state.pageSize;
      this.props.onChange(page, pageSize);

      return page;
    }

    return this.state.current;
  };
  /**
   * 向前翻页
   * @param
   */
  prev = () => {
    if (this.hasPrev()) {
      this.handleChange(this.state.current - 1);
    }
  };
  /**
   * 向后翻页
   * @param
   */
  next = () => {
    if (this.hasNext()) {
      this.handleChange(this.state.current + 1);
    }
  };

  /**
   * 获取展示向前翻页数目
   * @param
   */
  getJumpPrevPage() {
    return Math.max(1, this.state.current - (this.props.showLessItems ? 3 : 5));
  }

  /**
   * 获取展示向后翻页数目
   * @param
   */
  getJumpNextPage() {
    return Math.min(this.calculatePage(), this.state.current + (this.props.showLessItems ? 3 : 5));
  }

  /**
   * 点击省略翻页事件
   * @param
   */
  jumpPrev = () => {
    this.handleChange(this.getJumpPrevPage());
  };
  /**
   * 点击省略翻页事件
   * @param
   */
  jumpNext = () => {
    this.handleChange(this.getJumpNextPage());
  };
  /**
   * 是否存在前一页
   * @param
   */
  hasPrev = () => {
    return this.state.current > 1;
  };
  /**
   * 是否存在后一页
   * @param
   */
  hasNext = () => {
    return this.state.current < this.calculatePage();
  };
  /**
   * enter事件
   * @param
   */
  runIfEnter = (event, callback, ...restParams) => {
    if (event.key === 'Enter' || event.charCode === 13) {
      callback(...restParams);
    }
  };

  runIfEnterPrev = (e) => {
    this.runIfEnter(e, this.prev);
  };

  runIfEnterNext = (e) => {
    this.runIfEnter(e, this.next);
  };

  runIfEnterJumpPrev = (e) => {
    this.runIfEnter(e, this.jumpPrev);
  };

  runIfEnterJumpNext = (e) => {
    this.runIfEnter(e, this.jumpNext);
  };
  /**
   * 点击go按钮
   * @param
   */
  handleGoTO = (e) => {
    if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
      this.handleChange(this.state.currentInputValue);
    }
  };

  render() {
    // 当只有一页时 或者当前总数不超过每页数目时 隐藏分页
    if (this.props.hideOnSinglePage === true && this.props.total <= this.state.pageSize) {
      return null;
    }

    const props = this.props;
    const locale = props.locale;

    const prefixCls = props.prefixCls;
    const allPages = this.calculatePage();
    const pagerList = [];
    let jumpPrev = null;
    let jumpNext = null;
    let firstPager = null;
    let lastPager = null;
    let gotoButton = null;

    const goButton = (props.showQuickJumper && props.showQuickJumper.goButton);
    const pageBufferSize = props.showLessItems ? 1 : 2;
    const { current, pageSize } = this.state;

    const prevPage = current - 1 > 0 ? current - 1 : 0;
    const nextPage = current + 1 < allPages ? current + 1 : allPages;
    // 简单模式
    if (props.simple) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = (
            <button
              type="button"
              onClick={this.handleGoTO}
              onKeyUp={this.handleGoTO}
            >
              {locale.jump_to_confirm}
            </button>
          );
        } else {
          gotoButton = (
            <span
              onClick={this.handleGoTO}
              onKeyUp={this.handleGoTO}
            >{goButton}
            </span>
          );
        }
        gotoButton = (
          <li
            title={props.showTitle ? `${locale.jump_to}${this.state.current}/${allPages}` : null}
            className={`${prefixCls}-simple-pager`}
          >
            {gotoButton}
          </li>
        );
      }

      return (
        <ul className={`${prefixCls} ${prefixCls}-simple ${props.className} ${props.dark ? `${prefixCls}-dark` : ''}`} style={props.style}>
          <li
            title={props.showTitle ? locale.prev_page : null}
            onClick={this.prev}
            tabIndex={this.hasPrev() ? 0 : null}
            onKeyPress={this.runIfEnterPrev}
            className={`${this.hasPrev() ? '' : `${prefixCls}-disabled`} ${prefixCls}-prev`}
            aria-disabled={!this.hasPrev()}
          >
            {props.itemRender(prevPage, 'prev', <a className={`${prefixCls}-item-link`} />)}
          </li>
          <li
            title={props.showTitle ? `${this.state.current}/${allPages}` : null}
            className={`${prefixCls}-simple-pager`}
          >
            <input
              type="text"
              value={this.state.currentInputValue}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
              onChange={this.handleKeyUp}
            />
            <span className={`${prefixCls}-slash`}>／</span>
            {allPages}
          </li>
          <li
            title={props.showTitle ? locale.next_page : null}
            onClick={this.next}
            tabIndex={this.hasPrev() ? 0 : null}
            onKeyPress={this.runIfEnterNext}
            className={`${this.hasNext() ? '' : `${prefixCls}-disabled`} ${prefixCls}-next`}
            aria-disabled={!this.hasNext()}
          >
            {props.itemRender(nextPage, 'next', <a className={`${prefixCls}-item-link`} />)}
          </li>
          {gotoButton}
        </ul>
      );
    }
    // 正常模式
    if (allPages <= 5 + (pageBufferSize * 2)) {
      for (let i = 1; i <= allPages; i++) {
        const active = this.state.current === i;
        pagerList.push(<Pager
          locale={locale}
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeyPress={this.runIfEnter}
          key={i}
          page={i}
          active={active}
          showTitle={props.showTitle}
          itemRender={props.itemRender}
        />);
      }
    } else {
      const prevItemTitle = props.showLessItems ? locale.prev_3 : locale.prev_5;
      const nextItemTitle = props.showLessItems ? locale.next_3 : locale.next_5;
      if (props.showPrevNextJumpers) {
        jumpPrev = (
          <li
            title={props.showTitle ? prevItemTitle : null}
            key="prev"
            onClick={this.jumpPrev}
            tabIndex="0"
            onKeyPress={this.runIfEnterJumpPrev}
            className={`${prefixCls}-jump-prev`}
          >
            {props.itemRender(this.getJumpPrevPage(), 'jump-prev', <a className={`${prefixCls}-item-link`} />)}
          </li>
        );
        jumpNext = (
          <li
            title={props.showTitle ? nextItemTitle : null}
            key="next"
            tabIndex="0"
            onClick={this.jumpNext}
            onKeyPress={this.runIfEnterJumpNext}
            className={`${prefixCls}-jump-next`}
          >
            {props.itemRender(this.getJumpNextPage(), 'jump-next', <a className={`${prefixCls}-item-link`} />)}
          </li>
        );
      }
      lastPager = (
        <Pager
          locale={props.locale}
          last
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeyPress={this.runIfEnter}
          key={allPages}
          page={allPages}
          active={false}
          showTitle={props.showTitle}
          itemRender={props.itemRender}
        />
      );
      firstPager = (
        <Pager
          locale={props.locale}
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeyPress={this.runIfEnter}
          key={1}
          page={1}
          active={false}
          showTitle={props.showTitle}
          itemRender={props.itemRender}
        />
      );

      let left = Math.max(1, current - pageBufferSize);
      let right = Math.min(current + pageBufferSize, allPages);

      if (current - 1 <= pageBufferSize) {
        right = 1 + (pageBufferSize * 2);
      }

      if (allPages - current <= pageBufferSize) {
        left = allPages - (pageBufferSize * 2);
      }
      // 中间显示的页数
      for (let i = left; i <= right; i++) {
        const active = current === i;
        pagerList.push(<Pager
          locale={props.locale}
          rootPrefixCls={prefixCls}
          onClick={this.handleChange}
          onKeyPress={this.runIfEnter}
          key={i}
          page={i}
          active={active}
          showTitle={props.showTitle}
          itemRender={props.itemRender}
        />);
      }

      if (current - 1 >= pageBufferSize * 2 && current !== 1 + 2) {
        pagerList[0] = React.cloneElement(pagerList[0], {
          className: `${prefixCls}-item-after-jump-prev`,
        });
        pagerList.unshift(jumpPrev);
      }
      if (allPages - current >= pageBufferSize * 2 && current !== allPages - 2) {
        pagerList[pagerList.length - 1] = React.cloneElement(pagerList[pagerList.length - 1], {
          className: `${prefixCls}-item-before-jump-next`,
        });
        pagerList.push(jumpNext);
      }

      if (left !== 1) {
        pagerList.unshift(firstPager);
      }
      if (right !== allPages) {
        pagerList.push(lastPager);
      }
    }

    let totalText = null;

    if (props.showTotal) {
      totalText = (
        <li className={`${prefixCls}-total-text`}>
          {props.showTotal(
            props.total,
            [
              ((current - 1) * pageSize) + 1,
              current * pageSize > props.total ? props.total : current * pageSize,
            ]
          )}
        </li>
      );
    }
    const prevDisabled = !this.hasPrev();
    const nextDisabled = !this.hasNext();
    return (
      <ul
        className={`${prefixCls} ${props.className} ${props.dark ? `${prefixCls}-dark` : ''} `}
        style={props.style}
        unselectable="unselectable"
        ref={this.savePaginationNode}
      >
        {totalText}
        <li
          title={props.showTitle ? locale.prev_page : null}
          onClick={this.prev}
          tabIndex={prevDisabled ? null : 0}
          onKeyPress={this.runIfEnterPrev}
          className={`${!prevDisabled ? '' : `${prefixCls}-disabled`} ${prefixCls}-prev`}
          aria-disabled={prevDisabled}
        >
          {props.itemRender(prevPage, 'prev', <a className={`${prefixCls}-item-link`} />)}
        </li>
        {pagerList}
        <li
          title={props.showTitle ? locale.next_page : null}
          onClick={this.next}
          tabIndex={nextDisabled ? null : 0}
          onKeyPress={this.runIfEnterNext}
          className={`${!nextDisabled ? '' : `${prefixCls}-disabled`} ${prefixCls}-next`}
          aria-disabled={nextDisabled}
        >
          {props.itemRender(nextPage, 'next', <a className={`${prefixCls}-item-link`} />)}
        </li>
        {/*<Options*/}
        {/*locale={props.locale}*/}
        {/*rootPrefixCls={prefixCls}*/}
        {/*selectComponentClass={props.selectComponentClass}*/}
        {/*selectPrefixCls={props.selectPrefixCls}*/}
        {/*changeSize={this.props.showSizeChanger ? this.changePageSize : null}*/}
        {/*current={this.state.current}*/}
        {/*pageSize={this.state.pageSize}*/}
        {/*pageSizeOptions={this.props.pageSizeOptions}*/}
        {/*quickGo={this.props.showQuickJumper ? this.handleChange : null}*/}
        {/*goButton={goButton}*/}
        {/*/>*/}
      </ul>
    );
  }
}
