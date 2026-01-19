import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { Toaster, toast } from "react-hot-toast";

import Login from "./pages/login";
import MainTable from "./pages/MainTable";
import ProductModal from "./components/ProductModal";
import Loading from "./components/Loading";
import Pagination from "./components/Pagination";

const API_BASE = import.meta.env.VITE_APP_API_BASE;
// 請自行替換 API_PATH
const API_PATH = import.meta.env.VITE_APP_API_PATH;

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [alertMsg, setAlerMsg] = useState("");
  const [isAuth, setIsAuth] = useState(true);
  const [products, setProducts] = useState([]);
  const [pagination, setPagiantion] = useState({
    total_pages: 0,
    current_page: 0,
    has_pre: false,
    has_next: false,
    category: "",
  });

  const modalRef = useRef(null);
  const productModalRef = useRef(null);
  const [modalType, setModalType] = useState("");
  const [templateData, setTemplateData] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
  });

  //初始化，會先檢查是否有token 且 是有效的
  //如無效：就會呈現登入頁面
  //如有效：則會進一步觸發getProductInfo()，並渲染畫面
  //亦會初始化bootstrap.Modal元件
  useEffect(() => {
    (async () => {
      const tokenName = "react-week2-token=";
      try {
        setIsLoading(true);
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("react-week2-token="))
          ?.split("=")[1];
        axios.defaults.headers.common.Authorization = token;
        if (token !== undefined) {
          const res = await axios.post(`${API_BASE}/api/user/check`);
          if (res === "") {
            setIsAuth(false);
          } else {
            setIsAuth(true);
            getProductInfo();
          }
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        toast.error("請重新登入");
        // document.cookie = `${tokenName}; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        // 或者使用 max-age 属性
        document.cookie = `${tokenName}; max-age=0; path=/`;

        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    })();
    productModalRef.current = new Modal(modalRef.current, {
      backdrop: "static",
      keyboard: false,
    });

    // Modal 關閉時移除焦點
    modalRef.current.addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  }, [isAuth]);

  const handleFormInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `react-week2-token=${token};expires=${new Date(
        expired,
      )};`;
      axios.defaults.headers.common.Authorization = `${token}`;
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      setAlerMsg(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (product, type) => {
    setTemplateData({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "",
      origin_price: product.origin_price || "",
      price: product.price || "",
      description: product.description || "",
      content: product.content || "",
      is_enabled: product.is_enabled || false,
      imagesUrl: product.imagesUrl || [],
    });
    productModalRef.current.show();

    setModalType(type);
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const handleModalInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTemplateData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  //當副圖輸入值，會新增入陣列
  const handleImageChange = (index, value) => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;

      return { ...prevData, imagesUrl: newImages };
    });
  };

  //新增副圖的邏輯
  const handleAddImage = () => {
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ""],
    }));
  };
  //刪除副圖的邏輯
  const handleRemoveImage = () => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  };

  //處理Pagination page 當前數值
  const changePage = useCallback(
    (e, page) => {
      e.preventDefault();
      getProductInfo(page);
    },
    [pagination],
  );

  const getProductInfo = async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(res.data.products);
      setPagiantion(res.data.pagination);
    } catch (error) {
      toast.error(`取得資料失敗! +${error.response.data.message}`);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  const addOrUpdateProductData = async (id) => {
    const productData = {
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imagesUrl: [...templateData.imagesUrl].filter((image) => image !== ""),
      },
    };

    let product;
    if (modalType === "edit") {
      product = `product/${id}`;
    } else {
      product = `product`;
    }

    const url = `${API_BASE}/api/${API_PATH}/admin/${product}`;

    try {
      setIsLoading(true);
      let res;
      if (modalType === "edit") {
        res = await axios.put(url, productData);
        toast.success("更新成功!");
      } else {
        res = await axios.post(url, productData);
        toast.success("新增成功!");
      }

      productModalRef.current.hide();
      getProductInfo();
    } catch (error) {
      if (modalType === "edit") {
        toast.error(`更新失敗! +${error.response.data.message}`);
      } else {
        toast.error(`新增失敗! +${error.response.data.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const delProductData = async (id) => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      toast.success("刪除成功!");
      productModalRef.current.hide();
      getProductInfo();
    } catch (error) {
      toast.error(`刪除失敗! +${error.response.data.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {isAuth ? (
        <>
          <MainTable products={products} openModal={openModal} />
          <Pagination pagination={pagination} changePage={changePage} />
        </>
      ) : (
        <Login
          username={formData.username}
          password={formData.password}
          alertMsg={alertMsg}
          handleSubmit={handleSubmit}
          handleFormInputChange={handleFormInputChange}
        />
      )}
      <ProductModal
        modalRef={modalRef}
        modalType={modalType}
        templateData={templateData}
        handleModalInputChange={handleModalInputChange}
        handleImageChange={handleImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        delProductData={delProductData}
        addOrUpdateProductData={addOrUpdateProductData}
        closeModal={closeModal}
      />
      <Loading isLoading={isLoading} />
    </>
  );
}

export default App;
