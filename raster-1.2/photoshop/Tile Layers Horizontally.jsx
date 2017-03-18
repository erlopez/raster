/******************************************************************************
    Raster Phototoshop files and scripts.
    http://www.lopezworks.info/raster

    Copyright (C) 2010 Edwin R. Lopez

    This source code is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation LGPL v2.1
    (http://www.gnu.org/licenses/).

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
    02110-1301  USA
 *****************************************************************************/
/*
<javascriptresource>
	<name>CSS Tile Layers Horizontally</name>
	<type>filter</type>
	<category>a</category>
	<about>Creates CSS sprite images from named layers. 
	
		Layer names ending with ".h" are included in the horizontal tiling.  
		Layer names ending with ".v" are included in the vertical tiling. 

		Following the ".h" or ".v", a layer name may optionally add a string in the format of "(w,h,ofsX,ofsY)".
		These arguments overwrite and increase the layer's default width and height. The offset values: offsetX and offsetY,
		can be used to fine-tune the upper-corner position of the image inside the given width and height.
		If the width or height is set to zero, the default layer width or height is used instead, thus in order
		to specify only offsets but leave the width and height unaffected you could write it like this
		"(0,0,5,2)". If all you need is to specify the height, it would be like this "(0,16)"; or only the width: "(16)".
		Spaces around commas and parenthesis is ignored, therefore a layer name like this: "mylayer.h (0, 16, 0  , 5 ) "
		is valid. Note you don't need to specify all four arguments, but they need to be in the order:
		width, height, offsetX, and offsetY.

		Copyright (c) 2010 Edwin R. Lopez
	</about>
	<eventid>0901f240-ed85-11df-98cf-0800200c9a66</eventid>
	<enableinfo>true</enableinfo>
</javascriptresource>
*/
////////////////////////////////////////////////////////////////////////////////
// Enable double clicking from  Windows Explorer
//
#target photoshop

////////////////////////////////////////////////////////////////////////////////
// Adjust the following constant to indicate how layers are going to be tiled.
// TILE_V=true to tile vertically, TILE_V=false to tile horizontally.
// Layer names ending with ".h" are included in the horizontal tiling.
// Layer names ending with ".v" are included in the vertical tiling.
var TILE_V = false;
var PADDING = 2; //Space between tiles
 
 
////////////////////////////////////////////////
// Start Processing
//
main();

//$.writeln( 'test 123' );  //log text to the console


