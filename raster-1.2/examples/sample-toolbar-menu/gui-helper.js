/******************************************************************************
     This file is a DEMO of the Raster UI Library.
     http://www.lopezworks.info/raster

     Copyright (C) 2010 Edwin R. Lopez

     This source code is free software; you can redistribute it and/or
     modify it under the terms of the GNU Lesser General Public
     License as published by the Free Software Foundation LGPL v2.1
     (http://www.gnu.org/licenses/).

     This library is distributed in the hope that it will be useful,
     but WITHOUT ANY WARRANTY; without even the implied warranty of
     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
     Lesser General Public License for more details.

     You should have received a copy of the GNU Lesser General Public
     License along with this library; if not, write to the Free Software
     Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
     02110-1301  USA.
 *****************************************************************************/

/*******************************************************************
 * Globals
 *******************************************************************/
var cmd;                                   //Command group collection
var fileMenu, editMenu, fmtMenu, fsMenu,   //PopUp Menus
    winMenu, hlpMenu, attMenu, abMenu;
var menubar, toolbar16, toolbar32;               //Toolbars

/*******************************************************************
 * Define global command group.
 *
 * The command group is a centralized data structure to store all
 * functions and actions supported by your application interface
 * (ie. UI commands). Once you indentify these commands, it is easy
 * to place them in the menus and toolbars of the user interface.
 *
 * Note: The ID attribute of the command object can be anything!
 *       Choose meaningful ids that make sense to your app.
 *******************************************************************/
function setupCommands()
{
    // Create command group
    cmd = RasterCommand.createGroup( commandHandler );


    // File commands
    cmd.add( ".file", null, null, "File" );
    cmd.add( "f.new", ICONS16.EMAIL, null, "New Mail" );
    cmd.add( "f.open", ICONS16.FOLDER_PAGE, null, "Open" );
    cmd.add( "f.save", ICONS16.DISK, null, "Save" );
    cmd.add( "f.prn", ICONS16.PRINTER, null, "Print" );
    cmd.add( "f.quit", null, null, "Quit" );

    // Edit commands
    cmd.add( ".edit", null, null, "Edit" );
    cmd.add( "e.copy", ICONS16.PAGE_COPY, null, "Copy" );
    cmd.add( "e.cut", ICONS16.CUT, null, "Cut" );
    cmd.add( "e.paste", ICONS16.PASTE_PLAIN, null, "Paste..." );
    cmd.add( "e.find", ICONS16.ZOOM, null, "Find" );

    // Format commands
    cmd.add( ".fmt", null, null, "Format" );
    cmd.add( "F.bold", ICONS16.TEXT_BOLD, null, "Bold" );
    cmd.add( "F.ital", ICONS16.TEXT_ITALIC, null, "Italics" );
    cmd.add( "F.under", ICONS16.TEXT_UNDERLINE, null, "Underline" );
    cmd.add( "F.left", ICONS16.TEXT_ALIGN_LEFT, null, "Align Left" );
    cmd.add( "F.center", ICONS16.TEXT_ALIGN_CENTER, null, "Center" );
    cmd.add( "F.right", ICONS16.TEXT_ALIGN_RIGHT, null, "Align Right" );

    cmd.add( ".fontSize", null, null, "Font Size" );
    cmd.add( "s.sm", null, null, "Small" );
    cmd.add( "s.med",null, null, "Medium" );
    cmd.add( "s.lg", null, null, "Large" );

    // window commands
    cmd.add( ".win", null, null, "Window" );
    cmd.add( "w.cascade", ICONS16.APPLICATION_CASCADE, null, "Cascade" );
    cmd.add( "w.tileh", ICONS16.APPLICATION_TILE_HORIZONTAL, null, "Tile Horizontal" );
    cmd.add( "w.tilev", ICONS16.APPLICATION_TILE_VERTICAL, null, "Tile Vertical" );
    cmd.add( "w.closeAll", null, null, "Close All" );

    // help commands
    cmd.add( ".hlp", null, null, "Help" );
    cmd.add( ".hlp2", ICONS16.HELP, null, "Help"  );
    cmd.add( "h.topics", ICONS16.BOOK_OPEN, null, "Help Topics..." );
    cmd.add( "h.upd", ICONS16.WORLD, null, "Check for Updates..." );
    cmd.add( "h.about", null, null, "About..." );

    // mail commands
    cmd.add( "m.new", null, ICONS32.MAIL_NEW, "New Mail", null, "Create new mail" );
    cmd.add( "m.send", null, ICONS32.GO_NEXT, "Send", null, "Send mail" );
    cmd.add( "m.re", null, ICONS32.MAIL_REPLY, "Reply", null, "Reply to sender" );
    cmd.add( "m.reAll", null, ICONS32.MAIL_REPLY_ALL, "Reply All", null, "Replay to all recepients" );
    cmd.add( "m.fwd", null, ICONS32.MAIL_FORWARD, "Forward", null, "Forward mail to new recepient" );
    cmd.add( "m.check", null, ICONS32.REFRESH, "Check Mail", null, "Check for new mail" );
    cmd.add( "m.spam", null, ICONS32.MAIL_JUNK, "Junk", null, "Mark as Junk Mail" );
    cmd.add( "m.block", null, ICONS32.DIALOG_ERROR, "Block", null, "Block sender in the future" );

    //attachment commands
    cmd.add( ".attach", null, ICONS32.MAIL_ATTACHMENT, "Attach" );
    cmd.add( "a.image", ICONS16.IMAGES, null, "Image File..." );
    cmd.add( "a.media", ICONS16.MUSIC, null, "Multimedia File..." );
    cmd.add( "a.other", null, null, "Other..." );

    //address book commands
    cmd.add( ".ab", null, ICONS32.ADDRESS_BOOK, "Addresses" );
    cmd.add( "ab.home", ICONS16.HOUSE, null, "Home Address Book" );
    cmd.add( "ab.work", ICONS16.TELEPHONE, null, "Work Address Book" );
    cmd.add( "ab.new", null, null, "New Address Book..." );
}


