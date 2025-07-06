const http = uni.$u.http;

// 查询产品列表
export function getProductList (query) {
	return http.get('/iot/product/list', {
		params: query
	})
}