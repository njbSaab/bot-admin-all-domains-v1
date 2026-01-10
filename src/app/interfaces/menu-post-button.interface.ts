import { MenuButton } from "./menu-button.interface";
import { MenuPost } from "./menu-post.interface";

export interface MenuPostButton {
    id: number;
    post: MenuPost;
    button: MenuButton;
    title_for_client?: string;

  }