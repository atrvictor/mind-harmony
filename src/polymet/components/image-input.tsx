import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Eye } from 'lucide-react';

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImageInput({ value, onChange, label = "Image", required = false }: ImageInputProps) {
  const [showPreview, setShowPreview] = useState(false);

  // Common image paths for quick selection
  const commonImages = [
    '/MH Milana DSC03928.jpg',
    '/MH Milana DSC03938.jpg',
    '/MH_Columet_edited.png',
    '/CandlelightYoga.jpg',
    '/piano photos/piano_keys_tricolor_nocandle_1.jpg',
    '/piano photos/piano_macro_keys_purple_candlelight_1.jpg',
    '/piano photos/piano_macro_strings_purple_candlelight_1.jpg',
    '/katesessions_landscape_6.jpg',
    '/gliderport_landscape_2.jpg',
    '/sunset-field.png'
  ];

  const handleCommonImageSelect = (imagePath: string) => {
    onChange(imagePath);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="space-y-3">
        {/* Manual input */}
        <div className="flex gap-2">
          <Input
            id="image"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/path/to/image.jpg"
            required={required}
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Image preview */}
        {value && showPreview && (
          <Card className="w-full max-w-sm">
            <CardContent className="p-2">
              <img
                src={value}
                alt="Preview"
                className="w-full h-32 object-cover rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
                      Image not found: ${value}
                    </div>
                  `;
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Common images quick selector */}
        <div>
          <Label className="text-sm text-muted-foreground">Quick select from existing images:</Label>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
            {commonImages.map((imagePath) => (
              <button
                key={imagePath}
                type="button"
                onClick={() => handleCommonImageSelect(imagePath)}
                className={`p-2 text-left text-xs rounded border transition-colors hover:bg-gray-50 ${
                  value === imagePath 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200'
                }`}
              >
                <div className="truncate font-mono">{imagePath}</div>
                <div className="text-gray-500 mt-1">
                  {imagePath.includes('piano') ? '🎹 Piano' :
                   imagePath.includes('yoga') ? '🧘 Yoga' :
                   imagePath.includes('landscape') ? '🌅 Landscape' :
                   imagePath.includes('Milana') ? '📸 Event Photo' :
                   '🖼️ Image'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          💡 <strong>Tips:</strong>
          <ul className="mt-1 ml-4 list-disc">
            <li>Images should be placed in the <code>/public</code> folder</li>
            <li>Use paths starting with <code>/</code> (e.g., <code>/image.jpg</code>)</li>
            <li>Recommended size: 800x600px or larger</li>
            <li>Supported formats: JPG, PNG, WebP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}