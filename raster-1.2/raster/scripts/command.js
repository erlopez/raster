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
 Creates a command object. A command object defines an application function or
 action that can be executed by the user. Once a command is defined, it can
 be placed in the application's menus and toolbars so the user to execute them.

 The <code>eventHandler</code> argument specifies the function to be invoked
 when a command is executed. When a command is executed, the command object
 is passed as argument to the event handler. The following code shows a typical
 command handler function:
 <pre code>
   function myHandler ( cmd )
   {
        switch ( cmd.id )
        {
           case "save":    //do save...
                           break;
           case "open":    //do open...
                           break;
           case "new":     //do new document...
                           break;
           //etc...
        }
   }
 </pre>
 The next code fragment show how to create commands and adding them to a menu:
 <pre code>
     :
    // Create an array with our commands
    var cmds = [
      new RasterCommand( "id3", ICONS16.PAGE, null,
                           "New",  null, null, "Ctrl+N", myHandler ),

      new RasterCommand( "id2", ICONS16.FOLDER, null,
                           "Open", null, null, "Ctrl+O", myHandler ),

      new RasterCommand( "id1", ICONS16.FLOPPY, null,
                           "Save", null, null, "Ctrl+S", myHandler )
    ];

    // Disable the save command until there is something
    // to save...
    cmds[2].setEnabled( false );

    // create menu
    var menu = new RasterMenu();

    // Add commands to the menu
    menu.add( cmds[0] );
    menu.add( cmds[1] );
    menu.add( cmds[2] ); 
    &nbsp;
 </pre>
 The above code uses an array to store the commands the application will use
 in its UI. With this approach the code can become very verbose very fast.
 When working with a large amount of commands it is better to use commad
 group objects. See createGroup() for more details.
 
 @constructor
 @see createGroup()

 @param id           value: A unique ID used to identify this command. Choose
                     a short string code or integer constant that describes
                     a function or action in the application.
 @param icon         string: Either an URL of a 16x16 image, or an object that 
                     implements the IID_SPRITEINFO interface like the constants
                     defined in #ICONS16. This icon is used by menus and
                     small/medium toolbars. Set to null if no 16x16 icon is needed.
                     You don't need to set a 16x16 icons in commands aimed only at
                     "large" toolbars.
 @param icon32       string: Either an URL of a 32x32 image, or an object that
                     implements the IID_SPRITEINFO interface like the constants
                     defined in #ICONS32. This icon is used by "large" toolbars.
                     If this value is null, the 16x16 icon is used (if any).
                     You don't need to set a 32x32 icons in commands aimed menus
                     or small/medium toolbars.
 @param text         string: Text associated with this command. It is displayed
                     next or below the command icon. Set to null if no text is desired.
 @param toolText     string: Alternate text to be used when the command is displayed in
                     a toolbar. This is usually a shorter version of the <code>text</code>
                     argument used to prevent the toolbar buttons from growing
                     too wide. Set to null to use the default <code>text</code>.
 @param tooltip      string: Text that popup when the mouse pointer sits still over
                     a toolbar button. This text can be used to "hint" the user
                     detail information about what the command does. Set null is no
                     tooltip is desired. This text is used by toolbars only.
 @param keys         string: This is a label shown next to the menu option used to
                     show the keyboard shortcut (or keys) the user can press in
                     keyboard to execute this command, for example: "Alt+1",
                     "Ctrl+Shift+K", etc. Note this is a "display-only" label and no
                     actual key binding are stablished by the library. The programmer must
                     process the keyboard events separately. This feature is intended
                     for SWT/embedded-mozilla or XUL applications where there is better
                     keyboard control. Set to null if no shortcut keys are supported.
 @param eventHandler function: pointer to a function used to receive
                     notification when this command is executed.
 *****************************************************************************/
