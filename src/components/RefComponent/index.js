import React from 'react'
import ReactDOM from 'react-dom';
import { Card, Button, Form, Input, Select, Radio, Icon, Modal, DatePicker, InputNumber, Divider, Table, Collapse } from 'antd'
import axios from './../../axios'
import qs from 'qs'
import Utils from './../../utils/utils'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { Search } = Input;
const { Panel } = Collapse;

export default class RefComponent extends React.Component {

    state = {
        // 高级选择弹窗控制
        isVisibleRef: false,

        // 基础数据
        refList: [],
        selectedRowKeysRef: null,
    }

    refParam = {
        // 页面基础数据查询页码
        page: 1,
        serviceid: "refInfoService",
        numbersperpage: 30,
        flag: true,
        pk_appuser: sessionStorage.getItem("pkAppuser") || "",
    }

    refItem = {}

    componentDidMount() {
    }

    // 高级选择打开
    openRef = (item) => {
        let { field, key, action, label, flag, subs, sups } = item;
        let keyfield = this.props.formRef.getFieldValue(key);
        if (flag && keyfield && keyfield != "") {
            // if (flag) {
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

            this.props.formRef.setFieldsValue(_form);
        } else {
            // 上级先选
            if (sups) {
                for (let i of sups) {
                    if (i && i.key && i.field) {
                        let supskey = this.props.formRef.getFieldValue(i.key);
                        let supsfield = this.props.formRef.getFieldValue(i.field);

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

    // 高级选择查询
    requestRef = () => {
        axios.requestRef(this, '/purchase', this.refParam);
    }

    // 高级选择变动
    onSelectChange = selectedRowKeysRef => {
        this.setState({ selectedRowKeysRef });
    };

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

            this.props.formRef.setFieldsValue(_form);

            this.props.formRef.validateFields((err, values) => {
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
        const { selectedRowKeysRef } = this.state;
        const { item } = this.props;
        const { getFieldDecorator } = this.props.formRef;
        const columnsRef = [
            {
                title: '名称',
                dataIndex: 'name'
            },
            {
                title: '编码',
                dataIndex: 'code'
            }
        ];

        const rowSelectionRef = {
            selectedRowKeys: selectedRowKeysRef,
            onChange: (selectedRowKeysRef, selectedRowsRef) => {
                console.log(`selectedRowKeys: ${selectedRowKeysRef}`, 'selectedRows: ', selectedRowsRef);
                this.setState({ selectedRowKeysRef, selectedRowsRef })
            },
        };

        let footer = {};
        if (this.state.type == 'detail') {
            footer = {
                footer: null
            }
        }

        let label = item.label;
        let field = item.field;
        let initialValue = item.initialValue || undefined;
        let placeholder = item.placeholder;
        let width = item.width;
        let disabled = item.disabled;
        let required = item.required || false;
        let cascade = item.cascade;
        let rules = item.rules || null;
        let horizontal = item.horizontal || null;

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }

        return (
            <FormItem label={label} key={field} {...(horizontal ? formItemLayout : {})}>
                {
                    getFieldDecorator([field], {
                        initialValue: initialValue,
                        rules: [
                            { required: required, message: '请选择该项!' }
                        ],
                    })(
                        <Search
                            style={{ width: width }}
                            placeholder={"请选择" + label}
                            enterButton
                            onSearch={
                                (e) => {
                                    if (e != "")
                                        this.openRef({ ...item, flag: 0 })
                                    else
                                        this.openRef({ ...item, flag: 1 })
                                }
                            }
                            onClick={
                                (e) => {
                                    if (e != "")
                                        this.openRef({ ...item, flag: 0 })
                                    else
                                        this.openRef({ ...item, flag: 1 })
                                }
                            }
                            readOnly
                            allowClear
                        />
                    )
                }

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
            </FormItem>
        )
    }
}

