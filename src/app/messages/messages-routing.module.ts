import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes : Routes = [
    {
        path : 'messageList',
        loadChildren : () => import('./message-list/message-list.module').then(m=>m.MessageListPageModule)
    },
    {
        path : 'conversation/:id',
        loadChildren : () => import('./conversation/conversation.module').then(m=>m.ConversationPageModule)
    },
    {
        path : '',
        redirectTo : 'messageList',
        pathMatch : 'full'
    }
]

@NgModule({
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
})
export class MessagesRoutingModule{}
