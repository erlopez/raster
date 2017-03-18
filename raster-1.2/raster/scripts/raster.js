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
 Static object containing core functions and constants used by the
 Raster library. Most functions are helpers for javascript and DOM
 low-level programming.

 The following example show the minimal code needed to start working
 with Raster:
 <pre code>
    &lt;!DOCTYPE HTML ...&gt;
    &lt;html&gt;
    &lt;head&gt;
    &lt;title&gt;App Title&lt;/title&gt;

    &lt;link rel="stylesheet"
                href="../raster/themes/modern/raster.css"&gt;

    &lt;!-- Remove this line is no IE6 support is needed --&gt;
    &lt;!--[if lte IE 6]&gt;
    &lt;link rel="stylesheet"
          href="../raster/themes/modern/raster-ie6.css"&gt;&lt;![endif]--&gt;

    &lt;script src="../raster/scripts/min/raster-min-v1.2.js"
            type="text/javascript"&gt;&lt;/script&gt;

    &lt;script type="text/javascript"&gt;

    ///////////////////////////////////////
    // Called on onload
    //
    function main()
    {
        Raster.config("../raster");

        // Add code here...
    }
 
    &lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;!-- add markup here... --&gt;
    &lt;/body&gt;
    &lt;/html&gt;
 </pre>
 The key elements in the code above are:
 <ul>
     <li><b>Line 6:</b> Link to the "raster.css" stylesheet. In this
         example, the "modern" theme is used. Line 10 uses conditional
         comments to load the IE6 support stylesheet "raster-ie6.css".
         You can ignore this stylesheet is no support for IE6 is needed.</li>
     <li><b>Line 14:</b> Loads the Raster javascript library "raster-min-v1.2.js".</li>
     <li><b>Line 22:</b> Declares the function <code>main()</code>. The <code>main()</code>
         method is optional. If present, Raster will call it after the page finishes loading.
         This is where you will put your page's initialization code.</li>
     <li><b>Line 24:</b> Tell Raster where the /raster folder is in relation to the document.
         Some library methods that dynamically generate html will need this informaton to
         generate the correct url to css backgrounds, and/or library images. In this
         example the /raster folder is one directory above where the document is: "../raster".</li>
  </ul>

  @static
  @see config()
 *******************************************************************/
