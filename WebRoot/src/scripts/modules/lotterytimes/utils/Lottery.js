
if (typeof Object.keys == 'undefined') {
	Object.keys = function (obj) {
		var keys = [];
		for (var key in obj) {
			keys.push(key);
		}

		return keys;
	}
}

function res(data, msg) {
	msg = msg || '';
	var r = {
		data: data,
		msg: msg,
		code: 200
	};
	return JSON.stringify(r);
}

function error(msg) {
	return JSON.stringify({
		data: '',
		msg: msg,
		code: 500
	});
}

// 彩票游戏代码
var LOTTERY_SSC = 'ssc', // 时时彩
	LOTTERY_PK10 = 'pk10', // pk10 
	LOTTERY_FFC = 'ffc', // 分分彩 
	LOTTERY_K3 = 'k3', // 快三
	LOTTERY_11X5 = 'syxw', // 11x5 
	LOTTERY_LHC = 'lhc',
	LOTTERY_28 = '28', // 幸运28
	LOTTERY_3D = '3d'; // 福彩3d / 排列3

// ssc 玩法
// ssc 玩法 - 五星
var GAMECODE_WX_ZX_FS = '5x_zx_fs'; // 五星直选复式
var GAMECODE_WX_ZX_DS = '5x_zx_ds';// 五星直选单式
var GAMECODE_WX_ZX_ZX5 = '5x_zux_zux5'; // 五星组选组选5
var GAMECODE_WX_ZX_ZX10 = '5x_zux_zux10'; // 五星组选组选10
var GAMECODE_WX_ZX_ZX20 = '5x_zux_zux20'; // 五星组选组选20
var GAMECODE_WX_ZX_ZX30 = '5x_zux_zux30'; // 五星组选组选30
var GAMECODE_WX_ZX_ZX60 = '5x_zux_zux60'; // 五星组选组选30
var GAMECODE_WX_ZX_ZX120 = '5x_zux_zux120'; // 五星组选组选120
var GAMECODE_WX_QW_YFFS = '5x_qw_yffs'; // 五星趣味一帆风顺
var GAMECODE_WX_QW_HSCS = '5x_qw_hscs'; // 五星趣味好事成双
var GAMECODE_WX_QW_SXBX = '5x_qw_sxbx'; // 五星趣味三星报喜
var GAMECODE_WX_QW_SJFC = '5x_qw_sjfc'; // 五星趣味四季发财
var GAMECODE_WX_BDW_YMBDW = '5x_bdw_ymbdw'; // 五星不定位一码不定位
var GAMECODE_WX_BDW_EMBDW = '5x_bdw_ermbdw'; // 五星不定位二码不定位
var GAMECODE_WX_BDW_SMBDW = '5x_bdw_smbdw'; // 五星不定位三码不定位

// ssc玩法 - 前四
var GAMECODE_QS_ZX_FS = 'q4_zx_fs'; // 前四直选复式
var GAMECODE_QS_ZX_ZX4 = 'q4_zux_zux4'; // 前四组选组选4
var GAMECODE_QS_ZX_ZX6 = 'q4_zux_zux6'; // 前四组选组选6
var GAMECODE_QS_ZX_ZX12 = 'q4_zux_zux12'; // 前四组选组选12
var GAMECODE_QS_ZX_ZX24 = 'q4_zux_zux24'; // 前四组选组选24
var GAMECODE_QS_BDW_YMBDW = 'q4_bdw_1mbdw'; // 前四不定位一码不定位
var GAMECODE_QS_BDW_EMBDW = 'q4_bdw_2mbdw'; // 前四不定位二码不定位

// ssc 玩法 - 后四
var GAMECODE_HS_ZX_FS = 'h4_zx_fs'; // 前四直选单式
var GAMECODE_HS_ZX_ZX4 = 'h4_zux_zux4'; // 前四组选组选4
var GAMECODE_HS_ZX_ZX6 = 'h4_zux_zux6'; // 前四组选组选6
var GAMECODE_HS_ZX_ZX12 = 'h4_zux_zux12'; // 前四组选组选12
var GAMECODE_HS_ZX_ZX24 = 'h4_zux_zux24'; // 前四组选组选24
var GAMECODE_HS_BDW_YMBDW = 'h4_bdw_1mbdw'; // 前四不定位一码不定位
var GAMECODE_HS_BDW_EMBDW = 'h4_bdw_2mbdw'; // 前四不定位二码不定位

// ssc玩法 - 前三
var GAMECODE_QSAN_ZX_FS = 'q3_zx_fs'; // 前三直选单式
var GAMECODE_QSAN_ZX_HZ = 'q3_zx_hz'; // 前三直选和值
var GAMECODE_QSAN_ZX_KD = 'q3_zx_kd'; // 前三直选跨度
var GAMECODE_QSAN_ZX_ZS = 'q3_zux_zu3'; // 前三组选组三
var GAMECODE_QSAN_ZX_ZL = 'q3_zux_zu6'; // 前三组选组六
var GAMECODE_QSAN_ZUX_HZ = 'q3_zux_hz'; // 前三组选和值
var GAMECODE_QSAN_ZUX_BD = 'q3_zux_bd'; // 前三组选包胆
var GAMECODE_QSAN_ZUX_HHZX = 'qsan_zux_hhzx'; // 前三组选混合组选
var GAMECODE_QSAN_BDW_YMBDW = 'q3_bdw_1mbdw'; // 前三不定位一码不定位
var GAMECODE_QSAN_BDW_EMBDW = 'q3_bdw_2mbdw'; // 前三不定位二码不定位

// ssc玩法 - 中三
var GAMECODE_ZSAN_ZX_FS = 'z3_zx_fs'; // 中三直选单式
var GAMECODE_ZSAN_ZX_HZ = 'z3_zx_hz'; // 中三直选和值
var GAMECODE_ZSAN_ZX_KD = 'z3_zx_kd'; // 中三直选跨度
var GAMECODE_ZSAN_ZX_ZS = 'z3_zux_zu3'; // 中三组选组三
var GAMECODE_ZSAN_ZX_ZL = 'z3_zux_zu6'; // 中三组选组六
var GAMECODE_ZSAN_ZUX_HZ = 'z3_zux_hz'; // 中三组选和值
var GAMECODE_ZSAN_ZUX_BD = 'z3_zux_bd'; // 中三组选包胆
var GAMECODE_ZSAN_ZUX_HHZX = 'zsan_zux_hhzx'; // 中三组选混合组选
var GAMECODE_ZSAN_BDW_YMBDW = 'z3_bdw_1mbdw'; // 中三不定位一码不定位
var GAMECODE_ZSAN_BDW_EMBDW = 'z3_bdw_2mbdw'; // 中三不定位二码不定位

// ssc玩法 - 后三
var GAMECODE_HSAN_ZX_FS = 'h3_zx_fs'; // 后三直选复式
var GAMECODE_HSAN_ZX_HZ = 'h3_zx_hz'; // 后三直选和值
var GAMECODE_HSAN_ZX_KD = 'h3_zx_kd'; // 后三直选跨度
var GAMECODE_HSAN_ZX_ZS = 'h3_zux_zu3'; // 后三组选组三
var GAMECODE_HSAN_ZX_ZL = 'h3_zux_zu6'; // 后三组选组六
var GAMECODE_HSAN_ZUX_HZ = 'h3_zux_hz'; // 后三组选和值
var GAMECODE_HSAN_ZUX_BD = 'h3_zux_bd'; // 后三组选包胆
var GAMECODE_HSAN_ZUX_HHZX = 'hsan_zux_hhzx'; // 后三组选混合组选
var GAMECODE_HSAN_BDW_YMBDW = 'h3_bdw_1mbdw'; // 后三不定位一码不定位
var GAMECODE_HSAN_BDW_EMBDW = 'h3_bdw_2mbdw'; // 后三不定位二码不定位

// ssc玩法 - 前二
var GAMECODE_QE_ZX_FS = 'q2_zx_fs'; // 前二直选复式
var GAMECODE_QE_ZX_HZ = 'q2_zx_hz'; // 前二直选和值
var GAMECODE_QE_ZX_KD = 'q2_zx_kd';// 前二直选跨度
var GAMECODE_QE_ZUX_FS = 'q2_zux_fs'; // 前二组选复式
var GAMECODE_QE_ZUX_HZ = 'q2_zux_hz'; // 前二组选和值
var GAMECODE_QE_ZUX_BD = 'q2_zux_bd'; // 前二组选包胆

// ssc玩法 - 后二
var GAMECODE_HE_ZX_FS = 'h2_zx_fs'; // 后二直选复式
var GAMECODE_HE_ZX_HZ = 'h2_zx_hz'; // 后二直选和值
var GAMECODE_HE_ZX_KD = 'h2_zx_kd';// 后二直选跨度
var GAMECODE_HE_ZUX_FS = 'h2_zux_fs'; // 后二组选复式
var GAMECODE_HE_ZUX_HZ = 'h2_zux_hz'; // 后二组选和值
var GAMECODE_HE_ZUX_BD = 'h2_zux_bd'; // 后二组选包胆

// ssc玩法 - 定位胆
var GAMECODE_DWD_DWD_DWD = 'dwd_dwd_dwd'; // 定位胆定位胆定位胆

// ssc玩法 - 任选
var GAMECODE_RX_RX2_ZXFS = 'rx_rx2_zxfs'; // 任选任选二直选复式
var GAMECODE_RX_RX2_ZUXFS = 'rx_rx2_zuxfs'; // 任选任选二组选复式
var GAMECODE_RX_RX3_ZXFS = 'rx_rx3_zxfs'; // 任选任选三直选复式
var GAMECODE_RX_RX3_ZS = 'rx_rx3_zu3'; // 任选任选三组三
var GAMECODE_RX_RX3_ZL = 'rx_rx3_zu6'; // 任选任选三组六
var GAMECODE_RX_RX3_HHZX = 'rx_rx3_hhzx'; // 任选任选三混合组选
var GAMECODE_RX_RX4_ZXFS = 'rx_rx4_zxfs'; // 任选任选四组选复式

// ssc玩法 - 龙虎
var GAMECODE_LHH_WQ = 'lh_lhh_wq'; // 龙虎和万千
var GAMECODE_LHH_WB = 'lh_lhh_wb'; // 龙虎和万百
var GAMECODE_LHH_WS = 'lh_lhh_ws'; // 龙虎和万十
var GAMECODE_LHH_WG = 'lh_lhh_wg'; // 龙虎和万个
var GAMECODE_LHH_QB = 'lh_lhh_qb'; // 龙虎和千百
var GAMECODE_LHH_QS = 'lh_lhh_qs'; // 龙虎和千十
var GAMECODE_LHH_QG = 'lh_lhh_qg'; // 龙虎和千个
var GAMECODE_LHH_BS = 'lh_lhh_bs'; // 龙虎和百十
var GAMECODE_LHH_BG = 'lh_lhh_bg'; // 龙虎和百个
var GAMECODE_LHH_SG = 'lh_lhh_sg'; // 龙虎和十个

