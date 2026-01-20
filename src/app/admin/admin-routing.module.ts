import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component'; // Компонент админки
import { AddButtonComponent } from './pages/add-button/add-button.component';
import { PushComponent } from './pages/push/push.component';
import { UsersComponent } from './pages/users/users.component';
import { ImagesComponent } from './pages/images/images.component';
import { EmailSentComponent } from './pages/email-sent/email-sent.component';
import { SiteUsersComponent } from './pages/site-users/site-users.component';
import { TutorialsComponent } from './pages/tutorials/tutorials.component';
import { EventsSitesComponent } from './pages/events-sites/events-sites.component';
import { QuizComponent } from './pages/quiz/quiz.component'

const routes: Routes = [
  { path: '', component: AdminPageComponent },
  { path: 'add-button', component: AddButtonComponent },
  { path: 'push', component: PushComponent },
  { path: 'images', component: ImagesComponent },
  { path: 'users', component: UsersComponent },
  { path: 'site-users', component: SiteUsersComponent },
  { path: 'email-sent', component: EmailSentComponent },
  { path: 'events', component: EventsSitesComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'tutorials', component: TutorialsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
