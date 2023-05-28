import React from "react";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@mantine/core";
import { motion } from "framer-motion";
import { fadeInUp, routeAnimation, stagger } from "../utils/animations";

import Image from "next/image";
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
              About XSwap <br /> Index{" "}
            </h2>
            <p className="about__description">
              This project was created during the Web3athon 2023 on Hackerearth.
              Our team identified a gap in the Fantom ecosystem - the absence of
              index tokens. After conducting thorough research, we developed a
              solution to address this need.
              <br />
              Our innovation provides a valuable contribution to the XDC/XinFin
              community by filling this gap and offering a new option for users.
              We are excited to share our project with others and look forward
              to its impact on the ecosystem.{" "}
            </p>

            <Button color="dark" radius="md" size="lg">
              <Link href="https://github.com/JustUzair/XSwap-Index" passHref>
                View On Github
              </Link>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/iceconea.png"
              alt="ice-cream--cone"
              className="about__img"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "fill",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/iceconeb.png"
              alt="ice-cream--cone"
              className="about__img"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
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
