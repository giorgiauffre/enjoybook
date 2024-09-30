import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signup/signin.component';
import { InitialPageComponent } from './initial-page/initial-page.component';
import { UploadBookComponent } from './upload-book/upload-book.component';
import { SearchBookComponent } from './search-book/search-book.component';
import { ListBookComponent } from './list-book/list-book.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [

  {path: '', component: HomeComponent}, 
  {path: 'login', component: LoginComponent}, 
  {path: 'signin', component: SigninComponent}, 
  {path: 'initialPage', component: InitialPageComponent}, 
  {path: 'uploadBook', component: UploadBookComponent}, 
  {path: 'searchBook', component: SearchBookComponent}, 
  {path: 'listBook', component:ListBookComponent}, 
  {path: 'userProfile', component:UserProfileComponent}, 



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
