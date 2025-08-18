import useTitle from "../hooks/useTitle";

const MyFoods = () => {
  useTitle("My Foods | FoodHive");

  return (
    <div>
      <h1>My Foods Page</h1>
    </div>
  );
};

export default MyFoods;
