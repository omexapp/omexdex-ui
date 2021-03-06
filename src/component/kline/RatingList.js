import React, { Component } from 'react';
import { toLocale } from '_src/locale/react-locale';
import Loading from '_component/Loading';
import moment from 'moment';
import './ReportList.less';

class RatingList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { dataSource, loading, projectId } = this.props;
    return (
      <div className="report-list-container">
        <Loading when={loading} />
        <ul>
          {
            dataSource.map(({
                              title, publishTime: createTime, url: accessory
                            }, index) => {
              return (
                <li key={index}>
                  <a href={accessory} target="_blank" rel="noopener noreferrer">
                    <span title={title}><label>{toLocale('spot.kline.tabs[3]')}</label><span className="splitter" />{title}</span>
                    <span>{moment(createTime).format('YYYY-MM-DD')}</span>
                  </a>
                </li>
              );
            })
          }
        </ul>
        {!loading && dataSource.length === 0 && <div className="no-data">{toLocale('spot.noData')}</div>}
        {!loading && dataSource.length > 0 && projectId && <a className="more" href={`/project/${projectId}?tab=2`}>{toLocale('spot.kline.tabs[3].more')}&nbsp;&gt;</a>}
      </div>
    );
  }
}

export default RatingList;
