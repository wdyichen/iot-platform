const http = uni.$u.http;

// 查询设备用户详细
export function getDeviceUser (deviceId) {
	return http.get('/iot/deviceUser/' + deviceId)
}

// 新增设备用户
export function addDeviceUser (data) {
	return http.post('/iot/share', data);
}

// 修改设备用户
export function updateDeviceUser (data) {
	return http.put('/iot/share', data)
}

// 删除设备用户
export function delDeviceUser (device) {
	return http.delete('/iot/share', device)
}

// 查询可分享用户列表
export function getShareUser (data) {
	return http.get('/iot/share/shareUser', { params: data });
}

// 查询已经分享用户列表
export function getUserList (params) {
	return http.get('/iot/share/list', { params: params });
}