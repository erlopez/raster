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
 Contains string manipulation utility functions. Internal use only.
 @private
 @static
 *******************************************************************/
var RasterStrings = {

    /**********************************************************************
     Converts a value or object to its string representation. If the
     argument is an object, the value of its attributes is also returned.

     @param  arg  any: Object to be converted to string.
     @param  sep  [string]: text used to separate properties values
     @return string: String representation of the argument.
     *********************************************************************/
    toString : function ( arg, sep )
    {
        if ( arg==null || typeof(arg)!="object" )
            return arg+"";
        else if ( arg.tagName ) //do not drill down into DOM objects
            return "[" + arg.tagName + " element]";
        else if ( arg.altKey!=null && arg.shiftKey!=null ) //do not drill down into DOM events
            return "[" + arg.type + " event]";
        else if ( arg.IID_CONTROL ) //do not drill down into Raster controls
            return "[RasterControl object]";

        sep = sep==null ?  ",\r\n" : sep;

        var buf = new Array();
        var isArray = Raster.isArray( arg );

        for ( var i in arg )
        {
            var propName =  isArray ? "" : i + ": ";

            if ( typeof(arg[i])=="object" )
                buf.push( propName + RasterStrings.toString( arg[i], sep.replace( /\n/g, "\n    ")) ); //indent CRLF as it drills down

            else if ( typeof(arg[i])=="string" )
                buf.push( propName + "\"" +  arg[i] + "\"" );

            else if ( typeof(arg[i])!="function" )
                buf.push( propName +  arg[i]  );
        }

        if ( isArray )
            return "[ " + buf.join(sep) +" ]";
        else
            return "{ " + buf.join(sep) +" }";
    },

    /**********************************************************************
     Removes any trailing or leading spaces from a given string.

     @param  text  string: Text to be trimmed.
     @return string: Trimmed text.
     *********************************************************************/
    trim : function ( text )
    {
        if ( text == null )
            return "";

        text += ""; //make it string if it wasn't

        return text.replace(/(^ +| +$)/g, "");
    },

    /**********************************************************************
     Test if the given string is null, has a length of zero, or is made
     entirely of blank spaces.

     @param  text  string: String to be tested
     @return boolean: true if the string is null or blank, false otherwise.
     *********************************************************************/
    isEmpty : function ( text )
    {
        return this.trim(text) == "";
    },

    /**********************************************************************
     Converts a Date object to text using the format "mm/dd/yyyy".

     @param  date  date: Date object to be converted to text
     @return string: Date in the format "mm/dd/yyyy". Returns ""
             if the argument is null. Returns the argument AS-IS if the
             argument is not Date.
     *********************************************************************/
    formatDate : function ( date )
    {
        if ( date==null )
            return "";
        else if ( typeof(date)=="object" && date.getFullYear )
            return ((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1)) + "/" +
                   (date.getDate() < 10 ? "0"+date.getDate() : date.getDate() ) + "/" +
                    date.getFullYear();
        else
            return date;
    }


};
 

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
 

/*****************************************************************************
 Creates a toolbar. Toolbars are usually placed in DIV elements somewhere in
 the document. The <code>id</code> of the DIV is given to the constructor
 via the <code>parent</code> argument.

 Toolbars will take all the horizontal space of its parent container. The
 height of the parent container should be set according to the toolbar's
 size (see <code>size</code> argument below).

 The next code fragment illustrates how to create a commands in a group and
 add the commands to a toolbar:
 <pre code>
    // create command group
    var commands = RasterCommand.createGroup( myHandler )

    // add commands to the group
    // args:      id      icon           icon32  text
    commands.add( "new",  ICONS16.PAGE,    null, "New" );
    commands.add( "open", ICONS16.FOLDER,  null, "Open" );
    commands.add( "save", ICONS16.FLOPPY,  null, "Save" );

    // Create toolbar in DIV#toolbar container
    var tBar = new RasterToolbar("toolbar", "small");
    tBar.add( commands('new')  );
    tBar.add( commands('open') );
    tBar.add( commands('save') );

    :

    &lt;body>
       
       &lt;div id="toolbar" style="height:28px">&lt;/div>

    &nbsp;
 </pre>

 @constructor


 @param parent     [object]: One of the following: a string containing the ID
                   of a DOM element, a reference to a DOM element, or another
                   control object. If this argument is null, the control is
                   created but not attached to the DOM tree.

                   The RasterControl.setParent() method can be used later to
                   specify a parent container.
 @param size       [string]: Specifies the size of the toolbar. The possible
                   values are "<code>small</code>", "<code>medium</code>", or
                   "<code>large</code>".
                   <ul>
                     <li><b>small</b>: creates a 28px-thick tool bar using 16x16 icons, showing
                         any command text next to the icon.</li>
                     <li><b>medium</b>: crates a 48px-thick tool bar using 16x16 icons, showing
                         any command text below to the icon.</li>
                     <li><b>large</b>: crates a 64px-thick tool bar using 32x32 icons, showing
                         any command text below to the icon.</li>
                   </ul>
                   If this value is null or not set, a small toolbar is created.
                   This argument is not case-sensitive.
 *****************************************************************************/
function RasterToolbar( parent, size )
{
    size = ( size || 's' ).toString().toLowerCase().charAt(0);

    // call super()
    RasterControl.call( this, parent );
    this.controlBox.innerHTML = "<div class='items'></div><div class='chevron'></div>";    
    this.itemsDiv = this.controlBox.firstChild;
    this.chevronDiv = this.controlBox.lastChild;

    this.isThick = size==='m';
    this.isXLarge = size==='l';
    this.setClass( this.isXLarge ? "rasterXLbar" : (this.isThick ? "rasterThickbar" : "rasterThinbar") );
    this.items = {};

    this.activeCommandItem = null; //points to the current commandItem having a open popup menu
    this.autoOpenMenu = false;

    // create chevron item
    this.chevronItem = this.add( RasterCommand.CHEVRON ).showText(false);
    delete this.items[ this.chevronItem.command.id ]; //This is an special item, keep it private and erase from from items list
    
    this.chevronItem.sprite.setImage( GLYPHS.CHEVRON_RIGHT );
    this.chevronItem.sprite.setSize( 9, 16 );
    this.chevronItem.setParent( this.chevronDiv );
    this.chevronDiv.style.display = "none";

    // handlers
    this.controlBox.onmousedown = RasterToolbar.mousedownHandler;
    this.controlBox.onmouseover = RasterToolbar.mouseoverHandler;
    this.controlBox.onmouseup = this.controlBox.onmouseout = RasterToolbar.mouseupHandler;

    // resister toolbar by unique id Sequence
    this.id = "toolbar" + (Raster.idSequence++);
    RasterToolbar.all[ this.id ] = this;

   /** @property IID_TOOLBAR [boolean]: Interface ID tag constant used to identify #RasterToolbar objects.
                             This property is always true.*/
}

/*****************************************************************************
 Statics, Implements the Control class
 @private
 *****************************************************************************/
RasterToolbar.all = {};
RasterToolbar.prototype.IID_TOOLBAR = true;
Raster.implementIID ( RasterToolbar, RasterControl );



/*****************************************************************************
 Triggers a layout check in all toolbars. Invoked when page is resized.
 @private
 *****************************************************************************/
RasterToolbar.doLayout = function()
{
    //call doLayout in all Toolbar
    for ( var id in RasterToolbar.all )
        RasterToolbar.all[id].doLayout();

};

/*****************************************************************************
 Click event handler for command items.
 @private
 *****************************************************************************/
RasterToolbar.mouseupHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    if (commandItem.menu == null ) //end momentaneous down effect for buttons w/o menu
        commandItem.setDown( false );

};

/*****************************************************************************
 Click event handler for command items.
 @private
 *****************************************************************************/
RasterToolbar.mousedownHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    // Show popup menu when available, otherwise invoke commandItem's click event
    var toolbar = commandItem.parentControl;
    
    if ( commandItem.isEnabled )
        if ( commandItem.menu != null )
        {
            if ( toolbar.activeCommandItem==commandItem )
            {
                toolbar.showItemMenu( null );                //toggle off
                Raster.setActiveMenu( null );
            }
            else
                toolbar.showItemMenu( commandItem );         //hide any previously shown menu, show menu

        }
        else
        {
            Raster.setActiveMenu( null );
            toolbar.autoOpenMenu = false;
            commandItem.command.click( event );

            if (commandItem.menu == null ) //momentaneous down effect for buttons w/o menu
                commandItem.setDown( true);
    
        }/*if*/

    Raster.stopEvent( event );

};


/*****************************************************************************
 Over event handler for command items.
 @private
 *****************************************************************************/
RasterToolbar.mouseoverHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;


    // Show popup menu when available, and 'autoOpenMenu' flag is on
    var toolbar = commandItem.parentControl;

    if ( commandItem.isEnabled && toolbar.autoOpenMenu && commandItem.menu!=null )
         toolbar.showItemMenu( commandItem );

};


/*****************************************************************************
 Show/hides the chevron menu based on the width of the toolbar. This is
 invoked automatically in page resize events, but can be called directly if
 a custom layout changes affects the width of a toolbar.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.doLayout = function()
{
    var node = null;

    // find the first node that wraps to the second line (if any)
    for ( var i=0; i < this.itemsDiv.childNodes.length; i++)
    {
        var tmp = this.itemsDiv.childNodes[i];
        if ( tmp.className!="sep" && tmp.offsetTop > 5 )
        {
            node = tmp;
            break;
        }
    }/*for*/

    // if no menuable items, hide chevron and leave
    if ( node==null )
    {
        this.chevronDiv.style.display = "none";
        return this;
    }

    // show chevron, initialize menu
    this.chevronDiv.style.display = "block";
    if ( this.chevronMenu == null )
    {
        this.chevronMenu = new RasterMenu( document.body );
        this.chevronMenu.controlBox.style.zIndex = 90;
        this.chevronItem.setMenu( this.chevronMenu ).showArrow(false);
    }/*if*/

    
    // initialize chevron menu
    this.chevronMenu.removeAll();


    // populate menu with wrapped items
    do {
        if ( node.className != "sep" )
        {
            var item = node.firstChild.commandItem;   //the firstChild is iconLink element
            this.chevronMenu.add( item.command, item.menu  );

        }
        else
        {
            this.chevronMenu.addseparator();
        }/*if*/

        node = node.nextSibling;

    } while ( node != null );

    return this;

};


/*****************************************************************************
 Show the popup menu associated with the given commandItem. This function
 hides any other popup.
 @private
 @param commandItem  object: Command item to activate the popup menu on.
                     If this argument is null, any opened popup menu is
                     closed.
 *****************************************************************************/
RasterToolbar.prototype.showItemMenu = function( commandItem )
{
    //if item is already active, leave
    if ( this.activeCommandItem == commandItem )
        return;

    //if any menu item is active, hide it
    if ( this.activeCommandItem != null )
    {
        this.autoOpenMenu = false;
        this.activeCommandItem.showMenu( false );
    }


    // reset state flags
    this.activeCommandItem = null;
    this.autoOpenMenu = false;

    // if no argument, leave
    if ( commandItem==null )
        return;

    // when the item has an associated menu, show it
    if ( commandItem.menu != null )
    {
        Raster.setActiveMenu( this );
        commandItem.showMenu( true );
        this.activeCommandItem = commandItem;
        this.autoOpenMenu = true;

    }/*if*/

};


/*****************************************************************************
 Releases and removes all DOM element references used by the toolbar from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method also disposes nested command item objects as well.
 *****************************************************************************/
RasterToolbar.prototype.dispose = function()
{
    this.chevronItem.dispose();

    this.itemsDiv = null;
    this.chevronDiv = null;
    this.controlBox.onmousedown = null;
    this.controlBox.onmouseover = null;

    // free chevron menu
    if ( this.chevronMenu )
    {
        this.chevronMenu.dispose();
        this.chevronMenu = null;
    }/*if*/

    // unresister toolbar
    delete RasterToolbar.all[ this.id ];

    for ( var commandId in this.items )
        this.items[commandId].dispose();

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );

    //out('Toolbar disposed.');
};


/*****************************************************************************
 Remove all command items from this toolbar.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.removeAll = function()
{
    for ( var commandId in this.items )
        this.items[commandId].dispose();

    this.cleanSeparators();
    this.items = [];

    // hide chevron
    this.doLayout();

    return this;
};


/*****************************************************************************
 Returns a reference to the DOM element that accepts content in this Control.
 @private
 *****************************************************************************/
RasterToolbar.prototype.getContentElement = function()
{
    return this.itemsDiv;
};


/*****************************************************************************
 Adds a command item to this toolbar.
 @param newCommand   object: A reference to a #RasterCommand object.
 @param menu         [object]: A reference to a menu object. This is the popup
                     menu shown then the command item is selected. When a menu
                     is specified, the drop down arrow is automatically turned on.
                     Use RasterCommand.showArrow() to turned off if desired.
 @param refCommand   [object]: A reference to a Command object, CommandItem object,
                     or a string containing the ID of an existing command.
                     If a command matching this argument is not found in this
                     container, the separator is appended at the end of the
                     container.
 @param after        [boolean]: true adds the separator after the
                     given refCommand (default); false adds this separator before the
                     given refCommand.
 @return object: A reference to the #RasterCommandItem object just added.
 *****************************************************************************/
RasterToolbar.prototype.add = function( newCommand, menu, refCommand, after )
{
    //a. check for repeated command items
    if ( this.items[ newCommand.id ] != null )
        return this.items[ newCommand.id ];

    //b. add command item
    var item = new RasterCommandItem( this, newCommand );
    this.items[ newCommand.id ] = item;
    item.setMenu( menu );

    //c. reorganize items, if needed
    if ( refCommand!=null )
    {
        if ( refCommand.IID_COMMAND )
            refCommand = refCommand.id;
        else if ( refCommand.IID_COMMANDITEM )
            refCommand = refCommand.command.id;

        if ( this.items[ refCommand ] != null )
            Raster.setSibling( item, this.items[ refCommand ], after==null ? true : after );
    }/*if*/

    // show chevron if needed
    this.doLayout();

    return item;
};



/*****************************************************************************
 Adds a separator line in this menu.
 @param refCommand   [object]: A reference to a #RasterCommand object, #RasterCommandItem object,
                     or a string containing the ID of an existing command.
                     If a command matching this argument is not found in this
                     container, the separator is appended at the end of the
                     container.
 @param after        [boolean]: true adds the separator after the
                     given refCommand (default); false adds this separator before the
                     given refCommand.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.addseparator = function( refCommand, after )
{
    //a. resolve command objects into id
    if ( refCommand!=null )
    {
        if ( refCommand.IID_COMMAND )
            refCommand = refCommand.id;
        else if ( refCommand.IID_COMMANDITEM )
            refCommand = refCommand.command.id;
    }/*if*/

    //b. add seprarator
    var sep = document.createElement("SPAN");
    sep.className = "sep";

    if ( this.items[ refCommand ] == null )
        this.itemsDiv.appendChild( sep );
    else
    {
        Raster.setSibling( sep, this.items[ refCommand ], after==null ? true : after );

        // show chevron if needed
        this.doLayout();
        
    }/*if*/

    return this;
};


/*****************************************************************************
 Removes adjacent, trailing, or leading separators. This method is called
 after removing items from the control to make sure no adjacent
 separators are left when removing an item.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.cleanSeparators = function()
{
    var hasPrevSep = true;
    var node = this.itemsDiv.firstChild;

    while ( node!=null )
    {
        if ( node.className=="sep" )
        {
            var sep = node;
            node = node.nextSibling;
            if ( hasPrevSep )
                this.itemsDiv.removeChild( sep );

            hasPrevSep = true;
        }
        else
        {
            hasPrevSep = false;
            node = node.nextSibling;
        }/*if*/

    }/*while*/

    // last?
    if ( this.itemsDiv.lastChild !=null && this.itemsDiv.lastChild.className=="sep" )
        this.itemsDiv.removeChild( this.itemsDiv.lastChild );

    return this;
};


