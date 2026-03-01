/**
 * utils/certGenerator.js
 * ─────────────────────────────────────────────────────────
 * Genera el HTML del certificado y abre la ventana de impresión.
 *
 * NOTA PARA PRODUCCIÓN:
 * En un entorno real, la generación del PDF debería ocurrir
 * en el backend (con puppeteer, pdfkit o weasyprint) para:
 *   - Garantizar consistencia visual entre sistemas operativos
 *   - Poder almacenar los PDFs en S3/GCS
 *   - Evitar depender de las capacidades de impresión del navegador
 *
 * El backend devolvería la URL del PDF para descarga directa.
 * ─────────────────────────────────────────────────────────
 */

const METHOD_LABELS = {
  borrado_logico: "Borrado lógico",
  trituracion:    "Trituración física",
  otros:          "Otros",
};

/**
 * Construye el HTML completo del certificado.
 * @param {Object} collection  - Datos de la recogida
 * @param {Object} client      - Datos del cliente
 * @param {string} certId      - Número único del certificado
 * @param {string} issued      - Fecha de emisión (YYYY-MM-DD)
 * @returns {string} HTML listo para imprimir
 */
export function buildCertificateHtml(collection, client, certId, issued) {
  const deviceRows = collection.devices.map((d, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><b>${d.brand}</b></td>
      <td>${d.model}</td>
      <td class="mono">${d.serial || "—"}</td>
      <td>
        <span class="pill ${d.method === "trituracion" ? "pill-blue" : ""}">
          ${METHOD_LABELS[d.method] || d.method}
        </span>
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Certificado ${certId}</title>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600&family=Outfit:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Outfit', sans-serif; background: #f0f2f5; color: #0d1117; padding: 30px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { background: #fff; max-width: 760px; margin: 0 auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 40px rgba(0,0,0,.12); }
    .hdr { background: #07080d; color: #fff; padding: 32px 38px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16; }
    .brand h1 { font-family: 'Fraunces', serif; font-weight: 300; font-size: 24px; letter-spacing: -.5px; }
    .brand p { color: rgba(255,255,255,.38); font-size: 11px; margin-top: 3px; letter-spacing: .4px; }
    .cert-id { text-align: right; }
    .cert-id .lbl { font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,.3); }
    .cert-id .val { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #00c896; margin-top: 4px; }
    .strip { background: #00c896; color: #07080d; text-align: center; padding: 9px; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
    .body { padding: 34px 38px; }
    .sec { margin-bottom: 24px; }
    .sec h3 { font-size: 9px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #64748b; margin-bottom: 10px; padding-bottom: 7px; border-bottom: 1px solid #e9ecef; }
    .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .f label { display: block; font-size: 10px; color: #94a3b8; margin-bottom: 2px; }
    .f span { font-size: 13px; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { text-align: left; padding: 8px 11px; font-size: 9px; text-transform: uppercase; letter-spacing: .5px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e9ecef; background: #f8fafc; }
    td { padding: 9px 11px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    .mono { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #64748b; }
    .pill { display: inline-block; background: #ecfdf5; color: #059669; padding: 1px 7px; border-radius: 99px; font-size: 10px; font-weight: 600; }
    .pill-blue { background: #eff6ff; color: #2563eb; }
    .foot { margin-top: 28px; padding-top: 22px; border-top: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: flex-end; }
    .sig { text-align: center; }
    .sig-box { width: 150px; height: 52px; border: 1px dashed #cbd5e1; border-radius: 7px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; }
    .sig-text { font-family: 'Fraunces', serif; font-size: 18px; font-style: italic; opacity: .4; font-weight: 300; }
    .sig-lbl { font-size: 9px; color: #94a3b8; letter-spacing: .5px; text-transform: uppercase; }
    .note { max-width: 260px; font-size: 10px; color: #94a3b8; line-height: 1.6; }
    @media print { body { padding: 0; background: #fff; } .page { border-radius: 0; box-shadow: none; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="hdr">
      <div class="brand">
        <h1>TECHNØLÉ</h1>
        <p>Gestión de Residuos Electrónicos · RAEE</p>
      </div>
      <div class="cert-id">
        <div class="lbl">Certificado</div>
        <div class="val">${certId}</div>
      </div>
    </div>
    <div class="strip">Certificado de destrucción y gestión de residuos electrónicos</div>
    <div class="body">
      <div class="sec">
        <h3>Datos del cliente</h3>
        <div class="g2">
          <div class="f"><label>Empresa</label><span>${client.name}</span></div>
          <div class="f"><label>NIF / CIF</label><span>${client.nif}</span></div>
          <div class="f"><label>Contacto</label><span>${client.contact}</span></div>
          <div class="f"><label>Email</label><span>${client.email}</span></div>
        </div>
      </div>
      <div class="sec">
        <h3>Datos de la recogida</h3>
        <div class="g2">
          <div class="f"><label>Fecha de recogida</label><span>${collection.date}</span></div>
          <div class="f"><label>Fecha de emisión</label><span>${issued}</span></div>
          <div class="f"><label>Dirección</label><span>${collection.address}</span></div>
          <div class="f"><label>Técnico responsable</label><span>${collection.technician}</span></div>
          <div class="f"><label>Tipo de servicio</label><span>${collection.serviceType}</span></div>
        </div>
      </div>
      <div class="sec">
        <h3>Dispositivos gestionados (${collection.devices.length} unidades)</h3>
        <table>
          <thead>
            <tr><th>#</th><th>Marca</th><th>Modelo</th><th>N.º serie</th><th>Método</th></tr>
          </thead>
          <tbody>${deviceRows}</tbody>
        </table>
      </div>
      <div class="foot">
        <div class="note">
          Certificado emitido conforme a la Directiva 2012/19/UE sobre residuos de
          aparatos eléctricos y electrónicos (RAEE) y la legislación española vigente.
        </div>
        <div class="sig">
          <div class="sig-box"><span class="sig-text">TECHNØLÉ</span></div>
          <div class="sig-lbl">Firma y sello</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Abre el certificado en una nueva pestaña y lanza la impresión.
 */
export function openCertificatePrint(collection, client, certId, issued) {
  const html = buildCertificateHtml(collection, client, certId, issued);
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 800);
}
