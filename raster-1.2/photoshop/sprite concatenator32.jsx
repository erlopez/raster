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
// enable double clicking from Windows Explorer
#target photoshop

var IMG_PER_ROW = 8;
var IMG_SIZE = 32; 
var PADDING = 2; //padding (spacing between images)

////////////////////////////////////////////////
// Pops open a dialog for the user to choose 
// the folder of documents to process
//
var fileList = File.openDialog ("CSS Sprite Maker v1.0", "Images: *.png;*.jpg;*.gif", true);
 
////////////////////////////////////////////////
// Open Folder of Images
//
main();

////////////////////////////////////////////////
// Process given the files
//
function main() 
{	
	if (fileList.length==0)
		return;
				
	// create document to accommodate all icons
	var IMG_SIZE_PAD = IMG_SIZE + PADDING;
	var h = Math.ceil( fileList.length / IMG_PER_ROW ) * IMG_SIZE_PAD;
	var w = IMG_PER_ROW * IMG_SIZE_PAD;			
	
	var doc = documents.add( w, h );	
	doc.artLayers.add();
	doc.backgroundLayer.remove();
 
	// Create buffer to store indexing information
	var buf = [];
	var html = [];
	var wrap = IMG_SIZE==16 ? "" : "<br>";
	
	// for each file, open, copy, and paste on the sprite image
	for ( var i = 0; i < fileList.length; i++ ) 
	{
			var x = (i % IMG_PER_ROW) * IMG_SIZE_PAD;
			var y = Math.floor( i / IMG_PER_ROW ) * IMG_SIZE_PAD;
			
			if ( fileList[i] instanceof File && /\.(png|gif|jpg)$/i.test( fileList[i].toString() )  ) 
			{
				var temp = open( fileList[i] );
				temp.selection.selectAll();
				temp.selection.copy(true);
				
				
				activeDocument = doc;
				doc.selection.select( [ [x,y], [x+IMG_SIZE,y], [x+IMG_SIZE,y+IMG_SIZE], [x,y+IMG_SIZE] ] );
				var layer = doc.paste( true );
				doc.mergeVisibleLayers();
				
				temp.close();


				var name = fileList[i].displayName.replace( /\....$/, "" ).replace(/-/g,"_");

				html.push("  <span class='item'><img src='" + fileList[i].displayName + "' align='absmiddle'> " + wrap + name.toUpperCase() + "</span>");
				name = name + ":" + mkstring (" ", 40 - name.length ); //evenly space up all property values
			
				buf.push("    " + name.toUpperCase() + " rect(" + x + ", " + y + ")" );
				//if (i==7) break;
			}
	}/*for*/

	// Save indexing indormation
	var out = File (fileList[0].parent.fsName + "\\_sprite-index.txt" );
	out.open("w");	 
	out.writeln("/*****************************************************************************");
	out.writeln("  Sprite information (auto-generated stub)");
	out.writeln(" *****************************************************************************/");
	out.writeln("var SPRITEINFO = (function() {");
	out.writeln("    // Factory function used to build instances of the IID_SPRITEINFO interface. */");
	out.writeln("    function rect(_x, _y) { return {x:_x, y:_y, w:" + IMG_SIZE + ", h:" + IMG_SIZE + ", IID_SPRITEINFO:true, filename:'xxxxxx.png' }; };");
	out.writeln("");
	out.writeln("    // return sprite info constants");
	out.writeln("    return {");
	
	out.writeln( buf.join(",\r\n") );
	
	out.writeln("    };");
	out.writeln("})(); /* end sprite generated stub */");	
	out.close();
		
	//save HTML image map
    out = File (fileList[0].parent.fsName + "\\_index.html" );
	out.open("w");	 
	out.writeln("<html><head><style>");
	if ( IMG_SIZE==16 )
		out.writeln("  .item { display:inline-block; width:160px;  margin-bottom:1px} ");
	else	
		out.writeln("  .item { display:inline-block; width:120px; text-align:center; } ");
		
	out.writeln("  body { font-family: 'Arial Narrow'; font-size:7.5pt; background:#fff;} ");
	out.writeln("</style></head><body>");
	out.writeln("<div style='width:500px'>");
	
	out.writeln( html.join("\r\n") );
	
	out.writeln("</div>");
	out.writeln("</body></html>");	
	out.close();	
}


function mkstring( pattern, n)
{
	var buf = "";
	for( var i=0; i < n; i++)
		buf += pattern;
	
	return buf;
}



