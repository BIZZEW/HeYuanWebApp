import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table } from 'antd'
import axios from './../../axios'
import qs from 'qs'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import ETable from './../../components/ETable'
import moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { Search } = Input;

export default class OnlineOrder extends React.Component {

	state = {
		list: [],
		isVisible: false,
		clientRef: sessionStorage.getItem('clientRef') || [],
		cementRef: sessionStorage.getItem('cementRef') || [],

		// 发货库存组织PK(隐藏字段)
		sendstockorg: "",
	}

	params = {
		page: 1
	}

	formList = [
		{
			type: 'SELECT',
			label: '客户',
			field: 'customer',
			placeholder: '请选择客户',
			width: 200,
			initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].customer) : undefined,
			list: this.state.clientRef,
			idKey: "customer",
			valueKey: "customername"
		},
		{
			type: 'SELECT',
			label: '水泥品种',
			field: 'pk_material',
			placeholder: '请选择水泥品种',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
		},
		// {
		// 	type: 'DATERANGE',
		// 	label: '日期',
		// 	field: 'date0',
		// 	placeholder: '请输入日期'
		// },
		{
			type: 'DATE',
			label: '开始日期',
			field: 'begindate',
			placeholder: '请选择开始日期'
		},
		{
			type: 'DATE',
			label: '结束日期',
			field: 'enddate',
			placeholder: '请选择结束日期'
		},
		// {
		// 	type: 'SELECT',
		// 	label: '车辆状态',
		// 	field: 'vehicleStatus',
		// 	placeholder: '请选择车辆状态',
		// 	width: 200,
		// 	list: sessionStorage.getItem('clientRef3'),
		// 	idKey: "customer",
		// 	valueKey: "customername"
		// },
	]

	componentDidMount() {
		this.requestList();
		// this.getSubOptions(eval(this.state.clientRef)[0]);
		// axios.getOptions(this, '/querycemtype', eval(this.state.clientRef)[0]);
	}

	handleFilter = (para) => {
		para.page = 1;
		this.params = para;
		this.requestList();
	}

	requestList = () => {
		if (this.params.begindate) {
			this.params.begindate = this.params.begindate.format("YYYY-MM-DD");
		}

		if (this.params.enddate) {
			this.params.enddate = this.params.enddate.format("YYYY-MM-DD");
		}
		// this.params.begindate = this.params.begindate ? this.params.begindate.split('T')[0] : this.params.begindate;
		// this.params.enddate = this.params.enddate? this.params.enddate.split('T')[0] : this.params.enddate;
		axios.requestList(this, '/querysaleorder', this.params);
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
			// if (!item) {
			//  Modal.info({
			//      title: '提示',
			//      content: '请选择一个用户'
			//  })
			//  return;
			// }
			this.setState({
				type,
				isVisible: true,
				title: '编辑',
				userInfo: this.state.list[index]
			})
		} else if (type == 'detail') {
			// if (!item) {
			//  Modal.info({
			//      title: '提示',
			//      content: '请选择一个用户'
			//  })
			//  return;
			// }
			console.log(index);
			this.setState({
				type,
				isVisible: true,
				title: '详情',
				userInfo: this.state.list[index]
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
				content: `是否要删除当前选中数据`,
				onOk() {
					// axios.ajax({
					// 	url: '/invalidsaleorder',
					// 	data: {
					// 		params: {
					// 			id: item.id
					// 		}
					// 	}
					// }).then((res) => {
					// 	if (res.code === 0) {
					// 		_this.setState({
					// 			isVisible: false
					// 		})
					// 		_this.requestList();
					// 	}
					// })
					let data = item;
					// console.log(data);
					axios.deleteOrder(_this, 'invalidsaleorder', qs.stringify(data));
				}
			})
		}
	}

	//创建编辑员工提交
	handleSubmit = () => {
		let type = this.state.type;
		let data = this.userForm.props.form.getFieldsValue();
		this.userForm.props.form.validateFields((err, values) => {
			if (!err) {
				//  axios.ajax({
				//      url: type == 'create' ? '/addsaleorder' : '/user/edit',
				//      data: {
				//          params: data
				//      }
				//  }).then((res) => {
				//      if (res.code === 0) {
				//          this.userForm.props.form.resetFields();
				//          this.setState({
				//              isVisible: false
				//          })
				//          this.requestList();
				//      }
				//  })

				axios.createNewOrder(this, (type == 'create' ? '/addsaleorder' : '/user/edit'), qs.stringify(data));
			}
		});
	}

	getSubOptions = (param) => {
		axios.getOptions(this, '/querycemtype', param);
	}

	calTableHeight = () => {
		let clientHeight = document.body.clientHeight;
		let headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
		let tabsHeight = document.getElementsByClassName('ant-tabs-nav-scroll')[0].offsetHeight;
		let cardHeight = 65;
		let gapsHeight = 25;
		let headernfooterHeight = 122;
		let paginationHeight = 65;
		let tableHeight = clientHeight - headerHeight - tabsHeight - cardHeight - gapsHeight - headernfooterHeight - paginationHeight;
		console.log("tableHeight: " + tableHeight + " clientHeight: " + clientHeight + " headerHeight: " + headerHeight + " tabsHeight: " + tabsHeight);
		return tableHeight;
	}

	render() {
		const columns = [
			// {
			// 	title: 'id',
			// 	dataIndex: 'id',
			// 	width: 100,
			// },
			{
				title: '客户',
				dataIndex: 'customername'
			},
			{
				title: '日期',
				dataIndex: 'dbilldate'
			},
			{
				title: '物料',
				dataIndex: 'materialname'
			},
			{
				title: '数量',
				dataIndex: 'ordernum'
			},
			{
				title: '过皮状态',
				dataIndex: 'billstatus',
			},
			{
				title: '车号',
				dataIndex: 'vehicle',
			},
			{
				title: '操作',
				key: 'action',
				width: 220,
				render: (text, record) => (
					<span>
						<Button type="primary" onClick={() => this.handleOperate('detail', record.id)} icon="search">详情</Button>
						<Divider type="vertical" />
						<Button type="primary" onClick={() => this.handleOperate('edit', record.id)} icon="edit">编辑</Button>
					</span>
				),
			},
		];

		let footer = {};
		if (this.state.type == 'detail') {
			footer = {
				footer: null
			}
		}

		return (
			<div>
				<Card>
					<BaseForm wrappedComponentRef={(form) => this.formRef = form} formList={this.formList} filterSubmit={this.handleFilter} />
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
								<Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>新增</Button>
								<Button type="primary" icon="delete" style={{ marginLeft: "10px" }} onClick={() => this.handleOperate('delete')}>删除</Button>
								{/* <Button type="primary" icon="stop" style={{ marginLeft: "10px" }} onClick={() => this.handleOperate('delete')}>作废</Button> */}
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
					<UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst) => { this.userForm = inst; }} getSubOptions={this.getSubOptions} />
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
		selectedRows: null,
		clientRef: sessionStorage.getItem('clientRef') || [],
		cementRef: sessionStorage.getItem('cementRef') || [],
		companyRef: sessionStorage.getItem('companyRef') || [],
		// companyRef: [],
		// cementRef: [],
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

	getSubOptions = (param) => {
		// this.props.getSubOptions(param);
		axios.getOptions2(this, '/querycemtype', param, "cementRef");
		axios.getOptions2(this, '/querysaleunit', param, "companyRef");
	}

	handleSubmit = () => {
		this.setState({ isVisible2: false });
		this.props.form.setFieldsValue({ 'drivername': this.state.selectedRowKeys.drivername });
		this.props.form.setFieldsValue({ 'telphone': this.state.selectedRowKeys.telphone });
		this.props.form.setFieldsValue({ 'driveridentity': this.state.selectedRowKeys.driveridentity });
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
					{/* <FormItem label="订单号" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.orderId :
                                getFieldDecorator('orderId', {
                                    initialValue: userInfo.orderId
                                })(
                                    <Input type="text" placeholder="请输入订单号" />
                                )
                        }
                    </FormItem> */}
					{/* <FormItem label="日期" {...formItemLayout}>
                        {
                            type == 'detail' ? userInfo.date :
                                getFieldDecorator('date', {
                                    initialValue: moment(userInfo.date)
                                })(
                                    <DatePicker format="YYYY-MM-DD" />
                                )
                        }
                    </FormItem> */}
					<FormItem label="客户" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.customer) :
								getFieldDecorator('customer', {
									// initialValue: userInfo.client || undefined,
									initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].customer) : undefined,
								})(
									<Select
										placeholder={"请选择客户"}
										onChange={(value) => {
											this.getSubOptions({ "customer": value });
											this.props.form.resetFields(["pk_salesorg", "pk_material"]);
										}}>
										{Utils.getOptionList({
											list: this.state.clientRef,
											idKey: "customer",
											valueKey: "customername"
										})}
									</Select>
								)
						}
					</FormItem>
					<FormItem label="销售单位" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.pk_salesorg) :
								getFieldDecorator('pk_salesorg', {
									initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].saleorg) : undefined,
								})(
									<Select
										placeholder={"请选择销售单位"}>
										{Utils.getOptionList({
											list: this.state.companyRef,
											idKey: "pk_salesorg",
											valueKey: "name"
										})}
									</Select>
								)
						}
					</FormItem>
					<FormItem label="发货企业" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.sendstockorg) :
								getFieldDecorator('sendstockorg', {
									initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].sendstockorg) : undefined,
								})(
									<Select
										placeholder={"请选择发货企业"} disabled>
										{Utils.getOptionList({
											list: this.state.clientRef,
											idKey: "sendstockorg",
											valueKey: "sendstockorgname"
										})}
									</Select>
								)
						}
					</FormItem>

					<Divider />

					<FormItem label="水泥品种" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.pk_material) :
								getFieldDecorator('pk_material', {
									initialValue: userInfo.pk_material || undefined
								})(
									<Select
										placeholder={"请选择水泥品种"}>
										{Utils.getOptionList({
											list: this.state.cementRef,
											idKey: "pk_material",
											valueKey: "name"
										})}
									</Select>
								)
						}
					</FormItem>
					<FormItem label="数量" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.ordernum) :
								getFieldDecorator('ordernum', {
									initialValue: userInfo.ordernum
								})(
									<InputNumber min={1} defaultValue={0} />
								)
						}
					</FormItem>
					{/* <FormItem label="单位" {...formItemLayout}>
                        {
                            type == 'detail' ? this.getState(userInfo.unit) :
                                getFieldDecorator('unit', {
                                    initialValue: userInfo.unit
                                })(
                                    <Input type="text" placeholder="请输入单位" />
                                )
                        }
                    </FormItem> */}

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
							type == 'detail' ? this.getState(userInfo.drivername) :
								getFieldDecorator('drivername', {
									initialValue: userInfo.drivername,
									rules: [{ required: true, message: '请获取司机信息!' }],
								})(
									<Input type="text" placeholder="请获取司机信息" disabled />
								)
						}
					</FormItem>
					<FormItem label="手机号" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.telphone) :
								getFieldDecorator('telphone', {
									initialValue: userInfo.telphone,
									rules: [{ required: true, message: '请获取司机信息!' }],
								})(
									<Input type="text" placeholder="请获取司机信息" disabled />
								)
						}
					</FormItem>
					<FormItem label="身份证" {...formItemLayout}>
						{
							type == 'detail' ? this.getState(userInfo.driveridentity) :
								getFieldDecorator('driveridentity', {
									initialValue: userInfo.driveridentity,
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
