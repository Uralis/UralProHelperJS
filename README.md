# 🚀 UralProHelperJS

**`UralProHelperJS`** — это мощная библиотека для работы с SDK Яндекса и локальными данными. Она предоставляет удобные методы для:

- 🔄 Управления локальными данными
- 📊 Работы с рекламой (полноэкранной и вознаграждаемой)
- 🏆 Управления лидербордами
- 🕹️ Настройки событий для запуска и остановки игры

## 📦 Установка и подключение

### 1. Подключите библиотеку

Добавьте файл `uralpro-helper-0.08-min.js` в ваш HTML:

```html
<script src="uralpro-helper-0.08-min.js"></script>
```

### 2. Создайте экземпляр библиотеки

Инициализируйте библиотеку с настройками по умолчанию:

```javascript
const defaultData = [
    ['name', 'Pavel'],
    ['2', 'test'],
    [3232411, "232445445text"],
    ["testArray", [34, 454, 54532, 344, [1, 2, 3, 4], 0, true, 0, "text"]]
];

const uralprojs = new UralProHelperJS({
    enableLogging: true, // Логи в консоль
    saveIdArray: defaultData // Данные по умолчанию
});
```

---

## 📚 Основные функции

### 🎮 1. Инициализация игры

Проверьте готовность SDK и настройте запуск игры:

```javascript
uralprojs.onSdkReady(() => {
    uralprojs.uralpro.log("SDK готово! Игра запускается...");
    uralprojs.setGameReady(); // Установка статуса готовности игры
});
```

---

### 🗂️ 2. Работа с данными

#### ➕ Установка данных
```javascript
uralprojs.setData('name', "Kseniya");
```

#### ➖ Получение данных
```javascript
const value = uralprojs.getData('name');
console.log(value); // "Kseniya"
```

#### ♻️ Сброс значений на значения по умолчанию
```javascript
uralprojs.defsetData('name');
```

---

### 📢 3. Работа с рекламой

#### 📺 Полноэкранная реклама
```javascript
uralprojs.ad.showFullscreenAdv({
    onOpen: () => uralprojs.uralpro.log("Реклама открыта"),
    onClose: () => uralprojs.uralpro.log("Реклама закрыта"),
    onError: (error) => uralprojs.uralpro.error("Ошибка рекламы:", error)
});
```

#### 🎁 Вознаграждаемая реклама
```javascript
uralprojs.ad.showRewardedVideo({
    onOpen: () => uralprojs.uralpro.log("Реклама запущена"),
    onRewarded: () => uralprojs.uralpro.log("Пользователь получил награду!"),
    onClose: () => uralprojs.uralpro.log("Реклама закрыта"),
    onError: (error) => uralprojs.uralpro.error("Ошибка:", error)
});
```

---

### 🏆 4. Лидерборды

#### 🔧 Инициализация
```javascript
uralprojs.lb.initializeLeaderboard('leaderboardName');
```

#### 📜 Получение описания
```javascript
uralprojs.lb.getLeaderboardDescription('leaderboardName');
```

#### 📈 Установка результата
```javascript
uralprojs.lb.setLeaderboardScore('leaderboardName', score, extraData);
```

#### 🔍 Рейтинг игрока
```javascript
uralprojs.lb.getLeaderboardPlayerEntry('leaderboardName');
```

#### 📊 Получение записей
```javascript
uralprojs.lb.getLeaderboardEntries('leaderboardName', options);
```

#### 🏅 Отображение топа
```javascript
uralprojs.lb.showTopLeaderboard('leaderboardName');
```

---

### 🕶️ 5. Управление видимостью страницы

```javascript
uralprojs.documentVisibility({
    onHidden: () => uralprojs.uralpro.log("Страница скрыта"),
    onVisible: () => uralprojs.uralpro.log("Страница снова видима")
});
```

---

## 💡 Полный пример

Вот пример использования библиотеки от начала до конца:

```html
<script src="uralpro-helper-0.08-min.js"></script>
<script>
    const defaultData = [
        ['name', 'Pavel'],
        ['2', 'test'],
        [3232411, "232445445text"],
        ["testArray", [34, 454, 54532, 344, [1, 2, 3, 4], 0, true, 0, "text"]]
    ];

    const uralprojs = new UralProHelperJS({
        enableLogging: true,
        saveIdArray: defaultData
    });

    uralprojs.onSdkReady(() => {
        uralprojs.setGameReady();
        console.log("Значение из хранилища:", uralprojs.getData('name'));

        uralprojs.ad.showFullscreenAdv({
            onOpen: () => console.log("Реклама открыта"),
            onClose: () => console.log("Реклама закрыта"),
        });
    });
</script>
```

---

## 📝 Лицензия

Данный проект распространяется под лицензией **MIT**. Вы можете свободно использовать его в своих проектах.

---

## 📞 Обратная связь

Если у вас есть вопросы или предложения, создавайте [Issue](https://github.com/ваш_репозиторий/issues) или отправляйте pull request. Мы всегда рады помочь!
