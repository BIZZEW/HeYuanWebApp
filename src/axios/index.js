import JsonP from 'jsonp'
import React from 'react'
import ReactDOM from 'react-dom';
import axios from 'axios'
import { Modal } from 'antd';
import Utils from './../utils/utils'
import qs from 'qs'

export default class Axios {
    // 通过车号获取司机信息
    static getDriverInfo(_this, url, params) {
        this.ajax({
            url,
            params,
            method: "get"
        }).then((data) => {
            _this.setState({
                isVisible5: true,
                title5: '司机信息',
                list: data.result
            })
        }).catch((error) => {
            // let data = { "code": 0, "msg": "查询成功", "result": [{ "driveridentity": "420922197909212978", "drivername": "张三", "telphone": "18957178856" }], "status": 200 };
            // console.log("list", data.result);
            // _this.setState({
            //     isVisible5: true,
            //     title5: '司机信息',
            //     list: data.result
            // })

            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    // 获取采购订单
    static getProcureOrder(_this, url, params) {
        this.ajax({
            url,
            params,
            method: "get"
        }).then((data) => {
            _this.setState({
                isVisible0: true,
                title0: '采购订单',
                list: data.result
            })
        }).catch((error) => {
            let data = { "code": 0, "msg": "查询成功", "result": [{ "driveridentity": "420922197909212978", "drivername": "张三", "telphone": "18957178856" }], "status": 200 };
            console.log("list", data.result);
            _this.setState({
                isVisible0: true,
                title0: '采购订单',
                list: data.result
            })

            // if (String(error).toLowerCase().indexOf('timeout') != -1) {
            //     Modal.info({
            //         title: '提示',
            //         content: '服务器繁忙，请稍后重试'
            //     })
            // } else if (String(error).toLowerCase().indexOf('network') != -1) {
            //     Modal.info({
            //         title: '提示',
            //         content: '服务器问失败，请稍后重试'
            //     })
            // }
        })
    }

    // 查询form获取下拉选项
    static getOptions(_this, url, params) {
        params.username = sessionStorage.getItem('userName');
        this.ajax({
            url,
            params,
            method: "get",
            isShowLoading: false,
        }).then((data) => {
            _this.formList[1].list = data.result;
            _this.forceUpdate();
        }).catch((error) => {
            // _this.formList[1].list = ["zzzzzzzzz", "H4302020010600000001"];
            // _this.forceUpdate();
        })
    }

    // 新增form获取下拉选型（水泥品种，销售单位）
    static getOptions2(_this, url, params, type) {
        let ref = {};
        this.ajax({
            url,
            params,
            method: "get",
            isShowLoading: false,
        }).then((data) => {
            ref[type] = data.result;
            _this.setState(ref);
            _this.forceUpdate();
        }).catch((error) => {
            // ref[type] = '[{ "code": "1001000037", "name": "散装测试", "pk_material": "1001B1100000000B4W9K" },{ "code": "1001000036", "name": "袋装测试", "pk_material": "1001B1100000000B4W5B" },{ "code": "0101000300", "name": "大宗原材料测试", "pk_material": "1001B1100000000B5KLK" },{ "code": "0101000001", "name": "石灰石", "pk_material": "1001A210000000001NUF" }]';
            // _this.setState(ref);
            // _this.forceUpdate();
        })
    }

    static requestList(_this, url, params) {
        params.username = sessionStorage.getItem('userName');

        this.ajax({
            url,
            params,
            method: "get"
        }).then((response) => {
            if (response && response.result) {
                _this.setState({
                    list: response.result.list,
                    selectedRowKeys: [],//重置
                    pagination: Utils.pagination(response.result, (current) => {
                        console.log(current);
                        _this.params.page = current;
                        _this.requestList();
                    })
                })
            }
        }).catch((error) => {

            // var data = {};

            // if (params.page == 1) {
            //     data = {
            //         page: 1,
            //         page_size: 10,
            //         total: 16,
            //         list: [
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //         ]
            //     }
            // } else {
            //     data = {
            //         page: 2,
            //         page_size: 10,
            //         total: 16,
            //         list: [
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //             { "account": 46315.64, "billdate": "2020-01-06", "billno": "H4302020010600000001", "customer": "测试", "isconfirmation": "未确认", "lastmonthbalance": 0 },
            //         ]
            //     }
            // }

            // _this.setState({
            //     list: data.list,
            //     selectedRowKeys: [],//重置
            //     pagination: Utils.pagination(data, (current) => {
            //         console.log(current);
            //         _this.params.page = current;
            //         _this.requestList();
            //     })
            // })

            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    // 获取对账单详情列表
    static requestList1(_this, url, params) {
        params.username = sessionStorage.getItem('userName');

        this.ajax({
            url,
            params,
            method: "get"
        }).then((response) => {
            if (response && response.result) {
                let result = response.result;
                let materialList = [];
                let columns = [{
                    title: '日期',
                    dataIndex: 'statisticaldate',
                    key: 'statisticaldate',
                    width: 200,
                    render: (text, row, index) => {
                        let len = response.result.obj.bodyobj.length;
                        let indexcut = index - len;
                        switch (indexcut) {
                            case 3:
                                return {
                                    children: text,
                                    props: {
                                        colSpan: 5,
                                        // rowSpan: 3
                                    },
                                };
                            case 4:
                                return {
                                    children: text,
                                    props: {
                                        colSpan: 5,
                                    },
                                };
                            case 6:
                                return {
                                    children: text,
                                    props: {
                                        // rowSpan: 3,
                                        colSpan: 5,
                                    },
                                };
                            case 7:
                                return {
                                    children: text,
                                    props: {
                                        // rowSpan: 3,
                                        colSpan: 5,
                                    },
                                };
                            case 10:
                                return {
                                    children: text,
                                    props: {
                                        colSpan: 5,
                                    },
                                };
                            default:
                                return text;
                        }

                        // if (index < len)
                        //     return text;
                        // return {
                        //     children: text,
                        //     props: {
                        //         colSpan: 5,
                        //         // rowSpan: 2
                        //     },
                        // };
                    },
                }];
                let columns2 = [
                    {
                        title: '总吨位',
                        dataIndex: 'totaltonnage',
                        key: 'totaltonnage',
                        width: 200,
                    },
                    {
                        title: '总金额',
                        dataIndex: 'totalamount',
                        key: 'totalamount',
                        width: 200,
                    },
                    {
                        title: '现金',
                        dataIndex: 'cash',
                        key: 'cash',
                        width: 200,
                    },
                    {
                        title: '承兑',
                        dataIndex: 'acceptancebill',
                        key: 'acceptancebill',
                        width: 200,
                    },
                    {
                        title: '上月余额',
                        dataIndex: 'lastmonthbalance',
                        key: 'lastmonthbalance',
                        width: 200,
                    },
                    {
                        title: '优惠金额',
                        dataIndex: 'preferentialamount',
                        key: 'preferentialamount',
                        width: 200,
                    },
                    {
                        title: '本月余额',
                        dataIndex: 'balancemonth',
                        key: 'balancemonth',
                        width: 200,
                    },
                    {
                        title: '调整金额',
                        dataIndex: 'adjustmentamount',
                        key: 'adjustmentamount',
                        width: 200,
                    }
                ];

                if (result.obj.head)
                    _this.setState({ ...result.obj.head })

                if (result.material) {
                    materialList = result.material
                    for (let material of materialList) {
                        columns.push({
                            title: material.name,
                            children: [
                                {
                                    title: '数量',
                                    dataIndex: material.num,
                                    key: material.num,
                                    width: 200,
                                },
                                {
                                    title: '单价',
                                    dataIndex: material.price,
                                    key: material.price,
                                    width: 200,
                                },
                            ],
                        });
                    }
                }

                _this.setState({
                    columnsDetail: columns.concat(columns2),
                    list1: response.result.obj.bodyobj,
                })
            }
        }).catch((error) => {
            // var response = {
            //     "result": {
            //         "material": [
            //             { "name": "金圆32.5散装", "num": "def1", "pk": "1001A210000000001OGP", "price": "def2" },
            //             { "name": "金圆32.5散装", "num": "def11", "pk": "1001A210000000001OGP", "price": "def22" },
            //             { "name": "金圆32.5散装", "num": "def111", "pk": "1001A210000000001OGP", "price": "def222" },
            //             { "name": "金圆32.5散装", "num": "def1111", "pk": "1001A210000000001OGP", "price": "def2222" },
            //         ],
            //         "obj": {
            //             "bodyobj": [
            //                 { "acceptancebill": "2222", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "22dddd22", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "2222", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "2222", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "22fff22", "adjustmentamount": "3ff333", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "5fffff5", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "2222", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "2222", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "55ffff555", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "2222", "adjustmentamount": "333fff3", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "5fffff5", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "ffff", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "5ffff5", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "2222", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "2222", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "555ffff55", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //                 { "acceptancebill": "2222", "adjustmentamount": "3333", "balancemonth": "44444", "cash": "55555", "def1": "55", "def11": "55", "def111": "55", "def1111": "55", "def2": "55", "def22": "55", "def222": "55", "def2222": "55", "lastmonthbalance": "5", "statisticaldate": "2019-12-09", "totalamount": "5555", "totaltonnage": "55555" },
            //             ],
            //             "head": {
            //                 "adjustmentamount": "",
            //                 "billdate": "2020-01-09",
            //                 "billmaker": "陶程凯",
            //                 "customer": "测试",
            //                 "note": ""
            //             }
            //         }
            //     },
            //     "status": 200
            // };


            // if (response && response.result) {
            //     let result = response.result;
            //     let materialList = [];
            //     let columns = [{
            //         title: '日期',
            //         dataIndex: 'statisticaldate',
            //         key: 'statisticaldate',
            //         width: 200,
            //         render: (text, row, index) => {
            //             let len = response.result.obj.bodyobj.length;
            //             let indexcut = index - len;
            //             switch (indexcut) {
            //                 case 3:
            //                     return {
            //                         children: text,
            //                         props: {
            //                             colSpan: 5,
            //                             // rowSpan: 3
            //                         },
            //                     };
            //                 case 4:
            //                     return {
            //                         children: text,
            //                         props: {
            //                             colSpan: 5,
            //                         },
            //                     };
            //                 case 6:
            //                     return {
            //                         children: text,
            //                         props: {
            //                             // rowSpan: 3,
            //                             colSpan: 5,
            //                         },
            //                     };
            //                 case 7:
            //                     return {
            //                         children: text,
            //                         props: {
            //                             // rowSpan: 3,
            //                             colSpan: 5,
            //                         },
            //                     };
            //                 case 10:
            //                     return {
            //                         children: text,
            //                         props: {
            //                             colSpan: 5,
            //                         },
            //                     };
            //                 default:
            //                     return text;
            //             }

            //             // if (index < len)
            //             //     return text;
            //             // return {
            //             //     children: text,
            //             //     props: {
            //             //         colSpan: 5,
            //             //         // rowSpan: 2
            //             //     },
            //             // };
            //         },
            //     }];
            //     let columns2 = [
            //         {
            //             title: '总吨位',
            //             dataIndex: 'totaltonnage',
            //             key: 'totaltonnage',
            //             width: 200,
            //         },
            //         {
            //             title: '总金额',
            //             dataIndex: 'totalamount',
            //             key: 'totalamount',
            //             width: 200,
            //         },
            //         {
            //             title: '现金',
            //             dataIndex: 'cash',
            //             key: 'cash',
            //             width: 200,
            //         },
            //         {
            //             title: '承兑',
            //             dataIndex: 'acceptancebill',
            //             key: 'acceptancebill',
            //             width: 200,
            //         },
            //         {
            //             title: '上月余额',
            //             dataIndex: 'lastmonthbalance',
            //             key: 'lastmonthbalance',
            //             width: 200,
            //         },
            //         {
            //             title: '优惠金额',
            //             dataIndex: 'preferentialamount',
            //             key: 'preferentialamount',
            //             width: 200,
            //         },
            //         {
            //             title: '本月余额',
            //             dataIndex: 'balancemonth',
            //             key: 'balancemonth',
            //             width: 200,
            //         },
            //         // {
            //         //     title: '调整金额',
            //         //     dataIndex: 'adjustmentamount',
            //         //     key: 'adjustmentamount',
            //         //     width: 200,
            //         // }
            //     ];

            //     if (result.obj.head)
            //         _this.setState({ ...result.obj.head })

            //     if (result.material) {
            //         materialList = result.material
            //         for (let material of materialList) {
            //             columns.push({
            //                 title: material.name,
            //                 children: [
            //                     {
            //                         title: '数量',
            //                         dataIndex: material.num,
            //                         key: material.num,
            //                         width: 200,
            //                     },
            //                     {
            //                         title: '单价',
            //                         dataIndex: material.price,
            //                         key: material.price,
            //                         width: 200,
            //                     },
            //                 ],
            //             });
            //         }
            //     }

            //     _this.setState({
            //         columnsDetail: columns.concat(columns2),
            //         list1: response.result.obj.bodyobj,
            //     })
            // }

            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    // 数据不分页
    static requestList2(_this, url, params) {
        params.username = sessionStorage.getItem('userName');

        this.ajax({
            url,
            params,
            method: "get"
        }).then((response) => {
            if (response && response.result) {
                _this.setState({
                    list: response.result.data,
                })
            }
        }).catch((error) => {

            // var data = [
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            //     { "availablefund": "6.66", "costsheet": 100, "customername": "测试", "initialbalance": "6.66", "money": "6.66", "receipt": 20000.01, "saleout": 20800 },
            // ];

            // _this.setState({
            //     list: data,
            //     selectedRowKeys: [],
            // })

            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    // 网上订货新增
    static createNewOrder(_this, url, data) {
        this.ajax({
            url,
            data,
            method: "post"
        }).then((response) => {
            _this.orderForm.props.form.resetFields();
            _this.setState({
                isVisible: false
            })
            _this.requestList();
            Modal.info({
                title: '提示',
                content: '新增成功'
            })
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    // 网上订货关闭
    static closeOrder(_this, url, data) {
        this.ajax({
            url,
            data,
            method: "post"
        }).then((response) => {
            _this.closeForm.props.form.resetFields();
            _this.setState({
                isVisible3: false
            })
            _this.requestList();
            Modal.info({
                title: '提示',
                content: '关闭成功'
            })
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    // 网上订货删除
    static deleteOrder(_this, url, data) {
        this.ajax({
            url,
            data,
            method: "post"
        }).then((response) => {
            _this.requestList();
            Modal.info({
                title: '提示',
                content: '删除成功'
            })
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    // 网上对账操作
    static detailCheckop(_this, url, data) {
        // data.username = sessionStorage.getItem('userName');

        this.ajax({
            url,
            data,
            method: "post"
        }).then((response) => {
            _this.setState({
                level: true
            })
            _this.requestList();
            Modal.info({
                title: '提示',
                content: '操作成功'
            })
        }).catch((error) => {
            // _this.setState({
            //     level: true
            // })
            // _this.requestList();
            // Modal.info({
            //     title: '提示',
            //     content: '操作成功'
            // })

            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    // 修改密码
    static changePwd(_this, url, data) {

        this.ajax({
            url,
            data,
            method: "post"
        }).then((response) => {
            _this.props.form.resetFields();
            Modal.info({
                title: '提示',
                content: '修改成功'
            })
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.info({
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    static jsonp(options) {
        new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.message);
                }
            })
        })
    }

    static ajax(options) {
        let loading;
        if ((options.data || options.params) && options.isShowLoading !== false) {
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        let baseApi0 = 'http://127.0.0.1:99/cusapl';
        let baseApi = 'http://10.1.8.231:80/cusapl';
        let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';

        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: options.method,
                baseURL: baseApi,
                timeout: 8000,
                params: (options.params) || "",
                data: (options.data) || "",
            }).then((response) => {
                if ((options.data || options.params) && options.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status === 200) {
                    let res = response.data;
                    if (res.code === 0) {
                        resolve(res);
                    } else {
                        Modal.info({
                            title: '提示',
                            content: res.msg
                        })
                    }
                } else {
                    reject(response.data)
                }
            }).catch((error) => {
                if ((options.data || options.params) && options.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                reject(error);
            })
        });
    }
}