export default class DataMapper { 
	
	static mapSheetDataToDataExport(dataSheet = {}, type){
		let dataExport = {};
		
		dataExport.settings = {editable: "", inputcolor: "", type: game.i18n.localize("WFRP4E.PS.NPC")}
		if (game.settings.get("wfrp4e-print-sheet", "editable") == false) {dataExport.settings.editable = "disabled"}
		switch (game.settings.get("wfrp4e-print-sheet", "inputcolor")) {
			case 0:
				dataExport.settings.inputcolor = "darkred"
				break;
			case 1:
				dataExport.settings.inputcolor = "darkgreen"
				break;
			case 2:
				dataExport.settings.inputcolor = "darkblue"
				break;
			case 3:
				dataExport.settings.inputcolor = "black"
				break;
			case 4:
				dataExport.settings.inputcolor = game.settings.get("wfrp4e-print-sheet", "inputcolorcustom") || "darkred"
				break;
		}

		dataExport.player = dataSheet.name;
		dataExport.name = dataSheet.name;
		dataExport.race = dataSheet.Species;
		dataExport.gender = dataSheet.system.details.gender.value;
		dataExport.class = "-";
		dataExport.career = "-";
		dataExport.careerlevel = "-";
		dataExport.careerpath = "-";
		dataExport.status = dataSheet.system.details.status.value;
		dataExport.age = "-";
		dataExport.height = "-";
		dataExport.weight = "-";
		dataExport.haircolour = "-";
		dataExport.eyecolour = "-";
		
		dataExport.characteristics = {
			ws: {
				initial: dataSheet.system.characteristics.ws.initial,
				advances: dataSheet.system.characteristics.ws.advances,
				modifier: dataSheet.system.characteristics.ws.modifier,
				current: dataSheet.system.characteristics.ws.value
			},
			bs: {
				initial: dataSheet.system.characteristics.bs.initial,
				advances: dataSheet.system.characteristics.bs.advances,
				modifier: dataSheet.system.characteristics.bs.modifier,
				current: dataSheet.system.characteristics.bs.value
			},
			s: {
				initial: dataSheet.system.characteristics.s.initial,
				advances: dataSheet.system.characteristics.s.advances,
				modifier: dataSheet.system.characteristics.s.modifier,
				current: dataSheet.system.characteristics.s.value
			},
			t: {
				initial: dataSheet.system.characteristics.t.initial,
				advances: dataSheet.system.characteristics.t.advances,
				modifier: dataSheet.system.characteristics.t.modifier,
				current: dataSheet.system.characteristics.t.value
			},
			i: {
				initial: dataSheet.system.characteristics.i.initial,
				advances: dataSheet.system.characteristics.i.advances,
				modifier: dataSheet.system.characteristics.i.modifier,
				current: dataSheet.system.characteristics.i.value
			},
			ag: {
				initial: dataSheet.system.characteristics.ag.initial,
				advances: dataSheet.system.characteristics.ag.advances,
				modifier: dataSheet.system.characteristics.ag.modifier,
				current: dataSheet.system.characteristics.ag.value
			},
			dex: {
				initial: dataSheet.system.characteristics.dex.initial,
				advances: dataSheet.system.characteristics.dex.advances,
				modifier: dataSheet.system.characteristics.dex.modifier,
				current: dataSheet.system.characteristics.dex.value
			},
			int: {
				initial: dataSheet.system.characteristics.int.initial,
				advances: dataSheet.system.characteristics.int.advances,
				modifier: dataSheet.system.characteristics.int.modifier,
				current: dataSheet.system.characteristics.int.value
			},
			wp: {
				initial: dataSheet.system.characteristics.wp.initial,
				advances: dataSheet.system.characteristics.wp.advances,
				modifier: dataSheet.system.characteristics.wp.modifier,
				current: dataSheet.system.characteristics.wp.value
			},
			fel: {
				initial: dataSheet.system.characteristics.fel.initial,
				advances: dataSheet.system.characteristics.fel.advances,
				modifier: dataSheet.system.characteristics.fel.modifier,
				current: dataSheet.system.characteristics.fel.value
			}
		};
		
		dataExport.fate = {fortune: "-", fate: "-"};
		dataExport.resilience = {resolve: "-", resilience: "-", motivation: "-"};
		dataExport.experience = {current: "-", spent: "-", total: "-", log: "-"};
		dataExport.move = {movement: dataSheet.system.details.move.value, walk: dataSheet.system.details.move.walk, run: dataSheet.system.details.move.run};
		
		dataExport.skills = DataMapper.mapWFRP4eSkillsDataToDataExport(dataSheet.itemTypes.skill, dataSheet.system.characteristics, dataExport.settings.editable);
		dataExport.talents = DataMapper.mapWFRP4eTalentsDataToDataExport(dataSheet.itemTypes, dataExport.settings.editable);
		
		dataExport.ambitions = {personal: {short: "-", long: "-"}, party: {short: "-", long: "-"}};
		
		dataExport.armours = DataMapper.mapWFRP4eArmoursDataToDataExport(dataSheet.itemTypes.armour, dataExport.settings.editable);
		dataExport.avatar = dataSheet.img.slice(dataSheet.img.lastIndexOf("/") + 1);
		
		dataExport.trappings = DataMapper.mapWFRP4eTrappingsDataToDataExport(dataSheet.itemTypes, dataExport.settings.editable);
		
		dataExport.psychologys = []
		for (let i = 0; i < dataSheet.itemTypes.psychology.length ; i++) {
			dataExport.psychologys.push({name: dataSheet.itemTypes.psychology[i].name, editable: dataExport.settings.editable});
		}
		dataExport.mutations = []
		for (let i = 0; i < dataSheet.itemTypes.mutation.length ; i++) {
			dataExport.mutations.push({name: dataSheet.itemTypes.mutation[i].name, editable: dataExport.settings.editable});
		}
		
		dataExport.money = {bp: 0, ss: 0, gc: 0}
		for (let i = 0; i < dataSheet.itemTypes.money.length ; i++) {
			if (dataSheet.itemTypes.money[i].system.coinValue.value == "1") {
				dataExport.money.bp = dataExport.money.bp + dataSheet.itemTypes.money[i].system.quantity.value
			}
			else if (dataSheet.itemTypes.money[i].system.coinValue.value == "12") {
				dataExport.money.ss = dataExport.money.ss + dataSheet.itemTypes.money[i].system.quantity.value
			}
			else if (dataSheet.itemTypes.money[i].system.coinValue.value == "240") {
				dataExport.money.gc = dataExport.money.gc + dataSheet.itemTypes.money[i].system.quantity.value
			}
		}
		dataExport.encumbrance = {max: dataSheet.system.status.encumbrance.max, total: dataSheet.system.status.encumbrance.current};
		dataExport.wounds = {current: dataSheet.system.status.wounds.value, max: dataSheet.system.status.wounds.max};
		dataExport.criticals = DataMapper.mapWFRP4eCriticalsDataToDataExport(dataSheet.itemTypes, dataExport.settings.editable);
		
		dataExport.weapons = DataMapper.mapWFRP4eWeaponsDataToDataExport(dataSheet.itemTypes, dataExport.settings.editable);
		
		dataExport.magics = DataMapper.mapWFRP4eMagicsDataToDataExport(dataSheet.itemTypes, dataSheet.system.status.sin.value, dataExport.settings.editable);
		
		dataExport.notes = dataSheet.system.details.biography.value.replace(/<\/p><p>/g, "\n").replace(/<[^>]*>/g, "");
		
		if (type == "character") {
			dataExport.settings.type = ""

			dataExport.class = dataSheet.system.details.career.system.class.value;
			dataExport.career = dataSheet.system.details.career.name;
			dataExport.careerlevel = dataSheet.system.details.career.system.level.value;
			dataExport.careerpath = "";
			for (let i = 0; i < dataSheet.itemTypes.career.length ; i++) {
				dataExport.careerpath = dataExport.careerpath + dataSheet.itemTypes.career[i].name;
				if (i + 1 != dataSheet.itemTypes.career.length) {dataExport.careerpath = dataExport.careerpath + ", "};
			};
			dataExport.age = dataSheet.system.details.age.value;
			dataExport.height = dataSheet.system.details.height.value;
			dataExport.weight = dataSheet.system.details.weight.value;
			dataExport.haircolour = dataSheet.system.details.haircolour.value;
			dataExport.eyecolour = dataSheet.system.details.eyecolour.value;
			
			dataExport.fate = {fortune: dataSheet.system.status.fortune.value, fate: dataSheet.system.status.fate.value};
			dataExport.resilience = {resolve: dataSheet.system.status.resolve.value, resilience: dataSheet.system.status.resilience.value, motivation: dataSheet.system.details.motivation.value};
			dataExport.experience = {current: dataSheet.system.details.experience.current, spent: dataSheet.system.details.experience.spent, total: dataSheet.system.details.experience.total, log: ""};

			dataExport.ambitions = {personal: {short: dataSheet.system.details["personal-ambitions"]["short-term"], long: dataSheet.system.details["personal-ambitions"]["long-term"]}, party: {short: dataSheet.system.details["party-ambitions"]["short-term"], long: dataSheet.system.details["party-ambitions"]["long-term"]}};
			
			dataExport.experience.log = DataMapper.mapWFRP4eExperienceLogDataToDataExport(dataSheet.system.details.experience.log, dataExport.settings.editable);
		}

		return dataExport;
	}
	
