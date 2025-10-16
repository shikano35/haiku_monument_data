import type {
  Location,
  LocationDetail,
  LocationList,
  MonumentDetail,
  MonumentList,
  Poem,
  PoemDetail,
  PoemList,
  Poet,
  PoetDetail,
  PoetList,
} from "@/types/api"; /**
 * haiku_monument_apiからデータを取得するクライアント
 */
export class HaikuMonumentApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * すべての句碑を取得
   */
  async getAllMonuments(params?: {
    limit?: number;
    offset?: number;
    expand?: string;
  }): Promise<MonumentList> {
    const url = new URL(`${this.baseUrl}/monuments`);
    if (params?.limit) url.searchParams.set("limit", params.limit.toString());
    if (params?.offset)
      url.searchParams.set("offset", params.offset.toString());
    if (params?.expand) url.searchParams.set("expand", params.expand);

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch monuments: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // APIは配列を直接返す
    const monuments: MonumentDetail[] = await response.json();
    return {
      monuments,
      total: monuments.length,
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    };
  } /**
   * 特定の句碑を取得
   */
  async getMonument(id: number, expand?: string): Promise<MonumentDetail> {
    const url = new URL(`${this.baseUrl}/monuments/${id}`);
    if (expand) url.searchParams.set("expand", expand);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `Failed to fetch monument ${id}: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }

  /**
   * すべての俳句を取得
   */
  async getAllPoems(params?: {
    limit?: number;
    offset?: number;
  }): Promise<PoemList> {
    const url = new URL(`${this.baseUrl}/poems`);
    if (params?.limit) url.searchParams.set("limit", params.limit.toString());
    if (params?.offset)
      url.searchParams.set("offset", params.offset.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch poems: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // APIは { poems: [...] } を返す
    const data: { poems: Poem[] } = await response.json();
    return {
      poems: data.poems,
      total: data.poems.length,
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    };
  } /**
   * 特定の俳句を取得
   */
  async getPoem(id: number): Promise<PoemDetail> {
    const url = new URL(`${this.baseUrl}/poems/${id}`);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `Failed to fetch poem ${id}: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }

  /**
   * すべての俳人を取得
   */
  async getAllPoets(params?: {
    limit?: number;
    offset?: number;
  }): Promise<PoetList> {
    const url = new URL(`${this.baseUrl}/poets`);
    if (params?.limit) url.searchParams.set("limit", params.limit.toString());
    if (params?.offset)
      url.searchParams.set("offset", params.offset.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch poets: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // APIは配列を直接返す
    const poets: Poet[] = await response.json();
    return {
      poets,
      total: poets.length,
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    };
  } /**
   * 特定の俳人を取得
   */
  async getPoet(id: number): Promise<PoetDetail> {
    const url = new URL(`${this.baseUrl}/poets/${id}`);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `Failed to fetch poet ${id}: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }

  /**
   * すべての場所を取得
   */
  async getAllLocations(params?: {
    limit?: number;
    offset?: number;
  }): Promise<LocationList> {
    const url = new URL(`${this.baseUrl}/locations`);
    if (params?.limit) url.searchParams.set("limit", params.limit.toString());
    if (params?.offset)
      url.searchParams.set("offset", params.offset.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch locations: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // APIは配列を直接返す
    const locations: Location[] = await response.json();
    return {
      locations,
      total: locations.length,
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    };
  } /**
   * 特定の場所を取得
   */
  async getLocation(id: number): Promise<LocationDetail> {
    const url = new URL(`${this.baseUrl}/locations/${id}`);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `Failed to fetch location ${id}: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }
}
