/* eslint-disable */    
import axios from "axios";

class ProductionUnitService {
  constructor() {
    this.baseURL = "/api/v1/production-units";
  }

  /**
   * Create a new production unit
   */
  async createProductionUnit(productionUnitData) {
    try {
      const response = await axios.post(this.baseURL, productionUnitData);
      return response.data;
    } catch (error) {
      console.error("Failed to create production unit:", error);
      throw error;
    }
  }

  /**
   * Get production units for a farmer
   */
  async getProductionUnitsByFarmer(farmerId) {
    try {
      const response = await axios.get(`${this.baseURL}/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get production units:", error);
      throw error;
    }
  }

  /**
   * Get production unit with geometry
   */
  async getProductionUnitWithGeometry(unitId) {
    try {
      const response = await axios.get(`${this.baseURL}/${unitId}/geometry`);
      return response.data;
    } catch (error) {
      console.error("Failed to get production unit geometry:", error);
      throw error;
    }
  }

  /**
   * Update production unit polygon
   */
  async updateProductionUnitPolygon(unitId, polygonGeoJson) {
    try {
      const response = await axios.put(`${this.baseURL}/${unitId}/polygon`, {
        polygonGeoJson,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to update production unit polygon:", error);
      throw error;
    }
  }

  /**
   * Validate polygon
   */
  async validatePolygon(polygonGeoJson) {
    try {
      const response = await axios.post(`${this.baseURL}/validate-polygon`, {
        polygonGeoJson,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to validate polygon:", error);
      throw error;
    }
  }

  /**
   * Check polygon integrity
   */
  async validatePolygonIntegrity(unitId) {
    try {
      const response = await axios.get(`${this.baseURL}/${unitId}/integrity`);
      return response.data;
    } catch (error) {
      console.error("Failed to validate polygon integrity:", error);
      throw error;
    }
  }

  /**
   * Search production units
   */
  async searchProductionUnits(searchRequest) {
    try {
      const response = await axios.post(
        `${this.baseURL}/search`,
        searchRequest
      );
      return response.data;
    } catch (error) {
      console.error("Failed to search production units:", error);
      throw error;
    }
  }

  /**
   * Import polygons
   */
  async importPolygons(importRequest) {
    try {
      const response = await axios.post(
        `${this.baseURL}/import`,
        importRequest
      );
      return response.data;
    } catch (error) {
      console.error("Failed to import polygons:", error);
      throw error;
    }
  }

  /**
   * Delete production unit
   */
  async deleteProductionUnit(unitId) {
    try {
      const response = await axios.delete(`${this.baseURL}/${unitId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete production unit:", error);
      throw error;
    }
  }

  /**
   * Get production unit statistics
   */
  async getProductionUnitStats(farmerId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/farmer/${farmerId}/stats`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get production unit stats:", error);
      throw error;
    }
  }
}

export const productionUnitService = new ProductionUnitService();
export default productionUnitService;
