// slickplaid's Torpia Enhancement
// version 1.5.3
// 04-14-2009, updated 05-05-2009
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
// @name		Torpia Enhancement
// @namespace	http://hg.slickplaid.net/
// @description	Version 1.5.3 - Ajaxy Goodness for the game Torpia. Once installed, just refresh the page and you're set. Visit http://hg.slickplaid.net/ or http://forum.torpia.com/showthread.php?t=761 for help.
// @include		http://torpia.com/village*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$(function(){
	
	// check for Evil or Good Ethic
	ethic = $('body').attr('class');
		
// init functions
	// update resource for current town
	function updateStock(ethic){		
			$.ajax({
				type: 'POST',
				url: '/village/getitems/',
				async: true,
				success: function(data){
					data=data.split('Products');
					data=data[1].replace(/<[a-zA-Z\/][^>]*>/g,'');
					data=data.replace(/Beer barrels/,'Beer');
					data=data.split('&nbsp;',2);
					data=data[1].split(/\s/g);
					for(i=0; i<data.length;){
						if(data[i]===''){
							data.splice(i,1);
						} else {
							// $('#soverview').append('data['+i+'] => '+data[i]+'<br/>');
							i++;
						}
					}
					$('#soverview').html('');
					if(ethic=='dark'){
						colSpan=2;
						ethicLabel='Evil';
					}else if(ethic=='light'){
						colSpan=3;
						ethicLabel='Good';
					}
					$('#soverview').append('<table><tr><th colspan="'+colSpan+'">'+ethicLabel+'</th></tr>');
					if(ethic=='dark'){
						for(i=0; i<data.length; i+=2){
							$('#soverview table').append('<tr><th>'+data[i]+'</th><td>'+data[i+1]+'</td></tr>');
						}
					} else if(ethic=='light'){
						for(i=0; i<data.length; i+=3){
							$('#soverview table').append('<tr><th>'+data[i]+'</th><td>'+data[i+1]+'</td><td>'+data[i+2]+'</td></tr>');
						}
					}
					$('#soverview').append('</table>');
				}
			});

	}
	function appendBandit(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="7" queuetype="2" value=" Ax " title="Fill Axemen" name="fill"/> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendArchery(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="1" queuetype="2" value=" Ha " title="Fill Handbowmen" name="fill"/> '+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="2" queuetype="2" value=" Cr " title="Fill Crossbowmen" name="fill"/> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendMilitary(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="3" queuetype="2" value=" Sw " title="Fill Swordsmen" name="fill"/> '+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="4" queuetype="2" value=" Pi " title="Fill Pikemen" name="fill"/> '+
				'<input class="seethrough submit" type="submit" value="Ninjas" title="Train Ninjas" />'+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendDarkStables(slot, title){
				$('.gen').append('<tr slot="'+slot+'">'+
					'<th slot="'+slot+'">'+title+'</th>'+
					'<td>'+
					'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="5" queuetype="2" value=" Ho " title="Fill Hobelars" name="fill"/> '+
					'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="6" queuetype="2" value=" Kn " title="Fill Knights" name="fill"/> '+
					'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
					'</td>'+
					'<td class="status slot'+slot+'"></td>'+
				'</tr>');
		
	}
	function appendSeige(slot, title){
		
	}
	function appendWeapon(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="5" queuetype="3" value=" Ha " title="Fill Handbows" name="fill"/> '+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="10" queuetype="3" value=" Cr " title="Fill Crossbows" name="fill"/> '+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="9" queuetype="3" value=" Shld " title="Fill Shields" name="fill"/> '+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="11" queuetype="3" value=" La " title="Fill Lances" name="fill"/> '+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="4" queuetype="3" value=" Swd " title="Fill Swords" name="fill"/> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendSawmill(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="1" queuetype="3" value="Fill" name="fill"/> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendIron(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="2" queuetype="3" value="Fill" name="fill"/> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendGold(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="3" queuetype="3" value="Fill" name="fill"/> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendMint(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="7" queuetype="3" value="Fill" name="fill"/> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendGoodStables(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="8" queuetype="3" value="Fill" name="fill"/> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendMarketplace(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" objectid="11" queuetype="2" value="Fill" name="fill"/> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	function appendPillory(slot, title){
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitTroop" type="submit" slot="'+slot+'" amount="1" objectid="1" queuetype="4" value="Fill" name="fill" title="Throw villagers on the pillory" /> '+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	}
	// append container divs
	if(ethic=='dark'){
		fontColor = 'fff';
		divWidth = '85';
	} else {
		fontColor = '000';
		divWidth = '150';
	}
	$('body').append('<div id="soverview" style="border: 2px solid rgb(150, 150, 150); padding: 7px 10px; background: rgb(51, 0, 51) none repeat scroll 0% 0%; opacity: 0.9; position: fixed; z-index: 9000; top: 140px; right: 20px; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; color: rgb(255, 255, 255); text-decoration: none; text-align: left; font-family: Arial,Helvetica; font-style: normal; font-variant: normal; font-weight: normal; font-size: 13px; line-height: normal; font-size-adjust: none; font-stretch: normal; -x-system-font: none; -moz-border-radius-topleft: 5px; -moz-border-radius-topright: 5px; -moz-border-radius-bottomright: 5px; -moz-border-radius-bottomleft: 5px;"></div>');
	
	$('.main').append(
		'<table class="table slp" style="font-size:85%;padding:2px;">'+
		'  <thead><tr><th colspan="3">&nbsp; &nbsp; &nbsp; Slickplaid\'s Torpia Enhancement, Ethic: '+ethic+'</th></tr></thead>'+
		'  <tbody class="gen">'+
		'    <tr><th style="width: 200px;">Name of Building</th><th>Action</th><th style="width: 200px;">Status</th></tr>');
	
// loop through each area tag and get the building layout
	if(ethic=='dark'){
		
		// Evil
		$('area[title*=Bandit]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendBandit(slot, title);
		});
		$('area[title*=Archery]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendArchery(slot, title);
		});
		$('area[title*=Military]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendMilitary(slot, title);
		});
		$('area[title*=Pillory]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendPillory(slot, title);
		});
	} else if(ethic=='light'){
	// Good
		$('area[title*=Sawmill]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendSawmill(slot, title);		
		});
		$('area[title*=Iron foundry]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendIron(slot, title);		
		});
		$('area[title*=Gold foundry]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendGold(slot, title);		
		});
		$('area[title*=Mint]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendMint(slot, title);		
		});
		$('area[title*=Weapon smithy]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendWeapon(slot, title);		
		});
		$('area[title*=Marketplace]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			appendMarketplace(slot, title);		
		});
		
	}
	$('area[title*=Stables]').each(function(i){
			var slot = $(this).attr('id').replace(/building/, '');
			var title = $(this).attr('title').replace(/Under construction: /, '');
			var title = title.replace(/Level /, '');
			if(ethic == 'dark'){
				appendDarkStables(slot, title);
			} else if(ethic == 'light') {
				appendGoodStables(slot, title);
			}
	});	
	$('area[title*=Temple],area[title*=Barracks],area[title*=Hunting],area[title*=Warehouse],area[title*=Brotherhood],area[title*=Fire],area[title*=Settler],area[title*=Siege],area[title*=Farm],area[title*=Chapel],area[title*=Town watch],area[title*=Constructor guild],area[title*=Lumberhut],area[title*=Iron mine],area[title*=Gold mine],area[title*=Stone quarry], area[title*=wall]').each(function(i){
		var slot = $(this).attr('id').replace(/building/, '');
		var title = $(this).attr('title').replace(/Under construction: /, '');
		var title = title.replace(/Level /, '');
		$('.gen').append('<tr slot="'+slot+'">'+
				'<th slot="'+slot+'">'+title+'</th>'+
				'<td>'+
				'<input class="submit submitBuild" type="submit" slot="'+slot+'" value="Up" name="upgrade" title="Upgrade Building" />'+
				'</td>'+
				'<td class="status slot'+slot+'"></td>'+
			'</tr>');
	});
	$('.main').append('</tbody></table>');
	$('.footerlinks').append('<img alt="|" src="/images/layout/'+ethic+'/divide_list.gif"/><a href="http://hg.slickplaid.net/" title="The Honor Guard Forums"><small>script by slickplaid</small></a>');
	var i = 0;
	// onClick
	$('input.submitTroop').click(function(){
		objectID = $(this).attr('objectid');
		slot = $(this).attr('slot');
		amount = $(this).attr('amount');
		queueType = $(this).attr('queuetype');
		$('.slot'+slot).text('sending');
		queryString = 'amount='+amount+'&fill=Fill+to+maximum&slot='+slot+'&objectid='+objectID+'&queuetype='+queueType;
		$.ajax({
			type: 'POST',
			url: '/building/trainstuff/',
			data: queryString,
			async: true,
			success: function(){
				$('.slot'+slot).html('<span class="status'+slot+'">Sent!</span>');
				updateStock(ethic);
				$('.status'+slot).fadeOut(25000);
			},
			error: function(){
				$('.slot'+slot).text('Error');
			}
		});
	});
	$('input.submitBuild').click(function(){
		slot = $(this).attr('slot');
		$('.slot'+slot).text('sending');
		$.ajax({
			type: 'POST',
			url: '/building/upgrade/'+slot,
			async: true,
			success: function(){
				$('.slot'+slot).html('<span class="status'+slot+'">Sent!</span>');
				updateStock(ethic);
				$('.status'+slot).fadeOut(25000);
			},
			error: function(){
				slot = $(this).attr('slot');
				$('.slot'+slot).text('Error');
			}
		});
	});
	$('tbody tr').hover(function(){
		lot = $(this).attr('slot');
		$('.tile_'+lot).css({'border' : '3px solid red'});
	}, function(){
		$('.tile_'+lot).css({'border' : 'none'});
    });
    updateStock(ethic);
});