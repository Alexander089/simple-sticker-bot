const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, MessageMedia ,LocalAuth, Buttons, GroupChat, Util } = require('whatsapp-web.js');
const mime = require('mime-types');
const path = require('path');
const fetch = require('node-fetch');

const client = new Client({
        puppeteer: { args: ["--no-sandbox"] },
        authStrategy: new LocalAuth()
    });

client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

client.on('message', async message => {
        const from = message.from;
        const cutted = from.split('@');
        let chat = await message.getChat();
        chat.sendSeen();
        
        if(message.body === '-sticker'){
                if(message.hasMedia){
                    message.downloadMedia().then(media => {
    
                        if (media) {
            
                            const mediaPath = './downloaded-media/';
            
                            if (!fs.existsSync(mediaPath)) {
                                fs.mkdirSync(mediaPath);
                            }
            
                            const extension = mime.extension(media.mimetype);
            
                            const filename = new Date().getTime();
            
                            const fullFilename = mediaPath + filename + '.' + extension;
            
                            // Save to file
                            try {
                                fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
                                console.log('[CONSOLE] > File downloaded successfully!', fullFilename);
                                MessageMedia.fromFilePath(filePath = fullFilename)
                                message.reply('Mohon diingat, Semua kemarahan dan kebencian diluar tanggung jawab saya :v');
                                client.sendMessage(message.from, new MessageMedia(media.mimetype, media.data, filename), { sendMediaAsSticker: true,stickerAuthor:"Created By Alex55000",stickerName:"Stickers"} )
                                fs.unlinkSync(fullFilename)
                                console.log(`[CONSOLE] > File Deleted successfully!`,);
                            } catch (err) {
                                console.log('[CONSOLE] > Failed to save the file:', err);
                                console.log(`[CONSOLE] > File Deleted successfully!`,);
                            }
                        }
                    });
                }
            }
        })

client.on('ready', () => {
        console.log('Client is ready!');
    });
    
client.initialize();
