const nodemailer = require('nodemailer');

// Configura tu correo aquí
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tucorreo@gmail.com', // 👈 Cambia esto por tu correo
    pass: 'tu_contraseña_o_clave_de_app' // 👈 Usa clave de aplicación si tienes 2FA
  }
});

exports.enviarAlerta = (numero, mensaje) => {
  const mailOptions = {
    from: 'tucorreo@gmail.com',
    to: 'tucorreo@gmail.com', // 👈 Puedes enviarlo a ti mismo o a varios correos
    subject: '🚨 Cliente interesado en comprar',
    text: `Número: ${numero}\nMensaje: ${mensaje}\nHora: ${new Date().toLocaleString()}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar alerta:', error);
    } else {
      console.log('Alerta enviada:', info.response);
    }
  });
};
