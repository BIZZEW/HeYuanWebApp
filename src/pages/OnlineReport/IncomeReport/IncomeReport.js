import React from 'react'
import ReactDOM from 'react-dom'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table } from 'antd'
import axios from '../../../axios'
import qs from 'qs'
import Utils from '../../../utils/utils'
import BaseForm from '../../../components/BaseForm'
import ETable from '../../../components/ETable'
import moment from 'moment'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;

export default class IncomeReport extends React.Component {

	state = {
		list: [],
		isVisible: false,
		clientRef: sessionStorage.getItem('clientRef') || [],
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
			valueKey: "customername",
			cascade: false
		},
		{
			type: 'DATE',
			label: '开始日期',
			field: 'begindate',
			placeholder: '请选择开始日期',
			required: true,
		},
		{
			type: 'DATE',
			label: '结束日期',
			field: 'enddate',
			placeholder: '请选择结束日期',
			required: true,
		},
	]

	componentDidMount() {
		// this.requestList();
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
			this.params.sendstockorg = (eval(this.state.clientRef)[0]).sendstockorg;
		else
			for (var i of eval(this.state.clientRef))
				if (i.customer === this.params.customer)
					this.params = { ...this.params, ...i };

		axios.requestList(this, '/receiptsdetail', this.params);
	}

	calTableHeight = () => {
		let cardH, cardHeight = this.cardHeight;
		const cardRef = this.refs.card;
		if (cardRef) {
			const cardCon = ReactDOM.findDOMNode(cardRef);
			cardCon.setAttribute('id', 'cardBoxIR');
			if (document.getElementById('cardBoxIR')) {
				cardH = document.getElementById('cardBoxIR').offsetHeight;
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
		let tableHeight = clientHeight - headerHeight - tabsHeight - cardHeight - gapsHeight - headernfooterHeight - paginationHeight;
		console.log("tableHeight: " + tableHeight + " clientHeight: " + clientHeight + " headerHeight: " + headerHeight + " tabsHeight: " + tabsHeight);
		return tableHeight;
	}

	handleOperate = () => {
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

		let data = { ...this.params, clazz: "nc.pubitf.bd.web.servlet.export.ReceiptQuery" };

		axios.exportReport(this, '/reportexport', qs.stringify(data), "收款明细表.xls");
	}

	render() {
		const columns = [
			{
				title: '序号',
				dataIndex: 'order'
			},
			{
				title: '收款日期',
				dataIndex: 'billdate'
			}, {
				title: '收款方式',
				dataIndex: 'paymethod'
			}, {
				title: '收款金额',
				dataIndex: 'local_money'
			}, {
				title: '备注',
				dataIndex: 'remarks'
			},
		];

		return (
			<div>
				<Card ref='card'>
					<BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
				</Card>
				<div className="content-wrap">
					<Table
						columns={columns}
						dataSource={this.state.list}
						pagination={this.state.pagination}
						scroll={{ y: this.calTableHeight() }}
						bordered={true}
						footer={() => {
							return <div>
								<Button type="primary" icon="file-excel" onClick={() => this.handleOperate()}>导出</Button>
								{/* <ReactHTMLTableToExcel
									id="test-table-xls-button"
									className="download-table-xls-button ant-btn ant-btn-default"
									table="table-to-xls"
									filename={"收款明细表"}
									sheet="tablexls"
									style={{ marginLeft: "10px" }}
									buttonText="导出" /> */}
							</div>
						}}
					/>
					<div style={{ "visibility": "hidden", "position": "absolute", "top": "0", "left": "0", "width": "1px", "height": "1px", "overflow": "hidden" }}>
						<Table
							ref='table'
							columns={columns}
							dataSource={this.state.list}
							pagination={false}
							title={() => '收款明细表'}
						/>
					</div>
				</div>
			</div>
		)
	}
}