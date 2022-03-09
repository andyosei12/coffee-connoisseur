//info: using Next/Router for routing capabilities
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
//info: Using Link component for navigation capabilities
import Link from "next/link";
import Image from "next/image";

// import coffeeStoreData from "../../data/coffee-store.json";
import Head from "next/head";

import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import Store from "../../store/store";
import { isEmpty } from "../../utils";

export async function getStaticProps({ params }) {
  const coffeeStoreData = await fetchCoffeeStores();
  const findCoffeeStore = coffeeStoreData.find(
    (data) => data.fsq_id.toString() === params.id
  );
  return {
    props: {
      coffeeStore: findCoffeeStore ? findCoffeeStore : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStoreData = await fetchCoffeeStores();
  const paths = coffeeStoreData.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.fsq_id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = ({ coffeeStore }) => {
  const {
    query: { id },
    isFallback,
  } = useRouter();

  const {
    state: { coffeeStores },
  } = useContext(Store);
  const [locationCoffeeStore, setLocationCoffeeStore] = useState(coffeeStore);

  useEffect(() => {
    if (isEmpty(coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStore = coffeeStores.find(
          (data) => data.fsq_id.toString() === id
        );
        setLocationCoffeeStore(findCoffeeStore);
      }
    }
  }, [id, coffeeStore, coffeeStores]);

  if (isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvoteButton = () => {
    console.log("handle upvote function");
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{locationCoffeeStore.name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>&#8592; Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{locationCoffeeStore.name}</h1>
          </div>
          <Image
            src={
              locationCoffeeStore.imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={locationCoffeeStore.name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt="icon"
            />
            <p className={styles.text}>
              {locationCoffeeStore.location?.formatted_address}
            </p>
          </div>
          {locationCoffeeStore.location?.neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="icon"
              />
              <p className={styles.text}>
                {locationCoffeeStore.location?.neighborhood}
              </p>
            </div>
          )}

          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="icon"
            />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
