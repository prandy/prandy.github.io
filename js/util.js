// ###################################################################################
// 입력 문자 최대 입력 범위 체크
// ###################################################################################
function checkMaxBytes(trgtObj, dvLengthNm, maxLength, trgtNm) {
	
	if (typeof maxLength == "string" && document.getElementById(maxLength)) maxLength = document.getElementById(maxLength).innerHTML;

	maxLength = Number(maxLength);
	if (maxLength == "NaN") {
		alert("Parameter Type Error");
		return;
	}

	var data = String(trgtObj.value);
	if (data.trim() == "") {
		if (dvLengthNm != "") document.getElementById(dvLengthNm).innerHTML = 0;
		trgtObj.value = "";
		return;
	}

	var currLen = data.bytes();
	if (currLen > maxLength) {
		top.Ext.MessageBox.alert("확인", trgtNm+"은(는)" + maxLength+"바이트 이상 입력하실 수 없습니다."
				, function(){
					data = data.cutByte(maxLength, "");
					trgtObj.value = data;
					currLen = data.bytes();
					if (dvLengthNm != "") document.getElementById(dvLengthNm).innerHTML = currLen;
				}
		);
	}
	if (dvLengthNm != "") document.getElementById(dvLengthNm).innerHTML = currLen;
}

// String 타입 프로토타입 정의
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};
String.prototype.ltrim = function() {
	return this.replace(/^\s+/, '');
};
String.prototype.rtrim = function() {
	return this.replace(/\s+$/, '');
};
String.prototype.cutByte = function(len, add) {
	var str = this;
	var dft = (typeof(add) != "undefined") ? add : "..";
	var l = 0;
	for (var i=0; i<str.length; i++) {
		l += (str.charCodeAt(i) > 128) ? 2 : 1;
		if (l > len) return str.substring(0,i) + dft;
	}
	return str;
};
String.prototype.bytes = function() {
	var str = this;
	var l = 0;
	for (var i=0; i<str.length; i++) l += (str.charCodeAt(i) > 128) ? 2 : 1;
	return l;
};
String.prototype.jsRep = function(dlmt, rep) {
	var str = this;
	if (str.trim() == '') return str;

	var tmp = str.split(dlmt);
	return tmp.join(rep);
};
String.prototype.removeComma = function() {
	return this.trim().replace(/,/g, "");
};
String.prototype.num2Comma = function() {
	var argStr = String(Number(this.removeComma()));
	var rtnStr = "";
	var split1 = "";
	var split2 = "";
	var isMinus = false;

	if (argStr == '')	return '';

	if (argStr < 0) {
		argStr *= -1;
		isMinus = true;
	}

	if (typeof argStr != "string") argStr = "" + argStr;
	if (argStr.indexOf(".") > 0) {
		split1 = argStr.substring(0, argStr.indexOf("."));
		split2 = argStr.substr(argStr.indexOf("."));
		argStr = split1;
	}

	var commaPos = argStr.length%3;

	if(commaPos) {
		rtnStr = argStr.substring(0, commaPos);
		if (argStr.length > 3) rtnStr += ",";
	} else {
		rtnStr = "";
	}

	for (var i=commaPos; i < argStr.length; i+=3 ){
		rtnStr += argStr.substring(i, i+3);
		if (i < argStr.length-3) rtnStr += ",";
	}

	if (isMinus)	rtnStr = "-" + rtnStr;
	return rtnStr + split2;
};
String.prototype.num2Han = function() {
	var num = String("" + Number(this.removeComma()));
	var hangul = num;
	// var
	/*
	 * 숫자2한글 스크립트
	 */
	var i, j=0, k=0;
	var han1 = new Array("","일","이","삼","사","오","육","칠","팔","구");
	var han2 = new Array("","만","억","조","경","해","시","양","구","간");
	var han3 = new Array("","십","백","천");
	var result="", pm = "";
	var str = new Array(), str2="";
	var strTmp = new Array();

	if (num.trim() == "" || num.trim() == "0" ) {
		return "";
	}

	if(hangul.substring(0,1) == "-"){ // 음수 처리
		pm = "마이너스 ";
		hangul = hangul.substring(1, hangul.length);
	}
	if(hangul.length > han2.length*4) return "too much number"; // 범위를 넘는 숫자 처리
																// 자리수 배열 han2에
																// 자리수 단위만 추가하면
																// 범위가 늘어남.

	for(i=hangul.length; i > 0; i=i-4){
		str[j] = hangul.substring(i-4,i); // 4자리씩 끊는다.
		for(k=str[j].length;k>0;k--){
			strTmp[k] = (str[j].substring(k-1,k))?str[j].substring(k-1,k):"";
			strTmp[k] = han1[parseInt(strTmp[k])];
			if(strTmp[k]) strTmp[k] += han3[str[j].length-k];
				str2 = strTmp[k] + str2;
		}
		str[j] = str2;
		if(str[j]) result = str[j]+han2[j]+result;
		// 4자리마다 한칸씩 띄워서 보여주는 부분. 우선은 주석처리
		// result = (str[j])? " "+str[j]+han2[j]+result : " " + result;

		j++; str2 = "";
	}

	return pm + result; // 부호 + 숫자값
};
String.prototype.isUseHangul = function() {
	var str = this;

	if (str.trim() == "") return false;

	for (var i=0; i<str.length; i++) {
		if (str.charCodeAt(i) > 128) return true;
	}
	return false;
};
String.prototype.getIndexUseHangul = function() {
	var str = this;

	if (str.trim() == "") return -1;

	for (var i=0; i<str.length; i++) {
		if (str.charCodeAt(i) > 127) return i;
	}
	return -1;
};
Array.prototype.indexOf = function(value, obj) {
	var i = 0;
	var tmp;
	while(i < this.length) {
		if(typeof obj == "undefined") {
			if (this[i] == value) return i;
		} else {
			eval("tmp = this[i]." + obj);
			if (tmp == value) return i;
		}
		i++;
	}
	return -1;
};

