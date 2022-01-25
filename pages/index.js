import dynamic from "next/dynamic";

const DynamicHomeWithNoSSR = dynamic(() => import("../src/components/Home"), {
  ssr: false,
});

const Home = () => <DynamicHomeWithNoSSR />;

export default Home;
