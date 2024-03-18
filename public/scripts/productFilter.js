// Function to handle button click event and filter products by category
function filterProduct(category) {
  // Make an AJAX request to the server to filter products by category
  fetch(`/api/products/category/${category}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(products => {
      // Handle the response, update the UI with filtered products
      console.log(products); // For testing, you can log the products to the console
      // Update the UI with filtered products, e.g., display them in a list
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    });
}
