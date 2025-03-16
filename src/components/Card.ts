import { Component } from './base/Component';
import { ICard } from '../types';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLImageElement>('.card__price', container);
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__description');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: string) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this.setDisabled(this._button, !value);
		}
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set category(value: string) {
		if (!this._category) return;
		this._category.className = 'card__category';
		this.setText(this._category, value);

		const categoryClasses: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			другое: 'other',
			дополнительное: 'additional',
			кнопка: 'button',
		};

		const categoryClass = categoryClasses[value.toLowerCase()] || 'other';
		this.toggleClass(this._category, `card__category_${categoryClass}`, true);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}
