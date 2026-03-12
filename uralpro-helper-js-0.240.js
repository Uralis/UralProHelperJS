/*! Ural Pro Helper JS v0.240 */
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/config.js
  function createDefaultConfig(userConfig = {}) {
    let defaultConfig = {
      errorTracking: false,
      panelFPS: false,
      disableLoggingHtml: false,
      enableLoggingLib: false,
      saveIdArray: [],
      /** Уникальный префикс сохранений для CrazyGames и GamePix (избегает конфликта данных между играми). Пример: saveIdPrefix: 'mysnake' → ключи вида DataPro_mysnake_... */
      saveIdPrefix: "",
      codeAfterSaving: null,
      audioMuteDocumentVisibility: true,
      purchaseFunctionList: [],
      // Новые настройки для сжатия данных
      enableCompression: false,
      // Включить сжатие данных
      compressionThreshold: 100,
      // Минимальный размер данных для сжатия (в символах)
      compressKeys: [],
      // Список ключей, которые нужно сжимать (если пустой - сжимать все)
      enableCompressionLogging: false,
      // Включить логирование операций сжатия/распаковки
      // Настройки для менеджера сохранений
      enableSaveManager: false,
      // Разрешить работу с менеджером сохранений
      showSaveManagerButton: false,
      // Показывать кнопку менеджера сохранений
      // Debug UI (мини-меню для проверки методов)
      enableDebugMiniMenu: false
      // Показывать мини-меню (также можно включить через ?debug=1)
    };
    return __spreadValues(__spreadValues({}, defaultConfig), userConfig);
  }

  // src/constants.js
  var SAVE_ID_PREFIX = "DataPro";
  var PLATFORM_FILE = "file";
  var PLATFORM_YANDEX = "yandex";
  var PLATFORM_VK = "vk";
  var PLATFORM_POKI = "poki";
  var PLATFORM_CRAZYGAMES = "crazygames";
  var PLATFORM_GAMEPIX = "gamepix";
  var PLATFORM_ANDROID = "android";
  var PLATFORM_PLAYDECK = "playdeck";
  var PLATFORM_UNKNOWN = "unknown";
  var VALID_PLATFORMS_FROM_URL = [PLATFORM_VK, PLATFORM_POKI, PLATFORM_CRAZYGAMES, PLATFORM_GAMEPIX, PLATFORM_ANDROID, PLATFORM_PLAYDECK];

  // src/modules/utils.js
  var utils = {
    isNumber(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    },
    isNumeric(str) {
      return /^-?\d*\.?\d+$/.test(str);
    },
    convertStringToIntIfNumber(str) {
      if (typeof str !== "string")
        return str;
      if (str && utils.isNumeric(str)) {
        return str.includes(".") ? parseFloat(str) : parseInt(str, 10);
      }
      return str;
    },
    removeNonDigits(input) {
      if (input == null)
        return null;
      const str = String(input).trim();
      const isNeg = str.startsWith("-");
      const cleaned = str.replace(/[^\d.]/g, "");
      const parts = cleaned.split(".");
      const normalized = parts.length > 1 ? parts[0] + "." + parts.slice(1).join("") : parts[0];
      return isNeg ? "-" + normalized : normalized;
    },
    getValueByKey(array, key) {
      const entry = array.find((item) => item[0] === key);
      return entry ? entry[1] : null;
    },
    areMapsEqual(map1, map2) {
      if (map1.size !== map2.size)
        return false;
      for (let [key, value] of map1) {
        if (!map2.has(key) || map2.get(key) !== value)
          return false;
      }
      return true;
    },
    isCalledFromConsole() {
      try {
        if (window._androidCallbackInProgress)
          return false;
        if (typeof window.console !== "undefined" && window.console.firebug)
          return true;
        const error = new Error();
        return error.stack.split("\n").some(
          (line) => line.includes("at <anonymous>") || line.includes("at eval") || line.includes("chrome-extension://")
          // Блокировка расширений
        );
      } catch (e) {
        return false;
      }
    },
    // Вспомогательный метод для обработки стилей
    formatArgs(args) {
      const formattedArgs = [];
      let styles = [];
      args.forEach((arg) => {
        if (typeof arg === "string" && arg.startsWith("style:")) {
          styles.push(arg.replace("style:", ""));
        } else {
          formattedArgs.push(arg);
        }
      });
      if (styles.length > 0) {
        const styledArgs = formattedArgs.map((msg) => [`%c${msg}`, ...styles]);
        return styledArgs.flat();
      }
      return formattedArgs;
    },
    /**
     * Преобразует значение из хранилища (строка) в нужный тип: boolean, number, object, array, string.
     */
    parseStoredValue(value) {
      if (value === null || value === void 0)
        return value;
      if (typeof value !== "string")
        return value;
      const trimmed = value.trim();
      if (trimmed === "boolean:true")
        return true;
      if (trimmed === "boolean:false")
        return false;
      if (trimmed === "")
        return "";
      if (utils.isNumeric(trimmed))
        return trimmed.includes(".") ? parseFloat(trimmed) : parseInt(trimmed, 10);
      if (trimmed.startsWith("[") && trimmed.endsWith("]") || trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return value;
    },
    // Безопасный парсинг JSON с обработкой ошибок
    safeJsonParse(value) {
      if (value === null || value === void 0) {
        return value;
      }
      if (typeof value === "object" || typeof value === "boolean") {
        return value;
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "boolean:true")
          return true;
        if (trimmed === "boolean:false")
          return false;
        if (trimmed.startsWith("[") && trimmed.endsWith("]") || trimmed.startsWith("{") && trimmed.endsWith("}")) {
          const isLikelyJson = !trimmed.includes("=") && // нет знака равенства
          !trimmed.includes("(") && // нет круглых скобок
          !trimmed.includes(")") && (trimmed.includes('"') || // есть кавычки для строк
          trimmed.includes(":") || // есть двоеточия для объектов
          trimmed.includes(",") || // есть запятые для разделения
          trimmed === "{}" || // пустой объект
          trimmed === "[]");
          if (isLikelyJson) {
            try {
              return JSON.parse(value);
            } catch (e) {
              return value;
            }
          }
        }
        return value;
      }
      return value;
    },
    /** Префикс сжатых данных в хранилище */
    COMPRESSED_PREFIX: "COMPRESSED:",
    isCompressedString(str) {
      return typeof str === "string" && str.startsWith(utils.COMPRESSED_PREFIX);
    },
    /**
     * Нормализует значение для сохранения в save_idArray (строка по умолчанию).
     */
    normalizeDefaultValue(value) {
      if (typeof value === "boolean")
        return value.toString();
      if (typeof value === "number")
        return value.toString();
      if (typeof value === "string")
        return value;
      if (Array.isArray(value))
        return JSON.stringify(value);
      if (value === null || value === void 0)
        return "";
      return value.toString();
    },
    /** Ключи системных настроек (не пользовательские). */
    SYSTEM_SETTINGS: [
      "ADYAShowADS",
      "GameHelp",
      "GameSoundSettings",
      "GameMusicSettings",
      "ysdk_lastFullscreenAdv",
      "ysdkAdvStart",
      "iStartBackgroundAudio",
      "____init",
      "getPlayer",
      "sdk",
      "isSdkReadyStop",
      "isSdkReady",
      "isSdkReadyData",
      "isLoaded",
      "isGameReady",
      "mapDataApp",
      "saveDataOld1",
      "saveDataOld2",
      "platform",
      "lang",
      "setup_saveData",
      "onSdkReady_END"
    ],
    isSystemSetting(key) {
      return key != null && utils.SYSTEM_SETTINGS.includes(key);
    },
    /** Ключевые слова и паттерны для данных игры (прогресс, сохранения). */
    isGameData(key) {
      if (!key || typeof key !== "string")
        return false;
      const lowerKey = key.toLowerCase();
      const gameDataKeywords = [
        "save",
        "saves",
        "progress",
        "level",
        "score",
        "points",
        "coins",
        "inventory",
        "item",
        "weapon",
        "armor",
        "skill",
        "ability",
        "quest",
        "mission",
        "achievement",
        "trophy",
        "badge",
        "player",
        "character",
        "hero",
        "avatar",
        "stats",
        "map",
        "world",
        "location",
        "position",
        "coordinate",
        "art",
        "pixel",
        "canvas",
        "drawing",
        "painting",
        "timeline",
        "history",
        "record",
        "log",
        "data",
        "state",
        "status",
        "condition",
        "health",
        "energy",
        "time",
        "date",
        "timestamp",
        "duration",
        "session"
      ];
      const gameDataPatterns = [
        /^(pixel|game|player|save|progress)[A-Z]/,
        /[A-Z][a-z]+(Save|Data|State|Progress|Record)$/,
        /^(last|current|previous)[A-Z]/
      ];
      const hasKeyword = gameDataKeywords.some((kw) => lowerKey.includes(kw));
      const matchesPattern = gameDataPatterns.some((p) => p.test(key));
      return hasKeyword || matchesPattern;
    },
    /** Является ли ключ пользовательской настройкой (не системной и не данными игры). */
    isUserSetting(key) {
      if (!key || typeof key !== "string")
        return false;
      const lowerKey = key.toLowerCase();
      const userSettingKeywords = [
        "setting",
        "enabled",
        "disabled",
        "active",
        "inactive",
        "visible",
        "hidden",
        "show",
        "hide",
        "display",
        "sound",
        "music",
        "audio",
        "volume",
        "mute",
        "theme",
        "color",
        "background",
        "font",
        "size",
        "quality",
        "performance",
        "fps",
        "resolution",
        "language",
        "lang",
        "locale",
        "region",
        "notification",
        "alert",
        "popup",
        "modal",
        "auto",
        "manual",
        "default",
        "custom",
        "debug",
        "log",
        "verbose",
        "quiet",
        "save",
        "load",
        "backup",
        "sync",
        "privacy",
        "security",
        "permission",
        "accessibility",
        "screen",
        "reader",
        "contrast",
        "completed",
        "numbers",
        "highlight",
        "arts",
        "toggle",
        "switch",
        "option",
        "preference"
      ];
      const userSettingPatterns = [
        /^(is|get|has|should|can|will)[A-Z].*(Enabled|Disabled|Active|Visible|Show|Hide|Setting)$/,
        /^(enable|disable|show|hide|toggle)[A-Z]/,
        /[A-Z][a-z]+(Setting|Config|Option|Preference)$/,
        /^(hide|show)[A-Z]/
      ];
      const hasKeyword = userSettingKeywords.some((kw) => lowerKey.includes(kw));
      const matchesPattern = userSettingPatterns.some((p) => p.test(key));
      return (hasKeyword || matchesPattern) && !utils.isSystemSetting(key) && !utils.isGameData(key);
    },
    /**
     * Создаёт объект this.js для хелпера: случайные числа, UUID, сохранение/вызов функций и переменных.
     * @param {object} helper - экземпляр UralProHelperJS (this)
     * @returns {object}
     */
    createJsHelpers(helper) {
      const savedFunctions = {};
      const savedVariables = {};
      return {
        getRandomIntInclusive(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        generateUUID() {
          if (typeof crypto !== "undefined" && crypto.randomUUID) {
            return crypto.randomUUID();
          }
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : r & 3 | 8;
            return v.toString(16);
          });
        },
        saveFunction(name, fn) {
          if (typeof fn === "function") {
            savedFunctions[name] = fn;
          } else {
            helper.uralpro.error("\u041F\u0435\u0440\u0435\u0434\u0430\u043D\u043E \u043D\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u044F:", fn);
          }
        },
        callFunction(name, ...args) {
          if (typeof savedFunctions[name] === "function") {
            return savedFunctions[name](...args);
          } else {
            helper.uralpro.error(`\u0424\u0443\u043D\u043A\u0446\u0438\u044F \u0441 \u0438\u043C\u0435\u043D\u0435\u043C "${name}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.`);
          }
        },
        saveVariable(name, value, type = "var") {
          if (["var", "let", "const", "val"].includes(type)) {
            savedVariables[name] = { value, type };
          } else {
            helper.uralpro.error(`\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0442\u0438\u043F \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439: "${type}".`);
          }
        },
        getVariable(name) {
          if (Object.prototype.hasOwnProperty.call(savedVariables, name)) {
            return savedVariables[name].value;
          } else {
            helper.uralpro.error(`\u041F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F \u0441 \u0438\u043C\u0435\u043D\u0435\u043C "${name}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.`);
          }
        },
        updateVariable(name, newValue) {
          if (Object.prototype.hasOwnProperty.call(savedVariables, name)) {
            const varData = savedVariables[name];
            if (varData.type === "let" || varData.type === "var") {
              varData.value = newValue;
            } else {
              helper.uralpro.error(`\u041F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F "${name}" \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0430 \u043A\u0430\u043A ${varData.type} \u0438 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0430.`);
            }
          } else {
            helper.uralpro.error(`\u041F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F \u0441 \u0438\u043C\u0435\u043D\u0435\u043C "${name}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.`);
          }
        }
      };
    },
    /**
     * Создаёт менеджер загрузки скриптов (SDK и т.п.).
     * Использование: this.scriptManager = utils.createScriptManager(this)
     */
    createScriptManager(helper) {
      const api = {
        appendScript(src, asyncFlag, onload) {
          if (utils.isCalledFromConsole()) {
            helper.uralpro.error("\u0417\u0430\u043F\u0443\u0441\u043A \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
            return;
          }
          const script = document.createElement("script");
          script.src = src;
          script.async = asyncFlag;
          if (onload)
            script.onload = onload;
          document.head.appendChild(script);
        },
        loadScript(src) {
          if (utils.isCalledFromConsole()) {
            helper.uralpro.error("\u0417\u0430\u043F\u0443\u0441\u043A \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
            return;
          }
          api.appendScript(src, false);
        },
        loadScripts(scripts) {
          if (utils.isCalledFromConsole()) {
            helper.uralpro.error("\u0417\u0430\u043F\u0443\u0441\u043A \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
            return;
          }
          scripts.forEach((s) => api.loadScript(s));
        },
        loadJS(sdkUrl, onLoadCallback) {
          if (utils.isCalledFromConsole()) {
            helper.uralpro.error("\u0417\u0430\u043F\u0443\u0441\u043A \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
            return;
          }
          helper.uralpro.log(`\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 "${sdkUrl}"`, helper.uralpro.logStyle("#2e2727", "#b49a11"));
          const script = document.createElement("script");
          script.src = sdkUrl;
          script.async = true;
          script.onload = () => {
            helper.uralpro.log(`"${sdkUrl}" \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D`, helper.uralpro.logStyle("green", "#b49a11"));
            helper.uralpro.set("isLoaded", true);
            if (typeof onLoadCallback === "function")
              onLoadCallback();
          };
          script.onerror = () => helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 "${sdkUrl}"`, helper.uralpro.logStyle("red", "#b49a11"));
          document.head.appendChild(script);
        }
      };
      return api;
    }
  };

  // src/modules/sheets.js
  var MAX_GET_URL_LENGTH = 1800;
  function compressForUrl(str) {
    return __async(this, null, function* () {
      const blob = new Blob([str], { type: "text/plain" });
      const stream = blob.stream().pipeThrough(new CompressionStream("gzip"));
      const buf = yield new Response(stream).arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      const chunk = 8192;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
      }
      return btoa(binary);
    });
  }
  function createSheetsModule() {
    return {
      /** GET-запрос с query-параметрами и cache-bust. */
      sendViaGet(scriptUrl, data) {
        return __async(this, null, function* () {
          const params = __spreadProps(__spreadValues({}, data), {
            _cacheBust: (/* @__PURE__ */ new Date()).getTime()
          });
          const queryString = new URLSearchParams(params).toString();
          const urlWithParams = `${scriptUrl}?${queryString}`;
          try {
            console.log("\u{1F4E4} \u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 GET \u0437\u0430\u043F\u0440\u043E\u0441\u0430:", urlWithParams.substring(0, 120) + (urlWithParams.length > 120 ? "..." : ""));
            const response = yield fetch(urlWithParams);
            const result = yield response.text();
            try {
              const jsonResult = JSON.parse(result);
              console.log("\u2705 \u0423\u0441\u043F\u0435\u0445:", jsonResult);
              return { success: true, data: jsonResult };
            } catch (e) {
              console.log("\u2705 \u0414\u0430\u043D\u043D\u044B\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u044B (\u043E\u0442\u0432\u0435\u0442 \u043D\u0435 JSON):", result);
              return { success: true, rawResponse: result };
            }
          } catch (error) {
            console.error("\u274C \u041E\u0448\u0438\u0431\u043A\u0430:", error);
            return { success: false, error: error.message };
          }
        });
      },
      /** Отправка с автоподжатием textData при превышении лимита URL (только GET, без POST из-за CORS). */
      send(scriptUrl, data) {
        return __async(this, null, function* () {
          let params = __spreadProps(__spreadValues({}, data), { _cacheBust: (/* @__PURE__ */ new Date()).getTime() });
          let queryString = new URLSearchParams(params).toString();
          let fullUrl = `${scriptUrl}?${queryString}`;
          if (fullUrl.length > MAX_GET_URL_LENGTH && data.textData != null && typeof CompressionStream !== "undefined") {
            try {
              const compressed = yield compressForUrl(String(data.textData));
              params = __spreadProps(__spreadValues({}, data), { textData: compressed, compressed: "1", _cacheBust: params._cacheBust });
              queryString = new URLSearchParams(params).toString();
              fullUrl = `${scriptUrl}?${queryString}`;
              console.log("\u{1F4E6} \u0414\u0430\u043D\u043D\u044B\u0435 \u0441\u0436\u0430\u0442\u044B gzip:", String(data.textData).length, "\u2192", compressed.length, "\u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432");
            } catch (e) {
              console.warn("\u26A0 \u0421\u0436\u0430\u0442\u0438\u0435 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C, \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u043A\u0430\u043A \u0435\u0441\u0442\u044C:", e);
            }
          }
          return yield this.sendViaGet(scriptUrl, params);
        });
      },
      // Основной метод для обновления данных пользователя (при большом объёме — сжатие gzip, только GET)
      updateUserData(scriptUrl, sheetName, userLogin, textData) {
        return __async(this, null, function* () {
          const data = {
            action: "update_user_data",
            sheetName,
            userLogin,
            textData,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
          return yield this.send(scriptUrl, data);
        });
      },
      // Альтернативный метод для добавления данных (без перезаписи)
      addUserData(scriptUrl, sheetName, userLogin, textData) {
        return __async(this, null, function* () {
          const data = {
            action: "add_user_data",
            sheetName,
            userLogin,
            textData,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
          return yield this.send(scriptUrl, data);
        });
      },
      // Для обратной совместимости (старый метод)
      sendScore(scriptUrl, playerName, score, level) {
        return __async(this, null, function* () {
          const data = {
            action: "save_score",
            player: playerName,
            score,
            level,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
          return yield this.sendViaGet(scriptUrl, data);
        });
      }
    };
  }

  // src/modules/savemanager.js
  function createSaveManager(helper) {
    const api = {
      // Показ модального окна управления сохранениями
      showSaveManager: () => {
        if (utils.isCalledFromConsole()) {
          helper.uralpro.error("\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
          return;
        }
        if (!helper.uralpro.config.enableSaveManager) {
          helper.uralpro.warn("\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445.");
          return;
        }
        const modal = document.createElement("div");
        modal.id = "save-manager-modal";
        modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            `;
        const content = document.createElement("div");
        content.style.cssText = `
                background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
                border-radius: 15px;
                padding: 30px;
                max-width: 90vw;
                max-height: 90vh;
                overflow-y: auto;
                border: 2px solid #ffd700;
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
                color: white;
                font-family: Arial, sans-serif;
            `;
        const title = document.createElement("h2");
        title.textContent = "\u{1F4BE} \u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439";
        title.style.cssText = `
                color: #ffd700;
                margin: 0 0 20px 0;
                text-align: center;
                font-size: 24px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            `;
        const stats = api.getSaveStats();
        const statsDiv = document.createElement("div");
        statsDiv.style.cssText = `
                background: rgba(255, 215, 0, 0.1);
                border: 1px solid #ffd700;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
            `;
        const statItems = [
          { label: "\u0412\u0441\u0435\u0433\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439", value: stats.totalSaves, icon: "\u{1F4CA}" },
          { label: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0434\u0430\u043D\u043D\u044B\u0445", value: stats.totalSize, icon: "\u{1F4BE}" },
          { label: "\u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430", value: stats.platform, icon: "\u{1F310}" },
          { label: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435", value: stats.lastSave, icon: "\u23F0" }
        ];
        statItems.forEach((item) => {
          const statItem = document.createElement("div");
          statItem.style.cssText = `
                    text-align: center;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                `;
          statItem.innerHTML = `
                    <div style="font-size: 20px; margin-bottom: 5px;">${item.icon}</div>
                    <div style="font-size: 12px; color: #ccc; margin-bottom: 5px;">${item.label}</div>
                    <div style="font-size: 14px; font-weight: bold; color: #ffd700;">${item.value}</div>
                `;
          statsDiv.appendChild(statItem);
        });
        const savesList = document.createElement("div");
        savesList.style.cssText = `
                max-height: 300px;
                overflow-y: auto;
                margin-bottom: 20px;
                border: 1px solid #444;
                border-radius: 10px;
                background: rgba(0, 0, 0, 0.3);
            `;
        const saves = api.getAllSaves();
        if (saves.length === 0) {
          const noSaves = document.createElement("div");
          noSaves.style.cssText = `
                    padding: 20px;
                    text-align: center;
                    color: #888;
                    font-style: italic;
                `;
          noSaves.textContent = "\u041D\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F";
          savesList.appendChild(noSaves);
        } else {
          saves.forEach((save, index) => {
            const saveItem = document.createElement("div");
            saveItem.style.cssText = `
                        padding: 15px;
                        border-bottom: 1px solid #444;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        transition: background 0.3s ease;
                    `;
            saveItem.onmouseenter = () => {
              saveItem.style.background = "rgba(255, 215, 0, 0.1)";
            };
            saveItem.onmouseleave = () => {
              saveItem.style.background = "transparent";
            };
            const saveInfo = document.createElement("div");
            saveInfo.innerHTML = `
                        <div style="font-weight: bold; color: #ffd700; margin-bottom: 5px;">${save.key}</div>
                        <div style="font-size: 12px; color: #ccc;">${save.type} \u2022 ${save.size}</div>
                        <div style="font-size: 11px; color: #888;">${save.value}</div>
                    `;
            const saveActions = document.createElement("div");
            saveActions.style.cssText = `
                        display: flex;
                        gap: 10px;
                    `;
            const exportBtn = document.createElement("button");
            exportBtn.textContent = "\u{1F4E4}";
            exportBtn.title = "\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C";
            exportBtn.style.cssText = `
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 8px 12px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.3s ease;
                    `;
            exportBtn.onclick = () => api.exportSave(save.key);
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "\u{1F5D1}\uFE0F";
            deleteBtn.title = "\u0423\u0434\u0430\u043B\u0438\u0442\u044C";
            deleteBtn.style.cssText = `
                        background: #f44336;
                        color: white;
                        border: none;
                        padding: 8px 12px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.3s ease;
                    `;
            deleteBtn.onclick = () => api.deleteSave(save.key, savesList);
            saveActions.appendChild(exportBtn);
            saveActions.appendChild(deleteBtn);
            saveItem.appendChild(saveInfo);
            saveItem.appendChild(saveActions);
            savesList.appendChild(saveItem);
          });
        }
        const actionsDiv = document.createElement("div");
        actionsDiv.style.cssText = `
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            `;
        const buttons = [
          {
            text: "\u{1F4E4} \u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0432\u0441\u0435\u0445",
            action: () => api.exportAllSaves(),
            style: "background: #2196F3; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background 0.3s ease;"
          },
          {
            text: "\u{1F4E5} \u0418\u043C\u043F\u043E\u0440\u0442",
            action: () => api.importSaves(),
            style: "background: #4CAF50; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background 0.3s ease;"
          },
          {
            text: "\u{1F5D1}\uFE0F \u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435",
            action: () => api.clearAllSaves(modal),
            style: "background: #f44336; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background 0.3s ease;"
          },
          {
            text: "\u274C \u0417\u0430\u043A\u0440\u044B\u0442\u044C",
            action: () => modal.remove(),
            style: "background: #666; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background 0.3s ease;"
          }
        ];
        buttons.forEach((btn) => {
          const button = document.createElement("button");
          button.textContent = btn.text;
          button.style.cssText = btn.style;
          button.onclick = btn.action;
          button.onmouseenter = () => {
            button.style.opacity = "0.8";
          };
          button.onmouseleave = () => {
            button.style.opacity = "1";
          };
          actionsDiv.appendChild(button);
        });
        modal.onclick = (e) => {
          if (e.target === modal) {
            modal.remove();
          }
        };
        content.appendChild(title);
        content.appendChild(statsDiv);
        content.appendChild(savesList);
        content.appendChild(actionsDiv);
        modal.appendChild(content);
        document.body.appendChild(modal);
      },
      // Получение статистики сохранений
      getSaveStats: () => {
        const saves = api.getAllSaves();
        const totalSize = saves.reduce((sum, save) => sum + save.sizeBytes, 0);
        return {
          totalSaves: saves.length,
          totalSize: api.formatBytes(totalSize),
          platform: helper.uralpro.get("platform") || "unknown",
          lastSave: api.getLastSaveTime()
        };
      },
      // Получение всех сохранений
      getAllSaves: () => {
        const saves = [];
        const saveIdArray = helper.uralpro.save_idArray || [];
        saveIdArray.forEach(([key, defaultValue]) => {
          const value = helper.getData(key);
          if (value !== void 0 && value !== null) {
            const valueStr = typeof value === "object" ? JSON.stringify(value) : String(value);
            const sizeBytes = new Blob([valueStr]).size;
            saves.push({
              key,
              value: api.truncateValue(valueStr, 50),
              type: api.getDataType(value),
              size: api.formatBytes(sizeBytes),
              sizeBytes,
              rawValue: value
            });
          }
        });
        return saves.sort((a, b) => b.sizeBytes - a.sizeBytes);
      },
      // Форматирование размера в байтах
      formatBytes: (bytes) => {
        if (bytes === 0)
          return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
      },
      // Обрезка значения для отображения
      truncateValue: (value, maxLength) => {
        const str = value != null && typeof value === "string" ? value : String(value != null ? value : "");
        if (str.length <= maxLength)
          return str;
        return str.substring(0, maxLength) + "...";
      },
      // Определение типа данных
      getDataType: (value) => {
        if (typeof value === "number")
          return "Number";
        if (typeof value === "boolean")
          return "Boolean";
        if (typeof value === "string")
          return "String";
        if (Array.isArray(value))
          return "Array";
        if (typeof value === "object")
          return "Object";
        return "Unknown";
      },
      // Получение времени последнего сохранения
      getLastSaveTime: () => {
        const lastSave = localStorage.getItem("uralpro_lastSaveTime");
        if (lastSave) {
          return new Date(parseInt(lastSave)).toLocaleString();
        }
        return "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E";
      },
      // Экспорт одного сохранения
      exportSave: (key) => {
        const value = helper.getData(key);
        if (value === void 0) {
          helper.uralpro.error(`\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 "${key}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E`);
          return;
        }
        const exportData = {
          key,
          value,
          exportTime: (/* @__PURE__ */ new Date()).toISOString(),
          platform: helper.uralpro.get("platform")
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `uralpro_save_${key}_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        helper.uralpro.log(`\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 "${key}" \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E`);
      },
      // Экспорт всех сохранений
      exportAllSaves: () => {
        const saves = api.getAllSaves();
        const exportData = {
          saves: saves.map((save) => ({
            key: save.key,
            value: save.rawValue,
            type: save.type
          })),
          exportTime: (/* @__PURE__ */ new Date()).toISOString(),
          platform: helper.uralpro.get("platform"),
          totalSaves: saves.length
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `uralpro_all_saves_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        helper.uralpro.log(`\u0412\u0441\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u044B (${saves.length} \u0448\u0442.)`);
      },
      // Импорт сохранений
      importSaves: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.style.display = "none";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file)
            return;
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target.result);
              api.processImportData(data);
            } catch (error) {
              helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0438\u043C\u043F\u043E\u0440\u0442\u0435 \u0444\u0430\u0439\u043B\u0430:", error);
              alert("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0438\u043C\u043F\u043E\u0440\u0442\u0435 \u0444\u0430\u0439\u043B\u0430. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0444\u043E\u0440\u043C\u0430\u0442 \u0444\u0430\u0439\u043B\u0430.");
            }
          };
          reader.readAsText(file);
        };
        input.click();
      },
      // Обработка импортированных данных
      processImportData: (data) => {
        let importedCount = 0;
        let skippedCount = 0;
        if (data.saves && Array.isArray(data.saves)) {
          data.saves.forEach((save) => {
            if (save.key && save.value !== void 0) {
              helper.setData(save.key, save.value);
              importedCount++;
            } else {
              skippedCount++;
            }
          });
        } else if (data.key && data.value !== void 0) {
          helper.setData(data.key, data.value);
          importedCount++;
        }
        helper.saveDataUrgently();
        const message = `\u0418\u043C\u043F\u043E\u0440\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D!
\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E: ${importedCount}
\u041F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E: ${skippedCount}`;
        alert(message);
        helper.uralpro.log(`\u0418\u043C\u043F\u043E\u0440\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439: ${importedCount} \u0438\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E, ${skippedCount} \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E`);
      },
      // Удаление сохранения
      deleteSave: (key, container) => {
        if (confirm(`\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 "${key}"?`)) {
          const saveIdArray = helper.uralpro.save_idArray || [];
          const defaultEntry = saveIdArray.find(([k]) => k === key);
          const defaultValue = defaultEntry ? defaultEntry[1] : null;
          helper.uralpro.get("mapDataApp").delete(helper.uralpro.save_id000 + key);
          localStorage.removeItem(helper.uralpro.save_id000 + key);
          if (defaultValue !== null) {
            helper.uralpro.get("mapDataApp").set(helper.uralpro.save_id000 + key, defaultValue);
          }
          helper.saveDataUrgently();
          container.innerHTML = "";
          const saves = api.getAllSaves();
          if (saves.length === 0) {
            const noSaves = document.createElement("div");
            noSaves.style.cssText = `
                        padding: 20px;
                        text-align: center;
                        color: #888;
                        font-style: italic;
                    `;
            noSaves.textContent = "\u041D\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F";
            container.appendChild(noSaves);
          } else {
            saves.forEach((save) => {
              const saveItem = document.createElement("div");
              saveItem.style.cssText = `
                            padding: 15px;
                            border-bottom: 1px solid #444;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            transition: background 0.3s ease;
                        `;
              saveItem.onmouseenter = () => {
                saveItem.style.background = "rgba(255, 215, 0, 0.1)";
              };
              saveItem.onmouseleave = () => {
                saveItem.style.background = "transparent";
              };
              const saveInfo = document.createElement("div");
              saveInfo.innerHTML = `
                            <div style="font-weight: bold; color: #ffd700; margin-bottom: 5px;">${save.key}</div>
                            <div style="font-size: 12px; color: #ccc;">${save.type} \u2022 ${save.size}</div>
                            <div style="font-size: 11px; color: #888;">${save.value}</div>
                        `;
              const saveActions = document.createElement("div");
              saveActions.style.cssText = `
                            display: flex;
                            gap: 10px;
                        `;
              const exportBtn = document.createElement("button");
              exportBtn.textContent = "\u{1F4E4}";
              exportBtn.title = "\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C";
              exportBtn.style.cssText = `
                            background: #4CAF50;
                            color: white;
                            border: none;
                            padding: 8px 12px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: background 0.3s ease;
                        `;
              exportBtn.onclick = () => api.exportSave(save.key);
              const deleteBtn = document.createElement("button");
              deleteBtn.textContent = "\u{1F5D1}\uFE0F";
              deleteBtn.title = "\u0423\u0434\u0430\u043B\u0438\u0442\u044C";
              deleteBtn.style.cssText = `
                            background: #f44336;
                            color: white;
                            border: none;
                            padding: 8px 12px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: background 0.3s ease;
                        `;
              deleteBtn.onclick = () => api.deleteSave(save.key, container);
              saveActions.appendChild(exportBtn);
              saveActions.appendChild(deleteBtn);
              saveItem.appendChild(saveInfo);
              saveItem.appendChild(saveActions);
              container.appendChild(saveItem);
            });
          }
          helper.uralpro.log(`\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 "${key}" \u0443\u0434\u0430\u043B\u0435\u043D\u043E`);
        }
      },
      // Очистка всех сохранений
      clearAllSaves: (modal) => {
        if (confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0412\u0421\u0415 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F? \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C!")) {
          const saveIdArray = helper.uralpro.save_idArray || [];
          let deletedCount = 0;
          saveIdArray.forEach(([key, defaultValue]) => {
            helper.uralpro.get("mapDataApp").delete(helper.uralpro.save_id000 + key);
            localStorage.removeItem(helper.uralpro.save_id000 + key);
            helper.uralpro.get("mapDataApp").set(helper.uralpro.save_id000 + key, defaultValue);
            deletedCount++;
          });
          helper.saveDataUrgently();
          modal.remove();
          alert(`\u0423\u0434\u0430\u043B\u0435\u043D\u043E ${deletedCount} \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439`);
          helper.uralpro.log(`\u041E\u0447\u0438\u0449\u0435\u043D\u044B \u0432\u0441\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F (${deletedCount} \u0448\u0442.)`);
        }
      },
      // Создание кнопки менеджера сохранений
      createSaveManagerButton: () => {
        if (utils.isCalledFromConsole()) {
          helper.uralpro.error("\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043A\u043D\u043E\u043F\u043A\u0438 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
          return;
        }
        if (!helper.uralpro.config.showSaveManagerButton) {
          return;
        }
        if (document.getElementById("save-manager-button")) {
          return;
        }
        const button = document.createElement("button");
        button.id = "save-manager-button";
        button.innerHTML = "\u{1F4BE}";
        button.title = "\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439";
        button.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #8b4513;
                border: none;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 215, 0, 0.5);
            `;
        button.onmouseenter = () => {
          button.style.transform = "scale(1.1)";
          button.style.boxShadow = "0 6px 20px rgba(255, 215, 0, 0.5)";
          button.style.background = "linear-gradient(135deg, #ffed4e, #ffd700)";
        };
        button.onmouseleave = () => {
          button.style.transform = "scale(1)";
          button.style.boxShadow = "0 4px 15px rgba(255, 215, 0, 0.3)";
          button.style.background = "linear-gradient(135deg, #ffd700, #ffed4e)";
        };
        button.onclick = () => {
          helper.saveManager.showSaveManager();
        };
        document.body.appendChild(button);
        helper.uralpro.log("\u041A\u043D\u043E\u043F\u043A\u0430 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0441\u043E\u0437\u0434\u0430\u043D\u0430");
      },
      // Удаление кнопки менеджера сохранений
      removeSaveManagerButton: () => {
        const button = document.getElementById("save-manager-button");
        if (button) {
          button.remove();
          helper.uralpro.log("\u041A\u043D\u043E\u043F\u043A\u0430 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0443\u0434\u0430\u043B\u0435\u043D\u0430");
        }
      }
    };
    return api;
  }

  // src/modules/audio.js
  function createAudioModule(helper) {
    const audio = {
      config: {
        sound: true,
        backgroundAudio: true,
        nameBackgroundAudio: ""
      },
      context: null,
      tracks: /* @__PURE__ */ new Map(),
      gainNodes: /* @__PURE__ */ new Map(),
      audioLoadedCount: 0,
      totalAudioCount: 0,
      platform: helper.uralpro.get("platform") === PLATFORM_ANDROID ? typeof (window.AudioContext || window.webkitAudioContext) !== "undefined" ? "web" : window.location.protocol === "file:" ? PLATFORM_FILE : "web" : window.location.protocol === "file:" ? PLATFORM_FILE : "web",
      isAllLoaded: false,
      loadCallbacks: [],
      isMuted: false,
      volumeBackup: /* @__PURE__ */ new Map(),
      pausedTracks: /* @__PURE__ */ new Map(),
      playingTracks: /* @__PURE__ */ new Map(),
      audioPool: /* @__PURE__ */ new Map(),
      poolSize: 3,
      lastPlayTime: /* @__PURE__ */ new Map(),
      debounceDelay: 50,
      init() {
        if (audio.platform === "web" && !audio.context) {
          try {
            audio.context = new (window.AudioContext || window.webkitAudioContext)();
            helper.uralpro.log("AudioContext \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D.", `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 AudioContext:", e);
          }
          document.addEventListener("click", () => {
            var _a;
            if (((_a = audio.context) == null ? void 0 : _a.state) === "suspended") {
              audio.context.resume().then(() => {
                helper.uralpro.log("AudioContext \u0432\u043E\u0437\u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0433\u043E \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F.", `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
              }).catch((error) => {
                helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u043E\u0437\u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F AudioContext:", error);
              });
            }
          });
        }
      },
      createAudioPool(name, src, volume = 1) {
        if (audio.audioPool.has(name))
          return;
        const pool = [];
        for (let i = 0; i < audio.poolSize; i++) {
          if (audio.platform === PLATFORM_FILE) {
            const el = new Audio(src);
            el.volume = volume;
            el.preload = "auto";
            pool.push(el);
          } else {
            const request = new XMLHttpRequest();
            request.open("GET", src, true);
            request.responseType = "arraybuffer";
            request.onload = () => {
              audio.context.decodeAudioData(
                request.response,
                (buffer) => pool.push(buffer),
                (error) => helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0434\u0435\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0430\u0443\u0434\u0438\u043E \u0434\u043B\u044F \u043F\u0443\u043B\u0430 "${name}":`, error)
              );
            };
            request.send();
          }
        }
        audio.audioPool.set(name, pool);
      },
      load(name, src, volume = 1, loop = false) {
        audio.totalAudioCount++;
        if (!loop)
          audio.createAudioPool(name, src, volume);
        if (audio.platform === PLATFORM_FILE) {
          const player = new Audio(src);
          player.loop = loop;
          player.volume = volume;
          player.addEventListener("canplaythrough", () => {
            if (!audio.tracks.has(name)) {
              audio.tracks.set(name, { player, volume, loop });
              audio.onLoadComplete(name);
            }
          });
          player.addEventListener("error", () => {
            helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0430\u0443\u0434\u0438\u043E\u0444\u0430\u0439\u043B\u0430 "${name}".`);
            audio.onLoadComplete(name, false);
          });
        } else {
          const request = new XMLHttpRequest();
          request.open("GET", src, true);
          request.responseType = "arraybuffer";
          request.onload = () => {
            audio.context.decodeAudioData(
              request.response,
              (buffer) => {
                if (!audio.tracks.has(name)) {
                  audio.tracks.set(name, { buffer, source: null, volume, loop });
                  audio.onLoadComplete(name);
                }
              },
              (error) => {
                helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0434\u0435\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0430\u0443\u0434\u0438\u043E "${name}":`, error);
                audio.onLoadComplete(name, false);
              }
            );
          };
          request.onerror = () => {
            helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0430\u0443\u0434\u0438\u043E\u0444\u0430\u0439\u043B\u0430 "${name}".`);
            audio.onLoadComplete(name, false);
          };
          request.send();
        }
      },
      onLoadComplete(name, success = true) {
        if (success) {
          helper.uralpro.log(`\u0410\u0443\u0434\u0438\u043E\u0444\u0430\u0439\u043B "${name}" \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D.`, `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
        }
        audio.audioLoadedCount++;
        if (audio.audioLoadedCount === audio.totalAudioCount) {
          audio.isAllLoaded = true;
          helper.uralpro.log(`\u0412\u0441\u0435 \u0430\u0443\u0434\u0438\u043E\u0444\u0430\u0439\u043B\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u044B!`, `style: color: #2cb64d; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
          audio.loadCallbacks.forEach((cb) => {
            if (cb)
              cb();
          });
          document.addEventListener("click", () => {
            if (helper.uralpro.get("iStartBackgroundAudio") !== 1) {
              helper.uralpro.set("iStartBackgroundAudio", 1);
              if (audio.config.nameBackgroundAudio !== "" && helper.audio) {
                helper.audio.play(audio.config.nameBackgroundAudio);
              }
            }
          });
        }
      },
      play(name, startTime = true) {
        if (audio.config.nameBackgroundAudio === name) {
          if (!audio.config.backgroundAudio)
            return;
        } else {
          if (!audio.config.sound)
            return;
        }
        if (!audio.isAllLoaded) {
          helper.uralpro.warn("\u041D\u0435 \u0432\u0441\u0435 \u0430\u0443\u0434\u0438\u043E\u0444\u0430\u0439\u043B\u044B \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u044B. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435.");
          return;
        }
        const track = audio.tracks.get(name);
        if (!track) {
          helper.uralpro.error(`\u0422\u0440\u0435\u043A "${name}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.`);
          return;
        }
        if (!track.loop) {
          const currentTime = Date.now();
          const lastTime = audio.lastPlayTime.get(name) || 0;
          if (currentTime - lastTime < audio.debounceDelay)
            return;
          audio.lastPlayTime.set(name, currentTime);
        }
        if (audio.platform === PLATFORM_FILE) {
          if (track.loop) {
            if (startTime || audio.pausedTracks.has(name)) {
              track.player.currentTime = audio.pausedTracks.get(name) || 0;
              audio.pausedTracks.delete(name);
            }
            track.player.play().then(() => {
              helper.uralpro.log(`\u0410\u0443\u0434\u0438\u043E\u0442\u0440\u0435\u043A "${name}" \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F.`, `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
              audio.playingTracks.set(name, true);
            }).catch((err) => helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F "${name}":`, err));
          } else {
            const pool = audio.audioPool.get(name);
            if ((pool == null ? void 0 : pool.length) > 0) {
              let el = null;
              for (let i = 0; i < pool.length; i++) {
                if (pool[i].paused || pool[i].ended) {
                  el = pool[i];
                  break;
                }
              }
              if (el) {
                el.currentTime = 0;
                el.play().catch((err) => helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u0438\u0437 \u043F\u0443\u043B\u0430 "${name}":`, err));
              }
            } else {
              track.player.currentTime = 0;
              track.player.play().catch((err) => helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F "${name}":`, err));
            }
          }
        } else {
          if (track.loop) {
            if (audio.playingTracks.has(name) && track.loop) {
              helper.uralpro.log(`\u0410\u0443\u0434\u0438\u043E\u0442\u0440\u0435\u043A "${name}" \u0443\u0436\u0435 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0432 \u0440\u0435\u0436\u0438\u043C\u0435 loop.`, `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
              return;
            }
            const source = audio.context.createBufferSource();
            const gainNode = audio.context.createGain();
            source.buffer = track.buffer;
            gainNode.gain.value = audio.isMuted ? 0 : track.volume;
            source.connect(gainNode);
            gainNode.connect(audio.context.destination);
            source.loop = track.loop;
            const startOffset = audio.pausedTracks.has(name) ? audio.pausedTracks.get(name) : 0;
            if (!Number.isFinite(startOffset) || startOffset < 0) {
              helper.uralpro.warn(`\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 startOffset (${startOffset}). \u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u0441 \u043D\u0430\u0447\u0430\u043B\u0430.`);
              source.start(0);
            } else {
              source.start(0, startOffset);
            }
            audio.pausedTracks.delete(name);
            track.source = source;
            audio.gainNodes.set(name, gainNode);
            audio.playingTracks.set(name, true);
            helper.uralpro.log(`\u0410\u0443\u0434\u0438\u043E\u0442\u0440\u0435\u043A "${name}" \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F \u0447\u0435\u0440\u0435\u0437 AudioContext.`, `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
          } else {
            const pool = audio.audioPool.get(name);
            if ((pool == null ? void 0 : pool.length) > 0) {
              const source = audio.context.createBufferSource();
              const gainNode = audio.context.createGain();
              source.buffer = pool[0];
              gainNode.gain.value = audio.isMuted ? 0 : track.volume;
              source.connect(gainNode);
              gainNode.connect(audio.context.destination);
              source.loop = false;
              source.start(0);
              source.onended = () => {
                source.disconnect();
                gainNode.disconnect();
              };
            } else {
              const source = audio.context.createBufferSource();
              const gainNode = audio.context.createGain();
              source.buffer = track.buffer;
              gainNode.gain.value = audio.isMuted ? 0 : track.volume;
              source.connect(gainNode);
              gainNode.connect(audio.context.destination);
              source.loop = false;
              source.start(0);
              source.onended = () => {
                source.disconnect();
                gainNode.disconnect();
              };
            }
          }
        }
      },
      stop(name) {
        const track = audio.tracks.get(name);
        if (!track) {
          helper.uralpro.error(`\u0422\u0440\u0435\u043A "${name}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.`);
          return;
        }
        if (audio.platform === PLATFORM_FILE) {
          if (!track.player.paused) {
            track.player.pause();
            track.player.currentTime = 0;
            helper.uralpro.log(`\u0410\u0443\u0434\u0438\u043E\u0442\u0440\u0435\u043A "${name}" \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D.`, `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
            audio.playingTracks.delete(name);
          }
        } else if (track.source) {
          track.source.stop();
          track.source = null;
          audio.gainNodes.delete(name);
          helper.uralpro.log(`\u0410\u0443\u0434\u0438\u043E\u0442\u0440\u0435\u043A "${name}" \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D \u0447\u0435\u0440\u0435\u0437 AudioContext.`, `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
          audio.playingTracks.delete(name);
        }
      },
      pause(name) {
        const track = audio.tracks.get(name);
        if (!track) {
          helper.uralpro.error(`\u0422\u0440\u0435\u043A "${name}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.`);
          return;
        }
        if (audio.platform === PLATFORM_FILE) {
          if (!track.player.paused) {
            track.player.pause();
            helper.uralpro.log(`\u0410\u0443\u0434\u0438\u043E\u0442\u0440\u0435\u043A "${name}" \u043F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D.`, `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
            audio.pausedTracks.set(name, track.player.currentTime);
            audio.playingTracks.delete(name);
          }
        } else if (track.source) {
          const currentTime = audio.context.currentTime;
          const elapsedTime = currentTime - track.source.startTime;
          track.source.stop();
          helper.uralpro.log(`\u0410\u0443\u0434\u0438\u043E\u0442\u0440\u0435\u043A "${name}" \u043F\u0440\u0438\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D \u0447\u0435\u0440\u0435\u0437 AudioContext.`, `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
          audio.pausedTracks.set(name, elapsedTime);
          audio.playingTracks.delete(name);
        }
      },
      setVolume(name, volume) {
        const track = audio.tracks.get(name);
        if (!track) {
          helper.uralpro.error(`\u0422\u0440\u0435\u043A "${name}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.`);
          return;
        }
        if (audio.platform === PLATFORM_FILE) {
          track.player.volume = audio.isMuted ? 0 : volume;
        } else {
          const gainNode = audio.gainNodes.get(name);
          if (gainNode)
            gainNode.gain.value = audio.isMuted ? 0 : volume;
        }
        track.volume = volume;
      },
      muteAll() {
        if (audio.isMuted)
          return;
        audio.tracks.forEach((track, name) => {
          audio.volumeBackup.set(name, track.volume);
          audio.setVolume(name, 0);
        });
        audio.isMuted = true;
        helper.uralpro.log("\u0413\u0440\u043E\u043C\u043A\u043E\u0441\u0442\u044C \u0432\u0441\u0435\u0445 \u0442\u0440\u0435\u043A\u043E\u0432 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0430.", `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
      },
      unmuteAll() {
        if (!audio.isMuted)
          return;
        audio.tracks.forEach((track, name) => {
          const volume = audio.volumeBackup.get(name);
          if (volume !== void 0) {
            audio.setVolume(name, volume);
            if (audio.platform === PLATFORM_FILE) {
              track.player.volume = volume;
            } else {
              const gainNode = audio.gainNodes.get(name);
              if (gainNode)
                gainNode.gain.value = volume;
            }
          }
        });
        audio.isMuted = false;
        helper.uralpro.log("\u0413\u0440\u043E\u043C\u043A\u043E\u0441\u0442\u044C \u0432\u0441\u0435\u0445 \u0442\u0440\u0435\u043A\u043E\u0432 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430.", `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
      },
      update() {
        audio.tracks.forEach((track, name) => {
          if (audio.config.nameBackgroundAudio === name) {
            helper.uralpro.log(`\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0444\u043E\u043D\u043E\u0432\u043E\u0439 \u043C\u0443\u0437\u044B\u043A\u0438: ${name}, backgroundAudio: ${audio.config.backgroundAudio}`, `style: color: grey; font-weight: bold; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `);
            if (audio.config.backgroundAudio) {
              if (name !== "" && !audio.playingTracks.has(name) && helper.audio)
                helper.audio.play(name, false);
            } else {
              if (helper.audio)
                helper.audio.pause(name);
            }
          } else {
            if (!audio.config.sound && helper.audio)
              helper.audio.stop(name);
          }
        });
      },
      onAllAudioLoaded(callback) {
        if (audio.isAllLoaded)
          callback();
        else
          audio.loadCallbacks.push(callback);
      }
    };
    return audio;
  }

  // src/modules/debugmenu.js
  function createDebugMenu(helper) {
    const PANEL_ID = "uralpro-debug-panel";
    const menu = {
      _id: PANEL_ID,
      _created: false,
      _root: null,
      _body: null,
      _statusEl: null,
      _outputEl: null,
      _drag: { x: 0, y: 0, left: 0, top: 0, active: false },
      isEnabled() {
        var _a, _b;
        if ((_b = (_a = helper.uralpro) == null ? void 0 : _a.config) == null ? void 0 : _b.enableDebugMiniMenu)
          return true;
        try {
          const sp = new URLSearchParams(window.location.search);
          const keys = ["debug", "uralpro-debug", "uralpro-debug-menu"];
          return keys.some((k) => sp.get(k) === "1" || sp.get(k) === "true");
        } catch (e) {
          return false;
        }
      },
      _platform() {
        return helper.uralpro.get("platform") || "unknown";
      },
      _getStatusLines() {
        var _a, _b, _c, _d, _e;
        const platform = this._platform();
        const version = helper.version || "unknown";
        const lines = [
          `version: ${version}`,
          `platform: ${platform}`,
          `lang: ${helper.uralpro.get("lang")}`,
          `isLoaded: ${helper.uralpro.get("isLoaded")}`,
          `isSdkReady: ${helper.uralpro.get("isSdkReady")}`,
          `isSdkReadyData: ${helper.uralpro.get("isSdkReadyData")}`,
          `isGameReady: ${helper.uralpro.get("isGameReady")}`
        ];
        if (platform === PLATFORM_VK) {
          const hasBridge = !!((_c = (_b = (_a = helper.vk) == null ? void 0 : _a.bridge) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.send);
          lines.push(`vkBridge: ${hasBridge ? "yes" : "no"}`);
          lines.push(`lb.availability: ${!!((_d = helper.lb) == null ? void 0 : _d.availability)}`);
        }
        if (platform === PLATFORM_YANDEX) {
          const v = helper.uralpro.get("yandex_canReview");
          if (v !== void 0)
            lines.push(`yandex_canReview: ${v}`);
          const s = helper.uralpro.get("shortcut_available");
          if (s !== void 0)
            lines.push(`shortcut_available: ${s}`);
          lines.push(`yaPayments: ${helper.uralpro.has("yaPayments") ? "yes" : "no"}`);
          lines.push(`lb.availability: ${!!((_e = helper.lb) == null ? void 0 : _e.availability)}`);
        }
        if (platform === PLATFORM_GAMEPIX) {
          lines.push(`gamepix_loaded_called: ${!!helper.uralpro.get("gamepix_loaded_called")}`);
        }
        if (platform === PLATFORM_ANDROID) {
          const products = helper.uralpro.get("android_products") || [];
          lines.push(`android_products: ${products.length}`);
        }
        if (platform === PLATFORM_PLAYDECK) {
          const state = helper.uralpro.get("playdeck_state");
          const profile = helper.uralpro.get("playdeck_profile");
          const lastSave = helper.uralpro.get("playdeck_cloud_last_save");
          const lastLoad = helper.uralpro.get("playdeck_cloud_last_load");
          if (state !== void 0)
            lines.push(`playdeck_state: ${this._safeStringify(state)}`);
          if (profile !== void 0) {
            const shortProfile = profile && typeof profile === "object" ? { id: profile.id, locale: profile.locale, address: profile.address } : profile;
            lines.push(`playdeck_profile: ${this._safeStringify(shortProfile)}`);
          }
          if (lastSave) {
            lines.push(
              `playdeck_last_save: mode=${lastSave.mode || "single"} len=${lastSave.length || 0} shards=${lastSave.shards || 0} at=${lastSave.at || "n/a"}`
            );
          }
          if (lastLoad) {
            lines.push(
              `playdeck_last_load: restored=${lastLoad.restored || 0} len=${lastLoad.rawLength || 0} at=${lastLoad.at || "n/a"}`
            );
          }
        }
        return lines.join("\n");
      },
      _safeStringify(v) {
        try {
          if (typeof v === "string")
            return v;
          return JSON.stringify(v, null, 2);
        } catch (e) {
          return String(v);
        }
      },
      _run(name, fn) {
        const output = this._outputEl;
        if (!output)
          return;
        output.textContent = `\u25B6 ${name}...`;
        output.scrollIntoView({ block: "nearest", behavior: "smooth" });
        const RUN_TIMEOUT_MS = 15e3;
        let settled = false;
        const timeoutId = setTimeout(() => {
          if (settled)
            return;
          settled = true;
          output.textContent = `\u23F1 ${name}

\u0422\u0430\u0439\u043C\u0430\u0443\u0442 (${RUN_TIMEOUT_MS / 1e3} \u0441\u0435\u043A).`;
          this._refreshStatus();
        }, RUN_TIMEOUT_MS);
        Promise.resolve(fn()).then((res) => {
          if (settled)
            return;
          settled = true;
          clearTimeout(timeoutId);
          const text = res !== void 0 && res !== null ? this._safeStringify(res) : "\u0413\u043E\u0442\u043E\u0432\u043E";
          output.textContent = `\u2705 ${name}

${text}`;
          output.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }).catch((e) => {
          if (settled)
            return;
          settled = true;
          clearTimeout(timeoutId);
          output.textContent = `\u274C ${name}

${this._safeStringify(e)}`;
          output.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }).finally(() => this._refreshStatus());
      },
      _refreshStatus() {
        if (this._statusEl)
          this._statusEl.textContent = this._getStatusLines();
        if (this._platformBadge)
          this._platformBadge.textContent = `(${this._platform()})`;
      },
      _maxLogLines: 300,
      _appendLog(level, args) {
        if (!this._logBuffer || !Array.isArray(this._logBuffer))
          return;
        const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("ru-RU", { hour12: false });
        const textParts = [];
        let styleStr = null;
        args.forEach((a) => {
          if (typeof a === "string" && a.startsWith("style:")) {
            styleStr = a.replace(/^style:\s*/, "").trim();
          } else {
            textParts.push(typeof a === "object" && a !== null ? JSON.stringify(a) : String(a));
          }
        });
        const text = textParts.join(" ");
        this._logBuffer.push({ level, time, text, style: styleStr });
        if (this._logBuffer.length > this._maxLogLines)
          this._logBuffer.shift();
        if (!this._logEl)
          return;
        const line = document.createElement("div");
        line.style.cssText = "font-size:10px; line-height:1.35; margin-bottom:2px; word-break:break-word; padding:2px 6px; border-radius:4px;";
        if (level === "warn")
          line.style.color = "#e6b422";
        else if (level === "error")
          line.style.color = "#e06060";
        else
          line.style.color = "rgba(255,255,255,0.85)";
        if (styleStr) {
          try {
            line.style.cssText += " " + styleStr;
          } catch (_) {
          }
        }
        line.textContent = `[${time}] [${level}] ${text}`;
        this._logEl.appendChild(line);
        this._logEl.scrollTop = this._logEl.scrollHeight;
      },
      _makeSection(title, opts = {}) {
        const wrap = document.createElement("div");
        wrap.style.cssText = "margin-top:8px;";
        const label = document.createElement("div");
        label.textContent = title;
        label.style.cssText = "font-size:10px; font-weight:600; color:rgba(255,255,255,0.55); margin-bottom:6px; text-transform:uppercase; letter-spacing:.5px;";
        wrap.appendChild(label);
        const box = document.createElement("div");
        box.style.cssText = "display:flex; flex-wrap:wrap; gap:6px;";
        wrap.appendChild(box);
        return { wrap, box };
      },
      _makeBtn(label, title) {
        const b = document.createElement("button");
        b.textContent = label;
        if (title)
          b.title = title;
        b.style.cssText = "cursor:pointer; border:0; color:#fff; background:rgba(255,255,255,0.12); border-radius:6px; padding:6px 10px; font-size:11px;";
        b.onmouseenter = () => b.style.background = "rgba(255,255,255,0.2)";
        b.onmouseleave = () => b.style.background = "rgba(255,255,255,0.12)";
        return b;
      },
      /**
       * Универсальный промпт: поле ввода с OK / Отмена.
       * @param {string}   label        — заголовок
       * @param {string}   placeholder  — placeholder поля ввода
       * @param {string}   defaultValue — значение по умолчанию
       * @param {Function} onOk         — вызывается с введённым текстом
       */
      _showInputPrompt(label, placeholder, defaultValue, onOk) {
        const overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed; inset:0; z-index:12000; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center;";
        const box = document.createElement("div");
        box.style.cssText = "background:rgba(28,28,32,0.98); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:20px; min-width:280px; box-shadow:0 12px 40px rgba(0,0,0,0.5);";
        const lbl = document.createElement("div");
        lbl.textContent = label;
        lbl.style.cssText = "font-size:12px; color:rgba(255,255,255,0.8); margin-bottom:8px;";
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = placeholder;
        input.value = defaultValue != null ? defaultValue : "";
        input.style.cssText = "width:100%; box-sizing:border-box; padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.3); color:#fff; font-size:14px; margin-bottom:12px;";
        const row = document.createElement("div");
        row.style.cssText = "display:flex; gap:8px; justify-content:flex-end;";
        const btnOk = document.createElement("button");
        btnOk.textContent = "OK";
        btnOk.style.cssText = "padding:8px 16px; border-radius:8px; border:0; background:rgba(255,215,0,0.25); color:#ffd700; cursor:pointer; font-size:12px;";
        const btnCancel = document.createElement("button");
        btnCancel.textContent = "\u041E\u0442\u043C\u0435\u043D\u0430";
        btnCancel.style.cssText = "padding:8px 16px; border-radius:8px; border:0; background:rgba(255,255,255,0.1); color:#ccc; cursor:pointer; font-size:12px;";
        const close = () => overlay.remove();
        btnOk.onclick = () => {
          close();
          onOk(input.value);
        };
        btnCancel.onclick = close;
        overlay.onclick = (e) => {
          if (e.target === overlay)
            close();
        };
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter")
            btnOk.click();
        });
        row.appendChild(btnCancel);
        row.appendChild(btnOk);
        box.appendChild(lbl);
        box.appendChild(input);
        box.appendChild(row);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        input.focus();
      },
      _showLeaderboardNamePrompt(defaultName, onOk) {
        const overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed; inset:0; z-index:12000; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center;";
        const box = document.createElement("div");
        box.style.cssText = "background:rgba(28,28,32,0.98); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:20px; min-width:280px; box-shadow:0 12px 40px rgba(0,0,0,0.5);";
        const label = document.createElement("div");
        label.textContent = "\u0418\u043C\u044F \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430";
        label.style.cssText = "font-size:12px; color:rgba(255,255,255,0.8); margin-bottom:8px;";
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: default";
        input.value = defaultName || "default";
        input.style.cssText = "width:100%; box-sizing:border-box; padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.3); color:#fff; font-size:14px; margin-bottom:12px;";
        const row = document.createElement("div");
        row.style.cssText = "display:flex; gap:8px; justify-content:flex-end;";
        const btnOk = document.createElement("button");
        btnOk.textContent = "OK";
        btnOk.style.cssText = "padding:8px 16px; border-radius:8px; border:0; background:rgba(255,215,0,0.25); color:#ffd700; cursor:pointer; font-size:12px;";
        const btnCancel = document.createElement("button");
        btnCancel.textContent = "\u041E\u0442\u043C\u0435\u043D\u0430";
        btnCancel.style.cssText = "padding:8px 16px; border-radius:8px; border:0; background:rgba(255,255,255,0.1); color:#ccc; cursor:pointer; font-size:12px;";
        const close = () => overlay.remove();
        btnOk.onclick = () => {
          const name = (input.value || "").trim() || "default";
          close();
          onOk(name);
        };
        btnCancel.onclick = close;
        overlay.onclick = (e) => {
          if (e.target === overlay)
            close();
        };
        row.appendChild(btnCancel);
        row.appendChild(btnOk);
        box.appendChild(label);
        box.appendChild(input);
        box.appendChild(row);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        input.focus();
      },
      _copyToClipboard(text, outputEl) {
        var _a;
        const msg = (ok, err) => {
          if (outputEl)
            outputEl.textContent = ok ? "\u2705 \u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E." : `\u274C ${err}`;
        };
        if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
          navigator.clipboard.writeText(text).then(() => msg(true)).catch((e) => msg(false, String(e)));
        } else {
          try {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand("copy");
            ta.remove();
            msg(true);
          } catch (e) {
            msg(false, String(e));
          }
        }
      },
      create() {
        var _a, _b, _c, _d, _e;
        try {
          if (menu._created)
            return;
          if (!menu.isEnabled())
            return;
          if (document.getElementById(PANEL_ID)) {
            menu._created = true;
            menu._root = document.getElementById(PANEL_ID);
            return;
          }
          const root = document.createElement("div");
          root.id = PANEL_ID;
          menu._root = root;
          root.style.cssText = `
                    position: fixed;
                    top: 12px;
                    left: 12px;
                    z-index: 11000;
                    width: 320px;
                    max-width: calc(100vw - 24px);
                    max-height: 90vh;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    color: #fff;
                    background: rgba(18,18,22,0.95);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 12px;
                    backdrop-filter: blur(12px);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                `;
          const header = document.createElement("div");
          header.style.cssText = "display:flex; align-items:center; justify-content:space-between; gap:8px; padding:10px 12px; background:rgba(255,255,255,0.06); user-select:none; cursor:move; flex-shrink:0;";
          header.title = "\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435. Ctrl+Shift+D \u2014 \u0441\u043A\u0440\u044B\u0442\u044C/\u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C";
          const title = document.createElement("div");
          title.style.cssText = "font-weight:700; font-size:13px; display:flex; align-items:center; gap:8px;";
          const version = helper.version || "unknown";
          title.innerHTML = `UralPro Debug v${version} <span style="font-size:10px; font-weight:normal; color:rgba(255,255,255,0.6);"></span>`;
          const platformBadge = title.querySelector("span");
          menu._platformBadge = platformBadge;
          platformBadge.textContent = `(${menu._platform()})`;
          const right = document.createElement("div");
          right.style.cssText = "display:flex; gap:4px;";
          const toggleBtn = document.createElement("button");
          toggleBtn.textContent = "\u25BE";
          toggleBtn.title = "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C";
          toggleBtn.style.cssText = "cursor:pointer; border:0; color:#fff; background:rgba(255,255,255,0.1); border-radius:6px; width:28px; height:24px; font-size:12px;";
          const closeBtn = document.createElement("button");
          closeBtn.textContent = "\xD7";
          closeBtn.title = "\u0417\u0430\u043A\u0440\u044B\u0442\u044C";
          closeBtn.style.cssText = "cursor:pointer; border:0; color:rgba(255,200,200,0.9); background:rgba(220,80,80,0.2); border-radius:6px; width:28px; height:24px; font-size:18px; line-height:1;";
          right.appendChild(toggleBtn);
          right.appendChild(closeBtn);
          header.appendChild(title);
          header.appendChild(right);
          const scrollBody = document.createElement("div");
          scrollBody.style.cssText = "padding:12px; overflow-y:auto; flex:1; min-height:0;";
          const status = document.createElement("div");
          status.style.cssText = "font-size:11px; line-height:1.5; color:rgba(255,255,255,0.88); padding:10px; border-radius:8px; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.08); white-space:pre-wrap; word-break:break-word; font-family:ui-monospace,monospace;";
          menu._statusEl = status;
          const output = document.createElement("div");
          output.style.cssText = "font-size:11px; line-height:1.4; color:rgba(255,255,255,0.9); padding:10px; border-radius:8px; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.08); min-height:44px; max-height:160px; overflow:auto; white-space:pre-wrap; word-break:break-word; font-family:ui-monospace,monospace; margin-top:10px;";
          output.textContent = "\u0413\u043E\u0442\u043E\u0432\u043E. \u041D\u0430\u0436\u0438\u043C\u0430\u0439\u0442\u0435 \u043A\u043D\u043E\u043F\u043A\u0438.";
          menu._outputEl = output;
          menu._logBuffer = [];
          const logEl = document.createElement("div");
          logEl.style.cssText = "font-size:10px; line-height:1.35; padding:8px; border-radius:8px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.08); max-height:180px; overflow-y:auto; font-family:ui-monospace,monospace; margin-top:8px;";
          menu._logEl = logEl;
          const origLog = (_a = helper.uralpro.log) == null ? void 0 : _a.bind(helper.uralpro);
          const origWarn = (_b = helper.uralpro.warn) == null ? void 0 : _b.bind(helper.uralpro);
          const origError = (_c = helper.uralpro.error) == null ? void 0 : _c.bind(helper.uralpro);
          if (typeof origLog === "function") {
            helper.uralpro.log = (...a) => {
              origLog(...a);
              menu._appendLog("log", a);
            };
          }
          if (typeof origWarn === "function") {
            helper.uralpro.warn = (...a) => {
              origWarn(...a);
              menu._appendLog("warn", a);
            };
          }
          if (typeof origError === "function") {
            helper.uralpro.error = (...a) => {
              origError(...a);
              menu._appendLog("error", a);
            };
          }
          const addBtn = (sec, label, title2, fn) => {
            const b = menu._makeBtn(label, title2);
            b.onclick = () => typeof fn === "function" ? menu._run(label, fn) : fn();
            sec.box.appendChild(b);
          };
          const secStatus = menu._makeSection("\u0421\u0442\u0430\u0442\u0443\u0441");
          addBtn(secStatus, "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C", "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441", () => {
            menu._refreshStatus();
            if (menu._outputEl)
              menu._outputEl.textContent = "\u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D.";
          });
          addBtn(secStatus, "Copy status", null, () => {
            var _a2;
            menu._copyToClipboard(menu._getStatusLines() + "\n\n" + (((_a2 = menu._outputEl) == null ? void 0 : _a2.textContent) || ""), menu._outputEl);
          });
          addBtn(secStatus, "Copy state JSON", null, () => {
            const safe = {};
            const keys = ["platform", "lang", "isLoaded", "isSdkReady", "isSdkReadyData", "isGameReady", "yandex_canReview", "shortcut_available", "gamepix_loaded_called"];
            keys.forEach((k) => {
              const v = helper.uralpro.get(k);
              if (v !== void 0)
                safe[k] = v;
            });
            if (helper.lb)
              safe.lb_availability = helper.lb.availability;
            menu._copyToClipboard(JSON.stringify(safe, null, 2), menu._outputEl);
          });
          const secLogs = menu._makeSection("\u041B\u043E\u0433\u0438");
          secLogs.wrap.appendChild(logEl);
          addBtn(secLogs, "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C", "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043B\u043E\u0433", () => {
            menu._logBuffer.length = 0;
            if (menu._logEl) {
              menu._logEl.innerHTML = "";
              menu._logEl.appendChild(document.createTextNode("\u041B\u043E\u0433 \u043E\u0447\u0438\u0449\u0435\u043D."));
            }
          });
          addBtn(secLogs, "Copy logs", "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043B\u043E\u0433\u0438", () => {
            const text = (menu._logBuffer || []).map((e) => `[${e.time}] [${e.level}] ${e.text}`).join("\n");
            menu._copyToClipboard(text || "(\u043F\u0443\u0441\u0442\u043E)", menu._outputEl);
          });
          const secData = menu._makeSection("\u0414\u0430\u043D\u043D\u044B\u0435");
          addBtn(secData, "getData sample", "UH-UUID, UH-NumberOfStarts", () => ({
            UH_UUID: helper.getData("UH-UUID"),
            UH_NumberOfStarts: helper.getData("UH-NumberOfStarts", 0),
            UH_Platform: helper.getData("UH-Platform")
          }));
          addBtn(secData, "Save now", "saveDataUrgently", () => {
            helper.saveDataUrgently();
            return "saveDataUrgently() \u0432\u044B\u0437\u0432\u0430\u043D";
          });
          const secVk = menu._makeSection("VK");
          addBtn(secVk, "User", null, () => helper.vk.getUserInfo());
          addBtn(secVk, "Share", null, () => helper.vk.share(window.location.href));
          addBtn(secVk, "Wall post", null, () => helper.vk.showWallPostBox({ message: "\u0422\u0435\u0441\u0442 (debug).", attachments: window.location.href }));
          addBtn(secVk, "Invite", null, () => helper.vk.showInviteBox());
          addBtn(secVk, "VK Storage keys", null, () => __async(this, null, function* () {
            const raw = yield helper.vk.storage.getAllRaw();
            return { count: raw.size, keys: Array.from(raw.keys()).slice(0, 20) };
          }));
          const secLB = menu._makeSection("\u041B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434");
          addBtn(secLB, "Init LB", "initializeLeaderboard()", () => helper.lb.initializeLeaderboard());
          addBtn(secLB, "Set Score", "setLeaderboardScore(name, score)", () => {
            var _a2;
            const isVk = menu._platform() === PLATFORM_VK;
            const setScore = (lbName, score) => {
              menu._run(`Set Score (${score})`, () => helper.lb.setLeaderboardScore(lbName, score));
            };
            if (isVk) {
              menu._showInputPrompt("\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 (\u0447\u0438\u0441\u043B\u043E)", "\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: 100", "100", (val) => {
                const n = Number(val);
                if (isNaN(n)) {
                  if (menu._outputEl)
                    menu._outputEl.textContent = "\u274C \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E.";
                  return;
                }
                setScore("", n);
              });
            } else {
              const defaultName = ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.leaderboardName) || "default";
              menu._showLeaderboardNamePrompt(defaultName, (lbName) => {
                menu._showInputPrompt("\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 (\u0447\u0438\u0441\u043B\u043E)", "\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: 100", "100", (val) => {
                  const n = Number(val);
                  if (isNaN(n)) {
                    if (menu._outputEl)
                      menu._outputEl.textContent = "\u274C \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E.";
                    return;
                  }
                  setScore(lbName, n);
                });
              });
            }
          });
          addBtn(secLB, "Get Entries", "getLeaderboardEntries(name)", () => {
            var _a2;
            const isVk = menu._platform() === PLATFORM_VK;
            if (isVk) {
              menu._run("Get Entries [VK]", () => helper.lb.getLeaderboardEntries(""));
            } else {
              const defaultName = ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.leaderboardName) || "default";
              menu._showLeaderboardNamePrompt(defaultName, (name) => {
                menu._run("Get Entries", () => helper.lb.getLeaderboardEntries(name));
              });
            }
          });
          addBtn(secLB, "Show LB", "showLeaderboard(score?)", () => {
            menu._showInputPrompt("\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 (\u0447\u0438\u0441\u043B\u043E, \u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)", "\u043F\u0443\u0441\u0442\u043E = \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C", "", (val) => {
              var _a2;
              const score = val.trim() === "" ? null : Number(val);
              if (score !== null && isNaN(score)) {
                if (menu._outputEl)
                  menu._outputEl.textContent = "\u274C \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E \u0438\u043B\u0438 \u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C.";
                return;
              }
              const defaultName = ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.leaderboardName) || "default";
              menu._run(`Show LB (score=${score != null ? score : "\u043D\u0435\u0442"})`, () => helper.lb.showLeaderboard(score, defaultName));
            });
          });
          addBtn(secLB, "Description", "getLeaderboardDescription(name) \u2014 Yandex", () => {
            var _a2;
            const defaultName = ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.leaderboardName) || "default";
            menu._showLeaderboardNamePrompt(defaultName, (name) => {
              menu._run("LB Description", () => helper.lb.getLeaderboardDescription(name));
            });
          });
          const secYandex = menu._makeSection("Yandex");
          addBtn(secYandex, "canReview", null, () => {
            var _a2, _b2, _c2;
            return (_c2 = (_b2 = (_a2 = helper.uralpro.get("sdk")) == null ? void 0 : _a2.feedback) == null ? void 0 : _b2.canReview) == null ? void 0 : _c2.call(_b2);
          });
          addBtn(secYandex, "requestReview", null, () => new Promise((res, rej) => helper.requestReview(() => res("ok"), () => res("closed"), rej)));
          addBtn(secYandex, "Shortcut", null, () => helper.addShortcut());
          addBtn(secYandex, "getPurchases", null, () => {
            var _a2, _b2;
            return (_b2 = (_a2 = helper.uralpro.get("yaPayments")) == null ? void 0 : _a2.getPurchases) == null ? void 0 : _b2.call(_a2);
          });
          addBtn(secYandex, "serverTime", null, () => helper.serverTime());
          addBtn(secYandex, "gamesList", null, () => helper.gamesList);
          const secGamePix = menu._makeSection("GamePix");
          addBtn(secGamePix, "loaded", null, () => (helper.gamepix._ensureLoadedCalled(), "ok"));
          addBtn(secGamePix, "updateScore(1)", null, () => (helper.gamepix.updateScore(1), "ok"));
          addBtn(secGamePix, "updateLevel(1)", null, () => (helper.gamepix.updateLevel(1), "ok"));
          addBtn(secGamePix, "happyMoment", null, () => helper.gamepix.happyMoment());
          addBtn(secGamePix, "lang", null, () => helper.gamepix.langDOC());
          const secPlaydeck = menu._makeSection("PlayDeck");
          addBtn(secPlaydeck, "Cloud info", "\u0421\u0432\u043E\u0434\u043A\u0430 \u043F\u043E \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u043C\u0443 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044E PlayDeck", () => ({
            playdeck_state: helper.uralpro.get("playdeck_state"),
            playdeck_profile: helper.uralpro.get("playdeck_profile"),
            cloud_meta: helper.uralpro.get("playdeck_cloud_meta"),
            cloud_last_save: helper.uralpro.get("playdeck_cloud_last_save"),
            cloud_last_load: helper.uralpro.get("playdeck_cloud_last_load")
          }));
          addBtn(
            secPlaydeck,
            "Cloud payload",
            "\u041F\u043E\u043B\u043D\u044B\u0439 JSON blob, \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0439 \u0432 PlayDeck cloud",
            () => {
              const payload = helper.uralpro.get("playdeck_cloud_last_payload");
              if (!payload) {
                return "(\u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445: \u0435\u0449\u0451 \u043D\u0435 \u0431\u044B\u043B\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0432 PlayDeck cloud)";
              }
              return payload;
            }
          );
          const secPoki = menu._makeSection("Poki");
          addBtn(secPoki, "gameStart", null, () => helper.gameStart());
          addBtn(secPoki, "gameLoadingFinished", null, () => {
            var _a2, _b2;
            return (_b2 = (_a2 = helper.uralpro.get("sdk")) == null ? void 0 : _a2.gameLoadingFinished) == null ? void 0 : _b2.call(_a2), "ok";
          });
          const secCG = menu._makeSection("CrazyGames");
          addBtn(secCG, "gameStart", null, () => helper.gameStart());
          const secAndroid = menu._makeSection("Android");
          addBtn(secAndroid, "android_products", null, () => helper.uralpro.get("android_products") || []);
          const secAd = menu._makeSection("\u0420\u0435\u043A\u043B\u0430\u043C\u0430");
          addBtn(
            secAd,
            "Interstitial",
            null,
            () => helper.ad.showFullscreenAdv(
              () => helper.uralpro.log("[Debug] Ad open"),
              () => helper.uralpro.log("[Debug] Ad close"),
              (e) => helper.uralpro.log("[Debug] Ad error", e)
            )
          );
          addBtn(
            secAd,
            "Rewarded",
            null,
            () => helper.ad.showRewardedVideo(
              () => helper.uralpro.log("[Debug] Reward open"),
              () => helper.uralpro.log("[Debug] Rewarded"),
              () => helper.uralpro.log("[Debug] Reward close"),
              (e) => helper.uralpro.log("[Debug] Reward error", e)
            )
          );
          addBtn(secAd, "Banner ON", null, () => helper.ad.showBannerAdv(true));
          addBtn(secAd, "Banner OFF", null, () => helper.ad.showBannerAdv(false));
          const secAudio = menu._makeSection("\u0410\u0443\u0434\u0438\u043E");
          addBtn(secAudio, "Mute", null, () => {
            var _a2, _b2;
            return (_b2 = (_a2 = helper.audio) == null ? void 0 : _a2.muteAll) == null ? void 0 : _b2.call(_a2), "ok";
          });
          addBtn(secAudio, "Unmute", null, () => {
            var _a2, _b2;
            return (_b2 = (_a2 = helper.audio) == null ? void 0 : _a2.unmuteAll) == null ? void 0 : _b2.call(_a2), "ok";
          });
          const secSys = menu._makeSection("\u0421\u0438\u0441\u0442\u0435\u043C\u0430");
          addBtn(secSys, "ready()", null, () => (helper.ready(), "ok"));
          addBtn(secSys, "setGameReady()", null, () => (helper.setGameReady(), "ok"));
          addBtn(secSys, "gameStart()", null, () => helper.gameStart());
          addBtn(secSys, "gameStop()", null, () => helper.gameStop());
          const platform = menu._platform();
          const sections = [
            { wrap: secStatus.wrap, show: true },
            { wrap: secLogs.wrap, show: true },
            { wrap: secData.wrap, show: true },
            { wrap: secLB.wrap, show: platform === PLATFORM_VK || platform === PLATFORM_YANDEX },
            { wrap: secVk.wrap, show: platform === PLATFORM_VK },
            { wrap: secYandex.wrap, show: platform === PLATFORM_YANDEX },
            { wrap: secGamePix.wrap, show: platform === PLATFORM_GAMEPIX },
            { wrap: secPlaydeck.wrap, show: platform === PLATFORM_PLAYDECK },
            { wrap: secPoki.wrap, show: platform === PLATFORM_POKI },
            { wrap: secCG.wrap, show: platform === PLATFORM_CRAZYGAMES },
            { wrap: secAndroid.wrap, show: platform === PLATFORM_ANDROID },
            { wrap: secAd.wrap, show: true },
            { wrap: secAudio.wrap, show: !!helper.audio },
            { wrap: secSys.wrap, show: true }
          ];
          sections.forEach(({ wrap, show }) => {
            wrap.style.display = show ? "" : "none";
            scrollBody.appendChild(wrap);
          });
          scrollBody.appendChild(output);
          let collapsed = false;
          const setCollapsed = (v) => {
            collapsed = !!v;
            scrollBody.style.display = collapsed ? "none" : "block";
            toggleBtn.textContent = collapsed ? "\u25B8" : "\u25BE";
          };
          toggleBtn.onclick = (e) => {
            e.stopPropagation();
            setCollapsed(!collapsed);
          };
          closeBtn.onclick = (e) => {
            e.stopPropagation();
            root.remove();
            menu._created = false;
          };
          header.addEventListener("mousedown", (e) => {
            if (e.target.closest("button"))
              return;
            menu._drag.active = true;
            menu._drag.left = root.offsetLeft;
            menu._drag.top = root.offsetTop;
            menu._drag.x = e.clientX;
            menu._drag.y = e.clientY;
          });
          document.addEventListener("mousemove", (e) => {
            if (!menu._drag.active)
              return;
            const dx = e.clientX - menu._drag.x;
            const dy = e.clientY - menu._drag.y;
            root.style.left = `${menu._drag.left + dx}px`;
            root.style.top = `${menu._drag.top + dy}px`;
          });
          document.addEventListener("mouseup", () => {
            menu._drag.active = false;
          });
          root.appendChild(header);
          root.appendChild(scrollBody);
          document.body.appendChild(root);
          menu._refreshStatus();
          document.addEventListener("keydown", (ev) => {
            if (ev.ctrlKey && ev.shiftKey && ev.key === "D") {
              ev.preventDefault();
              const el = document.getElementById(PANEL_ID);
              if (el)
                el.style.display = el.style.display === "none" ? "" : "none";
              else
                menu.create();
            }
          });
          menu._created = true;
        } catch (e) {
          try {
            (_e = (_d = helper.uralpro) == null ? void 0 : _d.warn) == null ? void 0 : _e.call(_d, "debugMenu.create error:", e);
          } catch (e2) {
          }
        }
      }
    };
    return menu;
  }

  // src/modules/leaderboard.js
  function createLeaderboard(helper) {
    let _vkPendingScore = null;
    const getVkBridge = () => {
      const sdk = helper.uralpro.get("sdk");
      return (sdk == null ? void 0 : sdk._bridge) || window.vkBridge || null;
    };
    const vkShowLeaderBoard = (score) => __async(this, null, function* () {
      var _a2;
      const bridge = getVkBridge();
      if (!bridge) {
        helper.uralpro.error("VK Bridge \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043B\u044F \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430.");
        return null;
      }
      try {
        const effectiveScore = typeof score === "number" ? score : _vkPendingScore;
        const params = {};
        if (effectiveScore !== null && effectiveScore !== void 0 && typeof effectiveScore === "number") {
          params.user_results = Math.max(1, Math.round(effectiveScore));
        }
        helper.uralpro.log(`VK: \u043F\u043E\u043A\u0430\u0437 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430 (user_results=${(_a2 = params.user_results) != null ? _a2 : "\u043D\u0435\u0442"})...`);
        const result = yield bridge.send("VKWebAppShowLeaderBoardBox", params);
        helper.uralpro.log("VK: VKWebAppShowLeaderBoardBox result:", JSON.stringify(result));
        if (effectiveScore !== null) {
          _vkPendingScore = null;
        }
        return result;
      } catch (e) {
        helper.uralpro.error("VK: \u043E\u0448\u0438\u0431\u043A\u0430 VKWebAppShowLeaderBoardBox:", e);
        return null;
      }
    });
    const getPlatform = () => {
      const player = helper.uralpro.get("getPlayer");
      if (player === PLATFORM_YANDEX)
        return PLATFORM_YANDEX;
      return helper.platform;
    };
    const api = {
      availability: false,
      /**
       * Инициализация лидерборда.
       * Yandex — запрашивает SDK-объект leaderboards.
       * VK — проверяет наличие vkBridge.
       */
      initializeLeaderboard() {
        return __async(this, null, function* () {
          const platform = getPlatform();
          if (platform === PLATFORM_VK) {
            const bridge = getVkBridge();
            if (bridge) {
              api.availability = true;
              helper.uralpro.log("VK: \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D (VKWebAppShowLeaderBoardBox).");
            } else {
              helper.uralpro.warn("VK: vkBridge \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D, \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D.");
            }
            return;
          }
          try {
            const leaderboards = helper.uralpro.get("sdk").leaderboards;
            helper.uralpro.set("lb_sdk", leaderboards);
            const available = yield helper.uralpro.get("sdk").isAvailableMethod("leaderboards.setScore");
            api.availability = available;
          } catch (error) {
            helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 \u0440\u0430\u0431\u043E\u0442\u044B \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u043E\u0432:`, error);
          }
        });
      },
      /**
       * Установить результат в лидерборд.
       *
       * Yandex — sdk.leaderboards.setScore() — отправляет сразу.
       * VK     — СОХРАНЯЕТ результат локально (без показа окна).
       *          Результат будет отправлен при следующем вызове showLeaderboard()
       *          или getLeaderboardEntries(). Сохраняется только лучший результат.
       *
       * @param {string}       leaderboardName — имя лидерборда (для Yandex). Для VK игнорируется.
       * @param {number}       score           — числовой результат.
       * @param {*}            [extraData]     — доп. данные (только Yandex).
       */
      setLeaderboardScore(leaderboardName, score, extraData = null) {
        return __async(this, null, function* () {
          if (utils.isCalledFromConsole()) {
            helper.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
            return;
          }
          if (typeof score !== "number") {
            helper.uralpro.error(`\u041F\u0435\u0440\u0435\u0434\u0430\u043D\u043D\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 "${score}" \u043D\u0435 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0447\u0438\u0441\u043B\u043E\u043C.`);
            return;
          }
          const platform = getPlatform();
          if (platform === PLATFORM_VK) {
            if (!api.availability) {
              helper.uralpro.warn("VK: \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u043D\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D.");
              return;
            }
            const rounded = Math.max(1, Math.round(score));
            if (_vkPendingScore === null || rounded > _vkPendingScore) {
              _vkPendingScore = rounded;
            }
            helper.uralpro.log(`VK: \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 ${rounded} \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D (pending). \u041F\u043E\u043A\u0430\u0436\u0435\u0442\u0441\u044F \u043F\u0440\u0438 showLeaderboard().`);
            return;
          }
          try {
            if (!api.availability) {
              helper.uralpro.log("\u041C\u0435\u0442\u043E\u0434 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D.");
              return;
            }
            let dataToSend = extraData;
            if (dataToSend && typeof dataToSend === "object") {
              dataToSend = JSON.stringify(dataToSend);
            }
            if (dataToSend) {
              helper.uralpro.log("setLeaderboardScore.dataToSend", dataToSend);
            }
            const sdk_leaderboard = helper.uralpro.get("lb_sdk");
            if (!sdk_leaderboard) {
              helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 sdk[\u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434].");
              return null;
            }
            if (dataToSend && dataToSend != "") {
              yield sdk_leaderboard.setScore(leaderboardName, score, dataToSend);
            } else {
              yield sdk_leaderboard.setScore(leaderboardName, score);
            }
            helper.uralpro.log("\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0432 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434.");
          } catch (error) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430:", error);
          }
        });
      },
      /**
       * Получить записи лидерборда.
       *
       * Yandex — sdk.leaderboards.getEntries(). Возвращает массив { rank, name, score, avatar, isCurrentUser }.
       * VK     — показывает нативную турнирную таблицу VK. Если ранее был сохранён результат
       *          через setLeaderboardScore, он будет отправлен вместе с показом таблицы.
       *          Возвращает [] (данные отображаются в интерфейсе VK).
       *
       * @param {string} leaderboardName — имя лидерборда (для Yandex). Для VK игнорируется.
       * @param {object} [options]       — параметры запроса (только Yandex).
       */
      getLeaderboardEntries(_0) {
        return __async(this, arguments, function* (leaderboardName, options = {}) {
          const platform = getPlatform();
          if (platform === PLATFORM_VK) {
            if (!api.availability) {
              helper.uralpro.warn("VK: \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u043D\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D.");
              return [];
            }
            yield vkShowLeaderBoard(null);
            return [];
          }
          if ((!leaderboardName || leaderboardName.length == 0) && typeof leaderboardName != "string") {
            helper.uralpro.error("\u041B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u043D\u0435 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C.");
            return [];
          }
          const sdk_leaderboard = helper.uralpro.get("lb_sdk");
          if (!sdk_leaderboard) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 sdk[\u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434].");
            return null;
          }
          try {
            const res = yield sdk_leaderboard.getEntries(leaderboardName, options);
            if (!res || !res.entries.length) {
              helper.uralpro.warn(`\u0417\u0430\u043F\u0438\u0441\u0438 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430 "${leaderboardName}" \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442.`);
              return [];
            }
            const currentUserId = (yield helper.uralpro.get("sdk").getPlayer()).getUniqueID();
            const entries = res.entries.map((entry) => ({
              rank: entry.rank,
              name: entry.player.publicName || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441\u043A\u0440\u044B\u0442",
              score: entry.score,
              avatar: entry.player.getAvatarSrc("medium"),
              isCurrentUser: entry.player.uniqueID === currentUserId
            }));
            helper.uralpro.set("getLeaderboardEntries_Data_" + leaderboardName, entries);
            return entries;
          } catch (err) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430:", err);
            return helper.uralpro.get("getLeaderboardEntries_Data_" + leaderboardName) || [];
          }
        });
      },
      /**
       * Показать таблицу лидерборда.
       *
       * VK     — VKWebAppShowLeaderBoardBox.
       *          Если передан score — отправляет его. Иначе отправляет результат,
       *          ранее сохранённый через setLeaderboardScore().
       * Yandex  — getLeaderboardEntries (возвращает данные, UI рисует игра).
       *
       * @param {number|null} [score]          — результат для регистрации (VK). null = использовать сохранённый.
       * @param {string}      [leaderboardName] — имя лидерборда (Yandex).
       * @param {object}      [options]         — параметры (Yandex).
       */
      showLeaderboard() {
        return __async(this, arguments, function* (score = null, leaderboardName = "", options = {}) {
          const platform = getPlatform();
          if (platform === PLATFORM_VK) {
            if (!api.availability) {
              helper.uralpro.warn("VK: \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u043D\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D.");
              return null;
            }
            return yield vkShowLeaderBoard(score);
          }
          if (leaderboardName) {
            return yield api.getLeaderboardEntries(leaderboardName, options);
          }
          helper.uralpro.warn("showLeaderboard: \u0443\u043A\u0430\u0436\u0438\u0442\u0435 leaderboardName \u0434\u043B\u044F Yandex.");
          return null;
        });
      },
      /**
       * Получить сохранённый pending-результат (VK). Полезно для отладки.
       * @returns {number|null}
       */
      getVkPendingScore() {
        return _vkPendingScore;
      },
      /**
       * Описание лидерборда (только Yandex).
       */
      getLeaderboardDescription(leaderboardName) {
        return __async(this, null, function* () {
          if (getPlatform() === PLATFORM_VK) {
            helper.uralpro.warn("VK: \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F.");
            return null;
          }
          if (!leaderboardName || leaderboardName.length == 0) {
            helper.uralpro.error("\u041B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434 \u043D\u0435 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C.");
            return null;
          }
          const sdk_leaderboard = helper.uralpro.get("lb_sdk");
          if (!sdk_leaderboard) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 sdk[\u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434].");
            return null;
          }
          try {
            const description = yield sdk_leaderboard.getDescription(leaderboardName);
            if (!description || !Object.keys(description).length) {
              helper.uralpro.warn(`\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430 "${leaderboardName}" \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442.`);
              return null;
            }
            helper.uralpro.set("getLeaderboardDescription_Data", description);
            helper.uralpro.log(`\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430 "${leaderboardName}" \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E.`);
            return description;
          } catch (error) {
            helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434\u0430 "${leaderboardName}":`, error);
            return helper.uralpro.get("getLeaderboardDescription_Data") || null;
          }
        });
      }
    };
    return api;
  }

  // src/modules/init-panels.js
  function runFpsPanel(helper) {
    const fpsPanel = document.createElement("div");
    fpsPanel.id = "fps-panel";
    document.body.appendChild(fpsPanel);
    Object.assign(fpsPanel.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "lime",
      padding: "5px 10px",
      borderRadius: "5px",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      zIndex: "9001",
      pointerEvents: "none",
      whiteSpace: "pre-wrap"
    });
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;
    let minFps = Infinity;
    let maxFps = 0;
    let frameTimes = [];
    function updateFPS() {
      const now = performance.now();
      const deltaTime = now - lastTime;
      frameTimes.push(deltaTime);
      frameCount++;
      if (now - lastTime >= 1e3) {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;
        minFps = Math.min(minFps, fps);
        maxFps = Math.max(maxFps, fps);
        const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        frameTimes = [];
        fpsPanel.textContent = `FPS: ${fps}
\u041C\u0438\u043D: ${minFps} \u041C\u0430\u043A\u0441: ${maxFps}
\u0421\u0440\u0435\u0434\u043D\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u043A\u0430\u0434\u0440\u0430: ${avgFrameTime.toFixed(2)}ms`;
      }
      requestAnimationFrame(updateFPS);
    }
    const positions = [
      { top: "10px", right: "10px", bottom: "auto", left: "auto" },
      { top: "10px", right: "auto", bottom: "auto", left: "10px" },
      { top: "auto", right: "10px", bottom: "10px", left: "auto" },
      { top: "auto", right: "auto", bottom: "10px", left: "10px" }
    ];
    let index = 0;
    setInterval(() => {
      Object.assign(fpsPanel.style, positions[index]);
      index = (index + 1) % positions.length;
    }, 1e4);
    updateFPS();
  }
  function runErrorTracking(helper) {
    let errorShown = false;
    function handleError(event, isPromiseRejection = false) {
      if (errorShown)
        return;
      errorShown = true;
      let errorMessage = isPromiseRejection ? `\u{1F6A8} [Promise] ${event.reason}` : `\u{1F6A8} \u041E\u0448\u0438\u0431\u043A\u0430: ${event.message || "Script Error"}
\u{1F4C4} \u0424\u0430\u0439\u043B: ${event.filename || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E"}
\u{1F4CC} \u0421\u0442\u0440\u043E\u043A\u0430: ${event.lineno || "?"}, \u041A\u043E\u043B\u043E\u043D\u043A\u0430: ${event.colno || "?"}`;
      if (event.error) {
        errorMessage += `
\u{1F50D} \u0422\u0438\u043F: ${event.error.name || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E"}
\u{1F4DC} \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435: ${event.error.message || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E"}`;
        if (event.error.stack) {
          errorMessage += `
\u{1F4CC} \u0421\u0442\u0435\u043A:
${event.error.stack.split("\n").join("\n")}`;
        }
        const isWebView = /WebView|wv|Chrome\/[.0-9]* Mobile/.test(navigator.userAgent);
        errorMessage += `

\u{1F4F1} WebView: ${isWebView ? "\u0414\u0430" : "\u041D\u0435\u0442"}`;
        errorMessage += `

\u{1F310} User Agent: ${navigator.userAgent}`;
        errorMessage += `
\u{1F4E1} Location: ${window.location.href}`;
        errorMessage += `
\u{1F4CB} Cookies: ${document.cookie}`;
      }
      let errorBox = document.getElementById("error-box");
      if (!errorBox) {
        errorBox = document.createElement("div");
        errorBox.id = "error-box";
        Object.assign(errorBox.style, {
          position: "fixed",
          top: "10px",
          left: "10px",
          right: "10px",
          zIndex: "10000",
          backgroundColor: "rgba(255, 0, 0, 0.9)",
          color: "white",
          padding: "15px",
          borderRadius: "5px",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          whiteSpace: "pre-wrap",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          maxHeight: "300px",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflowWrap: "break-word"
        });
        document.body.appendChild(errorBox);
      }
      const buttonsContainer = document.createElement("div");
      Object.assign(buttonsContainer.style, {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
        paddingBottom: "10px",
        marginBottom: "10px"
      });
      const copyButton = document.createElement("button");
      copyButton.textContent = "\u{1F4CB} \u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C";
      Object.assign(copyButton.style, {
        cursor: "pointer",
        background: "white",
        color: "black",
        border: "none",
        padding: "5px 10px",
        borderRadius: "3px"
      });
      function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand("copy");
          alert(successful ? "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435 \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u0432 \u0431\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0435\u043D\u0430" : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435");
        } catch (err) {
          alert("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0438: " + err);
        }
        document.body.removeChild(textArea);
      }
      copyButton.onclick = () => {
        const msg = errorMessage;
        if (helper.uralpro.get("sdk") && helper.platform === PLATFORM_YANDEX) {
          helper.uralpro.get("sdk").clipboard.writeText(msg).then(() => {
            alert("\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435 \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u0432 \u0431\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0435\u043D\u0430");
          }).catch((err) => {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0432 \u0431\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0435\u043D\u0430:", err);
          });
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(msg).then(() => {
            alert("\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435 \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u0432 \u0431\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0435\u043D\u0430");
          }).catch(() => {
            fallbackCopyTextToClipboard(msg);
          });
        } else {
          fallbackCopyTextToClipboard(msg);
        }
      };
      const closeButton = document.createElement("button");
      closeButton.textContent = "\u2716 \u0417\u0430\u043A\u0440\u044B\u0442\u044C";
      Object.assign(closeButton.style, {
        cursor: "pointer",
        background: "white",
        color: "black",
        border: "none",
        padding: "5px 10px",
        borderRadius: "3px"
      });
      closeButton.onclick = () => {
        errorBox.remove();
        errorShown = false;
      };
      buttonsContainer.appendChild(copyButton);
      buttonsContainer.appendChild(closeButton);
      errorBox.appendChild(buttonsContainer);
      errorBox.append(errorMessage);
      helper.uralpro.error(errorMessage);
    }
    window.onerror = function(message, source, lineno, colno, error) {
      handleError({ message, filename: source, lineno, colno, error });
      return false;
    };
    window.addEventListener("unhandledrejection", function(event) {
      if (helper.uralpro && helper.uralpro.log) {
        helper.uralpro.log("Promise Rejection:", event.reason);
      } else {
        console.error("uralpro.log \u043D\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D:", event.reason);
      }
      handleError(event, true);
    });
  }

  // src/modules/payments.js
  function createPayments(helper) {
    const api = {
      statusPurchase(key) {
        if (utils.isCalledFromConsole()) {
          helper.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
          return;
        }
        let s = false;
        const platform = helper.platform;
        if (key) {
          if (platform == PLATFORM_YANDEX) {
            s = api.productsPurchase(key) != null && (helper.uralpro.has("yaPayments") && helper.uralpro.get("getPlayer") === PLATFORM_YANDEX && helper.uralpro.has("yaPayments"));
          }
          if (platform == PLATFORM_ANDROID) {
            s = api.productsPurchase(key) != null;
          }
          if (platform == PLATFORM_PLAYDECK) {
            s = api.productsPurchase(key) != null && !!helper.uralpro.get("isSdkReady");
          }
        } else {
          if (platform == PLATFORM_YANDEX) {
            s = helper.uralpro.has("yaPayments") && helper.uralpro.get("getPlayer") === PLATFORM_YANDEX && helper.uralpro.has("yaPayments");
          }
          if (platform == PLATFORM_ANDROID) {
            s = helper.uralpro.has("android_products");
          }
          if (platform == PLATFORM_PLAYDECK) {
            s = !!helper.uralpro.get("isSdkReady") && helper.uralpro.has("playdeck_products");
          }
        }
        return s;
      },
      productsPurchase(key) {
        if (utils.isCalledFromConsole()) {
          helper.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
          return;
        }
        let r = null;
        if (api.statusPurchase()) {
          const platform = helper.platform;
          if (platform == PLATFORM_YANDEX) {
            const products = helper.uralpro.get("yandex_products");
            if (key) {
              const iData = products == null ? void 0 : products.find((item) => item.id === key);
              r = iData != null ? iData : null;
              if (!iData)
                helper.uralpro.error("productsPurchase. [" + key + "] - \u043E\u0431\u044A\u0435\u043A\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
            } else {
              r = products;
            }
          }
          if (platform == PLATFORM_ANDROID) {
            const products = helper.uralpro.get("android_products");
            if (key) {
              const iData = products == null ? void 0 : products.find((item) => item.id === key);
              r = iData != null ? iData : null;
              if (!iData)
                helper.uralpro.error("productsPurchase. [" + key + "] - \u043E\u0431\u044A\u0435\u043A\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
            } else {
              r = products;
            }
          }
          if (platform == PLATFORM_PLAYDECK) {
            const products = helper.uralpro.get("playdeck_products");
            if (key) {
              const iData = products == null ? void 0 : products.find((item) => item.id === key);
              r = iData != null ? iData : null;
              if (!iData)
                helper.uralpro.error("productsPurchase. [" + key + "] - \u043E\u0431\u044A\u0435\u043A\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
            } else {
              r = products;
            }
          }
        }
        return r;
      },
      consumePurchase(endFun) {
        if (utils.isCalledFromConsole()) {
          helper.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
          return;
        }
        if (!api.statusPurchase())
          return;
        if (helper.platform != PLATFORM_YANDEX)
          return;
        const yaPayments = helper.uralpro.get("yaPayments");
        if (!yaPayments) {
          helper.uralpro.error("Payments module not found");
          return;
        }
        (() => __async(this, null, function* () {
          var _a, _b;
          try {
            const purchases = yield yaPayments.getPurchases();
            for (const purchase of purchases) {
              try {
                yield yaPayments.consumePurchase(purchase.purchaseToken);
                const processor = (_b = (_a = helper.uralpro.config) == null ? void 0 : _a.purchaseFunctionList) == null ? void 0 : _b.find(
                  (item) => item.key === purchase.productID
                );
                if (!processor) {
                  helper.uralpro.warn(`No processor for: ${purchase.productID}`);
                  continue;
                }
                yield processor.action(api.productsPurchase(purchase.productID), purchase);
                if (endFun)
                  endFun();
                helper.saveDataUrgently();
                helper.uralpro.log(`\u041F\u043E\u043A\u0443\u043F\u043A\u0430 ${purchase.productID} \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u0430`);
              } catch (err) {
                helper.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0434\u043B\u044F ${purchase.productID}:`, err);
              }
            }
          } catch (error) {
            helper.uralpro.error("\u041E\u0431\u0449\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430:", error);
          }
        }))();
      },
      getPurchase(key, endFun, errorFun) {
        if (utils.isCalledFromConsole()) {
          helper.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
          return;
        }
        if (!api.statusPurchase() || !key)
          return;
        const platform = helper.platform;
        if (platform == PLATFORM_YANDEX) {
          const yaPayments = helper.uralpro.get("yaPayments");
          yaPayments.purchase({ id: key }).then(() => api.consumePurchase(endFun)).catch((err) => {
            console.error("purchase - " + key, err);
            if (typeof errorFun === "function")
              errorFun();
          });
        }
        if (platform == PLATFORM_ANDROID) {
          if (typeof AndroidFunction !== "undefined" && AndroidFunction.buyProduct) {
            window._androidPurchaseCallbacks = window._androidPurchaseCallbacks || {};
            window._androidPurchaseCallbacks[key] = { endFun, errorFun };
            AndroidFunction.buyProduct(key);
            console.log(`\u{1F4F1} \u0417\u0430\u043F\u0443\u0449\u0435\u043D\u0430 \u043F\u043E\u043A\u0443\u043F\u043A\u0430 Android \u0434\u043B\u044F ${key}`);
          } else {
            console.error("AndroidFunction.buyProduct \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430");
            if (typeof errorFun === "function")
              errorFun();
          }
        }
        if (platform == PLATFORM_PLAYDECK) {
          const product = api.productsPurchase(key);
          if (!product) {
            helper.uralpro.error(`PlayDeck: \u043F\u0440\u043E\u0434\u0443\u043A\u0442 "${key}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D`);
            if (typeof errorFun === "function")
              errorFun();
            return;
          }
          const adapter = helper._platformAdapter;
          if (!(adapter == null ? void 0 : adapter.purchaseProduct)) {
            helper.uralpro.error("PlayDeck: \u0430\u0434\u0430\u043F\u0442\u0435\u0440 \u043F\u043B\u0430\u0442\u0435\u0436\u0435\u0439 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D");
            if (typeof errorFun === "function")
              errorFun();
            return;
          }
          adapter.purchaseProduct({
            amount: product.price,
            description: product.description || product.label || key,
            externalId: key,
            photoUrl: product.photoUrl,
            isTest: product.isTest,
            onSuccess: (externalId) => {
              var _a, _b;
              helper.uralpro.log(`PlayDeck: \u043F\u043E\u043A\u0443\u043F\u043A\u0430 "${externalId}" \u043E\u043F\u043B\u0430\u0447\u0435\u043D\u0430`);
              const processor = (_b = (_a = helper.uralpro.config) == null ? void 0 : _a.purchaseFunctionList) == null ? void 0 : _b.find(
                (item) => item.key === externalId
              );
              if (processor && typeof processor.action === "function") {
                processor.action(product);
              }
              if (typeof endFun === "function")
                endFun();
              helper.saveDataUrgently();
            },
            onError: (val) => {
              helper.uralpro.log("PlayDeck: \u043E\u043F\u043B\u0430\u0442\u0430 \u043E\u0442\u043C\u0435\u043D\u0435\u043D\u0430/\u043E\u0448\u0438\u0431\u043A\u0430:", (val == null ? void 0 : val.status) || val);
              if (typeof errorFun === "function")
                errorFun();
            }
          });
        }
      }
    };
    return api;
  }

  // src/modules/storage.js
  function createStorageApi(helper) {
    const mapDataApp = () => helper.uralpro.get("mapDataApp");
    const prefix = () => helper.uralpro.save_id000;
    const api = {
      setData(key, value) {
        if (utils.isCalledFromConsole()) {
          helper.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 mapDataSDK \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
          return;
        }
        if (value === null || value === void 0) {
          value = "";
        } else if (typeof value === "boolean") {
          value = "boolean:" + value;
        } else if (Array.isArray(value)) {
          value = JSON.stringify(value);
        } else if (typeof value === "object") {
          value = JSON.stringify(value);
        } else if (typeof value === "number" && !Number.isNaN(value)) {
          value = value % 1 !== 0 ? parseFloat(value) : Number(value);
        }
        helper.autoAddToSaveIdArray(key, value);
        mapDataApp().set(prefix() + key, value);
      },
      hasData(key) {
        return mapDataApp().has(prefix() + key);
      },
      getData(key) {
        const storageKey = prefix() + key;
        const value = mapDataApp().get(storageKey);
        if (value !== void 0 && value !== null) {
          helper.autoAddToSaveIdArray(key, value);
          return utils.safeJsonParse(value);
        }
        if (helper.platform !== PLATFORM_PLAYDECK) {
          const localStorageKey = prefix() + key;
          const localStorageValue = localStorage.getItem(localStorageKey);
          if (localStorageValue !== null && !helper.isSystemSetting(key)) {
            helper.autoAddToSaveIdArray(key, localStorageValue);
            if (utils.isCompressedString(localStorageValue)) {
              const decompressed = helper.uralpro.decompressData(localStorageValue);
              const parsedData = utils.safeJsonParse(decompressed);
              mapDataApp().set(localStorageKey, parsedData);
              return parsedData;
            }
            mapDataApp().set(localStorageKey, localStorageValue);
            return utils.safeJsonParse(localStorageValue);
          }
        }
        return value;
      },
      getRawData(key) {
        if (utils.isCalledFromConsole()) {
          helper.uralpro.error("\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0434\u0430\u043D\u043D\u044B\u0445 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
          return null;
        }
        const value = mapDataApp().get(prefix() + key);
        if (value !== void 0 && value !== null)
          return value;
        if (helper.platform !== PLATFORM_PLAYDECK && helper.platform !== PLATFORM_CRAZYGAMES && helper.platform !== PLATFORM_GAMEPIX) {
          const localStorageKey = prefix() + key;
          const localStorageValue = localStorage.getItem(localStorageKey);
          if (localStorageValue !== null && !helper.isSystemSetting(key))
            return localStorageValue;
        }
        return value;
      },
      saveDataUrgently() {
        return __async(this, null, function* () {
          var _a2, _b, _c, _d, _e, _f, _g, _h, _i;
          if (helper.uralpro.get("setup_saveData") != 1)
            return;
          if (helper.platform === PLATFORM_PLAYDECK && !helper.uralpro.get("_playdeckCloudReady"))
            return;
          if (helper.uralpro.get("_saveInProgress")) {
            helper.uralpro.set("_savePending", true);
            return;
          }
          helper.uralpro.set("_saveInProgress", true);
          try {
            const normalizeForSave = (dataN, key) => {
              if (dataN === void 0 || dataN === null)
                return "";
              let str = dataN;
              if (typeof dataN === "boolean")
                str = dataN ? "boolean:true" : "boolean:false";
              else if (typeof dataN === "object")
                str = JSON.stringify(dataN);
              return helper.uralpro.shouldCompress(key, dataN) ? helper.uralpro.compressData(str) : str;
            };
            const saveDataOld1 = helper.uralpro.get("saveDataOld1");
            const saveDataOld2 = helper.uralpro.get("saveDataOld2");
            for (let i = 0; i < helper.uralpro.save_idArray.length; i++) {
              const idname = prefix() + helper.uralpro.save_idArray[i][0];
              const dataN = mapDataApp().get(idname);
              const key = helper.uralpro.save_idArray[i][0];
              saveDataOld1.set(idname, String(normalizeForSave(dataN, key)));
            }
            if (!utils.areMapsEqual(saveDataOld1, saveDataOld2)) {
              const saveTarget = helper.uralpro.get("getPlayer") == PLATFORM_YANDEX ? PLATFORM_YANDEX : helper.platform;
              const str = (v) => String(v != null ? v : "");
              if (saveTarget === PLATFORM_VK && ((_b = (_a2 = helper.vk) == null ? void 0 : _a2.storage) == null ? void 0 : _b.setBlob)) {
                const mapApp = mapDataApp();
                const payload = [];
                for (let i = 0; i < helper.uralpro.save_idArray.length; i++) {
                  const idname = prefix() + helper.uralpro.save_idArray[i][0];
                  const dataN = mapApp.get(idname);
                  const key = helper.uralpro.save_idArray[i][0];
                  const dataStr = str(normalizeForSave(dataN, key));
                  saveDataOld2.set(idname, dataStr);
                  payload.push([idname, dataStr]);
                }
                try {
                  yield helper.vk.storage.setBlob(JSON.stringify(payload));
                } catch (e) {
                  helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0432 VK Storage:", e);
                  try {
                    localStorage.setItem(helper.uralpro.save_id000 + "_data", JSON.stringify(payload));
                  } catch (e2) {
                  }
                }
              } else if (saveTarget === PLATFORM_CRAZYGAMES && ((_d = (_c = helper.crazygames) == null ? void 0 : _c.storage) == null ? void 0 : _d.setBlob)) {
                const mapApp = mapDataApp();
                const payload = [];
                for (let i = 0; i < helper.uralpro.save_idArray.length; i++) {
                  const idname = prefix() + helper.uralpro.save_idArray[i][0];
                  const dataN = mapApp.get(idname);
                  const key = helper.uralpro.save_idArray[i][0];
                  const dataStr = str(normalizeForSave(dataN, key));
                  saveDataOld2.set(idname, dataStr);
                  payload.push([idname, dataStr]);
                }
                try {
                  yield helper.crazygames.storage.setBlob(JSON.stringify(payload));
                } catch (e) {
                  helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0432 CrazyGames Storage:", e);
                }
              } else if (saveTarget === PLATFORM_GAMEPIX && ((_f = (_e = helper.gamepix) == null ? void 0 : _e.storage) == null ? void 0 : _f.setBlob)) {
                const mapApp = mapDataApp();
                const payload = [];
                for (let i = 0; i < helper.uralpro.save_idArray.length; i++) {
                  const idname = prefix() + helper.uralpro.save_idArray[i][0];
                  const dataN = mapApp.get(idname);
                  const key = helper.uralpro.save_idArray[i][0];
                  const dataStr = str(normalizeForSave(dataN, key));
                  saveDataOld2.set(idname, dataStr);
                  payload.push([idname, dataStr]);
                }
                try {
                  helper.gamepix.storage.setBlob(JSON.stringify(payload));
                } catch (e) {
                  helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0432 GamePix Storage:", e);
                }
              } else {
                for (let i = 0; i < helper.uralpro.save_idArray.length; i++) {
                  const idname = prefix() + helper.uralpro.save_idArray[i][0];
                  const dataN = mapDataApp().get(idname);
                  const key = helper.uralpro.save_idArray[i][0];
                  const dataToSave = normalizeForSave(dataN, key);
                  switch (saveTarget) {
                    case PLATFORM_YANDEX:
                      saveDataOld2.set(idname, str(dataToSave));
                      break;
                    case PLATFORM_VK:
                      try {
                        if (!helper.vk || !helper.vk.storage || typeof helper.vk.storage.setLarge !== "function") {
                          helper.uralpro.error("VK storage API \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D. \u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0432 localStorage.");
                          localStorage.setItem(idname, str(dataToSave));
                          saveDataOld2.set(idname, str(dataToSave));
                        } else {
                          yield helper.vk.storage.setLarge(idname, dataToSave);
                          saveDataOld2.set(idname, str(dataToSave));
                        }
                      } catch (e) {
                        helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0432 VK Storage:", e);
                        localStorage.setItem(idname, str(dataToSave));
                      }
                      break;
                    case PLATFORM_PLAYDECK:
                      saveDataOld2.set(idname, str(dataToSave));
                      break;
                    default:
                      localStorage.setItem(idname, str(dataToSave));
                      saveDataOld2.set(idname, str(dataToSave));
                      break;
                  }
                }
              }
              if (saveTarget === PLATFORM_PLAYDECK && ((_g = helper._platformAdapter) == null ? void 0 : _g.saveData)) {
                try {
                  helper._platformAdapter.saveData();
                } catch (e) {
                  helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0447\u0435\u0440\u0435\u0437 PlayDeck \u0430\u0434\u0430\u043F\u0442\u0435\u0440:", e);
                }
              }
              const platform = helper.platform;
              const logStyle = helper.uralpro.logStyle("green", "black");
              switch (platform) {
                case PLATFORM_YANDEX:
                  if (helper.uralpro.get("getPlayer") == PLATFORM_YANDEX) {
                    helper.uralpro.get("_player").setData({
                      data: Array.from(saveDataOld2)
                    }).then(() => {
                      helper.uralpro.log("SaveData [Yandex Games]", logStyle);
                      localStorage.setItem("uralpro_lastSaveTime", Date.now().toString());
                      if (helper.uralpro.config.codeAfterSaving)
                        helper.uralpro.config.codeAfterSaving();
                    });
                  }
                  break;
                case PLATFORM_VK:
                  helper.uralpro.log("SaveData [VK Storage]", logStyle);
                  if (helper.uralpro.config.codeAfterSaving)
                    helper.uralpro.config.codeAfterSaving();
                  break;
                case PLATFORM_GAMEPIX:
                  helper.uralpro.log("SaveData [GamePix.localStorage]", logStyle);
                  try {
                    if ((_i = (_h = window.GamePix) == null ? void 0 : _h.localStorage) == null ? void 0 : _i.setItem) {
                      window.GamePix.localStorage.setItem("uralpro_lastSaveTime", Date.now().toString());
                    }
                  } catch (e) {
                  }
                  if (helper.uralpro.config.codeAfterSaving)
                    helper.uralpro.config.codeAfterSaving();
                  break;
                case PLATFORM_PLAYDECK:
                  helper.uralpro.log("SaveData [PlayDeck internal]", logStyle);
                  if (helper.uralpro.config.codeAfterSaving)
                    helper.uralpro.config.codeAfterSaving();
                  break;
                case PLATFORM_CRAZYGAMES:
                  helper.uralpro.log("SaveData [CrazyGames.SDK.data]", logStyle);
                  if (helper.uralpro.config.codeAfterSaving)
                    helper.uralpro.config.codeAfterSaving();
                  break;
                default:
                  helper.uralpro.log("SaveData [LocalStorage]", logStyle);
                  localStorage.setItem("uralpro_lastSaveTime", Date.now().toString());
                  if (helper.uralpro.config.codeAfterSaving)
                    helper.uralpro.config.codeAfterSaving();
                  break;
              }
            } else {
              helper.uralpro.log("NoSaveData [No changes]", helper.uralpro.logStyle("#707344", "black"));
            }
          } finally {
            helper.uralpro.set("_saveInProgress", false);
            if (helper.uralpro.get("_savePending")) {
              helper.uralpro.set("_savePending", false);
              api.saveDataUrgently();
            }
          }
        });
      }
    };
    return api;
  }

  // src/modules/platforms/platform_definition.js
  function detectPlatform() {
    const protocol = window.location.protocol;
    const href = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    if (protocol === "file:") {
      return PLATFORM_FILE;
    } else if (href.includes("yandex")) {
      return PLATFORM_YANDEX;
    } else if (href.includes("poki.com") || href.includes("poki")) {
      return PLATFORM_POKI;
    } else if (href.includes("crazygames.com") || href.includes("crazygames")) {
      return PLATFORM_CRAZYGAMES;
    } else if (href.includes("gamepix.com") || href.includes("gamepix")) {
      return PLATFORM_GAMEPIX;
    } else if (href.includes("vk.com") || href.includes("vk.ru") || searchParams.has("vk_app_id") || searchParams.has("vk_platform") || searchParams.has("vk_user_id") || searchParams.has("sign")) {
      return PLATFORM_VK;
    } else if (href.includes("t.me") || href.includes("telegram.me") || href.includes("playdeck") || window.self !== window.top && searchParams.has("playdeck")) {
      return PLATFORM_PLAYDECK;
    } else {
      return PLATFORM_UNKNOWN;
    }
  }
  function getPlatformFromUrl() {
    function getParam(name) {
      const match = new RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
      return match ? decodeURIComponent(match[1]) : null;
    }
    const platform_url = getParam("uralpro-platform");
    return platform_url || null;
  }
  function resolvePlatform() {
    var _a;
    let platform = detectPlatform();
    const platformFromUrl = getPlatformFromUrl();
    if (platformFromUrl && VALID_PLATFORMS_FROM_URL.includes(platformFromUrl)) {
      platform = platformFromUrl;
    }
    if (platform === PLATFORM_UNKNOWN && window.self !== window.top) {
      try {
        const parent = ((_a = window.parent) == null ? void 0 : _a.window) || window.parent;
        if (parent) {
          platform = PLATFORM_PLAYDECK;
        }
      } catch (e) {
      }
    }
    return platform;
  }

  // src/modules/platforms/yandex/index.js
  function createAdapter(helper) {
    const storage = typeof localStorage !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {
    } };
    return {
      getSdk: () => helper.uralpro.get("sdk"),
      getCooldownStorage: () => storage,
      showFullscreenAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onClose, onError }) {
          const sdk = helper.uralpro.get("sdk");
          if (!helper.uralpro.get("isSdkReady") || !(sdk == null ? void 0 : sdk.adv)) {
            helper.uralpro.warn("\u0420\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430.");
            onError == null ? void 0 : onError(helper.uralpro.get("platform"));
            return;
          }
          yield sdk.adv.showFullscreenAdv({
            callbacks: {
              onOpen: () => {
                helper.uralpro.log("\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430.");
                onOpen == null ? void 0 : onOpen();
              },
              onClose: () => {
                helper.uralpro.log("\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430.");
                onClose == null ? void 0 : onClose();
              },
              onError: (err) => {
                helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B:", err);
                onError == null ? void 0 : onError(err);
              }
            }
          });
        });
      },
      showRewardedAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onRewarded, onClose, onError }) {
          const sdk = helper.uralpro.get("sdk");
          if (!helper.uralpro.get("isSdkReady") || !(sdk == null ? void 0 : sdk.adv)) {
            helper.uralpro.warn("\u0420\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430.");
            return;
          }
          yield sdk.adv.showRewardedVideo({
            callbacks: {
              onOpen: () => {
                helper.uralpro.log("\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430.");
                onOpen == null ? void 0 : onOpen();
              },
              onRewarded: () => {
                helper.uralpro.log("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043D\u0430\u0433\u0440\u0430\u0434\u0443!");
                onRewarded == null ? void 0 : onRewarded();
              },
              onClose: () => {
                helper.uralpro.log("\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430.");
                onClose == null ? void 0 : onClose();
              },
              onError: (err) => {
                helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B:", err);
                onError == null ? void 0 : onError(err);
              }
            }
          });
        });
      },
      showBanner(visible) {
        const sdk = helper.uralpro.get("sdk");
        if (!(sdk == null ? void 0 : sdk.adv)) {
          if (typeof AndroidFunction !== "undefined") {
            const showBannerFn = typeof AndroidFunction.showBannerAd === "function" ? AndroidFunction.showBannerAd : AndroidFunction.startBannerAdYandexJ;
            if (typeof showBannerFn === "function" && visible)
              showBannerFn.call(AndroidFunction);
          } else {
            helper.uralpro.error("SDK \u0438\u043B\u0438 \u043C\u043E\u0434\u0443\u043B\u044C \u0440\u0435\u043A\u043B\u0430\u043C\u044B \u043D\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D");
          }
          return;
        }
        if (visible) {
          sdk.adv.showBannerAdv();
          helper.uralpro.log("\u0411\u0430\u043D\u043D\u0435\u0440 \u0440\u0435\u043A\u043B\u0430\u043C\u044B \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F.");
        } else {
          sdk.adv.hideBannerAdv();
          helper.uralpro.log("\u0411\u0430\u043D\u043D\u0435\u0440 \u0440\u0435\u043A\u043B\u0430\u043C\u044B \u0441\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F.");
        }
      },
      getLang: () => helper.uralpro.get("lang") || "en",
      pause: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.muteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      resume: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.unmuteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      isReady: () => !!helper.uralpro.get("isSdkReady")
    };
  }
  function setup(helper, context) {
    return __async(this, null, function* () {
      try {
        helper.uralpro.set("sdk", yield YaGames.init());
        helper.uralpro.log("Yandex SDK \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D.");
        helper.uralpro.set("isSdkReady", true);
        yield context.setupSafeStorage();
        yield context.getPlayerData();
        helper.uralpro.get("sdk").features.GamesAPI.getAllGames().then(({ games, developerURL }) => helper.uralpro.set("yandex_getAllGames", [games, developerURL])).catch((err) => helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0441\u043F\u0438\u0441\u043A\u0430 \u0438\u0433\u0440:", err));
        const yandexDomenLangYa = helper.uralpro.get("sdk").environment.i18n.lang;
        const languageURL1 = new URL(document.location).searchParams.get("lang");
        const browserLangFirstTwo = window.navigator.language.substring(0, 2);
        helper.uralpro.set("lang", yandexDomenLangYa || languageURL1 || browserLangFirstTwo);
        helper.uralpro.log("Yandex SDK \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D.");
        helper.lb.initializeLeaderboard();
        try {
          const result = yield helper.uralpro.get("sdk").feedback.canReview();
          helper.uralpro.set("yandex_canReview", result.value);
        } catch (e) {
          helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 checkCanreview:", e);
          helper.uralpro.set("yandex_canReview", false);
        }
        try {
          const result = yield helper.uralpro.get("sdk").getFlags();
          helper.uralpro.set("yandex_flags", result);
        } catch (e) {
          helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 flags:", e);
          helper.uralpro.set("yandex_flags", false);
        }
        try {
          const prompt = yield helper.uralpro.get("sdk").shortcut.canShowPrompt();
          helper.uralpro.set("shortcut_available", prompt.canShow);
        } catch (e) {
          helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u044F\u0440\u043B\u044B\u043A\u0430:", e);
          helper.uralpro.set("shortcut_available", false);
        }
        helper.uralpro.get("sdk").getPayments({ signed: false }).then((payments) => {
          payments.getPurchases().then(() => {
            helper.uralpro.set("yaPayments", payments);
          });
          payments.getCatalog().then((products) => {
            helper.uralpro.set("yandex_products", products);
            const firstProduct = Array.isArray(products) && products.length > 0 ? products[0] : null;
            if (firstProduct) {
              if (typeof firstProduct.getPriceCurrencyImage === "function") {
                try {
                  helper.uralpro.set("yandex_productsIconSVG", firstProduct.getPriceCurrencyImage("svg"));
                } catch (e) {
                  helper.uralpro.warn("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0438\u043A\u043E\u043D\u043A\u0443 \u0432\u0430\u043B\u044E\u0442\u044B \u0438\u0437 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430:", e);
                }
              }
              if (firstProduct.priceCurrencyCode) {
                helper.uralpro.set("yandex_productsNameV", firstProduct.priceCurrencyCode);
              }
            }
          });
        }).catch((err) => helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 getPayments:", err));
      } catch (error) {
        helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 Yandex SDK:", error);
        setTimeout(() => setup(helper, context), 1e3);
      }
    });
  }

  // src/modules/platforms/file/index.js
  function createAdapter2(helper) {
    const storage = typeof localStorage !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {
    } };
    return {
      getSdk: () => null,
      getCooldownStorage: () => storage,
      showFullscreenAd() {
        return __async(this, null, function* () {
        });
      },
      showRewardedAd() {
        return __async(this, null, function* () {
        });
      },
      showBanner() {
      },
      getLang: () => helper.uralpro.get("lang") || "en",
      pause: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.muteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      resume: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.unmuteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      isReady: () => true
    };
  }
  function setup2(helper, context) {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    const defaultLang = window.navigator.language.slice(0, 2);
    helper.uralpro.set("lang", urlLang || defaultLang);
    context.loadStartData();
    helper.uralpro.set("isLoaded", true);
    helper.uralpro.set("isSdkReady", true);
    helper.uralpro.set("isSdkReadyData", true);
    helper.uralpro.set("setup_saveData", 1);
    helper.saveData();
    setInterval(helper.saveData, 1e3 * 60);
  }

  // src/modules/platforms/vk/module.js
  function createVkModule(helper) {
    const api = {};
    api.bridge = () => {
      const sdk = helper.uralpro.get("sdk");
      return (sdk == null ? void 0 : sdk._bridge) || window.vkBridge || null;
    };
    api.storage = {
      // Размер чанка для VKWebAppStorageSet.
      // Лимит VK: ~4096 символов, для сериализованной строки ~2236,
      // поэтому берём безопасный размер 2000.
      _chunkSize: 2e3,
      _metaSuffix: "__p_count",
      _partPrefix: "__p_",
      _isMetaKey: (k) => typeof k === "string" && k.endsWith("__p_count"),
      _isPartKey: (k) => typeof k === "string" && k.includes("__p_"),
      _splitIntoChunks(str, chunkSize) {
        const s = String(str != null ? str : "");
        const size = Number(chunkSize) > 0 ? Number(chunkSize) : 3900;
        const out = [];
        for (let i = 0; i < s.length; i += size)
          out.push(s.slice(i, i + size));
        return out;
      },
      _getBridge: () => api.bridge(),
      _send: (method, payload) => __async(this, null, function* () {
        const bridge = api.storage._getBridge();
        if (!(bridge == null ? void 0 : bridge.send)) {
          const error = new Error("vkBridge \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043B\u044F \u043C\u0435\u0442\u043E\u0434\u0430 " + method);
          helper.uralpro.error(error.message);
          throw error;
        }
        try {
          const result = yield bridge.send(method, payload);
          if (result && result.error) {
            const error = new Error(result.error.error_msg || result.error.error_type || "VK Bridge error");
            helper.uralpro.error(`VK Bridge ${method} error:`, result.error);
            throw error;
          }
          return result;
        } catch (e) {
          helper.uralpro.error(`VK Bridge ${method} exception:`, e);
          throw e;
        }
      }),
      getAllRaw: () => __async(this, null, function* () {
        const prefix = helper.uralpro.save_id000;
        const raw = /* @__PURE__ */ new Map();
        const allKeys = [];
        let offset = 0;
        const count = 100;
        for (let guard = 0; guard < 200; guard++) {
          const res = yield api.storage._send("VKWebAppStorageGetKeys", { count, offset });
          const keys = Array.isArray(res == null ? void 0 : res.keys) ? res.keys : [];
          if (keys.length === 0)
            break;
          allKeys.push(...keys);
          if (keys.length < count)
            break;
          offset += keys.length;
        }
        const keysToLoad = allKeys.filter((k) => typeof k === "string" && k.startsWith(prefix));
        if (keysToLoad.length === 0)
          return raw;
        const batchSize = 100;
        for (let i = 0; i < keysToLoad.length; i += batchSize) {
          const batch = keysToLoad.slice(i, i + batchSize);
          const res = yield api.storage._send("VKWebAppStorageGet", { keys: batch });
          const pairs = Array.isArray(res == null ? void 0 : res.keys) ? res.keys : [];
          for (const kv of pairs) {
            if (!kv || typeof kv.key !== "string")
              continue;
            raw.set(kv.key, kv.value);
          }
        }
        return raw;
      }),
      resolveChunks(rawMap) {
        const resolved = /* @__PURE__ */ new Map();
        if (!rawMap || typeof rawMap.forEach !== "function")
          return resolved;
        rawMap.forEach((value, key) => {
          var _a;
          if (!api.storage._isMetaKey(key))
            return;
          const cnt = parseInt(String(value != null ? value : "0"), 10);
          if (!Number.isFinite(cnt) || cnt <= 0)
            return;
          const baseKey = key.slice(0, -api.storage._metaSuffix.length);
          let full = "";
          let ok = true;
          for (let i = 0; i < cnt; i++) {
            const partKey = baseKey + api.storage._partPrefix + i;
            if (!rawMap.has(partKey)) {
              ok = false;
              break;
            }
            full += String((_a = rawMap.get(partKey)) != null ? _a : "");
          }
          if (ok)
            resolved.set(baseKey, full);
        });
        rawMap.forEach((value, key) => {
          if (api.storage._isMetaKey(key))
            return;
          if (api.storage._isPartKey(key))
            return;
          if (!resolved.has(key))
            resolved.set(key, value);
        });
        return resolved;
      },
      /** Ключ одного blob в VK (как в Yandex — всё состояние одним запросом). */
      _blobKey: () => helper.uralpro.save_id000 + "_data",
      /** Загрузить один blob из VK (формат как Yandex: массив [[key, value], ...]). При недоступности VK — из localStorage. */
      getBlob: () => __async(this, null, function* () {
        const blobKey = api.storage._blobKey();
        const fromLocal = () => {
          try {
            return typeof localStorage !== "undefined" ? localStorage.getItem(blobKey) : null;
          } catch (e) {
            return null;
          }
        };
        const bridge = api.storage._getBridge();
        if (!(bridge == null ? void 0 : bridge.send))
          return fromLocal();
        const allKeys = [];
        let offset = 0;
        const count = 100;
        for (let g = 0; g < 50; g++) {
          const res2 = yield api.storage._send("VKWebAppStorageGetKeys", { count, offset });
          const keys = Array.isArray(res2 == null ? void 0 : res2.keys) ? res2.keys : [];
          if (keys.length === 0)
            break;
          const relevant = keys.filter((k) => k === blobKey || k === blobKey + api.storage._metaSuffix || typeof k === "string" && k.startsWith(blobKey + api.storage._partPrefix));
          allKeys.push(...relevant);
          if (keys.length < count)
            break;
          offset += keys.length;
        }
        const unique = [...new Set(allKeys)];
        if (unique.length === 0)
          return null;
        const res = yield api.storage._send("VKWebAppStorageGet", { keys: unique });
        const raw = /* @__PURE__ */ new Map();
        const pairs = Array.isArray(res == null ? void 0 : res.keys) ? res.keys : [];
        for (const kv of pairs) {
          if (kv && typeof kv.key === "string")
            raw.set(kv.key, kv.value);
        }
        const resolved = api.storage.resolveChunks(raw);
        const value = resolved.get(blobKey);
        if (value != null)
          return value;
        return fromLocal();
      }),
      /** Сохранить один blob в VK (один вызов setLarge = минимум запросов, как Yandex setData). */
      setBlob: (blobString) => __async(this, null, function* () {
        const blobKey = api.storage._blobKey();
        yield api.storage.setLarge(blobKey, blobString);
      }),
      preloadToMap: () => __async(this, null, function* () {
        try {
          const blob = yield api.storage.getBlob();
          const mapApp = helper.uralpro.get("mapDataApp");
          if (!mapApp)
            return;
          if (blob && typeof blob === "string") {
            try {
              const data = JSON.parse(blob);
              if (Array.isArray(data)) {
                for (const entry of data) {
                  if (Array.isArray(entry) && entry.length >= 2)
                    mapApp.set(entry[0], entry[1]);
                }
              }
            } catch (e) {
              helper.uralpro.warn("VK Storage: \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 blob", e);
            }
          }
          helper.uralpro.log(`VK Storage: \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E \u043A\u043B\u044E\u0447\u0435\u0439 ${mapApp.size} (\u043E\u0434\u0438\u043D blob, \u043E\u0434\u043D\u0430 \u043A\u0430\u0440\u0442\u0430 mapDataApp)`, helper.uralpro.logStyle("#2e2727", "#c7d2fe"));
        } catch (e) {
          helper.uralpro.warn("VK Storage getBlob:", e);
        }
      }),
      setLarge: (baseKey, value) => __async(this, null, function* () {
        const bridge = api.storage._getBridge();
        if (!bridge || typeof bridge.send !== "function") {
          const error = new Error("vkBridge \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043B\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F");
          helper.uralpro.error(error.message);
          throw error;
        }
        const k = String(baseKey);
        const v = String(value != null ? value : "");
        const metaKey = k + api.storage._metaSuffix;
        try {
          const isBlob = k === api.storage._blobKey();
          if (v.length <= api.storage._chunkSize) {
            const result1 = yield api.storage._send("VKWebAppStorageSet", { key: k, value: v });
            const result2 = yield api.storage._send("VKWebAppStorageSet", { key: metaKey, value: "0" });
            if (result1 && result1.error)
              throw new Error(result1.error.error_msg || result1.error.error_type);
            if (result2 && result2.error)
              throw new Error(result2.error.error_msg || result2.error.error_type);
            if (!isBlob)
              helper.uralpro.log(`VK Storage: \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D \u043A\u043B\u044E\u0447 ${k}`);
            return;
          }
          const chunks = api.storage._splitIntoChunks(v, api.storage._chunkSize);
          const metaResult = yield api.storage._send("VKWebAppStorageSet", { key: metaKey, value: String(chunks.length) });
          if (metaResult && metaResult.error)
            throw new Error(metaResult.error.error_msg || metaResult.error.error_type);
          for (let i = 0; i < chunks.length; i++) {
            const partKey = k + api.storage._partPrefix + i;
            const chunkResult = yield api.storage._send("VKWebAppStorageSet", { key: partKey, value: chunks[i] });
            if (chunkResult && chunkResult.error)
              throw new Error(chunkResult.error.error_msg || chunkResult.error.error_type);
          }
          if (!isBlob)
            helper.uralpro.log(`VK Storage: \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D \u043A\u043B\u044E\u0447 ${k} (${chunks.length} \u0447.)`);
        } catch (e) {
          helper.uralpro.error(`VK Storage: \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u043A\u043B\u044E\u0447\u0430 ${k}:`, e);
          throw e;
        }
      })
    };
    api.isVkEnvironment = () => {
      if (helper.platform === PLATFORM_VK)
        return true;
      const sp = new URLSearchParams(window.location.search);
      return sp.has("vk_app_id") || sp.has("vk_platform") || sp.has("vk_user_id") || sp.has("sign");
    };
    api.getUserInfo = () => __async(this, null, function* () {
      const bridge = api.bridge();
      if (!(bridge == null ? void 0 : bridge.send)) {
        helper.uralpro.warn("VK bridge \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D (getUserInfo).");
        return null;
      }
      try {
        return yield bridge.send("VKWebAppGetUserInfo");
      } catch (e) {
        helper.uralpro.error("VKWebAppGetUserInfo error:", e);
        return null;
      }
    });
    api.showInviteBox = () => __async(this, null, function* () {
      const bridge = api.bridge();
      if (!(bridge == null ? void 0 : bridge.send)) {
        helper.uralpro.warn("VK bridge \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D (showInviteBox).");
        return null;
      }
      try {
        return yield bridge.send("VKWebAppShowInviteBox");
      } catch (e) {
        helper.uralpro.error("VKWebAppShowInviteBox error:", e);
        return null;
      }
    });
    api.share = (..._0) => __async(this, [..._0], function* (link = window.location.href) {
      const bridge = api.bridge();
      if (bridge == null ? void 0 : bridge.send) {
        try {
          return yield bridge.send("VKWebAppShare", { link });
        } catch (e) {
          helper.uralpro.error("VKWebAppShare error:", e);
        }
      }
      try {
        window.open(`https://vk.com/share.php?url=${encodeURIComponent(link)}`, "_blank", "noopener,noreferrer");
      } catch (e) {
      }
      return null;
    });
    api.showWallPostBox = (..._0) => __async(this, [..._0], function* ({ message = "", attachments = "" } = {}) {
      const bridge = api.bridge();
      if (!(bridge == null ? void 0 : bridge.send)) {
        helper.uralpro.warn("VK bridge \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D (showWallPostBox).");
        return null;
      }
      try {
        const payload = {};
        if (message)
          payload.message = String(message);
        if (attachments)
          payload.attachments = String(attachments);
        return yield bridge.send("VKWebAppShowWallPostBox", payload);
      } catch (e) {
        helper.uralpro.error("VKWebAppShowWallPostBox error:", e);
        return null;
      }
    });
    api.api = (_0, ..._1) => __async(this, [_0, ..._1], function* (method, params = {}, accessToken, apiVersion = "5.131") {
      var _a;
      if (!method || typeof method !== "string")
        throw new Error("vk.api: method \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u043E\u0439");
      if (!accessToken)
        throw new Error("vk.api: \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F access_token (\u043D\u0435 \u0445\u0440\u0430\u043D\u0438\u0442\u0435 \u0435\u0433\u043E \u0432 \u043A\u043E\u0434\u0435; \u043F\u043E\u043B\u0443\u0447\u0430\u0439\u0442\u0435 \u0447\u0435\u0440\u0435\u0437 OAuth \u043D\u0430 \u0441\u0432\u043E\u0435\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u0435)");
      const url = new URL(`https://api.vk.com/method/${method}`);
      const p = __spreadProps(__spreadValues({}, params), { access_token: accessToken, v: apiVersion });
      Object.keys(p).forEach((k) => {
        if (p[k] === void 0 || p[k] === null)
          return;
        url.searchParams.set(k, String(p[k]));
      });
      const res = yield fetch(url.toString(), { method: "GET" });
      const json = yield res.json();
      if (json == null ? void 0 : json.error)
        throw json.error;
      return (_a = json == null ? void 0 : json.response) != null ? _a : json;
    });
    api.getOAuthUrl = ({ clientId, redirectUri, scope = "", display = "page", responseType = "token", state = "" } = {}) => {
      if (!clientId || !redirectUri)
        throw new Error("vk.getOAuthUrl: \u043D\u0443\u0436\u043D\u044B clientId \u0438 redirectUri");
      const url = new URL("https://oauth.vk.com/authorize");
      url.searchParams.set("client_id", String(clientId));
      url.searchParams.set("redirect_uri", String(redirectUri));
      url.searchParams.set("display", String(display));
      url.searchParams.set("scope", String(scope));
      url.searchParams.set("response_type", String(responseType));
      url.searchParams.set("v", "5.131");
      if (state)
        url.searchParams.set("state", String(state));
      return url.toString();
    };
    return api;
  }

  // src/modules/platforms/vk/index.js
  function createAdapter3(helper) {
    const storage = typeof localStorage !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {
    } };
    return {
      getSdk: () => helper.uralpro.get("sdk"),
      getCooldownStorage: () => storage,
      showFullscreenAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onClose, onError }) {
          const isReady = helper.uralpro.get("isSdkReady");
          const sdk = helper.uralpro.get("sdk");
          helper.uralpro.log("showFullscreenAd \u0432\u044B\u0437\u0432\u0430\u043D. isSdkReady:", isReady, "sdk:", !!sdk);
          if (!isReady || !sdk) {
            helper.uralpro.warn("VK SDK \u043D\u0435 \u0433\u043E\u0442\u043E\u0432. isSdkReady:", isReady, "sdk exists:", !!sdk);
            onError == null ? void 0 : onError();
            return;
          }
          if (!sdk.adv) {
            helper.uralpro.error("VK SDK \u043D\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u043E\u0431\u044A\u0435\u043A\u0442 adv:", sdk);
            onError == null ? void 0 : onError();
            return;
          }
          if (!sdk.adv.showFullscreenAdv) {
            helper.uralpro.error("VK SDK \u043D\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u043C\u0435\u0442\u043E\u0434 showFullscreenAdv. \u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u043C\u0435\u0442\u043E\u0434\u044B:", Object.keys(sdk.adv || {}));
            onError == null ? void 0 : onError();
            return;
          }
          try {
            helper.uralpro.log("\u0412\u044B\u0437\u043E\u0432 sdk.adv.showFullscreenAdv...");
            yield sdk.adv.showFullscreenAdv({
              callbacks: {
                onOpen: () => {
                  helper.uralpro.log("VK \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430.");
                  onOpen == null ? void 0 : onOpen();
                },
                onClose: () => {
                  helper.uralpro.log("VK \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430.");
                  onClose == null ? void 0 : onClose();
                },
                onError: (error) => {
                  helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B VK:", error);
                  onError == null ? void 0 : onError(error);
                }
              }
            });
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0432\u044B\u0437\u043E\u0432\u0435 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B VK:", e);
            onError == null ? void 0 : onError(e);
          }
        });
      },
      showRewardedAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onRewarded, onClose, onError }) {
          const sdk = helper.uralpro.get("sdk");
          if (!helper.uralpro.get("isSdkReady") || !(sdk == null ? void 0 : sdk.adv)) {
            helper.uralpro.warn("\u0420\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430.");
            onError == null ? void 0 : onError(helper.uralpro.get("platform"));
            return;
          }
          yield sdk.adv.showRewardedVideo({
            callbacks: {
              onOpen: () => {
                helper.uralpro.log("\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430.");
                onOpen == null ? void 0 : onOpen();
              },
              onRewarded: () => {
                helper.uralpro.log("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043D\u0430\u0433\u0440\u0430\u0434\u0443!");
                onRewarded == null ? void 0 : onRewarded();
              },
              onClose: () => {
                helper.uralpro.log("\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430.");
                onClose == null ? void 0 : onClose();
              },
              onError: (err) => {
                helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B:", err);
                onError == null ? void 0 : onError(err);
              }
            }
          });
        });
      },
      showBanner() {
      },
      getLang: () => helper.uralpro.get("lang") || "ru",
      pause: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.muteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      resume: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.unmuteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      isReady: () => !!helper.uralpro.get("isSdkReady")
    };
  }
  function setup3(helper, context) {
    return __async(this, null, function* () {
      try {
        helper.vk = createVkModule(helper);
        const params = new URLSearchParams(window.location.search);
        const langFromVk = params.get("vk_language");
        const langFromUrl = params.get("lang");
        const defaultLang = window.navigator.language.slice(0, 2);
        helper.uralpro.set("lang", langFromVk || langFromUrl || defaultLang);
        const startWithBridge = () => __async(this, null, function* () {
          const bridge = window.vkBridge;
          if (!bridge || typeof bridge.send !== "function") {
            helper.uralpro.error("vkBridge \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0438\u043B\u0438 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 send().");
            setup2(helper, context);
            return;
          }
          helper.uralpro.set("isLoaded", true);
          try {
            yield bridge.send("VKWebAppInit");
          } catch (e) {
            helper.uralpro.warn("VKWebAppInit \u0432\u0435\u0440\u043D\u0443\u043B \u043E\u0448\u0438\u0431\u043A\u0443:", e);
          }
          const vkSdk = {
            _bridge: bridge,
            isAvailableMethod: () => __async(this, null, function* () {
              return true;
            }),
            adv: {
              showFullscreenAdv: (..._0) => __async(this, [..._0], function* ({ callbacks } = {}) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                helper.uralpro.log("showFullscreenAdv: \u043D\u0430\u0447\u0430\u043B\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F");
                try {
                  let checkResult = null;
                  try {
                    checkResult = yield bridge.send("VKWebAppCheckNativeAds", { ad_format: "interstitial" });
                    helper.uralpro.log("VKWebAppCheckNativeAds(interstitial) result:", checkResult);
                    if (checkResult) {
                      if (checkResult.error) {
                        helper.uralpro.warn("VKWebAppCheckNativeAds \u0432\u0435\u0440\u043D\u0443\u043B error:", checkResult.error);
                      } else if (checkResult.result === false) {
                        helper.uralpro.warn("VKWebAppCheckNativeAds \u0432\u0435\u0440\u043D\u0443\u043B result: false (\u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043F\u0440\u043E\u0431\u0443\u0435\u043C \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C)");
                      } else if (checkResult.success === false) {
                        helper.uralpro.warn("VKWebAppCheckNativeAds \u0432\u0435\u0440\u043D\u0443\u043B success: false (\u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043F\u0440\u043E\u0431\u0443\u0435\u043C \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C)");
                      }
                    }
                  } catch (e) {
                    helper.uralpro.warn("VKWebAppCheckNativeAds(interstitial) error (\u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u043C \u043F\u043E\u043F\u044B\u0442\u043A\u0443):", e);
                  }
                  (_a = callbacks == null ? void 0 : callbacks.onOpen) == null ? void 0 : _a.call(callbacks);
                  try {
                    helper.uralpro.log("\u0412\u044B\u0437\u043E\u0432 VKWebAppShowNativeAds(interstitial)...");
                    const result = yield bridge.send("VKWebAppShowNativeAds", { ad_format: "interstitial" });
                    helper.uralpro.log("VKWebAppShowNativeAds(interstitial) result:", result);
                    if (result) {
                      if (result.error) {
                        const error = result.error;
                        helper.uralpro.error("VKWebAppShowNativeAds \u0432\u0435\u0440\u043D\u0443\u043B error:", error);
                        (_b = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _b.call(callbacks, error);
                        return;
                      }
                      if (result.result === false && result.success !== true) {
                        const error = new Error("VKWebAppShowNativeAds \u0432\u0435\u0440\u043D\u0443\u043B result: false");
                        helper.uralpro.error(error.message, result);
                        (_c = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _c.call(callbacks, error);
                        return;
                      }
                    }
                    helper.uralpro.log("VK \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430");
                    (_d = callbacks == null ? void 0 : callbacks.onClose) == null ? void 0 : _d.call(callbacks);
                  } catch (showError) {
                    helper.uralpro.error("VKWebAppShowNativeAds exception:", showError);
                    if (showError && typeof showError === "object") {
                      if (showError.error) {
                        (_e = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _e.call(callbacks, showError.error);
                      } else {
                        (_f = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _f.call(callbacks, showError);
                      }
                    } else {
                      (_g = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _g.call(callbacks, showError);
                    }
                  }
                } catch (error) {
                  helper.uralpro.error("\u041E\u0431\u0449\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 showFullscreenAdv:", error);
                  (_h = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _h.call(callbacks, error);
                }
              }),
              showRewardedVideo: (..._0) => __async(this, [..._0], function* ({ callbacks } = {}) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _i;
                helper.uralpro.log("showRewardedVideo: \u043D\u0430\u0447\u0430\u043B\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F");
                try {
                  let checkResult = null;
                  try {
                    checkResult = yield bridge.send("VKWebAppCheckNativeAds", { ad_format: "reward" });
                    helper.uralpro.log("VKWebAppCheckNativeAds(reward) result:", checkResult);
                    if (checkResult) {
                      if (checkResult.error) {
                        helper.uralpro.warn("VKWebAppCheckNativeAds \u0432\u0435\u0440\u043D\u0443\u043B error:", checkResult.error);
                      } else if (checkResult.result === false) {
                        helper.uralpro.warn("VKWebAppCheckNativeAds \u0432\u0435\u0440\u043D\u0443\u043B result: false (\u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043F\u0440\u043E\u0431\u0443\u0435\u043C \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C)");
                      } else if (checkResult.success === false) {
                        helper.uralpro.warn("VKWebAppCheckNativeAds \u0432\u0435\u0440\u043D\u0443\u043B success: false (\u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u043F\u0440\u043E\u0431\u0443\u0435\u043C \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C)");
                      }
                    }
                  } catch (e) {
                    helper.uralpro.warn("VKWebAppCheckNativeAds(reward) error (\u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u043C \u043F\u043E\u043F\u044B\u0442\u043A\u0443):", e);
                  }
                  (_a = callbacks == null ? void 0 : callbacks.onOpen) == null ? void 0 : _a.call(callbacks);
                  try {
                    helper.uralpro.log("\u0412\u044B\u0437\u043E\u0432 VKWebAppShowNativeAds(reward)...");
                    const res = yield bridge.send("VKWebAppShowNativeAds", { ad_format: "reward" });
                    helper.uralpro.log("VKWebAppShowNativeAds(reward):", JSON.stringify(res));
                    if (res) {
                      if (res.error) {
                        const error = res.error;
                        helper.uralpro.error("VKWebAppShowNativeAds \u0432\u0435\u0440\u043D\u0443\u043B error:", error);
                        (_b = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _b.call(callbacks, error);
                        return;
                      }
                      if (res.result === false && res.success !== true) {
                        const error = new Error("VKWebAppShowNativeAds \u0432\u0435\u0440\u043D\u0443\u043B result: false");
                        helper.uralpro.error(error.message, res);
                        (_c = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _c.call(callbacks, error);
                        return;
                      }
                    }
                    const isRewardGranted = (res == null ? void 0 : res.rewarded) === true || (res == null ? void 0 : res.reward) === true || (res == null ? void 0 : res.video_completed) === true || (res == null ? void 0 : res.result) === "rewarded" || (res == null ? void 0 : res.result) === "reward" || (res == null ? void 0 : res.result) === true || (res == null ? void 0 : res.success) === true || (res == null ? void 0 : res.status) === "success";
                    if (isRewardGranted) {
                      helper.uralpro.log("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043D\u0430\u0433\u0440\u0430\u0434\u0443 \u0437\u0430 \u043F\u043E\u043A\u0430\u0437 rewarded-\u0440\u0435\u043A\u043B\u0430\u043C\u044B VK. Result:", res);
                      (_d = callbacks == null ? void 0 : callbacks.onRewarded) == null ? void 0 : _d.call(callbacks);
                    } else {
                      helper.uralpro.log("\u0420\u0435\u043A\u043B\u0430\u043C\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430 \u0431\u0435\u0437 \u043F\u0440\u0438\u0437\u043D\u0430\u043A\u043E\u0432 \u043D\u0430\u0433\u0440\u0430\u0434\u044B. \u041D\u0430\u0433\u0440\u0430\u0434\u0430 \u041D\u0415 \u0432\u044B\u0434\u0430\u043D\u0430. Result:", res);
                    }
                    (_e = callbacks == null ? void 0 : callbacks.onClose) == null ? void 0 : _e.call(callbacks);
                  } catch (showError) {
                    helper.uralpro.error("VKWebAppShowNativeAds exception:", showError);
                    if (showError && typeof showError === "object") {
                      if (showError.error) {
                        (_f = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _f.call(callbacks, showError.error);
                      } else {
                        (_g = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _g.call(callbacks, showError);
                      }
                    } else {
                      (_h = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _h.call(callbacks, showError);
                    }
                  }
                } catch (error) {
                  helper.uralpro.error("\u041E\u0431\u0449\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 showRewardedVideo:", error);
                  (_i = callbacks == null ? void 0 : callbacks.onError) == null ? void 0 : _i.call(callbacks, error);
                }
              }),
              showBannerAdv: () => __async(this, null, function* () {
                try {
                  yield bridge.send("VKWebAppShowBannerAd", { banner_location: "bottom" });
                } catch (e) {
                  helper.uralpro.warn("VK banner ad:", e);
                }
              }),
              hideBannerAdv: () => __async(this, null, function* () {
                try {
                  yield bridge.send("VKWebAppHideBannerAd");
                } catch (e) {
                  helper.uralpro.warn("VK hide banner:", e);
                }
              })
            }
          };
          helper.uralpro.set("sdk", vkSdk);
          helper.uralpro.set("isSdkReady", true);
          try {
            yield helper.vk.storage.preloadToMap();
            helper.uralpro.log("VK Storage: \u0434\u0430\u043D\u043D\u044B\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u044B");
          } catch (e) {
            helper.uralpro.warn("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0434\u0433\u0440\u0443\u0437\u0438\u0442\u044C VK Storage (\u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u043C \u0440\u0430\u0431\u043E\u0442\u0443):", e);
          }
          context.loadStartData();
          helper.uralpro.set("isSdkReadyData", true);
          helper.uralpro.set("setup_saveData", 1);
          helper.saveData();
          setInterval(helper.saveData, 1e3 * 60);
          helper.uralpro.log("VK SDK (vk-bridge) \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D.");
        });
        if (typeof window.vkBridge === "undefined") {
          const sources = [
            "https://cdn.jsdelivr.net/npm/@vkontakte/vk-bridge/dist/browser.min.js",
            "https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js"
          ];
          const loadScript = (src) => new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = src;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error(`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C ${src}`));
            document.head.appendChild(s);
          });
          let loaded = false;
          for (const src of sources) {
            try {
              yield loadScript(src);
              loaded = true;
              break;
            } catch (e) {
              helper.uralpro.warn(String(e));
            }
          }
          if (!loaded) {
            helper.uralpro.error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C vk-bridge. \u041F\u0435\u0440\u0435\u0445\u043E\u0434\u0438\u043C \u0432 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C.");
            setup2(helper, context);
            return;
          }
        }
        yield startWithBridge();
      } catch (error) {
        helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 VK SDK:", error);
        setup2(helper, context);
      }
    });
  }

  // src/modules/platforms/poki/index.js
  function createAdapter4(helper) {
    const storage = typeof localStorage !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {
    } };
    return {
      getSdk: () => helper.uralpro.get("sdk"),
      getCooldownStorage: () => storage,
      showFullscreenAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onClose, onError }) {
          if (!helper.uralpro.get("isSdkReady") || !helper.uralpro.get("sdk")) {
            helper.uralpro.warn("\u0420\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430.");
            onError == null ? void 0 : onError();
            return;
          }
          try {
            helper.uralpro.log("\u041F\u043E\u043A\u0430\u0437 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B Poki (commercialBreak).");
            onOpen == null ? void 0 : onOpen();
            const sdk = helper.uralpro.get("sdk");
            if (typeof sdk.commercialBreak === "function")
              yield sdk.commercialBreak();
            helper.uralpro.log("\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 Poki \u0437\u0430\u043A\u0440\u044B\u0442\u0430.");
            onClose == null ? void 0 : onClose();
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B Poki:", e);
            onError == null ? void 0 : onError(e);
          }
        });
      },
      showRewardedAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onRewarded, onClose, onError }) {
          if (!helper.uralpro.get("isSdkReady") || !helper.uralpro.get("sdk")) {
            onError == null ? void 0 : onError();
            return;
          }
          try {
            helper.uralpro.log("\u041F\u043E\u043A\u0430\u0437 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B Poki (rewardedBreak).");
            onOpen == null ? void 0 : onOpen();
            const sdk = helper.uralpro.get("sdk");
            if (typeof sdk.rewardedBreak === "function") {
              yield sdk.rewardedBreak();
              helper.uralpro.log("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043D\u0430\u0433\u0440\u0430\u0434\u0443!");
              onRewarded == null ? void 0 : onRewarded();
            }
            helper.uralpro.log("\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 Poki \u0437\u0430\u043A\u0440\u044B\u0442\u0430.");
            onClose == null ? void 0 : onClose();
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B Poki:", e);
            onError == null ? void 0 : onError(e);
          }
        });
      },
      showBanner: () => {
      },
      getLang: () => helper.uralpro.get("lang") || "en",
      pause: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.muteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      resume: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.unmuteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      isReady: () => !!helper.uralpro.get("isSdkReady")
    };
  }
  function setup4(helper, context) {
    return __async(this, null, function* () {
      try {
        if (typeof PokiSDK === "undefined") {
          helper.uralpro.error("PokiSDK \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u0423\u0431\u0435\u0434\u0438\u0442\u0435\u0441\u044C, \u0447\u0442\u043E \u0441\u043A\u0440\u0438\u043F\u0442 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D.");
          setup2(helper, context);
          return;
        }
        yield PokiSDK.init();
        helper.uralpro.set("sdk", PokiSDK);
        helper.uralpro.log("Poki SDK \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D.");
        helper.uralpro.set("isSdkReady", true);
        const languageURL1 = new URL(document.location).searchParams.get("lang");
        const browserLangFirstTwo = window.navigator.language.substring(0, 2);
        helper.uralpro.set("lang", languageURL1 || browserLangFirstTwo);
        context.loadStartData();
        helper.uralpro.set("isSdkReadyData", true);
        helper.uralpro.set("setup_saveData", 1);
        helper.saveData();
        setInterval(helper.saveData, 1e3 * 60);
        helper.uralpro.log("Poki SDK \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D.");
      } catch (error) {
        helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 Poki SDK:", error);
        setup2(helper, context);
      }
    });
  }

  // src/modules/platforms/crazygames/index.js
  var BANNER_ID = "uralpro-crazy-banner";
  function createCrazyGamesStorage(helper) {
    const CHUNK_SIZE2 = 2e3;
    const META_SUFFIX2 = "__p_count";
    const PART_PREFIX2 = "__p_";
    const getData = () => {
      var _a2, _b;
      return (_b = (_a2 = window.CrazyGames) == null ? void 0 : _a2.SDK) == null ? void 0 : _b.data;
    };
    const blobKey = () => helper.uralpro.save_id000 + "_data";
    const metaKey = () => blobKey() + META_SUFFIX2;
    const splitIntoChunks = (str, size) => {
      const s = String(str != null ? str : "");
      const out = [];
      for (let i = 0; i < s.length; i += size)
        out.push(s.slice(i, i + size));
      return out;
    };
    return {
      getBlob() {
        return __async(this, null, function* () {
          const data = getData();
          if (!(data == null ? void 0 : data.getItem))
            return null;
          const key = blobKey();
          const meta = metaKey();
          try {
            const countStr = data.getItem(meta);
            const count = countStr != null ? parseInt(String(countStr), 10) : 0;
            if (Number.isFinite(count) && count > 0) {
              let full = "";
              for (let i = 0; i < count; i++) {
                const part = data.getItem(key + PART_PREFIX2 + i);
                if (part != null)
                  full += part;
              }
              return full || null;
            }
            return data.getItem(key);
          } catch (e) {
            helper.uralpro.warn("CrazyGames getBlob:", e);
            return null;
          }
        });
      },
      setBlob(blobString) {
        return __async(this, null, function* () {
          const data = getData();
          if (!(data == null ? void 0 : data.setItem)) {
            helper.uralpro.error("CrazyGames.SDK.data \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043B\u044F setBlob");
            return;
          }
          const key = blobKey();
          const meta = metaKey();
          const str = String(blobString != null ? blobString : "");
          try {
            if (str.length <= CHUNK_SIZE2) {
              data.setItem(key, str);
              data.setItem(meta, "0");
              helper.uralpro.log("CrazyGames: blob \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D (\u043E\u0434\u0438\u043D \u043A\u043B\u044E\u0447)");
              return;
            }
            const chunks = splitIntoChunks(str, CHUNK_SIZE2);
            data.setItem(meta, String(chunks.length));
            for (let i = 0; i < chunks.length; i++) {
              data.setItem(key + PART_PREFIX2 + i, chunks[i]);
            }
            helper.uralpro.log(`CrazyGames: blob \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D (${chunks.length} \u0447\u0430\u043D\u043A\u043E\u0432)`);
          } catch (e) {
            helper.uralpro.error("CrazyGames setBlob:", e);
            throw e;
          }
        });
      },
      preloadToMap() {
        return __async(this, null, function* () {
          try {
            const blob = yield this.getBlob();
            const mapApp = helper.uralpro.get("mapDataApp");
            if (!mapApp)
              return;
            if (blob && typeof blob === "string") {
              try {
                const data = JSON.parse(blob);
                if (Array.isArray(data)) {
                  for (const entry of data) {
                    if (Array.isArray(entry) && entry.length >= 2)
                      mapApp.set(entry[0], entry[1]);
                  }
                }
              } catch (e) {
                helper.uralpro.warn("CrazyGames Storage: \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 blob", e);
              }
            }
            helper.uralpro.log(`CrazyGames Storage: \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E \u043A\u043B\u044E\u0447\u0435\u0439 ${mapApp.size} (blob \u0432 \u0447\u0430\u043D\u043A\u0430\u0445)`, helper.uralpro.logStyle("#2e2727", "#c7d2fe"));
          } catch (e) {
            helper.uralpro.warn("CrazyGames Storage getBlob:", e);
          }
        });
      }
    };
  }
  function createAdapter5(helper) {
    const storage = typeof localStorage !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {
    } };
    return {
      getSdk: () => {
        var _a2;
        return typeof window !== "undefined" && ((_a2 = window.CrazyGames) == null ? void 0 : _a2.SDK) ? window.CrazyGames.SDK : null;
      },
      getCooldownStorage: () => storage,
      showFullscreenAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onClose, onError }) {
          var _a2, _b;
          if (!helper.uralpro.get("isSdkReady") || !((_b = (_a2 = window.CrazyGames) == null ? void 0 : _a2.SDK) == null ? void 0 : _b.ad)) {
            helper.uralpro.warn("\u0420\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430.");
            onError == null ? void 0 : onError();
            return;
          }
          try {
            helper.uralpro.log("\u041F\u043E\u043A\u0430\u0437 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B CrazyGames (midgame).");
            yield new Promise((resolve) => {
              let didPause = false;
              window.CrazyGames.SDK.ad.requestAd("midgame", {
                adStarted: () => {
                  helper.uralpro.log("\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 CrazyGames \u043E\u0442\u043A\u0440\u044B\u0442\u0430.");
                  onOpen == null ? void 0 : onOpen();
                  if (!didPause && typeof window.onHiddenPause === "function") {
                    didPause = true;
                    try {
                      window.onHiddenPause();
                    } catch (e) {
                    }
                  }
                },
                adError: (err) => {
                  helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B CrazyGames:", err);
                  onError == null ? void 0 : onError(err);
                  if (didPause && typeof window.onVisiblePause === "function") {
                    try {
                      window.onVisiblePause();
                    } catch (e) {
                    }
                  }
                  resolve();
                },
                adFinished: () => {
                  helper.uralpro.log("\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 CrazyGames \u0437\u0430\u043A\u0440\u044B\u0442\u0430.");
                  onClose == null ? void 0 : onClose();
                  if (didPause && typeof window.onVisiblePause === "function") {
                    try {
                      window.onVisiblePause();
                    } catch (e) {
                    }
                  }
                  resolve();
                }
              });
            });
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B CrazyGames:", e);
            onError == null ? void 0 : onError(e);
          }
        });
      },
      showRewardedAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onRewarded, onClose, onError }) {
          var _a2, _b;
          if (!helper.uralpro.get("isSdkReady") || !((_b = (_a2 = window.CrazyGames) == null ? void 0 : _a2.SDK) == null ? void 0 : _b.ad)) {
            onError == null ? void 0 : onError();
            return;
          }
          try {
            helper.uralpro.log("\u041F\u043E\u043A\u0430\u0437 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B CrazyGames (rewarded).");
            yield new Promise((resolve) => {
              let didPause = false;
              window.CrazyGames.SDK.ad.requestAd("rewarded", {
                adStarted: () => {
                  helper.uralpro.log("\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 CrazyGames \u043E\u0442\u043A\u0440\u044B\u0442\u0430.");
                  onOpen == null ? void 0 : onOpen();
                  if (!didPause && typeof window.onHiddenPause === "function") {
                    didPause = true;
                    try {
                      window.onHiddenPause();
                    } catch (e) {
                    }
                  }
                },
                adError: (err) => {
                  helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B CrazyGames:", err);
                  onError == null ? void 0 : onError(err);
                  if (didPause && typeof window.onVisiblePause === "function") {
                    try {
                      window.onVisiblePause();
                    } catch (e) {
                    }
                  }
                  resolve();
                },
                adFinished: () => {
                  helper.uralpro.log("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043D\u0430\u0433\u0440\u0430\u0434\u0443 (CrazyGames).");
                  onRewarded == null ? void 0 : onRewarded();
                  onClose == null ? void 0 : onClose();
                  if (didPause && typeof window.onVisiblePause === "function") {
                    try {
                      window.onVisiblePause();
                    } catch (e) {
                    }
                  }
                  resolve();
                }
              });
            });
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B CrazyGames:", e);
            onError == null ? void 0 : onError(e);
          }
        });
      },
      showBanner(visible) {
        var _a2, _b;
        if (!((_b = (_a2 = window.CrazyGames) == null ? void 0 : _a2.SDK) == null ? void 0 : _b.banner))
          return;
        if (visible) {
          let el = document.getElementById(BANNER_ID);
          if (!el) {
            el = document.createElement("div");
            el.id = BANNER_ID;
            Object.assign(el.style, { width: "300px", height: "250px", position: "fixed", bottom: "0", left: "0", zIndex: "9998", pointerEvents: "auto", overflow: "hidden" });
            document.body.appendChild(el);
          }
          el.style.display = "";
          el.style.visibility = "";
          window.CrazyGames.SDK.banner.requestBanner({ id: BANNER_ID, width: 300, height: 250 }).catch((e) => {
            helper.uralpro.error("CrazyGames \u0431\u0430\u043D\u043D\u0435\u0440:", e);
            const container = document.getElementById(BANNER_ID);
            if (container == null ? void 0 : container.parentNode)
              container.parentNode.removeChild(container);
          });
          helper.uralpro.log("\u0411\u0430\u043D\u043D\u0435\u0440 CrazyGames \u0437\u0430\u043F\u0440\u043E\u0448\u0435\u043D.");
        } else {
          if (window.CrazyGames.SDK.banner.clearAllBanners)
            window.CrazyGames.SDK.banner.clearAllBanners();
          const el = document.getElementById(BANNER_ID);
          if (el == null ? void 0 : el.parentNode)
            el.parentNode.removeChild(el);
          helper.uralpro.log("\u0411\u0430\u043D\u043D\u0435\u0440 CrazyGames \u0441\u043A\u0440\u044B\u0442 \u0438 \u043A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0443\u0434\u0430\u043B\u0451\u043D.");
        }
      },
      getLang: () => helper.uralpro.get("lang") || "en",
      pause: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.muteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      resume: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.unmuteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      isReady: () => !!helper.uralpro.get("isSdkReady")
    };
  }
  function setup5(helper, context) {
    return __async(this, null, function* () {
      var _a;
      try {
        const CG = (_a = window.CrazyGames) == null ? void 0 : _a.SDK;
        if (!CG) {
          helper.uralpro.error("CrazyGames SDK \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u0435 https://sdk.crazygames.com/crazygames-sdk-v3.js");
          setup2(helper, context);
          return;
        }
        yield CG.init();
        const env = CG.environment;
        if (env === "disabled") {
          helper.uralpro.warn("CrazyGames SDK \u0432 \u0440\u0435\u0436\u0438\u043C\u0435 disabled. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u0440\u0443\u0436\u0435\u043D\u0438\u0435.");
          setup2(helper, context);
          return;
        }
        helper.uralpro.set("sdk", CG);
        helper.uralpro.log("CrazyGames SDK \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D (environment: " + env + ").");
        helper.uralpro.set("isSdkReady", true);
        helper.crazygames = { storage: createCrazyGamesStorage(helper) };
        if (CG.data && typeof CG.data.getItem === "function" && typeof CG.data.setItem === "function") {
          helper.uralpro.log("\u0425\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 CrazyGames.SDK.data \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E (blob \u0432 \u0447\u0430\u043D\u043A\u0430\u0445, \u043A\u0430\u043A VK).");
          yield helper.crazygames.storage.preloadToMap();
        } else {
          helper.uralpro.warn("CrazyGames.SDK.data \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u2014 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u043C\u043E\u0433\u0443\u0442 \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C.");
        }
        const languageURL1 = new URL(document.location).searchParams.get("lang");
        const browserLangFirstTwo = window.navigator.language.substring(0, 2);
        helper.uralpro.set("lang", languageURL1 || browserLangFirstTwo);
        context.loadStartData();
        helper.uralpro.set("isSdkReadyData", true);
        helper.uralpro.set("setup_saveData", 1);
        helper.saveData();
        setInterval(helper.saveData, 1e3 * 60);
        helper.uralpro.log("CrazyGames SDK \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D.");
      } catch (error) {
        helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 CrazyGames SDK:", error);
        setup2(helper, context);
      }
    });
  }

  // src/modules/platforms/gamepix/module.js
  var CHUNK_SIZE = 2e3;
  var META_SUFFIX = "__p_count";
  var PART_PREFIX = "__p_";
  function createGamepixStorage(helper, api) {
    const blobKey = () => helper.uralpro.save_id000 + "_data";
    const metaKey = () => blobKey() + META_SUFFIX;
    const getStorage = () => {
      const sdk = api.sdk();
      return (sdk == null ? void 0 : sdk.localStorage) || null;
    };
    const splitIntoChunks = (str, size) => {
      const s = String(str != null ? str : "");
      const out = [];
      for (let i = 0; i < s.length; i += size)
        out.push(s.slice(i, i + size));
      return out;
    };
    return {
      getBlob() {
        const storage = getStorage();
        if (!(storage == null ? void 0 : storage.getItem))
          return null;
        const key = blobKey();
        const meta = metaKey();
        try {
          const countStr = storage.getItem(meta);
          const count = countStr != null ? parseInt(String(countStr), 10) : 0;
          if (Number.isFinite(count) && count > 0) {
            let full = "";
            for (let i = 0; i < count; i++) {
              const part = storage.getItem(key + PART_PREFIX + i);
              if (part != null)
                full += part;
            }
            return full || null;
          }
          return storage.getItem(key);
        } catch (e) {
          helper.uralpro.warn("GamePix getBlob:", e);
          return null;
        }
      },
      setBlob(blobString) {
        const storage = getStorage();
        if (!(storage == null ? void 0 : storage.setItem)) {
          helper.uralpro.error("GamePix.localStorage \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043B\u044F setBlob");
          return;
        }
        const key = blobKey();
        const meta = metaKey();
        const str = String(blobString != null ? blobString : "");
        try {
          if (str.length <= CHUNK_SIZE) {
            storage.setItem(key, str);
            storage.setItem(meta, "0");
            helper.uralpro.log("GamePix: blob \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D (\u043E\u0434\u0438\u043D \u043A\u043B\u044E\u0447)");
            return;
          }
          const chunks = splitIntoChunks(str, CHUNK_SIZE);
          storage.setItem(meta, String(chunks.length));
          for (let i = 0; i < chunks.length; i++) {
            storage.setItem(key + PART_PREFIX + i, chunks[i]);
          }
          helper.uralpro.log(`GamePix: blob \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D (${chunks.length} \u0447\u0430\u043D\u043A\u043E\u0432)`);
        } catch (e) {
          helper.uralpro.error("GamePix setBlob:", e);
          throw e;
        }
      },
      preloadToMap() {
        try {
          const blob = this.getBlob();
          const mapApp = helper.uralpro.get("mapDataApp");
          if (!mapApp)
            return;
          if (blob && typeof blob === "string") {
            try {
              const data = JSON.parse(blob);
              if (Array.isArray(data)) {
                for (const entry of data) {
                  if (Array.isArray(entry) && entry.length >= 2)
                    mapApp.set(entry[0], entry[1]);
                }
              }
            } catch (e) {
              helper.uralpro.warn("GamePix Storage: \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 blob", e);
            }
          }
          helper.uralpro.log(`GamePix Storage: \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E \u043A\u043B\u044E\u0447\u0435\u0439 ${mapApp.size} (blob \u0432 \u0447\u0430\u043D\u043A\u0430\u0445)`, helper.uralpro.logStyle("#2e2727", "#c7d2fe"));
        } catch (e) {
          helper.uralpro.warn("GamePix Storage getBlob:", e);
        }
      }
    };
  }
  function createGamepixModule(helper) {
    const api = {};
    api.isGamePixEnvironment = () => helper.platform === PLATFORM_GAMEPIX;
    api.sdk = () => helper.uralpro.get("sdk");
    api._ensureLoadedCalled = () => {
      const sdk = api.sdk();
      if (!sdk || typeof sdk.loaded !== "function")
        return true;
      if (helper.uralpro.get("gamepix_loaded_called"))
        return true;
      if (!helper.uralpro.get("isGameReady"))
        return false;
      try {
        sdk.loaded();
        helper.uralpro.set("gamepix_loaded_called", true);
        return true;
      } catch (e) {
        helper.uralpro.error("GamePix.loaded error:", e);
        return false;
      }
    };
    api.langDOC = () => {
      const sdk = api.sdk();
      try {
        if (sdk && typeof sdk.lang === "function")
          return sdk.lang();
      } catch (e) {
      }
      return helper.uralpro.get("lang") || "en";
    };
    api.happyMoment = () => {
      const sdk = api.sdk();
      if (!sdk || typeof sdk.happyMoment !== "function") {
        helper.uralpro.warn("GamePix SDK \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D (happyMoment).");
        return null;
      }
      api._ensureLoadedCalled();
      try {
        return sdk.happyMoment();
      } catch (e) {
        helper.uralpro.error("GamePix.happyMoment error:", e);
        return null;
      }
    };
    api.updateScoreDOC = (value) => {
      const sdk = api.sdk();
      if (!sdk || typeof sdk.updateScore !== "function")
        return;
      if (typeof value !== "number" || !Number.isFinite(value))
        return;
      api._ensureLoadedCalled();
      try {
        sdk.updateScore(value);
      } catch (e) {
        helper.uralpro.error("GamePix.updateScore error:", e);
      }
    };
    api.updateLevelDOC = (value) => {
      const sdk = api.sdk();
      if (!sdk || typeof sdk.updateLevel !== "function")
        return;
      if (typeof value !== "number" || !Number.isFinite(value))
        return;
      api._ensureLoadedCalled();
      try {
        sdk.updateLevel(value);
      } catch (e) {
        helper.uralpro.error("GamePix.updateLevel error:", e);
      }
    };
    api.localStorageDOC = {
      getItem: (key) => {
        var _a;
        const sdk = api.sdk();
        if (!((_a = sdk == null ? void 0 : sdk.localStorage) == null ? void 0 : _a.getItem))
          return null;
        try {
          return sdk.localStorage.getItem(String(key));
        } catch (e) {
          helper.uralpro.error("GamePix.localStorage.getItem error:", e);
          return null;
        }
      },
      setItem: (key, value) => {
        var _a;
        const sdk = api.sdk();
        if (!((_a = sdk == null ? void 0 : sdk.localStorage) == null ? void 0 : _a.setItem))
          return null;
        try {
          return sdk.localStorage.setItem(String(key), String(value));
        } catch (e) {
          helper.uralpro.error("GamePix.localStorage.setItem error:", e);
          return null;
        }
      },
      removeItem: (key) => {
        var _a;
        const sdk = api.sdk();
        if (!((_a = sdk == null ? void 0 : sdk.localStorage) == null ? void 0 : _a.removeItem))
          return null;
        try {
          return sdk.localStorage.removeItem(String(key));
        } catch (e) {
          helper.uralpro.error("GamePix.localStorage.removeItem error:", e);
          return null;
        }
      }
    };
    api.storage = createGamepixStorage(helper, api);
    api.pause = () => {
      var _a;
      if (typeof window.onHiddenPause === "function") {
        try {
          window.onHiddenPause();
        } catch (e) {
        }
        return;
      }
      if ((_a = helper.uralpro.config) == null ? void 0 : _a.audioMuteDocumentVisibility) {
        try {
          helper.audio.muteAll();
        } catch (e) {
        }
      }
    };
    api.resume = () => {
      var _a;
      if (typeof window.onVisiblePause === "function") {
        try {
          window.onVisiblePause();
        } catch (e) {
        }
        return;
      }
      if ((_a = helper.uralpro.config) == null ? void 0 : _a.audioMuteDocumentVisibility) {
        try {
          helper.audio.unmuteAll();
        } catch (e) {
        }
      }
    };
    api.interstitialAdDOC = () => __async(this, null, function* () {
      const sdk = api.sdk();
      if (!sdk || typeof sdk.interstitialAd !== "function")
        return { success: false };
      let didPause = false;
      if (typeof window.onHiddenPause === "function") {
        didPause = true;
        try {
          window.onHiddenPause();
        } catch (e) {
        }
      }
      api._ensureLoadedCalled();
      try {
        const res = yield sdk.interstitialAd();
        return res || { success: false };
      } finally {
        if (didPause && typeof window.onVisiblePause === "function") {
          try {
            window.onVisiblePause();
          } catch (e) {
          }
        }
      }
    });
    api.rewardAdDOC = () => __async(this, null, function* () {
      const sdk = api.sdk();
      if (!sdk || typeof sdk.rewardAd !== "function")
        return { success: false };
      let didPause = false;
      if (typeof window.onHiddenPause === "function") {
        didPause = true;
        try {
          window.onHiddenPause();
        } catch (e) {
        }
      }
      api._ensureLoadedCalled();
      try {
        const res = yield sdk.rewardAd();
        return res || { success: false };
      } finally {
        if (didPause && typeof window.onVisiblePause === "function") {
          try {
            window.onVisiblePause();
          } catch (e) {
          }
        }
      }
    });
    return api;
  }

  // src/modules/platforms/gamepix/index.js
  function createAdapter6(helper) {
    var _a;
    const storage = typeof window !== "undefined" && ((_a = window.GamePix) == null ? void 0 : _a.localStorage) ? window.GamePix.localStorage : typeof localStorage !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {
    } };
    function ensureLoaded() {
      const sdk = helper.uralpro.get("sdk");
      if (!sdk || typeof sdk.loaded !== "function")
        return true;
      if (helper.uralpro.get("gamepix_loaded_called"))
        return true;
      if (!helper.uralpro.get("isGameReady"))
        return false;
      try {
        sdk.loaded();
        helper.uralpro.set("gamepix_loaded_called", true);
        return true;
      } catch (e) {
        helper.uralpro.error("GamePix.loaded error:", e);
        return false;
      }
    }
    return {
      getSdk: () => helper.uralpro.get("sdk"),
      getCooldownStorage: () => storage,
      showFullscreenAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onClose, onError }) {
          if (!helper.uralpro.get("isSdkReady") || !helper.uralpro.get("sdk")) {
            helper.uralpro.warn("\u0420\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430.");
            onError == null ? void 0 : onError();
            return;
          }
          const sdk = helper.uralpro.get("sdk");
          let didPause = false;
          if (typeof window.onHiddenPause === "function") {
            didPause = true;
            try {
              window.onHiddenPause();
            } catch (e) {
            }
          }
          if (sdk && typeof sdk.loaded === "function" && !helper.uralpro.get("gamepix_loaded_called") && helper.uralpro.get("isGameReady")) {
            try {
              sdk.loaded();
              helper.uralpro.set("gamepix_loaded_called", true);
            } catch (e) {
            }
          }
          onOpen == null ? void 0 : onOpen();
          try {
            const res = typeof (sdk == null ? void 0 : sdk.interstitialAd) === "function" ? yield sdk.interstitialAd() : null;
            if (res == null ? void 0 : res.success) {
            } else
              helper.uralpro.warn("GamePix interstitialAd: \u0440\u0435\u043A\u043B\u0430\u043C\u044B \u043D\u0435\u0442/\u043D\u0435 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430.", res);
            helper.uralpro.log("\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 GamePix \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430.");
            onClose == null ? void 0 : onClose();
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B GamePix:", e);
            onError == null ? void 0 : onError(e);
          } finally {
            if (didPause && typeof window.onVisiblePause === "function") {
              try {
                window.onVisiblePause();
              } catch (e) {
              }
            }
          }
        });
      },
      showRewardedAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onRewarded, onClose, onError }) {
          if (!helper.uralpro.get("isSdkReady") || !helper.uralpro.get("sdk")) {
            onError == null ? void 0 : onError();
            return;
          }
          const sdk = helper.uralpro.get("sdk");
          let didPause = false;
          if (typeof window.onHiddenPause === "function") {
            didPause = true;
            try {
              window.onHiddenPause();
            } catch (e) {
            }
          }
          if (sdk && typeof sdk.loaded === "function" && !helper.uralpro.get("gamepix_loaded_called") && helper.uralpro.get("isGameReady")) {
            try {
              sdk.loaded();
              helper.uralpro.set("gamepix_loaded_called", true);
            } catch (e) {
            }
          }
          onOpen == null ? void 0 : onOpen();
          try {
            const res = typeof (sdk == null ? void 0 : sdk.rewardAd) === "function" ? yield sdk.rewardAd() : null;
            if (res == null ? void 0 : res.success) {
              helper.uralpro.log("GamePix rewardAd: \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043D\u0430\u0433\u0440\u0430\u0434\u0443.");
              onRewarded == null ? void 0 : onRewarded();
            } else {
              helper.uralpro.warn("GamePix rewardAd: \u043D\u0430\u0433\u0440\u0430\u0434\u0430 \u043D\u0435 \u0432\u044B\u0434\u0430\u043D\u0430.", res);
              onError == null ? void 0 : onError(res);
            }
            helper.uralpro.log("\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 GamePix \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430.");
            onClose == null ? void 0 : onClose();
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B GamePix:", e);
            onError == null ? void 0 : onError(e);
          } finally {
            if (didPause && typeof window.onVisiblePause === "function") {
              try {
                window.onVisiblePause();
              } catch (e) {
              }
            }
          }
        });
      },
      showBanner() {
      },
      getLang: () => {
        const sdk = helper.uralpro.get("sdk");
        try {
          if (sdk && typeof sdk.lang === "function")
            return sdk.lang();
        } catch (e) {
        }
        return helper.uralpro.get("lang") || "en";
      },
      pause: () => {
        var _a2, _b2, _c;
        if (typeof window.onHiddenPause === "function") {
          try {
            window.onHiddenPause();
          } catch (e) {
          }
          ;
          return;
        }
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b2 = helper.audio) == null ? void 0 : _b2.muteAll) == null ? void 0 : _c.call(_b2);
          } catch (e) {
          }
      },
      resume: () => {
        var _a2, _b2, _c;
        if (typeof window.onVisiblePause === "function") {
          try {
            window.onVisiblePause();
          } catch (e) {
          }
          ;
          return;
        }
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b2 = helper.audio) == null ? void 0 : _b2.unmuteAll) == null ? void 0 : _c.call(_b2);
          } catch (e) {
          }
      },
      isReady: () => !!helper.uralpro.get("isSdkReady"),
      ensureLoaded
    };
  }
  function setup6(helper, context) {
    return __async(this, null, function* () {
      var _a, _b;
      try {
        helper.gamepix = createGamepixModule(helper);
        if (typeof window.GamePix === "undefined") {
          helper.uralpro.error("GamePix SDK \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u0423\u0431\u0435\u0434\u0438\u0442\u0435\u0441\u044C, \u0447\u0442\u043E \u0441\u043A\u0440\u0438\u043F\u0442 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D.");
          setup2(helper, context);
          return;
        }
        helper.uralpro.set("sdk", window.GamePix);
        helper.uralpro.log("GamePix SDK \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D.");
        helper.uralpro.set("isLoaded", true);
        helper.uralpro.set("isSdkReady", true);
        try {
          const GP = window.GamePix;
          if (GP) {
            if (!GP.localStorageDOC && GP.localStorage)
              GP.localStorageDOC = GP.localStorage;
            if (!GP.interstitialAdDOC)
              GP.interstitialAdDOC = () => {
                var _a2, _b2;
                return (_b2 = (_a2 = helper.gamepix) == null ? void 0 : _a2.interstitialAdDOC) == null ? void 0 : _b2.call(_a2);
              };
            if (!GP.rewardAdDOC)
              GP.rewardAdDOC = () => {
                var _a2, _b2;
                return (_b2 = (_a2 = helper.gamepix) == null ? void 0 : _a2.rewardAdDOC) == null ? void 0 : _b2.call(_a2);
              };
            if (!GP.updateScoreDOC)
              GP.updateScoreDOC = (v) => {
                var _a2, _b2;
                return (_b2 = (_a2 = helper.gamepix) == null ? void 0 : _a2.updateScoreDOC) == null ? void 0 : _b2.call(_a2, v);
              };
            if (!GP.updateLevelDOC)
              GP.updateLevelDOC = (v) => {
                var _a2, _b2;
                return (_b2 = (_a2 = helper.gamepix) == null ? void 0 : _a2.updateLevelDOC) == null ? void 0 : _b2.call(_a2, v);
              };
            if (!GP.langDOC)
              GP.langDOC = () => {
                var _a2, _b2;
                return (_b2 = (_a2 = helper.gamepix) == null ? void 0 : _a2.langDOC) == null ? void 0 : _b2.call(_a2);
              };
            if (!GP.happyMomentDOC)
              GP.happyMomentDOC = () => {
                var _a2, _b2;
                return (_b2 = (_a2 = helper.gamepix) == null ? void 0 : _a2.happyMoment) == null ? void 0 : _b2.call(_a2);
              };
            if (!GP.pause)
              GP.pause = () => {
                var _a2, _b2;
                return (_b2 = (_a2 = helper.gamepix) == null ? void 0 : _a2.pause) == null ? void 0 : _b2.call(_a2);
              };
            if (!GP.resume)
              GP.resume = () => {
                var _a2, _b2;
                return (_b2 = (_a2 = helper.gamepix) == null ? void 0 : _a2.resume) == null ? void 0 : _b2.call(_a2);
              };
          }
        } catch (e) {
          helper.uralpro.warn("GamePix DOC export error:", e);
        }
        try {
          if (typeof window.GamePix.lang === "function") {
            const gpLang = window.GamePix.lang();
            if (gpLang)
              helper.uralpro.set("lang", gpLang);
          }
        } catch (e) {
        }
        if (!helper.uralpro.get("lang")) {
          const languageURL1 = new URL(document.location).searchParams.get("lang");
          const browserLangFirstTwo = window.navigator.language.substring(0, 2);
          helper.uralpro.set("lang", languageURL1 || browserLangFirstTwo);
        }
        if ((_b = (_a = helper.gamepix) == null ? void 0 : _a.storage) == null ? void 0 : _b.preloadToMap) {
          helper.gamepix.storage.preloadToMap();
        }
        context.loadStartData();
        helper.uralpro.set("isSdkReadyData", true);
        helper.uralpro.set("setup_saveData", 1);
        helper.saveData();
        setInterval(helper.saveData, 1e3 * 60);
        helper.uralpro.log("GamePix SDK \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D.");
      } catch (error) {
        helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 GamePix SDK:", error);
        setup2(helper, context);
      }
    });
  }

  // src/modules/platforms/android/index.js
  function callAndroid(methodNames) {
    if (typeof AndroidFunction === "undefined")
      return null;
    for (const name of methodNames) {
      const fn = AndroidFunction[name];
      if (typeof fn === "function")
        return () => fn.call(AndroidFunction);
    }
    return null;
  }
  function createAdapter7(helper) {
    const storage = typeof localStorage !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {
    } };
    return {
      getSdk: () => null,
      getCooldownStorage: () => storage,
      showFullscreenAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onClose, onError }) {
          const showInterstitial = callAndroid(["showInterstitialAd", "startInterstitialAdYandexJ"]);
          if (!showInterstitial) {
            onError == null ? void 0 : onError();
            return;
          }
          try {
            storage.setItem("ysdk_lastFullscreenAdv", String(Date.now()));
            helper.uralpro.log("\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430 (Android).");
            helper.uralpro.set("ysdkAdvStart", "1");
            onOpen == null ? void 0 : onOpen();
            showInterstitial();
            setTimeout(() => {
              helper.uralpro.log("\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430 (Android).");
              helper.uralpro.set("ysdkAdvStart", "0");
              onClose == null ? void 0 : onClose();
            }, 5e3);
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B \u0447\u0435\u0440\u0435\u0437 Android:", e);
            helper.uralpro.set("ysdkAdvStart", "0");
            onError == null ? void 0 : onError(e);
          }
        });
      },
      showRewardedAd(_0) {
        return __async(this, arguments, function* ({ onError }) {
          helper.uralpro.warn("\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0430 Android \u043D\u0435 \u0440\u0435\u0430\u043B\u0438\u0437\u043E\u0432\u0430\u043D\u0430 \u0432 \u0430\u0434\u0430\u043F\u0442\u0435\u0440\u0435.");
          onError == null ? void 0 : onError();
        });
      },
      showBanner(visible) {
        if (!visible)
          return;
        const showBannerFn = callAndroid(["showBannerAd", "startBannerAdYandexJ"]);
        if (showBannerFn)
          showBannerFn();
      },
      getLang: () => helper.uralpro.get("lang") || "en",
      pause: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.muteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      resume: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.unmuteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      isReady: () => true
    };
  }
  function ensurePurchaseStubs(helper) {
    if (typeof AndroidFunction === "undefined")
      return;
    const noop = () => {
      helper.uralpro.warn("\u041F\u043E\u043A\u0443\u043F\u043A\u0438 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0432 \u044D\u0442\u043E\u0439 \u0441\u0431\u043E\u0440\u043A\u0435");
    };
    if (typeof AndroidFunction.purchaseCoin !== "function")
      AndroidFunction.purchaseCoin = noop;
    if (typeof AndroidFunction.buyProduct !== "function")
      AndroidFunction.buyProduct = noop;
  }
  function setup7(helper, context) {
    setup2(helper, context);
    ensurePurchaseStubs(helper);
    const purchaseKeys = helper.uralpro.config.purchaseFunctionList.map((item) => item.key);
    const androidProducts = [];
    helper.uralpro.set("android_products", androidProducts);
    window.onProductPriceReceived = function(price, productId) {
      window._androidCallbackInProgress = true;
      try {
        const products = helper.uralpro.get("android_products") || [];
        const existingProductIndex = products.findIndex((p) => p.id === productId);
        const purchaseInfo = helper.uralpro.config.purchaseFunctionList.find((item) => item.key === productId);
        const productData = { id: productId, price, action: purchaseInfo == null ? void 0 : purchaseInfo.action };
        if (existingProductIndex !== -1)
          products[existingProductIndex] = productData;
        else
          products.push(productData);
        helper.uralpro.set("android_products", products);
      } finally {
        window._androidCallbackInProgress = false;
      }
    };
    window.onProductPriceError = function(error, productId) {
      window._androidCallbackInProgress = true;
      try {
        const products = helper.uralpro.get("android_products") || [];
        if (products.findIndex((p) => p.id === productId) === -1) {
          const purchaseInfo = helper.uralpro.config.purchaseFunctionList.find((item) => item.key === productId);
          products.push({ id: productId, price: "N/A", error, action: purchaseInfo == null ? void 0 : purchaseInfo.action });
          helper.uralpro.set("android_products", products);
        }
      } finally {
        window._androidCallbackInProgress = false;
      }
    };
    window.onPurchaseSuccess = function(purchaseId, productId) {
      var _a, _b;
      window._androidCallbackInProgress = true;
      try {
        const purchaseInfo = helper.uralpro.config.purchaseFunctionList.find((item) => item.key === productId);
        if (purchaseInfo == null ? void 0 : purchaseInfo.action)
          purchaseInfo.action({ productId, purchaseId });
        if ((_b = (_a = window._androidPurchaseCallbacks) == null ? void 0 : _a[productId]) == null ? void 0 : _b.endFun) {
          window._androidPurchaseCallbacks[productId].endFun();
          delete window._androidPurchaseCallbacks[productId];
        }
      } finally {
        window._androidCallbackInProgress = false;
      }
    };
    window.onPurchaseError = function(errorMessage, productId) {
      var _a, _b;
      window._androidCallbackInProgress = true;
      try {
        if ((_b = (_a = window._androidPurchaseCallbacks) == null ? void 0 : _a[productId]) == null ? void 0 : _b.errorFun) {
          window._androidPurchaseCallbacks[productId].errorFun(errorMessage);
          delete window._androidPurchaseCallbacks[productId];
        }
      } finally {
        window._androidCallbackInProgress = false;
      }
    };
    purchaseKeys.forEach((productId) => {
      if (typeof AndroidFunction !== "undefined" && AndroidFunction.getProductPrice) {
        AndroidFunction.getProductPrice(productId);
      }
    });
  }

  // src/modules/platforms/playdeck/index.js
  function postMessageToPlayDeck(method, value = null, key = null) {
    var _a;
    try {
      const parent = ((_a = window.parent) == null ? void 0 : _a.window) || window.parent;
      if (!parent) {
        console.warn("PlayDeck: parent window not found");
        return;
      }
      const message = { playdeck: { method } };
      if (value !== null && value !== void 0)
        message.playdeck.value = value;
      if (key !== null && key !== void 0)
        message.playdeck.key = key;
      parent.postMessage(message, "*");
    } catch (e) {
      console.error("PlayDeck postMessage error:", e);
    }
  }
  var PLAYDECK_SAVE_KEY = "uralpro_game_data";
  var PLAYDECK_CHUNK_SIZE = 9e3;
  function createAdapter8(helper) {
    const storage = typeof localStorage !== "undefined" ? {
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
        }
      }
    } : { getItem: () => null, setItem: () => {
    } };
    return {
      getSdk: () => helper.uralpro.get("playdeck"),
      getCooldownStorage: () => storage,
      showFullscreenAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onClose, onError }) {
          helper.uralpro.log("PlayDeck: \u043C\u0435\u0436\u0441\u0442\u0440\u0430\u043D\u0438\u0447\u043D\u0430\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F, \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u0435\u043C.");
          onOpen == null ? void 0 : onOpen();
          onClose == null ? void 0 : onClose();
        });
      },
      showRewardedAd(_0) {
        return __async(this, arguments, function* ({ onOpen, onRewarded, onClose, onError }) {
          if (!helper.uralpro.get("isSdkReady")) {
            onError == null ? void 0 : onError();
            return;
          }
          try {
            helper.uralpro.log("\u041F\u043E\u043A\u0430\u0437 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B PlayDeck.");
            helper._playdeckAdCallbacks = {
              onOpen,
              onRewarded,
              onClose,
              onError,
              isRewarded: true
            };
            helper._playdeckAdStarted = false;
            postMessageToPlayDeck("showAd");
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B PlayDeck:", e);
            onError == null ? void 0 : onError(e);
            helper._playdeckAdCallbacks = null;
          }
        });
      },
      showBanner: () => {
      },
      getLang: () => {
        const profile = helper.uralpro.get("playdeck_profile");
        if (profile == null ? void 0 : profile.locale) {
          return profile.locale === "ru" ? "ru" : "en";
        }
        return helper.uralpro.get("lang") || "en";
      },
      pause: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.muteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      resume: () => {
        var _a2, _b, _c;
        if ((_a2 = helper.uralpro.config) == null ? void 0 : _a2.audioMuteDocumentVisibility)
          try {
            (_c = (_b = helper.audio) == null ? void 0 : _b.unmuteAll) == null ? void 0 : _c.call(_b);
          } catch (e) {
          }
      },
      isReady: () => !!helper.uralpro.get("isSdkReady"),
      /**
       * Сохранение всех данных в PlayDeck Cloud Save.
       */
      saveData: () => {
        try {
          if (!helper.uralpro.get("_playdeckCloudReady")) {
            helper.uralpro.log("PlayDeck: \u043E\u0431\u043B\u0430\u043A\u043E \u043D\u0435 \u0433\u043E\u0442\u043E\u0432\u043E \u0434\u043B\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F");
            return false;
          }
          const playdeckApi = helper.uralpro.get("playdeck");
          if (!playdeckApi || typeof playdeckApi.setData !== "function") {
            helper.uralpro.warn("PlayDeck: API \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E");
            return false;
          }
          const mapApp = helper.uralpro.get("mapDataApp");
          if (!mapApp || typeof mapApp.forEach !== "function") {
            helper.uralpro.warn("PlayDeck: \u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F");
            return false;
          }
          const allData = {};
          let keyCount = 0;
          mapApp.forEach((val, key) => {
            allData[key] = val;
            keyCount++;
          });
          if (keyCount === 0) {
            helper.uralpro.log("PlayDeck: \u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F");
            return false;
          }
          const jsonData = JSON.stringify(allData);
          const dataSize = jsonData.length;
          const lastPayload = helper.uralpro.get("playdeck_cloud_last_payload");
          if (lastPayload === jsonData) {
            helper.uralpro.log("PlayDeck: \u0434\u0430\u043D\u043D\u044B\u0435 \u043D\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0438\u0441\u044C, \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u0435\u043C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435");
            return false;
          }
          const prevSave = helper.uralpro.get("playdeck_cloud_last_save");
          const prevShards = (prevSave == null ? void 0 : prevSave.shards) || 0;
          helper.uralpro.log(`PlayDeck: \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 ${keyCount} \u043A\u043B\u044E\u0447\u0435\u0439 (${dataSize} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)...`);
          if (dataSize <= PLAYDECK_CHUNK_SIZE) {
            playdeckApi.setData(PLAYDECK_SAVE_KEY, jsonData);
            helper.uralpro.log("PlayDeck: \u0434\u0430\u043D\u043D\u044B\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B \u0432 \u043E\u0434\u0438\u043D \u043A\u043B\u044E\u0447");
            for (let i = 0; i < prevShards; i++) {
              playdeckApi.setData(`${PLAYDECK_SAVE_KEY}_${i}`, "");
            }
          } else {
            const chunks = [];
            for (let i = 0; i < dataSize; i += PLAYDECK_CHUNK_SIZE) {
              chunks.push(jsonData.slice(i, i + PLAYDECK_CHUNK_SIZE));
            }
            const meta = { _shards: chunks.length };
            playdeckApi.setData(PLAYDECK_SAVE_KEY, JSON.stringify(meta));
            for (let i = 0; i < chunks.length; i++) {
              playdeckApi.setData(`${PLAYDECK_SAVE_KEY}_${i}`, chunks[i]);
            }
            for (let i = chunks.length; i < prevShards; i++) {
              playdeckApi.setData(`${PLAYDECK_SAVE_KEY}_${i}`, "");
            }
            helper.uralpro.log(`PlayDeck: \u0434\u0430\u043D\u043D\u044B\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B \u0432 ${chunks.length} \u0447\u0430\u043D\u043A\u043E\u0432`);
          }
          const newShards = dataSize <= PLAYDECK_CHUNK_SIZE ? 0 : Math.ceil(dataSize / PLAYDECK_CHUNK_SIZE);
          helper.uralpro.set("playdeck_cloud_last_save", {
            mode: dataSize <= PLAYDECK_CHUNK_SIZE ? "single" : "sharded",
            length: dataSize,
            keys: keyCount,
            shards: newShards,
            at: (/* @__PURE__ */ new Date()).toISOString()
          });
          helper.uralpro.set("playdeck_cloud_last_payload", jsonData);
          return true;
        } catch (error) {
          helper.uralpro.error("PlayDeck: \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445:", error);
          return false;
        }
      },
      /**
       * Оплата через PlayDeck (Telegram Stars).
       * Полный поток: requestPayment → получить URL → openTelegramLink → invoiceClosed.
       * Документация: https://github.com/ton-play/playdeck-integration-guide/wiki/Available-methods
       *
       * @param {Object} params
       * @param {number} params.amount        - Сумма в Stars (целое число >= 1)
       * @param {string} params.description   - Описание покупки (до 255 символов)
       * @param {string} params.externalId    - Уникальный идентификатор заказа в вашей системе
       * @param {string} [params.photoUrl]    - URL изображения товара
       * @param {boolean} [params.isTest]     - Тестовый режим (автоматический postback через 5 сек)
       * @param {Function} params.onSuccess   - Вызывается при успешной оплате (externalId)
       * @param {Function} [params.onError]   - Вызывается при ошибке/отмене
       */
      purchaseProduct: ({ amount, description, externalId, photoUrl, isTest, onSuccess, onError }) => {
        try {
          if (!helper.uralpro.get("isSdkReady")) {
            helper.uralpro.warn("PlayDeck: SDK \u043D\u0435 \u0433\u043E\u0442\u043E\u0432 \u0434\u043B\u044F \u043E\u043F\u043B\u0430\u0442\u044B");
            onError == null ? void 0 : onError("sdk_not_ready");
            return;
          }
          helper._playdeckPaymentCallbacks = { externalId, onSuccess, onError };
          const paymentParams = { amount: Math.max(1, Math.round(amount)), description };
          if (externalId)
            paymentParams.externalId = externalId;
          if (photoUrl)
            paymentParams.photoUrl = photoUrl;
          if (isTest)
            paymentParams.isTest = true;
          helper.uralpro.log(`PlayDeck: \u0437\u0430\u043F\u0440\u043E\u0441 \u043E\u043F\u043B\u0430\u0442\u044B (externalId=${externalId}, amount=${paymentParams.amount})`);
          postMessageToPlayDeck("requestPayment", paymentParams);
        } catch (e) {
          helper.uralpro.error("PlayDeck: \u043E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u043F\u0440\u043E\u0441\u0430 \u043E\u043F\u043B\u0430\u0442\u044B:", e);
          helper._playdeckPaymentCallbacks = null;
          onError == null ? void 0 : onError(e);
        }
      }
    };
  }
  function setup8(helper, context) {
    return __async(this, null, function* () {
      try {
        const isInIframe = window.self !== window.top;
        if (!isInIframe) {
          helper.uralpro.warn("PlayDeck: \u043D\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D iframe, \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043D\u0430 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u0440\u0443\u0436\u0435\u043D\u0438\u0435.");
          setup2(helper, context);
          return;
        }
        helper.uralpro.log("\u0418\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F PlayDeck SDK...");
        const playdeck = {
          loading: (pct) => postMessageToPlayDeck("loading", pct),
          getPlaydeckState: () => postMessageToPlayDeck("getPlaydeckState"),
          gameEnd: () => postMessageToPlayDeck("gameEnd"),
          requestPayment: (params) => postMessageToPlayDeck("requestPayment", params),
          getPaymentInfo: (params) => postMessageToPlayDeck("getPaymentInfo", params),
          sendTonTransaction: (params) => postMessageToPlayDeck("sendTonTransaction", params),
          showAd: () => postMessageToPlayDeck("showAd"),
          getUserProfile: () => postMessageToPlayDeck("getUserProfile"),
          setData: (key, value) => postMessageToPlayDeck("setData", value, key),
          getData: (key) => postMessageToPlayDeck("getData", null, key),
          sendGameProgress: (achievements, progress) => postMessageToPlayDeck("sendGameProgress", { achievements, progress }),
          sendAnalyticNewSession: () => postMessageToPlayDeck("sendAnalyticNewSession"),
          sendAnalytics: (event) => postMessageToPlayDeck("sendAnalytics", event),
          customShare: (params) => postMessageToPlayDeck("customShare", params),
          getShareLink: (params) => postMessageToPlayDeck("getShareLink", params),
          openTelegramLink: (url) => postMessageToPlayDeck("openTelegramLink", url),
          getToken: () => postMessageToPlayDeck("getToken")
        };
        helper.uralpro.set("playdeck", playdeck);
        helper.uralpro.set("isLoaded", true);
        helper.uralpro.set("isSdkReady", true);
        let cloudLoadState = {
          requested: false,
          completed: false,
          hasData: false,
          loadingChunks: false,
          chunkState: null
        };
        const applyCloudSaveToMap = (rawValue) => {
          if (!rawValue || typeof rawValue !== "string" || rawValue.trim() === "") {
            helper.uralpro.log("PlayDeck: \u043D\u0435\u0442 \u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u0438\u044F");
            return 0;
          }
          const mapApp = helper.uralpro.get("mapDataApp");
          if (!mapApp) {
            helper.uralpro.error("PlayDeck: mapDataApp \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
            return 0;
          }
          try {
            const parsed = JSON.parse(rawValue);
            let entries = [];
            if (Array.isArray(parsed)) {
              entries = parsed;
            } else if (parsed && typeof parsed === "object") {
              if ("_shards" in parsed) {
                helper.uralpro.log("PlayDeck: \u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0435\u043C \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435 \u043E \u0447\u0430\u043D\u043A\u0430\u0445");
                return 0;
              }
              entries = Object.entries(parsed);
            } else {
              helper.uralpro.warn("PlayDeck: \u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0432 \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u043C \u0444\u043E\u0440\u043C\u0430\u0442\u0435");
              return 0;
            }
            let restored = 0;
            for (const entry of entries) {
              if (!Array.isArray(entry) || entry.length < 2)
                continue;
              const [idname, dataStr] = entry;
              if (typeof idname !== "string")
                continue;
              const str = dataStr !== void 0 && dataStr !== null && typeof dataStr === "object" ? JSON.stringify(dataStr) : String(dataStr != null ? dataStr : "");
              mapApp.set(idname, str);
              restored++;
            }
            helper.uralpro.set("playdeck_cloud_last_load", {
              restored,
              rawLength: rawValue.length,
              at: (/* @__PURE__ */ new Date()).toISOString()
            });
            if (restored > 0) {
              helper.uralpro.set("_playdeckCloudApplied", true);
              helper.uralpro.log(
                `PlayDeck: \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E ${restored} \u043A\u043B\u044E\u0447(\u0435\u0439) \u0438\u0437 \u043E\u0431\u043B\u0430\u043A\u0430`,
                helper.uralpro.logStyle("green", "black")
              );
              return restored;
            } else {
              helper.uralpro.warn("PlayDeck: \u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u043D\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u0434\u043B\u044F \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F");
              return 0;
            }
          } catch (e) {
            helper.uralpro.error("PlayDeck: \u043E\u0448\u0438\u0431\u043A\u0430 \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445:", e);
            return 0;
          }
        };
        const finalizeStorageInit = () => {
          if (helper.uralpro.get("_storageFinalized"))
            return;
          helper.uralpro.set("_storageFinalized", true);
          helper.uralpro.set("isSdkReadyData", true);
          helper.uralpro.set("setup_saveData", 1);
          helper.uralpro.set("_playdeckCloudReady", true);
          const hasCloudData = helper.uralpro.get("_playdeckCloudApplied");
          const mapApp = helper.uralpro.get("mapDataApp");
          const mapSize = mapApp ? mapApp.size : 0;
          helper.uralpro.log(`PlayDeck: \u0444\u0438\u043D\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430 (\u043E\u0431\u043B\u0430\u043A\u043E=${!!hasCloudData}, mapDataApp.size=${mapSize}, completed=${cloudLoadState.completed})`);
          context.loadStartData();
          const saveBoth = () => {
            try {
              if (typeof helper.saveData === "function") {
                helper.saveData();
              }
              const platformAdapter = helper._platformAdapter;
              if (platformAdapter == null ? void 0 : platformAdapter.saveData) {
                platformAdapter.saveData();
              }
            } catch (e) {
              helper.uralpro.error("PlayDeck: \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445:", e);
            }
          };
          setTimeout(saveBoth, 5e3);
          setInterval(saveBoth, 6e4);
          window.addEventListener("beforeunload", () => {
            try {
              saveBoth();
            } catch (e) {
            }
          });
          helper.uralpro.log("PlayDeck: \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043E");
        };
        const requestCloudData = () => {
          if (cloudLoadState.requested) {
            helper.uralpro.log("PlayDeck: \u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0443\u0436\u0435 \u0437\u0430\u043F\u0440\u043E\u0448\u0435\u043D\u044B, \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u0435\u043C");
            return;
          }
          cloudLoadState.requested = true;
          helper.uralpro.log(`PlayDeck: \u0437\u0430\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u043C \u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 (\u043A\u043B\u044E\u0447: ${PLAYDECK_SAVE_KEY})...`);
          playdeck.getData(PLAYDECK_SAVE_KEY);
        };
        const loadChunks = (shardCount) => {
          helper.uralpro.log(`PlayDeck: \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u043C \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443 ${shardCount} \u0447\u0430\u043D\u043A\u043E\u0432...`);
          cloudLoadState.loadingChunks = true;
          cloudLoadState.chunkState = {
            total: shardCount,
            received: {},
            allReceived: false
          };
          for (let i = 0; i < shardCount; i++) {
            playdeck.getData(`${PLAYDECK_SAVE_KEY}_${i}`);
          }
          setTimeout(() => {
            if (cloudLoadState.loadingChunks && !cloudLoadState.completed) {
              const received = cloudLoadState.chunkState ? Object.keys(cloudLoadState.chunkState.received).length : 0;
              helper.uralpro.warn(`PlayDeck: \u0442\u0430\u0439\u043C\u0430\u0443\u0442 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0447\u0430\u043D\u043A\u043E\u0432 (\u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${received}/${shardCount}), \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u043C \u0431\u0435\u0437 \u043E\u0431\u043B\u0430\u043A\u0430`);
              cloudLoadState.completed = true;
              cloudLoadState.hasData = false;
              cloudLoadState.loadingChunks = false;
              cloudLoadState.chunkState = null;
            }
          }, 5e3);
        };
        const checkChunksComplete = () => {
          if (!cloudLoadState.chunkState)
            return false;
          const receivedCount = Object.keys(cloudLoadState.chunkState.received).length;
          if (receivedCount >= cloudLoadState.chunkState.total) {
            let assembledData = "";
            for (let i = 0; i < cloudLoadState.chunkState.total; i++) {
              assembledData += cloudLoadState.chunkState.received[i] || "";
            }
            helper.uralpro.log(`PlayDeck: \u0432\u0441\u0435 \u0447\u0430\u043D\u043A\u0438 \u0441\u043E\u0431\u0440\u0430\u043D\u044B (${assembledData.length} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)`);
            const restored = applyCloudSaveToMap(assembledData);
            cloudLoadState.completed = true;
            cloudLoadState.hasData = restored > 0;
            cloudLoadState.loadingChunks = false;
            cloudLoadState.chunkState = null;
            return true;
          }
          return false;
        };
        window.addEventListener("message", ({ data }) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
          const playdeckData = data == null ? void 0 : data.playdeck;
          if (!playdeckData)
            return;
          const method = playdeckData.method;
          let value = playdeckData.value;
          let key = playdeckData.key;
          if (value && typeof value === "object" && !Array.isArray(value) && "key" in value && "data" in value) {
            if (!key)
              key = value.key;
            value = value.data;
          }
          switch (method) {
            case "getUserProfile":
              if (value) {
                helper.uralpro.set("playdeck_profile", value);
                if (value.locale) {
                  helper.uralpro.set("lang", value.locale === "ru" ? "ru" : "en");
                }
                if (value.token) {
                  helper.uralpro.set("playdeck_token", value.token);
                }
                if (value.id) {
                  helper.uralpro.log(`PlayDeck: \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C ID=${value.id}`);
                }
                requestCloudData();
              }
              break;
            case "getData": {
              const valPreview = typeof value === "string" ? value.substring(0, 120) : (_a = JSON.stringify(value)) == null ? void 0 : _a.substring(0, 120);
              helper.uralpro.log(`PlayDeck: \u043F\u043E\u043B\u0443\u0447\u0435\u043D \u043E\u0442\u0432\u0435\u0442 getData, key="${key}", value type=${typeof value}, preview=${valPreview}`);
              if (key === PLAYDECK_SAVE_KEY) {
                let dataStr = "";
                if (typeof value === "string") {
                  dataStr = value;
                } else if (value != null) {
                  dataStr = JSON.stringify(value);
                }
                if (!dataStr || dataStr.trim() === "" || dataStr === "null" || dataStr === "{}") {
                  helper.uralpro.log("PlayDeck: \u0432 \u043E\u0431\u043B\u0430\u043A\u0435 \u043D\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445");
                  cloudLoadState.completed = true;
                  cloudLoadState.hasData = false;
                  break;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed && typeof parsed === "object" && parsed._shards) {
                    helper.uralpro.log(`PlayDeck: \u0434\u0430\u043D\u043D\u044B\u0435 \u0440\u0430\u0437\u0434\u0435\u043B\u0435\u043D\u044B \u043D\u0430 ${parsed._shards} \u0447\u0430\u043D\u043A\u043E\u0432`);
                    loadChunks(parsed._shards);
                  } else {
                    const restored = applyCloudSaveToMap(dataStr);
                    cloudLoadState.completed = true;
                    cloudLoadState.hasData = restored > 0;
                  }
                } catch (e) {
                  helper.uralpro.error("PlayDeck: \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 \u0434\u0430\u043D\u043D\u044B\u0445:", e);
                  cloudLoadState.completed = true;
                  cloudLoadState.hasData = false;
                }
              } else if (key && key.startsWith(PLAYDECK_SAVE_KEY + "_")) {
                if (cloudLoadState.loadingChunks && cloudLoadState.chunkState) {
                  const idx = parseInt(key.split("_").pop(), 10);
                  if (!isNaN(idx) && idx >= 0 && idx < cloudLoadState.chunkState.total) {
                    const chunkData = typeof value === "string" ? value : value ? String(value) : "";
                    cloudLoadState.chunkState.received[idx] = chunkData;
                    helper.uralpro.log(`PlayDeck: \u043F\u043E\u043B\u0443\u0447\u0435\u043D \u0447\u0430\u043D\u043A ${idx + 1}/${cloudLoadState.chunkState.total}`);
                    checkChunksComplete();
                  }
                }
              }
              break;
            }
            case "setData":
              if (key === PLAYDECK_SAVE_KEY) {
                helper.uralpro.log("PlayDeck: \u0434\u0430\u043D\u043D\u044B\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B \u0432 \u043E\u0431\u043B\u0430\u043A\u043E");
              }
              break;
            case "requestPayment":
              helper.uralpro.log("PlayDeck: \u043E\u0442\u0432\u0435\u0442 requestPayment:", (_b = JSON.stringify(value)) == null ? void 0 : _b.substring(0, 200));
              if (value && value.url) {
                helper.uralpro.log("PlayDeck: \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u043C \u0441\u0441\u044B\u043B\u043A\u0443 \u043D\u0430 \u043E\u043F\u043B\u0430\u0442\u0443...");
                playdeck.openTelegramLink(value.url);
              } else {
                helper.uralpro.error("PlayDeck: \u043D\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0430 \u0441\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043E\u043F\u043B\u0430\u0442\u0443:", value);
                const cb = helper._playdeckPaymentCallbacks;
                helper._playdeckPaymentCallbacks = null;
                if (cb == null ? void 0 : cb.onError)
                  cb.onError(value);
              }
              break;
            case "invoiceClosed": {
              const status = value == null ? void 0 : value.status;
              helper.uralpro.log(`PlayDeck: invoiceClosed, \u0441\u0442\u0430\u0442\u0443\u0441=${status}`);
              const cb = helper._playdeckPaymentCallbacks;
              helper._playdeckPaymentCallbacks = null;
              if (status === "paid") {
                helper.uralpro.log("PlayDeck: \u043E\u043F\u043B\u0430\u0442\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u0430!", helper.uralpro.logStyle("green", "black"));
                if (cb == null ? void 0 : cb.onSuccess)
                  cb.onSuccess(cb.externalId, value);
                try {
                  if (typeof helper.saveDataUrgently === "function") {
                    helper.saveDataUrgently();
                  }
                  const adapter = helper._platformAdapter;
                  if (adapter == null ? void 0 : adapter.saveData) {
                    setTimeout(() => {
                      try {
                        adapter.saveData();
                      } catch (e) {
                      }
                    }, 200);
                  }
                } catch (e) {
                  helper.uralpro.error("PlayDeck: \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0443\u043F\u043A\u0438:", e);
                }
              } else {
                helper.uralpro.log(`PlayDeck: \u043E\u043F\u043B\u0430\u0442\u0430 \u043D\u0435 \u043F\u0440\u043E\u0448\u043B\u0430 (${status})`);
                if (cb == null ? void 0 : cb.onError)
                  cb.onError(value);
              }
              break;
            }
            case "rewardedAd":
              if (!helper._playdeckAdCallbacks)
                break;
              helper.uralpro.log("PlayDeck: \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043D\u0430\u0433\u0440\u0430\u0434\u0443 \u0437\u0430 \u0440\u0435\u043A\u043B\u0430\u043C\u0443");
              helper._playdeckAdStarted = false;
              if (helper._playdeckNotFoundAdTimer) {
                clearTimeout(helper._playdeckNotFoundAdTimer);
                helper._playdeckNotFoundAdTimer = null;
              }
              try {
                (_d = (_c = helper.audio) == null ? void 0 : _c.unmuteAll) == null ? void 0 : _d.call(_c);
              } catch (e) {
              }
              if (helper._playdeckAdCallbacks.isRewarded && helper._playdeckAdCallbacks.onRewarded) {
                helper._playdeckAdCallbacks.onRewarded();
              }
              if (helper._playdeckAdCallbacks.onClose) {
                helper._playdeckAdCallbacks.onClose();
              }
              helper._playdeckAdCallbacks = null;
              break;
            case "errAd":
              if (helper._playdeckAdStarted) {
                helper.uralpro.warn("PlayDeck: errAd \u043F\u0440\u0438 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u044F\u0449\u0435\u0439\u0441\u044F \u0440\u0435\u043A\u043B\u0430\u043C\u0435 (\u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0435\u043C):", value);
              } else {
                helper.uralpro.error("PlayDeck: \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u0430 \u0440\u0435\u043A\u043B\u0430\u043C\u044B", value);
                if (helper._playdeckNotFoundAdTimer) {
                  clearTimeout(helper._playdeckNotFoundAdTimer);
                  helper._playdeckNotFoundAdTimer = null;
                }
                try {
                  (_f = (_e = helper.audio) == null ? void 0 : _e.unmuteAll) == null ? void 0 : _f.call(_e);
                } catch (e) {
                }
                if (helper._playdeckAdCallbacks) {
                  if (helper._playdeckAdCallbacks.onError) {
                    helper._playdeckAdCallbacks.onError(value);
                  }
                  helper._playdeckAdCallbacks = null;
                }
              }
              break;
            case "skipAd":
              if (!helper._playdeckAdCallbacks)
                break;
              helper.uralpro.log("PlayDeck: \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u043B \u0440\u0435\u043A\u043B\u0430\u043C\u0443");
              helper._playdeckAdStarted = false;
              if (helper._playdeckNotFoundAdTimer) {
                clearTimeout(helper._playdeckNotFoundAdTimer);
                helper._playdeckNotFoundAdTimer = null;
              }
              try {
                (_h = (_g = helper.audio) == null ? void 0 : _g.unmuteAll) == null ? void 0 : _h.call(_g);
              } catch (e) {
              }
              if (helper._playdeckAdCallbacks.onClose) {
                helper._playdeckAdCallbacks.onClose();
              }
              helper._playdeckAdCallbacks = null;
              break;
            case "notFoundAd":
              helper.uralpro.warn("PlayDeck: \u0440\u0435\u043A\u043B\u0430\u043C\u043D\u044B\u0439 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u043D\u0435 \u0432\u0435\u0440\u043D\u0443\u043B \u0440\u0435\u043A\u043B\u0430\u043C\u0443, \u0436\u0434\u0451\u043C...");
              if (helper._playdeckAdCallbacks) {
                helper._playdeckNotFoundAdTimer = setTimeout(() => {
                  var _a2, _b2;
                  helper._playdeckNotFoundAdTimer = null;
                  if (helper._playdeckAdCallbacks) {
                    helper.uralpro.warn("PlayDeck: \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u0442\u0430\u043A \u0438 \u043D\u0435 \u043F\u043E\u044F\u0432\u0438\u043B\u0430\u0441\u044C, \u0432\u044B\u0437\u044B\u0432\u0430\u0435\u043C onError");
                    try {
                      (_b2 = (_a2 = helper.audio) == null ? void 0 : _a2.unmuteAll) == null ? void 0 : _b2.call(_a2);
                    } catch (e) {
                    }
                    if (helper._playdeckAdCallbacks.onError) {
                      helper._playdeckAdCallbacks.onError("notFoundAd");
                    }
                    helper._playdeckAdCallbacks = null;
                  }
                }, 3e3);
              }
              break;
            case "startAd":
              helper.uralpro.log("PlayDeck: \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u044C\u0441\u044F");
              helper._playdeckAdStarted = true;
              if (helper._playdeckNotFoundAdTimer) {
                clearTimeout(helper._playdeckNotFoundAdTimer);
                helper._playdeckNotFoundAdTimer = null;
              }
              try {
                (_j = (_i = helper.audio) == null ? void 0 : _i.muteAll) == null ? void 0 : _j.call(_i);
              } catch (e) {
              }
              if ((_k = helper._playdeckAdCallbacks) == null ? void 0 : _k.onOpen) {
                helper._playdeckAdCallbacks.onOpen();
              }
              break;
            case "getPlaydeckState":
              if (value === true) {
                helper.uralpro.log("PlayDeck: \u043E\u0432\u0435\u0440\u043B\u0435\u0439 \u043E\u0442\u043A\u0440\u044B\u0442, \u043F\u0430\u0443\u0437\u0430");
                try {
                  (_m = (_l = helper.audio) == null ? void 0 : _l.muteAll) == null ? void 0 : _m.call(_l);
                } catch (e) {
                }
              } else if (value === false) {
                helper.uralpro.log("PlayDeck: \u043E\u0432\u0435\u0440\u043B\u0435\u0439 \u0437\u0430\u043A\u0440\u044B\u0442, \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u043C");
                try {
                  (_o = (_n = helper.audio) == null ? void 0 : _n.unmuteAll) == null ? void 0 : _o.call(_n);
                } catch (e) {
                }
              }
              break;
          }
        });
        helper.uralpro.log("PlayDeck: \u0437\u0430\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u043C \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F...");
        playdeck.getUserProfile();
        playdeck.sendAnalyticNewSession();
        playdeck.loading();
        setTimeout(() => playdeck.loading(100), 1e3);
        const languageURL = new URL(document.location).searchParams.get("lang");
        const browserLang = window.navigator.language.substring(0, 2);
        helper.uralpro.set("lang", languageURL || browserLang || "en");
        setTimeout(() => {
          if (!cloudLoadState.requested) {
            helper.uralpro.log("PlayDeck: \u0442\u0430\u0439\u043C\u0430\u0443\u0442 \u043F\u0440\u043E\u0444\u0438\u043B\u044F, \u0437\u0430\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u043C \u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E");
            requestCloudData();
          }
        }, 2e3);
        const initializationTimeout = setTimeout(() => {
          if (!cloudLoadState.completed) {
            helper.uralpro.warn(`PlayDeck: \u0442\u0430\u0439\u043C\u0430\u0443\u0442 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445 (10 \u0441\u0435\u043A\u0443\u043D\u0434), \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u043C \u0431\u0435\u0437 \u043D\u0438\u0445 (requested=${cloudLoadState.requested}, loadingChunks=${cloudLoadState.loadingChunks})`);
            cloudLoadState.completed = true;
            cloudLoadState.hasData = false;
          }
          if (!helper.uralpro.get("_storageFinalized")) {
            finalizeStorageInit();
          }
        }, 1e4);
        const checkAndFinalize = () => {
          if (cloudLoadState.completed && !helper.uralpro.get("_storageFinalized")) {
            clearTimeout(initializationTimeout);
            finalizeStorageInit();
          }
        };
        const finalizationInterval = setInterval(() => {
          checkAndFinalize();
          if (helper.uralpro.get("_storageFinalized")) {
            clearInterval(finalizationInterval);
          }
        }, 100);
        helper.uralpro.log("PlayDeck SDK \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D");
      } catch (error) {
        helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438 PlayDeck SDK:", error);
        setup2(helper, context);
      }
    });
  }

  // src/modules/platforms/index.js
  var AD_COOLDOWN_MS = 61 * 1e3;
  var COOLDOWN_KEY = "ysdk_lastFullscreenAdv";
  function getPlatformAdapter(platform, helper) {
    switch (platform) {
      case PLATFORM_YANDEX:
        return createAdapter(helper);
      case PLATFORM_VK:
        return createAdapter3(helper);
      case PLATFORM_POKI:
        return createAdapter4(helper);
      case PLATFORM_CRAZYGAMES:
        return createAdapter5(helper);
      case PLATFORM_GAMEPIX:
        return createAdapter6(helper);
      case PLATFORM_ANDROID:
        return createAdapter7(helper);
      case PLATFORM_PLAYDECK:
        return createAdapter8(helper);
      case PLATFORM_FILE:
      case PLATFORM_UNKNOWN:
      default:
        return createAdapter2(helper);
    }
  }
  function createAdApi(helper) {
    const getAdapter = () => {
      if (!helper._platformAdapter) {
        helper._platformAdapter = getPlatformAdapter(helper.uralpro.get("platform"), helper);
      }
      return helper._platformAdapter;
    };
    const getCooldownStore = () => getAdapter().getCooldownStorage();
    return {
      showFullscreenAdv(additionalOnOpen, additionalOnClose, additionalOnError) {
        return __async(this, null, function* () {
          const now = Date.now();
          const store = getCooldownStore();
          const lastShown = Number(store.getItem(COOLDOWN_KEY) || 0);
          if (now - lastShown < AD_COOLDOWN_MS) {
            const waitTime = Math.ceil((AD_COOLDOWN_MS - (now - lastShown)) / 1e3);
            helper.uralpro.warn(`\u0420\u0435\u043A\u043B\u0430\u043C\u0430 \u0431\u044B\u043B\u0430 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430 \u043D\u0435\u0434\u0430\u0432\u043D\u043E. \u041F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 \u0435\u0449\u0451 ${waitTime} \u0441\u0435\u043A\u0443\u043D\u0434.`);
            additionalOnError == null ? void 0 : additionalOnError();
            return;
          }
          const adapter = getAdapter();
          try {
            yield adapter.showFullscreenAd({
              onOpen: () => {
                var _a2;
                const wasHidden = helper.uralpro.get("isPageHidden");
                try {
                  (_a2 = helper._visibilityDoPause) == null ? void 0 : _a2.call(helper);
                } catch (_) {
                }
                if (!wasHidden && helper.uralpro.get("isPageHidden"))
                  helper.uralpro.set("__pausedByAd", true);
                helper.uralpro.set("ysdkAdvStart", "1");
                store.setItem(COOLDOWN_KEY, String(Date.now()));
                additionalOnOpen == null ? void 0 : additionalOnOpen();
              },
              onClose: () => {
                var _a2;
                helper.uralpro.set("ysdkAdvStart", "0");
                additionalOnClose == null ? void 0 : additionalOnClose();
                if (helper.uralpro.get("__pausedByAd")) {
                  try {
                    (_a2 = helper._visibilityDoResume) == null ? void 0 : _a2.call(helper);
                  } catch (_) {
                  }
                  helper.uralpro.set("__pausedByAd", false);
                }
              },
              onError: (err) => {
                var _a2;
                helper.uralpro.set("ysdkAdvStart", "0");
                if (helper.uralpro.get("__pausedByAd")) {
                  try {
                    (_a2 = helper._visibilityDoResume) == null ? void 0 : _a2.call(helper);
                  } catch (_) {
                  }
                  helper.uralpro.set("__pausedByAd", false);
                }
                additionalOnError == null ? void 0 : additionalOnError(err);
              }
            });
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0432\u044B\u0437\u043E\u0432\u0435 \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B:", e);
            helper.uralpro.set("ysdkAdvStart", "0");
            additionalOnError == null ? void 0 : additionalOnError(e);
          }
        });
      },
      showRewardedVideo(additionalOnOpen, additionalOnRewarded, additionalOnClose, additionalOnError) {
        return __async(this, null, function* () {
          var _a2;
          const adapter = getAdapter();
          try {
            yield adapter.showRewardedAd({
              onOpen: () => {
                var _a3;
                const wasHidden = helper.uralpro.get("isPageHidden");
                try {
                  (_a3 = helper._visibilityDoPause) == null ? void 0 : _a3.call(helper);
                } catch (_) {
                }
                if (!wasHidden && helper.uralpro.get("isPageHidden"))
                  helper.uralpro.set("__pausedByAd", true);
                helper.uralpro.set("ysdkAdvStart", "1");
                additionalOnOpen == null ? void 0 : additionalOnOpen();
              },
              onRewarded: () => additionalOnRewarded == null ? void 0 : additionalOnRewarded(),
              onClose: () => {
                var _a3;
                helper.uralpro.set("ysdkAdvStart", "0");
                additionalOnClose == null ? void 0 : additionalOnClose();
                if (helper.uralpro.get("__pausedByAd")) {
                  try {
                    (_a3 = helper._visibilityDoResume) == null ? void 0 : _a3.call(helper);
                  } catch (_) {
                  }
                  helper.uralpro.set("__pausedByAd", false);
                }
              },
              onError: (err) => {
                var _a3;
                helper.uralpro.set("ysdkAdvStart", "0");
                if (helper.uralpro.get("__pausedByAd")) {
                  try {
                    (_a3 = helper._visibilityDoResume) == null ? void 0 : _a3.call(helper);
                  } catch (_) {
                  }
                  helper.uralpro.set("__pausedByAd", false);
                }
                additionalOnError == null ? void 0 : additionalOnError(err);
              }
            });
          } catch (e) {
            helper.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0432\u044B\u0437\u043E\u0432\u0435 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0435\u043C\u043E\u0439 \u0440\u0435\u043A\u043B\u0430\u043C\u044B:", e);
            helper.uralpro.set("ysdkAdvStart", "0");
            if (helper.uralpro.get("__pausedByAd")) {
              try {
                (_a2 = helper._visibilityDoResume) == null ? void 0 : _a2.call(helper);
              } catch (_) {
              }
              helper.uralpro.set("__pausedByAd", false);
            }
            additionalOnError == null ? void 0 : additionalOnError(e);
          }
        });
      },
      showBannerAdv(show = true) {
        getAdapter().showBanner(!!show);
      }
    };
  }

  // src/modules/platforms/sdk-setup.js
  function runPlatformSetup(platform, helper, context) {
    var _a;
    const self = helper;
    switch (platform) {
      case PLATFORM_FILE:
        setup2(helper, context);
        break;
      case PLATFORM_YANDEX:
        self.scriptManager.loadJS("/sdk.js", () => setup(helper, context));
        break;
      case PLATFORM_POKI:
        if (typeof PokiSDK !== "undefined") {
          setup4(helper, context);
        } else {
          self.scriptManager.loadJS("https://game-cdn.poki.com/scripts/v2/poki-sdk.js", () => setup4(helper, context));
        }
        break;
      case PLATFORM_VK:
        setup3(helper, context);
        break;
      case PLATFORM_CRAZYGAMES:
        if ((_a = window.CrazyGames) == null ? void 0 : _a.SDK) {
          setup5(helper, context);
        } else {
          self.scriptManager.loadJS("https://sdk.crazygames.com/crazygames-sdk-v3.js", () => setup5(helper, context));
        }
        break;
      case PLATFORM_GAMEPIX:
        if (typeof window.GamePix !== "undefined") {
          setup6(helper, context);
        } else {
          self.scriptManager.loadJS("https://integration.gamepix.com/sdk/v3/gamepix.sdk.js", () => setup6(helper, context));
        }
        break;
      case PLATFORM_ANDROID:
        setup7(helper, context);
        break;
      case PLATFORM_PLAYDECK:
        setup8(helper, context);
        break;
      default:
        setup2(helper, context);
        break;
    }
  }

  // src/index.js
  var UralProHelperJS = class {
    constructor(config = {}) {
      // ---------- Сохранение данных ----------
      __publicField(this, "saveData", () => {
        if (this.uralpro.get("setup_saveData") == 1) {
          if (this.platform == PLATFORM_FILE) {
            this.saveDataUrgently();
          } else {
            this.uralpro.log("SaveDataStart", this.uralpro.logStyle("grey", "black"));
            if (this.uralpro.timeoutId_saveData) {
              this.uralpro.log("NoSaveData [Time]", this.uralpro.logStyle("#707344", "black"));
              clearTimeout(this.uralpro.timeoutId_saveData);
            } else {
              this.saveDataUrgently();
            }
            this.uralpro.timeoutId_saveData = setTimeout(() => {
              this.saveDataUrgently();
            }, 3100);
          }
        }
      });
      __publicField(this, "saveDataUrgently", () => __async(this, null, function* () {
        yield this._storage.saveDataUrgently();
      }));
      // Менеджер управления сохранениями
      __publicField(this, "saveManager", createSaveManager(this));
      __publicField(this, "sheetsGoogleApi", createSheetsModule(this));
      this.uralpro = {
        config: createDefaultConfig(config),
        mapDataSDKSymbol: Symbol("mapDataSDK"),
        mapDataSDK: /* @__PURE__ */ new Map(),
        save_id000: SAVE_ID_PREFIX,
        save_idArray: Array.isArray(config.saveIdArray) ? config.saveIdArray : [],
        timeoutId_saveData: null,
        // Новые методы для работы со сжатием
        isLZStringAvailable: () => {
          return typeof LZString !== "undefined";
        },
        // Метод для определения, нужно ли сжимать данные
        shouldCompress: (key, value) => {
          if (!this.uralpro.config.enableCompression)
            return false;
          if (!this.uralpro.isLZStringAvailable())
            return false;
          if (this.uralpro.config.compressKeys.length > 0) {
            return this.uralpro.config.compressKeys.includes(key);
          }
          const dataString = typeof value === "string" ? value : JSON.stringify(value);
          return dataString.length >= this.uralpro.config.compressionThreshold;
        },
        // Метод для сжатия данных
        compressData: (data) => {
          if (!this.uralpro.isLZStringAvailable()) {
            this.uralpro.error("LZString \u043D\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043B\u044F \u0441\u0436\u0430\u0442\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445");
            return data;
          }
          try {
            const dataString = typeof data === "string" ? data : JSON.stringify(data);
            const compressed = LZString.compressToEncodedURIComponent(dataString);
            const result = utils.COMPRESSED_PREFIX + compressed;
            if (this.uralpro.config.enableCompressionLogging) {
              this.uralpro.log(`\u0414\u0430\u043D\u043D\u044B\u0435 \u0441\u0436\u0430\u0442\u044B: ${dataString.length} \u2192 ${result.length} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 (${Math.round((1 - result.length / dataString.length) * 100)}% \u044D\u043A\u043E\u043D\u043E\u043C\u0438\u0438)`, this.uralpro.logStyle("#2e2727", "#4CAF50"));
            }
            return result;
          } catch (error) {
            this.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0436\u0430\u0442\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445:", error);
            return data;
          }
        },
        // Метод для распаковки данных
        decompressData: (data) => {
          if (!this.uralpro.isLZStringAvailable()) {
            this.uralpro.error("LZString \u043D\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u043B\u044F \u0440\u0430\u0441\u043F\u0430\u043A\u043E\u0432\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445");
            return data;
          }
          if (typeof data !== "string" || !utils.isCompressedString(data)) {
            return data;
          }
          try {
            const compressedData = data.slice(utils.COMPRESSED_PREFIX.length);
            const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
            if (decompressed === null) {
              this.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0430\u0441\u043F\u0430\u043A\u043E\u0432\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 - \u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0435\u043D\u044B");
              return data;
            }
            if (this.uralpro.config.enableCompressionLogging) {
              this.uralpro.log(`\u0414\u0430\u043D\u043D\u044B\u0435 \u0440\u0430\u0441\u043F\u0430\u043A\u043E\u0432\u0430\u043D\u044B: ${data.length} \u2192 ${decompressed.length} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432`, this.uralpro.logStyle("#2e2727", "#2196F3"));
            }
            return decompressed;
          } catch (error) {
            this.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0430\u0441\u043F\u0430\u043A\u043E\u0432\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445:", error);
            return data;
          }
        },
        set: (key, value) => {
          if (utils.isCalledFromConsole()) {
            this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 mapDataSDK \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
            return;
          }
          this.uralpro.mapDataSDK.set(key, value);
        },
        has: (key) => {
          return this.uralpro.mapDataSDK.has(key);
        },
        get: (key) => {
          return this.uralpro.mapDataSDK.get(key);
        },
        log(...args) {
          if (this.config.enableLoggingLib) {
            console.log(...utils.formatArgs(args));
          }
        },
        warn(...args) {
          if (this.config.enableLoggingLib) {
            console.warn(...utils.formatArgs(args));
          }
        },
        error(...args) {
          if (this.config.enableLoggingLib) {
            console.error(...utils.formatArgs(args));
          }
        },
        info(...args) {
          if (this.config.enableLoggingLib) {
            console.info(...utils.formatArgs(args));
          }
        },
        /** Стиль для логирования в консоль (color, background-color). */
        logStyle: (color = "#2e2727", bgColor = "black") => `style: color: ${color}; font-weight: bold; background-color: ${bgColor}; padding: 5px 10px; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); `,
        // ---------- Инициализация ----------
        init: () => {
          const self = this;
          if (self.uralpro.get("____init")) {
            return;
          }
          if (utils.isCalledFromConsole()) {
            self.uralpro.error("\u0417\u0430\u043F\u0443\u0441\u043A \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
            return;
          }
          self.uralpro.set("____init", true);
          self.uralpro.set("getPlayer", "");
          self.uralpro.set("sdk", null);
          self.uralpro.set("isSdkReadyStop", "START");
          self.uralpro.set("isSdkReady", false);
          self.uralpro.set("isSdkReadyData", false);
          self.uralpro.set("isLoaded", false);
          self.uralpro.set("isGameReady", false);
          self.uralpro.set("mapDataApp", /* @__PURE__ */ new Map());
          self.uralpro.set("saveDataOld1", /* @__PURE__ */ new Map());
          self.uralpro.set("saveDataOld2", /* @__PURE__ */ new Map());
          if (self.uralpro.config.disableLoggingHtml) {
            console.log = function() {
            };
            console.warn = function() {
            };
            console.error = function() {
            };
            console.info = function() {
            };
          }
          const platform = resolvePlatform();
          self.uralpro.set("platform", platform);
          if (platform === PLATFORM_CRAZYGAMES || platform === PLATFORM_GAMEPIX) {
            const custom = self.uralpro.config.saveIdPrefix;
            const prefix = typeof custom === "string" && custom.trim() ? custom.trim().startsWith(SAVE_ID_PREFIX) ? custom.trim() : SAVE_ID_PREFIX + "_" + custom.trim() : SAVE_ID_PREFIX + "_" + platform;
            self.uralpro.save_id000 = prefix;
            self.uralpro.log(`\u041F\u0440\u0435\u0444\u0438\u043A\u0441 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 (${platform}): ${prefix}`, self.uralpro.logStyle("#8bc34a", "black"));
          }
          self._platformAdapter = getPlatformAdapter(self.platform, self);
          self.ad = createAdApi(self);
          self.uralpro.log(`\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430: ${self.platform}`, self.uralpro.logStyle("green", "black"));
          function loadStartData() {
            const mapApp = self.uralpro.get("mapDataApp");
            function applyLoadedValue(idname, rawValue, defaultVal) {
              if (rawValue === void 0 || rawValue === null) {
                mapApp.set(idname, defaultVal);
                return;
              }
              if (utils.isCompressedString(rawValue)) {
                const decompressed = self.uralpro.decompressData(rawValue);
                mapApp.set(idname, utils.safeJsonParse(decompressed));
              } else {
                mapApp.set(idname, utils.parseStoredValue(rawValue));
              }
            }
            function setDefault(idname, defaultVal) {
              mapApp.set(idname, defaultVal);
            }
            function loadFromStorage(storage, idname, defaultVal) {
              const raw = storage.getItem(idname);
              if (raw !== null && raw !== void 0) {
                applyLoadedValue(idname, raw, defaultVal);
              } else {
                storage.setItem(idname, String(defaultVal));
                setDefault(idname, defaultVal);
              }
            }
            for (let i = 0; i < self.uralpro.save_idArray.length; i++) {
              const idname = self.uralpro.save_id000 + self.uralpro.save_idArray[i][0];
              let value = self.uralpro.save_idArray[i][1];
              if (Array.isArray(value)) {
                self.uralpro.save_idArray[i][1] = JSON.stringify(value);
              }
              const defaultVal = self.uralpro.save_idArray[i][1];
              const loadSource2 = self.uralpro.get("getPlayer") === PLATFORM_YANDEX ? PLATFORM_YANDEX : self.platform;
              switch (loadSource2) {
                case PLATFORM_YANDEX:
                case PLATFORM_VK:
                case PLATFORM_CRAZYGAMES:
                case PLATFORM_GAMEPIX: {
                  const mapApp2 = self.uralpro.get("mapDataApp");
                  if (mapApp2 && mapApp2.has(idname)) {
                    let dataN = mapApp2.get(idname);
                    if (utils.isNumber(defaultVal))
                      dataN = utils.removeNonDigits(dataN);
                    applyLoadedValue(idname, dataN, defaultVal);
                  } else {
                    setDefault(idname, defaultVal);
                  }
                  break;
                }
                case PLATFORM_PLAYDECK: {
                  const mapApp2 = self.uralpro.get("mapDataApp");
                  if (mapApp2 && mapApp2.has(idname)) {
                    let dataN = mapApp2.get(idname);
                    if (utils.isNumber(defaultVal))
                      dataN = utils.removeNonDigits(dataN);
                    applyLoadedValue(idname, dataN, defaultVal);
                  } else {
                    setDefault(idname, defaultVal);
                  }
                  break;
                }
                default:
                  loadFromStorage(localStorage, idname, defaultVal);
                  break;
              }
            }
            const knownKeys = new Set(self.uralpro.save_idArray.map(([k]) => k));
            const prefixLen = self.uralpro.save_id000.length;
            const loadSource = self.uralpro.get("getPlayer") === PLATFORM_YANDEX ? PLATFORM_YANDEX : self.platform;
            if (loadSource === PLATFORM_YANDEX || loadSource === PLATFORM_VK || loadSource === PLATFORM_PLAYDECK || loadSource === PLATFORM_CRAZYGAMES || loadSource === PLATFORM_GAMEPIX) {
              const mapApp2 = self.uralpro.get("mapDataApp");
              if (mapApp2) {
                mapApp2.forEach((rawVal, idname) => {
                  const key = idname.startsWith(self.uralpro.save_id000) ? idname.slice(prefixLen) : null;
                  if (key && !knownKeys.has(key) && !utils.isSystemSetting(key)) {
                    applyLoadedValue(idname, rawVal, rawVal);
                    self.uralpro.save_idArray.push([key, utils.normalizeDefaultValue(rawVal)]);
                    knownKeys.add(key);
                  }
                });
              }
            } else {
              let storage = localStorage;
              try {
                for (let j = 0; j < storage.length; j++) {
                  const idname = storage.key(j);
                  if (idname && idname.startsWith(self.uralpro.save_id000)) {
                    const key = idname.slice(prefixLen);
                    if (!knownKeys.has(key) && !utils.isSystemSetting(key)) {
                      const raw = storage.getItem(idname);
                      if (raw !== null && raw !== void 0) {
                        applyLoadedValue(idname, raw, raw);
                        self.uralpro.save_idArray.push([key, utils.normalizeDefaultValue(raw)]);
                        knownKeys.add(key);
                      }
                    }
                  }
                }
              } catch (e) {
                self.uralpro.warn("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u0434\u0433\u0440\u0443\u0437\u043A\u0435 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043A\u043B\u044E\u0447\u0435\u0439 \u0438\u0437 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430:", e);
              }
            }
            self.setData("UH-Platform", self.platform);
            if (!self.hasData("UH-UUID")) {
              self.setData("UH-UUID", self.js.generateUUID());
            }
            if (!self.hasData("UH-FirstLaunch")) {
              self.setData("UH-FirstLaunch", (/* @__PURE__ */ new Date()).toISOString());
            }
            if (!self.hasData("UH-NumberOfStarts")) {
              self.setData("UH-NumberOfStarts", 1);
            } else {
              self.setData("UH-NumberOfStarts", Number(self.getData("UH-NumberOfStarts", 1)) + 1);
            }
          }
          function getPlayerData() {
            return __async(this, null, function* () {
              if (!self.uralpro.get("sdk")) {
                throw new Error("Yandex SDK \u043D\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D.");
              }
              try {
                const _player = yield self.uralpro.get("sdk").getPlayer();
                if (!_player) {
                  throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442 \u0438\u0433\u0440\u043E\u043A\u0430.");
                }
                self.uralpro.set("getPlayer", PLATFORM_YANDEX);
                self.uralpro.set("_player", _player);
                let attempts = 3;
                let dataLoaded = false;
                while (attempts > 0 && !dataLoaded) {
                  try {
                    const dataYA = yield _player.getData();
                    if (dataYA && dataYA.data) {
                      const data = dataYA.data;
                      const mapApp = self.uralpro.get("mapDataApp");
                      for (const entry of data) {
                        mapApp.set(entry[0], entry[1]);
                      }
                      dataLoaded = true;
                    } else {
                      self.uralpro.warn("\u0414\u0430\u043D\u043D\u044B\u0435 \u0438\u0433\u0440\u043E\u043A\u0430 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442 \u0438\u043B\u0438 \u043D\u0435 \u0431\u044B\u043B\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u044B.");
                      dataLoaded = true;
                    }
                  } catch (error) {
                    self.uralpro.error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u0430. \u041F\u043E\u043F\u044B\u0442\u043E\u043A \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C: ${attempts - 1}`, error);
                    attempts--;
                    yield new Promise((res) => setTimeout(res, 2e3));
                  }
                }
                if (!dataLoaded) {
                  self.uralpro.error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0438\u0433\u0440\u043E\u043A\u0430. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0443.");
                  self.uralpro.set("isSdkReadyStop", "STOP");
                }
                loadStartData.bind(self)();
                self.uralpro.set("setup_saveData", 1);
                self.saveData();
                setInterval(self.saveData, 1e3 * 60);
                if (dataLoaded) {
                  self.uralpro.set("isSdkReadyData", true);
                  self.uralpro.set("isSdkReadyStop", "START");
                }
              } catch (error) {
                self.uralpro.set("isSdkReadyStop", "STOP");
                self.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 initPlayer:", error);
                setTimeout(() => getPlayerData.bind(self)(), 1e3);
              }
            });
          }
          function setupSafeStorage() {
            return __async(this, null, function* () {
              if (!self.uralpro.get("sdk"))
                throw new Error("Yandex SDK \u043D\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D.");
              try {
                const safeStorage = yield self.uralpro.get("sdk").getStorage();
                Object.defineProperty(window, "localStorage", {
                  get: () => safeStorage
                });
                self.uralpro.log("\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0435 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u043E.");
              } catch (error) {
                self.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0433\u043E \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430:", error);
              }
            });
          }
          runPlatformSetup(self.platform, self, {
            loadStartData: () => loadStartData(),
            setupSafeStorage: () => setupSafeStorage(),
            getPlayerData: () => getPlayerData()
          });
          if (self.uralpro.config.panelFPS)
            runFpsPanel(self);
          if (self.uralpro.config.errorTracking) {
            try {
              runErrorTracking(self);
            } catch (e) {
              self.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0432 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0435 \u043E\u0448\u0438\u0431\u043E\u043A:", e);
            }
          }
        }
      };
      this.scriptManager = utils.createScriptManager(this);
      this.lb = createLeaderboard(this);
      this.debugMenu = createDebugMenu(this);
      this.audio = createAudioModule(this);
      this.js = utils.createJsHelpers(this);
      this.payments = createPayments(this);
      this._storage = createStorageApi(this);
      Object.freeze(this.js.saveFunction);
      Object.freeze(this.js.callFunction);
      Object.freeze(this.js.saveVariable);
      Object.freeze(this.js.getVariable);
      Object.freeze(this.js.updateVariable);
      document.addEventListener("DOMContentLoaded", () => {
        this.audio.init();
        this.uralpro.init();
        setTimeout(() => {
          this.saveManager.createSaveManagerButton();
        }, 1e3);
        setTimeout(() => {
          var _a, _b;
          (_b = (_a = this.debugMenu) == null ? void 0 : _a.create) == null ? void 0 : _b.call(_a);
        }, 1200);
      });
    }
    // ---------- Версия, платформа, язык ----------
    get version() {
      return "0.240";
    }
    get language() {
      return this.uralpro.get("lang");
    }
    get platform() {
      return this.uralpro.get("platform");
    }
    get platform_() {
      return this.uralpro.get("_player");
    }
    /**
     * Серверное время (на Яндексе — от SDK, иначе Date.now()).
     * Возвращает Promise<number> (мс); SDK Яндекса может отдавать значение синхронно или через Promise.
     */
    serverTime() {
      return __async(this, null, function* () {
        if (this.platform !== PLATFORM_YANDEX) {
          return Date.now();
        }
        const sdk = this.uralpro.get("sdk");
        if (!sdk) {
          return Date.now();
        }
        const fn = sdk.serverTime || sdk.getServerTime;
        if (typeof fn !== "function") {
          this.uralpro.warn("serverTime \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0432 SDK, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F Date.now()");
          return Date.now();
        }
        try {
          const t = fn.call(sdk);
          if (t != null && typeof t.then === "function") {
            return yield t;
          }
          return typeof t === "number" ? t : Date.now();
        } catch (e) {
          this.uralpro.warn("\u041E\u0448\u0438\u0431\u043A\u0430 serverTime:", e);
          return Date.now();
        }
      });
    }
    get gamesList() {
      var result = null;
      if (this.platform == PLATFORM_YANDEX) {
        if (this.uralpro.get("sdk")) {
          result = this.uralpro.get("yandex_getAllGames");
        }
      }
      return result;
    }
    // ---------- Оценка (review) ----------
    requestReview(onSuccess, onClose, onError) {
      return __async(this, null, function* () {
        var _a;
        if (!((_a = this.uralpro.get("sdk")) == null ? void 0 : _a.feedback)) {
          this.uralpro.warn("\u0424\u0443\u043D\u043A\u0446\u0438\u044F \u043E\u0446\u0435\u043D\u043A\u0438 \u0438\u0433\u0440\u044B \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430.");
          if (typeof onError === "function")
            onError();
          return;
        }
        if (this.uralpro.get("yandex_canReview") == true) {
          this.uralpro.get("sdk").feedback.canReview().then(({
            value,
            reason
          }) => {
            this.uralpro.log("\u0417\u0430\u043F\u0440\u043E\u0441 \u043E\u0446\u0435\u043D\u043A\u0438 \u0438\u0433\u0440\u044B \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D.");
            this.uralpro.set("yandex_canReview", value);
            if (value) {
              this.uralpro.get("sdk").feedback.requestReview().then(({
                feedbackSent
              }) => {
                if (feedbackSent) {
                  if (typeof onSuccess === "function") {
                    onSuccess();
                  }
                } else {
                  if (typeof onClose === "function") {
                    onClose();
                  }
                }
                this.uralpro.set("yandex_canReview", false);
              });
            } else {
              if (typeof onError === "function")
                onError();
            }
          });
        } else {
          if (typeof onError === "function")
            onError();
        }
      });
    }
    get checkCanReview() {
      var result = null;
      if (this.platform == PLATFORM_YANDEX) {
        if (this.uralpro.get("sdk")) {
          result = this.uralpro.get("yandex_canReview");
        }
      }
      return result;
    }
    // ---------- Игровой цикл (gameStart / gameStop) ----------
    /** API gameplayStart/Stop для Poki, CrazyGames, GamePix (или null для Yandex features). */
    _getGameplayApi() {
      if (!this.uralpro.get("isSdkReady") || !this.uralpro.get("sdk"))
        return null;
      const platform = this.platform;
      const sdk = this.uralpro.get("sdk");
      if (platform === PLATFORM_POKI || platform === PLATFORM_GAMEPIX)
        return sdk;
      if (platform === PLATFORM_CRAZYGAMES)
        return sdk.game || null;
      return null;
    }
    gameStart() {
      return __async(this, null, function* () {
        var _a, _b;
        const api = this._getGameplayApi();
        if (api) {
          try {
            if (typeof api.gameplayStart === "function") {
              api.gameplayStart();
            }
          } catch (error) {
            this.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 gameStart:", error);
          }
          return;
        }
        if (!((_a = this.uralpro.get("sdk")) == null ? void 0 : _a.features))
          return;
        try {
          yield (_b = this.uralpro.get("sdk").features.GameplayAPI) == null ? void 0 : _b.start();
        } catch (error) {
          this.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 gameStart:", error);
        }
      });
    }
    gameStop() {
      return __async(this, null, function* () {
        var _a, _b;
        const api = this._getGameplayApi();
        if (api) {
          try {
            if (typeof api.gameplayStop === "function") {
              api.gameplayStop();
            }
          } catch (error) {
            this.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 gameStop:", error);
          }
          return;
        }
        if (!((_a = this.uralpro.get("sdk")) == null ? void 0 : _a.features))
          return;
        try {
          yield (_b = this.uralpro.get("sdk").features.GameplayAPI) == null ? void 0 : _b.stop();
        } catch (error) {
          this.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 gameStop:", error);
        }
      });
    }
    // ---------- Видимость страницы и пауза ----------
    documentVisibility({
      onHidden = () => {
      },
      onVisible = () => {
      }
    } = {}) {
      const setupVisibilityHandlers = () => {
        const adapter = this._platformAdapter;
        const isGamePix = this.platform === PLATFORM_GAMEPIX;
        const isPlayDeck = this.platform === PLATFORM_PLAYDECK;
        const ensureGamePixPause = () => {
          var _a, _b;
          if (!isGamePix)
            return;
          if (this.uralpro.get("__gamepix_auto_paused"))
            return;
          this.uralpro.set("__gamepix_auto_paused", true);
          try {
            (_b = (_a = this.gamepix) == null ? void 0 : _a.pause) == null ? void 0 : _b.call(_a);
          } catch (e) {
          }
        };
        const ensureGamePixResume = () => {
          var _a, _b;
          if (!isGamePix)
            return;
          if (!this.uralpro.get("__gamepix_auto_paused"))
            return;
          this.uralpro.set("__gamepix_auto_paused", false);
          try {
            (_b = (_a = this.gamepix) == null ? void 0 : _a.resume) == null ? void 0 : _b.call(_a);
          } catch (e) {
          }
        };
        const doPause = () => {
          var _a;
          if (this.uralpro.get("isPageHidden"))
            return;
          if (this.uralpro.config.audioMuteDocumentVisibility)
            this.audio.muteAll();
          this.uralpro.set("isPageHidden", true);
          if (typeof onHidden === "function")
            onHidden();
          try {
            (_a = adapter == null ? void 0 : adapter.pause) == null ? void 0 : _a.call(adapter);
          } catch (_) {
          }
          ensureGamePixPause();
        };
        const doResume = () => {
          var _a, _b;
          if (!this.uralpro.get("isPageHidden"))
            return;
          if (((_a = this.audio.context) == null ? void 0 : _a.state) === "suspended")
            this.audio.context.resume();
          if (this.uralpro.config.audioMuteDocumentVisibility)
            this.audio.unmuteAll();
          this.uralpro.set("isPageHidden", false);
          try {
            (_b = adapter == null ? void 0 : adapter.resume) == null ? void 0 : _b.call(adapter);
          } catch (_) {
          }
          if (typeof onVisible === "function")
            onVisible();
          ensureGamePixResume();
        };
        this._visibilityDoPause = doPause;
        this._visibilityDoResume = doResume;
        if (this.platform === PLATFORM_YANDEX) {
          const sdk = this.uralpro.get("sdk");
          if (!(sdk == null ? void 0 : sdk.on) || !(sdk == null ? void 0 : sdk.off)) {
            this.uralpro.error("Yandex SDK \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u0441\u043E\u0431\u044B\u0442\u0438\u044F game_api_pause.");
            return;
          }
          sdk.on("game_api_pause", doPause);
          sdk.on("game_api_resume", doResume);
          this.uralpro.log("\u041F\u043E\u0434\u043F\u0438\u0441\u043A\u0430 \u043D\u0430 \u0441\u043E\u0431\u044B\u0442\u0438\u044F game_api_pause \u0438 game_api_resume \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430.", this.uralpro.logStyle("blue", "yellow"));
        } else {
          document.addEventListener("visibilitychange", () => {
            if (document.hidden)
              doPause();
            else
              doResume();
          }, false);
          if ((isGamePix || isPlayDeck) && !this.uralpro.get("__visibility_extra_handlers_set")) {
            this.uralpro.set("__visibility_extra_handlers_set", true);
            window.addEventListener("pagehide", doPause, true);
            window.addEventListener("pageshow", doResume, true);
          }
          this.uralpro.log("\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A visibilitychange \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D \u0434\u043B\u044F \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430.", this.uralpro.logStyle("blue", "yellow"));
        }
      };
      const waitForReadiness = () => {
        const MAX_WAIT = 1e4;
        const start = Date.now();
        const check = () => {
          const loaded = this.uralpro.get("isLoaded");
          const sdkReady = this.uralpro.get("isSdkReady");
          const gameReady = this.uralpro.get("isGameReady");
          const isYandex = this.platform === PLATFORM_YANDEX;
          const isFileOrUnknown = this.platform === PLATFORM_FILE || this.platform === PLATFORM_UNKNOWN;
          const ready = isFileOrUnknown || (isYandex ? loaded && sdkReady && gameReady : loaded && sdkReady);
          if (ready) {
            setupVisibilityHandlers();
          } else if (Date.now() - start < MAX_WAIT) {
            setTimeout(check, 500);
          } else {
            this.uralpro.error("\u0422\u0430\u0439\u043C\u0430\u0443\u0442 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F \u0433\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u0438 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B \u0434\u043B\u044F documentVisibility \u2014 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0430\u0435\u043C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0438 \u043F\u0440\u0438\u043D\u0443\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E.");
            setupVisibilityHandlers();
          }
        };
        check();
      };
      waitForReadiness();
    }
    statusPurchase(key) {
      return this.payments.statusPurchase(key);
    }
    productsPurchase(key) {
      return this.payments.productsPurchase(key);
    }
    consumePurchase(endFun) {
      this.payments.consumePurchase(endFun);
    }
    getPurchase(key, endFun, errorFun) {
      this.payments.getPurchase(key, endFun, errorFun);
    }
    getFlags(key, default_value) {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      let value = default_value;
      if (this.platform == "yandex") {
        if (key) {
          const flags = this.uralpro.get("yandex_flags") || {};
          value = flags[key] !== void 0 ? flags[key] : default_value;
        } else {
          value = this.uralpro.get("yandex_flags");
        }
      }
      return value;
    }
    statusShortcut() {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      let value = false;
      if (this.platform == "yandex") {
        value = this.uralpro.get("shortcut_available");
      }
      return value;
    }
    addShortcut(f, ff) {
      return __async(this, null, function* () {
        if (utils.isCalledFromConsole()) {
          this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
          return;
        }
        try {
          if (this.statusShortcut()) {
            const result = yield this.uralpro.get("sdk").shortcut.showPrompt();
            this.uralpro.set("shortcut_result", result.outcome);
            if (result.outcome === "accepted") {
              if (typeof f === "function") {
                f();
              }
            } else {
              if (typeof ff === "function") {
                ff();
              }
            }
            this.uralpro.log("\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u044F\u0440\u043B\u044B\u043A\u0430:", result.outcome);
          }
        } catch (error) {
          this.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u044F\u0440\u043B\u044B\u043A\u0430:", error);
          this.uralpro.set("shortcut_result", "error");
        }
      });
    }
    setGameReady() {
      this.uralpro.set("isGameReady", true);
      this.uralpro.log("\u0420\u0435\u0441\u0443\u0440\u0441\u044B \u0438\u0433\u0440\u044B \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u044B.", this.uralpro.logStyle("green", "black"));
      this.ready();
      this.consumePurchase();
    }
    // ---------- Готовность (ready) ----------
    ready() {
      if (this.platform == PLATFORM_YANDEX && (!this.uralpro.get("isLoaded") || !this.uralpro.get("isSdkReady") || !this.uralpro.get("isGameReady"))) {
        this.uralpro.log("SDK \u0438\u043B\u0438 \u0438\u0433\u0440\u0430 \u0435\u0449\u0451 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432\u044B. \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435...");
        setTimeout(() => this.ready(), 1e3);
        return;
      }
      if (this.platform == PLATFORM_POKI && (!this.uralpro.get("isSdkReady") || !this.uralpro.get("isGameReady"))) {
        this.uralpro.log("SDK \u0438\u043B\u0438 \u0438\u0433\u0440\u0430 \u0435\u0449\u0451 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432\u044B. \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435...");
        setTimeout(() => this.ready(), 1e3);
        return;
      }
      if (this.platform == PLATFORM_GAMEPIX && (!this.uralpro.get("isSdkReady") || !this.uralpro.get("isGameReady"))) {
        this.uralpro.log("SDK \u0438\u043B\u0438 \u0438\u0433\u0440\u0430 \u0435\u0449\u0451 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432\u044B. \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435...");
        setTimeout(() => this.ready(), 1e3);
        return;
      }
      this.uralpro.log("SDK \u0438 \u0438\u0433\u0440\u0430 \u0433\u043E\u0442\u043E\u0432\u044B!", this.uralpro.logStyle("green", "black"));
      this._notifyPlatformLoaded();
    }
    /** Уведомить платформу о завершении загрузки игры (LoadingAPI.ready / gameLoadingFinished / loaded). */
    _notifyPlatformLoaded() {
      var _a, _b;
      const platform = this.platform;
      const sdk = this.uralpro.get("sdk");
      switch (platform) {
        case PLATFORM_YANDEX:
          (_b = (_a = sdk == null ? void 0 : sdk.features) == null ? void 0 : _a.LoadingAPI) == null ? void 0 : _b.ready();
          break;
        case PLATFORM_POKI:
          if (typeof (sdk == null ? void 0 : sdk.gameLoadingFinished) === "function")
            sdk.gameLoadingFinished();
          break;
        case PLATFORM_GAMEPIX:
          if (sdk && typeof sdk.loaded === "function" && !this.uralpro.get("gamepix_loaded_called")) {
            try {
              sdk.loaded();
              this.uralpro.set("gamepix_loaded_called", true);
              this.uralpro.log("GamePix.loaded() \u0432\u044B\u0437\u0432\u0430\u043D.");
            } catch (e) {
              this.uralpro.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u044B\u0437\u043E\u0432\u0430 GamePix.loaded():", e);
            }
          }
          this.uralpro.log("GamePix SDK \u0433\u043E\u0442\u043E\u0432 \u043A \u0440\u0430\u0431\u043E\u0442\u0435.");
          break;
      }
    }
    // ---------- Проверка сети ----------
    checkInternetConnection() {
      function formatDate(date) {
        let day = String(date.getDate()).padStart(2, "0");
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let year = String(date.getFullYear()).slice(-2);
        let hours = String(date.getHours()).padStart(2, "0");
        let minutes = String(date.getMinutes()).padStart(2, "0");
        let seconds = String(date.getSeconds()).padStart(2, "0");
        return `${day}${month}${year}${hours}${minutes}${seconds}`;
      }
      return new Promise((resolve) => {
        let now = /* @__PURE__ */ new Date();
        let formattedDate = formatDate(now);
        let checkUrl;
        const platform = this.platform;
        switch (platform) {
          case PLATFORM_POKI:
            checkUrl = "https://poki.com/favicon.ico?" + formattedDate;
            break;
          case PLATFORM_YANDEX:
            checkUrl = "https://yastatic.net/favicon.ico?" + formattedDate;
            break;
          case PLATFORM_VK:
            checkUrl = "https://vk.com/favicon.ico?" + formattedDate;
            break;
          case PLATFORM_GAMEPIX:
            checkUrl = "https://www.gamepix.com/favicon.ico?" + formattedDate;
            break;
          default:
            checkUrl = "https://www.google.com/favicon.ico?" + formattedDate;
            break;
        }
        if (navigator.onLine) {
          fetch(checkUrl, {
            mode: "no-cors",
            headers: {
              "Custom-Header": "InternetCheck",
              "X-Purpose": "Internet-Connectivity-Check"
            },
            cache: "no-store",
            credentials: "omit"
          }).then(() => {
            this.uralpro.log("\u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442 \u0435\u0441\u0442\u044C!", this.uralpro.logStyle("black", "#69667d"));
            resolve(true);
          }).catch(() => {
            this.uralpro.log("\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u0441 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u043E\u043C.", this.uralpro.logStyle("red", "#69667d"));
            resolve(false);
          });
        } else {
          this.uralpro.log("navigator.onLine \u0432\u0435\u0440\u043D\u0443\u043B false, \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0430 \u043D\u0435\u0442.", this.uralpro.logStyle("red", "#69667d"));
          resolve(false);
        }
      });
    }
    // ---------- Колбэк готовности SDK ----------
    onSdkReady(callback) {
      if (!this.uralpro.has("onSdkReady_END")) {
        if (this.uralpro.get("isSdkReadyStop") == "START") {
          if (!this.uralpro.has("platform")) {
            setTimeout(() => this.onSdkReady(callback), 300);
          } else {
            if (this.uralpro.get("isSdkReady") && this.uralpro.get("isSdkReadyData")) {
              if (this.platform == PLATFORM_FILE || this.platform == PLATFORM_ANDROID) {
                callback();
                this.uralpro.set("onSdkReady_END", "END");
              } else {
                this.checkInternetConnection().then((isOnline) => {
                  if (isOnline) {
                    callback();
                    this.uralpro.set("onSdkReady_END", "END");
                  } else {
                    this.uralpro.error("\u041D\u0435\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u043A \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0443. \u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F...");
                    setTimeout(() => this.onSdkReady(callback), 1e3);
                  }
                });
              }
            } else {
              setTimeout(() => this.onSdkReady(callback), 1e3);
            }
          }
        } else {
          setTimeout(() => this.onSdkReady(callback), 1e3);
        }
      }
    }
    setData(key, value) {
      this._storage.setData(key, value);
    }
    hasData(key) {
      return this._storage.hasData(key);
    }
    // ---------- Публичное API: данные (getData / setData) ----------
    getData(key) {
      return this._storage.getData(key);
    }
    // ---------- save_idArray, сжатие, менеджер сохранений ----------
    defsetData(key) {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 mapDataSDK \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      if (this.uralpro.save_idArray) {
        const data = this.uralpro.save_idArray;
        const value = utils.getValueByKey(data, key);
        this.uralpro.log(value);
        if (data && value) {
          this.setData(key, value);
          return;
        }
      }
      this.uralpro.warn(key + " - \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E, \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 undefined");
      this.setData(key, void 0);
    }
    // Автоматическое добавление новых настроек в save_idArray
    autoAddToSaveIdArray(key, value) {
      const exists = this.uralpro.save_idArray.some(([existingKey]) => existingKey === key);
      if (!exists) {
        const defaultValue = utils.normalizeDefaultValue(value);
        this.uralpro.save_idArray.push([key, defaultValue]);
        if (utils.isUserSetting(key)) {
          this.uralpro.log(`\u{1F527} \u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u043D\u043E\u0432\u0430\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430: ${key} = ${defaultValue}`, this.uralpro.logStyle("#2e2727", "#b49a11"));
        } else {
          this.uralpro.log(`\u{1F4BE} \u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440: ${key} = ${defaultValue}`, this.uralpro.logStyle("#2e2727", "#4a90e2"));
        }
      }
    }
    // Публичные методы для работы со сжатием
    enableDataCompression(threshold = 100, keys = []) {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0441\u0436\u0430\u0442\u0438\u044F \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      this.uralpro.config.enableCompression = true;
      this.uralpro.config.compressionThreshold = threshold;
      this.uralpro.config.compressKeys = Array.isArray(keys) ? keys : [];
      if (this.uralpro.config.enableCompressionLogging) {
        this.uralpro.log(`\u0421\u0436\u0430\u0442\u0438\u0435 \u0434\u0430\u043D\u043D\u044B\u0445 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u043E. \u041F\u043E\u0440\u043E\u0433: ${threshold} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432, \u043A\u043B\u044E\u0447\u0438: ${keys.length > 0 ? keys.join(", ") : "\u0432\u0441\u0435"}`, this.uralpro.logStyle("#2e2727", "#4CAF50"));
      }
    }
    disableDataCompression() {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0441\u0436\u0430\u0442\u0438\u044F \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      this.uralpro.config.enableCompression = false;
      if (this.uralpro.config.enableCompressionLogging) {
        this.uralpro.log("\u0421\u0436\u0430\u0442\u0438\u0435 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E", this.uralpro.logStyle("#2e2727", "#f44336"));
      }
    }
    getCompressionStatus() {
      return {
        enabled: this.uralpro.config.enableCompression,
        threshold: this.uralpro.config.compressionThreshold,
        keys: this.uralpro.config.compressKeys,
        loggingEnabled: this.uralpro.config.enableCompressionLogging,
        lzStringAvailable: this.uralpro.isLZStringAvailable()
      };
    }
    // Принудительное сжатие данных (для ручного использования)
    compressDataManually(data) {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0421\u0436\u0430\u0442\u0438\u0435 \u0434\u0430\u043D\u043D\u044B\u0445 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return data;
      }
      return this.uralpro.compressData(data);
    }
    // Принудительная распаковка данных (для ручного использования)
    decompressDataManually(data) {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0420\u0430\u0441\u043F\u0430\u043A\u043E\u0432\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return data;
      }
      return this.uralpro.decompressData(data);
    }
    // Получение сырых данных без распаковки
    getRawData(key) {
      return this._storage.getRawData(key);
    }
    // Проверка, сжаты ли данные
    isDataCompressed(key) {
      const rawData = this.getRawData(key);
      return utils.isCompressedString(rawData);
    }
    // Включить логирование операций сжатия
    enableCompressionLogging() {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043B\u043E\u0433\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      this.uralpro.config.enableCompressionLogging = true;
      this.uralpro.log("\u041B\u043E\u0433\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0436\u0430\u0442\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u043E", this.uralpro.logStyle("#2e2727", "#4CAF50"));
    }
    // Отключить логирование операций сжатия
    disableCompressionLogging() {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043B\u043E\u0433\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      this.uralpro.config.enableCompressionLogging = false;
      this.uralpro.log("\u041B\u043E\u0433\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0441\u0436\u0430\u0442\u0438\u044F \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E", this.uralpro.logStyle("#2e2727", "#f44336"));
    }
    // Включить менеджер сохранений
    enableSaveManager() {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      this.uralpro.config.enableSaveManager = true;
      this.uralpro.log("\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0432\u043A\u043B\u044E\u0447\u0435\u043D", this.uralpro.logStyle("#2e2727", "#4CAF50"));
    }
    // Отключить менеджер сохранений
    disableSaveManager() {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      this.uralpro.config.enableSaveManager = false;
      this.uralpro.log("\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D", this.uralpro.logStyle("#2e2727", "#f44336"));
    }
    // Показать кнопку менеджера сохранений
    showSaveManagerButton() {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      this.uralpro.config.showSaveManagerButton = true;
      this.saveManager.createSaveManagerButton();
      this.uralpro.log("\u041A\u043D\u043E\u043F\u043A\u0430 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u0430", this.uralpro.logStyle("#2e2727", "#4CAF50"));
    }
    // Скрыть кнопку менеджера сохранений
    hideSaveManagerButton() {
      if (utils.isCalledFromConsole()) {
        this.uralpro.error("\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0438\u0437 \u043A\u043E\u043D\u0441\u043E\u043B\u0438 \u0437\u0430\u043F\u0440\u0435\u0449\u0435\u043D\u043E.");
        return;
      }
      this.uralpro.config.showSaveManagerButton = false;
      this.saveManager.removeSaveManagerButton();
      this.uralpro.log("\u041A\u043D\u043E\u043F\u043A\u0430 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u0441\u043A\u0440\u044B\u0442\u0430", this.uralpro.logStyle("#2e2727", "#f44336"));
    }
    // Получить статус менеджера сохранений
    getSaveManagerStatus() {
      return {
        enabled: this.uralpro.config.enableSaveManager,
        buttonVisible: this.uralpro.config.showSaveManagerButton,
        buttonExists: !!document.getElementById("save-manager-button")
      };
    }
    isSystemSetting(key) {
      return utils.isSystemSetting(key);
    }
    isUserSetting(key) {
      return utils.isUserSetting(key);
    }
    isGameData(key) {
      return utils.isGameData(key);
    }
  };
  if (typeof window !== "undefined") {
    window.UralProHelperJS = UralProHelperJS;
  }
  var src_default = UralProHelperJS;
})();
/*! Ural Pro Helper JS v0.240 */
