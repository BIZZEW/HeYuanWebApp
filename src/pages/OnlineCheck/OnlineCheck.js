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
		// {
		// 	type: 'DATERANGE',
		// 	label: '对账日期',
		// 	field: 'date',
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
		let headernfooterHeight = 311;
		let paginationHeight = 96;
		let tableHeight = clientHeight - headerHeight - tabsHeight - cardHeight - gapsHeight - headernfooterHeight - paginationHeight;
		console.log("tableHeight: " + tableHeight + " clientHeight: " + clientHeight + " headerHeight: " + headerHeight + " tabsHeight: " + tabsHeight);
		return tableHeight;
	}

	render() {
		const columns = [
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
					<Tooltip title="返回"><Button type="default" onClick={() => { this.setState({ level: true }) }} icon="caret-left"></Button></Tooltip>
					<Tooltip title="账单存在着一些问题"><Button type="danger" icon="close" style={{ marginLeft: "10px", float: "right" }} onClick={() => this.handleOperate('delete')}>需要核对</Button></Tooltip>
					<Tooltip title="账单不存在任何问题"><Button type="primary" icon="check" style={{ marginLeft: "10px", float: "right" }} onClick={() => this.handleOperate('create')}>确认无误</Button></Tooltip>
					<ReactHTMLTableToExcel
						id="test-table-xls-button"
						className="download-table-xls-button ant-btn ant-btn-default"
						table="table-to-xls"
						filename={"河源市金杰环保建材有限公司对账单" + (2 + 3)}
						sheet="tablexls"
						style={{ marginLeft: "10px", float: "right" }}
						buttonText="导出" />
					<div className="content-wrap">
						<Table
							columns={columns2}
							dataSource={this.state.list1}
							pagination={this.state.pagination1}
							bordered={true}
							scroll={{ y: this.calTableHeight2(), x: 500 }}
							title={() => '河源市金杰环保建材有限公司对账单'}
							scrollToFirstRowOnChange={true}
							footer={() => {
								return <div style={{ background: 'transparent' }}>
									<Descriptions>
										<Descriptions.Item label="注" span={2}>如有异议，请客户在___月___日前来电或来人核对，逾期视同默认此对账单。</Descriptions.Item>
										<Descriptions.Item label="制表"> </Descriptions.Item>
										<Descriptions.Item label="河源市金杰环保建材有限公司（盖章）"> </Descriptions.Item>
										<Descriptions.Item label="对方单位（盖章）"> </Descriptions.Item>
										<Descriptions.Item label="区域经理（签字）"> </Descriptions.Item>
										<Descriptions.Item label="经办人（签字）"> </Descriptions.Item>
										<Descriptions.Item label="用户反馈意见" span={2}> </Descriptions.Item>
									</Descriptions>
									{/* <Button type="primary" icon="check" onClick={() => this.handleOperate('create')}>确认无误</Button>
									<Button type="primary" icon="question" style={{ marginLeft: "10px" }} onClick={() => this.handleOperate('delete')}>需要核对</Button> */}
								</div>
							}}
						/>
						<div style={{ "visibility": "hidden", "position": "absolute", "top": "0", "left": "0", "width": "1px", "height": "1px", "overflow": "hidden" }}>
							<Table
								ref='table'
								columns={columns2}
								dataSource={this.state.list1}
								pagination={this.state.pagination1}
								bordered={true}
								title={() => '河源市金杰环保建材有限公司对账单'}
								scrollToFirstRowOnChange={true}
								footer={() => {
									return <div style={{ background: 'transparent' }}>
										<Descriptions>
											<Descriptions.Item label="注" span={2}>如有异议，请客户在___月___日前来电或来人核对，逾期视同默认此对账单。</Descriptions.Item>
											<Descriptions.Item label="制表"> </Descriptions.Item>
											<Descriptions.Item label="河源市金杰环保建材有限公司（盖章）"> </Descriptions.Item>
											<Descriptions.Item label="对方单位（盖章）"> </Descriptions.Item>
											<Descriptions.Item label="区域经理（签字）"> </Descriptions.Item>
											<Descriptions.Item label="经办人（签字）"> </Descriptions.Item>
											<Descriptions.Item label="用户反馈意见" span={2}> </Descriptions.Item>
										</Descriptions>
									</div>
								}}
							/>
						</div>
					</div>
				</div>
			)
		}
	}
}