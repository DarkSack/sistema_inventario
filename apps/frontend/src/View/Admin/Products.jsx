import { useEffect, useState } from "react";
import api from "../../config/AxiosAdapter";
import Table from "../../Global/Table";
import { useAuth } from "../../Context/AuthContext";
import { Pencil, Trash } from "phosphor-react";
export const AdminProductsView = () => {
  const { useToken, userRole } = useAuth();
  const [productData, setProductData] = useState([]);
  const [errors, setErrors] = useState("");
  const [selectedRows, setSelectedRowIds] = useState([]);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await api.get("/get/getAdminProducts");
        const productsWithId = res.data.map((product) => ({
          ...product,
        }));
        setProductData(productsWithId);
      } catch (error) {
        setErrors(error.message);
      }
    };
    fetchProductData();
  }, []);
  // const dataUser = {
  //   useToken,
  //   userRole,
  // };
  // const deleteProducts = () => {
  //   api.post("/delete/deleteProducts", {
  //     ids: selectedRows,
  //     user: dataUser,
  //   });
  // };
  const columns = [
    { field: "id", headerName: "ID", width: 180 },
    { field: "productName", headerName: "Name", width: 180 },
    { field: "productDescription", headerName: "Description", width: 180 },
    { field: "productPrice", headerName: "Price", width: 180 },
    { field: "productStock", headerName: "Stock", width: 180 },
    { field: "categoryName", headerName: "Category", width: 180 },
    { field: "providerName", headerName: "Provider", width: 180 },
  ];

  const handleSelectionChange = (newSelection) => {
    setSelectedRowIds(newSelection);
  };
  return (
    <>
      {selectedRows && (
        <div>
          <Trash  />
          <Pencil />
        </div>
      )}
      <Table
        columns={columns}
        rows={productData}
        errors={errors}
        initialPage={0}
        pageSize={10}
        onSelectionChange={(newSelection) =>
          handleSelectionChange(newSelection)
        }
        checkboxSelection={true}
        pageSizeOptions={[5, 10]}
      />
    </>
  );
};
