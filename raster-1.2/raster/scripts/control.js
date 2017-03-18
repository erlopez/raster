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
 Base class for all UI controls. Provides a blank "box" or general-purpose
 panel for rendering any kind of custom content. This class is meant to be
 extended by another object that implements what is going to be rendered
 inside the control, thus is seldom this constructor will be used directly.
 <br><br>
 The following are sub-classes of <code>RasterControl</code>:
 #RasterDialog, #RasterGraphics, #RasterList, #RasterMenu, #RasterSplitter,
 #RasterSprite, #RasterTabbar, #RasterTabItem, #RasterToolbar, #RasterTree,
 and #RasterTreeItem.

 @constructor

 @param parent         [value]: A string containing the ID of a DOM element,
                       a reference to a DOM element, or another control object.
                       If this argument is null, the control is created but not
                       attached to the DOM tree; <code>setParent()</code> must be
                       invoked later to specify the parent control.
 @param containerTag   [string]: Specifies the HTML tag used to surround the
                       content of this control. If this argument is omitted,
                       the "<code>div</code>" tag is used. Other possible
                       values include: "<code>span</code>", "<code>tr</code>",
                       "<code>li</code>" etc..
 *****************************************************************************/
function RasterControl( parent, containerTag )
{
    //a. create control container      
    this.containerTag = (containerTag || "div").toLowerCase();
    this.isVisible = true;
    this.isDisplayable = true;
    this.isFixed = false;
    this._x = 0;  //Keep track of last moveTo() position
    this._y = 0;


    this.controlBox = document.createElement( this.containerTag ); /** @property controlBox [object]: The DOM element used to box-in the the control.
                                                                                This element is made public for supporting advanced
                                                                                DOM tree manipulation operations not available through methods of
                                                                                the #RasterControl class. Tampering with this property might
                                                                                cause a control to stop working. Use this property at your
                                                                                own discretion.*/
    this.controlBox.rasterControl = this; /** @property rasterControl [expando]:
                                                        An expando added to the DOM element referenced by the #RasterControl's
                                                        <code>#controlBox</code> property (the RasterControl's <code>controlBox</code>
                                                        points to the containing element of any #RasterControl object: i.e. DIV, SPAN, TR, etc.)
                                                        <br><br>
                                                        <b>Note:</b> The <code>rasterControl</code> is an expando of the
                                                        <code>#controlBox</code> DOM element, NOT a property of #RasterControl object!
                                                        <br><br>
                                                        The <code>rasterControl</code> expando of the <code>controlBox</code>
                                                        element is used to find what the control object is parent to any
                                                        DOM element nested inside a RasterControl. For example if a 'click' event
                                                        happen in an element nested inside a RasterControl, you can find the
                                                        RasterControl object enclosing the area where the event happened by
                                                        searching up the DOM tree starting at the element where the 'click'
                                                        event happened until you find a parent element with a
                                                        <code>rasterControl</code> expando (i.e. the <code>rasterControl</code>
                                                        expando is a pointer back to the RasterControl instance).
                                                        <br><br>
                                                        <b>Example:</b>
                                                        <pre code>
                                                        function myClickHandler( event )
                                                        {
                                                            // get the element where the event happened
                                                            var element = Raster.srcElement( event );

                                                            // starting at 'element', look up the DOM tree
                                                            // for a parent with a 'rasterControl' expando
                                                            // and return the expando's value
                                                            var rasterControl =
                                                                   Raster.findParentExpando(element, "rasterControl");

                                                            // Did we find a match?
                                                            if ( rasterControl!=null )
                                                            {
                                                                // yes: do something with the control object
                                                                rasterControl.setVisible( false );
                                                            }
                                                            else
                                                            {
                                                                // no: the event did not happen inside
                                                                // a raster control
                                                            }
                                                        }
                                                        </pre>
                                                        <b>See also:</b><br>
                                                        Raster.findParentExpando()<br>
                                                        Raster.findParentWithExpando()
                                                        */
    
    this.controlBox.oncontextmenu = Raster.stopEvent;

    this.dropHandler = null;

    //Pevent drag start in IE
    if ( Raster.isIE )
    {
        this.controlBox.ondragstart  = Raster.stopEvent;
        this.controlBox.onselectstart  = Raster.stopEvent;
    }


    //b. attach this control to its parent (if any)
    if ( parent != null )
        this.setParent( parent );

    //c. for use in IE6
    this.iframeBackground = null;

   /** @property IID_CONTROL [boolean]: Interface ID tag constant used to identify #RasterControl objects.
                             This property is always true.*/
}
/*****************************************************************************
 Control Constants
 @private
 *****************************************************************************/
RasterControl.prototype.IID_CONTROL = true;


/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 Note that unless otherwise noted, any nested Control elements should be
 disposed perior to disposing their parent containers.
 *****************************************************************************/