	static mapWFRP4eSkillsDataToDataExport(dataWFRP4eSkills = {}, dataWFRP4eCharacteristics, editable) {
		let dataSkillsExport = {bsc1: [], bsc2: [], adv: []};
		for (let i = 0; i < dataWFRP4eSkills.length ; i++) {
			let characteristic = {name: "", value: ""}
			switch (dataWFRP4eSkills[i].system.characteristic.value) {
				case "ws":
					characteristic.name = game.i18n.localize("CHARAbbrev.WS");
					characteristic.value = dataWFRP4eCharacteristics.ws.value;
					break;
				case "bs":
					characteristic.name = game.i18n.localize("CHARAbbrev.BS");
					characteristic.value = dataWFRP4eCharacteristics.bs.value;
					break;
				case "s":
					characteristic.name = game.i18n.localize("CHARAbbrev.S");
					characteristic.value = dataWFRP4eCharacteristics.s.value;
					break;
				case "t":
					characteristic.name = game.i18n.localize("CHARAbbrev.T");
					characteristic.value = dataWFRP4eCharacteristics.t.value;
					break;
				case "i":
					characteristic.name = game.i18n.localize("CHARAbbrev.I");
					characteristic.value = dataWFRP4eCharacteristics.i.value;
					break;
				case "ag":
					characteristic.name = game.i18n.localize("CHARAbbrev.Ag");
					characteristic.value = dataWFRP4eCharacteristics.ag.value;
					break;
				case "dex":
					characteristic.name = game.i18n.localize("CHARAbbrev.Dex");
					characteristic.value = dataWFRP4eCharacteristics.dex.value;
					break;
				case "int":
					characteristic.name = game.i18n.localize("CHARAbbrev.Int");
					characteristic.value = dataWFRP4eCharacteristics.int.value;
					break;
				case "wp":
					characteristic.name = game.i18n.localize("CHARAbbrev.WP");
					characteristic.value = dataWFRP4eCharacteristics.wp.value;
					break;
				case "fel":
					characteristic.name = game.i18n.localize("CHARAbbrev.Fel");
					characteristic.value = dataWFRP4eCharacteristics.fel.value;
					break;
			}
			let dataSkillExport = {};
			dataSkillExport.name = dataWFRP4eSkills[i].name;
			dataSkillExport.characteristic = characteristic.name;
			dataSkillExport.characteristicValue = characteristic.value;
			dataSkillExport.advances = dataWFRP4eSkills[i].system.advances.value;
			dataSkillExport.total = dataWFRP4eSkills[i].system.total.value;
			
			dataSkillExport.editable = editable;
			if (dataWFRP4eSkills[i].system.advanced.value == "bsc" && dataWFRP4eSkills[i].system.grouped.value == "noSpec") {
				if (dataSkillsExport.bsc1.length > 11) {
					dataSkillsExport.bsc2.push(dataSkillExport);
				} else {
					dataSkillsExport.bsc1.push(dataSkillExport);
				}
			} else {
				dataSkillsExport.adv.push(dataSkillExport);
			}
		}
		return dataSkillsExport;
	}
	
