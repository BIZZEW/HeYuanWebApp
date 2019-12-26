import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider } from 'antd'
import axios from '../../axios'
import qs from 'qs'
import Utils from '../../utils/utils'
import BaseForm from '../../components/BaseForm'
import ETable from '../../components/ETable'
import 'moment/locale/zh-cn';
import moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;

moment.locale('zh-cn');

export default class User extends React.Component {

	state = {
	}

	componentDidMount() {
		// this.requestList();
	}

	render() {
		return (
			<UserForm wrappedComponentRef={(inst) => { this.userForm = inst; }} />
		)
	}
}

//子组件：创建员工表单
class UserForm extends React.Component {

	//确认修改密码
	handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let data = this.props.form.getFieldsValue();
				data.username = sessionStorage.getItem('userName');
				axios.changePwd(this, '/modify', qs.stringify(data));
			}
		})
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 }
		}
		return (
			<Form onSubmit={this.handleSubmit} className="login-form" style={{
				"max-width": "500px",
				"margin": "100px auto",
				"padding": "20px 50px 0px 50px",
				"border": "1px solid #d9d9d9",
				"border-radius": "10px"
			}} layout={"horizontal"} >
				{/* <FormItem label="旧密码" {...formItemLayout}>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: '旧密码' }],
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							placeholder="旧密码"
						/>,
					)}
				</FormItem> */}
				< FormItem label="新密码" {...formItemLayout} >
					{
						getFieldDecorator('password', {
							rules: [{ required: true, message: '请输入新密码' }],
						})(
							<Input
								prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
								type="password"
								placeholder="新密码"
							/>,
						)}
				</FormItem>
				<FormItem>
					<Button type="primary" htmlType="submit" className="login-form-button" style={{ "margin": "0 40%", "width": "20%" }}>
						提交
					</Button>
				</FormItem>
			</Form >
		)
	}
}
UserForm = Form.create({})(UserForm);