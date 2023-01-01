import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface IPhoto {
    base64?: string;
    webPath?: string;
  }

export function usePhotoGallery() {
    
    var photo : IPhoto = {base64: ''}

    const takePhoto = async () => {
      const photoResult = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        quality: 100,
        allowEditing: false,
        promptLabelHeader: 'Hình ảnh',
        promptLabelPhoto: 'Chọn từ thư viện',
        promptLabelPicture: 'Chụp ảnh'
      });
      photo.base64 = photoResult?.base64String
    };

    const chooseFromGallery = async () => {
      const photoResult = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        quality: 100,
        allowEditing: false,
      });
      photo.webPath = photoResult?.webPath
    };
  
    return {
      photo,
      takePhoto, 
      chooseFromGallery
    };
  }

  // export async function base64FromPath(path: string): Promise<string> {
  //   const response = await fetch(path);
  //   const blob = await response.blob();
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onerror = reject;
  //     reader.onload = () => {
  //       if (typeof reader.result === 'string') {
  //         resolve(reader.result);
  //       } else {
  //         reject('method did not return a string');
  //       }
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // }