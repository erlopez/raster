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
 Represents an item in a tree control. Tree items are not created by using this
 constructor directly, but rather using of the add() method off the
 <code>tree</code> or any <code>treeItem</code> instance.

 The <code>icon</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.

 @constructor
 @see add()

 @param parentItem        object: A Tree or TreeItem object that owns this item.
 @param icon              string: String containing path of a 16x16 image file
                          or an object that implements the IID_SPRITEINFO interface such as
                          the constants in the #ICONS16 object. Set to
                          null if no icon is desired.
 @param text              string: Text shown in the tree item; set to null for
                          is no text is needed.
 @param value             [any]: Placeholder for an application-specific value to be
                          associated with this tree item. User can access this value
                          later in the Tree's click event handler.
 @param isRoot            [boolean]: True if this constructor is called from
                          the #RasterTree constructor, otherwise unspecified. This
                          argument is for internal use only.
 *****************************************************************************/
function RasterTreeItem( parentItem, icon, text, value, isRoot )
{
    // Set default properties
    this.id = "ti" + (Raster.idSequence++);
    this.isRoot = isRoot===true;

    /**@property parentItem [object]: The <code>TreeItem</code> that is parent of this item. This property is null in the root tree item.*/
    this.parentItem = this.isRoot ? null : parentItem;

    /**@property tree [object]: Reference to the top most tree item, which also happens to be the tree object. */
    this.tree = this.isRoot ? parentItem : parentItem.tree;     //root point to the top-most tree item

    /**@property level [number]: The depth level of this tree item. The tree root is at level 0. Items added directly to the tree root are at level 1. */
    this.level =  this.isRoot ? 0 : this.parentItem.level + 1;  // the tree item's nesting level or depth

    this.isEnabled = true;   /**@property isEnabled [boolean]: True if the tree item is in enabled state, false otherwise. To change the enabled state use setEnabled().*/
    this.isSelectable = true;
    this.isAutoToggle = false;
    this.isCollapsable = true;
    this.isSelected = false; /**@property isSelected [boolean]: True if the tree item is in selected state, false otherwise. To change the select state use select().*/
    this.isExpanded = false; /**@property isExpanded [boolean]: True if the tree item is expanded, false if collapsed.*/

    this.isHeader = false;   /**@property isHeader [boolean]: True if the tree item is marked as header, false otherwise*/
    this.text = text;        /**@property text [string]: Text displayed in the tree item. To change the text in the tree item use setText().*/
    this.icon = icon;        /**@property icon [string]: The tree item's icon. String containing path of a 16x16 image file or an object that implements the IID_SPRITEINFO interface.
                                This property might be null. To set the tree item's icon use setIcon().*/
    this.altIcon = null;     /**@property altIcon [value]: Icon used when the tree item is expanded. String containing path of a 16x16 image file or an object that implements the IID_SPRITEINFO interface.
                                This property might be null. To set the tree item's icon use setAltIcon().*/
    this.value = value;      /**@property value any: Placeholder used to store an application-specific value associated with the tree item.
                                @see RasterTree.getItemByValue()*/
    this.items = {};

    // Create DOM elements
    RasterControl.call( this, this.isRoot ? parentItem.rootContainer : parentItem.childrenDiv );
    this.setClass("rasterTreeItem");
    this.controlBox.treeItem = this;  // trace back to owner control
    this.controlBox.innerHTML = "<div class='rasterTreeItemVline'></div>" +
                                "<div class='rasterTreeItemLabel' onmousedown='RasterTree.clickHandler(event)' " +
                                         "onmouseup='RasterTree.upHandler(event)' ondblclick='RasterTree.dblclickHandler(event)'>" +
                                    "<span class='rasterTreeItemLabelToggle'>" +
                                       "<span class='rasterTreeItemLabelDash'></span>" +
                                    "</span>" +
                                    "<span class='rasterTreeItemLabelIco'></span>" +
                                    "<a href='#'>" +
                                       "<span class='rasterBkleft'></span>" +
                                       "<span class='rasterBkright'></span>" +
                                       "<span class='rasterItemTxt'></span>" +
                                    "</a>" +
                                "</div>" +
                                "<div class='rasterTreeItemChildren'></div>";

    // DOM hookups
    this.vlineDiv = this.controlBox.firstChild;
    this.labelDiv = this.controlBox.childNodes[1];
    this.toggleSpan = this.labelDiv.childNodes[0];
    this.toggleIcoSpan = this.toggleSpan.firstChild;
    this.iconSpan = this.labelDiv.childNodes[1];
    this.iconLink = this.labelDiv.childNodes[2];
    this.childrenDiv = this.controlBox.lastChild;

    this.iconLink.onclick = Raster.stopEvent;
    this.textSpan = this.iconLink.lastChild;

    // Config event handlers
    this.eventHandler = null;
    this.setDropHandler( RasterTree.dragDropHandler ); //super

    // Register this item in parent/tree items{} collections
    if ( !this.isRoot )
    {
        this.parentItem.items[ this.id ] = this;
        this.tree.allItems[ this.id ] = this;
    }/*if*/

    // Update display
    this.setText( text );
    this.setIcon( icon );
    this.updateStyle();
    this.updateLevel();

   /** @property IID_TREEITEM [boolean]: Interface ID tag constant used to identify #RasterTreeItem objects.
                             This property is always true.*/

}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterTreeItem.prototype.IID_TREEITEM = true;
Raster.implementIID ( RasterTreeItem, RasterControl );

/*****************************************************************************
 Returns the text of this tree item.
 @private
 *****************************************************************************/
RasterTreeItem.prototype.toString = function()
{
    return this.text;
};

/*****************************************************************************
 Show or hides the item's left indentation. When the left indentation is
 hidden, the items and children's vline collapses to the left, consuming
 the toggle button space. By default, items are indented.
 @private
 @param isIndented   boolean: True makes the item's left indentation visible;
                     false makes the item's left indentation invisible.
 *****************************************************************************/
