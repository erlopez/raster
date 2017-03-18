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

/***********************************************************************************
 * Base class for control-related events. Instances of this class are created
 * automatically when an event occurs. Direct use of this constructor has no practical
 * use and is only listed for documentation of its properties and methods.
 * @constructor
 * @see cancel(), accept()
 ***********************************************************************************/
function RasterEvent()
{
    /** @property isCancelled [boolean]: Indicates if the event has been cancelled. True: the event is cancelled, false the event has not been cancelled.
     *  @see cancel() */
    this.isCancelled = false;

    /** @property acceptPosition [string]: Indicates the position where a "over" or "drop" drag operation has been accepted.
     *  By default this property is null. If accept() is invoked, this property will have either "before", "over", or "after"
     *  @private
     *  @see accept() */
    this.acceptPosition = null;

    /** @property IID_RASTER_EVENT [boolean]: Interface ID tag constant used to identify #RasterEvent objects.
                             This property is always true.*/

}
// Tag implemented interface
RasterEvent.prototype.IID_RASTER_EVENT = true;


/***********************************************************************************
 * Cancels an event. This method can be invoked in the event object passed as argument
 * to an event handler to the prevent a control from taking further
 * action and process the event.
 ***********************************************************************************/
RasterEvent.prototype.cancel = function()
{
    this.isCancelled = true;
};

/***********************************************************************************
 * Highlights the object under the mouse as a potential drop target. This method can
 * be invoked in event objects capable of handling drag-and-drop operations such as
 * #RasterTreeEvent, #RasterListEvent, and #RasterTabbarEvent.
 *
 * When a value is dragged over an <code>item</code> the control will
 * issue an event with a <code>type</code> "over". In order for the
 * <code>item</code> under the mouse to be highlighted as a potential drop target,
 * the event handler must "accept" this event by invoking the accept() method.
 *
 * If the event handler does not wishes to highlight the current item as a
 * drop target, the accept() method should not be invoked.
 *
 * The <code>position</code> property tells the event handler where the value
 * being dragged is about to be dropped. This property may be one of the following values:
 *
 * <b><tt><strong>Position Value</strong> Description </tt></b>
 * <tt><q>before</q> Drop will happen before the given <code>item</code>.</tt>
 * <tt><q>over</q>  Drop will happen over the given <code>item</code>.</tt>
 * <tt><q>after</q>  Drop will happen after the given <code>item</code>.</tt>
 *
 * The event handler may alter the default drop position by passing a new
 * <code>position</code> to the accept() method. For example, if a list doesn't want to
 * accept dragged values "over" any item, it can pass the argument "before" to the
 * accept() method. This will make the drop target to render as an "insertion line"
 * before the item instead of a "shaded box" over the item.
 * <pre code>
 * function myHandler( e )
 * {
 *    :
 *    // do not accept drag values 'over' items,
 *    // only 'before' or 'after'
 *    if ( e.position=="over"  )
 *       e.accept( "before" ); //convert "over" to "before"
 *    else
 *       e.accept(); //Accept the current position
 * }
 * </pre>
 * If the "over" event is not accepted, the "drop" event will not fire on a item if
 * the mouse button is released over the item.
 *
 * @param position [string]: Overwrites current <code>position</code> value. If this argument
 *                 is not specified, the current <code>position</code> value is used.
 *                 This argument is case-sensitive. Any value other than "over", "before",
 *                 or "after" will evaluate as "over".
 * @see RasterTreeEvent, RasterListEvent, RasterTabbarEvent
 ***********************************************************************************/
RasterEvent.prototype.accept = function( position )
{
    this.acceptPosition = position || this.position;
};

/***********************************************************************************
 * Returns a string representation of the values in this event object. This is
 * useful for debugging.
 * @private
 * @return string: Comma-separated list of the event object properties.
 ***********************************************************************************/
RasterEvent.prototype.toString = function()
{
    return RasterStrings.toString( this );
};

