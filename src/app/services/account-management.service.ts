import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({providedIn:'root'})
export class AccountManagementService{
  constructor(private http:HttpClient){}

  updateUserProfileAndUsername(photo : string,username : string){
    let data : any = {username};
    if(photo) data.profilePic = photo;
    return this.http.patch(environment.api+'/api/account-management',data);
  }
}
