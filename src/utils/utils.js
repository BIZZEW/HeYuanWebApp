import React from 'react'
import { Select } from 'antd'
const Option = Select.Option

export default {
    formatDate(time) {
        if (!time) return '';
        let date = new Date(time);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    },
    pagination(data, callback) {
        return {
            onChange: (current) => {
                callback(current)
            },
            current: data.page,
            pageSize: data.page_size,
            total: data.total,
            showTotal: () => {
                return `共${data.total}条`
            },
            showQuickJumper: true
        }
    },
    getOptionList(data) {
        if (!data) {
            return [];
        }
        let options = [];
        data.map((item) => {
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    },
    /**
     * ETable 行点击通用函数
     * @param {*选中行的索引} selectedRowKeys
     * @param {*选中行对象} selectedItem
     */
    updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem: selectedRows
            })
        }
    },

    JSONToExcelConvertor(JSONData, FileName, title, filter) {
        if (!JSONData)
            return;
        //转化json为object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var excel = "<table>";

        //设置表头  
        var row = "<tr>";

        if (title) {
            //使用标题项
            for (var i in title) {
                row += "<th align='center'>" + title[i] + '</th>';
            }

        }
        else {
            //不使用标题项
            for (var i in arrData[0]) {
                row += "<th align='center'>" + i + '</th>';
            }
        }

        excel += row + "</tr>";

        //设置数据  
        for (var i = 0; i < arrData.length; i++) {
            var row = "<tr>";

            for (var index in arrData[i]) {
                //判断是否有过滤行
                if (filter) {
                    if (filter.indexOf(index) == -1) {
                        var value = arrData[i][index] == null ? "" : arrData[i][index];
                        row += '<td>' + value + '</td>';
                    }
                }
                else {
                    var value = arrData[i][index] == null ? "" : arrData[i][index];
                    row += "<td align='center'>" + value + "</td>";
                }
            }

            excel += row + "</tr>";
        }

        excel += "</table>";

        var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
        excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
        excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
        excelFile += '; charset=UTF-8">';
        excelFile += "<head>";
        excelFile += "<!--[if gte mso 9]>";
        excelFile += "<xml>";
        excelFile += "<x:ExcelWorkbook>";
        excelFile += "<x:ExcelWorksheets>";
        excelFile += "<x:ExcelWorksheet>";
        excelFile += "<x:Name>";
        excelFile += "{worksheet}";
        excelFile += "</x:Name>";
        excelFile += "<x:WorksheetOptions>";
        excelFile += "<x:DisplayGridlines/>";
        excelFile += "</x:WorksheetOptions>";
        excelFile += "</x:ExcelWorksheet>";
        excelFile += "</x:ExcelWorksheets>";
        excelFile += "</x:ExcelWorkbook>";
        excelFile += "</xml>";
        excelFile += "<![endif]-->";
        excelFile += "</head>";
        excelFile += "<body>";
        excelFile += excel;
        excelFile += "</body>";
        excelFile += "</html>";


        var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

        var link = document.createElement("a");
        link.href = uri;

        link.style = "visibility:hidden";
        link.download = FileName + ".xls";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
