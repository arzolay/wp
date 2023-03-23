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

//Nuevo

// app.get('/send-image/:number/:imageUrl', async (req, res) => {
//   try {
//     const { number, imageUrl } = req.params;
//     const client = await initWhatsapp();
//     const chatId = `${number}@c.us`;
//     const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//     const imageBase64 = Buffer.from(imageBuffer.data, 'binary').toString('base64');
//     const mimeType = mime.lookup(imageUrl);
//     const dataUri = `data:${mimeType};base64,${imageBase64}`;
//     await client.sendMessage(chatId, new MessageMedia(mimeType, dataUri));
//     res.send('Imagen enviada!');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Ocurrió un error al enviar la imagen');
//   }
// });

// app.post('/send-image', async (req, res) => {

// 	  try {
// 	    const { phoneNumber, imageUrl } = req.body;
// 	    const client = await initWhatsapp();
// 	    const chatId = `${phoneNumber}@c.us`;
// 	    const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
// 	    const imageBase64 = Buffer.from(imageBuffer.data, 'binary').toString('base64');
// 	    const mimeType = mime.lookup(imageUrl);
// 	    const dataUri = `data:${mimeType};base64,${imageBase64}`;
// 	    await client.sendMessage(chatId, new MessageMedia(mimeType, dataUri));
// 	    res.send('Imagen enviada!');
// 	  } catch (error) {
// 	    console.log(error);
// 	    res.status(500).send('Ocurrió un error al enviar la imagen');
// 	  }


// });


//Nuevo

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

client.initialize();

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
