export interface EventsSites {
  id: number;
  typeEventId?: string;
  name: string;
  type: string;
  createdAt?: string;
  endAt?: string;
  memberA: string;
  memberB: string;
  imageMemberA?: string | null;
  imageMemberB?: string | null;
  imageBgDesk?: string | null;
  imageBgMob?: string | null;
  grandPrize?: string | null;
  everyoneForPrize?: string | null;
  landing_url?: string;
  result?: number | null;
  status: 'active' | 'inactive' | 'ended';
  isEditing?: boolean;
  user_submit_data?: {
    email?: string;
    selected_option?: string;
  };
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface EventsSitesStatistics {
  totalUsers: number;
  percentages: {
    option1: number;
    option2: number;
    option3: number;
  };
}

export interface EventsLandings {
  id: number;
  name: string;
  url: string;
  createdAt: string;
  status: string;
}