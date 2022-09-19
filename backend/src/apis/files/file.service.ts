import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { getToday } from 'src/commons/libraries/utils';

@Injectable()
export class FileService {
  async upload({ files }) {
    const waitedFiles = await Promise.all(files);
    const bucket = 'team04-storage';

    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.BUCKET,
    }).bucket(bucket);

    const fileType = files.mimetype.split('/')[0];
    if (fileType !== 'image') {
      throw new UnprocessableEntityException('이미지 파일이 아닙니다.');
    }
    const results = await Promise.all(
      waitedFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const fname = `${getToday()}/${uuidv4()}/origin/${file.filename}`;
            file
              .createReadStream()
              .pipe(storage.file(fname).createWriteStream())
              .on('finish', () => resolve(`${fname}`))
              .on('error', () => reject('실패'));
          }),
      ),
    );
    return results;
  }
}