var Raster = {
    /** @property isIE [boolean]: True if the browser is Internet Explorer, false otherwise.*/
    isIE  : navigator.userAgent.indexOf('MSIE') >= 0,

    /** @property isIE6 [boolean]: True if the browser is Internet Explorer v6, false otherwise.*/
    isIE6 : navigator.appVersion.indexOf("MSIE 6") >= 0,

    /** @property isIE7 [boolean]: True if the browser is Internet Explorer v7, false otherwise.*/
    isIE7 : navigator.appVersion.indexOf("MSIE 7") >= 0,

    /** @property isIE8 [boolean]: True if the browser is Internet Explorer v8, false otherwise.*/
    isIE8 : navigator.appVersion.indexOf("MSIE 8") >= 0,

    /** @property isIE9 [boolean]: True if the browser is Internet Explorer v9, false otherwise.*/
    isIE9 : navigator.appVersion.indexOf("MSIE 9") >= 0,

    /** @property isIE10 [boolean]: True if the browser is Internet Explorer v10, false otherwise.*/
    isIE10 : navigator.appVersion.indexOf("MSIE 10") >= 0,

    /** @property isCSSCompliant [boolean]: True if the browser is not IE 6 to 8, false otherwise.*/
    isCSSCompliant :  navigator.appVersion.indexOf("MSIE 6") < 0 &&
                      navigator.appVersion.indexOf("MSIE 7") < 0 &&
                      navigator.appVersion.indexOf("MSIE 8") < 0,

    /** @property isIEQuirks [boolean]: True if the browser is Internet Explorer AND it is rendering the document in quirks mode, false otherwise.*/
    isIEQuirks : navigator.userAgent.indexOf('MSIE') >= 0 && /^<!DOCTYPE.*/i.test( document.all[0].data ), //test if !DOCTYPE tag is present

    /** @property isFF [boolean]: True if the browser is Firefox/XULRunner, false otherwise.*/
    isFF  : navigator.userAgent.indexOf("Firefox") >= 0 || navigator.userAgent.indexOf("Mozilla") >= 0 || navigator.userAgent.indexOf("Gecko") >= 0,

    /** @property isOp [boolean]: True if the browser is Opera, false otherwise.*/
    isOp  : navigator.userAgent.indexOf("Opera") >= 0,

    /**********************************************************************
     Test if a value is an Array object.
     @param  x   any: value to be tested.
     @return boolean: True if the argument is a Array, false otherwise.
     **********************************************************************/
    isArray : function (x)
    {
        return x && !x.propertyIsEnumerable('length') && typeof(x)=='object' && typeof(x.length)=='number';
    },


    /**********************************************************************
     Returns an object containing the upper-left corner (x,y) coordinates
     and dimmensions for the rectangle formed by the given  x1,y1 and
     x2,y2 points.

     @param      x1      number: first point's x coordinate
     @param      y1      number: first point's y coordinate
     @param      x2      number: second point's x coordinate
     @param      y2      number: second point's y coordinate

     @return  object: An object containing the upper-left corner (x,y) coordinates
              and dimmensions of the rectangle. The returned object has
              the following fields:
              <pre obj>
                x       Rectangle's upper-left x coordinate.
                y       Rectangle's upper-left y coordinate.
                width   Rectangle's width
                height  Rectangle's height
              </pre>
     **********************************************************************/
    toRect : function ( x1, y1, x2, y2 )
    {
        return { x: Math.min( x1, x2),
                 y: Math.min( y1, y2),
                 width: Math.abs( x1 - x2),
                 height: Math.abs( y1 - y2) };
    },


    /**********************************************************************
     Clips a value to a given min/max range.

     @param      value    number: value to bee clipped.
     @param      min      number: minimum value in the range
     @param      max      number: maximum value in the range

     @return  number: Value in the range of [<code>min</code>..<code>max</code>]
                      including the min/max boundaries.
     **********************************************************************/
    clip : function ( value, min, max )
    {
        return   Math.max( min, Math.min( value, max) );
    },


    /**********************************************************************
     Mark all document elements as unselectable
     @private
     **********************************************************************/
    disableDocumentSelections : function()
    {
        if ( Raster.isIE )
        {
            Raster.addListener( document, "selectstart", function( event )
            {
                return "SELECT,INPUT,TEXTAREA".indexOf( window.event.srcElement.tagName ) >= 0;
            });
        }
        else
            Raster.addClass( document.body, "rasterUnselectable");

    },


//----------8<---------------------------------------------------------------------------------[COOKIES]-----
    /*********************************************************
     Sets a cookie.
     @param name        string: the name of the cookie
     @param value       string: the value of the cookie
     @param expireDays  [number]: the number of days until the
                        cookie expires
     *********************************************************/
    setCookie : function( name, value, expireDays )
    {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expireDays);
        document.cookie = name + "=" + escape(value) + ((expireDays == null) ? "" : ";expires=" + exdate.toUTCString());
    },


    /*********************************************************
     Gets a cookie.
     @param name  string: The name of the cookie to be retrieved.
     @return string: the value of the cookie, null if the cookie
             name is not found.
     *********************************************************/
    getCookie : function( name )
    {
        if ( document.cookie.length > 0 )
        {
            var start = document.cookie.indexOf(name + "=");
            if ( start != -1 )
            {
                start = start + name.length + 1;
                var end = document.cookie.indexOf(";", start);
                if ( end == -1 )
                    end = document.cookie.length;
                return unescape(document.cookie.substring(start, end));

            }/*if*/
        }/*if*/

        return null;
    },


    /*********************************************************
     Deletes a cookie.
     @param name  string: the name of the cookie to be deleted.
     *********************************************************/
    deleteCookie : function( name )
    {
        document.cookie = name + "=0;expires=Thu, 03-Mar-1972 00:00:01 GMT";
    },


    /**********************************************************************
     Makes the given sub class prototype implements the methods in the
     prototype of the given supper class. All interface constant IID_.*
     values are also transferred.
     @private

     @param  subClass    function: Object of type "function"
     @param  superClass  function: Object of type "function"
     **********************************************************************/
    implementIID : function ( subClass, superClass )
    {
        // Validate args
        if ( subClass == superClass || Raster.implementsIID(subClass, superClass)  )
            return;

        // Copy method references and IID_.* attributes
        for ( var prop in superClass.prototype )
           if ( /^IID_.*/.test(prop) || (typeof(superClass.prototype[prop])=="function" && (subClass.prototype[prop]==null || prop==="toString")) )
              subClass.prototype[prop] = superClass.prototype[prop];


        // Tag an static attribute in the sub class object referencing the super class
        // so that the implementsIID() method can determine if the subClass already implements the superClass
        subClass[ superClass ] = true;
    },

    /**********************************************************************
     Test if the given sub class prototype implements the prototype of the
     given supper class.
     @private

     @param  subClass    function: Object of type "function"
     @param  superClass  function: Object of type "function"
     @return boolean: True if implementIID(subClass, superClass) was already
             called on the given classes, false otherwise.
     **********************************************************************/
    implementsIID : function ( subClass, superClass )
    {
        return subClass[ superClass ] === true;
    },