RasterTreeItem.prototype.indent = function( isIndented )
{
    this.childrenDiv.style.paddingLeft = isIndented ? "" : "5px";
    this.toggleSpan.style.display = isIndented ?"" : "none";
    this.vlineDiv.style.left = isIndented ? "" : "10px";
};

/*****************************************************************************
 Show or hides the root item. When the root item is hidden, the level 1 items
 (the root children) are unidented and flush closer to the left border.
 By default the root item is visible.
 @private
 @param isRootVisible boolean: True makes the root item visible;
                      false hides the root item and unident the items at
                      level 1.
 *****************************************************************************/
RasterTreeItem.prototype.showRoot = function( isRootVisible )
{
    this.isRootVisible = isRootVisible;
    this.labelDiv.style.display = isRootVisible ? "" : "none";
    this.childrenDiv.style.paddingLeft = isRootVisible ? "5px" : "0";
    this.vlineDiv.style.display = isRootVisible ? "" : "none";

    for ( var id in this.items )
        this.items[id].indent( isRootVisible );

    if ( isRootVisible )
        this.updateStyle();
};


/*****************************************************************************
 Updates this item level property.
 @private
 *****************************************************************************/
RasterTreeItem.prototype.updateLevel = function()
{
    this.level =  this.isRoot ? 0 : this.parentItem.level + 1;
    for ( var id in this.items )
        this.items[id].updateLevel();

    // refresh indentation accoding to level
    this.indent( this.level > 1 || (this.level==1 && this.tree.isRootVisible) );
};


/*****************************************************************************
 Updates the tree item's display according to its internal state.
 @parm  heightChanged [boolean]: In a case of height change, pass true
                       so that this item ancestors are also notify
                       to update their vline style. If changes not affecting
                       the item's height are made, ignore this argument.
 @private
 *****************************************************************************/
RasterTreeItem.prototype.updateStyle = function( heightChanged )
{
    // a. update link style
    if ( !this.isEnabled )
        this.iconLink.className = "rasterTreeItemDisabled";

    else if ( this.isSelected )
        this.iconLink.className = "rasterTreeItemSelected";

    else
        this.iconLink.className = "";

    // b. has header link style?
    if ( this.isHeader )
        this.iconLink.className += " rasterTreeItemHeader";


    // c. upgate toggle image: dash|plus|minus, and collapse/expanded state
    if ( !this.hasChildren() )
    {
        this.toggleIcoSpan.className = "rasterTreeItemLabelDash";
        this.vlineDiv.style.display = "none";
        this.childrenDiv.style.display = "none";
    }
    else if ( this.isExpanded )
    {
        this.toggleIcoSpan.className = this.isCollapsable ? "rasterTreeItemLabelMinus" : "rasterTreeItemLabelDash";
        if ( !this.isRoot || (this.isRoot && this.isRootVisible) )
            this.vlineDiv.style.display =  "block";
        this.childrenDiv.style.display = "block";
        this.vlineDiv.style.height = Math.max(0, this.childrenDiv.lastChild.offsetTop - 10 ) + "px";  //This expression has to be ajusted along with changes to the raster.css#[div.rasterTreeItemLabel  a]
    }
    else  //collapsed
    {
        this.toggleIcoSpan.className = this.isCollapsable ? "rasterTreeItemLabelPlus" : "rasterTreeItemLabelDash";
        this.vlineDiv.style.display = "none";
        this.childrenDiv.style.display = "none";
    }/*if*/


    if ( heightChanged===true && this.parentItem!=null )
        this.parentItem.updateStyle( true );

};


/*****************************************************************************
 Changes the appearance of this tree item between selected/normal. This style
 is not shown when the command item is 'disabled' state. This methos is for
 internal use only.
 @private
 @param isSelected boolean: True shows command item in selected state, false shows
                   it normal.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.markSelected = function( isSelected )
{
    this.isSelected = isSelected;
    this.updateStyle();
    return this;
};


/*****************************************************************************
 Releases and removes all DOM element references used by this item. This method
 also removes all nested children recursively. After this method is invoked,
 this instance should no longer be used. This method is intended to be used
 the item's parent. To remove an item use the remove() method instead.
 @private
 *****************************************************************************/
RasterTreeItem.prototype.dispose = function()
{
    // Delete children
    this.removeAll();

    // Remove this item selection, if any
    if ( this.isSelected )
        this.tree.unselectItem( this );

    // Unregister this item from parent.items{} and tree.allItems{}
    if ( !this.isRoot )
    {
        delete this.parentItem.items[ this.id ];
        delete this.tree.allItems[ this.id ];
    }/*if*/

    // Clean up
    this.items = null;
    this.controlBox.treeItem = null;
    this.vlineDiv = null;
    this.toggleSpan = null;
    this.toggleIcoSpan = null;
    this.iconSpan = null;
    this.iconLink.onclick =  null;
    this.iconLink = null;
    this.childrenDiv = null;
    this.textSpan =  null;
    this.labelDiv = null;
    this.eventHandler = null;

    if ( this.sprite )
        this.sprite.dispose();

    // Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
  //  out( 'removing level['+ this.level+'] '+ this.text );

};


/*****************************************************************************
 Removes the item and its children from the tree.
 @return object: The tree item object.
 *****************************************************************************/
RasterTreeItem.prototype.remove = function()
{
    this.dispose();
    if ( this.parentItem!=null )
        this.parentItem.updateStyle( true );

    return this;
};


/*****************************************************************************
 Removes all item's children.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.removeAll = function()
{
    // Dispose and unregister the children
    // Cannot iterate thru this.items{} collection and remove at the same time, use temp[] array as iterator
    var temp = new Array();
    for ( var id in this.items )
       temp.push( this.items[id] );

    for ( var i=0; i < temp.length; i++)
        temp[i].dispose();

    this.updateStyle( this.isExpanded );
    return this;
};


/*****************************************************************************
 Return the item's immediate children items.
 @return array: List of this item's children. Returns an empty array if there
         are no children in the item.
 *****************************************************************************/
