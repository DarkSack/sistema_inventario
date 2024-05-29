import { useEffect, useState } from "react";
import api from "../../config/AxiosAdapter";
import Table from "../../Global/Table";
export const AdminProductsView = () => {
  const [productData, setProductData] = useState([]);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await api.get("/get/getProducts", {});
        const productsWithId = res.data.map(product => ({
          ...product,
          id: product.productId // Usar `productId` como identificador único
        }));
        setProductData(productsWithId);
      } catch (error) {
        setErrors(error.message);
      }
    };
    fetchProductData();
  }, []);
  const columns = [
    { field: "productId", headerName: "ID", width: 70 },
    { field: "productName", headerName: "Name", width: 130 },
    { field: "productDescription", headerName: "Description", width: 130 },
    { field: "productPrice", headerName: "Price", width: 100 },
    { field: "ProductStock", headerName: "Stock", width: 100 },
    {
      field: "category",
      headerName: "Category",
      width: 100,
    },
    {
      field: "provider",
      headerName: "Provider",
      width: 100,
    },
  ];

  return (
    <Table
      columns={columns}
      rows={productData}
      errors={errors}
      initialPage={0}
      pageSize={10}
    />
  );
};
