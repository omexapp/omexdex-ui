import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Checkbox.less';

const prefixCls = 'om-ui-checkbox';

export default class CheckboxGroup extends React.Component {
  static propTypes = {
    /** 名称 */
    name: PropTypes.string,
    /** 类名 */
    className: PropTypes.string,
    /** 是否禁止 */
    disabled: PropTypes.bool,
    /** 变化时回调函数 */
    onChange: PropTypes.func,
    /** 指定被选中的值 */
    value: PropTypes.array,
    /** checkbox 列表 */
    options: PropTypes.array,
    /** 默认指定的值 */
    defaultValue: PropTypes.array
  };

  static defaultProps = {
    className: 'om-ui-checkbox',
    value: '',
    defaultValue: [],
    disabled: false,
    onChange: null,
  };

  constructor(props) {
    super(props);

    const value = props.value || props.defaultValue || [];
    this.state = {
      value,
    };
  }

  // 新版方法 代替componentWillReceiveProps
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value || [],
      };
    }
    return null;
  }

  getOptions = () => {
    const { options } = this.props;
    return options.map((item) => {
      if (typeof item === 'string') {
        return {
          value: item,
          label: item
        };
      }
      return item;
    });
  };

  toggleOption = (option) => {
    const optionIndex = this.state.value.indexOf(option.value);
    const value = [...this.state.value];
    if (optionIndex === -1) {
      value.push(option.value);
    } else {
      value.splice(optionIndex, 1);
    }
    this.setState({ value });
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const {
      disabled, options
    } = this.props;
    const { value } = this.state;
    return (
      <div className={`${prefixCls}`}>
        {
          options && options.length > 0 && this.getOptions().map((item) => {
            return (
              <label
                key={item.value}
                className={classnames({
                  'checkbox-wrapper': true,
                  'checkbox-wrapper-checked': value.indexOf(item.value) !== -1,
                  'checkbox-wrapper-disabled': item.disabled ? item.disabled : disabled
                })}
              >
                <span className={classnames({
                  checkbox: true,
                  'checkbox-checked': value.indexOf(item.value) !== -1,
                  'checkbox-disabled': item.disabled ? item.disabled : disabled
                })}
                >
                  <input
                    type="checkbox"
                    placeholder=""
                    checked={value.indexOf(item.value) !== -1}
                    onChange={() => { this.toggleOption(item); }}
                    className="check-input"
                    disabled={item.disabled ? item.disabled : disabled}
                  />
                  <span className="checkbox-inner" />
                </span>
                <span className="check-des">{item.label}</span>
              </label>
            );
          })
        }
      </div>
    );
  }
}
