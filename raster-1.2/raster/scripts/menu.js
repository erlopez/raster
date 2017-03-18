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
 Creates a popup menu. The next code fragment illustrates how to create a
 commands in a group and add the commands to a menu:
 <pre code>
    // create command group
    var commands = RasterCommand.createGroup( myHandler )

    // add commands to the group
    // args:      id      icon           icon32  text
    commands.add( "new",  ICONS16.PAGE,    null, "New" );
    commands.add( "open", ICONS16.FOLDER,  null, "Open" );
    commands.add( "save", ICONS16.FLOPPY,  null, "Save As..." );

    // Disable the "save" command until there is something to save...
    commands("save").setEnabled( false );

    // create menu
    var menu = new RasterMenu();

    // Add commands to the menu
    menu.add( commands("new") );
    menu.add( commands("open") );
    menu.add( commands("save") );

    :

    menu.showAt( 50, 50); //Show menu at given x,y coords.
    &nbsp;
 </pre>
 
 @constructor
 @param parent     [object]: One of the following: a string containing the ID
                   of a DOM element, a reference to a DOM element, or another
                   control object. If this argument is not specified or set
                   null, the menu is created in the BODY element.
 *****************************************************************************/
function RasterMenu( parent )
{
    // call super()
    RasterControl.call( this, parent || document.body );   // use DIV

    this.controlBox.innerHTML = '<div class="items"></div>' +
                                '<div class="rasterShadowBox' +
                                    (Raster.isIEQuirks ? " rasterShadowBoxQuirks" : "")+ '">' +
                                    '<div class="rasterShadowBox0"></div>' +
                                    '<div class="rasterShadowBox1"></div>' +
                                    '<div class="rasterShadowBox2"></div>' +
                                    '<div class="rasterShadowBox3"></div>' +
                                '</div>' +
                                '<div class="hatch"></div>';
    this.controlBox.menu = this; // trace back expando
    this.setClass("rasterPopupMenu");

    this.itemsDiv = this.controlBox.firstChild;
    this.shadowDiv = this.controlBox.childNodes[1];
    this.hatchDiv = this.controlBox.lastChild;
    this.minWidth = 50;
    
    this.items = {};
    this.activeCommandItem = null; //points to the current commandItem having a open sub-menu

    this.hide();
    this.showHatch( false );
    this.createIE6IframeBackdrop();


    this.controlBox.onmousedown = RasterMenu.mousedownHandler;
    this.controlBox.onmouseover = RasterMenu.mouseoverHandler;

    // prior to IE9, child element hovers buggy (visibility:visible fix did not work in this case),
    // thus doing hover-out manually
    if ( Raster.isIE )
        this.controlBox.onmouseout  = RasterMenu.mouseoutHandler ;

   /** @property IID_MENU [boolean]: Interface ID tag constant used to identify #RasterMenu objects.
                             This property is always true.*/
}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterMenu.SHADOW_SIZE = 6;
RasterMenu.prototype.IID_MENU = true;
Raster.implementIID ( RasterMenu, RasterControl );



/*****************************************************************************
 Click event handler for command items.
 @private
 *****************************************************************************/
RasterMenu.mousedownHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // stop click events from bubbling up to the document (otherwise it will close the popup)
    Raster.stopEvent( event );

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    // if not a popup menu, invoke commandItem's click event
    if ( commandItem.menu==null && commandItem.isEnabled )
    {
        Raster.setActiveMenu( null );
        commandItem.command.click( event );

        // prior to IE9, child element hovers buggy (visibility:visible fix did not work in this case),
        // thus doing hover-out manually
        if ( Raster.isIE )
            commandItem.setDown( false );

    }/*if*/

};


/*****************************************************************************
 Over event handler for command items.
 @private
 *****************************************************************************/
RasterMenu.mouseoverHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    // Show item's popup menu if available
    var menu = commandItem.parentControl;

    if ( commandItem.menu != null && commandItem.isEnabled )
         menu.showItemMenu( commandItem );
    else
    {
        menu.showItemMenu( null );

        // prior to IE9, child element hovers buggy (visibility:visible fix did not work in this case),
        // thus doing hover manually
        if ( Raster.isIE )
          commandItem.setDown( true );
    }
};

/*****************************************************************************
 IE only - remove over style in menu command items.
 @private
 *****************************************************************************/
