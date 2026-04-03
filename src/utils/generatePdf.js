/**
 * PDF Generation for Appointment Confirmation
 * FLOW-APPT-003: Generate downloadable confirmation PDF
 *
 * Uses browser-native approach (no external PDF library):
 * - Renders confirmation HTML in a hidden iframe
 * - Triggers window.print() for PDF save
 *
 * For server-side PDF generation, use the Edge Function approach instead.
 */

/**
 * Generate and trigger download of an appointment confirmation PDF.
 * @param {object} appointment - Appointment data
 * @param {string} appointment.refNumber - Reference number
 * @param {string} appointment.patientName - Patient name
 * @param {string} appointment.service - Service name
 * @param {string} appointment.date - Appointment date
 * @param {string} appointment.time - Appointment time
 * @param {string} appointment.doctorName - Doctor name (optional)
 */
export function generateAppointmentPdf(appointment) {
  const {
    refNumber = 'N/A',
    patientName = 'Patient',
    service = 'Dental Service',
    date = 'TBD',
    time = 'TBD',
    doctorName = 'Dr. Arman Hossain (Rafi)',
  } = appointment;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Appointment Confirmation - ${refNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0A1628; padding: 40px; }
        .header { text-align: center; border-bottom: 3px solid #00BFA6; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: 800; color: #00BFA6; }
        .subtitle { font-size: 14px; color: #666; margin-top: 4px; }
        .title { font-size: 20px; font-weight: 700; margin: 20px 0 10px; color: #0A1628; }
        .ref { font-size: 16px; color: #00BFA6; font-weight: 600; }
        .details { background: #F8FAFC; border-radius: 12px; padding: 24px; margin: 20px 0; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E2E8F0; }
        .row:last-child { border-bottom: none; }
        .label { font-weight: 600; color: #64748B; font-size: 14px; }
        .value { font-weight: 500; color: #0A1628; font-size: 14px; }
        .notice { background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #92400E; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 20px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Everyday Dental Surgery</div>
        <div class="subtitle">& Implant Center</div>
      </div>

      <div class="title">Appointment Confirmation</div>
      <div class="ref">Reference: ${refNumber}</div>

      <div class="details">
        <div class="row">
          <span class="label">Patient Name</span>
          <span class="value">${patientName}</span>
        </div>
        <div class="row">
          <span class="label">Service</span>
          <span class="value">${service}</span>
        </div>
        <div class="row">
          <span class="label">Date</span>
          <span class="value">${date}</span>
        </div>
        <div class="row">
          <span class="label">Time</span>
          <span class="value">${time}</span>
        </div>
        <div class="row">
          <span class="label">Doctor</span>
          <span class="value">${doctorName}</span>
        </div>
        <div class="row">
          <span class="label">Status</span>
          <span class="value" style="color: #00BFA6;">Confirmed</span>
        </div>
      </div>

      <div class="notice">
        <strong>Important:</strong> Please arrive 15 minutes before your appointment time.
        Bring this confirmation and any relevant medical records. If you need to cancel
        or reschedule, please do so at least 24 hours in advance through your patient dashboard.
      </div>

      <div class="footer">
        <p>Everyday Dental Surgery & Implant Center</p>
        <p>Dhanmondi, Dhaka, Bangladesh</p>
        <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </body>
    </html>
  `;

  // Open print dialog for PDF save
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Slight delay to ensure content is rendered
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}
