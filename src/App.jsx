import { useState, useEffect, useMemo, useRef } from 'react'
import { games as initialGames } from './data/games.js'
import './App.css'

const translations = {
  ru: {
    all: "Все игры",
    favorites: "Избранное",
    search: "Поиск игр, тегов, разработчиков...",
    empty: "Ничего не найдено",
    downloadItch: "Скачать с itch.io",
    downloadSteam: "Скачать со Steam",
    supportDev: "Поддержать разработчика",
    addFav: "В избранное",
    inFav: "В избранном",
    screenshots: "Скриншоты",
    platforms: "Платформы",
    animation: "Анимация",
    yes: "Да",
    no: "Нет",
    russian: "Русский перевод",
    clearFav: "Очистить избранное",
    sort: "Сортировка",
    filter: "Фильтры",
    platform: "Платформа",
    any: "Любая",
    share: "Поделиться",
    copied: "Скопировано",
    top: "Наверх",
    sortRating: "Рейтинг",
    sortYear: "Год",
    sortName: "Название",
    ageTitle: "18+",
    ageText1: "Этот каталог содержит откровенный контент для взрослых.",
    ageText2: "Подтверди, что тебе исполнилось 18 лет.",
    ageConfirm: "Мне 18+, принимаю правила",
    ageExit: "Выйти",
    downloadTg: "Скачать в Telegram",
    ageLeft: "Доступ закрыт. Вы покинули каталог.",
    shareText: "смотри в Steamy Store",
    tag: "Тег",
    close: "Закрыть",
    rulesLink: "Правила",
    rulesTitle: "Правила",
    rulesIntro: "Перед тем как открыть каталог, подтвердите, что:",
    rules1: "Вам исполнилось 18 лет. Здесь игры для взрослых с откровенным контентом.",
    rules2: "Все игры принадлежат их разработчикам. Если игра понравилась, поддержите автора: кнопка есть в карточке игры.",
    rules3: "Файлы предназначены только для личного использования. Перепродавать их или выдавать за свои запрещено.",
    rules4: "Вы скачиваете и устанавливаете файлы на свой страх и риск.",
    rules5: "Если вы правообладатель и хотите, чтобы игру убрали, напишите:",
    rulesAgree: "Нажимая кнопку ниже, вы соглашаетесь с правилами."
  },
  en: {
    all: "All games",
    favorites: "Favorites",
    search: "Search games, tags, developers...",
    empty: "Nothing found",
    downloadItch: "Download on itch.io",
    downloadSteam: "Download on Steam",
    supportDev: "Support the developer",
    addFav: "Add to favorites",
    inFav: "In favorites",
    screenshots: "Screenshots",
    platforms: "Platforms",
    animation: "Animation",
    yes: "Yes",
    no: "No",
    russian: "Russian translation",
    clearFav: "Clear favorites",
    sort: "Sort",
    filter: "Filters",
    platform: "Platform",
    any: "Any",
    share: "Share",
    copied: "Copied",
    top: "Top",
    sortRating: "Rating",
    sortYear: "Year",
    sortName: "Name",
    ageTitle: "18+",
    ageText1: "This catalog contains explicit adult content.",
    ageText2: "Confirm that you are 18 years or older.",
    ageConfirm: "I am 18+, I accept the rules",
    ageExit: "Exit",
    downloadTg: "Download in Telegram",
    ageLeft: "Access denied. You have left the catalog.",
    shareText: "check it out in Steamy Store",
    tag: "Tag",
    close: "Close",
    rulesLink: "Rules",
    rulesTitle: "Rules",
    rulesIntro: "Before opening the catalog, please confirm that:",
    rules1: "You are 18 or older. This catalog has adult games with explicit content.",
    rules2: "All games belong to their developers. If you enjoyed a game, support the author: the button is on the game card.",
    rules3: "Files are for personal use only. Reselling them or passing them off as your own is prohibited.",
    rules4: "You download and install files at your own risk.",
    rules5: "If you are a rights holder and want a game removed, write to:",
    rulesAgree: "By tapping the button below, you agree to the rules."
  }
}