// ssc玩法 - 微信玩法
var GAMECODE_WX_DXDS_W = 'wxwf_dxds_wan'; // 微信大小单双万
var GAMECODE_WX_DXDS_Q = 'wxwf_dxds_qian'; // 微信大小单双千
var GAMECODE_WX_DXDS_B = 'wxwf_dxds_bai'; // 微信大小单双百
var GAMECODE_WX_DXDS_S = 'wxwf_dxds_shi'; // 微信大小单双十
var GAMECODE_WX_DXDS_G = 'wxwf_dxds_ge'; // 微信大小单双个
var GAMECODE_WX_TM_TM = 'wxwf_tm_tm'; // 微信特码特码

// ssc玩法 - 斗牛
var GAMECODE_DN_NN = 'dx_nn'; // 斗牛牛牛
var GAMECODE_DN_DXDS = 'dx_dxds'; // 斗牛大小单双

// 11x 5 - 任选1 
var GAMECODE_X1_RX1Z1_FS = 'x1_rx1z1_fs'; // 任选1中1复式
var GAMECODE_X1_DWD_DWD = 'x1_dwd_dwd'; // 任选1定位胆
var GAMECODE_X1_BDW_BDW = 'x1_bdw_bdw'; // 任选1不定位

// 11x5 - 任选2
var GAMECODE_X2_RX2Z2_FS = 'x2_rx2z2_fs'; // 任选二中二复式
var GAMECODE_X2_RX2Z2_DT = 'x2_rx2z2_dt'; // 任选二中二胆拖
var GAMECODE_X2_ZX_FS = 'x2_zx_fs'; // 任选二直选复式
var GAMECODE_X2_ZUX_FS = 'x2_zux_fs'; // 任选二组选复式
var GAMECODE_X2_ZUX_DT = 'x2_zux_dt'; // 任选二组选胆拖

// 11x5 - 任选3
var GAMECODE_X3_RX3Z3_FS = 'x3_rx3z3_fs'; // 任选三任选胆拖
var GAMECODE_X3_RX3Z3_DT = 'x3_rx3z3_dt'; // 任选三任选胆拖
var GAMECODE_X3_ZX_FS = 'x3_zx_fs'; // 任选三直选复式
var GAMECODE_X3_ZUX_FS = 'x3_zux_fs'; // 任选三组选复式
var GAMECODE_X3_ZUX_DT = 'x3_zux_dt'; // 任选三组选胆拖

// 11x5 - 任选4
var GAMECODE_X4_RX4Z4_FS = 'x4_rx4z4_fs'; // 任选四任选胆拖
var GAMECODE_X4_RX4Z4_DT = 'x4_rx4z4_dt'; // 任选四任选胆拖

// 11x5 - 任选5
var GAMECODE_X5_RX5Z5_FS = 'x5_rx5z5_fs'; // 任选五任选胆拖
var GAMECODE_X5_RX5Z5_DT = 'x5_rx5z5_dt'; // 任选五任选胆拖

// 11x5 - 任选6
var GAMECODE_X6_RX6Z6_FS = 'x6_rx6z5_fs'; // 任选六任选胆拖
var GAMECODE_X6_RX6Z6_DT = 'x6_rx6z5_dt'; // 任选六任选胆拖

// 11x5 - 任选7
var GAMECODE_X7_RX7Z7_FS = 'x7_rx7z5_fs'; // 任选七任选胆拖
var GAMECODE_X7_RX7Z7_DT = 'x7_rx7z5_dt'; // 任选七任选胆拖

// 11x5 - 任选8
var GAMECODE_X8_RX8Z8_FS = 'x8_rx8z5_fs'; // 任选八任选胆拖
var GAMECODE_X8_RX8Z8_DT = 'x8_rx8z5_dt'; // 任选八任选胆拖

// pk10 - 两面盘 - 龙虎
var GAMECODE_LMP_LH = 'lmp_cw_lh';
// pk10 - 两面盘 - 冠亚和大小单双
var GAMECODE_LMP_GYHDXDS = 'lmp_cw_gyhdxds';
// pk10 - 两面盘 - 大小
var GAMECODE_LMP_DX = 'lmp_cw_dx';
// pk10 - 定位胆 - 前五定位胆
var GAMECODE_DWD_QWDWD = 'dwd_dwd_q5dwd';
// pk10 - 定位胆 - 后五定位胆
var GAMECODE_DWD_HWDWD = 'dwd_dwd_h5dwd';
// pk10 - 前二 - 冠亚和
var GAMECODE_Q2_GYH = 'q2_q2_gyh';
// pk10 - 前二 - 前二复式
var GAMECODE_Q2_Q2FS = 'q2_q2_fs';
// pk10 - 前二 - 猜前二
var GAMECODE_Q2_CQ2 = 'q2_q2_cq2';
// pk10 - 前三 - 前三复式
var GAMECODE_Q3_Q3FS = 'q3_q3_fs';
// pk10 - 前三 - 猜前三
var GAMECODE_Q3_CQ3 = 'q3_q3_cq3';
// pk10 - 前四 - 前四复式
var GAMECODE_Q4_Q4FS = 'q4_q4_fs';
// pk10 - 前四 - 猜前四
var GAMECODE_Q4_CQ4 = 'q4_q4_cq4';
// pk10 - 前五 - 前五复式
var GAMECODE_Q5_Q5FS = 'q5_q5_fs';
// pk10 - 前五 - 猜前五
var GAMECODE_Q5_CQ5 = 'q5_q5_cq5';

// 福彩3D
var GAMECODE_3X_ZX_FS = '3x_zx_fs'; // 福彩3D - 三星直选复式
var GAMECODE_3X_ZX_HZ = '3x_zx_hz'; // 福彩3D - 三星直选和值
var GAMECODE_3X_ZX_KD = '3x_zx_kd'; // 福彩3D - 三星直选跨度
var GAMECODE_3X_ZUX_Z3 = '3x_zux_z3'; // 福彩3D - 三星组选组三
var GAMECODE_3X_ZUX_Z6 = '3x_zux_z6'; // 福彩3D - 三星组选组六
var GAMECODE_3X_ZUX_HZ = '3x_zux_hz'; // 福彩3D - 三星组选和值
var GAMECODE_3X_ZUX_BD = '3x_zux_bd'; // 福彩3D - 三星组选包胆
var GAMECODE_3X_ZUX_YMBDW = '3x_bdw_ymbdw'; // 福彩3D - 三星组选一码不定位
var GAMECODE_3X_ZUX_EMBDW = '3x_bdw_embdw'; // 福彩3D - 三星组选二码不定位
var GAMECODE_H2_ZX_FS = 'h2_zx_fs'; // 福彩3D - 后二直选复式
var GAMECODE_H2_ZX_HZ = 'h2_zx_hz'; // 福彩3D - 后二直选和值
var GAMECODE_H2_ZX_KD = 'h2_zx_kd'; // 福彩3D - 后二直选跨度
var GAMECODE_H2_ZX_FS = 'h2_zux_fs'; // 福彩3D - 后二组选复式
var GAMECODE_H2_ZX_HZ = 'h2_zux_hz'; // 福彩3D - 后二组选和值
var GAMECODE_H2_ZX_KD = 'h2_zux_kd'; // 福彩3D - 后二组选跨度
var GAMECODE_Q2_ZX_FS = 'q2_zx_fs'; // 福彩3D - 前二直选复式
var GAMECODE_Q2_ZX_HZ = 'q2_zx_hz'; // 福彩3D - 前二直选和值
var GAMECODE_Q2_ZX_KD = 'q2_zx_kd'; // 福彩3D - 前二直选跨度
var GAMECODE_Q2_ZX_FS = 'q2_zux_fs'; // 福彩3D - 前二组选复式
var GAMECODE_Q2_ZX_HZ = 'q2_zux_hz'; // 福彩3D - 前二组选和值
var GAMECODE_Q2_ZX_KD = 'q2_zux_kd'; // 福彩3D - 前二组选跨度

// 快三
var GAMECODE_HZ_DX_DS = 'dxds_dxds_hzdxds'; // 和值大小单双
var GAMECODE_HW_DX_DS = 'dxds_dxds_hwdxds'; // 和尾大小单双
var GAMECODE_HZ_HZ_HZ = 'hz_hz_hz'; // 和值
var GAMECODE_DS_DTYS = 'ds_ds_dtys'; // 单挑一骰
var GAMECODE_ES_EBT = 'es_es_ebt'; // 二骰二不同
var GAMECODE_ES_ETH = 'es_es_eth'; // 二骰 二同号
var GAMECODE_SS_SLH = 'ss_ss_slh'; // 三骰 三连号
var GAMECODE_SS_SBT = 'ss_ss_sbt'; // 三骰 三不同
var GAMECODE_SS_STH = 'ss_ss_sth'; // 三骰 三同号

// 数字28
var GAMECODE_TM_ZX = 'tm_tm_zx'; // 特码直选
var GAMECODE_TM_BS = 'tm_tm_bs'; // 特码包三
var GAMECODE_TM_DXDS = 'tm_tm_dxds'; // 特码大小单双
var GAMECODE_TM_ZHDXDS = 'tm_tm_zhdxds'; // 组合大小单双
var GAMECODE_TM_JZ = 'tm_tm_jz'; // 特码极值
var GAMECODE_TM_BOSE = 'tm_tm_bose'; // 特码波色
var GAMECODE_TM_BZ = 'tm_tm_bz'; // 特码豹子
var GAMECODE_BDW_BDW_BDW = 'bdw_bdw_bdw'; // 不定位
var GAMECODE_SX_ZUX = 'sx_sx_zux'; // 三星组选
var GAMECODE_SX_FS = 'sx_sx_fs'; // 三星复式
var GAMECODE_EX_Q2_Q2FS = 'ex_q2_q2fs'; // 二星前二复式
var GAMECODE_EX_Q2_Q2ZUX = 'ex_q2_q2zux'; // 二星前二组选
var GAMECODE_EX_H2_Q2FS = 'ex_h2_h2fs'; // 二星后二复式
var GAMECODE_EX_H2_Q2ZUX = 'ex_h2_h2zux'; // 二星后二组选

// 六合彩
var GAMECODE_LHC_TM_ZM = 'tm_tm_zm'; // 特码直面
var GAMECODE_LHC_ZM_ZM = 'zm_zm_zm'; // 正码
var GAMECODE_LHC_ZTM_Z1T = 'ztm_ztm_z1t'; // 正一特
var GAMECODE_LHC_ZTM_Z2T = 'ztm_ztm_z2t'; // 正二特
var GAMECODE_LHC_ZTM_Z3T = 'ztm_ztm_z3t'; // 正三特
var GAMECODE_LHC_ZTM_Z4T = 'ztm_ztm_z4t'; // 正四特
var GAMECODE_LHC_ZTM_Z5T = 'ztm_ztm_z5t'; // 正五特
var GAMECODE_LHC_ZTM_Z6T = 'ztm_ztm_z6t'; // 正六特

