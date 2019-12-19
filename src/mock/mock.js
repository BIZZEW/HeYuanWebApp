import store from '../store'
import { Modal } from 'antd'
import axios from 'axios'
import qs from 'qs'

export const login1 = (loginObject) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			sessionStorage.setItem('userName', loginObject.username);
			sessionStorage.setItem('clientRef', '[{"customer":"1001B1100000000BCPKD","customername":"王长见散装测试","saleorg":"0001A2100000000025EO","saleorgname":"那曲地区纳木措金圆建材有限公司","sendstockorg":"0001A2100000000025EO33333","sendstockorgname":"那曲地区纳木措金圆建材有限公司2222"},{"customer":"1001B1100000000BCPKI","customername":"王长见袋装测试","saleorg":"0001A2100000000025EO","saleorgname":"那曲地区纳木措金圆建材有限公司","sendstockorg":"0001A2100000000025EO","sendstockorgname":"那曲地区纳木措金圆建材有限公司"}]');
			sessionStorage.setItem('cementRef', '[{"code":"1001000037","name":"散装测试","pk_material":"1001B1100000000B4W9K"},{"code":"1001000036","name":"袋装测试","pk_material":"1001B1100000000B4W5B"},{"code":"0101000300","name":"大宗原材料测试","pk_material":"1001B1100000000B5KLK"},{"code":"0101000001","name":"石灰石","pk_material":"1001A210000000001NUF"}]');
			sessionStorage.setItem('companyRef', '[{"code":"000106","name":"河源市金杰环保建材有限公司","pk_salesorg":"0001A2100000000025DX"},{"code":"000107","name":"那曲地区纳木措金圆建材有限公司","pk_salesorg":"0001A2100000000025EO"}]');

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
			// params: qs.stringify(data),
			// params: data,
			data: qs.stringify(data),
			// data: data,
		}).then((response) => {
			if (response.status === 200) {
				let res = response.data;
				if (res.code === 0) {
					sessionStorage.setItem('userName', loginObject.username);

					if (res.result && res.result[0] && res.result[0]) {
						sessionStorage.setItem('clientRef', res.result ? JSON.stringify(res.result) : "");

						// 用默认客户获取水泥品种
						axios({
							url: "/querycemtype",
							method: "get",
							baseURL: baseApi,
							timeout: 5000,
							params: res.result[0],
						}).then((response) => {
							if (response.status === 200) {
								let res2 = response.data;
								if (res2.code === 0) {
									sessionStorage.setItem('cementRef', res2.result ? JSON.stringify(res2.result) : "");
								}
							}
						})

						// 用默认客户获取销售单位
						axios({
							url: "/querysaleunit",
							method: "get",
							baseURL: baseApi,
							timeout: 5000,
							params: res.result[0],
						}).then((response) => {
							if (response.status === 200) {
								let res3 = response.data;
								if (res3.code === 0) {
									sessionStorage.setItem('companyRef', res3.result ? JSON.stringify(res3.result) : "");
								}
							}
						})
					}

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
		}).catch((error) => {
			// console.log("myerror",error);
			reject(error);
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