//----------8<---------------------------------------------------------------------------------[DOM]-----
    /*****************************************************************************
     Removes an element from its current location in the DOM tree and inserts
     it as child a given parent element.

     @param element  object: DOM element to be relocated. This argument can be one of the
                     following: a string containing the ID of a DOM
                     element, a reference to a DOM element, or a Control
                     object. An error will occur if this argument is null.
     @param parent   object: The new parent for the relocated element. This argument can
                     be one of the following: a string containing the ID of a DOM
                     element, a reference to a DOM element, or a Control
                     object. An error will occur if this argument is null.
     @param replace  [boolean]: true removes any children nodes currently
                     in the parent before inserting the element; false appends
                     the element after any existing child nodes in the
                     given parent (default).
     *****************************************************************************/
    setParent : function( element, parent, replace )
    {
        element = Raster.resolve( element );
        parent = Raster.resolve( parent );


        //a. remove any content from the parent
        if ( replace===true )
            while ( parent.firstChild != null )
                parent.removeChild(  parent.firstChild );

        //b. Disconnect element from tree (if connected)
        if ( element.parentNode != null )
            element.parentNode.removeChild( element );

        //c. Insert element in parent
        parent.appendChild( element );
    },


    /*****************************************************************************
     Removes an element from its current location in the DOM tree and inserts
     it before or after a given sibling element.

     @param element  object: DOM element to be relocated. This argument can be one of the
                     following: a string containing the ID of a DOM
                     element, a reference to a DOM element, or a Control
                     object. An error will occur if this argument is null.
     @param sibling  object: The new sibling for the relocated element. This argument can
                     be one of the following: a string containing the ID of a DOM
                     element, a reference to a DOM element, or a Control
                     object. An error will occur if this argument is null.
     @param after    [boolean]: true moves the element after the
                     given sibling; false inserts this element before the
                     given sibling (default).
     *****************************************************************************/
    setSibling: function( element, sibling, after )
    {
        element = Raster.resolve( element );
        sibling = Raster.resolve( sibling );

        //a. Disconnect element from tree (if connected)
        if ( element.parentNode != null )
            element.parentNode.removeChild( element );

        //b. Insert next to given sibling
        if ( after===true )
        {
            if ( sibling.nextSibling != null )
                sibling.parentNode.insertBefore( element, sibling.nextSibling );
            else
                sibling.parentNode.appendChild( element );
        }
        else
            sibling.parentNode.insertBefore( element, sibling );
    },



    /*****************************************************************************
     Translate a document ID or Control object into the appropriate DOM element.
     @private

     @param element  object: A string containing the ID of a DOM
                     element, a control object, or a reference to a DOM element.
     @return object: The DOM element associated with the given ID, the value returned
             by <code>getContentElement()</code> in a Control, or otherwise
             'element' as-is.
     *****************************************************************************/
    resolve: function( element )
    {

        // a. If argument is another control,
        //    get the control's content element
        if ( element.IID_CONTROL != null )
            return element.getContentElement();

        // b. If argument is string, assume is an ID, convert it
        //    to a DOM element reference
        else if ( typeof(element)=="string" )
            return document.getElementById( element );


        return element;
    },

    
    /**********************************************************************
     Fixes the x,y coords returned by IE's window.event.clientX/Y and
     element.getBoundingClientRect() to include HTML and BODY border and
     margin widths. Also compensate for inconsistent in quirks vs. strict.
     @private 
     @param      _x      number: IE computed X coordinate
     @param      _y      number: IE computed Y coordinate

     @return  object: An object containing the fixed x and y. The returned
              object has the following fields:
              <pre obj>
                 x      Fixed X coordinate
                 y      Fixed Y coordinate
              </pre>
     **********************************************************************/
    fixPointIE : function ( _x, _y )
    {
        // Compensate for microsoft lack of respect
        if ( Raster.isIEQuirks ) // compensate for border in BODY
        {
            _x -=  document.body.clientLeft;
            _y -=  document.body.clientTop;
        }
        else if ( Raster.isIE7 )
        {
            _x -= document.documentElement.clientLeft || 2;  //Don't ask, the 2 is magic
            _y -= document.documentElement.clientTop || 2;
        }
        else if ( Raster.isIE6  )
        {
            _x -=  document.documentElement.clientLeft;
            _y -=  document.documentElement.clientTop;
        }/*if*/

        return {x: _x, y: _y};
    },


    /**********************************************************************
     Returns an object containing the upper-left corner (x,y) coordinates
     and dimmensions of the given element.

     @param  element     object: A document element, such as a DIV for example.
     @param  relParent   object: A document element, parent of above element such
                         as a DIV for example. When this argument is
                         specified, the element's position is returned
                         relative to the given parent element. If this
                         argument is not specified, DOCUMENT.BODY is used.

     @return  object: An object containing the upper-left corner (x,y) coordinates
              and dimmensions of the given element. The returned object has
              the following fields:
              <pre obj>
                x       X coordinate of element's upper-left corner.
                y       Y coordinate of element's upper-left corner.
                width   Element's width
                height  Element's height
              </pre>
     **********************************************************************/
    getBounds : function( element, relParent )
    {
        var rect = element.getBoundingClientRect();
        var dx = rect.left;
        var dy = rect.top;

        // compute in the relative parent position
        if ( relParent!=null )
        {
            var rect2 = relParent.getBoundingClientRect();
            dx -= rect2.left;
            dy -= rect2.top;
        }/*if*/


        // compute in the page scroll
        var scroll = Raster.getElementScrolling( document.body );
        dx += scroll.x;
        dy += scroll.y;


        // Fix HTML border in ie6/7
        if ( Raster.isIE )
        {
            var fixed = Raster.fixPointIE( dx, dy );
            dx = fixed.x;
            dy = fixed.y;
            
        }/*if*/

        return {    x:    dx,
                    y:    dy,
                    width:  Math.round( element.offsetWidth ) ,  //round() fixes fractional pixels in IE9 
                    height: Math.round( element.offsetHeight )
                };
    },


    /**********************************************************************
     Returns an object containing the sum of the scroll (x,y) offsets
     of the given element and its parents.

     @param  element    object: A DOM element.

     @return  object: An point object containing the scroll (x,y) offsets
              of the given element. The returned object has the following
              fields:
              <pre obj>
                 x   Element's sum of scroll left
                 y   Element's sum of scroll top
              </pre>
     **********************************************************************/
    getElementScrolling : function( element )
    {
        var dx = 0;
        var dy = 0;

        do
        {
            dx += element.scrollLeft || 0;
            dy += element.scrollTop || 0;

        } while ( element = element.parentNode )


        return { x: dx,  y: dy };
    },


    /*****************************************************************************
     Translate a page x,y point to a element space point.

     @param pageX       number: X page-based coordinate
     @param pageY       number: Y page-based coordinate

     @return object: Returns a point structure of {x, y } with the translated x,y
             element coordinates.
     *****************************************************************************/
    pointToElement : function( element, pageX, pageY )
    {
        if ( element==document.body )   //do not translate a  document.body  coordinate
            return { x: pageX,  y: pageY  };

        
        var bounds = Raster.getBounds( element );
        return { x:      pageX - bounds.x  ,
                 y:      pageY - bounds.y };

    },


    /*****************************************************************************
     Translate a x,y coordinate relative to the element to a page absolute point.

     @param elementX       number: X coordinate relative to the element
     @param elementY       number: Y coordinate relative to the element

     @return object:  A point structure of {x, y } with the translated x,y
             page coordinates.
     *****************************************************************************/
    pointToPage : function( element, elementX, elementY )
    {
        var bounds = Raster.getBounds( element );
        var scroll = Raster.getElementScrolling( element );

        return { x:      elementX + bounds.x - scroll.x,
                 y:      elementY + bounds.y - scroll.y };

    },


    /**********************************************************************
     Returns an object containing the dimmensions of the window's inner
     width and height.

     @return  object: An object containing the viewport's width and height.
              The returned object has the following fields:
              <pre obj>
                 width        viewport's width.
                 height       viewport's height.
              </pre>
     **********************************************************************/
    getWindowBounds : function()
    {
        if ( Raster.isIE )
        {
            if ( Raster.isIEQuirks )
                return {   width:      document.body.clientWidth,
                           height:     document.body.clientHeight };
            else
                return {   width:      document.body.parentNode.clientWidth,
                           height:     document.body.parentNode.clientHeight };
        }
        else
            return {   width:          window.innerWidth,
                       height:         window.innerHeight };
    },


    /**********************************************************************
     Given an element, this method search up the DOM herachy for a parent
     having the given class name.
     @param  element       object: A DOM element.
     @param  className     string: Name of the style class to be found in this
                           element.
     @return object: Null is no parent with the given class name was found.
             If the given element has the given class name itself, returns
             the element passed in argument.
     *********************************************************************/
    findParentWithClass : function ( element, className )
    {
        if ( element == null )
            return null;

        //a. Search up the herarchy until a element having the given class name
        //   is found, then return that element
        do {
            if ( Raster.hasClass(element, className) )
                return element;

            element = element.parentNode;

        } while ( element != null );

        //b. if no elements found above, return null
        return null;

    },


    /**********************************************************************
     Search up the DOM herachy starting at the given element for a parent
     having the given expando name.
     @param element      object: DOM Element where the search starts
     @param expandoName  string: Name of the expando to be looked up.
                         This value is case sensitive.
     @returns object: Null is no parent with the given expando name was found.
              If the given element has the given expando name, the element
              itself is returned.
     *********************************************************************/
    findParentWithExpando : function ( element, expandoName )
    {
        if ( element == null )
            return null;

        //a. Search up the herarchy until a element having the given expando
        //   is found, then return that element
        do {
            if ( element[expandoName] != null )
                return element;

            element = element.parentNode;

        } while ( element != null );

        //b. if no elements found above, return null
        return null;
    },


    /**********************************************************************
     Scans up the DOM herachy starting at the given <code>element</code>
     searching for the first parent having the given expando name, then
     returns the value of the expando.

     If the <code>all</code> argument is set to true, the function searches
     and collect all matching expandos (not just the first match), and returns
     an array containing all expandos found, or an empty array if no matches
     were found.

     @param element      object: DOM Element where the search starts
     @param expandoName  string: Name of the expando to be looked up.
                         This value is case sensitive.
     @param all          [boolean]: True scans all parents and returns an
                         array with all the matching parents having the
                         requested expando. False (or omitting this argument)
                         returns only the first match.
     @returns object: Null is no parent with the given expando name was found.
              If the given element has the given expando name, the element
              itself is returned. If <code>all</code> is specified, list of
              all expando matches found. An empty array if no matches are found.
     *********************************************************************/
    findParentExpando : function ( element, expandoName, all )
    {
        if ( element == null )
            return null;

        var matches = (all===true) ? new Array() : null;

        //a. Search up the herarchy until a element having the given expando
        //   is found, either return that element, or keep collecting
        do {
            if ( element[expandoName] != null )
                if ( matches == null )
                    return element[expandoName];
                else
                    matches.push( element[expandoName] );

            element = element.parentNode;

        } while ( element != null );

        //b. if no elements found above, return null
        return matches;
    },

    /**********************************************************************
     Given an element, this method search up the DOM herachy for a parent
     having the given tag attribute name.
     @param  element       object: A DOM element.
     @param  attrName      string: Name of the object attribute to be found
                           in the element.
     @return object: Null is no parent with the given tag attribute name was found.
             If the given element has the given tag attribute name itself,
             returns the element passed in argument.
     *********************************************************************/
    findParentWithAttr : function ( element, attrName )
    {
        if ( element==null )
            return null;

        //a. Search up the herarchy until a element having the given attr name
        //   is found, then return that element
        do {
            if ( element.getAttribute!=null && element.getAttribute( attrName ) != null )
                return element;

            element = element.parentNode;

        } while ( element != null );

        //b. if no elements found above, return null
        return null;
    },

    /**********************************************************************
     Returns the position at which the given element is in relation to its
     siblings.
     @private
     @param  element       object: A DOM element.
     @return number: index of the given element is among its siblings. If the
             <code>element</code> is null, returns -1;
     *********************************************************************/
    indexOf : function ( element )
    {
        if ( element==null )
            return -1;

        var n = 0;
        while ( (element = element.previousSibling) != null )
            n ++;

        return n;
    },

    /**********************************************************************
     Force browser to recompute layout on the given element.
     @private
     @param  element       object: A DOM element.
     *********************************************************************/
    repaint : function ( element )
    {
        var save = element.style.display;
        element.style.display = "none";
        element.offsetHeight + 0;
        element.style.display = save;
    },

