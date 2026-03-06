# rusinovatn-site
math teacher site
HUGO + шаблон PaperMod (https://adityatelange.github.io/hugo-PaperMod/).
Шаблон копи-паст ручками на комп.
Планировалось обновить облик и добавить новую информацию на старом сайтике на narod.ru. В итоге решили, что проще оставить старый вариант на narod.ru и добавлять новую информацию при острой необходимости, а новый вариант сайта разумнее размещать где-то ещё, а не бороться с "нюансами" narod.ru. 
С чем столкнулся при использовании этого шаблона:
  Собирался с ошибкой при uglyURLs: true - schema_json.html неправильно генерит html,пропускает запятую между блоками. "Некрасивые" урл ставил для хотел уменьшить количество вложенных уровней, т.к. на narod.ru ограничение по глубине: "552 Quota on directory nesting level exceeded (4 levels is max): page won't be created". В итоге для сборки без ошибки нашел решение DeepSeek: "Исправьте генерацию JSON в шаблоне schema_json.html. Чтобы окончательно устранить проблему, замените содержимое файла themes/PaperMod/layouts/partials/templates/schema_json.html на следующий упрощённый вариант (без BreadcrumbList, только базовые типы). Это гарантирует корректный JSON и не нарушит работу сайта.":
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

  Но ограничения по глубине все равно остается, т.к. если использовать мультиязычный вариант (даже простое 2-я язычное меню - русский+английский), то ошибка 552 снова возникает, теперь для английской ветки сайта (/public/en/tags/teacher/page/1.html). Даже с uglyURLs: true глубина вложенности для страниц пагинации составляет 5 уровней (папки en, tags, teacher, page + файл 1.html), что превышает лимит narod.ru. 
  Можно было отказаться от доп.языка, но ещё вылезли "особенности": с именами на кириллице (решилось ), с...., ну и наконец, с .js - это был уже финальный "звоночек" от narod.ru: "Ошибка 553 Prohibited file name", возникает из-за того, что Hugo генерирует имена файлов с длинными хешами (например, search.ed0e4d7bdc3........................0fd1f.js), а старый хостинг блокирует такие имена. Можно было  отказаться от search на сайтике..., кому он нужен, этот search))... Но надоело бороться с "нюансами".
  Итог от DeepSeek: "Создавайте сайт проекта с любым именем репозитория — это самый простой и гибкий вариант. После загрузки файлов и включения GitHub Pages ваш сайт будет доступен по адресу https://ваш-логин.github.io/имя-репозитория/. Все проблемы с глубиной вложенности, именами файлов и кодировками останутся в прошлом."
  Вот и пришёл сюда - проверить на практике.


  
