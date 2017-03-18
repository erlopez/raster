/******************************************************************************
 * This file is part of the Raster UI Library.
 * http://www.lopezworks.info/raster
 *
 * Copyright (C) 2010 Edwin R. Lopez
 *
 * This source code is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation LGPL v2.1
 * (http://www.gnu.org/licenses/).
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301  USA.
 *****************************************************************************/

/*****************************************************************************
 Creates a Tab bar control. The following example creates a tab bar
 in a DIV with a <code>id</code>="tabbar1":
 <pre code>
    var tab1 = new RasterTabbar("tabbar1");

    tab1.setCustomizable(true); // allow tab reordering
    tab1.add( ICONS16.HOUSE,"Home" ).select(); //selected tab
    tab1.add( ICONS16.COG,  "System" );
    tab1.add( ICONS16.TABLE,"Databases" );

     ...

    &lt;div id='tabbar1'&gt;&lt;/div&gt;
 </pre>
 The minimum height for a tab bar container is 28px. A tab bar will
 spread horizontally to take all the available horizontal space of the containing parent.

 The <code>icon</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.

 @constructor
 @see RasterTabbarEvent

 @param parent         [object]: One of the following: a string containing the ID
                       of a DOM element, a reference to a DOM element, or another
                       control object. If this argument is null, the control is
                       created but not attached to the DOM tree; setParent() must
                       be invoked later to specify the parent control.
 @param alignTop       [boolean]: Specifies how this tabbar renders. True align tabs
                       to the top of the control, false align the tabs to the bottom
                       (default).
 *****************************************************************************/
function RasterTabbar( parent, alignTop )
{
    // call super()
    RasterControl.call( this, parent );
    this.controlBox.innerHTML = "<div class='items'></div><div class='chevron'></div><div class='baseline'></div>";
    this.itemsDiv = this.controlBox.firstChild;
    this.chevronDiv = this.controlBox.childNodes[1];

    this.alignTop = alignTop===true;
    this.setClass( this.alignTop ? "rasterTabbar rasterTabbarFlip" : "rasterTabbar" );
    this.items = {};

    this.isDnD = false;  //disables drag drop

    this.selectedTab = null;   //points to the current tabItem
    this.eventHandler = null;
    this.chevronMenu = null;   //menu created as result of chevron showing up

    // create chevron item
    this.chevronItem = this.add( "" );
    delete this.items[ this.chevronItem.id ]; //erase this item from the list of items, so it cannot be listed, or removed by the user

    this.chevronItem.isChevron = true;
    this.chevronItem.sprite.setImage( GLYPHS.CHEVRON_RIGHT );
    this.chevronItem.sprite.setSize( 9, 16 );
    this.chevronItem.setParent( this.chevronDiv );
    this.chevronDiv.style.display = "none";

    // handlers
    this.controlBox.onmousedown = RasterTabbar.mousedownHandler;


    // resister tabbar by unique id Sequence
    this.id = "tabbar" + (Raster.idSequence++);
    RasterTabbar.all[ this.id ] = this;

   /** @property IID_TABBAR [boolean]: Interface ID tag constant used to identify #RasterTabbar objects.
                             This property is always true.*/
}
/*****************************************************************************
 Globals, Implements the Control class
 @private
 *****************************************************************************/
RasterTabbar.all = {}; //keeps registry of all created tabbars
RasterTabbar.prototype.IID_TABBAR = true;
Raster.implementIID ( RasterTabbar, RasterControl );


/*****************************************************************************
 Triggers a layout check in all tab bars. Invoked when page is resized.
 @private
 *****************************************************************************/
RasterTabbar.doLayout = function()
{
    //call doLayout in all Tabbar
    for ( var id in RasterTabbar.all )
        RasterTabbar.all[id].doLayout();

};

/*****************************************************************************
 Click event handler for tab items.
 @private
 *****************************************************************************/