RasterMenu.mouseoutHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    // prior to IE9, child element hovers are buggy (visibility:visible fix did not work in this case),
    // thus doing hover-out manually
    if ( commandItem.menu == null )
      commandItem.setDown( false );

};

/*****************************************************************************
 Show the popup menu associated with the given commandItem. This function
 hides any other popup.
 @private
 @param commandItem  object: Command item to activate the popup menu on.
                     If this argument is null, any opened popup menu is
                     closed.
 *****************************************************************************/
RasterMenu.prototype.showItemMenu = function( commandItem )
{
    //if item is already active, leave
    if ( this.activeCommandItem == commandItem )
        return;

    //if any menu item is active, hide it
    if ( this.activeCommandItem != null )
        this.activeCommandItem.showMenu( false );

    // reset state flags
    this.activeCommandItem = null;

    // if no argument, leave
    if ( commandItem==null )
        return;

    // when the item has an associated menu, show it
    if ( commandItem.menu != null )
    {
        commandItem.showMenu( true );
        this.activeCommandItem = commandItem;

    }/*if*/

};


/*****************************************************************************
 Adjusts width of the menu based on the current commands items. Shadow
 is also adjusted.
 @private
 *****************************************************************************/
RasterMenu.prototype.refreshWidth = function()
{
    var width = this.minWidth;
    for ( var commandId in this.items )
        width = Math.max( width, this.items[commandId].getMenuOptimalWidth() );

    this.itemsDiv.style.width = width + "px";
    this.shadowDiv.style.width =  (this.controlBox.offsetWidth + RasterMenu.SHADOW_SIZE) + "px";
    this.shadowDiv.style.height = (this.controlBox.offsetHeight + RasterMenu.SHADOW_SIZE ) + "px";

    // Force opera to recompute layout
    if ( Raster.isOp )
        Raster.repaint( this.controlBox );    

};


/*****************************************************************************
 Adjusts the parameters of the hatch opening in this popup.
 @private

 @param isVisible   boolean: true shows the hatch opening, false hides it.
 @param atTop       boolean: true shows the hatch at the top border,
                    false shows the hatch at the bottom border.
 @param x           number: X offset where the hatch line starts
 @param width       number: width of the hatch line opening
 *****************************************************************************/
RasterMenu.prototype.showHatch = function( isVisible, atTop, x, width)
{
    this.hatchDiv.style.display = isVisible ? "block" : "none";
    if ( !isVisible )
        return;

    this.hatchDiv.style.left = x + "px";
    this.hatchDiv.style.width = width + "px";

    if ( atTop )
    {
        this.hatchDiv.style.top = "0";
        this.hatchDiv.style.bottom = "";
    }
    else
    {
        this.hatchDiv.style.top = "";
        this.hatchDiv.style.bottom = "0";

    }/*if*/
};


/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method also disposes nested CommandItem objects.
 *****************************************************************************/
RasterMenu.prototype.dispose = function()
{
    this.itemsDiv = null;
    this.hatchDiv = null;
    this.shadowDiv = null;
    this.controlBox.onmousedown = null;
    this.controlBox.onmouseover = null;
    this.controlBox.menu = null;

    for ( var commandId in this.items )
        this.items[commandId].dispose();

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
    //out('Menu disposed.');
};


/*****************************************************************************
 Remove all items from this menu.
 *****************************************************************************/
RasterMenu.prototype.removeAll = function()
{
    for ( var commandId in this.items )
        this.items[commandId].dispose();

    this.cleanSeparators();
    this.items = [];
};


/*****************************************************************************
 Returns a reference to the DOM element that accepts content in this menu.
 CommandItems are stacked inside this container.
 @private
 *****************************************************************************/
RasterMenu.prototype.getContentElement = function()
{
    return this.itemsDiv;
};


