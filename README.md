# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Карточка

```
interface ICard {
	id: number;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```

Тип для определения способа оплаты

```
type TPaymentMethod = 'cash' | 'card';
```

Заказ

```
interface IOrder {
	payment: TPaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
```

Данные для отображения корзины

```
interface IBasket {
	items: string[];
	total: number;
}
```

Основные данные заказа

```
type TOrderInfo = Pick<
	IOrder,
	'payment' | 'email' | 'phone' | 'address'
>;
```

Данные для форм оформления заказа. Отделение адресных данных и контактных

```
type TOrderAddress = Pick<IOrder, 'payment' | 'address'>;

type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;
```

Тип, описывающий ошибки валидации форм
```
type FormErrors = Partial<Record<keyof TOrderInfo, string>>;
```

Интерфейс для отображения успешного оформления заказа
```
interface ISuccessOrder {
	id: string;
	total: number;
}
```
## Архитектура приложения

В данном проекте используется паттерн MVP. Код разделен на слои:

- Слой представления (View)
Этот слой отвечает за отображение данных и обработку пользовательского ввода, но не содержит бизнес-логики.
К нему относятся Basket.ts, Form.ts, Modal.ts, Success.ts, Card.ts, Page.ts.
Все эти файлы представляют собой классы, расширяющие UIComponent.

- Слой модели (Model)
Этот слой управляет бизнес-логикой, состоянием приложения и данными.
  К нему относятся api.ts, AppData.ts, WebLarekApi.ts.
Эти файлы отвечают за работу с данными и API.
- Слой презентера (Presenter)
Этот слой управляет логикой отображения и взаимодействием между View и Model.
  К нему относятся events.ts, Component.ts, UIComponent.ts,ContactsForm.ts, OrderForm.ts.
Эти файлы содержат обработчики событий и связывают View и Model.

### Описание базовых классов

#### Класс Api
Класс Api предназначен для взаимодействия с сервером через HTTP-запросы. Он упрощает отправку запросов и обработку ответов, абстрагируя детали работы с fetch.

Класс имеет следующие особенности:

- Базовый URL: В конструктор передается базовый URL сервера, к которому будут добавляться эндпоинты.
- Настройки запроса: В конструкторе также задаются общие настройки для всех запросов, включая заголовки. 

Методы работы с API:
- get(uri: string): выполняет GET-запрос к заданному URI.
- post(uri: string, data: object, method: ApiPostMethods = 'POST'): отправляет данные на сервер, поддерживает методы POST, PUT и DELETE.
- handleResponse(response: Response): обрабатывает ответы сервера, парсит JSON и выбрасывает ошибки, если ответ содержит ошибку.

Этот класс удобен тем, что скрывает низкоуровневые детали HTTP-запросов, обеспечивая единый интерфейс для общения с сервером.


#### Класс EventEmitter
   Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
   о наступлении события.
   Класс имеет методы on ,  off ,  emit  — для подписки на событие, отписки от события и уведомления
   подписчиков о наступлении события соответственно.
   Дополнительно реализованы методы  onAll и  offAll  — для подписки на все события и сброса всех
   подписчиков.
   Интересным дополнением является метод  trigger , генерирующий заданное событие с заданными
   аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
   классы будут генерировать события, не будучи при этом напрямую зависимыми от
   класса  EventEmitter.

#### Класс Component
Component — это базовый класс для всех визуальных компонентов. Он управляет DOM-элементами и предоставляет универсальные методы для работы с ними. Каждый компонент привязан к своему корневому HTMLElement, который передается в конструктор.

Методы:

- toggleClass() – добавляет или удаляет класс у элемента.
- setText() – устанавливает текст внутри элемента.
- setDisabled() – включает или выключает disabled у элемента.
- setHidden() – скрывает элемент (display: none).
- setVisible() – показывает скрытый элемент.
- setImage() – устанавливает src и alt для изображений.
- render() – обновляет данные компонента (T) и возвращает корневой элемент.

Этот класс используется как база для всех компонентов интерфейса.

#### Класс UIComponent
Класс UIComponent реализует слой представления (View). Это обобщённый класс, который расширяет Component и предоставляет интерфейс для работы с UI-элементами. Он включает механизм событий через интерфейс IEvents.container: 
- HTMLElement — HTML-элемент, который является контейнером для данного UI-компонента.
- events: IEvents (protected, readonly) — механизм обработки событий, который может быть использован в потомках.

### Общие компоненты

#### Класс Basket
Basket — это UI-компонент, представляющий корзину товаров. Он позволяет отображать список товаров, общую сумму и кнопку оформления заказа. Наследуется от UIComponent, что делает его частью слоя представления.
Статическое свойство template загружает HTML-шаблон корзины из DOM.
Защищённые свойства
- _list - Список товаров
- _total - Общая сумма
- _button - Кнопка "Оформить заказ"

Методы
- toggleButton -Активирует или отключает кнопку оформления заказа.
- set items - Обновляет список товаров в корзине. Если корзина пуста, отображает сообщение.
- set total - Устанавливает общую сумму заказа.

