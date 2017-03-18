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

/********************************************************************************************
 Represents an item in a #RasterList control. List items are not created by using this
 constructor directly, but rather using of the RasterList.add() method.

 The following code creates a grid list control inside a document element
 with an <code>id</code> of "listDiv", adds an item, and marks it as "disabled":
 <pre code>
    var list = new RasterList( "listDiv", "grid" );

    var item = list.add( null, ICONS32.GRAPHICS, null, "Customize" );
    item.setEnabled( false );
    ...
 </pre>

 @constructor
 @see RasterList.add(), RasterList(), ICONS16, ICONS32

 @param listControl       object: A List object that owns this item.
 @param index             number: Index of this item in the list.
 @param icon              value: String containing path of a 16x16 image file
                          or an object that implements the IID_SPRITEINFO interface
                          such as those in #ICONS16. This icon is displayed when
                          the list is in "list" and "table" modes. Set to null if no
                          small icon is desired.
 @param icon32            value: String containing path of a 32x32 image file
                          or an object that implements the IID_SPRITEINFO interface
                          such as those in #ICONS32. This icon is displayed when
                          the list is in "grid" mode. If this icon is not provided,
                          the <code>icon16</code> is used if available. Set to null
                          or omit if no large icon display is needed.
 @param thumbnail         string: Path of a thumbnail image file.
                          If the image given is bigger than the thumbnail size specified
                          during the #List constructor, clipping will occur. This image
                          is displayed when the list is in "thumbnails" mode. Set to
                          null or omit if no thumbnail display is needed.
 @param data              any: Define one or more values to be display in this list item.
                          Multiple values are given as a array. Values are typically
                          strings, but may be of any type. The toString() method is used
                          to convert values to text. Null values display as a empty string "".
 @param value             [any]: Define any program-specific value to be associated with this
                          item, such as a primary-key or other server side unique-ID.
 ********************************************************************************************/
function RasterListItem( listControl, index, icon, icon32, thumbnail, data, value )
{
    // Set default properties
    this.index = index;
    this.listControl = listControl; /**@property listControl [object]: Reference to the list control that owns the item. */

    this.data = Raster.isArray( data ) ? data.slice(0) : [data];
    this.text = this.data[0];    /**@property text [string]: Text displayed in the list item. To change the text in the list item use setText().*/
    this.icon = icon;            /**@property icon [string]: The list item's 16x16 icon. String containing path of an image file relative or an object that implements the IID_SPRITEINFO interface.
                                                    This property might be null. To set the list item's icon use setIcon().*/
    this.icon32 = icon32;        /**@property icon32 [string]: The list item's 32x32 icon. String containing path of an image file or an object that implements the IID_SPRITEINFO interface.
                                                    This property might be null. To set the list item's icon use setIcon32().*/
    this.thumbnail = thumbnail;  /**@property thumbnail [value]: The list item's thumbnail image. String containing path of an image file.
                                                    This property might be null. To set the list item's thumbnail use setThumbnail().*/

    this.value = value;          /**@property value any: Define any program-specific value to be associated with this
                                                         item, such as a primary-key or other server side unique-ID.*/

    this.isEnabled = true;       /**@property isEnabled [boolean]: True if the list item is in enabled state, false otherwise. To change the enabled state use setEnabled().*/
    this.isSelected = false;     /**@property isSelected [boolean]: True if the list item is in selected state, false otherwise. To change the select state use select().*/


                                 /** @property IID_LISTITEM [boolean]: Interface ID tag constant used to identify #RasterListItem objects.
                                                             This property is always true.*/
}
/*****************************************************************************
 Statics
 @private
 *****************************************************************************/
RasterListItem.prototype.IID_LISTITEM = true;


/*****************************************************************************
 Returns the containing DOM element of this item.
 @private
 *****************************************************************************/
RasterListItem.prototype.getItemElement = function( )
{
    if ( this.listControl.isTable )
        return this.listControl.dataBody.rows[ this.index ];
    else
        return this.listControl.contentDiv.childNodes[ this.index ];
};


/*****************************************************************************
 Updates the tree item's display according to its internal state.
 @private
 *****************************************************************************/
RasterListItem.prototype.updateStyle = function( )
{
    var container = this.getItemElement();
    if ( container==null )
        return;

    var cssClass = !this.isEnabled  ? "rasterListItemDisabled" : ( this.isSelected ? "rasterListItemSelected" : "" );
    var list = this.listControl;

    if ( list.isList )
        container.childNodes[1].className = cssClass;  //a <A/> element

    else if ( list.isGrid )
        container.firstChild.className = cssClass;  //a <A/> element

    else if ( list.isThumbs )
        container.firstChild.className = cssClass;  //a <A/> element

    else if ( list.isTable )
    {
        container.className = (this.listControl.isAltRows && this.index % 2 == 0 ? "rasterTableListAltRow " : "") + cssClass;  // a <TR/> element

        if ( Raster.isOp ) //without this opera doesn't refresh the TR > TD border colors
            Raster.repaint( container );
    }

};


/*****************************************************************************
 Changes the appearance of this list item between selected/normal. This style
 is not shown when the command item is 'disabled' state. This method is for
 internal use only.
 @private
 @param isSelected boolean: True shows command item in selected state, false shows
                   it normal.
 @return object: The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.markSelected = function( isSelected )
{
    this.isSelected = isSelected;
    this.updateStyle();

    return this;
};


/*****************************************************************************
 Specifies if an item is enabled or disabled. When an item is in disabled mode,
 the item will generate "click" events, but will not be selected.
 @param isEnabled boolean: True shows command normal, false greys out
                  the icon & text.
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.setEnabled = function( isEnabled )
{
    if ( !isEnabled && this.isSelected )
        this.listControl.unselectItem( this );

    this.isEnabled = isEnabled;

    this.updateStyle();
    this.updateIcon();
    return this;
};


/*****************************************************************************
 Include this item in the list selection.
 @param replace  [boolean]: false adds the given item to the current list
                 selection (if any). When true, the previously list selection
                 is cleared before the given item is selected (default).
 @param inRange  [boolean]: True select all the items in range from the last
                 selected item to the given item; false selects one item (default).
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.select = function( replace, inRange )
{
    this.listControl.selectItem( this, replace, inRange );
    return this;
};


/*****************************************************************************
 Removes this item from the list the selection (if selected).
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.unselect = function()
{
    this.listControl.unselectItem( this );
    return this;
};


//----------8<-----------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Sets the text displayed in this list item.
 @param text  string: Text shown in the list item; set to null if no text is desired.
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.setText = function( text )
{
    this.text = text;
    this.setData(0, text);
    return this;
};


/*****************************************************************************
 Changes the value of data element in a list item.
 @param dataIdx  number: zero-based index of the data element to assign a value to.
                 NOTE: this value refers to the <code>data</code> array of the item
                 object, NOT A index of a table list column. If the data element
                 being changed is referenced by a table list column, the table
                 will also reflect the change.
 @param value    any: Value to be set
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.setData = function( dataIdx, value )
{
    this.data[ dataIdx ] = value;

    var container = this.getItemElement();
    if ( container==null )
        return this;

    var list = this.listControl;
    value = RasterStrings.formatDate( value || "&nbsp;" ); // convert to "mm/dd/yyyy" (if applies)

    if ( list.isList && dataIdx==0 )
        container.childNodes[1].lastChild.innerHTML = value + "";  //a <A>.<SPAN> element

    else if ( list.isGrid && dataIdx==0 )
        container.firstChild.lastChild.innerHTML = value + "";  //a <A>.<SPAN> element

    else if ( list.isThumbs && dataIdx==0 )
        container.firstChild.lastChild.innerHTML = value + "";  //a <A>.<SPAN> element

    else if ( list.isTable && list.data2Col && list.data2Col[ dataIdx ] < container.cells.length )
    {
        var colno = list.data2Col[ dataIdx ];
        var cellContent =  Raster.isIE ? container.cells[ colno ].firstChild : container.cells[ colno ]; //IE has a span nested in each cell

        if ( colno==0 )
           cellContent.lastChild.innerHTML = value + "";
        else
           cellContent.innerHTML = value + "";
    }

    return this;
};


/*****************************************************************************
 Update the item content to reflect a change in the item's icon. This function
 is meant to be invoked after an item icon has changed.
 @private
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.updateIcon = function()
{
    var el = this.getItemElement();
    if ( el==null )
        return this;

    var list = this.listControl;

    if ( list.isList )
        el.innerHTML = this.listItemHtml( true );

    else if ( list.isGrid )
        el.innerHTML = this.gridItemHtml( true );

    else if ( list.isThumbs )
        el.innerHTML = this.thumbItemHtml( true );

    else if ( list.isTable && list.columns && list.columns.length > 0 )
    {
        //                             TR.TD  .DIV(trim) .SPAN      .SPAN#SPRITE: TR.TD      .SPAN      .SPAN#SPRITE
        var sprite = Raster.isIE ? el.cells[0].firstChild.firstChild.firstChild : el.cells[0].firstChild.firstChild;

        RasterSprite.setImage( sprite, this.icon, 16, 16 );
        RasterSprite.setOpacity( sprite, this.isEnabled ? 100 : 33 );
    }

    return this;
};


/*****************************************************************************
 Sets the 16x16 icon displayed in the "list" and "table" modes.

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
              the constants in the #ICONS16 object. Set to
              null if no icon needed.
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.setIcon = function( icon )
{
    this.icon = icon;
    this.updateIcon();
    return this;
};

/*****************************************************************************
 Sets the 32x32 icon displayed in the "grid" mode.

 The <code>icon32</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.


 @param icon32  string: String containing path of a 32x32 image file
                or an object that implements the IID_SPRITEINFO interface such as
                the constants in the #ICONS32 object. Set to
                null to remove any large icon.
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.setIcon32 = function( icon32 )
{
    this.icon32 = icon32;
    this.updateIcon();
    return this;
};


/*****************************************************************************
 Sets the image displayed in the "thumbs" mode.
 @param thumbnail   value: String containing path of an image. Set to
                    null to remove any previously set image.
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.setThumbnail = function( thumbnail )
{
    this.thumbnail = thumbnail;
    this.updateIcon();
    return this;
};


//-----------8<---------------------------------------------------------------------------------------------------------------------------
/*************************************************************************
 Returns html for list item dom structure
 @param  innerHtmlOnly [boolean]: Set to true to return the item's inner
                       HTML only (excluding outtermost container); false
                       returns entire item DOM structure. InnerHtml is used
                       only when the item's icon/image is changed.
 @private
 @return string: Html structure for the list item.
 *************************************************************************/
RasterListItem.prototype.listItemHtml = function( innerHtmlOnly )
{
    var selStyle = !this.isEnabled  ? "rasterListItemDisabled" : ( this.isSelected ? "rasterListItemSelected" : "" );
    var text = RasterStrings.formatDate( this.text || "&nbsp;" ); // convert to "mm/dd/yyyy" (if applies)

    var innerHtml = "<span class='rasterListItemIco'>" + RasterSprite.asHtml(this.icon, 16, 16, this.isEnabled ? 100 : 33 ) + "</span>" +
                    "<a href='#' onclick='this.blur(); return false;' class='" + selStyle + "'>" +
                        "<span class='rasterBkleft'></span>" +
                        "<span class='rasterBkright'></span>" +
                        "<span class='rasterListItemTxt'>" + text + "</span>" +
                    "</a>";

    if ( innerHtmlOnly===true )
        return innerHtml;
    else
        return  "<div class='rasterListItem' __iidx='"+this.index+"'>" + innerHtml + "</div>";
};


/*************************************************************************
 Returns html for grid item dom structure.
 @param  innerHtmlOnly [boolean]: Set to true to return the item's inner
                       HTML only (excluding outtermost container); false
                       returns entire item DOM structure. InnerHtml is used
                       only when the item's icon/image is changed.
 @private
 @return string: Html structure for the grid item.
 *************************************************************************/
RasterListItem.prototype.gridItemHtml = function( innerHtmlOnly )
{
    var sprite;
    var icoStyle = "rasterListItemIco";
    var selStyle = !this.isEnabled  ? "rasterListItemDisabled" : ( this.isSelected ? "rasterListItemSelected" : "" );

    if ( this.icon32 != null  )
    {
        sprite = RasterSprite.asHtml(this.icon32, 32, 32, this.isEnabled ? 100 : 33 );
    }
    else if ( this.icon != null )
    {
        sprite = RasterSprite.asHtml(this.icon, 16, 16, this.isEnabled ? 100 : 33 );
        icoStyle = "rasterListItemIco16";
    }
    else
    {
        sprite = RasterSprite.asHtml( null );
        icoStyle = "rasterListItemIco32";
    }

    var text = RasterStrings.formatDate( this.text || "&nbsp;" ); // convert to "mm/dd/yyyy" (if applies)

    var innerHtml = "<a href='#' onclick='this.blur(); return false;' class='" + selStyle + "'>" +
                        "<span class='rasterBkbottom'></span>" +
                        "<span class='rasterBktop'></span>" +
                        "<span class='" + icoStyle + "'>" + sprite + "</span>" +
                        "<br />" +
                        "<span class='rasterListItemTxt'>" + text + "</span>" +
                    "</a>";

    if ( innerHtmlOnly===true )
        return innerHtml;
    else
        return  "<span class='rasterGridListItem' __iidx='"+this.index+"'>" + innerHtml + "</span>";
};


/*************************************************************************
 Returns html for thumb item dom structure
 @param  innerHtmlOnly [boolean]: Set to true to return the item's inner
                       HTML only (excluding outtermost container); false
                       returns entire item DOM structure. InnerHtml is used
                       only when the item's icon/image is changed.
 @private
 @return string: Html structure for the thumb item.
 *************************************************************************/
RasterListItem.prototype.thumbItemHtml = function( innerHtmlOnly )
{
    var imgHtml;
    var selStyle = !this.isEnabled  ? "rasterListItemDisabled" : ( this.isSelected ? "rasterListItemSelected" : "" );
    var opacity = this.isEnabled ? "" : ( Raster.isIE ? "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=33);" : "opacity: .33;" );
    var thumbSz = this.listControl.thumbsize;

    if ( this.thumbnail != null  )
        imgHtml = "<img class='rasterThumbnail' src='" + this.thumbnail + "' " +
                    (    !(Raster.isIE6 || Raster.isIEQuirks)
                    ? "style='" + opacity + ";max-width:" + thumbSz + "px; max-height:" + thumbSz + "px;' />"
                    : "style='" + opacity + ";width:expression(this.width > " + thumbSz + " ? \"" + thumbSz + "px\" : true);" +
                      "height:expression(this.height > " + thumbSz + " ? \"" + thumbSz + "px\" : true);" +
                      "margin-top: expression( (" + thumbSz + " - this.height) / 2 )' />" );

    else if ( this.icon32 != null  )
        imgHtml = RasterSprite.asHtml(this.icon32, 32, 32, this.isEnabled ? 100 : 33 );

    else if ( this.icon != null )
        imgHtml = RasterSprite.asHtml(this.icon, 16, 16, this.isEnabled ? 100 : 33 );

    else
        imgHtml = RasterSprite.asHtml( null );

    var text = RasterStrings.formatDate( this.text || "&nbsp;" ); // convert to "mm/dd/yyyy" (if applies)
    var innerHtml =  "<a href='#' onclick='this.blur(); return false;' class='" + selStyle + "'>" +
                        "<span class='rasterListItemThumb' style='width:" + thumbSz + "px;" +
                              "height:" + thumbSz + "px;line-height:" + thumbSz + "px;'>" + imgHtml +
                              "&nbsp;</span>" +
                        "<br />" +
                        "<span class='rasterListItemTxt'>" + text + "</span>" +
                     "</a>" ;

    if ( innerHtmlOnly===true )
        return innerHtml;
    else
        return  "<span class='rasterThumbListItem' __iidx='"+this.index+"'>" +
                   innerHtml +
                "</span>";
};


/*************************************************************************
 Returns html for table item dom structure
 @private
 @return string: Html structure for the table row item.
 *************************************************************************/
RasterListItem.prototype.tableItemHtml = function()
{
    var rowClass = (this.listControl.isAltRows && this.index % 2 ==0 ? "rasterTableListAltRow " : "") +
                   (!this.isEnabled  ? "rasterListItemDisabled" : ( this.isSelected ? "rasterListItemSelected" : "" ));
    var buf = [];

    if ( this.listControl.columns && this.listControl.columns.length > 0 )
    {
        // column 0
        var data = RasterStrings.formatDate( this.data[this.listControl.columns[0].dataIdx] || "&nbsp;" ); // convert to "mm/dd/yyyy" (if applies)
        buf.push( "<td __coln='0'>" +
                       RasterList.SURROUND[0] +
                       "<span class='rasterListItemIco'>" +
                          RasterSprite.asHtml(this.icon, 16, 16, this.isEnabled ? 100 : 33 ) +
                       "</span><span>" +
                          data +
                       "</span>" +
                       RasterList.SURROUND[1] +
                  "</td>" );

        // remaining columns
        for ( var i=1; i < this.listControl.columns.length; i++)
        {
            data = RasterStrings.formatDate( this.data[this.listControl.columns[i].dataIdx] || "&nbsp;" ); // convert to "mm/dd/yyyy" (if applies)

            buf.push( "<td  __coln='" + i + "'>" +
                           RasterList.SURROUND[0] + data + RasterList.SURROUND[1] +
                      "</td>" );
        }/*for*/
    }
    return "<tr __iidx='"+this.index+"' class='" + rowClass + "'>" + buf.join("") + "</tr>";
};


/*****************************************************************************
 Renders this item and appends the resulting HTML fragment at the bottom of
 the given parent container.
 @private
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.rasterize = function()
{
    var list = this.listControl;
    var selStyle = !this.isEnabled  ? "rasterListItemDisabled" : ( this.isSelected ? "rasterListItemSelected" : "" );

    if ( !list.isTable )  // for list, grid, thumbs
    {
        RasterListItem.frag = RasterListItem.frag || document.createElement("DIV");  //reusable, global DIV container html factory
        RasterListItem.frag.innerHTML = list.isList ? this.listItemHtml() :
                                                    ( list.isGrid ? this.gridItemHtml() : this.thumbItemHtml() );

        list.contentDiv.appendChild( RasterListItem.frag.firstChild );
    }
    else // for table row
    {
        var tr = list.dataBody.insertRow( list.dataBody.rows.length );
        tr.className = selStyle;
        tr.setAttribute( "__iidx", this.index + "" );

        for ( var i=0; i < list.columns.length; i++)
        {
            var td = tr.insertCell( tr.cells.length );
            td.setAttribute( "__coln", i + "" );

            var data = RasterStrings.formatDate( this.data[list.columns[i].dataIdx] || "&nbsp;" ); // convert to "mm/dd/yyyy" (if applies)

            if ( i==0 )
            {
                td.innerHTML = RasterList.SURROUND[0] +
                                   "<span class='rasterListItemIco'>" +
                                       RasterSprite.asHtml(this.icon, 16, 16, this.isEnabled ? 100 : 33 ) +
                                   "</span>" +
                                   "<span>" +
                                       data +
                                   "</span>" +
                               RasterList.SURROUND[1];
            }
            else
            {
                td.innerHTML = RasterList.SURROUND[0] + data + RasterList.SURROUND[1];
            }

        }/*for*/
    }/*if*/


    return this;
};


/*****************************************************************************
 Removes the item from the list.
 @return object:  The list item object.
 *****************************************************************************/
RasterListItem.prototype.remove = function()
{
    this.listControl.removeItems( this );
    return this;
};


/*****************************************************************************
 Ensure the item is visible in the scroll viewport.
 @return object:  The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.scrollIntoView = function()
{
    this.getItemElement().scrollIntoView();
    return this;
};


/*****************************************************************************
 Test if this item is the first (top-most) of its sibling.
 @return boolean: True if this item is the first of its sibling, false otherwise.
 *****************************************************************************/
RasterListItem.prototype.isFirst = function()
{
    return this.getItemElement().previousSibling!=null;
};


/*****************************************************************************
 Test if this item is the last (bottom-most) of its sibling.
 @return boolean: True if this item is the last of its sibling, false otherwise.
 *****************************************************************************/
RasterListItem.prototype.isLast = function()
{
    return this.getItemElement().nextSibling!=null;
};


/*****************************************************************************
 Returns the previous item (if any).
 @return object: The previous item, or null if no previous item is present.
 *****************************************************************************/
RasterListItem.prototype.getPreviousItem = function()
{
    var box = this.getItemElement();
    if ( box.previousSibling!=null && box.previousSibling.getAttribute("__iidx")!=null )
        return this.listControl.allItems[ box.previousSibling.getAttribute("__iidx") * 1 ];
    else
        return null;
};

/*****************************************************************************
 Returns the next item (if any).
 @return object: The next item, or null if no next item is present.
 *****************************************************************************/
RasterListItem.prototype.getNextItem = function()
{
    var box = this.getItemElement();
    if ( box.nextSibling!=null && box.nextSibling.getAttribute("__iidx")!=null )
        return this.listControl.allItems[ box.nextSibling.getAttribute("__iidx") * 1 ];  // "* 1" means string to int
    else
        return null;
};

/*****************************************************************************
 Move this item before its previous sibling. This method has no effect if the
 item is the first.
 @return object: The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.moveUp = function()
{
    var sibling = this.getPreviousItem();
    if ( sibling!=null )
    {
        // a. swap dom elements
        Raster.setSibling( this.getItemElement(), sibling.getItemElement(), false);

        // b. swap item elements, update indexes
        var all = this.listControl.allItems;
        var isLast = this.index == all.length-1;

        all.splice( sibling.index, 1);
        if ( isLast )
            all.push( sibling );
        else
            all.splice( this.index,0, sibling );

        var tmp = this.index;
        this.index = sibling.index;
        sibling.index = tmp;

        this.getItemElement().setAttribute( "__iidx", this.index+"" );
        sibling.getItemElement().setAttribute( "__iidx", sibling.index+"" );

        if ( this.listControl.isTable ) //refresh alt row colors
        {
            this.updateStyle();
            sibling.updateStyle();
        }/*if*/

    }/*if*/

    return this;
};