//------------8<----------------------------------------------------------------------------------------------------------
/***********************************************************************************
 Object passed to a list event handler containing information about the event in
 progress. The object has the following properties:
 <pre obj>
     event       The associated DOM event object.
     type        Indicates the type of event.
     list        The list control that issued the event.
     item        The list item that was clicked.
     colIdx      Index of the column clicked (table mode).
     index       Index of the list item clicked.
     newColWidth New width a column has been resized to (table mode).
     newColIdx   Index a column was moved to (table mode).
     dataIdx     Index of the item.<code>data</code>[] element
                 associated with the clicked column (table mode).
     dragValue   The value being dragged/dropped over the control.
     position    Indicates where dragged value is about
                 to be dropped.
 </pre>
 Not all object properties apply to all event types. When a property is not relevant
 to a given event type, its value is set to null (<i>Tip:</i> do an <code>alert()</code>
 on the event object to see which properties are set for any particular event type).

 The <code>type</code> property indicates what the event does. The following table
 lists its possible values:

 <b><tt><strong>Event Type</strong> Description </tt></b>
 <tt><q>colclick</q>     A column header was clicked. The #colIdx has the index of the
                         column being clicked. Cancelling this event
                         will prevent a column from being moved and the "colsort"
                         event from happening next.</tt>
 <tt><q>colcontext</q>   A column header was right-clicked. This might be used to
                         open a context menu at the mouse position.</tt>
 <tt><q>colsort</q>      The list is about to be sorted based on the
                         data associated with the column header being clicked.
                         This event can be cancelled to perform a custom sort
                         on a hidden list item data element, or fetching new
                         data rows from the database and re-populate the list.</tt>
 <tt><q>colmove</q>      A column was moved. The #colIdx has the index of the
                         column being moved, the #newColIdx indicates the index
                         where the column was dropped. Cancelling this event
                         will prevent a column from being moved.</tt>
 <tt><q>colsize</q>      A column was resized. The #colIdx has the index of the
                         column being resized, the #newColWidth indicates 
                         the new column width. Cancelling this event
                         will prevent the new column size from being applied.
                         The event handler may assign a new value to the
                         <code>newColWidth</code> property and overwrite
                         the current new width value. This mechanism can be used to
                         prevent a column from being too wide or too narrow. </tt>
 <tt><q>click</q>        A list item was clicked. The #item property
                         points to the list item being clicked. Cancelling this event
                         will prevent the list current selection from changing.</tt>
 <tt><q>dblclick</q>     A list item was double-clicked. The #item property
                         points to the list item being clicked. Note the "click" event
                         will fire twice before "dblclick" fires. This is normal.</tt>
 <tt><q>context</q>      A list item was right-clicked. The #item property
                         points to the list item being clicked. This might be used to
                         open a context menu at the mouse position.</tt>
 <tt><q>beforedrag</q>   One or more list items are about to be dragged. The
                         #item property points to the list item being
                         dragged. In case of a multiple selections, use the RasterList.getSelectedItems()
                         method to know which items are being dragged. Cancelling this event
                         will prevent the drag operation from occurring.</tt>
 <tt><q>over</q>         A value is being dragged over a list item. The
                         #item property points to the list item currently
                         under the mouse pointer. The #dragValue property contains the value
                         being dragged over the item. The #position property indicates where the
                         dragged value is about to be dropped in relation to the list #item.

                         If the event handler wishes to accept the #dragValue at the current position,
                         it must invoke RasterEvent.accept() to signal the control to 
                         highlight the #item as a potential drop target (i.e. draw insertion line
                         or shaded box at the item's location).

                         The event handler may overwrite the current #position by passing a
                         new <code>position</code> to the <code>accept()</code> method.
                         If the event handler does not invoke <code>accept()</code>, the #item
                         will not be highlighted as a potential drop target, nor the "drop"
                         event will fire on the #item if the mouse button is released over the item. </tt>
 <tt><q>drop</q>         A value was dropped over an item. The #item property
                         points to the list item receiving the drop.  The #dragValue property
                         contains the value dropped over the <code>item</code>. The #position
                         property indicates where the #dragValue was dropped in relation
                         to the #item.

                         <b>Moving Local Items</b>

                         When dragging and dropping items inside the same control, the drag operation
                         is said to be "local". In such case, the control's default behavior is to reorganize
                         the dropped items automatically after the event handler returns from a "drop" event.
                         If the event handler wishes to prevent the default "reorganize" behavior,
                         it must invoke RasterEvent.cancel() before it returns. <b>Note:</b> When reorganising
                         local items in a list, a drop #position equal to "over" will be treated as "before".</tt>

 <b>Example: Hooking up a list event handler</b><br>
 <pre code>
    var list = new RasterList("myDiv");
    list.setEventHandler( myHandler );  //assign event handler

    ...

    function myHandler( evt )
    {
        switch ( evt.type )
        {
           case "click"    : alert ( evt.item.text +
                                     " was clicked" );
                             break;

           case "colclick" : if ( evt.colIdx == 0)
                                evt.cancel(); //prevent user from moving
                                              //or sorting column 0
                             break;
        }
    }

 </pre>

 @static
 @see RasterEvent.cancel(), RasterEvent.accept(), RasterList.setEventHandler()
 **********************************************************************************/
