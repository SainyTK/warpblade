export interface Fetched {
  status: number;
  text: string;
}

export async function fetchText(url: string): Promise<Fetched> {
  const response = await fetch(url);
  return { status: response.status, text: await response.text() };
}
