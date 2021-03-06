import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { menus, menuObject } from '../../routes/router'
import { Tabs, Avatar, Menu, Icon, Tooltip, Dropdown, Button, Modal } from 'antd';
import NoFound from '../noFound/NoFound';
import './layout.scss'
import { Route } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'

const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
const menuList = [];//链式菜单对象，用于动态生成tabs的时候使用

class CreateMenuList extends React.Component {
	state = {
		collapsed: false,
	};

	componentDidMount() {
		let menuStatus = sessionStorage.getItem('menuStatus');
		if (menuStatus && menuStatus == "collapsed")
			this.toggleCollapsed()
	}

	createMenu(data) {
		const childMenuData = data.child;

		let childMenu = <div></div>;

		const roles = eval(sessionStorage.getItem('roles'));

		if (childMenuData && childMenuData.length) {
			childMenu = childMenuData.filter((item) => {
				return roles.indexOf(item.id) >= 0;
			}).map((item) => {
				return this.createMenu(item);
			});
			return <SubMenu
				key={data.id}
				title={
					<div>
						<Icon type={data.icon} />
						<span>{data.title}</span>
					</div>
				}
			>
				{childMenu}
			</SubMenu>
		} else {
			menuList.push({ ...data });
			return <Menu.Item key={data.id} className={data.hide}><NavLink to={data.url} onClick={this.props.addTabs}><Icon type={data.icon} /><span>{data.title}</span></NavLink></Menu.Item>
		}
	}

	toggleCollapsed = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});

		sessionStorage.setItem('menuStatus', (this.state.collapsed ? "expanded" : "collapsed"))

		document.getElementsByClassName("nav-content")[0].style["width"] = !this.state.collapsed ? "80px" : "150px";
		document.getElementsByClassName("page-content")[0].style["padding-left"] = !this.state.collapsed ? "80px" : "150px";
		document.getElementsByClassName("footer")[0].style["padding-left"] = !this.state.collapsed ? "80px" : "150px";
	};

	render() {
		const roles = eval(sessionStorage.getItem('roles'));

		return (
			<div>
				<Menu mode="vertical" theme="dark" selectedKeys={[this.props.current]} inlineCollapsed={this.state.collapsed}>
					{
						menus.filter((item) => {
							return roles.indexOf(item.id) >= 0;
						}).map((item) => {
							return this.createMenu(item);
						})
					}
				</Menu>
				<Button type="primary" onClick={this.toggleCollapsed}>
					<Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
				</Button>
			</div>
		);
	}
}

