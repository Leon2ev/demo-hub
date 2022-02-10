import Broadcast from '@/web-rtc/broadcast-app/views/Broadcast.vue'
import Broadcaster from '@/web-rtc/broadcast-app/views/Broadcaster.vue'
import Viewer from '@/web-rtc/broadcast-app/views/Viewer.vue'

export const broadcastAppRoutes = [
  {
    path: '/broadcast-app',
    name: 'broadcastApp',
    component: Broadcast,
    meta: {
      breadcrumb: [{
        label: 'Broadcast App',
        to: { name: 'broadcastApp' }
      }]
    },
  },
  {
    path: '/broadcast-app/broadcaster',
    name: 'broadcaster',
    component: Broadcaster,
    meta: {
      breadcrumb: [{
        label: 'Broadcast App',
        to: { name: 'broadcastApp' }
      },
      {
        label: 'Broadcaster',
        to: { name: 'broadcaster' }
      }]
    },
  },
  {
    path: '/broadcast-app/viewer',
    name: 'viewer',
    component: Viewer,
    meta: {
      breadcrumb: [{
        label: 'Broadcast App',
        to: { name: 'broadcastApp' }
      },
      {
        label: 'Viewer',
        to: { name: 'viewer' }
      }]
    }
  }
]