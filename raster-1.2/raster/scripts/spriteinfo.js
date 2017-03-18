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
 GLYPHS: Symbols used in raster controls.
 @private
 *****************************************************************************/
var GLYPHS = (function() {

    /** Factory function used to build instances of the IID_SPRITEINFO interface. */
    function rect(_x, _y, _w, _h) { return {x:_x, y:_y, w:_w, h:_h, IID_SPRITEINFO:true, filename:'css:_glyphs.gif' }; };

    // return sprite info constants
    return {
        DROP_DOWN:                               rect(0, 0, 7, 4),
        DROP_DOWN2:                              rect(9, 0, 7, 6),
        DROP_DOWN3:                              rect(18, 0, 4, 7),
        CHEVRON_DOWN:                            rect(24, 0, 5, 8),
        CHEVRON_RIGHT:                           rect(31, 0, 8, 5),

        ARROW_UP:                                rect(41, 0, 12, 6),
        ARROW_DOWN:                              rect(55, 0, 12, 6),
        ARROW_RIGHT:                             rect(69, 0, 6, 12),
        ARROW_LEFT:                              rect(77, 0, 6, 12),

        TREE_VERT:                               rect(85, 0, 1, 19),
        TREE_DASH:                               rect(88, 0, 9, 1),
        TREE_MINUS:                              rect(99, 0, 16, 11),
        TREE_PLUS:                               rect(117, 0, 16, 11),

        TREE_MINUS2:                             rect(135, 0, 16, 11),
        TREE_PLUS2:                              rect(153, 0, 16, 11),
        TREE_VSHIM:                              rect(171, 0, 1, 20),

        SORT_ASC:                                rect(174, 0, 11, 6),
        SORT_DESC:                               rect(187, 0, 11, 6)
    };
})(); /* end sprite generated stub */




/*****************************************************************************
 Collection of Mouse pointer sprites. These can be used in drag and drop
 operations to decorate the mouse pointer. For example:
 <pre code>
    ...

    RasterMouse.setCursor( <b>CURSORS.DRAG</b> );
    RasterMouse.startDrag( event, myDragInfo, myHandler);

 </pre>
 <h2>CURSORS Constants</h2>
 &nbsp; &nbsp; &nbsp; <img src="images/sprite-cursors.gif">

 @see  RasterMouse.setCursor()
 @static
 *****************************************************************************/
var CURSORS = (function() {
    /** Factory function used to build instances of the IID_SPRITEINFO interface. */
    function rect(_x, _y, _w, _h) { return {x:_x, y:_y, w:_w, h:_h, IID_SPRITEINFO:true, filename:'img:_cursors.gif' }; };
    // return sprite info constants
    return {
        ADD:                                     rect(0, 0, 11, 11),
        DRAG:                                    rect(13, 0, 13, 9),
        LINK:                                    rect(28, 0, 16, 7),
        CONNECTING:                              rect(46, 0, 12, 12),
        CANCEL:                                  rect(60, 0, 14, 14),
        LOCKED:                                  rect(76, 0, 8, 10),
        MOVE:                                    rect(86, 0, 10, 13),
        COPY:                                    rect(98, 0, 14, 12),
        DELETE:                                  rect(114, 0, 12, 12),
        MOVE_V:                                  rect(128, 0, 9, 15),
        MOVE_H:                                  rect(139, 0, 15, 9)
    };
})(); /* end sprite generated stub */



