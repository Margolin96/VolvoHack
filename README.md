# Возможности

## Управление двигателем
- Поможет прогреть машину перед поездкой
- Предупредит о невыключенном двигателе
### Уровень заряда / топлива
- Предупредит о нехватке топлива на долгую поездку
- Подскажет ближайшие заправки

## Управление центральным замком
- Всегда можете разблокировать / заблокировать машину, где бы вы не находились
- Заказывайте доставку в машину, откройте машину, если из нее нужно что-то забрать

## Климат-контроль
- Добавляйте управление климат-контролем в сценарии и машина всегда будет ждать вас с комфортной температурой внутри
### Температура за бортом
- Подскажет температуру снаружи автомобиля

## Управление фарами и сигналами
- Поможет найти машину звуковым сигналом и поморгав фарами

---

# Эндпоинты

## Умный дом Яндекс
![Alice](https://volvohack.herokuapp.com/static/alice.png)
| Метод | Ресурс | Описание |
|-|-|-|
|HEAD|`/alisa/v1.0`                    |Проверка доступности Endpoint URL провайдера|
|POST|`/alisa/v1.0/user/unlink`        |Оповещение о разъединении аккаунтов|
|GET |`/alisa/v1.0/user/devices`       |Информация об устройствах пользователя|
|POST|`/alisa/v1.0/user/devices/query` |Информация о состояниях устройств пользователя|
|POST|`/alisa/v1.0/user/devices/action`|Изменение состояния у устройств|

## Volvo API
| Метод | Ресурс | Описание |
|-|-|-|
|*|`/volvo/*`|Запросы проксируются к `https://api.volvocars.com/connected-vehicle/*`, либо мокируются взависимости от переменой окружения `mock`|

## Мокирование
*Изменение состояния автомобиля при использовании мокированных данных*
| Метод | Ресурс | Описание |
|-|-|-|
|GET|`/mock/addFuel`     |Добавить 3 литра топлива|
|GET|`/mock/subtractFuel`|Убрать 3 литра топлива|
|GET|`/mock/engineOn`    |Завести двигатель|
|GET|`/mock/engineOff`   |Заглушить двигатель|
|GET|`/mock/lockOn`      |Заблокировать замок|
|GET|`/mock/lockOff`     |Разблокировать замок|
|GET|`/mock/climateOn`   |Включить климат-контроль|
|GET|`/mock/climateOff`  |Выключить климат-контроль|
|GET|`/mock/doorOpen`    |Открыть дверь|
|GET|`/mock/doorClose`   |Закрыть дверь|
|GET|`/mock/windowOpen`  |Открыть окно|
|GET|`/mock/windowClose` |Закрыть окно|

---

# Сервер авторизации для умного дома Яндекса и интеграции в него Volvo Connected API

Следуя командам ниже можно задеплоить его на Heroku


## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/Margolin96/volvohack.git # or clone your own fork
$ cd volvohack
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