function RasterCommand( id, icon, icon32, text, toolText, tooltip, keys, eventHandler )
{
    this.id = id;                                       /** @property id [any]:  The unique ID that identifies the command.
                                                            This value is usually a string or integer constant
                                                            that tells the event handler what to do when the
                                                            command is executed.*/
    this.icon = icon;                                   /** @property icon [string]:   Either an URL of a 16x16 image, or an
                                                            object that implements the IID_SPRITEINFO. It may be null.*/
    this.icon32 = icon32;                               /** @property icon32 [string]:  Either an URL of a 16x16 image, or an
                                                            object that implements the IID_SPRITEINFO. It may be null.*/

    this.text = text;                                   /** @property text [string]: Text associated with the command. May be null.*/

    this.toolText = toolText!=null ? toolText : text;   /** @property toolText [string]: Alternate text used when
                                                            the command is displayed in a toolbar. May be null.*/
    this.keys = keys;                                   /** @property keys [string]: Shortcut key text associated
                                                            with this command. May be null.*/
    this.tooltip = tooltip;                             /** @property tooltip [string]: Tool tip text used when
                                                            the command is displayed in a toolbar. May be null.*/
    this.event = null;                 /** @property event [object]: Page's DOM event associated with the execution
                                                     of the command. This property is valid only in a command object
                                                     passed to a event handler. The event handler may use this
                                                     object to obtain further mouse and keyboard information.
                                                     This property may be null if the event was programmatically triggered by the
                                                     using the command's click() method and no <code>event</code> value was provided
                                                     by the caller. */

    this.isSelected = false;   /** @property isSelected [boolean]: True indicates the command is currently
                                   marked as selected; false indicates the command is not marked as selected.
                                   @see setSelected() */
    this.isEnabled = true;     /** @property isEnabled [boolean]: True indicates the command is currently
                                   enabled; false indicates the command is disabled.
                                   see setEnabled() */

    this.eventHandler = eventHandler;

    // Back reference to command items using this command.
    this.items = {};

    // Add command to global command registry,
    //   ignore commands coming from Tabbar control chevron menu
    if ( !/^tabitem.\d*$/.test(id) )
        RasterCommand.all[ id ] = this;

   /** @property IID_COMMAND [boolean]: Interface ID tag constant used to identify #RasterCommand objects.
                             This property is always true.*/
}
/*****************************************************************************
 Globals & Constants
 @private
 *****************************************************************************/
RasterCommand.all = {}; //command registry 
RasterCommand.CHEVRON = new RasterCommand("RasterCommand.CHEVRON", "" );
RasterCommand.prototype.IID_COMMAND = true;


/*****************************************************************************
 Creates a command group object. A command group object is a collection that
 holds command objects. All commands in the group have the same event handler.

 The <code>createGroup</code> is a static method in the #RasterCommand class,
 therefore it is invoked using <code>RasterCommand</code> class as follows:
 <pre code>
      :
    var commands = RasterCommand.createGroup( myHandler );
    &nbsp;
 </pre>
 The next code fragment illustrates how to create a command group, add commands,
 and reference the commands in it:
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

      :
 </pre>
 In the code above, the <code>commands</code> variable behaves as an
 array, indexed by the commands #id attribute. The only difference is that elements
 in a command group object are accessed using parenthesis "()" instead
 of square brackets "[]". The following lines show how to add the
 commands to a menu:
 <pre code>
     :
    // create menu
    var menu = new RasterMenu();

    // Add commands to the menu
    menu.add( commands("new") );
    menu.add( commands("open") );
    menu.add( commands("save") ); 
    &nbsp;
 </pre>
 The signature of the add() method is the same as the #RasterCommand constructor,
 minus the <strike>eventHandler</strike> argument:

 <code><i>commandGroup</i>.add( id, icon, icon32, text, toolText, tooltip, keys );</code>

 The <code>add()</code> function returns the #RasterCommand object just added to
 the command group collection, thus the following is also allowed:
 <pre code>
       :
    commands.add("save", ICONS16.FLOPPY, null,
                                   "Save As..." ).setEnabled(false);
    &nbsp;
 </pre>
 The line above adds a "save" command and disables it in the same
 statement.

 The command group is a convenient data structure used to store all the
 application's command objects in a single location. You can create many
 command groups, but in most cases one per web page is enough.

 @param eventHandler function: pointer to the function that will receive
                     notifications when commands in the group are executed.
 @return object: A new command group object.
 *****************************************************************************/
RasterCommand.prototype.createGroup = RasterCommand.createGroup = function( eventHandler )
{
    var commands = {};

    // define function that acts as a collection object; closure the 'commands' variable
    var group = function( id )
    {
        return commands[id];
    };

    // define static add method for the collection object
    group.add = function(id, icon, icon32, text, toolText, tooltip, keys )
    {
       return commands[id] = new RasterCommand( id, icon, icon32, text, toolText, tooltip, keys, eventHandler );
    };

    return group;
};