//----------8<---------------------------------------------------------------------------------[STYLES]-----
    /*****************************************************************************
     Set the elements's opacity.
     @param element  object: A DOM element
     @param percent  number: A number from 0 to 100
     *****************************************************************************/
    setOpacity : function( element, percent )
    {
        if ( Raster.isIE6 || Raster.isIE7  )
            element.style.filter = percent==100 ? "" : "alpha(opacity=" + percent + ")";
        else if ( Raster.isIE8 )
            element.style.filter = percent==100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + percent + ")";
        else
            element.style.opacity = percent / 100;
    },


    /**********************************************************************
     Test if an element has a given class name
     @param  element       object: A DOM element.
     @param  className     string: Name of the style class to be tested in this
                           element.
     @return boolean: Returns true if the element contains the given className in
             its class attribute.
     *********************************************************************/
    hasClass : function ( element, className )
    {
        return element.className && element.className.indexOf(className) >= 0;

    },


    /**********************************************************************
     Adds a style class to the element's className property
     @param  element       object: A DOM element.
     @param  className     string: Name of the style class to be added to this
                           element.
     *********************************************************************/
    addClass : function ( element, className )
    {
        if ( element == null )
            return;

        if ( element.className != null )
            element.className += " " + className;
        else
            element.className = className;

    },


    /**********************************************************************
     Removes a style class from this element className property
     @param  element       object: A DOM element.
     @param  className     string: Name of the style class to be removed from this
                           element.
     *********************************************************************/
    removeClass : function ( element, className )
    {
        if ( element == null || element.className == null )
            return;

        var tokens = element.className.split(" ");
        var buf = [];
        for ( var k = 0; k < tokens.length; k++ )
            if ( tokens[k] != className )
                buf.push( tokens[k] );

        element.className = buf.join(' ');

    },


