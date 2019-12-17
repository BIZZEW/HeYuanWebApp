import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider } from 'antd'
import axios from '../../../axios'
import Utils from '../../../utils/utils'
import BaseForm from '../../../components/BaseForm'
import ETable from '../../../components/ETable'
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
			type: 'DATERANGE',
			label: '对账日期',
			field: 'date',
			placeholder: '请输入日期'
		},
		{
			type: 'SELECT',
			label: '客户',
			field: 'client',
			placeholder: '请选择客户',
			width: 200,
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
			placeholder: '请输入水泥品种',
			width: 200,
			list: [
				{ "id": 0, "name": "一级水泥" },
				{ "id": 1, "name": "二级水泥" },
				{ "id": 2, "name": "三级水泥" },
				{ "id": 3, "name": "四级水泥" },
			]
		},
		{
			type: 'INPUT',
			label: '车号',
			field: 'vehicle',
			placeholder: '请输入车号',
			width: 200
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
		} else if (type == 'export') {
			var data3 = [{ "id": 10000, "username": "user-0", "sex": "女", "city": "城市-0", "sign": "签名-0", "experience": 255, "logins": 24 },
			{ "id": 10001, "username": "user-1", "sex": "男", "city": "城市-1", "sign": "签名-1", "experience": 884, "logins": 58 },
			{ "id": 10002, "username": "user-2", "sex": "女", "city": "城市-2", "sign": "签名-2", "experience": 650, "logins": 77 }]

			//自定义标题栏
			var title = ['用户名', '性别', '城市', '签名', '经验']
			//自定义过滤栏（不需要导出的行）
			var filter = ['id', 'logins']

			//原始导出
			Utils.JSONToExcelConvertor(data3, "report");
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
				<div className="content-wrap">
					<ETable
						columns={columns}
						updateSelectedItem={Utils.updateSelectedItem.bind(this)}
						selectedRowKeys={this.state.selectedRowKeys}
						selectedItem={this.state.selectedItem}
						dataSource={this.state.list}
						pagination={this.state.pagination}
						scroll={{ y: this.calTableHeight() }}
						// bordered={true}
						footer={() => {
							return <div>
								<Button type="primary" icon="file-excel" onClick={() => this.handleOperate('export')}>导出</Button>
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
								initialValue: userInfo.client
							})(
								<Select>
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
								initialValue: userInfo.company
							})(
								<Select>
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
								initialValue: userInfo.cementType
							})(
								<Select>
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
						type == 'detail' ? this.getState(userInfo.vehicle) :
							getFieldDecorator('vehicle', {
								initialValue: userInfo.vehicle
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