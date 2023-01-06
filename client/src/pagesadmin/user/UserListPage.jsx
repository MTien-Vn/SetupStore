import { Avatar, Card, Col, message, Popconfirm, Row, Space, Table, Tag, Typography } from "antd";
import { rgba } from "polished";
import { useEffect, useState } from "react";
import { BsCheckLg, BsThreeDots, BsXLg } from "react-icons/bs";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NOT_FOUND_IMG } from "src/common/constant";
import { useAuth } from "src/common/useAuth";
import { formatDate, sorterByWords } from "src/common/utils";
import Button from "src/components/button/Button";
import LocalSearch from "src/components/input/LocalSearch";
import { dateFormat } from "src/components/picker/RangePicker";
import AdminLayout from "src/layout/AdminLayout";
import { useGetFilteredUsersQuery, useUpdateUserMutation } from "src/stores/user/user.query";
import styled from "styled-components";

const isActive = (status) => status === "active";

const UserListPage = () => {
  const { user } = useAuth();
  const [usersFilterValue, setUsersFilterValue] = useState({ keyword: "", sort: "" });

  const { data: usersFilteredQuery, isSuccess: getUsersSuccess } =
    useGetFilteredUsersQuery(usersFilterValue);
  const [updateUser, { isLoading: updateUserLoading }] = useUpdateUserMutation();
  const usersFilteredData = getUsersSuccess ? usersFilteredQuery?.data : [];

  const handleUnlock = async (userId) => {
    try {
      message.loading("Đang xử lý...");
      const updateUserRes = await updateUser({ userId, initdata: { status: "active" } }).unwrap();
      message.success("Cập nhật trạng thái thành công");
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleLock = async (userId) => {
    try {
      message.loading("Đang xử lý...");
      const updateUserRes = await updateUser({ userId, initdata: { status: "inactive" } }).unwrap();
      message.info("Khóa tài khoản thành công");
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleLocalSearch = (values) => {
    setUsersFilterValue({ ...usersFilterValue, keyword: values.keySearch });
  };
}