/*****************************************************************************
 Move this item after its next sibling. This method has no effect if the item
 is the last.
 @return object: The list item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterListItem.prototype.moveDown = function()
{
    var sibling = this.getNextItem();
    if ( sibling!=null )
    {
        // a. swap dom elements
        Raster.setSibling( this.getItemElement(), sibling.getItemElement(), true);

        // b. swap item elements, update indexes
        var all = this.listControl.allItems;
        var isLast = sibling.index == all.length-1;

        all.splice( this.index, 1);
        if ( isLast )
            all.push( this );
        else
            all.splice( sibling.index,0, this );

        var tmp = this.index;
        this.index = sibling.index;
        sibling.index = tmp;

        this.getItemElement().setAttribute( "__iidx", this.index+"" );
        sibling.getItemElement().setAttribute( "__iidx", sibling.index+"" );
        
        if ( this.listControl.isTable ) //refresh alt row colors
        {
            this.updateStyle();
            sibling.updateStyle();
        }/*if*/

    }/*if*/

    return this;
};

//--------------8<--------------------------------------------------------------------------------------------------------

/*****************************************************************************
 Creates a list control. List controls take the entire area of their
 parent container. The following example creates a grid list control 
 inside a document element with an <code>id</code> of "listDiv":
 <pre code>
    var list = new RasterList( "listDiv", "grid" );

    list.add( null, ICONS32.GRAPHICS, null, "Customize" );
    list.add( null, ICONS32.ADDRESS_BOOK, null, "Addresses" );
    list.add( null, ICONS32.AUDIO_VOL_HIGH, null, "Sounds" );
    list.add( null, ICONS32.ACCESSORIES, null, "Accessories" );
    ...
 </pre>
 @constructor
 @see RasterListEvent

 @param parent       [object]: A string containing the ID of a DOM element,
                     a DOM element object, or another #Control object.
                     If this argument is null, the list is created but not
                     attached to the DOM herarchy; RasterControl.setParent() must
                     be invoked later to specify the parent container.
 @param displayMode  [string]: Specifies how the list render its items. Possible
                     values include:
                     <ul>
                         <li><b>"list"</b> (default) - Items are display in a single column
                             and tiled vertically. A 16x16 icon shows to the left
                             of the text.</li>
                         <li><b>"grid"</b> - Items are display in a grid-like
                             pattern. Icon shows above the text. Text might wrap
                             to a maximum of two lines and any overflow left is hidden.</li>
                         <li><b>"thumbs"</b> - Items are display in a grid-like
                             pattern. Thumbnail image shows above the text. Text might wrap
                             to a maximum of three lines and any overflow left is hidden.</li>
                         <li><b>"table"</b> - Items are display as rows in a table.
                             A 16x16 icon shows to the left of the first column's text.
                             If the item was created with a text[] array, each text element
                             in the array is displayed as a column.</li>
                     </ul>
                     This value is case-sensitive. If this value is omitted or
                     not recognized, a "list" value is assumed.
 @param thumbsize    [number]: Specifies the maximum width or height of a thumbnail picture.
                     This argument is used only when <code>displayMode</code> is
                     "thumbs". If not given, this value defaults to 80 pixels. It is
                     recommended the size is specified to match those from the thumbnails
                     to avoid a jagged pixel-resize look.
 *****************************************************************************/
function RasterList( parent, displayMode, thumbsize)
{
    // call super()
    RasterControl.call(this, parent);
    this.controlBox.innerHTML = '<div class="rasterListContent"></div>';
    this.controlBox.listControl = this;
    this.contentDiv = this.controlBox.firstChild;

    this.setClass(Raster.isIEQuirks ? "rasterList rasterListQuirks" : "rasterList");

    // Set properties
    this.allItems = [];           // ordinal
    this.selectedItems = [];
    this.columns = null;          // array of column data structures used in "table" mode, see addColumn() for details
    this.data2Col = null;         // data-to-column index map used in "table" mode, see addColumn() for details
                                  // data2Col is used to resolve a column# from any given data-index

    this.isCustomizable = false;  // disables listitem reordering
    this.isMultiSelect = false;
    this.isSortable = false;
    this.isDnD = false;           //disable drag n drop 
    this.isResizable = false;
    this.isSpread = false;
    this.isAscending = true;
    this.isTableIconsVisible = true;
    this.isAltRows = false;

    this.sortedIndex = null;
    this.thumbsize =  thumbsize || 80;

    this.isGrid = false;
    this.isTable = false;
    this.isThumbs = false;
    this.isList = false;

    // Used in table mode
    this.headerDiv = null;
    this.headerTable = null;
    this.headerCols = null;
    this.headerRow = null;
    this.dataTable = null;
    this.dataBody = null;
    this.dataCols = null;

    // Event handlers
    this.eventHandler = null;
    this.controlBox.onmousedown = RasterList.itemMousedownHandler;
    this.controlBox.onmouseup = RasterList.itemMouseupHandler;
    this.controlBox.ondblclick = RasterList.itemDblClickHandler;

    this.setDropHandler( RasterList.dragDropHandler );
    
    // register list by unique id Sequence
    this.id = "rl" + (Raster.idSequence++);
    RasterList.all[ this.id ] = this;

    // init
    this.changeDisplayMode( displayMode );

   /** @property IID_LIST [boolean]: Interface ID tag constant used to identify #RasterList objects.
                             This property is always true.*/
}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterList.SURROUND = Raster.isIE ? ["<span style='white-space:nowrap'>", "</span>"] : ["", ""];
RasterList.MIN_COL_WIDTH = 16;
RasterList.all = {};      //keeps registry of all created lists
RasterList.prototype.IID_LIST = true;
Raster.implementIID(RasterList, RasterControl);


/*****************************************************************************
 Triggers a layout check in all List tables. Invoked when page is resized, or
 a change in one dialog may affect the layout of others.
 @private
 *****************************************************************************/
RasterList.doLayout = function()
{
    //call doLayout in all Dialogs
    for ( var id in RasterList.all )
        RasterList.all[id].doLayout();
};


/*****************************************************************************
 Keep list tables headers in sync. This is invoked by
 the Raster's onresize event.
 @private
 *****************************************************************************/
RasterList.prototype.doLayout = function()
{
    // spread columns, if enabled
    if ( this.isTable && this.isSpread )
        this.spread();

    if ( Raster.isIE )              //not necessary in FF, Saf, or Chrome as resize trigger onscroll events automatically
        this.realignHeaders();

};

/*****************************************************************************
 Releases and removes all DOM element references used by this list and its
 items from the DOM tree. After this method is invoked, this instance should
 no longer be used.
 *****************************************************************************/
RasterList.prototype.dispose = function()
{
    this.controlBox.onmousedown = null;
    this.contentDiv.onscroll = null;
    this.controlBox.ondblclick = null;
    
    if ( this.headerDiv )
        this.headerDiv.onmousedown = null;

    this.headerTable = null;
    this.headerCols = null;
    this.headerRow = null;
    this.dataTable = null;
    this.dataBody = null;
    this.dataCols = null;

    this.contentDiv = null;
    this.headerDiv = null;

    // unresister toolbar
    delete RasterList.all[ this.id ];

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
};


/*****************************************************************************
 Specifies an event handler to be notified of list events.
 @param eventHandler   [function]: Callback function to be notified of
                       events in the list. Set to null to remove any
                       previously set event handler.

 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setEventHandler = function( eventHandler )
{
    this.eventHandler = eventHandler;
    return this;
};


/*****************************************************************************
 Specifies the way the list displays its items.
 @param displayMode  [string]: Specifies how the list render its items. Possible
                     values include:
                     <ul>
                         <li><b>"list"</b> (default) - Items are display in a single column
                             and tiled vertically. A 16x16 icon shows to the left
                             of the text.</li>
                         <li><b>"grid"</b> - Items are display in a grid-like
                             pattern. Icon shows above the text. Text might wrap
                             to a maximum of two lines and any overflow left is hidden.</li>
                         <li><b>"thumbs"</b> - Items are display in a grid-like
                             pattern. Thumbnail image shows above the text. Text might wrap
                             to a maximum of three lines and any overflow left is hidden.</li>
                         <li><b>"table"</b> - Items are display as rows in a table.
                             A 16x16 icon shows to the left of the first column's text.
                             If the item was created with a text[] array, each text element
                             in the array is displayed as a column.</li>
                     </ul>
                     This value is case-sensitive. If this value is omitted or
                     not recognized, a "list" value is assumed.
 @param thumbsize    [number]: Specifies the maximum width or height of a thumbnail picture.
                     This argument is used only when <code>displayMode</code> is
                     "thumbs". If not given, the current thumbnail size is used. It is
                     recommended the size is specified to match those from the thumbnails
                     to avoid a jagged pixel-resize look.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.changeDisplayMode = function( displayMode, thumbsize )
{
    this.isGrid = displayMode == "grid";
    this.isTable = displayMode == "table";
    this.isThumbs = displayMode == "thumbs";
    this.thumbsize = thumbsize || this.thumbsize;
    this.isList = !this.isGrid && !this.isTable && !this.isThumbs;



    if ( this.isTable )
    {
        Raster.addClass(this.contentDiv, "rasterListContentTable" ); //adds room at the top for headerDiv

        if ( this.headerDiv == null )
        {
            this.headerDiv = document.createElement("DIV");
            this.headerDiv.className = "rasterTableListHdrBox" + (!this.isResizable ? " rasterTableListHideSz" : "");
            this.controlBox.appendChild( this.headerDiv );
            this.headerDiv.onmousedown = RasterList.colMousedownHandler;
        }
        else
            this.headerDiv.style.display = "block";

        this.contentDiv.onscroll = RasterList.tableScrollHandler; // responsible for keeping header cols aligned
    }
    else
    {
        Raster.removeClass(this.contentDiv, "rasterListContentTable" ); //removes room at the top for headerDiv
        if ( this.headerDiv != null )
            this.headerDiv.style.display = "none";                      //hide headerDiv (if any)

        this.contentDiv.innerHTML = "";
        this.contentDiv.onscroll = null;

        this.headerTable = null;
        this.headerCols = null;
        this.headerRow = null;
        this.dataTable = null;
        this.dataBody = null;
        this.dataCols = null;

    }/*if*/


    this.paint();
    return this;
};