	static mapWFRP4eTalentsDataToDataExport(dataWFRP4e = {}, editable) {
		let dataTalentsExport = [];
		for (let i = 0; i < dataWFRP4e.talent.length ; i++) {
			let dataTalentExport = {};
			dataTalentExport.name = dataWFRP4e.talent[i].name;
			dataTalentExport.advances = dataWFRP4e.talent[i].system.advances.value;
			dataTalentExport.description = dataWFRP4e.talent[i].system.tests.value;
			
			dataTalentExport.editable = editable;
			dataTalentsExport.push(dataTalentExport);
		}
		for (let i = 0; i < dataWFRP4e.trait.length ; i++) {
			let dataTalentExport = {};
			dataTalentExport.name = dataWFRP4e.trait[i].name;
			dataTalentExport.advances = "-";
			dataTalentExport.description = dataWFRP4e.trait[i].system.specification.value;
			
			dataTalentExport.editable = editable;
			dataTalentsExport.push(dataTalentExport);
		}
		return dataTalentsExport;
	}
	
	static mapWFRP4eArmoursDataToDataExport(dataWFRP4eArmours = {}, editable) {
		let dataArmoursExport = [];
		for (let i = 0; i < dataWFRP4eArmours.length ; i++) {
			let locations = ""
			let ap = 0
			if (dataWFRP4eArmours[i].system.AP.body > 0) {
				locations = locations + game.i18n.localize("WFRP4E.Locations.body")
				ap = Math.max(ap, dataWFRP4eArmours[i].system.AP.body)
			}
			if (dataWFRP4eArmours[i].system.AP.head > 0) {
				if (locations != "") {
					locations = locations + ", "
				}
				locations = locations + game.i18n.localize("WFRP4E.Locations.head")
				ap = Math.max(ap, dataWFRP4eArmours[i].system.AP.head)
			}
			if (dataWFRP4eArmours[i].system.AP.lArm > 0 || dataWFRP4eArmours[i].system.AP.rArm > 0) {
				if (locations != "") {
					locations = locations + ", "
				}
				locations = locations + game.i18n.localize("WFRP4E.Locations.arm")
				ap = Math.max(ap, dataWFRP4eArmours[i].system.AP.lArm)
				ap = Math.max(ap, dataWFRP4eArmours[i].system.AP.rArm)
			}
			if (dataWFRP4eArmours[i].system.AP.lLeg > 0 || dataWFRP4eArmours[i].system.AP.rLeg > 0) {
				if (locations != "") {
					locations = locations + ", "
				}
				locations = locations + game.i18n.localize("WFRP4E.Locations.leg")
				ap = Math.max(ap, dataWFRP4eArmours[i].system.AP.lLeg)
				ap = Math.max(ap, dataWFRP4eArmours[i].system.AP.rLeg)
			}
			let qualities = ""
			for (let a = 0; a < dataWFRP4eArmours[i].system.qualities.value.length ; a++) {
				if (qualities != "") {
					qualities = qualities + ", "
				}
				qualities = qualities + game.i18n.localize("PROPERTY." + dataWFRP4eArmours[i].system.qualities.value[a].name.charAt(0).toUpperCase() + dataWFRP4eArmours[i].system.qualities.value[a].name.slice(1))
			}
			for (let a = 0; a < dataWFRP4eArmours[i].system.flaws.value.length ; a++) {
				if (qualities != "") {
					qualities = qualities + ", "
				}
				qualities = qualities + game.i18n.localize("PROPERTY." + dataWFRP4eArmours[i].system.flaws.value[a].name.charAt(0).toUpperCase() + dataWFRP4eArmours[i].system.flaws.value[a].name.slice(1))
			}
			let dataArmourExport = {};
			dataArmourExport.name = dataWFRP4eArmours[i].name;
			dataArmourExport.locations = locations;
			dataArmourExport.encumbrance = dataWFRP4eArmours[i].system.encumbrance.value;
			dataArmourExport.ap = ap;
			dataArmourExport.qualities = qualities;
			
			dataArmourExport.editable = editable;
			dataArmoursExport.push(dataArmourExport);
		}
		return dataArmoursExport;
	}
	
