import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { AppComponent } from './app.component';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxMapboxGLModule.forRoot({
      accessToken: 'pk..oYdvq_XT79XIefBeuDNFVg'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
