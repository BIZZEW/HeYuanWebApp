import React from 'react'
import ReactDOM from 'react-dom';
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table, Col, Row, Descriptions, Tooltip } from 'antd'
import axios from './../../axios'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import ETable from './../../components/ETable'
import moment from 'moment'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
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
		clientRef: sessionStorage.getItem('clientRef') || [],
		checkNoRef: sessionStorage.getItem('checkNoRef') || [],
		level: true,
		btnHide: true,
		columnsDetail: [],

		adjustmentamount: "调整金额",
		billdate: "日期",
		billmaker: "制表人",
		customer: "客户",
		note: "备注",
		currentOrg: "公司名称"
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
			field: 'customer',
			placeholder: '请选择客户',
			width: 200,
			initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].customer) : undefined,
			list: this.state.clientRef,
			idKey: "customer",
			valueKey: "customername",
			cascade: "billno"
		},
		{
			type: 'SELECT',
			label: '对账单号',
			field: 'billno',
			placeholder: '请选择对账单号',
			width: 200,
			list: this.state.checkNoRef,
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

	componentDidUpdate() {
		const tableRef = this.refs.table;
		if (tableRef) {
			const tableCon = ReactDOM.findDOMNode(tableRef);
			const table = tableCon.querySelector('table');
			table.setAttribute('id', 'table-to-xls');
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

		if (!this.params.customer)
			this.params.customer = (eval(this.state.clientRef)[0]).customer;

		for (var i of eval(this.state.clientRef))
			if (i.customer === this.params.customer)
				this.params = { ...this.params, ...i };

		axios.requestList(this, '/queryaccounts', this.params);
	}

	// 对账单详情的获取
	requestList1 = () => {
		axios.requestList1(this, '/queryaccountdetail', this.params1);
	}

	// 对账单详情的操作
	detailCheckop = (type) => {
		this.params1.type = (type == "dcheck" ? 2 : 1);
		axios.detailCheckop(this, '/customercon', this.params1);
	}

	//功能区操作
	handleOperate = (type, record) => {
		let item = this.state.selectedItem;
		if (type == 'detail') {
			this.setState({
				level: false,
				btnHide: record.isconfirmation != "未确认",
				currentCheck: record,
				currentOrg:(eval(this.state.clientRef)[0]).saleorgname
			})

			this.params1 = {
				...record,
				sendstockorg: (eval(this.state.clientRef)[0]).sendstockorg
			}

			this.requestList1();
		} else if (type == 'dcheck' || type == 'confirm') {
			this.detailCheckop(type);
		}
	}

	calTableHeight = () => {
		let clientHeight = document.body.clientHeight;
		let headerHeight = document.getElementsByClassName('header')[0].offsetHeight;
		let tabsHeight = document.getElementsByClassName('ant-tabs-nav-scroll')[0].offsetHeight;
		let cardHeight = 65;
		let gapsHeight = 25;
		let headernfooterHeight = 56;
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
		let headernfooterHeight = 311;
		let paginationHeight = 96;
		let tableHeight = clientHeight - headerHeight - tabsHeight - cardHeight - gapsHeight - headernfooterHeight - paginationHeight;
		console.log("tableHeight: " + tableHeight + " clientHeight: " + clientHeight + " headerHeight: " + headerHeight + " tabsHeight: " + tabsHeight);
		return tableHeight;
	}

	conductList = () => {
		let extraList = [
			{ "statisticaldate": "客户： " + this.state.customer, },
			{ "statisticaldate": "日期： " + this.state.billdate },
			{ "statisticaldate": "调整金额：  " + this.state.adjustmentamount },
			{ "statisticaldate": "备注： " + this.state.note },
			{ "statisticaldate": "注：如有异议，请客户在___月___日前来电或来人核对，逾期视同默认此对账单。 " },
			{ "statisticaldate": "制表： " + this.state.billmaker },
			{ "statisticaldate": this.state.currentOrg + "（盖章）： " },
			{ "statisticaldate": "对方单位（盖章）： " },
			{ "statisticaldate": "区域经理（签字）： " },
			{ "statisticaldate": "经办人（签字）： " },
			{ "statisticaldate": "用户反馈意见： " },
		]
		return this.state.list1.concat(extraList);
	}

	render() {
		const columns = [
			{
				title: '对账单号',
				dataIndex: 'billno'
			},
			{
				title: '客户',
				dataIndex: 'customer'
			},
			{
				title: '对账日期',
				dataIndex: 'billdate'
			},
			{
				title: '公司余额',
				dataIndex: 'lastmonthbalance'
			},
			{
				title: '对账金额',
				dataIndex: 'account',
			},
			{
				title: '确认状态',
				dataIndex: 'isconfirmation',
			},
			{
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<span>
						<Button type="primary" onClick={() => this.handleOperate('detail', record)} icon="search">详情</Button>
					</span>
				),
			},
		];

		if (this.state.level) {
			return (
				<div>
					<Card>
						<BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
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
						/>
					</div>
				</div>
			)
		} else {
			return (
				<div>
					<Tooltip title="返回"><Button type="default" onClick={() => { this.setState({ level: true }) }} icon="caret-left"></Button></Tooltip>
					<Tooltip title={this.state.btnHide ? "本账单报表已确认，无法进行本操作" : "账单存在着一些问题"}><Button type="danger" icon="close" style={{ marginLeft: "10px", float: "right" }} onClick={() => this.handleOperate('dcheck')} disabled={this.state.btnHide}>需要核对</Button></Tooltip>
					<Tooltip title={this.state.btnHide ? "本账单报表已确认，无法进行本操作" : "账单不存在任何问题"}><Button type="primary" icon="check" style={{ marginLeft: "10px", float: "right" }} onClick={() => this.handleOperate('confirm')} disabled={this.state.btnHide}>确认无误</Button></Tooltip>
					<ReactHTMLTableToExcel
						id="test-table-xls-button"
						className="download-table-xls-button ant-btn ant-btn-default"
						table="table-to-xls"
						filename={this.state.currentOrg + "对账单_" + this.state.billdate}
						sheet="tablexls"
						style={{ marginLeft: "10px", float: "right" }}
						buttonText="导出" />
					<div className="content-wrap">
						<Table
							columns={this.state.columnsDetail}
							dataSource={this.state.list1}
							pagination={false}
							bordered={true}
							scroll={{ y: this.calTableHeight2(), x: 500 }}
							title={() => (this.state.currentOrg + '对账单')}
							scrollToFirstRowOnChange={true}
							footer={() => {
								return <div style={{ background: 'transparent' }}>
									<Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
										<Descriptions.Item label="客户">{this.state.customer}</Descriptions.Item>
										<Descriptions.Item label="日期">{this.state.billdate}</Descriptions.Item>
										<Descriptions.Item label="调整金额">{this.state.adjustmentamount}</Descriptions.Item>
										<Descriptions.Item label="备注" span={2}>{this.state.note}</Descriptions.Item>

										<Descriptions.Item label="注" span={2}>如有异议，请客户在___月___日前来电或来人核对，逾期视同默认此对账单。</Descriptions.Item>
										<Descriptions.Item label="制表">{this.state.billmaker}</Descriptions.Item>
										<Descriptions.Item label={this.state.currentOrg + "（盖章）"}> </Descriptions.Item>
										<Descriptions.Item label="对方单位（盖章）"> </Descriptions.Item>
										<Descriptions.Item label="区域经理（签字）"> </Descriptions.Item>
										<Descriptions.Item label="经办人（签字）"> </Descriptions.Item>
										<Descriptions.Item label="用户反馈意见" span={2}> </Descriptions.Item>
									</Descriptions>
								</div>
							}}
						/>
						<div style={{ "visibility": "hidden", "position": "absolute", "top": "0", "left": "0", "width": "1px", "height": "1px", "overflow": "hidden" }}>
							<Table
								ref='table'
								columns={this.state.columnsDetail}
								dataSource={this.conductList()}
								pagination={false}
								bordered={true}
								scrollToFirstRowOnChange={true}
							/>
						</div>
					</div>
				</div >
			)
		}
	}
}