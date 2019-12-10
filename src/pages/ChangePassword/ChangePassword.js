import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider } from 'antd'
import axios from '../../axios'
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
		list: [],
		isVisible: false
	}

	params = {
		page: 1
	}

	formList = [
		{
			type: 'SELECT',
			label: '客户',
			field: 'client',
			placeholder: '请选择客户',
			width: 130,
			list: [
				{ "id": 0, "name": "特朗普" },
				{ "id": 1, "name": "马克龙" },
				{ "id": 2, "name": "普京" },
				{ "id": 3, "name": "默克尔" },
			]
		},
		{
			type: 'SELECT',
			label: '水泥品种',
			field: 'cementType',
			placeholder: '请输入手机号',
			width: 130
		},
		{
			type: 'DATERANGE',
			label: '日期',
			field: 'date',
			placeholder: '请输入日期'
		},
		{
			type: 'SELECT',
			label: '车辆状态',
			field: 'vehicleStatus',
			placeholder: '请输入手机号',
			width: 130
		},
	]

	componentDidMount() {
		// this.requestList();
	}

	handleFilter = (params) => {
		this.params = params;
		this.requestList();
	}

	requestList = () => {
		axios.requestList(this, '/table/list1', this.params);
	}

	//功能区操作
	handleOperate = (type) => {
		let item = this.state.selectedItem;
		if (type == 'create') {
			this.setState({
				type,
				isVisible: true,
				title: '新增'
			})
		} else if (type == 'edit') {
			if (!item) {
				Modal.info({
					title: '提示',
					content: '请选择一个用户'
				})
				return;
			}
			this.setState({
				type,
				isVisible: true,
				title: '编辑员工',
				userInfo: item
			})
		} else if (type == 'detail') {
			if (!item) {
				Modal.info({
					title: '提示',
					content: '请选择一个用户'
				})
				return;
			}
			this.setState({
				type,
				isVisible: true,
				title: '员工详情',
				userInfo: item
			})
		} else if (type == 'delete') {
			if (!item) {
				Modal.info({
					title: '提示',
					content: '请选择一个用户'
				})
				return;
			}
			let _this = this;
			Modal.confirm({
				title: '确认删除',
				content: `是否要删除当前选中的员工${item.id}`,
				onOk() {
					axios.ajax({
						url: '/user/delete',
						data: {
							params: {
								id: item.id
							}
						}
					}).then((res) => {
						if (res.code === 0) {
							_this.setState({
								isVisible: false
							})
							_this.requestList();
						}
					})
				}
			})
		}
	}

	//创建编辑员工提交
	handleSubmit = () => {
		let type = this.state.types;
		let data = this.userForm.props.form.getFieldsValue();
		axios.ajax({
			url: type == 'create' ? '/user/add' : '/user/edit',
			data: {
				params: data
			}
		}).then((res) => {
			if (res.code === 0) {
				this.userForm.props.form.resetFields();
				this.setState({
					isVisible: false
				})
				this.requestList();
			}
		})
	}

	render() {
		const columns = [{
			title: 'id',
			dataIndex: 'id'
		}, {
			title: '用户名',
			dataIndex: 'userName'
		}, {
			title: '性别',
			dataIndex: 'sex',
			render(sex) {
				return sex == 1 ? '男' : '女'
			}
		}, {
			title: '状态',
			dataIndex: 'state',
			render(state) {
				let config = {
					'1': '咸鱼一条',
					'2': '风华浪子',
					'3': '北大才子一枚',
					'4': '百度FE',
					'5': '创业者'
				}
				return config[state];
			}
		}, {
			title: '婚姻',
			dataIndex: 'isMarried',
			render(isMarried) {
				return isMarried == 1 ? '已婚' : '未婚'
			}
		}, {
			title: '生日',
			dataIndex: 'birthday'
		}, {
			title: '联系地址',
			dataIndex: 'address'
		}, {
			title: '早起时间',
			dataIndex: 'time'
		},
		{
			title: '操作',
			key: 'action',
			render: (text, record) => (
				<span>
					<a>详情 {record.name}</a>
					{/* <Divider type="vertical" /> */}
					<a>编辑</a>
				</span>
			),
		},
		];


		// const columns = [{
		// 	title: 'id',
		// 	dataIndex: 'id'
		// },
		// {
		// 	title: '客户',
		// 	dataIndex: 'client'
		// },
		// {
		// 	title: '日期',
		// 	dataIndex: 'date'
		// },
		// {
		// 	title: '物料',
		// 	dataIndex: 'material'
		// },
		// {
		// 	title: '数量',
		// 	dataIndex: 'amount'
		// },
		// {
		// 	title: '数量',
		// 	dataIndex: 'amount'
		// },
		// {
		// 	title: '过皮状态',
		// 	dataIndex: 'status',
		// },
		// {
		// 	title: '车号',
		// 	dataIndex: 'platenum',
		// },

		// 	// {
		// 	// 	title: '状态',
		// 	// 	dataIndex: 'state',
		// 	// 	render(state) {
		// 	// 		let config = {
		// 	// 			'1': '咸鱼一条',
		// 	// 			'2': '风华浪子',
		// 	// 			'3': '北大才子一枚',
		// 	// 			'4': '百度FE',
		// 	// 			'5': '创业者'
		// 	// 		}
		// 	// 		return config[state];
		// 	// 	}
		// 	// }, {
		// 	// 	title: '婚姻',
		// 	// 	dataIndex: 'isMarried',
		// 	// 	render(isMarried) {
		// 	// 		return isMarried == 1 ? '已婚' : '未婚'
		// 	// 	}
		// 	// }, {
		// 	// 	title: '生日',
		// 	// 	dataIndex: 'birthday'
		// 	// }, {
		// 	// 	title: '联系地址',
		// 	// 	dataIndex: 'address'
		// 	// }, {
		// 	// 	title: '早起时间',
		// 	// 	dataIndex: 'time'
		// 	// }
		// ];

		let footer = {};
		if (this.state.type == 'detail') {
			footer = {
				footer: null
			}
		}

		return (
			<UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst) => { this.userForm = inst; }} />
		)
	}
}

