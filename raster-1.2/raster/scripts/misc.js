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
 Implements a positionable drop shadow rectangle.
 @constructor
 @private
 @param  parent [object]: DOM parent element. if this value is not specified
                <code>document.body</code> is used instead.
 *****************************************************************************/
function RasterShadowBox( parent )
{
    // call super()
    RasterControl.call( this, parent ||  document.body );
    this.controlBox.innerHTML = '<div class="rasterShadowBox0"></div>' +
                                '<div class="rasterShadowBox1"></div>' +
                                '<div class="rasterShadowBox2"></div>' +
                                '<div class="rasterShadowBox3"></div>';

    this.setClass("rasterShadowBox");
    this.setBounds (0, -2600, 100, 100);

   /** @property IID_SHADOWBOX [boolean]: Interface ID tag constant used to identify #RasterShadowBox objects.
                             This property is always true.*/
}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterShadowBox.prototype.IID_SHADOWBOX = true;
Raster.implementIID ( RasterShadowBox, RasterControl );


/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 *****************************************************************************/
RasterShadowBox.prototype.dispose = function()
{

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
};


//----------8<--------------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Implements a semi-transparent rectangular border used in drag and drop
 operations to mark the boundaries being moved or rezised.
 @constructor
 @private

 @param  parent [object]: DOM parent element. if this value is not specified
                <code>document.body</code> is used instead.
 *****************************************************************************/
function RasterBorderBox( parent )
{
    // call super()
    RasterControl.call( this, parent ||  document.body );
    this.controlBox.innerHTML = '<div class="t"></div><div class="r"></div>' +
                                '<div class="b"></div><div class="l"></div>';
    this.border = {};
    this.border.t = this.controlBox.childNodes[0];
    this.border.r = this.controlBox.childNodes[1];
    this.border.b = this.controlBox.childNodes[2];
    this.border.l = this.controlBox.childNodes[3];

    this.setClass("rasterBorderBox");
    this.setBounds (0, -2600, 100, 100);

   /** @property IID_BORDERBOX [boolean]: Interface ID tag constant used to identify #RasterBorderBox objects.
                             This property is always true.*/
}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterBorderBox.prototype.IID_BORDERBOX = true;
Raster.implementIID ( RasterBorderBox, RasterControl );


/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 *****************************************************************************/
RasterBorderBox.prototype.dispose = function()
{
    this.border.n = this.border.e = this.border.s = this.border.w = null;

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
};

/*****************************************************************************
 Specifies which borders of the box are visible.
 @param borders [string]: A String containing any combination of the following
                characters: 'tblr' where 't'=top 'b'=bottom, 'l'=left,
                and 'r'=right. If this argument is not set or is set null,
                all borders are turned on. Passing a empty string or other
                invalid characters will turn borders off. 
 *****************************************************************************/
RasterBorderBox.prototype.setBorders = function( borders )
{
    borders = borders || 'tblr';

    this.border.t.style.display = borders.indexOf('t') >= 0 ? "block" : "none";
    this.border.b.style.display = borders.indexOf('b') >= 0 ? "block" : "none";
    this.border.l.style.display = borders.indexOf('l') >= 0 ? "block" : "none";
    this.border.r.style.display = borders.indexOf('r') >= 0 ? "block" : "none";

};


/*****************************************************************************
 Set the box's Width and Height.
 @param width  number: width in pixels.
 @param height number: height in pixels
 *****************************************************************************/
RasterBorderBox.prototype.setSize = function( width, height  )
{
    RasterControl.prototype.setSize.call( this, width, height ); //super

    // Avoid dither dots in background image from creating a solid in
    // overlaping corners areas
    this.border.r.style.backgroundPosition = width % 2 != 0 ? "0 0" : "-1px 0";
    this.border.b.style.backgroundPosition = height % 2 != 0 ? "0 0" : "0 -1px";
};


/*****************************************************************************
 Show the border box over the given element.
 @param element object: Element to be highlighted
 *****************************************************************************/
RasterBorderBox.prototype.showOver = function( element )
{
    var rect = Raster.getBounds( element );
    this.setBounds( rect.x,  rect.y,  rect.width, rect.height );

};


/*****************************************************************************
 Moves the border box and hides it off-screen.
 *****************************************************************************/
RasterBorderBox.prototype.hide = function()
{
    this.setBounds( 0, -1600, 50, 50 );

};


//--8<---------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Implements a semi-transparent rectangular area used in drag and drop
 operations to mark an area being moved or resized.
 @constructor
 @private
 @param  parent [object]: DOM parent element. if this value is not specified
                <code>document.body</code> is used instead.
 *****************************************************************************/
function RasterShadeBox( parent )
{
    // call super()
    RasterControl.call( this, parent ||  document.body );

    this.setClass("rasterShadeBox");
    this.setBounds (0, -1600, 100, 100);

   /** @property IID_SHADEBOX [boolean]: Interface ID tag constant used to identify #RasterShadeBox objects.
                             This property is always true.*/
}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterShadeBox.prototype.IID_SHADEBOX = true;
Raster.implementIID ( RasterShadeBox, RasterControl );


/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 *****************************************************************************/
RasterShadeBox.prototype.dispose = function()
{

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
};


/*****************************************************************************
 Show the border box over the given element.
 @param element object: Element to be highlighted
 *****************************************************************************/
RasterShadeBox.prototype.showOver = function( element )
{
    var rect = Raster.getBounds( element );
    this.setBounds( rect.x,  rect.y,  rect.width, rect.height );

};