var RasterListEvent = {
     /**@property event       [object]: The assoiated DOM event object. This object can be
                              used to obtain further mouse and keyboard information.  */
     /**@property type        [string]: A string that indicates the type of event. */
     /**@property list        [object]: The list control that issued the event. */
     /**@property item        [object]: The list item that was clicked. Note this property may not
                              be set in column-related event types. */
     /**@property colIdx      [number]: The zero-based index of the column clicked.  */
     /**@property index       [number]: The zero-based index of the item clicked.  */
     /**@property newColWidth number: The new width a column has been resized to. This property may
                              be modified by the event handler to specify a different
                              column size.  */
     /**@property newColIdx   [number]: The zero-based index a column was moved to.  */
     /**@property dataIdx     [number]: The zero-based index of the item.<code>data</code>[] array
                              element the column is currently displaying.  */
     /**@property dragValue   [any]: The value being dragged or dropped over the control. */
     /**@property position    [string]: Indicates the position where the value being dragged
                              is about to be dropped. This property may be one of the following:

                              <b><tt><strong>Position Value</strong> Description </tt></b>
                              <tt><q>before</q> Drop will happen before the given #item.</tt>
                              <tt><q>over</q>  Drop will happen over the given #item.</tt>
                              <tt><q>after</q>  Drop will happen after the given #item.</tt>

                              If the event handler wishes to accept a drop of the #dragValue at
                              the current location, it must call RasterEvent.accept() highlight
                              the #item as a potential drop target (i.e. draw insertion line
                              or shaded box at the item's location).

                              The event handler may alter the default drop effect by
                              passing a new <code>position</code> value to RasterEvent.accept()
                              method. For example, if a list doesn't want to accept dragged values
                              "over" any item, it can pass the argument "before" to the
                              <code>accept()</code> method. This will make the drop target to render as
                              an "insertion line" <i>before</i> the item instead of a "shaded box"
                              <i>over</i> the item.

                              <pre code>
                                function myHandler( e )
                                {
                                    :
                                    // do not accept drag values 'over' items,
                                    // only 'before' or 'after'
                                    if ( e.position=="over"  )
                                        e.accept( "before" ); // overwrite "over" with "before"
                                    else
                                        e.accept(); // accept current drop position

                                }
                              </pre>

                              @see RasterEvent.accept()
                               */

};

/***********************************************************************************
 * Factory function used to create an object that contains information about
 * RasterList event. See #RasterListEvent doc for more info.
 * @private
 ************************************************************************************/
RasterEvent.mkListEvent = function ( event, type, list, item, colIdx, index,
                                     newColWidth, newColIdx, dataIdx, dragValue, position )
{
    var e = new RasterEvent();
    e.event = event;
    e.type = type;
    e.list = list;
    e.item = item;
    e.colIdx = colIdx;
    e.index = index;
    e.newColWidth = newColWidth;
    e.newColIdx = newColIdx;
    e.dataIdx = dataIdx;
    e.dragValue = dragValue;
    e.position = position;

    return e;
};


//------------8<----------------------------------------------------------------------------------------------------------
/***********************************************************************************
 Object passed to a tree event handler containing information about the event in
 progress. The object has the following properties:
 <pre obj>
     event       The associated DOM event object.
     type        Indicates the type of event.
     tree        The tree control that issued the event.
     item        The tree item that was clicked.
     dragValue   The value being dragged/dropped over the control.
     position    Indicates where dragged value is about
                 to be dropped.
 </pre>
 Not all object properties apply to all event types. When a property is not relevant
 to a given event type, its value is set to null (<i>Tip:</i> do an <code>alert()</code>
 on the event object to see which properties are set for any particular event type).

 The <code>type</code> property indicates what the event does. The following table
 lists its possible values:

 <b><tt><strong>Event Type</strong> Description </tt></b>
 <tt><q>collapse</q>     A tree item was collapsed. The #item property
                         points to the tree item being collapsed. Cancelling this event
                         will prevent the tree item from collapsing.</tt>
 <tt><q>expand</q>       A tree item was expanded. The #item property
                         points to the tree item being expanded. Cancelling this event
                         will prevent the tree item from expanding.</tt>
 <tt><q>click</q>        A tree item was clicked. The #item property
                         points to the tree item being clicked. Cancelling this event
                         will prevent the tree current selection from changing.</tt>
 <tt><q>dblclick</q>     A tree item was double-clicked. The #item property
                         points to the tree item being clicked. Note the "click" event
                         will fire twice before "dblclick" fires. This is normal.</tt>
 <tt><q>context</q>      A tree item was right-clicked. The #item property
                         points to the tree item being clicked. This might be used to
                         open a context menu at the mouse position.</tt>
 <tt><q>beforedrag</q>   One or more tree items are about to be dragged. The
                         #item property points to the tree item about to be
                         dragged. In case of a multiple selections, use the RasterTree.getSelectedItems()
                         method to know which items are being dragged. Cancelling this event
                         will prevent the drag operation from occurring.</tt>
 <tt><q>over</q>         A value is being dragged over a tree item. The
                         #item property points to the tree item currently
                         under the mouse pointer. The #dragValue property contains the value
                         being dragged over the item. The #position property indicates where the
                         dragged value is about to be dropped in relation to the tree #item.

                         If the event handler wishes to accept the #dragValue at the current position,
                         it must invoke RasterEvent.accept() to signal the control to
                         highlight the #item as a potential drop target (i.e. draw insertion line
                         or shaded box at the item's location).

                         The event handler may overwrite the current #position by passing a
                         new <code>position</code> to the <code>accept()</code> method.
                         If the event handler does not invoke <code>accept()</code>, the #item
                         will not be highlighted as a potential drop target, nor the "drop"
                         event will fire on the #item if the mouse button is released over the item. </tt>
 <tt><q>drop</q>         A value was dropped over an item. The #item property
                         points to the tree item receiving the drop.  The #dragValue property
                         contains the value dropped over the <code>item</code>. The #position
                         property indicates where the #dragValue was dropped in relation
                         to the #item.

                         <b>Moving Local Items</b>

                         When dragging and dropping items inside the same control, the drag operation
                         is said to be "local". In such case, the control's default behavior is to reorganize
                         the dropped items automatically after the event handler returns from a "drop" event.
                         If the event handler wishes to prevent the default "reorganize" behavior,
                         it must invoke RasterEvent.cancel() before it returns. </tt>

 <b>Example: Hooking up a tree event handler</b><br>
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

 @static
 @see RasterEvent.cancel(), RasterEvent.accept(), RasterTree.setEventHandler()
 **********************************************************************************/
