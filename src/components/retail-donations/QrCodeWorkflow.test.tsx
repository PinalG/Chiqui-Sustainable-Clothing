
import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import QrCodeWorkflow from './QrCodeWorkflow';

// Mock QR code libraries
vi.mock('react-qr-code', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="qr-code">QR Code: {value}</div>
  ),
}));

// Mock the navigator.mediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({}),
  },
});

describe('QrCodeWorkflow Component', () => {
  it('renders the empty state correctly', () => {
    render(<QrCodeWorkflow />);
    
    expect(screen.getByText(/Scan QR Code/i)).toBeInTheDocument();
    expect(screen.getByText(/Scan a QR code to track an item/i)).toBeInTheDocument();
  });

  it('displays item tracking information when loaded', () => {
    // Mock prop with an item - created as a new component instance
    const QrCodeWorkflowWithItem = () => (
      <QrCodeWorkflow initialItem={{ id: "123", name: "Test Item", type: "Clothing" }} />
    );
    
    render(<QrCodeWorkflowWithItem />);
    
    expect(screen.getByText(/Item: Test Item/i)).toBeInTheDocument();
    expect(screen.getByText(/Type: Clothing/i)).toBeInTheDocument();
  });

  it('shows camera when scan button is clicked', async () => {
    render(<QrCodeWorkflow />);
    
    // Click the scan button
    const scanButton = screen.getByRole('button', { name: /start scanning/i });
    scanButton.click();
    
    // Check if camera view is shown
    expect(screen.getByText(/Point your camera at the QR code/i)).toBeInTheDocument();
  });
});
