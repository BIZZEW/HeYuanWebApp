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
                Modal.error({
                    zIndex: 1002,
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.error({
                    zIndex: 1002,
                    title: '提示',
                    content: '服务器问失败，请稍后重试'
                })
            }
        })
    }

    // 通过车号获取司机信息
    static getDriverInfoPurchase(_this, url, params) {
        this.ajax({
            url,
            params,
            method: "get"
        }).then((data) => {
            if (data.datas.queryresults.length > 1)
                _this.setState({
                    isVisible5: true,
                    title5: '司机信息',
                    list: data.datas.queryresults
                })
            else if (data.datas.queryresults.length == 1)
                _this.handleSubmit5(data.datas.queryresults[0]);
        }).catch((error) => {
            let data = {
                "datas": {
                    "queryresults":
                        [
                            { "name": "330724199612295652 15858960450", "code": "\u9648\u6613", "pk": "330724199612295652" },
                            { "name": "330724199612295652 15858960450", "code": "\u9648\u6613", "pk": "330724199612295652" }
                        ],
                    "allnums": 1,
                    "maxindex": 1
                }, "statuscode": "0"
            };
            console.log("list", data.datas.queryresults);

            if (data.datas.queryresults.length > 1)
                _this.setState({
                    isVisible5: true,
                    title5: '司机信息',
                    list: data.datas.queryresults
                })
            else if (data.datas.queryresults.length == 1)
                _this.handleSubmit5(data.datas.queryresults[0]);

            // if (String(error).toLowerCase().indexOf('timeout') != -1) {
            //     Modal.error({
            //         zIndex: 1002,
            //         title: '提示',
            //         content: '服务器繁忙，请稍后重试'
            //     })
            // } else if (String(error).toLowerCase().indexOf('network') != -1) {
            //     Modal.error({
            //         zIndex: 1002,
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

    static requestRef(_this, url, params) {
        this.ajax({
            url,
            params,
            method: "get"
        }).then((response) => {
            if (response && response.datas) {
                _this.setState({
                    refList: response.datas.queryresults,
                    selectedRowKeysRef: [],
                    selectedRowsRef: [],
                    paginationRef: Utils.pagination(response.datas, (current) => {
                        console.log(current);
                        _this.refParam.page = current;
                        _this.requestRef();
                    })
                })
            }
        }).catch((error) => {

            var data = {};

            if (params.page == 1) {
                data = {
                    datas: {
                        page: 1,
                        page_size: 10,
                        total: 16,
                        queryresults: [
                            { "name": "\u9648\u6613 15858960450 330724199612295652", "code": "\u4e91JHUHDU", "pk": "\u4e91JHUHDU" },
                            { "name": "\u9648\u6613 15858960450 330724199612295652", "code": "\u4e91JQKA11", "pk": "\u4e91JQKA11" },
                            { "name": "\u9648\u6613 15858960450 330724199612295652", "code": "\u4eacA6JHJO", "pk": "\u4eacA6JHJO" },
                            { "name": "\u9648\u6613 15858960450 330724199612295652", "code": "\u4eacAHI9KT", "pk": "\u4eacAHI9KT" },
                            { "name": "null null null", "code": "\u4eacAMM009", "pk": "\u4eacAMM009" },
                            { "name": "null null null", "code": "\u4eacAOP123", "pk": "\u4eacAOP123" },
                            { "name": "null null null", "code": "\u4eacKKKK88", "pk": "\u4eacKKKK88" },
                            { "name": "null null null", "code": "\u4eacUUUU66", "pk": "\u4eacUUUU66" },
                            { "name": "null null null", "code": "\u7ca4ASB945", "pk": "\u7ca4ASB945" },
                            { "name": "null null null", "code": "\u7ca4KAO123", "pk": "\u7ca4KAO123" }
                        ]
                    }
                }
            } else {
                data = {
                    datas: {
                        page: 2,
                        page_size: 10,
                        total: 16,
                        queryresults: [
                            { "name": "\u9648\u667a\u6e0a", "code": "0001", "pk": "101001ZZ100000000KEWHZ" },
                            { "name": "\u9648\u667a\u6e0a", "code": "0001", "pk": "111001ZZ100000000KEWHZ" },
                            { "name": "\u9648\u667a\u6e0a", "code": "0001", "pk": "121001ZZ100000000KEWHZ" },
                            { "name": "\u9648\u667a\u6e0a", "code": "0001", "pk": "131001ZZ100000000KEWHZ" },
                            { "name": "\u9648\u667a\u6e0a", "code": "0001", "pk": "141001ZZ100000000KEWHZ" },
                            { "name": "\u9648\u667a\u6e0a", "code": "0001", "pk": "151001ZZ100000000KEWHZ" },
                        ]
                    }
                }
            }

            _this.setState({
                refList: data.datas.queryresults,
                selectedRowKeysRef: [],
                selectedRowsRef: [],
                paginationRef: Utils.pagination(data.datas, (current) => {
                    console.log(current);
                    _this.refParam.page = current;
                    _this.requestRef();
                })
            })

            // if (String(error).toLowerCase().indexOf('timeout') != -1) {
            //     Modal.error({
            //         zIndex: 1002,
            //         title: '提示',
            //         content: '服务器繁忙，请稍后重试'
            //     })
            // } else if (String(error).toLowerCase().indexOf('network') != -1) {
            //     Modal.error({
            //         zIndex: 1002,
            //         title: '提示',
            //         content: '服务器问失败，请稍后重试'
            //     })
            // }
        })
    }

    static requestListPurchase(_this, url, params) {
        params.username = sessionStorage.getItem('userName');

        this.ajax({
            url,
            params,
            method: "get"
        }).then((response) => {
            if (response && response.datas) {
                _this.setState({
                    list: response.datas.list,
                    selectedRowKeys: null,//重置
                    pagination: Utils.pagination(response.datas, (current) => {
                        console.log(current);
                        _this.params.page = current;
                        _this.requestList();
                    })
                })
            }
        }).catch((error) => {

            var data = {};

            if (params.page == 1) {
                data = {
                    page: 1,
                    page_size: 10,
                    total: 16,
                    list: [
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "pk_order": "1001ZZ100000000KG4SD", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "supplier_pk_supplier": "1001A210000000001D6M", "remainnum": 4434, "material_dw": "\u5428", "nnum": 4444, "pk_order_b": "1001ZZ100000000KG4SE", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020040400021170", "rcvstockorg_pk_org": "0001A2100000000025DX", "purchaseorg_code": "000106", "rcvstockorg_code": "000106", "dbilldate": "2020-04-04 19:11:39", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8" },
                    ]
                }
            } else {
                data = {
                    page: 2,
                    page_size: 10,
                    total: 16,
                    list: [
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSJ", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010005" },
                    ]
                }
            }

            _this.setState({
                list: data.list,
                selectedRowKeys: [],//重置
                pagination: Utils.pagination(data, (current) => {
                    console.log(current);
                    _this.params.page = current;
                    _this.requestList();
                })
            })

            // if (String(error).toLowerCase().indexOf('timeout') != -1) {
            //     Modal.error({
            //         zIndex: 1002,
            //         title: '提示',
            //         content: '服务器繁忙，请稍后重试'
            //     })
            // } else if (String(error).toLowerCase().indexOf('network') != -1) {
            //     Modal.error({
            //         zIndex: 1002,
            //         title: '提示',
            //         content: '服务器问失败，请稍后重试'
            //     })
            // }
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

            var data = {};

            if (params.page == 1) {
                data = {
                    page: 1,
                    page_size: 10,
                    total: 16,
                    list: [
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSJ", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010005" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "nnum": 4000, "pk_order_b": "1001ZZ100000000KEQNY", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "5.00", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3983, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JKHB", "vlicense": "\u7ca4P51165", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 5, "source": "Y", "denddate": "2020-04-02 17:04:20", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 17:04:20", "noticecode": "DH2004010004" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "nnum": 4000, "pk_order_b": "1001ZZ100000000KEQNY", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "3.00", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3981, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JKH7", "vlicense": "\u7ca4P21332", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 3, "source": "Y", "denddate": "2020-04-02 17:01:43", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 17:01:43", "noticecode": "DH2004010003" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "nnum": 4000, "pk_order_b": "1001ZZ100000000KEQNY", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JJPD", "vlicense": "\u8d63D65808", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 16:50:22", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 16:50:22", "noticecode": "DH2004010002" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "nnum": 4000, "pk_order_b": "1001ZZ100000000KEQNY", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "6.00", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3984, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000IAFE", "vlicense": "\u7ca4YY9900", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 6, "source": "Y", "denddate": "2020-04-02 10:40:06", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 10:40:06", "noticecode": "DH2004010001" }
                    ]
                }
            } else {
                data = {
                    page: 2,
                    page_size: 10,
                    total: 16,
                    list: [
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSL", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010006" },
                        { "supplier_code": "24400365", "purchaseorg_pk_org": "0001A2100000000025DX", "supplier_pk_supplier": "1001A210000000001D6M", "pk_order_b": "1001ZZ100000000KEQNY", "nnum": 4000, "drivertelephone": "15858960450", "material_code": "0101000037", "material_pk_material": "1001A210000000001NWH", "pdbilldate": "2020-03-31 14:38:53", "rcvstockorg_pk_org": "0001A2100000000025DX", "status_name": "\u5df2\u63d0\u4ea4", "drivername": "\u9648\u6613", "rcvstockorg_code": "000106", "ordercode": "CD2020033100021119", "rcvstockorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "purchaseorg_name": "\u6cb3\u6e90\u5e02\u91d1\u6770\u73af\u4fdd\u5efa\u6750\u6709\u9650\u516c\u53f8", "status_code": 0, "srcsendnum": "1.00", "driveridcode": "330724199612295652", "pk_order": "1001ZZ100000000KEQNX", "supplier_name": "\u65b0\u4e30\u53bf\u946b\u6052\u798f\u5316\u5de5\u6709\u9650\u516c\u53f8", "remainnum": 3979, "material_dw": "\u5428", "pk_noticeorder": "1001A31000000000JMSJ", "vlicense": "\u4e91JHUHDU", "material_name": "\u6c28\u6c34", "vbillcode": "CD2020033100021119", "num": 1, "source": "Y", "denddate": "2020-04-02 20:43:29", "purchaseorg_code": "000106", "dbilldate": "2020-04-01 20:43:29", "containerno": "666", "noticecode": "DH2004010005" },
                    ]
                }
            }

            _this.setState({
                list: data.list,
                selectedRowKeys: [],//重置
                pagination: Utils.pagination(data, (current) => {
                    console.log(current);
                    _this.params.page = current;
                    _this.requestList();
                })
            })

            // if (String(error).toLowerCase().indexOf('timeout') != -1) {
            //     Modal.error({
            //         zIndex: 1002,
            //         title: '提示',
            //         content: '服务器繁忙，请稍后重试'
            //     })
            // } else if (String(error).toLowerCase().indexOf('network') != -1) {
            //     Modal.error({
            //         zIndex: 1002,
            //         title: '提示',
            //         content: '服务器问失败，请稍后重试'
            //     })
            // }
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
                Modal.error({
                    zIndex: 1002,
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.error({
                    zIndex: 1002,
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
                Modal.error({
                    zIndex: 1002,
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.error({
                    zIndex: 1002,
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
            Modal.success({
                zIndex: 1002,
                title: '提示',
                content: '新增成功'
            })
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.error({
                    zIndex: 1002,
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.error({
                    zIndex: 1002,
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
            Modal.success({
                zIndex: 1002,
                title: '提示',
                content: '关闭成功'
            })
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.error({
                    zIndex: 1002,
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.error({
                    zIndex: 1002,
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
            Modal.success({
                zIndex: 1002,
                title: '提示',
                content: '删除成功'
            })
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.error({
                    zIndex: 1002,
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.error({
                    zIndex: 1002,
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
            Modal.success({
                zIndex: 1002,
                title: '提示',
                content: '操作成功'
            })
        }).catch((error) => {
            // _this.setState({
            //     level: true
            // })
            // _this.requestList();
            // Modal.error({zIndex: 1002,
            //     title: '提示',
            //     content: '操作成功'
            // })

            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.error({
                    zIndex: 1002,
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.error({
                    zIndex: 1002,
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
            Modal.success({
                zIndex: 1002,
                title: '提示',
                content: '修改成功'
            })
        }).catch((error) => {
            if (String(error).toLowerCase().indexOf('timeout') != -1) {
                Modal.error({
                    zIndex: 1002,
                    title: '提示',
                    content: '服务器繁忙，请稍后重试'
                })
            } else if (String(error).toLowerCase().indexOf('network') != -1) {
                Modal.error({
                    zIndex: 1002,
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

    static exportReport(_this, url, data, filename) {
        let baseApi = 'http://61.164.33.26:5555/service';
        let baseApi0 = 'http://127.0.0.1:99/service';
        let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';
        let baseApi2 = 'http://10.1.8.111:80/service';
        let baseApi3 = 'http://10.1.8.162:8999/service';
        let baseApi4 = 'http://10.1.8.231:80/service';

        axios({
            url: url,
            method: 'post',
            baseURL: baseApi,
            data: data,
            responseType: 'blob'
        }).then((res) => {
            const content = res.data;
            const blob = new Blob([content]);
            const fileName = filename;
            if ('download' in document.createElement('a')) {
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href);
                document.body.removeChild(elink);
            } else {
                navigator.msSaveBlob(blob, fileName);
            }
        })
    }

    static ajax(options) {
        let loading;
        if ((options.data || options.params) && options.isShowLoading !== false) {
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }

        let baseApi = 'http://61.164.33.26:5555/service';
        let baseApi0 = 'http://127.0.0.1:99/service';
        let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';
        let baseApi2 = 'http://10.1.8.111:80/service';
        let baseApi3 = 'http://10.1.8.162:8999/service';
        let baseApi4 = 'http://10.1.8.231:80/service';

        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: options.method,
                baseURL: baseApi0,
                timeout: 60000,
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
                        Modal.error({
                            zIndex: 1002,
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