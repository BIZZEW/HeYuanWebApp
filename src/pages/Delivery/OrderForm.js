import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table, Collapse } from 'antd'
import axios from './../../axios'
import Utils from './../../utils/utils'
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
		// 车辆信息表单弹窗显示控制
		isVisible99: false,
		list: [],
		selectedRowKeys: [],
		selectedRows: null,
		selectedRowKeys99: null,
		clientRef: sessionStorage.getItem('clientRef') || [],
		cementRef: sessionStorage.getItem('cementRef') || [],
		companyRef: sessionStorage.getItem('companyRef') || [],
		vehicleList: [],
	}

	params = {
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
			label: '采购单位',
			code: 2,
			key: 'pk_buyer',
			field: 'buyername',
			width: 200,
			trigger: item => this.openRef(item)
		},
		{
			type: 'ADVSELECTPK',
			field: 'pk_buyer',
		},
		{
			type: 'ADVSELECT',
			label: '收货企业',
			code: 2,
			key: 'pk_stock',
			field: 'stockname',
			width: 200,
			trigger: item => this.openRef(item)
		},
		{
			type: 'ADVSELECTPK',
			field: 'pk_stock',
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

			this.proqRef.props.form.setFieldsValue(_form);

			// this.proqRef.props.form.validateFields((err, values) => {
			// 	if (!err) {
			// 		console.log(values)
			// 	}
			// });
		} else {
			Modal.info({
				title: '提示',
				content: '请选择一条数据'
			})
		}
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
		const { selectedRowKeys99 } = this.state;
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

		const rowSelection99 = {
			selectedRowKeys: selectedRowKeys99,
			onChange: (selectedRowKeys99, selectedRows99) => {
				console.log(`selectedRowKeys: ${selectedRowKeys99}`, 'selectedRows: ', selectedRows99);
				this.setState({ selectedRowKeys99, selectedRows99 })
			},
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
						this.proqRef.props.form.resetFields();
					}}
					width={1200}
				>
					<Card>
						<BaseForm wrappedComponentRef={(form) => this.proqRef = form} formList={this.formList} filterSubmit={this.handleFilter} />
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
			</div >
		)
	}
}
export default Form.create({})(OrderForm);
