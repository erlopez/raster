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
 Implements a floating dialog window. The following example creates a dialog
 in the BODY element and move a DIV element with <code>id</code>="dialogContent"
 inside the dialog content area:
 <pre code>
    var d = new RasterDialog( null, ICONS16.COG, "Console" );
    d.setContent( "dialogContent" );
    d.setEventHandler( dialogHandler ); // specify event handler
    d.moveTo( 100, 100);                // position dialog
    d.setSize( 250, 150 );              // set content size
    d.setMaxSize( 500, 300);            // limit max size
    d.setMinSize( 200, 80);             // limit min size
    d.setResizable( true );             // can be resized
    d.setButtons( false,false,false,true ); // show close button
    d.setContent( "dialogContent" ); // move the div#dialogContent
                                     // element into the

    ...

    &lt;div id='dialogContent'&gt;
         This is the dialog content.
    &lt;/div&gt;

 </pre> 
 An <code>icon</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.

 @constructor
 @see RasterDialogEvent, ICONS16

 @param parent       [object]: One of the following: a string containing the ID
                      of a DOM element, a reference to a DOM element, or another
                      control object. If this argument is null, the control is
                      created in the <code>document.body</code> element.
 @param icon          [string]: String containing path of a 16x16 image file
                      or an object that implements the IID_SPRITEINFO interface
                      such as the constants in the #ICONS16 object. Set to
                      null if no image needed.
 @param title         [string]: Text shown in the dialog's title bar; set to
                      null if no text is needed.
 @param useIFrameBackdrop [boolean]: Set to true to draw a IFRAME behind the
                      the dialog. This feature is useful in IE where it
                      is not possible to position DIVs over plugins areas,
                      for example, vlc player. The IFRAME solves the ovelay
                      issue. Omit this argument of set to false to turn off
                      the IFRAME feature.
 *****************************************************************************/
