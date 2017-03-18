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
 Implements a graphic canvas for drawing basic shapes.
 @constructor
 @param parent      object: One of the following: a string containing the ID
                    of a DOM element, a reference to a DOM element, or another
                    control object. If this argument is null, the control is
                    created but not attached to the DOM tree; RasterControl.setParent() may
                    be invoked later to specify the parent control.
 @param width       number: width in pixels.
 @param height      number: height in pixels.
 @param bgcolor     [string]: A valid html color or RGB value in the format
                    #RRGGBB or #RGB. For a transparent background, omit or set
                    this argument to null.
 *****************************************************************************/
function RasterGraphics( parent, width, height, bgcolor )
{
    // call super()
    RasterControl.call( this, parent );
    this.isVML = Raster.isIE && !Raster.isIE9; //in IE9 we rather use canvas

    if ( this.isVML )
    {
        // Init VML namespace - once
        if ( !RasterGraphics.vmlReady )
        {
            document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
            RasterGraphics.vmlReady = true;
        }/*if*/

        this.controlBox.innerHTML = '<div style="width:' + width + '; height:' + height + '"></div>';
        this.canvas = this.controlBox.firstChild;
    }
    else
    {
        this.controlBox.innerHTML = '<canvas width="' + width + '" height="' + height + '"></canvas>';
        this.canvas = this.controlBox.firstChild;

    }/*if*/

    
    if ( bgcolor!=null )
        this.controlBox.style.background = bgcolor;

    this.controlBox.style.position = "relative";
    this.controlBox.style.overflow = "hidden";


    this.weight = 1;
    this.color = "black";
    this.fillColor = "black";
    this.width = width;
    this.height = height;
    this.ox = 0;
    this.oy = 0;
    this.setSize( width, height );
    this.setWeight( this.weight );
    this.setColor( this.color );
    this.setFillColor( this.fillColor );
    this.setOrigin( this.ox, this.oy );

     /** @property IID_GRAPHICS [boolean]: Interface ID tag constant used to identify #RasterGraphics objects.
                                 This property is always true.*/
}
/*****************************************************************************
 Globals, Constants, Implements the Control class
 @private
 *****************************************************************************/
RasterGraphics.prototype.IID_GRAPHICS = true;
Raster.implementIID ( RasterGraphics, RasterControl );


/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 Note that any control contained inside the dialog are not disposed by
 this method.
 *****************************************************************************/
RasterGraphics.prototype.dispose = function()
{
    this.canvas = null;
    
    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
};


/*****************************************************************************
 Set the center point of the canvas.
 @param ox  number: width in pixels.
 @param oy  number: height in pixels.
 @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterGraphics.prototype.setOrigin = function( ox, oy  )
{
    this.ox = ox;
    this.oy = oy;

    return this;
};


/*****************************************************************************
 Set the canvas width and height.
 @param width  number: width in pixels.
 @param height number: height in pixels.
 @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterGraphics.prototype.setSize = function( width, height  )
{
    this.width = width;
    this.height = height;

    RasterControl.prototype.setSize.call( this, width, height );

    if ( !this.isVML )
    {
        this.canvas.width = this.width;
        this.canvas.height = this.height;        
    }/*if*/

    return this;
};


/*****************************************************************************
 Set the stroke color used in future stroke operations.
 @param color  string: A valid html color or RGB value in the format #RRGGBB or #RGB.
 @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterGraphics.prototype.setColor = function( color  )
{
    this.color = color;
    if ( !this.isVML )
        this.canvas.getContext("2d").strokeStyle = this.color;
    return this;
};


/*****************************************************************************
 Set the fill color used in future fill operations.
 @param fillColor  string: A valid html color or RGB value in the format
                   #RRGGBB or #RGB.
 @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterGraphics.prototype.setFillColor = function( fillColor  )
{
    this.fillColor = fillColor;
    if ( !this.isVML )
        this.canvas.getContext("2d").fillStyle = this.fillColor;
    return this;
};

/*****************************************************************************
 Set the weight of the stroke.
 @param weight  number: Thickness of the stroke line in pixels.
 @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterGraphics.prototype.setWeight = function( weight  )
{
    this.weight = weight;
    if ( !this.isVML )
        this.canvas.getContext("2d").lineWidth = this.weight;
    return this;
};


/*****************************************************************************
 Clears the canvas.
 @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterGraphics.prototype.clear = function()
{
    if ( this.isVML )
        this.canvas.innerHTML = "";
    else
        this.canvas.getContext("2d").clearRect(0,0, this.width, this.height);

    return this;
};

/********************************************************************************************************
  Draw a line in the canvas using the current stroke style.
  @param x    number: start X point
  @param y    number: start Y point
  @param x2   number: end X point
  @param y2   number: end Y point
  @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 ********************************************************************************************************/