/*****************************************************************************
 ICONS16 is a static object containing a collection of sprite constants. Each
 sprite constant represents a 16x16 icon. These sprites can be used anywhere
 the IID_SPRITEINFO type is accepted, for example:
 <pre code>
    var mytree = new Tree( "id", <b>ICONS16.COMPUTER</b>, "My Computer");

    mytree.add( <b>ICONS16.BOOK_OPEN</b>, "Help Topics";
    mytree.add( <b>ICONS16.CALENDAR</b>, "Add Event");

    ...
 </pre>
 <h2>LICENSE</h2>
 The ICONS16 sprite is based in a subset of the <b>Silk Web Icon Set v1.3</b>
 by <b>Mark James</b>. These icons are available under the
 <a href="http://creativecommons.org/licenses/by/2.5/" target="_blank">Creative Commons Attribution License 2.5</a>
 which lets you distribute, remix, tweak, and build upon these icons,
 even commercially, provided that you credit Mark James within a readme
 file or equivalent documentation for the software which uses the icons.
 For more information in the <b>Silk Web Icon Set</b> visit
 <a href="http://www.famfamfam.com/lab/icons/silk/" target="_blank">www.famfamfam.com</a>.

 <h2>ICONS16 Constants</h2>
 <p align="center">
   <img src="images/sprite-icons16.png" style="border:1px solid #888">
 </p>
 @static
 *****************************************************************************/
