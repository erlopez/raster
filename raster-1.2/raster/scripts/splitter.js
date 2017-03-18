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
 Implements a splitted panel that host two content areas which size can be
 adjusted by dragging the splitting line between the two.

 The two panels or content areas of a splitter are identified with the numbers
 1 and 2. Panel 1 always has fixed <code>size</code>; Panel 2 occupies the
 remaining space.  Panel 1 can be aligned to any of the sides of the splitter
 control. The splitter control takes all of the available space of its
 containing parent element.

 The following code creates a splitter in the BODY element having a left
 panel(#1) measuring 200px and a right panel(#2) taking the remaining of the
 horizontal space. An existing DIV with <code>id</code>="leftDiv" is dom-relocated
 inside the left panel, a list control is created, and placed in the right
 panel:
 <pre code>
    var splitter = new RasterSplitter( document.body, "left", 200 );

    // 'leftDiv' is the id of a DIV element to move into the panel 1
    splitter.setContent( 1, "leftDiv" );

    // Create a list control and
    // place it panel 2 of the splitter
    var list = new RasterList( null, "grid" );
    list.add( null, ICONS32.GRAPHICS, null, "Customize" );
    list.add( null, ICONS32.ADDRESS_BOOK, null, "Addresses" );
    list.add( null, ICONS32.ACCESSORIES, null, "Accessories" );

    splitter.setContent( 2, list );

    ...

    &lt;div id='leftDiv'&gt;
         This is the left panel content.
    &lt;/div&gt;

 </pre>

 @constructor
 @see RasterSplitterEvent

 @param parent        object: One of the following: a string containing the ID
                      of a DOM element, a reference to a DOM element, or another
                      control object. If this argument is null, the control is
                      created but not attached to the DOM tree; setParent() must
                      be invoked later to specify the parent control.
 @param alignment     string: Alignment of panel 1. Use one of the following
                      values: 'top', 'right, 'bottom', or 'left'.
                      This argument is not case-sensitive.
 @param size          number: Size of the splitter's panel 1.
 *****************************************************************************/
function RasterSplitter( parent, alignment, size )
{
    // call super()
    RasterControl.call( this, parent );
    this.controlBox.innerHTML = '<div class="rasterSplitterPane2">' +
                                    '<div style="position:absolute;width:100%;height:100%"></div>' +
                                '</div>' +
                                '<div></div>'; // panel1

    this.content1 = this.controlBox.childNodes[1]; //panel 1
    this.content2Box = this.controlBox.childNodes[0];
    this.content2 = this.content2Box.firstChild;  //panel 2

    this.size = null;           //size + aligment set later via setters
    this.alignment = null;

    this.isResizable = true;
    this.eventHandler = null;
    this.domLevel = 0;          // used in layout computation, sort splitters from outer to inner
    this.isVertical = false;    // the orientation of the splitter, updated in setAlignment()
    this.gripOffset = 0;        //top or left distance of the resize bar, relative to the upper-left corner of the splitter container, computed in setsize()

    //Allow drag-start/selection in IE, by default RasterControl will prevent this
    if ( Raster.isIE )
    {
        this.controlBox.ondragstart  = null;    //Allow selection inside the dialog
        this.controlBox.onselectstart  = null;
    }/*if*/

    // Drag handler
    this.controlBox.onmousedown = RasterSplitter.mousedownHandler;
    
    // Initial Setup
    this.setAlignment(  alignment );
    this.setSize(  size );

    // Because of mouseCapture in IE freezes all mouse pointer style changes,
    // we cannot wait to the mouseDown event to change the cursor
    // of the shadedbox, thus as soon as we hover the splitter, set the cursor
    if ( Raster.isIE )
        this.controlBox.onmouseover = RasterSplitter.mouseoverHandler;

    // resister tabbar by unique id Sequence
    this.id = "splitter" + (Raster.idSequence++);
    RasterSplitter.all[ this.id ] = this;

   /** @property IID_SPLITTER [boolean]: Interface ID tag constant used to identify #RasterSplitter objects.
                             This property is always true.*/
}
/*****************************************************************************
 Globals, Constants, Implements the Control class
 @private
 *****************************************************************************/
RasterSplitter.all = {}; //keeps registry of all created splitters
RasterSplitter.THICKNESS = 5; //thickness of resize bar
RasterSplitter.prototype.IID_SPLITTER = true;
Raster.implementIID ( RasterSplitter, RasterControl );


/*****************************************************************************
 Triggers a layout check in all splitters. Invoked when page is resized, or
 a change in one splitter may affect the layout of others.
 @private
 *****************************************************************************/
RasterSplitter.doLayout = function()
{
    // sort splitters from outer to inner in a temp array
    var arr = new Array();
    for ( var id in RasterSplitter.all )
    {
        RasterSplitter.all[id].updateDomLevel();
        arr.push( RasterSplitter.all[id] );
    }/*for*/

    arr.sort( function(a,b) {  return a.domLevel-b.domLevel; } );

    // call doLayout in all splitters, from outer to inner elements
    for ( var i=0; i < arr.length; i++ )
        arr[i].doLayout();

};


/*****************************************************************************
 This event is registered only in IE. Because of mouseCapture() in IE freezes
 any changes made to the mouse pointer, we cannot wait to the mouseDown event
 to change the cursor of the shadedbox, thus as soon as we hover the splitter,
 set the cursor ahead of a unlikely, but "possible" mousedown event on the
 splitter bar. -I'm gonna cry..
 @private
 *****************************************************************************/
RasterSplitter.mouseoverHandler = function( event )
{
    var el = Raster.srcElement();
    var c = Raster.findParentExpando(el, "rasterControl");
    if ( c!=null && c.IID_SPLITTER && c.isResizable )
        RasterMouse.setShadeBoxCursor( c.isVertical ? "w-resize" : "n-resize" );
};


/*****************************************************************************
 Handle start of drag event in splitter control.
 @private
 *****************************************************************************/
RasterSplitter.mousedownHandler = function( event )
{
    var el = Raster.srcElement( event );
    if ( el.rasterControl==null || !el.rasterControl.IID_SPLITTER )
        return;

    // check isResizable..
    var splitter = el.rasterControl;
    if ( !splitter.isResizable )
        return;

    // prepare data object
    var mouse = Raster.getInputState( event );
    var point = Raster.pointToElement ( splitter.controlBox, mouse.x, mouse.y );

    var data = el.rasterControl.getBounds();
    data.splitter = splitter ;
    data.mouseOffset = (splitter.isVertical ? point.x : point.y) - splitter.computeGripOffset();  //offset from the top or left of the resize region to the actual mouse position


    // start drag
    var evt = RasterMouse.startDrag( event, null, data, RasterSplitter.mousemoveHandler );

    // paint shaded bar
    evt.type = "move";
    RasterSplitter.mousemoveHandler( evt ); //paint
};


/*****************************************************************************
 Handle drag event of splitter line.
 @private
 @param evt      object: a RasterMouseEvent
 *****************************************************************************/
RasterSplitter.mousemoveHandler = function( evt )
{
    var bounds = evt.data;
    var splitter = evt.data.splitter;
    var mouse = Raster.getInputState( evt.event );
    var point = Raster.pointToElement ( splitter.controlBox, mouse.x, mouse.y );

    var dx =  Math.min( bounds.width-RasterSplitter.THICKNESS, Math.max( 0, point.x - bounds.mouseOffset) );
    var dy =  Math.min( bounds.height-RasterSplitter.THICKNESS, Math.max( 0, point.y - bounds.mouseOffset) );

    // paint shaded bar
    if ( splitter.isVertical )
        RasterMouse.showShadeBox( bounds.x + dx, bounds.y, RasterSplitter.THICKNESS, bounds.height, "w-resize" );
    else
        RasterMouse.showShadeBox( bounds.x, bounds.y + dy,  bounds.width, RasterSplitter.THICKNESS, "n-resize" );

    // Apply size
    if ( evt.type=="up" )
    {
        var size = dx; //default to LEFT

        switch( splitter.alignment )
        {
            case 'T':
                size = dy;
                break;

            case 'R':
                size = bounds.width - (dx + RasterSplitter.THICKNESS);
                break;

            case 'B':
                size = bounds.height - (dy + RasterSplitter.THICKNESS);
                break;
        }/*switch*/

        // invoke user size handler (if any)
        var spEvent = null;
        if ( splitter.eventHandler )
        {
            spEvent = RasterEvent.mkSplitterEvent( evt.event, "resize", splitter, size );
            splitter.eventHandler( spEvent );
            size = spEvent.size;
        }
        
        // set size
        if ( spEvent==null || !spEvent.isCancelled )
            splitter.setSize( size );

    }/*if*/

};


/*****************************************************************************
 Computes the distance from either the top or left the resize bar is in relation
 to the upper-left corner of the splitter container (ie. find x [in vertical bar]
 or y [in horizontal bar] of the splitter grip is in relation to the upper-left
 corner of the controlBox )
 @private
 ****************************************************************************/
RasterSplitter.prototype.computeGripOffset = function()
{
    var b = this.getBounds();
    switch( this.alignment )
    {
        case 'T':
            return Math.max( 0, Math.min(this.size, b.height-RasterSplitter.THICKNESS));

        case 'R':
            return b.width - RasterSplitter.THICKNESS - Math.max( 0, Math.min(this.size, b.width-RasterSplitter.THICKNESS));

        case 'B':
            return b.height - RasterSplitter.THICKNESS - Math.max( 0, Math.min(this.size, b.height-RasterSplitter.THICKNESS));

        default:
            return Math.max( 0, Math.min(this.size, b.width-RasterSplitter.THICKNESS));
    }/*switch*/
};



/*****************************************************************************
 Keep splitter bar in-view in case the container is shrinked. This is
 invoked by the Raster's onresize event.
 @private
 *****************************************************************************/
RasterSplitter.prototype.doLayout = function()
{
    // if the size of the panel 1 is bigger than the splitter's controlBox
    // resize the splitter position to fit in the viewing area
    var b = this.getBounds();

    switch( this.alignment )
    {
        case 'T':
        case 'B':
            if (this.size > b.height-RasterSplitter.THICKNESS )
               this.applySize( b.height-RasterSplitter.THICKNESS );
            break;

        default:
            if (this.size > b.width-RasterSplitter.THICKNESS )
                this.applySize( b.width-RasterSplitter.THICKNESS );
    }/*switch*/

};


/*****************************************************************************
 Updates internal property 'domLevel', the level at which this control 
 is placed in the DOM tree.
 @private
 *****************************************************************************/
RasterSplitter.prototype.updateDomLevel = function()
{
    var n = 0;
    var node = this.controlBox;
    while ( (node=node.parentNode) != null )
        n++;

    this.domLevel = n;
};


/*****************************************************************************
 Releases and removes all DOM element references used by this instance. After
 this method is invoked, this instance should no longer be used. Note that
 any control contained inside the splitter are not disposed by this method.
 *****************************************************************************/
RasterSplitter.prototype.dispose = function()
{
    this.controlBox.onmousedown = null;
    this.content1 = null;
    this.content2Box = null;
    this.content2 = null;

    // unresister splitter
    delete RasterSplitter.all[ this.id ];

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
};


/*****************************************************************************
 Indicates if the splitter can be resized.
 @param isResizable   boolean: True allows the splitter to be resized (default).
                      False prevents the splitter from being resized.
 @return object: The splitter object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterSplitter.prototype.setResizable = function( isResizable  )
{
    this.isResizable = isResizable;
    this.controlBox.style.cursor =  isResizable ? "" : "default";
    return this;
};


/*****************************************************************************
 Specifies an event handler to be notified after the user has resized the
 splitter. This handler can be used to enforce specific minimum/maximum sizes
 for the splitter.

 @param eventHandler   function: Reference to the event handler. Set to null
                       to remove any previously set handler.
 @return object: The splitter object. This allow for chaining multiple setter methods in
         one single statement.
 @see RasterSplitterEvent
 *****************************************************************************/
RasterSplitter.prototype.setEventHandler = function( eventHandler )
{
    this.eventHandler = eventHandler;
    return this;
};


/*****************************************************************************
 Sets the content for the given panel of the splitter. Any previously set
 content will be removed before the new content is set.
 @param panelNo       number: 1 set contents for panel 1; 2 or any other value
                      set contents for panel 2.
 @param content       object: One of the following: a string containing the ID
                      of a DOM element, a reference to a DOM element, or another
                      control object. If this argument is null, the content is
                      removed.
 @return object: The splitter object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterSplitter.prototype.setContent = function( panelNo,  content)
{
    var target = panelNo===1 ? this.content1 : this.content2;

    if ( content==null )
    {
        if ( target.firstChild != null )
          target.removeChild( target.firstChild );
        return this;
    }/*if*/


    var element = Raster.resolve( content );
    if ( element!=null )
        Raster.setParent( element, target, true);

    return this;
};


