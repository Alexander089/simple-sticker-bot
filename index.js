const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, MessageMedia, LocalAuth, Buttons, GroupChat, Util } = require('whatsapp-web.js');
const mime = require('mime-types');

const client = new Client({
        puppeteer: { args: ["--no-sandbox"] },
        authStrategy: new LocalAuth()
    });

client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

client.on('message', async message => {
        let chat = await message.getChat();
        chat.sendSeen();
        
        if(message.body === '#sticker'){
                if(message.hasMedia){
                    message.downloadMedia().then(media => {
                        if (media) {
                            const mediaPath = './mediaPath/';
                            if (!fs.existsSync(mediaPath)) {
                                fs.mkdirSync(mediaPath);
                            }
                            const extension = mime.extension(media.mimetype);
                            const filename = new Date().getTime();
                            const filename1 = mediaPath + filename + '.' + extension;
                            try {
                                fs.writeFileSync(filename1, media.data, {encoding: 'base64'});
                                MessageMedia.fromFilePath(filePath = filename1)
                                client.sendMessage(message.from, new MessageMedia(media.mimetype, media.data, filename), {sendMediaAsSticker: true,stickerAuthor:"BotWA",stickerName:"Sticker"})
                                fs.unlinkSync(filename1)
                            } catch (err) {
                                console.log(err);
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
