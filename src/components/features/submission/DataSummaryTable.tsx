/**
 * DataSummaryTable Component
 * Displays SI data in a condensed table format for review
 */

'use client';

import { ExtractedSIData } from '@/types/si-data';

export interface DataSummaryTableProps {
  data: ExtractedSIData;
  highlightChanges?: boolean;
  modifiedFields?: string[];
}

interface TableRow {
  label: string;
  value: string | number;
  field: string;
}

export const DataSummaryTable = ({
  data,
  highlightChanges = false,
  modifiedFields = [],
}: DataSummaryTableProps) => {
  const isModified = (field: string) =>
    highlightChanges && modifiedFields.includes(field);

  const rows: TableRow[] = [
    // Shipper Information
    { label: 'Shipper Name', value: data.shipperName, field: 'shipperName' },
    {
      label: 'Shipper Address',
      value: data.shipperAddress,
      field: 'shipperAddress',
    },
    {
      label: 'Shipper Contact',
      value: data.shipperContact,
      field: 'shipperContact',
    },
    
    // Consignee Information
    {
      label: 'Consignee Name',
      value: data.consigneeName,
      field: 'consigneeName',
    },
    {
      label: 'Consignee Address',
      value: data.consigneeAddress,
      field: 'consigneeAddress',
    },
    {
      label: 'Consignee Contact',
      value: data.consigneeContact,
      field: 'consigneeContact',
    },
    
    // Cargo Details
    {
      label: 'Cargo Description',
      value: data.cargoDescription,
      field: 'cargoDescription',
    },
    {
      label: 'Container Number',
      value: data.containerNumber,
      field: 'containerNumber',
    },
    {
      label: 'Weight',
      value: `${data.weight} ${data.weightUnit}`,
      field: 'weight',
    },
    {
      label: 'Volume',
      value: `${data.volume} ${data.volumeUnit}`,
      field: 'volume',
    },
    
    // Shipping Details
    {
      label: 'Port of Loading',
      value: data.portOfLoading,
      field: 'portOfLoading',
    },
    {
      label: 'Port of Discharge',
      value: data.portOfDischarge,
      field: 'portOfDischarge',
    },
    {
      label: 'Vessel Name',
      value: data.vesselName || 'N/A',
      field: 'vesselName',
    },
    {
      label: 'Voyage Number',
      value: data.voyageNumber || 'N/A',
      field: 'voyageNumber',
    },
    {
      label: 'Booking Number',
      value: data.bookingNumber,
      field: 'bookingNumber',
    },
    
    // Dates
    {
      label: 'Cargo Ready Date',
      value: data.cargoReadyDate,
      field: 'cargoReadyDate',
    },
    {
      label: 'Requested Ship Date',
      value: data.requestedShipDate,
      field: 'requestedShipDate',
    },
  ];

  return (
    <div
      className="bg-[#18181B] rounded-lg overflow-hidden border border-[#52525B]"
      data-testid="data-summary-table"
    >
      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#27272A]/50">
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-[#FFFFFF]"
                scope="col"
              >
                Field
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-[#FFFFFF]"
                scope="col"
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.field}
                className={`${
                  index % 2 === 0 ? 'bg-[#18181B]' : 'bg-[#27272A]/30'
                } hover:bg-[#27272A]/50 transition-colors ${
                  isModified(row.field) ? 'bg-[#A855F7]/10' : ''
                }`}
                data-testid={`table-row-${row.field}`}
              >
                <td className="px-4 py-3 text-sm text-[#A1A1AA] font-medium">
                  {row.label}
                  {isModified(row.field) && (
                    <span
                      className="ml-2 text-xs text-[#A855F7]"
                      aria-label="Modified field"
                    >
                      (Modified)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-[#FFFFFF]">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden divide-y divide-[#52525B]">
        {rows.map((row) => (
          <div
            key={row.field}
            className={`p-4 ${isModified(row.field) ? 'bg-[#A855F7]/10' : ''}`}
            data-testid={`card-${row.field}`}
          >
            <div className="text-sm text-[#A1A1AA] font-medium mb-1">
              {row.label}
              {isModified(row.field) && (
                <span className="ml-2 text-xs text-[#A855F7]">
                  (Modified)
                </span>
              )}
            </div>
            <div className="text-sm text-[#FFFFFF]">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
