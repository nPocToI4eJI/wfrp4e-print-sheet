
class printSheet {
	static printEmptySheet() {
		printActorSheet();
	};
};

Hooks.once("ready", () => {
    game.settings.register("wfrp4e-print-sheet", "inputcolor", {
		name: game.i18n.localize("WFRP4E.PrintSheet.Settings.inputcolor.Name"),
		hint: game.i18n.localize("WFRP4E.PrintSheet.Settings.inputcolor.Hint"),
		scope: "client",
        config: true,
        type: String,
        default: "#8b0000",
        onChange: (value) => {
			if (CSS.supports("color", value)) {$("#settings-config-wfrp4e-print-sheet\\.inputcolor").css("color", value)}
			else {game.settings.set("wfrp4e-print-sheet", "inputcolor", "#8b0000")};
		}
	});
    game.settings.register("wfrp4e-print-sheet", "conection", {
		name: game.i18n.localize("WFRP4E.PrintSheet.Settings.conection.Name"),
		hint: game.i18n.localize("WFRP4E.PrintSheet.Settings.conection.Hint"),
		scope: "client",
        config: true,
		default: `http://localhost:${game.data.options.port}/`,
		type: String
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

	game.wfrp4e.utility.printEmptySheet = printSheet.printEmptySheet;
});

Hooks.on("getHeaderControlsActorSheetV2", (sheet, controls) => {
	if(sheet.document.type == "character" || sheet.document.type == "npc" || sheet.document.type == "creature") {
		controls.push({
			icon: "fas fa-file-export",
			label: game.i18n.localize("WFRP4E.PrintSheet.Button"),
			onClick: () => {printActorSheet(sheet.actor)},
		});
	};
});

async function printActorSheet(actor) {
	let data = await DataMapper.actorData(actor);

	let dataExport = await HTMLSheet.constructHTML(data, "modules/wfrp4e-print-sheet/templates/sheetTemplate.hbs");
	let name = game.settings.get("wfrp4e-print-sheet", "defaultName").replace(/[\/|\\:*?"<>]/g, "_");
	if (!name) {name = data.name.replace(/[\/|\\:*?"<>]/g, "_") || game.i18n.localize("WFRP4E.PrintSheet.Empty").replace(/[\/|\\:*?"<>]/g, "_")};

	if(dataExport) {foundry.utils.saveDataToFile(dataExport, "text/html", name + ".html")};
};

class DataMapper {
	static async actorData(dataActor) {
		let data = {};

		//Import settings
		data.settings = {
			inputcolor: game.settings.get("wfrp4e-print-sheet", "inputcolor"),
			versions: {system: game.system.version, module: game.modules.get("wfrp4e-print-sheet").version},
			props: [],
			coins: {
				bp: await DataMapper.getImage("modules/wfrp4e-core/icons/currency/brasspenny.png"),
				ss: await DataMapper.getImage("modules/wfrp4e-core/icons/currency/silvershilling.png"),
				gc: await DataMapper.getImage("modules/wfrp4e-core/icons/currency/goldcrown.png")
			}
			//export: DataMapper.getExportData(dataActor)
		};
		for (let key in game.wfrp4e.config.qualityDescriptions) {
			let name = game.wfrp4e.config.itemQualities[key] || game.wfrp4e.config.weaponQualities[key] || game.wfrp4e.config.armorQualities[key] || key;
			data.settings.props.push({name: name, description: (await DataMapper.getDescription(game.wfrp4e.config.qualityDescriptions[key]))});
		};
		for (let key in game.wfrp4e.config.flawDescriptions) {
			let name = game.wfrp4e.config.itemFlaws[key] || game.wfrp4e.config.weaponFlaws[key] || game.wfrp4e.config.armorFlaws[key] || key;
			data.settings.props.push({name: name, description: (await DataMapper.getDescription(game.wfrp4e.config.flawDescriptions[key]))});
		};

		if (dataActor) {
			//Player name
			for (let user of game.users) {
				if (user.character?.id == dataActor.id) {data.player = user.name};
			};
			//Main data
			data.name = dataActor.name;
			data.image = await DataMapper.getImage(dataActor.img);

			//Careers info
			let career = dataActor.currentCareer || dataActor._itemTypes.career[0] || false;
			career ? data.career = {
				name: career.name || "",
				class: career.class.value || "",
				level: career.level.value || "",
				path: dataActor._itemTypes.career.map(c => c.name).join(", ") || "",
				status: dataActor.details.status.value || ""
			} : null;

			//Details
			data.details = {
				race: dataActor.Species,
				gender: dataActor.details.gender.value,
				age: dataActor.details.age.value || "",
				height: dataActor.details.height.value || "",
				weight: dataActor.details.weight.value || "",
				haircolour: dataActor.details.haircolour.value || "",
				eyecolour: dataActor.details.eyecolour.value || ""
			};
			try {data.details.biography = Object.values($(await DataMapper.getDescription(dataActor.details.biography.value))).map(e => e.textContent).join("\n")}
			catch {data.details.biography = dataActor.details.biography.value};

			//Character status
			data.status = {
				wounds: {
					value: dataActor.status.wounds.value,
					max: dataActor.status.wounds.max
				},
				criticals: (await Promise.all(dataActor._itemTypes.critical.map(async (c) => ({
					name: c.name,
					image: await DataMapper.getImage(c.img),
					description: `<p><strong>${game.i18n.localize("Location")}</strong>: ${c.location.value}</p><h4>${game.i18n.localize("Description")}</h4>${await DataMapper.getDescription(c.description.value)}`
				})))).concat(await Promise.all(dataActor._itemTypes.injury.map(async (i) => ({
					name: i.name,
					image: await DataMapper.getImage(i.img),
					description: `<p><strong>${game.i18n.localize("Duration")}</strong>: ${i.duration.value} ${game.i18n.localize("Days")}</p><p><strong>${game.i18n.localize("Location")}</strong>: ${i.location.value || (i.location.key[0] == "r" ? i.location.key.replace("r", game.i18n.localize("Right") + " ") : i.location.key[0] == "l" ? i.location.key.replace("l", game.i18n.localize("Left") + " ") : i.location.key)}</p><h4>${game.i18n.localize("Description")}</h4>${await DataMapper.getDescription(i.description.value)}`
				})))).concat(await Promise.all(dataActor._itemTypes.disease.map(async (d) => ({
					name: d.name,
					image: await DataMapper.getImage(d.img),
					description: `${game.user.isGM || d.diagnosed ? "<p><strong>" + game.i18n.localize("Duration") + "</strong>: " + d.duration.value + " " + d.duration.unit : ""}</p><h4>${game.i18n.localize("Description")}</h4>${await DataMapper.getDescription(d.description.value)}`
				})))),
				effects: (await Promise.all(dataActor.effects.filter(e => !e.flags.assistant).map(async (e) => ({
					name: (e.count != 1 ? e.count + "x " : "") + e.name,
					image: await DataMapper.getImage(e.img),
					description: `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(e.description)
				})))),
				fate: {
					fortune: dataActor.status.fortune?.value || "0",
					value: dataActor.status.fate?.value || "0"
				},
				resilience: {
					resolve: dataActor.status.resolve?.value || "0",
					value: dataActor.status.resilience?.value || "0",
					motivation: dataActor.details.motivation?.value || ""
				},
				ambitions: {
					personal: {
						short: dataActor.type == "character" ? dataActor.details["personal-ambitions"]["short-term"] : "",
						long: dataActor.type == "character" ? dataActor.details["personal-ambitions"]["long-term"] : ""
					},
					party: {
						short: dataActor.type == "character" ? dataActor.details["party-ambitions"]["short-term"] : "",
						long: dataActor.type == "character" ? dataActor.details["party-ambitions"]["long-term"] : ""
					}
				},
				experience: {
					value: dataActor.details.experience?.current || "0",
					spent: dataActor.details.experience?.spent || "0",
					total: dataActor.details.experience?.total || "0",
					log: dataActor.details.experience?.log.map(l => ({reason: l.reason || game.i18n.localize("WFRP4E.PrintSheet.ExperienceReason"), value: l.amount ? "+" + l.amount : l.spent * -1})).reverse() || ""
				},
				move: {
					value: dataActor.details.move.value,
					walk: dataActor.details.move.walk,
					run: dataActor.details.move.run
				},
				religion: {
					god: dataActor.details.god.value,
					sin: dataActor.status.sin.value
				}
			};

			//Characteristics
			data.characteristics = {
				ws: {
					name: game.i18n.localize("CHARAbbrev.WS"),
					initial: dataActor.characteristics.ws.initial || 0,
					advances: dataActor.characteristics.ws.advances || 0,
					modifier: dataActor.characteristics.ws.modifier || 0,
					current: dataActor.characteristics.ws.value || 0
				},
				bs: {
					name: game.i18n.localize("CHARAbbrev.BS"),
					initial: dataActor.characteristics.bs.initial || 0,
					advances: dataActor.characteristics.bs.advances || 0,
					modifier: dataActor.characteristics.bs.modifier || 0,
					current: dataActor.characteristics.bs.value || 0
				},
				s: {
					name: game.i18n.localize("CHARAbbrev.S"),
					initial: dataActor.characteristics.s.initial || 0,
					advances: dataActor.characteristics.s.advances || 0,
					modifier: dataActor.characteristics.s.modifier || 0,
					current: dataActor.characteristics.s.value || 0
				},
				t: {
					name: game.i18n.localize("CHARAbbrev.T"),
					initial: dataActor.characteristics.t.initial || 0,
					advances: dataActor.characteristics.t.advances || 0,
					modifier: dataActor.characteristics.t.modifier || 0,
					current: dataActor.characteristics.t.value || 0
				},
				i: {
					name: game.i18n.localize("CHARAbbrev.Ag"),
					initial: dataActor.characteristics.i.initial || 0,
					advances: dataActor.characteristics.i.advances || 0,
					modifier: dataActor.characteristics.i.modifier || 0,
					current: dataActor.characteristics.i.value || 0
				},
				ag: {
					name: game.i18n.localize("CHARAbbrev.Dex"),
					initial: dataActor.characteristics.ag.initial || 0,
					advances: dataActor.characteristics.ag.advances || 0,
					modifier: dataActor.characteristics.ag.modifier || 0,
					current: dataActor.characteristics.ag.value || 0
				},
				dex: {
					name: game.i18n.localize("CHARAbbrev.Int"),
					initial: dataActor.characteristics.dex.initial || 0,
					advances: dataActor.characteristics.dex.advances || 0,
					modifier: dataActor.characteristics.dex.modifier || 0,
					current: dataActor.characteristics.dex.value || 0
				},
				int: {
					name: game.i18n.localize("CHARAbbrev.WP"),
					initial: dataActor.characteristics.int.initial || 0,
					advances: dataActor.characteristics.int.advances || 0,
					modifier: dataActor.characteristics.int.modifier || 0,
					current: dataActor.characteristics.int.value || 0
				},
				wp: {
					name: game.i18n.localize("CHARAbbrev.WS"),
					initial: dataActor.characteristics.wp.initial || 0,
					advances: dataActor.characteristics.wp.advances || 0,
					modifier: dataActor.characteristics.wp.modifier || 0,
					current: dataActor.characteristics.wp.value || 0
				},
				fel: {
					name: game.i18n.localize("CHARAbbrev.Fel"),
					initial: dataActor.characteristics.fel.initial || 0,
					advances: dataActor.characteristics.fel.advances || 0,
					modifier: dataActor.characteristics.fel.modifier || 0,
					current: dataActor.characteristics.fel.value || 0
				}
			};

			//Skills
			data.skills = {
				adv: 
					(await Promise.all(dataActor._itemTypes.skill.filter(s => s.advanced.value != "bsc" && s.grouped.value != "noSpec").map(async (s) => ({
						name: s.name,
						characteristic: s.characteristic.key,
						characteristicValue: s.characteristic.value,
						advances: s.advances.value,
						value: s.total.value,
						description: `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(s.description.value)
					})))).sort((a, b) => a.name > b.name ? 1 : -1),
				bsc: 
					(await Promise.all(dataActor._itemTypes.skill.filter(s => s.advanced.value == "bsc" && s.grouped.value == "noSpec").map(async (s) => ({
						name: s.name,
						characteristic: s.characteristic.key,
						characteristicValue: s.characteristic.value,
						advances: s.advances.value,
						value: s.total.value,
						description: `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(s.description.value)
					})))).sort((a, b) => a.name > b.name ? 1 : -1)
			};

			//Talents
			data.talents = (await Promise.all(dataActor._itemTypes.talent.map(async (t) => ({
				name: t.name,
				image: await DataMapper.getImage(t.img),
				advances: `${t.Advances}/${t.Max}`,
				tests: t.tests.value || "-",
				description: `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(t.description.value)
			})))).filter((talent, index, self) => (index == self.findIndex(t => t.name == talent.name))).sort((a, b) => a.name > b.name ? 1 : -1);

			//Traits
			data.traits = (await Promise.all(dataActor._itemTypes.trait.map(async (t) => ({
				name: t.name,
				image: await DataMapper.getImage(t.img),
				advances: "-",
				tests: t.Specification || "-",
				description: `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(t.description.value)
			})))).sort((a, b) => a.name > b.name ? 1 : -1);

			//Psychologys
			data.psychologys = await Promise.all(dataActor._itemTypes.psychology.map(async (p) => ({
				name: p.name,
				image: await DataMapper.getImage(p.img),
				description: `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(p.description.value)
			})));

			//Mutations
			data.mutations = await Promise.all(dataActor._itemTypes.mutation.map(async (m) => ({
				name: m.name,
				image: await DataMapper.getImage(m.img),
				description: `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(m.description.value)
			})));

			//Set encumbrance
			data.encumbrance = {weapons: 0, armours: 0, trappings: 0, current: parseFloat(dataActor.status.encumbrance.current), max: dataActor.status.encumbrance.max};

			//Money
			data.coins = {
				bp: {
					value: 0,
					encumbrance: 0
				},
				ss: {
					value: 0,
					encumbrance: 0
				},
				gc: {
					value: 0,
					encumbrance: 0
				}
			};
			for (let i = 0; i < dataActor._itemTypes.money.length; i++) {
				let item = dataActor._itemTypes.money[i];
				switch (item.coinValue.value) {
					case 1: data.coins.bp.value += item.quantity.value; data.coins.bp.encumbrance += parseFloat(item.encumbrance.total); break;
					case 12: data.coins.ss.value += item.quantity.value; data.coins.ss.encumbrance += parseFloat(item.encumbrance.total); break;
					case 240: data.coins.gc.value += item.quantity.value; data.coins.gc.encumbrance += parseFloat(item.encumbrance.total); break;
				};
				if (!item.location.value) {data.encumbrance.trappings +=  parseFloat(item.encumbrance.total)};
			};

			//Armours
			data.armours = await Promise.all(dataActor._itemTypes.armour.concat(dataActor._itemTypes["wfrp4e-archives3.armour"]).filter(a => !a.location.value).map(async (a) => ({
				name: (a.quantity.value != 1 ? a.quantity.value + "x " : "") + a.name,
				image: await DataMapper.getImage(a.img),
				locations: Object.keys(a.currentAP).map((key, index) => Object.values(a.currentAP)[index] ? `${game.wfrp4e.config.locations[key]} (${Object.values(a.currentAP)[index]})` : false).filter(Boolean).join(", "),
				encumbrance: a.encumbrance.total == a.encumbrance.value ? a.encumbrance.total : `${a.encumbrance.total} (${a.encumbrance.value})`,
				qualities: Object.values(a.properties.qualities).map(q => q.display).concat(Object.values(a.properties.flaws).map(f => f.display)).join(", "),
				description: `<h4>${game.i18n.localize("Description")}</h4>${await DataMapper.getDescription(a.description.value)}`
			})));
			//Calc armours encumbrance
			for (let i = 0; i < data.armours.length; i++) {
				data.encumbrance.armours += parseFloat(data.armours[i].encumbrance);
			};

			//Weapons
			data.weapons = (await Promise.all(dataActor._itemTypes.weapon.filter(w => !w.location.value).map(async (w) => ({
				name: (w.quantity.value != 1 ? w.quantity.value + "x " : "") + w.name,
				image: await DataMapper.getImage(w.img),
				group: w.WeaponGroup,
				encumbrance: w.encumbrance.total == w.encumbrance.value ? w.encumbrance.total : `${w.encumbrance.total} (${w.encumbrance.value})`,
				reach: w.Reach || w.Range,
				damage: "+" + eval(w.damage?.value.replace("SB", dataActor.characteristics.s.bonus)),
				qualities: Object.values(w.properties.qualities).map(q => q.display).concat(Object.values(w.properties.flaws).map(f => f.display)).join(", "),
				description: (w.range.bands ? `
<div style='display: flex; justify-content: center;'>
	<table style='border: 1px solid var(--color-large_border); border-collapse: collapse; font-size: 12px;'>
		<thead style='border-bottom: 1px dashed var(--color-small_border);'>
			<tr>
				<th style='text-align: center; border-right: 1px solid var(--color-small_border);'><strong>${game.i18n.localize("Point Blank")}</strong></th>
				<th style='text-align: center; border-right: 1px solid var(--color-small_border);'><strong>${game.i18n.localize("Short Range")}</strong></th>
				<th style='text-align: center; border-right: 1px solid var(--color-small_border);'><strong>${game.i18n.localize("Normal")}</strong></th>
				<th style='text-align: center; border-right: 1px solid var(--color-small_border);'><strong>${game.i18n.localize("Long Range")}</strong></th>
				<th style='text-align: center;'><strong>${game.i18n.localize("Extreme")}</strong></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td style='text-align: center; border-right: 1px solid var(--color-small_border);'>${w.range.bands[game.i18n.localize("Point Blank")].range[0]}-${w.range.bands[game.i18n.localize("Point Blank")].range[1]} (${w.range.bands[game.i18n.localize("Point Blank")].modifier >= 0 ? "+" + w.range.bands[game.i18n.localize("Point Blank")].modifier : w.range.bands[game.i18n.localize("Point Blank")].modifier})</td>
				<td style='text-align: center; border-right: 1px solid var(--color-small_border);'>${w.range.bands[game.i18n.localize("Short Range")].range[0]}-${w.range.bands[game.i18n.localize("Short Range")].range[1]} (${w.range.bands[game.i18n.localize("Short Range")].modifier >= 0 ? "+" + w.range.bands[game.i18n.localize("Short Range")].modifier : w.range.bands[game.i18n.localize("Short Range")].modifier})</td>
				<td style='text-align: center; border-right: 1px solid var(--color-small_border);'>${w.range.bands[game.i18n.localize("Normal")].range[0]}-${w.range.bands[game.i18n.localize("Normal")].range[1]} (${w.range.bands[game.i18n.localize("Normal")].modifier >= 0 ? "+" + w.range.bands[game.i18n.localize("Normal")].modifier : w.range.bands[game.i18n.localize("Normal")].modifier})</td>
				<td style='text-align: center; border-right: 1px solid var(--color-small_border);'>${w.range.bands[game.i18n.localize("Long Range")].range[0]}-${w.range.bands[game.i18n.localize("Long Range")].range[1]} (${w.range.bands[game.i18n.localize("Long Range")].modifier >= 0 ? "+" + w.range.bands[game.i18n.localize("Long Range")].modifier : w.range.bands[game.i18n.localize("Long Range")].modifier})</td>
				<td style='text-align: center;'>${w.range.bands[game.i18n.localize("Extreme")].range[0]}-${w.range.bands[game.i18n.localize("Extreme")].range[1]} (${w.range.bands[game.i18n.localize("Extreme")].modifier >= 0 ? "+" + w.range.bands[game.i18n.localize("Extreme")].modifier : w.range.bands[game.i18n.localize("Extreme")].modifier})</td>
			</tr>
		</tbody>
	</table>
</div>` : "") + `<h4>${game.i18n.localize("Description")}</h4>${await DataMapper.getDescription(w.description.value)}`
			})))).concat(await Promise.all(dataActor._itemTypes.ammunition.filter(a => !a.location.value).map(async (a) => ({
				name: (a.quantity.value != 1 ? a.quantity.value + "x " : "") + a.name,
				image: await DataMapper.getImage(a.img),
				group: a.trappingCategory,
				encumbrance: a.encumbrance.total == a.encumbrance.value ? a.encumbrance.total : `${a.encumbrance.total} (${a.encumbrance.value})`,
				reach:  "-",
				damage: a.damage?.value ? "+" + eval(a.damage?.value.replace("SB", dataActor.characteristics.s.bonus)) : "-",
				qualities: Object.values(a.properties.qualities).map(q => q.display).concat(Object.values(a.properties.flaws).map(f => f.display)).join(", "),
				description: `<h4>${game.i18n.localize("Description")}</h4>${await DataMapper.getDescription(a.description.value)}`
			}))));
			//Calc weapons encumbrance
			for (let i = 0; i < data.weapons.length; i++) {
				data.encumbrance.weapons += parseFloat(data.weapons[i].encumbrance);
			};

			//Trappings
			data.trappings = (await DataMapper.getContainersData(dataActor._itemTypes.container, dataActor)).concat(await DataMapper.getItemsData(dataActor._itemTypes.trapping, dataActor));
			//Calc trappings encumbrance
			for (let i = 0; i < data.trappings.length; i++) {
				data.encumbrance.trappings += parseFloat(data.trappings[i].encumbrance);
			};

			//Magics
			data.magics = (await Promise.all(dataActor._itemTypes.spell.map(async (s) => ({
				name: s.name,
				image: await DataMapper.getImage(s.img),
				cn: s.cn.value,
				lore: game.wfrp4e.config.magicLores[s.lore.value],
				range: s.Range,
				target: s.Target,
				duration: s.Duration,
				description: `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(s.description.value)
			})))).concat(await Promise.all(dataActor._itemTypes.prayer.map(async (p) => ({
				name: p.name,
				image: await DataMapper.getImage(p.img),
				cn: "-",
				lore: `${game.wfrp4e.config.prayerTypes[p.prayerType.value]} (${dataActor.details.god.value})`,
				range: p.Range,
				target: p.Target,
				duration: p.Duration,
				description: `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(p.description.value)
			}))));
		};

		return data;
	};

	static async getDescription(text) {
		let result;
		if (!text || text == "<p></p>") {result = `<p><em>${game.i18n.localize("WFRP4E.PrintSheet.Empty")}</em></p>`}
		else {
			result = (await foundry.applications.ux.TextEditor.implementation.enrichHTML(text)).replaceAll("\"", "'");
			let links = [];
			result.replace(/src='(.*?)'/g, (match, oldLink) => {links.push(oldLink)});
			let i = 0;
			for (i; i < links.length; i++) {links[i] = await DataMapper.getImage(links[i])};
			i = -1;
			result = result.replace(/src='(.*?)'/g, () => {
				i++;
				return `src='${links[i]}'`;
			});
		};
		return result;
	};

	static async getImage(url) {
		if (url != "systems/wfrp4e/icons/blank.png" && game.settings.get("wfrp4e-print-sheet", "embedimages")) {
			url = game.settings.get("wfrp4e-print-sheet", "conection") + url;
			return new Promise((resolve, reject) => {
				var xhr = new XMLHttpRequest();
				xhr.onload = function () {
					var reader = new FileReader();
					reader.onloadend = function () {resolve(reader.result)};
					reader.readAsDataURL(xhr.response);
				};
				xhr.onerror = reject;
				xhr.open("GET", url);
				xhr.responseType = "blob";
				xhr.send();
			});
		} else {return false};
	};

	static async getContainersData(containers, actor = {}, location) {
		let resultData = [];
		for (let i = 0; i < containers.length; i++) {
			if (!containers[i].location.value || containers[i].location.value == location) {
				resultData.push({
					name: `${containers[i].name} (${containers[i].carries.current}/${containers[i].carries.value})`,
					image: await DataMapper.getImage(containers[i].img),
					encumbrance: containers[i].encumbrance.total == containers[i].encumbrance.value ? containers[i].encumbrance.total : `${containers[i].encumbrance.total} (${containers[i].encumbrance.value})`,
					carrying: (await DataMapper.getContainersData(containers[i].system.packsInside, actor, containers[i].id)).concat(await DataMapper.getItemsData(containers[i].system.carrying, actor, containers[i].id)),
					qualities: "",
					description:  `<h4>${game.i18n.localize("Description")}</h4>` + await DataMapper.getDescription(containers[i].description.value)
				});
			};
		};
		return resultData;
	};

	static async getItemsData(items, actor = {}, location) {
		let resultData = [];
		for (let i = 0; i < items.length; i++) {
			if (items[i].type != "money" && (!items[i].location.value || items[i].location.value == location)) {
				let item = {
					name: (items[i].quantity.value != 1 ? items[i].quantity.value + "x " : "") + items[i].name,
					image: await DataMapper.getImage(items[i].img),
					encumbrance: items[i].encumbrance.total == items[i].encumbrance.value ? items[i].encumbrance.total : `${items[i].encumbrance.total} (${items[i].encumbrance.value})`,
					qualities: Object.values(items[i].properties.qualities).map(q => q.display).concat(Object.values(items[i].properties.flaws).map(f => f.display)).join(", "),
					description: `<h4>${game.i18n.localize("Description")}</h4>${await DataMapper.getDescription(items[i].description.value)}`
				};
				if (items[i].type == "armour" || items[i].type == "wfrp4e-archives3.armour") {
					item.description = `<p><strong>${game.i18n.localize("Location")}</strong>: ${Object.keys(items[i].currentAP).map((key, index) => Object.values(items[i].currentAP)[index] ? `${game.wfrp4e.config.locations[key]} (${Object.values(items[i].currentAP)[index]})` : false).filter(Boolean).join(", ")}</p>${item.description}`;
				} else if (items[i].type == "weapon") {
					item.description = `<p><strong>${game.i18n.localize("Group")}</strong>: ${items[i].WeaponGroup}</p>` + (items[i].range.bands ? `
<div style='display: flex; justify-content: center;'>
	<table style='border: 1px solid var(--color-large_border); border-collapse: collapse; font-size: 12px;'>
		<thead style='border-bottom: 1px dashed var(--color-small_border);'>
			<tr>
				<th style='text-align: center; border-right: 1px solid var(--color-small_border);'><strong>${game.i18n.localize("Point Blank")}</strong></th>
				<th style='text-align: center; border-right: 1px solid var(--color-small_border);'><strong>${game.i18n.localize("Short Range")}</strong></th>
				<th style='text-align: center; border-right: 1px solid var(--color-small_border);'><strong>${game.i18n.localize("Normal")}</strong></th>
				<th style='text-align: center; border-right: 1px solid var(--color-small_border);'><strong>${game.i18n.localize("Long Range")}</strong></th>
				<th style='text-align: center;'><strong>${game.i18n.localize("Extreme")}</strong></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td style='text-align: center; border-right: 1px solid var(--color-small_border);'>${items[i].range.bands[game.i18n.localize("Point Blank")].range[0]}-${items[i].range.bands[game.i18n.localize("Point Blank")].range[1]} (${items[i].range.bands[game.i18n.localize("Point Blank")].modifier >= 0 ? "+" + items[i].range.bands[game.i18n.localize("Point Blank")].modifier : items[i].range.bands[game.i18n.localize("Point Blank")].modifier})</td>
				<td style='text-align: center; border-right: 1px solid var(--color-small_border);'>${items[i].range.bands[game.i18n.localize("Short Range")].range[0]}-${items[i].range.bands[game.i18n.localize("Short Range")].range[1]} (${items[i].range.bands[game.i18n.localize("Short Range")].modifier >= 0 ? "+" + items[i].range.bands[game.i18n.localize("Short Range")].modifier : items[i].range.bands[game.i18n.localize("Short Range")].modifier})</td>
				<td style='text-align: center; border-right: 1px solid var(--color-small_border);'>${items[i].range.bands[game.i18n.localize("Normal")].range[0]}-${items[i].range.bands[game.i18n.localize("Normal")].range[1]} (${items[i].range.bands[game.i18n.localize("Normal")].modifier >= 0 ? "+" + items[i].range.bands[game.i18n.localize("Normal")].modifier : items[i].range.bands[game.i18n.localize("Normal")].modifier})</td>
				<td style='text-align: center; border-right: 1px solid var(--color-small_border);'>${items[i].range.bands[game.i18n.localize("Long Range")].range[0]}-${items[i].range.bands[game.i18n.localize("Long Range")].range[1]} (${items[i].range.bands[game.i18n.localize("Long Range")].modifier >= 0 ? "+" + items[i].range.bands[game.i18n.localize("Long Range")].modifier : items[i].range.bands[game.i18n.localize("Long Range")].modifier})</td>
				<td style='text-align: center;'>${items[i].range.bands[game.i18n.localize("Extreme")].range[0]}-${items[i].range.bands[game.i18n.localize("Extreme")].range[1]} (${items[i].range.bands[game.i18n.localize("Extreme")].modifier >= 0 ? "+" + items[i].range.bands[game.i18n.localize("Extreme")].modifier : items[i].range.bands[game.i18n.localize("Extreme")].modifier})</td>
			</tr>
		</tbody>
	</table>
</div>` : `<p><strong>${game.i18n.localize("Length")}</strong>: ${items[i].Reach || items[i].Range}</p>`) + `<p><strong>${game.i18n.localize("Damage")}</strong>: ${"+" + eval(items[i].damage?.value.replace("SB", actor.characteristics.s.bonus))}</p>${item.description}`;
				} else if (items[i].type == "ammunition") {
					item.description = `<p><strong>${game.i18n.localize("Length")}</strong>: ${items[i].range.value}</p>` + `<p><strong>${game.i18n.localize("Damage")}</strong>: ${"+" + eval(items[i].damage?.value.replace("SB", actor.characteristics.s.bonus) || 0)}</p>${item.description}`;
				};
				resultData.push(item);
			};
		};
		return resultData;
	};

	static getExportData(actor) {
		let data = actor.toCompendium(null, {clearSource: false});
		data._stats ??= {};
		data._stats.exportSource = {
			worldId: game.world.id,
			uuid: actor.uuid,
			coreVersion: game.version,
			systemId: game.system.id,
			systemVersion: game.system.version
		};
		return JSON.stringify(data, null, 2);
	};
};

class HTMLSheet extends FormApplication {
    constructor(object = {}, options = {}) {super(object, options)};

    static async constructHTML(data, template) {
        let htmlForm = await (new HTMLSheet(data, {template}))._renderInner(data, {template});

        let result = "<head>\n\t<meta charset=\"UTF-8\">\n\t<title>" + data.name + "</title>\n\t<link rel=\"icon\" type=\"image/png\" href=\"" + data.image + "\">\n\t<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css\" integrity=\"sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"/>\n</head>\n<body>\n";
		for (let i = 0; i < htmlForm.length; i++) {
			if (htmlForm[i].outerHTML != undefined) {result += "\t" + htmlForm[i].outerHTML + "\n"};
        };
        result += "</body>";

        return result;
    }
};

function createTrappingsElem(trappings, options) {
	let result = "";
	let layer = options.hash.layer || 0;
	let parent = options.hash.parent || "";
	for (let i = 0; i < trappings.length; i++) {
		result += `
					<div style="margin-left: ${Math.max(layer - 1, 0) * 10}px;" class="item trappings ${layer ? "layer": ""} tooltip-target" data-tooltip="${trappings[i].description}">`;
		if (trappings[i].image) {
			result += `
						<img style="width: 20px;" src="${trappings[i].image}">
						<input style="width: calc(80% - 20px - ${layer * 10}px);" id="trapping.${parent ? `${parent}_${i}` : i}.name" value="${trappings[i].name}">`;
		} else {
			result += `
						<input style="width: calc(80% - ${layer * 10}px)" id="trapping.${parent ? `${parent}_${i}` : i}.name" value="${trappings[i].name}">`;
		};
		result += `
						<input style="width: 20%;" id="trapping.${parent ? `${parent}_${i}` : i}.encumbrance" value="${trappings[i].encumbrance}">
						<input style="display: none;" id="trapping.${parent ? `${parent}_${i}` : i}.qualities" data-type="qualities" value="${trappings[i].qualities}">
					</div>`;
		if (trappings[i].carrying?.length) {
			options.hash.layer = layer + 1;
			options.hash.parent = parent ? `${parent}:${i}` : "c:" + i;
			result += createTrappingsElem(trappings[i].carrying, options);
		};
	};
	return result;
};
Handlebars.registerHelper("createTrappingsElem", function(trappings, options) {return new Handlebars.SafeString(createTrappingsElem(trappings, options))});