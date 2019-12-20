import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table, Col, Row } from 'antd'
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
		list1: [],
		isVisible: false,
		level: true,
	}

	params = {
		page: 1
	}

	params1 = {
		page1: 1
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
		this.requestList();
	}

	handleFilter = (params) => {
		this.params = params;
		this.requestList();
	}

	requestList = () => {
		axios.requestList(this, '/table/list1', this.params);
	}

	// 对账单详情的获取Ï
	requestList1 = () => {
		axios.requestList1(this, '/table/list2', this.params1);
	}

	//功能区操作
	handleOperate = (type, index) => {
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
			this.setState({
				level: false
			})

			this.requestList1();

			// this.goDetail(this.state.list[index]);



			// if (!item) {
			// 	Modal.info({
			// 		title: '提示',
			// 		content: '请选择一个用户'
			// 	})
			// 	return;
			// }
			// this.setState({
			// 	type,
			// 	isVisible: true,
			// 	title: '员工详情',
			// 	userInfo: item
			// })
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

	// //创建编辑员工提交
	// handleSubmit = () => {
	// 	let type = this.state.types;
	// 	let data = this.userForm.props.form.getFieldsValue();
	// 	axios.ajax({
	// 		url: type == 'create' ? '/user/add' : '/user/edit',
	// 		data: {
	// 			params: data
	// 		}
	// 	}).then((res) => {
	// 		if (res.code === 0) {
	// 			this.userForm.props.form.resetFields();
	// 			this.setState({
	// 				isVisible: false
	// 			})
	// 			this.requestList();
	// 		}
	// 	})
	// }

	calTableHeight = () => {
		let clientHeight = document.body.clientHeight;
		let headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
		let tabsHeight = document.getElementsByClassName('ant-tabs-nav-scroll')[0].offsetHeight;
		let cardHeight = 65;
		let gapsHeight = 25;
		let headernfooterHeight = 55;
		let paginationHeight = 65;
		let tableHeight = clientHeight - headerHeight - tabsHeight - cardHeight - gapsHeight - headernfooterHeight - paginationHeight;
		console.log("tableHeight: " + tableHeight + " clientHeight: " + clientHeight + " headerHeight: " + headerHeight + " tabsHeight: " + tabsHeight);
		return tableHeight;
	}

	calTableHeight2 = () => {
		let clientHeight = document.body.clientHeight;
		let headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
		let tabsHeight = document.getElementsByClassName('ant-tabs-nav-scroll')[0].offsetHeight;
		let cardHeight = 0;
		let gapsHeight = 22;
		let headernfooterHeight = 460;
		let paginationHeight = 96;
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
					<Button type="primary" onClick={() => this.handleOperate('detail', record.id)} icon="search">详情</Button>
				</span>
			),
		},
		];

		const columns2 = [
			{
				title: '日期',
				dataIndex: 'date',
				key: 'date',
				width: 200,
			},
			{
				title: '金圆品种1',
				children: [
					{
						title: '数量',
						dataIndex: 'amount1',
						key: 'amount1',
						width: 200,
					},
					{
						title: '单价',
						dataIndex: 'price1',
						key: 'price1',
						width: 200,
					},
				],
			},
			{
				title: '金圆品种2',
				children: [
					{
						title: '数量',
						dataIndex: 'amount2',
						key: 'amount2',
						width: 200,
					},
					{
						title: '单价',
						dataIndex: 'price2',
						key: 'price2',
						width: 200,
					},
				],
			},
			{
				title: '金圆品种3',
				children: [
					{
						title: '数量',
						dataIndex: 'amount3',
						key: 'amount3',
						width: 200,
					},
					{
						title: '单价',
						dataIndex: 'price3',
						key: 'price3',
						width: 200,
					},
				],
			},
			{
				title: '金圆品种4',
				children: [
					{
						title: '数量',
						dataIndex: 'amount4',
						key: 'amount4',
						width: 200,
					},
					{
						title: '单价',
						dataIndex: 'price4',
						key: 'price4',
						width: 200,
					},
				],
			},
			{
				title: '金圆品种5',
				children: [
					{
						title: '数量',
						dataIndex: 'amount5',
						key: 'amount5',
						width: 200,
					},
					{
						title: '单价',
						dataIndex: 'price5',
						key: 'price5',
						width: 200,
					},
				],
			},
			{
				title: '总吨位',
				dataIndex: 'totalAmount',
				key: 'totalAmount',
				width: 200,
			},
		];

		let footer = {};
		if (this.state.type == 'detail') {
			footer = {
				footer: null
			}
		}

		if (this.state.level) {
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
							scrollToFirstRowOnChange={true}
						// footer={() => {
						// 	return <div>
						// 		<Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>新增</Button>
						// 		<Button type="primary" icon="delete" style={{ marginLeft: "10px" }} onClick={() => this.handleOperate('delete')}>删除</Button>
						// 	</div>
						// }}
						/>
					</div>

					{/* <Modal
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
				</Modal> */}
				</div>
			)
		} else {
			return (
				<div>
					<Button type="primary" onClick={() => { this.setState({ level: true }) }} icon="caret-left">返回</Button>
					<div className="content-wrap">
						<Table
							columns={columns2}
							// updateSelectedItem={Utils.updateSelectedItem.bind(this)}
							// selectedRowKeys={this.state.selectedRowKeys}
							// selectedItem={this.state.selectedItem}
							dataSource={this.state.list1}
							pagination={this.state.pagination1}
							bordered={true}
							scroll={{ y: this.calTableHeight2(), x: 500 }}
							title={() => '河源市金杰环保建材有限公司对账单'}
							scrollToFirstRowOnChange={true}
							footer={() => {
								return <div style={{ background: 'transparent' }}>
									<Row gutter={24}>
										<Col span={8}>
											<Card title="注" bordered={true}>
												<p>如有异议，请客户在__月__日前来电或来人核对，逾期视同默认此对账单。</p>
											</Card>
										</Col>
										<Col span={8}>
											<Card title="用户反馈意见" bordered={true}>
												<p> </p>
											</Card>
										</Col>
										<Col span={8}>
											<Card title="制表" bordered={true}>
												<p> </p>
											</Card>
										</Col>
									</Row>
									<Row gutter={24}>
										<Col span={6}>
											<Card title="河源市金杰环保建材有限公司对账单（盖章）" bordered={true}>
												<p> </p>
											</Card>
										</Col>
										<Col span={6}>
											<Card title="对方单位（盖章）" bordered={true}>
												<p> </p>
											</Card>
										</Col>
										<Col span={6}>
											<Card title="区域经理（签字）" bordered={true}>
												<p> </p>
											</Card>
										</Col>
										<Col span={6}>
											<Card title="经办人（签字）" bordered={true}>
												<p> </p>
											</Card>
										</Col>
									</Row>
								<Button type="primary" icon="check" onClick={() => this.handleOperate('create')}>确认无误</Button>
								<Button type="primary" icon="question" style={{ marginLeft: "10px" }} onClick={() => this.handleOperate('delete')}>需要核对</Button>
								</div>
							}}
						/>
					</div>
				</div>
			)
		}
	}
}

