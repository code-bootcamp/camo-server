import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async upload({ files }) {
    // 구글 스토리지에 파일 업로드

    const waitedFiles = await Promise.all(files);
    const bucket = 'team04-storage';
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.BUCKET_KEYFILENAME,
    }).bucket(bucket);

    const results = await Promise.all(
      waitedFiles.map(
        (files) =>
          new Promise((resolve, reject) => {
            const fname = `${uuidv4()}/${files.filename}`;
            files
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