class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.newTabIndex = 1;
		this.state = {
			collapsed: false,
			activeKey: 'newTab0',
			isFullScreen: false,
			panes: [],
			current: "1"
		};
	}
	logout = () => {
		let _this = this;
		Modal.confirm({
			zIndex: 1002,
			title: '登出确认',
			content: `是否要退出当前登录的账户`,
			onOk() {
				_this.props.history.push('/login');
			}
		})
	}
	changePassword = () => {
		this.setState({ isFullScreen: false });
		let matchChangePassword = this.getExitPane('title', '修改密码');
		if (matchChangePassword !== null) {
			this.setState({
				activeKey: matchChangePassword.key,
				current: "7"
			});
			this.props.history.push(matchChangePassword.url);
			return;
		}
		let ChangePasswordObject = menuList.filter((item) => item.title === '修改密码')[0];
		ChangePasswordObject.key = `newTab${this.newTabIndex++}`;
		this.props.history.push(ChangePasswordObject.url);
		this.setState(function (prevState, props) {
			prevState.panes.push(ChangePasswordObject);
			return {
				panes: prevState.panes,
				activeKey: ChangePasswordObject.key,
				current: "7"
			};
		});
	}
	goHome = () => {
		this.setState({ isFullScreen: false });
		let matchHomePane = this.getExitPane('title', '主页');
		if (matchHomePane !== null) {
			this.setState({
				activeKey: matchHomePane.key,
				current: "1"
			});
			this.props.history.push(matchHomePane.url);
			return;
		}
		let homePaneObject = menuList.filter((item) => item.title === '主页')[0];
		homePaneObject.key = `newTab${this.newTabIndex++}`;
		this.props.history.push(homePaneObject.url);
		this.setState(function (prevState, props) {
			prevState.panes.push(homePaneObject);
			return {
				panes: prevState.panes,
				activeKey: homePaneObject.key,
				current: "1"
			};
		});
	}
	add = (event) => {
		let url = event.currentTarget.getAttribute('href');
		let exitPane = this.getExitPane('url', url);
		if (exitPane != null) {
			this.setState({ activeKey: exitPane.key, isFullScreen: exitPane.isFullScreen, current: (exitPane.id + "") });
			return;
		}
		//创建新的tab项
		let matchMenus = menuList.filter((item) => item.url === url);
		if (matchMenus.length > 0) {
			let activeKey = `newTab${this.newTabIndex++}`;
			this.setState((prevState) => {
				matchMenus[0].key = activeKey;
				prevState.panes.push(matchMenus[0]);
				return {
					panes: prevState.panes,
					activeKey,
					isFullScreen: matchMenus[0].isFullScreen,
					current: (matchMenus[0].id + "")
				}
			})
		}
	}

	getExitPane = (propertyName, value) => {
		let matchPanes = this.state.panes.filter((item) => item[propertyName] === value);
		if (matchPanes.length > 0) {
			return matchPanes[0];
		}
		return null;
	}

	onChange = (activeKey) => {
		let exitPane = this.getExitPane('key', activeKey);
		if (exitPane !== null) {
			this.setState({
				isFullScreen: exitPane.isFullScreen,
				current: exitPane.id + ""
			})
			this.props.history.push(exitPane.url);
			this.setState({ activeKey });
		}
	}

	onEdit = (targetKey, action) => {
		this[action](targetKey);
	}

	remove = (targetKey) => {
		var targetIndex = 0;
		for (let i of this.state.panes) {
			if (i.key === targetKey)
				break
			targetIndex++;
		}
		const panes = this.state.panes.filter(pane => pane.key !== targetKey);
		let length = panes.length;
		if (length > 0) {
			targetIndex = (targetIndex >= length) ? targetIndex - 1 : targetIndex;
			let activeKey = panes[targetIndex].key;
			this.setState({
				panes,
				activeKey,
				current: panes[targetIndex].id + ""
			});
			this.props.history.push(panes[targetIndex].url);
		}
	}
	render() {
		var fulllScreenClass = this.state.isFullScreen ? 'fullScreen' : '';
		return <div className={"layout " + fulllScreenClass}>
			<div className="header">
				<img src={require('./images/HeYuan.png')} style={{ "width": 45, "margin": "0 20px" }} />
				<span style={{ "fontWeight": "bold", "letterSpacing": "2px" }}>金圆供销管理系统</span>
				<span>
					<span>
						&nbsp;&nbsp;欢迎您&nbsp;&nbsp;{sessionStorage.getItem('userName')}
						<Dropdown overlay={
							<Menu>
								<Menu.Item onClick={this.goHome.bind(this)} >
									<Tooltip title="打开主页页签">
										<Icon type="home" style={{ "margin": "10px 20px 10px 5px" }} />主页
									</Tooltip>
								</Menu.Item>
								<Menu.Item onClick={this.changePassword.bind(this)} >
									<Tooltip title="修改当前账户的密码">
										<Icon type="edit" style={{ "margin": "10px 20px 10px 5px" }} />修改密码
									</Tooltip>
								</Menu.Item>
								<Menu.Item onClick={this.logout.bind(this)} >
									<Tooltip title="注销当前账户登录状态">
										<Icon type="logout" style={{ "margin": "10px 20px 10px 5px" }} />登出
									</Tooltip>
								</Menu.Item>
							</Menu >} placement="bottomCenter">
							<Avatar size="large">
								{sessionStorage.getItem('userName')[0].toUpperCase()}
							</Avatar>
						</Dropdown>
					</span>
				</span>
			</div>
			<div className={"content"}>
				<nav className="nav-content">
					<CreateMenuList addTabs={this.add} current={this.state.current} />
				</nav>

				{/* <div className="footer">金圆环保股份有限公司 ©版权所有 备案号浙ICP备05049717号</div> */}
				<div className="footer">—— 金圆环保股份有限公司 ©版权所有 浙ICP备05049717号 ——</div>

				<div className="page-content">
					<Tabs
						onChange={this.onChange}
						activeKey={this.state.activeKey}
						type="editable-card"
						onEdit={this.onEdit}
					>
						{this.state.panes.map(
							pane => {
								let route = null;
								if (menuObject.hasOwnProperty(pane.component)) {
									route = <CacheRoute path={pane.url} exact component={menuObject[pane.component]} />;
								} else {
									route = <Route component={NoFound} />;
								}
								return <TabPane tab={pane.title} key={pane.key}>
									{route}
								</TabPane>
							}
						)}
					</Tabs>
				</div>
			</div>
		</div >
	}
	componentDidMount() {
		let url = this.props.history.location.pathname;//获取当前url
		let matchMenus = menuList.filter((item) => item.url === url);//获取当前路由匹配的菜单信息
		let paneObject = menuList.filter((item) => item.title === "主页")[0];//从菜单获取主页的tab对象信息
		paneObject.key = 'newTab0';
		if (matchMenus.length > 0) {//如果有匹配到当前路由的菜单信息，就修改paneObject为当前路由的信息
			Object.assign(paneObject, paneObject, matchMenus[0]);//对象合并方法，matchMenus[0]覆盖修改paneObject的同名属性值。
		} else {
			paneObject.id = '8';
			paneObject.title = '404';
			paneObject.url = '/layout/nofound';
			paneObject.component = ' ';
			matchMenus.push({ id: "8" });
		}
		this.setState({//更新panes对象
			panes: [paneObject],
			isFullScreen: paneObject.isFullScreen,
			current: matchMenus[0].id + ""
		})
	}
}
export default withRouter(Layout)