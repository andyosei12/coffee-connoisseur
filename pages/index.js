import Head from "next/head";
import Image from "next/image";
import Banner from "../components/Banner";
import styles from "../styles/Home.module.css";

export default function Home() {
  const handleOnClickBannerBtn = () => {
    console.log("button clicked");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Find coffee shop near you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText="View stores nearby"
          handleOnClick={handleOnClickBannerBtn}
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="banner image"
          />
        </div>
      </main>
    </div>
  );
}