RasterControl.prototype.dispose = function()
{
    if ( this.scrollHandler )
        Raster.removeListener( window, "scroll", this.scrollHandler );

    this.scrollHandler = null;

    this.controlBox.parentNode.removeChild( this.controlBox );
    this.controlBox.rasterControl = null;
    this.dropHandler = null;
    this.controlBox = null;
    this.iframeBackground = null;
    
    //out('Control disposed.');    
};


/*****************************************************************************
 Returns a reference to the DOM element that accepts content in this Control.
 Subclasses can overwrite this method to specify a different element to place
 content in.
 @return object: A DOM element that host the content of this control.
 *****************************************************************************/
RasterControl.prototype.getContentElement = function()
{
    return this.controlBox;
};


/*****************************************************************************
 Set the CSS class for this control's outer element. If not set the default
 The content element has to be styled via cascade using:
 <pre>
   cssClass rasterControlContent { ... }
 </pre>
 where cssClass is the value given in the argument.

 @param cssClass string: Name of the CSS class assigned to the outer most element
                 in this control.
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setClass = function( cssClass  )
{
    this.controlBox.className = cssClass;
    return this;
};


/*****************************************************************************
 Set the content of this control as a HTML string.
 @param innerHTML string: The HTML text
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setInnerHTML = function( innerHTML  )
{
    this.getContentElement().innerHTML = innerHTML;
    return this;
};


/*****************************************************************************
 Replaces or appends content to this control. The given src element or control
 object will be relocated from its current location in the DOM tree into this
 control's content area.

 @param src      value: One of the following: a string containing the ID of a DOM element,
                 a reference to a DOM element, or another control object.
 @param replace  [boolean]: true removes any child nodes currently
                 in the parent before inserting this control (default);
                 false appends this control's box to any existing child nodes
                 in the given parent.
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setContent = function( src, replace )
{
    var contentElement = this.getContentElement();
    replace = replace==null ? true : replace;

    Raster.setParent(src, contentElement, replace );
    return this;
};


/*****************************************************************************
 Removes an element from its current location in the DOM tree and inserts
 it as child a given parent element.

 @param parent   object: The new parent for the this control's box. This argument can
                 be one of the following: a string containing the ID of a DOM
                 element, a reference to a DOM element, or a Control
                 object. An error will occur if this argument is null.
 @param replace  [boolean]: true removes any child nodes currently
                 in the parent before inserting this control; false appends
                 this control's box to any existing child nodes in the
                 given parent (default).
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setParent = function( parent, replace )
{
    Raster.setParent( this.controlBox, parent, replace );
    return this;
};


/*****************************************************************************
 Removes this control's box from its current location in the DOM tree and
 inserts it before or after a given sibling element.

 @param sibling  [value]: The new sibling for the relocated element. This argument can
                 be one of the following: a string containing the ID of a DOM
                 element, a reference to a DOM element, or a Control
                 object. An error will occur if this argument is null.
 @param after    [boolean]: true moves this control's box after the
                 given sibling; false inserts this control's box before the
                 given sibling (default).
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setSibling = function( sibling, after )
{
    Raster.setSibling( this.controlBox, sibling, after );
    return this;
};


/*****************************************************************************
 Set the control's Width and Height.
 @param width  value: A number in pixels, a string having a percent value, or null to
               clear this value and use the browser's default.
 @param height value: A number in pixels, a string having a percent value, or null to
               clear this value and use the browser's default.
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setSize = function( width, height  )
{
    this.controlBox.style.width = (width!=null) ? (typeof(width)=="number" ? width+"px" : width) : "";
    this.controlBox.style.height = (height!=null) ? (typeof(height)=="number" ? height+"px" : height) : "";

    // Force opera to recompute layout
    if ( Raster.isOp )
        Raster.repaint( this.controlBox );
    
    return this;
};


/*****************************************************************************
 Set the control's X,Y position of this control in relation to its nearest
 positionable parent container.
 @param x            number: X position in pixels, or null to
                     clear this value and use the browser's default.
 @param y            number: Y position in pixels, or null to
                     clear this value and use the browser's default.
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.moveTo = function( x, y )
{
    this._x = x;
    this._y = y;

    // Emulate css fixed in quirksmode and IE6 
    if (  Raster.isIEQuirks || Raster.isIE6  )
    {
        if (this.isFixed)
        {
            if ( this.scrollHandler==null )
            {
                var control = this; //closure
                this.scrollHandler = function()
                {
                    control.controlBox.style.left = (document.documentElement.scrollLeft + document.body.scrollLeft  + control._x) + "px";
                    control.controlBox.style.top = (document.documentElement.scrollTop + document.body.scrollTop + control._y ) + "px";
                };

                Raster.addListener( window, "scroll", this.scrollHandler );
            }
            else // scrollHandler already exist? just set position
            {
                this.controlBox.style.left = (document.body.scrollLeft  + this._x) + "px";
                this.controlBox.style.top = (document.body.scrollTop + this._y ) + "px";
            }/*if*/
        }
        else // not fixed? remove scroll handler(if any), set position
        {
            if ( this.scrollHandler )
                Raster.removeListener( window, "scroll", this.scrollHandler );

            this.scrollHandler = null;
            this.controlBox.style.left = (x!=null) ? x+"px" : "";
            this.controlBox.style.top = (y!=null) ? y+"px" : "";
        }/*if*/
    }
    else // Compliant browser?, set position
    {
        this.controlBox.style.left = (x!=null) ? x+"px" : "";
        this.controlBox.style.top = (y!=null) ? y+"px" : "";
    }/*if*/

    return this;
};


