function predict(){
	predictions = []
	pTown = copyArray(towns)
	pCurTown = 0
	pStats = copyArray(stats)
	totalMana = 250
	totalGold = 0
	tempGain = 0

	function pManaCost(stat){
		return Math.ceil((tAction.manaCost()*stat[1])/(1 + getLevelFromExp(pStats[stat[0]].exp)/100))
	}
	
	function pExpGain(stat){
		return tAction.manaCost()*stat[1]*(1+Math.pow(getLevelFromTalent(pStats[stat[0]].talent),0.4)/3)
	}
	
	function pTalentGain(stat){
		pStats[stat[0]].exp += tAction.manaCost()*stat[1]*(1+Math.pow(getLevelFromTalent(pStats[stat[0]].talent),0.4)/3)
		pStats[stat[0]].talent += pExpGain(stat)/100
		return pExpGain(stat)/100
	}
	
	function rewardFinish(varName, rewardRatio, reward) {
		const searchToggler = document.getElementById("searchToggler" + varName);
        if (pTown[pCurTown]["total" + varName] - pTown[pCurTown]["checked" + varName] > 0 && ((searchToggler && !searchToggler.checked) || pTown[pCurTown]["good" + varName] <= 0)) {
            pTown[pCurTown]["checked" + varName]++;
            if (pTown[pCurTown]["checked" + varName] % rewardRatio === 0) {
                tempGain += reward
                pTown[pCurTown]["good" + varName]++;
            }
        } else if (pTown[pCurTown]["good" + varName] > 0) {
            pTown[pCurTown]["good" + varName]--;
            tempGain += reward
        }
    }
	
	for(i = 0; i < actions.next.length; i++){
		if((actions.next[i].disabled != true) && (actions.next[i].loops > 0)){
			for(a = 0; a < towns[pCurTown].totalActionList.length; a++){
				if(actions.next[i].name == towns[pCurTown].totalActionList[a].name){
					pAction = {}
					pAction["name"] = actions.next[i].name
					pAction.mana = {}
					pAction.gold = {}
					pAction.resources = {}
					pAction.stats = {}
					pAction.mana["mana cost"] = 0
					pAction.mana["mana gain"] = 0
					pAction.mana["mana Netgain"] = 0
					pAction.mana["total mana"] = totalMana
					pAction.gold["gold gain"] = 0
					pAction.gold["total gold"] = 0
					pAction["loops"] = 0
			
					for(stat of Object.entries(pStats)){
						pAction.stats[stat[0]] = {}
						stat[1].exp = 0
						pAction.stats[stat[0]]["Exp Gain"] = 0
						pAction.stats[stat[0]]["Talent Gain"] = 0
					}
					
					tAction = towns[pCurTown].totalActionList[a]
					
					for(l = 0; l < actions.next[i].loops; l++){
						if(totalMana < 0){ break }
						
						pAction["loops"] += 1
						
						if(pAction.name == "Smash Pots"){
							pAction.Pots = {}
							
							rewardFinish("Pots", 10, goldCostSmashPots())
							pAction.mana["mana gain"] = tempGain
							
							for(stat of Object.entries(tAction.stats)){
								pAction.mana["mana cost"] += pManaCost(stat)
								pAction.mana["total mana"] -= pManaCost(stat)
								pAction.stats[stat[0]]["Exp Gain"] += pExpGain(stat)
								pAction.stats[stat[0]]["Talent Gain"] += pTalentGain(stat)
							}
						}
						
						pAction.mana["mana Netgain"] = pAction.mana["mana gain"] - pAction.mana["mana cost"]
						totalMana = pAction.mana["total mana"] + pAction.mana["mana gain"]
						pAction.mana["total mana"] = totalMana
					}
				}
			}
		}
		predictions.push(pAction)
		if(totalMana < 0){ break }
	}
	for(stat of Object.entries(pStats)){
		stat[1]["Talent Level"] = getLevelFromTalent(pStats[stat[0]].talent)
		stat[1]["Exp Level"] = getLevelFromExp(pStats[stat[0]].exp)
	}
	predictions["stats"] = pStats
	console.log(predictions)
}