function RasterDialog( parent, icon, title, useIFrameBackdrop )
{
    // call super()
    RasterControl.call( this, parent || document.body );
    this.controlBox.innerHTML = '<div class="rdModal"></div>' +
                                '<div class="rasterShadowBox' +
                                    (Raster.isIEQuirks ? " rasterShadowBoxQuirks" : "")+ '">' +
                                    '<div class="rasterShadowBox0"></div>' +
                                    '<div class="rasterShadowBox1"></div>' +
                                    '<div class="rasterShadowBox2"></div>' +
                                    '<div class="rasterShadowBox3"></div>' +
                                '</div>' +
                                '<div class="rdCorner3"></div><div class="rdCorner4"></div>' +
                                '<div class="rdCorner1"></div><div class="rdCorner2"></div>' +
                                '<div class="rdClipBox">' +
                                    '<div class="rdContent"></div>' +
                                    '<div class="rdTitlebar">' +
                                        '<span class="rdIco"></span>' +
                                        '<span class="rdTitle"></span>' +
                                    '</div>' +
                                    '<div class="rdButtonbar">' +
                                        '<a href="#" onclick="return RasterDialog.buttonHandler(0,this,event)" class="rdMin"></a>' +
                                        '<a href="#" onclick="return RasterDialog.buttonHandler(1,this,event)" class="rdWin"></a>' +
                                        '<a href="#" onclick="return RasterDialog.buttonHandler(2,this,event)" class="rdMax"></a>' +
                                        '<a href="#" onclick="return RasterDialog.buttonHandler(3,this,event)" class="rdClose"></a>' +
                                    '</div>' +
                                '</div>'+  ( !useIFrameBackdrop ? "" :
                                '<iframe src="javascript: \'\'" style="position: absolute; width:100%; height:100%; margin:0; z-index:-1;" frameborder="0"></iframe>');



    this.setClass( Raster.isIEQuirks ? "rasterDialog rasterDialogQuirks" : "rasterDialog");

    this.isAutoCenter = false;     //dialog does not center automatically on resize
    this.canBeMoved = true;        //dialog can be moved
    this.canBeResized = false;     //dialog cannot be resized

    this.isModal = false;          //Standalone dialog
    this.minWidth = null;          //Default no min or max constraints
    this.minHeight = null;
    this.maxWidth = null;
    this.maxHeight = null;

    this.modalDiv = this.controlBox.childNodes[0];
    this.shadowDiv = this.controlBox.childNodes[1];
    this.contentDiv = this.controlBox.childNodes[6].childNodes[0];
    this.titlebar = this.controlBox.childNodes[6].childNodes[1];
    this.buttonbar = this.controlBox.childNodes[6].childNodes[2];

    this.iconSpan = this.titlebar.childNodes[0];
    this.titleSpan = this.titlebar.childNodes[1];

    this.minLink = this.buttonbar.childNodes[0];
    this.winLink = this.buttonbar.childNodes[1];
    this.maxLink = this.buttonbar.childNodes[2];
    this.closeLink = this.buttonbar.childNodes[3];

    // Create backtrack expandos to facilitate mousedown dom tree search up
    this.controlBox.rasterDialog = this;

    var proxy = {isProxy:true, instance: this };
    this.contentDiv.rasterDialog = proxy;
    this.buttonbar.rasterDialog = proxy;
    this.shadowDiv.rasterDialog = proxy;
    this.modalDiv.rasterDialog = proxy;


    // Drag handler
    this.controlBox.onmousedown = RasterDialog.mousedownHandler;
    this.controlBox.onmousemove = RasterDialog.mousemoveHandler;

    //Prevent drag-start/selection in IE
    if ( Raster.isIE )
    {
        this.contentDiv.allowIESelection = true; // used by ieSelectionHandler() is "selectionStart" should be allowed
        this.controlBox.ondragstart  = RasterDialog.ieSelectionHandler;    //Allow selection inside the dialog
        this.controlBox.onselectstart  = RasterDialog.ieSelectionHandler;
    }

    // Defaults
    this.eventHandler = null;
    this.setSize( 100, 100, true );     //true: set outer size
    this.moveTo(0,0);
    this.hide();
    this.setTitle( title );
    this.setIcon( icon );
    this.shadowDiv.style.left =  (-RasterDialog.SHADOW_SIZE) + "px";  //offset the shadow box
    this.shadowDiv.style.top = (-RasterDialog.SHADOW_SIZE) + "px";

    if ( RasterDialog.dw == null )  // Cache the difference in width,height between content area and dialog's control box
        this.computeContentSizeDifference();

    Raster.setOpacity( this.modalDiv, 33);
    this.createIE6IframeBackdrop(); // applies only to IE6, all other ignore this

    // resister dialog by unique id Sequence
    this.id = "dialog" + (Raster.idSequence++);
    RasterDialog.all[ this.id ] = this;

    // once included in the RasterDialog.all[], make dialog front-most
    this.zIndex = 0;
    this.bringToFront();

    /** @property IID_DIALOG [boolean]: Interface ID tag constant used to identify #RasterDialog objects.
                             This property is always true.*/
}
/*****************************************************************************
 Globals, Constants, Implements the Control class
 @private
 *****************************************************************************/
RasterDialog.SHADOW_SIZE = 5;
RasterDialog.all = {};        //keeps registry of all created dialogs
RasterDialog.buttons = ["minimize", "window", "maximize", "close" ];
RasterDialog.prototype.IID_DIALOG = true;
Raster.implementIID ( RasterDialog, RasterControl );
RasterDialog.Z_INDEX = 200;   //font-most dialog z-index


/*****************************************************************************
 Triggers a layout check in all dialogs. Invoked when page is resized, or
 a change in one dialog may affect the layout of others.
 @private
 *****************************************************************************/
RasterDialog.doLayout = function()
{
    //call doLayout in all Dialogs
    for ( var id in RasterDialog.all )
        RasterDialog.all[id].doLayout();

};


/*****************************************************************************
 Handle dialog buttons events.
 @private
 @param buttonNo number: Indicates the button being pressed: 0=minimize,
                 1=window, 2=maximize, 3=close
 @param link     object: A element being pressed
 @param event    object: Click DOM event
 *****************************************************************************/
RasterDialog.buttonHandler = function( buttonNo, link, event )
{
    var el = Raster.srcElement( event );
    var dialog = Raster.findParentExpando(el, "rasterControl");
    link.blur();
        
    // invoke user size handler (if any)
    var dgEvent = null;
    if ( dialog.eventHandler )
    {
        dgEvent = RasterEvent.mkDialogEvent ( event, RasterDialog.buttons[buttonNo], dialog, null );
        dialog.eventHandler( dgEvent );
    }
    // Close window (if applicable )
    if ( buttonNo==3 && (dgEvent==null || !dgEvent.isCancelled) )
        dialog.hide();

    return false;
};

