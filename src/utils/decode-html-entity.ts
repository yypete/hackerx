export const decodeHtmlEntity = (input: string | undefined | null): string => {
    if (!input) return "";
    const doc = new DOMParser().parseFromString(input, "text/html");
    let decodedText = doc.documentElement.textContent ?? "";
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    decodedText = decodedText.replace(
      urlPattern,
      '<a href="$1" class="custom-link" target="_blank">$1</a>'
    );
    return decodedText;
  };