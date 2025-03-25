export function blobToBase64(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export async function urlToFile(url: string): Promise<File> {
  // Fetch the image data as a blob
  const response = await fetch(url);
  const blob = await response.blob();

  // Create a unique filename for the file
  const fileName = url.split("/").pop() || "image";

  // Create a File object from the blob
  const file = new File([blob], fileName, { type: blob.type });

  return file;
}
