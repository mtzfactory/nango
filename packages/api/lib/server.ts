import express from 'express';
import path from 'path';
import url from 'url';

const PORT = process.env['PORT'] || 5000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), '..');

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (_: any, res: any) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
