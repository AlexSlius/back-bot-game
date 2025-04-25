import { Controller, Post, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { join } from 'path';
import { Request } from 'express';

const uploadPath = join(process.cwd(), 'uploads');

@Controller()
export class UploadController {

    @Post('image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: uploadPath,
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;

                callback(null, fileName);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
            }

            callback(null, true);
        },
    }))

    uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        const host = `${req.protocol}://${req.get('host')}`;

        return {
            data: {
                filename: file.filename,
                url: `${host}/uploads/${file.filename}`,
            }
        };
    }
}