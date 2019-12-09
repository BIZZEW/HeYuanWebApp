import React from 'react'
import './Login.css'
import { login } from '../../mock/mock'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
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
				login(values).then(() => {
					this.isLogging = false;
					let toPath = this.props.toPath === '' ? '/layout/home' : this.props.toPath
					this.props.history.push(toPath);
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
						<h1 style={{ "marginBottom": "40px"}}>金圆销售管理系统</h1>

						<Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
							<FormItem>
								{getFieldDecorator('userName', {
									rules: [{ required: true, message: '请输入用户名!' }],
								})(
									<Input placeholder="用户名" AUTOCOMPLETE="off" />
								)}
							</FormItem>
							<FormItem>
								{getFieldDecorator('password', {
									rules: [{ required: true, message: '请输入密码!' }],
								})(
									<Input type="password" placeholder="密码" AUTOCOMPLETE="off" />
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

export default withRouter(connect(
	loginState
)(WrappedNormalLoginForm))