RasterGraphics.prototype.line = function( x, y, x2, y2 )
{

    if ( this.isVML )
    {
        var el = document.createElement("v:line");
        el.setAttribute( "from", (x+this.ox) + ',' + (y+this.oy) );
        el.setAttribute( "to", (x2+this.ox) + ',' + (y2+this.oy) );
        el.strokecolor = this.color;
        el.strokeweight =  this.weight;
        this.canvas.appendChild( el );

        //render vml fix for IE8, thanks http://www.lrbabe.com/?p=104
        if ( Raster.isIE8 )
            el.outerHTML = el.outerHTML;
    }
    else
    {
        var ctx = this.canvas.getContext("2d");
        //ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo( x+this.ox, y+this.oy );
        ctx.lineTo( x2+this.ox, y2+this.oy );
        ctx.stroke();

    }/*if*/

    return this;
};


/********************************************************************************************************
  Draw a rectangle in the canvas using the current stroke and fill styles.
  @param x      number: upper-left corner X point
  @param y      number: upper-left corner Y point
  @param x2     number: lower-right corner X point
  @param y2     number: lower-right corner Y point
  @param filled [boolean]: True fills the rectangle with the current fill color; false does not fill
                the rectangle.
 @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 ********************************************************************************************************/
RasterGraphics.prototype.rect = function( x, y, x2, y2, filled)
{
    var box = Raster.toRect( x+this.ox, y+this.oy, x2+this.ox, y2+this.oy );

    if ( this.isVML )
    {
        var el = document.createElement("v:rect");
        el.style.position = "absolute";
        el.style.left = box.x +"px";
        el.style.top = box.y +"px";
        el.style.width = box.width +"px";
        el.style.height =  box.height +"px";
      
        //el.style.cssText = 'left:'+box.x+'px;top:'+box.y+'px;width:'+box.width+'px;height:'+box.height+'px' ;
        el.strokecolor =  this.color;
        el.strokeweight = this.weight;
        el.fillcolor = this.fillColor;
        el.filled = filled===true ? "true" : "false";

        this.canvas.appendChild( el );

        //need this so RECT renders
        el.outerHTML = el.outerHTML;
    }
    else
    {
        var ctx = this.canvas.getContext("2d");

        if ( filled===true)
            ctx.fillRect(box.x, box.y, box.width, box.height);

        ctx.strokeRect(box.x, box.y, box.width, box.height);   
    }/*if*/

    return this;
};

/********************************************************************************************************
  Draw a circle in the canvas using the current stroke and fill styles.

  @param x      number: X center point
  @param y      number: Y center point
  @param r      number: radius
  @param filled [boolean]: True fills the ellipse with the current fill color; false does not fill
                the ellipse.
 @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 ********************************************************************************************************/
RasterGraphics.prototype.circle = function( x, y, r, filled)
{
    if ( this.isVML )
    {
        var el = document.createElement("v:oval");
        el.style.position = "absolute";
        el.style.left = (x-r+this.ox) +"px";
        el.style.top = (y-r+this.oy) +"px";
        el.style.width = (r*2) +"px";
        el.style.height = (r*2) +"px";

        //el.style.cssText = 'left:'+box.x+'px;top:'+box.y+'px;width:'+box.width+'px;height:'+box.height+'px' ;
        el.strokecolor =  this.color;
        el.strokeweight = this.weight;
        el.fillcolor = this.fillColor;
        el.filled = filled===true ? "true" : "false";

        this.canvas.appendChild( el );

        //need this so RECT renders
        el.outerHTML = el.outerHTML;
    }
    else
    {
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();

        ctx.arc(x+this.ox, y+this.oy, r, 0, 6.28, false);

        if ( filled===true )
        {
            ctx.fill();
            ctx.stroke();
        }
        else
            ctx.stroke();

    }/*if*/

    return this;

};

