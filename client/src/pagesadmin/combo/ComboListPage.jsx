import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Image,
  List,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { rgba } from "polished";
import { useEffect, useState } from "react";
import {
  BsBoxArrowUpRight,
  BsBoxSeam,
  BsCartCheck,
  BsChatLeftText,
  BsEye,
  BsHeart,
  BsLayoutWtf,
  BsStar,
  BsThreeDots,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { checkValidColor } from "src/common/utils";
import Button from "src/components/button/Button";
import MasonryLayout from "src/components/images/MasonryLayout";
import LocalSearch from "src/components/input/LocalSearch";
import AdminLayout from "src/layout/AdminLayout";
import { useGetAllProductsFilteredQuery } from "src/stores/product/product.query";
import styled from "styled-components";

const ComboListPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsFilterValue, setProductsFilterValue] = useState({
    keyword: "",
    sort: "",
  });
  const { data: productsFilteredQuery, isSuccess: getProductsSuccess } =
    useGetAllProductsFilteredQuery(productsFilterValue);
  const handleLocalSearch = (values) => {
    setProductsFilterValue({
      ...productsFilterValue,
      keyword: values.keySearch,
    });
  };

  useEffect(() => {
    if (productsFilteredQuery?.data) {
      setSelectedProduct(productsFilteredQuery?.data[0]);
    }
  }, [productsFilteredQuery?.data]);

  const handleRemove = (productId) => {
    console.log("handleRemove ~ productId", productId);
  };
  const columns = [
    {
      title: <BsThreeDots size={24} />,
      dataIndex: "_id",
      key: "actions",
      width: 125,
      align: "center",
      render: (text, record) => (
        <Link to={`/admin/products/${text}`}>
          <Button
            type="link"
            icon={<BsBoxArrowUpRight />}
            style={{ padding: 0 }}
          >
            Xem chi tiết
          </Button>
        </Link>
      ),
    },
  ];
  return (
    <AdminLayout>
      <ContentWrapper>
        <LocalSearch onFinish={handleLocalSearch} />
        <Row gutter={24} wrap={false}>
          <Col flex="400px">
            <Card
              title="Thông tin"
              loading={selectedProduct == null}
              extra={
                <Space>
                  <Link to={`/admin/products/${selectedProduct?._id}`}>
                    <Button
                      type="link"
                      extraType="btntag"
                      loading={!getProductsSuccess}
                      disabled={selectedProduct == null}
                      icon={<BsBoxArrowUpRight />}
                    >
                      Chỉnh sửa
                    </Button>
                  </Link>
                  {/* <Popconfirm
                    title={
                      <Typography.Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ maxWidth: 280, margin: 0 }}
                      >
                        Bạn chắc chắc muôn xóa <b>{selectedProduct?.name}</b> ?
                      </Typography.Paragraph>
                    }
                    placement="bottomRight"
                    okText={<BsCheckLg />}
                    cancelText={<BsXLg />}
                    onConfirm={() => handleRemove(selectedProduct)}
                  >
                    <Button
                      disabled={selectedProduct == null}
                      type="text"
                      extraType="btndanger"
                      className="btndanger"
                      loading={!getProductsSuccess}
                    >
                      Xóa
                    </Button>
                  </Popconfirm> */}
                </Space>
              }
            >
              {selectedProduct && (
                <>
                  <div className="card-reactions">
                    <div className="reaction">
                      <span>
                        <BsEye size={14} />
                      </span>
                      <h4>{selectedProduct.numOfViews}</h4>
                    </div>
                    <div className="reaction">
                      <span>
                        <BsChatLeftText size={14} />
                      </span>
                      <h4>{selectedProduct.numOfReviews}</h4>
                    </div>
                    <div className="reaction">
                      <span>
                        <BsStar size={14} />
                      </span>
                      <h4>{selectedProduct.avgRating}</h4>
                    </div>
                    <div className="reaction">
                      <span>
                        <BsHeart size={14} />
                      </span>
                      <h4>{selectedProduct.wishlist.length}</h4>
                    </div>
                  </div>
                  <Typography.Title
                    ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
                    level={4}
                  >
                    {selectedProduct.name}
                  </Typography.Title>
                  <Typography.Paragraph
                    type="secondary"
                    ellipsis={{ rows: 2, expandable: true, symbol: "Xem thêm" }}
                  >
                    {selectedProduct.desc}
                  </Typography.Paragraph>
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="Thương hiệu" span={2}>
                      {selectedProduct.brand}
                    </Descriptions.Item>
                    <Descriptions.Item label="Danh mục" span={2}>
                      <Typography.Text ellipsis style={{ maxWidth: 240 }}>
                        {selectedProduct.category?.name || "Không có"}
                      </Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá hiển thị" span={2}>
                      <Statistic
                        suffix="$"
                        valueStyle={{ fontSize: 14 }}
                        value={selectedProduct.price}
                      ></Statistic>
                    </Descriptions.Item>
                  </Descriptions>
                  <div className="product-combos">
                    <Divider orientation="left" plain>
                      Bộ sưu tập · {selectedProduct.combos.length}
                    </Divider>
                    {selectedProduct.combos.length > 0 ? (
                      <Avatar.Group>
                        {selectedProduct.combos.map((c) => (
                          <Link
                            to={`/admin/combos/${c._id}`}
                            key={`ProductCombos_${c._id}`}
                          >
                            <Avatar
                              size={48}
                              shape={"square"}
                              src={c.image.url}
                              icon={<BsLayoutWtf />}
                              title="Đi đến Bộ sưu tập"
                            ></Avatar>
                          </Link>
                        ))}
                      </Avatar.Group>
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        className="bordered"
                      />
                    )}
                  </div>
                  <div className="product-variants">
                    <Divider orientation="left" plain>
                      Phiên bản · {selectedProduct.variants.length}
                    </Divider>
                    <List
                      className="empty-bordered"
                      itemLayout="horizontal"
                      dataSource={selectedProduct.variants}
                      rowKey={(item) => `variant_${item._id}`}
                      renderItem={(item) => (
                        <List.Item>
                          <Space wrap={false} align="start">
                            <Avatar
                              size={48}
                              shape="square"
                              src={
                                selectedProduct.images.find(
                                  (img) => img._id === item.image
                                )?.url
                              }
                            />

                            <Descriptions column={2} size="small">
                              <Descriptions.Item label="Giá" span={2}>
                                <Statistic
                                  suffix="$"
                                  valueStyle={{ fontSize: 14 }}
                                  value={item.price}
                                ></Statistic>
                              </Descriptions.Item>
                              {item.options.map((o, index) => (
                                <Descriptions.Item
                                  label={o.name}
                                  span={2}
                                  key={`variant_options_${item._id}_${index}`}
                                >
                                  <Tag
                                    color={
                                      checkValidColor(o.value)
                                        ? o.value
                                        : "default"
                                    }
                                    className={"tag"}
                                  >
                                    {o.value}
                                  </Tag>
                                </Descriptions.Item>
                              ))}
                            </Descriptions>
                            <Tooltip
                              color={"#fafafa"}
                              overlayStyle={{ maxWidth: 120 }}
                              title={
                                <Descriptions column={2} size="small">
                                  <Descriptions.Item label="Đã bán" span={2}>
                                    {item.sold}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Số lượng" span={2}>
                                    {item.quantity}
                                  </Descriptions.Item>
                                </Descriptions>
                              }
                            >
                              <Space direction="vertical">
                                <Space size={2} split="·">
                                  <BsCartCheck size={16.5} />
                                  {item.sold}
                                </Space>
                                <Space size={2} split="·">
                                  <BsBoxSeam />
                                  {item.quantity}
                                </Space>
                              </Space>
                            </Tooltip>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </div>
                  <div className="product-images">
                    <Divider orientation="left" plain>
                      Hình ảnh · {selectedProduct.images.length}
                    </Divider>
                    <Image.PreviewGroup>
                      <MasonryLayout columns={2} gap={8}>
                        {selectedProduct.images.map((item) => (
                          <Image
                            width={158}
                            src={item.url}
                            key={`right_${item._id}`}
                          />
                        ))}
                      </MasonryLayout>
                    </Image.PreviewGroup>
                  </div>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </ContentWrapper>
    </AdminLayout>
  );
};

const ContentWrapper = styled.div`
  margin-bottom: 68px;
  & .content-top {
    margin-bottom: 24px;
  }
  & .content-middle {
    background: #fff;
    padding: 24px;
  }
  & .card-reactions {
    height: fit-content;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    margin-bottom: 16px;
    & .reaction {
      width: fit-content;
      height: fit-content;
      padding: 2px 8px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      background: transparent;
      color: ${(props) => props.theme.generatedColors[9]};
      font-size: 14px;
      border-radius: 5px;

      margin-top: 0px;
      overflow: hidden;
      &::before {
        content: "";
        width: 100%;
        height: 100%;
        background-color: #f8f9fa;
        position: absolute;
        z-index: -1;
        top: 0px;
        left: 0px;
      }
      & > span {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: inherit;
      }
      & > h4 {
        font-size: inherit;
        color: inherit;
        margin-bottom: 0;
      }

      &:nth-child(1) {
        color: #00b4d8;
        background: ${rgba("#00b4d8", 0.25)};
      }
      &:nth-child(2) {
        color: #ffb703;
        background: ${rgba("#ffb703", 0.25)};
      }
      &:nth-child(3) {
        color: #ffb703;
        background: ${rgba("#ffb703", 0.25)};
      }
      &:nth-child(4) {
        color: #ff0054;
        background: ${rgba("#ff0054", 0.25)};
      }
    }
  }
`;

export default ComboListPage;
