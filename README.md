Понял вас. Вот полный текст для `README.md`, который вы можете скопировать и вставить в ваш репозиторий на GitHub:

```markdown
# UralProHelperJS

`UralProHelperJS` — это библиотека для работы с SDK Яндекса и локальными данными. Она предоставляет удобные методы для инициализации, управления данными, работы с рекламой и лидербордами.

## Установка и настройка

### Подключение библиотеки

Подключите библиотеку в вашем HTML-файле:

```html
<script src="uralpro-helper-0.08-min.js"></script>
```

### Создание экземпляра библиотеки

Создайте экземпляр библиотеки с настройками по умолчанию:

```javascript
const defaultData = [
    ['name', 'Pavel'],
    ['2', 'test'],
    [3232411, "232445445text"],
    ["testArray", [34, 454, 54532, 344, [1, 2, 3, 4], 0, true, 0, "text"]],
];

const uralprojs = new UralProHelperJS({
    enableLogging: true, // Включение логов в консоль
    saveIdArray: defaultData // Массив данных по умолчанию
});
```

## Основные методы

### Инициализация

Проверка готовности SDK:

```javascript
uralprojs.onSdkReady(() => {
    uralprojs.uralpro.log("SDK готово! Выполняем запуск игры.");
    // Установка готовности игры
    uralprojs.setGameReady();
});
```

### Работа с данными

#### Установка данных

```javascript
uralprojs.setData('name', "Kseniya");
```

#### Получение данных

```javascript
const value = uralprojs.getData('name');
```

#### Установка значений по умолчанию

```javascript
uralprojs.defsetData('name');
```

### Работа с рекламой

#### Показ полноэкранной рекламы

```javascript
uralprojs.ad.showFullscreenAdv({
    onOpen: () => {
        uralprojs.uralpro.log("Реклама открыта.");
    },
    onClose: () => {
        uralprojs.uralpro.log("Реклама была закрыта.");
    },
    onError: (error) => {
        uralprojs.uralpro.error("Ошибка рекламы:", error);
    }
});
```

#### Показ вознаграждаемой рекламы

```javascript
uralprojs.ad.showRewardedVideo({
    onOpen: () => {
        uralprojs.uralpro.log("Вознаграждаемая реклама открыта.");
    },
    onRewarded: () => {
        uralprojs.uralpro.log("Пользователь получил награду!");
    },
    onClose: () => {
        uralprojs.uralpro.log("Вознаграждаемая реклама закрыта.");
    },
    onError: (error) => {
        uralprojs.uralpro.error("Ошибка вознаграждаемой рекламы:", error);
    }
});
```

### Работа с лидербордами

#### Инициализация лидерборда

```javascript
uralprojs.lb.initializeLeaderboard('leaderboardName');
```

#### Получение описания лидерборда

```javascript
uralprojs.lb.getLeaderboardDescription('leaderboardName');
```

#### Установка результата в лидерборде

```javascript
uralprojs.lb.setLeaderboardScore('leaderboardName', score, extraData);
```

#### Получение рейтинга текущего пользователя

```javascript
uralprojs.lb.getLeaderboardPlayerEntry('leaderboardName');
```

#### Получение записей лидерборда

```javascript
uralprojs.lb.getLeaderboardEntries('leaderboardName', options);
```

#### Отображение таблицы лидеров

```javascript
uralprojs.lb.showLeaderboard('leaderboardName');
```

#### Отображение топ игроков

```javascript
uralprojs.lb.showTopLeaderboard('leaderboardName');
```

### Управление видимостью документа

#### Установка обработчиков видимости

```javascript
uralprojs.documentVisibility({
    onHidden: () => {
        uralprojs.uralpro.log("Страница стала скрытой!");
    },
    onVisible: () => {
        uralprojs.uralpro.log("Страница снова видима!");
    },
});
```

### Дополнительные методы

#### Запрос оценки игры

```javascript
uralprojs.requestReview();
```

#### Начало игры

```javascript
uralprojs.gameStart();
```

#### Остановка игры

```javascript
uralprojs.gameStop();
```

## Пример использования

```html
<script src="uralpro-helper-0.08-min.js"></script>
<script>
    // значения по умолчанию
    const defaultData = [
        ['name', 'Pavel'],
        ['2', 'test'],
        [3232411, "232445445text"],
        ["testArray", [34, 454, 54532, 344, [1, 2, 3, 4], 0, true, 0, "text"]],
    ];

    // Создание экземпляра библиотеки
    const uralprojs = new UralProHelperJS({
        enableLogging: true, // Вывод логов в консоль
        saveIdArray: defaultData // Массив в формате [ключ, значение]
    });

    // Проверка готовности
    uralprojs.onSdkReady(() => {
        uralprojs.uralpro.log("SDK готово! Выполняем запуск игры.");
        // Установка готовности игры
        uralprojs.setGameReady();

        // Работа с сохранениями
        uralprojs.uralpro.log("Сохраненное значение в name:", uralprojs.getData('name'));

        uralprojs.uralpro.log("Устанавливаем новое значение в name:", "Kseniya");
        uralprojs.setData('name', "Kseniya");
        uralprojs.uralpro.log("Новое сохраненное значение в name:", uralprojs.getData('name'));

        uralprojs.uralpro.log("Восстанавливаем значение в name");
        uralprojs.defsetData('name');
        uralprojs.uralpro.log("Восстановленное значение в name:", uralprojs.getData('name'));

        // Пауза в игре
        uralprojs.documentVisibility({
            onHidden: () => {
                uralprojs.uralpro.log("Страница стала скрытой!");
            },
            onVisible: () => {
                uralprojs.uralpro.log("Страница снова видима!");
            },
        });

        // Вывод рекламы
        uralprojs.ad.showFullscreenAdv({
            onOpen: () => {
                uralprojs.uralpro.log("Реклама открыта.");
            },
            onClose: () => {
                uralprojs.uralpro.log("Реклама была закрыта.");
            },
            onError: (error) => {
                uralprojs.uralpro.error("Ошибка рекламы:", error);
            }
        });
    });
</script>
```

## Заключение

Это руководство охватывает основные функции и методы библиотеки `UralProHelperJS`. Вы можете использовать его для интеграции и управления данными, рекламой и лидербордами в вашем приложении. Если у вас возникнут дополнительные вопросы или потребуется помощь, обратитесь к документации или поддержке.
```