/********************************************************************************************************
  Draw a ellipse in the canvas using the current stroke and fill styles. The ellipse is drawn inside
  the box formed from the given x, y, x2, y2 coordinates.

  @param x      number: upper-left corner X point
  @param y      number: upper-left corner Y point
  @param x2     number: lower-right corner X point
  @param y2     number: lower-right corner Y point
  @param filled [boolean]: True fills the ellipse with the current fill color; false does not fill
                the ellipse.
 @return object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 ********************************************************************************************************/
RasterGraphics.prototype.ellipse = function( x, y, x2, y2, filled)
{
    var box = Raster.toRect( x+this.ox, y+this.oy, x2+this.ox, y2+this.oy );

    if ( this.isVML )
    {
        var el = document.createElement("v:oval");
        el.style.position = "absolute";
        el.style.left = box.x +"px";
        el.style.top = box.y +"px";
        el.style.width = box.width +"px";
        el.style.height =  box.height +"px";

        //el.style.cssText = 'left:'+box.x+'px;top:'+box.y+'px;width:'+box.width+'px;height:'+box.height+'px' ;
        el.strokecolor =  this.color;
        el.strokeweight = this.weight;
        el.fillcolor = this.fillColor;
        el.filled = filled===true ? "true" : "false";

        this.canvas.appendChild( el );

        //need this so RECT renders
        el.outerHTML = el.outerHTML;
    }
    else
    {
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();

        var centerX = box.x + box.width/2;
        var centerY = box.y + box.height/2;
        var controlRectWidth = box.width * 1.33;

        ctx.moveTo(centerX, centerY - box.height / 2);

        // draw left side
        ctx.bezierCurveTo(centerX - controlRectWidth / 2, centerY - box.height / 2,
                centerX - controlRectWidth / 2, centerY + box.height / 2,
                centerX, centerY + box.height / 2);

        // draw right side
        ctx.bezierCurveTo(centerX + controlRectWidth / 2, centerY + box.height / 2,
                centerX + controlRectWidth / 2, centerY - box.height / 2,
                centerX, centerY - box.height / 2);

        if ( filled===true )
        {
            ctx.fill();
            ctx.stroke();
        }
        else
            ctx.stroke();

    }/*if*/

    return this;
};



/********************************************************************************************************
 Draw a poly-line in the canvas using the current stroke and fill styles.
 @param points array: Array of 2-element-array objects containing the values in the path to be sketched.
               For example: <code>[ [x0,y0], [x1,y1], [x2,y2], [x4,y4], etc. ]</code>
 @param filled [boolean]: True fills the polygon with the current fill color; false does not fill
               the polygon.
 @return  object: The graphics object. This allow for chaining multiple setter methods in
         one single statement.
 ********************************************************************************************************/
RasterGraphics.prototype.polyline = function( points, filled )
{

    if ( this.isVML )
    {
        var buf = new Array();
        for ( var i=0; i < points.length; i++)
            buf.push( (points[i][0]+this.ox) + ',' + (points[i][1]+this.oy) );

        var el = document.createElement("v:polyline");
        el.points.value =  buf.join(" ");  //'points' is an object of some misterious kind; the expando 'values' contains the points
        el.strokecolor = this.color;
        el.strokeweight =  this.weight;
        el.fillcolor = this.fillColor;
        el.filled = filled===true ? "true" : "false";

        this.canvas.appendChild( el );
    }
    else
    {
        var ctx = this.canvas.getContext("2d");
 
        ctx.beginPath();
        ctx.moveTo( points[0][0]+this.ox, points[0][1]+this.oy );

        for ( var j=0; j < points.length; j++)
            ctx.lineTo( points[j][0]+this.ox, points[j][1]+this.oy );

        if ( filled===true )
        {
            ctx.fill();
            ctx.stroke();
        }
        else
            ctx.stroke();
    }/*if*/

    return this;
};