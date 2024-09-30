import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signup/signin.component';
import { InitialPageComponent } from './initial-page/initial-page.component';
import { UploadBookComponent } from './upload-book/upload-book.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmDialogLogoutComponent } from './confirm-dialog-logout/confirm-dialog-logout.component';
import { SearchBookComponent } from './search-book/search-book.component';
import { provideHttpClient } from '@angular/common/http';
import { ListBookComponent } from './list-book/list-book.component';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './user-profile/user-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SigninComponent,
    InitialPageComponent,
    UploadBookComponent,
    ConfirmDialogLogoutComponent,
    SearchBookComponent,
    ListBookComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
