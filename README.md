<div align="center">

  # WFRP4e - Print sheet

  <p>
    <a href="https://foundryvtt.com/packages/wfrp4e-print-sheet" rel="nofollow"><img src="https://img.shields.io/badge/WFRP4e%20--%20Print%20sheet-FoundryVTT-orange?labelColor=darkred" alt="FoundryVTT"></a>
    <a href="https://foundryvtt.com/" rel="nofollow"><img src="https://img.shields.io/badge/V13-Совместимо-darkgreen?labelColor=orange" alt="Совместимость"></a>
    <a href="https://github.com/nPocToI4eJI/wfrp4e-print-sheet/releases" rel="nofollow"><img src="https://img.shields.io/github/v/release/nPocToI4eJI/wfrp4e-print-sheet?display_name=release&label=%D0%92%D0%B5%D1%80%D1%81%D0%B8%D1%8F&labelColor=darkgreen" alt="Последняя версия"></a>
    <a href="https://github.com/nPocToI4eJI/wfrp4e-print-sheet/releases/latest" rel="nofollow"><img src="https://img.shields.io/github/downloads/nPocToI4eJI/wfrp4e-print-sheet/latest/wfrp4e-print-sheet.zip?displayAssetName=false&label=%D0%A1%D0%BA%D0%B0%D1%87%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9&labelColor=blue&color=darkgreen" alt="Скачивания"></a>
    <a href="https://github.com/nPocToI4eJI/wfrp4e-print-sheet/releases" rel="nofollow"><img src="https://img.shields.io/github/downloads/nPocToI4eJI/wfrp4e-print-sheet/wfrp4e-print-sheet.zip?displayAssetName=false&label=%D0%92%D1%81%D0%B5%D0%B3%D0%BE&labelColor=darkgreen&color=darkred" alt="Скачиваний всего"></a>
  </p>

  <p>
    <a href="https://discord.gg/tPrYvW7" rel="nofollow"><img src="https://img.shields.io/badge/Discord-black?logo=discord&logoColor=%235865F2" alt="Discord"></a>
    <a href="https://www.youtube.com/@nPocTo_4eJI" rel="nofollow"><img src="https://img.shields.io/badge/Youtube-black?logo=youtube&logoColor=%23FF0000" alt="Youtube"></a>
    <a href="https://boosty.to/npocto_4eji" rel="nofollow"><img src="https://img.shields.io/badge/Boosty-black?logo=boosty&logoColor=%23F15F2C" alt="Boosty"></a>
  </p>

  **[🇷🇺 Русский](#-русский) | [🇬🇧 English](#-english)**

</div>

---

<a id="-русский"></a>

**WFRP4e - Print sheet** - модуль для экспорта листов персонажей и НИП из **Warhammer Fantasy Roleplay 4th Edition** в автономные редактируемые HTML-файлы. Поддерживает два формата на выбор: классическую многостраничную вёрстку под печать на листах **A4** и современный **интерактивный лист для браузера** с вкладками, живым поиском и автоматическим пересчётом характеристик, навыков и нагрузки.

### 📋 Содержание
- [Экспорт и Чистый лист](#ru-export)
- [Шаблон «Для печати (A4)»](#ru-print-template)
- [Шаблон «Для браузера (Интерактивный)»](#ru-browser-template)
- [Настройки модуля](#ru-settings)
- [Связанные модули](#ru-modules)

---

<a id="ru-export"></a>
### 📤 Экспорт и Чистый лист

В заголовке листа любого персонажа или НИП появляется кнопка **«Печать листа»**, открывающая окно настройки экспорта.

* **Выбор формата перед экспортом:** переключайтесь между печатным листом **A4** и **интерактивным листом для браузера** прямо в окне экспорта (последний выбор запоминается).
* **Гибкий состав разделов:** можно сразу задать имя файла, включить встраивание изображений в HTML и настроить отображение разделов *«Магия и Религия»*, *«Журнал опыта»* и *«Грех»*.
* **Пустой лист персонажа:** в настройках модуля доступна кнопка **«Получить пустой лист»**, создающая чистый бланк с готовыми строками для заполнения от руки или в браузере.

<details align="center">
<summary>📷 Скриншоты</summary>

![Окно экспорта листа персонажа](https://github.com/user-attachments/assets/b5195afe-3adb-4e77-a56c-4b4592e53664)

</details>

---

<a id="ru-print-template"></a>
### 🖨️ Шаблон «Для печати (A4)»

Классический лист персонажа, свёрстанный точно под формат **A4** (`210 × 297 мм`) в относительных и печатных единицах.

* **Автоматическая разбивка на страницы A4:** при большом количестве талантов, черт, оружия, снаряжения, заклинаний или записей в журнале опыта разделы автоматически переносятся на дополнительные страницы с повторением заголовков таблиц и сохранением декоративной рамки - ни одна строка не обрезается.
* **Продуманная компоновка:** на первой странице размещены данные персонажа, характеристики, ресурсы, навыки, компактные амбиции и биография; далее следуют таланты и черты (в 2 колонки), броня и портрет, психика, мутации, раны, деньги, вес, оружие, снаряжение, магия и журнал опыта.
* **Панель подготовки к печати:** верхняя панель (автоматически скрывается при выводе на печать) позволяет сразу отправить лист на принтер, изменить масштаб шрифта (`A-` / `A+`), скрыть или показать отдельные разделы и иконки, включить всплывающие подсказки у курсора, добавить или удалить строки, а также сохранить отредактированный HTML-файл.

<details align="center">
<summary>📷 Скриншоты</summary>
  
[Пример печатного шаблона](https://htmlpreview.github.io/?https://github.com/nPocToI4eJI/wfrp4e-print-sheet/blob/main/ExamplePrintTemplate.html)

![Пример печатного шаблона. Лист 1](https://github.com/user-attachments/assets/b20bc4b7-4f1b-4910-b67d-f3c9fb5b09a4)

![Пример печатного шаблона. Лист 2](https://github.com/user-attachments/assets/4bedcbec-6783-478f-85c2-98f4743ddb38)

![Пример печатного шаблона. Лист 3](https://github.com/user-attachments/assets/962b48ff-5302-439e-93d4-05b69ef2eb18)

</details>

---

<a id="ru-browser-template"></a>
### 🌐 Шаблон «Для браузера (Интерактивный)»

Адаптивный электронный лист для комфортной игры с компьютера или планшета в любом браузере без подключения к Foundry VTT.

* **Закреплённая навигация и живой поиск:** переключайтесь между вкладками (*Всё сразу*, *Основное и Навыки*, *Таланты и Черты*, *Бой и Снаряжение*, *Магия и Заметки*) или ищите по всему листу - при поиске пустые блоки автоматически скрываются, оставляя только шапку и найденные совпадения.
* **Удобное управление ресурсами:** быстрые кнопки `-` / `+` для Ран, Судьбы, Удачи, Упорства, Решимости, Греха и Монет.
* **Автоматический пересчёт:**
  * Правка характеристик (*Начальная*, *Развитие*, *Мод.* или *Текущий*) мгновенно пересчитывает Рейтинг Характеристики и итоговые значения всех связанных навыков.
  * Изменение веса оружия, брони, снаряжения или количества монет автоматически обновляет нагрузку по категориям и общий вес.
  * Добавление и удаление строк сразу обновляет счётчики в заголовках разделов.
* **Раскрывающиеся описания и подсказки:** кнопка `ℹ` у каждой строки раскрывает полное описание, достоинства и изъяны прямо под ней, а всплывающие подсказки при наведении отображаются рядом с курсором и не выходят за края экрана.
* **Сохранение прогресса:** все внесённые во время игры изменения можно в любой момент сохранить в новый автономный HTML-файл.

<details align="center">
<summary>📷 Скриншоты</summary>
  
[Пример интерактивного шаблона](https://htmlpreview.github.io/?https://github.com/nPocToI4eJI/wfrp4e-print-sheet/blob/main/ExampleBrowserTemplate.html)

![Пример интерактивного шаблона. Лист 1](https://github.com/user-attachments/assets/2d3de674-105d-4687-959c-cd7067558b2f)

![Пример интерактивного шаблона. Лист 2](https://github.com/user-attachments/assets/a8cd81f2-2c25-4dcc-9301-266d20661c8f)

![Пример интерактивного шаблона. Лист 3](https://github.com/user-attachments/assets/64044286-6c74-414a-8a8a-61696dbe4687)

![Пример интерактивного шаблона. Лист 4](https://github.com/user-attachments/assets/7ded982d-34f3-4895-8c48-0bfa517ce106)

</details>

---

<a id="ru-settings"></a>
### ⚙️ Настройки модуля

* **Получить пустой лист** - открывает окно экспорта чистого листа персонажа в выбранном формате.
* **Шаблон по умолчанию** - выбор формата, который будет выбран автоматически в окне экспорта (*Для печати (A4)* или *Для браузера (Интерактивный)*).
* **Цвет вводимого текста** - настройка цвета заполняемых значений на листе персонажа.
* **Встраивать изображения** - кодирование портрета и иконок предметов внутрь HTML-файла.
* **Имя файла по умолчанию** - шаблон названия сохраняемого HTML-файла.
* **Режим отладки** - модуль полностью автономен, но при наличии включённого `WFRP4e - Tools` автоматически использует его статус режима отладки.

---

<a id="ru-modules"></a>
### 🧩 Связанные модули

* **[WFRP4e - Tools](https://github.com/nPocToI4eJI/wfrp4e-tools)** - базовый модуль инструментов, улучшений и исправлений для системы **Warhammer Fantasy Roleplay 4th Edition** в Foundry VTT.
* **[WFRP4e - Assistant](https://github.com/nPocToI4eJI/wfrp4e-assistant)** - этот модуль позволит Мастеру разнообразить НИП и их отыгрыш с помощью встроенных инструментов автоматизации.
* **[WFRP4e - Looting](https://github.com/nPocToI4eJI/wfrp4e-looting)** - модуль для генерации добычи, быстрого обыска поверженных врагов и создания уникальных предметов.
* **[WFRP4e - Sounds](https://github.com/nPocToI4eJI/wfrp4e-sounds)** - этот модуль содержит звуковые файлы, адаптированные для звуковой системы `WFRP4e - Tools`.

---

<a id="-english"></a>

**WFRP4e - Print sheet** is a module for exporting character and NPC sheets from **Warhammer Fantasy Roleplay 4th Edition** into standalone, editable HTML files. It supports two export formats to choose from: a classic multi-page layout tailored for printing on **A4** paper, and a modern **interactive browser sheet** with tabs, live search, and automatic recalculation of characteristics, skills, and encumbrance.

### 📋 Contents
- [Export & Blank Sheet](#en-export)
- ["For Printing (A4)" Template](#en-print-template)
- ["For Browser (Interactive)" Template](#en-browser-template)
- [Module Settings](#en-settings)
- [Related Modules](#en-modules)

---

<a id="en-export"></a>
### 📤 Export & Blank Sheet

A **Print Sheet** button is added to the sheet header of any character or NPC, opening the export configuration dialog.

* **Format Selection on Export:** switch between the **A4 print layout** and the **interactive browser sheet** right in the export dialog (your last choice is remembered).
* **Flexible Sections:** set the file name on the fly, toggle embedding images directly into the HTML file, and choose whether to include the *Magic & Religion*, *Experience Log*, and *Sin* sections.
* **Blank Character Sheet:** a **Get Blank Sheet** button in the module settings generates a clean form with ready-made rows for filling out by hand or in a browser.

<details align="center">
<summary>📷 Screenshots</summary>

![Character Sheet Export Dialog](https://github.com/user-attachments/assets/b5195afe-3adb-4e77-a56c-4b4592e53664)

</details>

---

<a id="en-print-template"></a>
### 🖨️ "For Printing (A4)" Template

A classic character sheet designed precisely for **A4** paper (`210 × 297 mm`) using relative and print-accurate units.

* **Automatic A4 Pagination:** when a character has many talents, traits, weapons, trappings, spells, or experience log entries, sections automatically flow onto additional pages with repeated table headers and preserved decorative page frames - no row is ever cut off.
* **Balanced Layout:** the first page holds character details, characteristics, resources, skills, compact ambitions, and biography; followed by talents and traits (2 columns), armour and portrait, psychology, mutations, wounds, coins, encumbrance, weapons, trappings, magic, and the experience log.
* **Print Preparation Toolbar:** a top bar (automatically hidden when printing) lets you send the sheet directly to the printer, adjust the font scale (`A-` / `A+`), toggle sections and icons, enable cursor-anchored tooltips, add or remove rows, and save the edited HTML file.

<details align="center">
<summary>📷 Screenshots</summary>

[Live Print Template Example](https://htmlpreview.github.io/?https://github.com/nPocToI4eJI/wfrp4e-print-sheet/blob/main/ExamplePrintTemplate.html)

![Print Template Example. Page 1](https://github.com/user-attachments/assets/b20bc4b7-4f1b-4910-b67d-f3c9fb5b09a4)

![Print Template Example. Page 2](https://github.com/user-attachments/assets/4bedcbec-6783-478f-85c2-98f4743ddb38)

![Print Template Example. Page 3](https://github.com/user-attachments/assets/962b48ff-5302-439e-93d4-05b69ef2eb18)

</details>

---

<a id="en-browser-template"></a>
### 🌐 "For Browser (Interactive)" Template

A responsive digital character sheet for comfortable play on a desktop or tablet in any browser without needing a connection to Foundry VTT.

* **Sticky Navigation & Live Search:** switch between tabs (*All*, *Main & Skills*, *Talents & Traits*, *Combat & Trappings*, *Magic & Notes*) or search across the entire sheet - empty blocks automatically hide during search, leaving only the header and matching entries.
* **Quick Resource Controls:** convenient `-` / `+` buttons for Wounds, Fate, Fortune, Resilience, Resolve, Sin, and Coins.
* **Automatic Recalculation:**
  * Editing characteristics (*Initial*, *Advances*, *Mod.*, or *Current*) immediately updates the Characteristic Bonus and the totals of all linked skills.
  * Changing the encumbrance of weapons, armour, trappings, or the number of coins automatically recalculates category subtotals and total encumbrance.
  * Adding or removing rows immediately updates the counters in section headers.
* **Expandable Descriptions & Tooltips:** an `ℹ` button on every row expands full descriptions, qualities, and flaws inline, while hover tooltips appear right next to the cursor and stay within the viewport.
* **Save Your Progress:** save any changes made during a session into a new standalone HTML file at any time.

<details align="center">
<summary>📷 Screenshots</summary>

[Live Interactive Template Example](https://htmlpreview.github.io/?https://github.com/nPocToI4eJI/wfrp4e-print-sheet/blob/main/ExampleBrowserTemplate.html)

![Interactive Template Example. View 1](https://github.com/user-attachments/assets/2d3de674-105d-4687-959c-cd7067558b2f)

![Interactive Template Example. View 2](https://github.com/user-attachments/assets/a8cd81f2-2c25-4dcc-9301-266d20661c8f)

![Interactive Template Example. View 3](https://github.com/user-attachments/assets/64044286-6c74-414a-8a8a-61696dbe4687)

![Interactive Template Example. View 4](https://github.com/user-attachments/assets/7ded982d-34f3-4895-8c48-0bfa517ce106)

</details>

---

<a id="en-settings"></a>
### ⚙️ Module Settings

* **Get Blank Sheet** - opens the export dialog for a blank character sheet in the selected format.
* **Default Template** - selects which format is pre-selected in the export dialog (*For Printing (A4)* or *For Browser (Interactive)*).
* **Input Text Color** - customizes the text color of editable values on the character sheet.
* **Embed Images** - encodes the character portrait and item icons directly inside the HTML file.
* **Default File Name** - naming template for the exported HTML file.
* **Debug Mode** - the module is completely standalone, and automatically uses the debug mode status from `WFRP4e - Tools` if it is installed and enabled.

---

<a id="en-modules"></a>
### 🧩 Related Modules

* **[WFRP4e - Tools](https://github.com/nPocToI4eJI/wfrp4e-tools)** - core toolkit, quality-of-life, and bugfix module for **Warhammer Fantasy Roleplay 4th Edition** on Foundry VTT.
* **[WFRP4e - Assistant](https://github.com/nPocToI4eJI/wfrp4e-assistant)** - allows the GM to diversify NPCs and their roleplay using built-in automation tools.
* **[WFRP4e - Looting](https://github.com/nPocToI4eJI/wfrp4e-looting)** - loot generation, quick corpse-looting, and unique item creation module.
* **[WFRP4e - Sounds](https://github.com/nPocToI4eJI/wfrp4e-sounds)** - contains sound files tailored for the `WFRP4e - Tools` audio system.
