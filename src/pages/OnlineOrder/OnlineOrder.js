import React from 'react'
import ReactDOM from 'react-dom';
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table } from 'antd'
import axios from './../../axios'
import qs from 'qs'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import OrderForm from './OrderForm'
const FormItem = Form.Item;
const TextArea = Input.TextArea;

export default class OnlineOrder extends React.Component {

	state = {
		list: [],
		// 订单弹窗显示控制
		isVisible1: false,
		// 关闭原因弹窗控制
		isVisible2: false,

		// 下拉参照选项列表
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
			type: 'SELECTCOMP',
			label: '客户',
			field: 'customer',
			width: 200,
			initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].customer) : undefined,
			list: this.state.clientRef,
			idKey: "customer",
			valueKey: "customername",
			subs: ["pk_material"]
		},
		{
			type: 'SELECTCOMP',
			label: '水泥品种',
			field: 'pk_material',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
			sups: ["customer"],
			requestUrl: "/querycemtype"
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
		this.requestList();
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
	handleOperate = (type, record, e) => {
		e.stopPropagation();
		let item = this.state.selectedItem;
		// console.log(item);
		if (type == 'create') {
			this.setState({
				type,
				isVisible1: true,
				title: '新增',
				orderInfo: {}
			})
		} else if (type == 'edit') {
			// if (!item) {
			//  Modal.info({zIndex: 1002,
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
				zIndex: 1002,
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
				zIndex: 1002,
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

	calTableHeight = () => {
		let cardH, cardHeight = this.cardHeight;
		const cardRef = this.refs.card;
		if (cardRef) {
			const cardCon = ReactDOM.findDOMNode(cardRef);
			cardCon.setAttribute('id', 'cardBoxOO');
			if (document.getElementById('cardBoxOO')) {
				cardH = document.getElementById('cardBoxOO').offsetHeight;
				if (cardH) {
					cardHeight = cardH + 3;
					this.cardHeight = cardHeight;
				}
			}
		}
		let clientHeight = document.body.clientHeight;
		let headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
		let tabsHeight = document.getElementsByClassName('ant-tabs-nav-scroll')[0].offsetHeight;
		let gapsHeight = 25;
		let headernfooterHeight = 122;
		let paginationHeight = 65;
		let tableHeight = clientHeight - headerHeight - tabsHeight - cardHeight - gapsHeight - headernfooterHeight - paginationHeight - 40;
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
				title: '单据状态',
				dataIndex: 'billstatus',
			},
			{
				title: '车号',
				dataIndex: 'vehicle',
			},
			{
				title: '备注',
				dataIndex: 'vnote',
			},
			{
				title: '操作',
				key: 'action',
				width: 220,
				render: (text, record) => (
					<span>
						<Button type="primary" onClick={event => this.handleOperate('detail', record, event)} icon="search">详情</Button>
						<Divider type="vertical" />
						{/* <Button type="primary" onClick={() => this.handleOperate('edit', record.id)} icon="edit">编辑</Button> */}
						<Button type="danger" icon="stop" onClick={event => this.handleOperate('stop', record, event)}>关闭</Button>
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
				<Card ref='card'>
					<BaseForm wrappedComponentRef={(form) => this.formRef = form} formList={this.formList} filterSubmit={this.handleFilter} />
				</Card>
				<div className="content-wrap">
					<Table
						onRow={(record, rowIndex) => {
							return {
								onClick: event => this.handleOperate('detail', record, event),
							};
						}}
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
								<Button type="primary" icon="plus" onClick={event => this.handleOperate('create', undefined, event)}>新增</Button>
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
					<OrderForm type={this.state.type} orderInfo={this.state.orderInfo} wrappedComponentRef={(inst) => { this.orderForm = inst; }} updateVehicles={this.updateVehicles} vehicles={this.state.vehicles} />
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