var ICONS16 = (function() {
    var f = 'img:_icons16.' + (Raster.isIE6 ? 'gif' : 'png'); //IE6 slows down to a crawl using png  
    /** Factory function used to build instances of the IID_SPRITEINFO interface. */
    function rect(_x, _y, _w, _h) { return {x:_x, y:_y, w:16, h:16, IID_SPRITEINFO:true, filename: f }; };

    // return sprite info constants
    return {
        ACCEPT:                                   rect(0, 0),
        ADD:                                      rect(18, 0),
        APPLICATION:                              rect(36, 0),
        APPLICATION_ADD:                          rect(54, 0),
        APPLICATION_CASCADE:                      rect(72, 0),
        APPLICATION_EDIT:                         rect(90, 0),
        APPLICATION_ERROR:                        rect(108, 0),
        APPLICATION_FORM:                         rect(126, 0),
        APPLICATION_FORM_ADD:                     rect(144, 0),
        APPLICATION_FORM_EDIT:                    rect(162, 0),
        APPLICATION_GET:                          rect(180, 0),
        APPLICATION_KEY:                          rect(198, 0),
        APPLICATION_LIGHTNING:                    rect(216, 0),
        APPLICATION_LINK:                         rect(234, 0),
        APPLICATION_OSX:                          rect(252, 0),
        APPLICATION_OSX_TERMINAL:                 rect(270, 0),
        APPLICATION_PUT:                          rect(0, 18),
        APPLICATION_SIDE_BOXES:                   rect(18, 18),
        APPLICATION_SIDE_CONTRACT:                rect(36, 18),
        APPLICATION_SIDE_EXPAND:                  rect(54, 18),
        APPLICATION_SIDE_LIST:                    rect(72, 18),
        APPLICATION_SIDE_TREE:                    rect(90, 18),
        APPLICATION_SPLIT:                        rect(108, 18),
        APPLICATION_TILE_HORIZONTAL:              rect(126, 18),
        APPLICATION_TILE_VERTICAL:                rect(144, 18),
        APPLICATION_VIEW_COLUMNS:                 rect(162, 18),
        APPLICATION_VIEW_ICONS:                   rect(180, 18),
        APPLICATION_VIEW_LIST:                    rect(198, 18),
        APPLICATION_VIEW_TILE:                    rect(216, 18),
        APPLICATION_XP:                           rect(234, 18),
        APPLICATION_XP_TERMINAL:                  rect(252, 18),
        ARROW_REFRESH_SMALL:                      rect(270, 18),
        ARROW_ROTATE_CLOCKWISE:                   rect(0, 36),
        ARROW_SWITCH:                             rect(18, 36),
        ASTERISK_YELLOW:                          rect(36, 36),
        ATTACH:                                   rect(54, 36),
        BASKET:                                   rect(72, 36),
        BASKET_ADD:                               rect(90, 36),
        BASKET_EDIT:                              rect(108, 36),
        BELL:                                     rect(126, 36),
        BELL_ADD:                                 rect(144, 36),
        BOOK:                                     rect(162, 36),
        BOOK_ADD:                                 rect(180, 36),
        BOOK_ADDRESSES:                           rect(198, 36),
        BOOK_EDIT:                                rect(216, 36),
        BOOK_OPEN:                                rect(234, 36),
        BRICK:                                    rect(252, 36),
        BRICKS:                                   rect(270, 36),
        BUG:                                      rect(0, 54),
        BULLET_ARROW_DOWN:                        rect(18, 54),
        BULLET_ARROW_UP:                          rect(36, 54),
        BULLET_DISK:                              rect(54, 54),
        BULLET_ERROR:                             rect(72, 54),
        BULLET_FEED:                              rect(90, 54),
        BULLET_GO:                                rect(108, 54),
        BULLET_PICTURE:                           rect(126, 54),
        BULLET_STAR:                              rect(144, 54),
        CALCULATOR:                               rect(162, 54),
        CALCULATOR_ADD:                           rect(180, 54),
        CALCULATOR_EDIT:                          rect(198, 54),
        CALENDAR:                                 rect(216, 54),
        CALENDAR_VIEW_DAY:                        rect(234, 54),
        CALENDAR_VIEW_MONTH:                      rect(252, 54),
        CAMERA:                                   rect(270, 54),
        CANCEL:                                   rect(0, 72),
        CAR:                                      rect(18, 72),
        CART:                                     rect(36, 72),
        CD:                                       rect(54, 72),
        CHART_BAR:                                rect(72, 72),
        CHART_BAR_ADD:                            rect(90, 72),
        CHART_BAR_EDIT:                           rect(108, 72),
        CHART_ORGANISATION:                       rect(126, 72),
        CLOCK:                                    rect(144, 72),
        CLOCK_ADD:                                rect(162, 72),
        COG:                                      rect(180, 72),
        COG_ADD:                                  rect(198, 72),
        COG_EDIT:                                 rect(216, 72),
        COLOR_SWATCH:                             rect(234, 72),
        COLOR_WHEEL:                              rect(252, 72),
        COMMENT:                                  rect(270, 72),
        COMMENT_ADD:                              rect(0, 90),
        COMMENT_EDIT:                             rect(18, 90),
        COMMENTS:                                 rect(36, 90),
        COMPUTER:                                 rect(54, 90),
        CONNECT:                                  rect(72, 90),
        CONTROL_EJECT:                            rect(90, 90),
        CONTROL_END:                              rect(108, 90),
        CONTROL_EQUALIZER:                        rect(126, 90),
        CONTROL_FASTFORWARD:                      rect(144, 90),
        CONTROL_PAUSE:                            rect(162, 90),
        CONTROL_PLAY:                             rect(180, 90),
        CONTROL_REPEAT:                           rect(198, 90),
        CONTROL_REWIND:                           rect(216, 90),
        CONTROL_START:                            rect(234, 90),
        CONTROL_STOP:                             rect(252, 90),
        CROSS:                                    rect(270, 90),
        CUP:                                      rect(0, 108),
        CURSOR:                                   rect(18, 108),
        CUT:                                      rect(36, 108),
        DATABASE:                                 rect(54, 108),
        DATABASE_ADD:                             rect(72, 108),
        DATABASE_EDIT:                            rect(90, 108),
        DATABASE_TABLE:                           rect(108, 108),
        DATE:                                     rect(126, 108),
        DELETE:                                   rect(144, 108),
        DISCONNECT:                               rect(162, 108),
        DISK:                                     rect(180, 108),
        DISK_MULTIPLE:                            rect(198, 108),
        DRIVE:                                    rect(216, 108),
        DRIVE_CD:                                 rect(234, 108),
        DVD:                                      rect(252, 108),
        EMAIL:                                    rect(270, 108),
        EMAIL_ATTACH:                             rect(0, 126),
        EMAIL_EDIT:                               rect(18, 126),
        EMAIL_OPEN:                               rect(36, 126),
        EMOTICON_EVILGRIN:                        rect(54, 126),
        EMOTICON_GRIN:                            rect(72, 126),
        EMOTICON_HAPPY:                           rect(90, 126),
        EMOTICON_SMILE:                           rect(108, 126),
        EMOTICON_SURPRISED:                       rect(126, 126),
        EMOTICON_TONGUE:                          rect(144, 126),
        EMOTICON_UNHAPPY:                         rect(162, 126),
        EMOTICON_WINK:                            rect(180, 126),
        ERROR:                                    rect(198, 126),
        EXCLAMATION:                              rect(216, 126),
        EYE:                                      rect(234, 126),
        FEED:                                     rect(252, 126),
        FILM:                                     rect(270, 126),
        FIND:                                     rect(0, 144),
        FLAG_GREEN:                               rect(18, 144),
        FLAG_RED:                                 rect(36, 144),
        FLAG_YELLOW:                              rect(54, 144),
        FOLDER:                                   rect(72, 144),
        FOLDER_ADD:                               rect(90, 144),
        FOLDER_PAGE:                              rect(108, 144),
        FONT:                                     rect(126, 144),
        FONT_ADD:                                 rect(144, 144),
        GROUP:                                    rect(162, 144),
        GROUP_ADD:                                rect(180, 144),
        HEART:                                    rect(198, 144),
        HELP:                                     rect(216, 144),
        HOURGLASS:                                rect(234, 144),
        HOUSE:                                    rect(252, 144),
        IMAGE:                                    rect(270, 144),
        IMAGE_ADD:                                rect(0, 162),
        IMAGES:                                   rect(18, 162),
        INFORMATION:                              rect(36, 162),
        KEY:                                      rect(54, 162),
        KEY_ADD:                                  rect(72, 162),
        KEYBOARD:                                 rect(90, 162),
        LAYERS:                                   rect(108, 162),
        LAYOUT:                                   rect(126, 162),
        LAYOUT_ADD:                               rect(144, 162),
        LIGHTBULB:                                rect(162, 162),
        LIGHTBULB_OFF:                            rect(180, 162),
        LIGHTNING:                                rect(198, 162),
        LIGHTNING_ADD:                            rect(216, 162),
        LINK:                                     rect(234, 162),
        LINK_BREAK:                               rect(252, 162),
        LOCK:                                     rect(270, 162),
        LOCK_OPEN:                                rect(0, 180),
        LORRY:                                    rect(18, 180),
        MAGIFIER_ZOOM_OUT:                        rect(36, 180),
        MAGNIFIER:                                rect(54, 180),
        MAGNIFIER_ZOOM_IN:                        rect(72, 180),
        MAP:                                      rect(90, 180),
        MAP_ADD:                                  rect(108, 180),
        MONEY:                                    rect(126, 180),
        MONEY_DOLLAR:                             rect(144, 180),
        MONITOR:                                  rect(162, 180),
        MONITOR_ADD:                              rect(180, 180),
        MOUSE:                                    rect(198, 180),
        MUSIC:                                    rect(216, 180),
        NEW:                                      rect(234, 180),
        NEWSPAPER:                                rect(252, 180),
        NOTE:                                     rect(270, 180),
        NOTE_ADD:                                 rect(0, 198),
        OVERLAYS:                                 rect(18, 198),
        PACKAGE:                                  rect(36, 198),
        PAGE:                                     rect(54, 198),
        PAGE_ADD:                                 rect(72, 198),
        PAGE_ATTACH:                              rect(90, 198),
        PAGE_COPY:                                rect(108, 198),
        PAGE_EDIT:                                rect(126, 198),
        PAGE_EXCEL:                               rect(144, 198),
        PAGE_PASTE:                               rect(162, 198),
        PAGE_RED:                                 rect(180, 198),
        PAGE_WHITE:                               rect(198, 198),
        PAGE_WHITE_ACROBAT:                       rect(216, 198),
        PAGE_WHITE_OFFICE:                        rect(234, 198),
        PAGE_WHITE_PAINTBRUSH:                    rect(252, 198),
        PAGE_WHITE_PASTE:                         rect(270, 198),
        PAGE_WHITE_PICTURE:                       rect(0, 216),
        PAGE_WHITE_POWERPOINT:                    rect(18, 216),
        PAGE_WHITE_PUT:                           rect(36, 216),
        PAGE_WHITE_STACK:                         rect(54, 216),
        PAGE_WHITE_TEXT:                          rect(72, 216),
        PAGE_WHITE_WORD:                          rect(90, 216),
        PAGE_WHITE_WORLD:                         rect(108, 216),
        PAGE_WHITE_WRENCH:                        rect(126, 216),
        PAGE_WHITE_ZIP:                           rect(144, 216),
        PAGE_WORD:                                rect(162, 216),
        PAGE_WORLD:                               rect(180, 216),
        PAINTBRUSH:                               rect(198, 216),
        PAINTCAN:                                 rect(216, 216),
        PALETTE:                                  rect(234, 216),
        PASTE_PLAIN:                              rect(252, 216),
        PENCIL:                                   rect(270, 216),
        PHONE:                                    rect(0, 234),
        PHONE_SOUND:                              rect(18, 234),
        PHOTOS:                                   rect(36, 234),
        PICTURE:                                  rect(54, 234),
        PICTURE_EMPTY:                            rect(72, 234),
        PICTURES:                                 rect(90, 234),
        PLUGIN:                                   rect(108, 234),
        PLUGIN_DISABLED:                          rect(126, 234),
        PRINTER:                                  rect(144, 234),
        PRINTER_ADD:                              rect(162, 234),
        REPORT:                                   rect(180, 234),
        RESULTSET_FIRST:                          rect(198, 234),
        RESULTSET_LAST:                           rect(216, 234),
        RESULTSET_NEXT:                           rect(234, 234),
        RESULTSET_PREVIOUS:                       rect(252, 234),
        SCRIPT:                                   rect(270, 234),
        SCRIPT_ADD:                               rect(0, 252),
        SCRIPT_EDIT:                              rect(18, 252),
        SERVER:                                   rect(36, 252),
        SERVER_ADD:                               rect(54, 252),
        SERVER_EDIT:                              rect(72, 252),
        SERVER_ERROR:                             rect(90, 252),
        SERVER_KEY:                               rect(108, 252),
        SHADING:                                  rect(126, 252),
        SHAPE_ALIGN_BOTTOM:                       rect(144, 252),
        SHAPE_ALIGN_CENTER:                       rect(162, 252),
        SHAPE_ALIGN_LEFT:                         rect(180, 252),
        SHAPE_ALIGN_MIDDLE:                       rect(198, 252),
        SHAPE_ALIGN_RIGHT:                        rect(216, 252),
        SHAPE_ALIGN_TOP:                          rect(234, 252),
        SHAPE_FLIP_HORIZONTAL:                    rect(252, 252),
        SHAPE_FLIP_VERTICAL:                      rect(270, 252),
        SHAPE_GROUP:                              rect(0, 270),
        SHAPE_HANDLES:                            rect(18, 270),
        SHAPE_MOVE_BACK:                          rect(36, 270),
        SHAPE_MOVE_BACKWARDS:                     rect(54, 270),
        SHAPE_MOVE_FORWARDS:                      rect(72, 270),
        SHAPE_MOVE_FRONT:                         rect(90, 270),
        SHAPE_ROTATE_ANTICLOCKWISE:               rect(108, 270),
        SHAPE_ROTATE_CLOCKWISE:                   rect(126, 270),
        SHAPE_SQUARE:                             rect(144, 270),
        SHAPE_SQUARE_EDIT:                        rect(162, 270),
        SHAPE_UNGROUP:                            rect(180, 270),
        SHIELD:                                   rect(198, 270),
        SOUND:                                    rect(216, 270),
        SOUND_LOW:                                rect(234, 270),
        SOUND_MUTE:                               rect(252, 270),
        SOUND_NONE:                               rect(270, 270),
        SPELLCHECK:                               rect(0, 288),
        STAR:                                     rect(18, 288),
        STOP:                                     rect(36, 288),
        STYLE:                                    rect(54, 288),
        SUM:                                      rect(72, 288),
        TABLE:                                    rect(90, 288),
        TABLE_ADD:                                rect(108, 288),
        TABLE_EDIT:                               rect(126, 288),
        TABLE_MULTIPLE:                           rect(144, 288),
        TAG:                                      rect(162, 288),
        TAG_BLUE:                                 rect(180, 288),
        TAG_GREEN:                                rect(198, 288),
        TAG_ORANGE:                               rect(216, 288),
        TAG_RED:                                  rect(234, 288),
        TELEPHONE:                                rect(252, 288),
        TELEVISION:                               rect(270, 288),
        TEXT_ALIGN_CENTER:                        rect(0, 306),
        TEXT_ALIGN_JUSTIFY:                       rect(18, 306),
        TEXT_ALIGN_LEFT:                          rect(36, 306),
        TEXT_ALIGN_RIGHT:                         rect(54, 306),
        TEXT_ALLCAPS:                             rect(72, 306),
        TEXT_BOLD:                                rect(90, 306),
        TEXT_COLUMNS:                             rect(108, 306),
        TEXT_DROPCAPS:                            rect(126, 306),
        TEXT_HORIZONTALRULE:                      rect(144, 306),
        TEXT_INDENT:                              rect(162, 306),
        TEXT_INDENT_REMOVE:                       rect(180, 306),
        TEXT_ITALIC:                              rect(198, 306),
        TEXT_LETTER_OMEGA:                        rect(216, 306),
        TEXT_LETTERSPACING:                       rect(234, 306),
        TEXT_LINESPACING:                         rect(252, 306),
        TEXT_LIST_BULLETS:                        rect(270, 306),
        TEXT_LIST_NUMBERS:                        rect(0, 324),
        TEXT_SMALLCAPS:                           rect(18, 324),
        TEXT_STRIKETHROUGH:                       rect(36, 324),
        TEXT_SUBSCRIPT:                           rect(54, 324),
        TEXT_SUPERSCRIPT:                         rect(72, 324),
        TEXT_UNDERLINE:                           rect(90, 324),
        TEXTFIELD_KEY:                            rect(108, 324),
        TICK:                                     rect(126, 324),
        TIME:                                     rect(144, 324),
        TIME_ADD:                                 rect(162, 324),
        USER:                                     rect(180, 324),
        USER_ADD:                                 rect(198, 324),
        USER_EDIT:                                rect(216, 324),
        USER_GREEN:                               rect(234, 324),
        USER_RED:                                 rect(252, 324),
        USER_SUIT:                                rect(270, 324),
        VCARD:                                    rect(0, 342),
        VCARD_ADD:                                rect(18, 342),
        WAND:                                     rect(36, 342),
        WORLD:                                    rect(54, 342),
        WORLD_ADD:                                rect(72, 342),
        WORLD_EDIT:                               rect(90, 342),
        WORLD_LINK:                               rect(108, 342),
        WRENCH:                                   rect(126, 342),
        ZOOM:                                     rect(144, 342)
    };
})(); /* end sprite generated stub */


