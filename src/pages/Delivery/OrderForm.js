import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table, Collapse } from 'antd'
import axios from './../../axios'
import Utils from './../../utils/utils'
import RefComponent from './../../components/RefComponent';
import BaseForm from './../../components/BaseForm'
import VehicleForm from './VehicleForm'
import moment from 'moment'
import './delivery.scss'
const FormItem = Form.Item;
const { Search } = Input;
const { Panel } = Collapse;

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

		// 采购订单
		selectedRowKeysProq: [],
		selectedRowsProq: [],

		dftstockorg: JSON.parse(sessionStorage.getItem("dftstockorg") || "")
	}

	params = {
		// 页面主要业务查询页码
		page: 1,
	}

	componentDidUpdate() {
		console.log("componentDidUpdate triggered!", this.props.form.getFieldsValue())
	}

	formList = [
		{
			type: 'DATE',
			label: '开始日期',
			field: 'begindate',
			placeholder: '请选择开始日期',
			initialValue: moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), "YYYY-MM-DD"),
		},
		{
			type: 'DATE',
			label: '结束日期',
			field: 'enddate',
			placeholder: '请选择结束日期',
			initialValue: moment(new Date(), "YYYY-MM-DD"),
		},

		{
			type: 'REFCOMP',
			label: '供应商',
			action: 7,
			key: 'pk_supplier',
			field: 'suppliername',
			subs: [{
				key: "pk_purchaseorg",
				field: "purchaseorgname"
			}],
			width: 300,
		},
		{
			type: 'REFCOMPPK',
			field: 'pk_supplier',
		},

		{
			type: 'REFCOMP',
			label: '采购单位',
			action: 4,
			key: 'pk_purchaseorg',
			field: 'purchaseorgname',
			sups: [{
				key: "pk_supplier",
				field: "suppliername",
				name: "供应商"
			}],
			width: 300,
		},
		{
			type: 'REFCOMPPK',
			field: 'pk_purchaseorg',
		},

		{
			type: 'REFCOMP',
			label: '矿点',
			action: 20,
			key: 'pk_orespot',
			field: 'orespotname',
			width: 300,
		},
		{
			type: 'REFCOMPPK',
			field: 'pk_orespot',
		},

		{
			type: 'REFCOMP',
			label: '收货企业',
			action: 5,
			key: 'pk_stockorg',
			field: 'stockorgname',
			subs: [{
				key: "cmaterialid",
				field: "materialname"
			}],
			initialValue: this.state.dftstockorg.name || "",
			width: 300,
		},
		{
			type: 'REFCOMPPK',
			field: 'pk_stockorg',
			initialValue: this.state.dftstockorg.pk_org || "",
		},

		{
			type: 'REFCOMP',
			label: '货物',
			action: 8,
			key: 'cmaterialid',
			field: 'materialname',
			sups: [{
				key: "pk_stockorg",
				field: "stockorgname",
				name: "收货企业"
			}],
			width: 300,
		},
		{
			type: 'REFCOMPPK',
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
				{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}([A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})|([A-Z0-9]{7})$/, message: '请输入有效的车牌号!' },
				// { required: true, message: '请输入车牌!' }
			],
		},
	];

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

		axios.requestListPurchase(this, '/purchase', {
			...this.params,
			action: 10,
			serviceid: "receiveOrderService",
			ncusercode: sessionStorage.getItem("userName") || "",
			ncuserpassword: sessionStorage.getItem("passWord") || "",
			pk_appuser: sessionStorage.getItem("pkAppuser") || "",
			flag: true
		});
	}

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
					zIndex: 1002,
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
					zIndex: 1002,
					title: '提示',
					content: '请选择一个车辆信息'
				})
				return;
			}
			let _this = this;
			Modal.confirm({
				zIndex: 1002,
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
		let pk_supplier = this.props.form.getFieldValue("pk_supplier");
		if (pk_supplier) {
			var oldVehicles = this.props.vehicles;
			this.setState({
				isVisible3: true,
				title3: '车辆信息',
				vehicleList: oldVehicles.slice(0),
				pk_supplier: pk_supplier,
			})
		} else {
			Modal.info({
				zIndex: 1002,
				title: '提示',
				content: '请先获取采购订单'
			})
		}
	}

	getSubOptions = (param) => {
		// this.props.getSubOptions(param);
		axios.getOptions2(this, '/querycemtype', param, "cementRef");
		axios.getOptions2(this, '/querysaleunit', param, "companyRef");
	}

	handleSubmit0 = () => {
		console.log(this.state.selectedRowsProq)
		if (this.state.selectedRowsProq && this.state.selectedRowsProq[0]) {
			let item = this.state.selectedRowsProq[0];

			item.pk_stockorg = item.purchaseorg_pk_org || "";
			item.ordercode = item.vbillcode || "";
			item.pk_purchaseorder = item.pk_order || "";
			item.cmaterialid = item.material_pk_material || "";
			item.pk_supplier = item.supplier_pk_supplier || "";

			this.setState({
				isVisible0: false,
				selectedRowKeysProq: [],
				selectedRowsProq: []
			}, (() => { this.props.form.setFieldsValue(item); }));
		} else {
			Modal.info({
				zIndex: 1002,
				title: '提示',
				content: '请选择一个采购订单'
			})
		}
	}

	handleSubmit3 = () => {
		this.setState({
			isVisible3: false,
		}, () => { this.props.updateVehicles(this.state.vehicleList) })
	}

	handleSubmit4 = () => {
		let type2 = this.state.type2;
		this.vehicleForm.props.form.validateFields((err, values) => {
			console.log(values);
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
		this.setState({ selectedRowKeys });
	};

	getProcureOptions = () => {
		this.setState({
			isVisible0: true,
			title0: '采购订单',
			list: [],
		})
	}

	render() {
		const { selectedRowKeys } = this.state;
		const { selectedRowKeysProq } = this.state;

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

		const rowSelectionProq = {
			selectedRowKeys: selectedRowKeysProq,
			onChange: (selectedRowKeysProq, selectedRowsProq) => {
				console.log(`selectedRowKeys: ${selectedRowKeysProq}`, 'selectedRows: ', selectedRowsProq);
				this.setState({ selectedRowKeysProq, selectedRowsProq })
			},
		};

		const columns0 = [
			{
				title: '车牌',
				dataIndex: 'vlicense'
			},
			{
				title: '司机姓名',
				dataIndex: 'drivername'
			}, {
				title: '司机手机号',
				dataIndex: 'drivertelephone',
			}, {
				title: '司机身份证',
				dataIndex: 'driveridcode',
			}, {
				title: '车数',
				dataIndex: 'amount',
			}
		];

		const columns2 = [
			{
				title: '采购订单日期',
				dataIndex: 'dbilldate'
			}, {
				title: '采购单位',
				dataIndex: 'purchaseorg_name',
			}, {
				title: '收货企业',
				dataIndex: 'rcvstockorg_name',
			}, {
				title: '供应商',
				dataIndex: 'supplier_name',
			}, {
				title: '货物',
				dataIndex: 'material_name',
			}, {
				title: '余量',
				dataIndex: 'remainnum',
			}, {
				title: '矿点',
				dataIndex: 'orespotname',
			},
		];

		return (
			<div>
				<Form layout="horizontal">
					<FormItem label="采购订单" {...formItemLayout} style={{ "marginBottom": "15px" }}>
						{
							type == 'detail' ? orderInfo.ordercode :
								getFieldDecorator('ordercode', {
									initialValue: orderInfo.ordercode,
								})(
									<Search
										placeholder="请选择采购订单"
										enterButton="获取"
										readOnly
										// size="large"
										onSearch={() => this.getProcureOptions()}
										onClick={() => this.getProcureOptions()}
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
						<Panel header={"采购订单详情 / 货物: " + (this.props.form.getFieldValue("material_name") || "") + " / 余量: " + (this.props.form.getFieldValue("remainnum") || "") + " " + (this.props.form.getFieldValue("material_dw") || "") + " / 矿点: " + (this.props.form.getFieldValue("orespotname") || "") + " /"} key="1" className="site-collapse-custom-panel">
							<FormItem label="采购订单日期" {...formItemLayout} onClick={() => this.getProcureOptions()}>
								{
									type == 'detail' ? orderInfo.dbilldate :
										getFieldDecorator('dbilldate', {
											initialValue: orderInfo.dbilldate,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
							<FormItem label="采购单位" {...formItemLayout} onClick={() => this.getProcureOptions()}>
								{
									type == 'detail' ? orderInfo.purchaseorg_name :
										getFieldDecorator('purchaseorg_name', {
											initialValue: orderInfo.purchaseorg_name,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
							<FormItem label="收货企业" {...formItemLayout} onClick={() => this.getProcureOptions()}>
								{
									type == 'detail' ? orderInfo.rcvstockorg_name :
										getFieldDecorator('rcvstockorg_name', {
											initialValue: orderInfo.rcvstockorg_name,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
							<FormItem label="供应商" {...formItemLayout} onClick={() => this.getProcureOptions()}>
								{
									type == 'detail' ? orderInfo.supplier_name :
										getFieldDecorator('supplier_name', {
											initialValue: orderInfo.supplier_name,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
							<FormItem key="pk_supplier" style={{ display: "none" }} >
								{
									getFieldDecorator("pk_supplier")(
										<div />
									)
								}
							</FormItem>
							<FormItem label="货物" {...formItemLayout} onClick={() => this.getProcureOptions()}>
								{
									type == 'detail' ? orderInfo.material_name :
										getFieldDecorator('material_name', {
											initialValue: orderInfo.material_name,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
							<FormItem style={{ display: "none" }} >
								{
									getFieldDecorator("cmaterialid")(
										<div />
									)
								}
							</FormItem>
							<FormItem label="余量" {...formItemLayout} onClick={() => this.getProcureOptions()}>
								{
									type == 'detail' ? orderInfo.remainnum :
										getFieldDecorator('remainnum', {
											initialValue: orderInfo.remainnum,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
							<FormItem label="矿点" {...formItemLayout} onClick={() => this.getProcureOptions()}>
								{
									type == 'detail' ? orderInfo.orespotname :
										getFieldDecorator('orespotname', {
											initialValue: orderInfo.orespotname,
										})(
											<Input type="text" placeholder="请选择采购订单" readOnly />
										)
								}
							</FormItem>
							<FormItem style={{ display: "none" }} >
								{
									getFieldDecorator("pk_stockorg")(
										<div />
									)
								}
							</FormItem>
							<FormItem style={{ display: "none" }} >
								{
									getFieldDecorator("pk_purchaseorder")(
										<div />
									)
								}
							</FormItem>
						</Panel>
					</Collapse>

					<Divider />

					{(type == "detail") && (<FormItem label="收货单号" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.drivername :
								getFieldDecorator('drivername', {
									initialValue: orderInfo.drivername,
								})(
									<Input type="text" placeholder="请填写收货单号" />
								)
						}
					</FormItem>)}

					<FormItem label="收货日期" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.receiveDate :
								getFieldDecorator('receiveDate', {
									initialValue: orderInfo.receiveDate,
								})(
									<DatePicker format="YYYY-MM-DD" disabled style={{ width: "200px" }} defaultValue={moment(new Date(), "YYYY-MM-DD")} />
								)
						}
					</FormItem>

					<FormItem label="原发净重" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.srcsendnum :
								getFieldDecorator('srcsendnum', {
									initialValue: 0.00
								})(
									<Input type="number" min={0} defaultValue={0.00} step={0.01} style={{ width: "200px" }} />
								)
						}
						{type == 'detail' ? orderInfo.material_dw : <div style={{ "display": "inline", "margin": "0 10px" }}>{this.props.form.getFieldValue("material_dw") || "单位"}</div>}
					</FormItem>
					<FormItem label="到货量" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.num :
								getFieldDecorator('num', {
									initialValue: 0.00
								})(
									<Input type="number" min={0} defaultValue={0.00} step={0.01} style={{ width: "200px" }} />
								)
						}
						{type == 'detail' ? orderInfo.material_dw : <div style={{ "display": "inline", "margin": "0 10px" }}>{this.props.form.getFieldValue("material_dw") || "单位"}</div>}
					</FormItem>

					<FormItem style={{ display: "none" }} >
						{
							getFieldDecorator("material_dw")(
								<div />
							)
						}
					</FormItem>

					<RefComponent
						item={
							{
								action: 15,
								label: "运输商",
								key: 'pk_sendsupplier',
								field: 'sendsuppliername',
								horizontal: true,
							}
						}
						formRef={this.props.form}
						type={type}
						detail={orderInfo.sendsuppliername}
					/>

					<FormItem key="pk_sendsupplier" style={{ display: "none" }} >
						{
							getFieldDecorator("pk_sendsupplier")(
								<div />
							)
						}
					</FormItem>

					<FormItem label="集装箱号" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.containerno :
								getFieldDecorator('containerno', {
									initialValue: orderInfo.containerno,
								})(
									<Input type="text" placeholder="请填写集装箱号" />
								)
						}
					</FormItem>

					<Divider />
					{(type == "detail") && (<div>
						<FormItem label="车牌号" {...formItemLayout}>
							{
								type == 'detail' ? orderInfo.vlicense :
									getFieldDecorator('vlicense', {
										initialValue: orderInfo.vlicense,
										rules: [
											{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}([A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})|([A-Z0-9]{7})$/, message: '请输入有效的车牌号!' },
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
								type == 'detail' ? orderInfo.drivertelephone :
									getFieldDecorator('drivertelephone', {
										initialValue: orderInfo.drivertelephone,
										// rules: [{ required: true, message: '请获取司机信息!' }],
									})(
										<Input type="text" placeholder="请获取司机信息" />
									)
							}
						</FormItem>
						<FormItem label="身份证" {...formItemLayout}>
							{
								type == 'detail' ? orderInfo.driveridcode :
									getFieldDecorator('driveridcode', {
										initialValue: orderInfo.driveridcode,
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
							isVisible0: false,
							selectedRowKeysProq: [],
							selectedRowsProq: []
						})
						this.formRef.props.form.resetFields();
					}}
					width={1200}
					// centered={true}
					destroyOnClose={true}
				>
					<Card>
						<BaseForm wrappedComponentRef={(form) => this.formRef = form} formList={this.formList} filterSubmit={this.handleFilter} />
					</Card>
					<div className="content-wrap">
						<Table
							bordered
							columns={columns2}
							dataSource={this.state.list}
							rowSelection={{
								type: "radio",
								...rowSelectionProq,
							}}
							pagination={this.state.pagination}
							scroll={{ y: 250 }}
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
					destroyOnClose={true}
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
					destroyOnClose={true}
				>
					<VehicleForm type2={this.state.type2} vehicleInfo={this.state.vehicleInfo} wrappedComponentRef={(inst) => { this.vehicleForm = inst; }} pk_supplier={this.state.pk_supplier} />
				</Modal>
			</div >
		)
	}
}
export default Form.create({})(OrderForm);
