import { Avatar, Col, Drawer, Row, Space, Typography } from "antd";
import {
  BsBoxSeam,
  BsChatLeftText,
  BsCollection,
  BsHouseDoor,
  BsLayoutWtf,
  BsPeople
} from "react-icons/bs";
import { FcLike, FcServices, FcViewDetails } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "src/common/useAuth";
import { setVisibleType } from "src/stores/header/header.reducer";
import styled from "styled-components";
import Button from "../button/Button";

const SideBar = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const mediaBelow768 = useMediaQuery({ maxWidth: 768 });
  const headerState = useSelector((state) => state.headerState);
  const { isSignedIn, user, isAdmin } = useAuth();

  return (
    <Drawer
      destroyOnClose
      closeIcon={null}
      title={null}
      placement={mediaBelow768 ? "right" : "left"}
      onClose={() => dispatch(setVisibleType(""))}
      visible={headerState.visibletype === "sidenavvisible"}
      width={240}
      footer={
        isSignedIn ? (
          <Row wrap={false} gutter={16}>
            <Col flex="none">
              <Button size="large" shape="circle">
                <AvatarWrapper>
                  <Avatar
                    size={33}
                    src={user.picture ?? "https://source.unsplash.com/random?vietnam,nature"}
                    alt="avatar"
                  />
                </AvatarWrapper>
              </Button>
            </Col>
            <Col flex="auto">
              <Typography.Title
                level={5}
                ellipsis
                style={{ marginBottom: 2, cursor: "pointer" }}
                onClick={() => navigate("/profile")}
                title="Go to your profile"
              >
                {user.name}
              </Typography.Title>
              <Typography.Paragraph type="secondary" ellipsis style={{ marginBottom: 2 }}>
                {user.email}
              </Typography.Paragraph>
            </Col>
          </Row>
        ) : (
          <Space wrap={false} className="side-auth-action">
            <Space wrap={false}>
              <Button
                shape="round"
                type="link"
                extraType="btntag"
                disabled={headerState.dataRedirectStatus === "loading"}
                loading={headerState.dataRedirectStatus === "loading"}
              >
                <Link to="/login">????ng nh???p</Link>
              </Button>
              <Button
                type="primary"
                shape="round"
                disabled={headerState.dataRedirectStatus === "loading"}
              >
                <Link to="/register">????ng k??</Link>
              </Button>
            </Space>
          </Space>
        )
      }
    >
      <SideMenuWrapper>
        <NavItem icon={<BsHouseDoor />} linkto={"/"}>
          Trang ch???
        </NavItem>
        <NavItem icon={<BsBoxSeam />} linkto={"/store"}>
          S???n ph???m
        </NavItem>
        <NavItem icon={<BsLayoutWtf />} linkto={"/combos"}>
          B??? s??u t???p
        </NavItem>
        <NavItem icon={<BsCollection />} linkto={"/categories"}>
          Danh m???c
        </NavItem>
        <NavItem icon={<BsPeople />} linkto={"/about-us"}>
          V??? ch??ng t??i
        </NavItem>
        <NavItem icon={<BsChatLeftText />} linkto={"/faq"}>
          FAQ
        </NavItem>
        {isSignedIn && (
          <div className="side-user">
            <NavItem icon={<FcViewDetails />} linkto={"/profile"}>
              ????n h??ng
            </NavItem>
            <NavItem icon={<FcLike />} linkto={"/profile"}>
              Y??u th??ch
            </NavItem>
            <NavItem icon={<FcServices />} linkto={"/profile"}>
              C??i ?????t
            </NavItem>
          </div>
        )}
      </SideMenuWrapper>
    </Drawer>
  );
};

const NavItem = ({ icon, children, linkto = "/" }) => {
  return (
    <Link to={linkto} className="side-item side-item-nav">
      <div className="side-icon">{icon}</div>
      <div className="side-content">{children}</div>
    </Link>
  );
};

const SideMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  & .side-item {
    padding: 8px;
    width: 100%;
  }
  & .side-item.side-item-nav {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 8px;
    & .side-icon {
      flex: 0 0 32px;
      font-size: 20px;
      color: ${(props) => props.theme.generatedColors[5]};
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    & .side-content {
      flex: 1 1 auto;
      font-size: 16px;
    }
  }

  & .side-user {
    margin-top: auto;
  }

  & .side-item:hover {
    background-color: ${(props) => props.theme.generatedColors[0]};
  }
`;

const AvatarWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px;
  position: relative;
`;

export default SideBar;