	static mapWFRP4eTrappingsDataToDataExport(dataWFRP4e = {}, editable) {
		let dataTrappingsExport = [];
		let dataWFRP4eTrappings = dataWFRP4e.trapping.concat(dataWFRP4e.container)
		for (let i = 0; i < dataWFRP4eTrappings.length ; i++) {
			let dataTrappingExport = {};
			dataTrappingExport.name = dataWFRP4eTrappings[i].name;
			dataTrappingExport.encumbrance = dataWFRP4eTrappings[i].system.encumbrance.value;
			
			dataTrappingExport.editable = editable;
			dataTrappingsExport.push(dataTrappingExport);
		}
		return dataTrappingsExport;
	}
	
	static mapWFRP4eCriticalsDataToDataExport(dataWFRP4e = {}, editable) {
		let dataCriticalsExport = [];
		let dataWFRP4eCriticals = dataWFRP4e.critical.concat(dataWFRP4e.injury)
		for (let i = 0; i < dataWFRP4eCriticals.length ; i++) {
			let dataCriticalExport = {};
			dataCriticalExport.name = dataWFRP4eCriticals[i].name;
			dataCriticalExport.location = dataWFRP4eCriticals[i].system.location.value;
			
			dataCriticalExport.editable = editable;
			dataCriticalsExport.push(dataCriticalExport);
		}
		return dataCriticalsExport;
	}
	