RasterTreeItem.prototype.getChildren = function()
{
    var temp = new Array();

    // Iterate over the DOM nodes in favor of 'this.items' to ensure order
    for ( var i=0; i < this.childrenDiv.childNodes.length; i++ )
       temp.push( this.childrenDiv.childNodes[i].treeItem );

    return temp;
};



/*****************************************************************************
 Retrieve a list of all the items recursively nested under a given parent item.
 Items are returned in the order the appear. Parent items are always listed
 ahead of their children.
 @return array: Array containing all the descendants of the item. An empty
         array if the tree has no items in it.
 *****************************************************************************/
RasterTreeItem.prototype.getItems = function( temp )
{
    if ( temp!=null )
        temp.push( this );
    else
        temp = [];

    var childs = this.childrenDiv.childNodes;

    // Iterate over the DOM nodes in favor of 'this.items' to ensure order
    for ( var i=0; i < childs.length; i++ )
        if ( childs[i].treeItem.hasChildren() )
            childs[i].treeItem.getItems( temp );  //recurse down
        else
            temp.push( childs[i].treeItem );

    return temp;
};


/*****************************************************************************
 Ensure this item is visible in the scroll viewport.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.scrollIntoView = function()
{
    var item = this;
    while ( (item=item.parentItem) != null )
            item.setExpanded(true);

    this.controlBox.scrollIntoView();
    
    return this;
};


/*****************************************************************************
 Test if this item instance is a direct or indirect parent of the given item.
 This method is useful when moving items around and ensure any give parent item
 is not moved down into its own children, thus avoiding a cyclic recursive error.
 @param item object: Tree item to be tested
 @return boolean: True if this instance is a  direct or indirect parent of the
         given item, false otherwise.
 *****************************************************************************/
RasterTreeItem.prototype.isAncestorOf = function( item )
{
    if ( item.level > this.level )
        while ( (item=item.parentItem) != null )
            if ( item==this )
                return true;

    return false;
};


/*****************************************************************************
 Test if this item is the first (top-most) of its sibling.
 @return boolean: True if this item is the first of its sibling, false otherwise.
 *****************************************************************************/
RasterTreeItem.prototype.isFirst = function()
{
    return this.controlBox.previousSibling!=null;
};


/*****************************************************************************
 Test if this item is the last (bottom-most) of its sibling.
 @return boolean: True if this item is the last of its sibling, false otherwise.
 *****************************************************************************/
RasterTreeItem.prototype.isLast = function()
{
    return this.controlBox.nextSibling!=null;
};


/*****************************************************************************
 Returns the previous item (if any).
 @return object: The previous item, or null if no previous item is present.
 *****************************************************************************/
RasterTreeItem.prototype.getPreviousItem = function()
{
    return this.controlBox.previousSibling!=null ? this.controlBox.previousSibling.rasterControl : null;
};

/*****************************************************************************
 Returns the next item (if any).
 @return object: The next item, or null if no next item is present.
 *****************************************************************************/
RasterTreeItem.prototype.getNextItem = function()
{
    return this.controlBox.nextSibling!=null ? this.controlBox.nextSibling.rasterControl : null;
};

/*****************************************************************************
 Move this item before its previous sibling. This method has no effect if the
 item is the first.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.moveUp = function()
{
    var sibling = this.getPreviousItem();
    if ( sibling!=null )
    {
        var sy = this.tree.rootContainer.scrollTop;
        this.tree.setDisplay(false);
        Raster.setSibling( this.controlBox, sibling, false);
        this.tree.setDisplay(true);
        this.tree.rootContainer.scrollTop = sy;
    }/*if*/

    this.parentItem.updateStyle(true);

    return this;
};


/*****************************************************************************
 Move this item after its next sibling. This method has no effect if the item
 is the last.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.moveDown = function()
{
    var sibling = this.getNextItem();
    if ( sibling!=null )
    {
        var sy = this.tree.rootContainer.scrollTop;
        this.tree.setDisplay(false);
        Raster.setSibling( this.controlBox, sibling, true);
        this.tree.setDisplay(true);
        this.tree.rootContainer.scrollTop = sy;
    }/*if*/

    this.parentItem.updateStyle(true);

    return this;
};


/*****************************************************************************
 Relocate this item before or after the given sibling. If the given sibling is
 a descendant of this item, the change request is ignored.
 @param sibling object:  Reference to a tree item
 @param after   boolean: True place this item after the given sibling; false
                place this item before the given sibling.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setSiblingItem = function( sibling, after)
{
    if ( this.isAncestorOf(sibling) || sibling.tree!=this.tree)
        return this;

    var oldParent = this.parentItem;
    delete oldParent.items[ this.id ];
    sibling.parentItem.items[ this.id ] = this;
    this.parentItem = sibling.parentItem;

    // temporarily hidding the tree container before rearranging treeitems
    // prevents IE from having the "desappearing elements" effect
    // This has no known side-effects in mozilla/webkit browsers,
    // so there is no need for branching
    var sy = this.tree.rootContainer.scrollTop;
    this.tree.setDisplay(false);
    Raster.setSibling( this.controlBox, sibling.controlBox, after);
    this.tree.setDisplay(true);
    this.tree.rootContainer.scrollTop = sy;

    this.updateLevel();
    sibling.parentItem.updateStyle( sibling.parentItem.isExpanded  );
    oldParent.updateStyle( oldParent.isExpanded );

    return this;

};



/*****************************************************************************
 Relocate this item as a child of the given parent item. If the given parent
 is a descendant of this item, the change request is ignored.
 @param parent object: Reference to a tree item
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setParentItem = function( parent )
{
    if ( this.isAncestorOf(parent) || parent.tree!=this.tree)
        return this;

    var oldParent = this.parentItem;
    delete oldParent.items[ this.id ];
    parent.items[ this.id ] = this;
    this.parentItem = parent;

    // temporarily hidding the tree container before rearranging treeitems
    // prevents IE from having the "desappearing elements" effect
    // This has no known side-effects in mozilla/webkit browsers,
    // so there is no need for branching
    var sy = this.tree.rootContainer.scrollTop;  //IE lose the scrolltop when hidden
    this.tree.setDisplay(false);
    Raster.setParent( this.controlBox, parent.childrenDiv );
    this.tree.setDisplay(true);
    this.tree.rootContainer.scrollTop = sy;

    this.updateLevel();
    parent.updateStyle(  parent.isExpanded || Raster.isIE6 || Raster.isIEQuirks ); //ie has artifacts here, thus force redraw all parent vlines
    oldParent.updateStyle( oldParent.isExpanded  );
   
    return this;
};


/*****************************************************************************
 Test is the tree item has children.
 @return boolean: True if the item has children, false otherwise.
 *****************************************************************************/