//----------8<---------------------------------------------------------------------------------[EVENT]-----
    /*************************************************************************
     * Adds a given event listener to a DOM element.
     * @param element       object: DOM element where to attach the event
     * @param eventName     string: Event name without the "on" prefix.
     * @param eventHandler  function: Pointer to the function listening for this event.
     ***********************************************************************/
    addListener : function( element, eventName, eventHandler )
    {
        if ( Raster.isIE )
            element.attachEvent("on" + eventName, eventHandler);
        else
            element.addEventListener(eventName, eventHandler, false);
    },


    /*************************************************************************
     * Removes a given event listener from a DOM element.
     * @param element       object: DOM element where to remove the event from
     * @param eventName     string: Event name without the "on" prefix.
     * @param eventHandler  function: Pointer to the function listening for this event.
     *************************************************************************/
    removeListener : function( element, eventName, eventHandler )
    {
        if ( Raster.isIE )
            element.detachEvent("on" + eventName, eventHandler);
        else
            element.removeEventListener(eventName, eventHandler, false);
    },


    /**********************************************************************
     Returns a mouse object containing the x,y position of the mouse
     and the state of the shift, crtl and alt keys.
     @param   event  object: A DOM event
     @return  object: An object containing the mouse and key state. The returned
              object has the following fields:
              <pre obj>
                 x      Mouse pointer's X coordinate.
                 y      Mouse pointer's Y coordinate.
                 ctrl   true if the CONTROL key is pressed,
                           false otherwise.
                 alt    true if the ALT key is pressed,
                           false otherwise.
                 shift  true if the SHIFT key is pressed,
                           false otherwise.
                 button Pressed mouse button:
                           1=Left, 2=Right, 3=Center.
              </pre>
     **********************************************************************/
    getInputState : function ( event )
    {
        var mouse = {};
        mouse.x = 0;
        mouse.y = 0;
        mouse.ctrl = false;
        mouse.alt = false;
        mouse.shift = false;

        if ( window.event )    //IE11 stills use the 'window.event' quirk
        {
            mouse.x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
            mouse.y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
            mouse.alt = window.event.altKey;
            mouse.ctrl = window.event.ctrlKey;
            mouse.shift = window.event.shiftKey;

            if ( event )
                mouse.button = event.button==0 ? 1 : (event.button==1 ? 3 : 2);  //Native: 0=Left, 1=Center, 2=right
            else
                mouse.button = window.event.button==4 ? 3 : window.event.button; // Old IEs; Native: 1=Left, 2=Right, 4=Center

            var fixed = Raster.fixPointIE( mouse.x, mouse.y );
            mouse.x = fixed.x;
            mouse.y = fixed.y;
        }
        else
        {
            mouse.x = event.clientX + window.scrollX;
            mouse.y = event.clientY + window.scrollY;
            mouse.alt = event.altKey;
            mouse.ctrl = event.ctrlKey;
            mouse.shift = event.shiftKey;
            mouse.button = event.button==0 ? 1 : (event.button==1 ? 3 : 2);       //Native: 0=Left, 1=Center, 2=right

        }/*if*/

        mouse.asString = mouse.x + ", " + mouse.y + "{alt=" + mouse.alt + "; ctrl=" + mouse.ctrl +
                         "; shift=" + mouse.shift + "; button=" + mouse.button + "}";

        return mouse;
    },


    /**********************************************************************
     Return the key code of the key pressed by the user (if any).
     This function is intended for use in keyDown() and keyUp() events.

     @param event  object: A DOM event object
     @return number: The key code of the key pressed
     *********************************************************************/
    keyCode : function ( event )
    {
        return Raster.isIE ? window.event.keyCode : event.keyCode;
    },


    /**********************************************************************
     Return the element generating the event
     @param event object: A DOM event object
     @return object: The element generating the event
     *********************************************************************/
    srcElement : function ( event )
    {
        return Raster.isIE ? window.event.srcElement : event.target;

    },


    /**********************************************************************
     Stop the given even from bubbling up the herarchy
     @param event object: A DOM event object
     @return boolean: Always false.
     *********************************************************************/
    stopEvent : function ( event )
    {
        if ( Raster.isIE )
        {
            window.event.cancelBubble = true;
            window.event.returnValue = false;
        }
        else if ( event )
        {
            event.preventDefault();
            event.stopPropagation();
            
        }/*if*/

        return false;
    },


