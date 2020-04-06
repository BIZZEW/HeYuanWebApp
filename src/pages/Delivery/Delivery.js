import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table, Collapse } from 'antd'
import axios from './../../axios'
import qs from 'qs'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import OrderForm from './OrderForm'
import ETable from './../../components/ETable'
import moment from 'moment'
import './delivery.scss'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { Search } = Input;
const { Panel } = Collapse;

export default class Delivery extends React.Component {

	state = {
		list: [],
		// 订单弹窗显示控制
		isVisible1: false,
		// 关闭原因弹窗控制
		isVisible2: false,
		// 高级选择弹窗控制
		isVisibleRef: false,
		clientRef: sessionStorage.getItem('clientRef') || [],
		cementRef: sessionStorage.getItem('cementRef') || [],

		// 发货库存组织PK(隐藏字段)
		// sendstockorg: "",
		vehicles: [],

		// 基础数据
		refList: [],
		selectedRowKeysRef: null,
	}

	params = {
		// 页面主要业务查询页码
		page: 1,
	}

	refParam = {
		// 页面基础数据查询页码
		page: 1,
		serviceid: "refInfoService",
		numbersperpage: 10,
		flag: true,
		pk_appuser: sessionStorage.getItem("pkAppuser") || "",
	}

	refItem = {}

	requestRef = () => {
		axios.requestRef(this, '/purchase', this.refParam);
	}

	openRef = (item) => {
		let { field, key, action, label, flag, subs, sups } = item;
		let keyfield = this.formRef.props.form.getFieldValue(key);
		if (flag && keyfield && keyfield != "") {
			let _form = {};
			_form[key] = "";
			_form[field] = "";

			// 清空下级
			if (subs) {
				for (let i of subs) {
					if (i && i.key && i.field) {
						_form[i.key] = "";
						_form[i.field] = "";
					}
				}
			}

			this.formRef.props.form.setFieldsValue(_form);
		} else {
			// 上级先选
			if (sups) {
				for (let i of sups) {
					if (i && i.key && i.field) {
						let supskey = this.formRef.props.form.getFieldValue(i.key);
						let supsfield = this.formRef.props.form.getFieldValue(i.field);

						if (supskey && supskey != "" && supsfield && supsfield != "")
							this.refParam[i.key] = supskey;
						else {
							Modal.info({
								title: '提示',
								content: '请选择请先选择' + (i.name || "上级查询条件")
							});
							return;
						}
					}
				}
			}

			this.setState({
				paginationRef: false
			})
			this.refParam.page = 1;
			this.refParam.action = action;
			this.refItem = item;
			this.setState({
				isVisibleRef: true,
				titleRef: label,
				refList: [],
			}, () => {
				this.requestRef();
			});
		}
	}

