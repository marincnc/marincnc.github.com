adobe.gnavOverflowFix = (function() {
	
	function MenuLayout(el) {
		this.el = el;
		this.isWrapping;
		this.isOverSearchBox;
		this.fixedState = [false, false];
	}
	
	MenuLayout.prototype = {
		setProps: function() {
			var el = this.el,
			items = Element.childElements(el),
			lastItem = items[items.length-1],
			yMenuPadding = parseInt(Element.getStyle(el, "padding-top")) + parseInt(Element.getStyle(el, "padding-bottom"));
			
			this.isWrapping = (el.offsetHeight > (lastItem.offsetHeight + yMenuPadding));
			this.right = (el.offsetLeft + lastItem.offsetLeft + lastItem.offsetWidth);
			this.top = Position.cumulativeOffset(el)[1];
		},
		setFixedState: function(side, value) {
			var i;
			switch(side) {
				case "top": i = 0; break;
				case "right": i = 1; break;
			}
			this.fixedState[i] = !!value;
			return;
		},
		getFixedState: function(side) {
			var i;
			switch(side) {
				case "top": i = 0; break;
				case "right": i = 1; break;
			}
			return this.fixedState[i];
		},
		doFix: function(side, adjust) {
			switch(side) {
				case "top": 
					this.el.style.paddingTop = (parseInt(Element.getStyle(this.el, "padding-top")) + adjust) + "px";
					break;
				case "right": 
					this.el.style.width = "756px";
					this.el.style.marginRight = (adjust*-1)+"px";
					break;
			}
			
			this.setFixedState(side, true);
		},
		undoFix: function(side) {
			if(!this.getFixedState(side)) { return };
			
			switch(side) {
				case "top": 
					this.el.style.paddingTop = "";
					break;
				case "right": 
					this.el.style.width = "";
					this.el.style.marginRight = "";
					break;
			}
			
			this.setFixedState(side, false);
		}
	}
	
	
	
	function SearchBoxLayout(el) {
		this.el = el;
		this.height;
		this.width;
		this.left;
		this.bottom;
	}
	
	SearchBoxLayout.prototype = {
		update: function() {
			var el = this.el;
			this.height = el.offsetHeight,
			this.width = el.offsetWidth,
			this.left = el.offsetLeft;
			this.bottom = (el.offsetTop + el.offsetHeight);
			this.left = (el.offsetLeft);
		}
	}
	
	return {
		init: function () {			
			var gNav = document.getElementById("globalnav"),
			userMenuList = document.getElementById("user-menu-list"),
			siteDropdown = document.getElementById("site-menu-dropdown"),
			siteSearch = document.getElementById("site-search");
			
			if(!(gNav && userMenuList && siteDropdown && siteSearch)) { return; }
			
			var dropdownLayout = new MenuLayout(siteDropdown),
			userMenuLayout = new MenuLayout(userMenuList),
			searchBoxLayout = new SearchBoxLayout(siteSearch);
			
			function resize() {
				searchBoxLayout.update();
				userMenuLayout.setProps();
				dropdownLayout.setProps();
				
				var 
				userMenuFixedTop = userMenuLayout.getFixedState("top"),
				dropdownFixedTop = dropdownLayout.getFixedState("top"),
				userMenuIsOverSearchBox = isOverSearchBox(userMenuLayout),
				dropdownIsOverSearchBox = isOverSearchBox(dropdownLayout),
				rightAdjust = parseInt(Element.getStyle(gNav, "padding-right")),
				topAdjust = (searchBoxLayout.bottom - userMenuLayout.top);
				
				if((userMenuLayout.isWrapping || dropdownLayout.isWrapping) && !userMenuFixedTop) {
					userMenuLayout.doFix("top", topAdjust);
					userMenuLayout.doFix("right", rightAdjust);
					dropdownLayout.doFix("right", rightAdjust);
				} else if(userMenuFixedTop && !userMenuIsOverSearchBox && !dropdownIsOverSearchBox && !userMenuLayout.isWrapping) {
					userMenuLayout.undoFix("top");
					userMenuLayout.undoFix("right");
					dropdownLayout.undoFix("right");
				}
				
				function isOverSearchBox(layout) {
					return (!layout.isWrapping && (searchBoxLayout.left < layout.right));
				}
			}
			
			resize();
			Event.observe(window, "resize", resize);
		}
	}

})();

registerOnLoad(adobe.gnavOverflowFix.init);