/*****************************************************************************
 Removes a command item from the toolbar.
 @param command  value: A reference to a Command object, CommandItem object,
                 or a string containing the ID of the command to be removed.
                 If a command matching this argument is not found in this
                 container, this method does nothing.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.remove = function( command )
{
    //a. resolve command objects into id
    if ( command.IID_COMMAND )
        command = command.id;
    else if ( command.IID_COMMANDITEM )
        command = command.command.id;

    //b. exit if command is not found in this control
    if ( this.items[ command ] == null )
        return this;

    //c. dispose the command item
    this.items[ command ].dispose();
    delete this.items[ command ];

    //d. make sure no adjacent separators ar left when removing item
    this.cleanSeparators();

    //e. adjust chevron
    this.doLayout();

    return this;
};


/*****************************************************************************
 Shows/hides the toolbar's background.
 @param isVisible  boolean: true shows the assigned css background (default);
                   false makes the toolbar's background transparent.
 @return object: The toolbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterToolbar.prototype.showBackground = function( isVisible )
{
    this.controlBox.style.background = isVisible ? "" : "none";
    return this;
};
 

/*****************************************************************************
 Creates a popup menu. The next code fragment illustrates how to create a
 commands in a group and add the commands to a menu:
 <pre code>
    // create command group
    var commands = RasterCommand.createGroup( myHandler )

    // add commands to the group
    // args:      id      icon           icon32  text
    commands.add( "new",  ICONS16.PAGE,    null, "New" );
    commands.add( "open", ICONS16.FOLDER,  null, "Open" );
    commands.add( "save", ICONS16.FLOPPY,  null, "Save As..." );

    // Disable the "save" command until there is something to save...
    commands("save").setEnabled( false );

    // create menu
    var menu = new RasterMenu();

    // Add commands to the menu
    menu.add( commands("new") );
    menu.add( commands("open") );
    menu.add( commands("save") );

    :

    menu.showAt( 50, 50); //Show menu at given x,y coords.
    &nbsp;
 </pre>
 
 @constructor
 @param parent     [object]: One of the following: a string containing the ID
                   of a DOM element, a reference to a DOM element, or another
                   control object. If this argument is not specified or set
                   null, the menu is created in the BODY element.
 *****************************************************************************/
function RasterMenu( parent )
{
    // call super()
    RasterControl.call( this, parent || document.body );   // use DIV

    this.controlBox.innerHTML = '<div class="items"></div>' +
                                '<div class="rasterShadowBox' +
                                    (Raster.isIEQuirks ? " rasterShadowBoxQuirks" : "")+ '">' +
                                    '<div class="rasterShadowBox0"></div>' +
                                    '<div class="rasterShadowBox1"></div>' +
                                    '<div class="rasterShadowBox2"></div>' +
                                    '<div class="rasterShadowBox3"></div>' +
                                '</div>' +
                                '<div class="hatch"></div>';
    this.controlBox.menu = this; // trace back expando
    this.setClass("rasterPopupMenu");

    this.itemsDiv = this.controlBox.firstChild;
    this.shadowDiv = this.controlBox.childNodes[1];
    this.hatchDiv = this.controlBox.lastChild;
    this.minWidth = 50;
    
    this.items = {};
    this.activeCommandItem = null; //points to the current commandItem having a open sub-menu

    this.hide();
    this.showHatch( false );
    this.createIE6IframeBackdrop();


    this.controlBox.onmousedown = RasterMenu.mousedownHandler;
    this.controlBox.onmouseover = RasterMenu.mouseoverHandler;

    // prior to IE9, child element hovers buggy (visibility:visible fix did not work in this case),
    // thus doing hover-out manually
    if ( Raster.isIE )
        this.controlBox.onmouseout  = RasterMenu.mouseoutHandler ;

   /** @property IID_MENU [boolean]: Interface ID tag constant used to identify #RasterMenu objects.
                             This property is always true.*/
}
/*****************************************************************************
 Implements the Control class
 @private
 *****************************************************************************/
RasterMenu.SHADOW_SIZE = 6;
RasterMenu.prototype.IID_MENU = true;
Raster.implementIID ( RasterMenu, RasterControl );



/*****************************************************************************
 Click event handler for command items.
 @private
 *****************************************************************************/
RasterMenu.mousedownHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // stop click events from bubbling up to the document (otherwise it will close the popup)
    Raster.stopEvent( event );

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    // if not a popup menu, invoke commandItem's click event
    if ( commandItem.menu==null && commandItem.isEnabled )
    {
        Raster.setActiveMenu( null );
        commandItem.command.click( event );

        // prior to IE9, child element hovers buggy (visibility:visible fix did not work in this case),
        // thus doing hover-out manually
        if ( Raster.isIE )
            commandItem.setDown( false );

    }/*if*/

};


/*****************************************************************************
 Over event handler for command items.
 @private
 *****************************************************************************/
RasterMenu.mouseoverHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    // Show item's popup menu if available
    var menu = commandItem.parentControl;

    if ( commandItem.menu != null && commandItem.isEnabled )
         menu.showItemMenu( commandItem );
    else
    {
        menu.showItemMenu( null );

        // prior to IE9, child element hovers buggy (visibility:visible fix did not work in this case),
        // thus doing hover manually
        if ( Raster.isIE )
          commandItem.setDown( true );
    }
};

/*****************************************************************************
 IE only - remove over style in menu command items.
 @private
 *****************************************************************************/
RasterMenu.mouseoutHandler = function( event )
{
    var el = Raster.srcElement( event );
    var commandItem = Raster.findParentExpando(el, "commandItem");

    // Ignore event when not coming from a commandItem element
    if ( commandItem==null )
        return;

    // prior to IE9, child element hovers are buggy (visibility:visible fix did not work in this case),
    // thus doing hover-out manually
    if ( commandItem.menu == null )
      commandItem.setDown( false );

};

/*****************************************************************************
 Show the popup menu associated with the given commandItem. This function
 hides any other popup.
 @private
 @param commandItem  object: Command item to activate the popup menu on.
                     If this argument is null, any opened popup menu is
                     closed.
 *****************************************************************************/
RasterMenu.prototype.showItemMenu = function( commandItem )
{
    //if item is already active, leave
    if ( this.activeCommandItem == commandItem )
        return;

    //if any menu item is active, hide it
    if ( this.activeCommandItem != null )
        this.activeCommandItem.showMenu( false );

    // reset state flags
    this.activeCommandItem = null;

    // if no argument, leave
    if ( commandItem==null )
        return;

    // when the item has an associated menu, show it
    if ( commandItem.menu != null )
    {
        commandItem.showMenu( true );
        this.activeCommandItem = commandItem;

    }/*if*/

};


/*****************************************************************************
 Adjusts width of the menu based on the current commands items. Shadow
 is also adjusted.
 @private
 *****************************************************************************/
RasterMenu.prototype.refreshWidth = function()
{
    var width = this.minWidth;
    for ( var commandId in this.items )
        width = Math.max( width, this.items[commandId].getMenuOptimalWidth() );

    this.itemsDiv.style.width = width + "px";
    this.shadowDiv.style.width =  (this.controlBox.offsetWidth + RasterMenu.SHADOW_SIZE) + "px";
    this.shadowDiv.style.height = (this.controlBox.offsetHeight + RasterMenu.SHADOW_SIZE ) + "px";

    // Force opera to recompute layout
    if ( Raster.isOp )
        Raster.repaint( this.controlBox );    

};


/*****************************************************************************
 Adjusts the parameters of the hatch opening in this popup.
 @private

 @param isVisible   boolean: true shows the hatch opening, false hides it.
 @param atTop       boolean: true shows the hatch at the top border,
                    false shows the hatch at the bottom border.
 @param x           number: X offset where the hatch line starts
 @param width       number: width of the hatch line opening
 *****************************************************************************/
RasterMenu.prototype.showHatch = function( isVisible, atTop, x, width)
{
    this.hatchDiv.style.display = isVisible ? "block" : "none";
    if ( !isVisible )
        return;

    this.hatchDiv.style.left = x + "px";
    this.hatchDiv.style.width = width + "px";

    if ( atTop )
    {
        this.hatchDiv.style.top = "0";
        this.hatchDiv.style.bottom = "";
    }
    else
    {
        this.hatchDiv.style.top = "";
        this.hatchDiv.style.bottom = "0";

    }/*if*/
};


/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method also disposes nested CommandItem objects.
 *****************************************************************************/
RasterMenu.prototype.dispose = function()
{
    this.itemsDiv = null;
    this.hatchDiv = null;
    this.shadowDiv = null;
    this.controlBox.onmousedown = null;
    this.controlBox.onmouseover = null;
    this.controlBox.menu = null;

    for ( var commandId in this.items )
        this.items[commandId].dispose();

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
    //out('Menu disposed.');
};


/*****************************************************************************
 Remove all items from this menu.
 *****************************************************************************/
RasterMenu.prototype.removeAll = function()
{
    for ( var commandId in this.items )
        this.items[commandId].dispose();

    this.cleanSeparators();
    this.items = [];
};


/*****************************************************************************
 Returns a reference to the DOM element that accepts content in this menu.
 CommandItems are stacked inside this container.
 @private
 *****************************************************************************/
RasterMenu.prototype.getContentElement = function()
{
    return this.itemsDiv;
};


/*****************************************************************************
 Shows/hides the popup menu's shadow.
 @param isVisible  boolean: true shows the shadow (default);
                   false hides the shadow.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.showShadow = function( isVisible )
{
    this.shadowDiv.style.display = isVisible ? "" : "none";
    return this;
};


/*****************************************************************************
 Show the menu at the given X,Y page coordinates.
 @param x            number: X position in pixels
 @param y            number: Y position in pixels
 @param adjustToFit  [boolean]: Set to true to allow the menu to be shifted
                     out of the given x,y coordinates and prevent the menu
                     from showing off-screen. Omit this argument or set
                     to false to show the menu at exactly the given x,y coordinates.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.showAt = function(x, y, adjustToFit )
{
    Raster.setActiveMenu( this );

    if ( adjustToFit===true )
    {
        var win = Raster.getWindowBounds();
        var scroll = Raster.getElementScrolling( document.body );
        var menubox = this.getBounds();

        // Don't fit to the right? then shift left
        if ( x + menubox.width > (win.width + scroll.x - 20) )
            x = Math.max( scroll.x, x - menubox.width );

        // Don't fit to the bottom? then shift up
        if ( y + menubox.height > (win.height + scroll.y - 20) )
            y = Math.max( scroll.y, y - menubox.height );
        
    }/*if*/

    this.moveTo( x, y );
    this.setVisible(true);
    return this;
};


/*****************************************************************************
 Show this menu to the right of the given element. If the menu does not fit
 to the right, it is show to the left of the element and adjusted to fit in
 the window.
 @param element object: Element to position the menu next to. This value can
                be one of the following: a string containing the ID of a DOM
                element, a reference to a DOM element, or another control object.
 @param ofsX    [number]: X offset to be applied to the final computed x value.
                This value can be positive or negative.
 @param ofsY    [number]: Y offset to be applied to the final computed y value.
                This value can be positive or negative.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.showNextTo = function( element, ofsX, ofsY )
{
    element = Raster.resolve( element );

    var elementBox = Raster.getBounds( element );
    var win = Raster.getWindowBounds();
    var scroll = Raster.getElementScrolling( document.body );
    var menubox = this.getBounds();

    var x = elementBox.x + elementBox.width + (ofsX || 0);
    var y = elementBox.y + (ofsY || 0);
    var adjusted = false;

    // Don't fit to the right? then squeeze it to the left
    if ( elementBox.x + elementBox.width + menubox.width > win.width )
    {
        x = Math.max( scroll.x, elementBox.x - menubox.width );
    }

    // Don't fit to the bottom? then squeeze it to the top
    if ( elementBox.y + menubox.height > (win.height + scroll.y) )
    {
        y = Math.max( scroll.y, (win.height + scroll.y) - menubox.height);
    }

    // make menu visible at the x,y  location
    this.showAt( x, y);

    return this;
};


/*****************************************************************************
 Show this menu to the bottom of the given element. If the menu does not fit
 in the bottom, it is show above of the element and adjusted to fit in
 the window.
 @param element object: Element to position the menu below of. This value can 
                be one of the following: a string containing the ID of a DOM
                element, a reference to a DOM element, or another control object.
 @param ofsX    [number]: X offset to be applied to the final computed x value.
                This value can be positive or negative.
 @param ofsY    [number]: Y offset to be applied to the final computed y value.
                This value can be positive or negative.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.showBelowOf = function( element, ofsX, ofsY )
{
    element = Raster.resolve( element );

    var elementBox = Raster.getBounds( element );
    var win = Raster.getWindowBounds();
    var scroll = Raster.getElementScrolling( document.body );
    var menubox = this.getBounds();

    
    var x = elementBox.x  + (ofsX || 0);
    var y = elementBox.y + elementBox.height  + (ofsY || 0);
    var adjusted = false;
    
    // Don't fit to the right? then shift to the left
    if ( elementBox.x + menubox.width > win.width || elementBox.x < scroll.x )
    {
        x = Math.max( scroll.x, (elementBox.x + Math.min(elementBox.width, menubox.width)) - menubox.width );
    }


    // Don't fit to the bottom? then shift it to the top
    if ( y + menubox.height > (win.height + scroll.y) )
    {
        y = Math.max( scroll.y, elementBox.y - menubox.height );
    }


    // make menu visible at the x,y  location
    this.showAt( x, y );

    return this;

};


/*****************************************************************************
 Hides this menu (if visible).
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.hide = function()
{
    //Hide any open sub-menu
    this.showItemMenu( null );
    this.setVisible(false);
    this.showHatch( false );
    return this;
};


/*****************************************************************************
 Adds a command item to this menu.
 @param newCommand   object: A reference to a #RasterCommand object.
 @param menu         [object]: A reference to a menu object. This is the popup
                     menu shown then the command item is selected. When a menu
                     is specified, the drop down arrow is automatically turned on.
                     Use <code>showArrow()</code> to turned off if desired.
 @param refCommand   [object]: A reference to a Command object, CommandItem object,
                     or a string containing the ID of an existing command.
                     If a command matching this argument is not found in this
                     container, the separator is appended at the end of the
                     container.
 @param after        [boolean]: true adds the separator after the
                     given refCommand (default); false adds this separator before the
                     given refCommand.
 @return object: A reference to the #RasterCommandItem object just added.
 *****************************************************************************/
RasterMenu.prototype.add = function( newCommand, menu, refCommand, after )
{
    //a. check for repeated command items
    if ( this.items[ newCommand.id ] != null )
        return this.items[ newCommand.id ];

    //b. add command item
    var item = new RasterCommandItem( this, newCommand );
    this.items[ newCommand.id ] = item;
    item.setMenu( menu );

    //c. reorganize items, if needed
    if ( refCommand!=null )
    {
        if ( refCommand.IID_COMMAND )
            refCommand = refCommand.id;
        else if ( refCommand.IID_COMMANDITEM )
            refCommand = refCommand.command.id;

        if ( this.items[ refCommand ] != null )
            Raster.setSibling( item, this.items[ refCommand ], after==null ? true : after );
    }/*if*/


    this.refreshWidth();
    
    return item;
};

 

/*****************************************************************************
 Adds a separator line in this menu.
 @param refCommand   [object]: A reference to a #RasterCommand object, #RasterCommandItem object,
                     or a string containing the ID of an existing command.
                     If a command matching this argument is not found in this
                     container, the separator is appended at the end of the
                     container.
 @param after        [boolean]: true adds the separator after the
                     given refCommand (default); false adds this separator before the
                     given refCommand.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.addseparator = function( refCommand, after )
{
    //a. resolve command objects into id
    if ( refCommand!=null )
    {
        if ( refCommand.IID_COMMAND )
            refCommand = refCommand.id;
        else if ( refCommand.IID_COMMANDITEM )
            refCommand = refCommand.command.id;
    }/*if*/

    //b. add seprarator
    var sep = document.createElement("SPAN");
    sep.className = "sep";

    if ( this.items[ refCommand ] == null )
        this.itemsDiv.appendChild( sep );
    else
        Raster.setSibling( sep, this.items[ refCommand ], after==null ? true : after );

    this.refreshWidth();

    return this;
};

/*****************************************************************************
 Removes adjacent, trailing, or leading separators. This method is called
 after removing items from the control to make sure no adjacent
 separators are left when removing an item.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.cleanSeparators = function()
{
    var hasPrevSep = true;
    var node = this.itemsDiv.firstChild;

    while ( node!=null )
    {
        if ( node.className=="sep" )
        {
            var sep = node;
            node = node.nextSibling;
            if ( hasPrevSep )
                this.itemsDiv.removeChild( sep );

            hasPrevSep = true;
        }
        else
        {
            hasPrevSep = false;
            node = node.nextSibling;
        }/*if*/

    }/*while*/

    // last?
    if ( this.itemsDiv.lastChild!=null && this.itemsDiv.lastChild.className=="sep" )
        this.itemsDiv.removeChild( this.itemsDiv.lastChild );

    return this;
};


