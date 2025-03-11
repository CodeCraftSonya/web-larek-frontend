import { ICard, IOrder, ISuccessOrder } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IWebLarekAPI {
	getProductList: () => Promise<ICard[]>;
	getProduct: (id: string) => Promise<ICard>;
	createOrder: (order: IOrder) => Promise<ISuccessOrder>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProduct(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	createOrder(order: IOrder): Promise<ISuccessOrder> {
		return this.post('/order', order).then((data: ISuccessOrder) => data);
	}
}