/*****************************************************************************
 Split a panel and returns the new splitter. <code>srcPanelNo</code>
 indicates which of the existing panels is going to be splitted: 1 or 2.
 <code>destPanelNo</code> indicates to which panel in the new splitter the
 content being splitted will be moved to: 1 or 2. The newly created splitter's
 panel 1 will have the given <code>size</code> and be aligned according to
 the given <code>alignment</code>.

 @param srcPanelNo    number: ID of the panel to be splitted: 1 or 2.
 @param destPanelNo   number: ID of the panel in the new splitter where the
                      content being splitted will be placed: 1 or 2.
 @param alignment     string: Alignment of panel 1. Use one of the following
                      values: 'top', 'right, 'bottom', or 'left'.
                      This argument is not case-sensitive.
 @param size          number:  Size of panel 1 in the new splitter.
 @return object: Reference to the newly created splitter.
 *****************************************************************************/
RasterSplitter.prototype.split = function( srcPanelNo, destPanelNo, alignment, size )
{
    var target = srcPanelNo===1 ? this.content1 : this.content2;

    // Save reference to current content
    var content = target.firstChild;

    // Create splitter and place it in target panel
    var splitter = new RasterSplitter( null, alignment );
    splitter.setParent( target, true);
    splitter.setSize( size );

    // Put current content in desired target panel no
    if ( content!=null )
        splitter.setContent(destPanelNo, content  );

    return splitter;
};


