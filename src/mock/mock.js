import store from '../store'
import { Modal } from 'antd';
import axios from 'axios'

export const login = (loginObject) => {
	let baseApi = 'http://10.1.9.94:99'

	return new Promise((resolve, reject) => {
		// setTimeout(() => {
		// 	sessionStorage.setItem('username',loginObject.username)
		// 	resolve()
		// }, 500)

		let params = new URLSearchParams();
		params.append('username', loginObject.username);
		params.append('password', loginObject.password);

		axios({
			url: "/login",
			method: 'post',
			baseURL: baseApi,
			timeout: 5000,
			data: params
		}).then((response) => {
			if (response.status === 200) {
				let res = response.data;
				if (res.code === 0) {
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