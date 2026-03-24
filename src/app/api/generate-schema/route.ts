import { NextRequest, NextResponse } from "next/server";

const SCHEMAS: Record<string, object> = {
  invoice: {
    type: "object",
    properties: {
      invoice_number: { type: "string", description: "The unique invoice identifier" },
      invoice_date: { type: "string", description: "The date the invoice was issued" },
      due_date: { type: "string", description: "The payment due date" },
      po_number: { type: "string", description: "Associated purchase order number" },
      vendor_name: { type: "string", description: "Name of the vendor/seller" },
      bill_to_name: { type: "string", description: "Name of the billing recipient organization" },
      subtotal: { type: "number", description: "Subtotal amount before tax and shipping" },
      tax_amount: { type: "number", description: "Total tax amount" },
      shipping: { type: "number", description: "Shipping cost" },
      total_due: { type: "number", description: "Total amount due for payment" },
      line_items: {
        type: "array",
        description: "List of items on the invoice",
        items: {
          type: "object",
          properties: {
            description: { type: "string", description: "Product or service description" },
            quantity: { type: "number", description: "Number of units" },
            unit_price: { type: "number", description: "Price per unit" },
            amount: { type: "number", description: "Line item total" },
          },
        },
      },
    },
  },
  prescription: {
    type: "object",
    properties: {
      clinic_name: { type: "string", description: "Name of the medical clinic" },
      doctor_name: { type: "string", description: "Full name of the prescribing physician" },
      doctor_license: { type: "string", description: "Doctor's license or DEA number" },
      patient_name: { type: "string", description: "Full name of the patient" },
      patient_dob: { type: "string", description: "Patient date of birth" },
      prescription_date: { type: "string", description: "Date the prescription was written" },
      diagnosis: { type: "string", description: "Diagnosis or condition" },
      allergies: { type: "string", description: "Known patient allergies" },
      medications: {
        type: "array",
        description: "List of prescribed medications",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Medication name and strength" },
            dosage: { type: "string", description: "Dosage instructions (sig)" },
            quantity: { type: "string", description: "Quantity to dispense" },
            refills: { type: "string", description: "Number of refills authorized" },
          },
        },
      },
    },
  },
  lab_report: {
    type: "object",
    properties: {
      lab_name: { type: "string", description: "Name of the laboratory" },
      report_number: { type: "string", description: "Unique lab report identifier" },
      report_date: { type: "string", description: "Date results were reported" },
      patient_name: { type: "string", description: "Full name of the patient" },
      patient_dob: { type: "string", description: "Patient date of birth" },
      ordering_physician: { type: "string", description: "Doctor who ordered the tests" },
      collection_date: { type: "string", description: "Date specimen was collected" },
      test_results: {
        type: "array",
        description: "Individual test results",
        items: {
          type: "object",
          properties: {
            test_name: { type: "string", description: "Name of the lab test" },
            result: { type: "string", description: "Test result value" },
            units: { type: "string", description: "Unit of measurement" },
            reference_range: { type: "string", description: "Normal reference range" },
            flag: { type: "string", description: "Normal, HIGH, or LOW" },
          },
        },
      },
    },
  },
  purchase_order: {
    type: "object",
    properties: {
      po_number: { type: "string", description: "Purchase order number" },
      po_date: { type: "string", description: "Date the PO was issued" },
      required_by: { type: "string", description: "Required delivery date" },
      buyer_name: { type: "string", description: "Buyer organization name" },
      vendor_name: { type: "string", description: "Vendor/supplier name" },
      ship_to: { type: "string", description: "Shipping destination address" },
      total: { type: "number", description: "Total estimated amount" },
      payment_terms: { type: "string", description: "Payment terms" },
      line_items: {
        type: "array",
        description: "Ordered items",
        items: {
          type: "object",
          properties: {
            description: { type: "string", description: "Item description" },
            quantity: { type: "number", description: "Quantity ordered" },
            unit_price: { type: "number", description: "Price per unit" },
            total: { type: "number", description: "Line total" },
          },
        },
      },
    },
  },
  resume: {
    type: "object",
    properties: {
      full_name: { type: "string", description: "Candidate full name" },
      email: { type: "string", description: "Email address" },
      phone: { type: "string", description: "Phone number" },
      summary: { type: "string", description: "Professional summary" },
      skills: { type: "string", description: "Key skills" },
      experience: {
        type: "array",
        description: "Work experience",
        items: {
          type: "object",
          properties: {
            company: { type: "string", description: "Company name" },
            title: { type: "string", description: "Job title" },
            duration: { type: "string", description: "Employment period" },
          },
        },
      },
      education: {
        type: "array",
        description: "Education history",
        items: {
          type: "object",
          properties: {
            institution: { type: "string", description: "School or university" },
            degree: { type: "string", description: "Degree or certification" },
            year: { type: "string", description: "Graduation year" },
          },
        },
      },
    },
  },
  generic: {
    type: "object",
    properties: {
      document_type: { type: "string", description: "Type of document" },
      title: { type: "string", description: "Document title or heading" },
      date: { type: "string", description: "Primary date on the document" },
      from_party: { type: "string", description: "Sender or issuing party" },
      to_party: { type: "string", description: "Recipient or addressed party" },
      summary: { type: "string", description: "Brief summary of content" },
      key_values: {
        type: "array",
        description: "Important data points found in the document",
        items: {
          type: "object",
          properties: {
            label: { type: "string", description: "Field label or name" },
            value: { type: "string", description: "Extracted value" },
          },
        },
      },
    },
  },
};

function detectDocumentType(filename: string): string {
  const lower = filename.toLowerCase();
  if (/invoice|inv[-_]|bill/.test(lower)) return "invoice";
  if (/prescription|rx|script/.test(lower)) return "prescription";
  if (/lab|report|result|test|panel|cbc|cmp/.test(lower)) return "lab_report";
  if (/purchase.?order|po[-_]/.test(lower)) return "purchase_order";
  if (/resume|cv|curriculum/.test(lower)) return "resume";
  return "generic";
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { filename } = body;

  const docType = detectDocumentType(filename || "");
  const schema = SCHEMAS[docType] || SCHEMAS.generic;

  return NextResponse.json({ documentType: docType, schema });
}