/*****************************************************************************
 Specifies if table list columns can be moved via drag and drop.
 @param isCustomizable boolean: True enables table list columns to be re-organized via
                       drag and drop operations; false turns off this feature (default).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setCustomizable = function( isCustomizable )
{
    this.isCustomizable = isCustomizable;
    return this;
};


/*****************************************************************************
 Specifies if list items are automatically sorted when a table list column header
 is clicked.
 @param isSortable boolean: True enables list items to be sorted when a table
                   list column header is clicked; false turns off this feature
                   (default).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setSortable = function( isSortable )
{
    this.isSortable = isSortable;
    return this;
};


/*****************************************************************************
 Enables or disables drag and drop functions in the list control.
 @param isDnD       boolean: True enables list items to be dragged
                    and to become drop targets; false turns this feature off
                   (default).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setDragDrop = function( isDnD )
{
    this.isDnD = isDnD;
    return this;
};


/*****************************************************************************
 Specifies if table list items are displayed using alternating row colors.
 @param isAltRows boolean: True enables alternate color in table list items;
                  false turns off this feature (default).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setAltRows = function( isAltRows )
{
    this.isAltRows = isAltRows;

    if ( this.isTable )
        this.paintTable();
    
    return this;
};

/*****************************************************************************
 Specifies if a table list column can be resized via drag and drop.
 @param isResizable boolean: True enables table list columns to be resized via
                    drag and drop operations; false turns off this feature
                   (default).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setResizable = function( isResizable )
{
    this.isResizable = isResizable;

    if ( this.headerDiv )
        if ( isResizable )
            Raster.removeClass( this.headerDiv, "rasterTableListHideSz");
        else
            Raster.addClass( this.headerDiv, "rasterTableListHideSz"); //css to hide resize cursor temporarily from resize grips

    return this;
};


/*****************************************************************************
 Specifies if multiple list items can be selected at the same time.
 @param isMultiSelect boolean: True allow multiple list items can be selected
                      at the same time; false allows only one item be selected
                      (default).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setMultiSelect = function( isMultiSelect )
{
    this.isMultiSelect = isMultiSelect;
    return this;
};

/*****************************************************************************
 Turn on or off the "spread" feature. When the "spread" is on, the columns
 in a table list are spread proportionally along the width of the list
 control when the controls is resized.

 @param isSpread boolean: True turns the "spread" feature on; false turns it off (default).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setSpread = function( isSpread )
{
    this.isSpread = isSpread;

    //restore to original widths
    var cols = this.columns;
    if ( !isSpread && cols )
    {
        for ( var i=0; i < cols.length; i++)
            cols[i].width =  cols[i].owidth;

        if ( this.isTable )
            this.applyColWidths();
    }
    else
        this.spread();

    return this;
};


/*****************************************************************************
 Specifies if the list will display icons when in table mode.
 @param isTableIconsVisible boolean: True show icons in table mode (default);
                            false hide icons in table mode.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.showTableIcons = function( isTableIconsVisible )
{
    this.isTableIconsVisible = isTableIconsVisible;

    if ( this.dataTable )
        if ( isTableIconsVisible )
            Raster.removeClass( this.dataTable, "rasterTableListNoIco" );
        else
            Raster.addClass( this.dataTable, "rasterTableListNoIco" );

    return this;
};


//------8<---------------------------------------------------------------------------------------------------------------------
/*********************************************************************************
 Return the number of items in the list.
 @return number: Number of items in the list.
 *********************************************************************************/
RasterList.prototype.size = function()
{
    return this.allItems.length;
};


/*****************************************************************************
 Adds an item to the list.
 @param icon              value: String containing path of a 16x16 image file
                          or an object that implements the IID_SPRITEINFO interface
                          such as those in #ICONS16. This icon is displayed when
                          the list is in "list" and "table" modes. Set to null if no
                          small icon is desired.
 @param icon32            value: String containing path of a 32x32 image file
                          or an object that implements the IID_SPRITEINFO interface
                          such as those in #ICONS32. This icon is displayed when
                          the list is in "grid" mode. If this icon is not provided,
                          the <code>icon16</code> is used if available. Set to null
                          or omit if no large icon display is needed.
 @param thumbnail         string: Path of a thumbnail image file.
                          If the image given is bigger than the thumbnail size specified
                          during the #List constructor, clipping will occur. This image
                          is displayed when the list is in "thumbs" mode. Set to
                          null or omit if no thumbnail display is needed.
 @param data              any: Define one or more values to be display in this list item.
                          Multiple values are given as a array. Values are typically
                          strings, but may be of any type. The toString() method is used
                          to convert values to text. Null values display as a empty string "".
 @param value             [any]: Define any program-specific value to be associated with this
                          item, such as a primary-key or other server side unique-ID.
 @param doPaint           [boolean]: Used to increase performance when doing batch operations in
                          the list. If this argument is omitted or set true, the display
                          is updated immediately to reflect the changes, false does not
                          update the the display until paint() is later invoked.
 @return object: A reference to the #RasterListItem object just added.
 *****************************************************************************/
RasterList.prototype.add = function( icon, icon32, thumbnail, data, value, doPaint )
{
    var item = new RasterListItem(this, this.allItems.length, icon, icon32, thumbnail, data, value );
    if (doPaint!==false)
        item.rasterize();

    this.allItems.push( item );

    return item;
};


/*********************************************************************************
 Removes the currently selected items from the list (if any).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 @see removeItems(), removeAll()
 *********************************************************************************/
RasterList.prototype.removeSelectedItems = function()
{
    this.removeItems( this.getSelectedItems() );
    return this;
};


/*********************************************************************************
 Removes all items from the list (if any).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 @see removeItems(), removeSelectedItems()
 *********************************************************************************/
RasterList.prototype.removeAll = function()
{
    this.removeItems( this.getItems() );
    return this;
};

/*********************************************************************************
 Removes one of more items from the list.
 @param items  object: Either a single ListItem object or an array of ListItem
               objects to be removed.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 @see removeAll(), removeSelectedItems()
 *********************************************************************************/
RasterList.prototype.removeItems = function( items )
{
    // function: Removes item from list
    function remove( list, i )
    {
        var el = i.getItemElement();
        el.parentNode.removeChild( el );
        list.allItems.splice( i.index, 1);
    }/*inner*/

    // removing a single item?
    if ( items.IID_LISTITEM )
    {
        remove( this, items);
    }
    else
    {
        // sort incoming item array higher index to lowest
        var arr = items.slice(0);
        arr.sort( function(a,b) { return b.index - a.index;} );

        // remove incoming items from allItems[], removing highest to lowest
        for (var i=0; i < arr.length; i++ )
        {
            if ( arr[i].isSelected )
                this.unselectItem( arr[i] );

            remove( this, arr[i] );
        }/*if*/


    }/*if*/

    // sync "index" attributte with item's actual position
    this.updateIndexes( true );

    return this;
};


/*****************************************************************************
 Unselects an items in the List (if selected).
 @param item     object: A reference to a ListItem object, or a
                 value matching the value attribute of a ListItem.
                 If a tab matching this argument is not found in this
                 container, this method does nothing. Set this argument
                 to null to clear any selection in the list.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.unselectItem = function( item )
{
    if ( item==null || !item.IID_LISTITEM )  // If item not a IID_TREEITEM, treat it as a value attributte
        item = this.getItemByValue( item );

    if ( item!=null )
        for ( var i=0; i < this.selectedItems.length; i++ )
            if ( item==this.selectedItems[i] )
            {
                this.selectedItems.splice(i, 1);
                item.markSelected ( false );
                break;
            }/*if*/

    return this;
};


/*****************************************************************************
 Include an item in the current list selection (if any).
 @param item     object: A reference to a ListItem object, or a
                 value matching the value attribute of a ListItem.
                 If an item matching this argument is not found in this
                 container, this method does nothing. Set this argument
                 to null to clear any selection in the list.
 @param add      [boolean]: true add the given item to the current list
                 selection (if any). When false, the previously list selection
                 is cleared before the given item is selected (default).
 @param range    [boolean]: True select all the items in range from the last
                 selected item to the given item; false selects one item (default).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.selectItem = function( item, add, range )
{
    if ( !this.isMultiSelect )
        add = range = null;

    if ( item==null || !item.IID_LISTITEM )  // If item not a IID_LISTITEM, treat it as a value attributte
        item = this.getItemByValue( item );

    if ( add!==true && range!=true )
        this.clear();

    if ( item!=null && item.isEnabled )
    {
        var sel = this.selectedItems;

        if ( range===true && sel.length > 0 )
        {
            var a = sel[ sel.length-1 ].index;
            var b = item.index;
            var step = ( a > b ) ? -1 : 1;


            while ( a != b+step )  //loop from a to b (inclusive)
            {
                var it = this.allItems[a];
                if ( !it.isSelected && it.isEnabled )
                {
                    it.markSelected ( true );
                    sel.push( it );
                }
                a += step;
            }/*while*/

        }
        else
        {
            if ( add===true && item.isSelected )
                item.unselect();
            else
            {
                item.markSelected ( true );
                sel.push( item );
            }/*if*/

        }/*if*/

    }/*if*/

    return this;
};

/*****************************************************************************
 Select all items in the list.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 @see hasSelection(), clear()
 *****************************************************************************/
RasterList.prototype.selectAll = function()
{
    for ( var i=0; i < this.allItems.length; i++ )
        this.allItems[i].markSelected ( true );

    this.selectedItems = this.allItems.slice(0);

    return this;
};


/*****************************************************************************
 Clears any selection in the list (if any).
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 @see hasSelection(), selectAll()
 *****************************************************************************/
RasterList.prototype.clear = function()
{
    for ( var i=0; i < this.selectedItems.length; i++ )
        this.selectedItems[i].markSelected ( false );

    this.selectedItems.splice(0, this.selectedItems.length );
    return this;
};

/*****************************************************************************
 Returns the list item having a value attributte matching the given argument.
 @param value    any: A value matching the value attribute of a ListItem.
 @return object: The list item having a value attributte matching the given argument.
         Returns null if no list item having a value attributte matching the
         given argument is found.
 @see size(), getItem(),  getItems(), getSelectedItem(), getSelectedItems()
 *****************************************************************************/
RasterList.prototype.getItemByValue = function( value )
{
    for ( var i=0; i < this.allItems.length; i++ )
        if ( this.allItems[i].value == value )
            return this.allItems[i];

    return null;
};


/*****************************************************************************
 Retrieve list item at the given index. To know the number of items in the
 list use the size() method.

 @param  index number: zero-based index of the item to be retrieved.
 @return object: The list item at the given index. Returns null if not item
         is found at the given index.
 @see size(), getItems(),  getItemByValue(), getSelectedItem(), getSelectedItems()
 *****************************************************************************/
RasterList.prototype.getItem = function( index )
{
    return  this.allItems[ index ];
};


/*****************************************************************************
 Retrieve list of items in the list. Items are returned in the order they
 appear.
 @return array: Array containing all list items. An empty array if the list
         has no items in it.
 @see size(), getItem(),  getItemByValue(), getSelectedItem(), getSelectedItems()
 *****************************************************************************/
RasterList.prototype.getItems = function()
{
    return  this.allItems.slice(0);
};


/*****************************************************************************
 Retrieve list of selected items in the list. Use the hasSelection() method
 to test if the list has any selected items.
 @return array: Array containing the list selected items. An empty array if
         no selected items are selected.
 @see  getItem(), getItems(),  getItemByValue(), hasSelection(), getSelectedItem()
 *****************************************************************************/
RasterList.prototype.getSelectedItems = function()
{
    return this.selectedItems.slice(0);
};

/*****************************************************************************
 Retrieve the selected item. If multiple items are selected, returns the last
 item clicked.  Use the hasSelection() method to test if the list has any
 selected items.
 @see  getItem(), getItems(), getItemByValue(), hasSelection(), getSelectedItems()
 @return object: The last item clicked in the current selection. Returns null
         if no items are selected.
 *****************************************************************************/
RasterList.prototype.getSelectedItem = function()
{
    var sel = this.selectedItems;
    if ( sel.length > 0 )
        return sel[ sel.length-1 ];
    else
        return null;
};

/*****************************************************************************
 Test if the list has any selection.
 @see  selectAll(), clear(), getSelectedItem(), getSelectedItems()
 @return boolean: True is there are selected items in the list; false otherwise.
 *****************************************************************************/
RasterList.prototype.hasSelection = function()
{
    return this.selectedItems.length > 0;
};


