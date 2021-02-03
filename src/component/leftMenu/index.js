/**
 * Created by zhaiyibo on 2018/1/15.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '_src/component/IconLite';
import util from '_src/utils/util';
import './index.less';

const SortTypes = {
  noSort: 'noSort',
  asc: 'asc',
  des: 'des'
};
export default class LeftMenu extends React.Component {
  static propTypes = {
    menuList: PropTypes.array,
    listHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    listEmpty: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    searchPlaceholder: PropTypes.string,
    searchBar: PropTypes.bool,
    searchText: PropTypes.string,
    subTitle: PropTypes.array,
    activeId: PropTypes.string,
    theme: PropTypes.string,
    canStar: PropTypes.bool,
    onSearch: PropTypes.func,
    onSelect: PropTypes.func,
    onClickStar: PropTypes.func
  };
  static defaultProps = {
    menuList: [],
    listHeight: 'auto',
    listEmpty: '',
    searchBar: false,
    searchPlaceholder: 'search',
    searchText: '',
    subTitle: undefined,
    activeId: '',
    theme: '',
    canStar: false,
    onSearch: null,
    onSelect: null,
    onClickStar: null
  };

  constructor(props) {
    super(props);
    this.state = {
      menuList: props.menuList,
      sortType: SortTypes.noSort,
      activeId: props.activeId
    };
  }

  componentWillReceiveProps(nextProps) {
    // const { sortType } = this.state;
    const { menuList, activeId } = nextProps;
    // const newList = [...menuList];
    // if (sortType === SortTypes.noSort) {
    //   newList.sort((a, b) => { return (a.text).localeCompare(b.text); });
    // } else if (sortType === SortTypes.asc) {
    //   newList.sort((a, b) => { return parseFloat(a.changePercentage) - parseFloat(b.changePercentage); });
    // } else if (sortType === SortTypes.des) {
    //   newList.sort((a, b) => { return parseFloat(b.changePercentage) - parseFloat(a.changePercentage); });
    // }
    this.setState({
      menuList,
      activeId
    });
  }

  // 模糊搜索
  handleSearchChange = (e) => {
    const args = e.target.value;
    if (this.props.onSearch) {
      this.props.onSearch(args);
      return false;
    }
    const allList = this.props.menuList;
    const filterList = allList.filter((item) => {
      return [args.toLowerCase(), args.toUpperCase()].includes(item.text);
    });
    this.setState({
      menuList: filterList
    });
    return false;
  };
  // 排序
  handleSort = () => {
    const { sortType, menuList } = this.state;
    const newList = [...menuList];
    let newSortType = SortTypes.noSort;
    if (sortType === SortTypes.asc) { // 升序切换为降序
      newList.sort((a, b) => { return parseFloat(b.changePercentage) - parseFloat(a.changePercentage); });
      newSortType = SortTypes.des;
    } else if (sortType === SortTypes.des) { // 降序切换为默认
      newList.sort((a, b) => { return (a.text).localeCompare(b.text); });
      newSortType = SortTypes.noSort;
    } else { // 默认切换为升序
      newList.sort((a, b) => { return parseFloat(a.changePercentage) - parseFloat(b.changePercentage); });
      newSortType = SortTypes.asc;
    }
    this.setState({
      sortType: newSortType,
      menuList: newList
    });
  };
  // 收藏/取消收藏
  handleStar = (item) => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { onClickStar } = this.props;
      if (onClickStar) {
        onClickStar(!item.stared, item);
      }
    };
  };
  // 选中菜单项
  handleSelect = (item) => {
    return () => {
      const { onSelect } = this.props;
      if (onSelect) {
        onSelect(item);
      }
    };
  };
  // 渲染list
  renderList = (menuList) => {
    const { canStar } = this.props;
    const { activeId } = this.state;
    return (
      <div>
        {
          menuList.map((item, index) => {
            const {
              id, stared, text, change, changePercentage, lever
            } = item;

            const color = change.toString().indexOf('-') > -1 ? 'red' : 'green';
            return (
              <li
                key={index}
                className={id === activeId ? 'active' : ''}
                onClick={this.handleSelect(item)}
              >
                <span
                  style={{ display: canStar ? 'block' : 'none' }}
                  onClick={this.handleStar(item)}
                >
                  <Icon className={stared ? 'icon-Star' : 'icon-Star-o'} />
                </span>
                <label className="pair">{util.getShortName(text)}</label>
                {lever ? <span className="lever"><span>{lever}X</span></span> : null}
                <label className={`change change-${color}`}>{changePercentage}</label>
              </li>
            );
          })
        }
      </div>
    );
  };
  renderEmpty = () => {
    const { listEmpty } = this.props;
    return (
      <div className="empty-container">
        {listEmpty}
      </div>
    );
  };

  render() {
    const {
      searchPlaceholder, searchBar, subTitle, title, style,
      searchText, listHeight, theme
    } = this.props;
    let pair = '';
    let change = '';
    if (subTitle && subTitle.length) {
      pair = subTitle[0];
      change = subTitle[1];
    }
    const { menuList, sortType } = this.state;
    const ascSort = sortType === SortTypes.asc;
    const desSort = sortType === SortTypes.des;
    const haveData = menuList && menuList.length > 0;
    const hasScroll = menuList && menuList.length > 9;
    const themeClass = theme || '';
    return (
      <div className={`om-left-menu ${themeClass} ${hasScroll ? 'has-scroll' : ''}`} style={style}>
        {searchBar ?
          <div className="list-search">
            <div className="search-wrap">
              {/* debug-chrome自动记住用户名 */}
              <input type="text" style={{ display: 'none' }} />
              <input
                type="text"
                autoComplete="off"
                value={searchText}
                placeholder={searchPlaceholder}
                onChange={this.handleSearchChange}
                className="input-theme-controls"
              />
              <Icon className="icon-search" />
            </div>
          </div> : null}
        <div className={`${searchBar ? '' : 'top-border'} list-container`}>
          {title}
          {subTitle ?
            <div className="list-head">
              <div className="head-left">{pair}</div>
              <div className="head-right" onClick={this.handleSort}>
                <span>{change}</span>
                <span className="change-icons">
                  <Icon className={`${ascSort ? 'active' : ''} icon-retract`} />
                  <Icon className={`${desSort ? 'active' : ''} icon-spread`} />
                </span>
              </div>
            </div> : null}

          <ul className="list-main" style={{ height: listHeight }}>
            {haveData ? this.renderList(menuList) : this.renderEmpty()}
          </ul>
        </div>
      </div>
    );
  }
}
