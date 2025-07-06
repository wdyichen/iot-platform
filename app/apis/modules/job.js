const http = uni.$u.http;

// 查询定时任务调度列表
export function getJobList (query) {
	return http.request({
		url: '/iot/job/list',
		method: 'get',
		data: query
	})
}

// 定时任务立即执行一次
export function runJob (data) {
	return http.request({
		url: '/iot/job/run',
		method: 'put',
		data: data
	})
}

// 任务状态修改
export function changeJobStatus (data) {
	return http.request({
		url: '/iot/job/changeStatus',
		method: 'put',
		data: data
	})
}

// 新增定时任务调度
export function addJob (data) {
	return http.request({
		url: '/iot/job',
		method: 'post',
		data: data
	})
}

// 查询定时任务调度详细
export function getJob (jobId) {
	return http.request({
		url: '/iot/job/' + jobId,
		method: 'get'
	})
}

// 修改定时任务调度
export function updateJob (data) {
	return http.request({
		url: '/iot/job',
		method: 'put',
		data: data
	})
}

// 删除定时任务调度
export function delJob (jobId) {
	return http.request({
		url: '/iot/job/' + jobId,
		method: 'delete'
	})
}