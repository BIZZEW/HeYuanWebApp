import React from 'react'
import { Button, Form, Input, Modal, InputNumber, Table } from 'antd'
import axios from './../../axios'
import RefComponent from './../../components/RefComponent';
import './delivery.scss'
const FormItem = Form.Item;

class VehicleForm extends React.Component {
	state = {
		isVisible5: false,
		list: [],
		selectedRowKeys: null,
		selectedRows: null,
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
					numbersperpage: 30,
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

	render() {
		let type2 = this.props.type2;
		let vehicleInfo = this.props.vehicleInfo || {};
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
								initialValue: vehicleInfo.vlicense,
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
			</div>
		)
	}
}
export default Form.create({})(VehicleForm);