/*****************************************************************************
 Show resize cursor when mouse pointer hover the edges of the dialog window.
 @private
 *****************************************************************************/
RasterDialog.mousemoveHandler = function( event )
{
    var el = Raster.srcElement( event );
    var dialog = Raster.findParentExpando(el, "rasterDialog");
    if ( dialog==null || dialog.isProxy )
        return;

    var edge = RasterMouse.getNearestEdge( dialog.controlBox, event, 6);
    if ( (edge==8 && !dialog.canBeMoved) || (edge!=8 && !dialog.canBeResized) )
    {
        dialog.controlBox.style.cursor = "";
        return;
    }/*if*/
    
    RasterMouse.setDropBorderCursor( RasterMouse.RESIZE_CURSORS[edge] );
    dialog.controlBox.style.cursor =  RasterMouse.RESIZE_CURSORS[edge];

};

/*****************************************************************************
 IE Only handler - Allows selection inside the dialog content, but not
 in the modal or title of the dialog.
 @private
 *****************************************************************************/
RasterDialog.ieSelectionHandler = function( event )
{
    var el = Raster.srcElement( event );
    var allowIESelection = Raster.findParentExpando(el, "allowIESelection");

    return allowIESelection===true;        
};

/*****************************************************************************
 Handle start of drag event in dialog control.
 @private
 *****************************************************************************/
RasterDialog.mousedownHandler = function( event )
{
    var el = Raster.srcElement( event );

    // Bring dialog (and all its parent dialogs) to front
    var dialogs = Raster.findParentExpando(el, "rasterDialog", true); //true: all parent expandos
    for ( var i=0; i < dialogs.length; i++)
        if ( !dialogs[i].isProxy ) // some 'rasterDialog' expandos are proxies, which should not respond to mousedown events; skip those
            dialogs[i].bringToFront();


    // If first rasterDialog found is null or a proxy, leave
    var dialog = dialogs[0];
    if ( dialog==null || dialog.isProxy )
    {
        // before leaving, report a click in the modal div, if any
        if ( dialog!=null && el==dialog.instance.modalDiv && dialog.instance.eventHandler!=null )
        {
            dialog.instance.eventHandler(
                    RasterEvent.mkDialogEvent ( event, "modal", dialog.instance, null )   );

            Raster.stopEvent( event );     //prevent selection
            Raster.setActiveMenu( null );
        }
        return;
    }/*if*/

    // Gather drag info
    var mouse = Raster.getInputState( event );
    if ( mouse.button!=1 )
        return;

    var edge = RasterMouse.getNearestEdge( dialog.controlBox, event, 6);
    if ( !dialog.canBeResized && edge==1 ) //if resizing is off, treat top edge as 8
        edge=8;

    Raster.stopEvent( event );     //prevent selection
    Raster.setActiveMenu( null );

    if ( (edge==8 && !dialog.canBeMoved) || (edge!=8 && !dialog.canBeResized) )
        return;

    var bounds = dialog.getBounds();
    bounds.dialog = dialog;
    bounds.edge = edge;
    bounds.right = bounds.x + bounds.width;
    bounds.bottom = bounds.y + bounds.height;
    bounds.offsetX = mouse.x - bounds.x;  //mouse position relative to upper-left corner of dialog
    bounds.offsetY = mouse.y - bounds.y; 
    bounds.minWidth = dialog.minWidth || 0;
    bounds.minHeight = dialog.minHeight || 0;
    bounds.maxWidth = dialog.maxWidth || screen.width;
    bounds.maxHeight = dialog.maxHeight || screen.height;

    // get the dialog's parent box clipping area
    if ( dialog.controlBox.parentNode==document.body )
    {
        bounds.clip = Raster.getWindowBounds();
        bounds.clip.x = 0;
        bounds.clip.y = 0;
        bounds.clip.bottom = bounds.clip.height;
        bounds.clip.right = bounds.clip.width;
    }
    else
    {
        bounds.clip = Raster.getBounds( dialog.controlBox.parentNode );
        bounds.clip.bottom = bounds.clip.y + bounds.clip.height;
        bounds.clip.right = bounds.clip.x + bounds.clip.width;
    }/*if*/

    // start drag
    var evt = RasterMouse.startDrag( event, null, bounds, RasterDialog.dragHandler );

    // paint shaded bar
    if ( edge!=8 )
    {
        evt.type = "move";
        RasterDialog.dragHandler( evt ); //paint
    }

    bounds.moved = false; //flag used to track if a drag/move happened
};