/*****************************************************************************
 Moves the border box and hides it off-screen.
 *****************************************************************************/
RasterShadeBox.prototype.hide = function()
{
    this.moveTo( 0, -2600 );

};


//-----8<----------------------------------------------------------------------------------------------------
/*****************************************************************************
 Draws a vertical or horizontal line used in drag and drop operations to
 indicate insertion point between items.
 @private
 @constructor

 @param  parent    [object]: DOM parent element. if this value is not specified
                   <code>document.body</code> is used instead.
 @param isVertical [boolean]: True sets the line orientation to vertical (default),
                   false set the orientation horizontal.
 *****************************************************************************/
function RasterInsertLine( parent, isVertical )
{
    // call super()
    RasterControl.call( this, parent ||  document.body );
    this.controlBox.innerHTML = '<div class="a"></div><div class="b"></div>';
    
    this.setLength( 50 );
    this.setOrientation( isVertical!==false );
    this.moveTo (0, -2600);

   /** @property IID_INSERTIONLINE [boolean]: Interface ID tag constant used to identify #RasterInsertLine objects.
                             This property is always true.*/
}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterInsertLine.prototype.IID_INSERTIONLINE = true;
Raster.implementIID ( RasterInsertLine, RasterControl );


/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 *****************************************************************************/
RasterInsertLine.prototype.dispose = function()
{
    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
};


/*****************************************************************************
 Set the orientation of the insertion line and optionally the length.
 @param isVertical boolean: True sets the line orientation to vertical, false
                   set the orientation horizontal.
 @param length     [number]: length of the insertion line.
 *****************************************************************************/
RasterInsertLine.prototype.setOrientation = function( isVertical, length )
{
    this.isVertical = isVertical;
    this.setClass( isVertical ? "rasterInsertionLineV" : "rasterInsertionLineH");
    this.setLength( length==null ? this.length : length ); //refresh dimmensions
};


/*****************************************************************************
 Set the length of the insertion line.
 @param length number: length of the insertion line.
 *****************************************************************************/
RasterInsertLine.prototype.setLength = function( length )
{
    this.length = length;
    if ( this.isVertical )
        this.setSize( 2, length );
    else
        this.setSize( length, 2 );

};


/*****************************************************************************
 Moves the insertion line off-screen.
 *****************************************************************************/
RasterInsertLine.prototype.hide = function()
{
    this.moveTo( 0, -2600 );

};


//--8<---------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Wrapper for a textarea that behaves like a output console. This control
 takes 100% the area of the containing parent.
 @private
 @param  parent [object]: DOM parent element.
 *****************************************************************************/
function RasterConsole( parent )
{
    // call super()
    RasterControl.call( this, parent );
    this.controlBox.style.width = "100%";
    this.controlBox.style.height = "100%";

    // In Strict mode, ie7 and ie6 does not allow height:100% in a textarea
    // so the workaround is to create a iframe document in quiks mode having the texarea
    if ( !Raster.isIEQuirks && ( Raster.isIE6 || Raster.isIE7) )
    {
        var name = "console" + (Raster.idSequence++);
        var s = "<html><body style='border:0;margin:0;overflow:hidden;'>" +
                "<textarea style='width:100%;height:100%;border:0;position:absolute;top:0;left:0;overflow:auto;font-size:8pt'>" +
                "</textarea></body></html>";

        var iframe = document.createElement("IFRAME");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.borderWidth = "0";
        iframe.setAttribute( "src", 'javascript: ""'); //prevent https:// warning
        iframe.setAttribute( "id", name );

        document.body.appendChild( iframe );                       //need to add to BODY first
        frames[ name ].document.open();                            //so iframe appears in frames[] array
        frames[ name ].document.write( s );
        frames[ name ].document.close();

        this.textarea = frames[ name ].document.body.firstChild;
        Raster.setParent( iframe, this.controlBox );               //then relocate to desired area
    }
    else
    {
        this.controlBox.innerHTML = "<textarea style='width:100%;height:100%;resize: none;" +
                                    "margin:0;padding:0;border:none; overflow:auto;font-size:8pt'></textarea>";
        this.textarea = this.controlBox.firstChild;
    }/*if*/
        
   /** @property IID_CONSOLE [boolean]: Interface ID tag constant used to identify #RasterConsole objects.
                             This property is always true.*/
}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterConsole.prototype.IID_CONSOLE = true;
Raster.implementIID ( RasterConsole, RasterControl );


/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 *****************************************************************************/
RasterConsole.prototype.dispose = function()
{
    this.textarea = null;

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
};


/*****************************************************************************
 Outputs text to the console with CRLF.
 @param text string:Text to be printed in the console
 *****************************************************************************/
RasterConsole.prototype.println = function( text )
{
    this.print( text + "\n");
};


/*****************************************************************************
 Outputs text to the console without CRLF.
 @param text string:Text to be printed in the console
 *****************************************************************************/
RasterConsole.prototype.print = function( text )
{
    this.textarea.value += text;
    this.textarea.scrollTop = this.textarea.scrollHeight;
};


/*****************************************************************************
 Clears the console.
 *****************************************************************************/
RasterConsole.prototype.clear = function()
{
    this.textarea.value = "";
};


/*****************************************************************************
 Returns the text in the console.
 @return string: the text in the console.
 *****************************************************************************/
RasterConsole.prototype.getText = function()
{
    return this.textarea.value;
};

/*****************************************************************************
 Sets the text value of the console.
 @param text string:Text to be printed in the console
 *****************************************************************************/
RasterConsole.prototype.setText = function( text )
{
    this.textarea.value = text;
};
