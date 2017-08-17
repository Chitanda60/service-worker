
const CACHE_V1 = 'v1'
const CACHE_V2 = 'v2'


// 监听 安装worker
self.addEventListener('install', event => {
	// 确保worker安装前执行完缓存代码(资源)
	event.waitUntil(
		// 创建一个CacheStorage对象
		caches.open(CACHE_V1)
			.then(cache => {
				return cache.addAll([
					'./js/main.js'
				])
			})
	)
})

// 监听 更新激活新worker
self.addEventListener('activate', event => {

})

// 监听 网络请求(仅对被控制的资源) 劫持HTTP请求
self.addEventListener('fetch', event => {
	// // FetchEvent事件
	const { request } = event

	// 对请求的资源和cache里的资源进行匹配 匹配不到才向服务端请求
	const findRequestPromise = caches.open(CACHE_V1)
		.then(cache => cache.match(request))
		.then(response => {
			let resins

			if (response) {
				console.log('match')
				
				resins = response
			} else {
				console.log('not match')

				resins = fetch(request)
			}
			
			return resins
		})

	event.respondWith(findRequestPromise)
})

// 监听 延迟到网络恢复的时候进行
self.addEventListener('sync', event => {
	if (event.tag === 'submit') {
		console.log('sync')
	}
})

// worker 提示弹窗
self.addEventListener('notificationclick', event => {
	// 消息提醒被点击
	console.log('notificationclick')
})
self.addEventListener('notificationclose', event => {
	// 消息提醒被关闭
	console.log('notificationclose')
})