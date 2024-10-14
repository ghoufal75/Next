import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthInterceptor } from './authentication/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [IonicStorageModule.forRoot(),BrowserModule, IonicModule.forRoot( {backButtonText: '',innerHTMLTemplatesEnabled : true}), AppRoutingModule,HttpClientModule],
  providers: [{provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true},{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],

})
export class AppModule {}