/*****************************************************************************
 Removes a command item from this menu.
 @param command  object: A reference to a #RasterCommand object, #RasterCommandItem object, or a
                 string containing the ID of the command to be removed.
                 If a command matching this argument is not found in this
                 container, this method does nothing.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.remove = function( command )
{
    //a. resolve command objects into id
    if ( command.IID_COMMAND )
        command = command.id;
    else if ( command.IID_COMMANDITEM )
        command = command.command.id;

    //b. exit if command is not found in this control
    if ( this.items[ command ] == null )
        return this;

    //c. dispose the command item
    this.items[ command ].dispose();
    delete this.items[ command ];

    this.refreshWidth();
    this.cleanSeparators();

    return this;
};


/*****************************************************************************
 Sets the minimum width for this menu, for astetics purposes.
 @param minWidth  number: Desired minimum width. Set to null to use menu's
                  default width.
 @return object: The menu object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterMenu.prototype.setMinWidth = function( minWidth )
{
    this.minWidth = minWidth==null ? 50 : minWidth;
    this.refreshWidth();
    return this;
};

 

/*****************************************************************************
 Creates a command object. A command object defines an application function or
 action that can be executed by the user. Once a command is defined, it can
 be placed in the application's menus and toolbars so the user to execute them.

 The <code>eventHandler</code> argument specifies the function to be invoked
 when a command is executed. When a command is executed, the command object
 is passed as argument to the event handler. The following code shows a typical
 command handler function:
 <pre code>
   function myHandler ( cmd )
   {
        switch ( cmd.id )
        {
           case "save":    //do save...
                           break;
           case "open":    //do open...
                           break;
           case "new":     //do new document...
                           break;
           //etc...
        }
   }
 </pre>
 The next code fragment show how to create commands and adding them to a menu:
 <pre code>
     :
    // Create an array with our commands
    var cmds = [
      new RasterCommand( "id3", ICONS16.PAGE, null,
                           "New",  null, null, "Ctrl+N", myHandler ),

      new RasterCommand( "id2", ICONS16.FOLDER, null,
                           "Open", null, null, "Ctrl+O", myHandler ),

      new RasterCommand( "id1", ICONS16.FLOPPY, null,
                           "Save", null, null, "Ctrl+S", myHandler )
    ];

    // Disable the save command until there is something
    // to save...
    cmds[2].setEnabled( false );

    // create menu
    var menu = new RasterMenu();

    // Add commands to the menu
    menu.add( cmds[0] );
    menu.add( cmds[1] );
    menu.add( cmds[2] ); 
    &nbsp;
 </pre>
 The above code uses an array to store the commands the application will use
 in its UI. With this approach the code can become very verbose very fast.
 When working with a large amount of commands it is better to use commad
 group objects. See createGroup() for more details.
 
 @constructor
 @see createGroup()

 @param id           value: A unique ID used to identify this command. Choose
                     a short string code or integer constant that describes
                     a function or action in the application.
 @param icon         string: Either an URL of a 16x16 image, or an object that 
                     implements the IID_SPRITEINFO interface like the constants
                     defined in #ICONS16. This icon is used by menus and
                     small/medium toolbars. Set to null if no 16x16 icon is needed.
                     You don't need to set a 16x16 icons in commands aimed only at
                     "large" toolbars.
 @param icon32       string: Either an URL of a 32x32 image, or an object that
                     implements the IID_SPRITEINFO interface like the constants
                     defined in #ICONS32. This icon is used by "large" toolbars.
                     If this value is null, the 16x16 icon is used (if any).
                     You don't need to set a 32x32 icons in commands aimed menus
                     or small/medium toolbars.
 @param text         string: Text associated with this command. It is displayed
                     next or below the command icon. Set to null if no text is desired.
 @param toolText     string: Alternate text to be used when the command is displayed in
                     a toolbar. This is usually a shorter version of the <code>text</code>
                     argument used to prevent the toolbar buttons from growing
                     too wide. Set to null to use the default <code>text</code>.
 @param tooltip      string: Text that popup when the mouse pointer sits still over
                     a toolbar button. This text can be used to "hint" the user
                     detail information about what the command does. Set null is no
                     tooltip is desired. This text is used by toolbars only.
 @param keys         string: This is a label shown next to the menu option used to
                     show the keyboard shortcut (or keys) the user can press in
                     keyboard to execute this command, for example: "Alt+1",
                     "Ctrl+Shift+K", etc. Note this is a "display-only" label and no
                     actual key binding are stablished by the library. The programmer must
                     process the keyboard events separately. This feature is intended
                     for SWT/embedded-mozilla or XUL applications where there is better
                     keyboard control. Set to null if no shortcut keys are supported.
 @param eventHandler function: pointer to a function used to receive
                     notification when this command is executed.
 *****************************************************************************/
function RasterCommand( id, icon, icon32, text, toolText, tooltip, keys, eventHandler )
{
    this.id = id;                                       /** @property id [any]:  The unique ID that identifies the command.
                                                            This value is usually a string or integer constant
                                                            that tells the event handler what to do when the
                                                            command is executed.*/
    this.icon = icon;                                   /** @property icon [string]:   Either an URL of a 16x16 image, or an
                                                            object that implements the IID_SPRITEINFO. It may be null.*/
    this.icon32 = icon32;                               /** @property icon32 [string]:  Either an URL of a 16x16 image, or an
                                                            object that implements the IID_SPRITEINFO. It may be null.*/

    this.text = text;                                   /** @property text [string]: Text associated with the command. May be null.*/

    this.toolText = toolText!=null ? toolText : text;   /** @property toolText [string]: Alternate text used when
                                                            the command is displayed in a toolbar. May be null.*/
    this.keys = keys;                                   /** @property keys [string]: Shortcut key text associated
                                                            with this command. May be null.*/
    this.tooltip = tooltip;                             /** @property tooltip [string]: Tool tip text used when
                                                            the command is displayed in a toolbar. May be null.*/
    this.event = null;                 /** @property event [object]: Page's DOM event associated with the execution
                                                     of the command. This property is valid only in a command object
                                                     passed to a event handler. The event handler may use this
                                                     object to obtain further mouse and keyboard information.
                                                     This property may be null if the event was programmatically triggered by the
                                                     using the command's click() method and no <code>event</code> value was provided
                                                     by the caller. */

    this.isSelected = false;   /** @property isSelected [boolean]: True indicates the command is currently
                                   marked as selected; false indicates the command is not marked as selected.
                                   @see setSelected() */
    this.isEnabled = true;     /** @property isEnabled [boolean]: True indicates the command is currently
                                   enabled; false indicates the command is disabled.
                                   see setEnabled() */

    this.eventHandler = eventHandler;

    // Back reference to command items using this command.
    this.items = {};

    // Add command to global command registry,
    //   ignore commands coming from Tabbar control chevron menu
    if ( !/^tabitem.\d*$/.test(id) )
        RasterCommand.all[ id ] = this;

   /** @property IID_COMMAND [boolean]: Interface ID tag constant used to identify #RasterCommand objects.
                             This property is always true.*/
}
/*****************************************************************************
 Globals & Constants
 @private
 *****************************************************************************/
RasterCommand.all = {}; //command registry 
RasterCommand.CHEVRON = new RasterCommand("RasterCommand.CHEVRON", "" );
RasterCommand.prototype.IID_COMMAND = true;


/*****************************************************************************
 Creates a command group object. A command group object is a collection that
 holds command objects. All commands in the group have the same event handler.

 The <code>createGroup</code> is a static method in the #RasterCommand class,
 therefore it is invoked using <code>RasterCommand</code> class as follows:
 <pre code>
      :
    var commands = RasterCommand.createGroup( myHandler );
    &nbsp;
 </pre>
 The next code fragment illustrates how to create a command group, add commands,
 and reference the commands in it:
 <pre code>
    // create command group
    var commands = RasterCommand.createGroup( myHandler )

    // add commands to the group
    // args:      id      icon           icon32  text
    commands.add( "new",  ICONS16.PAGE,    null, "New" );
    commands.add( "open", ICONS16.FOLDER,  null, "Open" );
    commands.add( "save", ICONS16.FLOPPY,  null, "Save As..." );

    // Disable the "save" command until there is something to save...
    commands("save").setEnabled( false );

      :
 </pre>
 In the code above, the <code>commands</code> variable behaves as an
 array, indexed by the commands #id attribute. The only difference is that elements
 in a command group object are accessed using parenthesis "()" instead
 of square brackets "[]". The following lines show how to add the
 commands to a menu:
 <pre code>
     :
    // create menu
    var menu = new RasterMenu();

    // Add commands to the menu
    menu.add( commands("new") );
    menu.add( commands("open") );
    menu.add( commands("save") ); 
    &nbsp;
 </pre>
 The signature of the add() method is the same as the #RasterCommand constructor,
 minus the <strike>eventHandler</strike> argument:

 <code><i>commandGroup</i>.add( id, icon, icon32, text, toolText, tooltip, keys );</code>

 The <code>add()</code> function returns the #RasterCommand object just added to
 the command group collection, thus the following is also allowed:
 <pre code>
       :
    commands.add("save", ICONS16.FLOPPY, null,
                                   "Save As..." ).setEnabled(false);
    &nbsp;
 </pre>
 The line above adds a "save" command and disables it in the same
 statement.

 The command group is a convenient data structure used to store all the
 application's command objects in a single location. You can create many
 command groups, but in most cases one per web page is enough.

 @param eventHandler function: pointer to the function that will receive
                     notifications when commands in the group are executed.
 @return object: A new command group object.
 *****************************************************************************/
RasterCommand.prototype.createGroup = RasterCommand.createGroup = function( eventHandler )
{
    var commands = {};

    // define function that acts as a collection object; closure the 'commands' variable
    var group = function( id )
    {
        return commands[id];
    };

    // define static add method for the collection object
    group.add = function(id, icon, icon32, text, toolText, tooltip, keys )
    {
       return commands[id] = new RasterCommand( id, icon, icon32, text, toolText, tooltip, keys, eventHandler );
    };

    return group;
};


/*****************************************************************************
 Causes this command to invoke its associated event handler function.
 @param event [object]: A DOM event. This object is passed along to the
                        event handler as the command's #event property.
                        Set to null if not available.
 @return object: The command object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommand.prototype.click = function( event )
{
    if ( this.eventHandler!=null )
    {
        this.event = event;
        this.eventHandler( this );
        this.event = null;
    }
    return this;
};


/*****************************************************************************
 Updates the 'selected' state of all toolbar and menus containing an item
 associated with this command.
 @param selected boolean: True marks command items assosiated with this
                 command as selected. False unselect them.
 @return object: The command object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommand.prototype.setSelected = function( selected )
{
    this.isSelected = selected;

    // go through all commanditems using this command and update the select state in them
    for ( var id in this.items )
        this.items[ id ].setSelected( selected );

    return this;
};


/*****************************************************************************
 Updates the 'enabled' state of all toolbar and menus containing an item
 associated with this command.
 @param enabled   boolean: True marks command items associated with this
                   command as enabled. False disables them.
 @return object: The command object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommand.prototype.setEnabled = function( enabled )
{
    this.isEnabled = enabled;

    // go through all commanditems using this command and update the enabled state in them
    for ( var id in this.items )
        this.items[ id ].setEnabled( enabled );

    return this;
};


//-----8<--------------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Creates a renderable version of a #RasterCommand that can be added to a menu
 or a toolbar. This constructor should not be used directly. To add commands
 to menus and toolbars use RasterMenu.add() and RasterToolbar.add() respectively.
 @constructor
 @param parentControl     object: The #RasterToolbar or #RasterMenu object that contains
                          this command.
 @param command           A #RasterCommand object.
 @see RasterMenu.add(), RasterToolbar.add()
 *****************************************************************************/
function RasterCommandItem( parentControl, command )
{
    RasterControl.call( this, parentControl, "span" );

    this.command = command;
    this.parentControl = parentControl;
    this.isThick = parentControl.IID_TOOLBAR && parentControl.isThick===true;   // indicate this item was added to a thickbar
    this.isXLarge = parentControl.IID_TOOLBAR && parentControl.isXLarge===true; // indicate this item was added to a XL bar
    this.isMenu = parentControl.IID_MENU;                                       // indicate this item was added to a popup menu

    this.setClass( this.isMenu ? "rasterPopupMenuItem"  
                               : (this.isXLarge ? "rasterXLbarItem" : (this.isThick ? "rasterThickbarItem" : "rasterThinbarItem")) );

    this.iconLink = document.createElement("A");
    this.iconLink.href = "#";                            //needed in IE so hover works
    this.iconLink.onclick = Raster.stopEvent;
    this.iconLink.commandItem = this;                    //expando trace back to owner object
    if ( command.tooltip )
        this.iconLink.title = command.tooltip;    
    this.controlBox.appendChild( this.iconLink );
    this.iconLink.innerHTML = "<span class='bkleft'></span>" +
                              "<span class='bkright'></span>" +
                              "<span class='bkicon'></span>" +
                              "<span class='cmdIco'></span>" +
                              "<br class='cmdCRLF'>" +
                              "<span class='cmdTxt'></span>" +
                              "<br class='cmdCRLF'>" +
                              "<span class='cmdKey'></span>" +
                              "<span class='cmdArrow' style='display:none'></span>";


    this.iconSpan = this.iconLink.childNodes[3];
    this.textSpan = this.iconLink.childNodes[5];
    this.keysSpan = this.iconLink.childNodes[7];
    this.arrowSpan = this.iconLink.childNodes[8];


    if ( this.isXLarge )
    {
        if ( command.icon32 != null )
        {
            this.sprite = new RasterSprite( command.icon32, 32, 32 );
            this.sprite.setParent( this.iconSpan );
        }
        else if ( command.icon != null )
        {
            this.sprite = new RasterSprite( command.icon, 16, 16 );
            this.sprite.controlBox.style.margin = "8px 0"; //rudimentatry, center icon16 vertically
            this.sprite.setParent( this.iconSpan );
        }
        else
            this.iconSpan.innerHTML = "<span style='display:inline-block; height:32px'></span>";
    }
    else if ( command.icon != null )
    {
        this.sprite = new RasterSprite( command.icon, 16, 16 );
        this.sprite.setParent( this.iconSpan );
    }
    else if ( this.isMenu || this.isThick )
    {
        //insert 16px shim to compensate for missing icon
        this.iconSpan.innerHTML = "<span style='display:inline-block; width:16px; height:16px'></span>";
    }
    else
        this.iconSpan.style.display = "none";


    this.textSpan.innerHTML = parentControl.IID_TOOLBAR ? command.toolText : command.text;
    this.keysSpan.innerHTML = command.keys || "";

    // Set default state
    this.menu = null;
    this.isEnabled = true;
    this.isSelected = false;
    this.isDown = false;
    this.arrowOn = false;

    this.updateStyle();
    this.setSelected( command.isSelected );
    this.setEnabled( command.isEnabled );

    // Register this CommandItem in the Command's object items[] list
    this.id = "cmdItem" + (Raster.idSequence++);          // unique id used to identify this command item
    this.command.items [ this.id ] = this;

   /** @property IID_COMMANDITEM [boolean]: Interface ID tag constant used to identify #RasterCommandItem objects.
                             This property is always true.*/
}
/*****************************************************************************
 Statics, Implements the Control class
 @private
 *****************************************************************************/
RasterCommandItem.prototype.IID_COMMANDITEM = true;
Raster.implementIID ( RasterCommandItem, RasterControl );



/*****************************************************************************
 Releases and removes all DOM element references used by this control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method is called from the parent Toolbar or Menu; to remove an item
 use <code>remove()</code> instead.
 @private
 *****************************************************************************/
RasterCommandItem.prototype.dispose = function()
{
    this.iconLink.commandItem = null;
    this.iconLink.onmousedown = null;
    this.iconLink = null;
    this.iconSpan = null;
    this.textSpan = null;
    this.keysSpan = null;
    this.menu = null;

    if ( this.sprite != null )
        this.sprite.dispose();

    // Unregister this command item with the command it is using
    delete this.command.items [ this.id ];

    // Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );

    //out('CommandItem disposed.');
};


/*****************************************************************************
 Show/hides the menu associated with this command item (if any). The menu
 might shift off its optimal position in order to fit in the screen boundaries.
 @private
 @param isVisible boolean: true shows the menu, false hides it.
 *****************************************************************************/
RasterCommandItem.prototype.showMenu = function( isVisible )
{
    if ( this.menu==null )
        return;

    if ( isVisible===false )
    {
        this.menu.hide();
        this.setDown( false );
        return;
    }/*if*/

    // highlight the item
    this.setDown( true );

    var linkbox = Raster.getBounds( this.iconLink );
    var win = Raster.getWindowBounds();
    var scroll = Raster.getElementScrolling( document.body );
    var menubox = this.menu.getBounds();
    var x, y;

    //in Opera, el.getBoundingClientRect() often returns unreliable height values, use clientHeight instead
    if ( Raster.isOp )
        linkbox.height = this.iconLink.clientHeight;

    // a. Draw cascade sub-menu item
    if ( this.isMenu )
    {
        x = linkbox.x + linkbox.width - 3;
        y = linkbox.y - 3;

        // Don't fit to the right? then squeeze it to the left
        if ( linkbox.x + linkbox.width + menubox.width > win.width )
           x = Math.max( scroll.x, linkbox.x - menubox.width + 3);

        // Don't fit to the bottom? then squeeze it to the top
        if ( linkbox.y - 3 + menubox.height > (win.height + scroll.y) )
           y = Math.max( scroll.y, (win.height + scroll.y) - menubox.height);

    } // b. else, draw toolbar item's menu
    else
    {
        x = linkbox.x;
        y = linkbox.y + linkbox.height-3;

        // Don't fit to the right? then shift to the left
        if ( linkbox.x + menubox.width > win.width || linkbox.x < scroll.x)
            x = Math.max( scroll.x, (linkbox.x + Math.min(linkbox.width, menubox.width)) - menubox.width );

        // show hatch opening if fits
        // if ( x <= linkbox.x &&  (x + linkbox.width) < (x + menubox.width) )
            this.menu.showHatch( true, true, linkbox.x - x+1, linkbox.width-2 );


        // Don't fit to the bottom? then shift it to the top
        if ( y + menubox.height > (win.height + scroll.y) )
        {
            y = Math.max( scroll.y, linkbox.y - menubox.height + 3 );
            this.menu.showHatch( false );
        }


    }/*if*/


    // make menu visible at the x,y  location
    this.menu.moveTo( x, y);
    this.menu.setVisible(true);


};