var RasterTreeEvent = {
     /**@property event       [object]: The assoiated DOM event object. This object can be
                              used to obtain further mouse and keyboard information.  */
     /**@property type        [string]: A string that indicates the type of event. See #RasterTreeEvent for details. */
     /**@property tree        [object]: The tree control that issued the event. */
     /**@property item        [object]: The tree item that was clicked or a drag and drop event is occuring at.  */
     /**@property dragValue   [any]: The value being dragged or dropped over the control. */
     /**@property position    [string]: Indicates the position where the value being dragged
                              is about to be dropped. This property may be one of the following:

                              <b><tt><strong>Position Value</strong> Description </tt></b>
                              <tt><q>before</q> Drop will happen before the given #item.</tt>
                              <tt><q>over</q>  Drop will happen over the given #item. </tt>
                              <tt><q>after</q>  Drop will happen after the given #item.</tt>

                              If the event handler wishes to accept a drop of the #dragValue at
                              the current location, it must call RasterEvent.accept() highlight
                              the #item as a potential drop target (i.e. draw insertion line
                              or shaded box at the item's location).

                              The event handler may alter the default drop effect by
                              passing a new <code>position</code> value to RasterEvent.accept()
                              method. For example, if a tree doesn't want to accept dragged values
                              "over" any item, it can pass the argument "before" to the
                              <code>accept()</code> method. This will make the drop target to render as
                              an "insertion line" <i>before</i> the item instead of a "shaded box"
                              <i>over</i> the item.

                              <pre code>
                                function myHandler( e )
                                {
                                    :
                                    // do not accept drag values 'over' items,
                                    // only 'before' or 'after'
                                    if ( e.position=="over"  )
                                        e.accept( "before" ); // overwrite "over" with "before"
                                    else
                                        e.accept(); // accept current drop position

                                }
                              </pre>

                              @see RasterEvent.accept()
                               */
};

/***********************************************************************************
 * Factory function used to create an object that contains information about
 * RasterTree event. See #RasterTreeEvent doc for more info.
 * @private
 ************************************************************************************/
RasterEvent.mkTreeEvent = function ( event, type, tree, item, dragValue, position )
{
    var e = new RasterEvent();
    e.event = event;
    e.type = type;
    e.tree = tree;
    e.item = item;
    e.dragValue = dragValue;
    e.position = position;

    return e;
};



