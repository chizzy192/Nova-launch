import { useState, useRef } from 'react';
import { Button } from '../UI';
import { isValidImageFile, isValidDescription } from '../../utils/validation';
import type { FormData } from './index';

interface MetadataStepProps {
  data: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function MetadataStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: MetadataStepProps) {
  const [imageError, setImageError] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = isValidImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || 'Invalid file');
      return;
    }

    setImageError('');
    onUpdate({
      metadata: {
        ...data.metadata,
        image: file,
        description: data.metadata?.description || '',
      },
    });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onUpdate({
      metadata: {
        ...data.metadata,
        image: null,
        description: data.metadata?.description || '',
      },
    });
    setImagePreview('');
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDescriptionChange = (value: string) => {
    if (!isValidDescription(value)) {
      setDescriptionError('Description must be 500 characters or less');
    } else {
      setDescriptionError('');
    }

    onUpdate({
      metadata: {
        image: data.metadata?.image || null,
        description: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate description if provided
    if (data.metadata?.description && !isValidDescription(data.metadata.description)) {
      setDescriptionError('Description must be 500 characters or less');
      return;
    }

    onNext();
  };

  const handleSkip = () => {
    // Clear metadata and proceed
    onUpdate({
      metadata: {
        image: null,
        description: '',
      },
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Token Metadata (Optional)
        </h2>
        <p className="text-gray-600">
          Add an image and description to make your token more recognizable
        </p>
        <p className="text-sm text-blue-600 mt-1">
          Adding metadata costs an additional 3 XLM
        </p>
      </div>

      <div className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Image
          </label>
          
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, or SVG (max 5MB)
                </span>
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Token preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
          
          {imageError && (
            <p className="mt-2 text-sm text-red-600">{imageError}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={data.metadata?.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              descriptionError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your token's purpose and features..."
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            <p className="text-sm text-gray-500">
              {data.metadata?.description?.length || 0}/500 characters
            </p>
            {descriptionError && (
              <p className="text-sm text-red-600">{descriptionError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={handleSkip}>
            Skip Metadata
          </Button>
          <Button type="submit" disabled={!!imageError || !!descriptionError}>
            Next: Review
          </Button>
        </div>
      </div>
    </form>
  );
}
