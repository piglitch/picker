const hostName = import.meta.env.VITE_REACT_APP_API_URL!

export default async function fetchFileSizesS3(userId: string | undefined) {
  try {
    const response = await fetch(`http://${hostName}/api/${userId}/file-details`);
    const data = await response.json()
    const appSizeInBytes = data.appSize;
    return appSizeInBytes;
  } catch (err) {
    console.error(err);
  }
}