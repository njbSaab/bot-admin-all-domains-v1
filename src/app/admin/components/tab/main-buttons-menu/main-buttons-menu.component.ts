import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuTable, MenuPost, MenuButton, MenuPostButton } from '../../../../interfaces/main-buttons-menu-component.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-main-buttons-menu',
  templateUrl: './main-buttons-menu.component.html',
  styleUrls: ['./main-buttons-menu.component.scss']
})
export class MainButtonsMenuComponent implements OnInit {
  menuTables: MenuTable[] = [];
  menuPosts: MenuPost[] = [];
  menuButtons: MenuButton[] = [];
  menuPostButtons: MenuPostButton[] = [];
  subMenuPosts: MenuPost[] = [];
  baseUrl = environment.auth.baseUrl

  indexSubMenuPosts: number | null = null;
  selectedPostId: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  activeIndex: number | null = null;
  isEditing: boolean = false;
  isActive: boolean = false;
  activeIndexes: Set<number> = new Set();

  structuredData: any[] = [];
  combinedArray: any[] = []; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
    // Комбинируем кнопки и посты
    // this.loadButtons();
  }
  // async loadButtons(): Promise<void> {
  //   try {
  //     const apiUrl = 'http://localhost:3101/api/menu/buttons'; // Исправленный URL
  //     const buttons = await this.http.get<MenuButton[]>(apiUrl).toPromise().then(res => res || []);
  //     this.menuButtons = buttons;
  //     console.log('✅ Загружены данные menuButtons:', this.menuButtons);
      
  //   } catch (error) {
  //     console.error('Ошибка при загрузке данных:', error);
  //   } 
  // }

  async loadData(): Promise<void> {
    try {
      // const apiUrl = 'http://localhost:3101/api/'; // Используем правильный API URL http://194.36.179.168:3101/api/

      const apiUrl = `${this.baseUrl}/api/`; // Используем правильный API URL http://194.36.179.168:3101/api/

      const [tables, posts, buttons, postButtons] = await Promise.all([
        this.http.get<MenuTable[]>(`${apiUrl}menu/tables`).toPromise().then(res => res || []),
        this.http.get<MenuPost[]>(`${apiUrl}menu/posts`).toPromise().then(res => res || []),
        this.http.get<MenuButton[]>(`${apiUrl}menu-buttons-inline`).toPromise().then(res => res || []),
        this.http.get<MenuPostButton[]>(`${apiUrl}post-buttons/`).toPromise().then(res => res || [])
      ]);
    // Пример данных для table и subMenuPosts

      this.menuTables = tables;
      this.menuPosts = posts;
      this.menuButtons = buttons;
      this.menuPostButtons = postButtons;
      console.log('✅ Загружены данные:',"menuTables:", this.menuTables,"menuPosts:", this.menuPosts, "menuButtons:", this.menuButtons, 'menuPostButtons:',this.menuPostButtons);

      this.structureData();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }

  structureData(): void {
    this.structuredData = this.menuTables.map(table => {
      const linked_post = this.menuPosts.find(post => post.id === table.linked_post?.id) || {};
      const buttons = this.menuPostButtons
        .filter(pb => pb.post.id === table.linked_post?.id)
        .map(pb => pb.button);
  
      return {
        ...table,
        linked_post,
        buttons
      };
    });
  
    console.log('Structured Data:', this.structuredData);
  }
   
// Функция для загрузки постов
async getButtonById(btnId: number) {
  console.log("Загружаем посты для кнопки с id:", btnId);
  const button = this.menuButtons.find(b => b.id === btnId);
  this.indexSubMenuPosts = btnId; // Сохраняем ID кнопки как индекс для фильтрации

  if (!button) {
    console.warn("Кнопка не найдена!");
    return;
  }

  if (!button.postId) {
    console.warn("У кнопки нет postId!");
    return;
  }

  const existingPost = this.subMenuPosts.find(post => post.id === button.postId);
  if (existingPost) {
    console.log("Пост уже загружен:", existingPost);
    return;
  }

  try {
    // http://194.36.179.168:3101/api/
    // const post = await this.http.get<MenuPost>(`http://localhost:3101/api/posts/${button.postId}`).toPromise();

    const post = await this.http.get<MenuPost>(`${this.baseUrl}/api/posts/${button.postId}`).toPromise();
    if (post) {
      console.log("Загружен пост:", post);
      this.subMenuPosts.push(post);
    } else {
      console.warn("Пост не найден!");
    }
  } catch (error) {
    console.error("Ошибка загрузки поста:", error);
  }
}


combineButtonsAndPosts(buttons: any[], posts: any[]): any[] {
  const combined = [];
  let maxLength = Math.max(buttons.length, posts.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (buttons[i]) {
      combined.push({ type: 'button', data: buttons[i] });
    }
    if (posts[i]) {
      combined.push({ type: 'post', data: posts[i] });
    }
  }
  return combined;
}

  saveChanges(): void {
    // Сохранение изменений
  }

  cancelEdit(): void {
    // Отмена редактирования
  }

  toggleEdit(): void {
    // Переключение режима редактирования
    
  }

  toggleClick(index: number): void {
    if (this.activeIndexes.has(index)) {
      this.activeIndexes.delete(index);
    } else {
      this.activeIndexes.add(index);
    }
    console.log(this.activeIndexes);
  }
  
  selectButton(postId: number) {
    this.selectedPostId = postId;
    this.getButtonById(postId);  // Загружаем посты для выбранной кнопки
  }

}