/*****************************************************************************
 Utility method used to help a popup menu calculate the best display width
 for its commands items.
 @private
 *****************************************************************************/
RasterCommandItem.prototype.getMenuOptimalWidth = function()
{
    return   this.iconSpan.offsetWidth +             
             this.textSpan.offsetWidth +
             this.keysSpan.offsetWidth + 2;  // +2 = prevent wrapping of menu text in IE9, due to offsetWidth pixel fractional rounding              
};


/*****************************************************************************
 * Enables/Disables this command. The 'disabled' state overwrites the
 * states: 'down' and 'selected'.
 * @private
 * @param isEnabled boolean:True shows command normal, False greys out the icon & text.
 * @return object: The command item object. This allow for chaining multiple setter methods in
 *        one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.setEnabled = function( isEnabled )
{
    if ( this.sprite!=null )
        this.sprite.setOpacity( isEnabled ? 100 : 33 );

    Raster.setOpacity( this.arrowSpan, isEnabled ? 100 : 33 );
    
    this.isEnabled = isEnabled;
    this.updateStyle();

    return this;
};


/*****************************************************************************
 * Changes the state of this command item between down/normal. This state
 * is not shown when the command item is 'disabled'.
 * @private
 * @param isDown boolean: True shows command item in down state, false shows it normal.
 * @return object: The command item object. This allow for chaining multiple setter methods in
 *        one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.setDown = function( isDown )
{
    this.isDown = isDown;
    this.updateStyle();

    return this;
};


/*****************************************************************************
 * Changes the state of this command item between selected/normal. This state
 * is not shown when the command item is in 'down' or 'disabled' state.
 * @private
 * @param isSelected boolean: True shows command item in selected state, false shows
 *                   it normal.
 * @return object: The command item object. This allow for chaining multiple setter methods in
 *        one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.setSelected = function( isSelected )
{
    this.isSelected = isSelected;
    this.updateStyle();

    return this;
};


/*****************************************************************************
 Updates the <code>className</code> of the <code>iconLink</code> element based
 in the internal state of the <code>isEnabled</code>, <code>isSelected</code>,
 and <code>isDown</code> flags.
 @private
 *****************************************************************************/
RasterCommandItem.prototype.updateStyle = function()
{
    // The "****IE" styles have no :hover psudo-style, In dropdown menu options
    // IE hover is simulated via mouseover/out to avoid <A> child elements :hover stickiness
    var ieMenu = Raster.isIE && this.isMenu;


    if ( !this.isEnabled )
        this.iconLink.className = "rasterCommandItemDisabled";

    else if ( this.isDown )
        this.iconLink.className =  ieMenu ? "rasterCommandItemDownIE" + (this.isSelected ? " rasterCommandItemSelectedIE" : "")
                                          : "rasterCommandItemDown";

    else if ( this.isSelected )
        this.iconLink.className = ieMenu ? "rasterCommandItemSelectedIE" : "rasterCommandItemSelected";

    else
        this.iconLink.className = ieMenu ? "rasterCommandItemNormalIE" : "rasterCommandItemNormal";

};


/*****************************************************************************
 Removes this tab item from the Tabbar.
 @return object: The command item object.
 *****************************************************************************/
RasterCommandItem.prototype.remove = function()
{
    this.parentControl.remove( this );
    return this;
};

/*****************************************************************************
 Show/Hides text associated with a command.
 @param isVisible boolean: True show text, False hides the text.
 @return object: The command item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.showText = function( isVisible )
{
    this.textSpan.style.display = isVisible ? "" : "none";

    // show|hide chevron 
    if ( this.parentControl.IID_TOOLBAR )
        this.parentControl.doLayout();

    return this;
};


/*****************************************************************************
 Show/Hides icon associated with a command.
 @param isVisible boolean: True show icon, False hides the icon.
 @return object: The command item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.showIcon = function( isVisible )
{
    this.iconSpan.style.display = isVisible ? "" : "none";

    // show|hide chevron
    if ( this.parentControl.IID_TOOLBAR )
        this.parentControl.doLayout();

    return this;
};


/*****************************************************************************
 Assigns a menu to this command item.
 @param menu         object: A reference to a menu object. This is the popup
                     menu shown then the command item is clicked. When a menu
                     is specified, the drop down arrow is automatically turned on.
                     Use <code>showArrow()</code> to turned off if desired.
 @return object: The command item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.setMenu = function( menu )
{
    this.menu = menu;
    this.showArrow( menu!=null );
    return this;
};


/*****************************************************************************
 Show/Hides drop down menu arrow in the command.
 @param isVisible boolean: True show icon, False hides the icon.
 @return object: The command item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterCommandItem.prototype.showArrow = function( isVisible )
{
    // In thick mode, add/substract to the right padding to fit the drop down arrow
    if ( this.isThick || this.isXLarge )
    {
        if ( isVisible )
            this.iconLink.style.paddingRight = ((parseInt(this.iconLink.style.paddingRight) + 15) || 15) + "px";
        else if ( this.arrowOn )
            this.iconLink.style.paddingRight = ((parseInt(this.iconLink.style.paddingRight) - 15) || 0) + "px";
    }
    else if ( this.isMenu )
    {
        this.keysSpan.style.visibility =  isVisible ? "hidden" : "";
    }

    this.arrowOn = isVisible;
    this.arrowSpan.style.display = isVisible ? "" : "none";

    // show|hide chevron
    if ( this.parentControl.IID_TOOLBAR )
        this.parentControl.doLayout();

    return this;
};

 

/*****************************************************************************
 Creates a Tab bar control. The following example creates a tab bar
 in a DIV with a <code>id</code>="tabbar1":
 <pre code>
    var tab1 = new RasterTabbar("tabbar1");

    tab1.setCustomizable(true); // allow tab reordering
    tab1.add( ICONS16.HOUSE,"Home" ).select(); //selected tab
    tab1.add( ICONS16.COG,  "System" );
    tab1.add( ICONS16.TABLE,"Databases" );

     ...

    &lt;div id='tabbar1'&gt;&lt;/div&gt;
 </pre>
 The minimum height for a tab bar container is 28px. A tab bar will
 spread horizontally to take all the available horizontal space of the containing parent.

 The <code>icon</code> URL might be prefixed by Raster resource-folder tag. The prefix
 "IMG:" is replaced with the current raster/images location, for example:
 "IMG:icon.gif" resolves to "$RASTER_HOME$/images/icon.gif". The prefix "CSS:"
 is replaced with the current css themes images location, for example:
 "CSS:icon.gif" resolves to "$RASTER_HOME$/themes/$THEME$/images/icon.gif".

 Do not place a "/" between the prefix and the rest of the URL, as a forward slash
 will be inserted automatically. For configuring the
 RASTER_HOME and THEME use the Raster.config() method.

 @constructor
 @see RasterTabbarEvent

 @param parent         [object]: One of the following: a string containing the ID
                       of a DOM element, a reference to a DOM element, or another
                       control object. If this argument is null, the control is
                       created but not attached to the DOM tree; setParent() must
                       be invoked later to specify the parent control.
 @param alignTop       [boolean]: Specifies how this tabbar renders. True align tabs
                       to the top of the control, false align the tabs to the bottom
                       (default).
 *****************************************************************************/
function RasterTabbar( parent, alignTop )
{
    // call super()
    RasterControl.call( this, parent );
    this.controlBox.innerHTML = "<div class='items'></div><div class='chevron'></div><div class='baseline'></div>";
    this.itemsDiv = this.controlBox.firstChild;
    this.chevronDiv = this.controlBox.childNodes[1];

    this.alignTop = alignTop===true;
    this.setClass( this.alignTop ? "rasterTabbar rasterTabbarFlip" : "rasterTabbar" );
    this.items = {};

    this.isDnD = false;  //disables drag drop

    this.selectedTab = null;   //points to the current tabItem
    this.eventHandler = null;
    this.chevronMenu = null;   //menu created as result of chevron showing up

    // create chevron item
    this.chevronItem = this.add( "" );
    delete this.items[ this.chevronItem.id ]; //erase this item from the list of items, so it cannot be listed, or removed by the user

    this.chevronItem.isChevron = true;
    this.chevronItem.sprite.setImage( GLYPHS.CHEVRON_RIGHT );
    this.chevronItem.sprite.setSize( 9, 16 );
    this.chevronItem.setParent( this.chevronDiv );
    this.chevronDiv.style.display = "none";

    // handlers
    this.controlBox.onmousedown = RasterTabbar.mousedownHandler;


    // resister tabbar by unique id Sequence
    this.id = "tabbar" + (Raster.idSequence++);
    RasterTabbar.all[ this.id ] = this;

   /** @property IID_TABBAR [boolean]: Interface ID tag constant used to identify #RasterTabbar objects.
                             This property is always true.*/
}
/*****************************************************************************
 Globals, Implements the Control class
 @private
 *****************************************************************************/
RasterTabbar.all = {}; //keeps registry of all created tabbars
RasterTabbar.prototype.IID_TABBAR = true;
Raster.implementIID ( RasterTabbar, RasterControl );


/*****************************************************************************
 Triggers a layout check in all tab bars. Invoked when page is resized.
 @private
 *****************************************************************************/
RasterTabbar.doLayout = function()
{
    //call doLayout in all Tabbar
    for ( var id in RasterTabbar.all )
        RasterTabbar.all[id].doLayout();

};

/*****************************************************************************
 Click event handler for tab items.
 @private
 *****************************************************************************/
RasterTabbar.mousedownHandler = function( event )
{
    var el = Raster.srcElement( event );
    var tabItem = Raster.findParentExpando(el, "tabItem");

    Raster.stopEvent( event );
    Raster.setActiveMenu( null );

    // Ignore event when not coming from a tabItem element
    if ( tabItem==null )
        return;

    // Show popup menu when available, otherwise invoke tabItem's click event
    var tabbar = tabItem.parentControl;

    if ( tabItem == tabbar.chevronItem )
    {
        tabbar.chevronMenu.showBelowOf( tabItem.iconLink );
    }
    else
    {
        var mouse = Raster.getInputState( event );

        // Initiate drag operation on this item (if allowed)
        if ( tabbar.isDnD && mouse.button==1 )
        {
            RasterMouse.setCursor( CURSORS.DRAG );
            RasterMouse.startDrag( event, tabItem );
        }/*if*/

        if ( tabbar.selectedTab!=tabItem )
        {
            var tabEvent = null;
            if ( tabbar.eventHandler!=null )
            {
                tabEvent = RasterEvent.mkTabEvent( event, mouse.button==1 ? "click" : "context", tabbar, tabItem );
                tabbar.eventHandler( tabEvent );
            }

            if ( tabItem.isEnabled && (tabEvent==null || !tabEvent.isCancelled) )
                tabbar.selectTab  ( tabItem );

        }/*if*/

    }/*if*/

};


/*****************************************************************************
 Show/hides the chevron menu based on the width of the Tabbar. This is
 invoked by the Raster's onresize event.
 @private
 *****************************************************************************/
RasterTabbar.prototype.doLayout = function()
{
    var node = null;


    // find the first node that wraps to the second line (if any)
    for ( var i=0; i < this.itemsDiv.childNodes.length; i++)
    {
        var tmp = this.itemsDiv.childNodes[i];
        if ( tmp.offsetTop > 5 )
        {
            node = tmp;
            break;
        }
    }/*for*/

    // if no menuable items, hide chevron and leave
    if ( node==null )
    {
        this.chevronDiv.style.display = "none";
        return;
    }

    // show chevron, initialize menu
    this.chevronDiv.style.display = "block";
    if ( this.chevronMenu == null )
    {
        this.chevronMenu = new RasterMenu( document.body );
        this.chevronMenu.controlBox.style.zIndex = 90;
    }/*if*/

    // initialize chevron menu
    this.chevronMenu.removeAll();

    // populate menu with wrapped items
    do
    {
        var item = node.firstChild.tabItem;   //the firstChild is iconLink element
        var cmd = new RasterCommand( item.id, item.icon, null, item.text || "...", null, null, null, RasterTabbar.chevronMenuHandler );
        cmd.tabItem = item;
        this.chevronMenu.add( cmd );

        node = node.nextSibling;

    } while ( node != null );

};


/*****************************************************************************
 Event handler for tab bar chevron menu items.
 @private
 *****************************************************************************/
RasterTabbar.chevronMenuHandler = function( cmd, event )
{
    cmd.tabItem.select();

};


/*****************************************************************************
 Returns a reference to the DOM element that accepts content in this Control.
 @private
 *****************************************************************************/
RasterTabbar.prototype.getContentElement = function()
{
    return this.itemsDiv;
};


/*****************************************************************************
 Enables or disables drag and drop functions in the tab control.
 @param isDnD       boolean: True enables tab items to be dragged
                    and to become drop targets; false turns this feature off
                   (default).
 @return object: The tab bar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.setDragDrop = function( isDnD )
{
    this.isDnD = isDnD;
    return this;
};


/*****************************************************************************
 Releases and removes all DOM element references used by the tab control from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method also disposes nested TabItem objects as well.
 *****************************************************************************/
RasterTabbar.prototype.dispose = function()
{
    this.chevronItem.dispose();

    this.itemsDiv = null;
    this.chevronDiv = null;
    this.controlBox.onmousedown = null;

    // free chevron menu
    if ( this.chevronMenu )
    {
        this.chevronMenu.dispose();
        this.chevronMenu = null;
    }/*if*/

    // unresister tabbar
    delete RasterTabbar.all[ this.id ];

    for ( var tabId in this.items )
        this.items[tabId].dispose();

    //Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );
   // out('tabbar disposed.');
};


/*****************************************************************************
 Remove all tab items from the tab bar.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.removeAll = function()
{
    var all = this.getTabs();
    for ( var i=0; i < all.length; i++ )
        this.removeTab( all[i] );

    this.items = {};

    // hide chevron
    this.doLayout();

    return this;
};


/*****************************************************************************
 Adds a tab item to this Tabbar.
 @param icon              string: String containing path of a 16x16 image file
                          or an object that implements the IID_SPRITEINFO interface such as
                          the constants in the #ICONS16 object. Set to
                          null if no icon is desired.
 @param text              string: Text shown in the tab; set to null for
                          is no text is needed.
 @param containerId       [string]: The id of an existing element which css
                          display is set to "block" when the tab is selected,
                          and "none" when the tab is blured.
 @param value             [any]: Placeholder for an user-defined value to be
                          associated with this tab. User can access this value
                          later in the Tab's click event handler.
 @return object: A reference to the #RasterTabItem object just added.
 *****************************************************************************/
RasterTabbar.prototype.add = function( icon, text, containerId, value )
{
    //a. add tab item
    var item = new RasterTabItem( this, icon, text, containerId, value );
    this.items[ item.id ] = item;

    // show chevron if needed
    this.doLayout();

    return item;
};


/*****************************************************************************
 Selects the tab at the given index. To know the number of tabs in the
 tab bar use the getTabCount() method.
 @param index   number: zero-based index of the tab to be selected.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.selectTabByIndex = function( index )
{
    return this.selectTab( this.getTabByIndex(index) );
};


/*****************************************************************************
 Selects the given tab.
 @param item     object: A reference to a tab item object, or a
                 value matching the <code>value</code> attribute of a tab item.
                 If the given argument is null, it does not match any tab, or tab
                <code>value</code>, all tabs are then unselected.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.selectTab = function( item )
{
    if ( this.selectedTab!=null )
        this.selectedTab.markSelected ( false );

    this.selectedTab = null;

    if ( item==null || !item.IID_TABITEM )                // If item not a IID_TABITEM, treat it as a value attributte
        item = this.getTabByValue( item );

    if ( item!=null )
    {
        item.markSelected ( true );
        this.selectedTab = item;
    }/*if*/

    return this;
};


/*****************************************************************************
 Returns the selected tab item.
 @param item     object: A reference to the selected tab item. Returns null
                 if no tab item is currently selected.
 @return object: The selected tab item. Returns null if no tab item is
         currently selected.
 *****************************************************************************/
RasterTabbar.prototype.getSelectedTab = function( item )
{
    return this.selectedTab;
};