/*****************************************************************************
 ICONS32 is a static object containing a collection of sprite constants. Each
 sprite constant represents a 32x32 icon. These sprites can be used anywhere
 the IID_SPRITEINFO type is accepted, for example:
 <pre code>
    var list = new RasterList( "listDiv", "grid" );

    list.add( null, ICONS32.GRAPHICS, null, "Customize" );
    list.add( null, ICONS32.ADDRESS_BOOK, null, "Addresses" );
    list.add( null, ICONS32.AUDIO_VOL_HIGH, null, "Sounds" );
    list.add( null, ICONS32.ACCESSORIES, null, "Accessories" );
    ...
 </pre>
 <h2>LICENSE</h2>
 The ICONS32 sprite is based in a subset of the <b>Tango Base Icon Library v0.8.90</b>
 by the <b>Tango Desktop Project</b>
 (<a href="http://tango.freedesktop.org" target="_blank">http://tango.freedesktop.org</a>).
 The Tango Base Icon Library is released to the Public Domain. The authors
 ask that you please attribute the Tango Desktop Project in the
 credits or documentation for the software that use these icons.

 <h2>ICONS32 Constants</h2>
 <p align="center">
   <img src="images/sprite-icons32.png" style="border:1px solid #888">
 </p>
 @static
 *****************************************************************************/
