import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd';
import Utils from './../utils/utils'
import qs from 'qs'

export default class Axios {
    // 通过车号获取司机信息
    static getDriverInfo(_this, url, params) {
        // var data = {
        //     params: params,
        // }
        this.ajax({
            url,
            params,
            method: "get"
        }).then((data) => {
            _this.setState({
                isVisible2: true,
                title2: '司机信息',
                list: data.result
            })
        }).catch((error) => {
            // let data = { "code": 0, "msg": "查询成功", "result": [{ "driveridentity": "420922197909212978", "drivername": "张三", "telphone": "18957178856" }], "status": 200 };
            // console.log("list", data.result);
            // _this.setState({
            //     isVisible2: true,
            //     title2: '司机信息',
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

    // 查询form获取下拉选项（水泥品种）
    static getOptions(_this, url, params) {
        // var data = {
        //     params: params,
        //     isShowLoading: false,
        // }
        this.ajax({
            url,
            params,
            method: "get",
            isShowLoading: false,
        }).then((data) => {
            _this.formList[1].list = data.result;
            _this.forceUpdate();
        }).catch((error) => {
            // _this.formList[1].list = '[{ "code": "1001000037", "name": "散装测试", "pk_material": "1001B1100000000B4W9K" },{ "code": "1001000036", "name": "袋装测试", "pk_material": "1001B1100000000B4W5B" },{ "code": "0101000300", "name": "大宗原材料测试", "pk_material": "1001B1100000000B5KLK" },{ "code": "0101000001", "name": "石灰石", "pk_material": "1001A210000000001NUF" }]';
            // _this.forceUpdate();

            // _this.BaseForm.form.props.resetFields(["cementType"]);

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

    // 新增form获取下拉选型（水泥品种，销售单位）
    static getOptions2(_this, url, params, type) {
        // var data = {
        //     params: params,
        // }
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
        // var data = {
        //     params: params,
        // }

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
            //             { "billno": "XJY2019121800007243", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKQC9", "cpreorderid": "1001B1100000000BKQCA", "customername": "散装测试客户", "dbilldate": "2019-12-18 15:53:12", "driveridentity": "330183198809081714", "drivername": "我们", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "15858155946", "vehicle": "粤P06827" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //         ]
            //     }
            // } else {
            //     data = {
            //         page: 2,
            //         page_size: 10,
            //         total: 16,
            //         list: [
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
            //             { "billno": "XJY2019121800007242", "billstatus": "审批中", "cpreorderbid": "1001B1100000000BKO01", "cpreorderid": "1001B1100000000BKO02", "customername": "散装测试客户", "dbilldate": "2019-12-18 09:36:26", "driveridentity": "420922197909212978", "drivername": "张三", "materialname": "散装测试", "ordernum": 2, "saleorgname": "那曲地区纳木措金圆建材有限公司", "sendstockorgname": "那曲地区纳木措金圆建材有限公司", "telphone": "18957178856", "vehicle": "浙A123456" },
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

    // 获取对账单详情列表
    static requestList1(_this, url, params) {
        // var data = {
        //     params: params,
        // }

        params.username = sessionStorage.getItem('userName');

        this.ajax({
            url,
            params,
            method: "get"
        }).then((response) => {
            if (response && response.result) {
                _this.setState({
                    list1: response.result.list,
                    // selectedRowKeys: [],//重置
                    pagination1: Utils.pagination(response.result, (current) => {
                        console.log(current);
                        _this.params1.page1 = current;
                        _this.requestList();
                    })
                })
            }
        }).catch((error) => {

            // let list = [];
            // let list1 = [];
            // for (let i = 0; i < 10; i++) {
            //     list.push({
            //         key: i,
            //         date: '2019-12-18',
            //         amount1: 10000,
            //         amount2: 10000,
            //         amount3: 10000,
            //         amount4: 10000,
            //         amount5: 10000,
            //         price1: 100000,
            //         price2: 100000,
            //         price3: 100000,
            //         price4: 100000,
            //         price5: 100000,
            //         totalAmount: 100000000,
            //     });

            //     list1.push({
            //         key: i,
            //         date: '9012-12-18',
            //         amount1: 555,
            //         amount2: 1005500,
            //         amount3: 100500,
            //         amount4: 5,
            //         amount5: 5,
            //         price1: 5555,
            //         price2: 10055000,
            //         price3: 55,
            //         price4: 100000,
            //         price5: 100000,
            //         totalAmount: 223333,
            //     });
            // }

            // var data = {};

            // if (params.page1 == 1) {
            //     data = {
            //         page: 1,
            //         page_size: 10,
            //         total: 20,
            //         list: list
            //     }
            // } else {
            //     data = {
            //         page: 2,
            //         page_size: 10,
            //         total: 20,
            //         list: list1
            //     }
            // }

            // _this.setState({
            //     list1: data.list,
            //     // selectedRowKeys: [],//重置
            //     pagination1: Utils.pagination(data, (current) => {
            //         console.log(current);
            //         _this.params1.page1 = current;
            //         _this.requestList1();
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

    // 网上订货新增
    static createNewOrder(_this, url, data) {
        // var data = {
        //     params: params,
        // }

        // _this.userForm.props.form.resetFields();
        // _this.setState({
        //     isVisible: false
        // })
        // _this.requestList();
        // Modal.info({
        //     title: '提示',
        //     content: '新增成功'
        // })

        this.ajax({
            url,
            data,
            method: "post"
        }).then((response) => {
            if (response.status === 200) {
                let res = response.data;
                if (res.code === 0) {
                    _this.userForm.props.form.resetFields();
                    _this.setState({
                        isVisible: false
                    })
                    _this.requestList();
                    Modal.info({
                        title: '提示',
                        content: '新增成功'
                    })
                }
            }
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
        // var data = {
        //     params: params,
        // }

        // _this.userForm.props.form.resetFields();
        // _this.setState({
        //     isVisible: false
        // })
        // _this.requestList();
        // Modal.info({
        //     title: '提示',
        //     content: '新增成功'
        // })

        this.ajax({
            url,
            data,
            method: "post"
        }).then((response) => {
            if (response.status === 200) {
                let res = response.data;
                if (res.code === 0) {
                    _this.requestList();
                    Modal.info({
                        title: '提示',
                        content: '删除成功'
                    })
                }
            }
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

    // 修改密码
    static changePwd(_this, url, data) {

        this.ajax({
            url,
            data,
            method: "post"
        }).then((response) => {
            if (response.status === 200) {
                let res = response.data;
                if (res.code === 0) {
                    _this.userForm.props.form.resetFields();
                    Modal.info({
                        title: '提示',
                        content: '修改成功'
                    })
                }
            }
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
        let baseApi = 'http://127.0.0.1:99/cusapl';
        let baseApi1 = 'http://rap2api.taobao.org/app/mock/239516/example/1576031001727';

        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: options.method,
                baseURL: baseApi,
                timeout: 5000,
                // data: (options.data && options.data.params),
                params: (options.params) || "",
                data: (options.data) || "",
                // paramsSerializer: function (params) {
                //     return qs.stringify(params, { arrayFormat: 'indices' })
                // }
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