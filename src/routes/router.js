import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Layout from '../pages/layout/Layout'
import Login from '../pages/login/Login'
import AuthorizedRoute from './AuthorizedRoute'
import NoFound from '../pages/noFound/NoFound'
import Home from '../pages/home/Home'
// import Order from '../pages/Order/Order'
// import WorkOrder from '../pages/Order/WorkOrder'
// import Operations from '../pages/operations/operations'
import OnlineOrder from '../pages/OnlineOrder/OnlineOrder'
import OnlineCheck from '../pages/OnlineCheck/OnlineCheck'
import OnlineReport from '../pages/OnlineReport/OnlineReport'

export const Router = () => (
	<BrowserRouter>
		<div>
			<Switch>
				<Route path="/login" component={Login} />
				<Redirect from="/" exact to="/login" />{/*注意redirect转向的地址要先定义好路由*/}
				<AuthorizedRoute path="/layout" component={Layout} />
				<Route component={NoFound} />
			</Switch>
		</div>
	</BrowserRouter>
)

export const menuObject = {
	'home': Home,
	// 'order': Order,
	// 'workOrder': WorkOrder,
	// 'operations': Operations,
	'OnlineOrder': OnlineOrder,
	'OnlineCheck': OnlineCheck,
	'OnlineReport': OnlineReport,
}

export const menus = [
	{
		id: 1,
		title: '主页',
		url: '/layout/home',
		component: 'home',
		isFullScreen: false
	},
	{
		id: 2,
		title: '网上订货',
		url: '/layout/online_order',
		component: 'OnlineOrder',
		isFullScreen: false
	},
	{
		id: 3,
		title: '网上对账',
		url: '/layout/online_check',
		component: 'OnlineCheck',
		isFullScreen: false
	},
	{
		id: 4,
		title: '统计报表',
		url: '/layout/online_report',
		component: 'OnlineReport',
		isFullScreen: false
	},
	// {
	// 	id: 2,
	// 	title: '监视管理',
	// 	child: [
	// 		{
	// 			id: 3,
	// 			title: '全业务监控视图',
	// 			child: [
	// 				{id: 6, title: '固网监控视图', url: '/layout/order1', component: 'order', isFullScreen: false},
	// 				{id: 7, title: '移网监控视图', url: '/layout/order2', component: 'order', isFullScreen: false}
	// 			]
	// 		},
	// 		{
	// 			id: 5,
	// 			title: '3*9大屏',
	// 			url: '/layout/order3',
	// 			component: 'order',
	// 			isFullScreen: false
	// 		}
	// 	]
	// }
];







