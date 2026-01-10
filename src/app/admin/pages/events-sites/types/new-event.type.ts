// new-event.type.ts
import { EventsSites } from '../interfaces/events-sites.interface';

export type NewEvent = Pick<EventsSites, 
  'name' | 'type' | 'endAt' | 'memberA' | 'memberB' |
  'imageMemberA' | 'imageMemberB' | 'imageBgDesk' | 'imageBgMob' |
  'grandPrize' | 'everyoneForPrize' | 'landing_url' | 'status' | 'result'
> & {
  // Можно добавить поля только для формы, если нужно
};

export const defaultNewEvent = (landingUrl: string = ''): NewEvent => ({
  name: '',
  type: '',
  endAt: '',
  memberA: '',
  memberB: '',
  imageMemberA: null,
  imageMemberB: null,
  imageBgDesk: null,
  imageBgMob: null,
  grandPrize: null,
  everyoneForPrize: null,
  landing_url: landingUrl,
  status: 'active',
  result: null,
});