//------------8<----------------------------------------------------------------------------------------------------------
/***********************************************************************************
 Object passed to a dialog event handler containing information about the event in
 progress. The object has the following properties:
 <pre obj>
     event       The associated DOM event object.
     type        Indicates the type of event.
     dialog      The dialog control that issued the event.
     bounds      Contains new position and dimmensions of the dialog.
 </pre>
 Not all object properties apply to all event types. When a property is not relevant
 to a given event type, its value is set to null (<i>Tip:</i> do an <code>alert()</code>
 on the event object to see which properties are set for any particular event type).

 The <code>type</code> property indicates what the event does. The following table
 lists its possible values:

 <b><tt><strong>Event Type</strong> Description </tt></b>
 <tt><q>move</q>     The dialog was moved. Check #bounds property for
                     the dialog's new position. Cancelling this event
                     will prevent the dialog from being repositioned.</tt>
 <tt><q>resize</q>   The dialog was resized. Check #bounds property for
                     the dialog's new dimmensions. Cancelling this event
                     will prevent the dialog from being resized.</tt>
 <tt><q>modal</q>    Indicates the user clicked outside a dialog that is in "modal" mode.</tt>
 <tt><q>minimize</q> The title bar "minimize" button was pressed.</tt>
 <tt><q>maximize</q> The title bar "maximize" button was pressed.</tt>
 <tt><q>window</q>   The title bar "window" button was pressed.</tt>
 <tt><q>close</q>    The title bar "close" button was pressed. Cancelling this event
                     will prevent the dialog from closing.</tt>


 <b>Example: Hooking up a dialog event handler</b><br>
 <pre code>
    var dg = new RasterDialog(null, ICONS16.APPLICATION, "A Dialog");
    dg.setButtons( false, false, false, true ); //show close button
    dg.setContent( "someDivId" ); //moves some div inside dialog
    dg.setSize( 180, 180 );
    dg.showAt( 300, 130 );
    dg.setResizable( true ); //Allow dialog resizing

    <b>dg.setEventHandler( myHandler );</b> //hook event handler

    ...

    function myHandler( evt )
    {
        switch ( evt.type )
        {
           case "move"    : alert ( "I don't think so!" );
                            evt.cancel();
                            break;
           case "close"   : alert ( "Bye!" );
                            break;
        }
    }

 </pre>

 @static
 @see RasterEvent.cancel(), RasterDialog.setEventHandler()
 **********************************************************************************/
var RasterDialogEvent = {
     /**@property event       [object]: The assoiated DOM event object. This object can be
                              used to obtain further mouse and keyboard information.  */
     /**@property type        [string]: A string that indicates the type of event. See #RasterDialogEvent for details. */
     /**@property dialog      [object]: The dialog control that issued the event. */
     /**@property bounds      [object]: Object containing the new position and dimmensions of the dialog.
                              This object has the following properties:
                              <pre obj>
                                 x:      Upper-left corner X coordinate.
                                 y:      Upper-left corner Y coordinate.
                                 width:  Dialog's width (outer border)
                                 height: Dialog's Height (outer border)
                              </pre>
                              This property is available in "move" and "resize" event types.      
      */
};

/***********************************************************************************
 * Factory function used to create an object that contains information about
 * RasterDialog event. See #RasterDialogEvent doc for more info.
 * @private
 ************************************************************************************/
RasterEvent.mkDialogEvent = function ( event, type, dialog, bounds )
{
    var e = new RasterEvent();
    e.event = event;
    e.type = type;
    e.dialog = dialog;
    e.bounds = bounds;

    return e;
};



