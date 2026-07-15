import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase, ref, set, update, get, remove, onValue, off, onDisconnect,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* ============================== data ============================== */

const CATEGORIES = {
  streamers:  { label: "Стримеры", labelEn: "Streamers", emoji: "🎥", words: ["Mellstroy","A4","Buster","Papich","Ivangai","xQc","Ninja","Pokimane","Shroud","TommyInnit","Kuplinov","Морган","DedInside","Kuzya","Jesus AVGN"] },
  games:      { label: "Видеоигры", labelEn: "Video games", emoji: "🎮", words: ["CS 2","Dota 2","Minecraft","GTA V","Fortnite","Valorant","The Witcher 3","Genshin Impact","League of Legends","Among Us","Roblox","Cyberpunk 2077","Elden Ring","PUBG","Apex Legends"] },
  jobs:       { label: "Профессии", labelEn: "Professions", emoji: "💼", words: ["Хирург","Пилот","Повар","Учитель","Полицейский","Пожарный","Программист","Стоматолог","Адвокат","Архитектор","Диджей","Бариста","Электрик","Косметолог","Таксист"] },
  animals:    { label: "Животные", labelEn: "Animals", emoji: "🦁", words: ["Лев","Дельфин","Панда","Жираф","Пингвин","Крокодил","Кенгуру","Осьминог","Волк","Сова","Ёж","Фламинго","Тигр","Коала","Черепаха"] },
  food:       { label: "Еда", labelEn: "Food", emoji: "🍜", words: ["Пицца","Суши","Борщ","Бургер","Паста","Шаурма","Плов","Тако","Рамен","Пельмени","Оливье","Круассан","Мороженое","Стейк","Хачапури"] },
  countries:  { label: "Страны", labelEn: "Countries", emoji: "🌍", words: ["Япония","Бразилия","Египет","Норвегия","Таиланд","Италия","Исландия","Мексика","Индия","Марокко","Канада","Австралия","Турция","Куба","Швейцария"] },
  sport:      { label: "Спорт", labelEn: "Sports", emoji: "🏆", words: ["Футбол","Баскетбол","Теннис","Хоккей","Бокс","Плавание","Сёрфинг","Волейбол","Гимнастика","Регби","Керлинг","Скейтбординг","Дартс","Бильярд","Бадминтон"] },
  movies:     { label: "Фильмы и сериалы", labelEn: "Movies & TV", emoji: "🎬", words: ["Титаник","Матрица","Аватар","Джокер","Интерстеллар","Терминатор","Бойцовский клуб","Начало","Гарри Поттер","Игра престолов","Во все тяжкие","Один дома","Крёстный отец","Форрест Гамп","Люцифер"] },
  superheroes:{ label: "Супергерои", labelEn: "Superheroes", emoji: "🦸", words: ["Бэтмен","Человек-паук","Железный человек","Тор","Халк","Флэш","Дэдпул","Росомаха","Чудо-женщина","Капитан Америка","Веном","Доктор Стрэндж","Аквамен","Женщина-кошка"] },
  cars:       { label: "Марки авто", labelEn: "Car brands", emoji: "🚗", words: ["Tesla","BMW","Toyota","Ferrari","Lada","Mercedes","Audi","Porsche","Lamborghini","Volkswagen","Hyundai","Nissan","Honda","Ford","Chevrolet"] },
  space:      { label: "Космос", labelEn: "Space", emoji: "🚀", words: ["Луна","Марс","Чёрная дыра","Млечный Путь","МКС","Комета","Астероид","Сатурн","Метеорит","Телескоп","Скафандр","Ракета","Юпитер","Галактика","Затмение"] },
  apps:       { label: "Соцсети и приложения", labelEn: "Apps & social", emoji: "📱", words: ["TikTok","Instagram","Telegram","YouTube","WhatsApp","Discord","Spotify","Twitch","Pinterest","Snapchat","Reddit","VK","Zoom","Netflix","Duolingo"] },
  boardgames: { label: "Настольные игры", labelEn: "Board games", emoji: "🎲", words: ["Монополия","Шахматы","Мафия","Уно","Дженга","Скрэббл","Твистер","Каркассон","Домино","Шашки","Эрудит","Крестики-нолики","Покер","Нарды","Бинго"] },
  anime:      { label: "Аниме", labelEn: "Anime", emoji: "⛩️", words: ["Наруто","Ван-Пис","Атака титанов","Тетрадь смерти","Человек-бензопила","Драконий жемчуг","Магическая битва","Токийский гуль","Твоё имя","Убийца демонов","Евангелион","Сейлор Мун","Хантер×Хантер","Стальной алхимик"] },
  drinks:     { label: "Напитки", labelEn: "Drinks", emoji: "🥤", words: ["Кофе","Чай","Кола","Морс","Смузи","Молочный коктейль","Лимонад","Квас","Компот","Какао","Энергетик","Айран","Сок","Газировка","Матча"] },
  holidays:   { label: "Праздники", labelEn: "Holidays", emoji: "🎉", words: ["Новый год","День рождения","Хэллоуин","8 марта","23 февраля","Пасха","Масленица","День святого Валентина","Выпускной","Свадьба","1 сентября","Новоселье","День победы","Юбилей","Пикник"] },
  school:     { label: "Школьные предметы", labelEn: "School subjects", emoji: "📚", words: ["Математика","Физика","Химия","История","География","Биология","Литература","Информатика","Физкультура","Английский язык","Музыка","ИЗО","Труд","Обществознание","Астрономия"] },
  places:     { label: "Места", labelEn: "Places", emoji: "📍", hard: true,
    wordsEasy: ["Школа","Больница","Магазин","Кинотеатр","Ресторан","Кафе","Парк","Пляж","Стадион","Библиотека","Отель","Аэропорт","Автобусная остановка","Почта","Банк","Супермаркет","Зоопарк","Музей"],
    wordsHard: ["Крематорий","Военная база","Бункер","Нефтяная платформа","Подводная лодка","Обсерватория","Серверная","Электростанция","Радиостанция","Лаборатория","Космодром","Шахта","Очистные сооружения","Морской порт","Диспетчерская вышка"],
    get words() { return this.wordsEasy.concat(this.wordsHard); } }
};

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0, I/1 — avoids mis-reads
const MIN_PLAYERS_FOR_TWO_SPIES = 6; // keeps at least 4 non-spies in the room
const VOTE_SECONDS_OPTIONS = [60, 120, 180, 240, 300];

// Returns the word pool for a category, respecting the "Места" difficulty
// setting when relevant. Custom categories (keys starting "custom:") resolve
// from the local merged set. Every other built-in category is unaffected.
function wordsForCategory(catKey, placesDifficulty) {
  const c = allCategories()[catKey];
  if (!c) return [];
  if (catKey === "places") {
    if (placesDifficulty === "easy") return c.wordsEasy;
    if (placesDifficulty === "hard") return c.wordsHard;
    return c.words; // "all" or unset
  }
  return c.words;
}

/* ============================== icons ============================== */

const ICON = {
  sparkles: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
  lock: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  clock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  play: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>',
  rotate: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  eye: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>',
  phone: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  globe: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/></svg>',
  crown: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19h20l-2-9-5 4-3-8-3 8-5-4-2 9Z"/></svg>',
  copy: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  refresh: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6M3 22v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L21 8M3 16l2.64 2.36A9 9 0 0 0 20.49 15"/></svg>',
  sound: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>',
  soundOff: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m23 9-6 6M17 9l6 6"/></svg>',
  gear: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
  play2: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause2: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>',
  prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14l-11-7z"/></svg>',
  next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM4 5l11 7-11 7z"/></svg>',
  note: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>'
};

/* ============================== helpers ============================== */

function fmtTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}
function esc(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function genCode() {
  let out = "";
  for (let i = 0; i < 5; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return out;
}
function genFallbackId() {
  return "p-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
function getMyId() {
  let id = sessionStorage.getItem("spyPlayerId");
  if (!id) {
    id = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : genFallbackId();
    sessionStorage.setItem("spyPlayerId", id);
  }
  return id;
}

/* ============================== firebase ============================== */

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

function roomRef(code) { return ref(db, `rooms/${code}`); }
function playerRef(code, id) { return ref(db, `rooms/${code}/players/${id}`); }

/* ============================== state ============================== */

const MY_ID = getMyId();

// ---- persisted UI settings (localStorage) — presentation only, never sent to Firebase ----
function loadSetting(key, fallback) {
  try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
  catch { return fallback; }
}
function saveSetting(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
// Custom categories are stored locally per device (not synced) and merged into
// the picker. They use string keys prefixed "custom:" so they never collide
// with the built-in CATEGORIES keys the online room logic relies on.
function loadCustomCategories() {
  const raw = loadSetting("spyCustomCats", {});
  return (raw && typeof raw === "object") ? raw : {};
}

const state = {
  screen: "menu", // menu | home | setup | reveal | discuss | result | online-home | online-create | online-join | online-room | custom | settings
  // local (pass-the-phone) mode
  categoryKey: null,
  playerCount: 5,
  word: "",
  spyIndex: 0,
  currentPlayer: 0,
  flipped: false,
  discussSeconds: 300,
  timeLeft: 300,
  timerRunning: false,
  // online mode
  name: sessionStorage.getItem("spyPlayerName") || "",
  joinCodeInput: "",
  roomCode: null,
  room: null,        // live snapshot of rooms/{code} from Firebase
  onlineFlipped: false,
  copied: false,
  errorMsg: "",
  busy: false,
  connecting: false,
  // ---- UI-only additions (do not affect game/Firebase logic) ----
  rulesOpen: false,
  lang: loadSetting("spyLang", "ru"),          // "ru" | "en"
  soundOn: loadSetting("spySoundOn", true),
  musicOn: loadSetting("spyMusicOn", false),
  volume: loadSetting("spyVolume", 0.6),
  musicTrackIndex: loadSetting("spyTrackIndex", 0),
  playerName: loadSetting("spyProfileName", sessionStorage.getItem("spyPlayerName") || ""),
  catSearch: "",
  customCats: loadCustomCategories(),
  customDraft: { name: "", words: "" },       // "create your own category" form
  playerOpen: false,                           // music player expanded on mobile
  roomCustomOpen: false,                        // in-lobby "add category" form open (host)
  splashDone: false,
  toasts: []
};

let toastSeq = 0;
let discussTimerId = null;   // local pass-the-phone discussion timer
let onlineTickId = null;     // 1s local clock for the online countdown display
let roomListenerRef = null;  // currently subscribed Firebase ref, for cleanup

/* ============================== i18n ============================== */

const I18N = {
  ru: {
    tagline: "Найди шпиона. Спаси команду.",
    intro: "Один из вас не знает секретное слово. Остальные описывают его намёками, не называя напрямую — а шпион слушает и пытается вычислить, о чём речь.",
    playOnline: "Играть онлайн", playOnlineSub: "У каждого свой телефон или компьютер — комната по коду",
    passPhone: "Один телефон по кругу", passPhoneSub: "Передаёте устройство каждому игроку вживую",
    howToPlay: "Как играть", rules: "Правила", settings: "Настройки", categories: "Категории",
    myWords: "Мои слова", music: "Музыка", home: "Главная", play: "Играть",
    createRoom: "Создать комнату", joinRoom: "Войти по коду", back: "Назад",
    theme: "Тема", searchCats: "Поиск категорий…", noCatsFound: "Ничего не найдено",
    language: "Язык", sound: "Звуковые эффекты", enable: "Вкл", disable: "Выкл",
    customTitle: "Своя категория", customName: "Название категории",
    customWords: "Слова через запятую", customSave: "Сохранить категорию",
    customHint: "Своя категория сохраняется только на этом устройстве и доступна в режиме «Один телефон».",
    customEmpty: "Пока нет своих категорий.", customDelete: "Удалить",
    volume: "Громкость", nowPlaying: "Сейчас играет", noTracks: "Добавьте свои аудиофайлы",
    by: "by Nickalora", online: "Онлайн"
  },
  en: {
    tagline: "Find the spy. Save the team.",
    intro: "One of you doesn't know the secret word. Everyone else describes it with hints, without naming it — while the spy listens and tries to figure out what it is.",
    playOnline: "Play online", playOnlineSub: "Everyone on their own phone or PC — room by code",
    passPhone: "Pass one phone", passPhoneSub: "Hand the device to each player in turn",
    howToPlay: "How to play", rules: "Rules", settings: "Settings", categories: "Categories",
    myWords: "My words", music: "Music", home: "Home", play: "Play",
    createRoom: "Create room", joinRoom: "Join by code", back: "Back",
    theme: "Topic", searchCats: "Search categories…", noCatsFound: "Nothing found",
    language: "Language", sound: "Sound effects", enable: "On", disable: "Off",
    customTitle: "Custom category", customName: "Category name",
    customWords: "Words, comma-separated", customSave: "Save category",
    customHint: "A custom category is stored only on this device and available in “Pass one phone” mode.",
    customEmpty: "No custom categories yet.", customDelete: "Delete",
    volume: "Volume", nowPlaying: "Now playing", noTracks: "Add your own audio files",
    by: "by Nickalora", online: "Online"
  }
};
function t(key) {
  const lang = state.lang === "en" ? "en" : "ru";
  return (I18N[lang] && I18N[lang][key]) || (I18N.ru[key] || key);
}
// Localised category label (built-ins have labelEn; custom cats use their own name)
function catLabel(catKey) {
  const c = allCategories()[catKey];
  if (!c) return catKey;
  if (state.lang === "en" && c.labelEn) return c.labelEn;
  return c.label;
}
// Built-in + custom categories merged. Custom keys are "custom:<id>".
function allCategories() {
  const merged = Object.assign({}, CATEGORIES);
  for (const id in state.customCats) merged["custom:" + id] = state.customCats[id];
  return merged;
}

/* ============================== music (universal player, bring-your-own audio) ==============================
   No copyrighted audio is bundled. Drop your own files into an "audio" folder
   next to index.html and list them below — the player works immediately.
   Each entry: { title, artist, src, cover }. `src`/`cover` may be empty until
   you add files; the player then runs in silent "demo" mode (controls work,
   nothing plays) so the UI is fully testable now. */
const TRACKS = [
  { title: "Night Drive", artist: "Synthwave Mix", src: "", cover: "" },
  { title: "Cold Case",   artist: "Noir Beats",    src: "", cover: "" },
  { title: "Trust No One", artist: "Spy Theme",    src: "", cover: "" }
];

let audioEl = null;
function getAudio() {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = "none";
    audioEl.volume = state.volume;
    audioEl.addEventListener("ended", () => musicNext());
  }
  return audioEl;
}
function currentTrack() {
  if (!TRACKS.length) return null;
  const i = ((state.musicTrackIndex % TRACKS.length) + TRACKS.length) % TRACKS.length;
  return TRACKS[i];
}
function musicApplyLoad(autoplay) {
  const a = getAudio();
  const tr = currentTrack();
  a.volume = state.volume;
  if (tr && tr.src) {
    if (a.src !== tr.src) a.src = tr.src;
    if (autoplay && state.musicOn) a.play().catch(() => {});
    else if (!state.musicOn) a.pause();
  } else {
    a.removeAttribute("src");
  }
}
function musicToggle() {
  state.musicOn = !state.musicOn;
  saveSetting("spyMusicOn", state.musicOn);
  const a = getAudio();
  const tr = currentTrack();
  if (state.musicOn && tr && tr.src) a.play().catch(() => {});
  else a.pause();
  render();
}
function musicNext() {
  state.musicTrackIndex = (state.musicTrackIndex + 1) % (TRACKS.length || 1);
  saveSetting("spyTrackIndex", state.musicTrackIndex);
  musicApplyLoad(true);
  render();
}
function musicPrev() {
  state.musicTrackIndex = (state.musicTrackIndex - 1 + (TRACKS.length || 1)) % (TRACKS.length || 1);
  saveSetting("spyTrackIndex", state.musicTrackIndex);
  musicApplyLoad(true);
  render();
}
function setVolume(v) {
  state.volume = Math.max(0, Math.min(1, v));
  saveSetting("spyVolume", state.volume);
  getAudio().volume = state.volume;
}

/* ============================== sound effects (WebAudio blips, no files) ============================== */
let sfxCtx = null;
function playSfx(type) {
  if (!state.soundOn) return;
  try {
    sfxCtx = sfxCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = sfxCtx.currentTime;
    const o = sfxCtx.createOscillator();
    const g = sfxCtx.createGain();
    o.connect(g); g.connect(sfxCtx.destination);
    const freqs = { tap: 420, ok: 660, win: 780, lose: 200, open: 520 };
    o.frequency.value = freqs[type] || 440;
    o.type = type === "lose" ? "sawtooth" : "sine";
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    o.start(now); o.stop(now + 0.24);
    if (type === "win") { const o2 = sfxCtx.createOscillator(); const g2 = sfxCtx.createGain(); o2.connect(g2); g2.connect(sfxCtx.destination); o2.frequency.setValueAtTime(660, now); o2.frequency.exponentialRampToValueAtTime(990, now + 0.18); g2.gain.setValueAtTime(0.0001, now); g2.gain.exponentialRampToValueAtTime(0.12, now + 0.03); g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3); o2.start(now); o2.stop(now + 0.32); }
  } catch {}
}

/* ============================== toasts (replace alert/inline errors visually) ============================== */
function toast(message, kind) {
  const id = ++toastSeq;
  state.toasts.push({ id, message, kind: kind || "info" });
  render();
  setTimeout(() => {
    state.toasts = state.toasts.filter((x) => x.id !== id);
    render();
  }, 3200);
}

/* ============================== custom categories & settings (local) ============================== */

function saveCustomCategory() {
  const name = (state.customDraft.name || "").trim();
  const rawWords = (state.customDraft.words || "").split(",").map((w) => w.trim()).filter(Boolean);
  if (!name) { toast(state.lang === "en" ? "Enter a category name" : "Введите название категории", "error"); return; }
  if (rawWords.length < 3) { toast(state.lang === "en" ? "Add at least 3 words" : "Добавьте минимум 3 слова", "error"); return; }
  const id = "c" + Date.now().toString(36);
  state.customCats[id] = { label: name, labelEn: name, emoji: "🗂️", words: rawWords };
  saveSetting("spyCustomCats", state.customCats);
  state.customDraft = { name: "", words: "" };
  playSfx("ok");
  toast(state.lang === "en" ? "Category saved" : "Категория сохранена", "ok");
  render();
}
function deleteCustomCategory(id) {
  delete state.customCats[id];
  saveSetting("spyCustomCats", state.customCats);
  if (state.categoryKey === "custom:" + id) state.categoryKey = null;
  render();
}
function setLang(lang) {
  state.lang = lang === "en" ? "en" : "ru";
  saveSetting("spyLang", state.lang);
  render();
}
function setSound(on) {
  state.soundOn = !!on;
  saveSetting("spySoundOn", state.soundOn);
  if (on) playSfx("tap");
  render();
}

function stopDiscussTimer() {
  if (discussTimerId) { clearInterval(discussTimerId); discussTimerId = null; }
  state.timerRunning = false;
}
function stopOnlineTick() {
  if (onlineTickId) { clearInterval(onlineTickId); onlineTickId = null; }
}
function unsubscribeRoom() {
  if (roomListenerRef) { off(roomListenerRef); roomListenerRef = null; }
}

function goTo(screen) {
  stopDiscussTimer();
  if (screen !== "online-room") stopOnlineTick();
  state.screen = screen;
  render();
}

/* ============================== room subscription ============================== */

function subscribeRoom(code) {
  unsubscribeRoom();
  state.roomCode = code;
  state.connecting = true;
  const rr = roomRef(code);
  roomListenerRef = rr;
  onValue(rr, (snap) => {
    const val = snap.val();
    state.connecting = false;
    if (!val) {
      // room was removed (e.g. everyone left) — bounce back gracefully
      state.room = null;
      state.roomCode = null;
      unsubscribeRoom();
      state.errorMsg = "Комната закрыта: все игроки вышли.";
      state.screen = "online-home";
      render();
      return;
    }
    state.room = val;
    maybeClaimHost();
    if (state.screen !== "online-room") state.screen = "online-room";
    render();
  }, () => {
    state.connecting = false;
    state.errorMsg = "Не получилось подключиться к комнате. Проверьте интернет и настройки Firebase.";
    render();
  });
}

// If the host disconnects and never comes back, the earliest-joined
// remaining player quietly takes over hosting duties so the room never
// gets stuck.
function maybeClaimHost() {
  const room = state.room;
  if (!room || !room.players) return;
  const hostStillHere = room.hostId && room.players[room.hostId];
  if (hostStillHere) return;
  const entries = Object.entries(room.players).sort((a, b) => a[1].joinedAt - b[1].joinedAt);
  if (entries.length && entries[0][0] === MY_ID) {
    update(roomRef(state.roomCode), { hostId: MY_ID });
  }
}

function isHost() {
  return !!(state.room && state.room.hostId === MY_ID);
}
function playersArray() {
  if (!state.room || !state.room.players) return [];
  return Object.entries(state.room.players)
    .map(([id, p]) => ({ id, name: p.name, joinedAt: p.joinedAt }))
    .sort((a, b) => a.joinedAt - b.joinedAt);
}

/* ============================== online actions ============================== */

async function createRoom() {
  const name = state.name.trim();
  if (!name) return;
  state.busy = true; state.errorMsg = "";
  render();

  let code = genCode();
  for (let i = 0; i < 6; i++) {
    const snap = await get(roomRef(code));
    if (!snap.exists()) break;
    code = genCode();
  }

  const initialRoom = {
    status: "lobby",
    categoryKey: null,
    discussSeconds: 300,
    discussEndAt: null,
    round: 0,
    word: null,
    spyId: null,        // kept for backward compatibility; spyIds below is the source of truth going forward
    spyIds: null,
    spyCount: 1,
    voteSeconds: 120,
    voteEndAt: null,
    votes: null,
    placesDifficulty: "all",
    hostId: MY_ID,
    createdAt: Date.now(),
    players: { [MY_ID]: { name, joinedAt: Date.now() } }
  };

  try {
    await set(roomRef(code), initialRoom);
    onDisconnect(playerRef(code, MY_ID)).remove();
    sessionStorage.setItem("spyPlayerName", name);
    state.busy = false;
    subscribeRoom(code);
  } catch (e) {
    state.busy = false;
    state.errorMsg = "Не получилось создать комнату. Проверьте firebase-config.js и правила базы данных.";
    render();
  }
}

async function joinRoom() {
  const name = state.name.trim();
  const code = state.joinCodeInput.trim().toUpperCase();
  if (!name || code.length < 4) return;
  state.busy = true; state.errorMsg = "";
  render();

  try {
    const snap = await get(roomRef(code));
    if (!snap.exists()) {
      state.busy = false;
      state.errorMsg = "Комната не найдена. Проверьте код у хоста.";
      render();
      return;
    }
    await set(playerRef(code, MY_ID), { name, joinedAt: Date.now() });
    onDisconnect(playerRef(code, MY_ID)).remove();
    sessionStorage.setItem("spyPlayerName", name);
    state.busy = false;
    subscribeRoom(code);
  } catch (e) {
    state.busy = false;
    state.errorMsg = "Не получилось войти в комнату. Проверьте интернет-соединение.";
    render();
  }
}

async function hostPatch(patch) {
  if (!isHost() || !state.roomCode) return;
  try { await update(roomRef(state.roomCode), patch); }
  catch (e) { /* transient network hiccup — next state sync will self-correct */ }
}

/* ---- room custom categories (Variant A: live inside the room, host-managed) ----
   Stored at rooms/{code}/customCats/{catId} = { label, words:[...], createdBy }.
   Only the host writes; every player receives them via the existing onValue
   subscription, so they appear in the theme grid for everyone in real time. */
async function addRoomCustomCategory() {
  if (!isHost() || !state.roomCode) return;
  const name = (state.customDraft.name || "").trim();
  const words = (state.customDraft.words || "").split(",").map((w) => w.trim()).filter(Boolean);
  if (!name) { toast(state.lang === "en" ? "Enter a category name" : "Введите название категории", "error"); return; }
  if (words.length < 3) { toast(state.lang === "en" ? "Add at least 3 words" : "Добавьте минимум 3 слова", "error"); return; }
  const catId = "c" + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
  try {
    await set(ref(db, `rooms/${state.roomCode}/customCats/${catId}`), {
      label: name, words, createdBy: MY_ID, createdAt: Date.now()
    });
    state.customDraft = { name: "", words: "" };
    state.roomCustomOpen = false;
    playSfx("ok");
    toast(state.lang === "en" ? "Category added to room" : "Категория добавлена в комнату", "ok");
    render();
  } catch (e) {
    toast(state.lang === "en" ? "Couldn't save category" : "Не удалось сохранить категорию", "error");
  }
}
async function deleteRoomCustomCategory(catId) {
  if (!isHost() || !state.roomCode) return;
  try {
    await remove(ref(db, `rooms/${state.roomCode}/customCats/${catId}`));
    // If the deleted category was selected, clear the selection so no one
    // tries to start a round on a category that no longer exists.
    if (state.room && state.room.categoryKey === "custom:" + catId) {
      await hostPatch({ categoryKey: null });
    }
    render();
  } catch (e) { /* transient — the listener will resync */ }
}

// Categories to show in the online lobby grid: built-ins + this room's custom
// ones, keyed "custom:<id>". Purely a view helper; does not touch state.
function roomCategories(room) {
  const merged = Object.assign({}, CATEGORIES);
  if (room && room.customCats) {
    for (const id in room.customCats) {
      const cc = room.customCats[id];
      merged["custom:" + id] = {
        label: cc.label, labelEn: cc.label, emoji: "🗂️",
        words: Array.isArray(cc.words) ? cc.words : [],
        isRoomCustom: true, catId: id
      };
    }
  }
  return merged;
}

// Resolve the word pool for the room's chosen category. Built-in categories
// come from the shared CATEGORIES table; room-custom categories (keys
// "custom:<id>") come from the live room.customCats node so every player
// deals from exactly the same list. Falls back safely to an empty array.
function wordsForRoom(room) {
  const key = room.categoryKey;
  if (key && key.indexOf("custom:") === 0) {
    const id = key.slice("custom:".length);
    const cc = room.customCats && room.customCats[id];
    return (cc && Array.isArray(cc.words)) ? cc.words : [];
  }
  return wordsForCategory(key, room.placesDifficulty);
}

async function startRound() {
  const room = state.room;
  const players = playersArray();
  if (!isHost() || !room || !room.categoryKey || players.length < MIN_PLAYERS) return;
  const list = wordsForRoom(room);
  if (!list || !list.length) { toast(state.lang === "en" ? "This category has no words" : "В этой категории нет слов", "error"); return; }
  const word = pickRandom(list);
  const spyCount = (room.spyCount === 2 && players.length >= MIN_PLAYERS_FOR_TWO_SPIES) ? 2 : 1;
  const shuffled = players.map((p) => p.id).sort(() => Math.random() - 0.5);
  const spyIds = shuffled.slice(0, spyCount);
  const discussEndAt = Date.now() + (room.discussSeconds || 300) * 1000;
  await hostPatch({
    status: "active",
    word, spyIds, spyId: spyIds[0],
    discussEndAt, round: (room.round || 0) + 1,
    voteEndAt: null, votes: null
  });
}

// Discussion time is up (or the host cut it short) — move everyone into the
// voting stage instead of straight to results.
async function startVoting() {
  const room = state.room;
  if (!isHost() || !room) return;
  const voteEndAt = Date.now() + (room.voteSeconds || 120) * 1000;
  await hostPatch({ status: "voting", voteEndAt, votes: {} });
}

// Any player casts (or changes, while voting is still open) their own vote.
// Each player only ever writes their own key, same safe pattern as the
// player list, so there is no write race between voters.
async function castVote(suspectId) {
  const room = state.room;
  if (!room || room.status !== "voting" || !state.roomCode) return;
  if (room.votes && room.votes[MY_ID]) return; // one vote per player, as requested
  try { await update(ref(db, `rooms/${state.roomCode}/votes`), { [MY_ID]: suspectId }); }
  catch (e) { /* transient — the room listener will resync */ }
}

// Tally votes, reveal who was accused, and whether the group actually
// caught a spy — purely a read of state.room.votes, no extra Firebase call.
function tallyVotes(room, players) {
  const votes = room.votes || {};
  const counts = {};
  players.forEach((p) => { counts[p.id] = 0; });
  Object.values(votes).forEach((suspectId) => {
    if (counts[suspectId] != null) counts[suspectId] += 1;
  });
  let topId = null, topCount = -1, tie = false;
  players.forEach((p) => {
    const c = counts[p.id];
    if (c > topCount) { topCount = c; topId = p.id; tie = false; }
    else if (c === topCount && c > 0) { tie = true; }
  });
  const accusedId = (topCount > 0 && !tie) ? topId : null;
  const spyIds = room.spyIds || (room.spyId ? [room.spyId] : []);
  const caughtSpy = accusedId != null && spyIds.includes(accusedId);
  return { votes, counts, accusedId, tie, spyIds, caughtSpy };
}

async function finishVoting() {
  if (!isHost()) return;
  await hostPatch({ status: "result" });
}

async function backToLobby() {
  await hostPatch({ status: "lobby", word: null, spyId: null, spyIds: null, discussEndAt: null, voteEndAt: null, votes: null });
}

async function leaveRoom() {
  const code = state.roomCode;
  unsubscribeRoom();
  stopOnlineTick();
  if (code) {
    try {
      await remove(playerRef(code, MY_ID));
      const snap = await get(ref(db, `rooms/${code}/players`));
      if (!snap.exists()) await remove(roomRef(code)); // last one out closes the room
    } catch (e) { /* fine — onDisconnect will clean this up anyway */ }
  }
  state.roomCode = null;
  state.room = null;
  state.errorMsg = "";
  state.onlineFlipped = false;
  goTo("online-home");
}

function copyCode() {
  if (!state.roomCode) return;
  navigator.clipboard?.writeText(state.roomCode).then(() => {
    state.copied = true;
    render();
    setTimeout(() => { state.copied = false; render(); }, 1500);
  }).catch(() => {});
}

/* ============================== local (pass-the-phone) actions ============================== */

function pickRound(catKey) {
  const list = wordsForCategory(catKey, state.placesDifficulty || "all");
  if (!list || !list.length) { toast(t("noTracks"), "error"); return; }
  state.categoryKey = catKey;
  state.word = pickRandom(list);
  state.spyIndex = Math.floor(Math.random() * state.playerCount);
  state.currentPlayer = 0;
  state.flipped = false;
  goTo("reveal");
}

function nextPlayer() {
  if (state.currentPlayer + 1 < state.playerCount) {
    state.currentPlayer += 1;
    state.flipped = false;
    render();
  } else {
    state.timeLeft = state.discussSeconds;
    stopDiscussTimer();
    goTo("discuss");
  }
}

function toggleDiscussTimer() {
  if (state.timeLeft === 0) return;
  if (state.timerRunning) {
    stopDiscussTimer();
  } else {
    state.timerRunning = true;
    discussTimerId = setInterval(() => {
      state.timeLeft -= 1;
      const t = document.getElementById("timerText");
      if (t) t.textContent = fmtTime(state.timeLeft);
      if (state.timeLeft <= 0) {
        stopDiscussTimer();
        const btn = document.getElementById("timerToggle");
        if (btn) btn.setAttribute("disabled", "disabled");
      }
    }, 1000);
  }
  const toggleBtn = document.getElementById("timerToggle");
  if (toggleBtn) {
    toggleBtn.innerHTML = (state.timerRunning ? ICON.pause : ICON.play) +
      `<span id="timerToggleLabel">${state.timerRunning ? "Пауза" : "Старт"}</span>`;
  }
}
function resetDiscussTimer() {
  stopDiscussTimer();
  state.timeLeft = state.discussSeconds;
  render();
}

/* ============================== render ============================== */

const app = document.getElementById("app");

function render() {
  // Cinematic splash on first load only (UI-only; doesn't gate any game logic).
  if (!state.splashDone) {
    app.innerHTML = renderSplash();
    return;
  }
  let html = '<div class="cinematic-bg" aria-hidden="true"></div>';
  html += '<div class="glow glow-a" aria-hidden="true"></div><div class="glow glow-b" aria-hidden="true"></div>';
  html += renderHeader();
  let body = "";
  switch (state.screen) {
    case "menu": body = renderMenu(); break;
    case "home": body = renderHome(); break;
    case "setup": body = renderSetup(); break;
    case "reveal": body = renderReveal(); break;
    case "discuss": body = renderDiscuss(); break;
    case "result": body = renderResult(); break;
    case "online-home": body = renderOnlineHome(); break;
    case "online-create": body = renderOnlineCreate(); break;
    case "online-join": body = renderOnlineJoin(); break;
    case "online-room": body = renderOnlineRoom(); break;
    case "custom": body = renderCustomScreen(); break;
    case "settings": body = renderSettingsScreen(); break;
    default: body = renderMenu();
  }
  // Key the screen wrapper so CSS transition re-triggers on every navigation.
  html += `<div class="screen-anim" data-scr="${state.screen}">${body}</div>`;
  html += renderStatsBar();
  html += renderPlayer();
  html += renderToasts();
  if (state.rulesOpen) html += renderRulesModal();
  app.innerHTML = html;
  wireEvents();
  ensureOnlineTick();
  if (typeof resultSfxWatcher === "function") resultSfxWatcher();
}

function renderSplash() {
  // auto-dismiss handled in boot section
  return `
    <div class="splash" id="splash">
      <div class="cinematic-bg" aria-hidden="true"></div>
      <div class="splash-inner">
        <div class="splash-logo">ШПИОН</div>
        <div class="splash-by">by Nickalora</div>
        <div class="splash-bar"><span></span></div>
      </div>
    </div>`;
}

function renderToasts() {
  if (!state.toasts.length) return "";
  return `<div class="toast-wrap">` + state.toasts.map((tt) =>
    `<div class="toast toast-${tt.kind}">${esc(tt.message)}</div>`
  ).join("") + `</div>`;
}

/* ---------- music player (universal shell; add your own audio in TRACKS) ---------- */

function renderPlayer() {
  const tr = currentTrack();
  const collapsed = !state.playerOpen;
  const title = tr ? tr.title : "—";
  const artist = tr ? tr.artist : t("noTracks");
  const cover = tr && tr.cover
    ? `<img src="${esc(tr.cover)}" alt="" class="pl-cover-img" />`
    : `<span class="pl-cover-fallback">${ICON.note}</span>`;
  return `
    <div class="player ${collapsed ? "player-collapsed" : "player-open"}">
      <button class="player-fab" id="playerFab" aria-label="${t("music")}">${ICON.note}</button>
      <div class="player-bar">
        <div class="pl-left">
          <span class="pl-cover">${cover}</span>
          <span class="pl-meta">
            <span class="pl-title">${esc(title)}</span>
            <span class="pl-artist">${esc(artist)}</span>
          </span>
        </div>
        <div class="pl-controls">
          <button class="pl-btn" id="plPrev" aria-label="prev">${ICON.prev}</button>
          <button class="pl-btn pl-play" id="plPlay" aria-label="play/pause">${state.musicOn ? ICON.pause2 : ICON.play2}</button>
          <button class="pl-btn" id="plNext" aria-label="next">${ICON.next}</button>
        </div>
        <div class="pl-right">
          ${ICON.sound}
          <input class="pl-volume" id="plVolume" type="range" min="0" max="1" step="0.01" value="${state.volume}" aria-label="${t("volume")}" />
        </div>
        <button class="pl-collapse" id="plCollapse" aria-label="close">${ICON.back.replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" style="transform:rotate(-90deg)"')}</button>
      </div>
    </div>`;
}

/* ---------- custom category creator (local device only) ---------- */

function renderCustomScreen() {
  const ids = Object.keys(state.customCats);
  const list = ids.length ? ids.map((id) => {
    const c = state.customCats[id];
    return `
      <div class="custom-row">
        <span class="custom-row-emoji">${c.emoji || "🗂️"}</span>
        <span class="custom-row-name">${esc(c.label)}<span class="custom-row-count">${(c.words||[]).length} ${state.lang === "en" ? "words" : "слов"}</span></span>
        <button class="custom-del" data-del-custom="${esc(id)}" aria-label="${t("customDelete")}">${ICON.trash}</button>
      </div>`;
  }).join("") : `<p class="hint">${t("customEmpty")}</p>`;
  return `
    <div class="screen">
      ${topBar("setup", t("customTitle"))}
      <div class="section-label">${t("customName")}</div>
      <input class="text-input" id="customNameInput" maxlength="28" placeholder="${state.lang === "en" ? "e.g. Marvel heroes" : "напр. Герои Marvel"}" value="${esc(state.customDraft.name)}" />
      <div class="section-label" style="margin-top:18px">${t("customWords")}</div>
      <textarea class="text-input" id="customWordsInput" rows="4" style="resize:vertical;max-width:320px" placeholder="${state.lang === "en" ? "Iron Man, Thor, Hulk, ..." : "Железный человек, Тор, Халк, ..."}">${esc(state.customDraft.words)}</textarea>
      <p class="hint" style="margin-top:10px">${t("customHint")}</p>
      <button class="btn-primary" style="margin-top:8px" id="saveCustomBtn">${t("customSave")}</button>
      <div class="section-label" style="margin-top:30px">${t("myWords")}</div>
      <div class="custom-list">${list}</div>
    </div>`;
}

/* ---------- settings ---------- */

function renderSettingsScreen() {
  return `
    <div class="screen">
      ${topBar("menu", t("settings"))}
      <div class="settings-card">
        <div class="settings-row">
          <span>${t("language")}</span>
          <div class="chip-row">
            <button class="chip${state.lang === "ru" ? " chip-active" : ""}" data-set-lang="ru">RU</button>
            <button class="chip${state.lang === "en" ? " chip-active" : ""}" data-set-lang="en">EN</button>
          </div>
        </div>
        <div class="settings-row">
          <span>${t("sound")}</span>
          <div class="chip-row">
            <button class="chip${state.soundOn ? " chip-active" : ""}" data-set-sound="1">${t("enable")}</button>
            <button class="chip${!state.soundOn ? " chip-active" : ""}" data-set-sound="0">${t("disable")}</button>
          </div>
        </div>
        <div class="settings-row">
          <span>${t("music")}</span>
          <div class="chip-row">
            <button class="chip${state.musicOn ? " chip-active" : ""}" data-set-music="1">${t("enable")}</button>
            <button class="chip${!state.musicOn ? " chip-active" : ""}" data-set-music="0">${t("disable")}</button>
          </div>
        </div>
        <div class="settings-row">
          <span>${t("volume")}</span>
          <input class="pl-volume" id="settingsVolume" type="range" min="0" max="1" step="0.01" value="${state.volume}" style="max-width:160px" />
        </div>
      </div>
    </div>`;
}

/* ---------- persistent chrome: header / discord / rules trigger / stats / modal ----------
   Purely presentational additions layered on top of the existing screens.
   They don't read or write any game/Firebase state except the new,
   UI-only `state.rulesOpen` flag above. */

function renderHeader() {
  return `
    <header class="app-header">
      <div class="app-header-inner">
        <div class="brand-mark" data-nav="menu" role="button" tabindex="0">
          <span class="brand-mark-icon">${ICON.lock.replace('width="30" height="30"', 'width="16" height="16"')}</span>
          <span class="brand-mark-text">ШПИОН</span>
        </div>
        <div class="header-actions">
          <button class="hdr-icon-btn" id="langToggleBtn" type="button" aria-label="${t("language")}" title="${t("language")}">
            ${ICON.globe.replace('width="26" height="26"','width="16" height="16"')}<span class="hdr-lang">${state.lang.toUpperCase()}</span>
          </button>
          <button class="hdr-icon-btn" id="soundToggleBtn" type="button" aria-label="${t("sound")}" title="${t("sound")}">
            ${state.soundOn ? ICON.sound : ICON.soundOff}
          </button>
          <button class="hdr-icon-btn" id="settingsBtn" type="button" aria-label="${t("settings")}" title="${t("settings")}">${ICON.gear}</button>
          <button class="rules-trigger" id="rulesTriggerBtn" type="button">${ICON.eye}<span class="hide-sm">${t("howToPlay")}</span></button>
          <span class="discord-wrap">
            <button class="discord-badge" id="discordBadgeBtn" type="button" aria-label="Discord" tabindex="0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 5.3A17.6 17.6 0 0 0 15.9 4l-.3.6a13 13 0 0 1 3.7 1.4 15.9 15.9 0 0 0-13.6 0A13 13 0 0 1 9.4 4.6L9.1 4a17.6 17.6 0 0 0-4.4 1.3C1.7 9.6 1 13.8 1.3 18a17.8 17.8 0 0 0 5.2 2.6l.8-1.3a11.6 11.6 0 0 1-1.8-.9c.2-.1.3-.2.5-.3a12.8 12.8 0 0 0 11 0l.5.3a11.6 11.6 0 0 1-1.9.9l.8 1.3a17.7 17.7 0 0 0 5.2-2.6c.4-4.9-.8-9-3-12.7ZM8.7 15.6c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2c0 1.1-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.9.9 1.8 2c0 1.1-.8 2-1.8 2Z"/></svg>
            </button>
            <span class="discord-tooltip" role="tooltip">Discord: ds; nickalora</span>
          </span>
        </div>
      </div>
    </header>`;
}

function renderStatsBar() {
  const catCount = Object.keys(CATEGORIES).length;
  const inRoom = state.screen === "online-room" && state.room;
  const playersNow = inRoom ? playersArray().length : null;
  return `
    <div class="stats-bar" aria-hidden="true">
      <div class="stats-bar-inner">
        <div class="stat-item"><span class="stat-value">${catCount}</span><span class="stat-label">тем</span></div>
        <span class="stat-sep"></span>
        <div class="stat-item"><span class="stat-value">${MIN_PLAYERS}–${MAX_PLAYERS}</span><span class="stat-label">игроков</span></div>
        <span class="stat-sep"></span>
        <div class="stat-item"><span class="stat-value">${playersNow != null ? playersNow : "—"}</span><span class="stat-label">в комнате</span></div>
        <span class="stat-sep"></span>
        <div class="stat-item"><span class="stat-value">0₽</span><span class="stat-label">бесплатно</span></div>
      </div>
    </div>`;
}

function renderRulesModal() {
  return `
    <div class="modal-overlay" id="rulesOverlay">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Правила игры">
        <button class="modal-close" id="rulesCloseBtn" type="button" aria-label="Закрыть">${ICON.back.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" style="transform:rotate(45deg)"')}</button>
        <div class="modal-title">Правила игры «Шпион»</div>
        <ol class="modal-steps">
          <li class="modal-step"><span class="modal-step-num">1</span><span class="modal-step-text">Все игроки, кроме одного, получают <b>одно и то же секретное слово</b> из выбранной темы. Один игрок — <b>шпион</b> — не знает слово и видит только тему.</span></li>
          <li class="modal-step"><span class="modal-step-num">2</span><span class="modal-step-text">По очереди каждый вслух даёт <b>намёк на слово</b>, не называя его напрямую. Шпион тоже говорит — старается не спалиться и понять, о чём речь.</span></li>
          <li class="modal-step"><span class="modal-step-num">3</span><span class="modal-step-text">Слушайте внимательно: слишком общий или слишком точный намёк может выдать шпиона — или, наоборот, обычного игрока.</span></li>
          <li class="modal-step"><span class="modal-step-num">4</span><span class="modal-step-text">Когда время обсуждения выходит, все вместе решают, <b>кто шпион</b>, и сверяются с ответом на экране результатов.</span></li>
          <li class="modal-step"><span class="modal-step-num">5</span><span class="modal-step-text">Шпион побеждает, если его не вычислили (или он успел угадать секретное слово по намёкам остальных).</span></li>
        </ol>
      </div>
    </div>`;
}

function topBar(backScreen, label, onBackId) {
  return `
    <div class="topbar">
      <button class="icon-btn" ${onBackId ? `id="${onBackId}"` : `data-nav="${backScreen}"`} aria-label="Назад">${ICON.back}</button>
      <span class="topbar-label">${esc(label)}</span>
      <span style="width:36px"></span>
    </div>`;
}

function categoryGrid(activeKey, disabled, opts) {
  opts = opts || {};
  const cats = opts.cats ? opts.cats : (opts.builtinOnly ? Object.assign({}, CATEGORIES) : allCategories());
  const q = (opts.search || "").trim().toLowerCase();
  const keys = Object.keys(cats).filter((key) => {
    if (!q) return true;
    const c = cats[key];
    return (c.label || "").toLowerCase().includes(q) || (c.labelEn || "").toLowerCase().includes(q);
  });
  let out = "";
  if (opts.showSearch) {
    out += `
      <div class="cat-search">
        ${ICON.search}
        <input class="cat-search-input" id="catSearchInput" type="text" placeholder="${t("searchCats")}" value="${esc(state.catSearch)}" />
      </div>`;
  }
  out += `<div class="grid-cats" id="catGrid" data-disabled="${!!disabled}">`;
  for (const key of keys) {
    const c = cats[key];
    const active = key === activeKey;
    const isCustom = key.indexOf("custom:") === 0;
    out += `
      <button class="cat-slot" data-cat="${esc(key)}" aria-pressed="${active}" ${disabled ? "disabled" : ""}>
        <span class="cat-card${active ? " cat-card-active" : ""}">
          <span class="cat-card-top">
            <span class="cat-emoji">${c.emoji || "🗂️"}</span>
            ${c.hard ? '<span class="cat-hard-tag">hard</span>' : ""}
            ${isCustom ? '<span class="cat-hard-tag" style="color:#67e8f9;border-color:rgba(103,232,249,.4);background:rgba(103,232,249,.12)">custom</span>' : ""}
          </span>
          <span class="cat-name">${esc(state.lang === "en" && c.labelEn ? c.labelEn : c.label)}</span>
          <span class="cat-count">${(c.words ? c.words.length : 0)} ${state.lang === "en" ? "words" : "слов"}</span>
        </span>
      </button>`;
  }
  out += "</div>";
  if (!keys.length) out += `<p class="hint" style="margin-top:14px">${t("noCatsFound")}</p>`;
  return out;
}

function flipCard(isSpy, category, word, flipped, stageId) {
  return `
    <button type="button" class="stage" id="${stageId}" aria-label="${flipped ? "Карточка открыта" : "Открыть карточку"}">
      <div class="holo-frame${isSpy ? " holo-frame-danger" : ""}">
        <div class="holo-inner">
          <div class="flip-wrap">
            <div class="flip-inner${flipped ? " flip-inner-flipped" : ""}" id="flipInner">
              <div class="face face-front">${ICON.lock}<div class="face-front-text">Нажми, чтобы посмотреть</div></div>
              <div class="face face-back">
                ${isSpy
                  ? `<div class="spy-word">ТЫ ШПИОН</div><div class="spy-sub">Тема: ${esc(category)}</div>`
                  : `<div class="cat-tag">${esc(category)}</div><div class="the-word">${esc(word)}</div>`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>`;
}

/* ---------- menu ---------- */

function renderMenu() {
  return `
    <div class="screen center">
      <div class="badge">${ICON.sparkles}<span>${t("tagline")}</span></div>
      <h1 class="title">ШПИОН</h1>
      <p class="subtitle">${t("intro")}</p>
      <div class="menu-grid">
        <button class="menu-card menu-card-hero" data-nav="online-home">
          <span class="hero-glow" aria-hidden="true"></span>
          ${ICON.globe}
          <div class="menu-card-title">${t("playOnline")}</div>
          <div class="menu-card-sub">${t("playOnlineSub")}</div>
          <span class="hero-cta">${t("play")} →</span>
        </button>
        <button class="menu-card" data-nav="home">${ICON.phone}
          <div class="menu-card-title">${t("passPhone")}</div>
          <div class="menu-card-sub">${t("passPhoneSub")}</div>
        </button>
      </div>
    </div>`;
}

/* ---------- local (pass-the-phone) ---------- */

function renderHome() {
  return `
    <div class="screen center">
      ${topBar("menu", "Один телефон")}
      <div class="badge">${ICON.sparkles}<span>передавайте один телефон</span></div>
      <h1 class="title" style="font-size:42px">ШПИОН</h1>
      <button class="btn-primary" data-nav="setup">Начать игру</button>
      <div class="rules">
        <div class="rules-title">Как играть</div>
        <ol>
          <li>Выберите тему и число игроков.</li>
          <li>Каждый по очереди смотрит свою карточку — все, кроме шпиона, видят слово.</li>
          <li>Вслух, по очереди, каждый даёт намёк на слово, не называя его.</li>
          <li>Когда время выйдет — обсудите и решите, кто шпион.</li>
        </ol>
      </div>
    </div>`;
}

function renderSetup() {
  const timeChips = [180, 300, 480].map((s) =>
    `<button class="chip${state.discussSeconds === s ? " chip-active" : ""}" data-time="${s}">${Math.round(s / 60)} мин</button>`
  ).join("");
  return `
    <div class="screen">
      ${topBar("home", "Настройка")}
      <div class="section-label" style="display:flex;justify-content:space-between;align-items:center">
        <span>${t("theme")}</span>
        <button class="link-btn" id="openCustomBtn" type="button">${ICON.plus}${t("customTitle")}</button>
      </div>
      ${categoryGrid(state.categoryKey, false, { showSearch: true, search: state.catSearch })}
      <div class="section-label" style="margin-top:28px">Игроки</div>
      <div class="stepper">
        <button type="button" class="stepper-btn" id="playerMinus" ${state.playerCount <= MIN_PLAYERS ? "disabled" : ""}>−</button>
        <div class="stepper-value">${ICON.users}<span>${state.playerCount}</span></div>
        <button type="button" class="stepper-btn" id="playerPlus" ${state.playerCount >= MAX_PLAYERS ? "disabled" : ""}>+</button>
      </div>
      <div class="section-label" style="margin-top:28px">Время на обсуждение</div>
      <div class="chip-row" id="timeChips">${timeChips}</div>
      <button class="btn-primary" style="margin-top:36px" id="startBtn" ${!state.categoryKey ? "disabled" : ""}>
        ${state.categoryKey ? "Раздать роли" : "Выберите тему"}
      </button>
    </div>`;
}

function renderReveal() {
  let dots = "";
  for (let i = 0; i < state.playerCount; i++) {
    dots += `<span class="dot${i < state.currentPlayer ? " dot-done" : ""}${i === state.currentPlayer ? " dot-active" : ""}"></span>`;
  }
  const isSpy = state.currentPlayer === state.spyIndex;
  return `
    <div class="screen center">
      <div class="dots">${dots}</div>
      <div class="player-label">Игрок ${state.currentPlayer + 1} <span class="muted">из ${state.playerCount}</span></div>
      <p class="hint">Передайте телефон игроку ${state.currentPlayer + 1}. Остальные не смотрят на экран.</p>
      ${flipCard(isSpy, catLabel(state.categoryKey), state.word, state.flipped, "stageBtn")}
      <button class="btn-primary" style="margin-top:32px" id="nextBtn" ${!state.flipped ? "disabled" : ""}>
        ${state.flipped ? "Скрыть и передать дальше" : "Сначала посмотри карточку"}
      </button>
    </div>`;
}

function renderDiscuss() {
  return `
    <div class="screen center">
      <div class="badge">${ICON.eye}<span>обсуждение вслух</span></div>
      <div class="discuss-cat">${esc(catLabel(state.categoryKey))}</div>
      <p class="hint">По очереди дайте намёк на слово, не называя его. Шпион слушает и пытается вычислить ответ или остаться незамеченным.</p>
      <div class="timer">${ICON.clock}<span id="timerText">${fmtTime(state.timeLeft)}</span></div>
      <div class="timer-controls">
        <button class="btn-ghost" id="timerToggle" ${state.timeLeft === 0 ? "disabled" : ""}>
          ${state.timerRunning ? ICON.pause : ICON.play}<span id="timerToggleLabel">${state.timerRunning ? "Пауза" : "Старт"}</span>
        </button>
        <button class="btn-ghost" id="timerReset">${ICON.rotate}Сброс</button>
      </div>
      <button class="btn-primary" style="margin-top:28px" id="toResultBtn">Перейти к голосованию</button>
    </div>`;
}

function renderResult() {
  return `
    <div class="screen center">
      <div class="badge badge-danger">${ICON.sparkles}<span>раунд завершён</span></div>
      <h2 class="result-title">Шпион — <span class="accent-red">Игрок ${state.spyIndex + 1}</span></h2>
      <div class="result-word-box">
        <div class="cat-tag">${esc(catLabel(state.categoryKey))}</div>
        <div class="the-word">${esc(state.word)}</div>
      </div>
      <p class="hint">Угадали все вместе, кто шпион? Сверьтесь и начните новый раунд.</p>
      <div class="result-actions">
        <button class="btn-primary" id="newRoundBtn">Новый раунд</button>
        <button class="btn-ghost" data-nav="setup">Сменить тему / игроков</button>
      </div>
    </div>`;
}

/* ---------- online: pre-room screens ---------- */

function renderOnlineHome() {
  return `
    <div class="screen center">
      ${topBar("menu", "Играть онлайн")}
      <div class="badge">${ICON.globe}<span>у каждого своё устройство</span></div>
      <h2 class="result-title">Комната по коду</h2>
      <p class="hint">Один создаёт комнату и получает код, остальные вводят его на своих телефонах или компьютерах.</p>
      ${state.errorMsg ? `<div class="error-text">${esc(state.errorMsg)}</div>` : ""}
      <div class="menu-grid">
        <button class="menu-card" data-nav="online-create">${ICON.crown}
          <div class="menu-card-title">Создать комнату</div>
          <div class="menu-card-sub">Вы будете хостом</div>
        </button>
        <button class="menu-card menu-card-accent" data-nav="online-join">${ICON.users}
          <div class="menu-card-title">Войти по коду</div>
          <div class="menu-card-sub">У друга уже есть комната</div>
        </button>
      </div>
    </div>`;
}

function renderOnlineCreate() {
  return `
    <div class="screen center">
      ${topBar("online-home", "Создание комнаты")}
      <div class="section-label">Ваше имя</div>
      <input class="text-input" id="nameInput" placeholder="Например, Аня" maxlength="18" value="${esc(state.name)}" />
      ${state.errorMsg ? `<div class="error-text">${esc(state.errorMsg)}</div>` : ""}
      <button class="btn-primary" style="margin-top:20px" id="createBtn" ${(!state.name.trim() || state.busy) ? "disabled" : ""}>
        ${state.busy ? "Создаём…" : "Создать комнату"}
      </button>
    </div>`;
}

function renderOnlineJoin() {
  return `
    <div class="screen center">
      ${topBar("online-home", "Вход в комнату")}
      <div class="section-label">Код комнаты</div>
      <input class="text-input text-input-code" id="codeInput" placeholder="XXXXX" maxlength="6" value="${esc(state.joinCodeInput)}" />
      <div class="section-label" style="margin-top:18px">Ваше имя</div>
      <input class="text-input" id="nameInput" placeholder="Например, Игорь" maxlength="18" value="${esc(state.name)}" />
      ${state.errorMsg ? `<div class="error-text">${esc(state.errorMsg)}</div>` : ""}
      <button class="btn-primary" style="margin-top:20px" id="joinBtn" ${(!state.name.trim() || state.joinCodeInput.trim().length < 4 || state.busy) ? "disabled" : ""}>
        ${state.busy ? "Входим…" : "Войти в комнату"}
      </button>
    </div>`;
}

/* ---------- online: in-room (status driven by Firebase) ---------- */

function renderOnlineRoom() {
  if (state.connecting || !state.room) {
    return `<div class="screen center"><div class="waiting-box">${ICON.refresh.replace('width="16" height="16"', 'class="spin-icon" width="16" height="16"')}<span>Подключаемся к комнате…</span></div></div>`;
  }
  const room = state.room;
  if (room.status === "active") return renderOnlineActive(room);
  if (room.status === "voting") return renderOnlineVoting(room);
  if (room.status === "result") return renderOnlineResult(room);
  return renderOnlineLobby(room);
}

function playerChips(room) {
  const players = playersArray();
  let out = '<div class="player-list">';
  players.forEach((p) => {
    const you = p.id === MY_ID;
    out += `<span class="player-chip${you ? " player-chip-you" : ""}">${p.id === room.hostId ? ICON.crown : ""}${esc(p.name)}${you ? " (вы)" : ""}</span>`;
  });
  if (players.length < MIN_PLAYERS) {
    out += `<span class="player-chip player-chip-muted">нужно ещё ${MIN_PLAYERS - players.length}</span>`;
  }
  out += "</div>";
  return out;
}

function renderOnlineLobby(room) {
  const players = playersArray();
  const host = isHost();
  const canStart = host && room.categoryKey && players.length >= MIN_PLAYERS;
  const timeChips = [180, 300, 480].map((s) =>
    `<button class="chip${room.discussSeconds === s ? " chip-active" : ""}" data-online-time="${s}" ${host ? "" : "disabled"}>${Math.round(s / 60)} мин</button>`
  ).join("");
  const voteChips = VOTE_SECONDS_OPTIONS.map((s) =>
    `<button class="chip${(room.voteSeconds || 120) === s ? " chip-active" : ""}" data-vote-time="${s}" ${host ? "" : "disabled"}>${Math.round(s / 60)} мин</button>`
  ).join("");
  const twoSpiesAllowed = players.length >= MIN_PLAYERS_FOR_TWO_SPIES;
  const spyCount = (room.spyCount === 2 && twoSpiesAllowed) ? 2 : 1;
  const spyChips = [1, 2].map((n) =>
    `<button class="chip${spyCount === n ? " chip-active" : ""}" data-spy-count="${n}" ${(host && (n === 1 || twoSpiesAllowed)) ? "" : "disabled"}>${n} ${n === 1 ? "шпион" : "шпиона"}</button>`
  ).join("");
  const placesUI = (host && room.categoryKey === "places") ? `
    <div class="section-label" style="margin-top:24px">Сложность мест</div>
    <div class="chip-row" id="placesDifficultyChips">
      <button class="chip${(room.placesDifficulty || "all") === "easy" ? " chip-active" : ""}" data-places-diff="easy">Лёгкие</button>
      <button class="chip${(room.placesDifficulty || "all") === "hard" ? " chip-active" : ""}" data-places-diff="hard">Сложные</button>
      <button class="chip${(room.placesDifficulty || "all") === "all" ? " chip-active" : ""}" data-places-diff="all">Все</button>
    </div>` : "";

  return `
    <div class="screen center">
      ${topBar(null, "Комната", "leaveBtn")}
      <div class="code-display">
        ${state.roomCode.split("").map((ch) => `<span class="code-letter">${ch}</span>`).join("")}
        <button class="copy-btn" id="copyBtn" aria-label="Скопировать код">${state.copied ? ICON.check : ICON.copy}</button>
      </div>
      <p class="hint">Отправьте этот код друзьям — пусть введут его на своих устройствах.</p>
      ${playerChips(room)}
      ${host ? `
        <div class="section-label" style="margin-top:24px;display:flex;justify-content:space-between;align-items:center">
          <span>${t("theme")}</span>
          <button class="link-btn" id="roomCustomToggle" type="button">${ICON.plus}${t("customTitle")}</button>
        </div>
        ${state.roomCustomOpen ? renderRoomCustomForm(room) : ""}
        ${categoryGrid(room.categoryKey, false, { showSearch: true, search: state.catSearch, cats: roomCategories(room) })}
        ${roomCustomManageList(room)}
        ${placesUI}
        <div class="section-label" style="margin-top:24px">Время на обсуждение</div>
        <div class="chip-row" id="onlineTimeChips">${timeChips}</div>
        <div class="section-label" style="margin-top:24px">Время на голосование</div>
        <div class="chip-row" id="voteTimeChips">${voteChips}</div>
        <div class="section-label" style="margin-top:24px">Количество шпионов</div>
        <div class="chip-row" id="spyCountChips">${spyChips}</div>
        ${!twoSpiesAllowed ? `<p class="hint" style="margin:8px 0 0;max-width:340px">2 шпиона станут доступны от ${MIN_PLAYERS_FOR_TWO_SPIES} игроков.</p>` : ""}
        <button class="btn-primary" style="margin-top:30px" id="startRoundBtn" ${!canStart ? "disabled" : ""}>
          ${!room.categoryKey ? "Выберите тему" : players.length < MIN_PLAYERS ? `Нужно ещё ${MIN_PLAYERS - players.length} игрок(а)` : "Раздать роли"}
        </button>` : `
        <div class="waiting-box">${ICON.refresh}<span>${room.categoryKey ? `Хост выбрал тему «${esc(roomCatLabel(room, room.categoryKey))}». Ждём начала раунда…` : "Хост выбирает тему…"}</span></div>`}
    </div>`;
}

// Label resolver that also knows this room's custom categories (for the
// non-host waiting view and any online label display).
function roomCatLabel(room, key) {
  if (key && key.indexOf("custom:") === 0) {
    const id = key.slice("custom:".length);
    const cc = room.customCats && room.customCats[id];
    return cc ? cc.label : (state.lang === "en" ? "Custom" : "Своя категория");
  }
  return catLabel(key);
}

function renderRoomCustomForm(room) {
  return `
    <div class="room-custom-form">
      <input class="text-input" id="roomCustomName" maxlength="28" placeholder="${t("customName")}" value="${esc(state.customDraft.name)}" style="max-width:none" />
      <textarea class="text-input" id="roomCustomWords" rows="3" placeholder="${t("customWords")}" style="max-width:none;resize:vertical;margin-top:8px">${esc(state.customDraft.words)}</textarea>
      <p class="hint" style="margin:8px 0 0;max-width:none">${state.lang === "en" ? "Everyone in the room will see and can play this category." : "Категорию увидят все в комнате, и по ней можно будет играть."}</p>
      <button class="btn-primary" id="roomCustomSave" style="margin-top:10px">${t("customSave")}</button>
    </div>`;
}

// Host-only list of this room's custom categories with delete buttons.
function roomCustomManageList(room) {
  if (!room.customCats) return "";
  const ids = Object.keys(room.customCats);
  if (!ids.length) return "";
  const rows = ids.map((id) => {
    const c = room.customCats[id];
    return `
      <div class="custom-row" style="margin-top:8px">
        <span class="custom-row-emoji">🗂️</span>
        <span class="custom-row-name">${esc(c.label)}<span class="custom-row-count">${(c.words||[]).length} ${state.lang === "en" ? "words" : "слов"}</span></span>
        <button class="custom-del" data-del-room-custom="${esc(id)}" aria-label="${t("customDelete")}">${ICON.trash}</button>
      </div>`;
  }).join("");
  return `<div class="custom-list" style="margin-top:10px">${rows}</div>`;
}

function renderOnlineActive(room) {
  const spyIds = room.spyIds || (room.spyId ? [room.spyId] : []);
  const isSpy = spyIds.includes(MY_ID);
  const secondsLeft = room.discussEndAt ? Math.round((room.discussEndAt - Date.now()) / 1000) : 0;
  const host = isHost();
  return `
    <div class="screen center">
      <div class="badge">${ICON.eye}<span>раунд ${room.round}${spyIds.length > 1 ? " · 2 шпиона" : ""}</span></div>
      <p class="hint" style="margin-bottom:16px">Смотрите карточку когда угодно — она видна только вам.</p>
      ${flipCard(isSpy, roomCatLabel(room, room.categoryKey), room.word, state.onlineFlipped, "onlineStageBtn")}
      <div class="timer" style="margin-top:28px">${ICON.clock}<span id="onlineTimerText">${secondsLeft > 0 ? fmtTime(secondsLeft) : "00:00"}</span></div>
      <p class="hint">По очереди дайте намёк на слово вслух, не называя его. Когда время выйдет, начнётся голосование.</p>
      ${host
        ? `<button class="btn-primary" id="endRoundBtn">Перейти к голосованию</button>`
        : `<div class="waiting-box">${ICON.refresh}<span>Ждём, когда хост начнёт голосование…</span></div>`}
      <div style="margin-top:22px">${playerChips(room)}</div>
    </div>`;
}

function renderOnlineVoting(room) {
  const players = playersArray();
  const votes = room.votes || {};
  const myVote = votes[MY_ID] || null;
  const secondsLeft = room.voteEndAt ? Math.round((room.voteEndAt - Date.now()) / 1000) : 0;
  const votedCount = Object.keys(votes).length;
  const host = isHost();
  const options = players.filter((p) => p.id !== MY_ID).map((p) => `
    <button class="chip${myVote === p.id ? " chip-active" : ""}" data-vote-for="${p.id}" ${myVote ? "disabled" : ""}>${esc(p.name)}</button>
  `).join("");
  return `
    <div class="screen center">
      <div class="badge badge-danger">${ICON.sparkles}<span>голосование</span></div>
      <h2 class="result-title">Кто шпион?</h2>
      <div class="timer" style="margin-top:0">${ICON.clock}<span id="onlineTimerText">${secondsLeft > 0 ? fmtTime(secondsLeft) : "00:00"}</span></div>
      <p class="hint">${myVote ? "Голос учтён. Ждём остальных." : "Выберите, кого подозреваете. Голос можно отдать только один раз."}</p>
      <div class="chip-row" id="voteOptions" style="justify-content:center;max-width:340px">${options}</div>
      <p class="hint" style="margin-top:20px">Проголосовало ${votedCount} из ${players.length}</p>
      ${host ? `<button class="btn-primary" id="finishVotingBtn">Завершить голосование</button>` : ""}
    </div>`;
}

function renderOnlineResult(room) {
  const players = playersArray();
  const { counts, accusedId, tie, spyIds, caughtSpy } = tallyVotes(room, players);
  const spyNames = spyIds.map((id) => (players.find((p) => p.id === id) || {}).name || "неизвестно");
  const accusedName = accusedId ? ((players.find((p) => p.id === accusedId) || {}).name || "неизвестно") : null;
  const host = isHost();

  const voteRows = players.map((p) => {
    const votedFor = (room.votes || {})[p.id];
    const votedForName = votedFor ? ((players.find((x) => x.id === votedFor) || {}).name || "?") : "—";
    return `<div class="player-chip">${esc(p.name)}: <b style="margin-left:4px">${esc(votedForName)}</b></div>`;
  }).join("");

  const countRows = players.map((p) => `<div class="player-chip">${esc(p.name)} — ${counts[p.id] || 0} гол.</div>`).join("");

  let verdict;
  if (!accusedId) verdict = `Большинство не набралось — ${spyIds.length > 1 ? "шпионы остаются" : "шпион остаётся"} незамеченным. Победа шпион${spyIds.length > 1 ? "ов" : "а"}!`;
  else if (caughtSpy) verdict = `${esc(accusedName)} был${spyIds.length > 1 ? "и" : ""} шпионом! Победа мирных жителей.`;
  else verdict = `${esc(accusedName)} — не шпион. ${spyIds.length > 1 ? "Шпионы остались" : "Шпион остался"} незамеченным. Победа шпион${spyIds.length > 1 ? "ов" : "а"}!`;

  return `
    <div class="screen center">
      <div class="verdict-emblem ${caughtSpy ? "verdict-win" : "verdict-lose"}">${caughtSpy ? "🎉" : "🕵️"}</div>
      <div class="badge badge-danger">${ICON.sparkles}<span>раунд завершён</span></div>
      <h2 class="result-title">${verdict}</h2>
      <div class="result-word-box">
        <div class="cat-tag">${esc(roomCatLabel(room, room.categoryKey))}</div>
        <div class="the-word">${esc(room.word)}</div>
        <div class="spy-sub" style="margin-top:6px">Шпион${spyIds.length > 1 ? "ы" : ""}: <span class="accent-red">${esc(spyNames.join(", "))}</span></div>
      </div>
      <div class="section-label" style="margin-top:10px">Кто за кого голосовал</div>
      <div class="player-list">${voteRows}</div>
      <div class="section-label" style="margin-top:16px">Голосов набрано</div>
      <div class="player-list">${countRows}</div>
      ${host ? `
        <div class="result-actions" style="margin-top:22px">
          <button class="btn-primary" id="newOnlineRoundBtn">Новый раунд, та же тема</button>
          <button class="btn-ghost" id="backToLobbyBtn">Сменить тему</button>
        </div>` : `
        <div class="waiting-box" style="margin-top:22px">${ICON.refresh}<span>Ждём решения хоста…</span></div>`}
    </div>`;
}

/* ============================== online 1s countdown ============================== */

let votingTransitionInFlight = false;

function ensureOnlineTick() {
  stopOnlineTick();
  if (state.screen !== "online-room" || !state.room) return;
  const status = state.room.status;
  if (status !== "active" && status !== "voting") return;
  onlineTickId = setInterval(() => {
    const room = state.room;
    if (!room) return;
    const endAt = room.status === "active" ? room.discussEndAt : room.voteEndAt;
    if (!endAt) return;
    const secondsLeft = Math.round((endAt - Date.now()) / 1000);
    const el = document.getElementById("onlineTimerText");
    if (el) el.textContent = secondsLeft > 0 ? fmtTime(secondsLeft) : "00:00";

    // Host auto-advances the stage when its clock runs out. Guarded by
    // votingTransitionInFlight so a slow network reply can't fire twice.
    if (isHost() && secondsLeft <= 0 && !votingTransitionInFlight) {
      votingTransitionInFlight = true;
      const advance = room.status === "active" ? startVoting() : finishVoting();
      Promise.resolve(advance).finally(() => { votingTransitionInFlight = false; });
    }
  }, 1000);
}

/* ============================== events ============================== */

function wireEvents() {
  app.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", function () { goTo(this.getAttribute("data-nav")); });
  });

  // local category grid
  const catGrid = document.getElementById("catGrid");
  if (catGrid && catGrid.dataset.disabled !== "true") {
    catGrid.addEventListener("click", (e) => {
      const slot = e.target.closest("[data-cat]");
      if (!slot) return;
      if (state.screen === "online-room") {
        hostPatch({ categoryKey: slot.getAttribute("data-cat") });
      } else {
        state.categoryKey = slot.getAttribute("data-cat");
        render();
      }
    });
  }

  const minusBtn = document.getElementById("playerMinus");
  const plusBtn = document.getElementById("playerPlus");
  if (minusBtn) minusBtn.addEventListener("click", () => {
    state.playerCount = Math.max(MIN_PLAYERS, state.playerCount - 1);
    if (state.currentPlayer > state.playerCount - 1) state.currentPlayer = 0;
    render();
  });
  if (plusBtn) plusBtn.addEventListener("click", () => {
    state.playerCount = Math.min(MAX_PLAYERS, state.playerCount + 1);
    render();
  });

  const timeChips = document.getElementById("timeChips");
  if (timeChips) timeChips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-time]");
    if (!chip) return;
    state.discussSeconds = parseInt(chip.getAttribute("data-time"), 10);
    state.timeLeft = state.discussSeconds;
    render();
  });

  const onlineTimeChips = document.getElementById("onlineTimeChips");
  if (onlineTimeChips) onlineTimeChips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-online-time]");
    if (!chip) return;
    hostPatch({ discussSeconds: parseInt(chip.getAttribute("data-online-time"), 10) });
  });

  const voteTimeChips = document.getElementById("voteTimeChips");
  if (voteTimeChips) voteTimeChips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-vote-time]");
    if (!chip) return;
    hostPatch({ voteSeconds: parseInt(chip.getAttribute("data-vote-time"), 10) });
  });

  const spyCountChips = document.getElementById("spyCountChips");
  if (spyCountChips) spyCountChips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-spy-count]");
    if (!chip || chip.disabled) return;
    hostPatch({ spyCount: parseInt(chip.getAttribute("data-spy-count"), 10) });
  });

  const placesDifficultyChips = document.getElementById("placesDifficultyChips");
  if (placesDifficultyChips) placesDifficultyChips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-places-diff]");
    if (!chip) return;
    hostPatch({ placesDifficulty: chip.getAttribute("data-places-diff") });
  });

  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.addEventListener("click", () => { if (state.categoryKey) pickRound(state.categoryKey); });

  // local reveal: flip in place so the 3D transition actually plays
  const stageBtn = document.getElementById("stageBtn");
  if (stageBtn) stageBtn.addEventListener("click", () => {
    if (state.flipped) return;
    state.flipped = true;
    const flipInner = document.getElementById("flipInner");
    if (flipInner) flipInner.classList.add("flip-inner-flipped");
    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) { nextBtn.removeAttribute("disabled"); nextBtn.textContent = "Скрыть и передать дальше"; }
    stageBtn.setAttribute("aria-label", "Карточка открыта");
  });
  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) nextBtn.addEventListener("click", () => { if (state.flipped) nextPlayer(); });

  const timerToggle = document.getElementById("timerToggle");
  if (timerToggle) timerToggle.addEventListener("click", toggleDiscussTimer);
  const timerReset = document.getElementById("timerReset");
  if (timerReset) timerReset.addEventListener("click", resetDiscussTimer);
  const toResultBtn = document.getElementById("toResultBtn");
  if (toResultBtn) toResultBtn.addEventListener("click", () => goTo("result"));

  const newRoundBtn = document.getElementById("newRoundBtn");
  if (newRoundBtn) newRoundBtn.addEventListener("click", () => pickRound(state.categoryKey));

  // online: name / code inputs
  const nameInput = document.getElementById("nameInput");
  if (nameInput) nameInput.addEventListener("input", (e) => {
    state.name = e.target.value;
    const createBtn = document.getElementById("createBtn");
    if (createBtn) createBtn.disabled = !state.name.trim() || state.busy;
    const joinBtn = document.getElementById("joinBtn");
    if (joinBtn) joinBtn.disabled = !state.name.trim() || state.joinCodeInput.trim().length < 4 || state.busy;
  });
  const codeInput = document.getElementById("codeInput");
  if (codeInput) codeInput.addEventListener("input", (e) => {
    state.joinCodeInput = e.target.value.toUpperCase();
    e.target.value = state.joinCodeInput;
    const joinBtn = document.getElementById("joinBtn");
    if (joinBtn) joinBtn.disabled = !state.name.trim() || state.joinCodeInput.trim().length < 4 || state.busy;
  });

  const createBtn = document.getElementById("createBtn");
  if (createBtn) createBtn.addEventListener("click", createRoom);
  const joinBtn = document.getElementById("joinBtn");
  if (joinBtn) joinBtn.addEventListener("click", joinRoom);

  const leaveBtn = document.getElementById("leaveBtn");
  if (leaveBtn) leaveBtn.addEventListener("click", leaveRoom);
  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) copyBtn.addEventListener("click", copyCode);

  const startRoundBtn = document.getElementById("startRoundBtn");
  if (startRoundBtn) startRoundBtn.addEventListener("click", startRound);

  // ---- room custom categories (host-managed, synced via Firebase) ----
  const roomCustomToggle = document.getElementById("roomCustomToggle");
  if (roomCustomToggle) roomCustomToggle.addEventListener("click", () => { state.roomCustomOpen = !state.roomCustomOpen; render(); });
  const roomCustomName = document.getElementById("roomCustomName");
  if (roomCustomName) roomCustomName.addEventListener("input", (e) => { state.customDraft.name = e.target.value; });
  const roomCustomWords = document.getElementById("roomCustomWords");
  if (roomCustomWords) roomCustomWords.addEventListener("input", (e) => { state.customDraft.words = e.target.value; });
  const roomCustomSave = document.getElementById("roomCustomSave");
  if (roomCustomSave) roomCustomSave.addEventListener("click", addRoomCustomCategory);
  document.querySelectorAll("[data-del-room-custom]").forEach((el) => {
    el.addEventListener("click", () => deleteRoomCustomCategory(el.getAttribute("data-del-room-custom")));
  });

  // online active: flip in place (own private card, toggles both ways)
  const onlineStageBtn = document.getElementById("onlineStageBtn");
  if (onlineStageBtn) onlineStageBtn.addEventListener("click", () => {
    state.onlineFlipped = !state.onlineFlipped;
    const flipInner = document.getElementById("flipInner");
    if (flipInner) flipInner.classList.toggle("flip-inner-flipped", state.onlineFlipped);
    onlineStageBtn.setAttribute("aria-label", state.onlineFlipped ? "Карточка открыта" : "Открыть карточку");
  });

  const endRoundBtn = document.getElementById("endRoundBtn");
  if (endRoundBtn) endRoundBtn.addEventListener("click", startVoting);

  const voteOptions = document.getElementById("voteOptions");
  if (voteOptions) voteOptions.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-vote-for]");
    if (!chip || chip.disabled) return;
    castVote(chip.getAttribute("data-vote-for"));
  });
  const finishVotingBtn = document.getElementById("finishVotingBtn");
  if (finishVotingBtn) finishVotingBtn.addEventListener("click", finishVoting);

  const newOnlineRoundBtn = document.getElementById("newOnlineRoundBtn");
  if (newOnlineRoundBtn) newOnlineRoundBtn.addEventListener("click", startRound);
  const backToLobbyBtn = document.getElementById("backToLobbyBtn");
  if (backToLobbyBtn) backToLobbyBtn.addEventListener("click", backToLobby);

  // ---- new, purely presentational chrome (rules modal, Discord badge) ----
  // These only touch the new state.rulesOpen flag — no game/Firebase state.
  const rulesTriggerBtn = document.getElementById("rulesTriggerBtn");
  if (rulesTriggerBtn) rulesTriggerBtn.addEventListener("click", () => { state.rulesOpen = true; render(); });
  const rulesCloseBtn = document.getElementById("rulesCloseBtn");
  if (rulesCloseBtn) rulesCloseBtn.addEventListener("click", () => { state.rulesOpen = false; render(); });
  const rulesOverlay = document.getElementById("rulesOverlay");
  if (rulesOverlay) rulesOverlay.addEventListener("click", (e) => { if (e.target === rulesOverlay) { state.rulesOpen = false; render(); } });
  // Discord badge: hover tooltip only for now (per request — the click target
  // is left as a placeholder so a real invite link can be dropped in later).
  const discordBadgeBtn = document.getElementById("discordBadgeBtn");
  if (discordBadgeBtn) discordBadgeBtn.addEventListener("click", () => { /* link coming soon */ });

  // ---- header controls ----
  const langToggleBtn = document.getElementById("langToggleBtn");
  if (langToggleBtn) langToggleBtn.addEventListener("click", () => { playSfx("tap"); setLang(state.lang === "ru" ? "en" : "ru"); });
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  if (soundToggleBtn) soundToggleBtn.addEventListener("click", () => setSound(!state.soundOn));
  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) settingsBtn.addEventListener("click", () => { playSfx("open"); goTo("settings"); });

  // ---- category search (preserve focus/caret across re-render) ----
  const catSearchInput = document.getElementById("catSearchInput");
  if (catSearchInput) catSearchInput.addEventListener("input", (e) => {
    state.catSearch = e.target.value;
    render();
    const again = document.getElementById("catSearchInput");
    if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
  });

  // ---- custom category screen ----
  const openCustomBtn = document.getElementById("openCustomBtn");
  if (openCustomBtn) openCustomBtn.addEventListener("click", () => { playSfx("open"); goTo("custom"); });
  const customNameInput = document.getElementById("customNameInput");
  if (customNameInput) customNameInput.addEventListener("input", (e) => { state.customDraft.name = e.target.value; });
  const customWordsInput = document.getElementById("customWordsInput");
  if (customWordsInput) customWordsInput.addEventListener("input", (e) => { state.customDraft.words = e.target.value; });
  const saveCustomBtn = document.getElementById("saveCustomBtn");
  if (saveCustomBtn) saveCustomBtn.addEventListener("click", saveCustomCategory);
  const customList = document.getElementById("app");
  document.querySelectorAll("[data-del-custom]").forEach((el) => {
    el.addEventListener("click", () => deleteCustomCategory(el.getAttribute("data-del-custom")));
  });

  // ---- settings screen ----
  document.querySelectorAll("[data-set-lang]").forEach((el) => el.addEventListener("click", () => setLang(el.getAttribute("data-set-lang"))));
  document.querySelectorAll("[data-set-sound]").forEach((el) => el.addEventListener("click", () => setSound(el.getAttribute("data-set-sound") === "1")));
  document.querySelectorAll("[data-set-music]").forEach((el) => el.addEventListener("click", () => {
    const want = el.getAttribute("data-set-music") === "1";
    if (want !== state.musicOn) musicToggle(); else render();
  }));
  const settingsVolume = document.getElementById("settingsVolume");
  if (settingsVolume) settingsVolume.addEventListener("input", (e) => { setVolume(parseFloat(e.target.value)); });

  // ---- music player ----
  const playerFab = document.getElementById("playerFab");
  if (playerFab) playerFab.addEventListener("click", () => { state.playerOpen = true; render(); });
  const plCollapse = document.getElementById("plCollapse");
  if (plCollapse) plCollapse.addEventListener("click", () => { state.playerOpen = false; render(); });
  const plPlay = document.getElementById("plPlay");
  if (plPlay) plPlay.addEventListener("click", () => { playSfx("tap"); musicToggle(); });
  const plPrev = document.getElementById("plPrev");
  if (plPrev) plPrev.addEventListener("click", musicPrev);
  const plNext = document.getElementById("plNext");
  if (plNext) plNext.addEventListener("click", musicNext);
  const plVolume = document.getElementById("plVolume");
  if (plVolume) plVolume.addEventListener("input", (e) => { setVolume(parseFloat(e.target.value)); });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.rulesOpen) { state.rulesOpen = false; render(); }
});

/* ============================== boot ============================== */

// if the player still has an active session (e.g. accidental refresh),
// there is nothing to silently rejoin without knowing the room code, so we
// always start clean at the menu — simplest and least surprising behaviour.
render();

// Cinematic splash: show ~2.4s on first load, then fade into the menu.
if (!state.splashDone) {
  setTimeout(() => {
    const splash = document.getElementById("splash");
    if (splash) splash.classList.add("splash-out");
    setTimeout(() => { state.splashDone = true; render(); }, 600);
  }, 2400);
}

// Play a win/lose flourish once whenever the online result screen appears.
let lastResultSig = null;
function resultSfxWatcher() {
  if (state.screen === "online-room" && state.room && state.room.status === "result") {
    const sig = state.roomCode + ":" + state.room.round;
    if (sig !== lastResultSig) {
      lastResultSig = sig;
      const players = playersArray();
      const { caughtSpy } = tallyVotes(state.room, players);
      playSfx(caughtSpy ? "win" : "lose");
    }
  } else if (!(state.room && state.room.status === "result")) {
    lastResultSig = null;
  }
}
