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
 Creates a toolbar. Toolbars are usually placed in DIV elements somewhere in
 the document. The <code>id</code> of the DIV is given to the constructor
 via the <code>parent</code> argument.

 Toolbars will take all the horizontal space of its parent container. The
 height of the parent container should be set according to the toolbar's
 size (see <code>size</code> argument below).

 The next code fragment illustrates how to create a commands in a group and
 add the commands to a toolbar:
 <pre code>
    // create command group
    var commands = RasterCommand.createGroup( myHandler )

    // add commands to the group
    // args:      id      icon           icon32  text
    commands.add( "new",  ICONS16.PAGE,    null, "New" );
    commands.add( "open", ICONS16.FOLDER,  null, "Open" );
    commands.add( "save", ICONS16.FLOPPY,  null, "Save" );

    // Create toolbar in DIV#toolbar container
    var tBar = new RasterToolbar("toolbar", "small");
    tBar.add( commands('new')  );
    tBar.add( commands('open') );
    tBar.add( commands('save') );

    :

    &lt;body>
       
       &lt;div id="toolbar" style="height:28px">&lt;/div>

    &nbsp;
 </pre>

 @constructor


 @param parent     [object]: One of the following: a string containing the ID
                   of a DOM element, a reference to a DOM element, or another
                   control object. If this argument is null, the control is
                   created but not attached to the DOM tree.

                   The RasterControl.setParent() method can be used later to
                   specify a parent container.
 @param size       [string]: Specifies the size of the toolbar. The possible
                   values are "<code>small</code>", "<code>medium</code>", or
                   "<code>large</code>".
                   <ul>
                     <li><b>small</b>: creates a 28px-thick tool bar using 16x16 icons, showing
                         any command text next to the icon.</li>
                     <li><b>medium</b>: crates a 48px-thick tool bar using 16x16 icons, showing
                         any command text below to the icon.</li>
                     <li><b>large</b>: crates a 64px-thick tool bar using 32x32 icons, showing
                         any command text below to the icon.</li>
                   </ul>
                   If this value is null or not set, a small toolbar is created.
                   This argument is not case-sensitive.
 *****************************************************************************/
function RasterToolbar( parent, size )
{
    size = ( size || 's' ).toString().toLowerCase().charAt(0);

    // call super()
    RasterControl.call( this, parent );
    this.controlBox.innerHTML = "<div class='items'></div><div class='chevron'></div>";    
    this.itemsDiv = this.controlBox.firstChild;
    this.chevronDiv = this.controlBox.lastChild;

    this.isThick = size==='m';
    this.isXLarge = size==='l';
    this.setClass( this.isXLarge ? "rasterXLbar" : (this.isThick ? "rasterThickbar" : "rasterThinbar") );
    this.items = {};

    this.activeCommandItem = null; //points to the current commandItem having a open popup menu
    this.autoOpenMenu = false;

    // create chevron item
    this.chevronItem = this.add( RasterCommand.CHEVRON ).showText(false);
    delete this.items[ this.chevronItem.command.id ]; //This is an special item, keep it private and erase from from items list
    
    this.chevronItem.sprite.setImage( GLYPHS.CHEVRON_RIGHT );
    this.chevronItem.sprite.setSize( 9, 16 );
    this.chevronItem.setParent( this.chevronDiv );
    this.chevronDiv.style.display = "none";

    // handlers
    this.controlBox.onmousedown = RasterToolbar.mousedownHandler;
    this.controlBox.onmouseover = RasterToolbar.mouseoverHandler;
    this.controlBox.onmouseup = this.controlBox.onmouseout = RasterToolbar.mouseupHandler;

    // resister toolbar by unique id Sequence
    this.id = "toolbar" + (Raster.idSequence++);
    RasterToolbar.all[ this.id ] = this;

   /** @property IID_TOOLBAR [boolean]: Interface ID tag constant used to identify #RasterToolbar objects.
                             This property is always true.*/
}