/*****************************************************************************
 Returns the tab item having a value attributte matching the given argument.
 @param value    any: A value matching the <code>value</code> attribute of a tab item.
 @return object: The tab item having a value attributte matching the given argument.
         Returns null if no tab item having a value attributte matching the
         given argument is found.
 *****************************************************************************/
RasterTabbar.prototype.getTabByValue = function( value )
{
    for ( var id in this.items )
        if ( this.items[id].value == value )
            return this.items[id];

    return null;
};


/*****************************************************************************
 Returns the tab item at the given index. To know the number of tabs in the
 tab bar use the getTabCount() method. 
 @param index    number: Zero-based index of the tab.
 @return object: The tab item at the given index. Returns null if the index
         is out of range.
 @see getTabCount()
 *****************************************************************************/
RasterTabbar.prototype.getTabByIndex = function( index )
{
    var childs = this.itemsDiv.childNodes;

    if ( index < childs.length )
        return childs[index].rasterControl;  //rasterControl = the item object
    else
        return null;
};


/*****************************************************************************
 Returns the number of tabs in the tab bar.
 @return number: The number of tabs in the tab bar.
 *****************************************************************************/
RasterTabbar.prototype.getTabCount = function()
{
    return this.itemsDiv.childNodes.length;
};


/*****************************************************************************
 Retrieve list of tab items in the tab bar.
 @return array: Array containing all tab items. An empty array if the tab bar
         has no tab items in it.
 *****************************************************************************/
RasterTabbar.prototype.getTabs = function()
{
    var temp = [];
    var childs = this.itemsDiv.childNodes;
    
    //fetch items from the DOM container to preserve ordering
    for ( var i=0; i < childs.length; i++ )
            temp.push( childs[i].rasterControl );  //rasterControl = the item object

    return temp;
};


/*****************************************************************************
 Removes a tab item from the Tabbar.
 @param item     object: A reference to a TabItem object, or a
                 value matching the value attribute of a TabItem.
                 If a tab matching this argument is not found in this
                 container, this method does nothing.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.removeTab = function( item )
{
    if ( !item.IID_TABITEM )                // If item not a IID_TABITEM, treat it as a value attributte
        item = this.getTabByValue( item );

    //a. exit if tab is not found in this control
    if ( item==null || this.items[ item.id ]==null )
        return this;

    //b. deactivate if item selected
    if ( this.selectedTab==item )
        this.selectTab(null);

    //c. dispose the tab item
    delete this.items[ item.id ];
    item.dispose();

    // show chevron if needed
    this.doLayout();

    return this;
};


/*****************************************************************************
 Shows/hides the tabbar's background.
 @param isVisible  boolean: true shows the assigned css background (default);
                   false makes the tabbar's background transparent.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabbar.prototype.showBackground = function( isVisible )
{
    this.controlBox.style.background = isVisible ? "" : "none";
    return this;
};


/*****************************************************************************
 Specifies an event handler to be notified of tab events.
 @param eventHandler   [function]: The event handler function to be invoked
                       when a tab event occurs. Set to null to remove any
                       previously set handler.
 @return object: The tabbar object. This allow for chaining multiple setter methods in
         one single statement.
 @see RasterTabbarEvent
 *****************************************************************************/
RasterTabbar.prototype.setEventHandler = function( eventHandler )
{
    this.eventHandler = eventHandler;
    return this;
};



//----------------------------------------------------------------------------------------------------------------
/*****************************************************************************
 Represents a tab item.
 @constructor
 @param parentControl     object: The Tabbar object that contains this item.
 @param icon              string: Either a URL of a 16x16 image, or
                          an object that implements the IID_SPRITEINFO interface
                          like the constants defined in #ICONS16. Set to
                          null if no image needed.
 @param text              string: Text shown in the tab; set to null for
                          is no text is needed.
 @param containerId       [string]: The id attribute name of an element to
                          set its css display to "block" when the tab is selected.
 @param value             [any]: Placeholder for an user-defined value to be
                          associated with this tab. User can access this value
                          later in the Tab's click event handler.
 *****************************************************************************/
function RasterTabItem( parentControl, icon, text, containerId, value )
{
    RasterControl.call( this, parentControl, "span" ); //super; use span
    this.setClass( "rasterTabbarItem" );

    this.parentControl = parentControl;

    this.iconLink = document.createElement("A");
    //this.iconLink.href = "#";                        //prevent IE6 from rendering artifacts on hover; this is ok since hover is not used in tabs
    this.iconLink.onclick = Raster.stopEvent;
    this.iconLink.tabItem = this;                    //expando trace back to owner object
    this.controlBox.appendChild( this.iconLink );
    this.iconLink.innerHTML = "<span class='bkleft'></span>" +
                              "<span class='bkright'></span>" +
                              "<span class='tabIco'></span>" +
                              "<span class='tabTxt'></span>";

    this.iconSpan = this.iconLink.childNodes[2];
    this.textSpan = this.iconLink.childNodes[3];

    // Set default state
    this.text = text;            /**@property text [string]: Text displayed in the tab item. To change the text in the tab item use setText().*/
    this.icon = icon;            /**@property icon [value]: The tab item's 16x16 icon. String containing path of an image file or an object that implements the IID_SPRITEINFO interface.
                                                    This property might be null. To set the tab item's icon use setIcon().*/
    this.value = value;          /**@property value any: Define any program-specific value to be associated with this
                                                         item, such as a primary-key or other server side unique-ID.*/

    this.isEnabled = true;       /**@property isEnabled [boolean]: True if the tab item is in enabled state, false otherwise. To change the enabled state use setEnabled().*/
    this.isSelected = false;     /**@property isSelected [boolean]: True if the tab item is in selected state, false otherwise. To change the select state use select().*/

    this.updateStyle();
    this.setDropHandler( RasterTabItem.dragDropHandler ); //super


    this.id = "tabitem" + (Raster.idSequence++);
    this.containerId = containerId;
    this.setText( text );
    this.setIcon( icon );

   /** @property IID_TABITEM [boolean]: Interface ID tag constant used to identify #RasterTabItem objects.
                             This property is always true.*/
}
/*****************************************************************************
 Statics, Implements the Control class
 @private
 *****************************************************************************/
RasterTabItem.prototype.IID_TABITEM = true;
Raster.implementIID ( RasterTabItem, RasterControl );

/*****************************************************************************
 Create and/or return a dragContext for this control instance.
 The drag context object is a place for this control instance to save the state
 of the drad and drop operation while the mouse hovers over the control's region.

 If the drag context does not exist yet for the given mouseEvt, one will be
 created and returned, otherwise the one current one is returned.
 @private
 @param mouseEvt      object: a RasterMouseEvent object
 @return  object: An context object this tabbar instance can use to store
          computations and state for the given mouseEvt operation.
 *****************************************************************************/
RasterTabbar.prototype.getDragContext = function( mouseEvt )
{
    // If we already created a drag context in this mouseEvt,
    // return that object
    var dragContext = mouseEvt.context[ this.id ];    

    // otherwise create drag context object for this control instance
    // and register it in the mouseEvt.context.
    if ( !dragContext )
    {
        dragContext = mouseEvt.context[ this.id ]  = {};
        dragContext.isBeforeDrag = true;
    }/*if*/

    return dragContext;
};

/*****************************************************************************
 Handles drag and drop operations used and tab re-organisation.
 @private
 @param mouseEvt      object: a RasterMouseEvent object
 *****************************************************************************/
RasterTabItem.dragDropHandler = function( mouseEvt )
{
    var tabItem = mouseEvt.control;
    var dragValue = mouseEvt.value;
    var evtType = mouseEvt.type=="enter" ? "over" : mouseEvt.type; // Indicates event type: "enter", "over", "out", "drop", "cancel"
    var tabbar = tabItem.parentControl;

    // nothing we care about is dragged over the control, leave
    if ( !tabbar.isDnD || evtType=="cancel" || evtType=="out" || dragValue==null || tabItem.isChevron )
        return;

    var isLocal = dragValue.IID_TABITEM  && (dragValue.parentControl == tabbar);
    var ctx = tabbar.getDragContext( mouseEvt );
    var tabEvent;

    // a. issue 'beforemove' event to user handler (if any)
    if ( isLocal && ctx.isBeforeDrag )
    {
        ctx.isBeforeDrag = false; //prevent from entering this code block again

        // Notify event handler tabitem is about to be moved
        if ( tabbar.eventHandler!=null )
        {
            tabEvent = RasterEvent.mkTabEvent( mouseEvt.event, "beforedrag", tabbar, dragValue,
                                               dragValue, null );
            tabbar.eventHandler( tabEvent );
        }

        // Cancel drag on user request
        if ( tabEvent!=null && tabEvent.isCancelled )
        {
            RasterMouse.cancelDrag();
            return;
        }
    }/*if*/

    RasterMouse.showDropBorderOver( null );
    RasterMouse.showDropLine( null );

    // b. if we are hovering over ourselves, leave
    if ( dragValue==tabItem )
        return;

    // c. calculate drop position
    var b = tabItem.getBounds();
    var edge = RasterMouse.getNearestEdgeH(tabItem.controlBox, mouseEvt.event, b.width/3);
    var position = edge==3 ? "after" : ( edge==7 ? "before" :  "over" );

    // d. notify event handler
    tabEvent = null;

    if ( tabbar.eventHandler!=null && (evtType=="over" || (evtType=="drop" && ctx.position!=null))   )
    {
        tabEvent = RasterEvent.mkTabEvent( mouseEvt.event, evtType, tabbar, tabItem, dragValue,
                                          (evtType=="over" ? position : ctx.position)  );
        tabbar.eventHandler( tabEvent );
    }/*if*/

    // e. Highlight the insertion point or drop target, draw visual cues
    if (  evtType=="over" && tabEvent && tabEvent.acceptPosition )
    {
        position = ctx.position = tabEvent.acceptPosition;

        if ( position=="after" ) //right
            RasterMouse.showDropLine( b.x+b.width, b.y-6, true, b.height+12);

        else if ( position=="before" )          //left
            RasterMouse.showDropLine( b.x, b.y-6, true, b.height+12);

        else  //over
            RasterMouse.showDropBorderOver( tabItem.iconLink  );

    }
    else if ( evtType!="drop" )
    {
        ctx.position = null;

    }/*if*/


    // f. on drop, move a tab that has been dragged locally
    if ( evtType=="drop" && isLocal && ctx.position && (tabEvent && !tabEvent.isCancelled) )
          dragValue.setSibling( tabItem.controlBox, ctx.position=="after" );


};

/*****************************************************************************
 Returns the text in this tab item.
 @private
 @return string: the text in this tab item.
 *****************************************************************************/
RasterTabItem.prototype.toString = function()
{
    return this.text;
};

/*****************************************************************************
 Changes the appearance of this tab item between selected/normal. This style
 is not shown when the command item is 'disabled' state. If the tab is
 associated with a container id, the container is show/hidden accordingly.
 @private
 @param isSelected boolean: True shows command item in selected state, false shows
                   it normal.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.markSelected = function( isSelected )
{
    this.isSelected = isSelected;
    this.updateStyle();

    if ( this.containerId != null )
    {
        var el = document.getElementById( this.containerId );
        if ( el != null)
            el.style.display = isSelected ? "block" : "none";
    }/*if*/

    return this;
};


/*****************************************************************************
 Updates the <code>className</code> of the <code>iconLink</code> element based
 in the internal state of the <code>isEnabled</code>, and
 <code>isSelected</code>  flags.
 @private
 *****************************************************************************/
RasterTabItem.prototype.updateStyle = function()
{
    if ( !this.isEnabled )
        this.iconLink.className = "rasterTabItemDisabled";

    else if ( this.isSelected )
        this.iconLink.className = "rasterTabItemSelected";

    else
        this.iconLink.className = "";

};


/*****************************************************************************
 Releases and removes all DOM element references used by this tab item from the
 DOM tree. After this method is invoked, this instance should no longer be used.
 This method is called from the parent Tabbar; to remove a tab from the tab bar
 use remove() instead.
 @private
 *****************************************************************************/
RasterTabItem.prototype.dispose = function()
{
    this.iconLink.tabItem = null;
    this.iconLink.onmousedown = null;
    this.iconLink = null;
    this.iconSpan = null;
    this.textSpan = null;

    if ( this.sprite )
        this.sprite.dispose();

    // Unregister this command item with the tabbar  is using
    delete this.parentControl.items [ this.id ];

    // Chain-in super.dispose()
    RasterControl.prototype.dispose.call( this );

    //out('TabItem disposed.');
};


/*****************************************************************************
 Removes this tab item from the Tabbar.
 @return object: The tab item object.
 *****************************************************************************/
RasterTabItem.prototype.remove = function()
{
    this.parentControl.removeTab( this );
    return this;
};


/*****************************************************************************
 Makes this tab the selected tab.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.select = function()
{
    this.parentControl.selectTab( this );

    return this;
};


/*****************************************************************************
 Changes the state of this tab item between disabled/normal. The
 'disabled' state overwrites the 'selected' state.
 @param isEnabled boolean: True shows command normal, False greys out the icon & text.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.setEnabled = function( isEnabled )
{
    // If the tab is disable when is selected, then select none
    if ( !isEnabled && this.isSelected )
        this.parentControl.selectTab( null );

    if ( this.sprite!=null )
        this.sprite.setOpacity( isEnabled ? 100 : 33 );

    this.isEnabled = isEnabled;
    this.updateStyle();

    return this;
};



/*****************************************************************************
 Sets the text displayed in this tab.
 @param text  string: Text shown in the tab; set to null
              if no text is needed.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.setText = function( text )
{
    this.text = text;
    this.textSpan.innerHTML = text || "";
    this.textSpan.style.display = (text!=null) ? "" : "none";

    // show chevron if needed
    this.parentControl.doLayout();

    return this;
};


/*****************************************************************************
 Sets the icon displayed in this tab.
 @param icon  string: Either a URL of a 16x16 image, or an object that
              implements the IID_SPRITEINFO interface like the constants
              defined in #ICONS16. Set to null if no image desired.
 @return object: The tab item object. This allow for chaining multiple setter methods in
         one single statement.
 *****************************************************************************/
RasterTabItem.prototype.setIcon = function( icon )
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

    // show chevron if needed
    this.parentControl.doLayout();

    return this;
};

/*****************************************************************************
 Return the index of the tab item. The first tab is at index 0.
 @return number: The index of the tab item.
 *****************************************************************************/
RasterTabItem.prototype.getIndex = function()
{
    return Raster.indexOf( this.controlBox );
};


 

/*******************************************************************
 * Static object containing utility properties and functions used
 * to work with the mouse. These utilities support the Raster 
 * controls in implementing drag and drop operations.
 * @static
 *******************************************************************/
