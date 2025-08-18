import useTitle from "../hooks/useTitle";

export default function Home() {
  useTitle("Home | FoodHive");

  return (
    <div>
      <h3>This is Home page</h3>
    </div>
  )
}