/*****************************************************************************
 Statics, Implements the Control class
 @private
 *****************************************************************************/
RasterToolbar.all = {};
RasterToolbar.prototype.IID_TOOLBAR = true;
Raster.implementIID ( RasterToolbar, RasterControl );



/*****************************************************************************
 Triggers a layout check in all toolbars. Invoked when page is resized.
 @private
 *****************************************************************************/
RasterToolbar.doLayout = function()
{
    //call doLayout in all Toolbar
    for ( var id in RasterToolbar.all )
        RasterToolbar.all[id].doLayout();

};

/*****************************************************************************
 Click event handler for command items.
 @private
 *****************************************************************************/
RasterToolbar.mouseupHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    if (commandItem.menu == null ) //end momentaneous down effect for buttons w/o menu
        commandItem.setDown( false );

};

/*****************************************************************************
 Click event handler for command items.
 @private
 *****************************************************************************/
RasterToolbar.mousedownHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    // Show popup menu when available, otherwise invoke commandItem's click event
    var toolbar = commandItem.parentControl;
    
    if ( commandItem.isEnabled )
        if ( commandItem.menu != null )
        {
            if ( toolbar.activeCommandItem==commandItem )
            {
                toolbar.showItemMenu( null );                //toggle off
                Raster.setActiveMenu( null );
            }
            else
                toolbar.showItemMenu( commandItem );         //hide any previously shown menu, show menu

        }
        else
        {
            Raster.setActiveMenu( null );
            toolbar.autoOpenMenu = false;
            commandItem.command.click( event );

            if (commandItem.menu == null ) //momentaneous down effect for buttons w/o menu
                commandItem.setDown( true);
    
        }/*if*/

    Raster.stopEvent( event );

};


/*****************************************************************************
 Over event handler for command items.
 @private
 *****************************************************************************/
RasterToolbar.mouseoverHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;


    // Show popup menu when available, and 'autoOpenMenu' flag is on
    var toolbar = commandItem.parentControl;

    if ( commandItem.isEnabled && toolbar.autoOpenMenu && commandItem.menu!=null )
         toolbar.showItemMenu( commandItem );

};


/*****************************************************************************
 Show/hides the chevron menu based on the width of the toolbar. This is
 invoked automatically in page resize events, but can be called directly if
 a custom layout changes affects the width of a toolbar.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.doLayout = function()
{
    var node = null;

    // find the first node that wraps to the second line (if any)
    for ( var i=0; i < this.itemsDiv.childNodes.length; i++)
    {
        var tmp = this.itemsDiv.childNodes[i];
        if ( tmp.className!="sep" && tmp.offsetTop > 5 )
        {
            node = tmp;
            break;
        }
    }/*for*/

    // if no menuable items, hide chevron and leave
    if ( node==null )
    {
        this.chevronDiv.style.display = "none";
        return this;
    }

    // show chevron, initialize menu
    this.chevronDiv.style.display = "block";
    if ( this.chevronMenu == null )
    {
        this.chevronMenu = new RasterMenu( document.body );
        this.chevronMenu.controlBox.style.zIndex = 90;
        this.chevronItem.setMenu( this.chevronMenu ).showArrow(false);
    }/*if*/

    
    // initialize chevron menu
    this.chevronMenu.removeAll();


    // populate menu with wrapped items
    do {
        if ( node.className != "sep" )
        {
            var item = node.firstChild.commandItem;   //the firstChild is iconLink element
            this.chevronMenu.add( item.command, item.menu  );

        }
        else
        {
            this.chevronMenu.addseparator();
        }/*if*/

        node = node.nextSibling;

    } while ( node != null );

    return this;

};


/*****************************************************************************
 Show the popup menu associated with the given commandItem. This function
 hides any other popup.
 @private
 @param commandItem  object: Command item to activate the popup menu on.
                     If this argument is null, any opened popup menu is
                     closed.
 *****************************************************************************/
