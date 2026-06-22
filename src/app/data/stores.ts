export interface Store {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
  hours: string;
  distance?: string;
  rating: number;
  type: 'completa' | 'reduzida';
  channels: Array<'app' | 'totem' | 'balcao' | 'pickup'>;
  hasFullKitchen: boolean;
  allowsDelivery: boolean;
  allowsPickup: boolean;
  allowsDineIn: boolean;
  isOpen: boolean;
  waitTime: string;
  unavailableCategories?: string[];
}

export type OrderChannel = 'delivery' | 'pickup' | 'dine-in';

export const stores: Store[] = [
  {
    id: 'rcf-01',
    name: 'Unidade Boa Vista',
    address: 'Rua da Aurora, 540',
    neighborhood: 'Boa Vista',
    city: 'Recife',
    state: 'PE',
    phone: '(81) 3322-1100',
    hours: 'Seg–Sex 6h–22h · Sáb–Dom 7h–23h',
    distance: '1,2 km',
    rating: 4.8,
    type: 'completa',
    channels: ['app', 'totem', 'balcao', 'pickup'],
    hasFullKitchen: true,
    allowsDelivery: true,
    allowsPickup: true,
    allowsDineIn: true,
    isOpen: true,
    waitTime: '20–30 min',
  },
  {
    id: 'rcf-02',
    name: 'Unidade Boa Viagem',
    address: 'Av. Boa Viagem, 2200',
    neighborhood: 'Boa Viagem',
    city: 'Recife',
    state: 'PE',
    phone: '(81) 3322-2200',
    hours: 'Seg–Dom 6h–23h',
    distance: '3,5 km',
    rating: 4.7,
    type: 'completa',
    channels: ['app', 'totem', 'balcao', 'pickup'],
    hasFullKitchen: true,
    allowsDelivery: true,
    allowsPickup: true,
    allowsDineIn: true,
    isOpen: true,
    waitTime: '25–35 min',
  },
  {
    id: 'for-01',
    name: 'Unidade Meireles',
    address: 'Av. Beira Mar, 1500',
    neighborhood: 'Meireles',
    city: 'Fortaleza',
    state: 'CE',
    phone: '(85) 3399-0100',
    hours: 'Seg–Dom 6h–22h',
    distance: '–',
    rating: 4.6,
    type: 'completa',
    channels: ['app', 'balcao', 'pickup'],
    hasFullKitchen: true,
    allowsDelivery: true,
    allowsPickup: true,
    allowsDineIn: true,
    isOpen: true,
    waitTime: '20–30 min',
  },
  {
    id: 'ssa-01',
    name: 'Unidade Pelourinho',
    address: 'Largo do Pelourinho, 30',
    neighborhood: 'Pelourinho',
    city: 'Salvador',
    state: 'BA',
    phone: '(71) 3388-0200',
    hours: 'Seg–Dom 7h–22h',
    distance: '–',
    rating: 4.5,
    type: 'reduzida',
    channels: ['app', 'balcao', 'pickup'],
    hasFullKitchen: false,
    allowsDelivery: false,
    allowsPickup: true,
    allowsDineIn: true,
    isOpen: true,
    waitTime: '15–20 min',
    unavailableCategories: ['moqueca', 'sopas'],
  },
  {
    id: 'nat-01',
    name: 'Unidade Ponta Negra',
    address: 'Av. Eng. Roberto Freire, 800',
    neighborhood: 'Ponta Negra',
    city: 'Natal',
    state: 'RN',
    phone: '(84) 3355-0300',
    hours: 'Seg–Sex 6h–21h · Sáb–Dom 7h–22h',
    distance: '–',
    rating: 4.7,
    type: 'completa',
    channels: ['app', 'totem', 'balcao', 'pickup'],
    hasFullKitchen: true,
    allowsDelivery: true,
    allowsPickup: true,
    allowsDineIn: true,
    isOpen: false,
    waitTime: 'Fechado',
  },
];
