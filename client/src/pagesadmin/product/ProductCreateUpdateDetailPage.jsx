import {
  Alert,
  Anchor,
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  message,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Switch,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { AiOutlineInbox, AiOutlineMinus, AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import Button from "src/components/button/Button";
import AdminLayout from "src/layout/AdminLayout";
import Resizer from "react-image-file-resizer";
import styled from "styled-components";
import LogoCube from "src/components/nav/LogoCube";
import {
  BsArrowBarLeft,
  BsArrowLeft,
  BsBoxSeam,
  BsCartCheck,
  BsCheckLg,
  BsEye,
  BsPencil,
  BsSliders,
  BsTrash,
  BsUpload,
  BsXLg,
} from "react-icons/bs";
import { NOT_FOUND_IMG } from "src/common/constant";
import MasonryLayout from "src/components/images/MasonryLayout";
import { useDebounce } from "src/common/useDebounce";
import { useGetAllCategoriesFilteredQuery } from "src/stores/category/category.query";
import { checkValidColor, vietnameseSlug } from "src/common/utils";
import uniqBy from "lodash/uniqBy";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useCreateVariantMutation,
  useDeleteVariantMutation,
  useUpdateVariantMutation,
} from "src/stores/product/product.query";

import {
  useCreateContentMutation,
  useUpdateContentByIdMutation,
} from "src/stores/content/content.query";
import {
  useGetImagesFilteredQuery,
  useRemoveAdminImageMutation,
  useUploadAdminImageMutation,
} from "src/stores/image/image.query";
import MdEditor from "src/components/form/MdEditor";

const validateMessages = {
  required: "Trường này chưa nhập giá trị!",
  // ...
};

message.config({
  maxCount: 1,
});

const ProductCreateUpdateDetailPage = () => {
  const [form] = Form.useForm();
  const [formImageUrl] = Form.useForm();
  const [formAddVariant] = Form.useForm();
  let navigate = useNavigate();
  const { productId } = useParams();
  const [images, setImages] = useState([]);
  const [imageUrlVisible, setImageUrlVisible] = useState(false);
  const [addVariantVisible, setAddVariantVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [variantList, setVariantList] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { data: categoriesFilteredQuery, isSuccess: getCategoriesSuccess } =
    useGetAllCategoriesFilteredQuery({ sort: "", keyword: "" });
  const {
    data: productQuery,
    isSuccess: getProductSuccess,
    refetch: productQueryRefetch,
  } = useGetProductQuery(productId, {
    skip: !productId,
  });
  const { data: imagesFilteredQuery, isSuccess: imagesFilteredSuccess } = useGetImagesFilteredQuery(
    { onModel: "Product", sort: "", status: "" }
  );
  const [createProduct, { data: createProductData, isLoading: createProductLoading }] =
    useCreateProductMutation();
  const [updateProduct, { data: updateProductData, isLoading: updateProductLoading }] =
    useUpdateProductMutation();
  const [deleteProduct, { data: deleteProductData, isLoading: deleteProductLoading }] =
    useDeleteProductMutation();
  const [createVariant, { data: createVariantData, isLoading: createVariantLoading }] =
    useCreateVariantMutation();
  const [updateVariant, { data: updateVariantData, isLoading: updateVariantLoading }] =
    useUpdateVariantMutation();
  const [deleteVariant, { data: deleteVariantData, isLoading: deleteVariantLoading }] =
    useDeleteVariantMutation();
  const [createContent, { data: createContentData, isLoading: createContentLoading }] =
    useCreateContentMutation();
  const [updateContentById, { data: updateContentData, isLoading: updateContentLoading }] =
    useUpdateContentByIdMutation();
  const [uploadAdminImage, { data: uploadAdminImageData, isLoading: uploadAdminImageLoading }] =
    useUploadAdminImageMutation();
  const [removeAdminImage, { data: removeAdminImageData, isLoading: removeAdminImageLoading }] =
    useRemoveAdminImageMutation();
  const imageUrl = Form.useWatch("imageUrl", formImageUrl);
  const foundVariantImage = (imageId) => imageId && images.find((img) => img._id === imageId);
  useEffect(() => {
    if (getProductSuccess) {
      const {
        name,
        desc,
        price,
        images,
        brand,
        category,
        content: productContent,
        variants,
        combos,
        wishlist,
        ...rest
      } = productQuery.data;
      setImages(images);
      setVariantList(variants);
      form.setFieldsValue({
        name,
        desc,
        price,
        images,
        brand,
        category: category?._id || null,
        contentTitle: productContent?.title || "",
        contentValue: productContent?.content || "",
      });
    }
  }, [productId, productQuery, getProductSuccess]);

  const handleCancel = () => {
    if (productId) {
      const {
        name,
        desc,
        price,
        images,
        brand,
        category,
        content: productContent,
        variants,
        combos,
        wishlist,
        ...rest
      } = productQuery.data;
      setImages(images);
      setVariantList(variants);
      form.setFieldsValue({
        name,
        desc,
        price,
        images,
        brand,
        category: category?._id || null,
        contentTitle: productContent?.title || "",
        contentValue: productContent?.content || "",
      });
    } else {
      form.resetFields();
    }
  };
  const handleUpdate = async (values) => {
    try {
      const { name, desc, price, images, brand, category, contentTitle, contentValue, variants } =
        values;
      const productUpdatedResData = await updateProduct({
        id: productId,
        initdata: {
          name,
          desc,
          price,
          images,
          brand,
          category,
        },
      }).unwrap();
      const contentCreatedResData = await updateContentById({
        contentId: productUpdatedResData.data.content,
        initdata: {
          title: contentTitle,
          content: contentValue,
          onModel: "Product",
          modelId: productId,
        },
      });
      notification.success({ message: "Cập nhật sản phẩm thành công" });
      navigate("/admin/products", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };
  const handleCreate = async (values) => {
    try {
      const { name, desc, price, images, brand, category, contentTitle, contentValue } = values;
      const productCreatedResData = await createProduct({
        name,
        desc,
        price,
        images,
        brand,
        category,
      }).unwrap();
      const contentCreatedResData = await createContent({
        title: contentTitle,
        content: contentValue,
        onModel: "Product",
        modelId: productCreatedResData.data._id,
      });
      const variantsCreatedResData = await Promise.all(
        variantList.map(
          async (v) =>
            await createVariant({ productId: productCreatedResData.data._id, initdata: v }).unwrap()
        )
      );
      form.resetFields();
      setImages([]);
      notification.success({ message: "Thêm sản phẩm thành công" });
      navigate("/admin/products", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteProduct = () => {
    let secondsToGo = 5;
    const modal = Modal.confirm({
      title: (
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ maxWidth: 280, margin: 0 }}>
          Bạn chắc chắc muốn xóa sản phẩm <b>{productId}</b> ?
        </Typography.Paragraph>
      ),
      icon: null,
      content: null,
      okText: "Xác nhận",
      cancelText: "Hủy",
      cancelButtonProps: { size: "large" },
      okButtonProps: { size: "large", danger: true, icon: <BsTrash /> },
      onOk: async () => {
        try {
          const deletedProduct = await deleteProduct(productId).unwrap();
          notification.info({ message: "Xóa sản phẩm thành công" });
          navigate("/admin/products", { replace: true });
        } catch (err) {
          console.log("err", err);
        }
      },
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: (
          <>
            This modal will be destroyed after {secondsToGo} second.
            <Progress
              status="active"
              strokeColor={{
                from: "#f5222d",
                to: "#ff7a45",
              }}
              percent={(secondsToGo / 5) * 100}
              showInfo={false}
            />
          </>
        ),
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000 - 1);
  };
  //
  const handleAddVariant = async (values) => {
    if (productId) {
      const addedVariant = await createVariant({
        productId: productId,
        initdata: values,
      }).unwrap();
      setVariantList([...variantList, addedVariant?.data]);
    } else {
      setVariantList([...variantList, { _id: Date.now(), ...values }]);
    }
    formAddVariant.resetFields();
    setSelectedVariant(null);
    setAddVariantVisible(false);
    notification.success({ message: "Thêm phiên bản thành công" });
  };
  const handleUpdateVariant = async ({ _id = null }, values) => {
    try {
      if (productId) {
        const updatedVariant = await updateVariant({
          variantId: _id,
          initdata: values,
        }).unwrap();
      }
      const newList = variantList.map((v) => {
        if (v._id === _id) return { ...v, ...values };
        return v;
      });
      setVariantList(newList);
      formAddVariant.resetFields();
      setSelectedVariant(null);
      setAddVariantVisible(false);
      notification.success({ message: "Cập nhật phiên bản thành công" });
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleDeleteVariant = async ({ _id = null }) => {
    try {
      const newList = variantList.filter((v) => v._id !== _id);
      if (productId) {
        const deletedVariant = await deleteVariant(_id).unwrap();
      }
      setVariantList(newList);
      formAddVariant.resetFields();
      setSelectedVariant(null);
      setAddVariantVisible(false);
      notification.info({ message: "Xóa phiên bản thành công" });
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleCancelUpdateVariant = () => {
    if (selectedVariant) {
      formAddVariant.setFieldsValue(selectedVariant);
    } else {
      formAddVariant.resetFields();
    }
  };
  //
  const handleSelectImages = (value) => {
    const mappedValue = imagesFilteredQuery?.data.find((img) => img._id === value);
    const newImages = uniqBy([...images, mappedValue], "_id");
    setImages(newImages);
    form.setFieldsValue({ images: newImages });
  };
  const handleDeselectImage = (value) => {
    const filteredImages = images.filter((item) => item._id !== value);
    setImages(filteredImages);
    const newVariantList =
      variantList?.map((v) => ({
        ...v,
        image: filteredImages[0]?._id || undefined,
      })) || [];
    setVariantList(newVariantList);
    form.setFieldsValue({
      images: filteredImages,
    });
  };
}