var SEPERATOR = ',';
var DS_SEPERATORS = [' ', ',', ';'];
var STRING_LENGTH = 28; // 字符串显示最大长度

// 排列
function combination(m,n){
    return factorial(m,n)/factorial(n,n);
}

// 组合
function factorial(m,n){
    var num = 1;
    var count = 0;
    for(var i = m;i > 0;i--){
        if(count == n){
            break;
        }
        num = num * i;
        count++;
    }
    return num;
}

// 计算二维数字数组的组合列表
function _shuzi_zuhe(nums) {
	var result = [];
	var first = null, second = null;
	if (nums.length <= 1) return result;
	if (nums.length == 2) {
		first = nums[0];
		second = nums[1];
	} else {
		first = nums.splice(0, 1)[0];
		second = _shuzi_zuhe(nums);
	}
	for (var i = 0; i < first.length; i++) {
		for (var j = 0; j < second.length; j++) {
			result.push([first[i], second[j]].join(SEPERATOR));
		}
	}
	return result;
}

function paddedZero(num, len) {
  let zero = [];
  for (let i = 0; i < len; i++) {
    zero.push(0);
  }
  zero = zero.join('');
  num = num + '';
  return zero.substring(num.length, len) + num;
}

function _unique_and_sort(nums, not_allow_same) {
	not_allow_same = typeof not_allow_same == 'undefined' ? false: not_allow_same
	var uniqueNums = {};
	for (var i = 0; i < nums.length; i++) {
		var num = nums[i];
		if (typeof num == 'string') {
			num = num.split(SEPERATOR);
		}
		num = num.sort();

		var st = num[0] * num.length;
		var t = 0;
		for (var j = 0; j < num.length; j++) {
			t += num[j]*1;
		}
		if (st == t && not_allow_same) {
			continue;
		}

		uniqueNums[num.join(SEPERATOR)] = true;
	}
	return Object.keys(uniqueNums);
}

// 重号格式
// {重号个数: [号码], ...}
// 重号或者单号进行组合 c | d
// 组合的长度 2 
// 是否需要重号组合 - 默认 false
function _chonghao_zuhe(chonghaoNums, zuheTo, zuheCount, noChZh = false) {
	// 根据重号个数生成号码表
	var nums = {};
	var tnums = [];
	var sameCount = 0;
	for (var amount in chonghaoNums) {
		var selectedNums = chonghaoNums[amount];
		var convertedNums = [];
		for (var i = 0; i < selectedNums.length; i++) {
			var t = [];
			for (var j = 0; j < amount; j++) {
				t.push(selectedNums[i]);
			}
			convertedNums.push(t.join(SEPERATOR));
		}
		if (zuheTo) {
			// 单号号码
			if (amount == 1) {
				nums['d'] = convertedNums;
			} else {
				// 重号号码
				nums['c'] = convertedNums;
				sameCount = amount*1;
			}
		} else {
			tnums.push(convertedNums);
		}
	}

	// 计算数组中不同号码的个数
	var countSame = function (nums) {
		var m ={};
		for (var i = 0; i < nums.length; i++) {
			if (typeof m[nums[i]] == 'undefined') {
				m[nums[i]] = 0;
			}
			m[nums[i]] += 1;
		}

		var maxSame = 1;
		for (var key in m) {
			if (m[key] > maxSame) {
				maxSame = m[key];
			}
		}
		return maxSame;
	}

	if (zuheTo) {
		var z = [];
		let key = zuheTo;
		for (var i = 0; i < zuheCount; i++) {
			z.push(nums[key]);
		}
		var _t = _unique_and_sort(_shuzi_zuhe(z), true);
		var t = [];
		// 单号里的组合数字不允许出现重号
		if (key == 'd') {
			for (var i = 0; i < _t.length; i ++) {
				if (countSame(_t[i].split(SEPERATOR)) <= 1) {
					t.push(_t[i]);
				}
			}
		} else {
			t = _t;
		}

		if (zuheCount == 5 || noChZh) {
			return t;
		}
		nums[key] = t;

		var tnums =[];
		if (typeof nums['d'] != 'undefined' && typeof nums['c'] != 'undefined') {
			tnums = _shuzi_zuhe([nums['c'], nums['d']]);
		} else {
			tnums = nums[key];
		}

		// 再次删选不符合要求的号码表
		var resNums = [];

		for (var i = 0; i < tnums.length; i++) {
			if (countSame(tnums[i].split(SEPERATOR)) == sameCount || sameCount <= 0) {
				resNums.push(tnums[i]);
			}
		}

		return resNums;
	} else {
		if (tnums[0].length <= 0 || tnums[1].length <= 0) {
			return [];
		}
		return _unique_and_sort(_shuzi_zuhe([tnums[0], tnums[1]]), true);
	}
	
}

// 不定位
// num格式: [1,2,3,4 ... ]
// len : 几定位(1,2,3定位)
function _bdw_zuhe(num, len) {
	if (len == 1) {
		return num;
	}
	var nums = [];
	for (var i = 0; i < len; i++) {
		nums.push(num);
	}

	nums = _shuzi_zuhe(nums);
	nums = _unique_and_sort(nums, true);
	let resNums = [];
	if (len > 2) {
		for (var i = 0; i < nums.length; i++) {
			let num = nums[i];
			if (_all_not_same(num.split(SEPERATOR))) {
				resNums.push(num);
			}
		}
	} else {
		resNums = nums;
	}
	return resNums;
}

// 和值 
// amount: [和]
// len: 几位 (2位和, 3位和)
function _hz_zuhe(amounts, len, from, max) {
	if (typeof from == 'undefined') from = 0;
	if (typeof max == 'undefined') max = 9;
	if (typeof len == 'undefined') len = 3;

	var eachZuhe = function (amount, len, from, max) {
		if (len == 1 || typeof len == 'undefined') {
			if (amount < from || amount > max) {
				return [];
			} else {
				return [ [amount] ];
			}
		} else {
			var nums = [];
			for (var i = from; i <= max; i++) {
				var newAmount = amount - i;
				var zh = eachZuhe(newAmount, len - 1, from, max);
				if (zh.length <= 0) {
					continue;
				}
				for (var j = 0; j < zh.length; j++) {
					zh[j].push(i);
					nums.push(zh[j]);
				}
			}
			return nums;
		}
	}

	var nums = [];
	for (var i = 0; i < amounts.length; i++) {
		nums = nums.concat(eachZuhe(amounts[i], len, from, max));
	}
	return nums;
}

// 跨度
// amount: 所选跨度值
// len: 三字跨度, 二字跨度
function _kd_zuhe(amounts, len, from, max) {

	if (typeof from == 'undefined') from = 0;
	if (typeof max == 'undefined') max = 9;
	if (typeof len == 'undefined') len = 3;

	let eachZuhe = function (amount, len, from, max) {
		var p = [];
		for (var i = from; i <= max; i++) {
			p.push(i);
		}

		var composeNums = [];
		for (var i = 0; i < len; i++) {
			composeNums.push(p);
		}

		var nums = _shuzi_zuhe(composeNums);

		var findMinMax = function (nums) {
			var min = 1000;
			var max = 0;
			for (var i = 0; i < nums.length; i++) {
				if (nums[i]*1 < min) {
					min = nums[i]*1;
				}
				if (nums[i]*1 > max) {
					max = nums[i]*1;
				}
			}
			return [min, max]
		}

		var resNums = [];
		for (var i = 0; i < nums.length; i ++) {
			var num = nums[i];
			var maxmin = findMinMax(num.split(','));
			if (maxmin[1] - maxmin[0] == amount) {
				resNums.push(num);
			}
		}

		return resNums;
	}

	var nums = [];
	for (var i = 0; i < amounts.length; i++) {
		nums = nums.concat(eachZuhe(amounts[i], len, from, max));
	}
	return nums;
	
	
}

// 三位 组选组三
// nums: 所选号码
function _zu3_zuhe(nums) {
	nums = [ nums, nums, nums ];
	nums = _shuzi_zuhe(nums);

	nums = _unique_and_sort(nums, true);

	var resNums = [];
	for (var i = 0; i < nums.length; i++) {
		var num = nums[i].split(',');
		var t = {};
		for (var j =0; j < num.length; j++) {
			t[num[j]] = true;
		}
		if (Object.keys(t).length != num.length) {
			resNums.push(nums[i]);
		}
	}

	return resNums;
}

// 三位 组选组六
// nums: 所选号码
function _zu6_zuhe(nums) {
	nums = [ nums, nums, nums ];
	nums = _shuzi_zuhe(nums);

	nums = _unique_and_sort(nums, true);

	var resNums = [];
	for (var i = 0; i < nums.length; i++) {
		var num = nums[i].split(',');
		var t = {};
		for (var j =0; j < num.length; j++) {
			t[num[j]] = true;
		}
		if (Object.keys(t).length == num.length) {
			resNums.push(nums[i]);
		}
	}

	return resNums;
}

// 组选和值
function _zxhz_zuhe(amount, len, from, max) {
	var nums = _hz_zuhe(amount, len, from, max);
	// 剔除豹子
	var resNums = [];
	for (let i = 0; i < nums.length; i++) {
		var num = nums[i];
		if (_is_baozi(num)) {
			continue;
		}
		resNums.push(nums[i]);
	}

	return _unique_and_sort( resNums , true );
}

function _is_baozi(nums) {
	if (nums.length <= 0) return false;
	var s = nums[0] *1* nums.length;
	var t = 0;
	for (var i = 0; i < nums.length; i++) {
		t += nums[i]*1;
	}
	return s == t;
}

// 包胆
function _bd_zuhe(nums, len, from, max) {
	if (typeof from == 'undefined') from = 0;
	if (typeof max == 'undefined') max = 9;
	if (typeof len == 'undefined') len = 3;

	let eachZuhe = function (num, len, from, max) {
		var serials = function () {
			let n = [];
			for (var i = from; i <= max; i++) {
				n.push(i);
			}
			return n;
		}
		
		var tNums = [];
		for (var i = 0; i < len - 1; i++) {
			tNums.push(serials());
		}
		tNums.push([num]);
		tNums = _shuzi_zuhe(tNums);
		return _unique_and_sort(tNums, true);
	}

	let resNums = [];
	for (var i = 0; i < nums.length; i++) {
		resNums = resNums.concat(eachZuhe(nums[i], len, from, max));
	}

	return resNums;
}

// 组选复式
// nums: [1,2,3]
// len: 几位相同 (2位)
function _zx_fs(nums, len) {
	return _bdw_zuhe(nums, len);
}

// 不含对子的和值
// 参数参照 _hz_zuhe()
function _hz_zuhe_not_same() {
	var nums = _hz_zuhe.apply(this, arguments);
	return _unique_and_sort(nums, true);
}