////////////////////////////////////////////////
// Main Program
//
function main() 
{
	var src = activeDocument;
	var cssBuf = new Array();
	var jsBuf = new Array();
	var myLayers = new Array();
	var width = 0;
	var height = 0;
	var maxWidth = 0;
	var maxHeight = 0;
	
	
	//a. Collect all layers with name matching *.h or *.v
	for ( var i = 0; i < src.artLayers.length; i++ )  //scan layers at root level
	{			
		var layer = src.artLayers[i];
		if ( (TILE_V && /.*\.v([, \(\)\d]+)?$/i.test(layer.name)) || (!TILE_V && /.*\.h([, \(\)\d]+)?$/i.test(layer.name)) )
			myLayers.push( layer );
	}

	for ( var j = 0; j < src.layerSets.length; j++ ) //scan layers in folders
		for ( var i = 0; i < src.layerSets[j].artLayers.length; i++ ) 
		{			
			var layer = src.layerSets[j].artLayers[i];
			if ( (TILE_V && /.*\.v([, \(\)\d]+)?$/i.test(layer.name)) || (!TILE_V && /.*\.h([, \(\)\d]+)?$/i.test(layer.name)) )
				myLayers.push( layer );
		}
	
	// Exit if no layers were found
	if ( myLayers.length==0 )
	{
		alert("No " +( TILE_V ? ".v" : ".h" )+ " layers found in current document, exiting now...");
		return;
	}		
	
	
	//b. First time around, gather the rough width and height of the new document
	//   This is not accurate because layer with effects FX appears bigger than they really are
	for ( var i = 0; i < myLayers.length; i++ ) 
	{			
		var layer = myLayers[i];
		var layerParams = parseName( layer.name );

		var w = Math.max( layer.bounds[2].value - layer.bounds[0].value, layerParams.w );
		var h = Math.max( layer.bounds[3].value - layer.bounds[1].value, layerParams.h );
		width += w;
		height += h;
		maxWidth = Math.max( maxWidth, w);
		maxHeight = Math.max( maxHeight, h);				
	}


	//c. Create document to store new tiles
	height += myLayers.length * PADDING;
	width  += myLayers.length * PADDING;	
	var doc;
	if ( TILE_V )
		doc = documents.add( maxWidth, height );	
	else	
		doc = documents.add( width, maxHeight );	
		
	doc.artLayers.add();            //add transparent layer
	doc.backgroundLayer.remove();   //remove white bg


	//d. Loop again and do the copy and paste
	var ofs = 0;            //Amount that increments down (or right), as we paste images in the final doc
	
	maxWidth = 0;           //Used in final cropping
	maxHeight = 0;
	
	for ( var i = 0; i < myLayers.length; i++ ) 
	{			
		var layer = myLayers[i];
		var x1 = layer.bounds[0].value;
		var y1 = layer.bounds[1].value;
		var x2 = layer.bounds[2].value;
		var y2 = layer.bounds[3].value;
						
		activeDocument = src;
		src.selection.select( [ [x1,y1], [x2,y1], [x2,y2], [x1,y2] ] );
		src.selection.copy(true);
		
		activeDocument = doc;
		doc.selection.selectAll();
		var tmplayer = doc.paste(true);      //tmplayer is pasted w/o effects FX, thus its 'bounds' are accurate

		//move tmp layer to origin (0,0)
		tmplayer.translate( -tmplayer.bounds[0].value, -tmplayer.bounds[1].value ); 

		var layerParams = parseName( layer.name );
		var name = layerParams.name.replace( /\.[vh]$/i, "" );
		name = name + ":" + mkstring (" ", 40 - name.length ); //evenly space up all property values
	
		var w = Math.max( tmplayer.bounds[2].value - tmplayer.bounds[0].value, layerParams.w );
		var h = Math.max( tmplayer.bounds[3].value - tmplayer.bounds[1].value, layerParams.h );
		maxWidth = Math.max( maxWidth, w);
		maxHeight = Math.max( maxHeight, h);				

		//then move it to its merge down position
		if ( TILE_V )
		{
			jsBuf.push("        " + name.toUpperCase() + "rect(0, " + ofs + ", " + w + ", " + h + ")" );
			cssBuf.push("." + name.toUpperCase().replace(":","") + " { background: url(xxx) repeat-x 0 -" + ofs + "px }" );
			tmplayer.translate( layerParams.dx, ofs + layerParams.dy);  //apply any local offset specified in layer name
			ofs += h; //increment offset by tmplayer's height
		}
		else
		{
			jsBuf.push("        " + name.toUpperCase() + "rect(" + ofs + ", 0, " + w + ", " + h + ")" );
			cssBuf.push("." + name.toUpperCase().replace(":","") + " { background: url(xxx) repeat-y  -" + ofs + "px 0 }" );
			tmplayer.translate( ofs + layerParams.dx, layerParams.dy ); //apply any local offset specified in layer name
			ofs += w; //increment offset by tmplayer's width
		}
	
		//Add padding to offset
		ofs += PADDING;


		//merge the image into one layer
		doc.mergeVisibleLayers();				
	}

	//e. Crop/trim document's blank space
	if ( TILE_V )
		doc.crop( [0, 0, maxWidth, ofs] );
	else
		doc.crop( [0, 0, ofs, maxHeight] );



	//e. Compose scripts code
	var tmp = new Array();
	tmp.push("/*****************************************************************************");
	tmp.push("  CSS Sprite information (auto-generated stub)");
	tmp.push(" *****************************************************************************/");
	tmp.push( cssBuf.join("\r\n") );
	tmp.push("");
	tmp.push("");
	tmp.push("");

	tmp.push("/*****************************************************************************");
	tmp.push("  Sprite information (auto-generated stub)");
	tmp.push(" *****************************************************************************/");
	tmp.push("var SPRITEINFO = (function() {");
	tmp.push("    /** Factory function used to build instances of the IID_SPRITEINFO interface. */");
	tmp.push("    function rect(_x, _y, _w, _h) { return {x:_x, y:_y, w:_w, h:_h, IID_SPRITEINFO:true, filename:'xxxxxx.png' }; };");
	tmp.push("    // return sprite info constants");
	tmp.push("    return {");
	
	tmp.push( jsBuf.join(",\r\n") );
	
	tmp.push("    };");
	tmp.push("})(); /* end sprite generated stub */");
	
	
	
	// Display code in dialog
	showText( tmp.join("\r\n") );
}



/* Parses layer name info */
function parseName( layerName ) 
{
	if ( !/\([, \d]+\) *$/i.test(layerName)  )
		return {name:layerName, w:0, h:0, dx:0, dy:0 };
		
	var info = {};
	info.name = layerName.replace( / *\([, \d]+\) *$/, "" );
	
	var args = layerName.match( / *\([, \d]+\) *$/ )[0].match( /\d+/g );
	
	info.w =  parseInt( args[0] ) || 0;
	info.h =  parseInt( args[1] ) || 0;
	info.dx =  parseInt( args[2] ) || 0;
	info.dy =  parseInt( args[3] ) || 0;
	
	return info;
}



function mkstring( pattern, n)
{
	var buf = "";
	for( var i=0; i < n; i++)
		buf += pattern;
	
	return buf;
}


function showText( s ) 
{

	var w = new Window ("dialog", "The Script");
	w.orientation = 'row';
	w.margins=0;
	//w.preferredSize = [500,500];

	var e = w.add ("edittext", undefined, s, {multiline: true, scrolling: true});
	e.minimumSize.height = 500; 
	e.minimumSize.width = 500;
	
	w.center();
	w.show(); 


}


