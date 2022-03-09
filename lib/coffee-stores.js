//initialize unsplash api
import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getListOfCoffeeStoresPhotos = async () => {
  const coffeePhotos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  const unsplashPhotosResults = coffeePhotos.response.results;
  const photos = unsplashPhotosResults.map((result) => result.urls["small"]);
  return photos;
};

export const fetchCoffeeStores = async (
  latlong = "6.700071,-1.630783",
  limit = 6
) => {
  const coffeeStoresPhotos = await getListOfCoffeeStoresPhotos();

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?query=coffee&ll=${latlong}&limit=${limit}`,
    options
  );
  const coffeeStoresData = await response.json();
  return coffeeStoresData.results.map((result, i) => {
    return {
      ...result,
      imgUrl: coffeeStoresPhotos[i],
    };
  });
};
