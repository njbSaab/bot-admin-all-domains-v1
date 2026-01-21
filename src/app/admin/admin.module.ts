import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { AddButtonComponent } from './pages/add-button/add-button.component';
import { GreetingBotComponent } from './components/tab/greeting-bot/greeting-bot.component';
import { PopupEditComponent } from './components/ui/popup-edit/popup-edit.component';
import { PostsBotComponent } from './components/tab/posts-bot/posts-bot.component';
import { MenuButtonsComponent } from './components/tab/menu-buttons/menu-buttons.component';
import { InlineButtonsComponent } from './components/ui/inline-buttons/inline-buttons.component';
import { EditBtnMainComponent } from './components/ui/edit-btn-main/edit-btn-main.component';
import { EditBtnIconComponent } from './components/ui/edit-btn-icon/edit-btn-icon.component';
import { MainButtonsMenuComponent } from './components/tab/main-buttons-menu/main-buttons-menu.component';
import { NewsBotComponent } from './components/tab/news-bot/news-bot.component';
import { PushComponent } from './pages/push/push.component';
import { UsersComponent } from './pages/users/users.component';
import { NewsCategoryComponent } from './components/tab/news-category/news-category.component';
import { ImagesComponent } from './pages/images/images.component';
import { ImageUploadComponent } from './pages/images/image-upload/image-upload.component';
import { ImagesTableComponent } from './pages/images/images-table/images-table.component';
import { EmailSentComponent } from './pages/email-sent/email-sent.component';
import { EmailsTableComponent } from './pages/email-sent/emails-table/emails-table.component';
import { SiteUsersComponent } from './pages/site-users/site-users.component';
import { TutorialsComponent } from './pages/tutorials/tutorials.component';
import { EmailTemplateEditorComponent } from './pages/email-sent/email-template-editor/email-template-editor.component';
import { EventsSitesComponent } from './pages/events-sites/events-sites.component';
import { EventEmailPushComponent } from './pages/events-sites/components/event-email-push/event-email-push.component';
import { EventEditComponent } from './pages/events-sites/components/event-edit/event-edit.component';
import { EventViewComponent } from './pages/events-sites/components/event-view/event-view.component';
import { EventCreateComponent } from './pages/events-sites/components/event-create/event-create.component';
import { CountdownTimerComponent } from './pages/events-sites/components/app-countdown-timer/app-countdown-timer.component';
import { UsersTableComponent } from './pages/email-sent/components/users-table/users-table.component';
import { SendModeTabsComponent } from './pages/email-sent/components/send-mode-tabs/send-mode-tabs.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { QuizPreviewComponent } from './pages/quiz/quiz-preview/quiz-preview.component';
import { QuizFormComponent } from './pages/quiz/ui/quiz-form/quiz-form.component';
import { ViewPageComponent } from './pages/quiz/ui/quiz-form/view-page/view-page.component';
import { EmailTemplatePreviewComponent } from './pages/quiz/ui/email-template-preview/email-template-preview.component';
import { EmailEditorContainerComponent } from './pages/quiz/ui/email-editor-container/email-editor-container.component';
import { QuizEmailTemplateEditorComponent } from './pages/quiz/ui/email-template-editor/email-template-editor.component';
import { ChainEmailEditorComponent } from './pages/quiz/ui/chain-email-editor/chain-email-editor.component';

@NgModule({
  declarations: [
    AdminPageComponent,
    AddButtonComponent, 
    GreetingBotComponent, 
    PopupEditComponent, 
    PostsBotComponent, 
    MenuButtonsComponent, 
    InlineButtonsComponent, 
    EditBtnMainComponent, 
    EditBtnIconComponent, 
    MainButtonsMenuComponent, 
    NewsBotComponent, 
    PushComponent, 
    UsersComponent, 
    NewsCategoryComponent, 
    ImagesComponent, 
    ImageUploadComponent, 
    ImagesTableComponent, 
    EmailSentComponent, 
    EmailsTableComponent, 
    SiteUsersComponent, 
    TutorialsComponent, 
    EmailTemplateEditorComponent, 
    EventsSitesComponent, 
    EventEmailPushComponent, 
    EventEditComponent, 
    EventViewComponent, 
    EventCreateComponent, 
    CountdownTimerComponent,
    UsersTableComponent,
    SendModeTabsComponent,
    QuizComponent,
    QuizPreviewComponent,
    QuizFormComponent,
    ViewPageComponent,
    EmailTemplatePreviewComponent,
    EmailEditorContainerComponent,
    QuizEmailTemplateEditorComponent,
    ChainEmailEditorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    FormsModule,
  ],
  exports: [
    AdminPageComponent
  ]
})
export class AdminModule {}
