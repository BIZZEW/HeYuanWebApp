import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'

import Layout from '../pages/layout/Layout'
import Login from '../pages/login/Login'
import AuthorizedRoute from './AuthorizedRoute'
import NoFound from '../pages/noFound/NoFound'
import Home from '../pages/home/Home'
import OnlineOrder from '../pages/OnlineOrder/OnlineOrder'
import OnlineCheck from '../pages/OnlineCheck/OnlineCheck'
import PickupReport from '../pages/PickupReport/PickupReport'
import IncomeReport from '../pages/IncomeReport/IncomeReport'
import SaleReport from '../pages/SaleReport/SaleReport'
import ChangePassword from '../pages/ChangePassword/ChangePassword'

export const Router = () => (
	<BrowserRouter>
		<div>
			<CacheSwitch>
				<Route path="/login" component={Login} />
				<Redirect from="/" exact to="/login" />{/*注意redirect转向的地址要先定义好路由*/}
				<AuthorizedRoute path="/layout" component={Layout} />
				<Route component={NoFound} />
			</CacheSwitch>
		</div>
	</BrowserRouter>
)

export const menuObject = {
	'home': Home,
	'OnlineOrder': OnlineOrder,
	'OnlineCheck': OnlineCheck,
	'PickupReport': PickupReport,
	'IncomeReport': IncomeReport,
	'SaleReport': SaleReport,
	'ChangePassword': ChangePassword,
}

export const menus = [
	{
		id: 1,
		title: '主页',
		url: '/layout/home',
		component: 'home',
		isFullScreen: false,
		icon: "home"
	},
	{
		id: 2,
		title: '网上订货',
		url: '/layout/online_order',
		component: 'OnlineOrder',
		isFullScreen: false,
		icon: "shopping"
	},
	{
		id: 3,
		title: '网上对账',
		url: '/layout/online_check',
		component: 'OnlineCheck',
		isFullScreen: false,
		icon: "account-book"
	},
	{
		id: 4,
		title: '统计报表',
		child: [
			{
				id: 40,
				title: '提货明细表',
				url: '/layout/pickup_report',
				component: 'PickupReport',
				isFullScreen: false,
				icon: "area-chart"
			},
			{
				id: 41,
				title: '收款明细表',
				url: '/layout/income_report',
				component: 'IncomeReport',
				isFullScreen: false,
				icon: "bar-chart"
			},
			{
				id: 42,
				title: '销售资金汇总表',
				url: '/layout/sale_report',
				component: 'SaleReport',
				isFullScreen: false,
				icon: "line-chart"
			}
		]
	},
	{
		id: 5,
		title: '修改密码',
		url: '/layout/change_password',
		component: 'ChangePassword',
		isFullScreen: false,
		icon: "edit",
		hide: "hide",
	},
];







