import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/auth.service';
import { Conversation } from 'src/app/models/conversation.model';
import { ChatService, Message } from 'src/app/services/chat.service';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage  {
  messageInput = '';
  messages$ : Observable<Message[]>;
  actualConversation : Conversation;
  connectedUser : any;
  constructor(private alertCtrl : AlertController,private authService : AuthService, private activatedRoute : ActivatedRoute,private chatService : ChatService) {
    this.authService.connectedUser$.pipe(take(1)).subscribe(res=>{
      this.connectedUser = res;
    })
  }

  getSenderName(id:any){
    return this.actualConversation.users.find(el=>el._id==id).fullName;
  }


  onLongPress(event : any,msg : any){
    const seenBy = [];
    for(let user of msg.readBy){
      seenBy.push(this.actualConversation.users.find(el=>el._id==user));
    }
    this.alertCtrl.create({
      header : 'Message Infos',
      message : `
        <h5 class="AlertTitle">Seen by</h5><br>
        <ion-list class="IonList">
            ${seenBy.map(el=>{
              return `
                <ion-item>
                  <ion-avatar slot="start">
                    <img src=${el.profilePic} width=100 heihgt=100 alt="Conv pic">
                  </ion-avatar>
                  <h6>${el.fullName}</h6>
                </ion-item>
              `
            })}
        </ion-list>
      `,
      cssClass : 'AlertContent'


    }).then(alrt=>alrt.present());

  }

  ionViewWillLeave(){
    this.chatService.resetActualConversation();
  }

  getMessageSeenState(msg : any){
    if(msg.readBy && msg.readBy.length>1){
      return '#08D2CF'
    }
    return "#C9C9C9";
  }

  ionViewWillEnter(){
    console.log("Executing [ionViewWillEnter]")
    this.activatedRoute.paramMap.subscribe(param=>{
     this.actualConversation= this.chatService.getConversation(param.get('id') as string) as any;
     console.log("Here is the actual conversation : ",this.actualConversation);
     let unreadMessages = this.chatService.getUnreadMessages(param.get('id'));
     console.log("Here are the read messages : ",unreadMessages);
     if(unreadMessages && unreadMessages?.length!=0){
       this.chatService.readMessages(param.get('id'),unreadMessages,this.connectedUser._id);
     }
     console.log("Here is actual conversation : ",this.actualConversation);
    });

  }


  getReadBy(msg : any){
    console.log("This message was read by : ",msg.readBy);
  }

  sendMessage(){
    this.chatService.sendMessage({sender:this.connectedUser._id,conversation:this.actualConversation._id,content:this.messageInput});
    this.messageInput = "";
  }

  getConversationName(){
    if(!this.actualConversation){
      return'';
    }
    if(this.actualConversation.users.length==2){
      return this.actualConversation.users.find(el=>el._id!=this.connectedUser._id).fullName;
    }
    return this.actualConversation._id?.slice(0,6);
  }
  getConversationImgUrl(){
    if(!this.actualConversation){
      return'';
    }
    if(this.actualConversation.users.length==2){
      return this.actualConversation.users.find(el=>el._id!=this.connectedUser._id).profilePic;
    }
    return this.actualConversation.conversationPic;
  }
}