	formList = [
		{
			type: 'ADVSELECT',
			label: '供应商',
			action: 7,
			key: 'pk_supplier',
			field: 'suppliername',
			width: 200,
			trigger: item => this.openRef(item)
		},
		{
			type: 'ADVSELECTPK',
			field: 'pk_supplier',
		},
		{
			type: 'ADVSELECT',
			label: '矿点',
			action: 20,
			key: 'pk_orespot',
			field: 'orespotname',
			width: 200,
			trigger: item => this.openRef(item)
		},
		{
			type: 'ADVSELECTPK',
			field: 'pk_orespot',
		},
		{
			type: 'ADVSELECT',
			label: '收货企业',
			action: 5,
			key: 'pk_stockorg',
			field: 'stockorgname',
			subs: [{
				key: "cmaterialid",
				field: "materialname"
			}],
			width: 200,
			trigger: item => this.openRef(item)
		},
		{
			type: 'ADVSELECTPK',
			field: 'pk_stockorg',
		},
		{
			type: 'ADVSELECT',
			label: '货物',
			action: 8,
			key: 'cmaterialid',
			field: 'materialname',
			sups: [{
				key: "pk_stockorg",
				field: "stockorgname",
				name: "收货企业"
			}],
			width: 200,
			trigger: item => this.openRef(item)
		},
		{
			type: 'ADVSELECTPK',
			field: 'cmaterialid',
		},
		{
			type: 'INPUT',
			label: '订单号',
			field: 'noticecode',
			placeholder: '请输入订单号',
			width: 200,
			list: this.state.cementRef,
			idKey: "noticecode",
			valueKey: "name",
		},
		{
			type: 'INPUT',
			label: '车号',
			field: 'vlicense',
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
		let dftstockorg;
		if (sessionStorage.getItem("dftstockorg")) {
			dftstockorg = JSON.parse(sessionStorage.getItem("dftstockorg"));
			this.formRef.props.form.setFieldsValue({ "stockorgname": dftstockorg.name, "pk_stockorg": dftstockorg.pk_org });
		}
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

		// if (!this.params.customer)
		// 	this.params.sendstockorg = (eval(this.state.clientRef)[0]).sendstockorg;
		// else
		// 	for (var i of eval(this.state.clientRef))
		// 		if (i.customer === this.params.customer)
		// 			this.params = { ...this.params, ...i };

		axios.requestListPurchase(this, '/purchase', {
			...this.params,
			action: 4,
			serviceid: "receiveOrderService",
			ncusercode: sessionStorage.getItem("userName") || "",
			ncuserpassword: sessionStorage.getItem("passWord") || "",
			pk_appuser: sessionStorage.getItem("pkAppuser") || "",
			flag: true
		});
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

	//高级选择确认
	handleSubmitRef = () => {
		if (this.state.selectedRowsRef && this.state.selectedRowsRef[0]) {
			let item = this.state.selectedRowsRef[0];
			this.setState({
				isVisibleRef: false,
				selectedRowKeysRef: [],
				selectedRowsRef: []
			})

			let { field, key, subs } = this.refItem;

			let _form = {};
			_form[key] = item.pk;
			_form[field] = item.name;

			// 清空下级
			if (subs) {
				for (let i of subs) {
					if (i && i.key && i.field) {
						_form[i.key] = "";
						_form[i.field] = "";
					}
				}
			}

			this.formRef.props.form.setFieldsValue(_form);

			this.formRef.props.form.validateFields((err, values) => {
				if (!err) {
					console.log(values)
				}
			});
		} else {
			Modal.info({
				title: '提示',
				content: '请选择一条数据'
			})
		}
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

	onSelectChange = selectedRowKeysRef => {
		this.setState({ selectedRowKeysRef });
	};

	render() {
		const { selectedRowKeysRef } = this.state;
		const columnsRef = [
			{
				title: '名称',
				dataIndex: 'name'
			},
			{
				title: '编码',
				dataIndex: 'code'
			},
			// {
			// 	title: '主键',
			// 	dataIndex: 'pk'
			// },
		];

		const columns = [
			{
				title: '单据号',
				dataIndex: 'noticecode'
			},
			{
				title: '供应商',
				dataIndex: 'supplier_name'
			},
			{
				title: '矿点',
				dataIndex: 'orespotname'
			},
			{
				title: '送货日期',
				dataIndex: 'dbilldate'
			},
			{
				title: '货物',
				dataIndex: 'material_name',
			},
			{
				title: '到货数量',
				dataIndex: 'num'
			},
			{
				title: '单据状态',
				dataIndex: 'status_name'
			},
			{
				title: '车号',
				dataIndex: 'vlicense',
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

		const rowSelectionRef = {
			selectedRowKeys: selectedRowKeysRef,
			onChange: (selectedRowKeysRef, selectedRowsRef) => {
				console.log(`selectedRowKeys: ${selectedRowKeysRef}`, 'selectedRows: ', selectedRowsRef);
				this.setState({ selectedRowKeysRef, selectedRowsRef })
			},
		};

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

				{/* 基础数据弹窗 */}
				<Modal
					title={this.state.titleRef}
					visible={this.state.isVisibleRef}
					onOk={this.handleSubmitRef}
					onCancel={() => {
						this.setState({
							isVisibleRef: false,
							selectedRowKeysRef: [],
						})
					}}
					width={1000}
				>
					<div className="content-wrap">
						<Table
							bordered
							columns={columnsRef}
							dataSource={this.state.refList}
							pagination={this.state.paginationRef}
							rowSelection={{
								type: "radio",
								...rowSelectionRef,
							}}
						/>
					</div>
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

