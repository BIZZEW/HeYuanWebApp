import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd';
import Utils from './../utils/utils'
import qs from 'qs'

export default class Axios {
    // 通过车号获取司机信息
    static getDriverInfo(_this, url, params) {
        var data = {
            params: params,
        }
        this.ajax({
            url,
            data,
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
        var data = {
            params: params,
            isShowLoading: false,
        }
        this.ajax({
            url,
            data,
            method: "get"
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
        var data = {
            params: params,
            isShowLoading: false,
        }
        let ref = {};
        this.ajax({
            url,
            data,
            method: "get"
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

        var data = {};

        if (params.page == 1) {
            data = {
                page: 1,
                page_size: 10,
                total: 16,
                list: [
                    { "id": 0, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 1, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 2, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 3, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 4, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 5, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 6, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 7, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 8, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 9, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                ]
            }
        } else {
            data = {
                page: 2,
                page_size: 10,
                total: 16,
                list: [
                    { "id": 10, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 11, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 12, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 13, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 14, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                    { "id": 15, "client": "trump", "date": "2019-12-09", "material": "leadleadleadleadleadleadlead", "amount": "2000", "status": "done", "vehicle": "浙A00000" },
                ]
            }
        }
        
        // this.ajax({
        //     url,
        //     data
        // }).then((data) => {
        //     if (data && data.list) {
        //         let list = data.list.item_list.map((item, index) => {
        //             item.key = index;
        //             return item;
        //         });
        _this.setState({
            list: data.list,
            selectedRowKeys: [],//重置
            pagination: Utils.pagination(data, (current) => {
                console.log(current);
                _this.params.page = current;
                _this.requestList();
            })
        })
        //     }
        // })
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
        if (options.data && options.data.isShowLoading !== false) {
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
                data: (options.data && options.data.params) || '',
                // paramsSerializer: function (params) {
                //     return qs.stringify(params, { arrayFormat: 'indices' })
                // }
            }).then((response) => {
                if (options.data && options.data.isShowLoading !== false) {
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
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                reject(error);
            })
        });
    }
}