/******************************************************************************
 * Here is my 3D vector balls math library, originally written in Turbo Pascal
 * and now adapted to javascript ;-) There is nothing like sitting in front of
 * the computer to do 3D Graphics Programming while listening to MOD music from
 * Future Crew, Triton, and all those cool VGA Demo coder groups from Finland!
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

/*****************************************************************
 * Create a VertorBalls instance.
 * @param parent   object: Pointer to a containing DIV element
 * @param centerX  number: Container's horizontal middle point
 * @param centerY  number: Container's vertical middle point
 *****************************************************************/
function VectorBalls( parent, centerX, centerY )
{
    var _this = this;
    var len = 50;
    var maxLength = 50;
    var a = new Array();       // hold points of original shape
    var b = new Array();       // hold points of transformed shape
    var tmp = new Array();     // hold points of next shape
    var st = new Array();      // hold increments when stepping from 'a' to 'tmp' (shape shifting)
    var sprite = new Array();  // contains the DIV elements, one for each ball

    var curPattern = 1;        // 1 to 8, indicates which shape is currently being drawn
    var cycleCount = 0 ;       // counts the number of frames a shape is animated before it is changed, used with autoNext
    var autoNext = true;       // flag: turn on automatich shape changing
    var perspective = 1000;    // constant for x,y,z --> x,y conversion
    var steps = 0;             // counter tweening steps between shapes

    // These can be read or written between call to animate()
    // to change the shape rotation, or speed at which it rotates
    this.rx = 0.0; //public: x rotation used in next paint
    this.ry = 0.0; //public: z rotation used in next paint
    this.rz = 0.0; //public: y rotation used in next paint
    this.dx = 0.0; //public: increments for x rotation used by animate()
    this.dy = 0.0; //public: increments for y rotation used by animate()
    this.dz = 0.0; //public: increments for z rotation used by animate()


    //*********************************************
    // Paint() - Relocate balls on the screen
    // @public
    //*********************************************
    this.paint = function()
    {
        rotate();
        sortByZ();

        for ( var i = 0; i < len; i++ )
        {
            var px = b[i].x * perspective / (b[i].z + perspective);
            var py = b[i].y * perspective / (b[i].z + perspective);

            var alpha =  b[i].a; //Math.max(0, Math.min(b[i].a, 80 - b[i].z / 5));
            Raster.setOpacity( sprite[i], alpha );

            //reposition sprites
            sprite[i].className = "ball2";// + Math.max(0, Math.min(4, 4 - Math.round((150 + b[i].z) / 80)));
            if ( alpha > 10 )
            {
                sprite[i].style.left = (px + centerX) + "px";
                sprite[i].style.top = (py + centerY) + "px";
            }
            else
            {
                //if blend is too low, send sprite out of the screen
                sprite[i].style.left = "-100px";
                sprite[i].style.top = "-100px";
            }

            //--put i & "(" & px &", " & py &")"
        }
    };


    //*********************************************
    // Compute the transformation for the next
    // animation frame.
    // @public
    //*********************************************
    this.animate = function()
    {
        _this.rx += _this.dx;
        _this.ry += _this.dy;
        _this.rz += _this.dz;

        if (autoNext)
            cycleCount++;

        if (cycleCount > 200)
        {
            cycleCount = 0;
            _this.nextPattern();
        }

        if (steps > 0)
            moveToNextStep();
    };


    //*****************************************
    // Turn on/off auto shape change.
    // @public
    //*****************************************
    this.setAuto = function( _autoNext )
    {
        autoNext = _autoNext;
        cycleCount = 0;
    };

    //*****************************************
    // Jump to the next Pattern
    // @public
    //*****************************************
    this.nextPattern = function()
    {
        _this.setPattern ( curPattern + 1 );
    };

    //*****************************************
    // Jump to the previous Pattern
    // @public
    //*****************************************
    this.prevPattern = function()
    {
        _this.setPattern ( curPattern - 1 );
    };


    //*****************************************
    // Jump to the any given pattern: 1 to 8
    // @public
    //*****************************************
    this.setPattern = function( n )
    {
       if ( n < 1 )
            n = 8;
       else if ( n > 8 )
            n = 1;

        cycleCount = 0;
        curPattern = n;

        if ( curPattern == 1 )  makePattern1();
        else if ( curPattern == 2 )  makePattern2();
        else if ( curPattern == 3 )  makePattern3();
        else if ( curPattern == 4 )  makePattern4();
        else if ( curPattern == 5 )  makePattern5();
        else if ( curPattern == 6 )  makePattern6();
        else if ( curPattern == 7 )  makePattern8();
        else if ( curPattern == 8 )  makePattern7();

        generateSteps(25);
    };


    //******************************************
    // Rotate the pix array (rx,ry,rz) amounts
    //******************************************
    function rotate()
    {
        var sx = Math.sin(_this.rx);
        var sy = Math.sin(_this.ry);
        var sz = Math.sin(_this.rz);
        var cx = Math.cos(_this.rx);
        var cy = Math.cos(_this.ry);
        var cz = Math.cos(_this.rz);

        for ( var p = 0; p < len; p++ )
        {
            var xo = a[p].x;
            var yo = a[p].y;
            var zo = a[p].z;

            b[p].x = xo * cy * cz - yo * cy * sz + zo * sy;
            b[p].y = xo * sx * sy * cz + xo * cx * sz - yo * sx * sy * sz + yo * cx * cz - zo * sx * cy;
            b[p].z = -xo * cx * sy * cz + xo * sx * sz + yo * cx * sy * sz + yo * sx * cz + zo * cx * cy;
            b[p].a = a[p].a;
        }
    }


    ///////////////////////////////////////////////
    // Method Vector.sortByZ()
    // Sort the points by Z order: Back 2 Front
    //
    function sortByZ()
    {
        b.sort( compZ );

    }

    ///////////////////////////////////////////////
    // Compare the points by Z order: Back 2 Front
    //
    function compZ(A, B)
    {
        return B.z - A.z;
    }


    //*****************************************
    //  Calculate the amount per step needed
    //  to go from a[] to tmp[] and store it
    //  on st[]
    //*****************************************
    function generateSteps( n )
    {
        for ( var i = 0; i < maxLength; i++ )
        {
            st[i].a = (tmp[i].a - a[i].a) / n;
            st[i].x = (tmp[i].x - a[i].x) / n;
            st[i].y = (tmp[i].y - a[i].y) / n;
            st[i].z = (tmp[i].z - a[i].z) / n;
        }

        steps = n;
    }

    //*****************************************
    //  Move the from a[] to tmp[] using step
    //  sizes on st[]
    //*****************************************
    function moveToNextStep()
    {
        steps--;

        for ( var i = 0; i < maxLength; i++ )
        {
            a[i].a = a[i].a + st[i].a;
            a[i].x = a[i].x + st[i].x;
            a[i].y = a[i].y + st[i].y;
            a[i].z = a[i].z + st[i].z;
        }

    }



    //*****************************************
    //  all tmp[].alpha to zeroes
    //*****************************************
    function zeroAlphas()
    {
        for ( var i = 0; i < maxLength; i++ )
            tmp[i].a = 0;

    }

    //*****************************************
    //  Plane
    //*****************************************
    function makePattern1()
    {
        zeroAlphas();
        //(36)

        for ( var x = 0; x <= 5; x++ )
            for ( var y = 0; y <= 5; y++ )
            {
                tmp[x + y * 6].x = x * 60 - 150;
                tmp[x + y * 6].y = y * 60 - 150;
                tmp[x + y * 6].z = 0;
                tmp[x + y * 6].a = 100;
            }
    }


    //*****************************************
    // Christmas tree?
    //*****************************************
    function makePattern2()
    {
        //(42)
        zeroAlphas();

        var n = 5;

        for ( var p = 1; p <= 42; p++ )
        {
            n = n + 0.2;

            tmp[p - 1].x = (p * 5 + 15) * Math.cos(p * 6.28 / n);
            tmp[p - 1].y = (p * 5 + 15) * Math.sin(p * 6.28 / n);
            tmp[p - 1].z = p * (20 - n) - 180;
            tmp[p - 1].a = 100;
        }

    }

    //*****************************************
    //  Circle
    //*****************************************
    function makePattern3()
    {
        //(18)
        zeroAlphas();

        for ( var p = 1; p <= 18; p++ )
        {
            tmp[p - 1].x = 170 * Math.cos(p * 6.28 / 18);
            tmp[p - 1].y = 170 * Math.sin(p * 6.28 / 18);
            tmp[p - 1].z = 0;
            tmp[p - 1].a = 100;
        }
    }

    //*****************************************
    //  Spiral
    //*****************************************
    function makePattern4()
    {
        //(36)
        zeroAlphas();

        for ( var p = 1; p <= 36; p++ )
        {

            tmp[p - 1].x = 100 * Math.cos(p * 6.28 / 18);
            tmp[p - 1].y = 100 * Math.sin(p * 6.28 / 18);
            tmp[p - 1].z = p * 10 - 180;
            tmp[p - 1].a = 100;

        }

    }

    //*****************************************
    //  AC current
    //*****************************************
    function makePattern5()
    {
        //(36)
        zeroAlphas();

        for ( var p = 1; p <= 36; p++ )
        {

            tmp[p - 1].x = 150 * Math.cos(p * 6.28 / 36);
            tmp[p - 1].y = 150 * Math.sin(p * 6.28 / 36);
            tmp[p - 1].z = 50 * Math.sin(p * 6.28 / 9);
            tmp[p - 1].a = 100;

        }

    }

    //*****************************************
    // Cube
    //*****************************************
    function makePattern6()
    {
        //(27)
        zeroAlphas();

        var i = 0;

        for ( var z = 0; z <= 2; z++ )
            for ( var x = 0; x <= 2; x++ )
                for ( var y = 0; y <= 2; y++ )
                {

                    tmp[i].x = x * 80 - 80;
                    tmp[i].y = y * 80 - 80;
                    tmp[i].z = z * 80 - 80;
                    tmp[i].a = 100;
                    i++;
                }


    }


    //*****************************************
    // Twister
    //*****************************************
    function makePattern7()
    {
        //(42)
        zeroAlphas();

        var i = 0;

        for ( var z = 0; z <= 6; z++ )
            for ( var p = 0; p <= 5; p++ )
            {
                tmp[i].x = 160 * Math.cos(p * 6.28 / 6 + z * 5);
                tmp[i].y = 160 * Math.sin(p * 6.28 / 6 + z * 5);
                tmp[i].z = 70 * z - 245;
                tmp[i].a = 100;
                i++;
            }


    }

    //*****************************************
    //  Cube 2
    //*****************************************
    function makePattern8()
    {
        zeroAlphas();
        //(36)

        var x, i = 0;
        for (  x = 0; x <= 4; x++ )
        {
            tmp[i].x = x * 50 - 100;
            tmp[i].y = 100;
            tmp[i].z = 100;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 4; x++ )
        {
            tmp[i].x = x * 50 - 100;
            tmp[i].y = 100;
            tmp[i].z = -100;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 4; x++ )
        {
            tmp[i].x = x * 50 - 100;
            tmp[i].y = -100;
            tmp[i].z = 100;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 4; x++ )
        {
            tmp[i].x = x * 50 - 100;
            tmp[i].y = -100;
            tmp[i].z = -100;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 2; x++ )
        {
            tmp[i].x = -100;
            tmp[i].y = 100;
            tmp[i].z = x * 50 - 50;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 2; x++ )
        {
            tmp[i].x = 100;
            tmp[i].y = 100;
            tmp[i].z = x * 50 - 50;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 2; x++ )
        {
            tmp[i].x = 100;
            tmp[i].y = -100;
            tmp[i].z = x * 50 - 50;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 2; x++ )
        {

            tmp[i].x = -100;
            tmp[i].y = -100;
            tmp[i].z = x * 50 - 50;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 2; x++ )
        {
            tmp[i].x = -100;
            tmp[i].y = x * 50 - 50;
            tmp[i].z = 100;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 2; x++ )
        {
            tmp[i].x = 100;
            tmp[i].y = x * 50 - 50;
            tmp[i].z = 100;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 2; x++ )
        {
            tmp[i].x = 100;
            tmp[i].y = x * 50 - 50;
            tmp[i].z = -100;
            tmp[i].a = 100;
            i++;
        }

        for (  x = 0; x <= 2; x++ )
        {
            tmp[i].x = -100;
            tmp[i].y = x * 50 - 50;
            tmp[i].z = -100;
            tmp[i].a = 100;
            i++;
        }
    }


    //*********************************************
    // Init
    //*********************************************
    {
        // Construct the a and b arrays to store points
        //  a = original array
        //  b = transformed array
        for ( var n = 0; n < len; n++ )
        {
            a.push({x:0, y:0, z:0, a:0});  //[x,y,z,alpha]
            b.push({x:0, y:0, z:0, a:0});
            st.push({x:0, y:0, z:0, a:0});
            tmp.push({x:0, y:0, z:0, a:0});

            sprite[n] = document.createElement("DIV");
            sprite[n].style.zIndex = n.toString();
            sprite[n].className = "ball0";
            parent.appendChild(sprite[n]);
        }

        // Generate start pattern
        this.setPattern(1);
        generateSteps(10);
    }


}