RasterTreeItem.prototype.hasChildren = function()
{
    return this.childrenDiv.childNodes.length > 0;
};


/*****************************************************************************
 Specifies if an item collapse and expand automatically when it is clicked.
 @param isAutoToggle boolean: True enables the item to collapse/expand automatically
                     when it is clicked; false turns off this feature (default).
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setAutoToggle = function( isAutoToggle )
{
    this.isAutoToggle = isAutoToggle;
    return this;
};


/*****************************************************************************
 Specifies if an item is selectable or not. When an item is in unselectable
 mode it cannot be selected by the user and cannot be dragged. It does however
 generate "click" events.
 @param isSelectable boolean: True enables the items to be selectable (default)
                     False prevents the item from being selected.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setSelectable = function( isSelectable )
{
    if ( this.isSelected && !isSelectable )
        this.tree.unselectItem( this );

    this.isSelectable = isSelectable;
    //this.updateStyle();

    return this;
};


/*****************************************************************************
 Specifies if an item can collapse or is always expanded. When collapsable
 is turned off, the item's children are always visible and the expanded/collapse
 toggle button disabled (hidden)
 @param isCollapsable boolean: True enables the items to collapse/expand normally
                      (default); false prevents the user from collapsing the item.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setCollapsable = function( isCollapsable )
{
    this.isCollapsable = isCollapsable;

    if ( this.isExpanded )
        this.updateStyle();
    else
        this.expand();

    return this;
};


/*****************************************************************************
 Apply or removes the header style to/from this tree item.
 @param isHeader boolean: Apply the style of header to this tree item, false
                 removes it.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setHeader = function( isHeader )
{
    this.isHeader = isHeader;
    this.updateStyle();

    return this;
};


/*****************************************************************************
 Apply or removes the CSS style to/from the text in the tree item.
 @param cssClass string: Name of custom css class to apply to the text
                 of the tree item. Set to null to remove any previously
                 set style.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.applyClass = function( cssClass )
{
    this.textSpan.className = cssClass || "";
    return this;
};


/*****************************************************************************
 Specifies if an item is enabled or disabled. When an item is in disabled mode,
 the item will generate "click" events, but will not be selected. If the item
 has children, the expanded/collapse toggle button will still works. However
 <code>setCollapsable()</code> can be used to prevent the user from collapsing
 an item.
 @param isEnabled boolean: True shows command normal, false greys out the icon & text.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setEnabled = function( isEnabled )
{
    if ( this.isSelected )
        this.tree.unselectItem( this );

    this.isEnabled = isEnabled;
    if ( this.icon!=null )
        this.sprite.setOpacity( isEnabled ? 100 : 33 );
    
    this.updateStyle();
    return this;
};


/*****************************************************************************
 Changes the appearance of this tree item to show/hide its children.
 @param isExpanded boolean: True shows the item's children, false hides its children.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setExpanded = function( isExpanded )
{
    if ( this.isExpanded == isExpanded ) //no change? leave
        return this;

    this.isExpanded = isExpanded;

    // Update expanded icon (if any)
    if ( this.icon!=null && this.altIcon!=null )  //ensure this.sprite has been initialized
        this.sprite.setImage( this.isExpanded ? this.altIcon : this.icon );

    this.updateStyle( true );
    return this;
};


/*****************************************************************************
 Shortcut for <code>setExpanded( true )</code>.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.expand = function()
{
    this.setExpanded( true );
    return this;
};


/*****************************************************************************
 Shortcut for <code>setExpanded( false )</code>.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.collapse = function()
{
    this.setExpanded( false );
    return this;
};


/*****************************************************************************
 Change the collapsed/expanded state in the tree item. This method has no
 effect if the item has no children.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.toggle = function()
{
    this.setExpanded( !this.isExpanded );
    return this;
};


/*****************************************************************************
 Sets the text displayed in this tree item.
 @param text  string: Text shown in the tree; set to null
              if no text is needed.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setText = function( text )
{
    this.text = text;
    this.textSpan.innerHTML = text || "&nbsp;";

    return this;
};


/*****************************************************************************
 Sets the icon displayed in this tree item when the branch is expanded. For
 this feature to work, a default icon must be set via the <code>setIcon()</code>
 method.

 The <code>altIcon</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.

 @param altIcon           string: String containing path of a 16x16 image file
                          or an object that implements the IID_SPRITEINFO interface such as
                          the constants in the #ICONS16 object. Set to
                          null to remove the item's  alternate icon.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setAltIcon = function( altIcon )
{
    this.altIcon = altIcon;

    if ( this.icon!=null && this.isExpanded )  //ensure this.sprite has been initialized
        this.sprite.setImage( altIcon || this.icon );

    return this;
};


/*****************************************************************************
 Sets the icon displayed in this tree item.
 The <code>icon</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.

 @param icon              string: String containing path of a 16x16 image file
                          or an object that implements the IID_SPRITEINFO interface such as
                          the constants in the #ICONS16 object. Set to
                          null if no icons is desired.
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.setIcon = function( icon )
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
 Include this item in the tree selection.
 @param add      [boolean]: true add the given item to the current list
                 selection (if any). When false, the previously list selection
                 is cleared before the given item is selected (default).
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.select = function( add, range )
{
    //TODO:
    //    @param range    [boolean]: True select all the items in range from the last
    //                 selected item to the given item; false selects one item (default).
    //
    this.tree.selectItem( this, add, range );
    return this;
};


/*****************************************************************************
 Excludes this item from the tree the selection (if selected).
 @return object: The tree item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTreeItem.prototype.unselect = function()
{
    this.tree.unselectItem( this );
    return this;
};


/*****************************************************************************
 Adds an item to the tree or item branch.
 @param icon         string: String containing path of a 16x16 image file
                     or an object that implements the IID_SPRITEINFO interface such as
                     the constants in the #ICONS16 object. Set to
                     null if no icons is desired.
 @param text         string: Text shown in the item
 @param value        [any]: Placeholder for an user-defined value to be
                     associated with this item. User can access this value
                     later in the Tree event handler. Also the method
                     RasterTree.getItemByValue() can be used to retrieve
                     this item based on the user-defined value.
 @return object: A reference to the #RasterTreeItem object just added.
 @see RasterTree.getItemByValue(), text, setText(), icon, setIcon()
 *****************************************************************************/
