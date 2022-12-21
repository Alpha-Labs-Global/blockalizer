import React, { useEffect, useState, SyntheticEvent } from "react";
import placeHolder from "./media/square.png";
import logo from "./media/logo.png";
import "./collapsible.scss";
import Collapsible from "react-collapsible";

import "./App.css";
import Playground from "./components/Playground";

import visual from "./media/block-floater.png";

import {
  assign_sketch,
  load_colors,
  all_sketch_styles,
} from "./art-styles/helper";

interface ComponentProps {}

const App: React.FC<ComponentProps> = (props: ComponentProps) => {
  //Home, Search, Mint pages
  const [page, setPage] = useState("Home");

  useEffect(() => {
    //alert("here")
  });

  return (
    <div className="pageContainer">
      {page === "Home" && (
        <div className="contentContainer">
          <div className="view">
            {/*md:w-9/12*/}

            <div className="m-auto lg:w-full md:w-full sm:w-full break-words">
              <div className="m-auto lg:12/12 md:w-6/12 sm:w-9/12">
                <span className="block mb-8" onClick={() => {}}></span>
                <div className="lg:ml-5 md:ml-2 sm:ml-2 lg:w-full">
                  <div className="lg:w-6/12 md:w-6/12 sm:w-9/12">
                    <svg
                      viewBox="0 0 225 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        window.open("https://alphalabs.llc", "_blank");
                      }}
                    >
                      <path
                        d="M1.07386 16V8.36364H2.20739V9.55682H2.30682C2.46591 9.14915 2.72277 8.83262 3.07741 8.60724C3.43205 8.37855 3.85795 8.2642 4.35511 8.2642C4.8589 8.2642 5.27817 8.37855 5.61293 8.60724C5.95099 8.83262 6.21449 9.14915 6.40341 9.55682H6.48295C6.6785 9.16241 6.97183 8.84919 7.36293 8.61719C7.75403 8.38187 8.22301 8.2642 8.76989 8.2642C9.45265 8.2642 10.0111 8.47798 10.4453 8.90554C10.8795 9.32978 11.0966 9.991 11.0966 10.8892V16H9.9233V10.8892C9.9233 10.3258 9.76918 9.92306 9.46094 9.68111C9.1527 9.43916 8.78977 9.31818 8.37216 9.31818C7.83523 9.31818 7.41927 9.48059 7.12429 9.8054C6.82931 10.1269 6.68182 10.5346 6.68182 11.0284V16H5.48864V10.7699C5.48864 10.3357 5.34777 9.98603 5.06605 9.72088C4.78433 9.45241 4.4214 9.31818 3.97727 9.31818C3.67235 9.31818 3.38731 9.39938 3.12216 9.56179C2.86032 9.72419 2.6482 9.94957 2.4858 10.2379C2.3267 10.523 2.24716 10.8527 2.24716 11.2273V16H1.07386ZM15.489 16.179C15.0051 16.179 14.5659 16.0878 14.1715 15.9055C13.7771 15.7199 13.4639 15.4531 13.2319 15.1051C12.9999 14.7538 12.8839 14.3295 12.8839 13.8324C12.8839 13.3949 12.9701 13.0402 13.1424 12.7685C13.3147 12.4934 13.5451 12.2779 13.8335 12.1222C14.1218 11.9664 14.44 11.8504 14.788 11.7741C15.1393 11.6946 15.4923 11.6316 15.8469 11.5852C16.311 11.5256 16.6871 11.4808 16.9755 11.451C17.2672 11.4179 17.4793 11.3632 17.6119 11.2869C17.7478 11.2107 17.8157 11.0781 17.8157 10.8892V10.8494C17.8157 10.3589 17.6815 9.97775 17.413 9.70597C17.1478 9.43419 16.7451 9.2983 16.2049 9.2983C15.6448 9.2983 15.2056 9.42093 14.8874 9.66619C14.5692 9.91146 14.3455 10.1733 14.2163 10.4517L13.1026 10.054C13.3015 9.58996 13.5666 9.22869 13.8981 8.97017C14.2328 8.70833 14.5974 8.52604 14.9918 8.4233C15.3896 8.31723 15.7807 8.2642 16.1651 8.2642C16.4104 8.2642 16.6921 8.29403 17.0103 8.35369C17.3318 8.41004 17.6417 8.5277 17.94 8.70668C18.2416 8.88565 18.4918 9.15578 18.6907 9.51705C18.8896 9.87831 18.989 10.3622 18.989 10.9688V16H17.8157V14.9659H17.756C17.6765 15.1316 17.5439 15.3089 17.3583 15.4979C17.1727 15.6868 16.9258 15.8475 16.6175 15.9801C16.3093 16.1127 15.9331 16.179 15.489 16.179ZM15.668 15.125C16.132 15.125 16.5231 15.0339 16.8413 14.8516C17.1628 14.6693 17.4047 14.4339 17.5671 14.1456C17.7328 13.8572 17.8157 13.554 17.8157 13.2358V12.1619C17.766 12.2216 17.6566 12.2763 17.4876 12.326C17.3219 12.3724 17.1296 12.4138 16.9109 12.4503C16.6954 12.4834 16.485 12.5133 16.2795 12.5398C16.0773 12.563 15.9132 12.5829 15.7873 12.5994C15.4824 12.6392 15.1973 12.7038 14.9322 12.7933C14.6703 12.8795 14.4582 13.0104 14.2958 13.1861C14.1367 13.3584 14.0572 13.5937 14.0572 13.892C14.0572 14.2997 14.208 14.608 14.5096 14.8168C14.8145 15.0223 15.2006 15.125 15.668 15.125ZM24.014 16.1591C23.3777 16.1591 22.8159 15.9983 22.3287 15.6768C21.8414 15.352 21.4603 14.8946 21.1852 14.3047C20.9101 13.7114 20.7725 13.0104 20.7725 12.2017C20.7725 11.3996 20.9101 10.7036 21.1852 10.1136C21.4603 9.52367 21.8431 9.06794 22.3336 8.74645C22.8242 8.42495 23.3909 8.2642 24.0339 8.2642C24.5311 8.2642 24.9238 8.34706 25.2122 8.51278C25.5038 8.67519 25.7259 8.8608 25.8784 9.0696C26.0342 9.27509 26.1551 9.44413 26.2413 9.5767H26.3407V5.81818H27.514V16H26.3805V14.8267H26.2413C26.1551 14.9659 26.0325 15.1416 25.8734 15.3537C25.7143 15.5625 25.4873 15.7498 25.1923 15.9155C24.8973 16.0779 24.5046 16.1591 24.014 16.1591ZM24.1731 15.1051C24.6438 15.1051 25.0415 14.9825 25.3663 14.7372C25.6911 14.4886 25.938 14.1456 26.1071 13.7081C26.2761 13.2673 26.3606 12.7585 26.3606 12.1818C26.3606 11.6117 26.2778 11.1129 26.112 10.6854C25.9463 10.2545 25.7011 9.91974 25.3762 9.68111C25.0514 9.43916 24.6504 9.31818 24.1731 9.31818C23.676 9.31818 23.2617 9.44579 22.9302 9.70099C22.6021 9.95289 22.3552 10.2959 22.1895 10.7301C22.027 11.161 21.9458 11.6449 21.9458 12.1818C21.9458 12.7254 22.0287 13.2192 22.1944 13.6634C22.3635 14.1042 22.612 14.4555 22.9402 14.7173C23.2716 14.9759 23.6826 15.1051 24.1731 15.1051ZM33.0275 16.1591C32.2917 16.1591 31.657 15.9967 31.1234 15.6719C30.5931 15.3438 30.1838 14.8864 29.8954 14.2997C29.6104 13.7098 29.4679 13.0237 29.4679 12.2415C29.4679 11.4593 29.6104 10.7699 29.8954 10.1733C30.1838 9.57339 30.5848 9.10606 31.0985 8.77131C31.6156 8.43324 32.2188 8.2642 32.9082 8.2642C33.3059 8.2642 33.6987 8.33049 34.0865 8.46307C34.4743 8.59564 34.8272 8.81108 35.1454 9.10938C35.4636 9.40436 35.7172 9.79545 35.9061 10.2827C36.095 10.7699 36.1895 11.3698 36.1895 12.0824V12.5795H30.3031V11.5653H34.9963C34.9963 11.1345 34.9101 10.75 34.7377 10.4119C34.5687 10.0739 34.3268 9.80705 34.0119 9.61151C33.7003 9.41596 33.3324 9.31818 32.9082 9.31818C32.4409 9.31818 32.0365 9.43419 31.6951 9.66619C31.3571 9.89489 31.0969 10.1932 30.9146 10.5611C30.7323 10.929 30.6412 11.3234 30.6412 11.7443V12.4205C30.6412 12.9972 30.7406 13.486 30.9395 13.8871C31.1416 14.2848 31.4217 14.5881 31.7797 14.7969C32.1376 15.0024 32.5536 15.1051 33.0275 15.1051C33.3358 15.1051 33.6142 15.062 33.8627 14.9759C34.1146 14.8864 34.3317 14.7538 34.514 14.5781C34.6963 14.3991 34.8372 14.1771 34.9366 13.9119L36.0701 14.2301C35.9508 14.6146 35.7503 14.9527 35.4686 15.2443C35.1868 15.5327 34.8388 15.758 34.4245 15.9205C34.0102 16.0795 33.5446 16.1591 33.0275 16.1591ZM43.6419 16L41.3152 8.36364H42.5481L44.1987 14.2102H44.2782L45.9089 8.36364H47.1618L48.7725 14.1903H48.8521L50.5027 8.36364H51.7356L49.4089 16H48.2555L46.585 10.1335H46.4657L44.7953 16H43.6419ZM53.2868 16V8.36364H54.46V16H53.2868ZM53.8833 7.09091C53.6547 7.09091 53.4574 7.01302 53.2917 6.85724C53.1293 6.70147 53.0481 6.5142 53.0481 6.29545C53.0481 6.0767 53.1293 5.88944 53.2917 5.73366C53.4574 5.57789 53.6547 5.5 53.8833 5.5C54.112 5.5 54.3076 5.57789 54.47 5.73366C54.6357 5.88944 54.7186 6.0767 54.7186 6.29545C54.7186 6.5142 54.6357 6.70147 54.47 6.85724C54.3076 7.01302 54.112 7.09091 53.8833 7.09091ZM59.93 8.36364V9.35795H55.9727V8.36364H59.93ZM57.1261 6.53409H58.2994V13.8125C58.2994 14.1439 58.3474 14.3925 58.4435 14.5582C58.543 14.7206 58.6689 14.83 58.8214 14.8864C58.9772 14.9394 59.1412 14.9659 59.3136 14.9659C59.4428 14.9659 59.5489 14.9593 59.6317 14.946C59.7146 14.9295 59.7809 14.9162 59.8306 14.9062L60.0692 15.9602C59.9897 15.9901 59.8787 16.0199 59.7362 16.0497C59.5936 16.0829 59.413 16.0994 59.1942 16.0994C58.8628 16.0994 58.538 16.0282 58.2198 15.8857C57.9049 15.7431 57.6431 15.526 57.4343 15.2344C57.2288 14.9427 57.1261 14.5748 57.1261 14.1307V6.53409ZM63.0323 11.4062V16H61.859V5.81818H63.0323V9.55682H63.1317C63.3107 9.16241 63.5792 8.84919 63.9371 8.61719C64.2984 8.38187 64.779 8.2642 65.3789 8.2642C65.8993 8.2642 66.355 8.36861 66.7461 8.57741C67.1372 8.78291 67.4405 9.09943 67.6559 9.52699C67.8746 9.95123 67.984 10.4915 67.984 11.1477V16H66.8107V11.2273C66.8107 10.6207 66.6533 10.1518 66.3384 9.82031C66.0269 9.48556 65.5943 9.31818 65.0408 9.31818C64.6564 9.31818 64.3117 9.39938 64.0067 9.56179C63.7051 9.72419 63.4665 9.96117 63.2908 10.2727C63.1185 10.5843 63.0323 10.9621 63.0323 11.4062ZM80.1532 16.1591L75.0424 11.0483C74.6348 10.6406 74.363 10.1667 74.2271 9.62642C74.0945 9.08617 74.0962 8.54924 74.2321 8.01562C74.368 7.47869 74.6381 7.01136 75.0424 6.61364C75.4567 6.20597 75.929 5.93584 76.4593 5.80327C76.993 5.66738 77.5249 5.66738 78.0552 5.80327C78.5888 5.93916 79.0628 6.20928 79.4771 6.61364L80.1532 7.26989L80.8294 6.61364C81.247 6.20928 81.7209 5.93916 82.2512 5.80327C82.7815 5.66738 83.3118 5.66738 83.8422 5.80327C84.3758 5.93584 84.8497 6.20597 85.264 6.61364C85.6684 7.01136 85.9385 7.47869 86.0744 8.01562C86.2103 8.54924 86.2103 9.08617 86.0744 9.62642C85.9418 10.1667 85.6717 10.6406 85.264 11.0483L80.1532 16.1591ZM92.479 16V5.81818H93.6523V9.5767H93.7518C93.8379 9.44413 93.9573 9.27509 94.1097 9.0696C94.2655 8.8608 94.4876 8.67519 94.7759 8.51278C95.0676 8.34706 95.462 8.2642 95.9592 8.2642C96.6022 8.2642 97.1689 8.42495 97.6594 8.74645C98.15 9.06794 98.5328 9.52367 98.8079 10.1136C99.083 10.7036 99.2205 11.3996 99.2205 12.2017C99.2205 13.0104 99.083 13.7114 98.8079 14.3047C98.5328 14.8946 98.1516 15.352 97.6644 15.6768C97.1772 15.9983 96.6154 16.1591 95.979 16.1591C95.4885 16.1591 95.0958 16.0779 94.8008 15.9155C94.5058 15.7498 94.2788 15.5625 94.1197 15.3537C93.9606 15.1416 93.8379 14.9659 93.7518 14.8267H93.6126V16H92.479ZM93.6325 12.1818C93.6325 12.7585 93.717 13.2673 93.886 13.7081C94.055 14.1456 94.302 14.4886 94.6268 14.7372C94.9516 14.9825 95.3493 15.1051 95.82 15.1051C96.3105 15.1051 96.7198 14.9759 97.0479 14.7173C97.3794 14.4555 97.628 14.1042 97.7937 13.6634C97.9627 13.2192 98.0472 12.7254 98.0472 12.1818C98.0472 11.6449 97.9644 11.161 97.7987 10.7301C97.6362 10.2959 97.3893 9.95289 97.0579 9.70099C96.7298 9.44579 96.3171 9.31818 95.82 9.31818C95.3427 9.31818 94.9416 9.43916 94.6168 9.68111C94.292 9.91974 94.0468 10.2545 93.881 10.6854C93.7153 11.1129 93.6325 11.6117 93.6325 12.1818ZM101.498 18.8636C101.299 18.8636 101.121 18.8471 100.966 18.8139C100.81 18.7841 100.702 18.7543 100.642 18.7244L100.941 17.6903C101.226 17.7633 101.478 17.7898 101.696 17.7699C101.915 17.75 102.109 17.6522 102.278 17.4766C102.45 17.3042 102.608 17.0241 102.75 16.6364L102.969 16.0398L100.145 8.36364H101.418L103.526 14.4489H103.605L105.713 8.36364H106.986L103.745 17.1136C103.599 17.508 103.418 17.8345 103.203 18.093C102.987 18.3549 102.737 18.5488 102.452 18.6747C102.17 18.8007 101.852 18.8636 101.498 18.8636Z"
                        fill="#F0E9E0"
                      />
                      <path
                        d="M138.018 22.4177L126.961 0H136.957L147.347 20.3833C147.822 21.3141 147.146 22.4177 146.101 22.4177H138.018Z"
                        fill="#FFF7EE"
                      />
                      <path
                        d="M121.97 12.8406V9.66657H126.606V12.8406L130.178 20.2244C130.67 21.243 129.928 22.4261 128.797 22.4261H119.536C118.387 22.4261 117.646 21.209 118.173 20.1881L121.97 12.8406Z"
                        fill="#44DF79"
                      />
                      <path
                        d="M155.432 14.9086H153.536L156.988 5.10187H159.181L162.639 14.9086H160.742L158.123 7.11302H158.046L155.432 14.9086ZM155.494 11.0635H160.666V12.4905H155.494V11.0635Z"
                        fill="#FFF7EE"
                      />
                      <path
                        d="M165.587 5.10187V14.9086H163.854V5.10187H165.587Z"
                        fill="#FFF7EE"
                      />
                      <path
                        d="M167.37 17.6668V7.55356H169.074V8.76983H169.175C169.264 8.59106 169.39 8.40112 169.553 8.2C169.716 7.9957 169.936 7.82172 170.214 7.67806C170.492 7.53122 170.846 7.45779 171.277 7.45779C171.845 7.45779 172.358 7.60304 172.814 7.89354C173.274 8.18085 173.638 8.60702 173.906 9.17206C174.177 9.73391 174.313 10.4234 174.313 11.2407C174.313 12.0483 174.18 12.7347 173.915 13.2997C173.65 13.8648 173.29 14.2957 172.833 14.5926C172.377 14.8895 171.86 15.0379 171.282 15.0379C170.86 15.0379 170.511 14.9677 170.233 14.8272C169.955 14.6868 169.732 14.5176 169.563 14.3197C169.397 14.1185 169.267 13.9286 169.175 13.7498H169.103V17.6668H167.37ZM169.069 11.2311C169.069 11.7068 169.136 12.1234 169.271 12.4809C169.408 12.8384 169.604 13.1178 169.86 13.3189C170.118 13.5168 170.431 13.6158 170.798 13.6158C171.181 13.6158 171.502 13.5136 171.761 13.3093C172.019 13.1018 172.214 12.8193 172.345 12.4617C172.479 12.101 172.546 11.6908 172.546 11.2311C172.546 10.7746 172.48 10.3692 172.35 10.0148C172.219 9.66049 172.024 9.38275 171.765 9.18164C171.507 8.98052 171.184 8.87997 170.798 8.87997C170.428 8.87997 170.113 8.97733 169.855 9.17206C169.596 9.36679 169.4 9.63974 169.266 9.99089C169.135 10.342 169.069 10.7554 169.069 11.2311Z"
                        fill="#FFF7EE"
                      />
                      <path
                        d="M177.531 10.599V14.9086H175.797V5.10187H177.492V8.80335H177.579C177.751 8.38835 178.017 8.06114 178.378 7.82172C178.742 7.5791 179.205 7.45779 179.767 7.45779C180.278 7.45779 180.723 7.56473 181.103 7.77862C181.483 7.9925 181.776 8.30535 181.984 8.71716C182.195 9.12897 182.3 9.63175 182.3 10.2255V14.9086H180.567V10.4937C180.567 9.99887 180.439 9.6142 180.183 9.33966C179.931 9.06193 179.577 8.92306 179.12 8.92306C178.814 8.92306 178.539 8.9901 178.297 9.12418C178.057 9.25506 177.869 9.445 177.732 9.694C177.598 9.943 177.531 10.2447 177.531 10.599Z"
                        fill="#FFF7EE"
                      />
                      <path
                        d="M186.183 15.0571C185.717 15.0571 185.298 14.9741 184.924 14.8081C184.554 14.6389 184.26 14.3899 184.043 14.0611C183.829 13.7323 183.722 13.3269 183.722 12.8448C183.722 12.4298 183.799 12.0866 183.952 11.8153C184.105 11.5439 184.314 11.3269 184.579 11.1641C184.844 11.0013 185.143 10.8784 185.475 10.7954C185.81 10.7092 186.156 10.6469 186.514 10.6086C186.945 10.5639 187.294 10.524 187.562 10.4889C187.831 10.4506 188.025 10.3931 188.147 10.3165C188.271 10.2367 188.333 10.1138 188.333 9.94779V9.91906C188.333 9.55833 188.226 9.279 188.013 9.08108C187.799 8.88316 187.491 8.7842 187.088 8.7842C186.664 8.7842 186.327 8.87677 186.078 9.06193C185.832 9.24708 185.666 9.46575 185.58 9.71795L183.962 9.4881C184.089 9.04118 184.3 8.66768 184.594 8.3676C184.887 8.06433 185.246 7.83768 185.671 7.68764C186.096 7.53441 186.565 7.45779 187.079 7.45779C187.433 7.45779 187.786 7.49929 188.137 7.58229C188.488 7.66529 188.809 7.80256 189.1 7.9941C189.39 8.18245 189.623 8.43943 189.799 8.76504C189.977 9.09066 190.067 9.49768 190.067 9.9861V14.9086H188.4V13.8983H188.343C188.238 14.1026 188.089 14.2941 187.898 14.4729C187.709 14.6485 187.471 14.7905 187.184 14.8991C186.9 15.0044 186.566 15.0571 186.183 15.0571ZM186.634 13.7834C186.981 13.7834 187.283 13.7147 187.539 13.5774C187.794 13.437 187.99 13.2518 188.128 13.022C188.268 12.7921 188.338 12.5415 188.338 12.2702V11.4035C188.284 11.4482 188.191 11.4897 188.06 11.528C187.933 11.5663 187.789 11.5998 187.63 11.6285C187.47 11.6573 187.312 11.6828 187.155 11.7052C186.999 11.7275 186.863 11.7467 186.748 11.7626C186.49 11.7977 186.258 11.8552 186.054 11.935C185.85 12.0148 185.689 12.1265 185.57 12.2702C185.452 12.4107 185.393 12.5926 185.393 12.8161C185.393 13.1353 185.51 13.3763 185.743 13.5391C185.976 13.7019 186.273 13.7834 186.634 13.7834Z"
                        fill="#FFF7EE"
                      />
                      <path
                        d="M195.231 14.9086V5.10187H197.008V13.4194H201.327V14.9086H195.231Z"
                        fill="#FFF7EE"
                      />
                      <path
                        d="M204.909 15.0571C204.443 15.0571 204.023 14.9741 203.649 14.8081C203.279 14.6389 202.985 14.3899 202.768 14.0611C202.554 13.7323 202.447 13.3269 202.447 12.8448C202.447 12.4298 202.524 12.0866 202.677 11.8153C202.83 11.5439 203.04 11.3269 203.305 11.1641C203.57 11.0013 203.868 10.8784 204.2 10.7954C204.535 10.7092 204.882 10.6469 205.239 10.6086C205.67 10.5639 206.02 10.524 206.288 10.4889C206.556 10.4506 206.751 10.3931 206.872 10.3165C206.996 10.2367 207.059 10.1138 207.059 9.94779V9.91906C207.059 9.55833 206.952 9.279 206.738 9.08108C206.524 8.88316 206.216 8.7842 205.814 8.7842C205.389 8.7842 205.052 8.87677 204.803 9.06193C204.558 9.24708 204.392 9.46575 204.305 9.71795L202.687 9.4881C202.815 9.04118 203.025 8.66768 203.319 8.3676C203.613 8.06433 203.972 7.83768 204.396 7.68764C204.821 7.53441 205.29 7.45779 205.804 7.45779C206.158 7.45779 206.511 7.49929 206.862 7.58229C207.214 7.66529 207.534 7.80256 207.825 7.9941C208.115 8.18245 208.348 8.43943 208.524 8.76504C208.703 9.09066 208.792 9.49768 208.792 9.9861V14.9086H207.126V13.8983H207.068C206.963 14.1026 206.814 14.2941 206.623 14.4729C206.435 14.6485 206.197 14.7905 205.909 14.8991C205.625 15.0044 205.292 15.0571 204.909 15.0571ZM205.359 13.7834C205.707 13.7834 206.008 13.7147 206.264 13.5774C206.519 13.437 206.716 13.2518 206.853 13.022C206.993 12.7921 207.063 12.5415 207.063 12.2702V11.4035C207.009 11.4482 206.917 11.4897 206.786 11.528C206.658 11.5663 206.514 11.5998 206.355 11.6285C206.195 11.6573 206.037 11.6828 205.881 11.7052C205.724 11.7275 205.589 11.7467 205.474 11.7626C205.215 11.7977 204.984 11.8552 204.779 11.935C204.575 12.0148 204.414 12.1265 204.296 12.2702C204.178 12.4107 204.119 12.5926 204.119 12.8161C204.119 13.1353 204.235 13.3763 204.468 13.5391C204.701 13.7019 204.998 13.7834 205.359 13.7834Z"
                        fill="#FFF7EE"
                      />
                      <path
                        d="M210.612 14.9086V5.10187H212.345V8.76983H212.417C212.506 8.59106 212.632 8.40112 212.795 8.2C212.958 7.9957 213.178 7.82172 213.456 7.67806C213.734 7.53122 214.088 7.45779 214.519 7.45779C215.087 7.45779 215.6 7.60304 216.056 7.89354C216.516 8.18085 216.88 8.60702 217.148 9.17206C217.419 9.73391 217.555 10.4234 217.555 11.2407C217.555 12.0483 217.423 12.7347 217.158 13.2997C216.893 13.8648 216.532 14.2957 216.075 14.5926C215.619 14.8895 215.102 15.0379 214.524 15.0379C214.103 15.0379 213.753 14.9677 213.475 14.8272C213.198 14.6868 212.974 14.5176 212.805 14.3197C212.639 14.1185 212.51 13.9286 212.417 13.7498H212.316V14.9086H210.612ZM212.312 11.2311C212.312 11.7068 212.379 12.1234 212.513 12.4809C212.65 12.8384 212.846 13.1178 213.102 13.3189C213.36 13.5168 213.673 13.6158 214.04 13.6158C214.423 13.6158 214.744 13.5136 215.003 13.3093C215.261 13.1018 215.456 12.8193 215.587 12.4617C215.721 12.101 215.788 11.6908 215.788 11.2311C215.788 10.7746 215.723 10.3692 215.592 10.0148C215.461 9.66049 215.266 9.38275 215.008 9.18164C214.749 8.98052 214.427 8.87997 214.04 8.87997C213.67 8.87997 213.356 8.97733 213.097 9.17206C212.838 9.36679 212.642 9.63974 212.508 9.99089C212.377 10.342 212.312 10.7554 212.312 11.2311Z"
                        fill="#FFF7EE"
                      />
                      <path
                        d="M224.842 9.49768L223.262 9.67006C223.217 9.51045 223.139 9.36041 223.027 9.21995C222.918 9.07949 222.772 8.96616 222.587 8.87997C222.401 8.79377 222.175 8.75068 221.907 8.75068C221.546 8.75068 221.243 8.82889 220.997 8.98531C220.754 9.14174 220.634 9.34445 220.638 9.59345C220.634 9.80733 220.713 9.98131 220.872 10.1154C221.035 10.2495 221.303 10.3596 221.677 10.4458L222.931 10.7139C223.627 10.864 224.144 11.1018 224.483 11.4274C224.824 11.753 224.997 12.1792 225 12.7059C224.997 13.1688 224.861 13.5774 224.593 13.9318C224.328 14.2829 223.959 14.5575 223.487 14.7554C223.014 14.9533 222.472 15.0523 221.859 15.0523C220.958 15.0523 220.234 14.8639 219.685 14.4873C219.136 14.1074 218.808 13.579 218.703 12.9023L220.393 12.7395C220.47 13.0715 220.633 13.3221 220.882 13.4913C221.131 13.6604 221.455 13.745 221.854 13.745C222.266 13.745 222.596 13.6604 222.845 13.4913C223.097 13.3221 223.223 13.113 223.223 12.864C223.223 12.6533 223.142 12.4793 222.979 12.342C222.82 12.2048 222.571 12.0994 222.232 12.026L220.978 11.7626C220.272 11.6158 219.75 11.3684 219.412 11.0204C219.073 10.6693 218.906 10.2255 218.909 9.68922C218.906 9.23591 219.029 8.84325 219.278 8.51125C219.53 8.17606 219.879 7.91748 220.326 7.73552C220.776 7.55037 221.295 7.45779 221.883 7.45779C222.745 7.45779 223.423 7.64135 223.918 8.00847C224.416 8.37558 224.724 8.87199 224.842 9.49768Z"
                        fill="#FFF7EE"
                      />
                    </svg>
                  </div>
                </div>
                <span
                  className="block lg:mb-16 md:mb-10 sm:mb-10"
                  onClick={() => {}}
                ></span>

                {/*<h1 className="lg:text-7xl md:text-4xl sm:text-3xl pt-8"><span className="text-emerald-400 lg:text-7xl md:text-5xl sm:text-4xl float-left" >|</span>*/}
                <div className="w-11/12 lg:ml-5 md:ml-2 sm:ml-2">
                  <svg
                    viewBox="0 0 513 107"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect y="11" width="4" height="88" fill="#ADFFD8" />
                    <path
                      d="M32.104 75.384H36.424V36.216H32.104V30.6H52.48C54.88 30.6 56.992 30.936 58.816 31.608C60.688 32.28 62.248 33.192 63.496 34.344C64.792 35.496 65.752 36.888 66.376 38.52C67.048 40.104 67.384 41.832 67.384 43.704V44.568C67.384 45.96 67.168 47.232 66.736 48.384C66.304 49.536 65.704 50.568 64.936 51.48C64.168 52.392 63.256 53.184 62.2 53.856C61.192 54.48 60.088 54.96 58.888 55.296V56.16C61.288 56.832 63.304 58.128 64.936 60.048C66.568 61.92 67.384 64.224 67.384 66.96V67.824C67.384 69.696 67.048 71.448 66.376 73.08C65.752 74.664 64.792 76.056 63.496 77.256C62.248 78.408 60.688 79.32 58.816 79.992C56.992 80.664 54.88 81 52.48 81H32.104V75.384ZM42.472 75.384H52.048C54.88 75.384 57.184 74.688 58.96 73.296C60.736 71.856 61.624 69.888 61.624 67.392V66.96C61.624 64.368 60.784 62.328 59.104 60.84C57.424 59.304 55.144 58.536 52.264 58.536H42.472V75.384ZM42.472 52.92H52.264C55.144 52.92 57.424 52.176 59.104 50.688C60.784 49.2 61.624 47.16 61.624 44.568V44.136C61.624 41.688 60.736 39.768 58.96 38.376C57.184 36.936 54.88 36.216 52.048 36.216H42.472V52.92ZM78.3499 75.816H91.3099V35.784H78.7819V30.6H96.9259V75.816H109.886V81H78.3499V75.816ZM156.132 63.576C156.132 66.552 155.628 69.192 154.62 71.496C153.66 73.752 152.364 75.672 150.732 77.256C149.1 78.792 147.18 79.968 144.972 80.784C142.812 81.6 140.556 82.008 138.204 82.008C135.804 82.008 133.524 81.6 131.364 80.784C129.204 79.968 127.308 78.792 125.676 77.256C124.044 75.672 122.724 73.752 121.716 71.496C120.756 69.192 120.276 66.552 120.276 63.576V62.712C120.276 59.784 120.756 57.192 121.716 54.936C122.724 52.632 124.044 50.688 125.676 49.104C127.356 47.52 129.276 46.32 131.436 45.504C133.596 44.688 135.852 44.28 138.204 44.28C140.556 44.28 142.812 44.688 144.972 45.504C147.132 46.32 149.028 47.52 150.66 49.104C152.34 50.688 153.66 52.632 154.62 54.936C155.628 57.192 156.132 59.784 156.132 62.712V63.576ZM138.204 76.68C139.932 76.68 141.516 76.392 142.956 75.816C144.444 75.192 145.74 74.304 146.844 73.152C147.948 72 148.812 70.632 149.436 69.048C150.06 67.416 150.372 65.592 150.372 63.576V62.712C150.372 60.792 150.06 59.04 149.436 57.456C148.812 55.824 147.948 54.432 146.844 53.28C145.74 52.128 144.444 51.24 142.956 50.616C141.468 49.944 139.884 49.608 138.204 49.608C136.524 49.608 134.94 49.944 133.452 50.616C131.964 51.24 130.668 52.128 129.564 53.28C128.46 54.432 127.596 55.824 126.972 57.456C126.348 59.04 126.036 60.792 126.036 62.712V63.576C126.036 65.592 126.348 67.416 126.972 69.048C127.596 70.632 128.46 72 129.564 73.152C130.668 74.304 131.94 75.192 133.38 75.816C134.868 76.392 136.476 76.68 138.204 76.68ZM199.93 68.328C199.546 70.296 198.874 72.12 197.914 73.8C197.002 75.48 195.826 76.944 194.386 78.192C192.946 79.392 191.266 80.328 189.346 81C187.426 81.672 185.29 82.008 182.938 82.008C180.442 82.008 178.066 81.6 175.81 80.784C173.602 79.968 171.658 78.792 169.978 77.256C168.298 75.672 166.954 73.752 165.946 71.496C164.986 69.24 164.506 66.648 164.506 63.72V62.856C164.506 59.976 164.986 57.384 165.946 55.08C166.954 52.776 168.298 50.832 169.978 49.248C171.658 47.664 173.602 46.44 175.81 45.576C178.066 44.712 180.442 44.28 182.938 44.28C185.194 44.28 187.282 44.616 189.202 45.288C191.122 45.96 192.802 46.92 194.242 48.168C195.73 49.368 196.93 50.808 197.842 52.488C198.802 54.168 199.45 55.992 199.786 57.96L194.17 59.256C194.026 58.008 193.666 56.808 193.09 55.656C192.562 54.456 191.818 53.424 190.858 52.56C189.946 51.648 188.818 50.928 187.474 50.4C186.13 49.872 184.57 49.608 182.794 49.608C181.066 49.608 179.434 49.944 177.898 50.616C176.41 51.24 175.09 52.152 173.938 53.352C172.786 54.504 171.874 55.896 171.202 57.528C170.578 59.16 170.266 60.936 170.266 62.856V63.72C170.266 65.736 170.578 67.56 171.202 69.192C171.874 70.776 172.786 72.12 173.938 73.224C175.09 74.328 176.434 75.192 177.97 75.816C179.506 76.392 181.162 76.68 182.938 76.68C184.714 76.68 186.25 76.416 187.546 75.888C188.89 75.312 190.018 74.592 190.93 73.728C191.89 72.816 192.634 71.784 193.162 70.632C193.738 69.48 194.122 68.28 194.314 67.032L199.93 68.328ZM219.824 60.12H221.048L234.656 45.288H241.568V45.72L226.736 62.064V63.36L243.296 80.568V81H236.384L221.192 65.304H219.824V81H214.208V30.6H219.824V60.12ZM280.614 74.952H279.75C278.598 77.352 276.99 79.128 274.926 80.28C272.91 81.432 270.774 82.008 268.518 82.008C266.166 82.008 263.982 81.624 261.966 80.856C259.95 80.04 258.174 78.864 256.638 77.328C255.15 75.744 253.974 73.824 253.11 71.568C252.246 69.312 251.814 66.696 251.814 63.72V62.568C251.814 59.64 252.246 57.048 253.11 54.792C253.974 52.536 255.15 50.64 256.638 49.104C258.174 47.52 259.95 46.32 261.966 45.504C263.982 44.688 266.118 44.28 268.374 44.28C270.822 44.28 273.03 44.832 274.998 45.936C277.014 46.992 278.598 48.648 279.75 50.904H280.614V45.288H286.23V73.656C286.23 75.096 286.878 75.816 288.174 75.816H289.974V81H286.158C284.526 81 283.182 80.472 282.126 79.416C281.118 78.36 280.614 77.016 280.614 75.384V74.952ZM269.094 76.68C270.774 76.68 272.31 76.368 273.702 75.744C275.142 75.12 276.366 74.232 277.374 73.08C278.382 71.928 279.174 70.56 279.75 68.976C280.326 67.344 280.614 65.544 280.614 63.576V62.712C280.614 60.792 280.326 59.04 279.75 57.456C279.174 55.824 278.358 54.432 277.302 53.28C276.294 52.128 275.07 51.24 273.63 50.616C272.238 49.944 270.726 49.608 269.094 49.608C267.414 49.608 265.878 49.92 264.486 50.544C263.094 51.168 261.87 52.056 260.814 53.208C259.806 54.312 259.014 55.68 258.438 57.312C257.862 58.896 257.574 60.648 257.574 62.568V63.72C257.574 67.8 258.63 70.992 260.742 73.296C262.902 75.552 265.686 76.68 269.094 76.68ZM298.78 75.816H311.74V35.784H299.212V30.6H317.356V75.816H330.316V81H298.78V75.816ZM353.954 34.632C353.954 33.24 354.434 32.064 355.394 31.104C356.402 30.096 357.602 29.592 358.994 29.592C360.386 29.592 361.562 30.096 362.522 31.104C363.53 32.064 364.034 33.24 364.034 34.632C364.034 36.024 363.53 37.224 362.522 38.232C361.562 39.192 360.386 39.672 358.994 39.672C357.602 39.672 356.402 39.192 355.394 38.232C354.434 37.224 353.954 36.024 353.954 34.632ZM343.73 75.816H356.258V50.472H345.026V45.288H361.874V75.816H373.538V81H343.73V75.816ZM435.141 64.872C435.285 68.424 436.389 71.28 438.453 73.44C440.517 75.6 443.397 76.68 447.093 76.68C448.773 76.68 450.237 76.488 451.485 76.104C452.733 75.72 453.789 75.192 454.653 74.52C455.565 73.848 456.285 73.08 456.813 72.216C457.389 71.304 457.845 70.344 458.181 69.336L463.509 70.776C462.501 74.088 460.629 76.8 457.893 78.912C455.205 80.976 451.557 82.008 446.949 82.008C444.405 82.008 442.053 81.576 439.893 80.712C437.781 79.8 435.957 78.528 434.421 76.896C432.885 75.264 431.685 73.32 430.821 71.064C429.957 68.808 429.525 66.312 429.525 63.576V61.848C429.525 59.352 429.957 57.024 430.821 54.864C431.733 52.704 432.981 50.856 434.565 49.32C436.149 47.736 437.997 46.512 440.109 45.648C442.269 44.736 444.597 44.28 447.093 44.28C450.021 44.28 452.541 44.832 454.653 45.936C456.813 46.992 458.565 48.312 459.909 49.896C461.301 51.48 462.309 53.208 462.933 55.08C463.605 56.952 463.941 58.68 463.941 60.264V64.872H435.141ZM447.093 49.608C445.509 49.608 444.021 49.872 442.629 50.4C441.285 50.88 440.085 51.576 439.029 52.488C438.021 53.4 437.181 54.48 436.509 55.728C435.885 56.928 435.477 58.248 435.285 59.688H458.325C458.229 58.152 457.845 56.76 457.173 55.512C456.549 54.264 455.709 53.208 454.653 52.344C453.645 51.48 452.469 50.808 451.125 50.328C449.829 49.848 448.485 49.608 447.093 49.608ZM473.107 45.288H486.067V50.04H486.931C487.843 48.072 489.139 46.632 490.819 45.72C492.499 44.76 494.419 44.28 496.579 44.28C500.179 44.28 503.083 45.456 505.291 47.808C507.499 50.16 508.675 53.592 508.819 58.104L502.915 58.968C502.915 55.656 502.123 53.28 500.539 51.84C498.955 50.352 497.011 49.608 494.707 49.608C493.219 49.608 491.923 49.896 490.819 50.472C489.763 51.048 488.875 51.84 488.155 52.848C487.435 53.856 486.907 55.032 486.571 56.376C486.235 57.72 486.067 59.16 486.067 60.696V75.816H495.139V81H472.243V75.816H480.451V50.472H473.107V45.288Z"
                      fill="white"
                    />
                    <rect
                      x="387.5"
                      y="48.5"
                      width="30"
                      height="30"
                      stroke="white"
                      stroke-width="5"
                    />
                    <path
                      d="M416.5 49.5L388.5 77.5"
                      stroke="white"
                      stroke-width="5"
                    />
                  </svg>
                </div>

                <span className="block mb-4" onClick={() => {}}></span>
                <p className="lg:text-lg md:text-sm sm:text-sm text-neutral-500 lg:ml-12 md:ml-8 sm:ml-6">
                  {" "}
                  {/*lg:text-2xl md:text-xl sm:text-md">*/}
                  Blockchain transaction hash art processor
                  <br></br>
                  <span className="block mb-4" onClick={() => {}}></span>
                  Turn your past transactions into a tokenized memento
                </p>
                <span className="block mb-5"></span>
                <span className="block mb-4"></span>

                <div className="lg:ml-12 md:ml-8 sm:ml-6 w-9/12">
                  <svg
                    viewBox="0 0 216 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="lg:hidden md:hidden sm:inline-block"
                  >
                    <path d="M0 20H215" stroke="#B6FFCF" />
                    <path d="M195 1L214.5 20.5L195 40" stroke="#B6FFCF" />
                  </svg>
                </div>

                <p
                  className="lg:text-2xl md:text-xl sm:text-lg lg:ml-12 md:ml-8 sm:ml-6 "
                  onClick={(e) => {
                    setPage("Search");
                  }}
                >
                  Try it out&nbsp;
                  {/*<div className="h-0.5 mb-1.5 w-5/12 bg-emerald-400 inline-block text-emerald-400">
                                
                    </div>*/}
                  <svg
                    viewBox="0 0 216 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="lg:inline-block md:inline-block sm:hidden w-6/12"
                  >
                    <path d="M0 20H215" stroke="#B6FFCF" />
                    <path d="M195 1L214.5 20.5L195 40" stroke="#B6FFCF" />
                  </svg>
                </p>
                <br></br>
                <span className="block mb-5"></span>
                <Collapsible trigger="&nbsp;&nbsp;What">
                  <p>
                    Blockalizer is a platform designed for users to own pieces
                    of the blockchain that mean something to them. Maybe you
                    bought your ENS name at block 1234, or minted your first
                    Cool Cat at block 5678. Own the blocks that mean something
                    to you.
                  </p>
                </Collapsible>
                <Collapsible trigger="&nbsp;&nbsp;Why">
                  <p>
                    Blockalizer is a platform designed for users to own pieces
                    of the blockchain that mean something to them. Maybe you
                    bought your ENS name at block 1234, or minted your first
                    Cool Cat at block 5678. Own the blocks that mean something
                    to you.
                  </p>
                </Collapsible>
                <Collapsible trigger="&nbsp;&nbsp;How">
                  <p>
                    Blockalizer is a platform designed for users to own pieces
                    of the blockchain that mean something to them. Maybe you
                    bought your ENS name at block 1234, or minted your first
                    Cool Cat at block 5678. Own the blocks that mean something
                    to you.
                  </p>
                </Collapsible>

                <div className="m-auto w-12/12 mt-6 lg:hidden md:inline-block sm:inline-block md:ml-9 sm:ml-9">
                  <h1 className="lg:text-md md:text-md sm:text-md">
                    Latest Minted Block
                  </h1>
                  <span className="block mb-3"></span>
                  <h1 className="lg:text-sm md:text-sm sm:text-sm text-neutral-500">
                    #12345 | 3 hours ago
                  </h1>
                  <span className="block mb-2"></span>
                  <img src={placeHolder} className="m-auto w-full"></img>
                </div>

                <span className="block mb-10"></span>
                <h1 className="lg:mb-auto lg:mt-auto lg:text-left lg:bg-transparent lg:ml-0 lg:pl-7 lg:mb-6 md:mb-20 sm:mb-20 md:text-center sm:text-center md:bg-zinc-800 sm:bg-zinc-800 md:pt-2 md:pb-2 sm:pt-2 sm:pb-2 lg:block md:hiden sm:hidden">
                  FAQ&nbsp;&nbsp;&nbsp;Twitter&nbsp;&nbsp;&nbsp;Other&nbsp;&nbsp;&nbsp;
                  <span
                    onClick={(e) => {
                      setPage("Sandbox");
                    }}
                  >
                    Sandbox
                  </span>
                </h1>
              </div>
              <h1 className="lg:mb-auto lg:mt-auto lg:text-left lg:bg-transparent lg:ml-20 lg:pl-10 lg:mb-6 md:mb-20 sm:mb-20 md:text-center sm:text-center md:bg-zinc-800 sm:bg-zinc-800 md:pt-2 md:pb-2 sm:pt-2 sm:pb-2 lg:hidden md:block sm:block">
                FAQ&nbsp;&nbsp;&nbsp;Twitter&nbsp;&nbsp;&nbsp;Other&nbsp;&nbsp;&nbsp;
                <span
                  onClick={(e) => {
                    setPage("Sandbox");
                  }}
                >
                  Sandbox
                </span>
              </h1>
              <span className="block mb-5"></span>
            </div>
          </div>

          <div className="visualizer">
            <div className="m-auto w-6/12">
              <h1 className="lg:text-xl md:text-lg sm:text-md">
                Latest Minted Block
              </h1>
              <span className="block mb-3"></span>
              <h1 className="lg:text-sm md:text-sm sm:text-sm text-neutral-500">
                #12345 | 3 hours ago
              </h1>
              <span className="block mb-2"></span>
              <img src={placeHolder} className="w-full"></img>
            </div>
          </div>
        </div>
      )}

      {page === "Search" && (
        <div className="contentContainer">
          <div className="searchView">
            {/*md:w-9/12*/}

            <div className="m-auto lg:w-3/12 md:w-6/12 sm:w-9/12 break-words">
              <p
                className="lg:text-lg md:text-md sm:text-sm"
                onClick={() => {
                  setPage("Home");
                }}
              >
                &lt; back
              </p>
              <span className="block mb-5"></span>
              <h1 className="lg:text-5xl md:text-4xl sm:text-2xl">
                Enter Block #
              </h1>
              <p className="lg:text-3xl md:text-2xl sm:text-xl">
                <i>Ex: Block 1234</i>
                <br></br>
                <p className="lg:text-2xl md:text-xl sm:text-lg">Available</p>
                <span className="block mb-5"></span>

                <input
                  type="text"
                  id="first_name"
                  className="lg:w-9/12 bg-transparent border-2 border-emerald-400 text-white lg:text-lg md:text-md sm:text-sm rounded-lg block w-full p-2.5"
                  placeholder=""
                  required
                ></input>
              </p>
              <span className="block mb-5"></span>
              <button
                className="bg-emerald-400 hover:bg-white hover:bg-opacity-70 text-black font-bold py-2 px-4 rounded"
                onClick={() => {
                  setPage("Mint");
                }}
              >
                Blockalize
              </button>
            </div>
          </div>
        </div>
      )}

      {page === "Mint" && (
        <div className="contentContainer">
          <div className="searchView">
            {/*md:w-9/12*/}

            <div className="m-auto lg:w-3/12 md:w-6/12 sm:w-9/12 break-words">
              <p
                className="lg:text-lg md:text-md sm:text-sm"
                onClick={() => {
                  setPage("Search");
                }}
              >
                &lt; back
              </p>
              <span className="block mb-5"></span>
              <p className="lg:text-2xl md:text-xl sm:text-lg">Block #1234</p>
              <span className="block mb-5"></span>

              <div className="bg-white border-emerald-400 block w-full p-2.5 ">
                <img src="https://cdn.shopify.com/s/files/1/0020/9508/7671/products/MTO0295-Classic-Uniform-Squares-Blue-Glass-Mosaic-Tile_a.jpg?v=1532699262"></img>
              </div>
              <span className="block mb-5"></span>

              <div className="flex">
                <button
                  type="submit"
                  className="m-auto bg-emerald-400  text-white p-2 rounded lg:text-lg md:text-md sm:text-sm w-5/12"
                >
                  Mint | 0.01E
                </button>
                <button
                  type="submit"
                  className="m-auto bg-gray-400 text-white p-2 ml-6 rounded lg:text-lg md:text-md sm:text-sm w-5/12"
                >
                  Random Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "Sandbox" && <Playground></Playground>}
    </div>
  );
};

export default App;
