import React from 'react'
import { Button, Form, Input, Modal, InputNumber, Table } from 'antd'
import axios from './../../axios'
import RefComponent from './../../components/RefComponent';
import './longdelivery.scss'
const FormItem = Form.Item;

class VehicleForm extends React.Component {
	state = {
		isVisible5: false,
		list: [],
		selectedRowKeys: [],
		selectedRows: [],
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
		let selectedRow = undefined;

		if (this.state.selectedRows && this.state.selectedRows[0])
			selectedRow = this.state.selectedRows[0];

		let driverInfo = driver || selectedRow || null;

		if (driverInfo) {
			this.setState({
				isVisible5: false,
				selectedRowKeys: [],
				selectedRows: []
			});
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

	render() {
		const { selectedRowKeys } = this.state;
		let type2 = this.props.type2;
		let vehicleInfo = this.props.vehicleInfo || {};
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 }
		}

		const rowSelection = {
			selectedRowKeys: selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
				this.setState({ selectedRowKeys, selectedRows })
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

		return (
			<div>
				<Form layout="horizontal">
					<Button style={{ "width": "20%", "position": "absolute", "right": "4.5%", "marginTop": "0.6%", "zIndex": "1" }} type="primary" onClick={this.getDriverOptions}>获取司机信息</Button>

					<RefComponent
						item={
							{
								action: 9,
								label: "车牌号",
								key: 'vlicense',
								field: 'vlicense',
								required: true,
								width: "68%",
								horizontal: true,
								editable: true,
								initialValue: vehicleInfo.vlicense,
								rules: [
									{ pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}(([A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})|([A-Z0-9]{7}))$/, message: '请输入有效的车牌号!' },
								],
								sups: [{
									key: "pk_supplier",
									field: "pk_supplier",
									name: "供应商"
								}]
							}
						}
						formRef={this.props.form}
					/>

					<FormItem style={{ display: "none" }} >
						{
							getFieldDecorator('pk_supplier', {
								initialValue: this.props.pk_supplier
							})(
								<div />
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
							getFieldDecorator('drivertelephone', {
								initialValue: vehicleInfo.drivertelephone,
								// rules: [{ required: true, message: '请获取司机信息!' }],
							})(
								<Input type="text" placeholder="请获取司机信息" allowClear />
							)
						}
					</FormItem>

					<FormItem label="身份证" {...formItemLayout}>
						{
							getFieldDecorator('driveridcode', {
								initialValue: vehicleInfo.driveridcode,
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
								<Input type="number" min={1} step={1} addonAfter={"辆"} />
							)
						}
					</FormItem>

					{/* <Divider />
					<Button style={{ "width": "30%", "marginLeft": "1.5%" }} type="primary" onClick={this.getDriverOptions}>获取司机信息</Button> */}
				</Form>

				{/* 司机信息 */}
				<Modal
					title={this.state.title5}
					visible={this.state.isVisible5}
					onOk={() => this.handleSubmit5(false)}
					onCancel={() => {
						this.setState({
							isVisible5: false,
							selectedRowKeys: [],
							selectedRows: []
						})
					}}
					width={1000}
					destroyOnClose={true}
				>
					<div className="content-wrap">
						<Table
							onRow={(record, rowIndex) => {
								return {
									onDoubleClick: () => {
										console.log(rowIndex, record);
										let tmpSelected = [];
										let tmpSelectedKeys = [];
										tmpSelected.push(record);
										tmpSelectedKeys.push(rowIndex);
										this.setState({
											selectedRows: tmpSelected,
											selectedRowKeys: tmpSelectedKeys,
										}, () => this.handleSubmit5(false))
									},
								};
							}}
							bordered
							columns={columns}
							dataSource={this.state.list}
							pagination={false}
							rowSelection={{
								type: "radio",
								...rowSelection,
							}}
						/>
					</div>
				</Modal>
			</div>
		)
	}
}
export default Form.create({})(VehicleForm);