//------------8<----------------------------------------------------------------------------------------------------------
/***********************************************************************************
 Object passed to a tab bar event handler containing information about the event in
 progress. The object has the following properties:
 <pre obj>
     event       The associated DOM event object.
     type        Indicates the type of event.
     tabbar      The tab bar control that issued the event.
     item        Points to the item being click or moved.
     dragValue   The value being dragged/dropped over the control.
     position    Indicates where the dragged value is about
                 to be dropped.
 </pre>
 Not all object properties apply to all event types. When a property is not relevant
 to a given event type, its value is set to null (<i>Tip:</i> do an <code>alert()</code>
 on the event object to see which properties are set for any particular event type).

 The <code>type</code> property indicates what the event does. The following table
 lists its possible values:

 <b><tt><strong>Event Type</strong> Description </tt></b>
 <tt><q>click</q>        A tab item was clicked. The #item property
                         points to the tab item being clicked. Cancelling this event
                         will prevent the tab from become active/selected.</tt>
 <tt><q>context</q>      A tab item was right-clicked. The #item property
                         points to the tab item being clicked. This might be used to
                         open a context menu at the mouse position.</tt>
 <tt><q>beforedrag</q>   A tab item is about to be dragged. The
                         #item property points to the tab item about to be
                         dragged. Cancelling this event
                         will prevent the drag operation from occurring.</tt>
 <tt><q>over</q>         A value is being dragged over a tab item. The
                         #item property points to the tab item currently
                         under the mouse pointer. The #dragValue property contains the value
                         being dragged over the item. The #position property indicates where the
                         dragged value is about to be dropped in relation to the tab #item.

                         If the event handler wishes to accept the #dragValue at the current position,
                         it must invoke RasterEvent.accept() to signal the control to
                         highlight the #item as a potential drop target (i.e. draw insertion line
                         or shaded box at the item's location).

                         The event handler may overwrite the current #position by passing a
                         new <code>position</code> to the <code>accept()</code> method.
                         If the event handler does not invoke <code>accept()</code>, the #item
                         will not be highlighted as a potential drop target, nor the "drop"
                         event will fire on the #item if the mouse button is released over the item. </tt>
 <tt><q>drop</q>         A value was dropped over an item. The #item property
                         points to the tab item receiving the drop.  The #dragValue property
                         contains the value dropped over the <code>item</code>. The #position
                         property indicates where the #dragValue was dropped in relation
                         to the #item.

                         <b>Moving Local Items</b>
 
                         When dragging and dropping items inside the same control, the drag operation
                         is said to be "local". In such case, the control's default behavior is to reorganize
                         the dropped items automatically after the event handler returns from a "drop" event.
                         If the event handler wishes to prevent the default "reorganize" behavior,
                         it must invoke RasterEvent.cancel() before it returns. <b>Note:</b> When reorganising 
                         local items in a tab bar, a drop #position equal to "over" will be treated as "before". </tt>

 <b>Example: Hooking up a tab event handler</b><br>
 <pre code>
    var tab = new RasterTabbar("myTabDiv", true );

    //Add tabs
    tab.add( ICONS16.GROUP, "Users" ).select(); //set as active tab
    tab.add( ICONS16.FILM, "Media" );
    tab.add( ICONS16.MONEY, "Billing" );

    tab.setCustomizable(true);         //Allow tab re-ordering
    tab.setEventHandler( myHandler );  //Set event handler

    ...

    function myHandler( evt )
    {
        switch ( evt.type )
        {
           case "click"   : alert ( evt.item.text + " clicked!" );
                            break;
        }
    }

 </pre>

 @static
 @see RasterEvent.cancel(), RasterEvent.accept(), RasterTabbar.setEventHandler()
 **********************************************************************************/
var RasterTabbarEvent = {
     /**@property event       [object]: The assoiated DOM event object. This object can be
                              used to obtain further mouse and keyboard information.  */
     /**@property type        [string]: A string that indicates the type of event. See #RasterTabbarEvent for details. */
     /**@property tabbar      [object]: The tab bar control that issued the event. */
     /**@property item        [object]: The tab item that was clicked or moved. */
     /**@property dragValue   [any]: The value being dragged or dropped over the control. */
     /**@property position    [string]: Indicates the position where the value being dragged
                              is about to be dropped. This property may be one of the following:

                              <b><tt><strong>Position Value</strong> Description </tt></b>
                              <tt><q>before</q> Drop will happen before the given #item.</tt>
                              <tt><q>over</q>  Drop will happen over the given #item.</tt>
                              <tt><q>after</q>  Drop will happen after the given #item.</tt>

                              If the event handler wishes to accept a drop of the #dragValue at
                              the current location, it must call RasterEvent.accept() highlight
                              the #item as a potential drop target (i.e. draw insertion line
                              or shaded box at the item's location).

                              The event handler may alter the default drop effect by
                              passing a new <code>position</code> value to RasterEvent.accept()
                              method. For example, if a tab bar doesn't want to accept dragged values
                              "over" any item, it can pass the argument "before" to the
                              <code>accept()</code> method. This will make the drop target to render as
                              an "insertion line" <i>before</i> the item instead of a "shaded box"
                              <i>over</i> the item.

                              <pre code>
                                function myHandler( e )
                                {
                                    :
                                    // do not accept drag values 'over' items,
                                    // only 'before' or 'after'
                                    if ( e.position=="over"  )
                                        e.accept( "before" ); // overwrite "over" with "before"
                                    else
                                        e.accept(); // accept current drop position

                                }
                              </pre>

                              @see RasterEvent.accept()
                               */
};

/***********************************************************************************
 * Factory function used to create an object that contains information about
 * RasterTabbar event. See #RasterTabbarEvent doc for more info.
 * @private
 ************************************************************************************/
RasterEvent.mkTabEvent = function ( event, type, tabbar, item, dragValue, position)
{
    var e = new RasterEvent();
    e.event = event;
    e.type = type;
    e.tabbar = tabbar;
    e.item = item;
    e.dragValue = dragValue;
    e.position = position;

    return e;
};



