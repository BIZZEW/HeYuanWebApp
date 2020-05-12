import React from 'react';
import { Form, Input, Modal, Table } from 'antd'
import axios from './../../axios'
const FormItem = Form.Item;
const { Search } = Input;

export default class RefComponent extends React.Component {

    state = {
        // 分页参照弹窗控制
        isVisibleRef: false,

        // 基础数据
        refList: [],
        selectedRowKeysRef: [],
    }

    refParam = {
        // 页面基础数据查询页码
        page: 1,
        serviceid: "refInfoService",
        numbersperpage: 10,
        flag: true,
        pk_appuser: sessionStorage.getItem("pkAppuser") || "",
    }

    refItem = {}

    // 分页参照打开
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

    // 分页参照查询
    requestRef = () => {
        axios.requestRef(this, '/purchase', this.refParam);
    }

    // 分页参照变动
    onSelectChange = selectedRowKeysRef => {
        this.setState({ selectedRowKeysRef });
    };

    //分页参照确认
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
            _form[field] = item.name;
            _form[key] = item.pk;

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
        const { item, type, detail } = this.props;
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
        let rules = item.rules || [];
        let horizontal = item.horizontal || null;
        let editable = item.editable || false;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        return (
            <FormItem label={label} key={field} {...(horizontal ? formItemLayout : {})}>
                {
                    type == 'detail' ? detail :
                        getFieldDecorator([field], {
                            initialValue: initialValue,
                            rules: [
                                { required: required, message: '请选择该项!' },
                                ...rules
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
                                        if (!editable)
                                            if (e != "")
                                                this.openRef({ ...item, flag: 0 })
                                            else
                                                this.openRef({ ...item, flag: 1 })
                                    }
                                }
                                readOnly={!editable}
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
                            selectedRowsRef: []
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
                                            selectedRowsRef: tmpSelected,
                                            selectedRowKeysRef: tmpSelectedKeys,
                                        }, () => this.handleSubmitRef())
                                    },
                                };
                            }}
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

