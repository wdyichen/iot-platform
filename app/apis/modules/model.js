const http = uni.$u.http;

// 查询物模型对应分享设备用户权限列表
export function getModelPermList (productId) {
	return http.get('/iot/model/permList/' + productId);
}