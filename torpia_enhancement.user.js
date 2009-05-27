// slickplaid's Torpia Enhancement
// version 2.0.0beta
// 04-14-2009, updated 05-25-2009
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
// @description	Version 2.0.0beta - Ajaxy Goodness for the game Torpia. Once installed, just refresh the page and you're set. Visit http://hg.slickplaid.net/ or http://forum.torpia.com/showthread.php?t=761 for help.
// @include		http://*.torpia.com/village*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==
(function($){
	$.fn.buildMenu = function(options) {
			$.fn.buildMenu.defaults = {
				amt: 0,
				names: 'Error',
				objectID: 0,
				queueType: 0,
				pill: false
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
					$('.slot'+slot).append('<a class="genfill" slot="'+slot+'" objectid="'+o.objectID[i]+'" queuetype="'+o.queueType[i]+'" style="width: '+w+'%">'+o.names[i]+'</a>');
					if(o.pill === true) $('.slot'+slot+' a[slot='+slot+']').attr('amount','1');
				}
				
				$('.slot'+slot).append('<a class="genupgrade" slot="'+slot+'" style="width: '+w+'%">&uarr;</a>');
			});
		};
})(jQuery);

$(function(){
	try {
		// check for Evil or Good Ethic
		var ethic = $('body').attr('class');
		var	v = '2.0.0beta';
		
		// -------------------- ajax functions
		function submitBuild(slot) {
			$('.slot'+slot+' .gentitle').html('Sending...');
			$.ajax({
				type: 'POST',
				url: '/building/upgrade/'+slot,
				async: true,
				success: function(){
					$('.slot'+slot+' .gentitle').html('<span class="status'+slot+'">Sent!</span>');
					$('.status'+slot).fadeOut(2500, function () {
						$('.slot'+slot+' .gentitle').html($('.slot'+slot+' .gentitle').attr('title'));
					});
					updateStock(ethic);
				},
				error: function(){
					slot = $(this).attr('slot');
					$('.slot'+slot).text('Error');
			}
		});
		}
		function submitTroop(objectID, slot, amount, queueType){
			$('.slot'+slot+' .gentitle').html('Sending...');
			queryString = 'amount='+amount+'&fill=Fill+to+maximum&slot='+slot+'&objectid='+objectID+'&queuetype='+queueType;
			$.ajax({
				type: 'POST',
				url: '/building/trainstuff/',
				data: queryString,
				async: true,
				success: function(){
					$('.slot'+slot+' .gentitle').html('<span class="status'+slot+'">Sent!</span>');
					updateStock(ethic);
					$('.status'+slot+' .gentitle').fadeOut(2500);
					$('.slot'+slot+' .gentitle').html($('.slot'+slot+' .gentitle').attr('title'));
				},
				error: function(){
					$('.slot'+slot).text('Error');
				}
			});
		}
			// update resource for current town
		function updateStock(ethic){		
			$.ajax({
				type: 'POST',
				url: '/village/getitems/',
				async: true,
				success: function(data){
					res=$(data).find('ul.subheader');
					$('.subheader').remove(); // this breaks the ref to changing towns :(
					$('.container').prepend(res);
					// re-add the reference to change towns since I broke it
					$('select#focusvillage').change(function(e){
						$('.form').submit();
					});
					data=data.split('Products');
					data=data[1].replace(/<[a-zA-Z\/][^>]*>/g,'');
					data=data.replace(/Beer barrels/,'Beer').replace(/Percentage/,'[%]').replace(/Maximum storage per product/,'Max');
					data=data.split('&nbsp;',2);
					data=data[1].split(/\s/g);
					for(i=0; i<data.length;){
						if(data[i]===''){
							data.splice(i,1);
						} else {
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
							if (i<data.length-2)
								$('#soverview table').append('<tr><th>'+data[i]+'</th><td>'+data[i+1]+'</td><td>'+data[i+2]+'</td></tr>');
							else
								$('#soverview table').append('<tr><th>'+data[i]+'</th><td>'+data[i+1]+'</td><td>n/a</td></tr>');
						}
					}
					$('#soverview').append('</table>');
				}
			});
		}
		// -------------------- css styling
		$('head').append('<style type="text/css">'+
			'.genmenu {'+
				'float: left;'+
				'border: 1px solid rgb(150, 150, 150);'+
				'width: 292px;'+
				'padding: 2px;'+
				'margin: 2px 1px;'+
				'-moz-border-radius: 4px;'+
				'background: rgb(51, 51, 51);'+
				'height: 20px;'+
				'color: #fff;'+
			'}'+
			'.genmenu:hover { background: #111; }'+
			'.genmenu a { display: block; float: left; text-align: center; height: 112%; text-decoration: none; }'+
			'.genmenu a.gentitle { width: 50%; }'+
			'.genmenu a.gentitle:hover { background: #CDEB8B; }'+
			'.genmenu a.genupgrade, a.genfill { width: 50%; }'+
			'.genmenu a.genupgrade:hover, a.genfill:hover { background: #C3D9FF; }'+
			'.gen { overflow: hidden; }'+
		'</style>');
		
		// -------------------- content creation
		$('.main').append('<div class="gen"></div>');
			/*
			area[title*=Weapon smithy], 
			area[title*=Marketplace], 
			=== area[title*=Stables], =========
			*/
		if(ethic == 'dark'){
			$('area[title*=Bandit]').buildMenu({ amt: 1, names: ['Axe'], objectID: [7], queueType: [2] });
			$('area[title*=Archery]').buildMenu({ amt: 2, names: ['Ha','Cr'], objectID: [1,2], queueType: [2,2] });
			$('area[title*=Military]').buildMenu({ amt: 2, names: ['Sw','Pi'], objectID: [3,4], queueType: [2,2] });
			$('area[title*=Stables]').buildMenu({ amt: 2, names: ['Hob','Kni'], objectID: [5,6], queueType: [2,2] });
			$('area[title*=Seige]').buildMenu({ amt: 0, names: ['Bat','Mang','Treb'], objectID: [7,7,7], queueType: [2,2,2] });
			$('area[title*=Sawmill]').buildMenu({ amt: 1, names: ['Fill'], objectID: [1], queueType: [3] });
			$('area[title*=Pill]').buildMenu({ amt: 1, names: ['Fill'], objectID: [11], queueType: [2], pill: true });
			$('area[title*=Temple], area[title*=Barracks], area[title*=Hunting], area[title*=Warehouse], area[title*=Brotherhood], area[title*=Fire], area[title*=Settler], area[title*=Siege], area[title*=Lumberhut], area[title*=Stone quarry]').buildMenu();
		} else {
			$('area[title*=Sawmill]').buildMenu({ amt: 1, names: ['Fill'], objectID: [1], queueType: [3] });
			$('area[title*=Iron foundry]').buildMenu({ amt: 1, names: ['Fill'], objectID: [2], queueType: [3] });
			$('area[title*=Gold foundry]').buildMenu({ amt: 1, names: ['Fill'], objectID: [3], queueType: [3] });
			$('area[title*=Mint]').buildMenu({ amt: 1, names: ['Fill'], objectID: [7], queueType: [3] });
			$('area[title*=Stables]').buildMenu({ amt: 1, names: ['Fill'], objectID: [8], queueType: [3] });
			$('area[title*=Temple], area[title*=Barracks], area[title*=Hunting], area[title*=Warehouse], area[title*=Brotherhood], area[title*=Fire], area[title*=Settler], area[title*=Siege], area[title*=Farm], area[title*=Chapel], area[title*=Town watch], area[title*=Constructor guild], area[title*=Lumberhut], area[title*=Iron mine], area[title*=Gold mine], area[title*=Stone quarry]').buildMenu();
			$('area[title*=wall]').eq(0).buildMenu();
		}
		
		$('body').append('<div id="soverview" style="border: 2px solid rgb(150, 150, 150); padding: 7px 10px; background: rgb(51, 51, 51); position: fixed; z-index: 9000; top: 140px; right: 20px; color: rgb(255, 255, 255); text-decoration: none; text-align: left; font-family: Arial,Helvetica; font-size: 13px; -moz-border-radius: 5px;"></div>');
		$('div#soverview').fadeTo(10000, 0.60);
	
		// -------- Effects/Ajax -----------
		$('.genmenu').hover(function(){
			lot = $(this).attr('slot');
			$('.tile_'+lot).css({'border' : '3px solid red'});
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
			submitTroop(objectID, slot, amount, queueType);
		});
	updateStock(ethic);
	} catch(e) { console.debug(e); }
});