/*********************************************************************************
 Updates the <code>index</code> property on the list items to match its position
 in the allItems[] collection.
 @private

 @param updateDom  [boolean]: if true, both the index and  __iidx attributes in
                   of the item DOM elements are updated. If false or omitted, only
                   the item's index attribute is updated.
 *********************************************************************************/
RasterList.prototype.updateIndexes = function( updateDom )
{
    var i;
    var all = this.allItems;
    
    if ( updateDom !== true )
    {
        for ( i=0; i < all.length; i++)
            all[i].index = i;
    }
    else
    {
        var container = this.isTable ? this.dataBody : this.contentDiv;
        for ( i=0; i < all.length; i++)
        {
            all[i].index = i;
            container.childNodes[i].setAttribute( "__iidx", i+"" );
        }/*for*/

        // Refresh table alt rows, if enabled
        if ( this.isTable && this.isAltRows )
            for ( i=0; i < all.length; i++)
                all[i].updateStyle();
        
    }/*if*/
};


/*********************************************************************************
 Moves an item or items to a new location.
 @param items      object: A ListItem or array of ListItem objects to be moved.
 @param destIndex  number: Index where the item(s) will be moved. This value is
                   from 0 to size(). A value equal or greated to size()
                   will appends the item(s) to the end of the list.
 @param doPaint    [boolean]: Used to increase performance when doing batch operations in
                   the list. If this argument is omitted or set true, the display
                   is updated immediately to reflect the changes, false does not
                   update the the display until paint() is later invoked.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *********************************************************************************/
RasterList.prototype.moveItems = function( items, destIndex, doPaint )
{
    var length = this.allItems.length;

    destIndex = (destIndex==null) ? length : Raster.clip( destIndex, 0, length );
    var isAppend = destIndex == length;

    // moving a single item?
    if ( items.IID_LISTITEM )
    {
        if ( items.index==destIndex && (items.index+1)==destIndex ) // moving into the same place?, leave..
            return this;

        this.allItems.splice( items.index, 1 );
        if ( isAppend )
            this.allItems.push( items );
        else
            this.allItems.splice( (destIndex > items.index ? destIndex-1 : destIndex), 0, items );
    }
    else
    {
        // sort incoming item array descending
        var arr = items.slice(0);
        arr.sort( function(a,b) { return b.index - a.index;} );
        var i;

        // tag element at insertion index. if destIndex is in the
        // moving set, keep incremeneting destIndex until it read
        // the index of an itrm not in the moving set
        if ( !isAppend )
        {
            var sel = {};
            for ( i=0; i < arr.length; i++ )   //index
                sel[ arr[i].index ] = arr[i];

            while ( sel[destIndex]!=null )
                    destIndex++;

            if (destIndex >= this.allItems.length )
                isAppend = true;
            else
                this.allItems[ destIndex ].__INS = true;
        }/*if*/


        // remove incoming items from allItems[], removing highest to lowest
        for ( i=0; i < arr.length; i++ )
            this.allItems.splice( arr[i].index, 1 );

        // re-insert items
        if ( isAppend )
            this.allItems = this.allItems.concat( items );
        else
        {
            var insIndex = 0;
            for( i=0; i < this.allItems.length; i++ )
                if ( this.allItems[i].__INS )
                {
                    delete this.allItems[i].__INS;
                    insIndex = i;
                    break;
                }/*if*/

            for( i=0; i < arr.length; i++ )
                this.allItems.splice( insIndex, 0, arr[i] );
        }/*if*/
    }/*if*/

    // sync "index" attributte with item's actual position
    this.updateIndexes();

    // apply changes visually
    if ( doPaint!==false )
        this.paint();

    return this;
};

//--------------8<--------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Adds a column to a list. Columns are display only when the list is in "table"
 mode. To know the number of columns in a table list use getColCount().

 @see getColCount()

 @param name      string: Text shown in the column header.
 @param width     number: Desired width for the column (pixels).
 @param dataIdx   number: Zero-based index of the item data element to be displayed
                  in the column.
 @param colIdx    [number]: Zero-based index at which the column will be inserted.
                  If this value is omitted or set null, the column is added at the end.
 @param doPaint   [boolean]: Used to increase performance when doing batch operations in
                  the list. If this argument is omitted or set true, the display
                  is updated immediately to reflect the changes, false does not
                  update the the display until paint() is later invoked.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.addColumn = function( name, width, dataIdx, colIdx, doPaint)
{
    // if the dataIndex is already in use by an existing column, leave
    if ( this.data2Col && this.data2Col[ dataIdx ] != null )
        return this;

    // Create column meta-data stucture
    var col = { width: width,             // column's current width, may change after spread() is used
                owidth: width,            // original column's width
                dataIdx:dataIdx,          // index of the data element displayed in the column (in item.data[])
                name:name };              // title of the column (ie. header's text)

    var cols = this.columns = this.columns || [];

    if ( colIdx==null || colIdx >= cols.length )
        cols.push( col );
    else
    {
        if ( this.sortedIndex!=null && this.sortedIndex >= colIdx )
            this.sortedIndex++;

        cols.splice( colIdx, 0, col );
    }/*if*/

    // update data-to-column index map
    this.updateData2ColMap();

    // paint table
    if ( doPaint!==false && this.isTable )
        this.paintTable();

    return this;
};


/*****************************************************************************
 Removes a column from a list. Columns changes are display only when the list
 is in "table" mode. To know the number of columns in a table list use getColCount().

 @param colIdx    number: Zero-based index of the column to be removed.
                  If the given index is out of range, this method does nothing.
 @param doPaint   [boolean]: Used to increase performance when doing batch operations in
                  the list. If this argument is omitted or set true, the display
                  is updated immediately to reflect the changes, false does not
                  update the the display until paint() is later invoked.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.removeColumn = function( colIdx, doPaint)
{
    var cols = this.columns;

    if ( cols && colIdx < cols.length )
    {
        cols.splice( colIdx, 1 );

        if ( this.sortedIndex == colIdx )
            this.sortedIndex = null;
        else if ( this.sortedIndex!=null && this.sortedIndex > colIdx )
            this.sortedIndex--;

        // update data-to-column index map
        this.updateData2ColMap();

        // paint table
        if ( doPaint!==false && this.isTable )
            this.paintTable();
    }/*if*/

    return this;
};


/*****************************************************************************
  Relocates a table list column.
  @param srcIndex   number: Zero-based index of the column to be moved.
  @param destIndex  [number]: Zero-based index of the new location for the column.
                              If this argument is omitted or set null, the
                              column is moved to the last position.
  @return object: The list object. This allow for chaining multiple setter methods in
          one single statement.
 *****************************************************************************/
RasterList.prototype.moveColumn = function( srcIndex, destIndex )
{
    var cols = this.columns;
    if ( !cols || cols.length <= 1 )
        return this;

    destIndex = (destIndex==null) ?
                cols.length :
                Math.min( cols.length, destIndex);

    if ( srcIndex >= cols.length || srcIndex==destIndex || (srcIndex+1)==destIndex )
        return this;

    //tag currently sorted column (if any)
    if ( this.sortedIndex!=null )
        cols[this.sortedIndex].__SORTED = true;

    //reorder columns
    var temp;
    if ( destIndex==cols.length)
    {
        temp = cols.splice( srcIndex, 1 );
        cols.push( temp[0] );
    }
    else if ( srcIndex > destIndex )
    {
        temp = cols.splice( srcIndex, 1 );
        cols.splice( destIndex, 0, temp[0] );
    }
    else
    {
        temp = cols.splice( srcIndex, 1 );
        cols.splice( destIndex-1, 0, temp[0] );
    }/*if*/

    //updated sorted index after column move
    if ( this.sortedIndex!=null )
        for ( var i=0; cols.length; i++)
            if ( cols[i].__SORTED===true )
            {
                delete cols[i].__SORTED;
                this.sortedIndex = i;
                break;
            }/*for-if*/

    // update data-to-column index map
    this.updateData2ColMap();

    // repaint table
    if ( this.isTable )
        this.paintTable();

    return this;

};


/*****************************************************************************
 Updates the data2Col index map. This must be called after changing the
 table list column count or order.
 @private
 *****************************************************************************/
RasterList.prototype.updateData2ColMap = function()
{
    // update data-to-column index map
    this.data2Col = {};                        //note: not an array, an object map
    for ( var i in this.columns )
       this.data2Col[ this.columns[i].dataIdx ] = i;

};


/*****************************************************************************
 Returns the column spreading ratio. This number is used to convert column
 widths from real-width to spread-width and back. The real-width is the column's
 original (or desired) width. The spread-width is the column's width "translated"
 to a "percentage" of the table list's total width. When "spread" is on,
 the table columns real widths are proportionaly translated to "spread" width so
 the columns occupy (or "spread") the entire list control's width. To perform
 conversions use these formulas:

         spreadWidth = realWidth * ratio

         realWidth = spreadWidth / ratio

 @private
 @return number: the column spreading ratio.
 *****************************************************************************/
RasterList.prototype.spreadRatio = function()
{
    var cols = this.columns;
    if ( !cols || cols.length==0 )
        return 1;

    var sum = 0;
    for ( var i=0; i < cols.length; i++)
        sum += cols[i].owidth;

    var width = this.contentDiv.clientWidth - ((Raster.isIE6 || Raster.isIE7) && !Raster.isIEQuirks ? 24 : 0); //strict IE include scrollbar in clientWidth

    return  (width - 2) / sum;
};


/*****************************************************************************
 Spreads the columns of a table list proportionally along the total width of
 the table.
 @see setSpread()
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.spread = function( doPaint )
{
    var cols = this.columns;

    if ( cols!=null )
    {
        var ratio = this.spreadRatio();

        for ( var i=0; i < cols.length; i++)
            cols[i].width =  Math.round( cols[i].owidth * ratio );

        // render changes
        if ( this.isTable && doPaint!==false )
            this.applyColWidths();

    }/*if*/

    return this;
};


/*****************************************************************************
 Set the width of any given table list column. Note that if the "spread"
 feature is ON, the given width is converted and applied as a percentage of
 the total list control width.

 @see setSpread()

 @param colIndex  number: Zero-based index of the column to be resized. To know
                  the number of columns in a table list use getColCount().
 @param width     number: New width for the column (pixels)
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setColWidth = function( colIndex, width )
{
    var cols =  this.columns;
    if ( cols==null )
        return this;

    // update column width
    if ( colIndex < cols.length )
    {
        cols[ colIndex ].width = width;
        cols[ colIndex ].owidth = width;

        // apply visual changes only if in table mode
        if ( this.isTable  )
            if ( this.isSpread  )
                this.spread();
            else
                this.applyColWidths();

    }/*if*/

    return this;
};


/*****************************************************************************
 Updates the display using the current table list's column widths. List
 must be in "table" mode, otherwise this method will cause an error.
 @private
 *****************************************************************************/
RasterList.prototype.applyColWidths = function()
{
    // Apply table columns widths
    var cols = this.columns;
    var tableWidth = 0;

    for ( var i=0; i < this.headerCols.childNodes.length; i++)
    {
        this.headerCols.childNodes[ i ].width = cols[i].width;
        this.dataCols.childNodes[ i ].width = cols[i].width;
        tableWidth += cols[i].width;
    }/*for*/

    // Apply total table widths
    this.headerTable.style.width = tableWidth + "px";
    this.dataTable.style.width = tableWidth + "px";

    this.realignHeaders();
};


