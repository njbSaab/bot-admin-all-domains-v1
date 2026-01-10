import { MenuPostButton } from "./menu-post-button.interface";

export interface MenuButton {
    id: number;
    name: string;
    type: 'keyboard' | 'inline';
    url?: string;
    order: number;
    created_at: Date;
    updated_at: Date;
    postId?: number;
    buttons?: MenuPostButton[];
    title_for_client?: string; 
  }