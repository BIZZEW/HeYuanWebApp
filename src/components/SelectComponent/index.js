import React from 'react';
import { Form, Select, Input, Modal, Table } from 'antd';
import axios from './../../axios';
const Option = Select.Option
const FormItem = Form.Item;

export default class SelectComponent extends React.Component {

    state = {
        clientRef: sessionStorage.getItem('clientRef') || [],
    }

    selectParam = {}

    selectClick(visible, item) {
        let { requestUrl, sups } = item;

        if (requestUrl && visible) {
            this.selectParam.requestUrl = requestUrl;
            if (sups) {
                for (let i of sups) {
                    if (i) {
                        let supValue = this.props.formSelect.getFieldValue(i);

                        if (supValue)
                            this.selectParam[i] = supValue;
                        else {
                            Modal.info({
                                zIndex: 1002,
                                title: '提示',
                                content: '请先选择' + (i || "上级查询条件")
                            });
                            return;
                        }
                    }
                }
            }
            this.requestOptions(this.selectParam);
        }
    }

    requestOptions(param) {
        for (var i of eval(this.state.clientRef))
            if (i.customer === param.customer)
                param = { ...param, ...i };

        axios.requestOptions(this, this.selectParam.requestUrl, param);
    }

    handleSelect(item) {
        let { subs } = item;

        let _form = {};

        // 清空下级
        if (subs)
            for (let i of subs)
                if (i)
                    _form[i] = "";

        this.props.formSelect.setFieldsValue(_form);
    }

    getSubOptions = (param, sub) => {
        for (var i of eval(this.state.clientRef))
            if (i.customer === param.customer)
                param = { ...param, ...i };

        if (sub === "billno")
            axios.requestOptions(this, '/querybillno', param);
        else
            axios.requestOptions(this, '/querycemtype', param);
    }

    injectOptions(data) {
        if (!data) {
            return [];
        }
        let { list, idKey, valueKey } = data;
        let options = [];
        // var parsedList = eval(list);
        if (list)
            eval(list).map((item) => {
                if (idKey)
                    options.push(<Option value={item[idKey]} key={item[idKey]}>{item[valueKey]}</Option>)
                else
                    options.push(<Option value={item} key={item[idKey]}>{item}</Option>)
            })
        return options;
    }

    render() {
        const { item, type, detail } = this.props;
        const { getFieldDecorator } = this.props.formSelect;

        let label = item.label;
        let field = item.field;
        let initialValue = item.initialValue || undefined;
        let placeholder = item.placeholder;
        let width = item.width;
        let disabled = item.disabled;
        let required = item.required || false;
        let rules = item.rules || null;
        let horizontal = item.horizontal || null;

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
                                { required: required, message: '请选择该项!' }
                            ],
                        })(
                            <Select
                                style={{ width: width }}
                                placeholder={"请选择" + label}
                                disabled={disabled}
                                onSelect={() => this.handleSelect(item)}
                                onDropdownVisibleChange={(visible) => this.selectClick(visible, item)}
                            >
                                {this.injectOptions({ ...item, ...this.state })}
                            </Select>
                        )
                }
            </FormItem>
        )
    }
}