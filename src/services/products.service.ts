import api from "@/lib/axios";
import { AxiosRequestConfig } from "axios";
import { Product, ProductListResponse, ProductQueryParams } from "@/types/product";

export const productsService = {
  /**
   * Fetch paginated products list with optional sorting
   * GET /products?limit=10&skip=0&sortBy=price&order=asc
   */
  async getProducts(params: ProductQueryParams, config?: AxiosRequestConfig): Promise<ProductListResponse> {
    const skip = (params.page - 1) * params.limit;
    const requestParams: Record<string, unknown> = {
      limit: params.limit,
      skip,
    };

    if (params.sortBy) {
      requestParams.sortBy = params.sortBy;
      requestParams.order = params.order || "asc";
    }

    const response = await api.get<ProductListResponse>("/products", {
      ...config,
      params: { ...requestParams, ...config?.params },
    });
    return response.data;
  },

  /**
   * Search products with q parameter
   * GET /products/search?q=phone&limit=10&skip=0
   */
  async searchProducts(query: string, params: ProductQueryParams, config?: AxiosRequestConfig): Promise<ProductListResponse> {
    const skip = (params.page - 1) * params.limit;
    const requestParams: Record<string, unknown> = {
      q: query,
      limit: params.limit,
      skip,
    };

    // Include sort if search supports it or for query completeness
    if (params.sortBy) {
      requestParams.sortBy = params.sortBy;
      requestParams.order = params.order || "asc";
    }

    const response = await api.get<ProductListResponse>("/products/search", {
      ...config,
      params: { ...requestParams, ...config?.params },
    });
    return response.data;
  },

  /**
   * Filter products by category
   * GET /products/category/smartphones?limit=10&skip=0&sortBy=price&order=asc
   */
  async getProductsByCategory(category: string, params: ProductQueryParams, config?: AxiosRequestConfig): Promise<ProductListResponse> {
    const skip = (params.page - 1) * params.limit;
    const requestParams: Record<string, unknown> = {
      limit: params.limit,
      skip,
    };

    if (params.sortBy) {
      requestParams.sortBy = params.sortBy;
      requestParams.order = params.order || "asc";
    }

    const response = await api.get<ProductListResponse>(`/products/category/${encodeURIComponent(category)}`, {
      ...config,
      params: { ...requestParams, ...config?.params },
    });
    return response.data;
  },

  /**
   * Fetch single product details
   * GET /products/{id}
   */
  async getProductById(id: number, config?: AxiosRequestConfig): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`, config);
    return response.data;
  },

  /**
   * Add new product
   * POST /products/add
   */
  async addProduct(product: Partial<Product>): Promise<Product> {
    const response = await api.post<Product>("/products/add", product);
    return response.data;
  },

  /**
   * Update product
   * PUT /products/{id}
   */
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  /**
   * Delete product
   * DELETE /products/{id}
   */
  async deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean }> {
    const response = await api.delete<{ id: number; isDeleted: boolean }>(`/products/${id}`);
    return response.data;
  },
};

export default productsService;
