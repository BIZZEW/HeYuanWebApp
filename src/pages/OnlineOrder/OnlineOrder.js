import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider } from 'antd'
import axios from './../../axios'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import ETable from './../../components/ETable'
import moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;

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
			placeholder: '请选择水泥品种',
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
			<div>
				<Card>
					<BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
				</Card>
				<Card style={{ marginTop: 10 }} className="operate-wrap">
					<Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>新增</Button>
					{/* <Button type="primary" icon="edit" onClick={() => this.handleOperate('edit')}>编辑员工</Button>
					<Button type="primary" onClick={() => this.handleOperate('detail')}>员工详情</Button> */}
					<Button type="primary" icon="delete" onClick={() => this.handleOperate('delete')}>删除</Button>
					<Button type="primary" icon="stop" onClick={() => this.handleOperate('delete')}>作废</Button>
				</Card>
				<div className="content-wrap">
					<ETable
						columns={columns}
						updateSelectedItem={Utils.updateSelectedItem.bind(this)}
						selectedRowKeys={this.state.selectedRowKeys}
						selectedItem={this.state.selectedItem}
						dataSource={this.state.list}
						pagination={this.state.pagination}
					/>
				</div>
				<Modal
					title={this.state.title}
					visible={this.state.isVisible}
					onOk={this.handleSubmit}
					onCancel={() => {
						this.userForm.props.form.resetFields();
						this.setState({
							isVisible: false
						})
					}}
					width={600}
					{...footer}
				>
					<UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst) => { this.userForm = inst; }} />
				</Modal>
			</div>
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

	render() {
		let type = this.props.type;
		let userInfo = this.props.userInfo || {};
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		}
		return (
			<Form layout="horizontal">
				<FormItem label="订单号" {...formItemLayout}>
					{
						type == 'detail' ? userInfo.orderId :
							getFieldDecorator('orderId', {
								initialValue: userInfo.orderId
							})(
								<Input type="text" placeholder="请输入订单号" />
							)
					}
				</FormItem>
				<FormItem label="日期" {...formItemLayout}>
					{
						type == 'detail' ? userInfo.date :
							getFieldDecorator('date', {
								initialValue: moment(userInfo.date)
							})(
								<DatePicker format="YYYY-MM-DD" />
							)
					}
				</FormItem>
				<FormItem label="客户" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.client) :
							getFieldDecorator('client', {
								initialValue: userInfo.client || undefined
							})(
								<Select
									placeholder={"请选择客户"}>
									<Option value={1}>特朗普</Option>
									<Option value={2}>普京</Option>
									<Option value={3}>默克尔</Option>
									<Option value={4}>马克龙</Option>
									<Option value={5}>安倍</Option>
								</Select>
							)
					}
				</FormItem>
				<FormItem label="销售单位" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.company) :
							getFieldDecorator('company', {
								initialValue: userInfo.company || undefined
							})(
								<Select
									placeholder={"请选择销售单位"}>
									<Option value={1}>米粒坚</Option>
									<Option value={2}>鹅螺蛳</Option>
									<Option value={3}>德锅</Option>
									<Option value={4}>法锅</Option>
									<Option value={5}>日崩</Option>
								</Select>
							)
					}
				</FormItem>

				<Divider />

				<FormItem label="水泥品种" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.cementType) :
							getFieldDecorator('cementType', {
								initialValue: userInfo.cementType || undefined
							})(
								<Select
									placeholder={"请选择水泥品种"}>
									<Option value={1}>一级水泥</Option>
									<Option value={2}>二级水泥</Option>
									<Option value={3}>三级水泥</Option>
									<Option value={4}>四级水泥</Option>
									<Option value={5}>五级水泥</Option>
								</Select>
							)
					}
				</FormItem>
				<FormItem label="数量" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.amount) :
							getFieldDecorator('amount', {
								initialValue: userInfo.amount
							})(
								<InputNumber min={1} defaultValue={0} />
							)
					}
				</FormItem>
				<FormItem label="单位" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.unit) :
							getFieldDecorator('unit', {
								initialValue: userInfo.unit
							})(
								<Input type="text" placeholder="请输入单位" />
							)
					}
				</FormItem>
				<FormItem label="车牌号" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.plateNum) :
							getFieldDecorator('plateNum', {
								initialValue: userInfo.plateNum
							})(
								<Input type="text" placeholder="请输入车牌号" />
							)
					}
				</FormItem>
				<FormItem label="司机姓名" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.driver) :
							getFieldDecorator('driver', {
								initialValue: userInfo.driver
							})(
								<Input type="text" placeholder="请输入司机姓名" />
							)
					}
				</FormItem>
				<FormItem label="手机号" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.phoneNumber) :
							getFieldDecorator('phoneNumber', {
								initialValue: userInfo.phoneNumber
							})(
								<Input type="text" placeholder="请输入手机号" />
							)
					}
				</FormItem>
				<FormItem label="身份证" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.IdNumber) :
							getFieldDecorator('IdNumber', {
								initialValue: userInfo.IdNumber
							})(
								<Input type="text" placeholder="请输入身份证" />
							)
					}
				</FormItem>
				{/* <FormItem label="用户名" {...formItemLayout}>
					{
						type == 'detail' ? userInfo.userName :
							getFieldDecorator('user_name', {
								initialValue: userInfo.userName
							})(
								<Input type="text" placeholder="请输入用户名" />
							)
					}
				</FormItem>
				<FormItem label="性别" {...formItemLayout}>
					{
						type == 'detail' ? userInfo.sex == 1 ? '男' : '女' :
							getFieldDecorator('sex', {
								initialValue: userInfo.sex
							})(
								<RadioGroup>
									<Radio value={1}>男</Radio>
									<Radio value={2}>女</Radio>
								</RadioGroup>
							)
					}
				</FormItem>
				<FormItem label="状态" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.state) :
							getFieldDecorator('state', {
								initialValue: userInfo.state
							})(
								<Select>
									<Option value={1}>咸鱼一条</Option>
									<Option value={2}>风华浪子</Option>
									<Option value={3}>北大才子一枚</Option>
									<Option value={4}>百度FE</Option>
									<Option value={5}>创业者</Option>
								</Select>
							)
					}
				</FormItem>
				<FormItem label="生日" {...formItemLayout}>
					{
						type == 'detail' ? userInfo.birthday :
							getFieldDecorator('birthday', {
								initialValue: moment(userInfo.birthday)
							})(
								<DatePicker format="YYYY-MM-DD" />
							)
					}
				</FormItem>
				<FormItem label="联系地址" {...formItemLayout}>
					{
						type == 'detail' ? userInfo.address :
							getFieldDecorator('address', {
								initialValue: userInfo.address
							})(
								<TextArea rows={3} placeholder="请输入联系地址" />
							)
					}
				</FormItem> */}
			</Form>
		)
	}
}
UserForm = Form.create({})(UserForm);