//------------8<----------------------------------------------------------------------------------------------------------
/***********************************************************************************
 Object passed to a splitter event handler containing information about the event in
 progress. The object has the following properties:
 <pre obj>
     event       The associated DOM event object.
     type        Indicates the type of event.
     splitter    The splitter control that issued the event.
     size        The new size a splitter has been resized to.
 </pre>

 The <code>type</code> property indicates what the event does. The following table
 lists its possible values:

 <b><tt><strong>Event Type</strong> Description </tt></b>
 <tt><q>resize</q>       A splitter was resized. The <code>size</code> property
                         contains the new splitter size. The  <code>size</code>
                         property may be modified by the event handler to specify
                         a different size. Cancelling this event will
                         prevent the splitter from being resized.</tt>

 <b>Example: Hooking up a splitter event handler</b><br>
 <pre code>
    var sp = new RasterSplitter("mySplitDiv", 'bottom');
    sp.setSize(120);
    sp.setContent(1, "bottomContentDiv");
    sp.setContent(2, "topContentDiv");

    <b>sp.setSizeHandler( myHandler );</b>
    ...

    function myHandler( evt )
    {
        alert ( "New size is " + evt.size );
        evt.size = Math.max( evt.size, 100  ); //overwrite sizes less
                                               //  than 100px
    }

 </pre>

 @static
 @see RasterEvent.cancel(), RasterSplitter.setEventHandler()
 **********************************************************************************/
var RasterSplitterEvent = {
     /**@property event       [object]: The assoiated DOM event object. This object can be
                              used to obtain further mouse and keyboard information.  */
     /**@property type        [string]: A string that indicates the type of event. See #RasterSplitterEvent for details. */
     /**@property splitter    [object]: The splitter control that issued the event. */
     /**@property size        number: The new size a splitter has been resized to.
                              This property may be modified by the event handler to specify
                              a different size. */
};

/***********************************************************************************
 * Factory function used to create an object that contains information about
 * RasterSplitter event. See #RasterSplitterEvent doc for more info.
 * @private
 ************************************************************************************/
RasterEvent.mkSplitterEvent = function ( event, type, splitter, size )
{
    var e = new RasterEvent();
    e.event = event;
    e.type = type;
    e.splitter = splitter;
    e.size = size;

    return e;
};



//------------8<----------------------------------------------------------------------------------------------------------
/***********************************************************************************
 Object passed to a mouse move or drag-and-drop event handler. The object has the
 following properties:
 <pre obj>
     event    The assoiated DOM event object.
     type     A string that indicates the type of event.
     value    Value being dragged, set when RasterMouse.startDrag()
              was invoked.
     data     Free-format data structure specified when
              RasterMouse.startDrag() was invoked.
     context  Empty object used to store data during a drag and
              drop operation.
     control  The #RasterControl currently under the mouse.
     x        Mouse pointer's current X coordinate.
     y        Mouse pointer's current Y coordinate.
     ctrl     True if the CONTROL key is pressed, false otherwise.
     alt      True if the ALT key is pressed, false otherwise.
     shift    True if the SHIFT key is pressed, false otherwise.
     button   Number indicating the mouse button being pressed.
     initial  A data structure containing the initial mouse and
              control keys state.
 </pre>
 The <code>type</code> property indicates what the event does. The following table
 lists event types sent to event handlers specified via the #RasterControl.setDropHandler()
 method:

 <b><tt><strong>Event Type</strong> Description </tt></b>
 <tt><q>enter</q>        A drag operation entered the control. Use this event
                         to initialize any data structures your control may need to
                         perform the drag and drop operation while the mouse is moving over the control.
                         You may store your data structures (if any) as expandos of the
                         #context property. </tt>
 <tt><q>over</q>         A value is being dragged over a control. The
                         #control property points to your control instance, currently
                         under the mouse pointer. The #value property contains the value
                         being dragged over the control. At this time, you may use #RasterMouse
                         methods like:
                         RasterMouse.setCursor(),
                         RasterMouse.showDropBorder(),
                         RasterMouse.showDropLine(),
                         RasterMouse.showShadeBox(),
                          etc.
                         to highlight possible drop targets in your control. </tt>
 <tt><q>out</q>          A drag operation is left the control. All drawings
                         made by #RasterMouse methods are automatically cleared.
                         You can use this event however, to do any other clean up. You
                         do not need to clear any expandos added to the #context
                         property. You may need them again if the mouse enters
                         back in the control.</tt>
 <tt><q>drop</q>         The #value was dropped over the control. This is fired when the
                         user releases the mouse button while over your control. </tt>
 <tt><q>cancel</q>       The drag operation was cancelled while the mouse was over your
                         control. This event may occur if the user pressed the ESC
                         key or RasterMouse.cancelDrag() was invoked. </tt>

 The following table lists event types sent to a <code>mouseListener</code> specified
 in the arguments of the #RasterMouse.startDrag() method:

 <b><tt><strong>Event Type</strong> Description </tt></b>
 <tt><q>move</q>         Invoked when the mouse moves.</tt>
 <tt><q>up</q>           The mouse button was released.</tt>
 <tt><q>cancel</q>       The drag operation has ended because the user pressed the
                         ESC key or RasterMouse.cancelDrag() was invoked. In Internet Explorer, if "mouse
                         capture" feature was not used, the drag operation is cancelled if the
                         mouse leave the browser window.</tt>
 <tt><q>end</q>          The drag operation has ended. This event always fires
                         at the end of the drag operation, regardless of the "cancel"
                         occuring. This is useful to perform cleanup of any resources
                         used up during the drag operation.</tt>

 The following table lists event types sent to a <code>callback</code> function specified
 in the arguments of the #RasterMouse.addTimerListener() method:

 <b><tt><strong>Event Type</strong> Description </tt></b>
 <tt><q>timer</q>        Occurs at periodic intervals during a drag operation.
                         This is an event that allow your control to implement
                         auto-scrolling when the mouse is near the edge of the
                         control.</tt>

 @static
 @see RasterMouse.showDropBorder(), RasterMouse.showDropBorderOver(), RasterMouse.showDropLine(), RasterMouse.showShadeBox(), RasterMouse.setCursor(), RasterMouse.cancelDrag(), RasterMouse.startDrag(), RasterControl.setDropHandler(),
 **********************************************************************************/