RasterTabbar.mousedownHandler = function( event )
{
    var el = Raster.srcElement( event );
    var tabItem = Raster.findParentExpando(el, "tabItem");

    Raster.stopEvent( event );
    Raster.setActiveMenu( null );

    // Ignore event when not coming from a tabItem element
    if ( tabItem==null )
        return;

    // Show popup menu when available, otherwise invoke tabItem's click event
    var tabbar = tabItem.parentControl;

    if ( tabItem == tabbar.chevronItem )
    {
        tabbar.chevronMenu.showBelowOf( tabItem.iconLink );
    }
    else
    {
        var mouse = Raster.getInputState( event );

        // Initiate drag operation on this item (if allowed)
        if ( tabbar.isDnD && mouse.button==1 )
        {
            RasterMouse.setCursor( CURSORS.DRAG );
            RasterMouse.startDrag( event, tabItem );
        }/*if*/

        if ( tabbar.selectedTab!=tabItem )
        {
            var tabEvent = null;
            if ( tabbar.eventHandler!=null )
            {
                tabEvent = RasterEvent.mkTabEvent( event, mouse.button==1 ? "click" : "context", tabbar, tabItem );
                tabbar.eventHandler( tabEvent );
            }

            if ( tabItem.isEnabled && (tabEvent==null || !tabEvent.isCancelled) )
                tabbar.selectTab  ( tabItem );

        }/*if*/

    }/*if*/

};


/*****************************************************************************
 Show/hides the chevron menu based on the width of the Tabbar. This is
 invoked by the Raster's onresize event.
 @private
 *****************************************************************************/
RasterTabbar.prototype.doLayout = function()
{
    var node = null;


    // find the first node that wraps to the second line (if any)
    for ( var i=0; i < this.itemsDiv.childNodes.length; i++)
    {
        var tmp = this.itemsDiv.childNodes[i];
        if ( tmp.offsetTop > 5 )
        {
            node = tmp;
            break;
        }
    }/*for*/

    // if no menuable items, hide chevron and leave
    if ( node==null )
    {
        this.chevronDiv.style.display = "none";
        return;
    }

    // show chevron, initialize menu
    this.chevronDiv.style.display = "block";
    if ( this.chevronMenu == null )
    {
        this.chevronMenu = new RasterMenu( document.body );
        this.chevronMenu.controlBox.style.zIndex = 90;
    }/*if*/

    // initialize chevron menu
    this.chevronMenu.removeAll();

    // populate menu with wrapped items
    do
    {
        var item = node.firstChild.tabItem;   //the firstChild is iconLink element
        var cmd = new RasterCommand( item.id, item.icon, null, item.text || "...", null, null, null, RasterTabbar.chevronMenuHandler );
        cmd.tabItem = item;
        this.chevronMenu.add( cmd );

        node = node.nextSibling;

    } while ( node != null );

};


/*****************************************************************************
 Event handler for tab bar chevron menu items.
 @private
 *****************************************************************************/
RasterTabbar.chevronMenuHandler = function( cmd, event )
{
    cmd.tabItem.select();

};


/*****************************************************************************
 Returns a reference to the DOM element that accepts content in this Control.
 @private
 *****************************************************************************/
RasterTabbar.prototype.getContentElement = function()
{
    return this.itemsDiv;
};


/*****************************************************************************
 Enables or disables drag and drop functions in the tab control.
 @param isDnD       boolean: True enables tab items to be dragged
                    and to become drop targets; false turns this feature off
                   (default).
 @return object: The tab bar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.setDragDrop = function( isDnD )
{
    this.isDnD = isDnD;
    return this;
};


/*****************************************************************************
 Releases and removes all DOM element references used by the tab control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method also disposes nested TabItem objects as well.
 *****************************************************************************/
RasterTabbar.prototype.dispose = function()
{
    this.chevronItem.dispose();

    this.itemsDiv = null;
    this.chevronDiv = null;
    this.controlBox.onmousedown = null;

    // free chevron menu
    if ( this.chevronMenu )
    {
        this.chevronMenu.dispose();
        this.chevronMenu = null;
    }/*if*/

    // unresister tabbar
    delete RasterTabbar.all[ this.id ];

    for ( var tabId in this.items )
        this.items[tabId].dispose();

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
   // out('tabbar disposed.');
};


