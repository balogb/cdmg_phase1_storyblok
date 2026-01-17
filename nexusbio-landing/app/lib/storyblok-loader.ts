export default function storyblokLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If the image is not from Storyblok, return the original src
  if (!src.includes("a.storyblok.com")) {
    return src;
  }

  // Storyblok Image Service URL structure:
  // https://a.storyblok.com/f/space_id/asset_id/asset_name.jpg/m/widthxheight/filters:quality(q)
  
  // We use the /m/ path to trigger the image service
  const imageService = "/m/";
  const resize = `${width}x0`; // 0 for automatic aspect ratio height
  const filters = quality ? `/filters:quality(${quality}):format(webp)` : "/filters:format(webp)";

  return `${src}${imageService}${resize}${filters}`;
}