var RasterMouseEvent = {
     /**@property event       [object]: The assoiated DOM event object. This object can be
                              used to obtain further mouse and keyboard information.  */
     /**@property type        [string]: A string that indicates the type of event. See #RasterMouseEvent for details. */
     /**@property value       [any]: Value being dragged. This property is used to store the
                              value you wish to pass along to other controls in a drag and drop
                              operation: from a simple int or string value to a complex object.
                              If the drag operation was started in a raster control,
                              this value is the item object being dragged, for example a
                              #RasterTreeItem, #RasterListItem, RasterTabItem, etc. */
     /**@property data        [object]: Free-format data structure associated with
                              the drag or mousemove operation in progress. This object
                              belongs to the process that started the mouse operation
                              and should not be modified.*/
     /**@property context     [object]: This is a multi-purpose object meant to be used by
                              event handlers to piggyback any data they see fit
                              for supporting a drag and drop operation.
                              Data should be stored in this object by means of expando properties.
                              Caution must be exercised when choosing expando names to store
                              data in the <code>context</code> object. Pick unique names
                              among the event handlers that might be involved in any given
                              drag operation. This object persists through the duration of
                              the drag operation. */

     /**@property control     [object]: The #RasterControl currently under the mouse. This
                              property is only available in drop listener event handlers.
                              In mouse listener event handlers this property is null.
                               @see RasterControl.setDropHandler() */
     /**@property x           [number]: Mouse pointer's current X coordinate.*/
     /**@property y           [number]: Mouse pointer's current Y coordinate. */
     /**@property ctrl        [boolean]: true if the CONTROL key is pressed,
                                         false otherwise. */
     /**@property alt         [boolean]: true if the ALT key is pressed,
                                         false otherwise. */
     /**@property shift       [boolean]: shift  true if the SHIFT key is pressed,
                                         false otherwise. */

     /**@property button      [number]: Pressed mouse button:
                                        1=Left, 2=Right, 3=Center. */

     /**@property initial     [object]: A data structure containing the mouse and key state at the
                              time the drag operation started. This object has the following fields:
                              <pre obj>
                                 x      Mouse pointer's initial X coordinate.
                                 y      Mouse pointer's initial Y coordinate.
                                 ctrl   true if the CONTROL key was pressed,
                                           false otherwise.
                                 alt    true if the ALT key was pressed,
                                           false otherwise.
                                 shift  true if the SHIFT key was pressed,
                                           false otherwise.
                                 button Pressed mouse button:
                                           1=Left, 2=Right, 3=Center.
                              </pre> */
};

/***********************************************************************************
 * Factory function used to create an object that contains information about
 * RasterMouse event. See #RasterMouseEvent doc for more info.
 * @private
 ************************************************************************************/
RasterEvent.mkMouseEvent = function ( event, type, value, data )
{
    var e = new RasterEvent();
    e.event = event;
    e.type = type;
    e.value = value;
    e.data = data;
    e.control = null;
    e.context = {};
    e.initial = Raster.getInputState( event );
    e.x = e.initial.x;
    e.y = e.initial.y;
    e.ctrl = e.initial.ctrl;
    e.alt = e.initial.alt;
    e.shift = e.initial.shift;
    e.button = e.initial.button;   

    return e;
};
























