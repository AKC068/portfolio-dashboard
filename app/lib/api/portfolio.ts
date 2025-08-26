export interface AddHoldingPayload {
  accountId: number;
  symbol: string;
  exchange: 'NSE' | 'BSE' | string;
  quantity: number;
  price: number;
  name?: string;
  sector?: string;
}

export class PortfolioApi {
  private static baseUrl = 'http://localhost:8000/api';

  static async getHoldings(accountId: number = 1): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio/holdings?accountId=${accountId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch holdings: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getHoldings:', error);
      throw new Error(`Failed to fetch holdings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async addHolding(data: {
    accountId: number;
    symbol: string;
    exchange: string;
    quantity: number;
    price: number;
    name?: string;
    sector?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio/holdings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add holding: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error in addHolding:', error);
      throw new Error(`Failed to add holding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateHolding(holdingId: number, data: {
    symbol: string;
    exchange: string;
    quantity: number;
    price: number;
    name?: string;
    sector?: string;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio/holdings/${holdingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update holding: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error in updateHolding:', error);
      throw new Error(`Failed to update holding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteHolding(holdingId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio/holdings/${holdingId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete holding: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error in deleteHolding:', error);
      throw new Error(`Failed to delete holding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getSectors(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio/sectors`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch sectors: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getSectors:', error);
      throw new Error(`Failed to fetch sectors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getStocksBySector(sector: string): Promise<{ id: number; name: string; symbol: string }[]> {
    try {
      const encodedSector = encodeURIComponent(sector);
      const response = await fetch(`${this.baseUrl}/portfolio/sectors/${encodedSector}/stocks`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch stocks by sector: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getStocksBySector:', error);
      throw new Error(`Failed to fetch stocks by sector: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async updateSector(oldSector: string, newSector: string): Promise<void> {
    try {
      const encodedSector = encodeURIComponent(oldSector);
      const response = await fetch(`${this.baseUrl}/portfolio/sectors/${encodedSector}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newSector }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update sector: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error in updateSector:', error);
      throw new Error(`Failed to update sector: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}


