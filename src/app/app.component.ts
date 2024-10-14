import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './authentication/auth.service';
import {filter, take} from 'rxjs/operators';
import { IonMenu } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  currentUser : any = {};
  @ViewChild('menu') menu : IonMenu;
  isAuth  = true;
  constructor(private router : Router,private authService : AuthService) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
    ).subscribe((event:any) => {
      console.log("URL :",this.router.url);
      if (event['url'].includes('authentication')) {
        this.isAuth = false;
      }
      else{
        this.isAuth = true;
      }
    });
    this.authService.connectedUser$.subscribe(res=>{
      console.log("Here is the current user : ",this.currentUser);
      this.currentUser = res;
    });
    this.authService.autoLogin();


  }

  logout(){
    this.menu.close();
    this.authService.logout();
  }
}
