import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table } from 'antd'
import axios from './../../axios'
import Utils from './../../utils/utils'
import VehicleForm from './VehicleForm'
const FormItem = Form.Item;
const { Search } = Input;

//子组件：创建订单表单
class OrderForm extends React.Component {
	state = {
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
		var oldVehicles = this.props.vehicles;
		this.setState({
			isVisible3: true,
			title3: '车辆信息',
			vehicleList: oldVehicles.slice(0),
		})
	}

	getSubOptions = (param) => {
		axios.requestOptions2(this, '/querycemtype', param, "cementRef");
		axios.requestOptions2(this, '/querysaleunit', param, "companyRef");
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

	render() {
		const { selectedRowKeys } = this.state;
		let type = this.props.type;
		let vehicleInfoNum = this.props.vehicles.length;
		let orderInfo = this.props.orderInfo || {};
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 }
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

		return (
			<div>
				<Form layout="horizontal">
					<FormItem label="客户" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.customername :
								getFieldDecorator('customer', {
									initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].customer) : undefined,
								})(
									<Select
										placeholder={"请选择客户"}
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
					<FormItem label="销售单位" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.saleorgname :
								getFieldDecorator('pk_salesorg', {
									initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].saleorg) : undefined,
								})(
									<Select
										placeholder={"请选择销售单位"}>
										{Utils.getOptionList({
											list: this.state.companyRef,
											idKey: "pk_salesorg",
											valueKey: "name"
										})}
									</Select>
								)
						}
					</FormItem>
					<FormItem label="发货企业" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.sendstockorgname :
								getFieldDecorator('sendstockorg', {
									initialValue: sessionStorage.getItem('clientRef') ? (JSON.parse(sessionStorage.getItem('clientRef'))[0].sendstockorg) : undefined,
								})(
									<Select
										placeholder={"请选择发货企业"} disabled>
										{Utils.getOptionList({
											list: this.state.clientRef,
											idKey: "sendstockorg",
											valueKey: "sendstockorgname"
										})}
									</Select>
								)
						}
					</FormItem>

					<Divider />

					<FormItem label="水泥品种" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.materialname :
								getFieldDecorator('pk_material', {
									initialValue: orderInfo.pk_material || undefined
								})(
									<Select
										placeholder={"请选择水泥品种"}>
										{Utils.getOptionList({
											list: this.state.cementRef,
											idKey: "pk_material",
											valueKey: "name"
										})}
									</Select>
								)
						}
					</FormItem>
					<FormItem label="数量" {...formItemLayout}>
						{
							type == 'detail' ? orderInfo.ordernum :
								getFieldDecorator('ordernum', {
									initialValue: orderInfo.ordernum
								})(
									<InputNumber min={1} defaultValue={0}  style={{ width: "100%" }} />
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
			</div>
		)
	}
}
export default Form.create({})(OrderForm);
