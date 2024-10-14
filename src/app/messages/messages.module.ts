import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRoutingModule } from './messages-routing.module';
import { SocketService } from '../services/socket.service';
import { ChatService } from '../services/chat.service';






@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MessagesRoutingModule,


  ],
  providers : [SocketService,ChatService]
})
export class MessagesModule { }