/*****************************************************************************
 Causes this command to invoke its associated event handler function.
 @param event [object]: A DOM event. This object is passed along to the
                        event handler as the command's #event property.
                        Set to null if not available.
 @return object: The command object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommand.prototype.click = function( event )
{
    if ( this.eventHandler!=null )
    {
        this.event = event;
        this.eventHandler( this );
        this.event = null;
    }
    return this;
};


/*****************************************************************************
 Updates the 'selected' state of all toolbar and menus containing an item
 associated with this command.
 @param selected boolean: True marks command items assosiated with this
                 command as selected. False unselect them.
 @return object: The command object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommand.prototype.setSelected = function( selected )
{
    this.isSelected = selected;

    // go through all commanditems using this command and update the select state in them
    for ( var id in this.items )
        this.items[ id ].setSelected( selected );

    return this;
};


/*****************************************************************************
 Updates the 'enabled' state of all toolbar and menus containing an item
 associated with this command.
 @param enabled   boolean: True marks command items associated with this
                   command as enabled. False disables them.
 @return object: The command object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommand.prototype.setEnabled = function( enabled )
{
    this.isEnabled = enabled;

    // go through all commanditems using this command and update the enabled state in them
    for ( var id in this.items )
        this.items[ id ].setEnabled( enabled );

    return this;
};


//-----8<--------------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Creates a renderable version of a #RasterCommand that can be added to a menu
 or a toolbar. This constructor should not be used directly. To add commands
 to menus and toolbars use RasterMenu.add() and RasterToolbar.add() respectively.
 @constructor
 @param parentControl     object: The #RasterToolbar or #RasterMenu object that contains
                          this command.
 @param command           A #RasterCommand object.
 @see RasterMenu.add(), RasterToolbar.add()
 *****************************************************************************/
function RasterCommandItem( parentControl, command )
{
    RasterControl.call( this, parentControl, "span" );

    this.command = command;
    this.parentControl = parentControl;
    this.isThick = parentControl.IID_TOOLBAR && parentControl.isThick===true;   // indicate this item was added to a thickbar
    this.isXLarge = parentControl.IID_TOOLBAR && parentControl.isXLarge===true; // indicate this item was added to a XL bar
    this.isMenu = parentControl.IID_MENU;                                       // indicate this item was added to a popup menu

    this.setClass( this.isMenu ? "rasterPopupMenuItem"  
                               : (this.isXLarge ? "rasterXLbarItem" : (this.isThick ? "rasterThickbarItem" : "rasterThinbarItem")) );

    this.iconLink = document.createElement("A");
    this.iconLink.href = "#";                            //needed in IE so hover works
    this.iconLink.onclick = Raster.stopEvent;
    this.iconLink.commandItem = this;                    //expando trace back to owner object
    if ( command.tooltip )
        this.iconLink.title = command.tooltip;    
    this.controlBox.appendChild( this.iconLink );
    this.iconLink.innerHTML = "<span class='bkleft'></span>" +
                              "<span class='bkright'></span>" +
                              "<span class='bkicon'></span>" +
                              "<span class='cmdIco'></span>" +
                              "<br class='cmdCRLF'>" +
                              "<span class='cmdTxt'></span>" +
                              "<br class='cmdCRLF'>" +
                              "<span class='cmdKey'></span>" +
                              "<span class='cmdArrow' style='display:none'></span>";


    this.iconSpan = this.iconLink.childNodes[3];
    this.textSpan = this.iconLink.childNodes[5];
    this.keysSpan = this.iconLink.childNodes[7];
    this.arrowSpan = this.iconLink.childNodes[8];


    if ( this.isXLarge )
    {
        if ( command.icon32 != null )
        {
            this.sprite = new RasterSprite( command.icon32, 32, 32 );
            this.sprite.setParent( this.iconSpan );
        }
        else if ( command.icon != null )
        {
            this.sprite = new RasterSprite( command.icon, 16, 16 );
            this.sprite.controlBox.style.margin = "8px 0"; //rudimentatry, center icon16 vertically
            this.sprite.setParent( this.iconSpan );
        }
        else
            this.iconSpan.innerHTML = "<span style='display:inline-block; height:32px'></span>";
    }
    else if ( command.icon != null )
    {
        this.sprite = new RasterSprite( command.icon, 16, 16 );
        this.sprite.setParent( this.iconSpan );
    }
    else if ( this.isMenu || this.isThick )
    {
        //insert 16px shim to compensate for missing icon
        this.iconSpan.innerHTML = "<span style='display:inline-block; width:16px; height:16px'></span>";
    }
    else
        this.iconSpan.style.display = "none";


    this.textSpan.innerHTML = parentControl.IID_TOOLBAR ? command.toolText : command.text;
    this.keysSpan.innerHTML = command.keys || "";

    // Set default state
    this.menu = null;
    this.isEnabled = true;
    this.isSelected = false;
    this.isDown = false;
    this.arrowOn = false;

    this.updateStyle();
    this.setSelected( command.isSelected );
    this.setEnabled( command.isEnabled );

    // Register this CommandItem in the Command's object items[] list
    this.id = "cmdItem" + (Raster.idSequence++);          // unique id used to identify this command item
    this.command.items [ this.id ] = this;

   /** @property IID_COMMANDITEM [boolean]: Interface ID tag constant used to identify #RasterCommandItem objects.
                             This property is always true.*/
}
/*****************************************************************************
 Statics, Implements the Control class
 @private
 *****************************************************************************/
