const express = require('express');
const qrcode = require('qrcode-terminal');
const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios').default;
const mime = require('mime-types');


//Guardar Session
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']}
});

//Guardar Session

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de WhatsApp');
});


app.post('/send-pdf', async (req, res) => {
    const { phoneNumber, pdfUrl } = req.body;

    const media = await MessageMedia.fromUrl(pdfUrl);

    client.sendMessage(phoneNumber, media).then(() => {
        res.json({ message: 'Mensaje enviado con éxito' });
    }).catch((error) => {
        res.status(500).json({ error: error.message });
    });

});


app.post('/send-message', (req, res) => {
    const { phoneNumber, message } = req.body;

    client.sendMessage(phoneNumber, message).then(() => {
        res.json({ message: 'Mensaje enviado con éxito' });
    }).catch((error) => {
        res.status(500).json({ error: error.message });
    });
});


client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente de WhatsApp listo!');
});


client.on('message', message => {

    const sender = message.from.split('@')[0]; //Sin el +
    const body = message.body.toLowerCase();

    message.reply("Disculpe, este número no es monitorizado, solo es para notificaciones.");
});


client.initialize();

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
