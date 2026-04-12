/* ══════════════════════════════════════════════════════════════
   js/data.js  —  Family data for the Zaytsev / Antonov / Ippolitov tree
   All family members, connections, and historical notes.
   Includes documented research findings from independent archive research.
   ══════════════════════════════════════════════════════════════ */

const DEFAULT_DATA = {
  people: {

    // ══════════════════════════════════════════════
    // ПОКОЛЕНИЕ 0 — ПРАПРАДЕДЫ: АНТОНОВЫ + АРНАУТОВЫ
    // ══════════════════════════════════════════════

    "ant-feodor": {
      firstname: "Фёдор",
      patronymic: "Викторович",
      lastname: "Антонов",
      gender: "m",
      birth: 1883,
      death: 1963,
      birthplace: "Бугурусланский уезд, Самарская губерния",
      deathplace: "Ташлак, Ферганская обл., Узбекистан",
      job: "Крестьянин",
      notes: "Глава семьи Антоновых. Все называли его «папаня». До революции жил в Оренбургской губернии (район Блявы / Медногорска). Около 1954–55 гг. переехал в Узбекистан. Умер в Ташлаке в ~1963 году в возрасте около 80 лет.",
      father: null,
      mother: null,
      spouse: "ant-aleksandra",
      children: ["ant-vasily", "ant-grigory", "ant-anna", "ant-dmitry", "ant-galya"]
    },

    "ant-aleksandra": {
      firstname: "Александра",
      patronymic: "Тарасьевна",
      lastname: "Арнаутова",
      gender: "f",
      birth: 1883,
      death: 1951,
      birthplace: "с. Дедово, Бугурусланский уезд, Самарская губерния",
      deathplace: null,
      job: null,
      notes: "Жена Фёдора Антонова. Девичья фамилия Арнаутова. Умерла в 1951 году скоропостижно от кровоизлияния в мозг — почувствовала себя плохо во время мытья полов.\n\n📜 В архивной метрике с. Дедово обнаружена запись о браке «Татьяны Викторовой Арнаутовой, 19 лет». Считается, что это та же Александра — расхождение в имени объясняется тем, что у крестьян нередко было крестильное и мирское имя. Противоречие в отчестве (Викторовна vs Тарасьевна) исследователями не разрешено.",
      father: null,
      mother: null,
      spouse: "ant-feodor",
      children: ["ant-vasily", "ant-grigory", "ant-anna", "ant-dmitry", "ant-galya"]
    },

    // ══════════════════════════════════════════════
    // ПОКОЛЕНИЕ 0 — ПРАПРАДЕДЫ: ИППОЛИТОВЫ + САДОВНИКОВЫ
    // ══════════════════════════════════════════════

    "ipp-semyon": {
      firstname: "Семён",
      patronymic: "Ефимович",
      lastname: "Ипполитов",
      gender: "m",
      birth: 1908,
      death: 1966,
      birthplace: "с. Кривоозёрки, Аксубаевский р-н, Казанская губерния (ныне Татарстан)",
      deathplace: null,
      job: "Участник ВОВ — гвардии рядовой",
      notes: "Прадед. Родился 29 февраля 1908 года (визуально 1908, по официальным документам фигурирует также 1902 г. — расхождение частое из-за утери документов при переездах). Умер 30 сентября 1966 года от рака предстательной железы в возрасте 58–64 лет.\n\n⚕️ По семейному преданию у Семёна сердце было с правой стороны (декстрокардия). Документально не подтверждено, передаётся устно.\n\n🪖 ВОЙНА (документально подтверждено):\nПризван Фрунзенским РВК Узбекской ССР (г. Ташкент) — то есть уходил на фронт уже из Узбекистана, куда семья переехала в 1941 г. Служил в 212-м гвардейском стрелковом полку (75-я гвардейская стрелковая дивизия). Также числился в ЭГ 3292 (эвакогоспиталь — возможно, был ранен) и 215-м армейском запасном стрелковом полку.\n\n🏅 НАГРАД: Две медали «За отвагу» — высшая солдатская медаль.\nПодвиг (орденский лист от 07.03.1945): в феврале 1945 года при расширении плацдарма на правом берегу реки Одер работал ездовым по подвозу боеприпасов под сильным огнём противника. 20 февраля 1945 при доставке патронов в роту столкнулся с группой немцев — лично огнём из винтовки уничтожил двух вражеских солдат и обеспечил бесперебойное снабжение боеприпасами.\n\n👨‍👩‍👧 Первая жена — Татьяна Арсентьевна Садовникова (ум. 1943). Дети от первого брака: Николай, Лидия, Галина. Вторая жена (с 1945) — Мария (дочь Зинаиды Садовниковой, сестры первой жены). Дети от второго брака: Нина, Геннадий.",
      father: null,
      mother: null,
      spouse: "sad-tatyana",
      children: ["ipp-nikolay", "lid-lidia", "ipp-galina", "ipp-nina", "ipp-gennady"]
    },

    "sad-tatyana": {
      firstname: "Татьяна",
      patronymic: "Арсентьевна",
      lastname: "Садовникова",
      gender: "f",
      birth: 1903,
      death: 1943,
      birthplace: null,
      deathplace: "Ташкент, кладбище на ул. Боткина",
      job: null,
      notes: "Первая жена Семёна Ипполитова. По семейному преданию, Семён её «украл» — она пришла к нему с ребёнком Николаем от прежнего брака. Умерла ~1943 в Ташкенте, куда переехала с детьми в 1941 году. Похоронена на кладбище на ул. Боткина.\n\nРодственники: брат — Фёдор Арсентьевич Садовников (жил в Ташкенте, сын Аркадий, жена — «тётя Ксения»). Сестра — Зинаида (1-й муж: Фролов / Степан, 2-й: Целовальников; дети: Анна Фролова-Мазимина, Анастасия Фролова-Зубрилкина, Мария — будущая вторая жена Семёна).",
      father: null,
      mother: null,
      spouse: "ipp-semyon",
      children: ["ipp-nikolay", "lid-lidia", "ipp-galina"]
    },

    "ipp-maria": {
      firstname: "Мария",
      patronymic: null,
      lastname: "Фролова",
      gender: "f",
      birth: null,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Вторая жена Семёна Ипполитова (с 1945 года). Дочь Зинаиды Садовниковой — родной сестры первой жены Семёна, Татьяны. До замужества за Семёном имела двух детей от прежних отношений: Екатерину Ивановну Андрееву (в замужестве Хряпушину) и Владимира Алексеевича Андреева.",
      father: null,
      mother: null,
      spouse: null,
      children: ["ipp-nina", "ipp-gennady"]
    },

    // ══════════════════════════════════════════════
    // ПОКОЛЕНИЕ 1 — ДЕТИ АНТОНОВЫХ
    // ══════════════════════════════════════════════

    "ant-vasily": {
      firstname: "Василий",
      patronymic: "Фёдорович",
      lastname: "Антонов",
      gender: "m",
      birth: 1905,
      death: null,
      birthplace: null,
      deathplace: "Брянск",
      job: null,
      notes: "Старший сын Фёдора и Александры Антоновых. Жил и умер в Брянске — имел большой частный дом. У него было 7 детей: Лариса, Виктор, Владимир, Людмила, Татьяна, Евгений, Наталья.",
      father: "ant-feodor",
      mother: "ant-aleksandra",
      spouse: null,
      children: ["ant-vasily-viktor"]
    },

    "ant-grigory": {
      firstname: "Григорий",
      patronymic: "Фёдорович",
      lastname: "Антонов",
      gender: "m",
      birth: 1917,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Сын Фёдора и Александры Антоновых. Дети: Татьяна, Елена.",
      father: "ant-feodor",
      mother: "ant-aleksandra",
      spouse: null,
      children: []
    },

    "ant-anna": {
      firstname: "Анна",
      patronymic: "Фёдоровна",
      lastname: "Антонова",
      gender: "f",
      birth: 1925,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Тётя Нюся. Муж — Кравец Афанасий. Трое детей: Галина, Лариса, Сергей. Предположительно, одна из дочерей (Галина или Лариса) вышла замуж за Халявина — известного предпринимателя в Медногорске (ООО «ЖЭУ-1», ул. Комсомольская, 38).",
      father: "ant-feodor",
      mother: "ant-aleksandra",
      spouse: "kravec-afanasy",
      children: ["ant-anna-child"]
    },

    "ant-galya": {
      firstname: "Галина",
      patronymic: "Фёдоровна",
      lastname: "Антонова",
      gender: "f",
      birth: 1930,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Тётя Галя (при рождении звали Глафира). Сестра Дмитрия Антонова. В 1950 году уехала в Германию — туда был направлен по службе её муж Пётр Крюков. Впоследствии вернулись в Узбекистан.\n\nДети (Крюковы): Ирина (старшая), Ольга (1956–2019, умерла от рака), Александр (~1958–~2021).",
      father: "ant-feodor",
      mother: "ant-aleksandra",
      spouse: "kryukov-petr",
      children: []
    },

    // ══════════════════════════════════════════════
    // ПОКОЛЕНИЕ 1 — ГЛАВНАЯ ВЕТКА: ДМИТРИЙ + ЛИДИЯ
    // ══════════════════════════════════════════════

    "ant-dmitry": {
      firstname: "Дмитрий",
      patronymic: "Фёдорович",
      lastname: "Антонов",
      gender: "m",
      birth: 1927,
      death: null,
      birthplace: "с. Куропаткино, Кувандыкский р-н, Оренбургская обл.",
      deathplace: null,
      job: "Юнга ВМФ (специальность: рулевой), ветеран ВОВ",
      notes: "Дедушка. Точная дата рождения: 21 сентября 1927 года. Родился в с. Куропаткино Кувандыкского района — это тот же район, что и упоминаемые в семейных преданиях Блява и Медногорск, что подтверждает легенду.\n\n🪖 СЛУЖБА (документально подтверждено):\nПарни 1927 года рождения массово призывались в Соловецкую школу юнг ВМФ (Северный флот). В списках выпускников 2-го набора (1943–1944 гг.) значится Антонов Дмитрий Фёдорович, специальность — рулевой. Возраст полностью совпадает: в момент призыва 15–16 лет.\n\n🏅 НАГРАД: 6 апреля 1985 года награждён Орденом Отечественной войны II степени (юбилейное награждение всех доживших ветеранов к 40-летию Победы) — значит, дожил как минимум до 1985 года.\n\nВ 1954 году переехал в Узбекистан. В 1964 году привёз Лидию на смотрины к родственникам.",
      father: "ant-feodor",
      mother: "ant-aleksandra",
      spouse: "lid-lidia",
      children: ["zaycev-olga", "ant-fedor-jr"]
    },

    "lid-lidia": {
      firstname: "Лидия",
      patronymic: "Семёновна",
      lastname: "Ипполитова",
      gender: "f",
      birth: 1929,
      death: 2008,
      birthplace: "г. Янги-Юль, Ташкентская обл., Узбекистан",
      deathplace: null,
      job: null,
      notes: "Бабушка. Родилась 24 августа 1929 года в Янги-Юле — двойняшка с сестрой Галиной. Дочь Семёна Ефимовича Ипполитова и Татьяны Арсентьевны Садовниковой. Умерла 2 мая 2008 года.",
      father: "ipp-semyon",
      mother: "sad-tatyana",
      spouse: "ant-dmitry",
      children: ["zaycev-olga", "ant-fedor-jr"]
    },

    // ══════════════════════════════════════════════
    // ПОКОЛЕНИЕ 1 — ДЕТИ ИППОЛИТОВЫХ
    // ══════════════════════════════════════════════

    "ipp-nikolay": {
      firstname: "Николай",
      patronymic: null,
      lastname: "Ипполитов",
      gender: "m",
      birth: 1925,
      death: 1943,
      birthplace: null,
      deathplace: "Военное кладбище, ул. Волгоградская, Ташкент (ныне мемориал)",
      job: null,
      notes: "Старший сын — пришёл к Семёну вместе с матерью Татьяной от предыдущих отношений. Семён принял его как родного. Умер в 1943 году — предположительно в одном из ташкентских эвакогоспиталей, которых в военные годы в городе было множество. Похоронен на военном братском кладбище на ул. Волгоградской (ныне мемориальный комплекс «Братские могилы»).",
      father: "ipp-semyon",
      mother: "sad-tatyana",
      spouse: null,
      children: []
    },

    "ipp-galina": {
      firstname: "Галина",
      patronymic: "Семёновна",
      lastname: "Ипполитова",
      gender: "f",
      birth: 1929,
      death: null,
      birthplace: "г. Янги-Юль, Ташкентская обл., Узбекистан",
      deathplace: null,
      job: null,
      notes: "Сестра-двойняшка Лидии Ипполитовой. Родилась 24 августа 1929 года в Янги-Юле. Год смерти семьёй не известен.",
      father: "ipp-semyon",
      mother: "sad-tatyana",
      spouse: null,
      children: []
    },

    "ipp-nina": {
      firstname: "Нина",
      patronymic: "Семёновна",
      lastname: "Ипполитова",
      gender: "f",
      birth: 1946,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Дочь Семёна Ипполитова и его второй жены Марии. Родилась 27 июня 1946 года.",
      father: "ipp-semyon",
      mother: "ipp-maria",
      spouse: null,
      children: []
    },

    "ipp-gennady": {
      firstname: "Геннадий",
      patronymic: "Семёнович",
      lastname: "Ипполитов",
      gender: "m",
      birth: 1949,
      death: 1967,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Сын Семёна Ипполитова и его второй жены Марии. Родился 30 сентября 1949 года. Трагически погиб 17 июля 1967 года в результате бандитских разборок.",
      father: "ipp-semyon",
      mother: "ipp-maria",
      spouse: null,
      children: []
    },

    // ══════════════════════════════════════════════
    // ДЕТИ ВАСИЛИЯ АНТОНОВА
    // ══════════════════════════════════════════════

    "ant-vasily-viktor": {
      firstname: "Виктор",
      patronymic: "Васильевич",
      lastname: "Антонов",
      gender: "m",
      birth: null,
      death: null,
      birthplace: null,
      deathplace: null,
      job: "Военный (ГСВГ), остался жить в Германии",
      notes: "Сын Василия Фёдоровича Антонова из Брянска. Служил в Группе советских войск в Германии (ГСВГ), там познакомился с немкой и остался жить в Германии. Трое детей: Андрей (ровесник Ольги Антоновой, ~1967), Гидо и дочь (предположительно Яна, точно не известно). По гипотезе исследователей, потомков этой ветви можно поискать в немецких соцсетях по запросам «Guido Antonov», «Yana Antonova».",
      father: "ant-vasily",
      mother: null,
      spouse: "ant-vasily-viktors-wife",
      children: ["ant-andrey-de", "ant-guido", "ant-yana-de"]
    },

    "ant-vasily-viktors-wife": {
      firstname: "Имя неизвестно",
      patronymic: null,
      lastname: "(немка)",
      gender: "f",
      birth: null,
      death: null,
      birthplace: "Германия",
      deathplace: null,
      job: null,
      notes: "Немецкая жена Виктора Антонова. Познакомились во время его военной службы в ГДР. Имя не известно.",
      father: null,
      mother: null,
      spouse: "ant-vasily-viktor",
      children: ["ant-andrey-de", "ant-guido", "ant-yana-de"]
    },

    "ant-andrey-de": {
      firstname: "Андрей",
      patronymic: null,
      lastname: "Антонов",
      gender: "m",
      birth: null,
      death: null,
      birthplace: "Германия",
      deathplace: null,
      job: null,
      notes: "Старший сын Виктора Антонова. Живёт в Германии. Примерный ровесник Ольги Антоновой (р. ~1967) или чуть старше.",
      father: "ant-vasily-viktor",
      mother: "ant-vasily-viktors-wife",
      spouse: null,
      children: []
    },

    "ant-guido": {
      firstname: "Гидо",
      patronymic: null,
      lastname: "Антонов",
      gender: "m",
      birth: null,
      death: null,
      birthplace: "Германия",
      deathplace: null,
      job: null,
      notes: "Второй сын Виктора Антонова. Живёт в Германии.",
      father: "ant-vasily-viktor",
      mother: "ant-vasily-viktors-wife",
      spouse: null,
      children: []
    },

    "ant-yana-de": {
      firstname: "Яна (?)",
      patronymic: null,
      lastname: "Антонова",
      gender: "f",
      birth: null,
      death: null,
      birthplace: "Германия",
      deathplace: null,
      job: null,
      notes: "Младшая дочь Виктора Антонова. Живёт в Германии. Имя предположительно Яна — точно не установлено. Имя типично для немецко-русских браков эпохи ГСВГ.",
      father: "ant-vasily-viktor",
      mother: "ant-vasily-viktors-wife",
      spouse: null,
      children: []
    },

    // ══════════════════════════════════════════════
    // ДЕТИ АННЫ АНТОНОВОЙ (Кравец)
    // ══════════════════════════════════════════════

    "kravec-afanasy": {
      firstname: "Афанасий",
      patronymic: null,
      lastname: "Кравец",
      gender: "m",
      birth: null,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Муж Анны Фёдоровны Антоновой (тёти Нюси).",
      father: null,
      mother: null,
      spouse: "ant-anna",
      children: ["ant-anna-child"]
    },

    "ant-anna-child": {
      firstname: "Галина (или Лариса?)",
      patronymic: "Афанасьевна",
      lastname: "Кравец",
      gender: "f",
      birth: null,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Одна из дочерей Анны Антоновой и Афанасия Кравец (известны трое детей: Галина, Лариса, Сергей). Предположительно вышла замуж за Халявина. Точное имя не установлено.",
      father: "kravec-afanasy",
      mother: "ant-anna",
      spouse: "khalyavin",
      children: []
    },

    "khalyavin": {
      firstname: "Халявин",
      patronymic: null,
      lastname: "",
      gender: "m",
      birth: null,
      death: null,
      birthplace: "Медногорск (или Братск)",
      deathplace: null,
      job: "Предприниматель (Медногорск, Оренбургская обл.)",
      notes: "Известный предприниматель. Предположительно связан с семьёй Антоновых через брак с дочерью Анны Антоновой. Документально подтверждён Халявин Валерий Георгиевич — владелец ООО «ЖЭУ-1», Медногорск, ул. Комсомольская, 38.",
      father: null,
      mother: null,
      spouse: "ant-anna-child",
      children: []
    },

    // ══════════════════════════════════════════════
    // МУЖ ГАЛИНЫ АНТОНОВОЙ
    // ══════════════════════════════════════════════

    "kryukov-petr": {
      firstname: "Пётр",
      patronymic: null,
      lastname: "Крюков",
      gender: "m",
      birth: null,
      death: null,
      birthplace: null,
      deathplace: null,
      job: "Военный (ГСВГ, Германия)",
      notes: "Муж Галины Фёдоровны Антоновой (тёти Гали). Служил в Германии (ГСВГ) — там же служил и Виктор Антонов, женившийся на немке.",
      father: null,
      mother: null,
      spouse: "ant-galya",
      children: []
    },

    // ══════════════════════════════════════════════
    // ПОКОЛЕНИЕ 2 — РОДИТЕЛИ
    // ══════════════════════════════════════════════

    "zaycev-andrey": {
      firstname: "Андрей",
      patronymic: null,
      lastname: "Зайцев",
      gender: "m",
      birth: null,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Папа. Ветка Зайцевых будет добавлена позже — данных пока нет.",
      father: null,
      mother: null,
      spouse: "zaycev-olga",
      children: ["vesta", "evgenia", "dmitry-z"],
      _gen: 2
    },

    "zaycev-olga": {
      firstname: "Ольга",
      patronymic: "Дмитриевна",
      lastname: "Антонова",
      gender: "f",
      birth: 1967,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Мама. Девичья фамилия Антонова. Дочь Дмитрия Фёдоровича Антонова и Лидии Семёновны Ипполитовой. После замужества — Зайцева.",
      father: "ant-dmitry",
      mother: "lid-lidia",
      spouse: "zaycev-andrey",
      children: ["vesta", "evgenia", "dmitry-z"]
    },

    "ant-fedor-jr": {
      firstname: "Фёдор",
      patronymic: "Дмитриевич",
      lastname: "Антонов",
      gender: "m",
      birth: 1969,
      death: 2012,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Брат Ольги. Родился 11 февраля 1969 года. Умер 29 октября 2012 года.",
      father: "ant-dmitry",
      mother: "lid-lidia",
      spouse: null,
      children: []
    },

    // ══════════════════════════════════════════════
    // ПОКОЛЕНИЕ 3 — ВЫ (Зайцевы)
    // ══════════════════════════════════════════════

    "vesta": {
      firstname: "Веста",
      patronymic: null,
      lastname: "Зайцева",
      gender: "f",
      birth: null,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "★ Это вы. Дочь Андрея Зайцева и Ольги Антоновой.",
      father: "zaycev-andrey",
      mother: "zaycev-olga",
      spouse: null,
      children: []
    },

    "evgenia": {
      firstname: "Евгения",
      patronymic: null,
      lastname: "Зайцева",
      gender: "f",
      birth: null,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Сестра Весты.",
      father: "zaycev-andrey",
      mother: "zaycev-olga",
      spouse: null,
      children: []
    },

    "dmitry-z": {
      firstname: "Дмитрий",
      patronymic: null,
      lastname: "Зайцев",
      gender: "m",
      birth: null,
      death: null,
      birthplace: null,
      deathplace: null,
      job: null,
      notes: "Брат Весты.",
      father: "zaycev-andrey",
      mother: "zaycev-olga",
      spouse: null,
      children: []
    }

  }
};
