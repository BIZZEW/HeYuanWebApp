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
import PickupReport from '../pages/OnlineReport/PickupReport/PickupReport'
import IncomeReport from '../pages/OnlineReport/IncomeReport/IncomeReport'
import SaleReport from '../pages/OnlineReport/SaleReport/SaleReport'
import ChangePassword from '../pages/ChangePassword/ChangePassword'
import Delivery from '../pages/Delivery/Delivery'
import LongDelivery from '../pages/LongDelivery/LongDelivery'

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
	'Delivery': Delivery,
	'LongDelivery': LongDelivery,
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
		icon: "line-chart",
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
				icon: "dot-chart"
			}
		]
	},
	{
		id: 5,
		title: '送货单',
		url: '/layout/delivery',
		component: 'Delivery',
		isFullScreen: false,
		icon: "shopping-cart"
	},
	{
		id: 6,
		title: '长期送货单',
		url: '/layout/longdelivery',
		component: 'LongDelivery',
		isFullScreen: false,
		icon: "car"
	},
	{
		id: 7,
		title: '修改密码',
		url: '/layout/change_password',
		component: 'ChangePassword',
		isFullScreen: false,
		icon: "edit",
		hide: "hide",
	},
	{
		id: 8,
		title: '404',
		url: '/layout/nofound',
		component: ' ',
		isFullScreen: false,
		icon: "edit",
		hide: "hide",
	},
];