RasterTreeItem.prototype.add = function( icon, text, value )
{
    var item = new RasterTreeItem( this, icon, text, value );
    this.updateStyle( this.isExpanded );

    return item;
};                                                                         


//----------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Creates a tree control. Tree controls take the entire area of their
 parent container. The #RasterTree class extends the #RasterTreeItem class,
 thus all <code>RasterTreeItem</code> methods apply to the <code>RasterTree</code>
 object.  

 The following code creates a tree control inside a document element
 with an <code>id</code> of "treeDiv":
 <pre code>
    var mytree = new <b>Tree</b>( "treeDiv", ICONS16.COMPUTER, "My System");

    mytree.add( ICONS16.BOOK_OPEN, "Help Topics"); //add 1st item

    var item = mytree.add( ICONS16.CALENDAR, "Add Event"); //add 2nd item
    item.add( ICONS16.PAGE, "Birthday Party"); //add child in 2nd item above
 </pre>
 The <code>icon</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.

 @constructor
 @see RasterTreeItem, RasterTreeItem.add(), ICONS16, RasterTreeEvent

 @param parent            object: A string containing the ID of a DOM element,
                          a DOM element object, or another #RasterControl object.
                          If this argument is null, the tree is created but not
                          attached to the DOM herarchy; RasterControl.setParent() must
                          be invoked later to specify the parent container.
 @param icon              string: String containing path of a 16x16 image file
                          or an object that implements the IID_SPRITEINFO interface such as
                          the constants in the #ICONS16 object. Set to
                          null if no icons is desired.
 @param text              string: Text shown in the root item; set to null for
                          is no text is desired.
 *****************************************************************************/
function RasterTree( parent, icon, text  )
{
    this.rootContainer = document.createElement("DIV");
    this.rootContainer.className = Raster.isIEQuirks ? "rasterTree rasterTreeQuirks" : "rasterTree";
    Raster.setParent( this.rootContainer, parent, true );

    // Set properties
    this.allItems = {};
    this.selectedItems = new Array();
    this.isDnD = false;  //disables drag drop
    this.isMultiSelect = false;
    this.isRootVisible = true;
    this.linesVisible = true;

    // Event handlers
    this.eventHandler = null;
    //this.controlBox.onmousedown = RasterTree.mousedownHandler;


    // call super()
    RasterTreeItem.call( this, this, icon, text, "rastreeroot" + (Raster.idSequence++), true );

    // Adjust display on root node
    this.setExpanded( true );
    this.setHeader( true );
    this.indent( false );

   /** @property IID_TREE [boolean]: Interface ID tag constant used to identify #RasterTree objects.
                             This property is always true.*/

}
/*****************************************************************************
 Statics, Implements the TreeItem class
 @private
 *****************************************************************************/
RasterTree.prototype.IID_TREE = true;
Raster.implementIID ( RasterTree, RasterTreeItem );

/*****************************************************************************
 Handle mouse double click on tree item
 @private
 *****************************************************************************/
RasterTree.dblclickHandler = function (event)
{
    RasterTree.clickHandler( event, true );
};


/*****************************************************************************
  Handle mouse down on tree item label
  @private
 *****************************************************************************/
