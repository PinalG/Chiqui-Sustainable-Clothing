
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { useForm } from 'react-hook-form';
import StorageInfoForm from './StorageInfoForm';
import { DonationFormValues } from './donationFormSchema';

// Create a wrapper with form context
const FormWrapper = () => {
  const form = useForm<DonationFormValues>({
    defaultValues: {
      storageLocation: '',
      storageType: 'warehouse',
      storageArea: 0,
      notes: '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <StorageInfoForm form={form} />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('StorageInfoForm', () => {
  it('renders all form fields correctly', () => {
    render(<FormWrapper />);
    
    // Check if all form elements are rendered
    expect(screen.getByLabelText(/storage location/i)).toBeInTheDocument();
    expect(screen.getByText(/storage type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/storage area/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/storage notes/i)).toBeInTheDocument();
  });

  it('should populate the form with default values', () => {
    render(<FormWrapper />);
    
    // Check default value for storage type
    expect(screen.getByText(/warehouse/i)).toBeInTheDocument();
    
    // The storage area should be 0 initially
    const storageAreaInput = screen.getByLabelText(/storage area/i) as HTMLInputElement;
    expect(storageAreaInput.value).toBe('0');
  });

  it('should allow changing form values', () => {
    render(<FormWrapper />);
    
    // Change the storage location
    const locationInput = screen.getByLabelText(/storage location/i) as HTMLInputElement;
    fireEvent.change(locationInput, { target: { value: 'New York Warehouse' } });
    expect(locationInput.value).toBe('New York Warehouse');
    
    // Change the storage area
    const areaInput = screen.getByLabelText(/storage area/i) as HTMLInputElement;
    fireEvent.change(areaInput, { target: { value: '1500' } });
    expect(areaInput.value).toBe('1500');
    
    // Change the notes
    const notesInput = screen.getByLabelText(/storage notes/i) as HTMLInputElement;
    fireEvent.change(notesInput, { target: { value: 'Test notes' } });
    expect(notesInput.value).toBe('Test notes');
  });
});
