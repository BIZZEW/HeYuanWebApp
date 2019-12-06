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
			<Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
				<FormItem>
					{getFieldDecorator('userName', {
						rules: [{ required: true, message: '请输入用户名!' }],
					})(
						<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: '请输入密码!' }],
					})(
						<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('remember', {
						valuePropName: 'checked',
						initialValue: true,
					})(
						<Checkbox>记住密码</Checkbox>
					)}
					<a className="login-form-forgot" href="">忘记密码</a>
					<Button type="primary" htmlType="submit" className="login-form-button"
						loading={this.isLogging ? true : false}>
						{this.isLogging ? '登录中' : '登录'}
					</Button>
					{/* Or <a href="">register now!</a> */}
				</FormItem>
			</Form>
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
