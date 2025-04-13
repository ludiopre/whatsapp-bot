const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tucorreo@gmail.com', // ← reemplaza con tu correo real
    pass: 'neijpaurhyppbfwj'     // ← tu clave de aplicación SIN espacios
  }
});

exports.enviarAlerta = (numero, mensaje) => {
  const mailOptions = {
    from: 'tucorreo@gmail.com',
    to: 'tucorreo@gmail.com', // puedes poner más correos separados por coma
    subject: '🚨 Cliente interesado en comprar',
    text: `📦 Cliente interesado\n\n📱 Número: ${numero}\n💬 Mensaje: ${mensaje}\n🕒 Hora: ${new Date().toLocaleString()}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error al enviar alerta:', error);
    } else {
      console.log('✅ Alerta enviada:', info.response);
    }
  });
};