/*****************************************************************************
 Returns the current width of any given table list column. The returned width
 is the original column width, which might be different from the width shown
 if the "spread" feature is ON.

 @see getColCount()
 @param colIndex  number: Zero-based index of the column to query. To know the
                  number of columns in a table list use getColCount().
 @return number: The current width of the given table list column. Returns -1
                 if the colIndex is out of range.
 *****************************************************************************/
RasterList.prototype.getColWidth = function( colIndex )
{
    if ( !this.columns || colIndex >= this.headerCols.childNodes.length )
        return -1;

    return this.columns[ colIndex ].width;
};


/*****************************************************************************
 Returns the number of columns in the table list.
 @return number: Number of columns in the table list.
 *****************************************************************************/
RasterList.prototype.getColCount = function()
{
    return this.columns ? this.columns.length : 0;
};


/*****************************************************************************
 Realigns the headers with their body counterparts when the horizontal scroll
 bar changes.
 @private
 *****************************************************************************/
RasterList.prototype.realignHeaders = function()
{
    if ( this.headerTable==null )
        return;

    this.headerTable.style.marginLeft = (-this.contentDiv.scrollLeft) + "px";
};


/*****************************************************************************
 Shows or hides the sort arrow mark in a table list.  This method does not sort
 the items, it only draws a sort arrow mark in any given header.
 @see sort()
 @param colIndex        number: Specify the column to be marked as sorted.
                        If this argument is omitted or set null the sort
                        arrow mark is hidden.
 @param isAcsending     [boolean]: Specifies the direction of the sort arrow mark.
                        True shows a ascending sort arrow mark (default), false
                        shows a descending sort arrow mark.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.setSortCol = function( colIndex, isAcsending )
{
    // if not in table mode, leave
    if ( !this.isTable )
    {
        this.sortedIndex = colIndex;
        return this;
    }

    // hide sort arrow in current sorted table header (if any)
    var th;

    if ( this.sortedIndex!=null )
    {
        th = this.headerRow.cells[ this.sortedIndex ];
        Raster.removeClass( th, "TableListHdrAsc" );
        Raster.removeClass( th, "TableListHdrDesc" );
    }

    // draw arrow
    if ( colIndex!=null && this.columns!=null && colIndex < this.columns.length )
    {
        this.sortedIndex = colIndex;
        th = this.headerRow.cells[ colIndex ];
        Raster.addClass( th, isAcsending!==false ? "TableListHdrAsc" : "TableListHdrDesc" );
    }

    return this;
};


/*****************************************************************************
 Sort list items.
   @param isAcsending   boolean: True sort items in ascending order, false
                        sort items in descending order. If this argument is
                        null no sort operation will occur, but when in "table"
                        mode any sort markings in a headers are removed.
   @param colIndex      [number]: Specify the column to be sort items by. If this
                        argument is omitted, 0 is assumed.
   @param dataIndex     [number]: Specify the index of a hidden data element
                        to be used for sorting instead of the data element
                        associated with <code>colIndex</code>.
   @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.sort = function( isAcsending, colIndex, dataIndex )
{
    // hide sort arrow in current sorted table header (if any)
    this.setSortCol(null);

    var cols = this.columns;

    // if 1st argument is null, or colIndex out of range, leave..
    colIndex = colIndex || 0;
    if ( isAcsending==null || (cols!=null && colIndex >= cols.length) )
        return this;

    // Update instance state, sort..
    this.isAscending = isAcsending;
    this.sortedIndex = colIndex;

    dataIndex = (dataIndex==null) ? (cols ? cols[colIndex].dataIdx : 0 ) : dataIndex;
    isAcsending = (isAcsending===true) ? 1 : -1;            // transform boolean to int

    this.allItems.sort(  function( item1, item2 )
    {
        var a = item1.data[dataIndex];
        var b = item2.data[dataIndex];

        if ( !isNaN(a-b) )                                                   //treat as numbers
            return isAcsending * (a - b);

        else if ( a!=null && b!=null && a.getTime!=null && b.getTime!=null ) //treat as date
            return isAcsending * ( a.getTime() - b.getTime() );

        else
            return (a || "").toString().toUpperCase() < (b || "").toString().toUpperCase() ? -isAcsending : isAcsending;
    });

    this.updateIndexes();

    // redraw list
    this.paint();

    return this;
};


/*****************************************************************************
 Renders any changes made to the list.
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.paint = function()
{
    if (this.isList)
        this.paintList();

    else if (this.isTable)
        this.paintTable();

    else if (this.isGrid)
        this.paintGrid();

    else if (this.isThumbs)
        this.paintThumbs();

    return this;

};

/*****************************************************************************
 Create dom structure for a simple list.
 @private
 *****************************************************************************/
RasterList.prototype.paintList = function()
{
    var buf = [];

    // Generate html for items
    for ( var i=0; i < this.allItems.length; i++)
        buf.push( this.allItems[i].listItemHtml() );

    this.contentDiv.innerHTML = buf.join('');
};


/*****************************************************************************
 Create dom structure for a grid list.
 @private
 *****************************************************************************/
RasterList.prototype.paintGrid = function()
{
    var buf = [];

    // Generate html for items
    for ( var i=0; i < this.allItems.length; i++)
        buf.push( this.allItems[i].gridItemHtml() );

    this.contentDiv.innerHTML = buf.join('');
};


/*****************************************************************************
 Create dom structure for a thumbnail list.
 @private
 *****************************************************************************/
RasterList.prototype.paintThumbs = function()
{
    var buf = [];

    // Generate html for items
    for ( var i=0; i < this.allItems.length; i++)
        buf.push( this.allItems[i].thumbItemHtml() );

    this.contentDiv.innerHTML = buf.join('');
};


/*****************************************************************************
 Create dom structure for a table list.
 @private
 *****************************************************************************/
RasterList.prototype.paintTable = function()
{
    var colgroup = [];
    var headers = [];
    var rows = [];
    var tableWidth = 0;
    var cols = this.columns || [];

    // spread columns, if enabled
    if ( this.isSpread )
        this.spread(false);

    // generate cols markup
    var i;
    for ( i=0; i < cols.length; i++)
    {
        colgroup.push( '<col width="' + cols[i].width + '" />' );

        var sortCss = (this.sortedIndex==i) ?
                      "class='TableListHdr" + (this.isAscending ? "Asc" : "Desc") + "'":
                      "";

        headers.push( '<th __coln="'+i+'" '+ sortCss +'>' +
                      '<div class="rasterTableListHdr">' +
                          '<div class="rasterTableListHdrTxt">' +
                              ( cols[i].name || "&nbsp;" )+
                          '</div>' +
                          '<div class="rasterTableListHdrSort">' +
                             '<div class="rasterTableListHdrSize" grip="1"></div>' +
                          '</div>' +
                      '</div>' +
                      '</th>' );
        tableWidth += cols[i].width;
    }/*for*/

    // Generate html for table ROWS
    for ( i=0; i < this.allItems.length; i++)
        rows.push( this.allItems[i].tableItemHtml() );

    // Create main TABLE in contentDIV
    this.contentDiv.innerHTML  =
        '<table border="0" cellspacing="0" class="rasterTableList' +
              (this.isTableIconsVisible ? '' : ' rasterTableListNoIco') + '" style="width:'+tableWidth+'px">' +
            '<colgroup>' + colgroup.join("") + '</colgroup>' +
            '<tbody>' +
            rows.join('') +
            '</tbody>' +
        '</table>';

    // Create fixed column headers in headerDiv
    this.headerDiv.innerHTML =
        '<table border="0" cellspacing="0" cellpadding="0" class="rasterTableListHdr"  style="width:'+tableWidth+'px">' +
            '<colgroup>' + colgroup.join("") + '</colgroup>' +
            '<tbody><tr>' + headers.join("") + '</tr></tbody>' +
        '</table>' ;


    // Update DOM references
    this.headerTable = this.headerDiv.firstChild;
    this.headerCols = this.headerTable.firstChild;
    this.headerRow = this.headerTable.lastChild.firstChild;
    this.dataTable = this.contentDiv.firstChild;
    this.dataBody = this.dataTable.lastChild;
    this.dataCols = this.dataTable.firstChild;

    // adjust headers with current h-scroll
    this.realignHeaders();

};

/*****************************************************************************
 Renames a column header.
 @param colIdx number: zero-based index of the table list column to be renamed.
 @param name   string: New name for the column header.
 @private
 @return object: The list object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterList.prototype.renameColumn = function ( colIdx, name )
{
    if ( this.columns && colIdx < this.columns.length)
    {
        this.columns[ colIdx ].name = name;
        if ( this.headerRow && colIdx < this.headerRow.cells.length )
            this.headerRow.cells[ colIdx ].firstChild.firstChild.innerHTML = name || "&nbsp;";
    }/*if*/

    return this;
};

//------8<--------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Handles horizontal scroll event. Realigns table headers when the horizontal
 scrollbar is moved.
 @private
 *****************************************************************************/
RasterList.tableScrollHandler = function ( event )
{
    var list = Raster.findParentExpando( Raster.srcElement(event), "listControl");
    list.realignHeaders();
};



//------8<--------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Handles double click on the list.
 @private
 *****************************************************************************/
RasterList.itemDblClickHandler = function ( event )
{
    RasterList.itemMousedownHandler( event, true );
};

/*****************************************************************************
 Handles mouse going up on a list item. Test the value in 'list.mousedownItem'
 and if it is equal to the item being moused-up, selects the item. This event
 completed the cycle of the "click" logic for a list item for selection
 purposes. Note 'list.mousedownItem' is cleared if a mouse drag occured after
 mouse-down, to the this method to do nothing (do not modify the list selection)
 @private
 *****************************************************************************/
RasterList.itemMouseupHandler = function (event)
{
    var el = Raster.srcElement(event);
    var itemContainer = Raster.findParentWithAttr( el, "__iidx");
    if ( itemContainer==null )
        return;

    var list = Raster.findParentExpando( el, "listControl");
    var itemIndex = parseInt(itemContainer.getAttribute("__iidx"));
    var item = list.allItems[ itemIndex ];

    if ( list.mousedownItem==item && item.isEnabled   )
        item.select();

};


/*****************************************************************************
 Create and/or return a dragContext for this control instance.
 The drag context object is a place for this control instance to save the state
 of the drag and drop operation while the mouse hovers over the control's region.

 If the drag context does not exist yet for the given mouseEvt, one will be
 created and returned, otherwise the one current one is returned.
 @private
 @param mouseEvt      object: a RasterMouseEvent object
 @return  object: An context object this tabbar instance can use to store
          computations and state for the given mouseEvt operation.
 *****************************************************************************/
