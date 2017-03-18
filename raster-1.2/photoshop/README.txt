    --------------------------------------------------------------------------
    Photoshop files and scripts
    --------------------------------------------------------------------------

    - Use the Photoshop files can be used to create new themes.

    - Copy *.jsx files to the Photoshop scripts folder, for example:
      "C:\Program Files\Adobe\Adobe Photoshop CS4 (64 Bit)\Presets\Scripts"

    - Use the Tile*.jsx to export layers to either Vertical or Horizontal sprites.

    - Use the sprite_concatenator*.jsx to read a directory with either 16x16 or
      32x32 images and compile them a single sprite image. After the script runs
      look for a file "_sprite-index.txt" created in the directory the images
      were read from. This file contains the javascript code that define
      images in the sprite as IID_SPRITEINFO objects.

      ** Note these scripts use pixel measurements. You may get errors if your
         photoshop ruler measurements are not setup to pixel units.

