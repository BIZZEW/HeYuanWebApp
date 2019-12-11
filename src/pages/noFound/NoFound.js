import React from 'react'
import { Result, Button } from 'antd';

const NoFound = () => (
	<Result
		status="404"
		title="404"
		subTitle="抱歉, 您所访问的页面不存在。"
		extra={<Button type="primary" onClick={() => {
			window.history.back();
		}}>返回</Button>}
	/>
)

export default NoFound
