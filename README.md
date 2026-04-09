# rusinovatn-site
math teacher site

<div align="justify">

Планировалось изучить новые доступные и бесплатные возможности разных генераторов статических сайтов, выбрать что-то из шаблонов для обновления "облика" старого сайтика на narod.ru + добавить на сайт новую информацию. 


  
В итоге решили, что проще оставить старый вариант на narod.ru и добавлять на него новую информацию при острой необходимости, а новый вариант сайта разумнее размещать где-то ещё, а не бороться с "нюансами" narod.ru.


Тут пример эксперимента с HUGO + шаблон PaperMod (https://adityatelange.github.io/hugo-PaperMod/).

Шаблон ставился из архива "копи-пастом" ручками.

С чем столкнулись при использовании этого шаблона:

Сайт собирался с ошибкой при `uglyURLs: true` - schema_json.html неправильно генерит html, пропускает запятую между блоками. 

"Некрасивые" урл включались для проверки идеи - уменьшить количество вложенных уровней внутри сайта, т.к. на narod.ru ограничение по глубине: 

>552 Quota on directory nesting level exceeded (4 levels is max): page won't be created.

</div>

В итоге для сборки без ошибки при `uglyURLs: true` решение нашел DeepSeek (но оставили всё же исходный вариант кода для дальнейшей работы с новой версией сайта и использовали `uglyURLs: false`):
  
> <div align="justify">Исправьте генерацию JSON в шаблоне schema_json.html. Чтобы окончательно устранить проблему, замените содержимое файла themes/PaperMod/layouts/partials/templates/schema_json.html на следующий упрощённый вариант (без BreadcrumbList, только базовые типы). Это гарантирует корректный JSON и не нарушит работу сайта.
</div>
  
```
{{- /* Generate schema.org JSON for page */ -}}
{{- $scratch := newScratch }}
{{- if eq .Kind "home" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": {{ .Permalink }},
  "name": {{ site.Title }},
  "author": {
    "@type": "Person",
    "name": {{ .Site.Params.author }}
  },
  "description": {{ .Site.Params.description }}
}
</script>
{{- else if eq .Kind "section" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "headline": {{ .Title }},
  "url": {{ .Permalink }},
  "description": {{ .Description }}
}
</script>
{{- else if eq .Kind "taxonomy" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "headline": {{ .Title }},
  "url": {{ .Permalink }}
}
</script>
{{- else if eq .Kind "term" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "headline": {{ .Title }},
  "url": {{ .Permalink }}
}
</script>
{{- else if .IsPage }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": {{ .Title }},
  "url": {{ .Permalink }},
  "datePublished": {{ .PublishDate }},
  "dateModified": {{ .Lastmod }},
  "author": {
    "@type": "Person",
    "name": {{ .Params.author | default site.Params.author }}
  }
}
</script>
{{- end }}
```

<div align="justify">
  
Но ограничение по глубине все равно остается, т.к. если использовать мультиязычный вариант (даже простое 2-х язычное меню - русский+английский), то ошибка 552 снова возникает, теперь для английской ветки сайта (/public/en/tags/teacher/page/1.html). Даже с `uglyURLs: true` глубина вложенности для страниц пагинации составляет 5 уровней (папки en, tags, teacher, page + файл 1.html), что превышает лимит narod.ru. 
  
Можно было отказаться от доп.языка, но ещё вылезли "особенности": с именами на кириллице (решилось), с...., ну и наконец, с .js - это был уже финальный "звоночек" от narod.ru: 

> Ошибка 553 Prohibited file name

Ошибка возникает из-за того, что Hugo генерирует имена файлов с длинными хешами (например, search.ed0e4d7bdc3........................0fd1f.js), а старый хостинг блокирует такие имена. Можно было  отказаться от search на сайтике..., кому он нужен, этот search))... Но надоело бороться с "нюансами".

  
  Итог от DeepSeek:
  
> Создавайте сайт проекта с любым именем репозитория — это самый простой и гибкий вариант. После загрузки файлов и включения GitHub Pages ваш сайт будет доступен по адресу https://ваш-логин.github.io/имя-репозитория/. Все проблемы с глубиной вложенности, именами файлов и кодировками останутся в прошлом.

  
  Вот и пришёл сюда - проверить на практике.
</div>

<div align="justify">
В теме нет гамбургер-меню, на узком экране смотрится не очень, сделаю пока так:
</div>

в custom.css:

```
* ===== ГАМБУРГЕР-МЕНЮ ДЛЯ PAPERMOD ===== */
/* Для экранов шириной до 748px (z flip 6 внешний экран?) */
/* Базовые стили для гамбургера (скрыт на больших экранах) */
/* Скрываем гамбургер по умолчанию (на десктопе) */
.hamburger {
    display: none;              /* значок скрыт по умолчанию */
    cursor: pointer;            /* курсор мыши превращается в руку (как на ссылке) */
    font-size: 1.5rem;          /* размер шрифта (иконки) установлен в 1.5rem */
    position: absolute;         /* абсолютное позиционирование относительно ближайшего 
                                позиционированного родителя (в нашем случае — .nav, 
                                позволяет точно разместить иконку в правом верхнем углу,
                                не сдвигая остальные элементы) */
    right: 1rem;                /* отступ справа от родительского контейнера */
    top: 0rem;                  /* отступ сверху от родительского контейнера */
    z-index: 100;               /* устанавливает высокий приоритет наложения - 
                                гарантирует, что иконка будет видна поверх других элементов
                                (например, поверх логотипа или меню, если они перекрываются) */
}

/* Мобильные стили */
/* На экранах до 768px (мобильные) */
@media (max-width: 748px) {

    /* Настройка навигации */
    /* Делаем навигацию относительной для позиционирования гамбургера */
    .nav {
        flex-direction: column;
        align-items: stretch;
        position: relative;
        /* width: 100%; 
        padding: 0.5rem 0; */
        padding: 0;
    }

    /* Логотип: центрируем и убираем отступы */
    .logo {
        text-align: center;
        margin: 0;
        padding: 0;
        width: 100%;
        order: 0; 
        border-bottom: 1px solid var(--border); /* опционально, для разделения */
    }

    /* Показываем гамбургер */
    .hamburger {
        display: block;
    }


    /* Меню: по умолчанию скрыто, вертикальное, появляется при клике */
    #menu {
        display: none;
        flex-direction: column;
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
        order: 1;
        text-align: center;
        background: var(--theme); /* чтобы фон совпадал с темой */
        border-top: 1px solid var(--border);
    }

    /* Когда меню активно — показываем */
    /* Показываем меню, если есть класс .show */
    #menu.show {
        display: flex;
    }

    /* Пункты меню */
    /* Каждый пункт меню — на всю ширину */
    #menu li {
        margin: 0 !important;
        padding: 0 !important;
        width: 100%;
        border-top: 1px solid var(--border); /* опционально: разделитель */
    }

    /* Ссылки внутри пунктов */
    #menu li a {
        display: block;
        padding: 0rem 1rem !important; 
        text-align: center; /* left; */
        width: 100%;
        box-sizing: border-box;
        /* background: var(--entry); */
        /* color: var(--primary); */
        /* text-decoration: none; */
    }

    /* Убираем левый отступ у первого пункта (если есть) */
  /*   #menu li:first-child a {
        padding-left: 1rem !important;
        margin-left: 0 !important;
    }
 */
    /* При необходимости скрываем переключатель темы и языков на мобильных (по желанию) */
/*     .logo-switches {
        display: none;
    }
 */  
    /* Переключатель темы и языков — прячем внутрь меню или адаптируем */
    .logo-switches {
        display: flex;
        justify-content: center;
        margin-top: 0rem; /* оставим на одном уровне  */
    }
}
```

  
в extend_footer.html:

```
<!-- Для доп. меню нужно создать гамбургер-иконку, которая будет показывать/скрывать меню на мобильных -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Создаём элемент гамбургера, если его ещё нет
    if (!document.querySelector('.hamburger')) {
        const hamburger = document.createElement('div');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '☰';
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.appendChild(hamburger);
        }
    }

    // Добавляем обработчик клика на гамбургер
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('#menu');
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            menu.classList.toggle('show');
        });
    }
});
</script>
```
Ещё раз поправил гамбургер-меню, добавил доп.условия при изменении ширины.
<br>
Пока custom.css выглядит так (доб. переопределение увеличение ширины до 2560):
```
/* assets/css/extended/custom.css */
/* Переопределяем глобальную переменную максимальной ширины контента */
:root {
    --main-width: 90vw;
}

/* Дополнительно, если вы хотите задать абсолютный лимит, чтобы контент не растягивался бесконечно */
@media (min-width: 2560px) {
    :root {
        --main-width: 2560px;
    }
}

.post-content p {
    text-align: justify;
}
 
/* Не выравниваем параграфы, которые содержат только формулы или специальные блоки */
.math, .katex-display {
    text-align: left !important;
}

/* Цвет обычной ссылки */
.post-content a {
    color: #0066cc;  /* ярко-синий */
    /* text-decoration: underline; /* подчёркивание (по желанию) */
}

/* Цвет ссылки при наведении мыши */
.post-content a:hover {
    color: #004499;  /* более тёмный синий */
    /* text-decoration: underline; /* можно оставить или убрать */
 /* Если хочешь сделать ссылки не только синими, 
 а, например, зелёными или красными, то просто подставь нужный цвет в формате HEX,
 например, #2e7d32 для зелёного, #b71c1c для красного.
 Подобрать красивый оттенок можно на htmlcolorcodes.com. */

}

/* Стили для миниатюр грамот в таблицах */
.post-content table img {
    max-width: 100px;        /* ограничим ширину */
    height: auto;            /* сохраним пропорции */
    border: 1px solid #ddd;  /* светлая рамка */
    border-radius: 4px;      /* скругление углов */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* лёгкая тень */
    transition: transform 0.2s; /* плавное увеличение при наведении */
}

.post-content table img:hover {
    transform: scale(1.05);   /* чуть увеличивается при наведении */
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* Эпиграф */
.shortcode-epigraph {
    font-style: italic;
    text-align: right;
    border-left: none !important; /* убираем стандартную линию */
    margin: 2rem 0;
    padding: 0 1rem;
    color: #555;
}
.shortcode-epigraph p {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}
.shortcode-epigraph footer {
    font-size: 0.9rem;
    font-weight: normal;
    color: #777;
}

/* Центрирование */
.shortcode-center {
    text-align: center;
    margin: 1rem 0;
}
.shortcode-center img {
    display: inline-block; /* чтобы картинки центрировались */
}

/* ===== ГАМБУРГЕР-МЕНЮ ===== */
/* Для экранов шириной до 748px (z flip 6 внешний экран?) */
/* Базовые стили для гамбургера (скрыт на больших экранах) */
/* Скрываем гамбургер по умолчанию */
.hamburger {
    display: none;              /* значок скрыт по умолчанию */
    cursor: pointer;            /* курсор мыши превращается в руку (как на ссылке) */
    font-size: 1.5rem;          /* размер шрифта (иконки) установлен в 1.5rem */
    position: absolute;         /* абсолютное позиционирование относительно ближайшего 
                                позиционированного родителя (в нашем случае — .nav, 
                                позволяет точно разместить иконку в правом верхнем углу,
                                не сдвигая остальные элементы) */
    right: 1rem;                /* отступ справа от родительского контейнера */
    top: 0rem;                  /* отступ сверху от родительского контейнера */
    z-index: 100;               /* устанавливает высокий приоритет наложения - 
                                гарантирует, что иконка будет видна поверх других элементов
                                (например, поверх логотипа или меню, если они перекрываются) */
}

/* Мобильные стили */
/* На экранах до 768px (мобильные) */
@media (max-width: 768px) {

    /* Настройка навигации */
    /* Делаем навигацию относительной для позиционирования гамбургера */
    .nav {
        flex-direction: column;
        align-items: stretch;
        position: relative;
        /* width: 100%; 
        padding: 0.5rem 0; */
        padding: 0;
    }

    /* Логотип: центрируем и убираем отступы */
    .logo {
        text-align: center;
        margin: 0;
        padding: 0;
        width: 100%;
        order: 0; 
        border-bottom: 1px solid var(--border); /* опционально, для разделения */
    }

    /* Показываем гамбургер */
    .hamburger {
        display: block;
    }


    /* Меню: по умолчанию скрыто, вертикальное, появляется при клике */
    #menu {
        display: none;
        flex-direction: column;
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
        order: 1;
        text-align: center;
        background: var(--theme); /* чтобы фон совпадал с темой */
        border-top: 1px solid var(--border);
    }

    /* Когда меню активно — показываем */
    /* Показываем меню, если есть класс .show */
    #menu.show {
        display: flex;
    }

    /* Пункты меню */
    /* Каждый пункт меню — на всю ширину */
    #menu li {
        margin: 0 !important;
        padding: 0 !important;
        width: 100%;
        border-top: 1px solid var(--border); /* опционально: разделитель */
    }

    /* Ссылки внутри пунктов */
    #menu li a {
        display: block;
        padding: 0rem 1rem !important; 
        text-align: center; /* left; */
        width: 100%;
        box-sizing: border-box;
        /* background: var(--entry); */
        /* color: var(--primary); */
        /* text-decoration: none; */
    }

    /* Убираем левый отступ у первого пункта (если есть) */
  /*   #menu li:first-child a {
        padding-left: 1rem !important;
        margin-left: 0 !important;
    }
 */
    /* При необходимости скрываем переключатель темы и языков на мобильных (по желанию) */
/*     .logo-switches {
        display: none;
    }
 */  
    /* Переключатель темы и языков — прячем внутрь меню или адаптируем */
    .logo-switches {
        display: flex;
        justify-content: center;
        margin-top: 0rem; /* оставим на одном уровне  */
    }
}

/* Для экранов уже 435px (очень узкие мобильные устройства) */
/* Для экранов уже 480px (очень узкие мобильные) */
@media (max-width: 435px) {
    /* Меняем поведение контейнера навигации */
    .nav {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    /* Убираем абсолютное позиционирование у гамбургера */
    .hamburger {
        position: relative;
        display: block;
        margin: 0 auto;
        /* text-align: right; */
        /* margin-top: 0.5rem; /* верхний отступ */
        order: 3; /* помещаем в конец */
        /* чтобы иконка визуально отделялась, добавим верхний отступ и/или рамку */
        /* margin-top: 0.5rem; */
        /* padding-top: 0.5rem; */
        /* border-top: 1px solid var(--border); */
        /* top: 1.50rem; */
        right: 1.50rem;
        /* display: flex; */
        /* justify-content: right; */
        /* width: 100%; */
    }

    /* Логотип идёт первым */
    .logo {
        order: 1;
        width: 100%;
        text-align: center;
    }

    /* Блок переключателей — вторым */
    .logo-switches {
        order: 2;
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 0.5rem;
        border-top: 1px solid var(--border);
        padding-top: 0.5rem;
    }

    /* Меню (список) — четвёртым */
    #menu {
        order: 4;
    }
}
```

