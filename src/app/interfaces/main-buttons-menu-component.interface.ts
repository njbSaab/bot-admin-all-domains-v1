export interface MenuTable {
    id: number;
    name: string;
    description: string;
    order: number;
    linked_post?: MenuPost;
    isActive: boolean;
    buttons?: MenuButton[];
    title_for_client?: string;
  }
  
  export interface MenuPost {
    id: number;
    post_title: string;
    post_content: string;
    post_image_url?: string;
    created_at: string;
    updated_at: string;
    title_for_client?: string;
  }
  
  export interface MenuButton {
    id: number;
    name: string;
    type: string;
    url?: string;
    order: number;
    created_at: string;
    updated_at: string;
    postId?: number;
    title_for_client?: string;

  }
  
  export interface MenuPostButton {
    id: number;
    post: MenuPost;
    button: MenuButton;
    title_for_client?: string;

  }