import {
  listAll,
  ref,
  uploadBytesResumable,
  getMetadata,
  StorageReference,
  deleteObject,
} from "firebase/storage";
import { firebaseStorage } from "../config/firebase";
import { v4 } from "uuid";

export const uploadDocumentFromStudent = async (
  file: File,
  projectId: string,
  documentId: string
) => {
  try {
    const pathName = `projectDocument/${projectId}/${documentId}/${file.name}`;
    const fileRef = ref(firebaseStorage, pathName);
    const metadata = { contentType: file.type };
    const uploadTask = await uploadBytesResumable(fileRef, file, metadata);
    if (uploadTask.state === "success") return uploadTask.metadata.fullPath;
    else return null;
  } catch (error) {
    return null;
  }
};

export const deleteDocumentFromStudent = async (
  projectId: string,
  documentId: string
) => {
  try {
    const pathName = `projectDocument/${projectId}/${documentId}/`;
    const fileRef = ref(firebaseStorage, pathName);
    const files = listAll(fileRef).then((res) => {
      // Delete all the files in the folder
      const promises = res.items.map((item) => deleteObject(item));
      // Wait for all the promises to complete
      return Promise.all(promises);
    });
    return true;
  } catch (error) {
    return null;
  }
};

export const getDocumentFromStorage = async (
  projectId: string,
  documentId: string
) => {
  try {
    const pathName = `projectDocument/${projectId}/${documentId}/`;
    const fileRef = ref(firebaseStorage, pathName);
    const files = (await listAll(fileRef)) as any;
    return files.items;
  } catch (error) {
    return [];
  }
};
