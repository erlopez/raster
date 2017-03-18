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

/*******************************************************************
 * Static object containing utility properties and functions used
 * to work with the mouse. These utilities support the Raster 
 * controls in implementing drag and drop operations.
 * @static
 *******************************************************************/
var RasterMouse = {

    /*******************************************************************
     Configures mouse singleton. This is called automatically before
     a mouse resource is used.
     @private
     *******************************************************************/
    setup:  function()
    {
        if ( RasterMouse.allSet )
           return;

        // Create drop boxBorder and insertLine
        RasterMouse.dropBorder = new RasterBorderBox( document.body );
        RasterMouse.insertionLine = new RasterInsertLine( document.body );
        RasterMouse.shadeBox = new RasterShadeBox( document.body );

        // Create cursor box, requires Sprite
        RasterMouse.cursorSprite = new RasterSprite("", 16, 16, false);
        RasterMouse.cursorSprite.setParent( document.body  );
        RasterMouse.cursorSprite.setClass( "rasterCursorSprite" );
        RasterMouse.cursorSprite.setDisplay( false );

        // Install additional mouse handlers
        Raster.addListener( document, "mouseup", RasterMouse.mouseup );
        Raster.addListener( window, "blur", RasterMouse.cancelDrag );
        if ( Raster.isIE )
            Raster.addListener( window, "losecapture", RasterMouse.cancelDrag );

        RasterMouse.allSet = true;
    },


    /*******************************************************************
     Starts a drag operation. This method must be called
     within mousedown <code>event</code> handler.

     This method starts either a drag or mousemove operation. If a mousemove
     type of operation is desired, a custom <code>mouseListener</code> must
     be specified. The <code>mouseListener</code> will have the
     following signature:
     <pre code>
         function myMouseMoveListener( rasterMouseEvent )
         {
             // ...
         }
     </pre>
     Once the mousemove operation starts, the <code>mouseListener</code>
     function is called each time the mouse moves until the user release
     the mouse button, or RasterMouse.cancelDrag() is invoked.
     The argument sent to the <code>mouseListener</code> function is of
     type #RasterMouseEvent.

     If a <code>mouseListener</code> is not specified, a drag operation
     is started. As the mouse moves over the #RasterControl objects, their
     respective drop handlers (if any) are fired. Note the
     RasterControl.setDropHandler() method is used to specify a drop handler
     function for any user-defined custom control.

     At any time during a mouse move or drag operation, the RasterMouse.cancelDrag()
     can be invoked to stop the operation. Note that RasterMouse.cancelDrag()
     is automatically invoked if the end-user press the ESC key.

     The <code>disableIECapture</code> is a IE-only feature. This argument is
     defaulted to false, unless explicitly changed. Mouse "capture"
     enables IE to keep firing all <code>mousemove</code> and <code>mouseup</code>
     events even if the mouse goes outside the browser window. This is the default
     mode used by <code>startDrag</code>. However, there are instances where
     "capture" is not desired. In mouse capture mode, the mouse pointer is
     fixed at the time the mouse capture operation starts, preventing IE from
     updating the mouse pointer when moving over elements using CSS
     <code>cursor</code> styles. If CSS cursor "hover styles" are important,
     set <code>disableIECapture</code> to true. Note that in non-capture
     mode, drag and mouse move operations are cancelled if the mouse leaves
     the browser window. This prevents drag and mouse move operation from
     "sticking" in cases where the user leaves the window, release the mouse button,
     and enters back.


     @param event        object: Event object received in the mousedown or click event.
     @param value        [any]: Value being dragged. This property is used to store the
                         value you wish to pass along to other controls in a drag and drop
                         operation: anything from a simple int or string to a complex object.
                         Set to null if not needed.
     @param data         [object]: Free-format data structure used to store meta data
                         needed during a mousemove operation. For example, if
                         you are dragging a circle inside a rectangle, you can
                         pre-compute the min/max values the circle is allow to move
                         without going outside the rectangle and save them in the
                         <code>data</code> property. Then, all that your mousemove
                         event has to do is validate against the values stored
                         in the #RasterMouseEvent.data property, rather than recomputing
                         these values in each event occurence. This object persists for
                         the duration of the drag operation. Set to null if not needed.
     @param mouseListener [function]: User-defined handler to be notified
                          of mouse move events. Set to null if not needed.
     @param disableIECapture [boolean]: set to true to disable IE mouse
                             capture. In IE, when the mouse is not captured
                             the mouse stop responding once it goes out of
                             the browser window.

     @return object: The #RasterMouseEvent resulting from starting a drag operation.
             This is the same object that will be passed along to other drop and mouse listeners.
             You may use this object to initialize the #RasterMouseEvent.context if desired.
     @see RasterControl.setDropHandler(), RasterMouse.cancelDrag(), RasterMouseEvent
     *******************************************************************/
    startDrag: function( event, value, data, mouseListener,  disableIECapture )
    {
        RasterMouse.setup();

        RasterMouse.timer = null;
        RasterMouse.event = RasterEvent.mkMouseEvent( event, "", value, data );
        RasterMouse.mouseListener = mouseListener;
        RasterMouse.startCursor = RasterMouse.currentCursor;

        Raster.stopEvent( event );
        Raster.addListener( document, "mousemove", RasterMouse.mousemove );

        if ( Raster.isIE )
        {
            if ( disableIECapture!==true )
                 document.body.setCapture();
            else
                Raster.addListener( document.body, "mouseleave", RasterMouse.cancelDrag );
        }/*if*/

        return RasterMouse.event;
    },


    /*******************************************************************
     Ends the current drag operation (if any). Also called when the
     browser loses mouse capture, ie. the browser window loses focus
     for any reason (including alerts or pop-up windows) or user press
     the ESC key, or this method is invoked directly.
     @see RasterControl.setDropHandler(), RasterMouse.startDrag()
     *******************************************************************/
    cancelDrag:  function()
    {
        if ( Raster.isIE )
        {
            document.body.releaseCapture();
            Raster.removeListener( document.body, "mouseleave", RasterMouse.cancelDrag );
        }/*if*/

        if ( RasterMouse.event )
        {
            var evt = RasterMouse.event;
            evt.type = "cancel";

            // Invoke RasterMouse.currentControl user-defined dropHandler expando (if defined)
            if ( RasterMouse.currentControl!=null && RasterMouse.currentControl.dropHandler!=null )
            {
                evt.control = RasterMouse.currentControl;
                RasterMouse.currentControl.dropHandler( evt );//"cancel", RasterMouse.currentControl, event );
            }/*if*/


            // Invoke RasterMouse.mouseListener user-defined function (if defined)
            if ( RasterMouse.mouseListener!=null )
            {
                evt.control = null;
                RasterMouse.mouseListener( evt ); //"cancel"

                evt.type = "end";
                RasterMouse.mouseListener( evt );

            }/*if*/

        }/*if*/


        Raster.removeListener( document, "mousemove", RasterMouse.mousemove );

        if ( RasterMouse.timer!=null )
            clearInterval( RasterMouse.timer );

        RasterMouse.timer = null;
        RasterMouse.event = null;
        RasterMouse.currentElement = null;
        RasterMouse.currentControl = null;
        RasterMouse.mouseListener = null;
        RasterMouse.startCursor = null;

        RasterMouse.setCursor( null );
        RasterMouse.dropBorder.hide();
        RasterMouse.insertionLine.hide();
        RasterMouse.shadeBox.hide();

        //out( "Drag terminated.");
    },


    /*******************************************************************
     Mouse move listener
     @private
     *******************************************************************/
    mousemove:  function( event )
    {
        var evt = RasterMouse.event;
        var mouse = Raster.getInputState( event );
        evt.event = event;
        evt.x = mouse.x;
        evt.y = mouse.y;
        evt.ctrl = mouse.ctrl;
        evt.alt = mouse.alt;
        evt.shift = mouse.shift;
        evt.button = mouse.button;

        // Adjust mouse cursor (if any)
        if ( RasterMouse.currentCursor!= null )
            RasterMouse.cursorSprite.moveTo( mouse.x + 12, mouse.y + 17); //position image in the lower-right corner of the mouse


        // Yield to user-defined mouse move listener (if any)
        if ( RasterMouse.mouseListener )
        {
            evt.type = "move";
            RasterMouse.mouseListener( evt );
            return;
        }/*if*/


        // Each time we roll over a new element, check it it has a dropHandler defined
        // boxes controls such as BorderBox, ShadeBox, and InsertionLine do not count as new element
        var el = Raster.srcElement( event );

        // find the newarest parent element belonging to a Control
        // having a defined dropHandler
        var rasterControl = Raster.findParentExpando( el, "rasterControl");
        var isIgnoredControl = rasterControl!=null && ( rasterControl.IID_BORDERBOX===true ||
                               rasterControl.IID_SHADEBOX===true || rasterControl.IID_INSERTIONLINE===true );

        if ( !isIgnoredControl )
            while ( rasterControl!=null && rasterControl.dropHandler==null )
                rasterControl = Raster.findParentExpando( rasterControl.controlBox.parentNode, "rasterControl");


        var mouseLeft = RasterMouse.currentElement!=el && !isIgnoredControl;

        if ( mouseLeft )
        {
            // Notify previous control the mouse has left (if any)
            if ( RasterMouse.currentControl!=null && RasterMouse.currentControl.dropHandler!=null )
            {
                evt.type = "out";
                evt.control = RasterMouse.currentControl;
                RasterMouse.currentControl.dropHandler( evt ) ;//"out", RasterMouse.currentControl, event );
            }/*if*/

           // out ("rasterControl is IID_BORDERBOX : " + rasterControl.IID_BORDERBOX);
            RasterMouse.currentElement = el;
            RasterMouse.currentControl = rasterControl;
            RasterMouse.dropBorder.hide();
            RasterMouse.insertionLine.hide();
            RasterMouse.shadeBox.hide();

            if ( RasterMouse.currentCursor != RasterMouse.startCursor) //restore initial cursor
                RasterMouse.setCursor( RasterMouse.startCursor );
            
        }/*if*/

        // Call dropHandler() in current control (if any)
        if ( RasterMouse.currentControl!=null && RasterMouse.currentControl.dropHandler!=null )
        {
            evt.type = mouseLeft ? "enter" : "over";
            evt.control = RasterMouse.currentControl;
            RasterMouse.currentControl.dropHandler( evt ); //, RasterMouse.currentControl, event );
        }
    },

    
    /*******************************************************************
     Mouse move listener - ends drag
     @private
     *******************************************************************/
    mouseup:  function( event )
    {
        // If we are not dragging anything, leave
        if ( !RasterMouse.event  )
            return;

        var evt = RasterMouse.event;
        var mouse = Raster.getInputState( event );
        evt.event = event;
        evt.x = mouse.x;
        evt.y = mouse.y;
        evt.ctrl = mouse.ctrl;
        evt.alt = mouse.alt;
        evt.shift = mouse.shift;
        evt.button = mouse.button;

        // Invoke RasterMouse.currentControl user-defined dropHandler expando (if defined)
        if ( RasterMouse.currentControl!=null && RasterMouse.currentControl.dropHandler!=null )
        {
            evt.type = "drop";
            evt.control = RasterMouse.currentControl;
            RasterMouse.currentControl.dropHandler( evt ); //"drop", RasterMouse.currentControl, event );
        }/*if*/

        // Invoke RasterMouse.mouseListener user-defined expando (if defined)
        if ( RasterMouse.mouseListener!=null )
        {
            evt.type = "up";
            evt.control = null;
            RasterMouse.mouseListener( evt );//"up",  event );

            evt.type = "end";
            RasterMouse.mouseListener( evt );
        }/*if*/

        // Prevents RasterMouse.cancelDrag() from issuing a "cancel" event
        RasterMouse.currentControl = null;
        RasterMouse.mouseListener = null;

        // Reset mouse drag
       // out( "end drag! ");
        RasterMouse.cancelDrag();
    },


    /********************************************************************
     Register a callback function to be called at periodic intervals
     during the duration of a drag operation. The callback function
     can introspect the mouse position and implement auto-scroll behaviors
     in a control.

     This method has no effect if invoked when no drag operation 
     is in progress. The callback function will have the following signature:
     <pre code>
         //////////////////////////////////////////////////
         //  mouseEvt: a #RasterMouseEvent
         //  arg:      the 'arg' parameter
         function myCallback( mouseEvt, arg )
         {
             //...
         }
     </pre>
     The callback function will stop being invoked when the current
     drag operation ends.

     @param callback function: Function to be called on timer intervals.
     @param arg      any: Argument to be passed to the callback function.
     @see RasterMouseEvent, RasterMouse.startDrag()
     ********************************************************************/
    addTimerListener: function( callback, arg )
    {
        if ( RasterMouse.event == null )
            return;

        if ( !RasterMouse.event.callbacks )
        {
            RasterMouse.event.callbacks = [];
            RasterMouse.timer = setInterval( RasterMouse.timerHandler, 100 );
        }/*if*/

        RasterMouse.event.callbacks.push( {callback:callback, arg:arg} );
    },


    /********************************************************************
     Handle RaterMouse timer events, invoke all registered callbacks.
     @private
     ********************************************************************/
    timerHandler: function( callback, arg )
    {
        RasterMouse.event.type = "timer";
        
        var arr = RasterMouse.event.callbacks;
        for ( var i=0; i < arr.length; i++ )
           arr[i].callback( RasterMouse.event, arr[i].arg );
    },


    /********************************************************************
     Sets the mouse cursor's sub-icon.
     @param cursor object: One of the CURSOR sprite constants, or any object
                   that implements the IID_SPRITEINFO interface. Setting
                   this argument to null will hide the mouse cursor
                   (if any is set).
     ********************************************************************/
    setCursor: function( cursor )
    {
        RasterMouse.setup();
        RasterMouse.currentCursor = cursor;

        if ( cursor==null )
        {
            RasterMouse.cursorSprite.moveTo( 0, -1600);
            //Mouse.cursorSprite.setVisible( false );
        }
        else if ( cursor.IID_SPRITEINFO )
        {
            RasterMouse.cursorSprite.setImage( cursor, true );   //true means 'resize'
            RasterMouse.cursorSprite.setDisplay( true );
        }/*if*/

    },

    /********************************************************************
     Restore the mouse cursor set prior to starting a drag operation.
     ********************************************************************/
    restoreCursor: function()
    {
        RasterMouse.setCursor( RasterMouse.startCursor );
    },


    /********************************************************************
     Sets the mouse over cursor for the dropBorder.
     @private
     @param cssCursor   [string]: a valid css cursor name. If this value
                         is not specified, "default" is used.
     ********************************************************************/
    setDropBorderCursor: function( cssCursor )
    {
        RasterMouse.setup();
        RasterMouse.dropBorder.controlBox.style.cursor = cssCursor || "default";
    },


    /********************************************************************
     Surrounds the given element with a semi-transparent border used to
     highlight a drop target area.

     This function can be used from within a user-defined
     <code>dropHandler()</code> function to highlight the drop target as
     the mouse cursor hovers over a valid target. Drop borders are
     automatically hidden when after a drop operation is completed,
     cancelled or the mouse leaves a valid drop area.

     @param element    object: DOM element to be highlighted
     @param borders    [string]: A String containing any combination of the following
                       characters: 't'=top 'b'=bottom, 'l'=left, and 'r'=right.
     @param cssCursor  [string]: a valid css cursor name. If this value
                       is not specified, the current cursor is used.
     ********************************************************************/
    showDropBorderOver: function( element, borders, cssCursor)
    {
        RasterMouse.setup();

        if ( element==null )
        {
            RasterMouse.dropBorder.hide();
            return;
        }/*if*/

        if ( cssCursor!=null )
            RasterMouse.setDropBorderCursor( cssCursor );

        RasterMouse.dropBorder.setBorders( borders );
        RasterMouse.dropBorder.showOver( element );
    },


    /********************************************************************
     Displays a floating semi-transparent border at the given x,y
     coordinates, width and height.

     This function can be used from within a user-defined
     <code>dropHandler()</code> function to highlight the drop target as
     the mouse cursor moves. The border box is automatically hidden when
     a drop operation is completed, cancelled or the mouse leaves a valid
     drop area.

     @param x            number: X position in pixels. Set this argument
                         to null to hide the shade box. When set to null
                         all other arguments (if any) are ignored.
     @param y            number: Y position in pixels
     @param width        number: width of the box
     @param height       number: height of the box
     @param cssCursor   [string]: a valid css cursor name. If this value
                        is not specified, the current cursor is used.
     ********************************************************************/
    showDropBorder: function( x, y, width, height, cssCursor )
    {
        RasterMouse.setup();

        if ( x==null )
        {
            RasterMouse.dropBorder.hide();
            return;
        }/*if*/

        if ( cssCursor!=null )
            RasterMouse.setDropBorderCursor( cssCursor );

        RasterMouse.dropBorder.setSize( width, height );
        RasterMouse.dropBorder.moveTo( x, y );
    },


    /********************************************************************
     Sets the mouse over cursor for the shadeBox.
     @private
     @param cssCursor   [string]: a valid css cursor name. If this value
                         is not specified, "default" is used.
     ********************************************************************/
    setShadeBoxCursor: function( cssCursor )
    {
        RasterMouse.setup();
        RasterMouse.shadeBox.controlBox.style.cursor = cssCursor || "default";
    },


    /********************************************************************
     Displays a floating semi-transparent box at the given x,y coordinates,
     width and height.

     This function can be used from within a user-defined
     <code>dropHandler()</code> function to highlight the drop target as
     the mouse cursor moves. The shade box is automatically hidden when
     a drop operation is completed, cancelled or the mouse leaves a valid
     drop area.

     @param x            number: X position in pixels. Set this argument
                         to null to hide the shade box. When set to null
                         all other arguments (if any) are ignored.
     @param y            number: Y position in pixels
     @param width        number: width of the box
     @param height       number: height of the box
     @param cssCursor   [string]: a valid css cursor name. If this value
                        is not specified, the current cursor is used.
     ********************************************************************/
    showShadeBox: function( x, y, width, height, cssCursor )
    {
        RasterMouse.setup();

        if ( x==null )
        {
            RasterMouse.shadeBox.hide();
            return;
        }/*if*/

        if ( cssCursor!=null )
            RasterMouse.setShadeBoxCursor( cssCursor );

        RasterMouse.shadeBox.setSize( width, height );
        RasterMouse.shadeBox.moveTo( x, y );
    },


    /********************************************************************
     Displays a insertion line at the given x,y coordinates, line length
     and orientation.

     This function can be used from within a user-defined
     <code>dropHandler()</code> function to highlight the drop target as
     the mouse cursor hovers over a valid target. The drop line is
     automatically hidden when after a drop operation is completed,
     cancelled or the mouse leaves a valid drop area.

     @param x            number: X position in pixels. Set this argument
                         to null to hide the dropline. When set to null
                         all other arguments (if any) are ignored.
     @param y            number: Y position in pixels
     @param isVertical   boolean: True sets the line orientation to
                         vertical (default), false set the orientation
                         horizontal.
     @param length       number: the line's length
     ********************************************************************/
    showDropLine: function( x, y, isVertical, length  )
    {
        RasterMouse.setup();

        if ( x==null )
        {
            RasterMouse.insertionLine.hide();
            return;
        }/*if*/

        RasterMouse.insertionLine.setOrientation( isVertical, length );
        RasterMouse.insertionLine.moveTo( x, y );
    },


    /********************************************************************
     CSS resize cursor names for the given cursor ID according to the
     following illustration:

                                n-resize
                   nw-resize       |       ne-resize
                            0      1      2
                             +-----+-----+
                             |           |
                 w-resize  7 +     8     + 3  e-resize     8=default
                             |           |
                             +-----+-----+
                            6      5      4
                   sw-resize       |       se-resize
                                s-resize
     *********************************************************************/
    RESIZE_CURSORS : ["nw-resize", "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "default"],
    
    /*******************************************************************
     Determine which container's edge the mouse pointer is closer to.
     This function is useful for showing the appropriate resize mouse
     pointer when the mouse moves over near the edges of a given container.
     @private
     @param  element     object: Element in which the mouse is moving in.
     @param  event       object: Mousemove DOM event object
     @param  borderWidth [number]: The thickness of the resize border.
                         If this value is not specified, 5 is used.
     @return number: An index in the RESIZE_CURSORS array identifying
             the appropriate the CSS resize cursor.
     *******************************************************************/
    getNearestEdge: function( element, event, borderWidth )
    {
        var mouse = Raster.getInputState( event );
        var point = Raster.pointToElement( element, mouse.x, mouse.y);
        var box = Raster.getBounds( element );

        borderWidth = borderWidth || 5;

        if ( point.x > (box.width-borderWidth) )
        {
            if ( point.y < borderWidth )
                return 2; // ne-resize
            else if ( point.y > (box.height-borderWidth) )
                return 4; // se-resize
            else
                return 3; // e-resize
        }
        else if ( point.x < borderWidth )
        {
            if ( point.y < borderWidth )
                return 0; // nw-resize
            else if ( point.y > (box.height-borderWidth) )
                return 6; // sw-resize
            else
                return 7; // e-resize
        }
        else if ( point.y < borderWidth )
            return 1; // n-resize

        else if ( point.y > (box.height-borderWidth) )
            return 5; // s-resize;

        return 8;
    },


    /*******************************************************************
     Determine which side of the container the mouse pointer is closer
     to. This function is useful for showing the appropriate resize
     mouse pointer when the mouse moves over near the edges of a given
     container.
     
     @private
     @param  element     object: Element in which the mouse is moving in.
     @param  event       object: Mousemove DOM event object
     @param  borderWidth [number]: The thickness of the resize border.
                         If this value is not specified, 1/3 the width
                         of the element is used.
     @return number: An index in the RESIZE_CURSORS array identifying
             the appropriate the CSS resize cursor.
     *******************************************************************/
    getNearestEdgeH: function( element, event, borderWidth )
    {
        var mouse = Raster.getInputState( event );
        var point = Raster.pointToElement( element, mouse.x, mouse.y );
        var box = Raster.getBounds( element );

        borderWidth = borderWidth || box.width/3;

        if ( point.x  >   box.width-borderWidth )
           return 3; // e-resize

        else if ( point.x  <  borderWidth )
           return 7; // w-resize

        return 8;
    },


    /*******************************************************************
     Determine which edge of the container the mouse pointer is closer
     to, top or bottom. This function is useful for showing the
     appropriate resize mouse pointer when the mouse moves over near the
     edges of a given container.

     @private
     @param  element     object: Element in which the mouse is moving in.
     @param  event       object: Mousemove DOM event object
     @param  borderWidth [number]: The thickness of the resize border.
                         If this value is not specified, 1/3 the height
                         of the element is used.
     @return number: An index in the RESIZE_CURSORS array identifying
             the appropriate the CSS resize cursor.
     *******************************************************************/
    getNearestEdgeV: function( element, event, borderWidth )
    {
        var mouse = Raster.getInputState( event );
        var point = Raster.pointToElement( element, mouse.x, mouse.y);
        var box = Raster.getBounds( element );

        borderWidth = borderWidth || box.height/3;

        if ( point.y  >   box.height-borderWidth )
           return 5; // s-resize

        else if ( point.y  <  borderWidth )
           return 1; // n-resize

        return 8;
    }

};
 

