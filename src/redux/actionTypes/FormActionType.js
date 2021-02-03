const FormActionType = {
  UPDATE_TYPE: 'UPDATE_TYPE', // 更新买卖类型
  UPDATE_STRATEGY_TYPE: 'UPDATE_STRATEGY_TYPE', // 更新委托类型
  UPDATE_INPUT: 'UPDATE_INPUT', // 更新input值
  UPDATE_DEPTH_INPUT: 'UPDATE_DEPTH_INPUT', // 更新input值 from depth
  UPDATE_PLAN_INPUT: 'UPDATE_PLAN_INPUT', // 更新计划委托input值
  UPDATE_TRACK_INPUT: 'UPDATE_TRACK_INPUT', // 更新跟踪委托input值
  UPDATE_ICEBERG_INPUT: 'UPDATE_ICEBERG_INPUT', // 更新冰山委托input值
  UPDATE_TIME_WEIGHT_INPUT: 'UPDATE_TIME_WEIGHT_INPUT', // 更新时间加权委托input值

  UPDATE_WARNING: 'UPDATE_WARNING', // 更新错误提示
  SUBMIT_ORDER: 'SUBMIT_ORDER', // 提交表单
  SUBMIT_ORDER_SUCCESS: 'SUBMIT_ORDER_SUCCESS', // 下单成功
  SUBMIT_ORDER_ERROR: 'SUBMIT_ORDER_ERROR', // 下单失败
  DISABLED_SUBMIT: 'DISABLED_SUBMIT' // 禁用下单按钮
};
export default FormActionType;