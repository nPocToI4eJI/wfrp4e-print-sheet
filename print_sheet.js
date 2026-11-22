let debugMessage = ["%cWFRP4e - Print sheet %c[debug]%c.", "font-weight: bold;", "color: orange;", ""];
//Проверка статуса режима отладки в модуле WFRP4e - Tools (если он установлен и активен)
function isDebug() {
	return Boolean(game.modules.get("wfrp4e-tools")?.active && game.settings.settings.has("wfrp4e-tools.debug") && game.settings.get("wfrp4e-tools", "debug"));
};
//Экранирование спецсимволов для безопасной подстановки строк в HTML-атрибуты
function escapeAttr(str) {
	return String(str ?? "")
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
};
//Пункт меню настроек для получения пустого листа персонажа
class PrintEmptySheetMenu extends ApplicationV2 {
	async render() {
		await PrintSheet.openDialog(null);
		return this;
	};
};
//Основной класс диалога и экспорта листа персонажа в HTML
class PrintSheet {
	//Экспорт пустого листа персонажа
	static async printEmptySheet() {
		return PrintSheet.openDialog(null);
	};
	//Открытие диалогового окна выбора параметров экспорта
	static async openDialog(actor = null) {
		let debug = isDebug();
		if (debug) {
			console.debug(...debugMessage, "PrintSheet openDialog \"actor\"");
			console.debug(actor);
		};
		let isBlank = !actor;
		let defaultTemplate = game.settings.get("wfrp4e-print-sheet", "defaultTemplate") || "print";
		let defaultEmbed = game.settings.get("wfrp4e-print-sheet", "embedimages");
		let rawConfigured = String(game.settings.get("wfrp4e-print-sheet", "defaultName") || "");
		let configuredName = rawConfigured.replace(/[\/|\\:*?"<>]/g, "").trim();
		let suggestedName = configuredName || (actor?.name || game.i18n.localize("WFRP4E.PrintSheet.Blank"));
		//Определение начального состояния чекбоксов на основе данных актёра
		let itemsByType = actor?.itemTypes || actor?._itemTypes || {};
		let details = actor?.system?.details || actor?.details || {};
		let status = actor?.system?.status || actor?.status || {};
		let hasMagic = isBlank || Boolean((itemsByType.spell?.length || 0) + (itemsByType.prayer?.length || 0));
		let hasExpLog = isBlank || Boolean((details.experience?.log || []).length);
		let hasSin = isBlank || Boolean(details.god?.value) || Number(status.sin?.value) > 0;
		//Функция перевода ключей
		let t = (k) => game.i18n.localize(`WFRP4E.PrintSheet.Dialog.${k}`);
		//Разметка окна настроек экспорта
		let content = `
		<div style="display: flex; flex-direction: column; gap: 0.65rem; width: 100%; box-sizing: border-box;">
			<div style="display: flex; flex-direction: column; gap: 0.35rem;">
				<label style="font-weight: bold;">${t("Template.Label")}</label>
				<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem;">
					<label style="display: flex; flex-direction: column; gap: 0.25rem; padding: 0.55rem; border: 1px solid var(--color-border-light-tertiary, #888); border-radius: 0.35rem; cursor: pointer; min-width: 0; overflow-wrap: break-word;" data-tooltip="${escapeAttr(t("Template.PrintHint"))}">
						<span style="display: flex; align-items: center; gap: 0.35rem; font-weight: bold;">
							<input type="radio" name="template" value="print"${defaultTemplate === "print" ? " checked" : ""} style="flex: 0 0 auto;">
							<i class="fas fa-print"></i> <span>${t("Template.Print")}</span>
						</span>
						<small style="opacity: 0.85; line-height: 1.25;">${t("Template.PrintHint")}</small>
					</label>
					<label style="display: flex; flex-direction: column; gap: 0.25rem; padding: 0.55rem; border: 1px solid var(--color-border-light-tertiary, #888); border-radius: 0.35rem; cursor: pointer; min-width: 0; overflow-wrap: break-word;" data-tooltip="${escapeAttr(t("Template.BrowserHint"))}">
						<span style="display: flex; align-items: center; gap: 0.35rem; font-weight: bold;">
							<input type="radio" name="template" value="browser"${defaultTemplate === "browser" ? " checked" : ""} style="flex: 0 0 auto;">
							<i class="fas fa-globe"></i> <span>${t("Template.Browser")}</span>
						</span>
						<small style="opacity: 0.85; line-height: 1.25;">${t("Template.BrowserHint")}</small>
					</label>
				</div>
			</div>
			<div style="display: flex; flex-direction: column; gap: 0.2rem;">
				<label for="ps-filename" style="font-weight: bold;">${t("FileName")}</label>
				<input id="ps-filename" name="filename" type="text" value="${escapeAttr(suggestedName)}" style="width: 100%; box-sizing: border-box; text-align: center;">
			</div>
			<div style="display: flex; flex-direction: column; gap: 0.25rem; padding: 0.5rem; border: 1px dashed var(--color-border-light-tertiary, #888); border-radius: 0.35rem; box-sizing: border-box;">
				<label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
					<input type="checkbox" name="embedImages"${defaultEmbed ? " checked" : ""}>
					<span>${t("EmbedImages")}</span>
				</label>
				<label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
					<input type="checkbox" name="includeMagic"${hasMagic ? " checked" : ""}>
					<span>${t("IncludeMagic")}</span>
				</label>
				<label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
					<input type="checkbox" name="includeSin"${hasSin ? " checked" : ""}>
					<span>${t("IncludeSin")}</span>
				</label>
				<label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
					<input type="checkbox" name="includeExperience"${hasExpLog ? " checked" : ""}>
					<span>${t("IncludeExperience")}</span>
				</label>
			</div>
		</div>`;
		let result = await foundry.applications.api.DialogV2.prompt({
			window: {
				icon: "fas fa-print",
				title: `${t("Title")}${actor ? ` — ${actor.name}` : ""}`
			},
			position: {
				width: Math.min(540, Math.floor(window.innerWidth * 0.92))
			},
			content,
			ok: {
				icon: "fas fa-file-export",
				label: t("Export"),
				callback: (event, button) => {
					let form = button.form;
					return {
						template: form.elements.template?.value || "print",
						filename: form.elements.filename?.value?.trim() || suggestedName,
						embedImages: Boolean(form.elements.embedImages?.checked),
						includeMagic: Boolean(form.elements.includeMagic?.checked),
						includeSin: Boolean(form.elements.includeSin?.checked),
						includeExperience: Boolean(form.elements.includeExperience?.checked)
					};
				}
			}
		});
		if (debug) {
			console.debug(...debugMessage, "PrintSheet openDialog \"result\"");
			console.debug(result);
		};
		if (!result) {return};
		//Сохранение последнего выбранного шаблона в клиентские настройки
		if (result.template !== defaultTemplate) {
			await game.settings.set("wfrp4e-print-sheet", "defaultTemplate", result.template);
		};
		await PrintSheet.exportSheet(actor, result);
	};
	//Сборка данных, рендер выбранного шаблона и сохранение итогового HTML-файла
	static async exportSheet(actor = null, options = {}) {
		let debug = isDebug();
		let mode = options.template === "browser" ? "browser" : "print";
		let embedImages = options.embedImages ?? game.settings.get("wfrp4e-print-sheet", "embedimages");
		let templatePath = mode === "browser"
			? "modules/wfrp4e-print-sheet/templates/browserTemplate.hbs"
			: "modules/wfrp4e-print-sheet/templates/printTemplate.hbs";
		if (debug) {
			console.debug(...debugMessage, "PrintSheet exportSheet \"options\"");
			console.debug({mode, embedImages, templatePath, options});
		};
		let data = await DataMapper.actorData(actor, {
			mode,
			embedImages,
			includeMagic: options.includeMagic,
			includeSin: options.includeSin,
			includeExperience: options.includeExperience
		});
		let html = await PrintSheet.constructHTML(data, templatePath);
		if (!html) {return};
		//Подготовка безопасного имени выходного файла
		let fallbackName = data.name || game.i18n.localize("WFRP4E.PrintSheet.Blank");
		let rawName = String(options.filename || game.settings.get("wfrp4e-print-sheet", "defaultName") || fallbackName);
		let fileName = rawName.replace(/[\/|\\:*?"<>]/g, "_").replace(/^_+|_+$/g, "").trim() || fallbackName.replace(/[\/|\\:*?"<>]/g, "_") || "character-sheet";
		if (!fileName.toLowerCase().endsWith(".html")) {fileName += ".html"};
		if (debug) {
			console.debug(...debugMessage, "PrintSheet exportSheet \"fileName\", \"htmlLength\"");
			console.debug(fileName);
			console.debug(html.length);
		};
		foundry.utils.saveDataToFile(html, "text/html", fileName);
	};
	//Формирование полноценного автономного HTML-документа на основе Handlebars-шаблона
	static async constructHTML(data, templatePath) {
		let bodyContent = await foundry.applications.handlebars.renderTemplate(templatePath, data);
		let title = escapeAttr(data.name || game.i18n.localize("WFRP4E.PrintSheet.Blank"));
		let lang = escapeAttr(game.i18n.lang || "en");
		let favicon = data.image ? `\n\t<link rel="icon" type="image/png" href="${data.image}">` : "";
		return `<!DOCTYPE html>
<html lang="${lang}">
<head>
\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t<title>${title}</title>${favicon}
\t<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer"/>
</head>
<body class="mode-${data.settings.mode}">
${bodyContent}
</body>
</html>`;
	};
};
//Регистрация настроек модуля при инициализации
Hooks.once("init", () => {
	game.settings.register("wfrp4e-print-sheet", "inputcolor", {
		name: game.i18n.localize("WFRP4E.PrintSheet.Settings.inputcolor.Name"),
		hint: game.i18n.localize("WFRP4E.PrintSheet.Settings.inputcolor.Hint"),
		scope: "client",
		config: true,
		type: new foundry.data.fields.ColorField(),
		default: "#8b0000",
		onChange: (value) => {
			if (CSS.supports("color", value)) {
				let el = document.querySelector("#settings-config-wfrp4e-print-sheet\\.inputcolor");
				if (el) {el.style.color = value};
			} else {game.settings.set("wfrp4e-print-sheet", "inputcolor", "#8b0000")};
		}
	});
	game.settings.register("wfrp4e-print-sheet", "defaultTemplate", {
		name: game.i18n.localize("WFRP4E.PrintSheet.Settings.defaultTemplate.Name"),
		hint: game.i18n.localize("WFRP4E.PrintSheet.Settings.defaultTemplate.Hint"),
		scope: "client",
		config: true,
		type: String,
		choices: {
			print: game.i18n.localize("WFRP4E.PrintSheet.Dialog.Template.Print"),
			browser: game.i18n.localize("WFRP4E.PrintSheet.Dialog.Template.Browser")
		},
		default: "print"
	});
	game.settings.register("wfrp4e-print-sheet", "embedimages", {
		name: game.i18n.localize("WFRP4E.PrintSheet.Settings.embedimages.Name"),
		hint: game.i18n.localize("WFRP4E.PrintSheet.Settings.embedimages.Hint"),
		scope: "client",
		config: true,
		default: true,
		type: Boolean
	});
	game.settings.register("wfrp4e-print-sheet", "defaultName", {
		name: game.i18n.localize("WFRP4E.PrintSheet.Settings.defaultName.Name"),
		hint: game.i18n.localize("WFRP4E.PrintSheet.Settings.defaultName.Hint"),
		scope: "client",
		config: true,
		type: String,
		default: ""
	});
	game.settings.registerMenu("wfrp4e-print-sheet", "printEmptySheet", {
		name: game.i18n.localize("WFRP4E.PrintSheet.Settings.printEmptySheet.Name"),
		label: game.i18n.localize("WFRP4E.PrintSheet.Settings.printEmptySheet.Label"),
		hint: game.i18n.localize("WFRP4E.PrintSheet.Settings.printEmptySheet.Hint"),
		icon: "fas fa-print",
		type: PrintEmptySheetMenu
	});
});
//Регистрация публичных методов модуля после готовности мира
Hooks.once("ready", () => {
	if (game.wfrp4e?.utility) {
		game.wfrp4e.utility.printEmptySheet = PrintSheet.printEmptySheet;
		game.wfrp4e.utility.printActorSheet = PrintSheet.openDialog;
	};
	if (isDebug()) {
		console.debug(...debugMessage, "ready initialized");
	};
});
//Добавление кнопки печати в заголовок листа актёра
Hooks.on("getHeaderControlsActorSheetV2", (sheet, controls) => {
	if (["character", "npc", "creature"].includes(sheet.document?.type)) {
		controls.push({
			icon: "fas fa-print",
			label: game.i18n.localize("WFRP4E.PrintSheet.Button"),
			onClick: () => {PrintSheet.openDialog(sheet.actor || sheet.document)}
		});
	};
});
//Класс сбора и нормализации данных актёра для экспорта в шаблоны
class DataMapper {
	//Округление веса до сотых
	static #roundEnc(val) {
		let num = parseFloat(val);
		return Number.isFinite(num) ? Math.round(num * 100) / 100 : 0;
	};
	//Преобразование HTML-биографии в чистый текст с переносами строк
	static #htmlToPlainText(html) {
		if (!html) {return ""};
		let div = document.createElement("div");
		div.innerHTML = html;
		let blocks = div.querySelectorAll("p, div, li, br, h1, h2, h3, h4, h5, h6");
		if (!blocks.length) {return (div.textContent || "").trim()};
		return Array.from(div.childNodes)
			.map(node => (node.textContent || "").trim())
			.filter(Boolean)
			.join("\n");
	};
	//Безопасный расчёт формулы урона с подстановкой бонусов характеристик
	static #evaluateDamage(rawFormula, actor) {
		if (rawFormula === null || rawFormula === undefined || rawFormula === "") {return "-"};
		let chars = actor?.system?.characteristics || actor?.characteristics || {};
		let bonuses = {
			WSB: Number(chars.ws?.bonus) || 0,
			BSB: Number(chars.bs?.bonus) || 0,
			SB: Number(chars.s?.bonus) || 0,
			TB: Number(chars.t?.bonus) || 0,
			IB: Number(chars.i?.bonus) || 0,
			AgB: Number(chars.ag?.bonus) || 0,
			DexB: Number(chars.dex?.bonus) || 0,
			IntB: Number(chars.int?.bonus) || 0,
			WPB: Number(chars.wp?.bonus) || 0,
			FelB: Number(chars.fel?.bonus) || 0
		};
		let expr = String(rawFormula).trim();
		for (let [token, val] of Object.entries(bonuses)) {expr = expr.replace(new RegExp(`\\b${token}\\b`, "gi"), String(val))};
		let compact = expr.replace(/\s+/g, "");
		if (/^[+-]?\d+(?:[+-]\d+)*$/.test(compact)) {
			let terms = compact.match(/[+-]?\d+/g) || [];
			let total = terms.reduce((sum, n) => sum + parseInt(n, 10), 0);
			return total >= 0 ? `+${total}` : String(total);
		};
		return expr;
	};
	//Генерация HTML-таблицы дистанций для дальнобойного оружия
	static #buildRangeTable(bands) {
		if (!bands || typeof bands !== "object") {return ""};
		let keys = ["Point Blank", "Short Range", "Normal", "Long Range", "Extreme"];
		let entries = keys
			.map(k => {
				let loc = game.i18n.localize(k);
				let band = bands[loc] || bands[k];
				return band ? {label: loc, band} : null;
			})
			.filter(Boolean);
		if (!entries.length) {return ""};
		let headers = entries.map(e => `<th><strong>${e.label}</strong></th>`).join("");
		let cells = entries.map(e => {
			let r0 = e.band.range?.[0] ?? "";
			let r1 = e.band.range?.[1] ?? "";
			let mod = Number(e.band.modifier) || 0;
			return `<td>${r0}-${r1} (${mod >= 0 ? "+" + mod : mod})</td>`;
		}).join("");
		return `<div class="range-table-wrap"><table class="range-table"><thead><tr>${headers}</tr></thead><tbody><tr>${cells}</tr></tbody></table></div>`;
	};
	//Форматирование зоны попадания для травм и критических ранений
	static #formatLocation(loc) {
		if (!loc) {return ""};
		if (loc.value) {return loc.value};
		let key = String(loc.key || "");
		if (!key) {return ""};
		if (game.wfrp4e?.config?.locations?.[key]) {return game.wfrp4e.config.locations[key]};
		if (key.startsWith("r")) {return `${game.i18n.localize("Right")} ${key.slice(1)}`};
		if (key.startsWith("l")) {return `${game.i18n.localize("Left")} ${key.slice(1)}`};
		return key;
	};
	//Форматирование строки достоинств и изъянов предмета
	static #formatQualities(item) {
		let props = item?.properties || {};
		let q = Object.values(props.qualities || {}).map(x => x?.display).filter(Boolean);
		let f = Object.values(props.flaws || {}).map(x => x?.display).filter(Boolean);
		return q.concat(f).join(", ");
	};
	//Форматирование веса предмета
	static #formatEncumbrance(item) {
		let enc = item?.system?.encumbrance || item?.encumbrance || {};
		let total = DataMapper.#roundEnc(enc.total ?? enc.value ?? 0);
		let base = DataMapper.#roundEnc(enc.value ?? total);
		return total === base ? String(total) : `${total} (${base})`;
	};
	//Создание массива пустых строк для чистого листа персонажа
	static #makeBlankRows(count, factory) {
		return Array.from({length: count}, (_, i) => factory(i));
	};
	//Сборка полной структуры данных актёра для рендера шаблона
	static async actorData(dataActor, options = {}) {
		let debug = isDebug();
		let embedImages = options.embedImages ?? game.settings.get("wfrp4e-print-sheet", "embedimages");
		let imageCache = new Map();
		let getImg = (url) => DataMapper.getImage(url, embedImages, imageCache);
		let getDesc = (text) => DataMapper.getDescription(text, embedImages, imageCache);
		let isBlank = !dataActor;
		let data = {isBlank};
		//Сборка словаря описаний достоинств и изъянов для всплывающих подсказок
		let propsMap = {};
		let cfg = game.wfrp4e.config;
		for (let key in (cfg.qualityDescriptions || {})) {
			let name = cfg.itemQualities?.[key] || cfg.weaponQualities?.[key] || cfg.armorQualities?.[key] || key;
			propsMap[name] = await getDesc(cfg.qualityDescriptions[key]);
		};
		for (let key in (cfg.flawDescriptions || {})) {
			let name = cfg.itemFlaws?.[key] || cfg.weaponFlaws?.[key] || cfg.armorFlaws?.[key] || key;
			propsMap[name] = await getDesc(cfg.flawDescriptions[key]);
		};
		//Настройки и служебные данные экспорта
		data.settings = {
			debug,
			mode: options.mode === "browser" ? "browser" : "print",
			inputcolor: game.settings.get("wfrp4e-print-sheet", "inputcolor") || "#8b0000",
			versions: {
				system: game.system.version,
				module: game.modules.get("wfrp4e-print-sheet")?.version || ""
			},
			propsJson: JSON.stringify(propsMap).replace(/<\/script>/gi, "<\\/script>"),
			coins: {
				bp: await getImg("modules/wfrp4e-core/icons/currency/brasspenny.png"),
				ss: await getImg("modules/wfrp4e-core/icons/currency/silvershilling.png"),
				gc: await getImg("modules/wfrp4e-core/icons/currency/goldcrown.png")
			}
		};
		//Порядок и ключи локализации характеристик
		let charOrder = [
			{key: "ws", loc: "CHARAbbrev.WS"},
			{key: "bs", loc: "CHARAbbrev.BS"},
			{key: "s", loc: "CHARAbbrev.S"},
			{key: "t", loc: "CHARAbbrev.T"},
			{key: "i", loc: "CHARAbbrev.I"},
			{key: "ag", loc: "CHARAbbrev.Ag"},
			{key: "dex", loc: "CHARAbbrev.Dex"},
			{key: "int", loc: "CHARAbbrev.Int"},
			{key: "wp", loc: "CHARAbbrev.WP"},
			{key: "fel", loc: "CHARAbbrev.Fel"}
		];
		if (dataActor) {
			let sys = dataActor.system || {};
			let details = sys.details || dataActor.details || {};
			let status = sys.status || dataActor.status || {};
			let chars = sys.characteristics || dataActor.characteristics || {};
			let itemTypes = dataActor.itemTypes || dataActor._itemTypes || {};
			//Имя игрока-владельца персонажа
			for (let user of game.users) {
				if (user.character?.id === dataActor.id) {data.player = user.name; break};
			};
			//Основные данные и портрет
			data.name = dataActor.name || "";
			data.image = await getImg(dataActor.img);
			//Карьера и карьерный путь
			let careers = itemTypes.career || [];
			let career = dataActor.currentCareer || careers[0] || null;
			data.career = career ? {
				name: career.name || "",
				class: career.system?.class?.value || career.class?.value || "",
				level: career.system?.level?.value || career.level?.value || "",
				path: careers.map(c => c.name).join(", "),
				status: details.status?.value || ""
			} : {name: "", class: "", level: "", path: "", status: details.status?.value || ""};
			//Личные данные и биография
			let rawBio = details.biography?.value || "";
			data.details = {
				race: dataActor.Species || details.species?.value || "",
				gender: details.gender?.value || "",
				age: details.age?.value || "",
				height: details.height?.value || "",
				weight: details.weight?.value || "",
				heightWeight: [details.height?.value, details.weight?.value ? `(${details.weight.value})` : ""].filter(Boolean).join(" "),
				haircolour: details.haircolour?.value || "",
				eyecolour: details.eyecolour?.value || "",
				biography: rawBio ? DataMapper.#htmlToPlainText(await getDesc(rawBio)) : ""
			};
			//Критические ранения, травмы и болезни
			let criticals = await Promise.all((itemTypes.critical || []).map(async (c) => ({
				name: c.name,
				image: await getImg(c.img),
				description: `<p><strong>${game.i18n.localize("Location")}</strong>: ${DataMapper.#formatLocation(c.system?.location || c.location)}</p><h4>${game.i18n.localize("Description")}</h4>${await getDesc(c.system?.description?.value || c.description?.value)}`
			})));
			let injuries = await Promise.all((itemTypes.injury || []).map(async (inj) => ({
				name: inj.name,
				image: await getImg(inj.img),
				description: `<p><strong>${game.i18n.localize("Duration")}</strong>: ${inj.system?.duration?.value ?? inj.duration?.value ?? ""} ${game.i18n.localize("Days")}</p><p><strong>${game.i18n.localize("Location")}</strong>: ${DataMapper.#formatLocation(inj.system?.location || inj.location)}</p><h4>${game.i18n.localize("Description")}</h4>${await getDesc(inj.system?.description?.value || inj.description?.value)}`
			})));
			let diseases = await Promise.all((itemTypes.disease || []).map(async (d) => {
				let showDur = game.user.isGM || d.system?.diagnosed || d.diagnosed;
				let durHtml = showDur ? `<p><strong>${game.i18n.localize("Duration")}</strong>: ${d.system?.duration?.value ?? d.duration?.value ?? ""} ${d.system?.duration?.unit ?? d.duration?.unit ?? ""}</p>` : "";
				return {
					name: d.name,
					image: await getImg(d.img),
					description: `${durHtml}<h4>${game.i18n.localize("Description")}</h4>${await getDesc(d.system?.description?.value || d.description?.value)}`
				};
			}));
			//Активные эффекты (исключая отключённые, служебные эффекты Assistant и скрытые эффекты Looting)
			let effects = await Promise.all(
				Array.from(dataActor.effects || [])
					.filter(e => !e.disabled && e.name && !e.flags?.assistant && !e.flags?.looting?.hide)
					.map(async (e) => ({
						name: (e.count && e.count != 1 ? `${e.count}x ` : "") + e.name,
						image: await getImg(e.img),
						description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(e.description)}`
					}))
			);
			//Статус персонажа (раны, судьба, упорство, амбиции, опыт, скорость, грех)
			let expLogRaw = details.experience?.log || [];
			data.status = {
				wounds: {
					value: status.wounds?.value ?? 0,
					max: status.wounds?.max ?? 0
				},
				criticals: criticals.concat(injuries, diseases),
				effects,
				fate: {
					fortune: status.fortune?.value ?? 0,
					value: status.fate?.value ?? 0
				},
				resilience: {
					resolve: status.resolve?.value ?? 0,
					value: status.resilience?.value ?? 0,
					motivation: details.motivation?.value || ""
				},
				ambitions: {
					personal: {
						short: dataActor.type === "character" ? (details["personal-ambitions"]?.["short-term"] || "") : "",
						long: dataActor.type === "character" ? (details["personal-ambitions"]?.["long-term"] || "") : ""
					},
					party: {
						short: dataActor.type === "character" ? (details["party-ambitions"]?.["short-term"] || "") : "",
						long: dataActor.type === "character" ? (details["party-ambitions"]?.["long-term"] || "") : ""
					}
				},
				experience: {
					value: details.experience?.current ?? 0,
					spent: details.experience?.spent ?? 0,
					total: details.experience?.total ?? 0,
					log: expLogRaw.map(l => ({
						reason: l.reason || game.i18n.localize("WFRP4E.PrintSheet.ExperienceReason"),
						value: l.amount ? `+${l.amount}` : String((l.spent || 0) * -1)
					})).reverse()
				},
				move: {
					value: details.move?.value ?? 0,
					walk: details.move?.walk ?? 0,
					run: details.move?.run ?? 0
				},
				religion: {
					god: details.god?.value || "",
					sin: status.sin?.value ?? 0
				}
			};
			//Характеристики
			data.characteristics = {};
			data.characteristicsList = [];
			for (let c of charOrder) {
				let ch = chars[c.key] || {};
				let current = Number(ch.value) || 0;
				let entry = {
					key: c.key,
					name: game.i18n.localize(c.loc),
					initial: Number(ch.initial) || 0,
					advances: Number(ch.advances) || 0,
					modifier: Number(ch.modifier) || 0,
					current,
					bonus: ch.bonus ?? Math.floor(current / 10)
				};
				data.characteristics[c.key] = entry;
				data.characteristicsList.push(entry);
			};
			//Навыки (основные делятся на 2 колонки для печатного шаблона)
			let allSkills = itemTypes.skill || [];
			let mapSkill = async (s) => {
				let chKey = s.characteristic?.key || s.system?.characteristic?.value || "ws";
				let rawChVal = s.characteristic?.value;
				let chVal = (rawChVal !== undefined && rawChVal !== null && rawChVal !== "" && Number.isFinite(Number(rawChVal)))
					? Number(rawChVal)
					: (data.characteristics[chKey]?.current ?? 0);
				return {
					name: s.name,
					characteristic: chKey,
					characteristicLabel: data.characteristics[chKey]?.name || chKey,
					characteristicValue: chVal,
					advances: Number(s.system?.advances?.value ?? s.advances?.value ?? 0),
					value: Number(s.system?.total?.value ?? s.total?.value ?? chVal),
					description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(s.system?.description?.value || s.description?.value)}`
				};
			};
			let bscAll = (await Promise.all(
				allSkills.filter(s => (s.system?.advanced?.value || s.advanced?.value) === "bsc" && (s.system?.grouped?.value || s.grouped?.value) === "noSpec").map(mapSkill)
			)).sort((a, b) => a.name.localeCompare(b.name));
			let advAll = (await Promise.all(
				allSkills.filter(s => (s.system?.advanced?.value || s.advanced?.value) !== "bsc" || (s.system?.grouped?.value || s.grouped?.value) !== "noSpec").map(mapSkill)
			)).sort((a, b) => a.name.localeCompare(b.name));
			let splitAt = Math.ceil(bscAll.length / 2);
			data.skills = {
				bsc: bscAll,
				bscLeft: bscAll.slice(0, splitAt),
				bscRight: bscAll.slice(splitAt),
				adv: advAll
			};
			//Таланты (без дублей, отсортированные по алфавиту)
			let talentRaw = await Promise.all((itemTypes.talent || []).map(async (t) => ({
				name: t.name,
				image: await getImg(t.img),
				advances: `${t.Advances ?? t.system?.advances?.value ?? 1}/${t.Max ?? "-"}`,
				tests: t.system?.tests?.value || t.tests?.value || "-",
				description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(t.system?.description?.value || t.description?.value)}`
			})));
			data.talents = talentRaw
				.filter((talent, idx, self) => idx === self.findIndex(t => t.name === talent.name))
				.sort((a, b) => a.name.localeCompare(b.name));
			//Черты существ
			data.traits = (await Promise.all((itemTypes.trait || []).map(async (t) => ({
				name: t.name,
				image: await getImg(t.img),
				advances: "-",
				tests: t.Specification || t.system?.specification?.value || "-",
				description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(t.system?.description?.value || t.description?.value)}`
			})))).sort((a, b) => a.name.localeCompare(b.name));
			//Психика и мутации
			data.psychologys = await Promise.all((itemTypes.psychology || []).filter(p => p.name).map(async (p) => ({
				name: p.name,
				image: await getImg(p.img),
				description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(p.system?.description?.value || p.description?.value)}`
			})));
			data.mutations = await Promise.all((itemTypes.mutation || []).filter(m => m.name).map(async (m) => ({
				name: m.name,
				image: await getImg(m.img),
				description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(m.system?.description?.value || m.description?.value)}`
			})));
			//Вес и монеты
			data.encumbrance = {
				weapons: 0,
				armours: 0,
				trappings: 0,
				current: DataMapper.#roundEnc(status.encumbrance?.current ?? 0),
				max: DataMapper.#roundEnc(status.encumbrance?.max ?? 0)
			};
			data.coins = {
				bp: {value: 0, encumbrance: 0},
				ss: {value: 0, encumbrance: 0},
				gc: {value: 0, encumbrance: 0}
			};
			for (let item of (itemTypes.money || [])) {
				let qty = Number(item.system?.quantity?.value ?? item.quantity?.value) || 0;
				let encTotal = DataMapper.#roundEnc(item.system?.encumbrance?.total ?? item.encumbrance?.total ?? 0);
				let coinVal = Number(item.system?.coinValue?.value ?? item.coinValue?.value) || 0;
				if (coinVal === 1) {data.coins.bp.value += qty; data.coins.bp.encumbrance = DataMapper.#roundEnc(data.coins.bp.encumbrance + encTotal)}
				else if (coinVal === 12) {data.coins.ss.value += qty; data.coins.ss.encumbrance = DataMapper.#roundEnc(data.coins.ss.encumbrance + encTotal)}
				else if (coinVal === 240) {data.coins.gc.value += qty; data.coins.gc.encumbrance = DataMapper.#roundEnc(data.coins.gc.encumbrance + encTotal)};
				if (!(item.system?.location?.value || item.location?.value)) {
					data.encumbrance.trappings = DataMapper.#roundEnc(data.encumbrance.trappings + encTotal);
				};
			};
			//Броня
			let armourItems = (itemTypes.armour || []).concat(itemTypes["wfrp4e-archives3.armour"] || [])
				.filter(a => !(a.system?.location?.value || a.location?.value));
			data.armours = await Promise.all(armourItems.map(async (a) => {
				let qty = Number(a.system?.quantity?.value ?? a.quantity?.value) || 1;
				let apObj = a.currentAP || a.system?.AP || {};
				let locations = Object.entries(apObj)
					.filter(([, val]) => Number(val) > 0)
					.map(([key, val]) => `${cfg.locations?.[key] || key} (${val})`)
					.join(", ");
				return {
					name: (qty !== 1 ? `${qty}x ` : "") + a.name,
					image: await getImg(a.img),
					locations,
					encumbrance: DataMapper.#formatEncumbrance(a),
					qualities: DataMapper.#formatQualities(a),
					description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(a.system?.description?.value || a.description?.value)}`
				};
			}));
			data.encumbrance.armours = DataMapper.#roundEnc(data.armours.reduce((s, a) => s + (parseFloat(a.encumbrance) || 0), 0));
			//Оружие и боеприпасы
			let weaponItems = (itemTypes.weapon || []).filter(w => !(w.system?.location?.value || w.location?.value));
			let ammoItems = (itemTypes.ammunition || []).filter(a => !(a.system?.location?.value || a.location?.value));
			let mappedWeapons = await Promise.all(weaponItems.map(async (w) => {
				let qty = Number(w.system?.quantity?.value ?? w.quantity?.value) || 1;
				let bandsHtml = DataMapper.#buildRangeTable(w.system?.range?.bands || w.range?.bands);
				return {
					name: (qty !== 1 ? `${qty}x ` : "") + w.name,
					image: await getImg(w.img),
					group: w.WeaponGroup || w.system?.weaponGroup?.value || "-",
					encumbrance: DataMapper.#formatEncumbrance(w),
					reach: w.Reach || w.Range || "-",
					damage: DataMapper.#evaluateDamage(w.system?.damage?.value ?? w.damage?.value, dataActor),
					qualities: DataMapper.#formatQualities(w),
					description: `${bandsHtml}<h4>${game.i18n.localize("Description")}</h4>${await getDesc(w.system?.description?.value || w.description?.value)}`
				};
			}));
			let mappedAmmo = await Promise.all(ammoItems.map(async (a) => {
				let qty = Number(a.system?.quantity?.value ?? a.quantity?.value) || 1;
				return {
					name: (qty !== 1 ? `${qty}x ` : "") + a.name,
					image: await getImg(a.img),
					group: a.trappingCategory || game.i18n.localize("Ammunition"),
					encumbrance: DataMapper.#formatEncumbrance(a),
					reach: a.system?.range?.value || a.range?.value || "-",
					damage: DataMapper.#evaluateDamage(a.system?.damage?.value ?? a.damage?.value, dataActor),
					qualities: DataMapper.#formatQualities(a),
					description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(a.system?.description?.value || a.description?.value)}`
				};
			}));
			data.weapons = mappedWeapons.concat(mappedAmmo);
			data.encumbrance.weapons = DataMapper.#roundEnc(data.weapons.reduce((s, w) => s + (parseFloat(w.encumbrance) || 0), 0));
			//Имущество и контейнеры
			let containers = await DataMapper.getContainersData(itemTypes.container || [], dataActor, null, embedImages, imageCache);
			let looseTrappings = await DataMapper.getItemsData(itemTypes.trapping || [], dataActor, null, embedImages, imageCache);
			data.trappings = containers.concat(looseTrappings);
			data.encumbrance.trappings = DataMapper.#roundEnc(
				data.encumbrance.trappings + data.trappings.reduce((s, t) => s + (parseFloat(t.encumbrance) || 0), 0)
			);
			//Магия и молитвы
			let spells = await Promise.all((itemTypes.spell || []).map(async (s) => ({
				name: s.name,
				image: await getImg(s.img),
				cn: s.system?.cn?.value ?? s.cn?.value ?? 0,
				lore: cfg.magicLores?.[s.system?.lore?.value || s.lore?.value] || s.system?.lore?.value || "-",
				range: s.Range || s.system?.range?.value || "-",
				target: s.Target || s.system?.target?.value || "-",
				duration: s.Duration || s.system?.duration?.value || "-",
				description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(s.system?.description?.value || s.description?.value)}`
			})));
			let prayers = await Promise.all((itemTypes.prayer || []).map(async (p) => {
				let pType = cfg.prayerTypes?.[p.system?.type?.value || p.prayerType?.value] || game.i18n.localize("Prayer");
				let god = details.god?.value ? ` (${details.god.value})` : "";
				return {
					name: p.name,
					image: await getImg(p.img),
					cn: "-",
					lore: `${pType}${god}`,
					range: p.Range || p.system?.range?.value || "-",
					target: p.Target || p.system?.target?.value || "-",
					duration: p.Duration || p.system?.duration?.value || "-",
					description: `<h4>${game.i18n.localize("Description")}</h4>${await getDesc(p.system?.description?.value || p.description?.value)}`
				};
			}));
			data.magics = spells.concat(prayers);
		} else {
			//Подготовка заготовок пустых строк для чистого листа
			data.name = "";
			data.image = false;
			data.career = {name: "", class: "", level: "", path: "", status: ""};
			data.details = {race: "", gender: "", age: "", height: "", weight: "", heightWeight: "", haircolour: "", eyecolour: "", biography: ""};
			data.characteristics = {};
			data.characteristicsList = [];
			for (let c of charOrder) {
				let entry = {key: c.key, name: game.i18n.localize(c.loc), initial: "", advances: "", modifier: "", current: "", bonus: ""};
				data.characteristics[c.key] = entry;
				data.characteristicsList.push(entry);
			};
			data.status = {
				wounds: {value: "", max: ""},
				criticals: DataMapper.#makeBlankRows(6, () => ({name: "", image: false, description: ""})),
				effects: [],
				fate: {fortune: "", value: ""},
				resilience: {resolve: "", value: "", motivation: ""},
				ambitions: {personal: {short: "", long: ""}, party: {short: "", long: ""}},
				experience: {
					value: "", spent: "", total: "",
					log: DataMapper.#makeBlankRows(8, () => ({value: "", reason: ""}))
				},
				move: {value: "", walk: "", run: ""},
				religion: {god: "", sin: ""}
			};
			let emptySkill = () => ({name: "", characteristic: "ws", characteristicLabel: "", characteristicValue: "", advances: "", value: "", description: ""});
			data.skills = {
				bsc: DataMapper.#makeBlankRows(24, emptySkill),
				bscLeft: DataMapper.#makeBlankRows(12, emptySkill),
				bscRight: DataMapper.#makeBlankRows(12, emptySkill),
				adv: DataMapper.#makeBlankRows(12, emptySkill)
			};
			data.talents = DataMapper.#makeBlankRows(18, () => ({name: "", image: false, advances: "", tests: "", description: ""}));
			data.traits = [];
			data.psychologys = DataMapper.#makeBlankRows(4, () => ({name: "", image: false, description: ""}));
			data.mutations = DataMapper.#makeBlankRows(4, () => ({name: "", image: false, description: ""}));
			data.encumbrance = {weapons: "", armours: "", trappings: "", current: "", max: ""};
			data.coins = {bp: {value: "", encumbrance: 0}, ss: {value: "", encumbrance: 0}, gc: {value: "", encumbrance: 0}};
			data.armours = DataMapper.#makeBlankRows(6, () => ({name: "", image: false, locations: "", encumbrance: "", qualities: "", description: ""}));
			data.weapons = DataMapper.#makeBlankRows(8, () => ({name: "", image: false, group: "", encumbrance: "", reach: "", damage: "", qualities: "", description: ""}));
			data.trappings = DataMapper.#makeBlankRows(14, () => ({name: "", image: false, encumbrance: "", qualities: "", description: ""}));
			data.magics = DataMapper.#makeBlankRows(8, () => ({name: "", image: false, cn: "", lore: "", range: "", target: "", duration: "", description: ""}));
		};
		//Флаги видимости опциональных разделов
		data.settings.showMagic = options.includeMagic ?? (isBlank || data.magics.length > 0);
		data.settings.showSin = options.includeSin ?? (isBlank || Boolean(data.status.religion.god) || Number(data.status.religion.sin) > 0);
		data.settings.showExperience = options.includeExperience ?? (isBlank || data.status.experience.log.length > 0);
		if (debug) {
			console.debug(...debugMessage, "DataMapper actorData \"data\"");
			console.debug(data);
		};
		return data;
	};
	//Подготовка HTML-описания и встраивание изображений внутри текста
	static async getDescription(text, embedImages, imageCache) {
		if (!text || text === "<p></p>") {return `<p><em>${game.i18n.localize("WFRP4E.PrintSheet.Empty")}</em></p>`};
		let result = await foundry.applications.ux.TextEditor.implementation.enrichHTML(text);
		let links = [];
		result.replace(/src=["']([^"']+)["']/g, (match, oldLink) => {
			links.push(oldLink);
			return match;
		});
		if (links.length) {
			let resolved = await Promise.all(links.map(l => DataMapper.getImage(l, embedImages, imageCache)));
			let idx = 0;
			result = result.replace(/src=["']([^"']+)["']/g, (match) => {
				let replacement = resolved[idx++];
				return replacement ? `src='${replacement}'` : match;
			});
		};
		return result;
	};
	//Конвертация изображения в DataURL
	static async getImage(url, embedImages = true, cache = null) {
		if (!url || !embedImages || url === "systems/wfrp4e/icons/blank.png") {return false};
		if (/\.(webm|mp4|m4v)(\?.*)?$/i.test(url)) {return false};
		if (cache?.has(url)) {return cache.get(url)};
		let promise = new Promise((resolve) => {
			let settled = false;
			let finish = (val) => {
				if (settled) {return};
				settled = true;
				clearTimeout(timer);
				if (!val && isDebug()) {
					console.debug(...debugMessage, "DataMapper getImage skipped/failed", url);
				};
				resolve(val);
			};
			let timer = setTimeout(() => finish(false), 5000);
			let img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => {
				try {
					let canvas = document.createElement("canvas");
					let ctx = canvas.getContext("2d");
					canvas.width = img.naturalWidth || 64;
					canvas.height = img.naturalHeight || 64;
					ctx.drawImage(img, 0, 0);
					finish(canvas.toDataURL());
				} catch {finish(false)};
			};
			img.onerror = () => finish(false);
			img.src = url;
		});
		if (cache) {cache.set(url, promise)};
		return promise;
	};
	//Сбор контейнеров и их содержимого
	static async getContainersData(containers, actor = {}, location = null, embedImages = true, imageCache = null) {
		let resultData = [];
		for (let c of containers) {
			let cLoc = c.system?.location?.value || c.location?.value || null;
			if ((!location && !cLoc) || (location && cLoc === location)) {
				let carriesCur = c.system?.carries?.current ?? c.carries?.current ?? 0;
				let carriesVal = c.system?.carries?.value ?? c.carries?.value ?? 0;
				let subContainers = await DataMapper.getContainersData(c.system?.packsInside || [], actor, c.id, embedImages, imageCache);
				let subItems = await DataMapper.getItemsData(c.system?.carrying || [], actor, c.id, embedImages, imageCache);
				resultData.push({
					name: `${c.name} (${carriesCur}/${carriesVal})`,
					image: await DataMapper.getImage(c.img, embedImages, imageCache),
					encumbrance: DataMapper.#formatEncumbrance(c),
					carrying: subContainers.concat(subItems),
					qualities: "",
					description: `<h4>${game.i18n.localize("Description")}</h4>${await DataMapper.getDescription(c.system?.description?.value || c.description?.value, embedImages, imageCache)}`
				});
			};
		};
		return resultData;
	};
	//Сбор предметов имущества (включая вложенные в контейнеры оружие, броню и боеприпасы)
	static async getItemsData(items, actor = {}, location = null, embedImages = true, imageCache = null) {
		let resultData = [];
		let cfg = game.wfrp4e.config;
		for (let it of items) {
			let iLoc = it.system?.location?.value || it.location?.value || null;
			if (it.type !== "money" && ((!location && !iLoc) || (location && iLoc === location))) {
				let qty = Number(it.system?.quantity?.value ?? it.quantity?.value) || 1;
				let item = {
					name: (qty !== 1 ? `${qty}x ` : "") + it.name,
					image: await DataMapper.getImage(it.img, embedImages, imageCache),
					encumbrance: DataMapper.#formatEncumbrance(it),
					qualities: DataMapper.#formatQualities(it),
					description: `<h4>${game.i18n.localize("Description")}</h4>${await DataMapper.getDescription(it.system?.description?.value || it.description?.value, embedImages, imageCache)}`
				};
				if (it.type === "armour" || it.type === "wfrp4e-archives3.armour") {
					let apObj = it.currentAP || it.system?.AP || {};
					let locs = Object.entries(apObj).filter(([, v]) => Number(v) > 0).map(([k, v]) => `${cfg.locations?.[k] || k} (${v})`).join(", ");
					item.description = `<p><strong>${game.i18n.localize("Location")}</strong>: ${locs}</p>${item.description}`;
				} else if (it.type === "weapon") {
					let bandsHtml = DataMapper.#buildRangeTable(it.system?.range?.bands || it.range?.bands);
					let dmg = DataMapper.#evaluateDamage(it.system?.damage?.value ?? it.damage?.value, actor);
					item.description = `<p><strong>${game.i18n.localize("Group")}</strong>: ${it.WeaponGroup || "-"}</p>`
						+ (bandsHtml || `<p><strong>${game.i18n.localize("Length")}</strong>: ${it.Reach || it.Range || "-"}</p>`)
						+ `<p><strong>${game.i18n.localize("Damage")}</strong>: ${dmg}</p>${item.description}`;
				} else if (it.type === "ammunition") {
					let dmg = DataMapper.#evaluateDamage(it.system?.damage?.value ?? it.damage?.value, actor);
					item.description = `<p><strong>${game.i18n.localize("Length")}</strong>: ${it.system?.range?.value || it.range?.value || "-"}</p>`
						+ `<p><strong>${game.i18n.localize("Damage")}</strong>: ${dmg}</p>${item.description}`;
				};
				resultData.push(item);
			};
		};
		return resultData;
	};
};
//Генерация HTML-разметки имущества и вложенных контейнеров
function renderTrappingsHTML(trappings, layer = 0, parent = "", interactive = false) {
	if (!Array.isArray(trappings) || !trappings.length) {return ""};
	let html = "";
	for (let i = 0; i < trappings.length; i++) {
		let t = trappings[i];
		let key = parent ? `${parent}_${i}` : String(i);
		let indentStyle = layer > 0 ? ` style="--indent: ${layer};"` : "";
		let layerClass = layer > 0 ? " layer" : "";
		let descAttr = escapeAttr(t.description || "");
		let qualAttr = t.qualities ? ` data-qualities="${escapeAttr(t.qualities)}"` : "";
		let expandBtn = interactive
			? `<button type="button" class="expand-btn" title="${escapeAttr(game.i18n.localize("WFRP4E.PrintSheet.HTML.ExpandDetails"))}"><i class="fas fa-circle-info"></i></button>`
			: "";
		html += `
		<div class="item trappings${layerClass} tooltip-target"${indentStyle} data-tooltip="${descAttr}"${qualAttr} data-search="${escapeAttr(t.name)}">
			<div class="row-main">
				<div class="name-cell">
					${t.image ? `<img class="item-icon" src="${t.image}" alt="">` : ""}
					<input class="col-name" id="trapping.${key}.name" value="${escapeAttr(t.name)}">
				</div>
				<input class="col-enc" id="trapping.${key}.encumbrance" value="${escapeAttr(t.encumbrance)}">
				${expandBtn}
			</div>
			${interactive ? `<div class="inline-desc" hidden></div>` : ""}
		</div>`;
		if (t.carrying?.length) {html += renderTrappingsHTML(t.carrying, layer + 1, parent ? `${parent}:${i}` : `c:${i}`, interactive)};
	};
	return html;
};
//Регистрация функции Handlebars для вывода вложенного имущества
Handlebars.registerHelper("createTrappingsElem", function(trappings, options) {
	let layer = Number(options?.hash?.layer) || 0;
	let parent = options?.hash?.parent || "";
	let interactive = Boolean(options?.hash?.interactive);
	return new Handlebars.SafeString(renderTrappingsHTML(trappings, layer, parent, interactive));
});