RasterTree.upHandler = function (event)
{
    var el = Raster.srcElement( event );
    var treeItem = Raster.findParentExpando(el, "treeItem");

    // Ignore event when not coming from a treeItem element
    if ( treeItem==null )
        return;

    var tree = treeItem.tree;

    if ( tree.mousedownItem==treeItem && treeItem.isEnabled && treeItem.isSelectable  )
        treeItem.select();

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
RasterTree.prototype.getDragContext = function( mouseEvt )
{
    // If we already created a drag context in this mouseEvt,
    // return that object
    var dragContext = mouseEvt.context[ this.id ];

    // otherwise create drag context object for this control instance
    // and register it in the mouseEvt.context.
    if ( !dragContext )
    {
        dragContext = {  ticker: 0,//setInterval(RasterTree.dragAutoScrollExpandHandler, 100 ),
                         ticksOverItem : 0,     // counts number of ticks happened on the last hover item - used as timer to trigger expand
                         lastHoverItem: null,   // pointer to the last treeTtem the mouse entered
                         bounds: Raster.getBounds( this.rootContainer ),  // tree's scroll box boundaries
                         isBeforeDrag: true,      // flag to track if beforedrag event already occurred
                         tree: this                 // the tree control
                      };

        mouseEvt.context[ this.id ]  = dragContext;
    }/*if*/

    return dragContext;
};


/*****************************************************************************
 Handle mouse down on tree item label
 @private
 *****************************************************************************/
RasterTree.clickHandler = function (event, isDblClick )
{
    var el = Raster.srcElement( event );
    var treeItem = Raster.findParentExpando(el, "treeItem");

    Raster.stopEvent( event );       //prevent selection start from happening
    Raster.setActiveMenu( null );

    // Ignore event when not coming from a treeItem element
    if ( treeItem==null )
        return;

    var mouse = Raster.getInputState(event);
    var isToggle = ( el==treeItem.toggleSpan || el==treeItem.toggleIcoSpan );
    var tree = treeItem.tree;
    tree.mousedownItem = null;

    // Ignore toggle events on non-collapsable and childrenless items
    if ( isToggle && (!treeItem.isCollapsable || !treeItem.hasChildren()) )
        return;

    // Invoke user defined event handler (if any)
    var treeEvent = null;
    if ( tree.eventHandler!=null )
    {
        var type = isToggle ? ( treeItem.isExpanded ? "collapse" : "expand" ) :
                              ( isDblClick===true ? "dblclick" : (mouse.button==1 ? "click" : "context") );

        treeEvent = RasterEvent.mkTreeEvent( event, type, tree, treeItem, null );
        tree.eventHandler( treeEvent );

    }/*if*/


    // If user wishes to prevent further action, leave
    if ( isDblClick===true  || (treeEvent && treeEvent.isCancelled) )
        return;

    // Toggle collapse/expand state (if applicable) or update tree selection
    // Flags taken in consideration: isAutoToggle, isEnabled, isSelectable, isCollapsable
    if ( treeItem.isCollapsable && (isToggle || treeItem.isAutoToggle) )
        treeItem.toggle();

    if ( !isToggle && treeItem.isEnabled && treeItem.isSelectable   )
    {
        if ( treeItem.isSelected && !mouse.ctrl && !mouse.shift )// && list.selectedItems.length > 1 )
           tree.mousedownItem = treeItem; // deffer treeItem.select();  to mouseup, asumming drag didn't happen
        else
            treeItem.select( mouse.ctrl,  mouse.shift  );
    }/*if*/


    // Initiate drag operation on this item (if allowed)
    if ( tree.isDnD && mouse.button==1 && treeItem.isSelectable && treeItem.isEnabled )
    {
        RasterMouse.setCursor( CURSORS.DRAG );
        RasterMouse.startDrag( event, treeItem, null, null, true );
    }/*if*/
};


/*****************************************************************************
 Handles drag and drop operations used in tree item re-organisation.
 @private
 @param mouseEvt    object: a RasterMouseEvent
 *****************************************************************************/
RasterTree.dragDropHandler = function( mouseEvt )
{
    var treeItem = mouseEvt.control;
    var dragValue = mouseEvt.value;
    var evtType = mouseEvt.type;  // Indicates event type: "enter", "over", "out", "drop", "cancel"
    var tree = treeItem.tree;

    // nothing we care about is dragged over the control, leave
    if ( !tree.isDnD || evtType=="cancel" || dragValue==null )
        return;

    var bounds = Raster.getBounds( treeItem.iconLink );
    var data = tree.getDragContext( mouseEvt );
    var isLocal = dragValue.IID_TREEITEM  && (dragValue.tree == tree);
    var treeEvent = null;

    // Refresh Interval data used in drag auto-expand
    if ( evtType=="enter" )
    {
        data.ticksOverItem = 0; //reset counter
        data.lastHoverItem = treeItem;
        evtType = "over"; 
    }
    else if ( evtType=="out" )
    {
        data.lastHoverItem = null;
        return;
    }/*if*/


    // a. run once per drag operation, issue 'beforedrag' event to user handler (if any)
    if ( data.isBeforeDrag )
    {
        data.isBeforeDrag = false; //prevent from entering this code block again

        if ( isLocal && tree.eventHandler!=null )
        {
            treeEvent = RasterEvent.mkTreeEvent( mouseEvt.event, "beforemove", tree, dragValue, dragValue, null );
            tree.eventHandler( treeEvent );
        }

        // Cancel drag on user request
        if ( treeEvent!=null && treeEvent.isCancelled )
        {
            RasterMouse.cancelDrag();
            return;
        }/*if*/

        tree.rootContainer.scrollLeft = 0; //scroll all the way to the left
        RasterMouse.addTimerListener( RasterTree.dragAutoScrollExpandHandler, data ); //register timer callback to implement auto-scroll
    }/*if*/

    // hide drop target marks
    RasterMouse.showDropBorderOver( null );
    RasterMouse.showDropLine( null );

    // b. if we are hovering over ourselves, leave
    if ( dragValue==treeItem )
        return;

    var edge = treeItem.isRoot ? 8 : RasterMouse.getNearestEdgeV(treeItem.labelDiv, mouseEvt.event, bounds.height/3);
    var position = edge==5 ? "after" : ( edge==1 ? "before" : "over" );

    // c. Notify event handler
    treeEvent = null;

    if ( tree.eventHandler!=null && (evtType=="over" || (evtType=="drop" && data.position!=null))   )
    {
        treeEvent = RasterEvent.mkTreeEvent( mouseEvt.event, evtType, tree, treeItem, dragValue,
                                              (evtType=="over" ? position : data.position)  );
        tree.eventHandler( treeEvent );
    }/*if*/


    // d. Highlight the insertion point or drop target, draw visual cues
    if (  evtType=="over" && treeEvent && treeEvent.acceptPosition )
    {
        position = data.position = treeEvent.acceptPosition;

        var width =  Math.min( Math.abs( data.bounds.x+data.bounds.width-bounds.x ), data.bounds.width-20 );
        var x = Math.max( data.bounds.x, bounds.x-20 );

        if ( position=="after" ) //bottom
            RasterMouse.showDropLine( x, bounds.y+bounds.height, false, width);

        else if ( position=="before" ) //top
            RasterMouse.showDropLine( x, bounds.y, false, width);

        else // show drop box
        {
            var box = Raster.toRect( bounds.x,
                                     Math.max( bounds.y, data.bounds.y ),  //clip drop box to tree control bounds
                                     Math.min(bounds.x+bounds.width, data.bounds.x+data.bounds.width-20),
                                     Math.min( bounds.y+bounds.height, data.bounds.y+data.bounds.height ) );

            RasterMouse.showDropBorder( box.x, box.y, box.width, box.height );
        }/*if*/

    }
    else if ( evtType!="drop" )
    {
        data.position = null;

    }/*if*/


    // e. Move tree items, drag operation occurring locally
    if ( evtType=="drop" && isLocal && data.position && (treeEvent && !treeEvent.isCancelled) )
    {
        if ( data.position=="before" )
            tree.moveItemsBefore( tree.selectedItems, treeItem );
        else  if ( data.position=="after")
            tree.moveItemsAfter( tree.selectedItems, treeItem );
        else
            tree.moveItemsTo( tree.selectedItems, treeItem );
    }/*if*/

};


/*****************************************************************************
 Invoked on timely basis during a drag operation. Performs tree auto scroll
 and item auto expand functions as an item is dragged around over the tree's
 bounding box.
 @private
 @param mouseEvt object: current RasterMouseEvent
 @param data     object: drag context for a tree instance
 *****************************************************************************/
RasterTree.dragAutoScrollExpandHandler = function( mouseEvt, data )
{
    // Handle auto scrolling
    var container = data.tree.rootContainer;
    var bounds = data.bounds;  //cached container's bounds
    var scrollmax = Math.max( 0, container.scrollHeight - container.clientHeight );
    var scrollTop = container.scrollTop ;  // to track scroll change
    
    if ( container.scrollHeight > bounds.height )
    {
        if ( Math.abs( mouseEvt.y - bounds.y ) <= 20 && container.scrollTop > 0)
            container.scrollTop = Math.max( 0, container.scrollTop-20 );

        else if ( Math.abs( bounds.y + bounds.height - mouseEvt.y) <= 20 )
            container.scrollTop = Math.min( scrollmax, container.scrollTop+20 );

    }/*if*/

    if ( scrollTop != container.scrollTop )
    {
        RasterMouse.showDropBorder( null );
        RasterMouse.showDropLine( null );
        return;
    }

    // Handle auto expand
    data.ticksOverItem ++;
    if ( data.ticksOverItem==3 && data.lastHoverItem!=null && data.lastHoverItem.isEnabled &&
         data.lastHoverItem.hasChildren() && !data.lastHoverItem.isExpanded )
         data.lastHoverItem.expand();

};



/*****************************************************************************
 Releases and removes all DOM element references used by the tree. This method
 also removes all nested children recursively. After this method is invoked,
 this tree instance should no longer be used.
 *****************************************************************************/
RasterTree.prototype.dispose = function()
{
    RasterTreeItem.prototype.dispose.call( this );

    if ( this.rootContainer.parentNode )
        this.rootContainer.parentNode.removeChild( this.rootContainer );

    this.rootContainer = null;
};


/*****************************************************************************
 This method does nothing. The root item cannot be removed. To delete the tree
 use <code>dispose()</code>.
 @private
 *****************************************************************************/
RasterTree.prototype.remove = function()
{
    return this;
};


/*****************************************************************************
 Show or hide vertical lines.
 @param linesVisible boolean: True show the lines; false hide the lines.
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.showLines = function ( linesVisible )
{
    this.linesVisible = linesVisible;

    if ( linesVisible )
        Raster.removeClass( this.rootContainer, "rasterTreeNolines" );
    else
        Raster.addClass( this.rootContainer, "rasterTreeNolines" );

    return this;
};


/*****************************************************************************
 Enables or disables drag and drop functions in the tree control.
 @param isDnD       boolean: True enables tree items to be dragged
                    and to become drop targets; false turns this feature off
                   (default).
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.setDragDrop = function( isDnD )
{
    this.isDnD = isDnD;
    return this;
};


/*****************************************************************************
 Specifies if multiple tree items can be selected at the same time.
 @param isMultiSelect boolean: True allow multiple tree items can be selected
                      at the same time; false allows only one item be selected
                      (default).
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.setMultiSelect = function( isMultiSelect )
{
    this.isMultiSelect = isMultiSelect;
    return this;
};

/*****************************************************************************
 Clears any selection in the tree.
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.clear = function()
{
    for ( var i=0; i < this.tree.selectedItems.length; i++ )
        this.selectedItems[i].markSelected ( false );

    this.selectedItems.splice(0, this.selectedItems.length );

    return this;
};


/*****************************************************************************
 Expands all parents in the tree.
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.expandAll = function()
{
    for ( var id in this.allItems )
        if ( this.allItems[id].hasChildren() )
            this.allItems[id].expand();

    return this;
};

/*****************************************************************************
 Collapses all parents in the tree.
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.collapseAll = function()
{
    for ( var id in this.allItems )
        if ( this.allItems[id].hasChildren() )
            this.allItems[id].collapse();

    return this;
};


/*****************************************************************************
 Returns the tree item having a value attributte matching the given argument.
 @param value    any: A value matching the value attribute of a TreeItem.
 @return object: The tree item having a value attributte matching the given argument.
         Returns null if no tree item having a value attributte matching the
         given argument is found.
 *****************************************************************************/
RasterTree.prototype.getItemByValue = function( value )
{
    for ( var id in this.allItems )
        if ( this.allItems[id].value == value )
            return this.allItems[id];

    return null;
};


/*****************************************************************************
 Unselects an item in the Tree (if selected).
 @param item     object: A reference to a TreeItem object, or a
                 value matching the value attribute of a TreeItem.
                 If a item matching this argument is not found in the
                 tree, this method does nothing.
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.unselectItem = function( item )
{
    if ( item==null || !item.IID_TREEITEM )  // If item not a IID_TREEITEM, treat it as a value attributte
        item = this.getItemByValue( item );

    if ( item!=null )
        for ( var i=0; i < this.tree.selectedItems.length; i++ )
            if ( item==this.selectedItems[i] )
            {
                this.selectedItems.splice(i, 1);
                item.markSelected ( false );
                break;
            }/*if*/

    return this;
};