//----------8<------------------------------------------------------------------------------[CONTROLS]-----
    /*****************************************************************************
      Provide various control instances with a unique id.
     *****************************************************************************/
    idSequence: 0,

    /*****************************************************************************
     Absolute or relative URL location of raster directory.
     *****************************************************************************/
    RASTER_HOME : "raster",

    /*****************************************************************************
     Name of the current CSS theme.
     *****************************************************************************/
    THEME : "modern",

    /*****************************************************************************
     Absolute or relative URL location of raster/images directory.
     *****************************************************************************/
    IMG_URL : "raster/images",

    /*****************************************************************************
     Absolute or relative URL location of current theme directory.
     *****************************************************************************/
    CSS_IMG_URL : "raster/themes/modern/images",


    /*****************************************************************************
     Configure Raster home directory and theme. This method does not actually
     apply any CSS or script to the documment, it only documents where are the
     resources the page uses. Some library methods that dynamically generate html
     will need this informaton to generate the correct url to css backgrounds,
     and/or library images.

     @param RASTER_HOME  string: Absolute or relative URL to the /raster directory.
                         This is necessary for control to resolve paths to CSS and
                         IMAGE resource files in the application. If this value
                         is not set it will default to  "raster" (i.e. The raster folder
                         is in the same directory of the *.html document).
     @param theme        [string]: Name of the CSS theme raster will use to render controls.
                         If this value is not given, the "modern" them is used.
                         This value is case-sensitive.
     *****************************************************************************/
    config : function( RASTER_HOME, theme )
    {
        Raster.THEME = theme || Raster.THEME;
        Raster.RASTER_HOME = (RASTER_HOME || ".").replace( /\/+$/, "");

        Raster.IMG_URL = Raster.RASTER_HOME + "/images";
        Raster.CSS_IMG_URL = Raster.RASTER_HOME + "/themes/" + Raster.THEME + "/images";
    },


    /*****************************************************************************
     Resolves a URL prefixed by raster resource-folder tag. The prefix
     "IMG:" is replaced with the current raster/images location, for example:
     "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
     is replaced with the current css themes images location, for example:
     "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

     If a prefix is not found, the <code>url</code> is returned unchanged. Do not
     place a "/" between the prefix and the rest of the URL, as a forward slash
     will be inserted automatically.

     @private
     @param url string: URL to be resolve.
     @return string: The resolved URL. If a prefix is not found, the
             <code>url</code> is returned unchanged. 
     *****************************************************************************/
    toImgUrl : function( url )
    {
        if (url==null || url.length < 4)
            return url;

        if ( url.substring(0,4).toUpperCase()=="IMG:" )
            return Raster.IMG_URL + "/" + (url.length>4 ? url.substring(4) : "");

        else if ( url.substring(0,4).toUpperCase()=="CSS:" )
            return Raster.CSS_IMG_URL + "/" + (url.length>4 ? url.substring(4) : "");

        else
            return url;
    },


    /*****************************************************************************
     Store global reference to the currently active menu/toolbar. This function hides
     the currently open menu (if any), ensuring only one menu is visible at a time.
     @private
     @param menuOrToolbar   object: Pointer to the menu is now visible or toolbar with a
                            visible popup menu. Set this argument to null to hide the
                            current popup menu (if any).
     *****************************************************************************/
    setActiveMenu : function( menuOrToolbar )
    {
        try                                              //try top frame to store global, if allowed
        {
            if ( top.rasterActiveMenu!=null && top.rasterActiveMenu!=menuOrToolbar )
            {
                if ( top.rasterActiveMenu.IID_MENU )
                    top.rasterActiveMenu.hide();
                else
                    top.rasterActiveMenu.showItemMenu( null );
            }/*if*/

            top.rasterActiveMenu = menuOrToolbar;

        }
        catch (e)                                       //else store global menu as expando in Raster namespace
        {
            if ( Raster.rasterActiveMenu!=null && rasterActiveMenu!=menuOrToolbar )
            {
                if ( Raster.rasterActiveMenu.IID_MENU )
                    Raster.rasterActiveMenu.hide();
                else
                    Raster.rasterActiveMenu.showItemMenu( null );
            }/*if*/

            Raster.rasterActiveMenu = menuOrToolbar;

        }/*try*/

        // Toggle BODY tag 'suspendCommandItemHover' class
        // Used to suspend CommandItem hover effect in toolbars when a popup menu is open
        if ( menuOrToolbar == null )
            Raster.removeClass( document.body, "suspendCommandItemHover" );
        else
            Raster.addClass( document.body, "suspendCommandItemHover" );
    },

    
    /*****************************************************************************
     Returns the global reference to the currently active menu/toolbar (if any).
     @private
     @Return object: Pointer to the menu is now visible or toolbar with a visible
             popup menu. Might be null is no menu/toolbar is active.
     *****************************************************************************/
    getActiveMenu : function()
    {
        try                                              //try top frame to global, if allowed
        {
            return top.rasterActiveMenu;
        }
        catch (e)                                        //else global menu as expando in Raster namespace
        {
            return Raster.rasterActiveMenu;
        }/*try*/

    },


    /*****************************************************************************
     Updates layout in size-sensitive controls.  This function is called
     automatically when a page or other control area is resized.
     @private
     *****************************************************************************/
    doLayout : function()
    {
       if( window.RasterToolbar ) RasterToolbar.doLayout();
       if( window.RasterTabbar ) RasterTabbar.doLayout();
       if( window.RasterSplitter ) RasterSplitter.doLayout();
       if( window.RasterDialog ) RasterDialog.doLayout();
       if( window.RasterList ) RasterList.doLayout();

    }

};


