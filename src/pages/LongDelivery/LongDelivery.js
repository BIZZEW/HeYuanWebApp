import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table, Collapse } from 'antd'
import axios from './../../axios'
import qs from 'qs'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import ETable from './../../components/ETable'
import moment from 'moment'
import './longdelivery.scss'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { Search } = Input;
const { Panel } = Collapse;

export default class Long extends React.Component {

	state = {
		list: [],
		// 订单弹窗显示控制
		isVisible1: false,
		// 关闭原因弹窗控制
		isVisible2: false,
		clientRef: sessionStorage.getItem('clientRef') || [],
		cementRef: sessionStorage.getItem('cementRef') || [],

		// 发货库存组织PK(隐藏字段)
		sendstockorg: "",
		vehicles: [],
	}

	params = {
		page: 1
	}

	formList = [
		{
			type: 'SELECT',
			label: '供应商',
			field: 'customer',
			placeholder: '请选择供应商',
			width: 200,
			initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].customer) : undefined,
			list: this.state.clientRef,
			idKey: "customer",
			valueKey: "customername",
			cascade: "pk_material"
		},
		{
			type: 'SELECT',
			label: '矿点',
			field: 'pk_material',
			placeholder: '请选择矿点',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
		},
		{
			type: 'SELECT',
			label: '物料',
			field: 'pk_material',
			placeholder: '请选择物料',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
		},
		{
			type: 'INPUT',
			label: '订单号',
			field: 'pk_material',
			placeholder: '请输入订单号',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
		},
		{
			type: 'INPUT',
			label: '车号',
			field: 'vcarnumber',
			placeholder: '请输入车号',
			width: 200,
			rules: [
				{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '请输入有效的车牌号!' },
				// { required: true, message: '请输入车牌!' }
			],
		},
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
	]

	componentDidMount() {
		// this.requestList();
	}

	handleFilter = (para) => {
		para.page = 1;
		this.params = para;
		this.requestList();
	}

	requestList = () => {
		if (this.params.begindate && (typeof (this.params.begindate) == "object"))
			this.params.begindate = this.params.begindate.format("YYYY-MM-DD");

		if (this.params.enddate && (typeof (this.params.enddate) == "object"))
			this.params.enddate = this.params.enddate.format("YYYY-MM-DD");

		if (!this.params.customer)
			this.params.sendstockorg = (eval(this.state.clientRef)[0]).sendstockorg;
		else
			for (var i of eval(this.state.clientRef))
				if (i.customer === this.params.customer)
					this.params = { ...this.params, ...i };

		axios.requestList(this, '/querysaleorder', this.params);
	}

	//功能区操作
	handleOperate = (type, record) => {
		let item = this.state.selectedItem;
		console.log(item);
		if (type == 'create') {
			this.setState({
				type,
				isVisible1: true,
				title: '新增',
				orderInfo: {}
			})
		} else if (type == 'edit') {
			// if (!item) {
			//  Modal.info({
			//      title: '提示',
			//      content: '请选择一个用户'
			//  })
			//  return;
			// }
			// this.setState({
			// 	type,
			// 	isVisible: true,
			// 	title: '编辑',
			// 	orderInfo: this.state.list[index]
			// })
		} else if (type == 'detail') {
			console.log(record);
			this.setState({
				type,
				isVisible1: true,
				title: '详情',
				orderInfo: record,
			})
		} else if (type == 'delete') {
			let _this = this;
			Modal.confirm({
				title: '确认删除',
				content: `是否要删除当前选中数据`,
				onOk() {
					axios.deleteOrder(_this, 'invalidsaleorder', qs.stringify(record));
				}
			})
		} else if (type == 'stop') {
			let _this = this;
			this.setState({
				isVisible2: true,
				title2: '关闭原因',
				orderInfo: record
			})
		}
	}

	//创建编辑订单提交
	handleSubmit1 = () => {
		let type = this.state.type;
		let data = this.orderForm.props.form.getFieldsValue();
		let vehicles = this.state.vehicles;
		if (vehicles && vehicles.length > 0) {
			let data2 = { ...data, vehicles: JSON.stringify(vehicles) };
			console.log(data2)
			this.orderForm.props.form.validateFields((err, values) => {
				if (!err) {
					axios.createNewOrder(this, (type == 'create' ? '/addsaleorder' : '/user/edit'), qs.stringify(data2));
				}
			});
		} else {
			Modal.info({
				title: '提示',
				content: '请至少添加一条车辆信息'
			})
		}
	}

	//关闭订单提交
	handleSubmit2 = () => {
		let data = this.closeForm.props.form.getFieldsValue();
		this.closeForm.props.form.validateFields((err, values) => {
			if (!err) {
				let data2 = { ...data, ...this.state.orderInfo }
				axios.closeOrder(this, '/closesaleorder', qs.stringify(data2));
			}
		});
	}

	updateVehicles = (vehicles) => {
		console.log("updateVehicles triggered!")
		this.setState({ vehicles })
	}

	getSubOptions = (param) => {
		axios.getOptions(this, '/querycemtype', param);
	}

	calTableHeight = () => {
		let clientHeight = document.body.clientHeight;
		let headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
		let tabsHeight = document.getElementsByClassName('ant-tabs-nav-scroll')[0].offsetHeight;
		let cardHeight = 105;
		let gapsHeight = 25;
		let headernfooterHeight = 122;
		let paginationHeight = 65;
		let tableHeight = clientHeight - headerHeight - tabsHeight - cardHeight - gapsHeight - headernfooterHeight - paginationHeight;
		console.log("tableHeight: " + tableHeight + " clientHeight: " + clientHeight + " headerHeight: " + headerHeight + " tabsHeight: " + tabsHeight);
		return tableHeight;
	}

	render() {
		const columns = [
			{
				title: '单据号',
				dataIndex: 'orderno'
			},
			{
				title: '供应商',
				dataIndex: 'customername'
			},
			{
				title: '矿点',
				dataIndex: 'customername'
			},
			{
				title: '日期',
				dataIndex: 'materialname'
			},
			{
				title: '物料',
				dataIndex: 'billstatus',
			},
			{
				title: '数量',
				dataIndex: 'ordernum'
			},
			{
				title: '单据状态',
				dataIndex: 'ordernum'
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
						<Button type="primary" onClick={() => this.handleOperate('detail', record)} icon="search">详情</Button>
					</span>
				),
			},
		];

		const rowRadioSelection = {
			type: 'radio',
			columnTitle: "",
			onSelect: (selectedRowKeys, selectedRows) => {
				this.setState({ selectedRowKeys, selectedRows })
			},
		}

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
					<Table
						columns={columns}
						updateSelectedItem={Utils.updateSelectedItem.bind(this)}
						selectedRowKeys={this.state.selectedRowKeys}
						selectedItem={this.state.selectedItem}
						dataSource={this.state.list}
						pagination={this.state.pagination}
						scroll={{ y: this.calTableHeight() }}
						scrollToFirstRowOnChange={true}
						bordered={true}
						footer={() => {
							return <div>
								<Button type="primary" icon="plus" onClick={() => this.handleOperate('create')}>新增</Button>
								{/* <Button type="primary" icon="delete" style={{ marginLeft: "10px" }} onClick={() => this.handleOperate('delete')}>删除</Button> */}
								{/* <Button type="primary" icon="stop" style={{ marginLeft: "10px" }} onClick={() => this.handleOperate('delete')}>作废</Button> */}
							</div>
						}}
					/>
				</div>

				<Modal
					title={this.state.title}
					visible={this.state.isVisible1}
					onOk={this.handleSubmit1}
					onCancel={() => {
						this.orderForm.props.form.resetFields();
						this.setState({
							isVisible1: false,
							vehicles: [],
						})
					}}
					width={600}
					{...footer}
				>
					<OrderForm type={this.state.type} orderInfo={this.state.orderInfo} wrappedComponentRef={(inst) => { this.orderForm = inst; }} getSubOptions={this.getSubOptions} updateVehicles={this.updateVehicles} vehicles={this.state.vehicles} />
				</Modal>

				<Modal
					title={this.state.title2}
					visible={this.state.isVisible2}
					onOk={this.handleSubmit2}
					onCancel={() => {
						this.closeForm.props.form.resetFields();
						this.setState({
							isVisible2: false
						})
					}}
					width={600}
				>
					<CloseForm wrappedComponentRef={(inst) => { this.closeForm = inst; }} />
				</Modal>
			</div>
		)
	}
}

