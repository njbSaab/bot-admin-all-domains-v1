import { MenuPost } from "./menu-post.interface";
import { MenuButton } from "./menu-button.interface";

export interface MenuTable {
    id: number;
    name: string;
    description?: string;
    order: number;
    parentId?: number;
    isActive: boolean;
    linked_post?: MenuPost;
    created_at: Date;
    updated_at: Date;
    buttons?: MenuButton[] ; // ✅ Добавляем кнопки к таблице
    isEditing? : boolean
    title_for_client?: string;
  }