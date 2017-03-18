/******************************************************************************
 * Demo 3D vector math library.
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

// 3D Transformation perspective constant
var PERSPECTIVE = 800.0;

////////////////////////////////////////////////////////
// Class Point
//
function Point( x, y, z )
{
    this.x = x;
    this.y = y;
    this.z = z;
}

//////////////////////////////////////////////////////////////
// Returns the cartesian x and y coordinate of the 3D point
//
Point.prototype.xy = function ()
{
    return [ Math.round(this.x * PERSPECTIVE / (this.z + PERSPECTIVE)),
        Math.round(this.y * PERSPECTIVE / (this.z + PERSPECTIVE)) ];
};


////////////////////////////////////////////////////////
// Class Vector
//
function Vector( len )
{
    this.len = len;
    this.points = new Array();
    this.pointst = new Array();

    //Init vector
    for ( var p = 0; p < this.len; p++ )
    {
        this.points[p] = new Point(0, 0, 0);
        this.pointst[p] = new Point(0, 0, 0);
    }
}

///////////////////////////////////////////
// Method Vector.setPoint()
// Set the x,y and z of a given point
//
Vector.prototype.setPoint = function( p, x, y, z )
{
    this.points[p].x = x;
    this.points[p].y = y;
    this.points[p].z = z;
};


///////////////////////////////////////////
// Method Vector.rotate()
// Rotate the vector (rx,ry,rz) radians
//
Vector.prototype.rotate = function( rx, ry, rz )
{
    var sx,sy,sz,cx,cy,cz;

    // Here is the magic of math. You can get these fomulas in
    // your your college calculus text book. ;-)
    sx = Math.sin(rx);
    sy = Math.sin(ry);
    sz = Math.sin(rz);
    cx = Math.cos(rx);
    cy = Math.cos(ry);
    cz = Math.cos(rz);

    for ( var p = 0; p < this.len; p++ )
    {
        var xo = this.points[p].x;
        var yo = this.points[p].y;
        var zo = this.points[p].z;

        this.pointst[p].x = xo * cy * cz - yo * cy * sz + zo * sy;
        this.pointst[p].y = xo * sx * sy * cz + xo * cx * sz - yo * sx * sy * sz + yo * cx * cz - zo * sx * cy;
        this.pointst[p].z = -xo * cx * sy * cz + xo * sx * sz + yo * cx * sy * sz + yo * sx * cz + zo * cx * cy;
    }
    /*for*/

};


///////////////////////////////////////////////
// Method Vector.sortByZ()
// Sort the points by Z order: Back 2 Front
//
Vector.prototype.sortByZ = function ()
{
    this.pointst.sort(Vector.compZ);

};


///////////////////////////////////////////////
//
//
Vector.prototype.row = function ( rowno, count, rowsize )
{
    var points = new Array();
    var start = rowno * rowsize;
    for ( var n = 0; n < count; n++ )
        points.push(this.pointst[start + n].xy());

    return points;
};

///////////////////////////////////////////////
//
//
Vector.prototype.col = function ( colno, count, rowsize )
{
    var points = new Array();
    for ( var n = 0; n < count; n++ )
        points.push(this.pointst[ n * rowsize + colno ].xy());

    return points;
};

///////////////////////////////////////////////
// Returns list of polygons in the mesh
//
Vector.prototype.faces = function ( size )
{
    var faces = new Array();
    var p = this.pointst;
    var q = this.points;
    var minY = 0, maxY = 0;


    for ( var j = 0; j < size - 1; j++ )
        for ( var i = 0; i < size - 1; i++ )
        {
            var face = [ p[j * size + i].xy(), p[j * size + i + 1].xy(), p[(j + 1) * size + i + 1].xy(), p[(j + 1) * size + i].xy(), p[j * size + i].xy() ];
            face.z = (p[j * size + i].z + p[j * size + i + 1].z + p[(j + 1) * size + i + 1].z + p[(j + 1) * size + i].z) / 4;
            face.y = Math.round(q[j * size + i].y); 
            faces.push(face);

            minY = Math.min(face.y, minY);
            maxY = Math.max(face.y, maxY);
        }

    faces.sort(Vector.compZ);

    faces.minY = minY;
    faces.maxY = maxY;

    return faces;
};

///////////////////////////////////////////////
// Compare the points by Z order: Back 2 Front
//
Vector.compZ = function ( a, b )
{
    return b.z - a.z;
};