/*****************************************************************************
 Include an item in the current tree selection (if any).
 @param item     object: A reference to a TreeItem object, or a
                 value matching the value attribute of a TreeItem.
                 If an item matching this argument is not found in this
                 container, this method does nothing. Set this argument
                 to null to clear any selection in the tree.
 @param add      [boolean]: true add the given item to the current list
                 selection (if any). When false, the previously list selection
                 is cleared before the given item is selected (default).
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.selectItem = function( item, add, range )
{
    if ( !this.isMultiSelect )
        add = range = null;

    //TODO: implement inRange
    // @param range    [boolean]: True select all the items in range from the last
    //                 selected item to the given item; false selects one item (default).

    if ( item==null || !item.IID_TREEITEM )  // If item not a IID_TREEITEM, treat it as a value attributte
        item = this.getItemByValue( item );

    if ( add!==true )
        this.clear();

    if ( item!=null && item.isEnabled && item.isSelectable )
    {
        if ( add===true && item.isSelected )
            item.unselect();
        else
        {
            item.markSelected ( true );
            this.selectedItems.push( item );
        }/*if*/
        

    }/*if*/

    return this;
};


/*****************************************************************************
 Retrieve list of selected items in the tree.
 @return array: Array containing the tree selected items. An empty array if
         no selected items are found.
 *****************************************************************************/
