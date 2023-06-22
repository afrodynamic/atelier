import { faker } from '@faker-js/faker';

export const validateImageURL = async(url: string): Promise<boolean> => {
  const excludedUrls = ['input.photos', 'more photos', 'a'];

  if (!url || excludedUrls.includes(url)) {
    return false;
  }

  url = url.replace('http://', 'https://');

  try {
    const response = await fetch(url, { method: 'HEAD' });

    if (!response.ok) {
      return false;
    }

    const contentType = response.headers.get('Content-Type');

    if (!contentType?.startsWith('image/')) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const validateImages = async(
  images: { url: string; thumbnail_url?: string | undefined }[]
): Promise<{ url: string; thumbnail_url?: string | undefined }[]> => {
  const validatedImages = await Promise.all(
    images.map(async(image) => {
      const isValidImageUrl = await validateImageURL(image.url);
      const isValidThumbnailUrl =
        !image.thumbnail_url ||
        (image.thumbnail_url && (await validateImageURL(image.thumbnail_url)));

      if (isValidImageUrl && isValidThumbnailUrl) {
        return image;
      } else {
        const validImageUrl = isValidImageUrl ? image.url : faker.image.url();
        const validThumbnailUrl =
          isValidThumbnailUrl || !image.thumbnail_url
            ? image.thumbnail_url
            : faker.image.url();

        return {
          url: validImageUrl,
          thumbnail_url: validThumbnailUrl,
        };
      }
    })
  );

  return validatedImages;
};
