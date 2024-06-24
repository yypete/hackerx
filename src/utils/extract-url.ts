export const extractDomain = (url: string | undefined | null): string => {
    const match = url && url.match(/:\/\/(www\.)?([^/]+)/);
    if (match) {
      return match[2];
    } else if (url) {
      return url;
    } else {
      return "";
    }
  };