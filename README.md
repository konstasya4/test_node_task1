# Inventory-Service и History-Service

## Описание

Проект включает два сервиса для управления товарами и историей действий:

1. **Inventory-Service**: управление остатками товаров.
2. **History-Service**: запись и получение истории действий с товарами.

Оба сервиса используют PostgreSQL для хранения данных и взаимодействуют через REST API.

---

## Возможности

### Inventory-Service
- **Создание товара**
- **Создание остатка**
- **Увеличение остатка**
- **Уменьшение остатка**
- **Получение остатков с фильтрами**:
  - PLU (артикул товара)
  - shop_id (идентификатор магазина)
  - Количество остатков на полке (диапазон)
  - Количество остатков в заказе (диапазон)
- **Получение товаров с фильтрами**:
  - name (название товара)
  - PLU (артикул товара)

### History-Service
- **Запись событий**, связанных с товарами и остатками.
- **Получение истории действий с фильтрами**:
  - shop_id
  - PLU
  - date (диапазон)
  - action
- **Поддержка постраничной навигации**

---

## Инструкция по развертыванию

### Шаг 1: Создание базы данных

1. Запустите контейнер с PostgreSQL:
   ```bash
   docker run --name inventory -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=inventory-db -d -p 5432:5432 postgres
   ```

2. Создание таблицы для **Inventory-Service**:
   ```sql
   CREATE TABLE inventory.products (
       id SERIAL PRIMARY KEY,
       plu VARCHAR(50) NOT NULL UNIQUE,
       name VARCHAR(255) NOT NULL
   );

   CREATE TABLE inventory.shops (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL
   );

   CREATE TABLE inventory.product_stocks (
       id SERIAL PRIMARY KEY,
       product_id INT NOT NULL REFERENCES inventory.products(id) ON DELETE CASCADE,
       shop_id INT NOT NULL REFERENCES inventory.shops(id) ON DELETE CASCADE,
       quantity_in_stock INT NOT NULL DEFAULT 0,
       quantity_in_order INT NOT NULL DEFAULT 0,
       UNIQUE (product_id, shop_id)
    );

   ```

3. Создайте таблицы для **History-Service**:
   ```sql
   CREATE TABLE history.actions (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    plu VARCHAR(50),
    shop_id INT,
    date TIMESTAMP DEFAULT NOW()
);
   );
   ```

---

### Шаг 2: Локальный запуск сервисов

1. Клонируйте репозиторий проекта:
   ```bash
   git clone https://github.com/<ваш-репозиторий>.git
   ```

2. Перейдите в папку каждого сервиса:
   ```bash
   cd inventory-service
   # или
   cd history-service
   ```

4. Запустите сервис:
   ```bash
   node index.js
   ```

---

## Примеры использования API

### Inventory-Service
1. **Создание товара**
   - Метод: `POST /products`
   - Пример тела запроса:
     ```json
     {
       "plu": "12345",
       "name": "Example Product"
     }
     ```

2. **Создание остатка**
   - Метод: `POST /stock`
   - Пример тела запроса:
     ```json
     {
       "product_id": 1,
       "shop_id": 101,
       "quantity_in_stock": 50,
       "quantity_in_order": 10
     }
     ```

3. **Получение остатков**
   - Метод: `GET /stock`
   - Пример параметров запроса:
     ```
     /stock?plu=12345&shop_id=101&stock_on_shelf_from=10&stock_on_shelf_to=100
     ```

### History-Service
1. **Получение истории действий**
   - Метод: `GET /history`
   - Пример параметров запроса:
     ```
     /history?shop_id=101&plu=12345&action=update&date_from=2024-01-01&date_to=2024-12-31&page=1&limit=10
     ```
