import * as fs from 'fs';

export const removeImage = (path: any) => {
  try {
    fs.unlinkSync(path);
    return true;
  } catch (err) {
    console.error(err);
  }
};
