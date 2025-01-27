import { Injectable } from "@angular/core";
import { SocketService } from "./socket.service";
import { Observable, Subject } from "rxjs";
import {distinctUntilChanged, map, skipWhile, take} from "rxjs/operators";
import { Conversation } from "../models/conversation.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Contact } from "../models/contact.model";
import { AuthService } from "../authentication/auth.service";
export type Message = {senderName : string,content : string,sentAt : Date, sender ?: string,me:boolean};
@Injectable()
export class ChatService{
  messages : Message[] = [];
  conversations$ : Subject<Conversation[]> = new Subject<Conversation[]>();
  conversationList : Conversation[] = [];
  contact$ : Subject<Contact[]> = new Subject<Contact[]>();
  contactList : Contact[] = [];
  selectedContacts : Contact[] = [];
  selectedContacts$ : Subject<Contact[]> = new Subject<Contact[]>();
  connectedUser : any;
  actualConversation : string | null;
  unreadMessages = 0;
  unreadMessagesSubject : Subject<number> = new Subject<number>()
  constructor(private authService : AuthService,private socketService : SocketService,private http : HttpClient){
    this.authService.connectedUser$.subscribe(res=>{
      this.connectedUser = res;
    });
  }

  createConversation(){
    return this.http.post(environment.api+'/api/chat/conversation',{users : [...this.selectedContacts.map(el=>el._id)]});
  }

  getConversation(id:string){
    this.actualConversation = id;
    const conversation = this.conversationList.find(el=>el._id==id)!!;
    conversation.messages  = conversation?.messages.map(el=>el.sender==this.connectedUser._id?{...el,me:true}:el) ;
    return conversation;
  }

  toggleSelected(contact : Contact,event : any){
    if(event){
      this.selectedContacts.push(contact);
      this.contactList = this.contactList.filter(el=>el.username!=contact.username);
      this.emitContacts();
    }
    else{
      this.selectedContacts = this.selectedContacts.filter(el=>el.username!=contact.username);
    }
    this.emitSelectedContacts();

  }

  emitSelectedContacts(){
    this.selectedContacts$.next(this.selectedContacts);
  }

  emptyContact(){
    this.contactList = [];
  }

  getMessages() {
    this.socketService.getMessage().subscribe((payload:any)=>{
      console.log("New Message : ",payload);
      if(this.actualConversation==payload.conversation){
        this.readMessages(this.actualConversation,[payload.sentAt],this.connectedUser._id);
      }
      else{
        (this.conversationList.find(el=>el._id==payload.conversation) as any).unreadMessages += 1
      }
      this.conversationList.find(el=>el._id==payload.conversation)?.messages.push({readBy : payload.readBy,content:payload.content,sender : payload.sender,me:payload.me,sentAt:payload.sentAt});
      this.emitConversations();
    });
  }

  resetActualConversation(){
    this.actualConversation=null;
  }

  // listenForSuccessSave(){
  //   this.socketService.onSucesfullySaved().subscribe(res=>{
  //     this.
  //   })
  // }

  // listenForErrorSave(){
  //   this.socketService.onSavedError().subscribe(res=>{

  //   })
  // }

  resetContactAndSelectedList(){
    this.contactList = [];
    this.selectedContacts = [];
  }

  getUnreadMessages(conversation:any){
    console.log("Here is the connected user : ",this.connectedUser._id);
    return this.conversationList.find(el=>el._id==conversation)?.messages.filter(msg=>msg.readBy.findIndex((ell:any)=>ell==this.connectedUser._id)==-1).map(el=>el.sentAt);
  }

  subscribeToSeen(){
      this.socketService.getSeenByUser().subscribe(res=>{
          console.log("Message got read : ",res);
          const conv = this.conversationList.find(el=>el._id==res.conversation);
          for(let msg of res.messages){
            const foundMessage = conv?.messages.find(el=>el.sentAt==msg);
            foundMessage.readBy.push(res.reader);
          }
          this.conversations$.next(this.conversationList);
      });
  }

  readMessages(conversation:any,messages:any,reader:any){
    this.socketService.emit('seen',JSON.stringify({conversation,messages,reader}));
    (this.conversationList.find(cnv=>cnv._id==conversation) as any).unreadMessages = 0;
  }