/*****************************************************************************
 Shows/hides the popup menu's shadow.
 @param isVisible  boolean: true shows the shadow (default);
                   false hides the shadow.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.showShadow = function( isVisible )
{
    this.shadowDiv.style.display = isVisible ? "" : "none";
    return this;
};


/*****************************************************************************
 Show the menu at the given X,Y page coordinates.
 @param x            number: X position in pixels
 @param y            number: Y position in pixels
 @param adjustToFit  [boolean]: Set to true to allow the menu to be shifted
                     out of the given x,y coordinates and prevent the menu
                     from showing off-screen. Omit this argument or set
                     to false to show the menu at exactly the given x,y coordinates.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.showAt = function(x, y, adjustToFit )
{
    Raster.setActiveMenu( this );

    if ( adjustToFit===true )
    {
        var win = Raster.getWindowBounds();
        var scroll = Raster.getElementScrolling( document.body );
        var menubox = this.getBounds();

        // Don't fit to the right? then shift left
        if ( x + menubox.width > (win.width + scroll.x - 20) )
            x = Math.max( scroll.x, x - menubox.width );

        // Don't fit to the bottom? then shift up
        if ( y + menubox.height > (win.height + scroll.y - 20) )
            y = Math.max( scroll.y, y - menubox.height );
        
    }/*if*/

    this.moveTo( x, y );
    this.setVisible(true);
    return this;
};


/*****************************************************************************
 Show this menu to the right of the given element. If the menu does not fit
 to the right, it is show to the left of the element and adjusted to fit in
 the window.
 @param element object: Element to position the menu next to. This value can
                be one of the following: a string containing the ID of a DOM
                element, a reference to a DOM element, or another control object.
 @param ofsX    [number]: X offset to be applied to the final computed x value.
                This value can be positive or negative.
 @param ofsY    [number]: Y offset to be applied to the final computed y value.
                This value can be positive or negative.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.showNextTo = function( element, ofsX, ofsY )
{
    element = Raster.resolve( element );

    var elementBox = Raster.getBounds( element );
    var win = Raster.getWindowBounds();
    var scroll = Raster.getElementScrolling( document.body );
    var menubox = this.getBounds();

    var x = elementBox.x + elementBox.width + (ofsX || 0);
    var y = elementBox.y + (ofsY || 0);
    var adjusted = false;

    // Don't fit to the right? then squeeze it to the left
    if ( elementBox.x + elementBox.width + menubox.width > win.width )
    {
        x = Math.max( scroll.x, elementBox.x - menubox.width );
    }

    // Don't fit to the bottom? then squeeze it to the top
    if ( elementBox.y + menubox.height > (win.height + scroll.y) )
    {
        y = Math.max( scroll.y, (win.height + scroll.y) - menubox.height);
    }

    // make menu visible at the x,y  location
    this.showAt( x, y);

    return this;
};


/*****************************************************************************
 Show this menu to the bottom of the given element. If the menu does not fit
 in the bottom, it is show above of the element and adjusted to fit in
 the window.
 @param element object: Element to position the menu below of. This value can 
                be one of the following: a string containing the ID of a DOM
                element, a reference to a DOM element, or another control object.
 @param ofsX    [number]: X offset to be applied to the final computed x value.
                This value can be positive or negative.
 @param ofsY    [number]: Y offset to be applied to the final computed y value.
                This value can be positive or negative.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.showBelowOf = function( element, ofsX, ofsY )
{
    element = Raster.resolve( element );

    var elementBox = Raster.getBounds( element );
    var win = Raster.getWindowBounds();
    var scroll = Raster.getElementScrolling( document.body );
    var menubox = this.getBounds();

    
    var x = elementBox.x  + (ofsX || 0);
    var y = elementBox.y + elementBox.height  + (ofsY || 0);
    var adjusted = false;
    
    // Don't fit to the right? then shift to the left
    if ( elementBox.x + menubox.width > win.width || elementBox.x < scroll.x )
    {
        x = Math.max( scroll.x, (elementBox.x + Math.min(elementBox.width, menubox.width)) - menubox.width );
    }


    // Don't fit to the bottom? then shift it to the top
    if ( y + menubox.height > (win.height + scroll.y) )
    {
        y = Math.max( scroll.y, elementBox.y - menubox.height );
    }


    // make menu visible at the x,y  location
    this.showAt( x, y );

    return this;

};


/*****************************************************************************
 Hides this menu (if visible).
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.hide = function()
{
    //Hide any open sub-menu
    this.showItemMenu( null );
    this.setVisible(false);
    this.showHatch( false );
    return this;
};


/*****************************************************************************
 Adds a command item to this menu.
 @param newCommand   object: A reference to a #RasterCommand object.
 @param menu         [object]: A reference to a menu object. This is the popup
                     menu shown then the command item is selected. When a menu
                     is specified, the drop down arrow is automatically turned on.
                     Use <code>showArrow()</code> to turned off if desired.
 @param refCommand   [object]: A reference to a Command object, CommandItem object,
                     or a string containing the ID of an existing command.
                     If a command matching this argument is not found in this
                     container, the separator is appended at the end of the
                     container.
 @param after        [boolean]: true adds the separator after the
                     given refCommand (default); false adds this separator before the
                     given refCommand.
 @return object: A reference to the #RasterCommandItem object just added.
 *****************************************************************************/
