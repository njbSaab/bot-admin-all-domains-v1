export interface GreetingBot {
    id: number;
    greeting_text: string;
    image_url?: string;
    created_at: Date;
    updated_at: Date;
    title_for_client?: string;
  }