import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage } from '@capacitor/storage';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Photo } from 'src/app/interfaces/interfaces';

@Injectable({
    providedIn: 'root',
})
export class PhotoService {
    public photos: Photo[] = [];
    private PHOTO_STORAGE: string = 'photos';

    constructor(private platform: Platform) {}

    public async readAsBase64(cameraPhoto) {
        // "hybrid" will detect Cordova or Capacitor
        if (this.platform.is('hybrid')) {
            // Read the file into base64 format
            const file = await Filesystem.readFile({
                path: cameraPhoto.path,
            });

            return file.data;
        } else {
            // Fetch the photo, read as a blob, then convert to base64 format
            const response = await fetch(cameraPhoto.webPath!);
            const blob = await response.blob();

            return (await this.convertBlobToBase64(blob)) as string;
        }
    }

    private async savePicture(cameraPhoto) {
        // Convert photo to base64 format, required by Filesystem API to save
        const base64Data = await this.readAsBase64(cameraPhoto);
        /* this.foto= base64Data.slice(22,); */

        //this.foto = base64Data;

        // Write the file to the data directory
        const fileName = new Date().getTime() + '.jpeg';
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        if (this.platform.is('hybrid')) {
            // Display the new image by rewriting the 'file://' path to HTTP
            // Details: https://ionicframework.com/docs/building/webview#file-protocol
            return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
            };
        } else {
            // Use webPath to display the new image instead of base64 since it's
            // already loaded into memory
            return {
                filepath: fileName,
                webviewPath: cameraPhoto.webPath,
            };
        }
    }

    public async addNewToCamera() {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 50,
        });

        const response = await fetch(capturedPhoto.webPath!);
        const blob = await response.blob();
        return (await this.convertBlobToBase64(blob)) as string;
    }

    public async addNewToGallery() {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos,
            quality: 50,
        });

        const savedImageFile = await this.savePicture(capturedPhoto);
        // const response = await fetch(capturedPhoto.webPath!);
        // const blob = await response.blob();
        // return (await this.convertBlobToBase64(blob)) as string;
    }

    convertBlobToBase64 = (blob: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
}
