import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/actions/userAction";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUrdu, setIsUrdu] = useState(i18n.language === "ur");

  const sidebarRef = useRef();
  const barsRef = useRef(); // Ref for bars icon

  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("User");
    navigate("/");
  };

  const sidebarVariants = {
    expanded: {
      left: "0",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    collapsed: {
      left: "-60%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const barsVariants = {
    expanded: {
      left: "60%",
      transition: { delay: 0.3, duration: 0.3, ease: "easeInOut" },
    },
    collapsed: {
      left: "5%",
      transition: { delay: 0.3, duration: 0.3, ease: "easeInOut" },
    },
  };

  // Close sidebar when clicking outside OR clicking on bars icon when open (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target) &&
          barsRef.current &&
          !barsRef.current.contains(event.target)
        ) {
          setExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Collapse sidebar on route change for mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      const timer = setTimeout(() => {
        setExpanded(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <motion.div
        ref={barsRef}
        className="bars"
        variants={barsVariants}
        animate={window.innerWidth <= 768 ? (expanded ? "expanded" : "collapsed") : ""}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <UilBars />
      </motion.div>

      <motion.div
        className="sidebar"
        ref={sidebarRef}
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? (expanded ? "expanded" : "collapsed") : ""}
      >
        <div className="menu">
          {SidebarData.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className={location.pathname === item.link ? "menuItem active" : "menuItem"}
            >
              <item.icon />
              <span>{t(item.heading)}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

// import React, { useState, useEffect, useRef } from "react";
// import "./Sidebar.css";
// import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
// import { SidebarData } from "../Data/Data";
// import { motion } from "framer-motion";
// import { useTranslation } from "react-i18next";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../../../redux/actions/userAction";

// const Sidebar = () => {
//   const [expanded, setExpanded] = useState(true);
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isUrdu, setIsUrdu] = useState(i18n.language === "ur");

//   const sidebarRef = useRef();

//   // Get the current location
//   const location = useLocation();

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem("User");
//     navigate("/");
//   };

//   const handleLanguageToggle = () => {
//     const newLanguage = isUrdu ? "en" : "ur";
//     i18n.changeLanguage(newLanguage);
//     setIsUrdu(!isUrdu);
//   };

//   const sidebarVariants = {
//     expanded: {
//       left: "0",
//       transition: {
//         duration: 0.3,
//         ease: "easeInOut",
//       },
//     },
//     collapsed: {
//       left: "-60%",
//       transition: {
//         duration: 0.3,
//         ease: "easeInOut",
//       },
//     },
//   };

//    // Define variants for the toggle (bars) element with a matching delay.
//    const barsVariants = {
//     expanded: {
//       left: "60%",
//       transition: { delay: 0.3, duration: 0.3, ease: "easeInOut" },
//     },
//     collapsed: {
//       left: "5%",
//       transition: { delay: 0.3, duration: 0.3, ease: "easeInOut" },
//     },
//   };

//     // Close the sidebar when clicking outside it (only on mobile)
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (
//           expanded &&
//           sidebarRef.current &&
//           !sidebarRef.current.contains(event.target)
//         ) {
//           setExpanded(false);
//         }
//       };
  
//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, [expanded]);

//    // Use a useEffect to collapse the sidebar on route change for mobile screens
//    useEffect(() => {
//     if (window.innerWidth <= 768) {
//       // Delay collapsing for 300ms to allow a smooth transition
//       const timer = setTimeout(() => {
//         setExpanded(false);
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [location]);

//   return (
//     <>
//        <motion.div
//         className="bars"
//         variants={barsVariants}
//         animate={window.innerWidth <= 768 ? (expanded ? "expanded" : "collapsed") : ""}
//         onClick={() => setExpanded(!expanded)}
//       >
//         <UilBars />
//       </motion.div>
//       <motion.div
//         className="sidebar"
//         ref={sidebarRef}
//         variants={sidebarVariants}
//         animate={window.innerWidth <= 768 ? (expanded ? "expanded" : "collapsed") : ""}
//       >
//         {/* <div className="logo">
//           <img src="/favicon.ico" alt="logo" />
//           <span>
//             <i>Title</i>
//           </span>
//         </div> */}

//         <div className="menu">
//           {SidebarData.map((item, index) => (
//             <Link
//               to={item.link}
//               key={index}
//               className={
//                 location.pathname === item.link ? "menuItem active" : "menuItem"
//               }
//             >
//               <item.icon />
//               <span>{t(item.heading)}</span>
//             </Link>
//           ))}

//           {/* <div className="menuItem language-toggle-container">
//             <div
//               className={`language-toggle ${isUrdu ? "urdu" : "english"}`}
//               onClick={handleLanguageToggle}
//             >
//               <span className={`toggle-option ${!isUrdu ? "active_tog" : ""}`}>
//                 en
//               </span>
//               <span className={`toggle-option ${isUrdu ? "active_tog" : ""}`}>
//                 ur
//               </span>
//               <div className="toggle-slider"></div>
//             </div>
//           </div> */}

//           {/* <div className="menuItem" onClick={handleLogout}>
//             <UilSignOutAlt />
//           </div> */}
//         </div>
//       </motion.div>
//     </>
//   );
// };

// export default Sidebar;