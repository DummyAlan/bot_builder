import { NextRequest, NextResponse } from 'next/server';
import { irisValidator } from '@/lib/validation/iris-rules';
import { ExtractedSIData } from '@/types/si-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, applyAutoFix = true } = body;

    // Validate request
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing SI data',
          code: 'INVALID_DATA',
        },
        { status: 400 }
      );
    }

    // Validate the SI data
    const validationResult = await irisValidator.validateForIRIS(data as ExtractedSIData);

    // Return validation results
    return NextResponse.json({
      success: true,
      result: validationResult,
      data: applyAutoFix ? {
        ...data,
        validationResult: {
          isValid: validationResult.isValid,
          validatedAt: new Date().toISOString(),
          autoFixesApplied: validationResult.autoFixes.length,
        },
      } : data,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_FAILED',
      },
      { status: 500 }
    );
  }
}
