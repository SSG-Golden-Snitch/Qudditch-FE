// /public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js')
// 알림 notify
self.addEventListener('push', function (e) {
  if (!e.data.json()) return
  const resultData = e.data.json().notification
  const notificationTitle = resultData.title
  const notificationOptions = {
    body: resultData.body,
    icon: '/owl.png', // 웹 푸시 이미지는 icon
    tag: resultData.tag,
  }
  //   console.log('백그라운드에서 알람받음')
  //   alert('백그라운드 alert!!!')
  self.registration.showNotification(notificationTitle, notificationOptions)
})
// 푸시 알림 클릭시 해당 url로 새로열기
self.addEventListener('notificationclick', function (event) {
  const url = '/m/alert'
  event.notification.close()
  event.waitUntil(clients.openWindow(url))
})