function isSteamStoreUrl(url) {
  if (!url || !/^https:\/\//i.test(url)) return false
  try {
    const host = new URL(url).hostname.toLowerCase()
    return host === 'store.steampowered.com' || host === 'www.store.steampowered.com'
  } catch {
    return false
  }
}

function isTelegramWebApp() {
  const tg = window.Telegram?.WebApp
  if (!tg) return false
  if (tg.initData) return true
  return Boolean(tg.platform && tg.platform !== 'unknown')
}

function readStorage(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

const CHANNEL_URL = 'https://t.me/steamystore'
const RULES_CONTACT = '@SteamySupportBot'
const RULES_STORAGE_KEY = 'rulesAccepted_v1'
const RULES_CONTACT_URL = 'https://t.me/SteamySupportBot'

const LOGO_TAP_MS = 2000

function StoreLogo({ theme }) {
  const taps = useRef({ count: 0, last: 0 })
  const src = theme === 'light' ? '/logo-lockup-light.webp' : '/logo-lockup-dark.webp'

  const onLogoTap = () => {
    const now = Date.now()
    if (now - taps.current.last > LOGO_TAP_MS) taps.current.count = 0
    taps.current.count += 1
    taps.current.last = now

    const tg = window.Telegram?.WebApp
    try {
      tg?.HapticFeedback?.impactOccurred?.(taps.current.count >= 5 ? 'medium' : 'light')
    } catch {
      /* haptic is optional */
    }

    if (taps.current.count >= 5) {
      taps.current.count = 0
      if (isTelegramWebApp() && tg?.openTelegramLink) tg.openTelegramLink(CHANNEL_URL)
      else window.open(CHANNEL_URL, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="logo" onClick={onLogoTap}>
      <img src={src} alt="Steamy Store" className="logo-img" draggable="false" />
    </div>
  )
}


function openContact() {
  if (isTelegramWebApp() && window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(RULES_CONTACT_URL)
  } else {
    window.open(RULES_CONTACT_URL, '_blank', 'noopener,noreferrer')
  }
}

function RulesBlock({ t, showAgree }) {
  return (
    <>
      <p className="rules-intro">{t.rulesIntro}</p>
      <ol className="rules-list">
        <li>{t.rules1}</li>
        <li>{t.rules2}</li>
        <li>{t.rules3}</li>
        <li>{t.rules4}</li>
        <li>
          {t.rules5}{' '}
          <button type="button" className="rules-contact" onClick={openContact}>
            {RULES_CONTACT}
          </button>
        </li>
      </ol>
      {showAgree && <p className="rules-agree">{t.rulesAgree}</p>}
    </>
  )
}

function handleImageError(e) {
  e.currentTarget.onerror = null
  e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="100%" height="100%" fill="#2a2a2a"/></svg>')
}

function App() {
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [ageLeft, setAgeLeft] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [lang, setLang] = useState('ru')
  const [sortBy, setSortBy] = useState('rating')
  const [filterPlatform, setFilterPlatform] = useState('any')
  const [filterAnimation, setFilterAnimation] = useState('any')
  const [filterRussian, setFilterRussian] = useState('any')
  const [activeTag, setActiveTag] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState('dark')
  const closeBtnRef = useRef(null)
  const copiedTimer = useRef(null)

  const t = translations[lang] || translations.ru

  const openGameFromStartParam = (param) => {
    if (!param || !String(param).startsWith('game_')) return
    const gameId = parseInt(String(param).replace('game_', ''), 10)
    const game = initialGames.find(g => g.id === gameId)
    if (game) setSelectedGame(game)
  }

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    const inTelegram = isTelegramWebApp()
    const applyTheme = () => {
      const colorScheme = tg.colorScheme || 'dark'
      setTheme(colorScheme)
      const bg = colorScheme === 'dark' ? '#0f0f0f' : '#ffffff'
      tg.setHeaderColor(bg)
      tg.setBackgroundColor(bg)
    }
    const applyViewport = () => {
      if (tg.viewportStableHeight) {
        document.documentElement.style.setProperty('--tg-viewport-stable-height', `${tg.viewportStableHeight}px`)
      }
    }

    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const applyPrefers = () => setTheme(mq.matches ? 'light' : 'dark')

    if (inTelegram) {
      tg.ready()
      tg.expand()
      applyTheme()
      applyViewport()
      openGameFromStartParam(tg.initDataUnsafe?.start_param)
      tg.onEvent('themeChanged', applyTheme)
      tg.onEvent('viewportChanged', applyViewport)
    } else {
      applyPrefers()
      if (mq.addEventListener) mq.addEventListener('change', applyPrefers)
      else mq.addListener(applyPrefers)
      openGameFromStartParam(new URLSearchParams(window.location.search).get('tgWebAppStartParam'))
    }

    const savedFav = readStorage('steamy-favorites-v2')
    if (savedFav) {
      try {
        const parsed = JSON.parse(savedFav)
        setFavorites(Array.isArray(parsed) ? parsed : [])
      } catch {
        setFavorites([])
      }
    }

    const accepted = readStorage(RULES_STORAGE_KEY)
    if (accepted === 'yes') setAgeConfirmed(true)

    const savedLang = readStorage('steamy-lang')
    if (savedLang === 'ru' || savedLang === 'en') setLang(savedLang)

    const savedTab = readStorage('steamy-tab')
    if (savedTab === 'all' || savedTab === 'favorites') setActiveTab(savedTab)

    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (inTelegram) {
        tg.offEvent('themeChanged', applyTheme)
        tg.offEvent('viewportChanged', applyViewport)
      } else if (mq.removeEventListener) {
        mq.removeEventListener('change', applyPrefers)
      } else if (mq.removeListener) {
        mq.removeListener(applyPrefers)
      }
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (!showRules) return
    const onKey = (e) => {
      if (e.key === 'Escape') setShowRules(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showRules])

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0f0f0f' : '#ffffff')
  }, [theme])

  const [lightboxIndex, setLightboxIndex] = useState(null)
  const modalOpen = Boolean(selectedGame) && ageConfirmed && !ageLeft

  useEffect(() => {
    setLightboxIndex(null)
  }, [selectedGame])

  useEffect(() => {
    const tg = isTelegramWebApp() ? window.Telegram.WebApp : null
    const shots = selectedGame?.screenshots || []
    const onBack = () => {
      if (lightboxIndex != null) {
        setLightboxIndex(null)
        return
      }
      setSelectedGame(null)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onBack()
        return
      }
      if (lightboxIndex == null || shots.length === 0) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setLightboxIndex((i) => (i == null ? i : (i + 1) % shots.length))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setLightboxIndex((i) => (i == null ? i : (i - 1 + shots.length) % shots.length))
      }
    }

    if (modalOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
      if (lightboxIndex == null) closeBtnRef.current?.focus()
      if (tg?.BackButton) {
        tg.BackButton.show()
        tg.BackButton.onClick(onBack)
      }
    } else {
      document.body.style.overflow = ''
      tg?.BackButton?.hide()
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (tg?.BackButton) {
        if (typeof tg.BackButton.offClick === 'function') tg.BackButton.offClick(onBack)
        tg.BackButton.hide()
      }
    }
  }, [modalOpen, lightboxIndex, selectedGame])

  useEffect(() => () => clearTimeout(copiedTimer.current), [])

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      writeStorage('steamy-favorites-v2', JSON.stringify(next))
      return next
    })
  }

  const clearFavorites = () => {
    setFavorites([])
    writeStorage('steamy-favorites-v2', JSON.stringify([]))
  }

  const confirmAge = () => {
    writeStorage(RULES_STORAGE_KEY, 'yes')
    setAgeConfirmed(true)
  }

  const exitApp = () => {
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.close()
    } else {
      setAgeLeft(true)
    }
  }

  const changeLang = (newLang) => {
    setLang(newLang)
    writeStorage('steamy-lang', newLang)
  }

  const changeTab = (tab) => {
    setActiveTab(tab)
    writeStorage('steamy-tab', tab)
  }

  const shareGame = (game) => {
    const text = game.title + " — " + t.shareText
    const url = "https://t.me/SteamyStore_bot?startapp=game_" + game.id

    const markCopied = () => {
      setCopied(true)
      clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => setCopied(false), 1500)
    }

    if (isTelegramWebApp()) {
      const shareLink = "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text)
      window.Telegram.WebApp.openTelegramLink(shareLink)
    } else {
      navigator.clipboard.writeText(url).then(markCopied).catch(() => {
        try {
          const el = document.createElement('textarea')
          el.value = url
          el.setAttribute('readonly', '')
          el.style.position = 'fixed'
          el.style.left = '-9999px'
          document.body.appendChild(el)
          el.select()
          const ok = document.execCommand('copy')
          document.body.removeChild(el)
          if (ok) markCopied()
        } catch {}
      })
    }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const filteredGames = useMemo(() => {
    let list = activeTab === 'favorites'
      ? initialGames.filter(g => favorites.includes(g.id))
      : initialGames

    if (filterPlatform !== 'any') {
      list = list.filter(g => g.platforms.includes(filterPlatform))
    }
    if (filterAnimation !== 'any') {
      list = list.filter(g => g.hasAnimation === (filterAnimation === 'yes'))
    }
    if (filterRussian !== 'any') {
      list = list.filter(g => g.hasRussian === (filterRussian === 'yes'))
    }
    if (activeTag) {
      list = list.filter(g => g.tags.includes(activeTag))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.developer.toLowerCase().includes(q) ||
        g.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }

    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sortBy === 'year') list = [...list].sort((a, b) => b.year - a.year)
    if (sortBy === 'name') list = [...list].sort((a, b) => a.title.localeCompare(b.title))

    return list
  }, [search, activeTab, favorites, sortBy, filterPlatform, filterAnimation, filterRussian, activeTag])

  const openDownload = (url) => {
    if (!url || !/^https:\/\//i.test(url)) return
    if (isTelegramWebApp()) {
      window.Telegram.WebApp.openLink(url)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const openTelegramFile = (game) => {
    const url = 'https://t.me/SteamyFilesBot?start=game_' + game.id
    if (isTelegramWebApp() && window.Telegram.WebApp.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(url)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (ageLeft) {
    return (
      <div className={`age-gate ${theme}`}>
        <div className="age-card animate-in">
          <StoreLogo theme={theme} />
          <h1>{t.ageTitle}</h1>
          <p>{t.ageLeft}</p>
        </div>
      </div>
    )
  }

  if (!ageConfirmed) {
    return (
      <div className={`age-gate ${theme}`}>
        <div className="age-card age-card-rules animate-in">
          <StoreLogo theme={theme} />
          <div className="lang-switch age-lang">
            <button type="button" className={lang === 'ru' ? 'active' : ''} onClick={() => changeLang('ru')}>RU</button>
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => changeLang('en')}>EN</button>
          </div>
          <h1 className="rules-heading">{t.ageTitle}</h1>
          <h2 className="rules-title">{t.rulesTitle}</h2>
          <RulesBlock t={t} showAgree />
          <button type="button" className="btn-primary" onClick={confirmAge}>{t.ageConfirm}</button>
          <button type="button" className="btn-secondary" onClick={exitApp}>{t.ageExit}</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <div className="header-top">
          <StoreLogo theme={theme} />
          <div className="header-right">
            <button type="button" className="rules-link" onClick={() => setShowRules(true)}>{t.rulesLink}</button>
            <div className="lang-switch">
              <button type="button" className={lang === 'ru' ? 'active' : ''} onClick={() => changeLang('ru')}>RU</button>
              <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => changeLang('en')}>EN</button>
            </div>
          </div>
        </div>
        <input
          className="search"
          type="search"
          placeholder={t.search}
          aria-label={t.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="controls">
          <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
            {t.filter} {showFilters ? '▲' : '▼'}
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label={t.sort}>
            <option value="rating">{t.sort}: {t.sortRating}</option>
            <option value="year">{t.sort}: {t.sortYear}</option>
            <option value="name">{t.sort}: {t.sortName}</option>
          </select>
        </div>

        {showFilters && (
          <div className="filters animate-in">
            <div className="filter-row">
              <span>{t.platform}</span>
              <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} aria-label={t.platform}>
                <option value="any">{t.any}</option>
                <option value="PC">PC</option>
                <option value="Android">Android</option>
                <option value="Mac">Mac</option>
                <option value="Web">Web</option>
              </select>
            </div>
            <div className="filter-row">
              <span>{t.animation}</span>
              <select value={filterAnimation} onChange={e => setFilterAnimation(e.target.value)} aria-label={t.animation}>
                <option value="any">{t.any}</option>
                <option value="yes">{t.yes}</option>
                <option value="no">{t.no}</option>
              </select>
            </div>
            <div className="filter-row">
              <span>{t.russian}</span>
              <select value={filterRussian} onChange={e => setFilterRussian(e.target.value)} aria-label={t.russian}>
                <option value="any">{t.any}</option>
                <option value="yes">{t.yes}</option>
                <option value="no">{t.no}</option>
              </select>
            </div>
          </div>
        )}
        {activeTag && (
          <button type="button" className="clear-tag" onClick={() => setActiveTag(null)}>
            {t.tag}: {activeTag} ✕
          </button>
        )}

        <div className="tabs">
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => changeTab('all')}>
            {t.all} ({initialGames.length})
          </button>
          <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => changeTab('favorites')}>
            {t.favorites} ({favorites.length})
          </button>
          {favorites.length > 0 && (
            <button className="clear-btn" onClick={clearFavorites}>{t.clearFav}</button>
          )}
        </div>
      </header>

      <main className="grid">
        {filteredGames.length === 0 ? (
          <div className="empty">{t.empty}</div>
        ) : (
          filteredGames.map((game, i) => (
            <div
              key={game.id}
              className="card animate-in"
              style={{ animationDelay: `${i * 0.05}s` }}
              role="button"
              tabIndex={0}
              aria-label={game.title}
              onClick={() => setSelectedGame(game)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedGame(game)
                }
              }}
            >
              <div className="cover-wrap">
                <img src={game.cover} alt={game.title} className="cover" loading="lazy" onError={handleImageError} />
                <button
                  type="button"
                  className={`fav-btn ${favorites.includes(game.id) ? 'active' : ''}`}
                  aria-label={favorites.includes(game.id) ? t.inFav : t.addFav}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(game.id) }}
                >
                  {favorites.includes(game.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="card-info">
                <div className="title">{game.title}</div>
                <div className="meta">{game.year} · {game.developer}</div>
                <div className="tags">
                  {game.tags.slice(0, 3).map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={(e) => { e.stopPropagation(); setActiveTag(tag); setShowFilters(true) }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {showTop && (
        <button type="button" className="to-top" onClick={scrollToTop} aria-label={t.top}>{t.top}</button>
      )}

      {selectedGame && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={selectedGame.title} onClick={() => setSelectedGame(null)}>
          <div className="modal-content animate-in" onClick={e => e.stopPropagation()}>
            <img src={selectedGame.cover} alt={selectedGame.title} className="modal-cover" loading="lazy" onError={handleImageError} />
            <div className="modal-body">
              <h2>{selectedGame.title}</h2>
              <div className="meta">{selectedGame.developer} · {selectedGame.year} · ⭐ {selectedGame.rating}</div>

              <div className="info-row"><span>{t.platforms}: {selectedGame.platforms.join(', ')}</span></div>
              <div className="info-row"><span>{t.animation}: {selectedGame.hasAnimation ? t.yes : t.no}</span></div>
              <div className="info-row"><span>{t.russian}: {selectedGame.hasRussian ? t.yes : t.no}</span></div>

              <div className="tags">
                {selectedGame.tags.map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => { setActiveTag(tag); setSelectedGame(null); setShowFilters(true) }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="desc">{selectedGame.description[lang] || selectedGame.description.ru}</p>

              {selectedGame.screenshots?.length > 0 && (
                <div className="screenshots">
                  <div className="screenshots-title">{t.screenshots}</div>
                  <div className="screenshots-row">
                    {selectedGame.screenshots.map((src, i) => (
                      <button
                        type="button"
                        key={src}
                        className="screenshot-btn"
                        onClick={() => setLightboxIndex(i)}
                        aria-label={`${t.screenshots} ${i + 1}`}
                      >
                        <img src={src} alt={`${selectedGame.title} ${i + 1}`} className="screenshot" loading="lazy" onError={handleImageError} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-primary" onClick={() => openTelegramFile(selectedGame)}>
                  {t.downloadTg}
                </button>
                {selectedGame.itchUrl ? (
                  <button type="button" className="btn-primary" onClick={() => openDownload(selectedGame.itchUrl)}>
                    {t.downloadItch}
                  </button>
                ) : isSteamStoreUrl(selectedGame.downloadUrl) ? (
                  <button type="button" className="btn-primary" onClick={() => openDownload(selectedGame.downloadUrl)}>
                    {t.downloadSteam}
                  </button>
                ) : null}
                {(selectedGame.patreonUrl || selectedGame.siteUrl) && (
                  <button type="button" className="btn-secondary" onClick={() => openDownload(selectedGame.patreonUrl || selectedGame.siteUrl)}>
                    {t.supportDev}
                  </button>
                )}
                <button className="btn-secondary" onClick={() => shareGame(selectedGame)}>
                  {copied ? t.copied : t.share}
                </button>
                <button
                  className={`btn-fav ${favorites.includes(selectedGame.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(selectedGame.id)}
                >
                  {favorites.includes(selectedGame.id) ? t.inFav : t.addFav}
                </button>
              </div>
            </div>
            <button type="button" className="close" ref={closeBtnRef} aria-label={t.close} onClick={() => setSelectedGame(null)}>✕</button>
          </div>
        </div>
      )}

      {selectedGame && lightboxIndex != null && selectedGame.screenshots?.[lightboxIndex] && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t.screenshots}
          onClick={() => setLightboxIndex(null)}
        >
          <button type="button" className="close lightbox-close" aria-label={t.close} onClick={() => setLightboxIndex(null)}>✕</button>
          <img
            src={selectedGame.screenshots[lightboxIndex]}
            alt={`${selectedGame.title} ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <footer className="app-footer">
        <button type="button" className="rules-link" onClick={() => setShowRules(true)}>{t.rulesLink}</button>
      </footer>

      {showRules && (
        <div
          className={`rules-overlay ${theme}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rules-dialog-title"
          onClick={() => setShowRules(false)}
        >
          <div className="age-card age-card-rules rules-dialog" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close" aria-label={t.close} onClick={() => setShowRules(false)}>✕</button>
            <h2 id="rules-dialog-title" className="rules-title">{t.rulesTitle}</h2>
            <RulesBlock t={t} />
            <button type="button" className="btn-primary" onClick={() => setShowRules(false)}>{t.close}</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
