import store from '../store'
import { Modal } from 'antd'
import axios from 'axios'
import qs from 'qs'

export const login1 = (loginObject) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			sessionStorage.setItem('userName', loginObject.username);
			sessionStorage.setItem('passWord', loginObject.password);
			sessionStorage.setItem('dftstockorg', '{"code": "000106","name": "河源市金杰环保建材有限公司","pk_org": "0001A2100000000025DX"}');
			sessionStorage.setItem('clientRef', '[{"customer":"1001B1100000000BCPKD","customername":"王长见散装测试","saleorg":"0001A2100000000025EO","saleorgname":"那曲地区纳木措金圆建材有限公司","sendstockorg":"0001A2100000000025EO33333","sendstockorgname":"那曲地区纳木措金圆建材有限公司2222"},{"customer":"1001B1100000000BCPKI","customername":"王长见袋装测试","saleorg":"0001A2100000000025EO","saleorgname":"那曲地区纳木措金圆建材有限公司","sendstockorg":"0001A2100000000025EO","sendstockorgname":"那曲地区纳木措金圆建材有限公司"}]');
			sessionStorage.setItem('cementRef', '[{"code":"1001000037","name":"散装测试","pk_material":"1001B1100000000B4W9K"},{"code":"1001000036","name":"袋装测试","pk_material":"1001B1100000000B4W5B"},{"code":"0101000300","name":"大宗原材料测试","pk_material":"1001B1100000000B5KLK"},{"code":"0101000001","name":"石灰石","pk_material":"1001A210000000001NUF"}]');
			sessionStorage.setItem('companyRef', '[{"code":"000106","name":"河源市金杰环保建材有限公司","pk_salesorg":"0001A2100000000025DX"},{"code":"000107","name":"那曲地区纳木措金圆建材有限公司","pk_salesorg":"0001A2100000000025EO"}]');
			sessionStorage.setItem('checkNoRef', '["H4302020010600000001","H4302020010600000002","H4302020010600000003",]');
			sessionStorage.setItem('roles', [1, 2, 3, 4, 40, 41, 42, 5, 6, 7, 8]);

			resolve()
		}, 500)
	})
}

export const login = (loginObject) => {
	let baseApi = 'http://61.164.33.26:5555/service';
	let baseApi0 = 'http://127.0.0.1:99/service';
	let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';
	let baseApi2 = 'http://10.1.8.111:80/service';
	let baseApi3 = 'http://10.1.8.162:8999/service';
	let baseApi4 = 'http://10.1.8.231:80/service';

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
			baseURL: baseApi0,
			timeout: 8000,
			// params: qs.stringify(data),
			// params: data,
			data: qs.stringify(data),
			// data: data,
		}).then((response) => {
			if (response.status === 200) {
				let res = response.data;
				if (res.code === 0) {
					sessionStorage.setItem('userName', loginObject.username);
					sessionStorage.setItem('passWord', loginObject.password);

					if (res.result && res.result[0] && res.result[0]) {
						sessionStorage.setItem('clientRef', res.result ? JSON.stringify(res.result) : "");
						sessionStorage.setItem('pkAppuser', res.pk_appuser ? res.pk_appuser : "");
						sessionStorage.setItem('dftstockorg', res.dfltrcvstockorg ? JSON.stringify(res.dfltrcvstockorg) : "");

						let roles = res.role ? res.role : [];
						let rolesBase = [1, 7, 8];
						sessionStorage.setItem('roles', [...roles, ...rolesBase]);

						let defaultCustomer = res.result[0];

						defaultCustomer.username = loginObject.username;

						// 用默认客户获取水泥品种
						axios({
							url: "/querycemtype",
							method: "get",
							baseURL: baseApi0,
							timeout: 8000,
							params: defaultCustomer,
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
							baseURL: baseApi0,
							timeout: 8000,
							params: defaultCustomer,
						}).then((response) => {
							if (response.status === 200) {
								let res3 = response.data;
								if (res3.code === 0) {
									sessionStorage.setItem('companyRef', res3.result ? JSON.stringify(res3.result) : "");
								}
							}
						})

						// 用默认客户获取对账单号
						axios({
							url: "/querybillno",
							method: "get",
							baseURL: baseApi0,
							timeout: 8000,
							params: defaultCustomer,
						}).then((response) => {
							if (response.status === 200) {
								let res4 = response.data;
								if (res4.code === 0) {
									sessionStorage.setItem('checkNoRef', res4.result ? JSON.stringify(res4.result) : "");
								}
							}
						})
					}

					resolve(res);
				} else {
					Modal.error({
						zIndex: 1002,
						title: '提示',
						content: res.msg
					})
					reject(response.data)
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