RasterCommandItem.prototype.IID_COMMANDITEM = true;
Raster.implementIID ( RasterCommandItem, RasterControl );



/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method is called from the parent Toolbar or Menu; to remove an item
 use <code>remove()</code> instead.
 @private
 *****************************************************************************/
RasterCommandItem.prototype.dispose = function()
{
    this.iconLink.commandItem = null;
    this.iconLink.onmousedown = null;
    this.iconLink = null;
    this.iconSpan = null;
    this.textSpan = null;
    this.keysSpan = null;
    this.menu = null;

    if ( this.sprite != null )
        this.sprite.dispose();

    // Unregister this command item with the command it is using
    delete this.command.items [ this.id ];

    // Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );

    //out('CommandItem disposed.');
};


/*****************************************************************************
 Show/hides the menu associated with this command item (if any). The menu
 might shift off its optimal position in order to fit in the screen boundaries.
 @private
 @param isVisible boolean: true shows the menu, false hides it.
 *****************************************************************************/
RasterCommandItem.prototype.showMenu = function( isVisible )
{
    if ( this.menu==null )
        return;

    if ( isVisible===false )
    {
        this.menu.hide();
        this.setDown( false );
        return;
    }/*if*/

    // highlight the item
    this.setDown( true );

    var linkbox = Raster.getBounds( this.iconLink );
    var win = Raster.getWindowBounds();
    var scroll = Raster.getElementScrolling( document.body );
    var menubox = this.menu.getBounds();
    var x, y;

    //in Opera, el.getBoundingClientRect() often returns unreliable height values, use clientHeight instead
    if ( Raster.isOp )
        linkbox.height = this.iconLink.clientHeight;

    // a. Draw cascade sub-menu item
    if ( this.isMenu )
    {
        x = linkbox.x + linkbox.width - 3;
        y = linkbox.y - 3;

        // Don't fit to the right? then squeeze it to the left
        if ( linkbox.x + linkbox.width + menubox.width > win.width )
           x = Math.max( scroll.x, linkbox.x - menubox.width + 3);

        // Don't fit to the bottom? then squeeze it to the top
        if ( linkbox.y - 3 + menubox.height > (win.height + scroll.y) )
           y = Math.max( scroll.y, (win.height + scroll.y) - menubox.height);

    } // b. else, draw toolbar item's menu
    else
    {
        x = linkbox.x;
        y = linkbox.y + linkbox.height-3;

        // Don't fit to the right? then shift to the left
        if ( linkbox.x + menubox.width > win.width || linkbox.x < scroll.x)
            x = Math.max( scroll.x, (linkbox.x + Math.min(linkbox.width, menubox.width)) - menubox.width );

        // show hatch opening if fits
        // if ( x <= linkbox.x &&  (x + linkbox.width) < (x + menubox.width) )
            this.menu.showHatch( true, true, linkbox.x - x+1, linkbox.width-2 );


        // Don't fit to the bottom? then shift it to the top
        if ( y + menubox.height > (win.height + scroll.y) )
        {
            y = Math.max( scroll.y, linkbox.y - menubox.height + 3 );
            this.menu.showHatch( false );
        }


    }/*if*/


    // make menu visible at the x,y  location
    this.menu.moveTo( x, y);
    this.menu.setVisible(true);


};


/*****************************************************************************
 Utility method used to help a popup menu calculate the best display width
 for its commands items.
 @private
 *****************************************************************************/
RasterCommandItem.prototype.getMenuOptimalWidth = function()
{
    return   this.iconSpan.offsetWidth +             
             this.textSpan.offsetWidth +
             this.keysSpan.offsetWidth + 2;  // +2 = prevent wrapping of menu text in IE9, due to offsetWidth pixel fractional rounding              
};