/*****************************************************************************
 Remove all tab items from the tab bar.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.removeAll = function()
{
    var all = this.getTabs();
    for ( var i=0; i < all.length; i++ )
        this.removeTab( all[i] );

    this.items = {};

    // hide chevron
    this.doLayout();

    return this;
};


/*****************************************************************************
 Adds a tab item to this Tabbar.
 @param icon              string: String containing path of a 16x16 image file
                          or an object that implements the IID_SPRITEINFO interface such as
                          the constants in the #ICONS16 object. Set to
                          null if no icon is desired.
 @param text              string: Text shown in the tab; set to null for
                          is no text is needed.
 @param containerId       [string]: The id of an existing element which css
                          display is set to "block" when the tab is selected,
                          and "none" when the tab is blured.
 @param value             [any]: Placeholder for an user-defined value to be
                          associated with this tab. User can access this value
                          later in the Tab's click event handler.
 @return object: A reference to the #RasterTabItem object just added.
 *****************************************************************************/
RasterTabbar.prototype.add = function( icon, text, containerId, value )
{
    //a. add tab item
    var item = new RasterTabItem( this, icon, text, containerId, value );
    this.items[ item.id ] = item;

    // show chevron if needed
    this.doLayout();

    return item;
};


/*****************************************************************************
 Selects the tab at the given index. To know the number of tabs in the
 tab bar use the getTabCount() method.
 @param index   number: zero-based index of the tab to be selected.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.selectTabByIndex = function( index )
{
    return this.selectTab( this.getTabByIndex(index) );
};


/*****************************************************************************
 Selects the given tab.
 @param item     object: A reference to a tab item object, or a
                 value matching the <code>value</code> attribute of a tab item.
                 If the given argument is null, it does not match any tab, or tab
                <code>value</code>, all tabs are then unselected.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.selectTab = function( item )
{
    if ( this.selectedTab!=null )
        this.selectedTab.markSelected ( false );

    this.selectedTab = null;

    if ( item==null || !item.IID_TABITEM )                // If item not a IID_TABITEM, treat it as a value attributte
        item = this.getTabByValue( item );

    if ( item!=null )
    {
        item.markSelected ( true );
        this.selectedTab = item;
    }/*if*/

    return this;
};


/*****************************************************************************
 Returns the selected tab item.
 @param item     object: A reference to the selected tab item. Returns null
                 if no tab item is currently selected.
 @return object: The selected tab item. Returns null if no tab item is
         currently selected.
 *****************************************************************************/
RasterTabbar.prototype.getSelectedTab = function( item )
{
    return this.selectedTab;
};


/*****************************************************************************
 Returns the tab item having a value attributte matching the given argument.
 @param value    any: A value matching the <code>value</code> attribute of a tab item.
 @return object: The tab item having a value attributte matching the given argument.
         Returns null if no tab item having a value attributte matching the
         given argument is found.
 *****************************************************************************/
RasterTabbar.prototype.getTabByValue = function( value )
{
    for ( var id in this.items )
        if ( this.items[id].value == value )
            return this.items[id];

    return null;
};


/*****************************************************************************
 Returns the tab item at the given index. To know the number of tabs in the
 tab bar use the getTabCount() method. 
 @param index    number: Zero-based index of the tab.
 @return object: The tab item at the given index. Returns null if the index
         is out of range.
 @see getTabCount()
 *****************************************************************************/
RasterTabbar.prototype.getTabByIndex = function( index )
{
    var childs = this.itemsDiv.childNodes;

    if ( index < childs.length )
        return childs[index].rasterControl;  //rasterControl = the item object
    else
        return null;
};


/*****************************************************************************
 Returns the number of tabs in the tab bar.
 @return number: The number of tabs in the tab bar.
 *****************************************************************************/
RasterTabbar.prototype.getTabCount = function()
{
    return this.itemsDiv.childNodes.length;
};


/*****************************************************************************
 Retrieve list of tab items in the tab bar.
 @return array: Array containing all tab items. An empty array if the tab bar
         has no tab items in it.
 *****************************************************************************/
RasterTabbar.prototype.getTabs = function()
{
    var temp = [];
    var childs = this.itemsDiv.childNodes;
    
    //fetch items from the DOM container to preserve ordering
    for ( var i=0; i < childs.length; i++ )
            temp.push( childs[i].rasterControl );  //rasterControl = the item object

    return temp;
};


