import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({providedIn : 'root'})
export class StorageService{
  constructor(private storage : Storage){
    this.createDb();
  }

  async createDb(){
    await this.storage.create();

  }

  async removeFromStorage(key : any){
    await this.storage.remove(key);
    return;
  }

  async addToStorage(key : string,value : any){
    await this.storage.set(key,value);
    return true;
  }

  async getFromStorage(key:string){
    return await this.storage.get(key);
  }
}
