import { NgModule } 		from '@angular/core';
import { BrowserModule }	from '@angular/platform-browser';
import { HttpModule, JsonpModule }		from '@angular/http';
import { FormsModule }		from '@angular/forms';
import './rxjs-extensions';

import { AppComponent }		from './app.component';
import { PADHerderService }	from './PADHerder.service';

@NgModule({
  imports:      [
  	BrowserModule,
  	HttpModule,
  	JsonpModule,
  	FormsModule
  ],
  declarations: [ AppComponent ],
  providers:	[ PADHerderService ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }