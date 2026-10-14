import * as Print from 'expo-print';
import { Alert } from 'react-native';

export interface CuttingChitData {
  orderNumber?: string;
  customerName: string;
  phone: string;
  area?: string;
  garmentType: string;
  deliveryDate?: string;
  notes?: string;
  measurements: Record<string, string | number>;
  unit?: 'inch' | 'cm';
}

export const MEASUREMENT_LABELS_URDU: Record<string, string> = {
  'Length': 'لمبائی',
  'Kameez Length': 'قمیض لمبائی',
  'Chest': 'چھاتی',
  'Shoulder': 'تیرا',
  'Sleeves': 'بازو',
  'Sleeve': 'بازو',
  'Collar': 'بین / گلا',
  'Neck': 'گلا',
  'Daman': 'دامن',
  'Bottom (Ghaer)': 'دامن / گھیر',
  'Waist': 'کمر',
  'Hip': 'کولہا',
  'Shalwar Length': 'شلوار لمبائی',
  'Pancha': 'پائینچہ',
  'Shirt Length': 'شرٹ لمبائی',
  'Pant Length': 'پینٹ لمبائی',
  'Coat Length': 'کوٹ لمبائی',
  'Trouser Length': 'ٹراؤزر لمبائی',
};

export async function printCuttingChit(data: CuttingChitData): Promise<boolean> {
  const unit = data.unit || 'in';
  const orderNum = data.orderNumber || `TF-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const measurementRows = Object.entries(data.measurements)
    .filter(([_, val]) => val !== undefined && val !== null && String(val).trim() !== '')
    .map(([key, val]) => {
      const urduLabel = MEASUREMENT_LABELS_URDU[key] || '';
      return `
        <tr>
          <td style="padding: 7px 4px; border-bottom: 1px dashed #444; font-size: 14px; font-weight: bold;">
            ${key} ${urduLabel ? `<span style="font-size: 13px; color: #333; margin-left: 4px;">(${urduLabel})</span>` : ''}
          </td>
          <td style="padding: 7px 4px; border-bottom: 1px dashed #444; font-size: 18px; font-weight: 900; text-align: right; letter-spacing: 0.5px;">
            ${val} <span style="font-size: 13px; font-weight: normal;">${unit}</span>
          </td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: auto; margin: 6mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 8px;
            color: #000;
            background: #fff;
            max-width: 320px;
            margin: auto;
          }
          .chit-box {
            border: 2px solid #000;
            padding: 10px;
            border-radius: 6px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 6px;
          }
          .title {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 1px;
            margin: 0;
          }
          .urdu-title {
            font-size: 16px;
            font-weight: bold;
            margin: 2px 0 0 0;
          }
          .meta-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: bold;
            margin-top: 6px;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
          }
          .customer-info {
            padding: 8px 0;
            border-bottom: 1.5px solid #000;
            font-size: 13px;
          }
          .cust-name {
            font-size: 17px;
            font-weight: 900;
            margin-bottom: 3px;
          }
          .table-title {
            font-size: 13px;
            font-weight: 900;
            text-align: center;
            background: #000;
            color: #fff;
            padding: 4px;
            margin: 8px 0 4px 0;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          .notes-box {
            margin-top: 10px;
            padding: 8px;
            border: 1.5px dashed #000;
            background: #f7f7f7;
            font-size: 13px;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 11px;
            font-weight: bold;
            color: #444;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="chit-box">
          <div class="header">
            <h1 class="title">TAILORFLOW</h1>
            <div class="urdu-title">کٹنگ پَرچی (CUTTING SLIP)</div>
          </div>

          <div class="meta-row">
            <span>ORDER: #${orderNum}</span>
            <span>DATE: ${dateStr}</span>
          </div>

          <div class="customer-info">
            <div class="cust-name">${data.customerName || 'Walk-in Customer'}</div>
            <div><strong>Phone:</strong> ${data.phone || '—'} ${data.area ? `· <strong>Area:</strong> ${data.area}` : ''}</div>
            <div style="margin-top: 3px;"><strong>Garment:</strong> ${data.garmentType}</div>
            ${data.deliveryDate ? `<div style="margin-top: 3px; color: #b91c1c;"><strong>Delivery Promised:</strong> ${data.deliveryDate}</div>` : ''}
          </div>

          <div class="table-title">
            MEASUREMENTS (${unit.toUpperCase()}) / ناپ
          </div>

          <table>
            <tbody>
              ${measurementRows.length > 0 ? measurementRows : '<tr><td colspan="2" style="padding: 10px; text-align: center;">No measurements recorded</td></tr>'}
            </tbody>
          </table>

          ${data.notes ? `
            <div class="notes-box">
              <strong>Style & Cut Notes (ڈیزائن):</strong><br>
              ${data.notes}
            </div>
          ` : ''}

          <div class="footer">
            Pin to fabric bundle · Ahmed Tailors
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await Print.printAsync({ html });
    return true;
  } catch (err: any) {
    Alert.alert('Print Error', err?.message || 'Could not connect to printer.');
    return false;
  }
}
