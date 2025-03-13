"use client"

import { Fragment, useRef, useState, useEffect } from "react"
import "./LoginSignUp.css"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { clearErrors, login } from "../../redux/actions/userAction.js"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import LockOpenIcon from "@mui/icons-material/LockOpen"
import BusinessIcon from "@mui/icons-material/Business"

const LoginSignUp = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { error, loading, isAuthenticated, user: User } = useSelector((state) => state.user)

  const loginTab = useRef(null)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const loginSubmit = (e) => {
    e.preventDefault()
    dispatch(login(loginEmail, loginPassword))
  }

  useEffect(() => {
    if (error) {
      const displayError = error === "Invalid name or password" ? "Invalid User name or password" : error
      toast.error(displayError)
      dispatch(clearErrors())
    }

    if (isAuthenticated) {
      localStorage.setItem("UserIDName", User.name)
      localStorage.setItem("isAuthenticated", "true")
      navigate("/home")
    }
  }, [error, dispatch, isAuthenticated, navigate, User])

  return (
    <Fragment>
      <div className="sws_auth_container">
        <div className="sws_auth_glassBox">
          <div className="sws_auth_content">
            <div className="sws_auth_header">
              <BusinessIcon className="sws_auth_logo" />
              <h1 className="sws_auth_title">Welcome Back!</h1>
              <p className="sws_auth_subtitle">Access your dashboard to manage your business</p>
            </div>

            <form className="sws_auth_form" ref={loginTab} onSubmit={loginSubmit}>
              <div className="sws_auth_inputWrapper">
                <div className="sws_auth_inputGroup">
                  <MailOutlineIcon className="sws_auth_inputIcon" />
                  <input
                    type="text"
                    placeholder="Username"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="sws_auth_input"
                  />
                  <div className="sws_auth_inputBorder"></div>
                </div>

                <div className="sws_auth_inputGroup">
                  <LockOpenIcon className="sws_auth_inputIcon" />
                  <input
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="sws_auth_input"
                  />
                  <div className="sws_auth_inputBorder"></div>
                </div>
              </div>

              <button type="submit" className="sws_auth_button" disabled={loading}>
                {loading ? t("Logging In...") : t("Log in")}
                <span className="sws_auth_buttonGlow"></span>
              </button>
            </form>

            <div className="sws_auth_footer">
              <div className="sws_auth_company">
                <div className="sws_auth_companyText">
                  <span className="sws_auth_poweredBy">Powered by</span>
                  <div className="sws_auth_companyLogo">
                    <img src="/logo.png" alt="SoftWiseSol Logo" className="sws_auth_logoImage" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default LoginSignUp