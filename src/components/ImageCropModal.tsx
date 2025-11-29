import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Save, ZoomIn, ZoomOut } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  cardName?: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropModal({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
  cardName = 'Card'
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = useCallback(
    (croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
      // Generate preview
      generatePreview(croppedAreaPixels);
    },
    []
  );

  const generatePreview = async (cropArea: CropArea) => {
    if (!cropArea) return;

    try {
      const image = new Image();
      image.src = imageUrl;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Card image dimensions (from Card.tsx)
      canvas.width = 256; // w-64 = 256px
      canvas.height = 192; // h-48 = 192px

      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const preview = canvas.toDataURL('image/jpeg', 0.9);
      setPreviewUrl(preview);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    try {
      const image = new Image();
      image.src = imageUrl;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas to cropped dimensions
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleClose = () => {
    if (confirm('Bild-Zuschnitt abbrechen? Das Bild wird nicht hochgeladen.')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl text-white">🖼️ Bild zuschneiden</h2>
            <p className="text-gray-400 text-sm mt-1">
              Position und Zoom anpassen für optimale Darstellung auf der Karte
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Crop Editor */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white mb-4">Bild anpassen</h3>
                
                {/* Cropper */}
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3} // Match card image aspect ratio (256x192)
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropAreaComplete}
                    style={{
                      containerStyle: {
                        background: '#000',
                      },
                      cropAreaStyle: {
                        border: '2px solid #a855f7',
                        boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.5)',
                      },
                    }}
                  />
                </div>

                {/* Zoom Slider */}
                <div className="mt-4 space-y-2">
                  <label className="text-white text-sm flex items-center gap-2">
                    <ZoomOut className="w-4 h-4" />
                    Zoom
                    <ZoomIn className="w-4 h-4" />
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <p className="text-xs text-gray-400">
                    Verschiebe das Bild mit der Maus · Zoom mit dem Slider anpassen
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-white mb-4">Live Preview</h3>
                
                {/* Card Preview */}
                <div className="bg-black rounded-lg p-8 flex items-center justify-center">
                  <div className="w-64 h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-500 bg-gradient-to-br from-gray-600 to-gray-500">
                    {/* Card Header */}
                    <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3 border-b-2 border-white/20 z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎴</span>
                          <h3 className="text-white text-sm truncate">{cardName}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Card Image - This is how it will look */}
                    <div className="absolute top-16 left-0 right-0 h-48 overflow-hidden">
                      {previewUrl ? (
                        <ImageWithFallback
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/30">
                          <span className="text-4xl opacity-50">🖼️</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom placeholder */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-3 border-t-2 border-white/20">
                      <p className="text-white/60 text-xs italic text-center">
                        So wird das Bild auf der Karte angezeigt
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                  <p className="text-purple-200 text-sm">
                    💡 <strong>Tipp:</strong> Das Bild wird automatisch auf die Kartengröße angepasst. 
                    Wähle den wichtigsten Bildbereich aus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-800/50">
          <div className="text-sm text-gray-400">
            Aspect Ratio: 4:3 (optimal für Kartendarstellung)
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Zuschnitt übernehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
