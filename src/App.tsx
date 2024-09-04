import { useState } from "react";
import Swipeable from "./components/swipeable";

function App() {
  const [items, setItems] = useState([
    {
      url: "https://images.pexels.com/photos/1561020/pexels-photo-1561020.jpeg",
      title: "teal white and pink paint",
      by: "Zaksheuskaya",
    },
    {
      url: "https://images.pexels.com/photos/673857/pexels-photo-673857.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "tilt shift lens photo of blue flowers",
      by: "Irina Iriser",
    },
    {
      url: "https://images.pexels.com/photos/1059823/pexels-photo-1059823.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "close up photo of parakeet",
      by: "Hans Martha",
    },
    {
      url: "https://images.pexels.com/photos/2911521/pexels-photo-2911521.jpeg?auto=compress&cs=tinysrgb&w=800",
      title: "pink black and yellow abstract painting",
      by: "Diana",
    },
    {
      url: "https://images.pexels.com/photos/1164985/pexels-photo-1164985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "close up photography of multicolored lights bokeh",
      by: "Artem Saranin",
    },
    {
      url: "https://images.pexels.com/photos/2860705/pexels-photo-2860705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      title: "Blue water",
      by: "Aaron Ulsh",
    },
  ]);

  const removeItem = () => setItems((prev) => prev.filter((_, i) => i != 0));
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="relative w-[300px] h-[420px]">
        <Swipeable onSwipeLeft={removeItem} onSwipeRight={removeItem}>
          {items.map((image) => (
            <div className="relative z-20 rounded-2xl overflow-hidden size-full">
              <img
                src={image.url}
                className="pointer-events-none select-none size-full"
              />
              <div className="bottom-0 absolute flex flex-col justify-center border-white/20 shadow-sm backdrop-blur-lg px-4 py-2 border-t w-full h-16 font-bold text-white">
                <div className="text-md truncate capitalize">{image.title}</div>
                <div className="flex gap-1 text-sm">
                  <span>by</span>
                  <span className="capitalize">{image.by}</span>
                </div>
              </div>
            </div>
          ))}
        </Swipeable>
      </div>
    </div>
  );
}

export default App;