/*****************************************************************************
 Inserts new content at the top of a panel. The panel identified by
 <code>panelNo</code> is further splitted into top and bottom panels resulting
 in a new splitter instance. The top panel (panel 1) will be <code>size</code>
 pixels high. The bottom panel (panel 2) will take the remaining vertical space.

 The former content (prior to the split operation occuring) is placed in the
 new bottom panel. The <code>newContent</code> (if any) is placed in the new top
 panel. If no new content was given, the new top panel is left empty.

 @param panelNo       number: ID of the panel to be splitted: 1 or 2.
 @param size          number: Height of the inserted top panel.
 @param newContent    value: One of the following: a string containing the ID
                      of a DOM element, a reference to a DOM element, or another
                      raster control object. If this argument is null or omitted,
                      the top panel is left empty.
 @return object: The splitter resulting from this operation. Panel 1 will be
         aligned to the top with a height of <code>size</code> pixels; panel 2
         will be at the bottom holding the former content.
 *****************************************************************************/
RasterSplitter.prototype.splitTop = function( panelNo, size, newContent )
{
    var s = this.split( panelNo, 2, 'T', size);
    s.setContent(1, newContent );
    return s;
};


/*****************************************************************************
 Inserts new content at the bottom of a panel. The panel identified by
 <code>panelNo</code> is further splitted into top and bottom panels resulting
 in a new splitter instance. The bottom panel (panel 1) will be <code>size</code>
 pixels high. The top panel (panel 2) will take the remaining vertical space.

 The former content (prior to the split operation occuring) is placed in the
 new top panel. The <code>newContent</code> (if any) is placed in the new bottom
 panel. If no new content was given, the new bottom panel is left empty.

 @param panelNo       number: ID of the panel to be splitted: 1 or 2.
 @param size          number: Height of the inserted bottom panel.
 @param newContent    value: One of the following: a string containing the ID
                      of a DOM element, a reference to a DOM element, or another
                      raster control object. If this argument is null or omitted,
                      the bottom panel is left empty.
 @return object: The splitter resulting from this operation. Panel 1 will be
         aligned to the bottom with a height of <code>size</code> pixels; panel 2
         will be at the top holding the former content.
 *****************************************************************************/
