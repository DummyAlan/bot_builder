import { ExtractedSIData } from '@/types/si-data';

export const mockSIData: ExtractedSIData = {
  id: 'mock-si-001',
  fileName: 'shipping-instruction-sample.pdf',
  uploadedAt: new Date(),
  status: 'extracted',
  
  // Shipper Information
  shipperName: 'Global Exports Inc.',
  shipperAddress: '123 Industrial Blvd, Los Angeles, CA 90021, USA',
  shipperContact: '+1 (310) 555-0123 | exports@globalexports.com',
  
  // Consignee Information
  consigneeName: 'Pacific Import Solutions Ltd.',
  consigneeAddress: '456 Harbor View Road, Singapore 018956',
  consigneeContact: '+65 6234 5678 | imports@pacificimport.sg',
  
  // Cargo Details
  cargoDescription: 'Electronics Components - Semiconductors and Circuit Boards',
  containerNumber: 'MSCU1234567',
  weight: 18500,
  weightUnit: 'KG',
  volume: 33.2,
  volumeUnit: 'CBM',
  
  // Shipping Details
  portOfLoading: 'Los Angeles, CA (USLAX)',
  portOfDischarge: 'Singapore (SGSIN)',
  vesselName: 'MV Pacific Trader',
  voyageNumber: 'PT-2025-W12',
  bookingNumber: 'BKNG-LA-SG-789456',
  
  // Dates
  cargoReadyDate: '2025-12-20',
  requestedShipDate: '2025-12-25',
};