RasterTree.prototype.getSelectedItems = function()
{
    return this.selectedItems.slice(0);
};

/*****************************************************************************
 Retrieve the most recently selected item.
 @return object: The most recently selected item, or null if no items are
         selected.
 *****************************************************************************/
RasterTree.prototype.getSelectedItem = function()
{
    return this.selectedItems.length==0 ? null : this.selectedItems[ this.selectedItems.length-1 ];
};

/*****************************************************************************
 Test is the tree has any selection.
 @return boolean: True is there are selected items in the tree; false otherwise.
 *****************************************************************************/
RasterTree.prototype.hasSelection = function()
{
    return this.selectedItems.length > 0;
};


/*********************************************************************************
 Removes the currently selected items from the tree (if any).
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *********************************************************************************/
RasterTree.prototype.removeSelectedItems = function()
{
    this.removeItems( this.getSelectedItems() );
    return this;
};

/*********************************************************************************
 Removes one of more items from the tree.
 @param items  object: Either a single TreeItem object or an array of TreeItem
               objects to be moved.
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *********************************************************************************/
RasterTree.prototype.removeItems = function( items )
{
    if ( items.IID_TREEITEM )
        items.remove();
    else
    {
        var arr = items.slice(0);
        arr.sort( function(a,b) { return b.level - a.level; } );

        // remove incoming items from tree, removing deepest items first
        for (var i=0; i < arr.length; i++ )
            arr[i].remove();

    }/*if*/

    return this;
};


/*****************************************************************************
 Specifies an event handler to be notified of tree events. The following
 example shows a basic event handler:
 <pre code>
    var tree = new RasterTree("myDiv", ICONS16.COMPUTER, "My Computer");
    tree.setEventHandler( myHandler );  //assign event handler

    ...

    function myHandler( evt )
    {
        switch ( evt.type )
        {
           case "click"    : alert ( evt.item.text + " was clicked" );
                             break;
        }
    }

 </pre>

 @param eventHandler   [function]: Callback function to be notified of
                       events in the tree. Set to null to remove any
                       previously set event handler.

 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 @see RasterTreeEvent, RasterMouse.cancelDrag() 
 *****************************************************************************/
RasterTree.prototype.setEventHandler = function( eventHandler )
{
    this.eventHandler = eventHandler;
    return this;
};


/*****************************************************************************
 Move one of more tree items before any given sibling.
 @param items   object: Either a single tree item or an array of tree items.
 @param sibling object: The sibling the item(s) will be move before of.
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.moveItemsBefore = function( items, sibling )
{
    this.moveItems( items, sibling, 'b' );
    return this;
};

/*****************************************************************************
 Move one of more tree items after any given sibling.
 @param items   object: Either a single tree item or an array of tree items.
 @param sibling object: The sibling the item(s) will be move after of.
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.moveItemsAfter = function( items, sibling )
{
    this.moveItems( items, sibling, 'a' );
    return this;
};

/*****************************************************************************
 Move one of more tree items as children of any given parent.
 @param items   object: Either a single tree item or an array of tree items.
 @param parent  object: The new parent for the item(s).
 @return object: The tree object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTree.prototype.moveItemsTo = function( items, parent )
{
    this.moveItems( items, parent, 'c' );
    return this;
};

/*****************************************************************************
 Perform batch move of items, before, after, or to another item.
 @param items   object: Either a single tree item or an array of tree items.
 @param refItem object: The tree item used for reference.
 @param chHow   char: Describe how items will be moved in relation to the
                reference item: 'b'efore, 'a'fter, or as 'c'hildren
 @private
 *****************************************************************************/
RasterTree.prototype.moveItems = function( items, refItem, chHow )
{
    if ( items==refItem )
        return;

    if ( items.IID_TREEITEM )
        items = [ items ];           //convert to array

    var i;

    if ( chHow=='c' )
    {
        for ( i=0; i < items.length; i++ )
            items[i].setParentItem( refItem );
    }
    else
    {
        var isAfter = (chHow=='a');
        for ( i=0; i < items.length; i++ )
        {
            items[i].setSiblingItem( refItem, isAfter );
            refItem = items[i];
            isAfter = true;
        }/*for*/
    }/*if*/

};