// 定位胆
// nums: [ [1,2,], [1,2] ]
function _dwd_zuhe(nums) {
	var resNums = [];
	for (var i = 0; i < nums.length; i++) {
		for (var j = 0; j < nums[i].length; j++) {
			resNums.push(nums[i][j]);
		}
	}

	return resNums;
}

//  nums: [1,2,3] -> true
// nums: [1,2,2] -> false
function _all_not_same(nums) {
	var reduceNums = {};
	for (var i = 0; i <nums.length;i++) {
		reduceNums[nums[i]] = true;
	}
	return Object.keys(reduceNums).length == nums.length;
}

// 任选直选
// nums: [ [1,2], [2,3] ]
// len: 2: 任选二, 3: 任选3
function _rxzx_zuhe(nums, len, from, max) {

	if (typeof len == 'undefined') len = 2;
	if (typeof from == 'undefined') from = 0;
	if (typeof max == 'undefined') max = 9;

	var indexNums = [];
	for (var i = 0; i < nums.length; i++) {
		indexNums.push(i);
	}
	var tIndexZh = [];
	for (var i = 0; i < len; i++) {
		tIndexZh.push(indexNums);
	}
	tIndexZh = _unique_and_sort(_shuzi_zuhe(tIndexZh), true);
	var indexZh = [];
	// 组合中不允许出现相同的数字
	for (var i = 0; i < tIndexZh.length; i++) {
		var t = tIndexZh[i].split(SEPERATOR);
		if (_all_not_same(t)) {
			indexZh.push(t);
		} else {
			continue;
		}
	}

	var resNums = [];
	for (var i = 0; i < indexZh.length; i++) {
		var tNums = [];
		for (var j = 0; j < indexZh[i].length; j++) {
			tNums.push(nums[indexZh[i][j]*1]);
		}
		resNums = resNums.concat(_shuzi_zuhe(tNums));
	}

	return resNums;
}

// 任选组选
// pos: 位置索引: [0,1,2,3...] 万千百十...
// nums: 数字数组: [1,2,3...]
// 位置长度: 2: 二位, 3: 三位
// 数字长度: 2: 二个数字组合, 3: 3个数字组合
function _rxzux_zuhe(pos, nums, plen, nlen) {
	var posNums = [];
	var tNums = [];
	for (var i = 0; i < plen; i++) {
		posNums.push(pos);
	}
	for (var i = 0; i < nlen; i++) {
		tNums.push(nums);
	}
	posNums = _unique_and_sort(_shuzi_zuhe(posNums), true);
	var t = [];
	// 每个号码位置不能出现重复
	for (var i = 0; i < posNums.length;i++) {
		var posNum = posNums[i];
		posNum = posNum.split(',');
		if (_all_not_same(posNum)) {
			t.push(posNums[i]);
		}
	}
	posNums = t;
	tNums = _unique_and_sort(_shuzi_zuhe(tNums), true);

	var resNums = [];
	for (var i = 0; i < posNums.length; i++) {
		for (var j = 0; j < tNums.length; j++) {
			resNums.push( [ posNums[i],  tNums[j]] );
		}
	}

	return resNums;
}

// 任选 组三 组六
// 参数参照任选组选
// notAllSame -> false 组六
// notAllSame -> true 组三
function _zxzux36_zuhe(pos, nums, plen, nlen, notAllSame) {
	var resNums = _rxzux_zuhe(pos, nums, plen, nlen);
	
	var t = [];
	for (var i = 0; i < resNums.length;i++) {
		var num = resNums[i][1].split(SEPERATOR);
		if (!notAllSame && !_all_not_same(num)) {
			t.push(resNums[i]);
		} else if (notAllSame && _all_not_same(num)) {
			t.push(resNums[i]);
		}
	}

	return t;
}

// 11x5任选
// nums: [01,02,03],
// len: 选1, 选2 ... 
function _11x5_rx(nums, len, from, max) {
	if (typeof from == 'undefined') from = 1;
	if (typeof max == 'undefined') max = 11;

	if (len == 1) return nums;
	
	var resNums = [];
	if (nums.length < len) {
		return resNums;
	} else {
		var size = combination(nums.length, len);
		for (var i = 0; i < size; i++) {
			resNums.push(i);
		}
		return resNums;
	}
}

// 11x5 胆拖
// nums: [ [1], [2,3,4]],
// len, 选2, 选3
function _11x5_dt(nums, len, from, max) {
	if (typeof from == 'undefined') from = 1;
	if (typeof max == 'undefined') max = 11;
		
	var dm_nums = nums[0] || [];
	var hm_nums = nums[1] || [];
	
	// 去掉 hm_nums重复的数字
	let tmp_hm_nums = [];
	for (let i = 0; i < hm_nums.length; i++) {
		if (dm_nums.indexOf(hm_nums[i]) == -1) {
			tmp_hm_nums.push(hm_nums[i]);
		}
	}

	hm_nums = tmp_hm_nums;

	if (!hm_nums || hm_nums.length <= 0) return [];

	var _nums = [];
	if (len <= 2) {
		_nums = hm_nums;
	} else {
		
		let size = hm_nums.length;
		if (hm_nums.indexOf(dm_nums[0]) != -1) {
			size--;
		}
		if (size < len - 1 ) {
			return [];
		} else {
			let total = combination(size, len - 1);
			for (let i = 0; i < total; i++ ) {
				_nums.push(i);
			}
		}


	}
	return _nums;

	// _nums = _unique_and_sort(_shuzi_zuhe([ dm_nums, _nums ]), true);

	// var resNums = [];
	// for (var i = 0; i < _nums.length; i++) {
	// 	if (_all_not_same(_nums[i].split(SEPERATOR))) {
	// 		resNums.push(_nums[i]);
	// 	}
	// }
	// return resNums;
}

// 11x5 直选复式
function _11x5_fs(nums) {
	var _nums = _shuzi_zuhe(nums);

	var resNums = [];
	for (var i = 0; i < _nums.length; i++) {
		if (_all_not_same(_nums[i].split(SEPERATOR))) {
			resNums.push(_nums[i]);
		}
	}
	return resNums;
}

// 11x5 组选复式
function _11x5_zux_fs(nums, len = 2) {
	var _nums = [];
	for (var i = 0; i < len; i++) {
		_nums.push(nums);
	}

	var _nums = _shuzi_zuhe(_nums);
	_nums = _unique_and_sort(_nums, true);

	var resNums = [];
	for (var i = 0; i < _nums.length; i++) {
		if (_all_not_same(_nums[i].split(SEPERATOR))) {
			resNums.push(_nums[i]);
		}
	}
	return resNums;
}

// 复式组合 - 号码不重复
// pk10 复式
function _not_same_fs_zuhe(codes) {
	var tmpNums = _shuzi_zuhe(codes);
	console.log(['tmpNums', tmpNums]);
	var nums = [];
	for (var i = 0; i < tmpNums.length; i++) {
		if (_all_not_same(tmpNums[i].split(SEPERATOR))) {
			nums.push(tmpNums[i]);
		}		
	}
	return nums;
}

// 输出号码格式
function _format_numbers(codes, lottery, game) {
	var funs = {};

	funs[LOTTERY_SSC + GAMECODE_DWD_QWDWD] = function (codes) {
		for (var i = 0; i < 10; i++) {
			if (typeof codes[i] == 'undefined') {
				codes[i] = [];
			}
			if (codes[i].length == 0) {
				codes[i] = '-';
			}
		}

		return funs[LOTTERY_SSC+GAMECODE_WX_ZX_FS](codes);
	}

	funs[LOTTERY_SSC+GAMECODE_WX_ZX_FS] = function (codes) {
		var str = [];
		for (var i = 0; i < codes.length;i++) {
			if (typeof codes[i] == 'object') {
				str.push(codes[i].sort().join(''));
			} else {
				str.push(codes[i]);
			}
		}
		return str.join(',');
	}

	funs[LOTTERY_SSC+GAMECODE_WX_ZX_DS] = function (codes) {
		var str = codes.sort().join(' ');
		return str;
	}

	funs[LOTTERY_SSC+GAMECODE_RX_RX2_ZUXFS] = function (codes) {
		var str1 = ( codes[0] || [] ) .join('');
		var str2 = ( codes[1] || [] ).join(',');

		let posnames = ["万", "千", "百", "十", "个"];
		str1 = str1.split("");
		str1 = str1.sort();
		let pos = [];
		for (var i = 0; i < str1.length; i++) {
			pos.push(posnames[str1[i]]);
		}

		return [pos.join(''), str2].join('|');
	}

	funs[LOTTERY_SSC+GAMECODE_RX_RX2_ZXFS] = function (codes) {
		for (var i = 0; i < 5; i++) {
			if (typeof codes[i] == 'undefined') {
				codes[i] = [];
			}
			if (codes[i].length == 0) {
				codes[i] = '-';
			}
		}

		return funs[LOTTERY_SSC+GAMECODE_WX_ZX_FS](codes);
	};



	// 胆拖
	funs[LOTTERY_11X5+GAMECODE_X2_RX2Z2_DT] = function(codes) {
		var dm_nums = codes[0] || [];
		var hm_nums = codes[1] || [];
		// 号码里去掉胆码重复的数字
		let tmp_hm_nums = [];
		for (let i = 0; i < hm_nums.length; i++) {
			if (dm_nums.indexOf(hm_nums[i]) == -1) {
				tmp_hm_nums.push(hm_nums[i]);
			}
		}
		hm_nums = tmp_hm_nums;
		if (hm_nums && dm_nums) {
			return ['胆' + _format_numbers(dm_nums, LOTTERY_SSC, GAMECODE_WX_ZX_FS)['full'], _format_numbers(hm_nums, LOTTERY_SSC, GAMECODE_WX_ZX_FS)['full']].join(';');
		}
		return '';
	};

	funs[LOTTERY_11X5+GAMECODE_X2_ZX_FS] = function(codes) {
		for (var i = codes.length; i < 5 + 1; i++) {
			codes.push(['-']);
		}
		return funs[LOTTERY_SSC+GAMECODE_WX_ZX_FS](codes);
	};

	// 福彩3d和时时彩一致
	if (lottery == LOTTERY_3D) {
		lottery = LOTTERY_SSC; 
	}

	// pk10两面盘 龙虎
	funs[LOTTERY_PK10+GAMECODE_LMP_LH] = function (codes) {
		var groupNames = ['[1V10]', '[2V9]', '[3V8]', '[4V7]', '[5V6]'];
		var nums = [];
		for (var i = 0; i < codes.length; i++) {
			if (codes[i].length > 0) {
				var code = codes[i].sort().join('');
				nums.push([groupNames[i]+code]);
			} else {
				nums.push([]);
			}
		}
		return funs[LOTTERY_SSC+GAMECODE_RX_RX2_ZXFS](nums);
	}

	var fn = funs[lottery+game];
	var str = fn(codes);
	var res = {
		format: str,
		full: str
	};
	if (str.length > STRING_LENGTH) {
		res.format = str.substr(0, STRING_LENGTH) + '...';
	}
	return res;
}