RasterSplitter.prototype.splitBottom = function( panelNo, size, newContent )
{
    var s = this.split( panelNo, 2, 'B', size);
    s.setContent(1, newContent );
    return s;
};


/*****************************************************************************
 Inserts new content at the left side of a panel. The panel identified by
 <code>panelNo</code> is further splitted into left and right panels, resulting
 in a new splitter instance. The left panel (panel 1) will be <code>size</code>
 pixels wide. The right panel (panel 2) will take the remaining horizontal space.

 The former content (prior to the split operation occuring) is placed in the
 new right panel. The <code>newContent</code> (if any) is placed in the new left
 panel. If no new content was given, the new left panel is left empty.

 @param panelNo       number: ID of the panel to be splitted: 1 or 2.
 @param size          number: Width of the inserted left panel.
 @param newContent    value: One of the following: a string containing the ID
                      of a DOM element, a reference to a DOM element, or another
                      raster control object. If this argument is null or omitted,
                      the left panel is left empty.
 @return object: The splitter resulting from this operation. Panel 1 will be
         aligned to the left with a width of <code>size</code> pixels; panel 2
         will be at the right holding the former content.
 *****************************************************************************/
RasterSplitter.prototype.splitLeft = function( panelNo, size, newContent )
{
    var s = this.split( panelNo, 2, 'L', size);
    s.setContent(1, newContent );
    return s;
};

