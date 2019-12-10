import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import 'font-awesome/css/font-awesome.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

ReactDOM.render(<ConfigProvider locale={zhCN}><App /></ConfigProvider>, document.getElementById('root'));
registerServiceWorker();
