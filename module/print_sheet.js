import DataMapper from "./script/mapToDataExport.js"
import PrintSheetHtml from "./script/printHtml.js";

async function printActorSheet(dataSheet, type) {
	const dataWFRP4eSheet = dataSheet.clone();
	const dataToExport = DataMapper.mapSheetDataToDataExport(dataWFRP4eSheet, type);
	
	let textExport = await PrintSheetHtml.convertdataToHtmlText(dataToExport, 'modules/wfrp4e-print-sheet/template/htmlExportTemplate.html');
	let filename = dataToExport.name.replace(/\s/g, "_") + ".html";

	if(filename) {
		saveDataToFile(textExport, "text/html", filename);
	}
}

Hooks.once('ready', () => {
    game.settings.register("wfrp4e-print-sheet", "editable", {
		name: game.i18n.localize("WFRP4E.PS.Settings.Editable.Name"),
		hint: game.i18n.localize("WFRP4E.PS.Settings.Editable.Hint"),
		scope: "client",
        config: true,
		default: false,
		type: Boolean
	});
    game.settings.register("wfrp4e-print-sheet", "inputcolor", {
		name: game.i18n.localize("WFRP4E.PS.Settings.InputColor.Name"),
		hint: game.i18n.localize("WFRP4E.PS.Settings.InputColor.Hint"),
		scope: "client",
        config: true,
        type: Number,
        choices: {
            0: game.i18n.localize("WFRP4E.PS.Settings.InputColor.Red"),
            1: game.i18n.localize("WFRP4E.PS.Settings.InputColor.Green"),
            2: game.i18n.localize("WFRP4E.PS.Settings.InputColor.Blue"),
            3: game.i18n.localize("WFRP4E.PS.Settings.InputColor.Black"),
            4: game.i18n.localize("WFRP4E.PS.Settings.InputColor.Custom")
        },
        default: 0
	});
    game.settings.register("wfrp4e-print-sheet", "inputcolorcustom", {
		name: game.i18n.localize("WFRP4E.PS.Settings.InputColorCustom.Name"),
		hint: game.i18n.localize("WFRP4E.PS.Settings.InputColorCustom.Hint"),
		scope: "client",
        config: true,
		type: String,
		default: ""
	});
});

Hooks.on("getActorDirectoryEntryContext", async (html, options) => {
	options.push(
		{
		name: game.i18n.localize("WFRP4E.PS.Button"),
		icon: '<i class="fa-solid fa-file-export"></i>',
		callback: target => {
			if (game.actors.get(target.attr('data-document-id')).type == "character" || game.actors.get(target.attr('data-document-id')).type == "npc") {printActorSheet(game.actors.get(target.attr('data-document-id')), game.actors.get(target.attr('data-document-id')).type)}
			else {ui.notifications.error(game.i18n.localize("WFRP4E.PS.WrongActor"))};
		}
	});
});