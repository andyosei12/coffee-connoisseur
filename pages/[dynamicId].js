import Head from "next/head";
import { useRouter } from "next/router";

const DynamicPage = () => {
  const router = useRouter();
  const {
    query: { dynamicId },
  } = router;
  return (
    <div>
      <Head>
        <title>{dynamicId}</title>
      </Head>
      Page {dynamicId}
    </div>
  );
};

export default DynamicPage;
