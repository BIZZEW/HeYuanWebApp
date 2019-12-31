import React from 'react'
import ReactDOM from 'react-dom'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table } from 'antd'
import axios from '../../../axios'
import Utils from '../../../utils/utils'
import BaseForm from '../../../components/BaseForm'
import ETable from '../../../components/ETable'
import moment from 'moment'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;

export default class PickupReport extends React.Component {

	state = {
		list: [],
		isVisible: false,
		clientRef: sessionStorage.getItem('clientRef') || [],
		cementRef: sessionStorage.getItem('cementRef') || [],
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
			cascade: "cmaterialvid"
		},
		{
			type: 'SELECT',
			label: '水泥品种',
			field: 'cmaterialvid',
			placeholder: '请选择水泥品种',
			width: 200,
			list: this.state.cementRef,
			idKey: "pk_material",
			valueKey: "name",
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

		axios.requestList(this, '/detaildelivery', this.params);
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
				title: '客户',
				dataIndex: 'casscustid'
			},
			{
				title: '日期',
				dataIndex: 'grossdate'
			},
			{
				title: '物料',
				dataIndex: 'cmaterialvid'
			},
			{
				title: '数量',
				dataIndex: 'nnum'
			},
			{
				title: '金额',
				dataIndex: 'norigtaxmny'
			},
			{
				title: '单价',
				dataIndex: 'nqtorigtaxprice'
			},
			{
				title: '车牌号',
				dataIndex: 'vcarnumber'
			},
			{
				title: '出厂时间',
				dataIndex: 'grosstime'
			},
			{
				title: '进厂时间',
				dataIndex: 'skintime'
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
								{/* <Button type="primary" icon="file-excel" onClick={() => this.handleOperate('export')}>导出</Button> */}
								<ReactHTMLTableToExcel
									id="test-table-xls-button"
									className="download-table-xls-button ant-btn ant-btn-default"
									table="table-to-xls"
									filename={"提货明细表"}
									sheet="tablexls"
									style={{ marginLeft: "10px" }}
									buttonText="导出" />
							</div>
						}}
					/>
					<div style={{ "visibility": "hidden", "position": "absolute", "top": "0", "left": "0", "width": "1px", "height": "1px", "overflow": "hidden" }}>
						<Table
							ref='table'
							columns={columns}
							dataSource={this.state.list}
							pagination={false}
							title={() => '提货明细表'}
						/>
					</div>
				</div>
			</div>
		)
	}
}