  search(value : string){
      this.http.post(environment.api+"/api/search", {name : value}).pipe(skipWhile((res:any)=>{

        console.log(res);
        return res.length==this.contactList.length && res[res.length-1].username==this.contactList[this.contactList.length-1].username

      }),map(res=>{
      for(let el of res){
        if(el._id==this.connectedUser._id){
          res = res.filter((element:any)=>element._id!=el._id)
        }
        const selectedContact = this.selectedContacts.find(ele=>ele.username==el.username);
        if(selectedContact){
          res = res.filter((ele:any)=>ele.username!=selectedContact.username);
        }
      }
      return res;
    })).subscribe((res:any)=>{

      this.contactList = res;
      this.emitContacts();
    })
  }

  subscribeToReceivingNewConvs(){
    this.socketService.onReceivingNewConv().subscribe(res=>{
      console.log("Signal to fetch Conversations");
      this.getConversations();
    })
  }

  emitContacts(){
    this.contact$.next(this.contactList);
  }

  emitIsWriting(emitedValue:boolean){
    
    this.socketService.emit("isWriting",JSON.stringify({sender : this.connectedUser._id,isWriting : emitedValue,conversation:this.actualConversation}));
  }

  subscribeToWriting(){
    this.socketService.getIsWriting().subscribe(res=>{
      if(res.isWriting){
        this.conversationList.find(el=>el._id==res.conversation)?.messages.push({sender : res.sender,content:"Is Writing ..."});
      }
      else{
        console.log("Stopped writing");
        let newArray : any= this.conversationList.find(el=>el._id==res.conversation)?.messages.filter(msg=>msg.content!="Is Writing ...");
        (this.conversationList.find(el=>el._id==res.conversation) as any).messages = newArray;
      }
      this.emitConversations();
    })
  }


  // sendFile(content:any){
  //   try {
  //     let file = content.file
	// 		// Check for the various File API support
				
	// 			// change 
				
	// 			// read audio file
	// 			var reader = new FileReader();
				
	// 			// event triggered wghen the file is loaded
	// 			reader.onload = (fev:any) => {
					
	// 				var chunkIndex = 0; // current index to start rading file
	// 				var chunkIndexEnd = chunkIndex + 5000; // send 5000 bits per message
	// 				var fileBiteLength = fev.target.result.length;
					
	// 				// called when the server is ready to get the data
	// 				this.socketService.once('serverUploadReady', ()=>{
	// 					var isEnd = false;
	// 					if(chunkIndexEnd >= fileBiteLength) {
	// 						chunkIndexEnd -= (chunkIndexEnd - fileBiteLength);
	// 						isEnd = true;
	// 					}
	// 					var chunk = fev.target.result.slice(chunkIndex, chunkIndexEnd);
						
	// 					chunkIndex += chunkIndexEnd; // increment current file pointer
	// 					chunkIndexEnd += 5000; // send 5000 bits per message
						
	// 					this.socketService.emit('clientUplaodChunk', {
	// 						chunk : chunk,
	// 						end : isEnd
	// 					});
	// 				});
					
	// 				// called when the server has recieved a complete file and is ready for the metadata
	// 				this.socketService.once('serverUploadComplete', (data:any)=>{
	// 					this.socketService.emit('add', {
	// 						sid : sid,
	// 						name : $('#name').val(),
	// 						description : $('#description').val(),
	// 						file : data.fileid
	// 					});
	// 				});
					
	// 				// send notice to server that a fileupload is coming in
	// 				// episodeSock.emit('clientUplaodReady', {
	// 				// 	sid : sid,
	// 				// 	filename : file.name
	// 				// });
	// 			};
				
	// 			reader.readAsBinaryString(file);
			
	// 	} catch(e:any) {
	// 		return;
	// 	}
  // }

  getConversations(){
    this.http.get(environment.api+'/api/chat/conversation').pipe(
      map((res:any)=>{
      let unreadMessagesNumber=0;
      if(res && res.length>0){
        res = res.map((cnv:any)=>{
          let unread = 0;
          for(let msg of cnv.messages){
            if(msg.readBy.length > 0 && msg.readBy.indexOf(this.connectedUser._id)==-1){
              unread++;
              unreadMessagesNumber++;
            } ;
          }
          return {...cnv,unreadMessages : unread};
        })
      }
      console.log("unreadMessagesNumber",unreadMessagesNumber);
      this.unreadMessages = unreadMessagesNumber;
      this.emitUnreadMessagesNumber();

      return res;
    })
    ).subscribe((res : any)=>{
      this.conversationList = res;
      this.emitConversations();
      this.socketService.joinConversations();
    });
  }

  emitUnreadMessagesNumber(){
    this.unreadMessagesSubject.next(this.unreadMessages);
  }

  emitConversations(){
    this.conversations$.next(this.conversationList);
  }

  sendMessage(data : any){
    this.socketService.sendMessage(JSON.stringify(data));
  }




}
