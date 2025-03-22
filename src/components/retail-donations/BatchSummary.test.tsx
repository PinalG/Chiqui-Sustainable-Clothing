
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { useForm } from 'react-hook-form';
import BatchSummary from './BatchSummary';
import { DonationItem } from './types';

// Mock the form hook
const MockFormProvider = ({ children }: { children: React.ReactNode }) => {
  const form = useForm({
    defaultValues: {
      storageArea: 1000,
    }
  });
  
  return <>{children}</>;
};

// Mock the donation utility functions
vi.mock('./donationUtils', () => ({
  calculateTaxBenefit: vi.fn().mockImplementation((totalValue) => totalValue * 0.3),
  calculateStorageBenefit: vi.fn().mockImplementation((storageArea) => storageArea * 2.5),
}));

describe('BatchSummary', () => {
  const mockItems: DonationItem[] = [
    {
      id: '1',
      name: 'T-shirt',
      category: 'Apparel',
      condition: 'Good',
      quantity: 5,
      value: 100,
      imageUrl: '',
      status: "registered"
    },
    {
      id: '2',
      name: 'Jeans',
      category: 'Apparel',
      condition: 'Excellent',
      quantity: 3,
      value: 150,
      imageUrl: '',
      status: "registered"
    },
  ];

  const mockForm = {
    getValues: vi.fn().mockReturnValue({ storageArea: 1000 }),
  } as any;

  it('renders the batch summary correctly with items', () => {
    render(
      <BatchSummary
        items={mockItems}
        onRemoveItem={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={false}
        form={mockForm}
      />
    );

    // Check that the summary shows the correct total items (5 + 3 = 8)
    expect(screen.getByText('8')).toBeInTheDocument();
    
    // Check that the summary shows the correct total value (100 + 150 = 250)
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    
    // Check tax benefit (30% of 250 = 75)
    expect(screen.getByText('$75.00')).toBeInTheDocument();
    
    // Check storage benefit (1000 * 2.5 = 2500)
    expect(screen.getByText('$2500.00')).toBeInTheDocument();
    
    // Check total benefit (75 + 2500 = 2575)
    expect(screen.getByText('$2575.00')).toBeInTheDocument();
    
    // Check that the register button is enabled
    const registerButton = screen.getByRole('button', { name: /register retail donation/i });
    expect(registerButton).toBeEnabled();
  });

  it('disables the register button when there are no items', () => {
    render(
      <BatchSummary
        items={[]}
        onRemoveItem={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={false}
        form={mockForm}
      />
    );
    
    // The register button should not be present when there are no items
    expect(screen.queryByRole('button', { name: /register retail donation/i })).not.toBeInTheDocument();
  });

  it('shows loading state when submitting', () => {
    render(
      <BatchSummary
        items={mockItems}
        onRemoveItem={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={true}
        form={mockForm}
      />
    );
    
    // Check that the button shows a loading state
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    
    // The button should be disabled during submission
    const registerButton = screen.getByRole('button');
    expect(registerButton).toBeDisabled();
  });
});
