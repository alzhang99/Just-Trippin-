/*eslint-disable*/
import React from "react";
import TextLoop from "react-text-loop";

// reactstrap components
import { Container } from "reactstrap";
// core components

function IndexHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/home.jpg") + ")"
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div className="content-center brand">
            {/* <img
              alt="..."
              className="n-logo"
              src={require("assets/img/now-logo.png")}
            ></img> */}
            <h1 className="h1-seo" style={{fontWeight: 700, fontSize: "400%"}}>TRIPPIN'</h1>
            <p><b>
              come{"  "}
                <TextLoop interval={[850, 850, 3100]}>
                  <span> explore </span>
                  <span>discover</span>
                  <span style={{fontWeight: 700}}>travel</span>
                </TextLoop>{"  "}
                 with us.
            </b></p>
          </div>
          {/* <h6 className="category category-absolute">
            Designed by{" "}
            <a href="http://invisionapp.com/?ref=creativetim" target="_blank">
              <img
                alt="..."
                className="invision-logo"
                src={require("assets/img/invision-white-slim.png")}
              ></img>
            </a>
            . Coded by{" "}
            <a
              href="https://www.creative-tim.com?ref=nukr-index-header"
              target="_blank"
            >
              <img
                alt="..."
                className="creative-tim-logo"
                src={require("assets/img/creative-tim-white-slim2.png")}
              ></img>
            </a>
            .
          </h6> */}
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;