var RasterMouse = {

    /*******************************************************************
     Configures mouse singleton. This is called automatically before
     a mouse resource is used.
     @private
     *******************************************************************/
    setup:  function()
    {
        if ( RasterMouse.allSet )
           return;

        // Create drop boxBorder and insertLine
        RasterMouse.dropBorder = new RasterBorderBox( document.body );
        RasterMouse.insertionLine = new RasterInsertLine( document.body );
        RasterMouse.shadeBox = new RasterShadeBox( document.body );

        // Create cursor box, requires Sprite
        RasterMouse.cursorSprite = new RasterSprite("", 16, 16, false);
        RasterMouse.cursorSprite.setParent( document.body  );
        RasterMouse.cursorSprite.setClass( "rasterCursorSprite" );
        RasterMouse.cursorSprite.setDisplay( false );

        // Install additional mouse handlers
        Raster.addListener( document, "mouseup", RasterMouse.mouseup );
        Raster.addListener( window, "blur", RasterMouse.cancelDrag );
        if ( Raster.isIE )
            Raster.addListener( window, "losecapture", RasterMouse.cancelDrag );

        RasterMouse.allSet = true;
    },


    /*******************************************************************
     Starts a drag operation. This method must be called
     within mousedown <code>event</code> handler.

     This method starts either a drag or mousemove operation. If a mousemove
     type of operation is desired, a custom <code>mouseListener</code> must
     be specified. The <code>mouseListener</code> will have the
     following signature:
     <pre code>
         function myMouseMoveListener( rasterMouseEvent )
         {
             // ...
         }
     </pre>
     Once the mousemove operation starts, the <code>mouseListener</code>
     function is called each time the mouse moves until the user release
     the mouse button, or RasterMouse.cancelDrag() is invoked.
     The argument sent to the <code>mouseListener</code> function is of
     type #RasterMouseEvent.

     If a <code>mouseListener</code> is not specified, a drag operation
     is started. As the mouse moves over the #RasterControl objects, their
     respective drop handlers (if any) are fired. Note the
     RasterControl.setDropHandler() method is used to specify a drop handler
     function for any user-defined custom control.

     At any time during a mouse move or drag operation, the RasterMouse.cancelDrag()
     can be invoked to stop the operation. Note that RasterMouse.cancelDrag()
     is automatically invoked if the end-user press the ESC key.

     The <code>disableIECapture</code> is a IE-only feature. This argument is
     defaulted to false, unless explicitly changed. Mouse "capture"
     enables IE to keep firing all <code>mousemove</code> and <code>mouseup</code>
     events even if the mouse goes outside the browser window. This is the default
     mode used by <code>startDrag</code>. However, there are instances where
     "capture" is not desired. In mouse capture mode, the mouse pointer is
     fixed at the time the mouse capture operation starts, preventing IE from
     updating the mouse pointer when moving over elements using CSS
     <code>cursor</code> styles. If CSS cursor "hover styles" are important,
     set <code>disableIECapture</code> to true. Note that in non-capture
     mode, drag and mouse move operations are cancelled if the mouse leaves
     the browser window. This prevents drag and mouse move operation from
     "sticking" in cases where the user leaves the window, release the mouse button,
     and enters back.


     @param event        object: Event object received in the mousedown or click event.
     @param value        [any]: Value being dragged. This property is used to store the
                         value you wish to pass along to other controls in a drag and drop
                         operation: anything from a simple int or string to a complex object.
                         Set to null if not needed.
     @param data         [object]: Free-format data structure used to store meta data
                         needed during a mousemove operation. For example, if
                         you are dragging a circle inside a rectangle, you can
                         pre-compute the min/max values the circle is allow to move
                         without going outside the rectangle and save them in the
                         <code>data</code> property. Then, all that your mousemove
                         event has to do is validate against the values stored
                         in the #RasterMouseEvent.data property, rather than recomputing
                         these values in each event occurence. This object persists for
                         the duration of the drag operation. Set to null if not needed.
     @param mouseListener [function]: User-defined handler to be notified
                          of mouse move events. Set to null if not needed.
     @param disableIECapture [boolean]: set to true to disable IE mouse
                             capture. In IE, when the mouse is not captured
                             the mouse stop responding once it goes out of
                             the browser window.

     @return object: The #RasterMouseEvent resulting from starting a drag operation.
             This is the same object that will be passed along to other drop and mouse listeners.
             You may use this object to initialize the #RasterMouseEvent.context if desired.
     @see RasterControl.setDropHandler(), RasterMouse.cancelDrag(), RasterMouseEvent
     *******************************************************************/
    startDrag: function( event, value, data, mouseListener,  disableIECapture )
    {
        RasterMouse.setup();

        RasterMouse.timer = null;
        RasterMouse.event = RasterEvent.mkMouseEvent( event, "", value, data );
        RasterMouse.mouseListener = mouseListener;
        RasterMouse.startCursor = RasterMouse.currentCursor;

        Raster.stopEvent( event );
        Raster.addListener( document, "mousemove", RasterMouse.mousemove );

        if ( Raster.isIE )
        {
            if ( disableIECapture!==true )
                 document.body.setCapture();
            else
                Raster.addListener( document.body, "mouseleave", RasterMouse.cancelDrag );
        }/*if*/

        return RasterMouse.event;
    },


    /*******************************************************************
     Ends the current drag operation (if any). Also called when the
     browser loses mouse capture, ie. the browser window loses focus
     for any reason (including alerts or pop-up windows) or user press
     the ESC key, or this method is invoked directly.
     @see RasterControl.setDropHandler(), RasterMouse.startDrag()
     *******************************************************************/
    cancelDrag:  function()
    {
        if ( Raster.isIE )
        {
            document.body.releaseCapture();
            Raster.removeListener( document.body, "mouseleave", RasterMouse.cancelDrag );
        }/*if*/

        if ( RasterMouse.event )
        {
            var evt = RasterMouse.event;
            evt.type = "cancel";

            // Invoke RasterMouse.currentControl user-defined dropHandler expando (if defined)
            if ( RasterMouse.currentControl!=null && RasterMouse.currentControl.dropHandler!=null )
            {
                evt.control = RasterMouse.currentControl;
                RasterMouse.currentControl.dropHandler( evt );//"cancel", RasterMouse.currentControl, event );
            }/*if*/


            // Invoke RasterMouse.mouseListener user-defined function (if defined)
            if ( RasterMouse.mouseListener!=null )
            {
                evt.control = null;
                RasterMouse.mouseListener( evt ); //"cancel"

                evt.type = "end";
                RasterMouse.mouseListener( evt );

            }/*if*/

        }/*if*/


        Raster.removeListener( document, "mousemove", RasterMouse.mousemove );

        if ( RasterMouse.timer!=null )
            clearInterval( RasterMouse.timer );

        RasterMouse.timer = null;
        RasterMouse.event = null;
        RasterMouse.currentElement = null;
        RasterMouse.currentControl = null;
        RasterMouse.mouseListener = null;
        RasterMouse.startCursor = null;

        RasterMouse.setCursor( null );
        RasterMouse.dropBorder.hide();
        RasterMouse.insertionLine.hide();
        RasterMouse.shadeBox.hide();

        //out( "Drag terminated.");
    },


    /*******************************************************************
     Mouse move listener
     @private
     *******************************************************************/
    mousemove:  function( event )
    {
        var evt = RasterMouse.event;
        var mouse = Raster.getInputState( event );
        evt.event = event;
        evt.x = mouse.x;
        evt.y = mouse.y;
        evt.ctrl = mouse.ctrl;
        evt.alt = mouse.alt;
        evt.shift = mouse.shift;
        evt.button = mouse.button;

        // Adjust mouse cursor (if any)
        if ( RasterMouse.currentCursor!= null )
            RasterMouse.cursorSprite.moveTo( mouse.x + 12, mouse.y + 17); //position image in the lower-right corner of the mouse


        // Yield to user-defined mouse move listener (if any)
        if ( RasterMouse.mouseListener )
        {
            evt.type = "move";
            RasterMouse.mouseListener( evt );
            return;
        }/*if*/


        // Each time we roll over a new element, check it it has a dropHandler defined
        // boxes controls such as BorderBox, ShadeBox, and InsertionLine do not count as new element
        var el = Raster.srcElement( event );

        // find the newarest parent element belonging to a Control
        // having a defined dropHandler
        var rasterControl = Raster.findParentExpando( el, "rasterControl");
        var isIgnoredControl = rasterControl!=null && ( rasterControl.IID_BORDERBOX===true ||
                               rasterControl.IID_SHADEBOX===true || rasterControl.IID_INSERTIONLINE===true );

        if ( !isIgnoredControl )
            while ( rasterControl!=null && rasterControl.dropHandler==null )
                rasterControl = Raster.findParentExpando( rasterControl.controlBox.parentNode, "rasterControl");


        var mouseLeft = RasterMouse.currentElement!=el && !isIgnoredControl;

        if ( mouseLeft )
        {
            // Notify previous control the mouse has left (if any)
            if ( RasterMouse.currentControl!=null && RasterMouse.currentControl.dropHandler!=null )
            {
                evt.type = "out";
                evt.control = RasterMouse.currentControl;
                RasterMouse.currentControl.dropHandler( evt ) ;//"out", RasterMouse.currentControl, event );
            }/*if*/

           // out ("rasterControl is IID_BORDERBOX : " + rasterControl.IID_BORDERBOX);
            RasterMouse.currentElement = el;
            RasterMouse.currentControl = rasterControl;
            RasterMouse.dropBorder.hide();
            RasterMouse.insertionLine.hide();
            RasterMouse.shadeBox.hide();

            if ( RasterMouse.currentCursor != RasterMouse.startCursor) //restore initial cursor
                RasterMouse.setCursor( RasterMouse.startCursor );
            
        }/*if*/

        // Call dropHandler() in current control (if any)
        if ( RasterMouse.currentControl!=null && RasterMouse.currentControl.dropHandler!=null )
        {
            evt.type = mouseLeft ? "enter" : "over";
            evt.control = RasterMouse.currentControl;
            RasterMouse.currentControl.dropHandler( evt ); //, RasterMouse.currentControl, event );
        }
    },

    
    /*******************************************************************
     Mouse move listener - ends drag
     @private
     *******************************************************************/
    mouseup:  function( event )
    {
        // If we are not dragging anything, leave
        if ( !RasterMouse.event  )
            return;

        var evt = RasterMouse.event;
        var mouse = Raster.getInputState( event );
        evt.event = event;
        evt.x = mouse.x;
        evt.y = mouse.y;
        evt.ctrl = mouse.ctrl;
        evt.alt = mouse.alt;
        evt.shift = mouse.shift;
        evt.button = mouse.button;

        // Invoke RasterMouse.currentControl user-defined dropHandler expando (if defined)
        if ( RasterMouse.currentControl!=null && RasterMouse.currentControl.dropHandler!=null )
        {
            evt.type = "drop";
            evt.control = RasterMouse.currentControl;
            RasterMouse.currentControl.dropHandler( evt ); //"drop", RasterMouse.currentControl, event );
        }/*if*/

        // Invoke RasterMouse.mouseListener user-defined expando (if defined)
        if ( RasterMouse.mouseListener!=null )
        {
            evt.type = "up";
            evt.control = null;
            RasterMouse.mouseListener( evt );//"up",  event );

            evt.type = "end";
            RasterMouse.mouseListener( evt );
        }/*if*/

        // Prevents RasterMouse.cancelDrag() from issuing a "cancel" event
        RasterMouse.currentControl = null;
        RasterMouse.mouseListener = null;

        // Reset mouse drag
       // out( "end drag! ");
        RasterMouse.cancelDrag();
    },


    /********************************************************************
     Register a callback function to be called at periodic intervals
     during the duration of a drag operation. The callback function
     can introspect the mouse position and implement auto-scroll behaviors
     in a control.

     This method has no effect if invoked when no drag operation 
     is in progress. The callback function will have the following signature:
     <pre code>
         //////////////////////////////////////////////////
         //  mouseEvt: a #RasterMouseEvent
         //  arg:      the 'arg' parameter
         function myCallback( mouseEvt, arg )
         {
             //...
         }
     </pre>
     The callback function will stop being invoked when the current
     drag operation ends.

     @param callback function: Function to be called on timer intervals.
     @param arg      any: Argument to be passed to the callback function.
     @see RasterMouseEvent, RasterMouse.startDrag()
     ********************************************************************/
    addTimerListener: function( callback, arg )
    {
        if ( RasterMouse.event == null )
            return;

        if ( !RasterMouse.event.callbacks )
        {
            RasterMouse.event.callbacks = [];
            RasterMouse.timer = setInterval( RasterMouse.timerHandler, 100 );
        }/*if*/

        RasterMouse.event.callbacks.push( {callback:callback, arg:arg} );
    },


    /********************************************************************
     Handle RaterMouse timer events, invoke all registered callbacks.
     @private
     ********************************************************************/
    timerHandler: function( callback, arg )
    {
        RasterMouse.event.type = "timer";
        
        var arr = RasterMouse.event.callbacks;
        for ( var i=0; i < arr.length; i++ )
           arr[i].callback( RasterMouse.event, arr[i].arg );
    },


    /********************************************************************
     Sets the mouse cursor's sub-icon.
     @param cursor object: One of the CURSOR sprite constants, or any object
                   that implements the IID_SPRITEINFO interface. Setting
                   this argument to null will hide the mouse cursor
                   (if any is set).
     ********************************************************************/
    setCursor: function( cursor )
    {
        RasterMouse.setup();
        RasterMouse.currentCursor = cursor;

        if ( cursor==null )
        {
            RasterMouse.cursorSprite.moveTo( 0, -1600);
            //Mouse.cursorSprite.setVisible( false );
        }
        else if ( cursor.IID_SPRITEINFO )
        {
            RasterMouse.cursorSprite.setImage( cursor, true );   //true means 'resize'
            RasterMouse.cursorSprite.setDisplay( true );
        }/*if*/

    },

    /********************************************************************
     Restore the mouse cursor set prior to starting a drag operation.
     ********************************************************************/
    restoreCursor: function()
    {
        RasterMouse.setCursor( RasterMouse.startCursor );
    },


    /********************************************************************
     Sets the mouse over cursor for the dropBorder.
     @private
     @param cssCursor   [string]: a valid css cursor name. If this value
                         is not specified, "default" is used.
     ********************************************************************/
    setDropBorderCursor: function( cssCursor )
    {
        RasterMouse.setup();
        RasterMouse.dropBorder.controlBox.style.cursor = cssCursor || "default";
    },


    /********************************************************************
     Surrounds the given element with a semi-transparent border used to
     highlight a drop target area.

     This function can be used from within a user-defined
     <code>dropHandler()</code> function to highlight the drop target as
     the mouse cursor hovers over a valid target. Drop borders are
     automatically hidden when after a drop operation is completed,
     cancelled or the mouse leaves a valid drop area.

     @param element    object: DOM element to be highlighted
     @param borders    [string]: A String containing any combination of the following
                       characters: 't'=top 'b'=bottom, 'l'=left, and 'r'=right.
     @param cssCursor  [string]: a valid css cursor name. If this value
                       is not specified, the current cursor is used.
     ********************************************************************/
    showDropBorderOver: function( element, borders, cssCursor)
    {
        RasterMouse.setup();

        if ( element==null )
        {
            RasterMouse.dropBorder.hide();
            return;
        }/*if*/

        if ( cssCursor!=null )
            RasterMouse.setDropBorderCursor( cssCursor );

        RasterMouse.dropBorder.setBorders( borders );
        RasterMouse.dropBorder.showOver( element );
    },


    /********************************************************************
     Displays a floating semi-transparent border at the given x,y
     coordinates, width and height.

     This function can be used from within a user-defined
     <code>dropHandler()</code> function to highlight the drop target as
     the mouse cursor moves. The border box is automatically hidden when
     a drop operation is completed, cancelled or the mouse leaves a valid
     drop area.

     @param x            number: X position in pixels. Set this argument
                         to null to hide the shade box. When set to null
                         all other arguments (if any) are ignored.
     @param y            number: Y position in pixels
     @param width        number: width of the box
     @param height       number: height of the box
     @param cssCursor   [string]: a valid css cursor name. If this value
                        is not specified, the current cursor is used.
     ********************************************************************/
    showDropBorder: function( x, y, width, height, cssCursor )
    {
        RasterMouse.setup();

        if ( x==null )
        {
            RasterMouse.dropBorder.hide();
            return;
        }/*if*/

        if ( cssCursor!=null )
            RasterMouse.setDropBorderCursor( cssCursor );

        RasterMouse.dropBorder.setSize( width, height );
        RasterMouse.dropBorder.moveTo( x, y );
    },


    /********************************************************************
     Sets the mouse over cursor for the shadeBox.
     @private
     @param cssCursor   [string]: a valid css cursor name. If this value
                         is not specified, "default" is used.
     ********************************************************************/
    setShadeBoxCursor: function( cssCursor )
    {
        RasterMouse.setup();
        RasterMouse.shadeBox.controlBox.style.cursor = cssCursor || "default";
    },


    /********************************************************************
     Displays a floating semi-transparent box at the given x,y coordinates,
     width and height.

     This function can be used from within a user-defined
     <code>dropHandler()</code> function to highlight the drop target as
     the mouse cursor moves. The shade box is automatically hidden when
     a drop operation is completed, cancelled or the mouse leaves a valid
     drop area.

     @param x            number: X position in pixels. Set this argument
                         to null to hide the shade box. When set to null
                         all other arguments (if any) are ignored.
     @param y            number: Y position in pixels
     @param width        number: width of the box
     @param height       number: height of the box
     @param cssCursor   [string]: a valid css cursor name. If this value
                        is not specified, the current cursor is used.
     ********************************************************************/
    showShadeBox: function( x, y, width, height, cssCursor )
    {
        RasterMouse.setup();

        if ( x==null )
        {
            RasterMouse.shadeBox.hide();
            return;
        }/*if*/

        if ( cssCursor!=null )
            RasterMouse.setShadeBoxCursor( cssCursor );

        RasterMouse.shadeBox.setSize( width, height );
        RasterMouse.shadeBox.moveTo( x, y );
    },


    /********************************************************************
     Displays a insertion line at the given x,y coordinates, line length
     and orientation.

     This function can be used from within a user-defined
     <code>dropHandler()</code> function to highlight the drop target as
     the mouse cursor hovers over a valid target. The drop line is
     automatically hidden when after a drop operation is completed,
     cancelled or the mouse leaves a valid drop area.

     @param x            number: X position in pixels. Set this argument
                         to null to hide the dropline. When set to null
                         all other arguments (if any) are ignored.
     @param y            number: Y position in pixels
     @param isVertical   boolean: True sets the line orientation to
                         vertical (default), false set the orientation
                         horizontal.
     @param length       number: the line's length
     ********************************************************************/
    showDropLine: function( x, y, isVertical, length  )
    {
        RasterMouse.setup();

        if ( x==null )
        {
            RasterMouse.insertionLine.hide();
            return;
        }/*if*/

        RasterMouse.insertionLine.setOrientation( isVertical, length );
        RasterMouse.insertionLine.moveTo( x, y );
    },


    /********************************************************************
     CSS resize cursor names for the given cursor ID according to the
     following illustration:

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
     *********************************************************************/
    RESIZE_CURSORS : ["nw-resize", "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "default"],
    
    /*******************************************************************
     Determine which container's edge the mouse pointer is closer to.
     This function is useful for showing the appropriate resize mouse
     pointer when the mouse moves over near the edges of a given container.
     @private
     @param  element     object: Element in which the mouse is moving in.
     @param  event       object: Mousemove DOM event object
     @param  borderWidth [number]: The thickness of the resize border.
                         If this value is not specified, 5 is used.
     @return number: An index in the RESIZE_CURSORS array identifying
             the appropriate the CSS resize cursor.
     *******************************************************************/
    getNearestEdge: function( element, event, borderWidth )
    {
        var mouse = Raster.getInputState( event );
        var point = Raster.pointToElement( element, mouse.x, mouse.y);
        var box = Raster.getBounds( element );

        borderWidth = borderWidth || 5;

        if ( point.x > (box.width-borderWidth) )
        {
            if ( point.y < borderWidth )
                return 2; // ne-resize
            else if ( point.y > (box.height-borderWidth) )
                return 4; // se-resize
            else
                return 3; // e-resize
        }
        else if ( point.x < borderWidth )
        {
            if ( point.y < borderWidth )
                return 0; // nw-resize
            else if ( point.y > (box.height-borderWidth) )
                return 6; // sw-resize
            else
                return 7; // e-resize
        }
        else if ( point.y < borderWidth )
            return 1; // n-resize

        else if ( point.y > (box.height-borderWidth) )
            return 5; // s-resize;

        return 8;
    },


    /*******************************************************************
     Determine which side of the container the mouse pointer is closer
     to. This function is useful for showing the appropriate resize
     mouse pointer when the mouse moves over near the edges of a given
     container.
     
     @private
     @param  element     object: Element in which the mouse is moving in.
     @param  event       object: Mousemove DOM event object
     @param  borderWidth [number]: The thickness of the resize border.
                         If this value is not specified, 1/3 the width
                         of the element is used.
     @return number: An index in the RESIZE_CURSORS array identifying
             the appropriate the CSS resize cursor.
     *******************************************************************/
    getNearestEdgeH: function( element, event, borderWidth )
    {
        var mouse = Raster.getInputState( event );
        var point = Raster.pointToElement( element, mouse.x, mouse.y );
        var box = Raster.getBounds( element );

        borderWidth = borderWidth || box.width/3;

        if ( point.x  >   box.width-borderWidth )
           return 3; // e-resize

        else if ( point.x  <  borderWidth )
           return 7; // w-resize

        return 8;
    },


    /*******************************************************************
     Determine which edge of the container the mouse pointer is closer
     to, top or bottom. This function is useful for showing the
     appropriate resize mouse pointer when the mouse moves over near the
     edges of a given container.

     @private
     @param  element     object: Element in which the mouse is moving in.
     @param  event       object: Mousemove DOM event object
     @param  borderWidth [number]: The thickness of the resize border.
                         If this value is not specified, 1/3 the height
                         of the element is used.
     @return number: An index in the RESIZE_CURSORS array identifying
             the appropriate the CSS resize cursor.
     *******************************************************************/
    getNearestEdgeV: function( element, event, borderWidth )
    {
        var mouse = Raster.getInputState( event );
        var point = Raster.pointToElement( element, mouse.x, mouse.y);
        var box = Raster.getBounds( element );

        borderWidth = borderWidth || box.height/3;

        if ( point.y  >   box.height-borderWidth )
           return 5; // s-resize

        else if ( point.y  <  borderWidth )
           return 1; // n-resize

        return 8;
    }

};
 

 

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
 

/*****************************************************************************
 GLYPHS: Symbols used in raster controls.
 @private
 *****************************************************************************/
var GLYPHS = (function() {

    /** Factory function used to build instances of the IID_SPRITEINFO interface. */
    function rect(_x, _y, _w, _h) { return {x:_x, y:_y, w:_w, h:_h, IID_SPRITEINFO:true, filename:'css:_glyphs.gif' }; };

    // return sprite info constants
    return {
        DROP_DOWN:                               rect(0, 0, 7, 4),
        DROP_DOWN2:                              rect(9, 0, 7, 6),
        DROP_DOWN3:                              rect(18, 0, 4, 7),
        CHEVRON_DOWN:                            rect(24, 0, 5, 8),
        CHEVRON_RIGHT:                           rect(31, 0, 8, 5),

        ARROW_UP:                                rect(41, 0, 12, 6),
        ARROW_DOWN:                              rect(55, 0, 12, 6),
        ARROW_RIGHT:                             rect(69, 0, 6, 12),
        ARROW_LEFT:                              rect(77, 0, 6, 12),

        TREE_VERT:                               rect(85, 0, 1, 19),
        TREE_DASH:                               rect(88, 0, 9, 1),
        TREE_MINUS:                              rect(99, 0, 16, 11),
        TREE_PLUS:                               rect(117, 0, 16, 11),

        TREE_MINUS2:                             rect(135, 0, 16, 11),
        TREE_PLUS2:                              rect(153, 0, 16, 11),
        TREE_VSHIM:                              rect(171, 0, 1, 20),

        SORT_ASC:                                rect(174, 0, 11, 6),
        SORT_DESC:                               rect(187, 0, 11, 6)
    };
})(); /* end sprite generated stub */




/*****************************************************************************
 Collection of Mouse pointer sprites. These can be used in drag and drop
 operations to decorate the mouse pointer. For example:
 <pre code>
    ...

    RasterMouse.setCursor( <b>CURSORS.DRAG</b> );
    RasterMouse.startDrag( event, myDragInfo, myHandler);

 </pre>
 <h2>CURSORS Constants</h2>
 &nbsp; &nbsp; &nbsp; <img src="images/sprite-cursors.gif">

 @see  RasterMouse.setCursor()
 @static
 *****************************************************************************/
var CURSORS = (function() {
    /** Factory function used to build instances of the IID_SPRITEINFO interface. */
    function rect(_x, _y, _w, _h) { return {x:_x, y:_y, w:_w, h:_h, IID_SPRITEINFO:true, filename:'img:_cursors.gif' }; };
    // return sprite info constants
    return {
        ADD:                                     rect(0, 0, 11, 11),
        DRAG:                                    rect(13, 0, 13, 9),
        LINK:                                    rect(28, 0, 16, 7),
        CONNECTING:                              rect(46, 0, 12, 12),
        CANCEL:                                  rect(60, 0, 14, 14),
        LOCKED:                                  rect(76, 0, 8, 10),
        MOVE:                                    rect(86, 0, 10, 13),
        COPY:                                    rect(98, 0, 14, 12),
        DELETE:                                  rect(114, 0, 12, 12),
        MOVE_V:                                  rect(128, 0, 9, 15),
        MOVE_H:                                  rect(139, 0, 15, 9)
    };
})(); /* end sprite generated stub */



/*****************************************************************************
 ICONS16 is a static object containing a collection of sprite constants. Each
 sprite constant represents a 16x16 icon. These sprites can be used anywhere
 the IID_SPRITEINFO type is accepted, for example:
 <pre code>
    var mytree = new Tree( "id", <b>ICONS16.COMPUTER</b>, "My Computer");

    mytree.add( <b>ICONS16.BOOK_OPEN</b>, "Help Topics";
    mytree.add( <b>ICONS16.CALENDAR</b>, "Add Event");

    ...
 </pre>
 <h2>LICENSE</h2>
 The ICONS16 sprite is based in a subset of the <b>Silk Web Icon Set v1.3</b>
 by <b>Mark James</b>. These icons are available under the
 <a href="http://creativecommons.org/licenses/by/2.5/" target="_blank">Creative Commons Attribution License 2.5</a>
 which lets you distribute, remix, tweak, and build upon these icons,
 even commercially, provided that you credit Mark James within a readme
 file or equivalent documentation for the software which uses the icons.
 For more information in the <b>Silk Web Icon Set</b> visit
 <a href="http://www.famfamfam.com/lab/icons/silk/" target="_blank">www.famfamfam.com</a>.

 <h2>ICONS16 Constants</h2>
 <p align="center">
   <img src="images/sprite-icons16.png" style="border:1px solid #888">
 </p>
 @static
 *****************************************************************************/
var ICONS16 = (function() {
    var f = 'img:_icons16.' + (Raster.isIE6 ? 'gif' : 'png'); //IE6 slows down to a crawl using png  
    /** Factory function used to build instances of the IID_SPRITEINFO interface. */
    function rect(_x, _y, _w, _h) { return {x:_x, y:_y, w:16, h:16, IID_SPRITEINFO:true, filename: f }; };

    // return sprite info constants
    return {
        ACCEPT:                                   rect(0, 0),
        ADD:                                      rect(18, 0),
        APPLICATION:                              rect(36, 0),
        APPLICATION_ADD:                          rect(54, 0),
        APPLICATION_CASCADE:                      rect(72, 0),
        APPLICATION_EDIT:                         rect(90, 0),
        APPLICATION_ERROR:                        rect(108, 0),
        APPLICATION_FORM:                         rect(126, 0),
        APPLICATION_FORM_ADD:                     rect(144, 0),
        APPLICATION_FORM_EDIT:                    rect(162, 0),
        APPLICATION_GET:                          rect(180, 0),
        APPLICATION_KEY:                          rect(198, 0),
        APPLICATION_LIGHTNING:                    rect(216, 0),
        APPLICATION_LINK:                         rect(234, 0),
        APPLICATION_OSX:                          rect(252, 0),
        APPLICATION_OSX_TERMINAL:                 rect(270, 0),
        APPLICATION_PUT:                          rect(0, 18),
        APPLICATION_SIDE_BOXES:                   rect(18, 18),
        APPLICATION_SIDE_CONTRACT:                rect(36, 18),
        APPLICATION_SIDE_EXPAND:                  rect(54, 18),
        APPLICATION_SIDE_LIST:                    rect(72, 18),
        APPLICATION_SIDE_TREE:                    rect(90, 18),
        APPLICATION_SPLIT:                        rect(108, 18),
        APPLICATION_TILE_HORIZONTAL:              rect(126, 18),
        APPLICATION_TILE_VERTICAL:                rect(144, 18),
        APPLICATION_VIEW_COLUMNS:                 rect(162, 18),
        APPLICATION_VIEW_ICONS:                   rect(180, 18),
        APPLICATION_VIEW_LIST:                    rect(198, 18),
        APPLICATION_VIEW_TILE:                    rect(216, 18),
        APPLICATION_XP:                           rect(234, 18),
        APPLICATION_XP_TERMINAL:                  rect(252, 18),
        ARROW_REFRESH_SMALL:                      rect(270, 18),
        ARROW_ROTATE_CLOCKWISE:                   rect(0, 36),
        ARROW_SWITCH:                             rect(18, 36),
        ASTERISK_YELLOW:                          rect(36, 36),
        ATTACH:                                   rect(54, 36),
        BASKET:                                   rect(72, 36),
        BASKET_ADD:                               rect(90, 36),
        BASKET_EDIT:                              rect(108, 36),
        BELL:                                     rect(126, 36),
        BELL_ADD:                                 rect(144, 36),
        BOOK:                                     rect(162, 36),
        BOOK_ADD:                                 rect(180, 36),
        BOOK_ADDRESSES:                           rect(198, 36),
        BOOK_EDIT:                                rect(216, 36),
        BOOK_OPEN:                                rect(234, 36),
        BRICK:                                    rect(252, 36),
        BRICKS:                                   rect(270, 36),
        BUG:                                      rect(0, 54),
        BULLET_ARROW_DOWN:                        rect(18, 54),
        BULLET_ARROW_UP:                          rect(36, 54),
        BULLET_DISK:                              rect(54, 54),
        BULLET_ERROR:                             rect(72, 54),
        BULLET_FEED:                              rect(90, 54),
        BULLET_GO:                                rect(108, 54),
        BULLET_PICTURE:                           rect(126, 54),
        BULLET_STAR:                              rect(144, 54),
        CALCULATOR:                               rect(162, 54),
        CALCULATOR_ADD:                           rect(180, 54),
        CALCULATOR_EDIT:                          rect(198, 54),
        CALENDAR:                                 rect(216, 54),
        CALENDAR_VIEW_DAY:                        rect(234, 54),
        CALENDAR_VIEW_MONTH:                      rect(252, 54),
        CAMERA:                                   rect(270, 54),
        CANCEL:                                   rect(0, 72),
        CAR:                                      rect(18, 72),
        CART:                                     rect(36, 72),
        CD:                                       rect(54, 72),
        CHART_BAR:                                rect(72, 72),
        CHART_BAR_ADD:                            rect(90, 72),
        CHART_BAR_EDIT:                           rect(108, 72),
        CHART_ORGANISATION:                       rect(126, 72),
        CLOCK:                                    rect(144, 72),
        CLOCK_ADD:                                rect(162, 72),
        COG:                                      rect(180, 72),
        COG_ADD:                                  rect(198, 72),
        COG_EDIT:                                 rect(216, 72),
        COLOR_SWATCH:                             rect(234, 72),
        COLOR_WHEEL:                              rect(252, 72),
        COMMENT:                                  rect(270, 72),
        COMMENT_ADD:                              rect(0, 90),
        COMMENT_EDIT:                             rect(18, 90),
        COMMENTS:                                 rect(36, 90),
        COMPUTER:                                 rect(54, 90),
        CONNECT:                                  rect(72, 90),
        CONTROL_EJECT:                            rect(90, 90),
        CONTROL_END:                              rect(108, 90),
        CONTROL_EQUALIZER:                        rect(126, 90),
        CONTROL_FASTFORWARD:                      rect(144, 90),
        CONTROL_PAUSE:                            rect(162, 90),
        CONTROL_PLAY:                             rect(180, 90),
        CONTROL_REPEAT:                           rect(198, 90),
        CONTROL_REWIND:                           rect(216, 90),
        CONTROL_START:                            rect(234, 90),
        CONTROL_STOP:                             rect(252, 90),
        CROSS:                                    rect(270, 90),
        CUP:                                      rect(0, 108),
        CURSOR:                                   rect(18, 108),
        CUT:                                      rect(36, 108),
        DATABASE:                                 rect(54, 108),
        DATABASE_ADD:                             rect(72, 108),
        DATABASE_EDIT:                            rect(90, 108),
        DATABASE_TABLE:                           rect(108, 108),
        DATE:                                     rect(126, 108),
        DELETE:                                   rect(144, 108),
        DISCONNECT:                               rect(162, 108),
        DISK:                                     rect(180, 108),
        DISK_MULTIPLE:                            rect(198, 108),
        DRIVE:                                    rect(216, 108),
        DRIVE_CD:                                 rect(234, 108),
        DVD:                                      rect(252, 108),
        EMAIL:                                    rect(270, 108),
        EMAIL_ATTACH:                             rect(0, 126),
        EMAIL_EDIT:                               rect(18, 126),
        EMAIL_OPEN:                               rect(36, 126),
        EMOTICON_EVILGRIN:                        rect(54, 126),
        EMOTICON_GRIN:                            rect(72, 126),
        EMOTICON_HAPPY:                           rect(90, 126),
        EMOTICON_SMILE:                           rect(108, 126),
        EMOTICON_SURPRISED:                       rect(126, 126),
        EMOTICON_TONGUE:                          rect(144, 126),
        EMOTICON_UNHAPPY:                         rect(162, 126),
        EMOTICON_WINK:                            rect(180, 126),
        ERROR:                                    rect(198, 126),
        EXCLAMATION:                              rect(216, 126),
        EYE:                                      rect(234, 126),
        FEED:                                     rect(252, 126),
        FILM:                                     rect(270, 126),
        FIND:                                     rect(0, 144),
        FLAG_GREEN:                               rect(18, 144),
        FLAG_RED:                                 rect(36, 144),
        FLAG_YELLOW:                              rect(54, 144),
        FOLDER:                                   rect(72, 144),
        FOLDER_ADD:                               rect(90, 144),
        FOLDER_PAGE:                              rect(108, 144),
        FONT:                                     rect(126, 144),
        FONT_ADD:                                 rect(144, 144),
        GROUP:                                    rect(162, 144),
        GROUP_ADD:                                rect(180, 144),
        HEART:                                    rect(198, 144),
        HELP:                                     rect(216, 144),
        HOURGLASS:                                rect(234, 144),
        HOUSE:                                    rect(252, 144),
        IMAGE:                                    rect(270, 144),
        IMAGE_ADD:                                rect(0, 162),
        IMAGES:                                   rect(18, 162),
        INFORMATION:                              rect(36, 162),
        KEY:                                      rect(54, 162),
        KEY_ADD:                                  rect(72, 162),
        KEYBOARD:                                 rect(90, 162),
        LAYERS:                                   rect(108, 162),
        LAYOUT:                                   rect(126, 162),
        LAYOUT_ADD:                               rect(144, 162),
        LIGHTBULB:                                rect(162, 162),
        LIGHTBULB_OFF:                            rect(180, 162),
        LIGHTNING:                                rect(198, 162),
        LIGHTNING_ADD:                            rect(216, 162),
        LINK:                                     rect(234, 162),
        LINK_BREAK:                               rect(252, 162),
        LOCK:                                     rect(270, 162),
        LOCK_OPEN:                                rect(0, 180),
        LORRY:                                    rect(18, 180),
        MAGIFIER_ZOOM_OUT:                        rect(36, 180),
        MAGNIFIER:                                rect(54, 180),
        MAGNIFIER_ZOOM_IN:                        rect(72, 180),
        MAP:                                      rect(90, 180),
        MAP_ADD:                                  rect(108, 180),
        MONEY:                                    rect(126, 180),
        MONEY_DOLLAR:                             rect(144, 180),
        MONITOR:                                  rect(162, 180),
        MONITOR_ADD:                              rect(180, 180),
        MOUSE:                                    rect(198, 180),
        MUSIC:                                    rect(216, 180),
        NEW:                                      rect(234, 180),
        NEWSPAPER:                                rect(252, 180),
        NOTE:                                     rect(270, 180),
        NOTE_ADD:                                 rect(0, 198),
        OVERLAYS:                                 rect(18, 198),
        PACKAGE:                                  rect(36, 198),
        PAGE:                                     rect(54, 198),
        PAGE_ADD:                                 rect(72, 198),
        PAGE_ATTACH:                              rect(90, 198),
        PAGE_COPY:                                rect(108, 198),
        PAGE_EDIT:                                rect(126, 198),
        PAGE_EXCEL:                               rect(144, 198),
        PAGE_PASTE:                               rect(162, 198),
        PAGE_RED:                                 rect(180, 198),
        PAGE_WHITE:                               rect(198, 198),
        PAGE_WHITE_ACROBAT:                       rect(216, 198),
        PAGE_WHITE_OFFICE:                        rect(234, 198),
        PAGE_WHITE_PAINTBRUSH:                    rect(252, 198),
        PAGE_WHITE_PASTE:                         rect(270, 198),
        PAGE_WHITE_PICTURE:                       rect(0, 216),
        PAGE_WHITE_POWERPOINT:                    rect(18, 216),
        PAGE_WHITE_PUT:                           rect(36, 216),
        PAGE_WHITE_STACK:                         rect(54, 216),
        PAGE_WHITE_TEXT:                          rect(72, 216),
        PAGE_WHITE_WORD:                          rect(90, 216),
        PAGE_WHITE_WORLD:                         rect(108, 216),
        PAGE_WHITE_WRENCH:                        rect(126, 216),
        PAGE_WHITE_ZIP:                           rect(144, 216),
        PAGE_WORD:                                rect(162, 216),
        PAGE_WORLD:                               rect(180, 216),
        PAINTBRUSH:                               rect(198, 216),
        PAINTCAN:                                 rect(216, 216),
        PALETTE:                                  rect(234, 216),
        PASTE_PLAIN:                              rect(252, 216),
        PENCIL:                                   rect(270, 216),
        PHONE:                                    rect(0, 234),
        PHONE_SOUND:                              rect(18, 234),
        PHOTOS:                                   rect(36, 234),
        PICTURE:                                  rect(54, 234),
        PICTURE_EMPTY:                            rect(72, 234),
        PICTURES:                                 rect(90, 234),
        PLUGIN:                                   rect(108, 234),
        PLUGIN_DISABLED:                          rect(126, 234),
        PRINTER:                                  rect(144, 234),
        PRINTER_ADD:                              rect(162, 234),
        REPORT:                                   rect(180, 234),
        RESULTSET_FIRST:                          rect(198, 234),
        RESULTSET_LAST:                           rect(216, 234),
        RESULTSET_NEXT:                           rect(234, 234),
        RESULTSET_PREVIOUS:                       rect(252, 234),
        SCRIPT:                                   rect(270, 234),
        SCRIPT_ADD:                               rect(0, 252),
        SCRIPT_EDIT:                              rect(18, 252),
        SERVER:                                   rect(36, 252),
        SERVER_ADD:                               rect(54, 252),
        SERVER_EDIT:                              rect(72, 252),
        SERVER_ERROR:                             rect(90, 252),
        SERVER_KEY:                               rect(108, 252),
        SHADING:                                  rect(126, 252),
        SHAPE_ALIGN_BOTTOM:                       rect(144, 252),
        SHAPE_ALIGN_CENTER:                       rect(162, 252),
        SHAPE_ALIGN_LEFT:                         rect(180, 252),
        SHAPE_ALIGN_MIDDLE:                       rect(198, 252),
        SHAPE_ALIGN_RIGHT:                        rect(216, 252),
        SHAPE_ALIGN_TOP:                          rect(234, 252),
        SHAPE_FLIP_HORIZONTAL:                    rect(252, 252),
        SHAPE_FLIP_VERTICAL:                      rect(270, 252),
        SHAPE_GROUP:                              rect(0, 270),
        SHAPE_HANDLES:                            rect(18, 270),
        SHAPE_MOVE_BACK:                          rect(36, 270),
        SHAPE_MOVE_BACKWARDS:                     rect(54, 270),
        SHAPE_MOVE_FORWARDS:                      rect(72, 270),
        SHAPE_MOVE_FRONT:                         rect(90, 270),
        SHAPE_ROTATE_ANTICLOCKWISE:               rect(108, 270),
        SHAPE_ROTATE_CLOCKWISE:                   rect(126, 270),
        SHAPE_SQUARE:                             rect(144, 270),
        SHAPE_SQUARE_EDIT:                        rect(162, 270),
        SHAPE_UNGROUP:                            rect(180, 270),
        SHIELD:                                   rect(198, 270),
        SOUND:                                    rect(216, 270),
        SOUND_LOW:                                rect(234, 270),
        SOUND_MUTE:                               rect(252, 270),
        SOUND_NONE:                               rect(270, 270),
        SPELLCHECK:                               rect(0, 288),
        STAR:                                     rect(18, 288),
        STOP:                                     rect(36, 288),
        STYLE:                                    rect(54, 288),
        SUM:                                      rect(72, 288),
        TABLE:                                    rect(90, 288),
        TABLE_ADD:                                rect(108, 288),
        TABLE_EDIT:                               rect(126, 288),
        TABLE_MULTIPLE:                           rect(144, 288),
        TAG:                                      rect(162, 288),
        TAG_BLUE:                                 rect(180, 288),
        TAG_GREEN:                                rect(198, 288),
        TAG_ORANGE:                               rect(216, 288),
        TAG_RED:                                  rect(234, 288),
        TELEPHONE:                                rect(252, 288),
        TELEVISION:                               rect(270, 288),
        TEXT_ALIGN_CENTER:                        rect(0, 306),
        TEXT_ALIGN_JUSTIFY:                       rect(18, 306),
        TEXT_ALIGN_LEFT:                          rect(36, 306),
        TEXT_ALIGN_RIGHT:                         rect(54, 306),
        TEXT_ALLCAPS:                             rect(72, 306),
        TEXT_BOLD:                                rect(90, 306),
        TEXT_COLUMNS:                             rect(108, 306),
        TEXT_DROPCAPS:                            rect(126, 306),
        TEXT_HORIZONTALRULE:                      rect(144, 306),
        TEXT_INDENT:                              rect(162, 306),
        TEXT_INDENT_REMOVE:                       rect(180, 306),
        TEXT_ITALIC:                              rect(198, 306),
        TEXT_LETTER_OMEGA:                        rect(216, 306),
        TEXT_LETTERSPACING:                       rect(234, 306),
        TEXT_LINESPACING:                         rect(252, 306),
        TEXT_LIST_BULLETS:                        rect(270, 306),
        TEXT_LIST_NUMBERS:                        rect(0, 324),
        TEXT_SMALLCAPS:                           rect(18, 324),
        TEXT_STRIKETHROUGH:                       rect(36, 324),
        TEXT_SUBSCRIPT:                           rect(54, 324),
        TEXT_SUPERSCRIPT:                         rect(72, 324),
        TEXT_UNDERLINE:                           rect(90, 324),
        TEXTFIELD_KEY:                            rect(108, 324),
        TICK:                                     rect(126, 324),
        TIME:                                     rect(144, 324),
        TIME_ADD:                                 rect(162, 324),
        USER:                                     rect(180, 324),
        USER_ADD:                                 rect(198, 324),
        USER_EDIT:                                rect(216, 324),
        USER_GREEN:                               rect(234, 324),
        USER_RED:                                 rect(252, 324),
        USER_SUIT:                                rect(270, 324),
        VCARD:                                    rect(0, 342),
        VCARD_ADD:                                rect(18, 342),
        WAND:                                     rect(36, 342),
        WORLD:                                    rect(54, 342),
        WORLD_ADD:                                rect(72, 342),
        WORLD_EDIT:                               rect(90, 342),
        WORLD_LINK:                               rect(108, 342),
        WRENCH:                                   rect(126, 342),
        ZOOM:                                     rect(144, 342)
    };
})(); /* end sprite generated stub */


/*****************************************************************************
 ICONS32 is a static object containing a collection of sprite constants. Each
 sprite constant represents a 32x32 icon. These sprites can be used anywhere
 the IID_SPRITEINFO type is accepted, for example:
 <pre code>
    var list = new RasterList( "listDiv", "grid" );

    list.add( null, ICONS32.GRAPHICS, null, "Customize" );
    list.add( null, ICONS32.ADDRESS_BOOK, null, "Addresses" );
    list.add( null, ICONS32.AUDIO_VOL_HIGH, null, "Sounds" );
    list.add( null, ICONS32.ACCESSORIES, null, "Accessories" );
    ...
 </pre>
 <h2>LICENSE</h2>
 The ICONS32 sprite is based in a subset of the <b>Tango Base Icon Library v0.8.90</b>
 by the <b>Tango Desktop Project</b>
 (<a href="http://tango.freedesktop.org" target="_blank">http://tango.freedesktop.org</a>).
 The Tango Base Icon Library is released to the Public Domain. The authors
 ask that you please attribute the Tango Desktop Project in the
 credits or documentation for the software that use these icons.

 <h2>ICONS32 Constants</h2>
 <p align="center">
   <img src="images/sprite-icons32.png" style="border:1px solid #888">
 </p>
 @static
 *****************************************************************************/
var ICONS32 = (function() {
    // Factory function used to build instances of the IID_SPRITEINFO interface. */
    function rect(_x, _y, _w, _h) { return {x:_x, y:_y, w:32, h:32, IID_SPRITEINFO:true, filename:'img:_icons32.png' }; };

    // return sprite info constants
    return {
    ACCESSORIES:                              rect(0, 0),
    ADDRESS_BOOK:                             rect(34, 0),
    AUDIO:                                    rect(68, 0),
    AUDIO_MUTED:                              rect(102, 0),
    AUDIO_VOL_HIGH:                           rect(136, 0),
    AUDIO_VOL_LOW:                            rect(170, 0),
    BATTERY:                                  rect(204, 0),
    BATTERY_CAUTION:                          rect(238, 0),
    CALENDAR:                                 rect(0, 34),
    CAMERA_PHOTO:                             rect(34, 34),
    CD:                                       rect(68, 34),
    CD_ROM:                                   rect(102, 34),
    CHAT:                                     rect(136, 34),
    COMPUTER:                                 rect(170, 34),
    DIALOG_ERROR:                             rect(204, 34),
    DIALOG_FAVORITE:                          rect(238, 34),
    DIALOG_IMPORTANT:                         rect(0, 68),
    DIALOG_READONLY:                          rect(34, 68),
    DIALOG_SYSTEM:                            rect(68, 68),
    DIALOG_TIP:                               rect(102, 68),
    DIALOG_UNREADABLE:                        rect(136, 68),
    DIALOG_WARNING:                           rect(170, 68),
    DISPLAY:                                  rect(204, 68),
    DOCUMENT:                                 rect(238, 68),
    EDIT_COPY:                                rect(0, 102),
    EDIT_CUT:                                 rect(34, 102),
    EDIT_FIND:                                rect(68, 102),
    EDIT_PASTE:                               rect(102, 102),
    EDIT_REDO:                                rect(136, 102),
    EDIT_UNDO:                                rect(170, 102),
    FLOPPY:                                   rect(204, 102),
    FOLDER:                                   rect(238, 102),
    GLOBE:                                    rect(0, 136),
    GO_DOWN:                                  rect(34, 136),
    GO_HOME:                                  rect(68, 136),
    GO_NEXT:                                  rect(102, 136),
    GO_PREVIOUS:                              rect(136, 136),
    GO_UP:                                    rect(170, 136),
    GRAPHICS:                                 rect(204, 136),
    HARDDISK:                                 rect(238, 136),
    HELP:                                     rect(0, 170),
    HTML:                                     rect(34, 170),
    IMAGE:                                    rect(68, 170),
    INTERNET:                                 rect(102, 170),
    MAIL:                                     rect(136, 170),
    MAIL_ATTACHMENT:                          rect(170, 170),
    MAIL_FORWARD:                             rect(204, 170),
    MAIL_JUNK:                                rect(238, 170),
    MAIL_NEW:                                 rect(0, 204),
    MAIL_REPLY:                               rect(34, 204),
    MAIL_REPLY_ALL:                           rect(68, 204),
    MOUSE:                                    rect(102, 204),
    NETWORK:                                  rect(136, 204),
    NETWORK_OFFLINE:                          rect(170, 204),
    OFFICE:                                   rect(204, 204),
    PACKAGE:                                  rect(238, 204),
    PRESENTATION:                             rect(0, 238),
    PRINTER:                                  rect(34, 238),
    PROPERTIES:                               rect(68, 238),
    REFRESH:                                  rect(102, 238),
    SEARCH:                                   rect(136, 238),
    SPREADSHEET:                              rect(170, 238),
    STOP:                                     rect(204, 238),
    SYSTEM:                                   rect(238, 238),
    TERMINAL:                                 rect(0, 272),
    TEXT:                                     rect(34, 272),
    TOOLS:                                    rect(68, 272),
    TRASH:                                    rect(102, 272),
    USERS:                                    rect(136, 272),
    VIDEO:                                    rect(170, 272),
    WEATHER:                                  rect(204, 272),
    WINDOWS:                                  rect(238, 272)
    };
})(); /* end sprite generated stub */



/*****************************************************************************
  CSS Sprite information (auto-generated stub)
 ****************************************************************************
        TOOLBK:                                  rect(0, 0, 344, 83),

        MENU1:                                   rect(0, 85, 344, 24),
        MENU2:                                   rect(0, 111, 344, 24),
        MENU3:                                   rect(0, 137, 344, 24),
        MENU4:                                   rect(0, 163, 344, 24),

        TOOL1:                                   rect(0, 189, 344, 40),
        TOOL2:                                   rect(0, 231, 344, 40),
        TOOL3:                                   rect(0, 273, 344, 40),
        TOOL4:                                   rect(0, 315, 344, 40),

        TAB1:                                    rect(0, 357, 344, 67),
        TAB2:                                    rect(0, 426, 344, 67),
        TAB3:                                    rect(0, 495, 344, 67),

        ICON_ON:                                 rect(0, 564, 23, 22),

        TABBK:                                   rect(0, 588, 344, 66),

        TREEITEM:                                rect(0, 656, 344, 20),

        XTOOL1:                                  rect(0, 678, 344, 54),
        XTOOL2:                                  rect(0, 734, 344, 54),
        XTOOL3:                                  rect(0, 790, 344, 54),
        XTOOL4:                                  rect(0, 846, 344, 54)

       LIST_SEL:                                rect(0, 968, 344, 31)
 
 ------

        TITLEBAR_MIN:                            this.rect(0, 0, 16, 15),
        TITLEBAR_WIN:                            this.rect(18, 0, 16, 15),
        TITLEBAR_MAX:                            this.rect(36, 0, 16, 15),
        TITLEBAR_CLOSE:                          this.rect(54, 0, 16, 15),

        TITLEBAR_MIN1:                           this.rect(72, 0, 16, 15),
        TITLEBAR_WIN1:                           this.rect(90, 0, 16, 15),
        TITLEBAR_MAX1:                           this.rect(108, 0, 16, 15),
        TITLEBAR_CLOSE1:                         this.rect(126, 0, 16, 15),

        TITLEBAR_MIN2:                           this.rect(144, 0, 16, 15),
        TITLEBAR_WIN2:                           this.rect(162, 0, 16, 15),
        TITLEBAR_MAX2:                           this.rect(180, 0, 16, 15),
        TITLEBAR_CLOSE2:                         this.rect(198, 0, 16, 15),



        LIST_SEL1:                               rect(0, 0, 73, 196),
        LIST_SEL2:                               rect(75, 0, 258, 196)

        HEADER_BK:                               rect(0, 902, 344, 31),
        HEADER_BK2:                              rect(0, 935, 344, 31)

*/





