//子组件：关闭订单表单
class CloseForm extends React.Component {
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form id="closeForm">
				<FormItem>
					{
						getFieldDecorator('reason', {
							rules: [
								{ required: true, message: '请填写原因!' }
							],
						})(
							<TextArea></TextArea>
						)
					}
				</FormItem>
			</Form >
		)
	}
}
CloseForm = Form.create({})(CloseForm);

//子组件：创建订单表单
class OrderForm extends React.Component {
	state = {
		// 采购订单弹窗显示控制
		isVisible0: false,
		// 车辆信息表格弹窗显示控制
		isVisible3: false,
		// 车辆信息表单弹窗显示控制
		isVisible4: false,
		list: [],
		selectedRowKeys: [],
		selectedRows: null,
		clientRef: sessionStorage.getItem('clientRef') || [],
		cementRef: sessionStorage.getItem('cementRef') || [],
		companyRef: sessionStorage.getItem('companyRef') || [],
		vehicleList: [],
	}

	formList = [
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
		{
			type: 'SELECT',
			label: '供应商',
			field: 'customer',
			placeholder: '请选择供应商',
			width: 200,
			initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].customer) : undefined,
			list: this.state.clientRef,
			idKey: "customer",
			valueKey: "customername",
			cascade: "pk_material"
		},
		{
			type: 'SELECT',
			label: '采购单位',
			field: 'pk_material',
			placeholder: '请选择采购单位',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
		},
		{
			type: 'SELECT',
			label: '收货企业',
			field: 'pk_material',
			placeholder: '请选择收货企业',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
		},
		{
			type: 'SELECT',
			label: '矿点',
			field: 'pk_material',
			placeholder: '请选择矿点',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
		},
		{
			type: 'SELECT',
			label: '货物',
			field: 'pk_material',
			placeholder: '请选择货物',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
		},
		{
			type: 'INPUT',
			label: '车号',
			field: 'vcarnumber',
			placeholder: '请输入车号',
			width: 200,
			rules: [
				{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '请输入有效的车牌号!' },
				// { required: true, message: '请输入车牌!' }
			],
		},
		{
			type: 'INPUT',
			label: '订单号',
			field: 'pk_material',
			placeholder: '请输入订单号',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
		},
	]

	//功能区操作
	handleOperate = (type, record) => {
		var selectedRowKeys = this.state.selectedRowKeys;
		var id = null;
		var item = null;
		try { id = selectedRowKeys[0] } catch (e) { }
		if (typeof id === 'number' && !isNaN(id))
			item = this.state.vehicleList[id];
		console.log(item);

		if (type == 'create') {
			this.setState({
				type2: type,
				isVisible4: true,
				title4: '新增',
				vehicleInfo: {}
			})
		} else if (type == 'edit') {
			console.log(item);
			if (item) {
				this.setState({
					type2: type,
					isVisible4: true,
					title4: '编辑',
					vehicleInfo: item
				})
			} else {
				Modal.info({
					title: '提示',
					content: '请选择一个车辆信息'
				})
				return;
			}
		} else if (type == 'detail') {
			console.log(item);
			this.setState({
				type2: type,
				isVisible4: true,
				title4: '详情',
				vehicleInfo: item,
			})
		} else if (type == 'delete') {
			if (!item) {
				Modal.info({
					title: '提示',
					content: '请选择一个车辆信息'
				})
				return;
			}
			let _this = this;
			Modal.confirm({
				title: '确认删除',
				content: `是否要删除当前选中数据`,
				onOk() {
					let vehicleList = _this.state.vehicleList;

					for (var i = 0; i < vehicleList.length; i++)
						if (vehicleList[i].id === item.id)
							vehicleList.splice(i, 1);

					_this.setState({
						vehicleList,
						selectedRowKeys: []
					});
				}
			})
		}
	}

	editVehicles = () => {
		var oldVehicles = this.props.vehicles;
		this.setState({
			isVisible3: true,
			title3: '车辆信息',
			vehicleList: oldVehicles.slice(0),
		})
	}

	getSubOptions = (param) => {
		// this.props.getSubOptions(param);
		axios.getOptions2(this, '/querycemtype', param, "cementRef");
		axios.getOptions2(this, '/querysaleunit', param, "companyRef");
	}

	handleSubmit3 = () => {
		this.setState({
			isVisible3: false,
		}, () => { this.props.updateVehicles(this.state.vehicleList) })
	}

	handleSubmit4 = () => {
		let type2 = this.state.type2;
		this.vehicleForm.props.form.validateFields((err, values) => {
			if (!err) {
				let vehicleList = this.state.vehicleList;
				if (type2 == "create") {
					vehicleList.push({ ...values, id: this.state.vehicleList.length });
					this.setState({
						vehicleList,
						isVisible4: false,
					}, () => {
						this.vehicleForm.props.form.resetFields();
					})
				} else if (type2 == "edit") {
					let id = this.state.selectedRowKeys[0];
					vehicleList[id] = { ...values, id };
					this.setState({
						vehicleList,
						selectedRowKeys: [],
						isVisible4: false,
					}, () => {
						this.vehicleForm.props.form.resetFields();
					})
				}
			}
		});
	}

	onSelectChange = selectedRowKeys => {
		console.log(selectedRowKeys);
		this.setState({ selectedRowKeys });
	};

	getProcureOptions = () => {
		this.setState({
			isVisible0: true,
			title0: '采购订单',
			list: []
		})
	}

	render() {
		const { selectedRowKeys } = this.state;
		let type = this.props.type;
		let vehicleInfoNum = this.props.vehicles.length;
		let orderInfo = this.props.orderInfo || {};
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		}

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};

		const columns0 = [
			{
				title: '车牌',
				dataIndex: 'vehicle'
			},
			{
				title: '司机姓名',
				dataIndex: 'drivername'
			}, {
				title: '司机手机号',
				dataIndex: 'telphone',
			}, {
				title: '司机身份证',
				dataIndex: 'driveridentity',
			}, {
				title: '车数',
				dataIndex: 'amount',
			}
		];

		const columns2 = [
			{
				title: '采购订单日期',
				dataIndex: 'drivername'
			}, {
				title: '采购单位',
				dataIndex: 'telphone',
			}, {
				title: '收货企业',
				dataIndex: 'driveridentity',
			}, {
				title: '供应商',
				dataIndex: 'driveridentity',
			}, {
				title: '货物',
				dataIndex: 'driveridentity',
			}, {
				title: '余量',
				dataIndex: 'driveridentity',
			},
		];

		return (
			<div>
				<Form layout="horizontal">
					<FormItem label="采购订单" {...formItemLayout} style={{ "marginBottom": "15px" }}>
						{
							getFieldDecorator('vehicle', {
								initialValue: orderInfo.vehicle,
							})(
								<Search
									placeholder="请选择采购订单"
									enterButton="获取"
									readOnly
									// size="large"
									onSearch={value => this.getProcureOptions(value)}
									onClick={value => this.getProcureOptions(value)}
								/>
							)
						}
					</FormItem>

					<Collapse
						bordered={false}
						defaultActiveKey={['0']}
						expandIcon={({ isActive }) => <Icon rotate={isActive ? 90 : 0} type="caret-right" />}
						className="site-collapse-custom-collapse"
					>
						<Panel header={"采购订单详情 （货物: " + (orderInfo.drivername ? orderInfo.drivername : "") + " 余量: " + (orderInfo.drivername ? orderInfo.drivername : "") + " 矿点: " + (orderInfo.drivername ? orderInfo.drivername : "") + "）"} key="1" className="site-collapse-custom-panel">
							<FormItem label="采购订单日期" {...formItemLayout}>
								{
									type == 'detail' ? orderInfo.drivername :
										getFieldDecorator('drivername', {
											initialValue: orderInfo.drivername,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
							<FormItem label="采购单位" {...formItemLayout}>
								{
									type == 'detail' ? orderInfo.drivername :
										getFieldDecorator('drivername', {
											initialValue: orderInfo.drivername,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
							<FormItem label="收货企业" {...formItemLayout}>
								{
									type == 'detail' ? orderInfo.drivername :
										getFieldDecorator('drivername', {
											initialValue: orderInfo.drivername,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem><FormItem label="供应商" {...formItemLayout}>
								{
									type == 'detail' ? orderInfo.drivername :
										getFieldDecorator('drivername', {
											initialValue: orderInfo.drivername,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>

							<FormItem label="货物" {...formItemLayout}>
								{
									type == 'detail' ? orderInfo.drivername :
										getFieldDecorator('drivername', {
											initialValue: orderInfo.drivername,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>

							<FormItem label="余量" {...formItemLayout}>
								{
									type == 'detail' ? orderInfo.drivername :
										getFieldDecorator('drivername', {
											initialValue: orderInfo.drivername,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
						</Panel>
					</Collapse>

					<Divider />

					<FormItem label="收货单号" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.drivername :
								getFieldDecorator('drivername', {
									initialValue: orderInfo.drivername,
								})(
									<Input type="text" placeholder="请填写收货单号" />
								)
						}
					</FormItem>
					<FormItem label="收货日期" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.date :
								getFieldDecorator('date', {
									initialValue: moment(orderInfo.date)
								})(
									<DatePicker format="YYYY-MM-DD" />
								)
						}
					</FormItem>

					<FormItem label="原发净重" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.ordernum :
								getFieldDecorator('ordernum', {
									initialValue: 0.00
								})(
									<InputNumber min={0} defaultValue={0.00} step={0.01} />
								)
						}
					</FormItem>
					<FormItem label="到货量" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.ordernum2 :
								getFieldDecorator('ordernum2', {
									initialValue: 0.00
								})(
									<InputNumber min={0} defaultValue={0.00} step={0.01} />
								)
						}
					</FormItem>
					<FormItem label="集装箱号" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.drivername :
								getFieldDecorator('drivername', {
									initialValue: orderInfo.drivername,
								})(
									<Input type="text" placeholder="请填写集装箱号" />
								)
						}
					</FormItem>
					<FormItem label="运输商" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.customername :
								getFieldDecorator('customer', {
									initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].customer) : undefined,
								})(
									<Select
										placeholder={"请选择运输商"}
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

					<Divider />
					{(type == "detail") && (<div>
						<FormItem label="车牌号" {...formItemLayout}>
							{
								type == 'detail' ? orderInfo.vehicle :
									getFieldDecorator('vehicle', {
										initialValue: orderInfo.vehicle,
										rules: [
											{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '请输入有效的车牌号!' },
											{ required: true, message: '请输入车牌!' }
										],
									})(
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
								type == 'detail' ? orderInfo.drivername :
									getFieldDecorator('drivername', {
										initialValue: orderInfo.drivername,
										// rules: [{ required: true, message: '请获取司机信息!' }],
									})(
										<Input type="text" placeholder="请获取司机信息" />
									)
							}
						</FormItem>
						<FormItem label="手机号" {...formItemLayout}>
							{
								type == 'detail' ? orderInfo.telphone :
									getFieldDecorator('telphone', {
										initialValue: orderInfo.telphone,
										// rules: [{ required: true, message: '请获取司机信息!' }],
									})(
										<Input type="text" placeholder="请获取司机信息" />
									)
							}
						</FormItem>
						<FormItem label="身份证" {...formItemLayout}>
							{
								type == 'detail' ? orderInfo.driveridentity :
									getFieldDecorator('driveridentity', {
										initialValue: orderInfo.driveridentity,
										// rules: [{ required: true, message: '请获取司机信息!' }],
									})(
										<Input type="text" placeholder="请获取司机信息" />
									)
							}
						</FormItem>
					</div>)}
					{(type != "detail") && (<Button type="primary" visible={type != "detail"} onClick={this.editVehicles}>当前有 {vehicleInfoNum} 条车辆信息</Button>)}
				</Form>

				{/* 采购订单 */}
				<Modal
					title={this.state.title0}
					visible={this.state.isVisible0}
					onOk={this.handleSubmit0}
					onCancel={() => {
						this.setState({
							isVisible0: false
						})
					}}
					width={1000}
				>
					<Card>
						<BaseForm wrappedComponentRef={(form) => this.formRef = form} formList={this.formList} filterSubmit={this.handleFilter} />
					</Card>
					<div className="content-wrap">
						<Table
							bordered
							columns={columns2}
							dataSource={this.state.list}
							rowSelection={rowSelection}
							pagination={false}
						/>
					</div>
				</Modal>

				{/* 车辆信息 */}
				<Modal
					title={this.state.title3}
					visible={this.state.isVisible3}
					onOk={this.handleSubmit3}
					onCancel={() => {
						this.setState({
							isVisible3: false,
						})
					}}
					footer={[
						<Button key="edit" type="primary" onClick={() => this.handleOperate('create')} icon="plus">
							增加
            			</Button>,
						<Button key="delete" type="danger" onClick={() => this.handleOperate('delete')} icon="delete">
							删除
            			</Button>,
						<Button key="edit" type="primary" onClick={() => this.handleOperate('edit')} icon="edit">
							编辑
            			</Button>,
						<Button key="confirm" type="primary" onClick={this.handleSubmit3} icon="check">
							确定
            			</Button>,
					]}
					width={1000}
				>
					<div className="content-wrap">
						<Table
							bordered
							columns={columns0}
							dataSource={this.state.vehicleList}
							// rowSelection={rowRadioSelection2}
							rowSelection={{
								type: "radio",
								...rowSelection,
							}}
							pagination={false}
						/>
					</div>
				</Modal>

				<Modal
					title={this.state.title4}
					visible={this.state.isVisible4}
					onOk={this.handleSubmit4}
					onCancel={() => {
						this.vehicleForm.props.form.resetFields();
						this.setState({
							isVisible4: false
						})
					}}
					width={600}
				>
					<VehicleForm type2={this.state.type2} vehicleInfo={this.state.vehicleInfo} wrappedComponentRef={(inst) => { this.vehicleForm = inst; }} />
				</Modal>
			</div >
		)
	}
}
OrderForm = Form.create({})(OrderForm);

class VehicleForm extends React.Component {
	state = {
		isVisible5: false,
		list: [],
		selectedRowKeys: null,
		selectedRows: null,
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

	handleSubmit5 = () => {
		if (this.state.selectedRowKeys) {
			this.setState({ isVisible5: false });
			this.props.form.setFieldsValue({ 'drivername': this.state.selectedRowKeys.drivername });
			this.props.form.setFieldsValue({ 'telphone': this.state.selectedRowKeys.telphone });
			this.props.form.setFieldsValue({ 'driveridentity': this.state.selectedRowKeys.driveridentity });
		} else {
			Modal.info({
				title: '提示',
				content: '请选择一个司机信息'
			})
		}
	}

	render() {
		let type2 = this.props.type2;
		let vehicleInfo = this.props.vehicleInfo || {};
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
					<FormItem label="车牌号" {...formItemLayout}>
						{
							getFieldDecorator('vehicle', {
								initialValue: vehicleInfo.vehicle,
								rules: [
									{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '请输入有效的车牌号!' },
									{ required: true, message: '请输入车牌!' }
								],
							})(
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
							getFieldDecorator('drivername', {
								initialValue: vehicleInfo.drivername,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" />
							)
						}
					</FormItem>
					<FormItem label="手机号" {...formItemLayout}>
						{
							getFieldDecorator('telphone', {
								initialValue: vehicleInfo.telphone,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" />
							)
						}
					</FormItem>
					<FormItem label="身份证" {...formItemLayout}>
						{
							getFieldDecorator('driveridentity', {
								initialValue: vehicleInfo.driveridentity,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" />
							)
						}
					</FormItem>
					<FormItem label="车数" {...formItemLayout}>
						{

							getFieldDecorator('amount', {
								initialValue: type2 == 'edit' ? vehicleInfo.amount : 1,
								rules: [
									{ required: true, message: '请输入车数!' }
								],
							})(
								<InputNumber min={1} defaultValue={0} />
							)
						}
					</FormItem>
				</Form>

				{/* 司机信息 */}
				<Modal
					title={this.state.title5}
					visible={this.state.isVisible5}
					onOk={this.handleSubmit5}
					onCancel={() => {
						this.setState({
							isVisible5: false
						})
					}}
					width={1000}
				>
					<div className="content-wrap">
						<Table
							bordered
							columns={columns}
							dataSource={this.state.list}
							rowSelection={rowRadioSelection}
							pagination={false}
						/>
					</div>
				</Modal>
			</div>
		)
	}
}
VehicleForm = Form.create({})(VehicleForm);
