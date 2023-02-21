import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { palette } from "@mui/system";

const Login = () => {
  const navigate = useNavigate();

  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText("");
    setPasswordErrText("");

    //入力欄の文字列を取得
    const data = new FormData(e.target);

    //"username"は<TextField/>内で取得したname属性から
    const username = data.get("username").trim();
    const password = data.get("password").trim();

    console.log(username);
    console.log(password);

    let error = false;

    if (username === "") {
      error = true;
      setUsernameErrText("Please enter a name");
    }
    if (password === "") {
      error = true;
      setPasswordErrText("Please enter a password");
    }

    //errorだったら以下の処理はせずに返しちゃう
    if (error) return;

    setLoading(true);

    //新規登録APIを叩く
    try {
      //suthApiのparamsをここでいれる(bodyに挿入される→serverに渡されて暗号化されたり)
      const res = await authApi.login({
        //ここがbackendのreq.bodyに相当する
        username,
        password,
      });

      setLoading(false);

      localStorage.setItem("token", res.token);
      console.log("success to login!");
      navigate("/");
    } catch (err) {
      // console.log(err);
      //axiosの配列からerrorの詳細を取り出す
      const errors = err.data.errors;
      console.log(errors);
      errors.forEach((err) => {
        if (err.param === "username") {
          setUsernameErrText(err.msg);
        }
        if (err.param === "password") {
          setPasswordErrText(err.msg);
        }
      });
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          id="username"
          label="User name"
          margin="normal"
          name="username"
          required
          helperText={usernameErrText}
          error={usernameErrText !== ""}
          disabled={loading}
        />
        <TextField
          fullWidth
          id="password"
          label="password"
          margin="normal"
          name="password"
          type="password"
          required
          helperText={passwordErrText}
          error={passwordErrText !== ""}
          disabled={loading}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2, textTransform: "none" }}
          fullWidth
          type="submit"
          loading={loading}
          color="primary"
          variant="outlined"
        >
          Log in
        </LoadingButton>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ fontSize: "14px" }}>
          You don't have an account yet?{" "}
        </Typography>
        <Typography
          component={Link}
          to="/register"
          sx={{
            textTransform: "none",
            color: palette.primary,
            textDecoration: "none",
            fontSize: "14px",
            marginLeft: "14px",
          }}
        >
          Sign up
        </Typography>
      </Box>
    </>
  );
};

export default Login;
