// slickplaid's Torpia Enhancement
// version 2.1.5beta
// 04-14-2009, updated 10-26-2009
// Copyright (c) 2009, slickplaid
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.  To install it, you need
// Greasemonkey 0.3 or later: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Torpia Enhancement", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name		Torpia Enhancement Beta
// @namespace	http://hg.slickplaid.net/
// @description	Version 2.1.5beta - Ajaxy Goodness for the game Torpia. Once installed, just refresh the page and you're set. Visit http://hg.slickplaid.net/ or http://forum.torpia.com/showthread.php?t=761 for help.
// @include		http://*.torpia.com/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==
var	v = '2.1.5beta';
// Localization
var dict = {
	err: 'Error.',
	loading: 'Loading.'
};
var locale = window.location.hostname.split('.');
var server = locale[0];
locale = locale[2];

(function($){
	$.fn.buildMenu = function(options) {
			$.fn.buildMenu.defaults = {
				amt: 0,
				names: 'Error',
				objectID: 0,
				queueType: 0,
				pill: false,
				stype: false
			};
			var o = $.extend($.fn.buildMenu.defaults, options);
			
			return this.each(function () {
				// create references	
				var obj = $(this);
				var slot = obj.attr('id').replace(/building/, '');
				var title = obj.attr('title').replace(/Under construction: /, '').replace(/Level /, '');
				var w = 50/(o.amt+1);
				$('.gen').append('<div class="genmenu slot'+slot+'" slot="'+slot+'"><a class="gentitle" href="/building/building/'+slot+'" alt="'+title+'" title="'+title+'">'+title+'</a></div>');
				
				for(i=0;i<o.amt;i++){
					$('.slot'+slot).append('<a class="genfill" slot="'+slot+'" objectid="'+o.objectID[i]+'" stype="'+o.stype[i]+'" queuetype="'+o.queueType[i]+'" style="width: '+w+'%">'+o.names[i]+'</a>');
					if(o.pill === true) $('.slot'+slot+' a[slot='+slot+']').attr('amount','pill');
				}
				
				$('.slot'+slot).append('<a class="genupgrade" slot="'+slot+'" style="width: '+w+'%">&uarr;</a>');
			});
		};
})(jQuery);

function getStats(){
	$.ajax({
		type: 'GET',
		url: '/statistics',
		success: function(data){
			var stats = [ $(data).find('.selected td:eq(0)').text(), $(data).find('.selected td:eq(1)').html(), $(data).find('.selected td:eq(2)').html(), $(data).find('.selected td:eq(3)').html(), $(data).find('.selected td:eq(4)').text(), $(data).find('.selected td:eq(5)').html(), $(data).find('.selected td:eq(6)').html().replace(/\s/g,''), $(data).find('.selected td:eq(7)').html() ];
			$('.stats').html('<tr><th>Stats</th></tr><tr><th>Name: '+stats[1]+'</th><th>Rank: '+stats[0]+' ('+stats[6]+')</th><th>Brotherhood: '+stats[3]+'</th><th>Amulets: '+stats[4]+'</th><th>Towns: '+stats[5]+'</th>');
		},
		error: function(){
			$('.stats').html(dict.err);
		}
	});
}

function genfo(server, ethic){
	var sel = {
		town : ($('#focusvillage option:selected').text() === '') ? $('.cust_villagesel').text() : $('#focusvillage option:selected').text(),
		tid : $('#focusvillage option:selected').attr('value') 
	};
	$('.genfo thead').append('<tr>'+
		'<th class="la sb" colspan="2">'+sel.town+' (Coords go here!)</th></tr><tr><th class="la sb">Town ID</th><th>Stats</th>'+
	'</tr><tr>'+
		'<td class="ra">'+sel.tid+'</td><td class="sstat">'+dict.loading+'</td></tr>');
	getStats();
}

