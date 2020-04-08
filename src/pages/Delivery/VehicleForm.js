import React from 'react'
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table, Collapse } from 'antd'
import axios from './../../axios'
import './delivery.scss'
const FormItem = Form.Item;
const { Search } = Input;

class VehicleForm extends React.Component {
	state = {
		isVisible5: false,
		// 高级选择弹窗控制
		isVisibleRef: false,
		list: [],
		selectedRowKeys: null,
		selectedRows: null,

		// 基础数据
		refList: [],
		selectedRowKeysRef: null,
	}

	refParam = {
		// 页面基础数据查询页码
		page: 1,
		serviceid: "refInfoService",
		numbersperpage: 10,
		flag: true,
		pk_appuser: sessionStorage.getItem("pkAppuser") || "",
		pk_supplier: this.props.pk_supplier,
	}

	refItem = {}

	requestRef = () => {
		axios.requestRef(this, '/purchase', this.refParam);
	}

	openRef = (item) => {
		let { field, key, action, label, flag, subs, sups } = item;
		let scope = this

		let keyfield = scope.props.form.getFieldValue(key);
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

			scope.props.form.setFieldsValue(_form);
		} else {
			// 上级先选
			if (sups) {
				for (let i of sups) {
					if (i && i.key && i.field) {
						let supskey = scope.props.form.getFieldValue(i.key);
						let supsfield = scope.props.form.getFieldValue(i.field);

						if (supskey && supskey != "" && supsfield && supsfield != "")
							this.refParam[i.key] = supskey;
						else {
							Modal.info({
								zIndex: 1002,
								title: '提示',
								content: '请先选择' + (i.name || "上级查询条件")
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

	getDriverOptions = () => {
		let _this = this;
		this.props.form.validateFields(["vlicense"], (err, values) => {
			if (!err) {
				let param = _this.props.form.getFieldsValue(["vlicense"]);
				param = {
					...param,
					action: 10,
					page: 1,
					numbersperpage: 10,
					serviceid: "refInfoService",
					ncusercode: sessionStorage.getItem("userName") || "",
					ncuserpassword: sessionStorage.getItem("passWord") || "",
					pk_appuser: sessionStorage.getItem("pkAppuser") || "",
					flag: true
				}
				axios.getDriverInfoPurchase(this, '/purchase', param);
			}
		})
	}

	handleSubmit5 = (driver) => {
		let driverInfo = driver || this.state.selectedRowKeys || null;
		if (driverInfo) {
			this.setState({ isVisible5: false });
			this.props.form.setFieldsValue({
				'drivername': driverInfo.code,
				'drivertelephone': (driverInfo.name.split(" ")[1]) || "",
				'driveridcode': driverInfo.pk
			});
		} else {
			Modal.info({
				zIndex: 1002,
				title: '提示',
				content: '请选择一个司机信息'
			})
		}
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
			let scope = this

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

			scope.props.form.setFieldsValue(_form);

			scope.props.form.validateFields((err, values) => {
				if (!err) {
					console.log(values)
				}
			});
		} else {
			Modal.info({
				zIndex: 1002,
				title: '提示',
				content: '请选择一条数据'
			})
		}
	}

	render() {
		let type2 = this.props.type2;
		let vehicleInfo = this.props.vehicleInfo || {};
		const { selectedRowKeysRef } = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 }
		}

		const rowRadioSelection = {
			type: 'radio',
			columnTitle: "",
			onSelect: (selectedRowKeys, selectedRows) => {
				this.setState({ selectedRowKeys, selectedRows })
			},
		}

		const rowSelectionRef = {
			selectedRowKeys: selectedRowKeysRef,
			onChange: (selectedRowKeysRef, selectedRowsRef) => {
				console.log(`selectedRowKeys: ${selectedRowKeysRef}`, 'selectedRows: ', selectedRowsRef);
				this.setState({ selectedRowKeysRef, selectedRowsRef })
			},
		};

		const columns = [
			{
				title: '姓名',
				dataIndex: 'code'
			}, {
				title: '手机号',
				dataIndex: 'name',
				render: (text) => {
					return text.split(" ")[1] || "";
				}
			}, {
				title: '身份证',
				dataIndex: 'pk',
			},
		];

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

		return (
			<div>
				<Form layout="horizontal">
					<FormItem label="车牌号" {...formItemLayout}>
						{
							getFieldDecorator('vlicense', {
								initialValue: vehicleInfo.vlicense,
								rules: [
									{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '请输入有效的车牌号!' },
									{ required: true, message: '请输入车牌!' }
								],
							})(
								<Search
									style={{ width: "68%" }}
									placeholder={"请选择车牌号"}
									enterButton
									onSearch={
										(e) => {
											if (e != "")
												this.openRef({
													action: 9,
													label: "车牌号",
													key: 'vlicense',
													field: 'vlicensename',
													flag: 0
												})
											else
												this.openRef({
													action: 9,
													label: "车牌号",
													key: 'vlicense',
													field: 'vlicensename',
													flag: 1
												})
										}
									}
									allowClear
								/>)
						}
						<Button style={{ "width": "30%", "marginLeft": "1.5%" }} type="primary" onClick={this.getDriverOptions}>获取司机信息</Button>
					</FormItem>

					<FormItem label="司机姓名" {...formItemLayout}>
						{
							getFieldDecorator('drivername', {
								initialValue: vehicleInfo.drivername,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" />
							)
						}
					</FormItem>
					<FormItem label="手机号" {...formItemLayout}>
						{
							getFieldDecorator('drivertelephone', {
								initialValue: vehicleInfo.drivertelephone,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" />
							)
						}
					</FormItem>
					<FormItem label="身份证" {...formItemLayout}>
						{
							getFieldDecorator('driveridcode', {
								initialValue: vehicleInfo.driveridcode,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" />
							)
						}
					</FormItem>
					<FormItem label="车数" {...formItemLayout}>
						{

							getFieldDecorator('amount', {
								initialValue: type2 == 'edit' ? vehicleInfo.amount : 1,
								rules: [
									{ required: true, message: '请输入车数!' }
								],
							})(
								<InputNumber min={1} defaultValue={0} />
							)
						}
					</FormItem>
				</Form>

				{/* 司机信息 */}
				<Modal
					title={this.state.title5}
					visible={this.state.isVisible5}
					onOk={() => this.handleSubmit5(false)}
					onCancel={() => {
						this.setState({
							isVisible5: false
						})
					}}
					width={1000}
					destroyOnClose={true}
				>
					<div className="content-wrap">
						<Table
							bordered
							columns={columns}
							dataSource={this.state.list}
							rowSelection={rowRadioSelection}
							pagination={false}
						/>
					</div>
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
					zIndex={1001}
					destroyOnClose={true}
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
export default Form.create({})(VehicleForm);