var ICONS32 = (function() {
    // Factory function used to build instances of the IID_SPRITEINFO interface. */
    function rect(_x, _y, _w, _h) { return {x:_x, y:_y, w:32, h:32, IID_SPRITEINFO:true, filename:'img:_icons32.png' }; };

    // return sprite info constants
    return {
    ACCESSORIES:                              rect(0, 0),
    ADDRESS_BOOK:                             rect(34, 0),
    AUDIO:                                    rect(68, 0),
    AUDIO_MUTED:                              rect(102, 0),
    AUDIO_VOL_HIGH:                           rect(136, 0),
    AUDIO_VOL_LOW:                            rect(170, 0),
    BATTERY:                                  rect(204, 0),
    BATTERY_CAUTION:                          rect(238, 0),
    CALENDAR:                                 rect(0, 34),
    CAMERA_PHOTO:                             rect(34, 34),
    CD:                                       rect(68, 34),
    CD_ROM:                                   rect(102, 34),
    CHAT:                                     rect(136, 34),
    COMPUTER:                                 rect(170, 34),
    DIALOG_ERROR:                             rect(204, 34),
    DIALOG_FAVORITE:                          rect(238, 34),
    DIALOG_IMPORTANT:                         rect(0, 68),
    DIALOG_READONLY:                          rect(34, 68),
    DIALOG_SYSTEM:                            rect(68, 68),
    DIALOG_TIP:                               rect(102, 68),
    DIALOG_UNREADABLE:                        rect(136, 68),
    DIALOG_WARNING:                           rect(170, 68),
    DISPLAY:                                  rect(204, 68),
    DOCUMENT:                                 rect(238, 68),
    EDIT_COPY:                                rect(0, 102),
    EDIT_CUT:                                 rect(34, 102),
    EDIT_FIND:                                rect(68, 102),
    EDIT_PASTE:                               rect(102, 102),
    EDIT_REDO:                                rect(136, 102),
    EDIT_UNDO:                                rect(170, 102),
    FLOPPY:                                   rect(204, 102),
    FOLDER:                                   rect(238, 102),
    GLOBE:                                    rect(0, 136),
    GO_DOWN:                                  rect(34, 136),
    GO_HOME:                                  rect(68, 136),
    GO_NEXT:                                  rect(102, 136),
    GO_PREVIOUS:                              rect(136, 136),
    GO_UP:                                    rect(170, 136),
    GRAPHICS:                                 rect(204, 136),
    HARDDISK:                                 rect(238, 136),
    HELP:                                     rect(0, 170),
    HTML:                                     rect(34, 170),
    IMAGE:                                    rect(68, 170),
    INTERNET:                                 rect(102, 170),
    MAIL:                                     rect(136, 170),
    MAIL_ATTACHMENT:                          rect(170, 170),
    MAIL_FORWARD:                             rect(204, 170),
    MAIL_JUNK:                                rect(238, 170),
    MAIL_NEW:                                 rect(0, 204),
    MAIL_REPLY:                               rect(34, 204),
    MAIL_REPLY_ALL:                           rect(68, 204),
    MOUSE:                                    rect(102, 204),
    NETWORK:                                  rect(136, 204),
    NETWORK_OFFLINE:                          rect(170, 204),
    OFFICE:                                   rect(204, 204),
    PACKAGE:                                  rect(238, 204),
    PRESENTATION:                             rect(0, 238),
    PRINTER:                                  rect(34, 238),
    PROPERTIES:                               rect(68, 238),
    REFRESH:                                  rect(102, 238),
    SEARCH:                                   rect(136, 238),
    SPREADSHEET:                              rect(170, 238),
    STOP:                                     rect(204, 238),
    SYSTEM:                                   rect(238, 238),
    TERMINAL:                                 rect(0, 272),
    TEXT:                                     rect(34, 272),
    TOOLS:                                    rect(68, 272),
    TRASH:                                    rect(102, 272),
    USERS:                                    rect(136, 272),
    VIDEO:                                    rect(170, 272),
    WEATHER:                                  rect(204, 272),
    WINDOWS:                                  rect(238, 272)
    };
})(); /* end sprite generated stub */