	static mapWFRP4eWeaponsDataToDataExport(dataWFRP4e = {}, editable) {
		let dataWeaponsExport = [];
		let dataWFRP4eWeapons = dataWFRP4e.weapon.concat(dataWFRP4e.ammunition)
		for (let i = 0; i < dataWFRP4eWeapons.length ; i++) {
			let dataWeaponExport = {};
			dataWeaponExport.name = dataWFRP4eWeapons[i].name;
			dataWeaponExport.group =  game.i18n.localize("Ammunition");
			dataWeaponExport.encumbrance = dataWFRP4eWeapons[i].system.encumbrance.value;
			if (Object.hasOwn(dataWFRP4eWeapons[i].system, "weaponGroup")) {
				let group = dataWFRP4eWeapons[i].system.weaponGroup.value
				if (group == "twohanded") {group = "twoHanded"}
				dataWeaponExport.group = game.i18n.localize("SPEC." + group.charAt(0).toUpperCase() + group.slice(1))
			}
			dataWeaponExport.damage = dataWFRP4eWeapons[i].system.damage.dice + dataWFRP4eWeapons[i].system.damage.value;
			
			dataWeaponExport.reach = ""
			if (dataWFRP4eWeapons[i].system.range.value != "") {
				if (dataWFRP4eWeapons[i].system.range.value != "As weapon" || dataWFRP4eWeapons[i].system.range.value != "Half weapon" || dataWFRP4eWeapons[i].system.range.value != "Third weapon" || dataWFRP4eWeapons[i].system.range.value != "Quarter weapon" || dataWFRP4eWeapons[i].system.range.value != "Twice weapon") {dataWeaponExport.reach = game.i18n.localize(dataWFRP4eWeapons[i].system.range.value.toLowerCase())}
				else {dataWeaponExport.reach = game.i18n.localize(dataWFRP4eWeapons[i].system.range.value.toLowerCase())}
			}
			else {
				switch (dataWFRP4eWeapons[i].system.reach.value) {
					case "average":
						dataWeaponExport.reach = game.i18n.localize("WFRP4E.Reach.Average")
						break;
					case "long":
						dataWeaponExport.reach = game.i18n.localize("WFRP4E.Reach.Long")
						break;
					case "massive":
						dataWeaponExport.reach = game.i18n.localize("WFRP4E.Reach.Massive")
						break;
					case "personal":
						dataWeaponExport.reach = game.i18n.localize("WFRP4E.Reach.Personal")
						break;
					case "short":
						dataWeaponExport.reach = game.i18n.localize("WFRP4E.Reach.Short")
						break;
					case "vLong":
						dataWeaponExport.reach = game.i18n.localize("WFRP4E.Reach.VLong")
						break;
					case "vshort":
						dataWeaponExport.reach = game.i18n.localize("WFRP4E.Reach.VShort")
						break;
				}
			}
			
			let qualities = ""
			for (let a = 0; a < dataWFRP4eWeapons[i].system.qualities.value.length ; a++) {
				if (qualities != "") {
					qualities = qualities + ", "
				}
				qualities = qualities + game.i18n.localize("PROPERTY." + dataWFRP4eWeapons[i].system.qualities.value[a].name.charAt(0).toUpperCase() + dataWFRP4eWeapons[i].system.qualities.value[a].name.slice(1))
			}
			for (let a = 0; a < dataWFRP4eWeapons[i].system.flaws.value.length ; a++) {
				if (qualities != "") {
					qualities = qualities + ", "
				}
				qualities = qualities + game.i18n.localize("PROPERTY." + dataWFRP4eWeapons[i].system.flaws.value[a].name.charAt(0).toUpperCase() + dataWFRP4eWeapons[i].system.flaws.value[a].name.slice(1))
			}
			dataWeaponExport.qualities = qualities;
			
			dataWeaponExport.editable = editable;
			dataWeaponsExport.push(dataWeaponExport);
		}
		return dataWeaponsExport;
	}
	
