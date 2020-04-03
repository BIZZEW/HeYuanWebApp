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
		isVisible99: false,
		clientRef: sessionStorage.getItem('clientRef') || [],
		cementRef: sessionStorage.getItem('cementRef') || [],

		// 发货库存组织PK(隐藏字段)
		sendstockorg: "",
		vehicles: [],

		// 基础数据
		refList: [],
		selectedRowKeys99: null,

		// 当前选择的基础数据
		currentkey: null,
		currentname: null,
	}

	params = {
		// 页面主要业务查询页码
		page: 1,
		// 页面基础数据查询页码
		page2: 1
	}

	requestRef = (selectType) => {
		let param = {
			action: selectType,
			serviceid: "refInfoService",
			page: this.params.page2,
			numbersperpage: 10,
			flag: true,
			pk_appuser: sessionStorage.getItem("pkAppuser") || ""
		}
		axios.requestRef(this, '/purchase', param);
	}

	openRef = (item) => {
		let { field, key, code, label } = item;
		this.setState({
			pagination2: false
		})
		this.params.page2 = 1;
		this.setState({
			isVisible99: true,
			title99: label,
			refList: [],
			currentkey: key,
			currentname: field,
		})
		this.requestRef(code);
	}

	formList = [
		{
			type: 'ADVSELECT',
			label: '供应商',
			code: 2,
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
			code: 20,
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
			label: '货物',
			code: 8,
			key: 'pk_cargo',
			field: 'cargoname',
			width: 200,
			trigger: item => this.openRef(item)
		},
		{
			type: 'ADVSELECTPK',
			field: 'pk_cargo',
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

		axios.requestList(this, '/purchase', { ...this.params, action: 4, serviceid: "receiveOrderService" });
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
	handleSubmit99 = () => {
		if (this.state.selectedRows99 && this.state.selectedRows99[0]) {
			let item = this.state.selectedRows99[0];
			this.setState({
				isVisible99: false,
				selectedRowKeys99: [],
				selectedRows99: []
			})

			let _form = {};
			_form[this.state.currentkey] = item.pk;
			_form[this.state.currentname] = item.name;

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

	onSelectChange = selectedRowKeys99 => {
		this.setState({ selectedRowKeys99 });
	};

	render() {
		const { selectedRowKeys99 } = this.state;
		const columns99 = [
			{
				title: '编码',
				dataIndex: 'pk'
			},
			{
				title: '名称',
				dataIndex: 'name'
			},
		];

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
				title: '货物',
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

		const rowSelection99 = {
			selectedRowKeys: selectedRowKeys99,
			onChange: (selectedRowKeys99, selectedRows99) => {
				console.log(`selectedRowKeys: ${selectedRowKeys99}`, 'selectedRows: ', selectedRows99);
				this.setState({ selectedRowKeys99, selectedRows99 })
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
					title={this.state.title99}
					visible={this.state.isVisible99}
					onOk={this.handleSubmit99}
					onCancel={() => {
						this.setState({
							isVisible99: false,
							selectedRowKeys99: [],
						})
					}}
					width={1000}
				>
					<div className="content-wrap">
						<Table
							bordered
							columns={columns99}
							dataSource={this.state.refList}
							pagination={this.state.pagination2}
							rowSelection={{
								type: "radio",
								...rowSelection99,
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

