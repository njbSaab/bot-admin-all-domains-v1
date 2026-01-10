import { MenuPostButton } from "./menu-post-button.interface";
import { MenuButton } from "./menu-button.interface";

export interface MenuPost {
    id: number;
    post_title?: string;
    post_content?: string;
    post_image_url?: string;
    created_at: Date;
    updated_at: Date;
    title_for_client?: string;
    parent_menu: {
      id: number
    };
    buttons?: MenuPostButton[];
    button: MenuButton;
    isEditing?: boolean;  

  }