// 숫자만입력 가능토록
function checkNumKeyDwn(obj, e, useNegative){
	if (!e) e = window.event;
	useNegative = useNegative || false;

	var shift = e.shiftKey || window.event.shiftKey;
	var ctrl = e.ctrlKey|| window.event.ctrlKey;
	var kc = e.keyCode ? e.keyCode : e.which ? e.which : e.charCod;
	// 음수값 사용시 - 부호 사용 가능
	if ( (!shift && (kc<=57 && kc>=48)) || (kc<=105 && kc>=96) || kc == 8 || kc == 9 || kc== 13 || kc == 46 || kc== 36 || kc== 35 || kc == 37 || kc == 39
			|| (useNegative && (kc == 109 || kc == 189))
			|| (ctrl && kc == 67)
			|| (ctrl && kc == 86)
		)
	{
		obj.value = obj.value.replace(/\s/g, '');
		return true;
	} else {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('firefox') != -1) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return false;
	}
}
//숫자와 콤마(.)만 입력 가능토록
function checkNumKeyDwn2(obj, e, useNegative){
	if (!e) e = window.event;
	useNegative = useNegative || false;

	var shift = e.shiftKey || window.event.shiftKey;
	var ctrl = e.ctrlKey|| window.event.ctrlKey;
	var kc = e.keyCode ? e.keyCode : e.which ? e.which : e.charCod;
	// 음수값 사용시 - 부호 사용 가능
	if ( (!shift && (kc<=57 && kc>=48)) || (kc<=105 && kc>=96) || kc == 8 || kc == 9 || kc== 13 || kc == 46 || kc== 36 || kc== 35 || kc == 37 || kc == 39 || kc == 190
			|| (useNegative && (kc == 109 || kc == 189))
			|| (ctrl && kc == 67)
			|| (ctrl && kc == 86)
		)
	{
		obj.value = obj.value.replace(/\s/g, '');
		return true;
	} else {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('firefox') != -1) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return false;
	}
}
// 금액 영역 포커스 인
function removeComma(trgtObj) {
	var data = String(trgtObj.value);
	
	if (data == "") return
	trgtObj.value = data.removeComma();
}

// 판매가 변경시 한글 금액 표시
function showNum2Han(value, showObjNm) {
	var showObj = document.getElementById(showObjNm);
	var rtnStr = String(value).num2Han();
	showObj.innerHTML = rtnStr;
}
// 금액 영역 콤마처리
function showNum2Comma(trgtObj) {
	//alert("showNum2Comma");
	var data = String(trgtObj.value).replace(/\s/g, '');
	//alert("showNum2Comma - data:"+data);
	if (data == "") return
	//alert("showNum2Comma - data.num2Comma():"+data.num2Comma());
	trgtObj.value = data.num2Comma();
}

//금액 영역 콤마처리
function showNum2CommaOfId(trgtObj) {
	//alert("showNum3Comma");
	var data = String(trgtObj.val()).replace(/\s/g, '');
	//alert("showNum3Comma - data:"+data);
	if (data == "") return
	//alert("showNum3Comma - data.num2Comma():"+data.num2Comma());
	trgtObj.val(data.num2Comma());
	//trgtObj.value = data.num2Comma();
}

//*************************************************/
// 날짜 계산
// *************************************************/
function getDateOfPlusMinusDay( _fromDate, _intDay){
	
	var diffDay = parseInt(_intDay) * 1000 * 60 * 60 * 24 ;
	var result = new Date(Date.parse(_fromDate) + diffDay);
	
	var resultYear = result.getFullYear();
	var resultMonth = (result.getMonth()+1)+"";
	var resultDay = result.getDate()+"";
	 
	if(resultMonth.length == 1)resultMonth = resultMonth = "0"+resultMonth;
	if(resultDay.length == 1)resultDay = resultDay = "0"+resultDay;
	
	return resultYear+resultMonth+resultDay;	
}