/*******************************************************************
 * Create all popup menus
 *******************************************************************/
function setupMenus()
{
    // File menu
    fileMenu = new RasterMenu();
    fileMenu.setMinWidth(150);   //wider menu looks better
    fileMenu.add( cmd('f.new') );
    fileMenu.add( cmd('f.open') );
    fileMenu.add( cmd('f.save') );
    fileMenu.addseparator();
    fileMenu.add( cmd('f.prn') );
    fileMenu.addseparator();
    fileMenu.add( cmd('f.quit') );

    // Edit menu
    editMenu = new RasterMenu();
    editMenu.setMinWidth(150);
    editMenu.add( cmd('e.copy') );
    editMenu.add( cmd('e.cut') );
    editMenu.add( cmd('e.paste') );
    editMenu.addseparator();
    editMenu.add( cmd('e.find') );

    // Format & FontSize menus
    fmtMenu = new RasterMenu();
    fsMenu = new RasterMenu();  //Create this menu after fmtMenu, so it shows "above" in the z-index space when it casacades

    fmtMenu.setMinWidth(150);
    fmtMenu.add( cmd('F.bold') );
    fmtMenu.add( cmd('F.ital') );
    fmtMenu.add( cmd('F.under') );
    fmtMenu.addseparator();
    fmtMenu.add( cmd('F.left') );
    fmtMenu.add( cmd('F.center') );
    fmtMenu.add( cmd('F.right') );
    fmtMenu.addseparator();
    fmtMenu.add( cmd('.fontSize'), fsMenu );  //fsMenu is a submenu of the fmtMenu[.fontSize] option

        fsMenu.add( cmd('s.sm') );
        fsMenu.add( cmd('s.med') );
        fsMenu.add( cmd('s.lg') );

    // Window menu
    winMenu = new RasterMenu();
    winMenu.setMinWidth(150);
    winMenu.add( cmd('w.cascade') );
    winMenu.add( cmd('w.tileh') );
    winMenu.add( cmd('w.tilev') );
    winMenu.addseparator();
    winMenu.add( cmd('w.closeAll') );

    // Help menu
    hlpMenu = new RasterMenu();
    hlpMenu.setMinWidth(150);
    hlpMenu.add( cmd('h.topics') );
    hlpMenu.add( cmd('h.upd') );
    hlpMenu.addseparator();
    hlpMenu.add( cmd('h.about') );

    //Attachment Menu
    attMenu = new RasterMenu();
    attMenu.setMinWidth(150);
    attMenu.add( cmd('a.image') );
    attMenu.add( cmd('a.media') );
    attMenu.add( cmd('a.other') );

    // Address Book menu
    abMenu = new RasterMenu();
    abMenu.setMinWidth(150);
    abMenu.add( cmd('ab.home') );
    abMenu.add( cmd('ab.work') );
    abMenu.addseparator();
    abMenu.add( cmd('ab.new') );
}