function randNum(min = 0, max = 9) {
	return ( min +  Math.floor( Math.random() * Math.floor((max - min + 1))) ) + "";
}

// 随机一个不同数字的数组
function randArray(len, notIn = [], min = 0, max = 9) {
	let nums = [];
	while (nums.length != len) {
		let n = randNum(min, max);
		if (nums.indexOf(n) == -1 && notIn.indexOf(n) == -1) {
			nums.push(n);
		}
	}

	return nums;
}

// 类似这样数据结构
// config: [ {len: 2}, {len: 3}, {len: 2} ]
// 生成的数组都不重号
// 返回结果: [ [...], [...], [...] ]
function randArrayWithConfig(config, max = 9) {
	
	// 支持的最大选号数
	var t = 0;
	for (var i = 0; i < config.length; i++) {
		t += config[i].len;
	}
	if (t > max) {
		return []
	}
	
	else if (config.length == 1) {
		return [randArray(config[0].len)];
	} else {
		var c = config.splice(0, 1);
		var nextarray = randArrayWithConfig(config);
		var n = [];
		for (var i = 0; i < nextarray.length; i++) {
			for (var j = 0; j < nextarray[i].length; j++) {
				n.push(nextarray[i][j]);
			}
		}
		var nums = randArray(c[0].len, n);
		nextarray.unshift(nums);

		return nextarray;
	}
}