/**********************************************************************
 Returns an object containing the upper-left corner (x,y) coordinates
 and dimmensions of this controls's outer-most box.

 @return  object: An object containing the upper-left corner (x,y) coordinates
          and dimmensions of the given element. The returned object has
          the following fields:
          <pre obj>
            x       Control's upper-left corner X coordinate.
            y       Control's upper-left corner Y coordinate.
            width   Control's width
            height  Control's height
          </pre>
 **********************************************************************/
RasterControl.prototype.getBounds = function()
{
    return Raster.getBounds( this.controlBox );
};


/*****************************************************************************
 Show the control box at the given (x,y)  with the given (width, height)
 dimmensions.

  @param x       number: the upper-left corner x coordinate
  @param y       number: the upper-left corner y coordinate
  @param width   number: the width of the control box
  @param height  number: the height of the control box

  @return object: The control object. This allow for chaining multiple setter methods in
          one single statement.
 *****************************************************************************/
RasterControl.prototype.setBounds = function( x, y, width, height )
{
    this.moveTo(x,y);
    this.setSize( width, height);

    return this;
};


/*****************************************************************************
 In IE6, an iframe backdrop element is created to prevent window controls from
 showing through absolute-positioned controls. This method does nothing if the
 current browser is not IE6. If an iframe element already exist in this
 control the method call is ignored.
 @private
 @param parent [object]: Alternate element to use as parent of the backdrop.
               If this argument is omitted, this.controlBox is used.
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.createIE6IframeBackdrop = function( parent )
{
    //Create an iframe backdrop in ie6
    if ( Raster.isIE6 && this.iframeBackground==null )
    {
        this.iframeBackground = document.createElement("IFRAME");
        this.iframeBackground.src = "javascript: ' '";
        this.iframeBackground.className = "rasterControlIframeBackdrop";

        (parent || this.controlBox).appendChild( this.iframeBackground );
    }/*if*/

    return this;
};


/*****************************************************************************
 Switches the control's base element <code>display</code> property between
 <code>none</code> and its <i>default</i> setting.

 @param isDisplayable boolean: False sets the control's base element
                      <code>display</code> property to <code>none</code>. True
                      restores the control's base element <code>display</code>
                      property back to its default.
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setDisplay = function( isDisplayable  )
{
    this.isDisplayable = isDisplayable;
    this.controlBox.style.display = isDisplayable ? "" : "none";
    return this;
};


/*****************************************************************************
 Switches the control's base element <code>visibility</code> property between
 <code>hidden</code> and its <i>default</i> setting.

 @param isVisible     boolean: False sets the control's base element
                      <code>visibility</code> property to <code>hidden</code>. True
                      restores the control's base element <code>visibility</code>
                      property back to its default.
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setVisible = function( isVisible  )
{
    this.isVisible = isVisible;
    this.controlBox.style.visibility = isVisible ? "" : "hidden";
    return this;
};


/*****************************************************************************
 Set the control's opacity. This method adjust the css opacity/filter
 property of the control box.
 @param percent  number: A number from 0 to 100
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setOpacity = function( percent )
{
    Raster.setOpacity(this.controlBox, percent );
    return this;
};


/*****************************************************************************
 Indicates if the control is placed using fixed or default positioning. When
 fixed is used the control keeps its place relative to the browser window and
 does not scroll with the document.
 @param isFixed  boolean: True indicates the control is positioned relative to
                 the window, and does not scroll with its parent content. False
                 cleals the control's position attribute allowing its inherited
                 CSS position value to take over (if any).
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setFixed = function( isFixed )
{
    this.isFixed = (isFixed===true);   //ensure boolean

    // For IE6 and Quirks, do dynamic implementation of Fixed
    if (Raster.isIEQuirks || Raster.isIE6 )
        this.moveTo( this._x,  this._y); //rewrite top/left as css expression
    else
        this.controlBox.style.position = isFixed ? "fixed" : "";

    return this;
};


/*****************************************************************************
 Specifies a user-defined event handler to be is notified when a mouse drag
 operation occurs over the control. The event handler will have the following
 signature:
 <pre code>
     function onDragDrop( rasterMouseEvent )
     {
        // process drag n' drop event
     }
 </pre>

 @see RasterMouse.startDrag(), RasterMouse.cancelDrag(), RasterEvent.accept()

 @param dropHandler function: Pointer to the drop and drop event handler function. Set
                    to null to remove any previously set handler.
 @return object: The control object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterControl.prototype.setDropHandler = function( dropHandler  )
{
    this.dropHandler = dropHandler;    
    return this;
};

