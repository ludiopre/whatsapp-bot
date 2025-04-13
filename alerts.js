const nodemailer = require('nodemailer');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./google-credentials.json'); // Archivo JSON que subiste

// === CONFIGURACIÓN DE CORREO ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tucorreo@gmail.com',         // Reemplaza con tu correo real
    pass: 'neijpaurhyppbfwj'            // Tu clave de aplicación de Gmail
  }
});

// === CONFIGURACIÓN DE HOJA DE CÁLCULO ===
const SHEET_ID = 'https://docs.google.com/spreadsheets/d/1KbbnY6AxQZru5tBxJFLlsuNziWQAVlSn-Iks_ytQkA0/edit?gid=0#gid=0'; // reemplaza con el ID real de tu hoja
const doc = new GoogleSpreadsheet(SHEET_ID);

exports.enviarAlerta = async (numero, mensaje) => {
  const fecha = new Date().toLocaleString();

  // === ENVÍA CORREO ===
  const mailOptions = {
    from: 'tucorreo@gmail.com',
    to: 'tucorreo@gmail.com',
    subject: '🚨 Cliente interesado en comprar',
    text: `📱 Número: ${numero}\n💬 Mensaje: ${mensaje}\n🕒 Fecha y hora: ${fecha}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error al enviar correo:', error);
    } else {
      console.log('✅ Correo de alerta enviado:', info.response);
    }
  });

  // === AGREGA A GOOGLE SHEETS ===
  try {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({
      'Número': numero,
      'Mensaje': mensaje,
      'Fecha y hora': fecha
    });
    console.log('✅ Cliente registrado en la hoja');
  } catch (err) {
    console.error('❌ Error al escribir en Google Sheets:', err);
  }
};

