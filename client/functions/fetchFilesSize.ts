export default async function fetchFileSizesS3(userId: string | undefined) {
  try {
    const response = await fetch(`http://13.60.182.170/:3000/api/${userId}/file-details`);
    const data = await response.json()
    const appSizeInBytes = data.appSize;
    return appSizeInBytes;
  } catch (err) {
    console.error(err);
  }
}