//子组件：创建员工表单
class UserForm extends React.Component {

	getState = (state) => {
		let config = {
			'1': '咸鱼一条',
			'2': '风华浪子',
			'3': '北大才子一枚',
			'4': '百度FE',
			'5': '创业者'
		}
		return config[state];
	}

	//创建编辑员工提交
	handleSubmit = () => {
		let type = this.state.types;
		let data = this.userForm.props.form.getFieldsValue();
		axios.ajax({
			url: type == 'create' ? '/user/add' : '/user/edit',
			data: {
				params: data
			}
		}).then((res) => {
			if (res.code === 0) {
				this.userForm.props.form.resetFields();
				this.setState({
					isVisible: false
				})
				this.requestList();
			}
		})
	}

	render() {
		let _this = this;
		let type = this.props.type;
		let userInfo = this.props.userInfo || {};
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		}
		return (
			<Form onSubmit={this.handleSubmit} className="login-form" style={{
				"max-width": "500px",
				"margin": "100px auto",
				"padding": "20px 50px",
				"border": "1px solid #d9d9d9",
				"border-radius": "10px"
			}}>
				<FormItem label="旧密码">
					{getFieldDecorator('username', {
						rules: [{ required: true, message: '旧密码' }],
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							placeholder="旧密码"
						/>,
					)}
				</FormItem>
				<FormItem label="新密码">
					{getFieldDecorator('password', {
						rules: [{ required: true, message: '新密码' }],
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							placeholder="新密码"
						/>,
					)}
				</FormItem>
				<FormItem>
					<Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSubmit}>
						提交
					</Button>
				</FormItem>
			</Form>
		)
	}
}
UserForm = Form.create({})(UserForm);