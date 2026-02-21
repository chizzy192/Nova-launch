import { useState } from 'react';
import { Button, Spinner } from '../UI';
import type { FormData } from './index';
import type { FeeBreakdown } from '../../types';

interface ReviewStepProps {
  data: FormData;
  fees: FeeBreakdown;
  onBack: () => void;
  onDeploy: () => Promise<void>;
  onReset: () => void;
}

export function ReviewStep({
  data,
  fees,
  onBack,
  onDeploy,
  onReset,
}: ReviewStepProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDeploy = async () => {
    setIsDeploying(true);
    setError('');

    try {
      await onDeploy();
      setDeploymentSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deployment failed');
    } finally {
      setIsDeploying(false);
    }
  };

  if (deploymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Token Deployed Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Your token has been created on the Stellar network
        </p>
        <Button onClick={onReset}>Deploy Another Token</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Confirm
        </h2>
        <p className="text-gray-600">
          Please review your token details before deployment
        </p>
      </div>

      {/* Token Details */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 mb-3">Token Details</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{data.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Symbol</p>
            <p className="font-medium text-gray-900">{data.symbol}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Decimals</p>
            <p className="font-medium text-gray-900">{data.decimals}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Initial Supply</p>
            <p className="font-medium text-gray-900">
              {parseInt(data.initialSupply).toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Admin Wallet</p>
          <p className="font-medium text-gray-900 break-all text-sm">
            {data.adminWallet}
          </p>
        </div>
      </div>

      {/* Metadata */}
      {(data.metadata?.image || data.metadata?.description) && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 mb-3">Metadata</h3>
          
          {data.metadata.image && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Image</p>
              <img
                src={URL.createObjectURL(data.metadata.image)}
                alt="Token"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
              />
            </div>
          )}

          {data.metadata.description && (
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-900">{data.metadata.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Fee Breakdown */}
      <div className="bg-blue-50 rounded-lg p-6 space-y-3">
        <h3 className="font-semibold text-gray-900 mb-3">Fee Breakdown</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Deployment Fee</span>
            <span className="font-medium text-gray-900">{fees.baseFee} XLM</span>
          </div>
          
          {fees.metadataFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Metadata Fee</span>
              <span className="font-medium text-gray-900">
                {fees.metadataFee} XLM
              </span>
            </div>
          )}
          
          <div className="border-t border-blue-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total Fee</span>
              <span className="font-bold text-blue-600 text-lg">
                {fees.totalFee} XLM
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isDeploying}
        >
          Back
        </Button>
        <Button
          onClick={handleDeploy}
          disabled={isDeploying}
          size="lg"
        >
          {isDeploying ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Deploying...
            </>
          ) : (
            `Deploy Token (${fees.totalFee} XLM)`
          )}
        </Button>
      </div>
    </div>
  );
}
