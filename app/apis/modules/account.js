const http = uni.$u.http;

import upload from '@/utils/upload'
//修改个人信息
export function updateProfile(params) {
	return http.put('/system/user/profile', params);
}

//用户头像上传
export function uploadAvatar(data) {
	return upload({
		url: '/system/user/profile/avatar',
		method: 'post',
		name: data.name,
		filePath: data.filePath
	})
}

//用户密码重置
export function updateUserPwd(data) {
	return http.request({
		url: '/system/user/profile/updatePwd',
		method: 'put',
		data: data
	})
}