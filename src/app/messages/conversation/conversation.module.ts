import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversationPageRoutingModule } from './conversation-routing.module';

import { ConversationPage } from './conversation.page';
import { LongPressModule } from 'src/app/directives/longPress.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LongPressModule,
    ConversationPageRoutingModule
  ],
  declarations: [ConversationPage]
})
export class ConversationPageModule {}