/*****************************************************************************
 Inserts new content at the right side of a panel. The panel identified by
 <code>panelNo</code> is further splitted into left and right panels, resulting
 in a new splitter instance. The right panel (panel 1) will be <code>size</code>
 pixels wide. The left panel (panel 2) will take the remaining horizontal space.

 The former content (prior to the split operation occuring) is placed in the
 new left panel. The <code>newContent</code> (if any) is placed in the new right
 panel. If no new content was given, the new right panel is left empty.

 @param panelNo       number: ID of the panel to be splitted: 1 or 2.
 @param size          number: Width of the inserted right panel.
 @param newContent    value: One of the following: a string containing the ID
                      of a DOM element, a reference to a DOM element, or another
                      raster control object. If this argument is null or omitted,
                      the right panel is left empty.
 @return object: The splitter resulting from this operation. Panel 1 will be
         aligned to the right with a width of <code>size</code> pixels; panel 2
         will be at the left holding the former content.
 *****************************************************************************/
RasterSplitter.prototype.splitRight = function( panelNo, size, newContent )
{
    var s = this.split( panelNo, 2, 'R', size);
    s.setContent(1, newContent );
    return s;
};


/*****************************************************************************
 Sets the aligment of the panel 1.
 @param alignment     string: Alignment of panel 1. Use one of the following
                      values: 'top', 'right, 'bottom', or 'left'.
                      This argument is not case-sensitive.
 @return object: The splitter object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterSplitter.prototype.setAlignment = function( alignment )
{
    alignment = (alignment || 'L').toString().toUpperCase().charAt(0);
    
    this.alignment = /^[TRLB]$/i.test(alignment) ? alignment.toUpperCase() : 'L';
    this.isVertical = false;  // the orientation of the splitter

    switch( this.alignment )
    {
        case 'T':
            this.setClass("rasterSplitterT");
            this.content1.className = "rasterSplitterPane1T";
            break;

        case 'R':
            this.setClass("rasterSplitterR");
            this.isVertical = true;
            this.content1.className = "rasterSplitterPane1R";
            break;

        case 'B':
            this.setClass("rasterSplitterB");
            this.content1.className = "rasterSplitterPane1B";
            break;

        default:
            this.setClass("rasterSplitterL");
            this.content1.className = "rasterSplitterPane1L";
            this.isVertical = true;
    }/*switch*/

    // Because IE quirks still exist... in IE7 and IE8   :-P  :-P
    if ( Raster.isIEQuirks && !Raster.isIE6 )
        Raster.addClass( this.controlBox, "rasterSplitterQuirks" );

    this.setSize( this.size ); //update layout
    return this;
};


/*****************************************************************************
 Sets the size of the splitter's content1 area.
 @param size   number:  size of the splitter's panel 1.
 @return object: The splitter object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterSplitter.prototype.setSize = function( size )
{
    this.applySize( size, true );

    // notify other controls this splitter has changed
    // and allow them to readjust if needed
    Raster.doLayout();

    return this;
};


/*****************************************************************************
 Apply the given size to this spliter's layout. This method does not notify
 other spliters of the change.
 @private
 @param size     number:  size of the splitter's panel 1.
 *****************************************************************************/
RasterSplitter.prototype.applySize = function( size )
{
    var b = this.getBounds();
    this.size = size = Math.max( 0, size || 0 );

    switch( this.alignment )
    {
        case 'T':
            size = Math.max( 0, Math.min(size, b.height-RasterSplitter.THICKNESS));
            this.content1.style.height = size + "px";
            this.content2Box.style.marginTop = (size+RasterSplitter.THICKNESS) + "px";
            break;

        case 'R':
            size = Math.max( 0, Math.min(size, b.width-RasterSplitter.THICKNESS));
            this.content1.style.width = size + "px";
            this.content2Box.style.marginRight = (size+RasterSplitter.THICKNESS) + "px";
            break;

        case 'B':
            size = Math.max( 0, Math.min(size, b.height-RasterSplitter.THICKNESS));
            this.content1.style.height = size + "px";
            this.content2Box.style.marginBottom = (size+RasterSplitter.THICKNESS) + "px";
            break;

        default:
            size = Math.max( 0, Math.min(size, b.width-RasterSplitter.THICKNESS));
            this.content1.style.width = size + "px";
            this.content2Box.style.marginLeft = (size+RasterSplitter.THICKNESS) + "px";
    }/*switch*/

    // Force opera to recompute layout
    if ( Raster.isOp )
        Raster.repaint( this.controlBox );

};

