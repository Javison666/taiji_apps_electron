export function getUriSearchParams(urlStr: string) {
    // myapp:?a=1&b=2
    const urlObj = new URL(urlStr);
    const { searchParams } = urlObj;
    return searchParams
}