import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import useTrackLocation from "../hooks/use-track-location";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import Store, { ACTION_TYPES } from "../store/store";
import styles from "../styles/Home.module.css";

//info: exporting getStaticProps
//* This is a server side code and won't be included on the client side
export async function getStaticProps() {
  const coffeeStoresData = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores: coffeeStoresData,
    }, //will be passed to the page component as props
  };
}

export default function Home({ coffeeStores }) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(Store);
  const { coffeeStores: locationSpecificCoffeeStores, latLong } = state;

  useEffect(() => {
    async function fetchCoffeeStoresData() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
          );
          const coffeeStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          });
          setCoffeeStoresError(null);
        } catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    }
    fetchCoffeeStoresData();
  }, [latLong, dispatch]);

  const handleOnClickBannerBtn = () => {
    handleTrackLocation();
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
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnClickBannerBtn}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}

        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="banner image"
          />
        </div>
        {locationSpecificCoffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {locationSpecificCoffeeStores.map((data) => (
                <Card
                  key={data.fsq_id}
                  name={data.name}
                  imgUrl={
                    data.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${data.fsq_id}`}
                />
              ))}
            </div>
          </div>
        )}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Kumasi Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((data) => (
                <Card
                  key={data.fsq_id}
                  name={data.name}
                  imgUrl={
                    data.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${data.fsq_id}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
