import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async upload({ file }) {
    // 구글 스토리지에 파일 업로드

    const waitedFiles = await Promise.all(file);

    const bucket = 'team04-storage';
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.BUCKET_KEYFILENAME,
    }).bucket(bucket);

    const results = await Promise.all(
      waitedFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const fname = `${uuidv4()}/${file.filename}`;
            file
              .createReadStream()
              .pipe(storage.file(fname).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${fname}`))
              .on('error', () => reject('실패'));
          }),
      ),
    );
    return results;
  }
}