/*****************************************************************************
 Handle drag event of dialog line. The edge value is as follows:

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

 @private
 @param evt      object: RasterMouseEvent object
 *****************************************************************************/
RasterDialog.dragHandler = function( evt )
{
    var bounds = evt.data;
    var clip = bounds.clip;
    var dialog = evt.data.dialog;
    var edge = evt.data.edge;
    var mouse = Raster.getInputState( evt.event );
    var box = bounds;

    switch( edge )
    {
        case 8:  //move
            box = { x: Raster.clip( mouse.x-bounds.offsetX, clip.x-bounds.width+40, clip.right-50 ),
                    y: Raster.clip( mouse.y-bounds.offsetY, clip.y-10, clip.bottom-30 ), 
                    width:bounds.width,
                    height:bounds.height };
            break;
        case 0:
            mouse.x = Math.max( bounds.right-bounds.maxWidth, Math.min( Math.min(mouse.x, clip.right-50), bounds.right-bounds.minWidth ) );
            mouse.y = Math.max( bounds.bottom-bounds.maxHeight, Math.min( Raster.clip(mouse.y, clip.y, clip.bottom-30), bounds.bottom-bounds.minHeight ) );
            box = Raster.toRect( mouse.x-bounds.offsetX, mouse.y-bounds.offsetY,
                                 bounds.right, bounds.bottom);
            break;
        case 1:
            mouse.y = Math.max( bounds.bottom-bounds.maxHeight, Math.min( Raster.clip(mouse.y, clip.y, clip.bottom-30), bounds.bottom-bounds.minHeight ) );
            box = Raster.toRect( bounds.x, mouse.y-bounds.offsetY,
                                 bounds.right, bounds.bottom);
            break;
        case 2:
            mouse.x = Math.min( bounds.x+bounds.maxWidth, Math.max( Math.max(mouse.x, clip.x+30), bounds.x+bounds.minWidth ) );
            mouse.y = Math.max( bounds.bottom-bounds.maxHeight, Math.min( Raster.clip(mouse.y, clip.y, clip.bottom-30), bounds.bottom-bounds.minHeight ) );
            box = Raster.toRect( mouse.x-bounds.offsetX+bounds.width, mouse.y-bounds.offsetY,
                                 bounds.x, bounds.bottom);
            break;
        case 3:
            mouse.x = Math.min( bounds.x+bounds.maxWidth, Math.max( Math.max(mouse.x, clip.x+30), bounds.x+bounds.minWidth ) );
            box = Raster.toRect( mouse.x-bounds.offsetX+bounds.width, bounds.y,
                                 bounds.x, bounds.bottom);
            break;
        case 4:
            mouse.x = Math.min( bounds.x+bounds.maxWidth, Math.max( Math.max(mouse.x, clip.x+30), bounds.x+bounds.minWidth ) );
            mouse.y = Math.min( bounds.y+bounds.maxHeight, Math.max( mouse.y, bounds.y+bounds.minHeight ) );
            box = Raster.toRect(  bounds.x, bounds.y,
                                  mouse.x-bounds.offsetX+bounds.width, mouse.y-bounds.offsetY+bounds.height );
            break;
        case 5:
            mouse.y = Math.min( bounds.y+bounds.maxHeight, Math.max( mouse.y, bounds.y+bounds.minHeight ) );
            box = Raster.toRect(  bounds.x, bounds.y,
                                  bounds.right, mouse.y-bounds.offsetY+bounds.height );
            break;
        case 6:
            mouse.x = Math.max( bounds.right-bounds.maxWidth, Math.min( Math.min(mouse.x, clip.right-50), bounds.right-bounds.minWidth ) );
            mouse.y = Math.min( bounds.y+bounds.maxHeight, Math.max( mouse.y, bounds.y+bounds.minHeight ) );
            box = Raster.toRect(  bounds.right, bounds.y,
                                  mouse.x-bounds.offsetX, mouse.y-bounds.offsetY+bounds.height );
            break;
        case 7:
            mouse.x = Math.max( bounds.right-bounds.maxWidth, Math.min( Math.min(mouse.x, clip.right-50), bounds.right-bounds.minWidth ) );
            box = Raster.toRect(  mouse.x-bounds.offsetX, bounds.y,
                                  bounds.right, bounds.bottom );
            break;

    }/*switch*/

    if ( evt.type=="move" )
        bounds.moved = true;

    // Adjust dialog visual cues
    RasterMouse.showDropBorder( box.x, box.y, box.width, box.height );

    //dialog.moveTo( box.x, box.y );
    //dialog.setSize( box.width, box.height, true );

    // Apply size
    if ( evt.type=="up" && bounds.moved===true )
    {
        // invoke user size handler (if any)
        var dgEvent = null;
        if ( dialog.eventHandler )
        {
            dgEvent = RasterEvent.mkDialogEvent ( evt.event, edge==8 ? "move" : "resize", dialog, box );
            dialog.eventHandler( dgEvent );
        }

        // set size
        if ( dgEvent==null || !dgEvent.isCancelled )
        {
            var local = Raster.pointToElement( dialog.controlBox.parentNode, box.x, box.y);
            dialog.moveTo( local.x, local.y );
            dialog.setSize( box.width, box.height, true );
        }/*if*/

        // refresh possible nested components
        Raster.doLayout();         

    }/*if*/

};


