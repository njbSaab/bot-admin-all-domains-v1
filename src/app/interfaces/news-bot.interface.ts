export interface NewsCategory {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;

}

export interface NewsBot {
  id: number;
  post_title: string;
  post_content: string;
  post_image_url: string;
  btn_title: string;
  news_url: string;
  created_at: string | Date;
  updated_at: string | Date;
  isActive: boolean;
  category: { id: number; name: string } | null;
  isEditing?: boolean; // Добавляем для режима редактирования
}