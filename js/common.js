$(document).ready(function() {

	// 왼쪽메뉴
	$("#secondpane a.menu_head").mouseover(function()
	{
		$(this).css({color:"#c9d576"})
			.next("div.menu_body")
			.slideDown(300)
			.siblings("div.menu_body")
			.slideUp(300);
		$(this).siblings()
			.css({color:"#999"});
	});

	$("#secondpane a.menu_head").mouseout(function()
	{
		$("#secondpane a.menu_head").siblings()
			$(this).css({color:"#c9d576"});
	});

	// 상단메뉴
	$("#tab_menu1").click(function(){
		$(".s_menu_01").show();
		$(".s_menu_02,.s_menu_03").hide();
		$("#tab_menu1").addClass("on");
		$("#tab_menu2,#tab_menu3").removeClass("on");
	});
	$("#tab_menu2").click(function(){
		$(".s_menu_02").show();
		$(".s_menu_01,.s_menu_03").hide();
		$("#tab_menu2").addClass("on");
		$("#tab_menu1,#tab_menu3").removeClass("on");
	});
	$("#tab_menu3").click(function(){
		$(".s_menu_03").show();
		$(".s_menu_01,.s_menu_02").hide();
		$("#tab_menu3").addClass("on end");
		$("#tab_menu1,#tab_menu2").removeClass("on end");
	});
});



