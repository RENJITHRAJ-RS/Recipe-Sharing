import "./Indexpage.css";

export default function Indexpage() {
  return (
    
    <>
    
      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">🍳 Recipe Sharing</div>
        <nav>
          <a href="/">Home</a>
          
          <a href="/login">Login</a>
          <a href="/register" >Register</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Discover & Share <br /> Delicious Recipes
          </h1>
          <p>Find the best recipes from our community of food lovers.</p>

          <div className="search-box">
            <input placeholder="Search for recipes..." />
            <button>Search</button>
          </div>

          <button className="join-btn">Join Now</button>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1604908177522-402bdfb6cddc"
            alt="Food"
          />
        </div>
      </section>

      {/* FEATURED */}
      <section className="section">
        <h2>Featured Recipes</h2>

        <div className="card-grid">
          {featured.map((r, i) => (
            <RecipeCard key={i} {...r} />
          ))}
        </div>

        <p className="view-all">View All Recipes →</p>
      </section>

      {/* POPULAR */}
      <section className="section">
        <h2>Most Popular Recipes</h2>

        <div className="card-grid">
          {popular.map((r, i) => (
            <RecipeCard key={i} {...r} />
          ))}
        </div>

        <button className="share-btn">Share Your Recipe</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <h4>About</h4>
          <p>About Us</p>
          <p>Blog</p>
          <p>Help</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>Support</p>
          <p>Terms</p>
          <p>Privacy Policy</p>
        </div>
      </footer>
    </>
  );
}

function RecipeCard({ title, author, views, img }) {
  return (
    <div className="card">
      <img src={img} alt={title} />
      <div className="card-body">
        <h3>{title}</h3>
        <p>{author}</p>
        <span>👁 {views} views</span>
      </div>
    </div>
  );
}

const featured = [
  {
    title: "Spaghetti Carbonara",
    author: "Sarah Lee",
    views: "1.2k",
    img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
  },
  {
    title: "Grilled Chicken Salad",
    author: "John Doe",
    views: "950",
    img: "https://images.unsplash.com/photo-1605475128023-384e70c76e97",
  },
  {
    title: "Chocolate Chip Cookies",
    author: "Emily R.",
    views: "850",
    img: "https://images.unsplash.com/photo-1599785209707-28f01dbed7e6",
  },
  {
    title: "Creamy Tomato Pasta",
    author: "James K.",
    views: "740",
    img: "https://images.unsplash.com/photo-1601050690597-8c7c5c9efc9d",
  },
];

const popular = [
  {
    title: "Margherita Pizza",
    author: "ChefMario",
    views: "1.2k",
    img: "https://images.unsplash.com/photo-1601924582975-4aa7c5c6c9d3",
  },
  {
    title: "Beef Tacos",
    author: "FoodieBen",
    views: "980",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
  },
  {
    title: "Blueberry Pancakes",
    author: "Laura C.",
    views: "850",
    img: "https://images.unsplash.com/photo-1587738347117-41df2f4f05a8",
  },
  {
    title: "Chicken Stir Fry",
    author: "Mark T.",
    views: "740",
    img: "https://images.unsplash.com/photo-1605475127948-7897b9ccde67",
  },
];
