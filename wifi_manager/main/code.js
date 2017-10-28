// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

var selectedSSID = "";
var refreshAPInterval = null; 

$(function() {

	$(".networks").on("click", "label", function() {
		$( ".networks" ).slideUp( "fast", function() {});
		$( ".login" ).slideDown( "fast", function() {});
		$( "#login-data" ).slideDown( "fast", function() {});
		$( "#app h2" ).text("Password for " + $(this).text());
		selectedSSID = $(this).text();
	});
	
	$( "#cancel" ).click(function() {
		//$("#join").prop("disabled", false);
		
		$( "#login-data" ).slideUp( "fast", function() {});
		$( "#loading" ).slideUp( "slow", function() {});
		
		
		$( ".networks" ).slideDown( "fast", function() {});
		$( ".login" ).slideUp( "fast", function() {});
		$( "#app h2" ).text("Choose a network...");
	});
	
	$( "#acredits").click(function(event) {
		event.preventDefault();
		$( "#app").slideUp( "fast", function() {});
		$( "#credits").slideDown( "fast", function() {});
	});
	
	$( "#okcredits").click(function() {
		$( "#app").slideDown( "fast", function() {});
		$( "#credits").slideUp( "fast", function() {});
	});
	
	

	
	
	function performConnect(){
		
		$("#loadingButton").prop("disabled",true);
		
		var xhr = new XMLHttpRequest();
		
		xhr.onload = function() {
			if(this.status == 200){
				//start refreshing every now and then the IP page
				//to see if the connection to the STA is made
			}
			else{
				//alert(this.responseText);
			}
		};
		
		var pwd = $("#pwd").val();
		xhr.open("POST", "/connect", true);
		xhr.setRequestHeader('Authorization', "\x02{0}\x03\x02{1}\x03".format(selectedSSID, pwd));
		xhr.send();
	}
	
	$(document).on("click", "#join", function() {
		
		if(refreshAPInterval != null){
			clearInterval(refreshAPInterval);
		}
		
		//disable buttons
		//$("#join").prop("disabled", true);
		//$("#join").prop("disabled", true);
		$( "#buttons" ).slideUp( "fast", function() {});
		$( "#login-data" ).slideUp( "fast", function() {});
		$( "#loading" ).slideDown( "slow", function() {});
		$( "#app h2" ).text("Connecting to " + selectedSSID);
		
		performConnect();

		
		
	});
	
	
	refresh_wifi();
	refreshAPInterval = setInterval(refresh_wifi, 3000);
	
});


function check_if_connected(){
	$.getJSON( "/status", function( data ) {
		if(data.length > 0){
			//lol
		}
	});
}

function rssi_to_icon(rssi){
	if(rssi >= -60){
		return 'w0';
	}
	else if(rssi >= -67){
		return 'w1';
	}
	else if(rssi >= -75){
		return 'w2';
	}
	else{
		return 'w3';
	}
}

function refresh_wifi(){
	$.getJSON( "/ap.json", function( data ) {
		if(data.length > 0){
			//sort by wifi strength
			data.sort(function (a, b) {
				var x = a["rssi"]; var y = b["rssi"];
				return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			});
			
			var h = "";
			var id = 1;
			data.forEach(function(e) {
				h += '<input id="{0}" name="wifi" type="radio" /><label class="{1}" for="{2}"><div class="{3}">{4}</div></label>'.format(id, rssi_to_icon(e.rssi), e.ssid ,e.auth==0?'':'pw',e.ssid);
				id++;
			});
			
			$( ".networks" ).html(h)
		}
	});
}