/*****************************************************************************
 Bring the dialog in front of its sibling dialogs. Sibling dialogs have a
 common parent node, so for <code>bringToFront()</code> to work correctly
 among a given group of dialogs, all dialogs must have the same DOM parent node
 or parent #RasterControl. Note that dialogs can be brought "as much" forward
 as their container parent node's z-index allows it.  
 *****************************************************************************/
RasterDialog.prototype.bringToFront = function()
{
    // If this dialog is already the front-most, leave
    if ( this.zIndex == RasterDialog.Z_INDEX )
        return;


    // Collect all sibling dialogs in a temp array
    var temp = [];
    for ( var id in RasterDialog.all )
    {
        var dialog = RasterDialog.all[id];
        if ( this.controlBox.parentNode == dialog.controlBox.parentNode )
        {
            dialog.zIndex --;     //displace z-index back by 1
            temp.push( dialog );
        }
    }/*for*/

    // Bring this dialog to the front-most z-index and
    // sort dialogs in descending Z order
    this.zIndex = RasterDialog.Z_INDEX;
    temp.sort( function(d1,d2) { return d2.zIndex - d1.zIndex;} );

    
    // Update all siblings z-index; from RasterDialog.Z_INDEX and down(back)
    for ( var i=0; i < temp.length; i++)
    {
        temp[i].zIndex = RasterDialog.Z_INDEX - i;
        temp[i].controlBox.style.zIndex = temp[i].zIndex;

    }/*for*/

};


/*****************************************************************************
 Keep dialog  in-view in case the container is shrinked. This is invoked by
 the Raster's onresize event.
 @private
 *****************************************************************************/
RasterDialog.prototype.doLayout = function()
{
    // adjust position to keep dialog from moving off-screen
    if ( this.isAutoCenter )
        this.center();

    if ( this.isModal )      //Re-align modal div
    {
        this.setModal(true);

        //oh boy..
        if ( Raster.isIE && this.controlBox.parentNode == document.body )
        {
            this.setModal(false);  //hide the modal, so the document.body scrollHeight go back to normal
            var dialog = this;
            //delay resetting the modal size, so computation uses current document.body scrollHeight
            //this causes visible flickering, which is expected.
            setTimeout( function() { dialog.setModal(true); }, 10 );
        }
    }
};


/*****************************************************************************
 Computes the difference of width and height between the dialog outer border
 and the content area. For performance reasons, this function is called once
 the first time a Dialog is created. In the rare event an application decides
 to switch the raster.css dynamically (w/o reloading the page), and the new
 theme happen to have a different content's layout (not just colors change),
 this method should be re-invoked in any dialog instance to updated the cached
 calculated values, otherwise the methods setSize(), setMinSize, and setMaxSize()
 will compute the content/dialog incorrectly. Again, this is rare, as switching
 themes dynamically w/o reloading the page in a real application (other than in
 a demo to impress your CEO) is a overachieving functionality.
 @private
 *****************************************************************************/
