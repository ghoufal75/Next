import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { LoadingController, Platform } from '@ionic/angular';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { FACEBOOK_PERMISSIONS } from '../data/facebook-permissions';
import { PictureService } from '../services/picture.service';
import { AccountManagementService } from '../services/account-management.service';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage  {

  firstConnection = false;
  username : string="";
  profilePicBase64 : string;
  error : string;
  inputTouched = false;
  loader : any;
  constructor(private loadingCtrl : LoadingController , private accountManagementService : AccountManagementService,private pictureService : PictureService,private activatedRoute : ActivatedRoute,private router : Router,private authService : AuthService,private http : HttpClient, private platform : Platform) {
    this.loadingCtrl.create({message:'Loading'}).then((ld)=>this.loader = ld);
  }



  onInputBlur() {
    this.inputTouched = true;
  }

  onUpdateUserInfos(){
    this.loader.present();
    this.accountManagementService.updateUserProfileAndUsername(this.profilePicBase64,this.username).subscribe(res=>{
      this.router.navigateByUrl('/home/messages/messageList');
      this.loader.dismiss();
    });
  }

  getDisabledCondition(){
    const reg = /^[^\d\s\W][\w.]*$/;
    return this.username == "" || !reg.test(this.username);
  }


  async pickPhoto(){
    this.profilePicBase64 = await this.pictureService.addNewToGallery();
  }

  ionViewWillEnter(){
    this.initializeGoogleAuth();
  }

  initializeGoogleAuth(){
    this.platform.ready().then(()=>{
      GoogleAuth.initialize();
      return FacebookLogin.initialize({ appId: '502994582065134' });
    }).then((res)=>{

    })
  }

  async singInGoogle(){
   this.loader.present();
   let googleUser = await GoogleAuth.signIn();
   let user = {...googleUser} as any;
   console.log("User: ",user);
   delete user.authentication;
   delete user.id;
   delete user.serverAuthCode;
   this.authService.signIn(user,'google').subscribe({
    next : (res)=>{
      if(res.firstConnection){
          this.firstConnection = true;
          this.loader.dismiss();
      }
      else{
        this.router.navigateByUrl('/home/messages/messageList');
        this.loader.dismiss();
      }
    },
    error : (err)=>{
      this.error = err;
    }
   })
  }

  async singInFacebook(){
    this.loader.present();
    const token = await (<FacebookLoginResponse><unknown>(
      FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
    ));
    console.log("Result of fb login : ",token);
    const user = await FacebookLogin.getProfile({ fields:  ['email','name','first_name','last_name']});
    this.authService.signIn(user,'facebook').subscribe({
      next : (res)=>{
        if(res.firstConnection){
          this.firstConnection = true;
          this.loader.dismiss();
        }
        else{
          this.router.navigateByUrl('/home/messages/messageList');
          this.loader.dismiss();
        }
      },
      error : (err)=>{
        console.log("Here is error : ",err);
        this.error = err;
      }
     })
   }




  //  async singInApple(){
  //   let googleUser = await GoogleAuth.signIn();
  //   let user = {...googleUser} as any;
  //   delete user.authentication;
  //   delete user.id;
  //   delete user.serverAuthCode;
  //   this.authService.signIn(user).subscribe({
  //    next : (res)=>{
  //      this.router.navigate(['..','messages'],{relativeTo : this.activatedRoute})
  //    },
  //    error : (err)=>{
  //      this.error = err;
  //    }
  //   })
  //  }


}
