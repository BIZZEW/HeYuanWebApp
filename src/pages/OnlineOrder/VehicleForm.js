import React from 'react'
import { Button, Form, Input, Modal, InputNumber, Table } from 'antd'
import axios from './../../axios'
const FormItem = Form.Item;
const { Search } = Input;

class VehicleForm extends React.Component {
	state = {
		isVisible5: false,
		list: [],
		selectedRowKeys: [],
		selectedRows: [],
	}

	getDriverOptions = (value) => {
		let _this = this;
		this.props.form.validateFields(["vehicle"], (err, values) => {
			if (!err) {
				let param = _this.props.form.getFieldsValue(["vehicle"]);
				axios.getDriverInfo(this, '/querydriver', param);
			}
		})
	}

	handleSubmit5 = () => {
		if (this.state.selectedRowKeys) {
			this.setState({ isVisible5: false });
			this.props.form.setFieldsValue({ 'drivername': this.state.selectedRowKeys.drivername });
			this.props.form.setFieldsValue({ 'telphone': this.state.selectedRowKeys.telphone });
			this.props.form.setFieldsValue({ 'driveridentity': this.state.selectedRowKeys.driveridentity });
		} else {
			Modal.info({
				zIndex: 1002,
				title: '提示',
				content: '请选择一个司机信息'
			})
		}
	}

	render() {
		let type2 = this.props.type2;
		let vehicleInfo = this.props.vehicleInfo || {};
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 }
		}

		const rowRadioSelection = {
			type: 'radio',
			columnTitle: "",
			onSelect: (selectedRowKeys, selectedRows) => {
				this.setState({ selectedRowKeys, selectedRows })
			},
		}

		const columns = [
			{
				title: '姓名',
				dataIndex: 'drivername'
			}, {
				title: '手机号',
				dataIndex: 'telphone',
			}, {
				title: '身份证',
				dataIndex: 'driveridentity',
			},
		];

		return (
			<div>
				<Form layout="horizontal">
					<FormItem label="车牌号" {...formItemLayout}>
						{
							getFieldDecorator('vehicle', {
								initialValue: vehicleInfo.vehicle,
								rules: [
									{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}(([A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})|([A-Z0-9]{7}))$/, message: '请输入有效的车牌号!' },
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
							getFieldDecorator('drivername', {
								initialValue: vehicleInfo.drivername,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" allowClear />
							)
						}
					</FormItem>
					<FormItem label="手机号" {...formItemLayout}>
						{
							getFieldDecorator('telphone', {
								initialValue: vehicleInfo.telphone,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" allowClear />
							)
						}
					</FormItem>
					<FormItem label="身份证" {...formItemLayout}>
						{
							getFieldDecorator('driveridentity', {
								initialValue: vehicleInfo.driveridentity,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" allowClear />
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
								// <InputNumber min={1} defaultValue={0} />

								<Input type="number" min={1} defaultValue={1} step={1} addonAfter={"辆"} />
							)
						}
					</FormItem>
				</Form>

				{/* 司机信息 */}
				<Modal
					title={this.state.title5}
					visible={this.state.isVisible5}
					onOk={this.handleSubmit5}
					onCancel={() => {
						this.setState({
							isVisible5: false
						})
					}}
					width={1000}
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
			</div>
		)
	}
}
export default Form.create({})(VehicleForm);