RasterDialog.prototype.computeContentSizeDifference = function()
{
    var rect = this.getBounds();
    RasterDialog.dw = rect.width - this.contentDiv.clientWidth;
    RasterDialog.dh = rect.height - this.contentDiv.clientHeight;
};


/*****************************************************************************
 Releases and removes all DOM element references used by the dialog instance.
 After this method is invoked, the instance should no longer be used. Note
 that any control contained inside the dialog are not disposed by this method.
 *****************************************************************************/
RasterDialog.prototype.dispose = function()
{
    this.controlBox.rasterDialog = null;
    this.contentDiv.rasterDialog = null;
    this.buttonbar.rasterDialog = null;
    this.shadowDiv.rasterDialog = null;
    this.modalDiv.rasterDialog = null;

    this.contentDiv = null;
    this.titlebar = null;
    this.buttonbar = null;
    this.shadowDiv = null;
    this.modalDiv = null;

    this.iconSpan = null;
    this.titleSpan =  null;

    this.minLink = null;
    this.winLink = null;
    this.maxLink =  null;
    this.closeLink =  null;

    this.eventHandler = null;
    this.controlBox.onmousedown = null;
    this.controlBox.onmousemove = null;

    if ( this.sprite )  //upper-left icon
        this.sprite.dispose();

    // unresister dialog
    delete RasterDialog.all[ this.id ];

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
};



/*****************************************************************************
 Returns the DOM element that holds the dialog's content.
 @private
 @return object: DOM element that accepts content in the Dialog.
 *****************************************************************************/
RasterDialog.prototype.getContentElement = function()
{
    return this.contentDiv;
};


/*****************************************************************************
 Set the modal state of the dialog. When a dialog is modal, the UI elements
 behing it are not accessible until the dialog is closed. The modal effect
 goes as far as the dialog's parent boundaries, which might not cover the entire
 page. To ensure a full page coverage, the dialog must be child of the
 document.body element.
 @param isModal   boolean: True makes the dialog modal, false makes a standalone
                  dialog.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setModal = function( isModal )
{
    this.isModal = isModal;

    if ( isModal )
    {
        // Hide modalDiv obtaining the dialog's parent scroll values
        this.modalDiv.style.display = "none";

        if ( this.iframeBackground!=null )   //present in IE6 only
        {
            this.iframeBackground.style.display = "none";
            this.shadowDiv.style.display = "none";
        }/*if*/

        // Compute parent scroll size and resize modalDiv
        var w, h;
        if ( this.controlBox.parentNode == document.body )
        {
            var win = Raster.getWindowBounds();
            w = Math.max( document.documentElement.scrollWidth,
                    Math.max( document.body.scrollWidth, Raster.isOp ? win.width : 0 ));
            
            h = Math.max( document.documentElement.scrollHeight,
                    Math.max( document.body.scrollHeight, Raster.isOp ? win.height : 0 ));

            if ( Raster.isIEQuirks )
            {
                w = Math.max( document.body.scrollWidth, win.width );
                h = Math.max( document.body.scrollHeight, win.height );
            }/*if*/

        }
        else
        {
            w = this.controlBox.parentNode.scrollWidth;
            h = this.controlBox.parentNode.scrollHeight;
        }/*if*/

        this.modalDiv.style.left = (-this._x) + "px";    //note _x, _y are part of Control class
        this.modalDiv.style.top = (-this._y) + "px";
        this.modalDiv.style.width = w + "px";
        this.modalDiv.style.height = h + "px";
        this.modalDiv.style.display = "block";

        // Reset IE6 backdrop
        if ( this.iframeBackground!=null )
        {
            this.iframeBackground.style.left = (-this._x) + "px";    //note _x, _y are part of Control class
            this.iframeBackground.style.top = (-this._y) + "px";
            this.iframeBackground.style.width = w + "px";
            this.iframeBackground.style.height = h + "px";
            this.iframeBackground.style.display = "block";
        }/*if*/


