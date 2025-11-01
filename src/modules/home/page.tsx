import Body from "../shared/ui/Body";

function Heading() {
  return (
    <div className="flex justify-between gap-16">
      <div className="space-y-4">
        <p className="text-lg">
          We are a family owned
          <br />
          Mediterranean restaurant, focused on traditionnal recipes served with
          a modern twist.
        </p>
        <button
          type="button"
          className="px-6 py-2 font-bold bg-yellow-400 text-black rounded-md"
        >
          Reserve a table
        </button>
      </div>
      <div className="size-48 rounded-md overflow-hidden">
        <img
          src="/hero.jpg"
          alt="woman bring sausage"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

const dishesCategories = [
  "Lunch",
  "Mains",
  "Desserts",
  "A la carte",
  "Starters",
  "Drinks",
];

const dishes = [
  {
    name: "Greek Salad",
    description:
      "The famous greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.",
    price: "$12.99",
    image: "/greek-salad.jpg",
  },
  {
    name: "Bruschetta",
    description:
      "Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.",
    price: "$5.99",
    image: "/bruschetta.jpg",
  },
  {
    name: "Grilled Fish",
    description:
      "Served with lemon and vegetables, our grilled fish is a delicious and healthy option.",
    price: "$15.99",
    image: "/grilled-fish.jpg",
  },
];

export function HomePage() {
  return (
    <Body heading={Heading}>
      <div className="p-4">
        <h2 className="font-bold text-xl">ORDER FOR DELIVERY!</h2>
        {/* Categories */}
        <div className="flex gap-4 mt-4 overflow-x-auto pb-4">
          {dishesCategories.map((category) => (
            <button className="px-4 py-2 rounded-md bg-gray-200/60 text-black whitespace-nowrap">
              {category}
            </button>
          ))}
        </div>
        {/* Dishes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {dishes.map((dish) => (
            <div className="bg-gray-100/60 border border-gray-200 rounded-md overflow-hidden flex">
              <div className="p-4 space-y-2 w-2/3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">{dish.name}</h3>
                  <span className="text-yellow-400 font-semibold">
                    {dish.price}
                  </span>
                </div>
                <p className="text-sm line-clamp-3">{dish.description}</p>
              </div>
              <div className="w-1/3 aspect-square overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Body>
  );
}