RasterList.prototype.getDragContext = function( mouseEvt )
{
    // If we already created a drag context in this mouseEvt,
    // return that object
    var data = mouseEvt.context[ this.id ];

    // otherwise create drag context object for this control instance
    // and register it in the mouseEvt.context.
    if ( !data )
    {
        data = Raster.getBounds( this.contentDiv );
        data.width = this.contentDiv.clientWidth;   //exclude scrollbar from width/height
        data.height = this.contentDiv.clientHeight;
        data.list = this;
        data.sbHeight = this.contentDiv.clientWidth < this.contentDiv.scrollWidth ? 18 : 0;  //height of bottom horz. scroll bar
        data.rowHeight = this.isList ?
                         (this.contentDiv.firstChild ? this.contentDiv.firstChild.offsetHeight : 0) :
                         ((this.dataBody && this.dataBody.firstChild) ? this.dataBody.firstChild.offsetHeight : 0);
        data.rowsBottom = data.y + (data.rowHeight * this.allItems.length); //bottom of last row/item
        data.bottom = data.y + data.height;  //bottom of the control
        data.isBeforeDrag = true;
        data.itemIndex = null;
        
        // if in grid mode, create grid map matrix to facilitate and acurrately drawing of insertion line
        if ( this.isGrid || this.isThumbs )
        {
            var ch = this.contentDiv.children;
            var idx, top=0, prevTop, rows=[], n=0;

            rows[0] = { top:0,
                        right: 0,
                        bottom: ch[0].offsetHeight,
                        items:[{idx:0, left: 0}]  };

            prevTop = ch[0].offsetTop;
            data.itemWidth = ch[0].offsetWidth;

            for ( idx = 1; idx < ch.length; idx++ )
            {
                top = ch[idx].offsetTop;   // top: is 0 in all first row items

                if ( top != prevTop )
                {
                    rows[n].bottom = top;                                   // make 'bottom' the 'top' of the next row
                    //rows[n].items.push( {idx:idx-1, left: rows[n].right, dummy:true } );  // dummy entry, takes all space right to the row
                    n++;
                    rows[n] = {top: top, right: 0, bottom: top + ch[idx].offsetHeight, items:[] };
                    rows[n].items.push( {idx:idx, left: 0 } );  // left: is 0 in all first column items
                    prevTop = top;
                }
                else
                    rows[n].items.push( {idx:idx, left: ch[idx].offsetLeft } );

                rows[n].bottom = Math.max( rows[n].bottom, top + ch[idx].offsetHeight );
                rows[n].right = Math.max( rows[n].right, ch[idx].offsetLeft + ch[idx].offsetWidth );

            }/*for*/

            //rows[n].items.push( {idx:idx, left: rows[n].right, dummy:true } );  // dummy entry, takes all space right to the row

            data.rowsBottom = rows.length > 0 ? rows[ rows.length-1 ].bottom : 0;
            data.gridrows = rows;
        }/*if*/

        mouseEvt.context[ this.id ] = data;
    }/*if*/

    return data;
};

/*****************************************************************************
 Handles mouse going down on a list item. This methos is responsible for
 highlighting the items, notifiying user-defined event handler, and initiate
 the a drag operation.
 @private
 *****************************************************************************/
RasterList.itemMousedownHandler = function ( event, isDblClick )
{
    Raster.stopEvent( event );       //prevent selection start from happening
    Raster.setActiveMenu( null );

    var el = Raster.srcElement(event);
    var itemContainer = Raster.findParentWithAttr( el, "__iidx");
    if ( itemContainer==null )
        return;

    var list = Raster.findParentExpando( el, "listControl");
    var itemIndex = parseInt(itemContainer.getAttribute("__iidx"));
    var item = list.allItems[ itemIndex ];
    var mouse = Raster.getInputState(event);

    // Determine data index for table list (if applicable)
    var dataIdx = null;
    var colNo = null;
    if ( list.isTable )
    {
        var tmp = Raster.findParentWithAttr( el, "__coln");
        if ( tmp!=null )
        {
            colNo = parseInt( tmp.getAttribute("__coln") );
            dataIdx = list.columns[ colNo ].dataIdx ;
        }/*if*/
    }/*if*/


    // Invoke user-defined event handler
    var lstEvent = null;
    if ( list.eventHandler )
    {
        lstEvent = RasterEvent.mkListEvent( event, isDblClick===true ? "dblclick" : (mouse.button==1 ? "click"  : "context"),
                                         list, item, colNo, itemIndex, null, null, dataIdx, null, null );
        list.eventHandler( lstEvent );
    }/*if*/

    if ( (lstEvent && lstEvent.isCancelled) || !item.isEnabled || isDblClick===true )
        return;

    // select item(s)
    list.mousedownItem = null; //used in mouseup handler

    if ( item.isSelected && !mouse.ctrl && !mouse.shift )// && list.selectedItems.length > 1 )
        list.mousedownItem = item;    // deffer item.select();  to mouseup, asumming drag didn't happen
    else
        item.select( mouse.ctrl,  mouse.shift );

    // Initiate drag operation on this item (if allowed)
    if ( !list.isDnD || mouse.button!=1 )
        return;

    RasterMouse.setCursor( CURSORS.DRAG );
    var mouseEvt = RasterMouse.startDrag( event, item, null, null, true );

    // Store additional table item info in data context
    var data = list.getDragContext( mouseEvt );
    data.colNo = colNo;
    data.dataIdx = dataIdx;
};


/*****************************************************************************
 Handles mouse move in a item drag operation.
 @private
 @param mouseEvt    object: a RasterMouseEvent
 *****************************************************************************/
RasterList.dragDropHandler = function( mouseEvt )
{
    var dragValue = mouseEvt.value;
    var evtType = mouseEvt.type=="enter" ? "over" : mouseEvt.type; // Indicates event type: "enter", "over", "out", "drop", "cancel"
    var list =  mouseEvt.control;

    // nothing we care about is dragged over the control, leave
    if ( !list.isDnD || evtType=="cancel" || dragValue==null  || evtType=="out" )
    {
        RasterMouse.showDropBorderOver( null );
        RasterMouse.showDropLine( null );
        return;
    }/*if*/

    var data = list.getDragContext( mouseEvt );
    var isLocal = dragValue.IID_LISTITEM  && (dragValue.listControl == list);
    var lstEvent = null;


    // a. run once per drag operation, issue 'beforedrag' event to user handler (if any)
    if ( data.isBeforeDrag )
    {
        data.isBeforeDrag = false; //prevent from entering this code block again

        if ( isLocal && list.eventHandler!=null )
        {
            lstEvent = RasterEvent.mkListEvent( mouseEvt.event, "beforedrag", list, dragValue, data.colNo, dragValue.index,
                                                null, null, data.dataIdx, dragValue, null );
            list.eventHandler( lstEvent );
        }

        // Cancel drag on user request
        if ( lstEvent!=null && lstEvent.isCancelled )
        {
            RasterMouse.cancelDrag();
            return;
        }

        RasterMouse.addTimerListener( RasterList.itemMoveAutoScrollHandler, data ); //register timer callback to implement auto-scroll
        list.mousedownItem = null; //prevents mouseUp handler from later changing the list selection
    }/*if*/


    // b. Determine the index of the list item under the mouse, stored it 'itemIndex'
    var itemIndex, position, box={};
    var scrollY = list.contentDiv.scrollTop;
    var localY = Raster.clip( mouseEvt.y, data.y, data.y + data.height ) - data.y;
    var maxBottom = Math.min( data.rowsBottom, data.bottom ) ;
    var isList =  list.isTable || list.isList;

    if ( isList )
    {
        itemIndex =  Math.floor( (scrollY + localY) / data.rowHeight );
        var rowY = itemIndex * data.rowHeight - scrollY + data.y;
        var edge =  Math.round( ((scrollY + localY) % data.rowHeight) / data.rowHeight * 2 );

        box.x = data.x;
        box.y = Math.max( rowY,  data.y ); // Clip y coord to control's area
        box.w = data.width;
        box.h = Math.min( data.rowHeight, maxBottom - rowY ); // Clip y coord to control's area

        position = edge==2 ? "after" : ( (edge==1 && list.eventHandler!=null) ? "over" : "before" ); // no "over" if no event handler present
    }
    else if ( localY < maxBottom ) //isGrid or thumbs
    {
        var n, left;
        var rows = data.gridrows;
        var scrollX = list.contentDiv.scrollLeft;
        var dx = Raster.clip( mouseEvt.x, data.x, data.x + data.width ) - data.x + scrollX;
        localY += scrollY;

        // find row under the mouse
        for ( n=0; n < rows.length-1; n++ )
          if ( localY >= rows[n].top && localY < rows[n+1].top )
            break;

        var len = rows[n].items.length;

        // find item under the mouse
        for ( var i=0; i < len; i++ )
          if ( dx >= rows[n].items[i].left && dx < rows[n].items[i].left + data.itemWidth )
          {
              left = rows[n].items[i].left;
              itemIndex = rows[n].items[i].idx;

              var side = Math.round(( dx-rows[n].items[i].left) / data.itemWidth * 2);
              position = side==2 ? "after" : ( side==1 ? "over" : "before" );
              break;
          }/*for-if*/

        // default to end of the row if no item was found under the mouse
        if ( left==null )
        {
            left = rows[n].items[ len-1 ].left;
            itemIndex = rows[n].items[ len-1 ].idx;
            position = "after" ;
        }
     

        // clip left, top, and left

        box.x = Raster.clip( left+data.x-scrollX, data.x, data.x+data.width );
        box.y = Raster.clip( rows[n].top+data.y-scrollY, data.y, data.y+data.height );
        box.h = Math.min( data.y+data.height, rows[n].top+data.y-scrollY + rows[n].bottom - rows[n].top ) - box.y;
        box.w = Math.min( data.x+data.width-box.x, data.itemWidth);

    }/*if*/

    // when moving over a different item, restore cursor
    if ( data.itemIndex != itemIndex )
        RasterMouse.restoreCursor();

    data.itemIndex = itemIndex;

    RasterMouse.showDropBorderOver( null );
    RasterMouse.showDropLine( null );

    // c. resolve listItem object from itemIndex,
    //    if we are hovering over ourselves, leave
    var listItem = list.allItems[ itemIndex ];
    if ( listItem==null || dragValue==listItem )
        return;

    // d. Notify event handler
    lstEvent = null;

    if ( list.eventHandler!=null && (evtType=="over" || (evtType=="drop" && data.position!=null))   )
    {
        lstEvent = RasterEvent.mkListEvent( mouseEvt.event, evtType, list, listItem, null, itemIndex, null, null, null,
                                            dragValue, (evtType=="over" ? position : data.position) );
        list.eventHandler( lstEvent );

    }/*if*/


    // e. Highlight the insertion point or drop target, draw visual cues
    if (  evtType=="over" && lstEvent && lstEvent.acceptPosition )
    {
        position = data.position = lstEvent.acceptPosition;

        if ( isList )
        {
            if ( position=="after" ) //bottom
                RasterMouse.showDropLine( box.x, box.y + box.h, false, box.w);

            else if ( position=="before" ) //top
                RasterMouse.showDropLine( box.x, box.y, false, box.w );

            else // show drop box
                RasterMouse.showDropBorder( box.x, box.y, box.w, box.h );
        }
        else
        {
            if ( position=="after" ) //bottom
                RasterMouse.showDropLine( box.x + box.w, box.y, true, box.h);

            else if ( position=="before" ) //top
                RasterMouse.showDropLine( box.x, box.y, true, box.h );

            else // show drop box
                RasterMouse.showDropBorder( box.x, box.y, box.w, box.h );
        }
    }
    else if ( evtType!="drop" )
    {
        data.position = null;

    }/*if*/

    // f. Move list items, drag operation occurring locally
    if ( evtType=="drop" && isLocal && data.position && (lstEvent && !lstEvent.isCancelled) )
         list.moveItems( list.selectedItems,  itemIndex + (data.position=="after" ? 1 : 0) );

};


