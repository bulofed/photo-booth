import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // 1. Parse and validate request
    const requestData = await request.json();
    
    if (!requestData.photos || !requestData.layout) {
      return NextResponse.json(
        { error: 'Missing required fields: photos and layout' },
        { status: 400 }
      );
    }

    // 2. Destructure with comprehensive defaults
    const {
      photos,
      layout,
      textElements = [],
      dimensions = {}
    } = requestData;

    const {
      photoWidth = 600,
      padding = 30,
      topMargin = 120,
      bottomMargin = 240,
      backgroundColor = 'white',
      photoBorderColor = '#ddd',
      photoBorderWidth = 2
    } = dimensions;

    // 3. Calculate canvas dimensions
    const aspectRatio = 9/16;
    const photoHeight = Math.round(photoWidth * aspectRatio);
    const maxCols = Math.max(...layout.map(row => row.length));
    const canvasWidth = (photoWidth * maxCols) + (padding * (maxCols + 1));
    const canvasHeight = (photoHeight * layout.length) + 
                        (padding * (layout.length + 1)) + 
                        topMargin + 
                        bottomMargin;

    // 4. Setup canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // 5. Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 6. Draw photos with optional borders
    await Promise.all(
      layout.flatMap((row, rowIdx) => 
        row.map(async (cell, colIdx) => {
          if (typeof cell !== 'number' || !photos[cell]) return;
          
          const x = padding + colIdx * (photoWidth + padding);
          const y = topMargin + padding + rowIdx * (photoHeight + padding);
          
          // Draw photo border if specified
          if (photoBorderWidth > 0) {
            ctx.fillStyle = photoBorderColor;
            ctx.fillRect(
              x - photoBorderWidth,
              y - photoBorderWidth,
              photoWidth + (photoBorderWidth * 2),
              photoHeight + (photoBorderWidth * 2)
            );
          }

          // Draw image
          const img = await loadImage(photos[cell]);
          ctx.drawImage(img, x, y, photoWidth, photoHeight);
        })
      )
    );

    // 7. Draw text elements (if any)
    if (textElements?.length > 0) {
      textElements.forEach(text => {
        const fontSize = text.fontSize || 24;
        ctx.fillStyle = text.color || '#000000';
        ctx.font = `${fontSize}px ${text.fontFamily || 'Arial'}`;
        ctx.textAlign = text.align || 'center';
        
        // Calculate position
        let x, y;
        switch(text.position) {
          case 'top-left':
            x = padding + (text.offsetX || 0);
            y = topMargin + (text.offsetY || fontSize);
            break;
          case 'top-right':
            x = canvasWidth - padding - (text.offsetX || 0);
            y = topMargin + (text.offsetY || fontSize);
            break;
          case 'bottom':
            x = canvasWidth / 2 + (text.offsetX || 0);
            y = canvasHeight - bottomMargin / 2 + (text.offsetY || 0);
            break;
          case 'custom':
            x = text.x || canvasWidth / 2;
            y = text.y || canvasHeight / 2;
            break;
          default: // center
            x = canvasWidth / 2 + (text.offsetX || 0);
            y = canvasHeight / 2 + (text.offsetY || 0);
        }

        // Optional text shadow
        if (text.shadow) {
          ctx.shadowColor = text.shadow.color || 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = text.shadow.blur || 5;
          ctx.shadowOffsetX = text.shadow.offsetX || 2;
          ctx.shadowOffsetY = text.shadow.offsetY || 2;
        }

        ctx.fillText(text.content, x, y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
      });
    }

    // 8. Generate output
    const quality = dimensions.quality || 0.9;
    const stripUrl = canvas.toDataURL('image/jpeg', quality);
    
    return NextResponse.json({ 
      success: true,
      stripUrl,
      dimensions: {
        width: canvasWidth,
        height: canvasHeight
      }
    });
    
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Strip generation failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}