/*****************************************************************************
 Removes a tab item from the Tabbar.
 @param item     object: A reference to a TabItem object, or a
                 value matching the value attribute of a TabItem.
                 If a tab matching this argument is not found in this
                 container, this method does nothing.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.removeTab = function( item )
{
    if ( !item.IID_TABITEM )                // If item not a IID_TABITEM, treat it as a value attributte
        item = this.getTabByValue( item );

    //a. exit if tab is not found in this control
    if ( item==null || this.items[ item.id ]==null )
        return this;

    //b. deactivate if item selected
    if ( this.selectedTab==item )
        this.selectTab(null);

    //c. dispose the tab item
    delete this.items[ item.id ];
    item.dispose();

    // show chevron if needed
    this.doLayout();

    return this;
};


/*****************************************************************************
 Shows/hides the tabbar's background.
 @param isVisible  boolean: true shows the assigned css background (default);
                   false makes the tabbar's background transparent.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.showBackground = function( isVisible )
{
    this.controlBox.style.background = isVisible ? "" : "none";
    return this;
};


/*****************************************************************************
 Specifies an event handler to be notified of tab events.
 @param eventHandler   [function]: The event handler function to be invoked
                       when a tab event occurs. Set to null to remove any
                       previously set handler.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 @see RasterTabbarEvent
 *****************************************************************************/
RasterTabbar.prototype.setEventHandler = function( eventHandler )
{
    this.eventHandler = eventHandler;
    return this;
};



//----------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Represents a tab item.
 @constructor
 @param parentControl     object: The Tabbar object that contains this item.
 @param icon              string: Either a URL of a 16x16 image, or
                          an object that implements the IID_SPRITEINFO interface
                          like the constants defined in #ICONS16. Set to
                          null if no image needed.
 @param text              string: Text shown in the tab; set to null for
                          is no text is needed.
 @param containerId       [string]: The id attribute name of an element to
                          set its css display to "block" when the tab is selected.
 @param value             [any]: Placeholder for an user-defined value to be
                          associated with this tab. User can access this value
                          later in the Tab's click event handler.
 *****************************************************************************/
function RasterTabItem( parentControl, icon, text, containerId, value )
{
    RasterControl.call( this, parentControl, "span" ); //super; use span
    this.setClass( "rasterTabbarItem" );

    this.parentControl = parentControl;

    this.iconLink = document.createElement("A");
    //this.iconLink.href = "#";                        //prevent IE6 from rendering artifacts on hover; this is ok since hover is not used in tabs
    this.iconLink.onclick = Raster.stopEvent;
    this.iconLink.tabItem = this;                    //expando trace back to owner object
    this.controlBox.appendChild( this.iconLink );
    this.iconLink.innerHTML = "<span class='bkleft'></span>" +
                              "<span class='bkright'></span>" +
                              "<span class='tabIco'></span>" +
                              "<span class='tabTxt'></span>";

    this.iconSpan = this.iconLink.childNodes[2];
    this.textSpan = this.iconLink.childNodes[3];

    // Set default state
    this.text = text;            /**@property text [string]: Text displayed in the tab item. To change the text in the tab item use setText().*/
    this.icon = icon;            /**@property icon [value]: The tab item's 16x16 icon. String containing path of an image file or an object that implements the IID_SPRITEINFO interface.
                                                    This property might be null. To set the tab item's icon use setIcon().*/
    this.value = value;          /**@property value any: Define any program-specific value to be associated with this
                                                         item, such as a primary-key or other server side unique-ID.*/

    this.isEnabled = true;       /**@property isEnabled [boolean]: True if the tab item is in enabled state, false otherwise. To change the enabled state use setEnabled().*/
    this.isSelected = false;     /**@property isSelected [boolean]: True if the tab item is in selected state, false otherwise. To change the select state use select().*/

    this.updateStyle();
    this.setDropHandler( RasterTabItem.dragDropHandler ); //super


    this.id = "tabitem" + (Raster.idSequence++);
    this.containerId = containerId;
    this.setText( text );
    this.setIcon( icon );

   /** @property IID_TABITEM [boolean]: Interface ID tag constant used to identify #RasterTabItem objects.
                             This property is always true.*/
}
/*****************************************************************************
 Statics, Implements the Control class
 @private
 *****************************************************************************/
RasterTabItem.prototype.IID_TABITEM = true;
Raster.implementIID ( RasterTabItem, RasterControl );

