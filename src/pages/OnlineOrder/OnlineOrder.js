import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table } from 'antd'
import axios from './../../axios'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import ETable from './../../components/ETable'
import moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { Search } = Input;

export default class User extends React.Component {

	state = {
		list: [],
		isVisible: false,
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
			initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].customername) : undefined,
			list: sessionStorage.getItem('clientRef'),
			idKey: "customer",
			valueKey: "customername"
		},
		{
			type: 'SELECT',
			label: '水泥品种',
			field: 'cementType',
			placeholder: '请选择水泥品种',
			width: 200,
			list: sessionStorage.getItem('clientRef2'),
			idKey: "customer",
			valueKey: "customername"
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
			placeholder: '请选择车辆状态',
			width: 200,
			list: sessionStorage.getItem('clientRef3'),
			idKey: "customer",
			valueKey: "customername"
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
		axios.requestList(this, '/mock', this.params);
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
		this.userForm.props.form.validateFields((err, values) => {
			if (!err) {
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
		});
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
	state = {
		isVisible2: false,
		list: [],
		selectedRowKeys: null,
		selectedRows: null
	}

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

	getDriverOptions = (value) => {
		let _this = this;
		this.props.form.validateFields(["vehicle"], (err, values) => {
			if (!err) {
				let param = _this.props.form.getFieldsValue(["vehicle"]);
				axios.getDriverInfo(this, '/querydriver', param);
			}
		})
	}

	handleSubmit = () => {
		this.setState({ isVisible2: false });
		this.props.form.setFieldsValue({ 'driver': this.state.selectedRowKeys.drivername });
		this.props.form.setFieldsValue({ 'phoneNumber': this.state.selectedRowKeys.telphone });
		this.props.form.setFieldsValue({ 'IDNumber': this.state.selectedRowKeys.driveridentity });
	}

	render() {
		let type = this.props.type;
		let userInfo = this.props.userInfo || {};
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		}

		const rowRadioSelection = {
			type: 'radio',
			columnTitle: "",
			onSelect: (selectedRowKeys, selectedRows) => {
				this.setState({ selectedRowKeys, selectedRows })
			},
		}

		const columns = [
			{
				title: '姓名',
				dataIndex: 'drivername'
			}, {
				title: '手机号',
				dataIndex: 'telphone',
			}, {
				title: '身份证',
				dataIndex: 'driveridentity',
			},
		];

		return (
			<div>
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
										{Utils.getOptionList({
											list: sessionStorage.getItem('clientRef'),
											idKey: "customer",
											valueKey: "customername"
										})}
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

					<Divider />

					<FormItem label="车牌号" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.vehicle) :
								getFieldDecorator('vehicle', {
									initialValue: userInfo.vehicle,
									rules: [
										{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '请输入有效的车牌号!' },
										{ required: true, message: '请输入车牌!' }
									],
								})(
									// <Search type="text" placeholder="请输入车牌号" />

									<Search
										placeholder="请输入车牌号"
										enterButton="获取"
										// size="large"
										onSearch={value => this.getDriverOptions(value)}
									/>
								)
						}
					</FormItem>
					<FormItem label="司机姓名" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.driver) :
								getFieldDecorator('driver', {
									initialValue: userInfo.driver,
									rules: [{ required: true, message: '请获取司机信息!' }],
								})(
									<Input type="text" placeholder="请获取司机信息" disabled />
								)
						}
					</FormItem>
					<FormItem label="手机号" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.phoneNumber) :
								getFieldDecorator('phoneNumber', {
									initialValue: userInfo.phoneNumber,
									rules: [{ required: true, message: '请获取司机信息!' }],
								})(
									<Input type="text" placeholder="请获取司机信息" disabled />
								)
						}
					</FormItem>
					<FormItem label="身份证" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.IdNumber) :
								getFieldDecorator('IDNumber', {
									initialValue: userInfo.IdNumber,
									rules: [{ required: true, message: '请获取司机信息!' }],
								})(
									<Input type="text" placeholder="请获取司机信息" disabled />
								)
						}
					</FormItem>
				</Form>

				<Modal
					title={this.state.title2}
					visible={this.state.isVisible2}
					onOk={this.handleSubmit}
					onCancel={() => {
						// this.userForm.props.form.resetFields();
						this.setState({
							isVisible2: false
						})
					}}
					width={1000}
				// {...footer}
				>
					<div className="content-wrap">
						<Table
							bordered
							columns={columns}
							dataSource={this.state.list}
							rowSelection={rowRadioSelection}
							pagination={false}
						// rowKey={dataSource => dataSource.openid}
						/>
					</div>
				</Modal>
			</div>
		)
	}
}
UserForm = Form.create({})(UserForm);