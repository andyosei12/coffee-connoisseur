//info: using Next/Router for routing capabilities
import { useRouter } from "next/router";
//info: Using Link component for navigation capabilities
import Link from "next/link";

const CoffeeStore = () => {
  const {
    query: { id },
  } = useRouter();

  return (
    <div>
      Coffee Store page {id}
      <Link href="/">
        <a>Back to home</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