//        out ( this.controlBox.parentNode.tagName +" --> "+this.controlBox.parentNode.scrollHeight );
//        out ( this.controlBox.parentNode.parentNode.tagName +" --> "+this.controlBox.parentNode.parentNode.scrollHeight );
    }
    else
    {
        this.modalDiv.style.left = "";
        this.modalDiv.style.top = "";
        this.modalDiv.style.width = "";
        this.modalDiv.style.height = "";

        // Reset IE6 backdrop
        if ( this.iframeBackground!=null )
        {
            this.iframeBackground.style.left = "";
            this.iframeBackground.style.top = "";
            this.iframeBackground.style.width = "";
            this.iframeBackground.style.height = "";
            this.shadowDiv.style.display = "block";
        }/*if*/

    }/*if*/


    return this;
};


/*****************************************************************************
 Moves the dialog to a new location.
 @param x            number: dialog's upper left corner X coordinate.
 @param y            number: dialog's upper left corner Y coordinate.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.moveTo = function( x, y )
{
    // call super
    RasterControl.prototype.moveTo.call( this, x, y );

    if ( this.isModal )      //make looks silly, but this just re-align the modal layer
        this.setModal(true); //to compensate for the dialog movement

    return this;
};


/*****************************************************************************
 Sets the width and height of the dialog.
 @param width         number: width in pixels.
 @param height        number: height in pixels.
 @param isOuterSize   [boolean]: Specify how the given width and height are used.
                      False specifies the size of the content area (inner size).
                      True specifies the size the dialog outer border. When
                      this value is omitted a content area size is assumed.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setSize = function( width, height, isOuterSize )
{
    // translate content based size to outer size
    if ( isOuterSize !== true )
    {
        width += RasterDialog.dw;
        height += RasterDialog.dh;
    }/*if*/

    // call super.setSize()
    RasterControl.prototype.setSize.call( this, width, height );

    // resize shadow
    this.shadowDiv.style.width = (width + RasterDialog.SHADOW_SIZE*2) + "px";
    this.shadowDiv.style.height = (height + RasterDialog.SHADOW_SIZE*2) + "px";

    return this;
};


/*****************************************************************************
 Sets the minimun size the dialog can be resized to.
 @param width  number: Minimun width the dialog can be resized to. If this
               value is null, no width constraint is set.
 @param height number: Minimun height the dialog can be resized to. If this
               value is null, no height constraint is set.
 @param isOuterSize   [boolean]: Specify how the given width and height are used.
                      False specifies the size of the content area (inner size).
                      True specifies the size the dialog outer border. When
                      this value is omitted a content area size is assumed.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setMinSize = function( width, height, isOuterSize )
{
    // translate content based size to outer size
    if ( isOuterSize !== true )
    {
        width += RasterDialog.dw;
        height += RasterDialog.dh;
    }/*if*/

    this.minHeight = height;
    this.minWidth = width;

    return this;
};


/*****************************************************************************
 Sets the maximun size the dialog can be resized to.
 @param width         number: Maximum width the dialog can be resized to. If this
                      value is null, no width constraint is set.
 @param height        number: Maximum height the dialog can be resized to. If this
                      value is null, no height constraint is set.
 @param isOuterSize   [boolean]: Specify how the given width and height are used.
                      False specifies the size of the content area (inner size).
                      True specifies the size the dialog outer border. When
                      this value is omitted a content area size is assumed.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setMaxSize = function( width, height, isOuterSize )
{
    // translate content based size to outer size
    if ( isOuterSize !== true )
    {
        width += RasterDialog.dw;
        height += RasterDialog.dh;
    }/*if*/

    this.maxHeight = height;
    this.maxWidth = width;

    return this;
};