RasterToolbar.prototype.showItemMenu = function( commandItem )
{
    //if item is already active, leave
    if ( this.activeCommandItem == commandItem )
        return;

    //if any menu item is active, hide it
    if ( this.activeCommandItem != null )
    {
        this.autoOpenMenu = false;
        this.activeCommandItem.showMenu( false );
    }


    // reset state flags
    this.activeCommandItem = null;
    this.autoOpenMenu = false;

    // if no argument, leave
    if ( commandItem==null )
        return;

    // when the item has an associated menu, show it
    if ( commandItem.menu != null )
    {
        Raster.setActiveMenu( this );
        commandItem.showMenu( true );
        this.activeCommandItem = commandItem;
        this.autoOpenMenu = true;

    }/*if*/

};


/*****************************************************************************
 Releases and removes all DOM element references used by the toolbar from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method also disposes nested command item objects as well.
 *****************************************************************************/
RasterToolbar.prototype.dispose = function()
{
    this.chevronItem.dispose();

    this.itemsDiv = null;
    this.chevronDiv = null;
    this.controlBox.onmousedown = null;
    this.controlBox.onmouseover = null;

    // free chevron menu
    if ( this.chevronMenu )
    {
        this.chevronMenu.dispose();
        this.chevronMenu = null;
    }/*if*/

    // unresister toolbar
    delete RasterToolbar.all[ this.id ];

    for ( var commandId in this.items )
        this.items[commandId].dispose();

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );

    //out('Toolbar disposed.');
};


/*****************************************************************************
 Remove all command items from this toolbar.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.removeAll = function()
{
    for ( var commandId in this.items )
        this.items[commandId].dispose();

    this.cleanSeparators();
    this.items = [];

    // hide chevron
    this.doLayout();

    return this;
};


/*****************************************************************************
 Returns a reference to the DOM element that accepts content in this Control.
 @private
 *****************************************************************************/
RasterToolbar.prototype.getContentElement = function()
{
    return this.itemsDiv;
};


/*****************************************************************************
 Adds a command item to this toolbar.
 @param newCommand   object: A reference to a #RasterCommand object.
 @param menu         [object]: A reference to a menu object. This is the popup
                     menu shown then the command item is selected. When a menu
                     is specified, the drop down arrow is automatically turned on.
                     Use RasterCommand.showArrow() to turned off if desired.
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
RasterToolbar.prototype.add = function( newCommand, menu, refCommand, after )
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

    // show chevron if needed
    this.doLayout();

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
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.addseparator = function( refCommand, after )
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
    {
        Raster.setSibling( sep, this.items[ refCommand ], after==null ? true : after );

        // show chevron if needed
        this.doLayout();
        
    }/*if*/

    return this;
};


/*****************************************************************************
 Removes adjacent, trailing, or leading separators. This method is called
 after removing items from the control to make sure no adjacent
 separators are left when removing an item.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.cleanSeparators = function()
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
    if ( this.itemsDiv.lastChild !=null && this.itemsDiv.lastChild.className=="sep" )
        this.itemsDiv.removeChild( this.itemsDiv.lastChild );

    return this;
};


/*****************************************************************************
 Removes a command item from the toolbar.
 @param command  value: A reference to a Command object, CommandItem object,
                 or a string containing the ID of the command to be removed.
                 If a command matching this argument is not found in this
                 container, this method does nothing.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.remove = function( command )
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

    //d. make sure no adjacent separators ar left when removing item
    this.cleanSeparators();

    //e. adjust chevron
    this.doLayout();

    return this;
};


/*****************************************************************************
 Shows/hides the toolbar's background.
 @param isVisible  boolean: true shows the assigned css background (default);
                   false makes the toolbar's background transparent.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.showBackground = function( isVisible )
{
    this.controlBox.style.background = isVisible ? "" : "none";
    return this;
};