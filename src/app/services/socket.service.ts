import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { AuthService } from "../authentication/auth.service";
import { map, take } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class SocketService extends Socket{
  token : any;
  user : any;
  constructor(private authService : AuthService){
    super({url : environment.api,options:{autoConnect : false}})
    this.authService.connectedUser$.pipe(take(1)).subscribe(res=>{
      console.log("Here is the res : ",res);
      this.user = res;
      this.ioSocket.io.opts.query = {token : res?.token};
      this.token = res?.token;
      console.log("Here is the token : ",this.token);
      this.connect();

    })
  }

  joinConversations(){
    this.emit('join',JSON.stringify({token : this.user.token}));
  }

  sendMessage(payload : any){
    this.emit("message",payload);
  }

  getSeenByUser(){
    return this.fromEvent('messageRead').pipe(map((res:any)=> JSON.parse(res)));
  }

  getMessage() {
    return this
        .fromEvent("newMessage").pipe(map((msg:any)=>{
          msg = JSON.parse(msg);
          console.log("Sender : ",msg.sender);
          console.log("Connected user id : ",this.user._id);
          if(msg.sender==this.user._id){
            msg.me=true;
          }
          return msg;
        }));
  }

  onSucesfullySaved(){
    return this.fromEvent('savedSuccess');
  }


  onSavedError(){
    return this.fromEvent('savedError');
  }
}
