import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Searchpage.css";
import { searchProduct } from "../api/product";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query")?.toLowerCase() || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    setLoading(true);
    setError(null);
    searchProduct(searchTerm)
      .then((data) => {
        // console.log(data);
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setError("Failed to load recommendations");
        setLoading(false);
      });
  }, [searchTerm]);

  const goToProduct = (item) => {
    navigate("/product", { state: item });
    // navigate(`/product/${item.id}`);
  };

  if (loading) {
    return <div className="loading">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }



  return (
    <div className="search-page">
      <div className="search-container">
        <h2>Search results for "{searchTerm}"</h2>
        <div className="search-results">
          {results.length > 0 ? (
            results.map((item, index) => (
              <div
                key={index}
                className="search-card"
                onClick={() => goToProduct(item)}
              >
                <div className="search-card-inner">
                  <div className="search-card-image">
                    <img src={item.images[0].image} alt={item.name} />
                  </div>
                  <div className="search-card-details">
                    <div className="search-card-name">{item.name}</div>
                    <div className="search-card-cost">{item.cost}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No matching products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
