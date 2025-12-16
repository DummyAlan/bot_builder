# User Story: 1 - Upload and Extract SI Data from PDF

**Status:** [x] Phase 1 Complete (UI with Mock Data) | [ ] Phase 2 Pending (API Integration)

**As an** external customer,
**I want** to upload a Shipping Instruction PDF and have the data automatically extracted,
**so that** I can process shipping instructions faster without manual data entry.

## Acceptance Criteria

- [x] User can upload a PDF file containing Shipping Instruction data
- [x] System extracts SI data using a template-based extraction approach (Mock data in Phase 1)
- [x] Extracted fields are populated and displayed in a form
- [x] System supports at least one common SI template format initially
- [x] Upload process provides clear feedback to the user during extraction

## Phase 1 Implementation Summary (Completed)

**Components Created:**
- ✅ Base UI Components: Button, Card, Input
- ✅ Feature Components: UploadProgress, SIUploadZone, SIDataForm
- ✅ Pages: SI Upload page, Updated home page
- ✅ Type definitions and mock data
- ✅ Unit tests for all components
- ✅ Playwright visual tests

**Features Delivered:**
- Drag-and-drop PDF upload with validation
- Mock data extraction simulation with progress indicators
- Read-only form display with all SI fields
- Gaming-themed dark UI with cyan accents
- Responsive design (mobile, tablet, desktop)
- Full test coverage

**Next Steps (Phase 2):**
- Integrate real PDF parsing with pdf-parse library
- Implement API endpoint for extraction
- Add database schema with Prisma
- Implement file storage
- Add real-time validation

## Notes

- Initial implementation will focus on one common template format
- Different customer formats may be supported in future iterations
- Extraction should handle standard SI fields (e.g., shipper, consignee, cargo details, etc.)