//子组件：创建员工表单
// class UserForm extends React.Component {

// 	getState = (state) => {
// 		let config = {
// 			'1': '咸鱼一条',
// 			'2': '风华浪子',
// 			'3': '北大才子一枚',
// 			'4': '百度FE',
// 			'5': '创业者'
// 		}
// 		return config[state];
// 	}

// 	render() {
// 		let type = this.props.type;
// 		let userInfo = this.props.userInfo || {};
// 		const { getFieldDecorator } = this.props.form;
// 		const formItemLayout = {
// 			labelCol: { span: 5 },
// 			wrapperCol: { span: 19 }
// 		}
// 		return (
// 			<Form layout="horizontal">
// 				<FormItem label="对账单号" {...formItemLayout}>
// 					{
// 						type == 'detail' ? userInfo.orderId :
// 							getFieldDecorator('orderId', {
// 								initialValue: userInfo.orderId
// 							})(
// 								<Input type="text" placeholder="请输入对账单号" />
// 							)
// 					}
// 				</FormItem>
// 				<FormItem label="对账日期" {...formItemLayout}>
// 					{
// 						type == 'detail' ? userInfo.date :
// 							getFieldDecorator('date', {
// 								initialValue: moment(userInfo.date)
// 							})(
// 								<DatePicker format="YYYY-MM-DD" />
// 							)
// 					}
// 				</FormItem>
// 				<FormItem label="客户" {...formItemLayout}>
// 					{
// 						type == 'detail' ? this.getState(userInfo.client) :
// 							getFieldDecorator('client', {
// 								initialValue: userInfo.client || undefined
// 							})(
// 								<Select
// 									placeholder={"请选择客户"}>
// 									<Option value={1}>特朗普</Option>
// 									<Option value={2}>普京</Option>
// 									<Option value={3}>默克尔</Option>
// 									<Option value={4}>马克龙</Option>
// 									<Option value={5}>安倍</Option>
// 								</Select>
// 							)
// 					}
// 				</FormItem>

// 				<FormItem label="起止日期" {...formItemLayout}>
// 					{
// 						type == 'detail' ? this.getState(userInfo.lastBalance) :
// 							getFieldDecorator('lastBalance', {
// 								initialValue: userInfo.lastBalance
// 							})(
// 								<RangePicker />
// 								// <RangePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
// 							)
// 					}
// 				</FormItem>

// 				<FormItem label="上期余额" {...formItemLayout}>
// 					{
// 						type == 'detail' ? this.getState(userInfo.lastBalance) :
// 							getFieldDecorator('lastBalance', {
// 								initialValue: userInfo.lastBalance
// 							})(
// 								<InputNumber min={1} defaultValue={0} />
// 							)
// 					}
// 				</FormItem>

// 				<FormItem label="本期应收款" {...formItemLayout}>
// 					{
// 						type == 'detail' ? this.getState(userInfo.currentShouldcome) :
// 							getFieldDecorator('currentShouldcome', {
// 								initialValue: userInfo.currentShouldcome
// 							})(
// 								<InputNumber min={1} defaultValue={0} />
// 							)
// 					}
// 				</FormItem>

// 				<FormItem label="本期已收款" {...formItemLayout}>
// 					{
// 						type == 'detail' ? this.getState(userInfo.currentIncome) :
// 							getFieldDecorator('currentIncome', {
// 								initialValue: userInfo.currentIncome
// 							})(
// 								<InputNumber min={1} defaultValue={0} />
// 							)
// 					}
// 				</FormItem>

// 				<FormItem label="本期余额" {...formItemLayout}>
// 					{
// 						type == 'detail' ? this.getState(userInfo.currentBalance) :
// 							getFieldDecorator('currentBalance', {
// 								initialValue: userInfo.currentBalance
// 							})(
// 								<InputNumber min={1} defaultValue={0} />
// 							)
// 					}
// 				</FormItem>

// 			</Form>
// 		)
// 	}
// }
// UserForm = Form.create({})(UserForm);