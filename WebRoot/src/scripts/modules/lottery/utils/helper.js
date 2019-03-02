export  function range(start, to, step = 1) {
  let nums = [];
  for (let i = start; i <= to; i += step) {
    nums.push(i);
  }

  return nums;
}

// number: 佰:2,3|拾:3,5
export function unserializeContent(number) {
  let parts = number.split('|');
  let unserializeContent = {};
  for (let part of parts) {
    let subParts = part.split(':');
    let nums = [];
    if (subParts[1] && subParts[1].trim().length > 0) {
      nums = subParts[1].split(',');
    }
    unserializeContent[subParts[0]] = nums.map( num => num * 1);
  }

  return unserializeContent;
}

// nuumbers: {'佰': [2,3], '拾': [3,4]}
export function serializeContent(numbers) {
  let strs = [];
  for (let groupName in numbers) {
    strs.push(`${groupName}:` + numbers[groupName].join(',') );
  }

  return strs.join('|');
}

export function dingweiTotal(content) {
  var group = {};
  var total = 0;
  var parts = content.split('|');
  if (parts.length > 0 ) total = 1;
  for (var i = 0; i < parts.length; i++){
    var ps = parts[i].split(':');
    if (typeof group[ps[0]] == 'undefined') {
      group[ps[0]] = [];
    }
    group[ps[0]] = group[ps[0]].concat(ps[1].split(','));
  }
  
  for (var key in group) {
    total *= group[key].length;
  }
  return total;
}

export function zuheTotal(content) {
  var group = {};
  var parts = content.split('|');
  var total = 0;
  if(parts.length > 0) total = 1;
  for (var i = 0; i < parts.length; i++){
    var ps = parts[i].split(':');
    if (typeof group[ps[0]] == 'undefined') {
      group[ps[0]] = [];
    }
    group[ps[0]] = group[ps[0]].concat(ps[1].split(','));
  }
  
  var group1 = null;
  var group2 = null
  for (var key in group) {
    if (group1 == null) {
      group1 = group[key];
    } else if (group2 ==null) {
      group2 = group[key];
    }
  }
  
  // 组合总数计算公式 : len1 * len2 - (samelen * (samelen -1 ) / 2 )
  var samelen = 0;
  for (var i = 0; i < group1.length; i++) {
    if (group2.indexOf(group1[i]) != -1 ) {
      samelen ++ ;
    }
  }
  
  return group1.length * group2.length -  (samelen * (samelen - 1 ) / 2 );
}