  import { environment } from '../../../../../environments/environment';

  export const dataSportBackgrounds: { [key: string]: { imageBgDesk: string | null; imageBgMob: string | null } } = {
    'Basketball': {
      imageBgDesk: `${environment.auth.imageUrl}/images/image-1752486968349-962169144.jpg`,
      imageBgMob: `${environment.auth.imageUrl}/images/image-1752486986877-986415740.jpg`
    },
    'Volleyball': {
      imageBgDesk: `${environment.auth.imageUrl}/images/image-1752486909941-339741107.jpg`,
      imageBgMob: `${environment.auth.imageUrl}/images/image-1752486923642-810076218.jpg`
    },
    'Virtual Sport': {
      imageBgDesk: `${environment.auth.imageUrl}/images/image-1752487042224-108265948.jpg`,
      imageBgMob: `${environment.auth.imageUrl}/images/image-1752486977894-55142984.jpg'`    },
    'Ice Hockey': {
      imageBgDesk: `${environment.auth.imageUrl}/images/image-1752487029450-604109994.jpg`,
      imageBgMob: `${environment.auth.imageUrl}/images/image-1752487035350-689487540.jpg`
    },
    'Boxing': {
      imageBgDesk: `${environment.auth.imageUrl}/images/image-1752486997859-743414256.jpg`,
      imageBgMob: `${environment.auth.imageUrl}/images/image-1752486991296-459445824.jpg`
    },
    'Tennis': {
      imageBgDesk: `${environment.auth.imageUrl}/images/image-1752486899463-78497651.jpg`,
      imageBgMob: `${environment.auth.imageUrl}/images/image-1752486904894-686278754.jpg`
    },
    'Horse Racing': {
      imageBgDesk: `${environment.auth.imageUrl}/images/image-1752487019447-279554761.jpg`,
      imageBgMob: `${environment.auth.imageUrl}/images/image-1752486935871-735081635.jpg`
    },
    'Football': {
      imageBgDesk: `${environment.auth.imageUrl}/images/image-1750717647828-246428478.jpg`,
      imageBgMob: `${environment.auth.imageUrl}/images/image-1750717627254-753162484.jpg`
    },
    'Baseball': {
      imageBgDesk: `${environment.auth.imageUrl}/images/image-1752487005556-400888572.jpg`,
      imageBgMob: `${environment.auth.imageUrl}/images/image-1752487012576-520834519.jpg`,
    },
  };