import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PanelComponent } from './components/panel/panel.component';
import { UsersMenuComponent } from './components/users-menu/users-menu.component';
import { RouterModule } from '@angular/router';
import { EditIconComponent } from './components/ui/edit-icon/edit-icon.component';
import { FilterByParentIdPipe } from './pipes/filter-by-parent-id.pipe';
import { FilterByParentMenuIdPipe } from './pipes/filter-by-parent-menu-id.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { FilterBySiteNamePipe } from './pipes/filter-by-site-name.pipe';
import { SortNewsPipe } from './pipes/news-sort.pipe';
import { LoadingComponent } from './components/ui/loading/loading.component';
import { ObjectValuesPipe } from './pipes/object-values.pipe';



@NgModule({
  declarations: [
    SidebarComponent, 
    PanelComponent, 
    UsersMenuComponent, 
    EditIconComponent, 
    FilterByParentIdPipe, 
    FilterByParentMenuIdPipe ,
    DateFormatPipe, 
    SortPipe, 
    FilterBySiteNamePipe, 
    SortNewsPipe, 
    LoadingComponent,
    ObjectValuesPipe
  ],

  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    SidebarComponent,
    EditIconComponent, 
    FilterByParentIdPipe, 
    FilterByParentMenuIdPipe, 
    DateFormatPipe, 
    SortPipe, 
    FilterBySiteNamePipe,
    SortNewsPipe,
    LoadingComponent,
    ObjectValuesPipe
  ]
})
export class SharedModule { }
