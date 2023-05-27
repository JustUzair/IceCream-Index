import React from "react";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@mantine/core";
import { motion } from "framer-motion";
import { fadeInUp, routeAnimation, stagger } from "../utils/animations";
import coneA from "../public/images/iceconea.png";
import coneB from "../public/images/iceconeB.png";
const about = () => {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <motion.section
        variants={routeAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        className="section about"
        id="about"
      >
        <div className="about__container container grid">
          <div className="about__data">
            <h2 className="section__title about__title">
              About Ice-Cream <br /> Index{" "}
            </h2>
            <p className="about__description">
              This project was created during the Q1 Hackathon of 2023 hosted by
              Fantom. Our team identified a gap in the Fantom ecosystem - the
              absence of index tokens. After conducting thorough research, we
              developed a solution to address this need.
              <br />
              Our innovation provides a valuable contribution to the Fantom
              community by filling this gap and offering a new option for users.
              We are excited to share our project with others and look forward
              to its impact on the ecosystem.{" "}
            </p>

            <Button color="dark" radius="md" size="lg">
              See Devpost
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              position: "relative",
              flexGrow: 1,
              height: "512px",
              width: "512px",
            }}
          >
            <img
              src={coneA.src}
              alt=""
              className="about__img"
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                objectFit: "fill",
              }}
            />
            <img
              src={coneB.src}
              alt=""
              className="about__img"
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                objectFit: "fill",
              }}
            />
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default about;
