import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children : [
      {
        path : "messages",
        loadChildren : ()=> import('../messages/messages.module').then(m=>m.MessagesModule)
      },
      {
        path: 'feed',
        loadChildren: () => import('../feed/feed.module').then( m => m.FeedPageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('../notifications/notifications.module').then( m => m.NotificationsPageModule)
      },
      {
        path:'',
        redirectTo : 'messages',
        pathMatch : 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
