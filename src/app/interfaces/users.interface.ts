export interface NewsCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  email?: string;
  language_code?: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
  state: string;
  last_active?: string;
  newsCategories: NewsCategory[];
  isNewsActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteUsers {
  id: number;
  user_name: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  email: string;
  language_code?: string;
  screen?: string;
  state?: string;
  colorDepth?: string;
  javascriptEnabled?: string;
  site_url: string;
  site_name: string;
  user_submit_data: UserSubmitData;
  localTime?: string;
  last_active?: string;
  isNewsActive: boolean;
  created_at: string;
  updated_at: string;
  typeEventId?: string;
}

export interface UserSubmitData {
  email?: string;
  promocode?: string;
  email_user?: string;
  email_admin?: string;
  encrypted_code?: string;
  name_user?: string;
  id_1xbet?: string;
  id_FB?: string;
  id_IG?: string;
  id_TT?: string;
  id_TW?: string;
  id_YT?: string;
  screenshot_1?: string;
  screenshot_2?: string;
  screenshot_3?: string;
  screenshot_4?: string;
  screenshot_5?: string;
  screenshotFacebook?: string;
  screenshotInstagram?: string;
  userAnswer?: string;
  user_answer_1?: string;
  user_answer_2?: string;
  user_answer_3?: string;
  user_answer_4?: string;
  user_answer_5?: string;
  [key: string]: any;
}