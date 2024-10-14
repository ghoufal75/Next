import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageListPageRoutingModule } from './message-list-routing.module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MessageListPage } from './message-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageListPageRoutingModule,
    ScrollingModule,
  ],
  declarations: [MessageListPage]
})
export class MessageListPageModule {}