#### Класс Form
Form — это универсальный UI-компонент формы, который управляет вводом данных, проверкой валидности и отображением ошибок.
Наследуется от UIComponent, что делает его частью представления.
Защищённые свойства
- _submit - Кнопка "Отправить"
- _errors - Элемент для отображения ошибок
- 
Методы
- onInputChange - Отправляет событие об изменении значения в поле формы.
- set valid - Включает/отключает кнопку отправки в зависимости от валидности формы.
- set errors - Отображает сообщения об ошибках.
- render - Обновляет состояние формы, включая её валидность и ошибки.

#### Класс Modal
Modal — это UI-компонент, представляющий модальное окно. Он управляет его отображением, скрытием и содержимым. Использует интерфейс IModalData, который определяет content (содержимое модального окна).

Защищённые свойства
- _closeButton - Кнопка закрытия
- _content - Контейнер для содержимого

Методы
- set content - Устанавливает содержимое модального окна.
- open() - Открывает модальное окно и отправляет событие modal:open.
- close() - Закрывает модальное окно, очищает его содержимое и отправляет событие modal:close.
- render - Отображает модальное окно с переданными данными.

Обработчики событий

Клик по кнопке закрытия (_closeButton) вызывает close().
Клик по фону модального окна (container) также вызывает close().
Клик внутри содержимого (_content) не закрывает окно (event.stopPropagation()).

#### Класс Success
Success — это UI-компонент, отображающий сообщение об успешном заказе. Он показывает сумму списанных "синапсов" и предоставляет кнопку закрытия. Использует интерфейс ISuccess, который содержит total (списанная сумма).
actions: ISuccessActions — объект с колбэком onClick для закрытия окна.

Защищённые свойства
- _close - Кнопка закрытия
- _total - Текст с информацией о списанной сумме

Методы
- set total - Устанавливает сумму списанных синапсов.

Клик по кнопке закрытия (_close) вызывает actions.onClick().

### Остальные классы

<details>
    <summary><strong>Класс AppData</strong></summary>
    <p>A well-structured product to create a world-class knowledge base for your customers and employees. Content producers get the power, whereas content consumers get the simplicity.</p>
    <h4>Core parts</h4>
    <ul>
        <li>Knowledge base portal</li>
        <li>Knowledge base site</li>
        <li>Knowledge base widget</li>
        <li>API documentation</li>
    </ul>
</details>
<details>
    <summary><strong>Класс Card</strong></summary>
    <p>A well-structured product to create a world-class knowledge base for your customers and employees. Content producers get the power, whereas content consumers get the simplicity.</p>
    <h4>Core parts</h4>
    <ul>
        <li>Knowledge base portal</li>
        <li>Knowledge base site</li>
        <li>Knowledge base widget</li>
        <li>API documentation</li>
    </ul>
</details>
<details>
    <summary><strong>Класс ContactsForm</strong></summary>
    <p>A well-structured product to create a world-class knowledge base for your customers and employees. Content producers get the power, whereas content consumers get the simplicity.</p>
    <h4>Core parts</h4>
    <ul>
        <li>Knowledge base portal</li>
        <li>Knowledge base site</li>
        <li>Knowledge base widget</li>
        <li>API documentation</li>
    </ul>
</details>
<details>
    <summary><strong>Класс OrderForm</strong></summary>
    <p>A well-structured product to create a world-class knowledge base for your customers and employees. Content producers get the power, whereas content consumers get the simplicity.</p>
    <h4>Core parts</h4>
    <ul>
        <li>Knowledge base portal</li>
        <li>Knowledge base site</li>
        <li>Knowledge base widget</li>
        <li>API documentation</li>
    </ul>
</details>
<details>
    <summary><strong>Класс Page</strong></summary>
    <p>A well-structured product to create a world-class knowledge base for your customers and employees. Content producers get the power, whereas content consumers get the simplicity.</p>
    <h4>Core parts</h4>
    <ul>
        <li>Knowledge base portal</li>
        <li>Knowledge base site</li>
        <li>Knowledge base widget</li>
        <li>API documentation</li>
    </ul>
</details>

<details>
    <summary><strong>Класс WebLarekAPI</strong></summary>
    <p>Отвечает за взаимодействие с API интернет-магазина. Он предоставляет методы для получения списка товаров, информации о конкретном товаре и оформления заказа.</p>
    <h4>Методы</h4>
    <ul>
        <li><b>getProductList()</b>
Получает список всех товаров.
Отправляет GET-запрос на /product.
Возвращает массив объектов ICard, дополняя их полем image с корректным URL изображения.</li>
        <li><b>getProduct(id: string)</b>
Получает информацию о конкретном товаре по его id.
Отправляет GET-запрос на /product/{id}.
Возвращает объект ICard, добавляя корректный URL изображения.</li>
        <li><b>createOrder(order: IOrder)</b>
Создаёт заказ на основе переданных данных.
Отправляет POST-запрос на /order с телом order.
Возвращает ISuccessOrder, содержащий информацию о сформированном заказе.</li>
    </ul>
</details>




