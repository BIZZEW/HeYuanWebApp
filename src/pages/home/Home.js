import React from 'react'
import utils from '../../common/utils'
import { Carousel } from 'antd';

import 'isomorphic-fetch'
import 'es6-promise'
import styles from './home.scss'

const PREFIX = 'amap-layer';
const cx = utils.classnames(PREFIX, styles);//得到cx方法


function get(url) {
	var result = fetch(url, {
		credentials: 'include',
		headers: {
			'Accept': 'application/json, text/plain, */*'
		}
	})
	return result;
}

class Home extends React.Component {
	render() {
		return <Carousel autoplay>
			<div>
				<img src={require('./images/bg1.jpg')} style={{ "width": "80%", "margin": "10%" }} />
			</div>
			<div>
				<img src={require('./images/bg1.jpg')} style={{ "width": "80%", "margin": "10%" }} />
			</div>
			<div>
				<img src={require('./images/bg1.jpg')} style={{ "width": "80%", "margin": "10%" }} />
			</div>
			<div>
				<img src={require('./images/bg1.jpg')} style={{ "width": "80%", "margin": "10%" }} />
			</div>
			<div>
				<img src={require('./images/bg1.jpg')} style={{ "width": "80%", "margin": "10%" }} />
			</div>
		</Carousel>
	}
}


export default Home