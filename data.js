// =============================================================================
// Guli Games — Investor Tracker — данные
// -----------------------------------------------------------------------------
// Это единая точка правды для всего дашборда. В будущем заменяется на fetch:
//   const data = await fetch('/api/levers').then(r => r.json())
// либо на адаптер из Google Sheets / Notion / Airtable. Пока — статический объект.
//
// Контракт одного «рычага» (lever):
// {
//   id, title, status: 'in_progress'|'done'|'blocked'|'planned',
//   progress: 0..100,
//   updatedAt: 'YYYY-MM-DD',
//   summary: краткое резюме (1 строка),
//   targetDate, ownersInternal: [], counterparties: [],
//   nextSteps: [строки],
//   items: [подпункты со своим статусом/прогрессом/заметками],
//   metrics: { любые числа для KPI },
//   risks: [строки],
//   links: [{label, href}]
// }
// =============================================================================

window.__GULI_DATA__ = {
  meta: {
    company: "Guli Games",
    product: "Legendale",
    reportPeriod: "Апрель 2026",
    lastSync: "2026-04-30 17:25",
    investorNote: "Внутренний tracker. Обновляется по мере прогресса. Цифры рабочие."
  },

  // -----------------------------------------------------------------------
  // Сводные KPI наверху страницы
  // -----------------------------------------------------------------------
  kpis: [
    { id: "stores",   label: "Сторов в работе",       value: "3",   sub: "G5 · Amazon · Windows" },
    { id: "webshops", label: "Веб-шопов в проде",     value: "2",   sub: "Aghanim · Toffee" },
    { id: "playables",label: "Playables в pipeline",  value: "3",  sub: "1 готовы · 3 в работе" },
    { id: "creo",     label: "Креативов / мес",       value: "~29", sub: "in-house + freelance + outsource" }
  ],

  // -----------------------------------------------------------------------
  // ТАБЫ — каждый ведёт свою страницу
  // -----------------------------------------------------------------------
  tabs: [
    {
      id: "stores",
      title: "Сторы",
      subtitle: "Выход на сторонние платформы",
      active: true,
      levers: [
        {
          id: "g5",
          title: "G5 + Windows Store",
          status: "in_progress",
          progress: 30,
          updatedAt: "2026-04-28",
          targetDate: "2026-07",
          summary: "Договорились о паблишинге. Изучаем документацию и контракт, готовим портирование.",
          ownersInternal: ["CTO", "Producer"],
          counterparties: ["G5 Entertainment"],
          nextSteps: [
            "Закрыть юридические вопросы по контракту",
            "Завершить ревью технической документации",
            "Сформировать план портирования (Win build pipeline)",
            "Стартовать порт билда под Windows Store"
          ],
          risks: [
            "Сроки портирования зависят от объёма правок UI/контролов под десктоп",
            "QA-цикл на стороне G5 не определён"
          ],
          metrics: {
            "Этапов закрыто": "2 / 6",
            "Платформа": "Windows + G5.com",
            "Модель": "Revenue share"
          },
          links: [
            { label: "G5.com", href: "https://www.g5.com/" }
          ]
        },
        {
          id: "amazon",
          title: "Amazon Appstore",
          status: "in_progress",
          progress: 20,
          updatedAt: "2026-04-25",
          targetDate: "2026-08",
          summary: "Подписались с паблишером Mamboo. Открытые вопросы по серверу/клиенту — ждут ответа CTO.",
          ownersInternal: ["CTO", "BizDev"],
          counterparties: ["Amazon (консалт)", "Mamboo (publisher)"],
          nextSteps: [
            "Ответить Mamboo по серверной архитектуре",
            "Ответить по клиентским требованиям",
            "Подготовить dev-build под Amazon",
            "Запустить тех-интеграцию"
          ],
          risks: [
            "Требования к серверу Mamboo могут потребовать доработки backend",
            "Зависимость от внешнего паблишера по срокам аппрува"
          ],
          metrics: {
            "Паблишер": "Mamboo",
            "Стадия": "Pre-integration",
            "Контракт": "Подписан"
          },
          links: []
        },
        {
          id: "global",
          title: "Глобально по сторам",
          status: "planned",
          progress: 10,
          updatedAt: "2026-04-29",
          targetDate: "2026-Q3",
          summary: "Цель — выйти во всех сторах в течение 2–3 месяцев. Нужны выделенные ресурсы под порт, тест и регулярные апдейты.",
          ownersInternal: ["Producer", "CTO", "QA Lead"],
          counterparties: [],
          nextSteps: [
            "Сформировать выделенную команду на портирование",
            "Заложить QA-капасити под параллельные платформы",
            "Сформировать релизный календарь апдейтов на 3 платформы"
          ],
          risks: [
            "Команда сейчас не закрывает параллельный релиз на 3 платформы — нужен найм / реаллокация"
          ],
          metrics: {
            "Целевой срок": "2–3 мес.",
            "Платформ": "3"
          },
          links: []
        }
      ]
    },

    {
      id: "webshops",
      title: "Веб-шопы и чекаут",
      subtitle: "Прямая монетизация через web",
      levers: [
        {
          id: "aghanim",
          title: "Aghanim — Legendale Hub",
          status: "done",
          progress: 100,
          updatedAt: "2026-04-20",
          targetDate: "Live",
          summary: "Веб-шоп с daily rewards и чекаутом запущен. Используется как основной web-канал.",
          ownersInternal: ["Web Producer", "Marketing"],
          counterparties: ["Aghanim"],
          nextSteps: [
            "A/B тесты офферов на главной",
            "Расширить каталог daily rewards",
            "Подключить аналитику воронки visit→checkout→paid"
          ],
          risks: [],
          metrics: {
            "Статус": "Live",
            "URL": "legendale-hub.guli-games.com",
            "Daily rewards": "Активно"
          },
          links: [
            { label: "Открыть Legendale Hub", href: "https://legendale-hub.guli-games.com/daily-rewards" }
          ]
        },
        {
          id: "toffee",
          title: "Toffee — web wallet",
          status: "in_progress",
          progress: 70,
          updatedAt: "2026-04-26",
          targetDate: "2026-05",
          summary: "Чекаут + веб-версия с отдельным кошельком. Неплатящий пользователь получает 25$ на старте.",
          ownersInternal: ["Web Producer", "Economy Designer"],
          counterparties: ["Toffee"],
          nextSteps: [
            "Дозакрыть интеграцию кошелька",
            "Настроить attribution для web→app",
            "Запустить кампанию на неплатящих"
          ],
          risks: [
            "Риск каннибализации IAP — нужен мониторинг ARPU"
          ],
          metrics: {
            "Грант новому юзеру": "$25",
            "Целевой канал": "Non-payers"
          },
          links: []
        }
      ]
    },

    {
      id: "creo",
      title: "Креопродакшн",
      subtitle: "Креативы и playable ads",
      // -----------------------------------------------------------------
      // Объёмы продакшена — данные из Notion (база Tasks).
      // Обновляется скриптом notion-sync.js. Не редактировать вручную.
      // -----------------------------------------------------------------
      // %%NOTION_SYNC_START%%
      production: {
        period: "Апрель 2026",
        creatives: {
          label: "Креативы",
          planNow: 29,
          planTarget: 45,
          inProgress: 13,
          doneThisMonth: 16,
          breakdown: {
            inhouse:   { count: 6, note: "In-house" },
            freelance: { count: 36, note: "Фрилансеры · 5 чел. · дедлайн: 17.04" },
            outsource: {
              count: 0,
              vendors: [

              ]
            }
          },
          calendar: {
            done: [
                { date: "2026-04-03", inhouse: 0, freelance: 2, outsource: 0 },
                { date: "2026-04-07", inhouse: 1, freelance: 1, outsource: 0 },
                { date: "2026-04-10", inhouse: 0, freelance: 3, outsource: 0 },
                { date: "2026-04-14", inhouse: 1, freelance: 2, outsource: 0 },
                { date: "2026-04-17", inhouse: 2, freelance: 0, outsource: 0 },
                { date: "2026-04-22", inhouse: 0, freelance: 2, outsource: 0 },
                { date: "2026-04-25", inhouse: 1, freelance: 1, outsource: 0 }
            ],
            planned: [
                { date: "2026-05-05", inhouse: 1, freelance: 3, outsource: 0 },
                { date: "2026-05-09", inhouse: 1, freelance: 4, outsource: 0 },
                { date: "2026-05-14", inhouse: 1, freelance: 3, outsource: 0 },
                { date: "2026-05-19", inhouse: 1, freelance: 2, outsource: 0 }
            ]
          }
        },
        playables: {
          label: "Playables",
          planNow: 4,
          planTarget: 12,
          inProgress: 3,
          doneThisMonth: 1,
          breakdown: {
            inhouse:   { count: 1, note: "In-house" },
            freelance: { count: 0, note: "Фрилансеры" },
            outsource: {
              count: 3,
              vendors: [
                { name: "GG My.Games", count: 3, status: "active", note: "" }
              ]
            }
          },
          calendar: {
            done: [
                { date: "2026-04-28", inhouse: 0, freelance: 0, outsource: 1 }
            ],
            planned: [
                { date: "2026-05-08", inhouse: 0, freelance: 0, outsource: 1 },
                { date: "2026-05-15", inhouse: 0, freelance: 0, outsource: 1 },
                { date: "2026-05-22", inhouse: 0, freelance: 0, outsource: 1 }
            ]
          }
        }
      },
      // %%NOTION_SYNC_END%%
      // -----------------------------------------------------------------
      // Команда отдела
      // -----------------------------------------------------------------
      team: {
        groups: [
          {
            id: "motion",
            label: "3D Motion Designers",
            count: 2,
            type: "inhouse",
            note: "2 inhouse · 2 in search (+ Cinematic Artist, Freelance Motion x3)",
            members: [
              { name: "Maxim Dolgov",   role: "3D Motion Designer · Lead", status: "active" },
              { name: "Veronika Luzan", role: "3D Motion Designer",        status: "active" }
            ]
          },
          {
            id: "creo_prod",
            label: "Creo Prod (CMO)",
            count: 0,
            type: "hiring",
            note: "In search · Bogdan covers for now",
            members: [
              { name: "Bogdan", role: "CMO · covering the role", status: "interim" },
              { name: "—",      role: "Creative Producer",       status: "open" }
            ]
          },
          {
            id: "creators",
            label: "Creators",
            count: 4,
            type: "freelance",
            note: "4 freelancers",
            members: [
              // %%CREATORS_SYNC_START%%
              { name: "Vlad",   role: "Creator · freelance", status: "active" },
              { name: "Sergey", role: "Creator · freelance", status: "active" },
              { name: "Igor",   role: "Creator · freelance", status: "active" },
              { name: "Kirill", role: "Creator · freelance", status: "active" }
              // %%CREATORS_SYNC_END%%
            ]
          },
          {
            id: "outsource",
            label: "Outsource",
            count: 5,
            type: "outsource",
            note: "Studios & agencies",
            members: [
              // %%OUTSOURCE_SYNC_START%%
              { name: "CAS",        role: "Outsource studio", status: "active" },
              { name: "Mambo",      role: "Outsource studio", status: "active" },
              { name: "Alchemia",   role: "Outsource studio", status: "active" },
              { name: "RAD",        role: "Outsource studio", status: "active" },
              { name: "GG My.Games",role: "Outsource studio", status: "active" }
              // %%OUTSOURCE_SYNC_END%%
            ]
          }
        ]
      },
      levers: [
        {
          id: "inhouse",
          title: "Команда и найм",
          status: "in_progress",
          progress: 60,
          updatedAt: "2026-05-01",
          summary: "In-house: Maxim Dolgov (Motion Lead) + Veronika Luzan. В поиске: 3D Motion Designer x2, Freelance Motion Designer x3, Creative Producer x1.",
          ownersInternal: ["Maxim Dolgov (Motion Lead)", "Veronika Luzan"],
          counterparties: [],
          stepsLabel: "Открытые позиции",
          progressDots: { filled: 2, total: 8, label: "Команда" },
          nextSteps: [
            "Найм Creative Producer — 1 позиция в поиске",
            "Найм 3D Motion Designer — 2 открытые позиции",
            "Найм Freelance Motion Designer — 3 позиции",
            "Расширить AI-pipeline для intro/outro"
          ],
          risks: [
            "Без Creative Producer узкое горло — лид перегружен",
            "Мало креаторов — не хватает рук на объём",
            "Мало моушенов — 2 in-house не закрывают потребность",
            "Мало фрилансеров — нестабильный резерв"
          ],
          metrics: {
            "In-house": "2 чел.",
            "В поиске · Motion": "5 позиций",
            "В поиске · Creo Prod": "1 позиция",
            "AI usage": "Intro / Outro"
          },
          links: []
        },
        {
          id: "playables",
          title: "Playable ads",
          status: "in_progress",
          progress: 45,
          updatedAt: "2026-04-29",
          summary: "Аутсорс-продакшн playables: 5 готовы, 10 ожидают брифов; параллельно 3 playables у второго подрядчика.",
          ownersInternal: ["Creative Lead", "UA Manager"],
          counterparties: ["Аутсорс A", "Аутсорс B"],
          nextSteps: [
            "Дописать брифы на 10 playables",
            "Запустить тестовый прогон 5 готовых",
            "Сравнить performance двух подрядчиков"
          ],
          risks: [
            "Долгий цикл брифинга → простой подрядчиков"
          ],
          metrics: {
            "Готовы": "5",
            "В брифинге": "10",
            "У второго подрядчика": "3"
          },
          links: []
        },
        {
          id: "settai",
          title: "Sett.ai — AI-креативы",
          status: "planned",
          progress: 15,
          updatedAt: "2026-04-22",
          summary: "Переговоры. Предложение: 12 креативов / месяц за $12k. Решаем по ценности и интеграции с пайплайном.",
          ownersInternal: ["Creative Lead", "UA Manager"],
          counterparties: ["Sett.ai"],
          nextSteps: [
            "Запросить демо-пакет",
            "Оценить unit-экономику ($1k/креатив vs альтернативы)",
            "Принять решение go / no-go"
          ],
          risks: [
            "Цена дороже фрилансеров — нужен явный uplift по CTR/CPI"
          ],
          metrics: {
            "Объём": "12 / мес",
            "Цена": "$12 000 / мес",
            "Стадия": "Negotiation"
          },
          links: []
        }
      ]
    },

    // ----------- Будущие слоты -----------
    {
      id: "ua",
      title: "UA и спенды",
      subtitle: "User acquisition",
      placeholder: true,
      levers: [
        {
          id: "ua_overview",
          title: "Сводка по UA",
          status: "planned",
          progress: 0,
          summary: "Слот под бюджеты, CPI/ROAS, разбивку по каналам. Будет наполняться.",
          nextSteps: ["Подключить источник: MMP / Google Sheets", "Определить целевые KPI на квартал"],
          metrics: {}
        }
      ]
    },
    {
      id: "monetization",
      title: "Монетизация и фичи",
      subtitle: "IAP, экономика, ключевые фичи",
      placeholder: true,
      levers: [
        {
          id: "monet_overview",
          title: "Roadmap фичей",
          status: "planned",
          progress: 0,
          summary: "Слот под ARPDAU, новые фичи в проде, A/B-тесты.",
          nextSteps: ["Заложить структуру фичей", "Подключить аналитику"],
          metrics: {}
        }
      ]
    },
    {
      id: "content",
      title: "Локации и контент",
      subtitle: "Сроки и количество локаций",
      placeholder: true,
      levers: [
        {
          id: "loc_overview",
          title: "Контент-план",
          status: "planned",
          progress: 0,
          summary: "Слот под локации, сроки релизов, объём контента.",
          nextSteps: ["Согласовать roadmap локаций", "Привязать к релизному календарю"],
          metrics: {}
        }
      ]
    },
    {
      id: "team",
      title: "Команда",
      subtitle: "Hiring и состав",
      placeholder: true,
      levers: [
        {
          id: "team_overview",
          title: "Найм и состав",
          status: "planned",
          progress: 0,
          summary: "Слот под численность, открытые позиции, ключевые роли в поиске.",
          nextSteps: ["Описать org-chart", "Указать приоритетные вакансии"],
          metrics: {}
        }
      ]
    },
    {
      id: "vendors",
      title: "Контрагенты",
      subtitle: "Подрядчики и партнёры",
      placeholder: true,
      levers: [
        {
          id: "vendors_overview",
          title: "Реестр контрагентов",
          status: "planned",
          progress: 0,
          summary: "Слот под список подрядчиков, статусы контрактов, performance.",
          nextSteps: ["Свести список в одну таблицу", "Определить KPI по каждому"],
          metrics: {}
        }
      ]
    }
  ],

  // -----------------------------------------------------------------------
  // Лог изменений — то, что инвестор увидит как «новое с прошлого визита».
  // Сравнение с localStorage по дате последнего визита.
  // -----------------------------------------------------------------------
  changelog: [
    { date: "2026-04-30", tab: "creo", text: "Синх. с Notion (04/2026): крео 16 готово · 13 в работе; playables 1 · 3." },
    { date: "2026-04-30", tab: "creo", text: "Синх. с Notion (04/2026): крео 16 готово · 13 в работе; playables 1 · 3." },
    { date: "2026-04-29", tab: "creo", text: "Синх. с Notion (04/2026): крео 13 готово · 13 в работе; playables 1 · 3." },
    { date: "2026-04-29", tab: "creo",     text: "Sett.ai: получили предложение 12 креативов / $12k / мес — на оценке." },
    { date: "2026-04-28", tab: "stores",   text: "G5: закончили первый раунд ревью контракта, остаются вопросы по revenue share." },
    { date: "2026-04-26", tab: "webshops", text: "Toffee: завершена базовая интеграция кошелька, готовим тестовую кампанию." },
    { date: "2026-04-25", tab: "stores",   text: "Amazon/Mamboo: получены вопросы по серверу и клиенту, в работе у CTO." },
    { date: "2026-04-22", tab: "creo",     text: "Аутсорс B: подтвердили старт 3 playables." },
    { date: "2026-04-20", tab: "webshops", text: "Aghanim: запустили daily rewards в проде на legendale-hub." },
    { date: "2026-04-15", tab: "creo",     text: "Аутсорс A: получили 5 готовых playables, ожидают тестового прогона." }
  ]
};