	static mapWFRP4eMagicsDataToDataExport(dataWFRP4e = {}, sin, editable) {
		let dataMagicsExport = {list: [], sin: sin};
		for (let i = 0; i < dataWFRP4e.spell.length ; i++) {
			let dataMagicExport = {};
			dataMagicExport.name = dataWFRP4e.spell[i].name;
			dataMagicExport.cn = dataWFRP4e.spell[i].system.cn.value;
			dataMagicExport.range = dataWFRP4e.spell[i].system.range.value;
			dataMagicExport.target = dataWFRP4e.spell[i].system.target.value;
			dataMagicExport.duration = dataWFRP4e.spell[i].system.duration.value;
			dataMagicExport.type = game.i18n.localize("WFRP4E.MagicLores." + dataWFRP4e.spell[i].system.lore.value);
			
			dataMagicExport.editable = editable;
			dataMagicsExport.list.push(dataMagicExport);
		}
		for (let i = 0; i < dataWFRP4e.prayer.length ; i++) {
			let dataMagicExport = {};
			dataMagicExport.name = dataWFRP4e.prayer[i].name;
			dataMagicExport.cn = "-";
			dataMagicExport.range = dataWFRP4e.prayer[i].system.range.value;
			dataMagicExport.target = dataWFRP4e.prayer[i].system.target.value;
			dataMagicExport.duration = dataWFRP4e.prayer[i].system.duration.value;
			dataMagicExport.type = game.i18n.localize("WFRP4E.prayerTypes." + dataWFRP4e.prayer[i].system.type.value) + " (" + dataWFRP4e.prayer[i].system.god.value + ")";
			
			dataMagicExport.editable = editable;
			dataMagicsExport.list.push(dataMagicExport);
		}
		return dataMagicsExport;
	}
	
	static mapWFRP4eExperienceLogDataToDataExport(dataWFRP4e = {}, editable) {
		let dataExperienceLogExport = [];
		for (let i = 0; i < dataWFRP4e.length ; i++) {
			let dataLogExport = {};
			dataLogExport.reason = dataWFRP4e[i].reason;
			dataLogExport.amount = dataWFRP4e[i].amount;
			if (dataWFRP4e[i].type == "spent") {dataLogExport.amount = dataLogExport.amount * -1}
			
			dataLogExport.editable = editable;
			dataExperienceLogExport.push(dataLogExport);
		}
		return dataExperienceLogExport;
	}
}