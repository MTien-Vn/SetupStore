import { Alert, Button, Form, Input, notification, Row, Typography } from "antd";
import { auth } from "src/common/firebase-config";
import ThemeButton from "src/components/button/ThemeButton";
import CarouselGallery from "src/components/images/CarouselGallery";
import LogoAndText from "src/components/nav/LogoAndText";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import GalleryBgLayout from "src/layout/GalleryBgLayout";
import React from "react";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setEmailVerifiedValue } from "src/stores/auth/auth.reducer";
import { useMediaQuery } from "react-responsive";
import AutocompleteEmailInput from "src/components/input/AutocompleteEmailInput";

const FormWrapperStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  .carousel-wrapper {
    width: 100%;
    padding: 0 40px 24px 40px;
    @media screen and (max-width: 374.98px) {
      padding-bottom: 0;
    }
  }
  .from-container {
    width: 100%;
  }
`;

const RegisterPage = (props) => {
  const mediaBelow480 = useMediaQuery({ maxWidth: 480 });
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [status, setStatus] = React.useState("");
  let navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    setStatus("loading");
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(auth.currentUser);

      await signOut(auth);

      notification.success({
        message: (
          <>
            Email is sent to {email}.<br />
            Click the link to complete your registration.
          </>
        ),
      });
      setStatus("success");
      dispatch(setEmailVerifiedValue(email));
      form.resetFields();
    } catch (error) {
      notification.error({ message: error.message });
      setStatus("error");
    }
  };

  return (
    <GalleryBgLayout>
      <FormWrapperStyles>
        <div className="carousel-wrapper">
          <CarouselGallery size={"100%"} />
        </div>
        <div className="from-container">
          <Form
            form={form}
            name="formAuth"
            onFinish={handleSubmit}
            size="large"
            layout="vertical"
            requiredMark={false}
            autoComplete="off"
          >
            <Row justify="space-between" wrap={false}>
              <Typography.Title level={mediaBelow480 ? 2 : 1}>Create new account</Typography.Title>
              {/* <ThemeButton type="icon" btntype="dashed" shape="circle" size="large" /> */}
            </Row>
            <Form.Item
              name="email"
              label={
                <Typography.Title level={5} type="secondary" style={{ marginBottom: 2 }}>
                  ????ng k?? t??i kho???n <LogoAndText fontSize={16} /> qua email
                </Typography.Title>
              }
              tooltip="Email ????? nh???n ???????ng d???n x??c nh???n ????ng k??"
              validateTrigger={"onChange"}
              rules={[
                { required: true, message: "Tr?????ng n??y kh??ng ???????c ????? tr???ng." },
                {
                  type: "email",
                  message: "H??y nh???p ????ng ?????nh d???ng email.",
                },
              ]}
            >
              {/* <Input prefix={<HiOutlineMail size={24} />} placeholder="Email..." /> */}
              <AutocompleteEmailInput placeholder="Email..." />
            </Form.Item>
            <Form.Item
              validateTrigger={"onKeyUp"}
              name="password"
              rules={[
                { required: true, message: "Tr?????ng n??y kh??ng ???????c ????? tr???ng." },
                { min: 6, message: "M???t kh???u c???n t???i thi???u 6 k?? t???." },
              ]}
            >
              <Input.Password
                prefix={<HiOutlineLockClosed size={24} />}
                type="password"
                placeholder="M???t kh???u..."
              />
            </Form.Item>
            <Form.Item
              validateTrigger={"onKeyUp"}
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "B???n ch??a x??c nh???n m???t kh???u!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("M???t kh???u x??c nh???n ch??a kh???p!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<HiOutlineLockClosed size={24} />}
                placeholder="X??c nh???n m???t kh???u..."
              />
            </Form.Item>

            <Form.Item style={mediaBelow480 ? { marginBottom: 0 } : {}}>
              <Button
                type="primary"
                htmlType="submit"
                className="register-form-button"
                loading={status === "loading"}
                disabled={status === "loading"}
                block
              >
                ????ng k??
              </Button>
            </Form.Item>
          </Form>
          <p style={{ textAlign: "center" }}>
            B???n ???? c?? t??i kho???n? <Link to="/login">????ng nh???p ngay</Link>
          </p>
          {status === "success" && (
            <Alert
              message={"???????ng d???n x??c nh???n ???? ???????c g???i ?????n email c???a b???n."}
              type="info"
              action={
                <span
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"https://mail.google.com/mail/u/0/#inbox"}
                  >
                    ??i ?????n h??m th??
                  </a>
                </span>
              }
            />
          )}
        </div>
      </FormWrapperStyles>
    </GalleryBgLayout>
  );
};
export default RegisterPage;
