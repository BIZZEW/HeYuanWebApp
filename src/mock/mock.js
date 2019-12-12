import store from '../store'
import { Modal } from 'antd'
import axios from 'axios'
import qs from 'qs'

export const login = (loginObject) => {
	let baseApi = 'http://127.0.0.1:99';
	let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';

	return new Promise((resolve, reject) => {
		let data = {
			"username": loginObject.username,
			"password": loginObject.password
		}

		axios({
			url: "/login",
			method: 'post',
			baseURL: baseApi,
			timeout: 5000,
			data: qs.stringify(data),
		}).then((response) => {
			if (response.status === 200) {
				let res = response.data;
				if (res.code === 0) {
					sessionStorage.setItem('userName', loginObject.username)
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