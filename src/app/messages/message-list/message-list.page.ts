import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/authentication/auth.service';
import { Contact } from 'src/app/models/contact.model';
import { Conversation } from 'src/app/models/conversation.model';
import { AccountManagementService } from 'src/app/services/account-management.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  styleUrls: ['./message-list.page.scss'],
})
export class MessageListPage implements OnInit {
  conversationList : Conversation[] = [];
  @ViewChild(IonModal) modal: IonModal;
  contactList : Contact[] = [];
  selectedContacts : Contact[] = [];
  connectedUser : any = null;
  isGettingMessages = false;
  error = '';
  constructor(private alertCtrl : AlertController ,private authService : AuthService,private chatService : ChatService,private accountManagementService : AccountManagementService) { }



  getConversationImgUrl(cnv : Conversation){
    if(cnv.users.length==2){
      return cnv.users.find(el=>el._id!=this.connectedUser._id).profilePic;
    }
    return cnv.conversationPic;
  }

  getConvName(cnv: Conversation){
    if(cnv.users.length==2){
      return cnv.users.find(el=>el._id!=this.connectedUser._id).fullName;
    }
    return cnv._id;
  }

  ngOnInit() {
    this.authService.connectedUser$.pipe(take(1)).subscribe(res=>{
      console.log("Connected User : ",res);
      this.connectedUser = res;
    });
    this.subscribeToConversationList();
    this.chatService.getConversations();
    this.subscribeToContactList();
    this.subscribeToSelectedConversationList();
    this.subscribeToReadMessages();

  }

  getConversations(){
    this.chatService.getConversations();
  }

  toggleChooseContact(contact : Contact,event : any){
    console.log("Changed");
    this.chatService.toggleSelected(contact,event);
  }

  onSubmitConversation(){
    this.modal.dismiss();
    this.chatService.createConversation().subscribe(res=>{
      this.getConversations();
      this.contactList = [];
      this.selectedContacts = [];
      this.chatService.resetContactAndSelectedList();

    },err=>{
      console.log(err);
      this.contactList = [];
      this.selectedContacts = [];
      this.chatService.resetContactAndSelectedList();
      this.error = err.error.message;
      this.alertCtrl.create({
        header : "There was an error",
        message : this.error,
        buttons : ['OK']
      }).then(md=>md.present());
    });
  }

  onSearchKeyUp(event:any){
    if(event.target.value.trim()==""){
      this.contactList=[];
      this.chatService.emptyContact();
      return;
    }
    this.chatService.search(event.target.value);
  }


  onCancelSearch(){
    this.contactList = [];
    this.modal.dismiss();
  }


  subscribeToSelectedConversationList(){
    this.chatService.selectedContacts$.subscribe(res=>{
      this.selectedContacts = res;
    });
  }

  subscribeToReadMessages(){
    this.chatService.subscribeToSeen();
  }

  subscribeToConversationList(){
    this.chatService.conversations$.subscribe(res=>{
      this.conversationList = res;
      if(!this.isGettingMessages){
        this.chatService.getMessages();
        this.isGettingMessages = true;
      }
    });
  }


  getSenderName(cnvId:any,senderId:any){
    return this.conversationList.find((el:any)=>el._id===cnvId)?.users.find(el=>el._id==senderId).fullName;
  }

  subscribeToContactList(){
    this.chatService.contact$.subscribe((res:any)=>{
      console.log("Users : ",res);
      this.contactList = res;
    });
  }

  getProfile(){

  }

  onWillDismiss(event:any){

  }

  showCreationModal(){
    this.modal.present();
  }

}