/*****************************************************************************
  CSS Sprite information (auto-generated stub)
 ****************************************************************************
        TOOLBK:                                  rect(0, 0, 344, 83),

        MENU1:                                   rect(0, 85, 344, 24),
        MENU2:                                   rect(0, 111, 344, 24),
        MENU3:                                   rect(0, 137, 344, 24),
        MENU4:                                   rect(0, 163, 344, 24),

        TOOL1:                                   rect(0, 189, 344, 40),
        TOOL2:                                   rect(0, 231, 344, 40),
        TOOL3:                                   rect(0, 273, 344, 40),
        TOOL4:                                   rect(0, 315, 344, 40),

        TAB1:                                    rect(0, 357, 344, 67),
        TAB2:                                    rect(0, 426, 344, 67),
        TAB3:                                    rect(0, 495, 344, 67),

        ICON_ON:                                 rect(0, 564, 23, 22),

        TABBK:                                   rect(0, 588, 344, 66),

        TREEITEM:                                rect(0, 656, 344, 20),

        XTOOL1:                                  rect(0, 678, 344, 54),
        XTOOL2:                                  rect(0, 734, 344, 54),
        XTOOL3:                                  rect(0, 790, 344, 54),
        XTOOL4:                                  rect(0, 846, 344, 54)

       LIST_SEL:                                rect(0, 968, 344, 31)
 
 ------

        TITLEBAR_MIN:                            this.rect(0, 0, 16, 15),
        TITLEBAR_WIN:                            this.rect(18, 0, 16, 15),
        TITLEBAR_MAX:                            this.rect(36, 0, 16, 15),
        TITLEBAR_CLOSE:                          this.rect(54, 0, 16, 15),

        TITLEBAR_MIN1:                           this.rect(72, 0, 16, 15),
        TITLEBAR_WIN1:                           this.rect(90, 0, 16, 15),
        TITLEBAR_MAX1:                           this.rect(108, 0, 16, 15),
        TITLEBAR_CLOSE1:                         this.rect(126, 0, 16, 15),

        TITLEBAR_MIN2:                           this.rect(144, 0, 16, 15),
        TITLEBAR_WIN2:                           this.rect(162, 0, 16, 15),
        TITLEBAR_MAX2:                           this.rect(180, 0, 16, 15),
        TITLEBAR_CLOSE2:                         this.rect(198, 0, 16, 15),



        LIST_SEL1:                               rect(0, 0, 73, 196),
        LIST_SEL2:                               rect(75, 0, 258, 196)

        HEADER_BK:                               rect(0, 902, 344, 31),
        HEADER_BK2:                              rect(0, 935, 344, 31)

*/






