/*****************************************************************************
 * Enables/Disables this command. The 'disabled' state overwrites the
 * states: 'down' and 'selected'.
 * @private
 * @param isEnabled boolean:True shows command normal, False greys out the icon & text.
 * @return object: The command item object. This allow for chaining multiple setter methods in
 *        one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.setEnabled = function( isEnabled )
{
    if ( this.sprite!=null )
        this.sprite.setOpacity( isEnabled ? 100 : 33 );

    Raster.setOpacity( this.arrowSpan, isEnabled ? 100 : 33 );
    
    this.isEnabled = isEnabled;
    this.updateStyle();

    return this;
};


/*****************************************************************************
 * Changes the state of this command item between down/normal. This state
 * is not shown when the command item is 'disabled'.
 * @private
 * @param isDown boolean: True shows command item in down state, false shows it normal.
 * @return object: The command item object. This allow for chaining multiple setter methods in
 *        one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.setDown = function( isDown )
{
    this.isDown = isDown;
    this.updateStyle();

    return this;
};


/*****************************************************************************
 * Changes the state of this command item between selected/normal. This state
 * is not shown when the command item is in 'down' or 'disabled' state.
 * @private
 * @param isSelected boolean: True shows command item in selected state, false shows
 *                   it normal.
 * @return object: The command item object. This allow for chaining multiple setter methods in
 *        one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.setSelected = function( isSelected )
{
    this.isSelected = isSelected;
    this.updateStyle();

    return this;
};


/*****************************************************************************
 Updates the <code>className</code> of the <code>iconLink</code> element based
 in the internal state of the <code>isEnabled</code>, <code>isSelected</code>,
 and <code>isDown</code> flags.
 @private
 *****************************************************************************/
RasterCommandItem.prototype.updateStyle = function()
{
    // The "****IE" styles have no :hover psudo-style, In dropdown menu options
    // IE hover is simulated via mouseover/out to avoid <A> child elements :hover stickiness
    var ieMenu = Raster.isIE && this.isMenu;


    if ( !this.isEnabled )
        this.iconLink.className = "rasterCommandItemDisabled";

    else if ( this.isDown )
        this.iconLink.className =  ieMenu ? "rasterCommandItemDownIE" + (this.isSelected ? " rasterCommandItemSelectedIE" : "")
                                          : "rasterCommandItemDown";

    else if ( this.isSelected )
        this.iconLink.className = ieMenu ? "rasterCommandItemSelectedIE" : "rasterCommandItemSelected";

    else
        this.iconLink.className = ieMenu ? "rasterCommandItemNormalIE" : "rasterCommandItemNormal";

};


/*****************************************************************************
 Removes this tab item from the Tabbar.
 @return object: The command item object.
 *****************************************************************************/
RasterCommandItem.prototype.remove = function()
{
    this.parentControl.remove( this );
    return this;
};

/*****************************************************************************
 Show/Hides text associated with a command.
 @param isVisible boolean: True show text, False hides the text.
 @return object: The command item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.showText = function( isVisible )
{
    this.textSpan.style.display = isVisible ? "" : "none";

    // show|hide chevron 
    if ( this.parentControl.IID_TOOLBAR )
        this.parentControl.doLayout();

    return this;
};


/*****************************************************************************
 Show/Hides icon associated with a command.
 @param isVisible boolean: True show icon, False hides the icon.
 @return object: The command item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.showIcon = function( isVisible )
{
    this.iconSpan.style.display = isVisible ? "" : "none";

    // show|hide chevron
    if ( this.parentControl.IID_TOOLBAR )
        this.parentControl.doLayout();

    return this;
};


/*****************************************************************************
 Assigns a menu to this command item.
 @param menu         object: A reference to a menu object. This is the popup
                     menu shown then the command item is clicked. When a menu
                     is specified, the drop down arrow is automatically turned on.
                     Use <code>showArrow()</code> to turned off if desired.
 @return object: The command item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.setMenu = function( menu )
{
    this.menu = menu;
    this.showArrow( menu!=null );
    return this;
};


/*****************************************************************************
 Show/Hides drop down menu arrow in the command.
 @param isVisible boolean: True show icon, False hides the icon.
 @return object: The command item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.showArrow = function( isVisible )
{
    // In thick mode, add/substract to the right padding to fit the drop down arrow
    if ( this.isThick || this.isXLarge )
    {
        if ( isVisible )
            this.iconLink.style.paddingRight = ((parseInt(this.iconLink.style.paddingRight) + 15) || 15) + "px";
        else if ( this.arrowOn )
            this.iconLink.style.paddingRight = ((parseInt(this.iconLink.style.paddingRight) - 15) || 0) + "px";
    }
    else if ( this.isMenu )
    {
        this.keysSpan.style.visibility =  isVisible ? "hidden" : "";
    }

    this.arrowOn = isVisible;
    this.arrowSpan.style.display = isVisible ? "" : "none";

    // show|hide chevron
    if ( this.parentControl.IID_TOOLBAR )
        this.parentControl.doLayout();

    return this;
};

