export function prizeText(list,modeActions,selectArr){
	let num = null;
	let bonusTypeNum = modeActions.win == 0 ? "gjj" : "gfd";
	
	let selectNumArr = Object.keys(selectArr).length ? selectArr.format.full : [];
	
	let oddsType = list.oddsType;
	let divisor = modeActions.mode == 1 ? 1 : modeActions.mode == 2 ? 10 : 100;
	if( oddsType == 0 ){
		num = list.oddsArr[0][bonusTypeNum]*10000/(divisor*10000);
	}else if( oddsType == 1 ){
		if( selectNumArr.length == 0 ){
			let newArr = [];
			for(let i = 0; i < list.oddsArr.length; i++){
				newArr.push(list.oddsArr[i][bonusTypeNum] * 1);
			}
			newArr = Array.from(new Set(newArr));
			num = newArr.length == 1 ? newArr[0] : Math.min.apply(null, newArr)*10000/(divisor*10000) + '-' + Math.max.apply(null, newArr)*10000/(divisor*10000);
		}else{
			let arr = selectNumArr;
			let newArr = [];
			if(arr.length == 0){
				for(let i = 0; i < list.oddsArr.length; i++){
					newArr.push(list.oddsArr[i][bonusTypeNum] * 1);
				}
				num = Math.min.apply(null, newArr)*10000/(divisor*10000) + '-' + Math.max.apply(null, newArr)*10000/(divisor*10000);
			}else{
				for(let i = 0; i < arr.length; i++){
					for(let j = 0; j < list.oddsArr.length; j++){
						if(arr[i] == list.oddsArr[j].hm){
							newArr.push(list.oddsArr[j][bonusTypeNum]*1);
						}
					}
				}
				newArr = Array.from(new Set(newArr));
				num = newArr.length == 1 ? newArr[0] : Math.min.apply(null, newArr)*10000/(divisor*10000) + '-' + Math.max.apply(null, newArr)*10000/(divisor*10000);
			}
		}
	}else{
		let newArr = [];
		for(let i = 0; i < list.oddsArr.length; i++){
			newArr.push(list.oddsArr[i][bonusTypeNum] * 1);
		}
		num = Math.min.apply(null, newArr)*10000/(divisor*10000) + '-' + Math.max.apply(null, newArr)*10000/(divisor*10000);
	}
	return num + '元';
}


