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
 Implements a rectangular area that shifts its background image's position to
 make visible specific region of the background.

 An <code>image</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.
 @constructor

 @param image        string: Either a string containing URL of an image file, or
                     an object that implements the IID_SPRITEINFO interface.

 @param width       number: Specifies the width of this sprite
 @param height      number: Specifies the height of this sprite
 *****************************************************************************/
function RasterSprite( image, width, height )
{
    // call super()
    RasterControl.call( this, null,  "span" );
    this.controlBox.innerHTML = "<span class='spritesContainer'><img src='' style='border:0' /></span>";

    this.spritesContainer = this.controlBox.firstChild;
    this.imageTag = this.spritesContainer.firstChild;

    //There is a bug in IE7/8 - AlphaImageLoader bleeds out the hidden border by a pixel
    //The solution is either reduce here the width and height by a pixel, or create a
    //trasparent spacing of 2px between sprites in the compound image so AlphaImageLoader
    //bleeds into transparent pixels. Raster sprites images use the 2px gap option.
    //    if ( Raster.isIE7 || Raster.isIE8  )
    //    {
    //        width--;
    //        height--;
    //    }


    this.setClass("rasterSprite");
    this.setSize( width, height );  //in super
    this.setImage( image );

   /** @property IID_SPRITE [boolean]: Interface ID tag constant used to identify #RasterSprite objects.
                             This property is always true.*/
}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterSprite.prototype.IID_SPRITE = true;
Raster.implementIID ( RasterSprite, RasterControl );


/*****************************************************************************
 Releases and removes all DOM element references used by the sprite from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 *****************************************************************************/
RasterSprite.prototype.dispose = function()
{
    this.spritesContainer = null;   
    this.imageTag = null;

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );

    //out('Sprite disposed.');        
};

/*****************************************************************************
 Specifies the image displayed in this control. The argument can point to a
 single image file URL or be an instance of the IID_SPRITEINFO interface.
 Note: Use the RasterControl.setSize() method to specify the viewable area of this control.

 An <code>image</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.


 @param image        string: Either a string containing URL of an image file, or
                     an object that implements the IID_SPRITEINFO interface.
 @param resize      [boolean]: True makes the sprite's control to be resized
                    to the size of <code>image</code>. This works only when
                    <code>image</code> is of type IID_SPRITEINFO. False
                    preserves the sprite's control current size (default).
 @return object: The sprite object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterSprite.prototype.setImage = function( image, resize )
{
    this.setDisplay( image!=null ); //in super

    if ( image==null )
        return this;

    this.path = Raster.toImgUrl( image.IID_SPRITEINFO ? image.filename : image );
    this.isPNG = /.*\.png$/i.test( this.path );


    //a. Determine image name and offset
    var dx=0, dy=0;

    if ( image.IID_SPRITEINFO )
    {
        dx = image.x;
        dy = image.y;

        if ( resize===true )
            this.setSize( image.w, image.h );  //in super
    }/*if*/

    //b. Apply image name and offset to content div
    if ( Raster.isIE6 )
        if ( this.isPNG )
        {
            this.spritesContainer.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.path + "')";
            this.imageTag.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=0)";  /*magic trick for IE to support pretty opacity in a AlphaImageLoader overlay*/
        }
        else
        {
            this.spritesContainer.style.filter = "";
            this.imageTag.style.filter = "";
        }

    this.imageTag.src = this.path;
    this.spritesContainer.style.left = dx==0 ? "0" : "-" + dx + "px";
    this.spritesContainer.style.top =  dy==0 ? "0" : "-" + dy + "px";

    return this;
};


/*****************************************************************************
 Set the control's opacity. This method adjust the css opacity/filter
 property of this sprite's image.
 @param percent  number: A number from 0 to 100
 @return object: The sprite object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterSprite.prototype.setOpacity = function( percent )
{
    if ( this.isPNG && !Raster.isCSSCompliant ) //All IE8 or earlier mess up opacity on PNG, thus AlphaImageLoader is used to overwrite the default image loader
    {
        this.spritesContainer.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.path + "') " +
                                             "progid:DXImageTransform.Microsoft.Alpha(opacity=" + percent + "); ";
        this.imageTag.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=0)";  /*magic trick for IE to support pretty opacity in a AlphaImageLoader overlay - prevents ugly black edges*/
    }
    else
        Raster.setOpacity(this.spritesContainer, percent );

    return this;
};