function _calculateNumbers(codes, lottery, game) {
	var cloneCodes = codes.clone();
	var nums = [], format = '', randOrderFn = function ()  {};
	// 时时彩和福彩3D号码计算算法一致
	if (lottery == LOTTERY_SSC || lottery == LOTTERY_3D) {
		switch (game) {

			// 五星组选复式
			case GAMECODE_WX_ZX_FS:
			if (codes.length == 5) {
				nums = _shuzi_zuhe(codes);
				format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);
			}
			randOrderFn = function ()  {
				return randArrayWithConfig([ {len:1}, {len:1}, {len:1}, {len:1}, {len:1} ]);
			};
			break;

			// 五星组选单式
			case GAMECODE_WX_ZX_DS: 
			var s = '';
			for (var i = 0; i < DS_SEPERATORS.length; i++) {
				if (codes.indexOf(DS_SEPERATORS[i]) != -1) {
					s = DS_SEPERATORS[i];
				}
			}
			var t = codes.split(s);
			var valid = true;
			// 检查数字
			for (var i = 0; i < t.length; i++) {
				var n = t[i];
				if (n.length != 5) {
					valid = false;
					break;
				}
			}
			// 合法情况下
			if (valid) {
				nums = t;
				format = _format_numbers(t);
			}
			break;
	
			// 五星组选5
			case GAMECODE_WX_ZX_ZX5:
			// codes: [ [0,1,2,3], [2,3] ]
			var t = {"4": codes[0] || [], "1": codes[1] || []};
			nums = _chonghao_zuhe(t);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS); // 显示格式和复式一样
			randOrderFn = function ()  {
				return randArrayWithConfig( [ {len:1}, {len: 1} ]);
			};
			break;

			// 五星组选10
			case GAMECODE_WX_ZX_ZX10:
			var t = {"3": codes[0] || [], "2": codes[1] || []};
			nums = _chonghao_zuhe(t);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS); // 显示格式和复式一样

			randOrderFn = function ()  {
				return randArrayWithConfig( [ {len:1}, {len: 1} ]);
			};
			break;

			// 五星组选20
			case GAMECODE_WX_ZX_ZX20:
			var t = {"3": codes[0] || [], "1": codes[1] || []};
			nums = _chonghao_zuhe(t, 'd', 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS); // 显示格式和复式一样
			
			randOrderFn = function ()  {
				return randArrayWithConfig( [ {len:1}, {len: 2} ]);
			};

			break;

			// 五星组选30
			case GAMECODE_WX_ZX_ZX30: 
			var t = {"2": codes[0] || [], "1": codes[1] || []};
			nums = _chonghao_zuhe(t, 'c', 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS); // 显示格式和复式一样
			
			randOrderFn = function ()  {
				return randArrayWithConfig( [ {len:2}, {len: 1} ]);
			};

			break;

			// 五星组选60
			case GAMECODE_WX_ZX_ZX60: 
			var t = {"2": codes[0] || [], "1": codes[1] || []};
			nums = _chonghao_zuhe(t, 'd', 3);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS); // 显示格式和复式一样
				
			randOrderFn = function ()  {
				return randArrayWithConfig( [ {len:1}, {len: 3} ]);
			};

			break;

			// 五星组选120
			case GAMECODE_WX_ZX_ZX120: 
			var t = {"0": [], "1": codes};
			nums = _chonghao_zuhe(t, 'd', 5);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS); // 显示格式和复式一样
			
			randOrderFn = function ()  {
				return [randArray( 5)];
			}

			break;

			// 五星趣味一帆风顺
			case GAMECODE_WX_QW_YFFS:
			// 五星趣味好事成双
			case GAMECODE_WX_QW_HSCS:
			// 五星趣味三星报喜
			case GAMECODE_WX_QW_SXBX:
			// 五星趣味四季发财
			case GAMECODE_WX_QW_SJFC:
			nums = codes;
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			
			randOrderFn = function ()  {
				return [randArray(1)];
			};

			break;
	
			// 五星不定位一码不定位
			case GAMECODE_WX_BDW_YMBDW:
			nums = codes;
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1)];
			};
			break;
			
			// 五星不定位二码不定位
			case GAMECODE_WX_BDW_EMBDW:
			nums = _bdw_zuhe(codes, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样

			randOrderFn = function ()  {
				return [randArray(2)];
			}

			break;

			// 五星不定位三码不定位
			case GAMECODE_WX_BDW_SMBDW:
			nums = _bdw_zuhe(codes, 3);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样

			randOrderFn = function ()  {
				return [randArray(3)];
			}

			break;
		
			// 前/后四直选复式
			case GAMECODE_QS_ZX_FS:
			case GAMECODE_HS_ZX_FS:
			nums = _shuzi_zuhe(codes);

			// 前四
			if (game == GAMECODE_QS_ZX_FS) {
				cloneCodes.push(['-']);
			} else {
				cloneCodes.unshift(['-']);
			}
			
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			
			randOrderFn = function ()  {
				return randArrayWithConfig([ {len:1}, {len:1}, {len:1}, {len:1}]);
			};

			break;

			// 前/后四组选组选4
			case GAMECODE_QS_ZX_ZX4:
			case GAMECODE_HS_ZX_ZX4:
			nums = _chonghao_zuhe({"3": codes[0] || [], "1": codes[1] || []});
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			
			randOrderFn = function ()  {
				return randArrayWithConfig([ {len: 1}, {len: 1} ]);
			};

			break;

			// 前/后四组选组选6
			case GAMECODE_QS_ZX_ZX6:
			case GAMECODE_HS_ZX_ZX6:
			nums = _chonghao_zuhe({"2": codes || []}, 'c', 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样

			randOrderFn = function ()  {
				return [randArray(2)];
			};

			break;

			// 前/后四组选组选12
			case GAMECODE_QS_ZX_ZX12:
			case GAMECODE_HS_ZX_ZX12:
			nums = _chonghao_zuhe({"2": codes[0] || [], "1": codes[1] || []}, 'd', 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样

			randOrderFn = function ()  {
				return randArrayWithConfig([ {len: 1}, {len: 2} ]);
			};

			break;

			// 前/后四组选组选24
			case GAMECODE_QS_ZX_ZX24:
			case GAMECODE_HS_ZX_ZX24:
			nums = _chonghao_zuhe({"1": codes}, 'd', 4);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(4)];
			};
			break;
		
			// 前/后四组选不定位一码不定位
			case GAMECODE_QS_BDW_YMBDW:
			case GAMECODE_HS_BDW_YMBDW:
			nums = codes;
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			
			randOrderFn = function ()  {
				return [randArray(1)];
			};

			break;

			//前/后四组选不定位二码不定位
			case GAMECODE_QS_BDW_EMBDW:
			case GAMECODE_HS_BDW_EMBDW:
			nums = _bdw_zuhe(codes, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(2)];
			};
			break;
			
			// 前/中/后三直选复式
			// 福彩3D直选复式
			case GAMECODE_QSAN_ZX_FS:
			case GAMECODE_ZSAN_ZX_FS:
			case GAMECODE_HSAN_ZX_FS:
			case GAMECODE_3X_ZX_FS:
			nums = _shuzi_zuhe(codes);
			if (game == GAMECODE_QSAN_ZX_FS) {
				cloneCodes.push(['-']);
				cloneCodes.push(['-']);	
			} else if (game == GAMECODE_ZSAN_ZX_FS) {
				cloneCodes.unshift(['-']);
				cloneCodes.push(['-']);
			} else if (game == GAMECODE_HSAN_ZX_FS) {
				cloneCodes.unshift(['-']);
				cloneCodes.unshift(['-']);
			}
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return randArrayWithConfig([ {len:1}, {len:1}, {len:1}]);
			};
			break;
			
			// 前/中/后三直选和值
			// 福彩3D直选和值
			case GAMECODE_QSAN_ZX_HZ:
			case GAMECODE_ZSAN_ZX_HZ:
			case GAMECODE_HSAN_ZX_HZ:
			case GAMECODE_3X_ZX_HZ:
			nums = _hz_zuhe(codes, 3);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1, [], 0, 27)];
			};
			break;
			
			// 前/中/后三直选跨度
			// 福彩3D直选跨度
			case GAMECODE_QSAN_ZX_KD:
			case GAMECODE_ZSAN_ZX_KD:
			case GAMECODE_HSAN_ZX_KD:
			case GAMECODE_3X_ZX_KD:
			nums = _kd_zuhe(codes, 3);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1)];
			};
			break;

			// 前/中/后三组选组三
			// 福彩3D组选组三
			case GAMECODE_QSAN_ZX_ZS:
			case GAMECODE_ZSAN_ZX_ZS:
			case GAMECODE_HSAN_ZX_ZS:
			case GAMECODE_3X_ZUX_Z3:
			nums = _zu3_zuhe(codes);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(2)];
			};
			break;

			// 前/中/后三组选组六
			// 福彩3D组选组六
			case GAMECODE_QSAN_ZX_ZL:
			case GAMECODE_ZSAN_ZX_ZL:
			case GAMECODE_HSAN_ZX_ZL:
			case GAMECODE_3X_ZUX_Z6:
			nums = _zu6_zuhe(codes);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(3)];
			};
			break;

			// 前/中/后三组选和值
			// 福彩3D组选和值
			case GAMECODE_QSAN_ZUX_HZ:
			case GAMECODE_ZSAN_ZUX_HZ:
			case GAMECODE_HSAN_ZUX_HZ:
			case GAMECODE_3X_ZUX_HZ:
			nums = _zxhz_zuhe(codes, 3);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1, [], 1, 26)];
			};
			break;
			
			// 前/中/后三组选包胆
			// 福彩3D组选包胆
			case GAMECODE_QSAN_ZUX_BD:
			case GAMECODE_ZSAN_ZUX_BD:
			case GAMECODE_HSAN_ZUX_BD:
			case GAMECODE_3X_ZUX_BD:
			nums = _bd_zuhe(codes, 3);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1)];
			};
			break;
			
			// 前/中/后三不定位一码不定位
			// 福彩3D 组选一码不定位
			case GAMECODE_QSAN_BDW_YMBDW:
			case GAMECODE_ZSAN_BDW_YMBDW:
			case GAMECODE_HSAN_BDW_YMBDW:
			case GAMECODE_3X_ZUX_YMBDW:
			nums = codes;
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1)];
			};
			break;

			// 前/中/后三不定位二码不定位
			// 福彩3D 组选二码不定位
			case GAMECODE_QSAN_BDW_EMBDW:
			case GAMECODE_ZSAN_BDW_EMBDW:
			case GAMECODE_HSAN_BDW_EMBDW:
			case GAMECODE_3X_ZUX_EMBDW:
			nums = _bdw_zuhe(codes, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(2)];
			};
			break;
			
			// 前/后二直选复式
			case GAMECODE_QE_ZX_FS:
			case GAMECODE_HE_ZX_FS:
			nums = _shuzi_zuhe(codes);
			if (game == GAMECODE_QE_ZX_FS) {
				cloneCodes.push(['-']);
				if (lottery != LOTTERY_3D) {
					cloneCodes.push(['-']);
					cloneCodes.push(['-']);
				}
			} else if (game == GAMECODE_HE_ZX_FS) {
				cloneCodes.unshift(['-']);
				if (lottery != LOTTERY_3D) {
					cloneCodes.unshift(['-']);
					cloneCodes.unshift(['-']);
				}
			}
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return randArrayWithConfig([ {len:1}, {len:1}]);
			};
			break;

			// 前/后二直选和值
			case GAMECODE_QE_ZX_HZ:
			case GAMECODE_HE_ZX_HZ:
			nums = _hz_zuhe(codes, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1, [], 0, 18)];
			};
			break;

			// 前/后二直选跨度
			case GAMECODE_QE_ZX_KD:
			case GAMECODE_HE_ZX_KD:
			nums = _kd_zuhe(codes, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1)];
			};
			break;

			// 前/后二组选复式
			case GAMECODE_QE_ZUX_FS:
			case GAMECODE_HE_ZUX_FS:
			nums = _zx_fs(codes, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(2)];
			};
			break;

			// 前/后二组选和值
			case GAMECODE_QE_ZUX_HZ:
			case GAMECODE_HE_ZUX_HZ:
			nums = _hz_zuhe_not_same(codes, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1, [], 1, 17)];
			};
			break;

			// 前/后二组选包胆
			case GAMECODE_QE_ZUX_BD:
			case GAMECODE_HE_ZUX_BD:
			nums = _bd_zuhe(codes, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				return [randArray(1)];
			};
			break;
			
			// 定位胆
			case GAMECODE_DWD_DWD_DWD:
			nums = _dwd_zuhe(codes);
			for (var i = 0; i < cloneCodes.length; i++) {
				if (cloneCodes[i].length <= 0) {
					cloneCodes[i] = ['-'];
				}
			}
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
			randOrderFn = function ()  {
				var pos = randNum(0, 4);
				var num = randNum(0, 9);
				var nums = [[],[],[],[],[]];
				if (lottery == LOTTERY_3D) {
					nums = [ [], [], [] ];
					pos = randNum(0, 2);
				}
				nums[pos] = [num]; 

				return nums;
			};
			break;
			
			// 任选任选二直选复式
			case GAMECODE_RX_RX2_ZXFS:
			nums = _rxzx_zuhe(codes, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_RX_RX2_ZXFS);
			randOrderFn = function ()  {
				var poses = randArray(2, [], 0, 4);
				var nums = [ [],[],[],[],[] ];
				nums[poses[0]] = [randNum()];
				nums[poses[1]] = [randNum()];
				return nums;
			};
			break;
			
			// 任选任选二组选复式
			case GAMECODE_RX_RX2_ZUXFS:
			// codes[0]: 位置索引: [0,1,2,3,4] -> [万，千，百，十，个]
			// codes[1]: 所选号码: [1,2,3,4...]
			// ...
			nums = _rxzux_zuhe(codes[0] || [], codes[1] || [], 2, 2);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_RX_RX2_ZUXFS);
			
			randOrderFn =  function () {
				var poses = randArray(2, [], 0, 4);
				var nums = randArray(2);
				return [poses, [nums]];
			};

			break;
		
			// 任选任选三直选复式
			case GAMECODE_RX_RX3_ZXFS:
			nums = _rxzx_zuhe(codes, 3);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_RX_RX2_ZXFS);

			randOrderFn =  function () {
				var poses = randArray(3, [], 0, 4);
				var nums = [ [],[],[],[],[] ];
				nums[poses[0]] = [randNum()];
				nums[poses[1]] = [randNum()];
				nums[poses[2]] = [randNum()];
				return nums;
			};

			break;
		
			// 任选任选三组三
			case GAMECODE_RX_RX3_ZS:
			// codes[0]: 位置索引: [0,1,2,3,4] -> [万，千，百，十，个]
			// codes[1]: 所选号码: [1,2,3,4...]
			// ...
			nums = _zxzux36_zuhe(codes[0] || [], codes[1] || [], 3, 3, false);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_RX_RX2_ZUXFS);

			randOrderFn =  function () {
				var poses = randArray(3, [], 0, 4);
				var nums = randArray(2);
				return [poses, [nums]];
			};
			break;
	

			// 任选任选三组六
			case GAMECODE_RX_RX3_ZL:
			// codes[0]: 位置索引: [0,1,2,3,4] -> [万，千，百，十，个]
			// codes[1]: 所选号码: [1,2,3,4...]
			// ...
			nums = _zxzux36_zuhe(codes[0] || [], codes[1] || [], 3, 3, true);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_RX_RX2_ZUXFS);
			randOrderFn =  function () {
				var poses = randArray(3, [], 0, 4);
				var nums = randArray(3);
				return [poses, [nums]];
			};
			break;
			
			// 任选任选四直选复式
			case GAMECODE_RX_RX4_ZXFS:
			nums = _rxzx_zuhe(codes, 4);
			format = _format_numbers(cloneCodes, lottery, GAMECODE_RX_RX2_ZXFS);
			randOrderFn = function () {
				var poses = randArray(4, [], 0, 4);
				var nums = [ [], [], [], [], [] ];
				nums[poses[0]] = [randNum()];
				nums[poses[1]] = [randNum()];
				nums[poses[2]] = [randNum()];
				nums[poses[3]] = [randNum()];

				return nums;
			};
			break;
			
			// 龙虎 / 微信玩法 / 斗牛
			case GAMECODE_LHH_WQ:
			case GAMECODE_LHH_WB:
			case GAMECODE_LHH_WS:
			case GAMECODE_LHH_WG:
			case GAMECODE_LHH_QB:
			case GAMECODE_LHH_QS:
			case GAMECODE_LHH_QG:
			case GAMECODE_LHH_BS:
			case GAMECODE_LHH_BG:
			case GAMECODE_LHH_SG:
			case GAMECODE_WX_DXDS_W:
			case GAMECODE_WX_DXDS_Q:
			case GAMECODE_WX_DXDS_B:
			case GAMECODE_WX_DXDS_S:
			case GAMECODE_WX_DXDS_G:
			case GAMECODE_WX_TM_TM:
			case GAMECODE_DN_NN:
			case GAMECODE_DN_DXDS:
			nums = codes;
			format = _format_numbers(cloneCodes, lottery, GAMECODE_WX_ZX_FS);
			
			
			switch (game) {
				case GAMECODE_LHH_WQ:
				case GAMECODE_LHH_WB:
				case GAMECODE_LHH_WS:
				case GAMECODE_LHH_WG:
				case GAMECODE_LHH_QB:
				case GAMECODE_LHH_QS:
				case GAMECODE_LHH_QG:
				case GAMECODE_LHH_BS:
				case GAMECODE_LHH_BG:
				case GAMECODE_LHH_SG:
					
					randOrderFn = function () {
						var t = ["龙", "虎", "和"];
						return [ [t[randNum(0, 2)]]];
					};

				break;

				case GAMECODE_WX_DXDS_W:
				case GAMECODE_WX_DXDS_Q:
				case GAMECODE_WX_DXDS_B:
				case GAMECODE_WX_DXDS_S:
				case GAMECODE_WX_DXDS_G:
					
					randOrderFn = function () {
						var t = ["大", "小", "单", "双", "和", "大单", "小单", "大双", "小双"];
						return [[t[randNum(0, t.length - 1)]]];
					};

				break;

				case GAMECODE_WX_TM_TM:
					randOrderFn = function () {
						return [[ randNum(0, 9) ]];
					};
				break;

				case GAMECODE_WX_ZHDXDW_W:
				case GAMECODE_WX_ZHDXDW_Q:
				case GAMECODE_WX_ZHDXDW_B:
				case GAMECODE_WX_ZHDXDW_S:
				case GAMECODE_WX_ZHDXDW_G:
					
					randOrderFn = function () {
						var t = ["大单", "小单", "大双", "小双"];
						return [[t[randNum(0, 3)]]];
					};

				break;

				case GAMECODE_DN_NN:
					
					randOrderFn = function () {
						var t = ["牛1", "牛2", "牛3", "牛4","牛5","牛6","牛7","牛8","牛9","牛牛","无牛"];
						return [[t[randNum(0, t.length - 1)]]];
					};

				break;

				case GAMECODE_DN_DXDS:
					
					randOrderFn = function () {
						var t = ["牛大", "牛小", "牛单", "牛双"];
						return [[t[randNum(0, t.length - 1)]]];
					};

				break;
			}

			break;
			
			
		}
	} else if (lottery == LOTTERY_11X5) {
		switch (game) {
			// 11x5 - 任选1选1中1复式
			case GAMECODE_X1_RX1Z1_FS:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					return [[paddedZero(randNum(1, 11), 2)]];
				};
				console.log([nums, format, randOrderFn]);
			break;

			// 11x5 - 任选1 定位胆
			case GAMECODE_X1_DWD_DWD:
				nums = _dwd_zuhe(codes);
				for (var i = 0; i < cloneCodes.length; i++) {
					if (cloneCodes[i].length <= 0 ) {
						cloneCodes[i] = ['-'];
					}
				}
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function ()  {
					var pos = randNum(0, 4);
					var num = paddedZero(randNum(1, 11), 2);
					var nums = [[],[],[],[],[]];
					nums[pos] = [num]; 

					return nums;
				};
			break;
			
			// 11x5 - 任选1 - 不定位
			case GAMECODE_X1_BDW_BDW:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					nums = [[paddedZero(randNum(1, 11), 2)]];
					return nums;
				};
			break;

			// 11x5 - 任选2 - 任选复式
			case GAMECODE_X2_RX2Z2_FS:
				nums = _11x5_rx(codes, 2);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function() {
					var num1 = paddedZero(randNum(1, 11), 2);
					var num2 = paddedZero(randArray(1, [num1], 1, 11)[0], 2);

					return [[num1, num2]];

				};
			break;

			// 11x5 - 任选2 - 直选胆拖
			case GAMECODE_X2_RX2Z2_DT:
			case GAMECODE_X2_ZUX_DT:
				nums = _11x5_dt(codes, 2);
				console.log(['nums', nums, codes]);
				format = _format_numbers(cloneCodes, lottery, GAMECODE_X2_RX2Z2_DT);
				randOrderFn = function() {
					var dm = randNum(1, 11);
					var nums = randArray(1, [dm], 1, 11);
					nums = [[dm], nums];

					for (var i = 0; i < nums.length; i++) {
						for (var j = 0; j < nums[i].length; j++) {
							nums[i][j] = paddedZero(nums[i][j], 2);
						}
					}

					return nums;
				};
			break;

			// 11x5 - 任选2 - 直选复式
			case GAMECODE_X2_ZX_FS:
				nums = _11x5_fs(codes);
				format = _format_numbers(cloneCodes, lottery, GAMECODE_X2_ZX_FS);
				randOrderFn = function () {
					var nums = randArray(2, [], 1, 11);

					nums = [[nums[0]], [nums[1]]];

					for (var i = 0; i < nums.length; i++) {
						for (var j = 0; j < nums[i].length; j++) {
							nums[i][j] = paddedZero(nums[i][j], 2);
						}
					}

					return nums;
				};
			break;
			
			// 11x5 - 任选2 - 组选复式
			case GAMECODE_X2_ZUX_FS:
				nums = _11x5_zux_fs(codes, 2);
				format = _format_numbers(codes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function (){
					var nums = randArray(2, [], 1, 11);
					for (var i = 0; i < nums.length; i++) {
						nums[i] = paddedZero(nums[i], 2);
					}

					return [nums];
				};
			break;

			// 11x5 - 任选3 - 任选复式
			case GAMECODE_X3_RX3Z3_FS:
				nums = _11x5_rx(codes, 3);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function() {
					var nums = randArray(3, [], 1, 11);
					for (var i = 0; i < nums.length; i++) {
						nums[i] = paddedZero(nums[i], 2);
					}

					return [nums];
				};
			break;

			// 11x5 - 任选3 - 任选胆拖
			// 11x5 - 任选3 - 组选胆拖
			case GAMECODE_X3_RX3Z3_DT:
			case GAMECODE_X3_ZUX_DT:
				nums = _11x5_dt(codes, 3);
				format = _format_numbers(cloneCodes, lottery, GAMECODE_X2_RX2Z2_DT);
				randOrderFn = function() {
					var dm = randNum(1, 11);
					var nums = randArray(2, [dm], 1, 11);
					nums = [[dm], nums];

					for (var i = 0; i < nums.length; i++) {
						for (var j = 0; j < nums[i].length; j++) {
							nums[i][j] = paddedZero(nums[i][j], 2);
						}
					}

					return nums;
				};
			break;
			
			// 11x5 - 任选3 - 直选复式
			case GAMECODE_X3_ZX_FS:
				nums = _11x5_fs(codes, 3);
				format = _format_numbers(codes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function (){
					var nums = randArray(3, [], 1, 11);
					var resNums = [];
					for (var i = 0; i < nums.length; i++) {
						resNums.push([paddedZero(nums[i], 2)]);
					}

					return resNums;
				};
			break;
			
			// 11x5 - 任选3 - 组选复式
			case GAMECODE_X3_ZUX_FS:
				nums = _11x5_zux_fs(codes, 3);
				format = _format_numbers(codes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function (){
					var nums = randArray(3, [], 1, 11);
					for (var i = 0; i < nums.length; i++) {
						nums[i] = paddedZero(nums[i], 2);
					}

					return [nums];
				};
			break;
			
			// 11x5 - 任选4 - 任选复式
			case GAMECODE_X4_RX4Z4_FS:
				nums = _11x5_rx(codes, 4);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function() {
					var nums = randArray(4, [], 1, 11);
					for (var i = 0; i < nums.length; i++) {
						nums[i] = paddedZero(nums[i], 2);
					}

					return [nums];
				};
			break;
			
			// 11x5 - 任选5 - 任选胆拖
			case GAMECODE_X4_RX4Z4_DT:
				nums = _11x5_dt(codes, 4);
				format = _format_numbers(cloneCodes, lottery, GAMECODE_X2_RX2Z2_DT);
				randOrderFn = function() {
					var dm = randNum(1, 11);
					var nums = randArray(3, [dm], 1, 11);
					nums = [[dm], nums];

					for (var i = 0; i < nums.length; i++) {
						for (var j = 0; j < nums[i].length; j++) {
							nums[i][j] = paddedZero(nums[i][j], 2);
						}
					}

					return nums;
				};
			break;
			
			// 11x5 - 任选5 - 任选复式
			case GAMECODE_X5_RX5Z5_FS:
				nums = _11x5_rx(codes, 5);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function() {
					var nums = randArray(5, [], 1, 11);
					for (var i = 0; i < nums.length; i++) {
						nums[i] = paddedZero(nums[i], 2);
					}

					return [nums];
				};
			break;

			// 11x5 - 任选5 - 任选胆拖
			case GAMECODE_X5_RX5Z5_DT:
				nums = _11x5_dt(codes, 5);
				format = _format_numbers(cloneCodes, lottery, GAMECODE_X2_RX2Z2_DT);
				randOrderFn = function() {
					var dm = randNum(1, 11);
					var nums = randArray(4, [dm], 1, 11);
					nums = [[dm], nums];

					for (var i = 0; i < nums.length; i++) {
						for (var j = 0; j < nums[i].length; j++) {
							nums[i][j] = paddedZero(nums[i][j], 2);
						}
					}

					return nums;
				};
			break;

			// 11x5 - 任选6 - 任选复式
			case GAMECODE_X6_RX6Z6_FS:
				nums = _11x5_rx(codes, 6);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function() {
					var nums = randArray(6, [], 1, 11);
					for (var i = 0; i < nums.length; i++) {
						nums[i] = paddedZero(nums[i], 2);
					}

					return [nums];
				};
			break;

			// 11x5 - 任选6 - 任选胆拖
			case GAMECODE_X6_RX6Z6_DT:
				nums = _11x5_dt(codes, 6);
				format = _format_numbers(cloneCodes, lottery, GAMECODE_X2_RX2Z2_DT);
				randOrderFn = function() {
					var dm = randNum(1, 11);
					var nums = randArray(5, [dm], 1, 11);
					nums = [[dm], nums];

					for (var i = 0; i < nums.length; i++) {
						for (var j = 0; j < nums[i].length; j++) {
							nums[i][j] = paddedZero(nums[i][j], 2);
						}
					}

					return nums;
				};
			break;

			// 11x5 - 任选7 - 任选复式
			case GAMECODE_X7_RX7Z7_FS:
				nums = _11x5_rx(codes, 7);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function() {
					var nums = randArray(7, [], 1, 11);
					for (var i = 0; i < nums.length; i++) {
						nums[i] = paddedZero(nums[i], 2);
					}

					return [nums];
				};
			break;

			// 11x5 - 任选7 - 任选胆拖
			case GAMECODE_X7_RX7Z7_DT:
				nums = _11x5_dt(codes, 7);
				format = _format_numbers(cloneCodes, lottery, GAMECODE_X2_RX2Z2_DT);
				randOrderFn = function() {
					var dm = randNum(1, 11);
					var nums = randArray(6, [dm], 1, 11);
					nums = [[dm], nums];

					for (var i = 0; i < nums.length; i++) {
						for (var j = 0; j < nums[i].length; j++) {
							nums[i][j] = paddedZero(nums[i][j], 2);
						}
					}

					return nums;
				};
			break;

			// 11x5 - 任选8 - 任选复式
			case GAMECODE_X8_RX8Z8_FS:
				nums = _11x5_rx(codes, 8);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function() {
					var nums = randArray(8, [], 1, 11);
					for (var i = 0; i < nums.length; i++) {
						nums[i] = paddedZero(nums[i], 2);
					}

					return [nums];
				};
			break;

			// 11x5 - 任选8 - 任选胆拖
			case GAMECODE_X8_RX8Z8_DT:
				nums = _11x5_dt(codes, 8);
				format = _format_numbers(cloneCodes, lottery, GAMECODE_X2_RX2Z2_DT);
				randOrderFn = function() {
					var dm = randNum(1, 11);
					var nums = randArray(7, [dm], 1, 11);
					nums = [[dm], nums];

					for (var i = 0; i < nums.length; i++) {
						for (var j = 0; j < nums[i].length; j++) {
							nums[i][j] = paddedZero(nums[i][j], 2);
						}
					}

					return nums;
				};
			break;
		}
	} else if (lottery == LOTTERY_PK10) {
		switch (game) {
			case GAMECODE_LMP_LH:
				for (var i = 0; i < codes.length; i++) {
					var code = codes[i];
					for (var j = 0; j < code.length; j++) {
						nums.push(code[j]);
					}
				}

				format = _format_numbers(cloneCodes, lottery, GAMECODE_LMP_LH);
				randOrderFn = function () {
					var nums = [ [], [], [], [], [] ];
					nums[randNum(0, 4)] = [["龙", "虎"][randNum(0, 1)]];

					console.log(['nums', nums]);

					return nums;
				};
			break;

			case GAMECODE_LMP_GYHDXDS:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					var names = ["大", "小", "单", "双"];
					return [[names[randNum(0, 3)]]];
				};
			break;

			case GAMECODE_LMP_DX:
				
				// 注数等于号码个数
				for (var i = 0; i < codes.length; i++) {
					var code = codes[i];
					for (var j = 0; j < code.length; j++) {
						nums.push(code[j]);
					}
				}
				
				// 格式转换
				for (var i = 0; i < cloneCodes.length; i++) {
					if (cloneCodes[i].length == 0) {
						cloneCodes[i] = ['-'];
					}
				}

				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_RX_RX2_ZXFS);
				randOrderFn = function () {
					var nums = [ [], [],[], [], [], [], [], [], [], [] ];
					nums[randNum(0, 9)] = [["大", "小", "单", "双"][randNum(0, 3)]];

					return nums;
				};
			break;
			
			// 前五定位胆
			// 后五定位胆
			case GAMECODE_DWD_QWDWD:
			case GAMECODE_DWD_HWDWD:
				for (var i = 0; i < codes.length; i++) {
					var code = codes[i];
					for (var j = 0; j < code.length; j++) {
						nums.push(code[j]);
					}
				}
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_DWD_QWDWD);
				randOrderFn = function () {
					var nums = [ [], [],[], [], [], [], [], [],[], [] ];
					nums[randNum(0, 9)] = [paddedZero(randNum(1, 10), 2)];
					return nums; 
				};
			break;

			case GAMECODE_Q2_GYH:
				var tmpNums = _hz_zuhe(codes, 2, 1, 10);
				// 去掉2个相同数字的号码
				for (var i = 0; i < tmpNums.length; i++) {
					if (_all_not_same(tmpNums[i])) {
						nums.push(tmpNums[i]);
					}
				}
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					return [[paddedZero(randNum(3, 19), 2)]];
				};
			break;

			case GAMECODE_Q2_Q2FS:
			case GAMECODE_Q2_CQ2:
			case GAMECODE_Q3_CQ3:
			case GAMECODE_Q3_Q3FS:
			case GAMECODE_Q4_CQ4:
			case GAMECODE_Q4_Q4FS:
			case GAMECODE_Q5_CQ5:
			case GAMECODE_Q5_Q5FS:
				nums = _not_same_fs_zuhe(codes);
				console.log(['复式组合', nums]);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				let len = 2;
				if (game == GAMECODE_Q3_CQ3 || game == GAMECODE_Q3_Q3FS) {
					len = 3;
				} else if (game == GAMECODE_Q4_CQ4 || game == GAMECODE_Q4_Q4FS) {
					len = 4;
				} else if (game == GAMECODE_Q5_CQ5 || game == GAMECODE_Q5_Q5FS) {
					len = 5;
				}
				randOrderFn = function () {
					var nums = randArray(len, [], 1, 10);
					for (var i = 0; i < nums.length; i++) {
						nums[i] = [paddedZero(nums[i], 2)];
					}
					return nums;
				};
			break;
		}
	} else if (lottery == LOTTERY_K3) {
		switch (game) {
			case GAMECODE_HZ_DX_DS:
			case GAMECODE_HW_DX_DS:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				
				randOrderFn = function () {
					var nums = ['大', '小', '单', '双'];
					return [ [nums[randNum(0, 3)]] ];
				};

			break;

			case GAMECODE_HZ_HZ_HZ:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);

				randOrderFn = function () {
					return [ [randNum(3, 18)] ];
				};
			break;

			case GAMECODE_DS_DTYS:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					return [ [randNum(1, 6)] ];
				};
			break;

			case GAMECODE_ES_EBT:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					var nums = _shuzi_zuhe( [ [1,2,3,4,5,6], [1,2,3,4,5,6] ] );
					nums = _unique_and_sort(nums, true);

					return [ [ nums[randNum(0, nums.length - 1)].replace(',', '')] ];
				};
			break;

			case GAMECODE_ES_ETH:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);

				randOrderFn = function () {
					var nums = _shuzi_zuhe( [ [1,2,3,4,5,6], [1,2,3,4,5,6]] );
					nums = _unique_and_sort(nums, true);
					
					var num = nums[randNum(0, nums.length - 1)];
					num = num[0] + num;

					return [ [num.replace(/\,/g, '')] ];
				};

			break;

			case GAMECODE_SS_SLH:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				
				randOrderFn = function () {
					var nums = ['123','234','345', '456'];
					return [[nums[randNum(0, nums.length - 1)]]];
				};

			break;

			case GAMECODE_SS_SBT:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);

				randOrderFn = function () {
					var nums = _shuzi_zuhe( [ [1,2,3,4,5,6], [1,2,3,4,5,6], [1,2,3,4,5,6]] );
					nums = _unique_and_sort(nums, true);
					var rnums = [];
					for (var i = 0; i < nums.length; i++) {
						if (_all_not_same(nums[i].split(SEPERATOR))) {
							rnums.push(nums[i]);
						}
					}
					return [[rnums[randNum(0, rnums.length - 1)].replace(/\,/g, '')]];
				};
			break;

			case GAMECODE_SS_STH:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					var nums = [ '111','222','333','444','555','666' ]
					return [[nums[randNum(0, nums.length - 1)].replace(/\,/g, '')]];
				};
			break;
		}
	} else if (lottery == LOTTERY_28) {
		switch (game) {
			case GAMECODE_TM_ZX: 
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					return [ [randNum(0, 27)] ];
				};
			break;

			case GAMECODE_TM_BS:
				if (codes.length < 3) nums = [];
				else nums = [1];
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					return [ randArray(3, [], 0, 27) ];
				};
			break;

			case GAMECODE_TM_DXDS:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					var nums = ['大', '小', '单', '双'];
					return [ [nums[randNum(0, 3)]] ];
				};
			break;

			case GAMECODE_TM_ZHDXDS:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					var nums = ['大单', '小单', '大单', '小双'];
					return [ [nums[randNum(0, 3)]] ];
				};
			break;

			case GAMECODE_TM_JZ:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					var nums = ['极大', '极小'];
					return [ [nums[randNum(0, 1)]] ];
				};
			break;

			case GAMECODE_TM_BOSE:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					var nums = ['红波', '蓝波', '绿波'];
					return [ [nums[randNum(0, 2)]] ];
				};
			break;

			case GAMECODE_TM_BZ:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					var nums = ['豹子'];
					return [ nums ];
				};
			break;

			case GAMECODE_DWD_DWD_DWD:
				nums = _dwd_zuhe(codes);
				for (var i = 0; i < cloneCodes.length; i++) {
					if (cloneCodes[i].length <= 0) {
						cloneCodes[i] = ['-'];
					}
				}
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
				randOrderFn = function ()  {
					var pos = randNum(0, 2);
					var num = randNum(0, 9);
					var nums = [[],[],[]];
					nums[pos] = [num]; 

					return nums;
				};
			break;

			case GAMECODE_BDW_BDW_BDW:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);// 显示格式和复式一样
				randOrderFn = function ()  {
					return [randArray(1)];
				};
			break;
			
			case GAMECODE_SX_ZUX:
				
				var t = {"0": [], "1": codes};
				nums = _chonghao_zuhe(t, 'd', 3, true);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS); // 显示格式和复式一样
				
				randOrderFn = function ()  {
					return [randArray( 3)];
				}

			break;

			case GAMECODE_SX_FS:
				
				nums = _shuzi_zuhe(codes);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS); // 显示格式和复式一样
				randOrderFn = function () {
					return [ randArray(1), randArray(1), randArray(1) ];
				};
				
			break;

			case GAMECODE_EX_Q2_Q2FS:
			case GAMECODE_EX_H2_Q2FS:
					


				nums = _shuzi_zuhe(codes);
				if (game == GAMECODE_EX_Q2_Q2FS) {
					cloneCodes.push(['-']);
				} else {
					cloneCodes.unshift(['-']);
				}
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					return [randArray(1), randArray(1)];
				};

			break;

			case GAMECODE_EX_Q2_Q2ZUX:
			case GAMECODE_EX_H2_Q2ZUX: 
				
				var t = {"0": [], "1": codes};
				nums = _chonghao_zuhe(t, 'd', 2, true);
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS); // 显示格式和复式一样
				
				randOrderFn = function ()  {
					return [randArray( 2)];
				}

			break;

		}
	} else if (lottery == LOTTERY_LHC) {
		switch (game) {
			case GAMECODE_LHC_TM_ZM:
			case GAMECODE_LHC_ZM_ZM:
			case GAMECODE_LHC_ZTM_Z1T:
			case GAMECODE_LHC_ZTM_Z2T:
			case GAMECODE_LHC_ZTM_Z3T:
			case GAMECODE_LHC_ZTM_Z4T:
			case GAMECODE_LHC_ZTM_Z5T:
			case GAMECODE_LHC_ZTM_Z6T:
				nums = codes;
				format = _format_numbers(cloneCodes, LOTTERY_SSC, GAMECODE_WX_ZX_FS);
				randOrderFn = function () {
					return [ [ paddedZero(randNum(1, 49), 2)] ];
				};
			break;
		}
	}

	return [nums, format, randOrderFn];
}

