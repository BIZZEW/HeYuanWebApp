import React from 'react'
import './Login.css'
import { login } from '../../mock/mock'
import { login1 } from '../../mock/mock'
import { Form, Input, Button, Modal, notification } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.isLogging = false;
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.isLogging = true;
				login1(values).then((response) => {
					this.isLogging = false;
					let toPath = this.props.toPath === '' ? '/layout/home' : this.props.toPath
					this.props.history.push(toPath);
					notification["warning"]({
						message: '提示',
						description: '操作过程中如刷新页面将会清空数据。',
						duration: 5,
					});
					notification["info"]({
						message: '提示',
						description: '请尽量使用Chrome浏览器以获得较好的体验。',
						duration: 5,
					});
				}).catch((error) => {
					console.log("loginError", error);

					if (String(error).toLowerCase().indexOf('timeout') != -1) {
						Modal.info({
							title: '提示',
							content: '服务器繁忙，请稍后重试'
						})
					} else if (String(error).toLowerCase().indexOf('network') != -1) {
						Modal.info({
							title: '提示',
							content: '服务器问失败，请稍后重试'
						})
					}

					this.isLogging = false;
					this.forceUpdate();
				})
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="wallpaper">
				<div className="wrapper">
					<div className="container">
						<h1 style={{ "marginBottom": "40px" }}>金圆销售管理系统</h1>

						<Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
							<FormItem>
								{getFieldDecorator('username', {
									rules: [{ required: true, message: '请输入用户名!' }],
								})(
									<Input placeholder="用户名" autoComplete="off" />
								)}
							</FormItem>
							<FormItem>
								{getFieldDecorator('password', {
									rules: [{ required: true, message: '请输入密码!' }],
								})(
									<Input type="password" placeholder="密码" autoComplete="off" />
								)}
							</FormItem>
							<FormItem>
								{/* <a className="login-form-forgot" href="">忘记密码</a> */}
								<Button type="primary" htmlType="submit" className="login-form-button"
									loading={this.isLogging ? true : false}>
									{this.isLogging ? '登录中' : '登\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0录'}
								</Button>
								{/* Or <a href="">register now!</a> */}
							</FormItem>
							{/* <FormItem>
							{getFieldDecorator('remember', {
								valuePropName: 'checked',
								initialValue: true,
							})(
								<Checkbox>记住密码</Checkbox>
							)}
						</FormItem> */}
						</Form>

					</div>

					<ul className="bg-bubbles">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
					</ul>
				</div>
			</div>
		);
	}
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

const loginState = ({ loginState }) => ({
	toPath: loginState.toPath
})

// 路由 + 状态 + 组件
export default withRouter(connect(loginState)(WrappedNormalLoginForm))