/*****************************************************************************
 Indicates if the dialog should be centered automatically when the browser
 window has been resized.
 @param isAutoCenter  boolean: True indicates the dialog should be re-centered
                      after the browser window has been resized. False turn off
                      automatic re-centering (default).
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setAutoCenter = function( isAutoCenter )
{
    this.isAutoCenter = isAutoCenter || false;
    return this;
};


/*****************************************************************************
 Indicates if the dialog can be moved/dragged around the page.
 @param canBeMoved  boolean: True allows the dialog to be moved (default).
                    False disallow the dialog to be moved.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setMovable = function( canBeMoved  )
{
    this.canBeMoved = canBeMoved;
    return this;
};

/*****************************************************************************
 Indicates if the dialog can be resized.
 @param canBeResized  boolean: True allows the dialog to be resized. False
                      disallow the dialog to be resized (default).
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setResizable = function( canBeResized  )
{
    this.canBeResized = canBeResized;
    return this;
};


/*****************************************************************************
 Positions the dialog in the center of the browser window. This method is
 intended for dialogs placed in the <code>document.body</code>. If the dialog
 is contained in a custom element, this method might not have the desired effect.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.center = function()
{
    var win = Raster.getWindowBounds();
    var b = this.getBounds();

    var x = Math.max(0, (win.width-b.width)/2 );
    var y = Math.max(0, (win.height-b.height)/2 );

    this.moveTo(x, y);
    
    return this;
};


/*****************************************************************************
 Makes the dialog visible. If <code>autoCenter</code> is ON, the dialog is
 automatically re-centered.
 
 @see hide(), showAt()
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.show = function()
{
    this.setVisible(true);
    this.bringToFront();

    if ( this.isAutoCenter )
        this.center();
    
    return this;
};



/*****************************************************************************
 Moves the dialog to the given x,y position, then make the dialog visible.
 <b>Note:</b> the give x,y values are ignored if <code>autoCenter</code> is ON.
 
 @param x            number: X position in pixels
 @param y            number: Y position in pixels
 @see hide(), show()
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.showAt = function(x, y)
{
    this.moveTo(x, y);
    this.show();
    return this;
};


/*****************************************************************************
 Makes the dialog invisible.
 @see show(), showAt()
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.hide = function()
{
    this.setVisible(false);
    return this;
};


/*****************************************************************************
 Sets the title displayed in the dialog title bar.
 @param title  string: Text shown in the dialog's title bar; set to null
               if no text is needed.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setTitle = function( title )
{
    this.title = title;
    this.titleSpan.innerHTML = title || "";
    this.titleSpan.style.display = (title!=null) ? "" : "none";

    return this;
};


/*****************************************************************************
 Specifies which title bar buttons to show in the dialog.
 @param min    boolean: True show the minimize button; false hides it
 @param win    boolean: True show the windoize button; false hides it
 @param max    boolean: True show the maximize button; false hides it
 @param close  boolean: True show the close button; false hides it
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setButtons = function( min, win, max, close )
{
    this.minLink.style.display = min ? "" : "none";
    this.winLink.style.display = win ? "" : "none";
    this.maxLink.style.display = max ? "" : "none";
    this.closeLink.style.display = close ? "" : "none";

    return this;
};


/*****************************************************************************
 Sets the icon displayed in the dialog title bar.
 An <code>icon</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.

 @param icon  string: String containing path of a 16x16 image file
              or an object that implements the IID_SPRITEINFO interface such as
              the constants in the #ICONS16 object. Set to null if no image needed.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.setIcon = function( icon )
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

    return this;
};


/*****************************************************************************
 Shows/hides the dialog's content area default background and border. This
 method does not makes the dialog transparent, it only makes the content
 area's background and border rectangle transparent/opaque.
 @param isVisible  boolean: true shows the assigned css background (default);
                   false makes the dialog's content area background transparent.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.showBackground = function( isVisible )
{
    if ( isVisible )
        Raster.removeClass(this.contentDiv, "rdContentNoBgBorder");
    else
        Raster.addClass(this.contentDiv, "rdContentNoBgBorder");

    return this;
};


/*****************************************************************************
 Shows/hides the dialog's shadow.
 @param isVisible  boolean: true shows the shadow (default);
                   false hides the shadow.
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterDialog.prototype.showShadow = function( isVisible )
{
    this.shadowDiv.style.display = isVisible ? "" : "none";
    return this;
};


/*****************************************************************************
 Specifies an event handler to be notified after the user has performed a
 dialog action such as move, resize, close, etc.

 @param eventHandler  function: Reference to the event handler function.
                      Set to null to remove any previously set handlers. 
 @return object: The dialog object. This allow for chaining multiple setter methods in
         one single statement.
 @see RasterDialogEvent
 *****************************************************************************/
RasterDialog.prototype.setEventHandler = function( eventHandler )
{
    this.eventHandler = eventHandler;
    return this;
};

