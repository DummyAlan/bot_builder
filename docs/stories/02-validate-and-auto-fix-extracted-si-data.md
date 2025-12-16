# User Story: 2 - Validate and Auto-fix Extracted SI Data

**As an** external customer,
**I want** the system to automatically validate and fix issues in my extracted SI data,
**so that** I can avoid common errors and speed up the submission process.

## Acceptance Criteria

- System validates all extracted SI fields against business rules
- Format mismatches are automatically corrected where possible
- Missing required fields are identified and flagged
- Auto-fix logic handles common data formatting issues (e.g., date formats, address standardization)
- Validation results are clearly communicated to the user
- User is notified which fields were auto-corrected

## Notes

- Auto-fix should be transparent - users should see what was changed
- Some validation errors may require manual intervention if auto-fix is not possible
- Validation rules should align with IRIS API requirements
