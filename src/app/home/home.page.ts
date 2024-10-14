import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { filter, takeUntil } from 'rxjs';
import { ChatService } from '../services/chat.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  tabBarIsShown=true;
  unreadMessagesNumber = 0;
  isMessagesPage = false;
  constructor(private chatService : ChatService,private router : Router){}

  ngOnInit(): void {
    this.chatService.unreadMessagesSubject.subscribe(res=>this.unreadMessagesNumber = res);
    this.chatService.emitUnreadMessagesNumber();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      ).subscribe((event:any) => {
      console.log("currentUrl : ",event['url']);
      if(event['url'].includes('/messageList')){
        this.isMessagesPage = true;
      }
      else{
        this.isMessagesPage=false;
      }
      if (event['url'].includes('/conversation')) {
        this.tabBarIsShown = false;
      }
      else{
        this.tabBarIsShown = true;
      }
      console.log("Unread Messages : ",this.unreadMessagesNumber);
      console.log("Is messageLit page : ",this.isMessagesPage);
    });
  }
  navigateToFeed(){
    this.router.navigateByUrl('/home/feed');
  }


}