/*****************************************************************************
 Create and/or return a dragContext for this control instance.
 The drag context object is a place for this control instance to save the state
 of the drad and drop operation while the mouse hovers over the control's region.

 If the drag context does not exist yet for the given mouseEvt, one will be
 created and returned, otherwise the one current one is returned.
 @private
 @param mouseEvt      object: a RasterMouseEvent object
 @return  object: An context object this tabbar instance can use to store
          computations and state for the given mouseEvt operation.
 *****************************************************************************/
RasterTabbar.prototype.getDragContext = function( mouseEvt )
{
    // If we already created a drag context in this mouseEvt,
    // return that object
    var dragContext = mouseEvt.context[ this.id ];    

    // otherwise create drag context object for this control instance
    // and register it in the mouseEvt.context.
    if ( !dragContext )
    {
        dragContext = mouseEvt.context[ this.id ]  = {};
        dragContext.isBeforeDrag = true;
    }/*if*/

    return dragContext;
};

/*****************************************************************************
 Handles drag and drop operations used and tab re-organisation.
 @private
 @param mouseEvt      object: a RasterMouseEvent object
 *****************************************************************************/
RasterTabItem.dragDropHandler = function( mouseEvt )
{
    var tabItem = mouseEvt.control;
    var dragValue = mouseEvt.value;
    var evtType = mouseEvt.type=="enter" ? "over" : mouseEvt.type; // Indicates event type: "enter", "over", "out", "drop", "cancel"
    var tabbar = tabItem.parentControl;

    // nothing we care about is dragged over the control, leave
    if ( !tabbar.isDnD || evtType=="cancel" || evtType=="out" || dragValue==null || tabItem.isChevron )
        return;

    var isLocal = dragValue.IID_TABITEM  && (dragValue.parentControl == tabbar);
    var ctx = tabbar.getDragContext( mouseEvt );
    var tabEvent;

    // a. issue 'beforemove' event to user handler (if any)
    if ( isLocal && ctx.isBeforeDrag )
    {
        ctx.isBeforeDrag = false; //prevent from entering this code block again

        // Notify event handler tabitem is about to be moved
        if ( tabbar.eventHandler!=null )
        {
            tabEvent = RasterEvent.mkTabEvent( mouseEvt.event, "beforedrag", tabbar, dragValue,
                                               dragValue, null );
            tabbar.eventHandler( tabEvent );
        }

        // Cancel drag on user request
        if ( tabEvent!=null && tabEvent.isCancelled )
        {
            RasterMouse.cancelDrag();
            return;
        }
    }/*if*/

    RasterMouse.showDropBorderOver( null );
    RasterMouse.showDropLine( null );

    // b. if we are hovering over ourselves, leave
    if ( dragValue==tabItem )
        return;

    // c. calculate drop position
    var b = tabItem.getBounds();
    var edge = RasterMouse.getNearestEdgeH(tabItem.controlBox, mouseEvt.event, b.width/3);
    var position = edge==3 ? "after" : ( edge==7 ? "before" :  "over" );

    // d. notify event handler
    tabEvent = null;

    if ( tabbar.eventHandler!=null && (evtType=="over" || (evtType=="drop" && ctx.position!=null))   )
    {
        tabEvent = RasterEvent.mkTabEvent( mouseEvt.event, evtType, tabbar, tabItem, dragValue,
                                          (evtType=="over" ? position : ctx.position)  );
        tabbar.eventHandler( tabEvent );
    }/*if*/

    // e. Highlight the insertion point or drop target, draw visual cues
    if (  evtType=="over" && tabEvent && tabEvent.acceptPosition )
    {
        position = ctx.position = tabEvent.acceptPosition;

        if ( position=="after" ) //right
            RasterMouse.showDropLine( b.x+b.width, b.y-6, true, b.height+12);

        else if ( position=="before" )          //left
            RasterMouse.showDropLine( b.x, b.y-6, true, b.height+12);

        else  //over
            RasterMouse.showDropBorderOver( tabItem.iconLink  );

    }
    else if ( evtType!="drop" )
    {
        ctx.position = null;

    }/*if*/


    // f. on drop, move a tab that has been dragged locally
    if ( evtType=="drop" && isLocal && ctx.position && (tabEvent && !tabEvent.isCancelled) )
          dragValue.setSibling( tabItem.controlBox, ctx.position=="after" );


};