//*************************************************/
// 날짜 (현재월의 01일자)
//*************************************************/
function getDateOfFirstDay(_fromDate){
	var result = new Date(Date.parse(_fromDate));
	var resultYear = result.getFullYear();
	var resultMonth = (result.getMonth()+1)+"";

	if(resultMonth.length == 1)resultMonth = resultMonth = "0"+resultMonth;

	return resultYear+resultMonth+"01";	
}
//*************************************************/
//날짜 (DateTime Format : 2011-01-01 12:55:12)
//*************************************************/
function getDateTimeFormat( _dateTime ){
    var d = new Date(_dateTime);   
    var obj = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + " " + d.getHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();   
    return obj; 
}
//*************************************************/
// 할인율 및 판매가격 계산
//************************************************/
function chageCostPrice(){

	//1. 판매가격 계산
	var orgObj_1 = $('#cost_price');
	var applyObj_1 = $('#discount_price');
	var targetObj_1 = $('#purchase_price');
	var unit_1 = $('#cd_discount_type option:selected').text();
	
	changePrice(orgObj_1,applyObj_1,targetObj_1,unit_1,1);
	//
	//2.적립금 계산
	var orgObj_2 = $('#purchase_price');
	var applyObj_2= $('#earn_price');
	var targetObj_2 = $('#reserve_price');
	var unit_2 = $('#cd_earn_type option:selected').text();
	
	changePrice(orgObj_2,applyObj_2,targetObj_2,unit_2,2);				
}

// 판매가 및 적립금 변경시 처리 
// * param : orgObj(정상가격 ) , applyObj(적용금액및%) , targetObj(계산된금액) , unit(계산방법- %
// , 원) , _flag( 1 : 판매가 , 2 :적립금)
function changePrice (_orgObj, _applyObj, _targetObj,  _unit, _flag ){
	// 콤마 처리
	// showNum3Comma(_orgObj);
	// showNum3Comma(_applyObj);
	//showNum2Comma(_orgObj);
	
	// 판매가 및 적립금 계산
	var orgPrice = $(_orgObj).val().removeComma(); // 정상가격
	var applyPrice = $(_applyObj).val().removeComma(); // 할인율
	var resultPrice ; // 판매가격
	// alert('orgprice:['+orgPrice+'], applyPrice:['+applyPrice+']');
	
	_targetObj.val('');
	//alert('orgPrice:'+orgPrice+', applyPrice:'+applyPrice+',_flag:'+_flag);
	if(orgPrice == "" || orgPrice == "0" ||orgPrice == null ||
	   applyPrice == "" || applyPrice == "0" || applyPrice == null) {
		//alert('orgprice , applyprice = null - return');
		// $(orgObj).val('');
		$(_applyObj).val(''); 
		return;
	}

	if( _flag == '1'){
		//alert('_flag---1');
		resultPrice = calculatePurchasePrice(orgPrice,applyPrice,_unit);
		if(resultPrice <= 0 ){
			alert("할인금액/율 이 정상가격보다 적습니다.");
			$(_applyObj).val('');
			return;
		}
	}else if(_flag == '2'){
		//alert('_flag---2');
		resultPrice = calculateSaveMoney(orgPrice,applyPrice,_unit);
		// alert('resultPrice:['+resultPrice+'],orgPrice:['+orgPrice+']');
		if(resultPrice*1 >= orgPrice*1 ){
			alert("적립금이 판매가 보다  큽니다.");
			$(_applyObj).val('');
			return;
		}
	}else return;

	var resultPrice = String(resultPrice).replace(/\s/g, '');
		resultPrice = resultPrice.num2Comma();
		_targetObj.val(resultPrice);		
}	

function calculatePurchasePrice( _orgPrice,_applyPrice,_unit){
	
	var resultPrice ;
	
	if(_unit == '원'){
		resultPrice = _orgPrice - _applyPrice;
	}else if(_unit == '%'){
		resultPrice = _orgPrice -( _orgPrice * (_applyPrice/100)); 
	}else {
		return;
	}
	
	return resultPrice;
}

function calculateSaveMoney( _orgPrice,_applyPrice,_unit){
	
	var resultPrice ;
	
	if(_unit == '원'){
		resultPrice = _applyPrice;
	}else if(_unit == '%'){
		resultPrice = _orgPrice * (_applyPrice/100); 
	}else {
		return;
	}
	
	return resultPrice;
}

jQuery.cookie = function (key, value, options) {
    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};