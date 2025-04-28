// types.ts
export type ItemType = 'wallet' | 'key' | 'phone' | 'bag';

export interface Comment {
  id: number;
  user: string;
  text: string;
  date: string;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  type: ItemType;
  comments?: Comment[];
}