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
const { RangePicker } = DatePicker;

export default class OnlineCheck extends React.Component {

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
			width: 200,
			list: sessionStorage.getItem('clientRef'),
			idKey: "customer",
			valueKey: "customername"
		},
		{
			type: 'INPUT',
			label: '对账单号',
			field: 'checkOrderId',
			placeholder: '请输入对账单号',
			width: 200
		},
		{
			type: 'DATERANGE',
			label: '对账日期',
			field: 'date',
			placeholder: '请输入日期'
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

	calTableHeight = () => {
		let clientHeight = document.body.clientHeight;
		let headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
		let tabsHeight = document.getElementsByClassName('ant-tabs-nav-scroll')[0].offsetHeight;
		let cardHeight = 65;
		let gapsHeight = 25;
		let headernfooterHeight = 120;
		let paginationHeight = 65;
		let tableHeight = clientHeight - headerHeight - tabsHeight - cardHeight - gapsHeight - headernfooterHeight - paginationHeight;
		console.log("tableHeight: " + tableHeight + " clientHeight: " + clientHeight + " headerHeight: " + headerHeight + " tabsHeight: " + tabsHeight);
		return tableHeight;
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
		// 	dataIndex: 'vehicle',
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
				{/* <Card style={{ marginTop: 10 }} className="operate-wrap">
					<Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>新增</Button>
					<Button type="primary" icon="delete" onClick={() => this.handleOperate('delete')}>删除</Button>
				</Card> */}
				<div className="content-wrap">
					<ETable
						columns={columns}
						updateSelectedItem={Utils.updateSelectedItem.bind(this)}
						selectedRowKeys={this.state.selectedRowKeys}
						selectedItem={this.state.selectedItem}
						dataSource={this.state.list}
						pagination={this.state.pagination}
						scroll={{ y: this.calTableHeight() }}
						footer={() => {
							return <div>
								<Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>新增</Button>
								<Button type="primary" icon="delete" style={{ marginLeft: "10px" }} onClick={() => this.handleOperate('delete')}>删除</Button>
							</div>
						}}
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
				<FormItem label="对账单号" {...formItemLayout}>
					{
						type == 'detail' ? userInfo.orderId :
							getFieldDecorator('orderId', {
								initialValue: userInfo.orderId
							})(
								<Input type="text" placeholder="请输入对账单号" />
							)
					}
				</FormItem>
				<FormItem label="对账日期" {...formItemLayout}>
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

				<FormItem label="起止日期" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.lastBalance) :
							getFieldDecorator('lastBalance', {
								initialValue: userInfo.lastBalance
							})(
								<RangePicker />
								// <RangePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
							)
					}
				</FormItem>

				<FormItem label="上期余额" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.lastBalance) :
							getFieldDecorator('lastBalance', {
								initialValue: userInfo.lastBalance
							})(
								<InputNumber min={1} defaultValue={0} />
							)
					}
				</FormItem>

				<FormItem label="本期应收款" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.currentShouldcome) :
							getFieldDecorator('currentShouldcome', {
								initialValue: userInfo.currentShouldcome
							})(
								<InputNumber min={1} defaultValue={0} />
							)
					}
				</FormItem>

				<FormItem label="本期已收款" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.currentIncome) :
							getFieldDecorator('currentIncome', {
								initialValue: userInfo.currentIncome
							})(
								<InputNumber min={1} defaultValue={0} />
							)
					}
				</FormItem>

				<FormItem label="本期余额" {...formItemLayout}>
					{
						type == 'detail' ? this.getState(userInfo.currentBalance) :
							getFieldDecorator('currentBalance', {
								initialValue: userInfo.currentBalance
							})(
								<InputNumber min={1} defaultValue={0} />
							)
					}
				</FormItem>

			</Form>
		)
	}
}
UserForm = Form.create({})(UserForm);