import React from 'react'
import { Input, Select, Form, Button, Checkbox, DatePicker } from 'antd'
import Utils from '../../utils/utils'
import axios from './../../axios'
import RefComponent from '../RefComponent';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Search } = Input;

class FilterForm extends React.Component {
    state = {
        clientRef: sessionStorage.getItem('clientRef') || [],
    }

    formList = []

    handleFilterSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let fieldsValue = this.props.form.getFieldsValue();
                this.props.filterSubmit(fieldsValue);
            }
        });
    }

    getSubOptions = (param, cascade) => {
        for (var i of eval(this.state.clientRef))
            if (i.customer === param.customer)
                param = { ...param, ...i };

        if (cascade === "billno")
            axios.getOptions(this, '/querybillno', param);
        else
            axios.getOptions(this, '/querycemtype', param);
    }

    reset = () => {
        this.props.form.resetFields();
    }

    initFormList = () => {
        const { getFieldDecorator } = this.props.form;
        // console.log(this.props.form);
        this.formList = this.props.formList;
        const formItemList = [];
        if (this.formList && this.formList.length > 0) {
            this.formList.forEach((item, i) => {
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || undefined;
                let placeholder = item.placeholder;
                let width = item.width;
                let disabled = item.disabled;
                let required = item.required || false;
                let cascade = item.cascade;
                let rules = item.rules || null;
                if (item.type === '时间查询') {
                    const begin_time = <FormItem label="订单时间" key='begin'>
                        {
                            getFieldDecorator('begin_time')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(begin_time);
                    //~后省略冒号：label="~" colon={false} 
                    const end_time = <FormItem key='end'>
                        {
                            getFieldDecorator('end_time')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(end_time);
                } else if (item.type == 'INPUT') {
                    const INPUT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                rules: rules
                            })(
                                <Input type="text" style={{ width: width }} placeholder={placeholder} />
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT);
                } else if (item.type === 'SELECT') {
                    const SELECT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <Select
                                    style={{ width: width }}
                                    placeholder={[placeholder]}
                                    disabled={disabled}
                                    onSelect={(value) => {
                                        if (cascade) {
                                            let obj = {};
                                            obj[field] = value;
                                            this.getSubOptions(obj, cascade);
                                            this.props.form.resetFields([cascade]);
                                        }
                                    }}
                                >
                                    {Utils.getOptionList(item)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT);
                } else if (item.type === 'ADVSELECT') {
                    const ADVSELECT = <FormItem label={label} key={field}>
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
                                                item.trigger({ ...item, flag: 0 })
                                            else
                                                item.trigger({ ...item, flag: 1 })
                                        }
                                    }
                                    onClick={
                                        (e) => {
                                            if (e != "")
                                                item.trigger({ ...item, flag: 0 })
                                            else
                                                item.trigger({ ...item, flag: 1 })
                                        }
                                    }
                                    readOnly
                                    allowClear
                                />
                            )
                        }
                    </FormItem>;
                    formItemList.push(ADVSELECT);
                } else if (item.type === 'ADVSELECTPK') {
                    const ADVSELECTPK = <FormItem key={field} style={{ display: "none" }} >
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <div />
                            )
                        }
                    </FormItem>;
                    formItemList.push(ADVSELECTPK);
                } else if (item.type === 'REFCOMP') {
                    const REFCOMP = <RefComponent
                            item={item}
                            formRef={this.props.form}
                        />;
                    formItemList.push(REFCOMP);
                } else if (item.type === 'REFCOMPPK') {
                    const REFCOMPPK = <FormItem key={field} style={{ display: "none" }} >
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <div />
                            )
                        }
                    </FormItem>;
                    formItemList.push(REFCOMPPK);
                } else if (item.type === 'CHECKBOX') {
                    const CHECKBOX = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                valuePropName: 'checked',
                                initialValue: initialValue //true | false
                            })(
                                <Checkbox>
                                    {label}
                                </Checkbox>
                            )
                        }
                    </FormItem>;
                    formItemList.push(CHECKBOX);
                } else if (item.type === 'DATE') {
                    const DATEPICKER = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue,
                                rules: [
                                    { required: required, message: '请选择日期!' }
                                ],
                            })(
                                <DatePicker
                                    showTime={true}
                                    placeholder={placeholder}
                                    format="YYYY-MM-DD"
                                />
                            )
                        }
                    </FormItem>;
                    formItemList.push(DATEPICKER);
                } else if (item.type === 'DATERANGE') {
                    const RANGEPICKER = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <RangePicker />
                                // <RangePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(RANGEPICKER);
                }
            })
        }
        return formItemList;
    }

    render() {
        return (
            <Form layout="inline">
                {this.initFormList()}
                <FormItem>
                    <Button type="primary" style={{ margin: '0 10px' }} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                </FormItem>
            </Form>
        )
    }
}
export default Form.create({})(FilterForm)