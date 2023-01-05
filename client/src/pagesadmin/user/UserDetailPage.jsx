import {
  Alert,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
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
  Tooltip,
  Typography,
  Upload,
} from "antd";
import uniqBy from "lodash/uniqBy";
import { useEffect, useState } from "react";
import { AiOutlineInbox, AiOutlineMinus, AiOutlinePlusCircle } from "react-icons/ai";
import {
  BsArrowLeft,
  BsCheckLg,
  BsEye,
  BsPencil,
  BsSliders,
  BsTrash,
  BsUpload,
  BsXLg,
} from "react-icons/bs";
import Resizer from "react-image-file-resizer";
import { useNavigate, useParams } from "react-router-dom";
import { NOT_FOUND_IMG } from "src/common/constant";
import Button from "src/components/button/Button";
import MasonryLayout from "src/components/images/MasonryLayout";
import LogoCube from "src/components/nav/LogoCube";
import AdminLayout from "src/layout/AdminLayout";
import { useDeleteProductMutation } from "src/stores/product/product.query";
import styled from "styled-components";

import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "src/stores/user/user.query";
import { useGetAddressByUserIdQuery } from "src/stores/address/address.query";

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
  const [formAddAddress] = Form.useForm();
  let navigate = useNavigate();
  const { userId } = useParams();
  const [images, setImages] = useState([]);
  const [imageUrlVisible, setImageUrlVisible] = useState(false);
  const [addAddressVisible, setAddAddressVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [variantList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { data: usersFilteredQuery, isSuccess: getUsersSuccess } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });
  const { data: addressQuery, isSuccess: getAddressSuccess } = useGetAddressByUserIdQuery(userId, {
    skip: !userId,
  });
  const [updateUser, { data: updateUserData, isLoading: updateUserLoading }] =
    useUpdateUserMutation();
  const [deleteProduct, { data: deleteProductData, isLoading: deleteProductLoading }] =
    useDeleteProductMutation();
  const imageUrl = Form.useWatch("imageUrl", formImageUrl);

  useEffect(() => {
    if (getUsersSuccess) {
      const { name, email, role, status, picture, ...rest } = usersFilteredQuery.data;
      setImages([picture]);
      form.setFieldsValue({
        name,
        email,
        role,
        status,
      });
    }
  }, [userId, usersFilteredQuery, getUsersSuccess]);

  useEffect(() => {
    if (getAddressSuccess) {
      setAddressList(addressQuery.data);
    }
  }, [getAddressSuccess]);

  const handleCancel = () => {
    if (userId) {
      const { name, email, role, status, picture, ...rest } = usersFilteredQuery.data;
      setImages([picture]);
      setAddressList(addressQuery.data);
      form.setFieldsValue({
        name,
        email,
        role,
        status,
      });
    } else {
      form.resetFields();
    }
  };
  const handleUpdate = async (values) => {
    try {
      const { name, email, role, status } = values;
      const productUpdatedResData = await updateUser({
        userId: userId,
        initdata: {
          name,
          email,
          role,
          status,
        },
      }).unwrap();

      notification.success({ message: "Cập nhật người dùng thành công" });
      navigate("/admin/users", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteUser = () => {
    let secondsToGo = 5;
    const modal = Modal.confirm({
      title: (
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ maxWidth: 280, margin: 0 }}>
          Bạn chắc chắc muốn xóa người dùng <b>{userId}</b> ?
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
          const productUpdatedResData = await updateUser({
            userId: userId,
            initdata: {
              status: "deleted",
            },
          }).unwrap();
          notification.error({ message: "Xóa người dùng thành công" });
          navigate("/admin/users", { replace: true });
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
  const handleAddAddress = async (values) => {

  };
}