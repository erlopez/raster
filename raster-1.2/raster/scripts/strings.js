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