RasterMenu.prototype.add = function( newCommand, menu, refCommand, after )
{
    //a. check for repeated command items
    if ( this.items[ newCommand.id ] != null )
        return this.items[ newCommand.id ];

    //b. add command item
    var item = new RasterCommandItem( this, newCommand );
    this.items[ newCommand.id ] = item;
    item.setMenu( menu );

    //c. reorganize items, if needed
    if ( refCommand!=null )
    {
        if ( refCommand.IID_COMMAND )
            refCommand = refCommand.id;
        else if ( refCommand.IID_COMMANDITEM )
            refCommand = refCommand.command.id;

        if ( this.items[ refCommand ] != null )
            Raster.setSibling( item, this.items[ refCommand ], after==null ? true : after );
    }/*if*/


    this.refreshWidth();
    
    return item;
};

 

/*****************************************************************************
 Adds a separator line in this menu.
 @param refCommand   [object]: A reference to a #RasterCommand object, #RasterCommandItem object,
                     or a string containing the ID of an existing command.
                     If a command matching this argument is not found in this
                     container, the separator is appended at the end of the
                     container.
 @param after        [boolean]: true adds the separator after the
                     given refCommand (default); false adds this separator before the
                     given refCommand.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.addseparator = function( refCommand, after )
{
    //a. resolve command objects into id
    if ( refCommand!=null )
    {
        if ( refCommand.IID_COMMAND )
            refCommand = refCommand.id;
        else if ( refCommand.IID_COMMANDITEM )
            refCommand = refCommand.command.id;
    }/*if*/

    //b. add seprarator
    var sep = document.createElement("SPAN");
    sep.className = "sep";

    if ( this.items[ refCommand ] == null )
        this.itemsDiv.appendChild( sep );
    else
        Raster.setSibling( sep, this.items[ refCommand ], after==null ? true : after );

    this.refreshWidth();

    return this;
};

/*****************************************************************************
 Removes adjacent, trailing, or leading separators. This method is called
 after removing items from the control to make sure no adjacent
 separators are left when removing an item.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.cleanSeparators = function()
{
    var hasPrevSep = true;
    var node = this.itemsDiv.firstChild;

    while ( node!=null )
    {
        if ( node.className=="sep" )
        {
            var sep = node;
            node = node.nextSibling;
            if ( hasPrevSep )
                this.itemsDiv.removeChild( sep );

            hasPrevSep = true;
        }
        else
        {
            hasPrevSep = false;
            node = node.nextSibling;
        }/*if*/

    }/*while*/

    // last?
    if ( this.itemsDiv.lastChild!=null && this.itemsDiv.lastChild.className=="sep" )
        this.itemsDiv.removeChild( this.itemsDiv.lastChild );

    return this;
};


/*****************************************************************************
 Removes a command item from this menu.
 @param command  object: A reference to a #RasterCommand object, #RasterCommandItem object, or a
                 string containing the ID of the command to be removed.
                 If a command matching this argument is not found in this
                 container, this method does nothing.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.remove = function( command )
{
    //a. resolve command objects into id
    if ( command.IID_COMMAND )
        command = command.id;
    else if ( command.IID_COMMANDITEM )
        command = command.command.id;

    //b. exit if command is not found in this control
    if ( this.items[ command ] == null )
        return this;

    //c. dispose the command item
    this.items[ command ].dispose();
    delete this.items[ command ];

    this.refreshWidth();
    this.cleanSeparators();

    return this;
};


/*****************************************************************************
 Sets the minimum width for this menu, for astetics purposes.
 @param minWidth  number: Desired minimum width. Set to null to use menu's
                  default width.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.setMinWidth = function( minWidth )
{
    this.minWidth = minWidth==null ? 50 : minWidth;
    this.refreshWidth();
    return this;
};