// 获取投注的汇总数据
// 投注的组合号码列表
// 显示的内容
// 投注总注数
export function getSummaryTotal(lottery, gameCode, codes) {
	
	// 时时彩
	if (lottery.indexOf(LOTTERY_SSC) != -1) {
		gameCode = gameCode.replace(lottery + '_', '');
		lottery = LOTTERY_SSC;
	}
	// 分分彩
	if (lottery.indexOf(LOTTERY_FFC) != -1) {
		gameCode = gameCode.replace(lottery + '_', '');
		lottery = LOTTERY_SSC;
	}

	// 11x5 
	if (lottery.indexOf(LOTTERY_11X5) != -1) {
		gameCode = gameCode.replace(lottery + '_', '');
		lottery = LOTTERY_11X5;
	}

	// 北京赛车
	if (lottery.indexOf('bjsc') != -1) {
		gameCode = gameCode.replace(lottery + '_', '');
		lottery = LOTTERY_PK10;
	}
	// 飞艇
	if (lottery == 'ft') {
		gameCode = gameCode.replace(lottery + '_', '');
		lottery = LOTTERY_PK10;
	}

	// 福彩3d / 排列3 
	if (lottery.indexOf('fc3d') != -1 || lottery.indexOf('pl3') != -1 ) {
		gameCode = gameCode.replace(lottery + '_', '');
		lottery = LOTTERY_3D;
	}
	
	// 快三
	if (lottery.indexOf(LOTTERY_K3) != -1) {
		gameCode = gameCode.replace(lottery + '_', '');
		lottery = LOTTERY_K3;
	}

	// 数字28
	if (lottery.indexOf(LOTTERY_28) != -1) {
		gameCode = gameCode.replace(lottery+'_', '');
		lottery = LOTTERY_28;
	}

	if (lottery.indexOf('hk6') != -1) {
		gameCode = gameCode.replace(lottery+'_', '');
		lottery = LOTTERY_LHC;
	}

	var res = _calculateNumbers(codes, lottery, gameCode);
	return {
		numbers: res[0],
		format: res[1],
		length: res[0].length,
		randFn: res[2],
	};
}

export function randOrderFunction(lottery, gameCode) {
	var res = getSummaryTotal(lottery, gameCode, []);
	return res['randFn'];
}

export function formatPrice(num) {
	num = num * 1;
	return new Number(num).toFixed(2);
}

const posarr = ["万", "千", "百", "十", "个"];
const codes = {'rx_rx2_zuxfs': 2, 'rx_rx3_zu3': 3, 'rx_rx3_zu6': 3};
export function rxShouldRendeAndDefaultPos(gameCode) {
  let shouldRende = false;
  let len = 0;
  for (let code in codes) {
    if (gameCode.indexOf(code) != -1) {
      shouldRende = true;
      len = codes[code];
      break;
    }
  }
  let selectPos = posarr.slice(0, len);
  return [shouldRende, selectPos];
}