$(function(){
	try {
		// check for Evil or Good Ethic
		var ethic = $('body').attr('class');
		

		// -------------------- ajax functions
		function submitBuild(slot) {
			$('.slot'+slot+' .gentitle').html('Sending...');
			$.ajax({
				type: 'POST',
				url: '/building/upgrade/'+slot,
				async: true,
				success: function(data){
					$('.slot'+slot+' .gentitle').html('<span class="status'+slot+'">Sent!</span>');
					$('.status'+slot).fadeOut(2500, function () {
						$('.slot'+slot+' .gentitle').html($('.slot'+slot+' .gentitle').attr('title'));
					});
					map=$(data).find('.tile_'+slot);
					itimeleft=$(data).find('#building'+slot).attr('itimeleft');
					$('tile_'+slot).remove();
					$('.village').append(map);
					$('#building'+slot).attr('itimeleft',itimeleft);
					updateStock(ethic);
				},
				error: function(){
					slot = $(this).attr('slot');
					$('.slot'+slot).text('Error');
			}
		});
		}
		function submitTroop(objectID, slot, amount, queueType, stype){
			$('.slot'+slot+' .gentitle').html('Requesting Max');
			
			if (server == 'w1' || server == 'w2' || server == 'w3') {
				postUrl = '/building/building/'+slot+'/produce';
				qID = 'batchtype';
			} else {
				postUrl = '/building/upgrade/'+slot;
				qID = 'queuetype';
			}
			
			
			// have to check for max amount
			$.ajax({
				type: 'GET',
				url: '/building/building/'+slot,
				success: function(data){
					// using an abbreviated/modified version of the getMaxItems() function
					var maximum = false;
					$(data).find('.'+stype).each(function(){
						thisMaximum = parseInt($(this).attr('has') / $(this).attr('need'),10);
						if (maximum == false || thisMaximum < maximum) {
							maximum = thisMaximum;
							reasonformaximum = 'materials';
						}
					});
					roomPerBatch = $(data).find('#batchsize').attr('value');
					totalRoom = roomPerBatch * 5;
					$(data).find('.batchindicator').each(function() {
						if ($(this).attr('type') != stype) {
							totalRoom -= roomPerBatch;
						}
						else {
							totalRoom = totalRoom - $(this).attr('current');
						}
					});
					if (totalRoom < maximum) {
						maximum = totalRoom;
						reasonformaximum = 'batchsize';
					}
					roomForThisItem = $(data).find('#'+stype+'Info').attr('capacity') - $(data).find('#'+stype+'Info').attr('stored'); 
					if (roomForThisItem < maximum) {
						maximum = roomForThisItem;
						reasonformaximum = 'storage';
					}
					var housingleft = $(data).find('#housingleft').attr('value');
					if (housingleft != 'n/a') {
						housingperunit = $(data).find('#'+stype+'Info').attr('housing');
						canhouseunits = parseInt(housingleft / housingperunit,10);
						if (canhouseunits < maximum) {
							maximum = canhouseunits;
							reasonformaximum = 'housing';
						}
					}
					maximum = Math.max( maximum, 0 );
				
					$('.slot'+slot+' .gentitle').html('Able to queue '+maximum);
					if(amount === undefined && amount != 'pill'){
						amount=maximum;
					}
					queryString = 'amount='+amount+'&slot='+slot+'&objectid='+objectID+'&'+qID+'='+queueType;
					sendurl = (amount != 'pill') ? '/building/building/'+slot+'/produce' : '/building/building/'+slot+'/pillory';
					$.ajax({
						type: 'POST',
						url: sendurl,
						data: queryString,
						success: function(){
							$('.slot'+slot+' .gentitle').html('<span class="status'+slot+'">Queued '+amount+'!</span>');
							$('.slot'+slot+' .gentitle').fadeTo(2500, 1, function(){
								$(this).fadeIn(10).html($('.slot'+slot+' .gentitle').attr('title'));
							});
							
							updateStock(ethic);
						},
						error: function(){
							$('.slot'+slot).text('Unable to queue value. ('+maximum+')');
						}
					});
				},
				error: function(){
					$('.slot'+slot).text('Error retrieving max amount.');
				}
			});
		}
		function updateStock(ethic){		
			$.ajax({
				type: 'POST',
				url: '/village/getitems/',
				async: true,
				success: function(data){
					res=$(data).find('ul.subheader');
					$('ul.subheader').remove(); // this breaks the ref to changing towns :(
					$('div.container').prepend(res);
					// re-add the reference to change towns since I broke it
					$('select#focusvillage').change(function(e){
						$('form.form').submit();
					});
					data=$(data).find('table tbody').eq(2).html();
					$('#soverview').html('');
					
					if(ethic=='dark'){
						colSpan=2;
						ethicLabel='Evil';
					}else if(ethic=='light'){
						colSpan=3;
						ethicLabel='Good';
					}
					$('#soverview').append('<table>');
					$('#soverview table').append(data);
					$('#soverview table tr td:nth-child(2), #soverview table tr th').remove();
					displayBuilding();
				}
			});

		}
		function displayBuilding(){
			if($('[itimeleft]')){
				$('.upgrades').html('').prepend('<tr><th>Upgrades</th></tr>');
				$('[itimeleft]').each(function(i){
					var obj = $(this);
					var itl = obj.attr('itimeleft');
					var alt = (obj.attr('sbuildingtitle')) ? obj.attr('sbuildingtitle') : obj.attr('alt');
					var slot = obj.attr('id').replace(/building/, '');
					alt=alt.replace(/Under construction: /,'');
					$('.upgrades tr').append('<td class="cur_upgrades"><a slot="'+slot+'">'+i+' Upgrading '+alt+' - <span class="jClock" itimeleft="'+itl+'"></span></a></td>');
					//<div class="genmenu" slot="'+slot+'">'+i+' Upgrading '+alt+' - <span class="jClock" itimeleft="'+itl+'"></span></div>
				});
			}
		}
		function insertFillButton(){
			if($('.genfill').length != 0){
				$('.gen').append('<div class="genmenu filler" />');
				$('.filler').append('<a class="genfill fillall" style="cursor: pointer;">Fill All</a>');
			}
			$('.fillall').click(function(){
				$('.genfill').each(function(i){
					if($(this).text() === 'Fill'){
						objectID = $(this).attr('objectid');
						slot = $(this).attr('slot');
						amount = $(this).attr('amount');
						queueType = $(this).attr('queuetype');
						stype = $(this).attr('stype');
						submitTroop(objectID, slot, amount, queueType, stype);
					}
				});
			});
		}
		// -------------------- content creation
		function contentCreation(){
			$('body').append('<div id="soverview" />');
			$('.main').prepend('<br /><div class="sinfo" /><div class="gen" /><br />');
			if(ethic == 'dark'){
				$('area[title*=Bandit]').buildMenu({ amt: 1, names: ['Axe'], objectID: [7], queueType: [2], stype: ['highway'] });
				$('area[title*=Archery]').buildMenu({ amt: 2, names: ['Ha','Cr'], objectID: [1,2], queueType: [2,2], stype: ['longbow','crossbow'] });
				$('area[title*=Military]').buildMenu({ amt: 2, names: ['Sw','Pi'], objectID: [3,4], queueType: [2,2], stype: ['swordsman','pikeman'] });
				$('area[title*=Stables]').buildMenu({ amt: 2, names: ['Hob','Kni'], objectID: [5,6], queueType: [2,2], stype: ['light_cavalery','heavy_cavalery'] });
				$('area[title*=Seige]').buildMenu({ amt: 3, names: ['Bat','Mang','Treb'], objectID: [8,9,10], queueType: [2,2,2], stype: ['stormram','catapult','trebuchet'] });
				$('area[title*=Sawmill]').buildMenu({ amt: 1, names: ['Fill'], objectID: [1], queueType: [3] });
				$('area[title*=Pill]').buildMenu({ amt: 1, names: ['Fill'], objectID: [11], queueType: [2], pill: true });
				$('area[title*=Temple], area[title*=Barracks], area[title*=Hunting], area[title*=Warehouse], area[title*=Brotherhood], area[title*=Fire], area[title*=Settler], area[title*=Siege], area[title*=Lumberhut], area[title*=Stone quarry]').buildMenu();
			} else {
				$('area[title*=Sawmill]').buildMenu({ amt: 1, names: ['Fill'], objectID: [1], queueType: [3], stype: ['timber'] });
				$('area[title*=Iron foundry]').buildMenu({ amt: 1, names: ['Fill'], objectID: [2], queueType: [3], stype: ['iron'] });
				$('area[title*=Gold foundry]').buildMenu({ amt: 1, names: ['Fill'], objectID: [3], queueType: [3], stype: ['gold'] });
				$('area[title*=Mint]').buildMenu({ amt: 1, names: ['Fill'], objectID: [7], queueType: [3], stype: ['coin'] });
				$('area[title*=Stables]').buildMenu({ amt: 1, names: ['Fill'], objectID: [8], queueType: [3], stype: ['horse'] });
				$('area[title*=Weapon]').buildMenu({ amt: 5, names: ['HB','XB','SH','L','SW'], objectID: [5,10,9,11,4], queueType: [3,3,3,3,3], stype: ['longbow','crossbow','shield','lance','sword'] });
				$('area[title*=Market]').buildMenu({ amt: 1, names: ['Fill Carts'], objectID: [11], queueType: [2], stype: ['tradecart'] });
				$('area[title*=Temple], area[title*=Barracks], area[title*=Hunting], area[title*=Warehouse], area[title*=Brotherhood], area[title*=Fire], area[title*=Settler], area[title*=Siege], area[title*=Farm], area[title*=Chapel], area[title*=Town watch], area[title*=Constructor guild], area[title*=Lumberhut], area[title*=Iron mine], area[title*=Gold mine], area[title*=Stone quarry]').buildMenu();
				$('area[title*=wall]').eq(0).buildMenu();
			}
			$('.gen').prepend('<div class="tes"></table>');
			$('.tes')
				.append('<table class="stats" />')
				.append('<table class="upgrades" style="width: 100%;"><tr></tr></tbody>');
		}
		// -------- Effects/Ajax -----------
		function applyEffects() {
			$('[slot]').hover(function(){
				lot = $(this).attr('slot');
				$('.tile_'+lot).css({'border' : '3px solid red', '-moz-border-radius' : '200px'});
			}, function(){
				$('.tile_'+lot).css({'border' : 'none'});
			});
			
			$('.genupgrade').css('cursor','pointer').click(function(){
				slot = $(this).attr('slot');
				submitBuild(slot);
			});
			$('.genfill').css('cursor','pointer').click(function(){
				objectID = $(this).attr('objectid');
				slot = $(this).attr('slot');
				amount = $(this).attr('amount');
				queueType = $(this).attr('queuetype');
				stype = $(this).attr('stype');
				submitTroop(objectID, slot, amount, queueType, stype);
			});			
		}
		// -------------------- css styling
		$('head').append('<style type="text/css">'+
			'.genmenu {'+
				'float: left;'+
				'border: 1px solid rgb(150, 150, 150);'+
				'width: 292px;'+
				'padding: 2px;'+
				'margin: 1px 1px;'+
				'-moz-border-radius: 1px;'+
				'background: rgb(64, 64, 64);'+
				'height: 20px;'+
				'color: rgb(150, 150, 150);'+
				'z-index: 10000;'+
			'}'+
			'.genmenu:hover { background: #111; }'+
			'.genmenu a { display: block; float: left; text-align: center; height: 112%; text-decoration: none; }'+
			'.genmenu a.gentitle { width: 50%; }'+
			'.genmenu a.gentitle:hover { background: #64992C; color: #F9FFEF; -moz-border-radius: 8px; }'+
			'.genmenu a.genupgrade, a.genfill { width: 50%; }'+
			'.genmenu a.genupgrade:hover, a.genfill:hover { background: #206CFF; color: #E0ECFF; -moz-border-radius: 8px; }'+
			'.gen { overflow: hidden; }'+
			'.notify_bar_fake { display: none; }'+
			'.genfo { background: transparent; color: rgb(200, 200, 200);  margin: 2px 1px; width: 898px; padding: 0px; overflow: hidden; border-top: 1px solid rgb(130, 130, 130); border-left: 1px solid rgb(130, 130, 130); }'+
			'.genfo a { font: normal 10px Verdana,arial,sans-serif; }'+
			'.genfo td, .genfo th { background: rgb(64, 64, 64); border: 1px solid rgb(130, 130, 130); border-top-width: 0; border-left-width: 0; padding: 1px; }'+
			'.ra { text-align: right; }'+
			'.la { text-align: left; }'+
			'.sb { font-weight: bold; }'+
			'div#soverview { border: 2px solid rgb(150, 150, 150); padding: 5px 7px; background: rgb(51, 51, 51) none repeat scroll 0% 0%; opacity: 0.85; position: fixed; z-index: 9000; bottom: 10px; right: 10px; text-align: left; font-family: Arial,Helvetica; font-size: 13px; -moz-border-radius: 5px; color: #fff; }'+
			'div#soverview img { height: 20px; width: 20px; }'+
			'div#soverview .wtooltip { display: none; }'+
			'ul#soverview { display: block; font-size: 0.7em; height: 33px; left: 50%; margin: 0 auto 0 -450px; position: fixed; top: 129px; width: 900px; z-index: 5; }'+
			// tes table styling
			'.tes { border-collapse: collapse; border: none;font: normal 11px helvetica, verdana, arial, sans-serif;background-image: url(http://torpia.slickplaid.net/bg_acuity.gif); background-repeat: repeat; border-spacing: 1px; width: 100%;}'+
			'.tes td, th {  border: none; padding: .1em .3em; color: #6E6E6E;  }'+
			'.tes thead th, tfoot th { font: bold 10px helvetica, verdana, arial, sans-serif; border: none; text-align: left; background: #000000;  color: #00FF0C;}'+
			'.tes tbody td a { background: transparent;  text-decoration: none;  color: #9F9F9F; }'+
			'.tes tbody td a:hover { background: transparent;  color: #00FF0C;  }'+
			'.tes tbody th a { font: bold 11px helvetica, verdana, arial, sans-serif; background: transparent; text-decoration: none; font-weight:normal;  color: #9F9F9F; }'+
			'.tes tbody th a:hover {  background: transparent;  color: #00FF0C;  }'+
			'.tes tbody th, tbody td {  vertical-align: top;  text-align: left;  }'+
			'.tes tbody tr:hover {  background: #0E0E0E;  }'+
			'.tes tbody tr:hover th,tbody tr.odd:hover th {  background: #0E0E0E;  }'+
		'</style>');
		if(ethic == 'light'){
			$('head').append('<style type="text/css">'+
				'.genmenu { color: rgb(7, 55, 99); background: rgb(207, 226, 243); }'+
				'.genmenu:hover { background-color: rgb(159, 197, 232); }'+
			'</style>');
		}

		

		
		
		// onload
		if(server == 'w1' || server == 'w2' || server == 'w3'){
			if(window.location.href.indexOf('village') != -1 || window.location.href.indexOf('login') != -1) {
				contentCreation();
				updateStock(ethic);
				genfo(server, ethic);
				// displayBuilding();
				insertFillButton();
				applyEffects();
			}
		}
		
/* 			GM_xmlhttpRequest({
				method: 'POST',
				url: 'http://torpia.slickplaid.net/chat',
				headers: { 'Content-type': 'application/x-www-form-urlencoded' },
				data: 'login=login&redirect=&userName=slickplaid&password=&channelName=Public&lang=en&submit=Login',
				onload: function(data){ $('body').append(data.responseText); },
				onerror: function(){ console.log('error'); }
			}); */
			
		
	} catch(e) { console.debug(e); }
});