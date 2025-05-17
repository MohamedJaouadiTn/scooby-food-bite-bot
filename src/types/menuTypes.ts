
export type Category = 'mlawi' | 'chapatti' | 'tacos' | 'extras' | 'drinks';

export type MenuItem = {
  id: string;
  name: string;
  englishName: string;
  price: number;
  category: Category;
  image: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras: ExtraItem[];
};

export type ExtraItem = {
  id: string;
  name: string;
  englishName: string;
  price: number;
  selected: boolean;
};

export type OrderFormData = {
  name: string;
  address: string;
  phone: string;
  allergies: string;
};
