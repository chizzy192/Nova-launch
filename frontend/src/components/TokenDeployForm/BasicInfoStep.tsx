import { useState } from 'react';
import { Input, Button } from '../UI';
import { validateTokenParams } from '../../utils/validation';
import type { FormData } from './index';

interface BasicInfoStepProps {
  data: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
}

export function BasicInfoStep({ data, onUpdate, onNext }: BasicInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof FormData, value: string | number) => {
    onUpdate({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      symbol: true,
      decimals: true,
      initialSupply: true,
      adminWallet: true,
    });

    // Validate all fields
    const validation = validateTokenParams({
      name: data.name,
      symbol: data.symbol,
      decimals: data.decimals,
      initialSupply: data.initialSupply,
      adminWallet: data.adminWallet,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Token Information
        </h2>
        <p className="text-gray-600">
          Enter the fundamental details for your token
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Token Name"
          placeholder="e.g., My Awesome Token"
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={touched.name ? errors.name : undefined}
          required
          maxLength={32}
          helperText="1-32 alphanumeric characters"
        />

        <Input
          label="Token Symbol"
          placeholder="e.g., MAT"
          value={data.symbol}
          onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('symbol')}
          error={touched.symbol ? errors.symbol : undefined}
          required
          maxLength={12}
          helperText="1-12 uppercase letters"
        />

        <Input
          label="Decimals"
          type="number"
          placeholder="7"
          value={data.decimals.toString()}
          onChange={(e) => handleChange('decimals', parseInt(e.target.value) || 0)}
          onBlur={() => handleBlur('decimals')}
          error={touched.decimals ? errors.decimals : undefined}
          required
          min={0}
          max={18}
          helperText="Number of decimal places (0-18, typically 7 for Stellar)"
        />

        <Input
          label="Initial Supply"
          type="text"
          placeholder="1000000"
          value={data.initialSupply}
          onChange={(e) => handleChange('initialSupply', e.target.value)}
          onBlur={() => handleBlur('initialSupply')}
          error={touched.initialSupply ? errors.initialSupply : undefined}
          required
          helperText="Total number of tokens to create"
        />

        <Input
          label="Admin Wallet Address"
          placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          value={data.adminWallet}
          onChange={(e) => handleChange('adminWallet', e.target.value)}
          onBlur={() => handleBlur('adminWallet')}
          error={touched.adminWallet ? errors.adminWallet : undefined}
          required
          helperText="Stellar address that will control the token"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg">
          Next: Add Metadata
        </Button>
      </div>
    </form>
  );
}