/*****************************************************************************
 Returns the raw html structure of a sprite. This is used to insert the Sprite
 code inline in a HTML stream that has not yer been rendered by the browser.
 @private

 @param image        value: Either a string containing URL of an image file, or
                     an object that implements the IID_SPRITEINFO interface.
                     A URL might be prefixed by Raster resource-folder tag. The prefix
                     "IMG:" is replaced with the current raster/images location, for example:
                     "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
                     is replaced with the current css themes images location, for example:
                     "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

                     Do not place a "/" between the prefix and the rest of the URL, as a forward slash
                     will be inserted automatically. For configuring the
                     RASTER_HOME and THEME use the Raster.config() method.
 @param width       number: Specifies the width of this sprite
 @param height      number: Specifies the height of this sprite
 @param opacity     [number]: A number from 0 to 100 (default).
 *****************************************************************************/
RasterSprite.asHtml = function( image, width, height, opacity)
{
    var display = image==null ? "display:none;" : "";

    image = image || "";
    width = width || "0";
    height = height || "0";

    var left = image.IID_SPRITEINFO ?  "-" + image.x + "px" : "0";
    var top = image.IID_SPRITEINFO ? "-" + image.y + "px" : "0";
    var path = Raster.toImgUrl( image.IID_SPRITEINFO ? image.filename : image );

    var isPNG = /.*\.png$/i.test( path );
    var useAlphaLdr = (isPNG && Raster.isIE6) || ( isPNG && Raster.isIE && opacity < 90 );

    var ifilter = useAlphaLdr ? " filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0); " : "";
    var sfilter = useAlphaLdr ? " filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + path + ") " : "";

    if ( opacity!=null && opacity < 90 )
        sfilter += (isPNG && Raster.isIE) ? " progid:DXImageTransform.Microsoft.Alpha(opacity=" + opacity + "); " :
                                            " opacity:"+ (opacity / 100) + ";";

    return  "<span class='rasterSprite' style='" + display + "width:" + width + "px; height:" + height + "px'>" +
                "<span class='spritesContainer' style='left:" + left + "; top:" + top + ";" + sfilter + "'>" +
                    "<img src='" + path + "' style='border:0;" + ifilter + "' />" +
                "</span>" +
            "</span>";
};


/*****************************************************************************
 Updates a sprite directly in the DOM tree. It is assumed the sprite DOM
 element was created from Html text returned from the asHtml() function.
 @private
 @param span        object: Pointer to the base SPAN element of a Sprite
 @param image        value: Either a string containing URL of an image file, or
                     an object that implements the IID_SPRITEINFO interface.
                     A URL might be prefixed by Raster resource-folder tag. The prefix
                     "IMG:" is replaced with the current raster/images location, for example:
                     "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
                     is replaced with the current css themes images location, for example:
                     "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

                     Do not place a "/" between the prefix and the rest of the URL, as a forward slash
                     will be inserted automatically. For configuring the
                     RASTER_HOME and THEME use the Raster.config() method.
 @param width       number: Specifies the width of this sprite
 @param height      number: Specifies the height of this sprite
 *****************************************************************************/
RasterSprite.setImage = function( span, image, width, height )
{
    span.style.display = image==null ? "none" : "";

    if ( image==null )
        return;

    var spritesContainer = span.firstChild;
    var imageTag = spritesContainer.firstChild;

    var path = Raster.toImgUrl( image.IID_SPRITEINFO ? image.filename : image );
    var isPNG = /.*\.png$/i.test( path );


    //b. Apply image name and offset to content div
    if ( Raster.isIE6 )
        if ( isPNG )
        {
            spritesContainer.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "')";
            imageTag.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=0)";  /*magic trick for IE to support pretty opacity in a AlphaImageLoader overlay*/
        }
        else
        {
            spritesContainer.style.filter = "";
            imageTag.style.filter = ""; 
        }

    imageTag.src = path;
    spritesContainer.style.left = image.IID_SPRITEINFO ? "-" + image.x + "px" : "0";
    spritesContainer.style.top =  image.IID_SPRITEINFO ? "-" + image.y + "px" : "0";

};


/*****************************************************************************
 Updates a sprite opacity directly in the DOM tree. It is assumed the sprite DOM
 element was created from Html text returned from the asHtml() function.
 @private
 @param span        object: Pointer to the base SPAN element of a Sprite
 @param opacity     number: A number from 0 to 100 (default).
 *****************************************************************************/
RasterSprite.setOpacity = function( span, opacity)
{
    var spritesContainer = span.firstChild;
    var imageTag = spritesContainer.firstChild;

    var path = imageTag.src;
    var isPNG = /.*\.png$/i.test( path );

    if ( isPNG && !Raster.isCSSCompliant ) //All IE8 or earlier mess up opacity on PNG, thus AlphaImageLoader is used to overwrite the default image loader
    {
        spritesContainer.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "') " +
                                             "progid:DXImageTransform.Microsoft.Alpha(opacity=" + opacity + "); ";
        imageTag.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=0)";  /*magic trick for IE to support pretty opacity in a AlphaImageLoader overlay - prevents ugly black edges*/
    }
    else
        Raster.setOpacity(spritesContainer, opacity );

};
