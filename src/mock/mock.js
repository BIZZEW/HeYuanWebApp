import store from '../store'
import { Modal } from 'antd'
import axios from 'axios'
import qs from 'qs'

export const login1 = (loginObject) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			sessionStorage.setItem('userName', loginObject.username);
			sessionStorage.setItem('clientRef', '[{"customer":"1001B1100000000BCPKD","customername":"王长见散装测试","saleorg":"0001A2100000000025EO","saleorgname":"那曲地区纳木措金圆建材有限公司","sendstockorg":"0001A2100000000025EO","sendstockorgname":"那曲地区纳木措金圆建材有限公司"},{"customer":"1001B1100000000BCPKI","customername":"王长见袋装测试","saleorg":"0001A2100000000025EO","saleorgname":"那曲地区纳木措金圆建材有限公司","sendstockorg":"0001A2100000000025EO","sendstockorgname":"那曲地区纳木措金圆建材有限公司"}]');
			resolve()
		}, 500)
	})
}

export const login = (loginObject) => {
	let baseApi = 'http://127.0.0.1:99/cusapl';
	let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';

	return new Promise((resolve, reject) => {

		// sessionStorage.setItem('userName', loginObject.username)
		// resolve();

		let data = {
			"username": loginObject.username,
			"password": loginObject.password
		}

		axios({
			url: "/login",
			method: 'post',
			baseURL: baseApi,
			timeout: 5000,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
			},
			data: qs.stringify(data),
		}).then((response) => {
			if (response.status === 200) {
				let res = response.data;
				if (res.code === 0) {
					sessionStorage.setItem('userName', loginObject.username);
					sessionStorage.setItem('clientRef', res.result ? JSON.stringify(res.result) : "");
					resolve(res);
				} else {
					Modal.info({
						title: '提示',
						content: res.msg
					})
				}
			} else {
				reject(response.data)
			}
		})
	})
}

export const logout = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			store.dispatch({
				type: 'SET_LOGGED_USER',
				logged: false
			})
			resolve()
		}, 500)
	})
}