/*****************************************************************************
 Invoked on timely basis during a item drag operation. Performs vertical
 auto scroll as a item is dragged around over the list's bounding box.
 @private
 *****************************************************************************/
RasterList.itemMoveAutoScrollHandler = function( mouseEvt, data )
{
    // Handle auto h-scrolling
    var container = data.list.contentDiv;
    var bounds = data;  //cached container's bounds
    var scrollmax = Math.max( 0, container.scrollHeight - container.clientHeight );

    if ( container.scrollHeight > bounds.height )
    {
        mouseEvt.type = "over";

        if ( mouseEvt.y < bounds.y + 16 && container.scrollTop > 0)
        {
            RasterMouse.showDropBorder( null );
            RasterMouse.showDropLine( null );
            container.scrollTop = Math.max( 0, container.scrollTop-20);
            RasterList.dragDropHandler( mouseEvt );
        }
        else if ( mouseEvt.y > bounds.bottom - 16 )
        {
            RasterMouse.showDropBorder( null );
            RasterMouse.showDropLine( null );
            container.scrollTop = Math.min( scrollmax, container.scrollTop+20);
            RasterList.dragDropHandler( mouseEvt );
        }
    }/*if*/
};


//-------------8<--------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Handles the mouse going down on a table list header. This function is
 responsible for highlighting the header cell, notify the user-defined
 event handler, and init a drag operation.
 @private
 *****************************************************************************/
RasterList.colMousedownHandler = function ( event )
{
    Raster.stopEvent( event );       //prevent selection start from happening
    Raster.setActiveMenu( null );

    var el = Raster.srcElement(event);
    if ( el.getAttribute("grip")!=null )
    {
        RasterList.colResizeInit( event ); //forward event to resize function
        return;
    }/*if*/

    var th = Raster.findParentWithAttr( el, "__coln");
    if ( th==null )
        return;

    var colNo = parseInt( th.getAttribute("__coln") );
    var list = Raster.findParentExpando( el, "listControl");
    var dataIdx = list.columns[ colNo ].dataIdx;
    var mouse = Raster.getInputState(event);

    // Notify user handler (if any)
    var lstEvent = null;
    if ( list.eventHandler )
    {
        lstEvent = RasterEvent.mkListEvent( event, mouse.button==2 ? "colcontext" : "colclick", list, null, colNo,
                                            null, null, null, dataIdx, null, null );
        list.eventHandler( lstEvent );
    }/*if*/


    // Initiate drag operation on this item (if allowed)
    if ( (lstEvent && lstEvent.isCancelled) || mouse.button!=1 )
        return;

    var data = list.getBounds();
    data.list = list;
    data.th = th;
    data.colNo = colNo;
    data.dataIdx = dataIdx;
    data.tickerStarted = false;
    data.ranges = [];


    // Precompute columns boundaries, it is better to use the ofsetWidths than this.columns[].widths
    // since IE v6 and v7 do not honor the widths assigned to the COL element and
    // excludes borders, paddings, and add a unpredictable +/- pixel to the table-cell width
    var sum = 0;
    var cells = th.parentNode.cells;    // thus,

    for ( var i=0; i < cells.length; i++ )
    {
        data.ranges.push( {a: sum, b: sum+cells[i].offsetWidth/2, c:sum+cells[i].offsetWidth} );
        sum += cells[i].offsetWidth;
    }/*for*/

    data.ranges.push( {a: sum, b: -1, c: -1} );

    // Set highlight CSS on header
    if ( list.isSortable )
        Raster.addClass( th, "TableListHdrSelected" );

    Raster.addClass( list.headerDiv, "rasterTableListHideSz"); //css to hide resize cursor temporarily from resize grips

    // Init drag operation
    RasterMouse.startDrag( event, null, data, RasterList.colMoveHandler );
};


/*****************************************************************************
 Handles mouse move operation of a table list column.
 @private
 @param mouseEvt       object: a RasterMouseEvent object
 *****************************************************************************/
RasterList.colMoveHandler = function( mouseEvt )
{
    var data = mouseEvt.data;
    var list = data.list;
    var eventType = mouseEvt.type; // string: one of the following: "move", "up", "cancel", "end"

    if ( list.isCustomizable && eventType=="move"  )
    {
        var sx = list.contentDiv.scrollLeft;
        var x = mouseEvt.x - data.x;
        data.dropIndex = 0; //store the last header index the mouse was over

        if ( !data.tickerStarted ) //lazy init: start auto-scroll timer
        {
            data.tickerStarted = true;
            RasterMouse.addTimerListener( RasterList.colMoveAutoScrollHandler, data );
            RasterMouse.setCursor( CURSORS.MOVE_H );
        }/*if*/

        // Test which column the mouse is over of
        for ( var i=0; i < data.ranges.length; i++ )
            if ( x >= data.ranges[i].a-sx && ( x < data.ranges[i].b-sx || data.ranges[i].b == -1) )
            {
                x = data.ranges[i].a-sx;
                data.dropIndex = i;
                break;
            }
            else if ( x >= data.ranges[i].b-sx && x < data.ranges[i].c-sx )
            {
                x = data.ranges[i].c-sx;
                data.dropIndex = i+1;
                break;
            }/*for-if*/

        // Clip x coord to control's area
        x = Math.min( Math.max( data.x, x + data.x), data.x + data.width - 18 );  // ~ the right scrollbar aprox. width

        if ( data.dropIndex !=null )
            RasterMouse.showDropLine( x, data.y, true,  data.height );
        else
            RasterMouse.showDropLine( null );

    }
    else if (  eventType=="up" )
    {
        var lstEvent = null;

        if ( data.dropIndex==null ) // this means the user just clicked the header and did not drag it
        {
            if ( list.eventHandler )
            {
                lstEvent = RasterEvent.mkListEvent(  mouseEvt.event, "colsort", list, null, data.colNo, null, null,
                                                     null, data.dataIdx, null, null );
                list.eventHandler( lstEvent );
            }/*if*/

            if ( (lstEvent==null || !lstEvent.isCancelled) && list.isSortable )
                list.sort( list.sortedIndex==data.colNo ? !list.isAscending : list.isAscending,
                               data.colNo );

        }
        else if ( list.isCustomizable && data.colNo!=data.dropIndex && (data.colNo+1)!=data.dropIndex ) // otherwise the user went down in the header and dragged it, thus data.dropIndex has the col index where the mouse went up
        {
            if ( list.eventHandler )
            {
                lstEvent = RasterEvent.mkListEvent( mouseEvt.event, "colmove", list, null, data.colNo, null, null, data.dropIndex,
                                                    data.dataIdx, null, null );
                list.eventHandler( lstEvent );
            }/*if*/


            if ( lstEvent==null || !lstEvent.isCancelled  )
                list.moveColumn( data.colNo,  data.dropIndex );
        }

    }
    else if ( eventType=="end" )
    {
        if ( data.list.isResizable )
            Raster.removeClass( data.list.headerDiv, "rasterTableListHideSz");

        Raster.removeClass( data.th, "TableListHdrSelected" );

    }
};


/*****************************************************************************
 Invoked on timely basis during a column drag operation. Performs horizontal
 auto scroll as a column is dragged around over the list's bounding box.
 @private
 *****************************************************************************/
RasterList.colMoveAutoScrollHandler = function( mouseEvt, data)
{
    // Handle auto h-scrolling
    var container = data.list.contentDiv;
    var bounds = data;  //cached container's bounds
    var scrollmax = Math.max( 0, container.scrollWidth - container.clientWidth );

    if ( container.scrollWidth > bounds.width )
    {
        mouseEvt.type = "move";
        if ( mouseEvt.x < bounds.x + 16 && container.scrollLeft > 0)
        {
            RasterMouse.showDropBorder( null );
            RasterMouse.showDropLine( null );
            container.scrollLeft = Math.max( 0, container.scrollLeft-20);
            RasterList.colMoveHandler(  mouseEvt );
        }
        else if ( mouseEvt.x > bounds.x + bounds.width - 36 )
        {
            RasterMouse.showDropBorder( null );
            RasterMouse.showDropLine( null );
            container.scrollLeft = Math.min( scrollmax, container.scrollLeft+20);
            RasterList.colMoveHandler( mouseEvt );
        }
    }/*if*/
};




//-------------8<--------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Handles the mouse going down on a table list header size-grip. This function is
 responsible for showing the resize-vertical-bar, and init a drag operation.
 @private
 *****************************************************************************/
RasterList.colResizeInit = function ( event )
{
    var el = Raster.srcElement(event);
    var list = Raster.findParentExpando( el, "listControl");
    var colNo = Raster.findParentWithAttr( el, "__coln").getAttribute("__coln");

    // if col resizing is OFF, leave..
    if ( !list.isResizable )
        return;

    var mouse = Raster.getInputState(event);
    var data = list.getBounds();
    data.grip = Raster.getBounds( el );
    data.dx = mouse.x - data.grip.x;
    data.list = list;
    data.colNo = parseInt( colNo );
    data.colWidth = list.getColWidth( data.colNo );
    data.dataIdx = list.columns[ colNo ].dataIdx;

    RasterMouse.showShadeBox( data.grip.x, data.y, 5, data.height, "w-resize");
    RasterMouse.startDrag( event, null, data, RasterList.colResizeHander );

};


/*****************************************************************************
 Handles mouse move when dragging a resize grip in a table list column.
 @private
 @param mouseEvt       object: a RasterMouseEvent object
 *****************************************************************************/
RasterList.colResizeHander = function( mouseEvt )
{
    var data = mouseEvt.data;
    var list = data.list;
    var eventType = mouseEvt.type;

    if (  eventType=="move"  )
    {
        var x = Math.max( data.grip.x - data.colWidth + RasterList.MIN_COL_WIDTH , mouseEvt.x - data.dx); //min width is 16px
        RasterMouse.showShadeBox( x, data.y, 5, data.height );
        data.mouseMoved = true;
    }
    else if ( eventType=="up" && data.mouseMoved )
    {
        var lstEvent = null;
        var colsize = Math.max( RasterList.MIN_COL_WIDTH, data.colWidth + (mouseEvt.x - mouseEvt.initial.x) );

        if ( list.eventHandler )
        {
            lstEvent = RasterEvent.mkListEvent( mouseEvt.event, "colsize", list, null, data.colNo, 0, colsize, null, data.dataIdx,
                                                null, null);
            list.eventHandler( lstEvent );
            colsize = lstEvent.newColWidth;
        }/*if*/

        if ( lstEvent==null || !lstEvent.isCancelled  )
        {

            if ( !list.isSpread )
                list.setColWidth( data.colNo,  colsize );
            else if ( list.columns.length > 1 )
            {
                var ratio = list.spreadRatio();                    // for conversion of spread-width to real-width
                var dw = colsize - list.getColWidth( data.colNo ); // change in width
                var nextCol = (data.colNo+1 == list.columns.length ) ? list.columns.length-2 : data.colNo+1; //determine adjacent column

                // adjust colum to new width
                list.setColWidth( data.colNo,  colsize / ratio );

                // give or take the change in width to the adjacent column
                list.setColWidth( nextCol,  Math.max(16, (list.getColWidth( nextCol ) - dw) / ratio ) );
                list.spread( data.colNo );
            }
        }/*if*/
    }/*if*/
};







