/************************************************************************
 Init Raster and invoke main() if present.
 ************************************************************************/
Raster.addListener(window, "load", function( event )
{
    //Install global mousemove listener
    // --THIS CAUSES :hover background flickering in all IE versions f!@&%!!
//    if ( window.Mouse )
//        Raster.addListener( document, "mousemove", RasterMouse.mousemove );

    // a. Remove IE6 mouse background flickering
    try
    {
        if ( Raster.isIE6 )
            document.execCommand('BackgroundImageCache', false, true);
    }
    catch ( e )
    {
        // ignore errors.

    }/*try*/


    // b. Invoke main() if present.
    if ( window.main )
        window.main();
 
});


/************************************************************************
 Propagate resize event to controls sensitive to resizing.
 ************************************************************************/
Raster.addListener(window, "resize", function( event )
{
    // close any popup menus
    Raster.setActiveMenu( null );

    // update size-sensitive controls
    Raster.doLayout();

});


/************************************************************************
 Hide menus and/or cancel drag operations on ESC
 ************************************************************************/
Raster.addListener(document, "keydown", function( event )
{
    if ( Raster.keyCode(event)!=27 )
        return;

    // close any popup menus
    Raster.setActiveMenu( null );

    // Cancel any mouse drag operation
    RasterMouse.cancelDrag( event );

});


/************************************************************************
 Close any open menus on document mouse down
 ************************************************************************/
Raster.addListener(document, "mousedown", function( event )
{
     Raster.setActiveMenu( null );
});


//////////////////////////////////////////
// Alias for console output
//
if ( !window.out )
{
    window.out = function( o )
    {
        if ( window.console )
            console.log( typeof(o)=="object" ? RasterStrings.toString(o) : o);
    }
}