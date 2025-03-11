export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export type TPaymentMethod = 'cash' | 'card';

export interface IOrder {
	payment: TPaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface ICardList {
	items: ICard[];
}

export type TBasketList = Omit<IOrder, 'items' | 'total'>;

export type TOrderAddress = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface ISuccessOrder {
	id: string;
	total: number;
}

export interface IBasket {
	items: string[];
	total: number;
}