/*******************************************************************
 * Create all toolbars
 *******************************************************************/
function setupToolbars()
{
    // menu bar
    menubar = new RasterToolbar("menubar", "small");   // 'menubar' argument is the ID of a DIV in the document
    menubar.add( cmd('.file'), fileMenu ).showArrow(false);             // hide dropdown arrow
    menubar.add( cmd('.edit'), editMenu ).showArrow(false);
    menubar.add( cmd('.fmt'), fmtMenu ).showArrow(false);
    menubar.add( cmd('.win'), winMenu ).showArrow(false);
    menubar.add( cmd('.hlp'), hlpMenu ).showArrow(false);

    // toolbar 16
    toolbar16 = new RasterToolbar("toolbar16", "small");   // 'toolbar16' argument is the ID of a DIV in the document
    toolbar16.add( cmd('f.new') ).showText(false);         // hide text, show only icon
    toolbar16.add( cmd('f.open') ).showText(false);
    toolbar16.add( cmd('f.save') ).showText(false);
    toolbar16.addseparator();
    toolbar16.add( cmd('e.copy') ).showText(false);
    toolbar16.add( cmd('e.cut') ).showText(false);
    toolbar16.add( cmd('e.paste') ).showText(false);
    toolbar16.add( cmd('e.find') ).showText(false);
    toolbar16.addseparator();
    toolbar16.add( cmd('F.bold') ).showText(false);
    toolbar16.add( cmd('F.ital') ).showText(false);
    toolbar16.add( cmd('F.under') ).showText(false);
    toolbar16.addseparator();
    toolbar16.add( cmd('F.left') ).showText(false);
    toolbar16.add( cmd('F.center') ).showText(false);
    toolbar16.add( cmd('F.right') ).showText(false);
    toolbar16.add( cmd('.fontSize'), fsMenu );          // toolbar item with menu!
    toolbar16.addseparator();
    toolbar16.add( cmd('w.cascade') ).showText(false);
    toolbar16.add( cmd('w.tileh') ).showText(false);
    toolbar16.add( cmd('w.tilev') ).showText(false);
    toolbar16.addseparator();
    toolbar16.add( cmd('.hlp2'), hlpMenu ).showText(false);

    // toolbar 32 - the mail buttons
    toolbar32 = new RasterToolbar("toolbar32", "large");   // 'toolbar32' argument is the ID of a DIV in the document
    toolbar32.add( cmd('m.new') );
    toolbar32.add( cmd('m.send') );
    toolbar32.addseparator();
    toolbar32.add( cmd('m.re') );
    toolbar32.add( cmd('m.reAll') );
    toolbar32.add( cmd('m.fwd') );
    toolbar32.add( cmd('m.check') );
    toolbar32.addseparator();
    toolbar32.add( cmd('.ab'), abMenu );              // toolbar item with menu!
    toolbar32.add( cmd('.attach'), attMenu );         // toolbar item with menu!
    toolbar32.addseparator();
    toolbar32.add( cmd('m.spam') );
    toolbar32.add( cmd('m.block') );

}