/*****************************************************************************
 Returns the text in this tab item.
 @private
 @return string: the text in this tab item.
 *****************************************************************************/
RasterTabItem.prototype.toString = function()
{
    return this.text;
};

/*****************************************************************************
 Changes the appearance of this tab item between selected/normal. This style
 is not shown when the command item is 'disabled' state. If the tab is
 associated with a container id, the container is show/hidden accordingly.
 @private
 @param isSelected boolean: True shows command item in selected state, false shows
                   it normal.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.markSelected = function( isSelected )
{
    this.isSelected = isSelected;
    this.updateStyle();

    if ( this.containerId != null )
    {
        var el = document.getElementById( this.containerId );
        if ( el != null)
            el.style.display = isSelected ? "block" : "none";
    }/*if*/

    return this;
};


/*****************************************************************************
 Updates the <code>className</code> of the <code>iconLink</code> element based
 in the internal state of the <code>isEnabled</code>, and
 <code>isSelected</code>  flags.
 @private
 *****************************************************************************/
RasterTabItem.prototype.updateStyle = function()
{
    if ( !this.isEnabled )
        this.iconLink.className = "rasterTabItemDisabled";

    else if ( this.isSelected )
        this.iconLink.className = "rasterTabItemSelected";

    else
        this.iconLink.className = "";

};


/*****************************************************************************
 Releases and removes all DOM element references used by this tab item from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method is called from the parent Tabbar; to remove a tab from the tab bar
 use remove() instead.
 @private
 *****************************************************************************/
RasterTabItem.prototype.dispose = function()
{
    this.iconLink.tabItem = null;
    this.iconLink.onmousedown = null;
    this.iconLink = null;
    this.iconSpan = null;
    this.textSpan = null;

    if ( this.sprite )
        this.sprite.dispose();

    // Unregister this command item with the tabbar  is using
    delete this.parentControl.items [ this.id ];

    // Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );

    //out('TabItem disposed.');
};


/*****************************************************************************
 Removes this tab item from the Tabbar.
 @return object: The tab item object.
 *****************************************************************************/
RasterTabItem.prototype.remove = function()
{
    this.parentControl.removeTab( this );
    return this;
};


/*****************************************************************************
 Makes this tab the selected tab.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.select = function()
{
    this.parentControl.selectTab( this );

    return this;
};


/*****************************************************************************
 Changes the state of this tab item between disabled/normal. The
 'disabled' state overwrites the 'selected' state.
 @param isEnabled boolean: True shows command normal, False greys out the icon & text.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.setEnabled = function( isEnabled )
{
    // If the tab is disable when is selected, then select none
    if ( !isEnabled && this.isSelected )
        this.parentControl.selectTab( null );

    if ( this.sprite!=null )
        this.sprite.setOpacity( isEnabled ? 100 : 33 );

    this.isEnabled = isEnabled;
    this.updateStyle();

    return this;
};



/*****************************************************************************
 Sets the text displayed in this tab.
 @param text  string: Text shown in the tab; set to null
              if no text is needed.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.setText = function( text )
{
    this.text = text;
    this.textSpan.innerHTML = text || "";
    this.textSpan.style.display = (text!=null) ? "" : "none";

    // show chevron if needed
    this.parentControl.doLayout();

    return this;
};


/*****************************************************************************
 Sets the icon displayed in this tab.
 @param icon  string: Either a URL of a 16x16 image, or an object that
              implements the IID_SPRITEINFO interface like the constants
              defined in #ICONS16. Set to null if no image desired.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.setIcon = function( icon )
{
    this.icon = icon;

    if ( icon != null )
        if ( this.sprite==null )
        {
            this.sprite = new RasterSprite( icon, 16, 16 );
            this.sprite.setParent( this.iconSpan );
        }
        else
            this.sprite.setImage( icon );

    this.iconSpan.style.display = (icon!=null) ? "" : "none";

    // show chevron if needed
    this.parentControl.doLayout();

    return this;
};

/*****************************************************************************
 Return the index of the tab item. The first tab is at index 0.
 @return number: The index of the tab item.
 *****************************************************************************/
RasterTabItem.prototype.getIndex = function()
{
    return Raster.indexOf( this.controlBox );
};


