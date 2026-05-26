import React, { useState, useRef } from 'react';
import { Box, Card, Typography, IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface DocumentViewerProps {
  imageUrl: string;
  altText?: string;
  initialZoom?: number;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  imageUrl, 
  altText = "Documento Escaneado",
  initialZoom = 100 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados para arrastrar (pan) la imagen
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState<number>(0);
  
  // Estados de visualización
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [page, setPage] = useState<number>(1);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 180));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 60));
  };

  return (
    <Card 
      sx={{ 
        boxShadow: 1, 
        border: 1,
        borderColor: 'divider',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: { xs: '450px', lg: 'auto' },
        flexGrow: { xs: 0, lg: 1 },
        minHeight: 0,
        overflow: 'hidden'
      }}
    >
      <Box 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          display: 'flex', 
          bgcolor: '#EAECEE',
          p: 2,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        <Box 
          component="img"
          src={imageUrl} 
          alt={altText} 
          sx={{ 
            width: `${zoom}%`,
            maxWidth: 'none', // Allow it to expand beyond parent container size!
            flexShrink: 0, // Prevent flex parent from shrinking the image!
            margin: 'auto', // Centered when smaller, left-aligned/scrollable when larger!
            height: 'auto',
            transition: 'width 0.2s ease-in-out',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            borderRadius: '4px',
            pointerEvents: 'none' // Direct mouse events to container Box for smooth panning
          }}
        />
      </Box>
      
      {/* Controles de Navegación del Visualizador */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          px: 3, 
          py: 1.5, 
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: '#FFFFFF'
        }}
      >
        {/* Zoom Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 60}>
            <ZoomOutIcon />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 600, width: 45, textAlign: 'center' }}>
            {zoom}%
          </Typography>
          <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 180}>
            <ZoomInIcon />
          </IconButton>
        </Box>

        {/* Page Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
            Página {page} de 2
          </Typography>
          <IconButton size="small" onClick={() => setPage(1)} disabled={page === 1}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton size="small" onClick={() => setPage(2)} disabled={page === 2}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default DocumentViewer;
