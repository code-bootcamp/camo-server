import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class FileService {
  async upload({ files }) {
    // 구글 스토리지에 파일 업로드

    const waitedFiles = await Promise.all(files);

    const bucket = 'team04-stotage';
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: 'reflected-jet-360811-402430377c02.json',
    }).bucket(bucket);

    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${el.filename}`))
              .on('error', () => reject('실패'));
          }),
      ),
    );
    return results;
  }
}
